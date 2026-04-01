//
//  Nightclub.swift
//  Alfred App
//
//  Nightclub data model (Supabase "nightclubs" table).
//

import Foundation

struct Nightclub: Identifiable, Codable, Hashable {
    let id: UUID
    let name: String
    let city: String
    let category: String?
    let heroImageURL: String?
    let rating: Double?
    let tags: [String]?
    let isFeatured: Bool?
    let isPartner: Bool?
    let music: String?
    let address: String?
    let vibe: String?
    let priceLevel: Int?
    let entryType: String?
    let logoURL: String?
    let dressCode: String?
    let crowdType: String?
    let bestNight: String?
    let capacity: Int?
    let reservation: String?
    let agePolicy: String?
    let openingHours: String?

    enum CodingKeys: String, CodingKey {
        case id, name, city, category, rating, tags, music, address, vibe, capacity, reservation
        case heroImageURL = "hero_image_url"
        case isFeatured = "is_featured"
        case isPartner = "is_partner"
        case priceLevel = "price_level"
        case entryType = "entry_type"
        case logoURL = "logo_url"
        case dressCode = "dress_code"
        case crowdType = "crowd_type"
        case bestNight = "best_night"
        case agePolicy = "age_policy"
        case openingHours = "opening_hours"
    }

    static func == (lhs: Nightclub, rhs: Nightclub) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}
