//
//  Experience.swift
//  Alfred App
//
//  Experience model (used in WellnessView detail navigation)
//  and AlfredExperience (backward-compatible card model).
//

import Foundation

struct Experience: Identifiable, Hashable {
    let id: UUID

    static func == (lhs: Experience, rhs: Experience) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }
}

/// Backward-compatible experience model used for card components
struct AlfredExperience: Identifiable {
    let id = UUID()
    let imageName: String
    let badge: String?
    let venue: String
    let subtitle: String
    let price: String?
    let stat1Label: String
    let stat1Value: String
    let stat2Label: String
    let stat2Value: String
}
