//
//  ExoticCarsView.swift
//  Alfred App
//
//  Exotic cars browse view.
//

import SwiftUI

struct ExoticCarsView: View {
    @Binding var selectedCity: String

    @State private var venues: [Car] = []
    @State private var isLoading = true
    private let service = CarService()

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()

            ScrollView {
                LazyVStack(spacing: 16) {
                    HStack {
                        Text("Exotic Cars")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundStyle(A.s1)
                        Spacer()
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 20)

                    if isLoading {
                        ProgressView().tint(A.s5).padding(.top, 40)
                    } else if venues.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "car.fill")
                                .font(.system(size: 36, weight: .ultraLight))
                                .foregroundStyle(A.s6)
                            Text("No cars found")
                                .font(.system(size: 14))
                                .foregroundStyle(A.s5)
                        }.padding(.top, 60)
                    } else {
                        ForEach(venues) { c in
                            AlfredBigCard(car: c, fullWidth: true)
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
        do { venues = try await service.getCars(city: selectedCity) } catch { venues = [] }
        isLoading = false
    }
}
