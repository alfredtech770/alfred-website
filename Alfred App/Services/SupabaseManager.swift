//
//  SupabaseManager.swift
//  Alfred App
//
//  Singleton managing Supabase client — database + auth.
//  Uses local stubs in Stubs/ folder. Replace with real Supabase SDK later.
//

import Foundation
// PostgREST and Auth provided by local stubs (Stubs/ folder)

class SupabaseManager {
    static let shared = SupabaseManager()

    private let supabaseURL = "https://fbdgbnnkgyljehtccgaq.supabase.co"
    private let supabaseKey = "YOUR_SUPABASE_ANON_KEY_HERE"

    /// PostgREST client for database queries
    lazy var database: PostgrestClient = {
        PostgrestClient(
            url: URL(string: "\(supabaseURL)/rest/v1")!,
            headers: [
                "apikey": supabaseKey,
                "Authorization": "Bearer \(supabaseKey)"
            ]
        )
    }()

    /// Auth client
    lazy var auth: AuthClient = {
        AuthClient()
    }()

    private init() {}
}
