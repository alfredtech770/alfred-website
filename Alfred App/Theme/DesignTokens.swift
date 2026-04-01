//
//  DesignTokens.swift
//  Alfred App
//
//  App-wide design tokens — brand colors, surfaces, text shades.
//  Usage: A.bg, A.el, A.srf, A.bd, A.s1–A.s7, A.gn, A.gold
//

import SwiftUI

enum A {
    // Backgrounds & surfaces
    static let bg   = Color(hex: "111113")   // Main background
    static let el   = Color(hex: "18181B")   // Elevated surface
    static let srf  = Color(hex: "1C1C20")   // Surface (cards)
    static let bd   = Color(hex: "2C2C31")   // Border

    // Text / shade scale (light → dark)
    static let s1   = Color(hex: "F4F4F5")   // Primary text
    static let s2   = Color(hex: "E4E4E7")   // Secondary text
    static let s3   = Color(hex: "D4D4D8")   // Tertiary text
    static let s4   = Color(hex: "A1A1AA")   // Muted text
    static let s5   = Color(hex: "71717A")   // Subtle text
    static let s6   = Color(hex: "52525B")   // Disabled text
    static let s7   = Color(hex: "3F3F46")   // Very subtle / dividers

    // Brand accents
    static let gn   = Color(hex: "5A8A6A")   // Alfred Green
    static let gold = Color(hex: "C9A96E")   // Alfred Gold

    // UI states
    static let activeFilterBg = Color(hex: "5A8A6A").opacity(0.15)
}
