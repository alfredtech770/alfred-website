//
//  MapSearchView.swift
//  Alfred App
//
//  Map-based venue discovery — Search tab
//

import SwiftUI
import MapKit
import PostgREST
import Combine

// MARK: - MapVenueModel

struct MapVenueModel: Identifiable, Equatable {
    let id: UUID
    let name: String
    let category: String
    let cuisine: String?
    let rating: Double?
    let priceLevel: Int?
    let coordinate: CLLocationCoordinate2D
    let heroImageURL: String?
    var distance: String?
    var distanceMeters: Double?
    let isOpen: Bool
    let tag: String?
    let isPartner: Bool
    let address: String?

    static func == (lhs: MapVenueModel, rhs: MapVenueModel) -> Bool {
        lhs.id == rhs.id
    }

    var priceLevelDisplay: String {
        guard let pl = priceLevel else { return "$$" }
        return String(repeating: "$", count: min(pl, 5))
    }

    var categoryIcon: String {
        switch category.lowercased() {
        case "restaurant", "cafe", "bakery", "brunch": return "fork.knife"
        case "bar":                                     return "wineglass"
        case "nightclub":                               return "music.note"
        case "hotel", "accommodation":                  return "building.2"
        case "wellness":                                return "leaf"
        case "experience":                              return "sparkles"
        case "car":                                     return "car.fill"
        case "yacht":                                   return "sailboat.fill"
        case "jet":                                     return "airplane"
        default:                                        return "mappin"
        }
    }
}

// MARK: - VenueMapCategory

enum VenueMapCategory: String, CaseIterable {
    case all          = "All"
    case restaurants  = "Restaurants"
    case nightlife    = "Nightlife"
    case wellness     = "Wellness"
    case stays        = "Stays"
    case cars         = "Cars"
    case yachts       = "Yachts"
    case jets         = "Jets"
    case experiences  = "Experiences"

    var matchingCategories: [String] {
        switch self {
        case .all:          return []
        case .restaurants:  return ["restaurant", "cafe", "bakery", "brunch"]
        case .nightlife:    return ["nightclub", "bar"]
        case .wellness:     return ["wellness"]
        case .stays:        return ["hotel", "villa", "apartment", "resort", "accommodation"]
        case .cars:         return ["car"]
        case .yachts:       return ["yacht"]
        case .jets:         return ["jet"]
        case .experiences:  return ["experience"]
        }
    }
}

// MARK: - Supabase response models

private struct RestaurantRow: Decodable {
    let id: UUID
    let name: String
    let category: String
    let cuisine: String?
    let rating: Double?
    let price_level: Int?
    let hero_image_url: String?
    let latitude: Double?
    let longitude: Double?
    let is_featured: Bool?
    let is_partner: Bool?
    let available_tonight: Bool?
    let address: String?
    let tags: [String]?
    let city: String?
}

private struct BarRow: Decodable {
    let id: UUID
    let name: String
    let category: String?
    let rating: Double?
    let price_level: Int?
    let hero_image_url: String?
    let latitude: Double?
    let longitude: Double?
    let is_featured: Bool?
    let is_partner: Bool?
    let address: String?
    let tags: [String]?
    let city: String?
}

private struct NightclubRow: Decodable {
    let id: UUID
    let name: String
    let category: String?
    let rating: Double?
    let price_level: Int?
    let hero_image_url: String?
    let latitude: Double?
    let longitude: Double?
    let is_featured: Bool?
    let is_partner: Bool?
    let address: String?
    let tags: [String]?
    let city: String?
}

private struct WellnessRow: Decodable {
    let id: UUID
    let name: String
    let category: String?
    let type: String?
    let rating: Double?
    let price_level: Int?
    let hero_image_url: String?
    let latitude: Double?
    let longitude: Double?
    let is_featured: Bool?
    let is_partner: Bool?
    let address: String?
    let tags: [String]?
    let city: String?
}

private struct CarRow: Decodable {
    let id: UUID
    let name: String
    let brand: String?
    let category: String?
    let rating: Double?
    let hero_image_url: String?
    let latitude: Double?
    let longitude: Double?
    let is_featured: Bool?
    let is_partner: Bool?
    let address: String?
    let tags: [String]?
    let city: String?
    let price_1_day: Int?
}

private struct YachtMapRow: Decodable {
    let id: UUID
    let name: String
    let category: String?
    let yacht_type: String?
    let rating: Double?
    let price_level: Int?
    let hero_image_url: String?
    let latitude: Double?
    let longitude: Double?
    let is_featured: Bool?
    let is_partner: Bool?
    let address: String?
    let city: String?
}

private struct AccommodationMapRow: Decodable {
    let id: UUID
    let name: String
    let category: String?
    let type: String?
    let rating: Double?
    let price_level: Int?
    let hero_image_url: String?
    let latitude: Double?
    let longitude: Double?
    let is_featured: Bool?
    let is_partner: Bool?
    let address: String?
    let city: String?
}

private struct JetMapRow: Decodable {
    let id: UUID
    let name: String
    let category: String?
    let rating: Double?
    let hero_image_url: String?
    let latitude: Double?
    let longitude: Double?
    let is_featured: Bool?
    let is_partner: Bool?
    let address: String?
    let city: String?
}

// MARK: - MapSearchViewModel

class MapSearchViewModel: ObservableObject {
    @Published var venues: [MapVenueModel] = []
    @Published var filteredVenues: [MapVenueModel] = []
    @Published var selectedVenue: MapVenueModel? = nil
    @Published var searchText: String = ""
    @Published var selectedCategory: VenueMapCategory = .all
    @Published var isLoading: Bool = false
    @Published var userLocation: CLLocation? = nil
    @Published var searchSuggestions: [MapVenueModel] = []
    @Published var cameraPosition: MapCameraPosition = .camera(
        MapCamera(
            centerCoordinate: CLLocationCoordinate2D(latitude: 25.7617, longitude: -80.1918),
            distance: 12000,
            heading: 0,
            pitch: 0
        )
    )

    private let supabase = SupabaseManager.shared

