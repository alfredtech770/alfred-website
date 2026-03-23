//
//  WellnessView.swift
//  Alfred App
//
//  Wellness category view — spas, treatments, fitness, beauty.
//  Unified design: header with capsule, 420pt featured carousel,
//  filter bar, list cards.
//

import SwiftUI

// MARK: - Wellness Data Model

struct WellnessVenue: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let subtitle: String
    let category: String       // Spa, Hammam, Yoga, Fitness, Beauty, Massage
    let vibe: String           // Luxury, Relaxing, Energising, Holistic, Romantic
    let duration: String       // 60 min, 90 min, Half Day, Full Day
    let priceLevel: String     // €, €€, €€€, €€€€
    let rating: Double
    let reviews: Int
    let imageURL: String
    let displayTag: String?
    let available: Bool

    static func == (lhs: WellnessVenue, rhs: WellnessVenue) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}

// MARK: - Sample Data

private let wellnessFeaturedList: [WellnessVenue] = [
    WellnessVenue(
        name: "Cheval Blanc Spa",
        subtitle: "Dior treatments · 1st arr.",
        category: "Spa",
        vibe: "Luxury",
        duration: "Half Day",
        priceLevel: "€€€€",
        rating: 4.9, reviews: 47,
        imageURL: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
        displayTag: "ALFRED PICK",
        available: true
    ),
    WellnessVenue(
        name: "Molitor Spa by Clarins",
        subtitle: "Pool & Spa · 16th arr.",
        category: "Spa",
        vibe: "Relaxing",
        duration: "Full Day",
        priceLevel: "€€€",
        rating: 4.7, reviews: 63,
        imageURL: "https://images.unsplash.com/photo-1540555700478-4be289fbec6f?w=800&q=80",
        displayTag: "POPULAR",
        available: true
    ),
    WellnessVenue(
        name: "Hammam Medina Centre",
        subtitle: "Traditional Hammam · 5th arr.",
        category: "Hammam",
        vibe: "Holistic",
        duration: "90 min",
        priceLevel: "€€",
        rating: 4.6, reviews: 89,
        imageURL: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80",
        displayTag: "TRENDING",
        available: true
    ),
    WellnessVenue(
        name: "Le Tigre Yoga",
        subtitle: "Hatha & Vinyasa · Le Marais",
        category: "Yoga",
        vibe: "Holistic",
        duration: "60 min",
        priceLevel: "€€",
        rating: 4.8, reviews: 34,
        imageURL: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
        displayTag: nil,
        available: true
    ),
]

private let wellnessAllList: [WellnessVenue] = wellnessFeaturedList + [
    WellnessVenue(
        name: "Ken Club",
        subtitle: "Premium Fitness · 16th arr.",
        category: "Fitness",
        vibe: "Energising",
        duration: "Full Day",
        priceLevel: "€€€€",
        rating: 4.8, reviews: 22,
        imageURL: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
        displayTag: nil,
        available: true
    ),
    WellnessVenue(
        name: "Carita Maison de Beauté",
        subtitle: "Facial & Skincare · 8th arr.",
        category: "Beauty",
        vibe: "Luxury",
        duration: "90 min",
        priceLevel: "€€€",
        rating: 4.7, reviews: 41,
        imageURL: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
        displayTag: nil,
        available: true
    ),
    WellnessVenue(
        name: "Royal Monceau Spa",
        subtitle: "Deep Tissue · 8th arr.",
        category: "Massage",
        vibe: "Luxury",
        duration: "60 min",
        priceLevel: "€€€€",
        rating: 4.9, reviews: 18,
        imageURL: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
        displayTag: nil,
        available: true
    ),
    WellnessVenue(
        name: "Ritz Club Paris",
        subtitle: "Pool, Gym & Spa · 1st arr.",
        category: "Fitness",
        vibe: "Luxury",
        duration: "Full Day",
        priceLevel: "€€€€",
        rating: 4.9, reviews: 15,
        imageURL: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
        displayTag: nil,
        available: false
    ),
]

// MARK: - Wellness Item (wrapper for navigation)

struct WellnessItem: Identifiable, Hashable {
    let experience: Experience
    var id: UUID { experience.id }

