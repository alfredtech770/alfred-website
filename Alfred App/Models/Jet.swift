//
//  Jet.swift
//  Alfred App
//
//  Jet data model (Supabase "jets" table).
//

import Foundation

struct Jet: Identifiable, Codable, Hashable {
    let id: UUID
    let name: String
    let city: String
    let category: String?
    let jetType: String?
    let heroImageURL: String?
    let rating: Double?
    let priceLevel: Int?
    let pricePerHour: String?
    let passengers: Int?
    let range: String?
    let isFeatured: Bool?
    let isPartner: Bool?
    let address: String?
    let latitude: Double?
    let longitude: Double?

    enum CodingKeys: String, CodingKey {
        case id, name, city, category, rating, passengers, range, address, latitude, longitude
        case jetType = "jet_type"
        case heroImageURL = "hero_image_url"
        case priceLevel = "price_level"
        case pricePerHour = "price_per_hour"
        case isFeatured = "is_featured"
        case isPartner = "is_partner"
    }

    static func == (lhs: Jet, rhs: Jet) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}
