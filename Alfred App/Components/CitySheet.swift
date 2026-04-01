//
//  CitySheet.swift
//  Alfred App
//
//  City selection bottom sheet.
//

import SwiftUI

struct CitySheet: View {
    let cities: [CityItem]
    @Binding var sel: String
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 0) {
            Text("Select City")
                .font(.system(size: 18, weight: .bold))
                .foregroundStyle(A.s1)
                .padding(.top, 20)
                .padding(.bottom, 16)

            ScrollView {
                VStack(spacing: 0) {
                    ForEach(cities) { city in
                        Button {
                            sel = city.name
                            dismiss()
                        } label: {
                            HStack(spacing: 12) {
                                Circle()
                                    .fill(city.color)
                                    .frame(width: 8, height: 8)
                                Text(city.name)
                                    .font(.system(size: 15, weight: .medium))
                                    .foregroundStyle(A.s1)
                                Spacer()
                                if sel == city.name {
                                    Image(systemName: "checkmark")
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundStyle(A.gn)
                                }
                                if !city.available {
                                    Text("Coming Soon")
                                        .font(.system(size: 11, weight: .medium))
                                        .foregroundStyle(A.s6)
                                }
                            }
                            .padding(.horizontal, 20)
                            .padding(.vertical, 14)
                        }
                        .disabled(!city.available)
                        .opacity(city.available ? 1.0 : 0.5)

                        if city.id != cities.last?.id {
                            Rectangle()
                                .fill(A.bd.opacity(0.5))
                                .frame(height: 0.5)
                                .padding(.horizontal, 20)
                        }
                    }
                }
            }
        }
        .background(A.bg)
    }
}

// Note: CityItem is defined as a private struct in HomeView.swift.
// We make it accessible here via a package-level definition that
// HomeView's private CityItem shadows.
struct CityItem: Identifiable {
    let id: String
    let name: String
    let code: String
    let color: Color
    let available: Bool
}
