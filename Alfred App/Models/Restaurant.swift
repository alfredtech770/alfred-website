//
//  Restaurant.swift
//  Alfred App
//
//  Restaurant data model (Supabase "restaurants" table).
//

import Foundation

struct Restaurant: Identifiable, Codable, Hashable {
    let id: UUID
    let name: String
    let city: String?
    let category: String?
    let cuisine: String?
    let heroImageURL: String?
    let rating: Double?
    let priceLevel: Int?
    let tags: [String]?
    let isFeatured: Bool?
    let isPartner: Bool?
    let availableTonight: Bool?
    let address: String?
    let latitude: Double?
    let longitude: Double?

    enum CodingKeys: String, CodingKey {
        case id, name, city, category, cuisine, rating, tags, address, latitude, longitude
        case heroImageURL = "hero_image_url"
        case priceLevel = "price_level"
        case isFeatured = "is_featured"
        case isPartner = "is_partner"
        case availableTonight = "available_tonight"
    }

    static func == (lhs: Restaurant, rhs: Restaurant) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}
