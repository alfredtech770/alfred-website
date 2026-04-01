//
//  AccommodationService.swift
//  Alfred App
//
//  Accommodation service for database operations.
//

import Foundation

class AccommodationService {
    private var supabase: SupabaseManager { SupabaseManager.shared }

    @MainActor
    func getAccommodations(city: String? = nil) async throws -> [Accommodation] {
        var query = supabase.database
            .from("accommodations")
            .select()
            .eq("is_active", value: true)

        if let city = city {
            query = query.eq("city", value: city)
        }

        let response: [Accommodation] = try await query
            .order("rating", ascending: false)
            .limit(20)
            .execute()
            .value

        return response
    }
}
