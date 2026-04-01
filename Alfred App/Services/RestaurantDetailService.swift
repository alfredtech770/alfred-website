//
//  RestaurantDetailService.swift
//  Alfred App
//
//  Fetches full restaurant detail (restaurant + dishes + reviews).
//

import Foundation
// PostgREST provided by local stub (Stubs/ folder)

class RestaurantDetailService {
    private var supabase: SupabaseManager { SupabaseManager.shared }

    @MainActor
    func getRestaurantDetail(id: UUID) async throws -> RestaurantDetail {
        let restaurants: [Restaurant] = try await supabase.database
            .from("restaurants")
            .select()
            .eq("id", value: id.uuidString)
            .limit(1)
            .execute()
            .value

        guard let restaurant = restaurants.first else {
            throw NSError(domain: "RestaurantDetailService", code: 404, userInfo: [NSLocalizedDescriptionKey: "Restaurant not found"])
        }

        // Attempt to load dishes
        let dishes: [RestaurantDish] = (try? await supabase.database
            .from("restaurant_dishes")
            .select()
            .eq("restaurant_id", value: id.uuidString)
            .execute()
            .value) ?? []

        // Attempt to load reviews
        let reviews: [RestaurantReview] = (try? await supabase.database
            .from("restaurant_reviews")
            .select()
            .eq("restaurant_id", value: id.uuidString)
            .execute()
            .value) ?? []

        return RestaurantDetail(restaurant: restaurant, dishes: dishes, reviews: reviews)
    }

    /// Convert a RestaurantDetail into the view-layer RDRestaurant
    static func toRDRestaurant(_ detail: RestaurantDetail) -> RDRestaurant {
        let r = detail.restaurant
        return RDRestaurant(
            id: r.id,
            name: r.name,
            cuisine: r.cuisine,
            heroImageURL: r.heroImageURL,
            rating: r.rating,
            priceLevel: r.priceLevel,
            address: r.address,
            city: r.city,
            dishes: detail.dishes,
            reviews: detail.reviews
        )
    }
}
