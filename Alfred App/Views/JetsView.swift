//
//  JetsView.swift
//  Alfred App
//
//  Jets browse view — grid of jet cards with filters.
//

import SwiftUI

struct JetsView: View {
    @Binding var selectedCity: String
    @Binding var isFilterVisible: Bool

    @State private var venues: [Jet] = []
    @State private var isLoading = true
    private let service = JetService()

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()

            ScrollView {
                LazyVStack(spacing: 16) {
                    HStack {
                        Text("Private Jets")
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
                            Image(systemName: "airplane")
                                .font(.system(size: 36, weight: .ultraLight))
                                .foregroundStyle(A.s6)
                            Text("No jets found")
                                .font(.system(size: 14))
                                .foregroundStyle(A.s5)
                        }.padding(.top, 60)
                    } else {
                        ForEach(venues) { j in
                            NavigationLink(value: j) {
                                AlfredBigCard(jet: j, fullWidth: true)
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
        do { venues = try await service.getJets(city: selectedCity) } catch { venues = [] }
        isLoading = false
    }
}
