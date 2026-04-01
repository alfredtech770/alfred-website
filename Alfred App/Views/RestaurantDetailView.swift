//
//  RestaurantDetailView.swift
//  Alfred App
//
//  Full-screen restaurant detail overlay.
//

import SwiftUI

struct RestaurantDetailView: View {
    let restaurant: RDRestaurant
    var onDismiss: (() -> Void)? = nil

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 0) {
                    // Hero image
                    if let url = restaurant.heroImageURL, let imageURL = URL(string: url) {
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
                        // Name + rating
                        HStack {
                            Text(restaurant.name)
                                .font(.system(size: 24, weight: .bold))
                                .foregroundStyle(A.s1)
                            Spacer()
                            if let rating = restaurant.rating {
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

                        if let cuisine = restaurant.cuisine {
                            Text(cuisine)
                                .font(.system(size: 14))
                                .foregroundStyle(A.s5)
                        }

                        if let address = restaurant.address {
                            HStack(spacing: 6) {
                                Image(systemName: "mappin.and.ellipse")
                                    .font(.system(size: 12))
                                    .foregroundStyle(A.s6)
                                Text(address)
                                    .font(.system(size: 13))
                                    .foregroundStyle(A.s5)
                            }
                        }

                        // Dishes
                        if !restaurant.dishes.isEmpty {
                            Text("Menu Highlights")
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundStyle(A.s1)
                                .padding(.top, 8)

                            ForEach(restaurant.dishes) { dish in
                                HStack {
                                    Text(dish.name)
                                        .font(.system(size: 14, weight: .medium))
                                        .foregroundStyle(A.s2)
                                    Spacer()
                                    if let price = dish.price {
                                        Text(price)
                                            .font(.system(size: 14))
                                            .foregroundStyle(A.s4)
                                    }
                                }
                                .padding(.vertical, 4)
                            }
                        }

                        Spacer().frame(height: 100)
                    }
                    .padding(20)
                }
            }

            // Back button
            VStack {
                HStack {
                    Button(action: { onDismiss?() }) {
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
}

/// Loader that fetches detail, then shows RestaurantDetailView
struct RestaurantDetailLoader: View {
    let restaurant: Restaurant
    @State private var detail: RDRestaurant? = nil
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()
            if let detail = detail {
                RestaurantDetailView(restaurant: detail, onDismiss: { dismiss() })
            } else {
                ProgressView().tint(A.s5)
            }
        }
        .navigationBarHidden(true)
        .task {
            do {
                let d = try await RestaurantDetailService().getRestaurantDetail(id: restaurant.id)
                detail = RestaurantDetailService.toRDRestaurant(d)
            } catch {
                detail = RestaurantDetailService.toRDRestaurant(
                    RestaurantDetail(restaurant: restaurant, dishes: [], reviews: [])
                )
            }
        }
    }
}
