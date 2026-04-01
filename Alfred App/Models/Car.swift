//
//  Car.swift
//  Alfred App
//
//  Car data model (Supabase "cars" table).
//

import Foundation

struct Car: Identifiable, Codable, Hashable {
    let id: UUID
    let name: String
    let brand: String?
    let city: String?
    let category: String?
    let heroImageURL: String?
    let rating: Double?
    let pricePerDay: Int
    let hp: Int?
    let tags: [String]?
    let isFeatured: Bool?
    let isPartner: Bool?
    let address: String?
    let latitude: Double?
    let longitude: Double?

    enum CodingKeys: String, CodingKey {
        case id, name, brand, city, category, rating, hp, tags, address, latitude, longitude
        case heroImageURL = "hero_image_url"
        case pricePerDay = "price_1_day"
        case isFeatured = "is_featured"
        case isPartner = "is_partner"
    }

    /// Display name (brand + model)
    var displayName: String {
        if let brand = brand, !brand.isEmpty {
            return "\(brand) \(name)"
        }
        return name
    }

    /// Convert to CDCar for the detail view
    func toCDCar() -> CDCar {
        CDCar(
            id: id.hashValue,
            name: displayName,
            brand: brand ?? "",
            heroImageURL: heroImageURL,
            pricePerDay: pricePerDay,
            hp: hp,
            city: city
        )
    }

    static func == (lhs: Car, rhs: Car) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}

/// Detail-ready car model used by CarDetailView
struct CDCar: Identifiable {
    let id: Int
    let name: String
    let brand: String
    let heroImageURL: String?
    let pricePerDay: Int
    let hp: Int?
    let city: String?
}