    @MainActor
    func fetchVenues(city: String = "Paris") async {
        isLoading = true
        defer { isLoading = false }

        var allVenues: [MapVenueModel] = []

        func venueTag(featured: Bool?, partner: Bool?) -> String? {
            if featured == true { return "Alfred Pick" }
            if partner == true { return "Partner" }
            return nil
        }

        // ── 1. Restaurants ──
        do {
            let rows: [RestaurantRow] = try await supabase.database
                .from("restaurants")
                .select("id, name, category, cuisine, rating, price_level, hero_image_url, latitude, longitude, is_featured, is_partner, available_tonight, address, tags, city")
                .eq("is_active", value: true)
                .ilike("city", pattern: city)
                .execute()
                .value

            allVenues += rows.compactMap { row in
                guard let lat = row.latitude, let lng = row.longitude else { return nil }
                return MapVenueModel(
                    id: row.id, name: row.name, category: row.category,
                    cuisine: row.cuisine, rating: row.rating, priceLevel: row.price_level,
                    coordinate: CLLocationCoordinate2D(latitude: lat, longitude: lng),
                    heroImageURL: row.hero_image_url, distance: nil, distanceMeters: nil,
                    isOpen: row.available_tonight ?? false,
                    tag: venueTag(featured: row.is_featured, partner: row.is_partner),
                    isPartner: row.is_partner ?? false, address: row.address
                )
            }
        } catch {
            #if DEBUG
            print("MapSearchVM fetch (restaurants): \(error)")
            #endif
        }

        // ── 2. Bars ──
        do {
            let rows: [BarRow] = try await supabase.database
                .from("bars")
                .select("id, name, category, rating, price_level, hero_image_url, latitude, longitude, is_featured, is_partner, address, tags, city")
                .eq("is_active", value: true)
                .ilike("city", pattern: city)
                .execute()
                .value

            allVenues += rows.compactMap { row in
                guard let lat = row.latitude, let lng = row.longitude else { return nil }
                return MapVenueModel(
                    id: row.id, name: row.name, category: "bar",
                    cuisine: row.category, rating: row.rating, priceLevel: row.price_level,
                    coordinate: CLLocationCoordinate2D(latitude: lat, longitude: lng),
                    heroImageURL: row.hero_image_url, distance: nil, distanceMeters: nil,
                    isOpen: true,
                    tag: venueTag(featured: row.is_featured, partner: row.is_partner),
                    isPartner: row.is_partner ?? false, address: row.address
                )
            }
        } catch {
            #if DEBUG
            print("MapSearchVM fetch (bars): \(error)")
            #endif
        }

        // ── 3. Nightclubs ──
        do {
            let rows: [NightclubRow] = try await supabase.database
                .from("nightclubs")
                .select("id, name, category, rating, price_level, hero_image_url, latitude, longitude, is_featured, is_partner, address, tags, city")
                .eq("is_active", value: true)
                .ilike("city", pattern: city)
                .execute()
                .value

            allVenues += rows.compactMap { row in
                guard let lat = row.latitude, let lng = row.longitude else { return nil }
                return MapVenueModel(
                    id: row.id, name: row.name, category: "nightclub",
                    cuisine: row.category, rating: row.rating, priceLevel: row.price_level,
                    coordinate: CLLocationCoordinate2D(latitude: lat, longitude: lng),
                    heroImageURL: row.hero_image_url, distance: nil, distanceMeters: nil,
                    isOpen: true,
                    tag: venueTag(featured: row.is_featured, partner: row.is_partner),
                    isPartner: row.is_partner ?? false, address: row.address
                )
            }
        } catch {
            #if DEBUG
            print("MapSearchVM fetch (nightclubs): \(error)")
            #endif
        }

        // ── 4. Wellness ──
        do {
            let rows: [WellnessRow] = try await supabase.database
                .from("wellness")
                .select("id, name, category, type, rating, price_level, hero_image_url, latitude, longitude, is_featured, is_partner, address, tags, city")
                .eq("is_active", value: true)
                .ilike("city", pattern: city)
                .execute()
                .value

            allVenues += rows.compactMap { row in
                guard let lat = row.latitude, let lng = row.longitude else { return nil }
                return MapVenueModel(
                    id: row.id, name: row.name, category: "wellness",
                    cuisine: row.type ?? row.category, rating: row.rating, priceLevel: row.price_level,
                    coordinate: CLLocationCoordinate2D(latitude: lat, longitude: lng),
                    heroImageURL: row.hero_image_url, distance: nil, distanceMeters: nil,
                    isOpen: true,
                    tag: venueTag(featured: row.is_featured, partner: row.is_partner),
                    isPartner: row.is_partner ?? false, address: row.address
                )
            }
        } catch {
            #if DEBUG
            print("MapSearchVM fetch (wellness): \(error)")
            #endif
        }

        // ── 5. Cars ──
        do {
            let rows: [CarRow] = try await supabase.database
                .from("cars")
                .select("id, name, brand, category, rating, hero_image_url, latitude, longitude, is_featured, is_partner, address, tags, city, price_1_day")
                .eq("is_active", value: true)
                .ilike("city", pattern: city)
                .execute()
                .value

            allVenues += rows.compactMap { row in
                guard let lat = row.latitude, let lng = row.longitude else { return nil }
                let displayName = [row.brand, row.name].compactMap { $0 }.joined(separator: " ")
                let pl: Int? = {
                    guard let p = row.price_1_day else { return nil }
                    if p >= 5000 { return 5 }; if p >= 2000 { return 4 }
                    if p >= 1000 { return 3 }; if p >= 500  { return 2 }; return 1
                }()
                return MapVenueModel(
                    id: row.id, name: displayName, category: "car",
                    cuisine: row.category, rating: row.rating, priceLevel: pl,
                    coordinate: CLLocationCoordinate2D(latitude: lat, longitude: lng),
                    heroImageURL: row.hero_image_url, distance: nil, distanceMeters: nil,
                    isOpen: true,
                    tag: venueTag(featured: row.is_featured, partner: row.is_partner),
                    isPartner: row.is_partner ?? false, address: row.address
                )
            }
        } catch {
            #if DEBUG
            print("MapSearchVM fetch (cars): \(error)")
            #endif
        }

        // ── 6. Yachts ──
        do {
            let rows: [YachtMapRow] = try await supabase.database
                .from("yachts")
                .select("id, name, category, yacht_type, rating, price_level, hero_image_url, latitude, longitude, is_featured, is_partner, address, city")
                .eq("is_active", value: true)
                .ilike("city", pattern: city)
                .execute()
                .value

            allVenues += rows.compactMap { row in
                guard let lat = row.latitude, let lng = row.longitude else { return nil }
                return MapVenueModel(
                    id: row.id, name: row.name, category: "yacht",
                    cuisine: row.yacht_type ?? row.category, rating: row.rating, priceLevel: row.price_level,
                    coordinate: CLLocationCoordinate2D(latitude: lat, longitude: lng),
                    heroImageURL: row.hero_image_url, distance: nil, distanceMeters: nil,
                    isOpen: true,
                    tag: venueTag(featured: row.is_featured, partner: row.is_partner),
                    isPartner: row.is_partner ?? false, address: row.address
                )
            }
        } catch {
            #if DEBUG
            print("MapSearchVM fetch (yachts): \(error)")
            #endif
        }

        // ── 7. Accommodations ──
        do {
            let rows: [AccommodationMapRow] = try await supabase.database
                .from("accommodations")
                .select("id, name, category, type, rating, price_level, hero_image_url, latitude, longitude, is_featured, is_partner, address, city")
                .eq("is_active", value: true)
                .ilike("city", pattern: city)
                .execute()
                .value

            allVenues += rows.compactMap { row in
                guard let lat = row.latitude, let lng = row.longitude else { return nil }
                return MapVenueModel(
                    id: row.id, name: row.name, category: "hotel",
                    cuisine: row.type ?? row.category, rating: row.rating, priceLevel: row.price_level,
                    coordinate: CLLocationCoordinate2D(latitude: lat, longitude: lng),
                    heroImageURL: row.hero_image_url, distance: nil, distanceMeters: nil,
                    isOpen: true,
                    tag: venueTag(featured: row.is_featured, partner: row.is_partner),
                    isPartner: row.is_partner ?? false, address: row.address
                )
            }
        } catch {
            #if DEBUG
            print("MapSearchVM fetch (accommodations): \(error)")
            #endif
        }

        // ── 8. Jets ──
        do {
            let rows: [JetMapRow] = try await supabase.database
                .from("jets")
                .select("id, name, category, rating, hero_image_url, latitude, longitude, is_featured, is_partner, address, city")
                .eq("is_active", value: true)
                .ilike("city", pattern: city)
                .execute()
                .value

            allVenues += rows.compactMap { row in
                guard let lat = row.latitude, let lng = row.longitude else { return nil }
                return MapVenueModel(
                    id: row.id, name: row.name, category: "jet",
                    cuisine: row.category, rating: row.rating, priceLevel: nil,
                    coordinate: CLLocationCoordinate2D(latitude: lat, longitude: lng),
                    heroImageURL: row.hero_image_url, distance: nil, distanceMeters: nil,
                    isOpen: true,
                    tag: venueTag(featured: row.is_featured, partner: row.is_partner),
                    isPartner: row.is_partner ?? false, address: row.address
                )
            }
        } catch {
            #if DEBUG
            print("MapSearchVM fetch (jets): \(error)")
            #endif
        }

        venues = allVenues
        applyFilters()

        if !filteredVenues.isEmpty {
            fitCameraToVenues()
        }
    }

