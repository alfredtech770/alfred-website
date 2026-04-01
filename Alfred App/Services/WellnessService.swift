//
//  WellnessService.swift
//  Alfred App
//
//  Wellness service for database operations.
//

import Foundation

class WellnessService {
    private var supabase: SupabaseManager { SupabaseManager.shared }

    @MainActor
    func getWellness(city: String? = nil) async throws -> [Wellness] {
        var query = supabase.database
            .from("wellness")
            .select()
            .eq("is_active", value: true)

        if let city = city {
            query = query.eq("city", value: city)
        }

        let response: [Wellness] = try await query
            .order("rating", ascending: false)
            .limit(20)
            .execute()
            .value

        return response
    }

    @MainActor
    func getFeaturedWellness(city: String? = nil) async throws -> [Wellness] {
        var query = supabase.database
            .from("wellness")
            .select()
            .eq("is_active", value: true)
            .eq("is_featured", value: true)

        if let city = city {
            query = query.eq("city", value: city)
        }

        let response: [Wellness] = try await query
            .order("rating", ascending: false)
            .limit(8)
            .execute()
            .value

        return response
    }
}
