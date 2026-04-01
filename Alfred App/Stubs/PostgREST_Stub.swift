//
//  PostgREST_Stub.swift
//  Alfred App
//
//  Local stub for the PostgREST module (supabase-swift).
//  Replace with real SPM package: https://github.com/supabase/supabase-swift
//
//  NOTE: Remove this file and restore `import PostgREST` in all service
//  files once you add the real Supabase package via Xcode > File > Add Package Dependencies.
//

import Foundation

// MARK: - PostgrestClient

class PostgrestClient: @unchecked Sendable {
    private let url: URL
    private let headers: [String: String]

    init(url: URL, headers: [String: String] = [:]) {
        self.url = url
        self.headers = headers
    }

    func from(_ table: String) -> PostgrestQueryBuilder {
        PostgrestQueryBuilder()
    }
}

// MARK: - PostgrestQueryBuilder

class PostgrestQueryBuilder: @unchecked Sendable {
    func select(_ columns: String = "*") -> PostgrestFilterBuilder {
        PostgrestFilterBuilder()
    }

    func update(_ values: [String: String]) -> PostgrestFilterBuilder {
        PostgrestFilterBuilder()
    }
}

// MARK: - PostgrestFilterBuilder

class PostgrestFilterBuilder: @unchecked Sendable {
    func eq(_ column: String, value: Any) -> PostgrestFilterBuilder { self }
    func neq(_ column: String, value: Any) -> PostgrestFilterBuilder { self }
    func ilike(_ column: String, pattern: String) -> PostgrestFilterBuilder { self }
    func or(_ filters: String) -> PostgrestFilterBuilder { self }
    func `in`(_ column: String, values: [Any]) -> PostgrestFilterBuilder { self }
    func order(_ column: String, ascending: Bool = true) -> PostgrestFilterBuilder { self }
    func limit(_ count: Int) -> PostgrestFilterBuilder { self }
    func range(from: Int, to: Int) -> PostgrestFilterBuilder { self }

    func execute<T: Decodable>() async throws -> PostgrestTypedResponse<T> {
        PostgrestTypedResponse<T>()
    }

    @discardableResult
    func execute() async throws -> PostgrestVoidResponse {
        PostgrestVoidResponse()
    }
}

// MARK: - PostgrestTypedResponse

/// Response wrapper — `.value` returns the decoded type.
/// Usage: `let items: [Model] = try await query.execute().value`
struct PostgrestTypedResponse<T: Decodable> {
    var value: T {
        // Stub: return empty array for array types
        if let emptyArray = [Any]() as? T {
            return emptyArray
        }
        fatalError("PostgREST stub: replace with real Supabase SDK to get actual data")
    }
}

// MARK: - PostgrestVoidResponse

/// For mutations (update/delete) where no return value is needed
struct PostgrestVoidResponse {}
