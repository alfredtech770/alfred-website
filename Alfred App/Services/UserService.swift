//
//  UserService.swift
//  Alfred App
//
//  User service for profile operations.
//

import Foundation

class UserService {
    private var supabase: SupabaseManager { SupabaseManager.shared }

    @MainActor
    func getProfile(userId: String) async throws -> UserProfile {
        let profiles: [UserProfile] = try await supabase.database
            .from("profiles")
            .select()
            .eq("id", value: userId)
            .limit(1)
            .execute()
            .value

        guard let profile = profiles.first else {
            throw NSError(domain: "UserService", code: 404, userInfo: [NSLocalizedDescriptionKey: "Profile not found"])
        }
        return profile
    }
}