    func applyFilters() {
        var result = venues

        if selectedCategory != .all {
            let cats = selectedCategory.matchingCategories
            result = result.filter { cats.contains($0.category.lowercased()) }
        }

        if !searchText.isEmpty {
            let query = searchText.lowercased()
            result = result.filter {
                $0.name.lowercased().contains(query) ||
                ($0.cuisine?.lowercased().contains(query) ?? false) ||
                $0.category.lowercased().contains(query)
            }
        }

        if let loc = userLocation {
            result = result.map { venue in
                var v = venue
                let dist = loc.distance(from: CLLocation(latitude: venue.coordinate.latitude, longitude: venue.coordinate.longitude))
                v.distanceMeters = dist
                v.distance = dist < 1000 ? "\(Int(dist))m" : String(format: "%.1fkm", dist / 1000)
                return v
            }
            result.sort { ($0.distanceMeters ?? .infinity) < ($1.distanceMeters ?? .infinity) }
        }

        filteredVenues = result
    }

    func updateSuggestions() {
        guard !searchText.isEmpty else {
            searchSuggestions = Array(venues.prefix(6))
            return
        }
        let query = searchText.lowercased()
        searchSuggestions = venues.filter {
            $0.name.lowercased().contains(query) ||
            ($0.cuisine?.lowercased().contains(query) ?? false) ||
            $0.category.lowercased().contains(query)
        }.prefix(6).map { $0 }
    }

    func selectVenue(_ venue: MapVenueModel) {
        withAnimation(.spring(response: 0.35, dampingFraction: 0.78)) {
            selectedVenue = venue
            cameraPosition = .camera(
                MapCamera(
                    centerCoordinate: venue.coordinate,
                    distance: 3000,
                    heading: 0,
                    pitch: 0
                )
            )
        }
    }

    func fitCameraToVenues() {
        guard !filteredVenues.isEmpty else { return }
        let lats = filteredVenues.map(\.coordinate.latitude)
        let lngs = filteredVenues.map(\.coordinate.longitude)
        guard let minLat = lats.min(), let maxLat = lats.max(),
              let minLng = lngs.min(), let maxLng = lngs.max() else { return }
        let center = CLLocationCoordinate2D(
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2
        )
        let latDelta = maxLat - minLat
        let lngDelta = maxLng - minLng
        let maxDelta = max(latDelta, lngDelta)
        // Convert delta to camera distance (rough: 1 degree ~ 111km)
        let distance = max(3000, maxDelta * 111000 * 1.2)
        withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
            cameraPosition = .camera(
                MapCamera(
                    centerCoordinate: center,
                    distance: distance,
                    heading: 0,
                    pitch: 0
                )
            )
        }
    }

    func centerOnUser(_ location: CLLocation) {
        withAnimation(.spring(response: 0.35, dampingFraction: 0.78)) {
            cameraPosition = .camera(
                MapCamera(
                    centerCoordinate: location.coordinate,
                    distance: 4000,
                    heading: 0,
                    pitch: 0
                )
            )
        }
        userLocation = location
        applyFilters()
    }
}

