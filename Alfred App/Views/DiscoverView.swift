//
//  DiscoverView.swift
//  Alfred App
//
//  Discover tab — Search, suggestions, categories, Alfred's Picks, Trending.
//  Uses app design tokens (A.bg, A.s1, etc.) via CC alias.
//

import SwiftUI

// MARK: - Design tokens alias (Centurion / app tokens)
private enum CC {
    static let bg = A.bg
    static let elevated = A.el
    static let surface = A.srf
    static let border = A.bd
    static let s100 = A.s1
    static let s200 = A.s2
    static let s300 = A.s3
    static let s400 = A.s4
    static let s500 = A.s5
    static let s600 = A.s6
    static let s700 = A.s7
}

// MARK: - Data Models

struct DiscoverVenue: Identifiable {
    let id = UUID()
    let name: String
    let subtitle: String
    let rating: Double
    let reviews: Int?
    let price: String
    let imageURL: String
    let type: String // "Restaurant", "Car", "Nightlife", "Bar", "Experience", "Wellness"
    let tag: String?
    let note: String?
}

struct SearchSuggestion: Identifiable {
    let id = UUID()
    let text: String
    let icon: String
}

struct DiscoverBrowseCategory: Identifiable {
    let id = UUID()
    let label: String
    let icon: String
    let emoji: String
    let comingSoon: Bool
}

// MARK: - Sample Data

enum DiscoverData {
    static let categories: [DiscoverBrowseCategory] = [
        DiscoverBrowseCategory(label: "Dining",    icon: "fork.knife", emoji: "🍽️", comingSoon: false),
        DiscoverBrowseCategory(label: "Nightlife", icon: "moon.stars", emoji: "🍸",  comingSoon: false),
        DiscoverBrowseCategory(label: "Wellness",  icon: "heart",      emoji: "🧖",  comingSoon: false),
        DiscoverBrowseCategory(label: "Cars",      icon: "car",        emoji: "🏎️", comingSoon: false),
        DiscoverBrowseCategory(label: "Yachts",    icon: "sailboat",   emoji: "⛵",  comingSoon: false),
        DiscoverBrowseCategory(label: "Jets",      icon: "airplane",   emoji: "✈️",  comingSoon: false),
    ]

    static let suggestions: [SearchSuggestion] = [
        SearchSuggestion(text: "Best restaurants tonight", icon: "fork.knife"),
        SearchSuggestion(text: "Available supercars", icon: "car.fill"),
        SearchSuggestion(text: "Nightlife this weekend", icon: "moon.stars.fill"),
        SearchSuggestion(text: "Private dining rooms", icon: "house.fill"),
        SearchSuggestion(text: "Waterfront restaurants", icon: "water.waves"),
        SearchSuggestion(text: "Chef's table experiences", icon: "flame.fill"),
    ]

    static let recentSearches = ["Carbone", "Zuma Miami", "Ferrari"]

