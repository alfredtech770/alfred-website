//
//  RestaurantService.swift
//  Alfred App
//
//  Restaurant service for database operations.
//

import Foundation
// PostgREST provided by local stub (Stubs/ folder)

class RestaurantService {
    private var supabase: SupabaseManager { SupabaseManager.shared }

    @MainActor
    func getRestaurants(city: String? = nil) async throws -> [Restaurant] {
        var query = supabase.database
            .from("restaurants")
            .select()
            .eq("is_active", value: true)

        if let city = city {
            query = query.eq("city", value: city)
        }

        let response: [Restaurant] = try await query
            .order("rating", ascending: false)
            .limit(20)
            .execute()
            .value

        return response
    }
}