// MARK: - AlfredMapPin

struct AlfredMapPin: View {
    let venue: MapVenueModel
    let isSelected: Bool

    var body: some View {
        VStack(spacing: 0) {
            ZStack {
                Circle()
                    .fill(isSelected ? Color.silver100 : Color.alfredElevated)
                    .frame(width: isSelected ? 36 : 28, height: isSelected ? 36 : 28)

                Circle()
                    .strokeBorder(isSelected ? Color.silver100 : Color.alfredBorder, lineWidth: 0.5)
                    .frame(width: isSelected ? 36 : 28, height: isSelected ? 36 : 28)

                Image(systemName: venue.categoryIcon)
                    .font(.system(size: isSelected ? 14 : 11, weight: .light))
                    .foregroundStyle(isSelected ? Color.alfredBG : Color.silver400)
            }

            // Pointer
            Triangle()
                .fill(isSelected ? Color.silver100 : Color.alfredElevated)
                .frame(width: 8, height: 5)
                .offset(y: -1)
        }
        .scaleEffect(isSelected ? 1.1 : 1.0)
        .animation(.spring(response: 0.28, dampingFraction: 0.72), value: isSelected)
    }
}

// Small triangle shape for pin pointer
private struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.closeSubpath()
        return path
    }
}

// MARK: - VenueMapCard

struct VenueMapCard: View {
    let venue: MapVenueModel
    let isSelected: Bool
    var onBook: () -> Void = {}
    @State private var liked = false

    private let cardWidth: CGFloat = 300
    private let cardHeight: CGFloat = 205

    var body: some View {
        ZStack(alignment: .bottom) {
            // A) Photo
            if let urlStr = venue.heroImageURL, let url = URL(string: urlStr) {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .success(let img):
                        img.resizable().aspectRatio(contentMode: .fill)
                    default:
                        fallbackImage
                    }
                }
            } else {
                fallbackImage
            }

            // B) Gradient (AlfredLandscapeCard style)
            LinearGradient(stops: [
                .init(color: .clear,               location: 0.00),
                .init(color: .clear,               location: 0.45),
                .init(color: .black.opacity(0.30), location: 0.58),
                .init(color: .black.opacity(0.75), location: 0.72),
                .init(color: .black.opacity(0.92), location: 0.86),
                .init(color: .black.opacity(0.97), location: 1.00),
            ], startPoint: .top, endPoint: .bottom)

            // C) Top overlays
            VStack {
                HStack {
                    if let tag = venue.tag {
                        Text(tag.uppercased())
                            .font(.outfitCaption)
                            .kerning(0.6)
                            .foregroundStyle(.white.opacity(0.88))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Color.black.opacity(0.55))
                            .clipShape(Capsule())
                    }
                    Spacer()
                    // Like / save button
                    Button {
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) { liked.toggle() }
                    } label: {
                        ZStack {
                            Circle()
                                .fill(Color.black.opacity(0.45))
                                .frame(width: 32, height: 32)
                            Image(systemName: liked ? "heart.fill" : "heart")
                                .font(.system(size: 13, weight: .medium))
                                .foregroundStyle(liked ? A.red : Color.white)
                        }
                    }
                    .buttonStyle(.plain)
                }
                Spacer()
            }
            .padding(11)

            // D) Bottom text (AlfredLandscapeCard layout)
            VStack(alignment: .leading, spacing: 0) {
                // Name + price
                HStack(alignment: .lastTextBaseline) {
                    Text(venue.name)
                        .font(.outfit(17, weight: .bold))
                        .foregroundStyle(Color.white)
                        .lineLimit(1)
                        .minimumScaleFactor(0.85)
                    Spacer()
                    Text(venue.priceLevelDisplay)
                        .font(.outfit(14, weight: .bold))
                        .foregroundStyle(Color.white)
                        .lineLimit(1)
                }
                .padding(.bottom, 2)

                // Subtitle
                HStack(spacing: 0) {
                    if let cuisine = venue.cuisine {
                        Text(cuisine)
                    } else {
                        Text(venue.category.capitalized)
                    }
                    if let dist = venue.distance {
                        Text(" · \(dist)")
                    }
                }
                .font(.outfit(11, weight: .light))
                .foregroundStyle(Color.white.opacity(0.46))
                .lineLimit(1)
                .padding(.bottom, 9)

                // Divider
                Rectangle()
                    .fill(Color.white.opacity(0.18))
                    .frame(height: 0.5)
                    .padding(.bottom, 9)

                // Stats row
                HStack(spacing: 0) {
                    HStack(spacing: 5) {
                        Image(systemName: "star.fill")
                            .font(.system(size: 10))
                            .foregroundStyle(Color.white.opacity(0.50))
                        Text(venue.rating.map { String(format: "%.1f", $0) } ?? "—")
                            .font(.outfit(11, weight: .bold))
                            .foregroundStyle(Color.white)
                    }
                    .frame(maxWidth: .infinity)

                    Rectangle()
                        .fill(Color.white.opacity(0.20))
                        .frame(width: 0.5, height: 13)

                    HStack(spacing: 5) {
                        Circle()
                            .fill(venue.isOpen ? A.gn : A.red)
                            .frame(width: 5, height: 5)
                        Text(venue.isOpen ? "Open" : "Closed")
                            .font(.outfit(11, weight: .bold))
                            .foregroundStyle(Color.white)
                    }
                    .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal, 14)
            .padding(.bottom, 13)
        }
        .frame(width: cardWidth, height: cardHeight)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .scaleEffect(isSelected ? 1.02 : 1.0)
        .shadow(color: Color.alfredBG.opacity(isSelected ? 0.8 : 0.5),
                radius: isSelected ? 16 : 8,
                y: isSelected ? 6 : 3)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isSelected)
    }

    private var fallbackImage: some View {
        ZStack {
            Color.alfredElevated
            Image(systemName: venue.categoryIcon)
                .font(.system(size: 28, weight: .ultraLight))
                .foregroundStyle(Color.silver700)
        }
    }
}