    static let allVenues: [DiscoverVenue] = [
        DiscoverVenue(name: "Carbone", subtitle: "Italian · Miami Beach", rating: 4.9, reviews: 124, price: "$$$$", imageURL: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", type: "Restaurant", tag: "Trending", note: nil),
        DiscoverVenue(name: "Zuma", subtitle: "Japanese · Downtown Miami", rating: 4.8, reviews: 186, price: "$$$$", imageURL: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80", type: "Restaurant", tag: "Popular", note: nil),
        DiscoverVenue(name: "Lido", subtitle: "Italian Seafood · Miami Beach", rating: 4.8, reviews: 142, price: "$$$$", imageURL: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", type: "Restaurant", tag: nil, note: nil),
        DiscoverVenue(name: "Girafe", subtitle: "Seafood · Trocadéro", rating: 4.6, reviews: 58, price: "$$$", imageURL: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80", type: "Restaurant", tag: nil, note: "Perfect for tonight — clear skies over the Seine"),
        DiscoverVenue(name: "Sushi Okuda", subtitle: "Omakase · 1st arr.", rating: 4.8, reviews: 22, price: "$$$$", imageURL: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80", type: "Restaurant", tag: "Trending", note: "Booked 3× by Alfred members this week"),
        DiscoverVenue(name: "Le Cinq", subtitle: "French Fine Dining · 8th arr.", rating: 4.9, reviews: 47, price: "$$$$", imageURL: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80", type: "Restaurant", tag: nil, note: nil),
        DiscoverVenue(name: "Bar Hemingway", subtitle: "Cocktail Bar · Ritz Paris", rating: 4.8, reviews: 92, price: "$$$", imageURL: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80", type: "Bar", tag: "Just Opened", note: "Two seats just opened at the bar"),
        DiscoverVenue(name: "LIV Nightclub", subtitle: "Club · Fontainebleau", rating: 4.7, reviews: 89, price: "$$$", imageURL: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400&q=80", type: "Nightlife", tag: "Hot", note: nil),
        DiscoverVenue(name: "CoCo Club", subtitle: "Members Club · Opéra", rating: 4.6, reviews: 67, price: "$$$", imageURL: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&q=80", type: "Nightlife", tag: nil, note: nil),
        DiscoverVenue(name: "Ferrari F8 Tributo", subtitle: "Supercar · Self-drive", rating: 5.0, reviews: 6, price: "$650/hr", imageURL: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80", type: "Car", tag: "Popular", note: nil),
        DiscoverVenue(name: "Rolls Royce Ghost", subtitle: "Ultra-luxury · Chauffeur", rating: 5.0, reviews: 12, price: "$380/hr", imageURL: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80", type: "Car", tag: nil, note: nil),
        DiscoverVenue(name: "Bugatti Chiron", subtitle: "Hypercar · Chauffeur included", rating: 5.0, reviews: 3, price: "$2,800/day", imageURL: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=80", type: "Car", tag: "New", note: nil),
        DiscoverVenue(name: "Private Chef Experience", subtitle: "Michelin-trained, at your residence", rating: 4.9, reviews: 18, price: "From $350", imageURL: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80", type: "Experience", tag: nil, note: nil),
        DiscoverVenue(name: "Yacht Charter", subtitle: "60ft luxury · Full crew", rating: 4.9, reviews: 8, price: "From $2,800", imageURL: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&q=80", type: "Experience", tag: "Luxe", note: nil),
        DiscoverVenue(name: "Cheval Blanc Spa", subtitle: "Wellness · Paris", rating: 4.8, reviews: 34, price: "$$$$", imageURL: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80", type: "Wellness", tag: nil, note: nil),
        DiscoverVenue(name: "Mercedes S-Class", subtitle: "Premium sedan · On demand", rating: 4.8, reviews: 44, price: "$120/hr", imageURL: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80", type: "Car", tag: nil, note: nil),
    ]

    static let trending: [DiscoverVenue] = [
        allVenues[0],
        allVenues[7],
        allVenues[9],
    ]

    static let curatedPicks: [DiscoverVenue] = [
        allVenues[3],
        allVenues[6],
        allVenues[4],
    ]
}

// MARK: - Main Discover View

struct DiscoverView: View {
    @Binding var selectedTab: AppTab
    var onBrowse: ((String) -> Void)? = nil
    @State private var query = ""
    @State private var isFocused = false
    @FocusState private var searchFocused: Bool

    private var hasQuery: Bool { !query.isEmpty }

    private var filteredVenues: [DiscoverVenue] {
        let q = query.lowercased()
        return DiscoverData.allVenues.filter {
            $0.name.lowercased().contains(q) ||
            $0.subtitle.lowercased().contains(q) ||
            $0.type.lowercased().contains(q)
        }
    }

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(spacing: 0) {
                headerSection
                if isFocused && !hasQuery {
                    suggestionsView
                } else if hasQuery {
                    searchResultsView
                } else {
                    browseView
                }
            }
        }
        .background(CC.bg.ignoresSafeArea())
        .onChange(of: searchFocused) { _, newValue in
            withAnimation(.easeOut(duration: 0.2)) { isFocused = newValue }
        }
    }
}

// MARK: - Header & Search Bar

extension DiscoverView {
    var headerSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 6) {
                Text("Search")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(CC.s100)
                Capsule()
                    .fill(CC.s700)
                    .frame(width: 36, height: 3)
            }

            HStack(spacing: 10) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 16, weight: .light))
                    .foregroundColor(isFocused ? CC.s300 : CC.s500)

                TextField("Restaurants, cars, experiences...", text: $query)
                    .font(.system(size: 15, weight: .regular))
                    .foregroundColor(CC.s100)
                    .tint(CC.s300)
                    .focused($searchFocused)

                if hasQuery {
                    Button(action: { query = ""; searchFocused = true }) {
                        Circle()
                            .fill(CC.s700)
                            .frame(width: 22, height: 22)
                            .overlay(
                                Image(systemName: "xmark")
                                    .font(.system(size: 9, weight: .bold))
                                    .foregroundColor(CC.s400)
                            )
                    }
                }
            }
            .padding(.horizontal, 14)
            .frame(height: 48)
            .background(CC.surface)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(isFocused ? CC.s600 : Color.clear, lineWidth: 1)
            )
        }
        .padding(.horizontal, 20)
        .padding(.top, 20)
        .padding(.bottom, 6)
    }
}

// MARK: - Suggestions (focused, no query)

extension DiscoverView {
    var suggestionsView: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Suggestions")
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(CC.s600)
                .padding(.horizontal, 24)
                .padding(.top, 16)
                .padding(.bottom, 14)

            ForEach(Array(DiscoverData.suggestions.enumerated()), id: \.element.id) { index, suggestion in
                Button(action: { query = suggestion.text }) {
                    HStack(spacing: 12) {
                        RoundedRectangle(cornerRadius: 10)
                            .fill(CC.elevated)
                            .frame(width: 36, height: 36)
                            .overlay(
                                Image(systemName: suggestion.icon)
                                    .font(.system(size: 14, weight: .light))
                                    .foregroundColor(CC.s400)
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(CC.border, lineWidth: 0.5)
                            )
                        Text(suggestion.text)
                            .font(.system(size: 14, weight: .regular))
                            .foregroundColor(CC.s300)
                        Spacer()
                        Image(systemName: "arrow.up.right")
                            .font(.system(size: 12, weight: .light))
                            .foregroundColor(CC.s700)
                    }
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                }
                if index < DiscoverData.suggestions.count - 1 {
                    Divider().background(CC.border).padding(.leading, 72)
                }
            }

            Text("Recent")
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(CC.s600)
                .padding(.horizontal, 24)
                .padding(.top, 24)
                .padding(.bottom, 14)

            ForEach(Array(DiscoverData.recentSearches.enumerated()), id: \.offset) { index, recent in
                Button(action: { query = recent }) {
                    HStack(spacing: 12) {
                        Image(systemName: "clock")
                            .font(.system(size: 13, weight: .light))
                            .foregroundColor(CC.s600)
                        Text(recent)
                            .font(.system(size: 14, weight: .regular))
                            .foregroundColor(CC.s400)
                        Spacer()
                        Image(systemName: "chevron.right")
                            .font(.system(size: 10, weight: .light))
                            .foregroundColor(CC.s700)
                    }
                    .padding(.horizontal, 24)
                    .padding(.vertical, 11)
                }
                if index < DiscoverData.recentSearches.count - 1 {
                    Divider().background(CC.border).padding(.leading, 50)
                }
            }
        }
    }
}

// MARK: - Search Results (live filter)

extension DiscoverView {
    var searchResultsView: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("\(filteredVenues.count) result\(filteredVenues.count != 1 ? "s" : "") for \"\(query)\"")
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(CC.s600)
                .padding(.horizontal, 24)
                .padding(.top, 16)
                .padding(.bottom, 14)

            if filteredVenues.isEmpty {
                VStack(spacing: 6) {
                    Text("No results found")
                        .font(.system(size: 15, weight: .medium))
                        .foregroundColor(CC.s500)
                    Text("Try a different search or ask Alfred.")
                        .font(.system(size: 12, weight: .regular))
                        .foregroundColor(CC.s600)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 40)
            } else {
                ForEach(filteredVenues) { venue in
                    searchResultRow(venue)
                }
            }
            askAlfredCard
                .padding(.horizontal, 24)
                .padding(.top, 8)
                .padding(.bottom, 40)
        }
    }

    func searchResultRow(_ venue: DiscoverVenue) -> some View {
        Button(action: {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
            openWhatsApp(message: "Hi Alfred, I'm interested in: \(venue.name)")
        }) {
            HStack(spacing: 14) {
                AsyncImage(url: URL(string: venue.imageURL)) { image in
                    image.resizable().aspectRatio(contentMode: .fill)
                } placeholder: {
                    CC.surface.overlay(
                        Text(String(venue.name.prefix(1)))
                            .font(.system(size: 20, weight: .thin))
                            .foregroundColor(CC.s700)
                    )
                }
                .frame(width: 60, height: 60)
                .clipShape(RoundedRectangle(cornerRadius: 14))

                VStack(alignment: .leading, spacing: 3) {
                    HStack(spacing: 6) {
                        Text(venue.name)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(CC.s100)
                            .lineLimit(1)
                        Text("★ \(String(format: "%.1f", venue.rating))")
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(CC.s500)
                    }
                    Text(venue.subtitle)
                        .font(.system(size: 12, weight: .regular))
                        .foregroundColor(CC.s500)
                        .lineLimit(1)
                    HStack(spacing: 6) {
                        Text(venue.type)
                            .font(.system(size: 9, weight: .medium))
                            .foregroundColor(CC.s400)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(CC.surface)
                            .clipShape(RoundedRectangle(cornerRadius: 4))
                        Text(venue.price)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(CC.s300)
                    }
                    .padding(.top, 1)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .light))
                    .foregroundColor(CC.s700)
            }
            .padding(14)
            .background(CC.elevated)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(CC.border, lineWidth: 0.5)
            )
            .padding(.horizontal, 24)
            .padding(.bottom, 8)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Browse (default state)

extension DiscoverView {
    var browseView: some View {
        VStack(alignment: .leading, spacing: 0) {
            categoriesRow
                .padding(.top, 20)
            askAlfredPrompt
                .padding(.horizontal, 24)
                .padding(.top, 16)
            curatedSection
                .padding(.top, 24)
            trendingSection
                .padding(.top, 28)
            Spacer().frame(height: 100)
        }
    }

    var categoriesRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(DiscoverData.categories) { cat in
                    Button(action: {
                        guard !cat.comingSoon else { return }
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        onBrowse?(cat.label)
                    }) {
                        HStack(spacing: 10) {
                            Text(cat.emoji)
                                .font(.system(size: 18))
                                .frame(width: 28, height: 28)
                            Text(cat.label)
                                .font(.outfit(13, weight: .regular))
                                .foregroundStyle(cat.comingSoon ? CC.s700 : CC.s400)
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 12)
                        .background(CC.elevated)
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .strokeBorder(CC.border, lineWidth: 0.5)
                        )
                        .opacity(cat.comingSoon ? 0.25 : 1)
                    }
                    .buttonStyle(.plain)
                    .disabled(cat.comingSoon)
                }
            }
            .padding(.horizontal, 24)
        }
    }

