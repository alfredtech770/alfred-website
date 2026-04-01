//
//  Accommodation.swift
//  Alfred App
//
//  Accommodation data model (Supabase "accommodations" table).
//

import Foundation

struct Accommodation: Identifiable, Codable, Hashable {
    let id: UUID
    let name: String
    let city: String?
    let category: String?
    let accommodationType: String?
    let neighborhood: String?
    let heroImageURL: String?
    let rating: Double?
    let priceLevel: Int?
    let pricePerNight: String?
    let isFeatured: Bool?
    let isPartner: Bool?
    let address: String?
    let latitude: Double?
    let longitude: Double?

    enum CodingKeys: String, CodingKey {
        case id, name, city, category, neighborhood, rating, address, latitude, longitude
        case accommodationType = "type"
        case heroImageURL = "hero_image_url"
        case priceLevel = "price_level"
        case pricePerNight = "price_per_night"
        case isFeatured = "is_featured"
        case isPartner = "is_partner"
    }

    static func == (lhs: Accommodation, rhs: Accommodation) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}
