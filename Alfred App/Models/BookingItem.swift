//
//  BookingItem.swift
//  Alfred App
//
//  Booking model returned from the backend.
//

import Foundation

struct BookingItem: Identifiable, Codable {
    let id: String
    let venueName: String
    let serviceType: String
    let imageURL: String?
    let date: Date
    let time: String
    let guests: Int
    let status: String
    let location: String?
    let city: String?

    enum CodingKeys: String, CodingKey {
        case id
        case venueName = "venue_name"
        case serviceType = "service_type"
        case imageURL = "image_url"
        case date, time, guests, status, location, city
    }
}