    static func == (lhs: WellnessItem, rhs: WellnessItem) -> Bool {
        lhs.experience.id == rhs.experience.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(experience.id)
    }
}

// MARK: - Wellness Detail View

struct WellnessDetailView: View {
    let wellness: Experience

    var body: some View {
        ExperienceDetailView(experience: wellness)
    }
}

// MARK: - WellnessVenue convenience init from live model

extension WellnessVenue {
    init(from w: Wellness) {
        self.init(
            name: w.name,
            subtitle: w.subtitle,
            category: w.type ?? w.category,
            vibe: w.mood ?? "Luxury",
            duration: w.duration ?? "–",
            priceLevel: w.priceLevelDisplay,
            rating: w.rating ?? 4.5,
            reviews: 0,
            imageURL: w.heroImageURL ?? "",
            displayTag: w.displayTag,
            available: w.isActive ?? true
        )
    }
}

// MARK: - WellnessView

struct WellnessView: View {
    @Binding var selectedCity: String
    @Binding var isFilterVisible: Bool
    var externalNavigationPath: Binding<NavigationPath>? = nil

    @Environment(\.dismiss) private var dismiss
    @State private var isSearchActive = false
    @State private var searchText = ""
    @FocusState private var isSearchFocused: Bool

    // Filter state
    @State private var selectedCategory: Set<String> = []
    @State private var selectedVibeFilter: Set<String> = []
    @State private var selectedDuration: Set<String> = []
    @State private var selectedPriceLevel: Set<String> = []
    @State private var showingFilterSheet = false
    @State private var activeFilterType: WellnessFilterType? = nil

    // Data state
    @State private var featuredWellness: [Wellness] = []
    @State private var allWellness: [Wellness] = []
    @State private var isLoading = true
    private let wellnessService = WellnessService()

    enum WellnessFilterType {
        case category, vibe, duration, price
    }

    let filterCategories = ["Treatment", "Vibe", "Duration", "Price"]

    // MARK: - Filter Pills for CategoryPageView

    private var wellnessFilterPills: [CategoryFilterPill] {
        filterCategories.map { cat in
            let ft = WellnessFilterType(rawValue: filterCategories.firstIndex(of: cat) ?? 0)
            let count = filterCount(for: ft)
            return CategoryFilterPill(id: cat, label: cat, icon: wellnessFilterIcon(cat), isActive: count > 0)
        }
    }

    private func wellnessFilterIcon(_ category: String) -> String {
        switch category {
        case "Treatment": return "sparkles"
        case "Vibe":      return "heart"
        case "Duration":  return "clock"
        case "Price":     return "eurosign"
        default:          return "line.3.horizontal.decrease"
        }
    }

    private func filterCount(for type: WellnessFilterType?) -> Int {
        guard let type = type else { return 0 }
        switch type {
        case .category: return selectedCategory.count
        case .vibe:     return selectedVibeFilter.count
        case .duration: return selectedDuration.count
        case .price:    return selectedPriceLevel.count
        }
    }

    private var hasActiveFilters: Bool {
        !selectedCategory.isEmpty || !selectedVibeFilter.isEmpty || !selectedDuration.isEmpty || !selectedPriceLevel.isEmpty
    }

    private var filteredVenues: [Wellness] {
        var venues = allWellness

        if !searchText.isEmpty {
            let q = searchText.lowercased().trimmingCharacters(in: .whitespaces)
            venues = venues.filter {
                $0.name.lowercased().contains(q) ||
                ($0.type ?? "").lowercased().contains(q) ||
                $0.category.lowercased().contains(q) ||
                ($0.mood ?? "").lowercased().contains(q)
            }
        }

        if !selectedCategory.isEmpty {
            venues = venues.filter { selectedCategory.contains($0.type ?? $0.category) }
        }
        if !selectedVibeFilter.isEmpty {
            venues = venues.filter { selectedVibeFilter.contains($0.mood ?? "") }
        }
        if !selectedDuration.isEmpty {
            venues = venues.filter { selectedDuration.contains($0.duration ?? "") }
        }
        if !selectedPriceLevel.isEmpty {
            // "€" → 1, "€€" → 2, etc.
            let levelInts = selectedPriceLevel.map { $0.count }
            venues = venues.filter { levelInts.contains($0.priceLevel ?? 0) }
        }

        return venues
    }