    var askAlfredPrompt: some View {
        Button(action: {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
            openWhatsApp(message: "Hi Alfred, I'm not sure what I want — can you plan my evening?")
        }) {
            HStack(spacing: 14) {
                Circle()
                    .fill(CC.elevated)
                    .frame(width: 40, height: 40)
                    .overlay(
                        Image(systemName: "key.fill")
                            .font(.system(size: 14, weight: .light))
                            .foregroundColor(CC.s500)
                            .rotationEffect(.degrees(-45))
                    )
                VStack(alignment: .leading, spacing: 2) {
                    Text("Not sure what you want?")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(CC.s100)
                    Text("Tell Alfred. He'll plan your entire evening.")
                        .font(.system(size: 11, weight: .regular))
                        .foregroundColor(CC.s500)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .light))
                    .foregroundColor(CC.s600)
            }
            .padding(18)
            .background(CC.elevated)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(CC.border, lineWidth: 0.5)
            )
        }
        .buttonStyle(.plain)
    }

    var curatedSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            sectionHeader(title: "Alfred's Picks")
                .padding(.horizontal, 24)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 14) {
                    ForEach(DiscoverData.curatedPicks) { venue in
                        curatedCard(venue)
                            .frame(width: 280)
                    }
                }
                .padding(.horizontal, 24)
            }
        }
    }

    func curatedCard(_ venue: DiscoverVenue) -> some View {
        Button(action: {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
            openWhatsApp(message: "Hi Alfred, I'm interested in: \(venue.name)")
        }) {
            VStack(alignment: .leading, spacing: 0) {
                ZStack(alignment: .top) {
                    AsyncImage(url: URL(string: venue.imageURL)) { image in
                        image.resizable().aspectRatio(contentMode: .fill)
                    } placeholder: {
                        CC.surface.overlay(
                            Text(String(venue.name.prefix(1)))
                                .font(.system(size: 36, weight: .thin))
                                .foregroundColor(CC.s700)
                        )
                    }
                    .frame(height: 160)
                    .clipped()
                    LinearGradient(colors: [.clear, A.bg.opacity(0.5)], startPoint: .center, endPoint: .bottom)
                    HStack {
                        if let tag = venue.tag {
                            Text(tag)
                                .font(.system(size: 9, weight: .semibold))
                                .foregroundColor(CC.s100)
                                .padding(.horizontal, 9)
                                .padding(.vertical, 4)
                                .background(A.bg.opacity(0.5))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        }
                        Spacer()
                        HStack(spacing: 4) {
                            Text("★")
                                .font(.system(size: 11, weight: .medium))
                                .foregroundColor(Color(hex: "FFD60A"))
                            Text(String(format: "%.1f", venue.rating))
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(CC.s100)
                        }
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(A.bg.opacity(0.55))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                    .padding(10)
                }
                .frame(height: 160)
                .clipped()
                VStack(alignment: .leading, spacing: 5) {
                    HStack {
                        Text(venue.name)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(CC.s100)
                            .lineLimit(1)
                        Spacer()
                        Text(venue.price)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(CC.s400)
                    }
                    Text(venue.subtitle)
                        .font(.system(size: 13, weight: .regular))
                        .foregroundColor(CC.s500)
                        .lineLimit(1)
                    if let note = venue.note {
                        Text(note)
                            .font(.system(size: 11, weight: .regular).italic())
                            .foregroundColor(CC.s400)
                            .lineSpacing(2)
                            .lineLimit(2)
                    }
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
            }
            .background(CC.elevated)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(CC.border, lineWidth: 0.5)
            )
        }
        .buttonStyle(.plain)
    }

    var trendingSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            sectionHeader(title: "Trending Now", trailing: "See All")
                .padding(.horizontal, 24)
            VStack(spacing: 14) {
                ForEach(DiscoverData.trending) { venue in
                    trendingCard(venue)
                }
            }
            .padding(.horizontal, 24)
        }
    }

    func trendingCard(_ venue: DiscoverVenue) -> some View {
        Button(action: {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
            openWhatsApp(message: "Hi Alfred, I'm interested in: \(venue.name)")
        }) {
            VStack(alignment: .leading, spacing: 0) {
                ZStack(alignment: .top) {
                    AsyncImage(url: URL(string: venue.imageURL)) { image in
                        image.resizable().aspectRatio(contentMode: .fill)
                    } placeholder: {
                        CC.surface.overlay(
                            Text(String(venue.name.prefix(1)))
                                .font(.system(size: 48, weight: .thin))
                                .foregroundColor(CC.s700)
                        )
                    }
                    .frame(height: 200)
                    .clipped()
                    LinearGradient(colors: [.clear, A.bg.opacity(0.5)], startPoint: .center, endPoint: .bottom)
                    HStack {
                        Spacer()
                        HStack(spacing: 4) {
                            Text("★")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(Color(hex: "FFD60A"))
                            Text(String(format: "%.1f", venue.rating))
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(CC.s100)
                            if let reviews = venue.reviews {
                                Text("(\(reviews))")
                                    .font(.system(size: 11, weight: .regular))
                                    .foregroundColor(CC.s400)
                            }
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(A.bg.opacity(0.55))
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                    }
                    .padding(12)
                    if let tag = venue.tag {
                        HStack {
                            Text(tag)
                                .font(.system(size: 9, weight: .semibold))
                                .foregroundColor(CC.s100)
                                .padding(.horizontal, 9)
                                .padding(.vertical, 4)
                                .background(A.bg.opacity(0.5))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                            Spacer()
                        }
                        .padding(12)
                    }
                }
                .frame(height: 200)
                .clipped()
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(venue.name)
                            .font(.system(size: 17, weight: .semibold))
                            .foregroundColor(CC.s100)
                        Spacer()
                        Text(venue.price)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(CC.s400)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 3)
                            .background(CC.surface)
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                    Text(venue.subtitle)
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(CC.s500)
                }
                .padding(.horizontal, 18)
                .padding(.vertical, 16)
            }
            .background(CC.elevated)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(CC.border, lineWidth: 0.5)
            )
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Shared Components

