//
//  Wellness.swift
//  Alfred App
//
//  Wellness data model (Supabase "wellness" table).
//

import Foundation

struct Wellness: Identifiable, Codable, Hashable {
    let id: UUID
    let name: String
    let city: String?
    let category: String
    let type: String?
    let heroImageURL: String?
    let rating: Double?
    let priceLevel: Int?
    let duration: String?
    let isFeatured: Bool?
    let isPartner: Bool?
    let isActive: Bool?
    let address: String?
    let tags: [String]?
    let latitude: Double?
    let longitude: Double?

    enum CodingKeys: String, CodingKey {
        case id, name, city, category, type, rating, duration, address, tags, latitude, longitude
        case heroImageURL = "hero_image_url"
        case priceLevel = "price_level"
        case isFeatured = "is_featured"
        case isPartner = "is_partner"
        case isActive = "is_active"
    }

    var priceLevelDisplay: String {
        switch priceLevel ?? 2 {
        case 1: return "€"
        case 3: return "€€€"
        case 4: return "€€€€"
        default: return "€€"
        }
    }

    static func == (lhs: Wellness, rhs: Wellness) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}