    // Detail state
    @State private var selectedWellness: Wellness? = nil

    // MARK: - Body

    var body: some View {
        ZStack {
            CategoryPageView(
                title: "Wellness",
                city: selectedCity,
                featuredItems: featuredWellness.prefix(4).map { CategoryHeroData(wellness: $0) },
                isLoading: isLoading,
                filterPills: wellnessFilterPills,
                onFilterTap: { id in
                    activeFilterType = WellnessFilterType(rawValue: filterCategories.firstIndex(of: id) ?? 0)
                    showingFilterSheet = true
                },
                onTapFeatured: { idx in
                    guard idx < featuredWellness.count else { return }
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                    selectedWellness = featuredWellness[idx]
                }
            ) {
                // Active filters
                if hasActiveFilters {
                    WellnessActiveFiltersView(
                        selectedCategory: $selectedCategory,
                        selectedVibe: $selectedVibeFilter,
                        selectedDuration: $selectedDuration,
                        selectedPriceLevel: $selectedPriceLevel
                    )
                    .padding(.horizontal, 20)
                    .padding(.bottom, 16)
                }

                // Wellness venue list
                wellnessListSection
            }

            if isSearchActive {
                wellnessSearchOverlay
                    .transition(.asymmetric(
                        insertion: .opacity.combined(with: .scale(scale: 0.97, anchor: .top)).combined(with: .offset(y: -8)),
                        removal: .opacity.combined(with: .scale(scale: 0.98, anchor: .top))
                    ))
            }
        }
        .toolbar(.hidden, for: .navigationBar)
        .navigationBarBackButtonHidden(true)
        .sheet(isPresented: $showingFilterSheet) {
            if let ft = activeFilterType {
                WellnessFilterBottomSheet(
                    filterType: ft,
                    selectedCategory: $selectedCategory,
                    selectedVibe: $selectedVibeFilter,
                    selectedDuration: $selectedDuration,
                    selectedPriceLevel: $selectedPriceLevel,
                    isPresented: $showingFilterSheet
                )
            }
        }
        .fullScreenCover(item: $selectedWellness) { w in
            WellnessVenueDetailView(venue: WellnessVenue(from: w))
        }
        .task(id: selectedCity) {
            await loadWellness()
        }
    }

    // MARK: - Data Loading

    @MainActor
    private func loadWellness() async {
        isLoading = true
        defer { isLoading = false }
        do {
            async let featured = wellnessService.getFeaturedWellness(city: selectedCity.isEmpty ? nil : selectedCity)
            async let all     = wellnessService.getWellness(city: selectedCity.isEmpty ? nil : selectedCity)
            (featuredWellness, allWellness) = try await (featured, all)
        } catch {
            #if DEBUG
            print("❌ WellnessView loadWellness: \(error)")
            #endif
        }
    }

    // MARK: - List Section

    @ViewBuilder
    private var wellnessListSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("All Wellness")
                .font(.system(size: 22, weight: .bold))
                .foregroundStyle(A.s1)
                .padding(.horizontal, 20)

            if filteredVenues.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "heart")
                        .font(.system(size: 32, weight: .light))
                        .foregroundColor(A.s6)
                    Text("No matching venues")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(A.s5)
                }
                .padding(.top, 40)
                .frame(maxWidth: .infinity)
            } else {
                LazyVStack(spacing: 14) {
                    ForEach(filteredVenues) { venue in
                        WellnessVenueCard(wellness: venue, onTap: {
                            selectedWellness = venue
                        })
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 120)
            }
        }
    }

    // MARK: - Search Overlay

    private var wellnessSearchOverlay: some View {
        ZStack(alignment: .top) {
            A.bg.opacity(0.6)
                .ignoresSafeArea()
                .onTapGesture { dismissSearch() }
            VStack(spacing: 0) {
                HStack(spacing: 12) {
                    HStack(spacing: 10) {
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 16, weight: .light))
                            .foregroundColor(A.s6)
                        TextField("Search wellness...", text: $searchText)
                            .font(.system(size: 14))
                            .foregroundColor(A.s1)
                            .focused($isSearchFocused)
                            .submitLabel(.search)
                            .autocorrectionDisabled()
                        if !searchText.isEmpty {
                            Button {
                                searchText = ""
                                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .font(.system(size: 16, weight: .light))
                                    .foregroundColor(A.s6)
                            }
                        }
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 12)
                    .background(A.el)
                    .cornerRadius(14)
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(A.bd, lineWidth: 0.5))
                    Button("Cancel") { dismissSearch() }
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(A.s5)
                }
                .padding(.horizontal, 16)
                .padding(.top, 16)
                .padding(.bottom, 12)
                .background(A.bg)
            }
        }
    }

    private func dismissSearch() {
        isSearchFocused = false
        withAnimation(.spring(response: 0.35, dampingFraction: 0.92)) {
            isSearchActive = false
        }
        searchText = ""
    }
}

