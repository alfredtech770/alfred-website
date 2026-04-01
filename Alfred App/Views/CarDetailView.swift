//
//  CarDetailView.swift
//  Alfred App
//
//  Full-screen car detail overlay.
//

import SwiftUI

struct CarDetailView: View {
    let car: CDCar
    var onBack: (() -> Void)? = nil

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 0) {
                    // Hero
                    if let url = car.heroImageURL, let imageURL = URL(string: url) {
                        AsyncImage(url: imageURL) { phase in
                            switch phase {
                            case .success(let img):
                                img.resizable().scaledToFill()
                                    .frame(height: 320)
                                    .clipped()
                            default:
                                A.el.frame(height: 320)
                            }
                        }
                    } else {
                        A.el.frame(height: 320)
                    }

                    VStack(alignment: .leading, spacing: 16) {
                        Text(car.name)
                            .font(.system(size: 24, weight: .bold))
                            .foregroundStyle(A.s1)

                        HStack(spacing: 20) {
                            if let hp = car.hp {
                                detailStat(icon: "bolt.fill", label: "\(hp) hp")
                            }
                            detailStat(icon: "dollarsign.circle", label: "$\(car.pricePerDay)/day")
                            if let city = car.city {
                                detailStat(icon: "mappin", label: city)
                            }
                        }

                        // Book button
                        Button(action: {}) {
                            Text("Request This Car")
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .frame(height: 52)
                                .background(RoundedRectangle(cornerRadius: 14).fill(A.gn))
                        }
                        .padding(.top, 12)

                        Spacer().frame(height: 100)
                    }
                    .padding(20)
                }
            }

            // Back button
            VStack {
                HStack {
                    Button(action: { onBack?() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(.white)
                            .frame(width: 36, height: 36)
                            .background(Circle().fill(.black.opacity(0.5)))
                    }
                    .padding(.leading, 16)
                    .padding(.top, 54)
                    Spacer()
                }
                Spacer()
            }
        }
    }

    private func detailStat(icon: String, label: String) -> some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 12))
                .foregroundStyle(A.s5)
            Text(label)
                .font(.system(size: 13, weight: .medium))
                .foregroundStyle(A.s4)
        }
    }
}