// MARK: - SearchSuggestionRow

private struct SearchSuggestionRow: View {
    let venue: MapVenueModel

    var body: some View {
        HStack(spacing: 12) {
            if let urlStr = venue.heroImageURL, !urlStr.isEmpty, let url = URL(string: urlStr) {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .success(let img):
                        img.resizable().aspectRatio(contentMode: .fill)
                    default:
                        suggestionPlaceholder
                    }
                }
                .frame(width: 40, height: 40)
                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
            } else {
                suggestionPlaceholder
                    .frame(width: 40, height: 40)
                    .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
            }

            VStack(alignment: .leading, spacing: 2) {
                Text(venue.name)
                    .font(.outfit(14, weight: .medium))
                    .foregroundStyle(Color.silver100)
                    .lineLimit(1)
                HStack(spacing: 0) {
                    if let cuisine = venue.cuisine {
                        Text(cuisine)
                    } else {
                        Text(venue.category.capitalized)
                    }
                    if let dist = venue.distance {
                        Text(" · \(dist)")
                    }
                }
                .font(.outfitSmall)
                .foregroundStyle(Color.silver500)
                .lineLimit(1)
            }

            Spacer()

            Circle()
                .fill(venue.isOpen ? A.gn : A.red)
                .frame(width: 5, height: 5)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .contentShape(Rectangle())
    }

    private var suggestionPlaceholder: some View {
        ZStack {
            Color.alfredElevated
            Image(systemName: venue.categoryIcon)
                .font(.system(size: 13, weight: .light))
                .foregroundStyle(Color.silver600)
        }
    }
}

// MARK: - VenueCardPager (snapping horizontal pager)

private struct VenueCardPager: View {
    let venues: [MapVenueModel]
    @Binding var selectedVenue: MapVenueModel?
    var onBook: (MapVenueModel) -> Void
    var onSelect: (MapVenueModel) -> Void

    private let cardWidth: CGFloat = 300
    private let cardSpacing: CGFloat = 12

    @State private var currentIndex: Int = 0
    @State private var dragOffset: CGFloat = 0

    var body: some View {
        GeometryReader { geo in
            let totalCardWidth = cardWidth + cardSpacing
            let sideInset = (geo.size.width - cardWidth) / 2

            HStack(spacing: cardSpacing) {
                ForEach(Array(venues.enumerated()), id: \.element.id) { index, venue in
                    VenueMapCard(
                        venue: venue,
                        isSelected: selectedVenue?.id == venue.id,
                        onBook: { onBook(venue) }
                    )
                    .onTapGesture { onSelect(venue) }
                }
            }
            .padding(.horizontal, sideInset)
            .offset(x: -CGFloat(currentIndex) * totalCardWidth + dragOffset)
            .gesture(
                DragGesture()
                    .onChanged { value in
                        dragOffset = value.translation.width
                    }
                    .onEnded { value in
                        let threshold: CGFloat = cardWidth * 0.25
                        let velocity = value.predictedEndTranslation.width - value.translation.width
                        var newIndex = currentIndex

                        if value.translation.width < -threshold || velocity < -100 {
                            newIndex = min(currentIndex + 1, venues.count - 1)
                        } else if value.translation.width > threshold || velocity > 100 {
                            newIndex = max(currentIndex - 1, 0)
                        }

                        withAnimation(.spring(response: 0.35, dampingFraction: 0.82)) {
                            currentIndex = newIndex
                            dragOffset = 0
                        }

                        // Select the venue the card snapped to
                        if newIndex < venues.count {
                            let venue = venues[newIndex]
                            if selectedVenue?.id != venue.id {
                                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                                onSelect(venue)
                            }
                        }
                    }
            )
            .animation(.spring(response: 0.35, dampingFraction: 0.82), value: dragOffset)
        }
        .frame(height: 205 + 12)  // cardHeight + padding
        .onChange(of: selectedVenue) { _, newVal in
            // When venue is selected externally (e.g. pin tap), scroll to it
            if let newVal, let idx = venues.firstIndex(where: { $0.id == newVal.id }) {
                if idx != currentIndex {
                    withAnimation(.spring(response: 0.35, dampingFraction: 0.82)) {
                        currentIndex = idx
                    }
                }
            }
        }
        .onChange(of: venues.count) { _, _ in
            // Reset index when venues change (filter/search)
            currentIndex = 0
        }
    }
}

// MARK: - MapVenueDetailSheet (Bottom panel over map)

struct MapVenueDetailSheet: View {
    let venue: MapVenueModel
    var onDismiss: () -> Void
    var onBook: () -> Void

    @State private var panelOffset: CGFloat = 0
    @State private var panelExpanded = false
    @State private var liked = false