// MARK: - Wellness Venue Card

private struct WellnessVenueCard: View {
    let wellness: Wellness
    var onTap: (() -> Void)? = nil

    var body: some View {
        AlfredLandscapeCard(wellness: wellness) {
            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
            onTap?()
        }
    }
}

// MARK: - Wellness Featured Carousel

private struct WellnessFeaturedCarousel: View {
    let venues: [WellnessVenue]

    @State private var currentIndex: Int = 0
    @State private var progresses: [Double] = []
    @State private var slideTimer: Timer?
    @State private var progTimer: Timer?
    private let autoAdvanceInterval: TimeInterval = 4.5
    private var progStep: Double { 1.0 / (autoAdvanceInterval / 0.033) }

    var body: some View {
        VStack(spacing: 6) {
            ZStack {
                ForEach(Array(venues.enumerated()), id: \.element.id) { index, venue in
                    wellnessHeroSlide(venue)
                        .opacity(index == currentIndex ? 1 : 0)
                        .animation(.easeInOut(duration: 0.6), value: currentIndex)
                }
            }
            .frame(height: 420)
            .clipShape(RoundedRectangle(cornerRadius: 18))
            .overlay(RoundedRectangle(cornerRadius: 18).stroke(A.s1.opacity(0.08), lineWidth: 0.5))
            .gesture(
                DragGesture(minimumDistance: 20)
                    .onEnded { val in
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        if val.translation.width < -40 {
                            advance(to: (currentIndex + 1) % venues.count)
                        } else if val.translation.width > 40 {
                            advance(to: (currentIndex - 1 + venues.count) % venues.count)
                        }
                    }
            )
            .onTapGesture {
                UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                openWhatsApp(message: "Hi Alfred, I'd like to book: \(venues[currentIndex].name)")
            }

            // Progress bars
            HStack(spacing: 4) {
                ForEach(0..<venues.count, id: \.self) { i in
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            Capsule().fill(A.s1.opacity(0.10)).frame(height: 2.5)
                            Capsule()
                                .fill(A.s1)
                                .frame(
                                    width: geo.size.width * CGFloat(
                                        i < currentIndex ? 1.0 :
                                        i > currentIndex ? 0.0 :
                                        (i < progresses.count ? progresses[i] : 0)
                                    ),
                                    height: 2.5
                                )
                        }
                    }
                    .frame(height: 2.5)
                    .onTapGesture { advance(to: i) }
                }
            }
            .padding(.horizontal, 2)
        }
        .padding(.horizontal, 20)
        .onAppear {
            progresses = Array(repeating: 0, count: venues.count)
            startTimers()
        }
        .onDisappear { stopTimers() }
    }

    private func wellnessHeroSlide(_ venue: WellnessVenue) -> some View {
        VStack {
            Spacer()

            VStack(alignment: .leading, spacing: 0) {
                // Badge
                HStack(spacing: 6) {
                    Circle()
                        .fill(A.gn)
                        .frame(width: 5, height: 5)
                    Text(venue.displayTag ?? venue.category)
                        .font(.sf(11, weight: .semibold))
                        .foregroundStyle(A.gold)
                    Spacer()
                }
                .padding(.bottom, 10)

                // Name
                Text(venue.name)
                    .font(.sf(24, weight: .bold))
                    .foregroundStyle(A.s1)
                    .shadow(color: A.bg.opacity(0.5), radius: 12, y: 2)
                    .lineLimit(1)

                // Subtitle
                HStack(spacing: 6) {
                    Text(venue.category)
                    Text("·")
                    Text(venue.subtitle.components(separatedBy: " · ").last ?? "Paris")
                }
                .font(.sf(13))
                .foregroundStyle(A.s4)
                .padding(.top, 6)

                // Bottom info row
                HStack(spacing: 0) {
                    HStack(spacing: 10) {
                        ZStack {
                            RoundedRectangle(cornerRadius: 10)
                                .fill(A.s1.opacity(0.08))
                                .frame(width: 34, height: 34)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(A.s1.opacity(0.08), lineWidth: 0.5)
                                )
                            Image(systemName: "heart.fill")
                                .font(.system(size: 14, weight: .light))
                                .foregroundStyle(A.s5)
                        }

                        VStack(alignment: .leading, spacing: 2) {
                            Text(venue.duration)
                                .font(.sf(12, weight: .medium))
                                .foregroundStyle(A.s4)
                            HStack(spacing: 3) {
                                Image(systemName: "star.fill")
                                    .font(.system(size: 9, weight: .light))
                                    .foregroundStyle(.yellow)
                                Text(String(format: "%.1f", venue.rating))
                                    .font(.sf(12, weight: .medium))
                                    .foregroundStyle(A.s4)
                                Text("· \(venue.priceLevel)")
                                    .font(.sf(12))
                                    .foregroundStyle(A.s5)
                            }
                        }
                    }

                    Spacer()

                    HStack(spacing: 5) {
                        Image(systemName: "calendar")
                            .font(.system(size: 11, weight: .light))
                        Text("Book")
                            .font(.sf(12, weight: .medium))
                    }
                    .foregroundStyle(A.s2)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(A.s1.opacity(0.08))
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(A.s1.opacity(0.10), lineWidth: 0.5))
                }
                .padding(.top, 14)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 16)
        }
        .frame(height: 420)
        .frame(maxWidth: .infinity)
        .background(
            ZStack {
                A.el
                AsyncImage(url: URL(string: venue.imageURL)) { phase in
                    switch phase {
                    case .success(let img):
                        img.resizable().aspectRatio(contentMode: .fill)
                    case .empty:
                        ShimmerView()
                    default:
                        A.el
                    }
                }
                LinearGradient(
                    stops: [
                        .init(color: .clear, location: 0.20),
                        .init(color: A.bg.opacity(0.4), location: 0.45),
                        .init(color: A.bg.opacity(0.88), location: 0.65),
                        .init(color: A.bg.opacity(0.97), location: 1.0)
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
            }
        )
        .clipped()
    }

    private func startTimers() {
        stopTimers()
        slideTimer = Timer.scheduledTimer(withTimeInterval: autoAdvanceInterval, repeats: true) { _ in
            DispatchQueue.main.async {
                let next = (currentIndex + 1) % max(1, venues.count)
                withAnimation { currentIndex = next }
                resetProgress(for: next)
            }
        }
        progTimer = Timer.scheduledTimer(withTimeInterval: 0.033, repeats: true) { _ in
            DispatchQueue.main.async {
                guard currentIndex < progresses.count else { return }
                if progresses[currentIndex] < 1.0 {
                    progresses[currentIndex] = min(progresses[currentIndex] + progStep, 1.0)
                }
            }
        }
    }

    private func stopTimers() {
        slideTimer?.invalidate(); slideTimer = nil
        progTimer?.invalidate(); progTimer = nil
    }

    private func advance(to i: Int) {
        withAnimation { currentIndex = i }
        resetProgress(for: i)
        startTimers()
    }

    private func resetProgress(for i: Int) {
        for j in 0..<progresses.count {
            progresses[j] = j < i ? 1.0 : 0.0
        }
    }
}

