//
//  CarService.swift
//  Alfred App
//
//  Car service for database operations.
//

import Foundation

class CarService {
    private var supabase: SupabaseManager { SupabaseManager.shared }

    @MainActor
    func getCars(city: String? = nil) async throws -> [Car] {
        var query = supabase.database
            .from("cars")
            .select()
            .eq("is_active", value: true)

        if let city = city {
            query = query.eq("city", value: city)
        }

        let response: [Car] = try await query
            .order("rating", ascending: false)
            .limit(20)
            .execute()
            .value

        return response
    }
}