extension DiscoverView {
    var askAlfredCard: some View {
        Button(action: {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
            openWhatsApp(message: "Hi Alfred, I can't find what I'm looking for — can you help?")
        }) {
            HStack(spacing: 12) {
                Circle()
                    .fill(CC.surface)
                    .frame(width: 36, height: 36)
                    .overlay(
                        Image(systemName: "key.fill")
                            .font(.system(size: 12, weight: .light))
                            .foregroundColor(CC.s500)
                    )
                VStack(alignment: .leading, spacing: 1) {
                    Text("Can't find it?")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(CC.s100)
                    Text("Ask Alfred — he'll handle it.")
                        .font(.system(size: 11, weight: .regular))
                        .foregroundColor(CC.s500)
                }
                Spacer()
                Image(systemName: "arrow.up.right")
                    .font(.system(size: 12, weight: .light))
                    .foregroundColor(CC.s500)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(CC.elevated)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(CC.border, lineWidth: 0.5)
            )
        }
        .buttonStyle(.plain)
    }

    func sectionHeader(title: String, trailing: String? = nil) -> some View {
        HStack {
            Text(title)
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(CC.s600)
            Spacer()
            if let trailing = trailing {
                Button(action: {}) {
                    Text(trailing)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(CC.s300)
                }
            }
        }
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        DiscoverView(selectedTab: .constant(.search))
    }
    .preferredColorScheme(.dark)
}