// MARK: - Wellness Filter Bar

extension WellnessView.WellnessFilterType {
    init?(rawValue: Int) {
        switch rawValue {
        case 0: self = .category
        case 1: self = .vibe
        case 2: self = .duration
        case 3: self = .price
        default: return nil
        }
    }
}

struct WellnessFilterBarView: View {
    let filterCategories: [String]
    @Binding var selectedCategory: Set<String>
    @Binding var selectedVibe: Set<String>
    @Binding var selectedDuration: Set<String>
    @Binding var selectedPriceLevel: Set<String>
    @Binding var showingFilterSheet: Bool
    @Binding var activeFilterType: WellnessView.WellnessFilterType?

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(Array(filterCategories.enumerated()), id: \.offset) { index, category in
                    let filterType = WellnessView.WellnessFilterType(rawValue: index)
                    let count = getFilterCount(for: filterType)

                    WellnessFilterCategoryChip(title: category, count: count, isActive: count > 0) {
                        activeFilterType = filterType
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                            showingFilterSheet = true
                        }
                        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                    }
                }
            }
        }
        .sheet(isPresented: $showingFilterSheet) {
            if let ft = activeFilterType {
                WellnessFilterBottomSheet(
                    filterType: ft,
                    selectedCategory: $selectedCategory,
                    selectedVibe: $selectedVibe,
                    selectedDuration: $selectedDuration,
                    selectedPriceLevel: $selectedPriceLevel,
                    isPresented: $showingFilterSheet
                )
            }
        }
    }

    private func getFilterCount(for type: WellnessView.WellnessFilterType?) -> Int {
        guard let type = type else { return 0 }
        switch type {
        case .category: return selectedCategory.count
        case .vibe: return selectedVibe.count
        case .duration: return selectedDuration.count
        case .price: return selectedPriceLevel.count
        }
    }
}

