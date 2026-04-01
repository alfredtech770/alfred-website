//
//  Yacht.swift
//  Alfred App
//
//  Yacht data model (Supabase "yachts" table).
//

import Foundation

struct Yacht: Identifiable, Codable, Hashable {
    let id: UUID
    let name: String
    let city: String
    let category: String?
    let yachtType: String?
    let heroImageURL: String?
    let rating: Double?
    let priceLevel: Int?
    let capacity: Int?
    let isFeatured: Bool?
    let isPartner: Bool?
    let address: String?
    let latitude: Double?
    let longitude: Double?

    enum CodingKeys: String, CodingKey {
        case id, name, city, category, rating, capacity, address, latitude, longitude
        case yachtType = "yacht_type"
        case heroImageURL = "hero_image_url"
        case priceLevel = "price_level"
        case isFeatured = "is_featured"
        case isPartner = "is_partner"
    }

    static func == (lhs: Yacht, rhs: Yacht) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}
