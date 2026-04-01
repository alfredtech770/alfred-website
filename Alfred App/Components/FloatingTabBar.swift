//
//  FloatingTabBar.swift
//  Alfred App
//
//  Floating bottom tab bar with five tabs.
//

import SwiftUI

struct FloatingTabBar: View {
    @Binding var activeTab: AppTab
    var onBack: (() -> Void)? = nil

    private let tabs: [(AppTab, String, String)] = [
        (.home,      "house.fill",       "Home"),
        (.search,    "magnifyingglass",  "Search"),
        (.concierge, "message.fill",     "Concierge"),
        (.bookings,  "calendar",         "Bookings"),
        (.profile,   "person.fill",      "Profile"),
    ]

    var body: some View {
        HStack(spacing: 0) {
            if let onBack = onBack {
                Button(action: onBack) {
                    VStack(spacing: 4) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundStyle(A.s1)
                        Text("Back")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundStyle(A.s5)
                    }
                    .frame(maxWidth: .infinity)
                }
            }

            ForEach(tabs, id: \.0) { tab, icon, label in
                Button {
                    withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                        activeTab = tab
                    }
                } label: {
                    VStack(spacing: 4) {
                        Image(systemName: icon)
                            .font(.system(size: 18, weight: activeTab == tab ? .semibold : .regular))
                            .foregroundStyle(activeTab == tab ? A.gn : A.s5)
                        Text(label)
                            .font(.system(size: 10, weight: .medium))
                            .foregroundStyle(activeTab == tab ? A.gn : A.s5)
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        }
        .padding(.vertical, 10)
        .padding(.bottom, 16)
        .background(
            RoundedRectangle(cornerRadius: 28, style: .continuous)
                .fill(A.el.opacity(0.96))
                .overlay(
                    RoundedRectangle(cornerRadius: 28, style: .continuous)
                        .strokeBorder(A.bd.opacity(0.5), lineWidth: 0.5)
                )
                .shadow(color: .black.opacity(0.3), radius: 20, y: 8)
        )
        .padding(.horizontal, 12)
    }
}
