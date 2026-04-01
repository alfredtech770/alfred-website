//
//  JetService.swift
//  Alfred App
//
//  Jet service for database operations.
//

import Foundation

class JetService {
    private var supabase: SupabaseManager { SupabaseManager.shared }

    @MainActor
    func getJets(city: String? = nil) async throws -> [Jet] {
        var query = supabase.database
            .from("jets")
            .select()
            .eq("is_active", value: true)

        if let city = city {
            query = query.eq("city", value: city)
        }

        let response: [Jet] = try await query
            .order("rating", ascending: false)
            .limit(20)
            .execute()
            .value

        return response
    }
}