struct WellnessFilterCategoryChip: View {
    let title: String
    let count: Int
    let isActive: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(isActive ? A.s1 : A.s5)
                if count > 0 {
                    Text("\(count)")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(A.gold)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Capsule().fill(A.activeFilterBg))
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(A.el)
            .cornerRadius(16)
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(isActive ? A.bd : A.bd, lineWidth: 0.5))
        }
        .buttonStyle(AlfredScaleButtonStyle())
    }
}

// MARK: - Wellness Filter Bottom Sheet

struct WellnessFilterBottomSheet: View {
    let filterType: WellnessView.WellnessFilterType
    @Binding var selectedCategory: Set<String>
    @Binding var selectedVibe: Set<String>
    @Binding var selectedDuration: Set<String>
    @Binding var selectedPriceLevel: Set<String>
    @Binding var isPresented: Bool

    @State private var tempSelection: Set<String> = []
    @State private var hasChanges = false

    private var title: String {
        switch filterType {
        case .category: return "Treatment Type"
        case .vibe: return "Select Vibe"
        case .duration: return "Duration"
        case .price: return "Price Range"
        }
    }

    private var options: [(String, String)] {
        switch filterType {
        case .category: return [
            ("🧖", "Spa"),
            ("🛁", "Hammam"),
            ("🧘", "Yoga"),
            ("💆", "Massage"),
            ("💪", "Fitness"),
            ("✨", "Beauty")
        ]
        case .vibe: return [
            ("👑", "Luxury"),
            ("😌", "Relaxing"),
            ("⚡", "Energising"),
            ("🌿", "Holistic"),
            ("💕", "Romantic")
        ]
        case .duration: return [
            ("⏱️", "60 min"),
            ("🕐", "90 min"),
            ("🌤️", "Half Day"),
            ("☀️", "Full Day")
        ]
        case .price: return [
            ("💵", "€"),
            ("💰", "€€"),
            ("💎", "€€€"),
            ("👑", "€€€€")
        ]
        }
    }

    private var sheetDetentHeight: CGFloat {
        UIScreen.main.bounds.height * 0.4
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button {
                    withAnimation { tempSelection.removeAll(); hasChanges = true }
                    UIImpactFeedbackGenerator(style: .light).impactOccurred()
                } label: {
                    Text(tempSelection.isEmpty ? "" : "Clear")
                        .font(.system(size: 14))
                        .foregroundColor(A.s5)
                }
                .frame(width: 60, alignment: .leading)
                Spacer()
                Text(title)
                    .font(.system(size: 17, weight: .bold))
                    .foregroundStyle(A.s1)
                Spacer()
                Button {
                    applyFilters()
                    isPresented = false
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                } label: {
                    Text("Done")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(A.s1)
                }
                .frame(width: 60, alignment: .trailing)
            }
            .padding(.horizontal, 20)
            .padding(.top, 40)
            .padding(.bottom, 16)

