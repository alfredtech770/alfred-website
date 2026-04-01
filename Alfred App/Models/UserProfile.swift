//
//  UserProfile.swift
//  Alfred App
//
//  User profile model returned from UserService.
//

import Foundation

struct UserProfile: Codable {
    let id: String
    let firstName: String
    let lastName: String?
    let email: String?
    let avatarURL: String?

    enum CodingKeys: String, CodingKey {
        case id
        case firstName = "first_name"
        case lastName = "last_name"
        case email
        case avatarURL = "avatar_url"
    }
}
