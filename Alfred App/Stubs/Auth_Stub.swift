//
//  Auth_Stub.swift
//  Alfred App
//
//  Local stub for the Auth module (supabase-swift).
//  Replace with real SPM package: https://github.com/supabase/supabase-swift
//
//  NOTE: Remove this file once you add the real Supabase Swift package via
//  File > Add Package Dependencies in Xcode.
//

import Foundation

// MARK: - AuthClient

class AuthClient {
    var session: Session {
        get async throws {
            throw AuthError.notAuthenticated
        }
    }

    init() {}
}

// MARK: - Session

struct Session {
    let user: AuthUser
    let accessToken: String

    init(user: AuthUser = AuthUser(), accessToken: String = "") {
        self.user = user
        self.accessToken = accessToken
    }
}

// MARK: - AuthUser

struct AuthUser {
    let id: UUID
    let email: String?

    init(id: UUID = UUID(), email: String? = nil) {
        self.id = id
        self.email = email
    }
}

// MARK: - AuthError

enum AuthError: Error {
    case notAuthenticated
    case invalidCredentials
    case networkError
}