    var body: some View {
        GeometryReader { geo in
            let safeBottom = geo.safeAreaInsets.bottom
            // Collapsed: panel shows ~45% of screen from bottom
            let collapsedTop = geo.size.height * 0.55
            // Expanded: panel goes near the top
            let expandedTop = geo.safeAreaInsets.top + 56
            let baseY = panelExpanded ? expandedTop : collapsedTop
            let clampedY = max(expandedTop, min(collapsedTop, baseY + panelOffset))
            let range = collapsedTop - expandedTop
            let progress = range > 0 ? (collapsedTop - clampedY) / range : 0

            ZStack(alignment: .top) {
                // Transparent background — map shows through
                Color.alfredBG.opacity(0.3 + 0.3 * progress)
                    .ignoresSafeArea()
                    .onTapGesture {
                        if !panelExpanded { onDismiss() }
                    }

                // ── Draggable info panel ──
                VStack(spacing: 0) {
                    // Drag handle
                    Capsule()
                        .fill(Color.silver700)
                        .frame(width: 36, height: 4)
                        .padding(.top, 10)
                        .padding(.bottom, 14)

                    ScrollView(.vertical, showsIndicators: false) {
                        venueInfoContent(safeBottom: safeBottom)
                    }
                    .scrollDisabled(!panelExpanded)
                }
                .frame(maxWidth: .infinity)
                .frame(height: geo.size.height - expandedTop)
                .background(
                    Color.alfredBG
                        .clipShape(RoundedCorner(radius: 24, corners: [.topLeft, .topRight]))
                        .shadow(color: Color.alfredBG.opacity(0.7), radius: 30, y: -10)
                )
                .offset(y: clampedY)
                .gesture(
                    DragGesture()
                        .onChanged { value in panelOffset = value.translation.height }
                        .onEnded { value in
                            let vel = value.predictedEndTranslation.height - value.translation.height
                            withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) {
                                if panelExpanded {
                                    if value.translation.height > 100 || vel > 300 { panelExpanded = false }
                                } else if value.translation.height > 120 || vel > 400 {
                                    // Dismiss on big downward swipe when collapsed
                                    onDismiss()
                                    return
                                } else {
                                    if value.translation.height < -80 || vel < -300 { panelExpanded = true }
                                }
                                panelOffset = 0
                            }
                        }
                )

                // ── Close button (top-right, over map area) ──
                HStack {
                    Spacer()
                    Button(action: onDismiss) {
                        Image(systemName: "xmark")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundStyle(Color.silver300)
                            .frame(width: 30, height: 30)
                            .background(Color.alfredElevated.opacity(0.9))
                            .clipShape(Circle())
                            .overlay(Circle().strokeBorder(Color.alfredBorder, lineWidth: 0.5))
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, geo.safeAreaInsets.top + 12)
            }
            .ignoresSafeArea()
        }
    }

    // ── Info Content ──
    private func venueInfoContent(safeBottom: CGFloat) -> some View {
        VStack(alignment: .leading, spacing: 0) {

            // ── Hero thumbnail + info row ──
            HStack(spacing: 14) {
                // Venue image thumbnail
                if let urlStr = venue.heroImageURL, !urlStr.isEmpty, let url = URL(string: urlStr) {
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .success(let img):
                            img.resizable().aspectRatio(contentMode: .fill)
                        default:
                            Color.alfredElevated
                        }
                    }
                    .frame(width: 72, height: 72)
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                } else {
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(Color.alfredElevated)
                        .frame(width: 72, height: 72)
                        .overlay(
                            Image(systemName: venue.categoryIcon)
                                .font(.system(size: 22, weight: .ultraLight))
                                .foregroundStyle(Color.silver700)
                        )
                }

                VStack(alignment: .leading, spacing: 5) {
                    // Name
                    Text(venue.name)
                        .font(.playfairCardLg)
                        .foregroundStyle(Color.silver100)
                        .lineLimit(1)

                    // Category + cuisine
                    HStack(spacing: 6) {
                        Text(venue.cuisine ?? venue.category.capitalized)
                            .font(.outfit(12, weight: .light))
                            .foregroundStyle(Color.silver400)
                        Text("·")
                            .foregroundStyle(Color.silver600)
                        Text(venue.priceLevelDisplay)
                            .font(.outfit(12, weight: .light))
                            .foregroundStyle(Color.silver400)
                    }

                    // Rating + status
                    HStack(spacing: 10) {
                        if let r = venue.rating {
                            HStack(spacing: 3) {
                                Image(systemName: "star.fill")
                                    .font(.system(size: 10))
                                    .foregroundStyle(A.gold)
                                Text(String(format: "%.1f", r))
                                    .font(.outfit(12, weight: .medium))
                                    .foregroundStyle(Color.silver100)
                            }
                        }

                        HStack(spacing: 4) {
                            Circle()
                                .fill(venue.isOpen ? A.gn : A.red)
                                .frame(width: 5, height: 5)
                            Text(venue.isOpen ? "Open" : "Closed")
                                .font(.outfitMicro)
                                .foregroundStyle(venue.isOpen ? A.gn : A.red)
                        }

                        if let dist = venue.distance {
                            Text(dist)
                                .font(.outfitMicro)
                                .foregroundStyle(Color.silver500)
                        }
                    }
                }
                Spacer(minLength: 0)
            }
            .padding(.horizontal, 20)

            // Tag
            if let tag = venue.tag {
                HStack {
                    Text(tag.uppercased())
                        .font(.outfitCaption)
                        .kerning(0.8)
                        .foregroundStyle(Color.silver400)
                        .padding(.horizontal, 9)
                        .padding(.vertical, 4)
                        .background(Color.alfredElevated)
                        .clipShape(RoundedRectangle(cornerRadius: 4, style: .continuous))
                        .overlay(RoundedRectangle(cornerRadius: 4, style: .continuous).strokeBorder(Color.alfredBorder, lineWidth: 0.5))
                }
                .padding(.horizontal, 20)
                .padding(.top, 12)
            }

            // Address
            if let address = venue.address, !address.isEmpty {
                HStack(spacing: 6) {
                    Image(systemName: "mappin")
                        .font(.system(size: 10, weight: .light))
                        .foregroundStyle(Color.silver600)
                    Text(address)
                        .font(.outfit(11, weight: .light))
                        .foregroundStyle(Color.silver500)
                        .lineLimit(2)
                }
                .padding(.horizontal, 20)
                .padding(.top, 12)
            }

            // Divider
            Rectangle()
                .fill(Color.alfredBorder)
                .frame(height: 0.5)
                .padding(.horizontal, 20)
                .padding(.top, 16)

            // Quick Actions
            HStack(spacing: 0) {
                Button {
                    let addr = (venue.address ?? "").addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
                    if let url = URL(string: "maps://?daddr=\(addr)") {
                        UIApplication.shared.open(url)
                    }
                } label: {
                    QuickActionButton(action: .init(icon: "location", label: "Directions", color: Color.silver300))
                }
                .frame(maxWidth: .infinity)

                Button {} label: {
                    QuickActionButton(action: .init(icon: "phone", label: "Call", color: Color.silver400))
                }
                .frame(maxWidth: .infinity)
                .opacity(0.35)

                Button {} label: {
                    QuickActionButton(action: .init(icon: "camera", label: "Instagram", color: Color.silver400))
                }
                .frame(maxWidth: .infinity)
                .opacity(0.35)

                Button {} label: {
                    QuickActionButton(action: .init(icon: "square.and.arrow.up", label: "Share", color: Color.silver400))
                }
                .frame(maxWidth: .infinity)
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)

