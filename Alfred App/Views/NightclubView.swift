//
//  NightclubView.swift
//  Alfred App
//
//  Nightlife browse view — grid of nightclub cards with filters.
//

import SwiftUI

struct NightclubView: View {
    @Binding var selectedCity: String
    @Binding var isFilterVisible: Bool

    @State private var venues: [Nightclub] = []
    @State private var isLoading = true
    private let service = NightclubService()

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()

            ScrollView {
                LazyVStack(spacing: 16) {
                    // Header
                    HStack {
                        Text("Nightlife")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundStyle(A.s1)
                        Spacer()
                        Button(action: { isFilterVisible.toggle() }) {
                            Image(systemName: "slider.horizontal.3")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundStyle(A.s4)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 20)

                    if isLoading {
                        ProgressView().tint(A.s5).padding(.top, 40)
                    } else if venues.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "moon.stars")
                                .font(.system(size: 36, weight: .ultraLight))
                                .foregroundStyle(A.s6)
                            Text("No nightlife found")
                                .font(.system(size: 14))
                                .foregroundStyle(A.s5)
                        }
                        .padding(.top, 60)
                    } else {
                        ForEach(venues) { nc in
                            NavigationLink(value: nc) {
                                AlfredLandscapeCard(nightlife: nc)
                            }
                            .buttonStyle(.plain)
                        }
                        .padding(.horizontal, 20)
                    }

                    Spacer().frame(height: 120)
                }
            }
        }
        .task { await loadVenues() }
        .onChange(of: selectedCity) { _, _ in Task { await loadVenues() } }
    }

    private func loadVenues() async {
        isLoading = true
        do {
            venues = try await service.getNightclubs(city: selectedCity)
        } catch {
            venues = []
        }
        isLoading = false
    }
}