            ScrollView {
                VStack(spacing: 8) {
                    ForEach(options, id: \.1) { emoji, option in
                        Button {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                if tempSelection.contains(option) {
                                    tempSelection.remove(option)
                                } else {
                                    tempSelection.insert(option)
                                }
                                hasChanges = tempSelection != currentSelection
                            }
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        } label: {
                            HStack(spacing: 14) {
                                Text(emoji)
                                    .font(.system(size: 22, weight: .light))
                                    .frame(width: 36)
                                Text(option)
                                    .font(.system(size: 14, weight: tempSelection.contains(option) ? .semibold : .regular))
                                    .foregroundColor(tempSelection.contains(option) ? A.s1 : A.s1)
                                Spacer()
                                ZStack {
                                    Circle()
                                        .stroke(tempSelection.contains(option) ? Color.clear : A.bd, lineWidth: 2)
                                        .frame(width: 24, height: 24)
                                    if tempSelection.contains(option) {
                                        Circle()
                                            .fill(A.bg)
                                            .frame(width: 24, height: 24)
                                        Image(systemName: "checkmark")
                                            .font(.system(size: 12, weight: .bold))
                                            .foregroundColor(A.s1)
                                    }
                                }
                            }
                            .padding(.horizontal, 18)
                            .padding(.vertical, 14)
                            .background(
                                RoundedRectangle(cornerRadius: 14)
                                    .fill(tempSelection.contains(option) ? A.activeFilterBg : A.el)
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 14)
                                    .stroke(tempSelection.contains(option) ? Color.clear : A.bd, lineWidth: 0.5)
                            )
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 4)
                .padding(.bottom, 24)
            }
        }
        .background(A.srf)
        .presentationBackground(A.srf)
        .presentationDetents([.height(sheetDetentHeight)])
        .presentationDragIndicator(.visible)
        .presentationCornerRadius(24)
        .onAppear { tempSelection = currentSelection }
    }

    private var currentSelection: Set<String> {
        switch filterType {
        case .category: return selectedCategory
        case .vibe: return selectedVibe
        case .duration: return selectedDuration
        case .price: return selectedPriceLevel
        }
    }

    private func applyFilters() {
        switch filterType {
        case .category: selectedCategory = tempSelection
        case .vibe: selectedVibe = tempSelection
        case .duration: selectedDuration = tempSelection
        case .price: selectedPriceLevel = tempSelection
        }
    }
}

// MARK: - Wellness Active Filters View

struct WellnessActiveFiltersView: View {
    @Binding var selectedCategory: Set<String>
    @Binding var selectedVibe: Set<String>
    @Binding var selectedDuration: Set<String>
    @Binding var selectedPriceLevel: Set<String>

    private var allFilters: [(String, Binding<Set<String>>)] {
        var filters: [(String, Binding<Set<String>>)] = []
        selectedCategory.forEach { filters.append(($0, $selectedCategory)) }
        selectedVibe.forEach { filters.append(($0, $selectedVibe)) }
        selectedDuration.forEach { filters.append(($0, $selectedDuration)) }
        selectedPriceLevel.forEach { filters.append(($0, $selectedPriceLevel)) }
        return filters
    }

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(allFilters.indices, id: \.self) { index in
                    let (filter, binding) = allFilters[index]
                    WellnessActiveFilterChip(title: filter) {
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                            binding.wrappedValue.remove(filter)
                        }
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                    }
                }
            }
        }
    }
}

struct WellnessActiveFilterChip: View {
    let title: String
    let onRemove: () -> Void

