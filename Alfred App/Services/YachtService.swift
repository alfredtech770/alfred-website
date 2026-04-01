//
//  YachtService.swift
//  Alfred App
//
//  Yacht service for database operations.
//

import Foundation

class YachtService {
    private var supabase: SupabaseManager { SupabaseManager.shared }

    @MainActor
    func getYachts(city: String? = nil) async throws -> [Yacht] {
        var query = supabase.database
            .from("yachts")
            .select()
            .eq("is_active", value: true)

        if let city = city {
            query = query.eq("city", value: city)
        }

        let response: [Yacht] = try await query
            .order("rating", ascending: false)
            .limit(20)
            .execute()
            .value

        return response
    }
}
