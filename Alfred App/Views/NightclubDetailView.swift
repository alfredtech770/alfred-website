//
//  NightclubDetailView.swift
//  Alfred App
//
//  Nightclub detail view (pushed via NavigationStack).
//

import SwiftUI

struct NightclubDetailView: View {
    let nightclub: Nightclub
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 0) {
                    // Hero
                    if let url = nightclub.heroImageURL, let imageURL = URL(string: url) {
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
                        HStack {
                            Text(nightclub.name)
                                .font(.system(size: 24, weight: .bold))
                                .foregroundStyle(A.s1)
                            Spacer()
                            if let rating = nightclub.rating {
                                HStack(spacing: 4) {
                                    Image(systemName: "star.fill")
                                        .font(.system(size: 12))
                                        .foregroundStyle(A.gn)
                                    Text(String(format: "%.1f", rating))
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundStyle(A.s1)
                                }
                            }
                        }

                        HStack(spacing: 16) {
                            if let music = nightclub.music {
                                infoTag(icon: "music.note", text: music)
                            }
                            if let vibe = nightclub.vibe {
                                infoTag(icon: "heart", text: vibe)
                            }
                        }

                        Text(nightclub.city)
                            .font(.system(size: 14))
                            .foregroundStyle(A.s5)

                        // Request button
                        Button(action: {}) {
                            Text("Reserve a Table")
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
        }
        .navigationBarHidden(true)
        .overlay(alignment: .topLeading) {
            Button(action: { dismiss() }) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(width: 36, height: 36)
                    .background(Circle().fill(.black.opacity(0.5)))
            }
            .padding(.leading, 16)
            .padding(.top, 54)
        }
    }

    private func infoTag(icon: String, text: String) -> some View {
        HStack(spacing: 5) {
            Image(systemName: icon)
                .font(.system(size: 11))
                .foregroundStyle(A.s5)
            Text(text)
                .font(.system(size: 13, weight: .medium))
                .foregroundStyle(A.s4)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(Capsule().fill(A.srf))
    }
}