            // Divider
            Rectangle()
                .fill(Color.alfredBorder)
                .frame(height: 0.5)
                .padding(.horizontal, 20)
                .padding(.top, 16)

            // ── Reserve CTA ──
            Button(action: onBook) {
                Text("RESERVE")
                    .font(.outfitButton)
                    .kerning(0.8)
                    .foregroundStyle(Color.alfredBG)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.silver100)
                    .clipShape(RoundedRectangle(cornerRadius: 4, style: .continuous))
            }
            .padding(.horizontal, 20)
            .padding(.top, 20)

            // Save button
            Button {
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) { liked.toggle() }
            } label: {
                HStack(spacing: 8) {
                    Image(systemName: liked ? "heart.fill" : "heart")
                        .font(.system(size: 13, weight: .light))
                        .foregroundStyle(liked ? A.red : Color.silver500)
                    Text(liked ? "Saved" : "Save")
                        .font(.outfit(13, weight: .regular))
                        .foregroundStyle(Color.silver400)
                }
                .frame(maxWidth: .infinity)
                .frame(height: 44)
                .background(Color.alfredElevated)
                .clipShape(RoundedRectangle(cornerRadius: 4, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: 4, style: .continuous).strokeBorder(Color.alfredBorder, lineWidth: 0.5))
            }
            .padding(.horizontal, 20)
            .padding(.top, 8)

            Spacer().frame(height: max(safeBottom, 20) + 20)
        }
    }
}

// MARK: - MapSearchView

