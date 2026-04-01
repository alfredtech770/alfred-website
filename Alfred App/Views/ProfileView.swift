//
//  ProfileView.swift
//  Alfred App
//

import SwiftUI

struct ProfileView: View {
    @Binding var selectedTab: AppTab

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    Spacer().frame(height: 40)

                    // Avatar
                    Circle()
                        .fill(A.srf)
                        .frame(width: 88, height: 88)
                        .overlay(
                            Image(systemName: "person.fill")
                                .font(.system(size: 36))
                                .foregroundStyle(A.s5)
                        )

                    Text("Alfred Member")
                        .font(.system(size: 22, weight: .bold))
                        .foregroundStyle(A.s1)

                    // Membership badge
                    Text("GOLD MEMBER")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(A.gn)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 6)
                        .background(Capsule().fill(A.gn.opacity(0.12)))

                    // Menu items
                    VStack(spacing: 0) {
                        profileRow(icon: "person.fill", label: "Personal Info")
                        profileRow(icon: "creditcard.fill", label: "Payment Methods")
                        profileRow(icon: "bell.fill", label: "Notifications")
                        profileRow(icon: "lock.fill", label: "Privacy & Security")
                    }
                    .background(RoundedRectangle(cornerRadius: 16).fill(A.srf))
                    .padding(.horizontal, 20)

                    VStack(spacing: 0) {
                        profileRow(icon: "globe", label: "Language & Region")
                        profileRow(icon: "star.fill", label: "Membership")
                        profileRow(icon: "questionmark.circle.fill", label: "Help Center")
                        profileRow(icon: "doc.text.fill", label: "Terms & Privacy")
                    }
                    .background(RoundedRectangle(cornerRadius: 16).fill(A.srf))
                    .padding(.horizontal, 20)

                    // Log Out
                    Button(action: {}) {
                        Text("Log Out")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundStyle(.red)
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                            .background(RoundedRectangle(cornerRadius: 14).fill(Color.red.opacity(0.1)))
                    }
                    .padding(.horizontal, 20)

                    Text("Alfred v1.0.0")
                        .font(.system(size: 12))
                        .foregroundStyle(A.s6)

                    Spacer().frame(height: 100)
                }
            }
        }
    }

    private func profileRow(icon: String, label: String) -> some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundStyle(A.s5)
                .frame(width: 24)
            Text(label)
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
}
