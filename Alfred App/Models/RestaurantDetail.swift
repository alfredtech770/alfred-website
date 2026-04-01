//
//  RestaurantDetail.swift
//  Alfred App
//
//  Full restaurant detail + the view-layer RDRestaurant model.
//

import Foundation

/// Full detail model returned from restaurant detail API
struct RestaurantDetail: Codable {
    let restaurant: Restaurant
    let dishes: [RestaurantDish]
    let reviews: [RestaurantReview]
}

struct RestaurantDish: Identifiable, Codable {
    let id: UUID
    let name: String
    let description: String?
    let price: String?
    let imageURL: String?

    enum CodingKeys: String, CodingKey {
        case id, name, description, price
        case imageURL = "image_url"
    }

    init(id: UUID = UUID(), name: String, description: String? = nil, price: String? = nil, imageURL: String? = nil) {
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.imageURL = imageURL
    }
}

struct RestaurantReview: Identifiable, Codable {
    let id: UUID
    let author: String?
    let rating: Double?
    let text: String?

    init(id: UUID = UUID(), author: String? = nil, rating: Double? = nil, text: String? = nil) {
        self.id = id
        self.author = author
        self.rating = rating
        self.text = text
    }
}

/// View-layer restaurant model used by RestaurantDetailView
struct RDRestaurant: Identifiable {
    let id: UUID
    let name: String
    let cuisine: String?
    let heroImageURL: String?
    let rating: Double?
    let priceLevel: Int?
    let address: String?
    let city: String?
    let dishes: [RestaurantDish]
    let reviews: [RestaurantReview]
}
