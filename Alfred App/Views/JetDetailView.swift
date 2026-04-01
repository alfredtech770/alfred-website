//
//  JetDetailView.swift
//  Alfred App
//
//  Jet detail view (pushed via NavigationStack).
//

import SwiftUI

struct JetDetailView: View {
    let jet: Jet
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 0) {
                    if let url = jet.heroImageURL, let imageURL = URL(string: url) {
                        AsyncImage(url: imageURL) { phase in
                            switch phase {
                            case .success(let img):
                                img.resizable().scaledToFill()
                                    .frame(height: 320).clipped()
                            default:
                                A.el.frame(height: 320)
                            }
                        }
                    } else {
                        A.el.frame(height: 320)
                    }

                    VStack(alignment: .leading, spacing: 16) {
                        Text(jet.name)
                            .font(.system(size: 24, weight: .bold))
                            .foregroundStyle(A.s1)
                        if let type = jet.jetType {
                            Text(type)
                                .font(.system(size: 14))
                                .foregroundStyle(A.s5)
                        }
                        HStack(spacing: 16) {
                            if let pax = jet.passengers {
                                Text("\(pax) passengers")
                                    .font(.system(size: 13)).foregroundStyle(A.s4)
                            }
                            if let range = jet.range {
                                Text(range)
                                    .font(.system(size: 13)).foregroundStyle(A.s4)
                            }
                        }
                        Button(action: {}) {
                            Text("Request This Jet")
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity).frame(height: 52)
                                .background(RoundedRectangle(cornerRadius: 14).fill(A.gn))
                        }.padding(.top, 12)
                        Spacer().frame(height: 100)
                    }.padding(20)
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
            }.padding(.leading, 16).padding(.top, 54)
        }
    }
}
