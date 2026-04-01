//
//  ProfileView.swift
//  Alfred App
//
//  Profile & Settings screen — Alfred Centurion Edition
//  SF Pro typography, A.* design tokens
//

import SwiftUI

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - ProfileView
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

struct ProfileView: View {
    @Binding var selectedTab: AppTab

    // ── State ──
    @State private var showLogoutConfirm = false

    // ── Body ──
    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(spacing: 0) {
                // Header
                headerSection
                    .padding(.top, 60)
                    .padding(.bottom, 32)

                // Menu Sections
                VStack(spacing: 12) {
                    menuSection(title: "ACCOUNT", items: [
                        MenuItem(icon: "person.fill",        label: "Personal Info"),
                        MenuItem(icon: "creditcard.fill",    label: "Payment Methods"),
                        MenuItem(icon: "bell.fill",          label: "Notifications"),
                        MenuItem(icon: "lock.fill",          label: "Privacy & Security"),
                    ])

                    menuSection(title: "PREFERENCES", items: [
                        MenuItem(icon: "globe",              label: "Language & Region"),
                        MenuItem(icon: "moon.fill",          label: "Appearance"),
                        MenuItem(icon: "star.fill",          label: "Membership"),
                    ])

                    menuSection(title: "SUPPORT", items: [
                        MenuItem(icon: "questionmark.circle.fill", label: "Help Center"),
                        MenuItem(icon: "envelope.fill",            label: "Contact Us"),
                        MenuItem(icon: "doc.text.fill",            label: "Terms & Privacy"),
                    ])
                }
                .padding(.horizontal, 20)

                // Log Out
                Button {
                    showLogoutConfirm = true
                } label: {
                    Text("Log Out")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(Color(hex: "FF453A"))
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(
                            RoundedRectangle(cornerRadius: 14)
                                .fill(Color(hex: "FF453A").opacity(0.1))
                        )
                }
                .padding(.horizontal, 20)
                .padding(.top, 24)

                // App Version
                Text("Alfred v1.0.0")
                    .font(.system(size: 12, weight: .regular))
                    .foregroundStyle(A.s6)
                    .padding(.top, 20)
                    .padding(.bottom, 120)
            }
        }
        .background(A.bg.ignoresSafeArea())
        .confirmationDialog("Log out of Alfred?", isPresented: $showLogoutConfirm, titleVisibility: .visible) {
            Button("Log Out", role: .destructive) {
                // TODO: Implement logout
            }
            Button("Cancel", role: .cancel) {}
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: – Header
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    private var headerSection: some View {
        VStack(spacing: 14) {
            // Avatar
            Circle()
                .fill(A.srf)
                .frame(width: 88, height: 88)
                .overlay(
                    Image(systemName: "person.fill")
                        .font(.system(size: 36, weight: .light))
                        .foregroundStyle(A.s5)
                )

            // Name
            Text("Alfred Member")
                .font(.system(size: 22, weight: .bold))
                .foregroundStyle(A.s1)

            // Membership badge
            HStack(spacing: 6) {
                Image(systemName: "crown.fill")
                    .font(.system(size: 11))
                    .foregroundStyle(A.gn)
                Text("GOLD MEMBER")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundStyle(A.gn)
                    .tracking(1.2)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 6)
            .background(
                Capsule().fill(A.gn.opacity(0.12))
            )
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: – Menu Section
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    private func menuSection(title: String, items: [MenuItem]) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            // Section title
            Text(title)
                .font(.system(size: 11, weight: .bold))
                .foregroundStyle(A.s5)
                .tracking(1.5)
                .padding(.horizontal, 16)
                .padding(.bottom, 8)

            // Items
            VStack(spacing: 0) {
                ForEach(items) { item in
                    Button {
                        // TODO: Navigate to detail
                    } label: {
                        HStack(spacing: 14) {
                            Image(systemName: item.icon)
                                .font(.system(size: 16, weight: .medium))
                                .foregroundStyle(A.s4)
                                .frame(width: 24)

                            Text(item.label)
                                .font(.system(size: 15, weight: .medium))
                                .foregroundStyle(A.s1)

                            Spacer()

                            Image(systemName: "chevron.right")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundStyle(A.s6)
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 15)
                    }

                    if item.id != items.last?.id {
                        Rectangle()
                            .fill(A.bd)
                            .frame(height: 0.5)
                            .padding(.leading, 54)
                    }
                }
            }
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(A.srf)
            )
        }
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - MenuItem Model
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

private struct MenuItem: Identifiable {
    let id = UUID()
    let icon: String
    let label: String
}