    var body: some View {
        HStack(spacing: 6) {
            Text(title)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(A.s1)
            Button(action: onRemove) {
                Image(systemName: "xmark")
                    .font(.system(size: 9, weight: .light))
                    .foregroundColor(A.s5)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(A.el)
        .cornerRadius(16)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(A.bd, lineWidth: 0.5))
    }
}

// MARK: - Wellness Venue Detail View

struct WellnessVenueDetailView: View {
    let venue: WellnessVenue
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    // Hero image
                    ZStack(alignment: .top) {
                        AsyncImage(url: URL(string: venue.imageURL)) { phase in
                            switch phase {
                            case .success(let img):
                                img.resizable().aspectRatio(contentMode: .fill)
                            default:
                                A.srf
                            }
                        }
                        .frame(height: 320)
                        .clipped()

                        LinearGradient(
                            stops: [
                                .init(color: A.bg.opacity(0.5), location: 0),
                                .init(color: .clear, location: 0.3),
                                .init(color: .clear, location: 0.6),
                                .init(color: A.bg.opacity(0.8), location: 1.0)
                            ],
                            startPoint: .top, endPoint: .bottom
                        )

                        // Back button
                        HStack {
                            Button(action: { dismiss() }) {
                                ZStack {
                                    Circle()
                                        .fill(.ultraThinMaterial)
                                        .frame(width: 40, height: 40)
                                    Image(systemName: "chevron.left")
                                        .font(.system(size: 16, weight: .light))
                                        .foregroundStyle(A.s1)
                                }
                            }
                            Spacer()
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 60)

                        // Title overlay
                        VStack(alignment: .leading, spacing: 8) {
                            Spacer()
                            if let tag = venue.displayTag {
                                Text(tag)
                                    .font(.system(size: 11, weight: .semibold))
                                    .foregroundStyle(A.gold)
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 4)
                                    .background(Capsule().fill(A.activeFilterBg))
                            }
                            Text(venue.name)
                                .font(.system(size: 28, weight: .bold))
                                .foregroundStyle(A.s1)
                            Text(venue.subtitle)
                                .font(.system(size: 14))
                                .foregroundStyle(A.s1.opacity(0.7))
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, 20)
                        .padding(.bottom, 20)
                    }
                    .frame(height: 320)

                    // Info section
                    VStack(alignment: .leading, spacing: 36) {
                        // Quick facts
                        HStack(spacing: 0) {
                            wellnessQuickFact(icon: "clock", title: venue.duration, subtitle: "Duration")
                            wellnessQuickFact(icon: "star.fill", title: String(format: "%.1f", venue.rating), subtitle: "\(venue.reviews) reviews")
                            wellnessQuickFact(icon: "tag", title: venue.priceLevel, subtitle: "Price")
                        }
                        .padding(.vertical, 18)
                        .background(A.el)
                        .clipShape(RoundedRectangle(cornerRadius: 18))
                        .overlay(RoundedRectangle(cornerRadius: 18).stroke(A.bd, lineWidth: 0.5))

                        // Category & Vibe
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Details")
                                .font(.system(size: 22, weight: .bold))
                                .foregroundStyle(A.s1)
                            HStack(spacing: 8) {
                                wellnessDetailChip(venue.category)
                                wellnessDetailChip(venue.vibe)
                                if venue.available {
                                    wellnessDetailChip("Available", highlight: true)
                                }
                            }
                        }

                        // Book CTA
                        Button(action: {
                            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                            openWhatsApp(message: "Hi Alfred, I'd like to book: \(venue.name)")
                        }) {
                            HStack(spacing: 8) {
                                Image(systemName: "calendar")
                                    .font(.system(size: 14, weight: .light))
                                Text("Book via Alfred")
                                    .font(.system(size: 15, weight: .semibold))
                            }
                            .foregroundStyle(A.s1)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(A.s3)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                        .buttonStyle(.plain)

                        Spacer().frame(height: 80)
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 24)
                }
            }
        }
    }

    private func wellnessQuickFact(icon: String, title: String, subtitle: String) -> some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 14, weight: .light))
                .foregroundStyle(A.s5)
            Text(title)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(A.s1)
            Text(subtitle)
                .font(.system(size: 12))
                .foregroundStyle(A.s6)
        }
        .frame(maxWidth: .infinity)
    }

    private func wellnessDetailChip(_ text: String, highlight: Bool = false) -> some View {
        Text(text)
            .font(.system(size: 12, weight: .medium))
            .foregroundStyle(highlight ? A.gold : A.s4)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(highlight ? A.activeFilterBg : A.el)
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .overlay(RoundedRectangle(cornerRadius: 10).stroke(A.bd, lineWidth: 0.5))
    }
}

#Preview {
    WellnessView(selectedCity: .constant("Miami"), isFilterVisible: .constant(false))
}
