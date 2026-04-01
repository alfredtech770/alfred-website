//
//  RestaurantsView.swift
//  Alfred App
//
//  Dining browse view — restaurant list with navigation.
//

import SwiftUI

struct RestaurantsView: View {
    @Binding var externalNavigationPath: NavigationPath
    @Binding var selectedCity: String
    @Binding var isFilterVisible: Bool

    @State private var venues: [Restaurant] = []
    @State private var isLoading = true
    private let service = RestaurantService()

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()

            ScrollView {
                LazyVStack(spacing: 16) {
                    HStack {
                        Text("Dining")
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
                            Image(systemName: "fork.knife")
                                .font(.system(size: 36, weight: .ultraLight))
                                .foregroundStyle(A.s6)
                            Text("No restaurants found")
                                .font(.system(size: 14))
                                .foregroundStyle(A.s5)
                        }.padding(.top, 60)
                    } else {
                        ForEach(venues) { r in
                            NavigationLink(value: r) {
                                AlfredBigCard(restaurant: r, fullWidth: true)
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
        do { venues = try await service.getRestaurants(city: selectedCity) } catch { venues = [] }
        isLoading = false
    }
}