struct MapSearchView: View {
    @Binding var selectedTab: AppTab
    var city: String = "Paris"
    @EnvironmentObject var locationManager: LocationManager
    @StateObject private var vm = MapSearchViewModel()
    @State private var showBooking = false
    @State private var bookingVenueName: String = ""
    @State private var isSearchFocused = false
    @State private var showVenueDetail = false
    @State private var detailVenue: MapVenueModel? = nil
    @FocusState private var searchFieldFocused: Bool

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .top) {

                // ── Layer 1: Dark Map ──
                Map(position: $vm.cameraPosition) {
                    // User location
                    UserAnnotation()

                    // Venue annotations
                    ForEach(vm.filteredVenues) { venue in
                        Annotation("", coordinate: venue.coordinate) {
                            AlfredMapPin(venue: venue, isSelected: vm.selectedVenue?.id == venue.id)
                                .onTapGesture {
                                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                                    vm.selectVenue(venue)
                                    dismissSearch()
                                    withAnimation(.spring(response: 0.45, dampingFraction: 0.92)) {
                                        detailVenue = venue
                                        showVenueDetail = true
                                    }
                                }
                        }
                    }
                }
                .mapStyle(.standard(elevation: .flat, emphasis: .muted, pointsOfInterest: .excludingAll, showsTraffic: false))
                .mapControls { }
                .colorScheme(.dark)
                .ignoresSafeArea()
                .overlay(Color.alfredBG.opacity(0.25).ignoresSafeArea().allowsHitTesting(false))

                // ── Layer 2: Top overlay ──
                VStack(spacing: 8) {
                    // Search bar with home button
                    HStack(spacing: 8) {
                        // Home button
                        Button {
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                            withAnimation(.spring(response: 0.35, dampingFraction: 0.78)) {
                                selectedTab = .home
                            }
                        } label: {
                            Image(systemName: "house")
                                .font(.system(size: 15, weight: .regular))
                                .foregroundStyle(Color.silver300)
                                .frame(width: 38, height: 38)
                                .background(Color.alfredElevated.opacity(0.9))
                                .clipShape(Circle())
                                .overlay(
                                    Circle()
                                        .strokeBorder(Color.alfredBorder, lineWidth: 0.5)
                                )
                        }

                        // Search bar
                        HStack(spacing: 10) {
                            Image(systemName: "magnifyingglass")
                                .font(.system(size: 14, weight: .light))
                                .foregroundStyle(Color.silver500)

                            TextField("Search venues…", text: $vm.searchText)
                                .font(.outfit(13, weight: .light))
                                .foregroundStyle(Color.silver100)
                                .tint(Color.silver300)
                                .focused($searchFieldFocused)
                                .onChange(of: vm.searchText) { _, _ in
                                    vm.applyFilters()
                                    vm.updateSuggestions()
                                }

                            if !vm.searchText.isEmpty {
                                Button {
                                    vm.searchText = ""
                                    vm.applyFilters()
                                    vm.updateSuggestions()
                                } label: {
                                    Image(systemName: "xmark.circle.fill")
                                        .font(.system(size: 14))
                                        .foregroundStyle(Color.silver600)
                                }
                            }
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 9)
                        .background(
                            RoundedRectangle(cornerRadius: 12, style: .continuous)
                                .fill(Color.alfredElevated.opacity(0.9))
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 12, style: .continuous)
                                .strokeBorder(isSearchFocused ? Color.silver600 : Color.alfredBorder, lineWidth: 0.5)
                        )
                    }

                    // Category pills
                    if !isSearchFocused {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 6) {
                                ForEach(VenueMapCategory.allCases, id: \.self) { cat in
                                    let isActive = vm.selectedCategory == cat
                                    Button {
                                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                                        vm.selectedCategory = cat
                                        vm.applyFilters()
                                    } label: {
                                        Text(cat.rawValue)
                                            .font(.outfitLabel)
                                            .fontWeight(isActive ? .medium : .regular)
                                            .foregroundStyle(isActive ? Color.alfredBG : Color.silver500)
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 7)
                                            .background(
                                                RoundedRectangle(cornerRadius: 10, style: .continuous)
                                                    .fill(isActive ? Color.silver100 : Color.alfredElevated.opacity(0.85))
                                            )
                                            .overlay(
                                                RoundedRectangle(cornerRadius: 10, style: .continuous)
                                                    .strokeBorder(
                                                        isActive ? Color.silver100 : Color.alfredBorder,
                                                        lineWidth: 0.5
                                                    )
                                            )
                                    }
                                }
                            }
                            .padding(.horizontal, 2)
                        }
                        .transition(.move(edge: .top).combined(with: .opacity))
                    }

                    // Search suggestions dropdown
                    if isSearchFocused {
                        VStack(spacing: 0) {
                            if vm.searchSuggestions.isEmpty && !vm.searchText.isEmpty {
                                HStack {
                                    Text("No results found")
                                        .font(.outfit(13, weight: .light))
                                        .foregroundStyle(Color.silver600)
                                    Spacer()
                                }
                                .padding(.horizontal, 14)
                                .padding(.vertical, 16)
                            } else {
                                if vm.searchText.isEmpty {
                                    HStack {
                                        Text("POPULAR NEARBY")
                                            .font(.outfitMicro)
                                            .kerning(1.2)
                                            .foregroundStyle(Color.silver600)
                                        Spacer()
                                    }
                                    .padding(.horizontal, 14)
                                    .padding(.top, 12)
                                    .padding(.bottom, 4)
                                }

                                ForEach(vm.searchSuggestions) { venue in
                                    SearchSuggestionRow(venue: venue)
                                        .onTapGesture {
                                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                                            vm.selectVenue(venue)
                                            vm.searchText = venue.name
                                            dismissSearch()
                                        }

                                    if venue.id != vm.searchSuggestions.last?.id {
                                        Rectangle()
                                            .fill(Color.alfredBorder)
                                            .frame(height: 0.5)
                                            .padding(.leading, 66)
                                    }
                                }
                            }
                        }
                        .background(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(Color.alfredElevated.opacity(0.95))
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .strokeBorder(Color.alfredBorder, lineWidth: 0.5)
                        )
                        .transition(.opacity.combined(with: .move(edge: .top)))
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, geo.safeAreaInsets.top + 80)
                .zIndex(30)
                .animation(.spring(response: 0.35, dampingFraction: 0.78), value: isSearchFocused)

                // ── Tap-to-dismiss overlay ──
                if isSearchFocused {
                    Color.alfredBG.opacity(0.4)
                        .ignoresSafeArea()
                        .onTapGesture { dismissSearch() }
                        .zIndex(20)
                }

                // ── Layer 3: Locate button (just above venue cards) ──
                if !isSearchFocused {
                    Button {
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        if let loc = locationManager.userLocation {
                            vm.centerOnUser(loc)
                        } else {
                            locationManager.requestLocation()
                            locationManager.startUpdating()
                        }
                    } label: {
                        Image(systemName: locationManager.userLocation != nil ? "location.fill" : "location")
                            .font(.system(size: 14, weight: .regular))
                            .foregroundStyle(Color.silver300)
                            .frame(width: 38, height: 38)
                            .background(Color.alfredElevated.opacity(0.9))
                            .clipShape(Circle())
                            .overlay(Circle().strokeBorder(Color.alfredBorder, lineWidth: 0.5))
                    }
                    .frame(maxWidth: .infinity, alignment: .trailing)
                    .padding(.trailing, 16)
                    .padding(.bottom, vm.filteredVenues.isEmpty ? (geo.safeAreaInsets.bottom + 30) : (geo.safeAreaInsets.bottom + 255))
                    .frame(maxHeight: .infinity, alignment: .bottom)
                    .zIndex(15)
                }

                // ── Layer 4: Bottom cards (snapping pager) ──
                if !isSearchFocused && !vm.filteredVenues.isEmpty {
                    VenueCardPager(
                        venues: vm.filteredVenues,
                        selectedVenue: $vm.selectedVenue,
                        onBook: { venue in
                            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                            withAnimation(.spring(response: 0.45, dampingFraction: 0.92)) {
                                detailVenue = venue
                                showVenueDetail = true
                            }
                        },
                        onSelect: { venue in
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                            vm.selectVenue(venue)
                        }
                    )
                    .padding(.bottom, geo.safeAreaInsets.bottom + 28)
                    .frame(maxHeight: .infinity, alignment: .bottom)
                    .zIndex(10)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }

                // ── Loading overlay ──
                if vm.isLoading {
                    VStack {
                        Spacer()
                        ProgressView()
                            .tint(Color.silver500)
                        Spacer()
                    }
                    .frame(maxWidth: .infinity)
                    .zIndex(5)
                }

                // ── Venue Detail Overlay ──
                if showVenueDetail, let venue = detailVenue {
                    MapVenueDetailLoader(
                        venue: venue,
                        onDismiss: {
                            withAnimation(.spring(response: 0.4, dampingFraction: 0.92)) {
                                showVenueDetail = false
                            }
                        }
                    )
                    .transition(
                        .asymmetric(
                            insertion: .move(edge: .bottom)
                                .combined(with: .opacity.animation(.easeOut(duration: 0.15))),
                            removal: .move(edge: .bottom)
                                .combined(with: .opacity.animation(.easeIn(duration: 0.1)))
                        )
                    )
                    .zIndex(100)
                }
            }
        }
        .ignoresSafeArea(.container, edges: .top)
        .onChange(of: searchFieldFocused) { _, focused in
            withAnimation(.spring(response: 0.35, dampingFraction: 0.78)) {
                isSearchFocused = focused
            }
            if focused {
                vm.updateSuggestions()
            }
        }
        .onAppear {
            vm.userLocation = locationManager.userLocation
            Task {
                await vm.fetchVenues(city: city)
            }
        }
        .onChange(of: locationManager.userLocation) { _, newLoc in
            vm.userLocation = newLoc
            vm.applyFilters()
        }
        .alert("Booking", isPresented: $showBooking) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("Book: \(bookingVenueName)")
        }
    }

    private func dismissSearch() {
        searchFieldFocused = false
        withAnimation(.spring(response: 0.35, dampingFraction: 0.78)) {
            isSearchFocused = false
        }
    }
}

// MARK: - Preview

#Preview {
    MapSearchView(selectedTab: .constant(.search))
        .environmentObject(LocationManager())
        .preferredColorScheme(.dark)
}
