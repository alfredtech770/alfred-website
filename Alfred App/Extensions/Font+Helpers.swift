//
//  Font+Helpers.swift
//  Alfred App
//
//  Font helpers: .sf() for SF Pro, .outfit() for Outfit custom font.
//

import SwiftUI

extension Font {
    /// SF Pro shorthand — `.sf(15, weight: .medium)`
    static func sf(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .system(size: size, weight: weight)
    }

    /// Outfit custom font — `.outfit(17, weight: .bold)`
    static func outfit(_ size: CGFloat, weight: Font.Weight = .regular) -> Font {
        .custom("Outfit", size: size).weight(weight)
    }
}
