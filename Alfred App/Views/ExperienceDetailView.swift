//
//  ExperienceDetailView.swift
//  Alfred App
//
//  Experience detail view (used from WellnessView).
//

import SwiftUI

struct ExperienceDetailView: View {
    let experience: Experience
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()

            VStack(spacing: 20) {
                Spacer()
                Image(systemName: "sparkles")
                    .font(.system(size: 48, weight: .ultraLight))
                    .foregroundStyle(A.gn)
                Text("Experience Details")
                    .font(.system(size: 22, weight: .bold))
                    .foregroundStyle(A.s1)
                Text("Coming soon")
                    .font(.system(size: 14))
                    .foregroundStyle(A.s5)
                Spacer()
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
}
