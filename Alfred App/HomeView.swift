//
//  HomeView.swift
//  Alfred App
//
//  Rebuilt to Brand Bible v1.0 spec.
//  Single design system: Outfit typography, zero deviation.
//
import SwiftUI
import Combine
import SuperwallKit
import Auth

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – Constants
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
private enum HV {
    static let bg          = Color(hex: "111113")
    static let elevated    = Color(hex: "18181B")
    static let border      = Color(hex: "2C2C31")
    static let borderLight = Color(hex: "38383E")
    static let s1          = Color(hex: "F4F4F5")
    static let s4          = Color(hex: "A1A1AA")
    static let s5          = Color(hex: "71717A")
    static let s6          = Color(hex: "52525B")
    static let s7          = Color(hex: "3F3F46")
    static let alfredGreen = Color(hex: "5A8A6A")

    static let heroRatio: CGFloat   = 0.67
    static let heroRadius: CGFloat  = 34
    static let screenH: CGFloat     = UIScreen.main.bounds.height
    static let screenW: CGFloat     = UIScreen.main.bounds.width
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – Local Models
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
private struct CityItem: Identifiable {
    let id, name, code: String
    let color: Color
    let available: Bool
}

private struct CarDetailDestination: Identifiable {
    let car: CDCar
    var id: Int { car.id }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
private let hmCities: [CityItem] = [
    .init(id: "PAR", name: "Paris",    code: "PAR", color: HV.s1,                 available: true),
    .init(id: "MIA", name: "Miami",    code: "MIA", color: HV.alfredGreen,        available: true),
    .init(id: "NYC", name: "New York", code: "NYC", color: Color(hex: "F472B6"),  available: false),
    .init(id: "DXB", name: "Dubai",    code: "DXB", color: Color(hex: "FB923C"),  available: false),
    .init(id: "MAD", name: "Madrid",   code: "MAD", color: Color(hex: "F87171"),  available: false),
    .init(id: "LDN", name: "London",   code: "LDN", color: Color(hex: "A78BFA"),  available: false),
    .init(id: "TLV", name: "Tel Aviv", code: "TLV", color: Color(hex: "22D3EE"),  available: false),
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – Stagger Animation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
private extension View {
    func stag(_ on: Bool, _ d: Double) -> some View {
        opacity(on ? 1 : 0)
            .offset(y: on ? 0 : 16)
            .animation(.spring(response: 0.65, dampingFraction: 0.82).delay(d), value: on)
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – Category Icon Shapes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
private struct DiningIcon: Shape {
    func path(in r: CGRect) -> Path {
        var p = Path()
        let w = r.width, h = r.height
        p.move(to: CGPoint(x: w * 0.25, y: h * 0.1))
        p.addLine(to: CGPoint(x: w * 0.25, y: h * 0.9))
        p.move(to: CGPoint(x: w * 0.15, y: h * 0.1))
        p.addLine(to: CGPoint(x: w * 0.15, y: h * 0.45))
        p.addQuadCurve(to: CGPoint(x: w * 0.35, y: h * 0.45), control: CGPoint(x: w * 0.25, y: h * 0.55))
        p.move(to: CGPoint(x: w * 0.35, y: h * 0.1))
        p.addLine(to: CGPoint(x: w * 0.35, y: h * 0.45))
        p.move(to: CGPoint(x: w * 0.65, y: h * 0.1))
        p.addLine(to: CGPoint(x: w * 0.65, y: h * 0.9))
        p.move(to: CGPoint(x: w * 0.65, y: h * 0.1))
        p.addQuadCurve(to: CGPoint(x: w * 0.65, y: h * 0.5), control: CGPoint(x: w * 0.85, y: h * 0.3))
        return p
    }
}

private struct NightlifeIcon: Shape {
    func path(in r: CGRect) -> Path {
        var p = Path()
        let w = r.width, h = r.height
        p.move(to: CGPoint(x: w * 0.1, y: h * 0.15))
        p.addLine(to: CGPoint(x: w * 0.9, y: h * 0.15))
        p.addLine(to: CGPoint(x: w * 0.5, y: h * 0.55))
        p.closeSubpath()
        p.move(to: CGPoint(x: w * 0.5, y: h * 0.55))
        p.addLine(to: CGPoint(x: w * 0.5, y: h * 0.8))
        p.move(to: CGPoint(x: w * 0.3, y: h * 0.85))
        p.addLine(to: CGPoint(x: w * 0.7, y: h * 0.85))
        return p
    }
}

private struct WellnessIcon: Shape {
    func path(in r: CGRect) -> Path {
        var p = Path()
        let w = r.width, h = r.height, cx = w * 0.5, cy = h * 0.5
        p.move(to: CGPoint(x: cx, y: h * 0.08))
        p.addQuadCurve(to: CGPoint(x: w * 0.18, y: cy + h * 0.12), control: CGPoint(x: w * 0.18, y: h * 0.2))
        p.addQuadCurve(to: CGPoint(x: cx, y: h * 0.92), control: CGPoint(x: w * 0.18, y: h * 0.78))
        p.addQuadCurve(to: CGPoint(x: w * 0.82, y: cy + h * 0.12), control: CGPoint(x: w * 0.82, y: h * 0.78))
        p.addQuadCurve(to: CGPoint(x: cx, y: h * 0.08), control: CGPoint(x: w * 0.82, y: h * 0.2))
        p.addEllipse(in: CGRect(x: cx - w * 0.14, y: cy + h * 0.04, width: w * 0.28, height: w * 0.28))
        return p
    }
}

private struct StaysIcon: Shape {
    func path(in r: CGRect) -> Path {
        var p = Path()
        let w = r.width, h = r.height
        p.move(to: CGPoint(x: w * 0.1, y: h * 0.45))
        p.addLine(to: CGPoint(x: w * 0.5, y: h * 0.1))
        p.addLine(to: CGPoint(x: w * 0.9, y: h * 0.45))
        p.move(to: CGPoint(x: w * 0.2, y: h * 0.45))
        p.addLine(to: CGPoint(x: w * 0.2, y: h * 0.88))
        p.addLine(to: CGPoint(x: w * 0.8, y: h * 0.88))
        p.addLine(to: CGPoint(x: w * 0.8, y: h * 0.45))
        p.move(to: CGPoint(x: w * 0.4, y: h * 0.88))
        p.addLine(to: CGPoint(x: w * 0.4, y: h * 0.6))
        p.addLine(to: CGPoint(x: w * 0.6, y: h * 0.6))
        p.addLine(to: CGPoint(x: w * 0.6, y: h * 0.88))
        return p
    }
}

private struct CarsIcon: Shape {
    func path(in r: CGRect) -> Path {
        var p = Path()
        let w = r.width, h = r.height
        p.move(to: CGPoint(x: w * 0.1, y: h * 0.55))
        p.addLine(to: CGPoint(x: w * 0.2, y: h * 0.55))
        p.addLine(to: CGPoint(x: w * 0.3, y: h * 0.25))
        p.addLine(to: CGPoint(x: w * 0.7, y: h * 0.25))
        p.addLine(to: CGPoint(x: w * 0.85, y: h * 0.55))
        p.addLine(to: CGPoint(x: w * 0.95, y: h * 0.55))
        p.addLine(to: CGPoint(x: w * 0.95, y: h * 0.65))
        p.addLine(to: CGPoint(x: w * 0.05, y: h * 0.65))
        p.addLine(to: CGPoint(x: w * 0.05, y: h * 0.55))
        p.closeSubpath()
        p.addEllipse(in: CGRect(x: w * 0.15, y: h * 0.58, width: w * 0.18, height: w * 0.18))
        p.addEllipse(in: CGRect(x: w * 0.67, y: h * 0.58, width: w * 0.18, height: w * 0.18))
        return p
    }
}

private struct YachtsIcon: Shape {
    func path(in r: CGRect) -> Path {
        var p = Path()
        let w = r.width, h = r.height
        p.move(to: CGPoint(x: w * 0.4, y: h * 0.1))
        p.addLine(to: CGPoint(x: w * 0.4, y: h * 0.65))
        p.move(to: CGPoint(x: w * 0.4, y: h * 0.15))
        p.addLine(to: CGPoint(x: w * 0.85, y: h * 0.55))
        p.addLine(to: CGPoint(x: w * 0.4, y: h * 0.55))
        p.move(to: CGPoint(x: w * 0.1, y: h * 0.68))
        p.addLine(to: CGPoint(x: w * 0.9, y: h * 0.68))
        p.addQuadCurve(to: CGPoint(x: w * 0.2, y: h * 0.82), control: CGPoint(x: w * 0.7, y: h * 0.88))
        p.move(to: CGPoint(x: w * 0.05, y: h * 0.9))
        p.addQuadCurve(to: CGPoint(x: w * 0.95, y: h * 0.9), control: CGPoint(x: w * 0.5, y: h * 0.82))
        return p
    }
}

private struct JetsIcon: Shape {
    func path(in r: CGRect) -> Path {
        var p = Path()
        let w = r.width, h = r.height
        p.move(to: CGPoint(x: w * 0.5, y: h * 0.05))
        p.addLine(to: CGPoint(x: w * 0.5, y: h * 0.95))
        p.move(to: CGPoint(x: w * 0.5, y: h * 0.35))
        p.addLine(to: CGPoint(x: w * 0.05, y: h * 0.55))
        p.move(to: CGPoint(x: w * 0.5, y: h * 0.35))
        p.addLine(to: CGPoint(x: w * 0.95, y: h * 0.55))
        p.move(to: CGPoint(x: w * 0.5, y: h * 0.85))
        p.addLine(to: CGPoint(x: w * 0.3, y: h * 0.95))
        p.move(to: CGPoint(x: w * 0.5, y: h * 0.85))
        p.addLine(to: CGPoint(x: w * 0.7, y: h * 0.95))
        return p
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – Category Pill Data
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
private struct HVCategory: Identifiable {
    let id: String
    let label: String
    let browseKey: String
    let emoji: String
}

private let hvCategories: [HVCategory] = [
    .init(id: "dining",    label: "Dining",    browseKey: "Dining",    emoji: "\u{1F37D}\u{FE0F}"),
    .init(id: "nightlife", label: "Nightlife", browseKey: "Nightlife", emoji: "\u{1F378}"),
    .init(id: "wellness",  label: "Wellness",  browseKey: "Wellness",  emoji: "\u{1F9D6}"),
    .init(id: "stays",     label: "Stays",     browseKey: "Stays",     emoji: "\u{1F3E8}"),
    .init(id: "cars",      label: "Cars",      browseKey: "Cars",      emoji: "\u{1F3CE}\u{FE0F}"),
    .init(id: "yachts",    label: "Yachts",    browseKey: "Yachts",    emoji: "\u{26F5}"),
    .init(id: "jets",      label: "Jets",      browseKey: "Jets",      emoji: "\u{2708}\u{FE0F}"),
]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – City Sheet
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
private struct CitySheet: View {
    let cities: [CityItem]
    @Binding var sel: String
    @Environment(\.dismiss) var dismiss

    private let flags: [String: String] = [
        "Paris": "🇫🇷", "Miami": "🇺🇸", "New York": "🗽",
        "Dubai": "🇦🇪", "Madrid": "🇪🇸", "London": "🇬🇧", "Tel Aviv": "🇮🇱"
    ]

    var body: some View {
        VStack(spacing: 0) {
            Capsule().fill(HV.s6.opacity(0.4)).frame(width: 36, height: 4)
                .padding(.top, 12).padding(.bottom, 20)

            VStack(spacing: 6) {
                Image(systemName: "globe.americas.fill")
                    .font(.system(size: 28))
                    .foregroundStyle(
                        LinearGradient(colors: [HV.s1.opacity(0.7), HV.s5], startPoint: .topLeading, endPoint: .bottomTrailing)
                    )
                    .padding(.bottom, 4)
                Text("Choose Your City")
                    .font(.outfit(22, weight: .medium))
                    .foregroundStyle(HV.s1)
                Text("Alfred is expanding worldwide")
                    .font(.outfit(13, weight: .light))
                    .foregroundStyle(HV.s5)
            }
            .padding(.bottom, 28)

            VStack(spacing: 8) {
                ForEach(cities.filter { $0.available }) { c in
                    let active = c.name == sel
                    Button {
                        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                        sel = c.name; dismiss()
                    } label: {
                        HStack(spacing: 16) {
                            Text(flags[c.name] ?? "🌍").font(.system(size: 28))
                                .frame(width: 48, height: 48)
                                .background(RoundedRectangle(cornerRadius: 14, style: .continuous).fill(active ? HV.alfredGreen.opacity(0.10) : HV.elevated))
                                .overlay(RoundedRectangle(cornerRadius: 14, style: .continuous).strokeBorder(active ? HV.alfredGreen.opacity(0.3) : HV.border, lineWidth: active ? 1 : 0.5))
                            VStack(alignment: .leading, spacing: 3) {
                                Text(c.name).font(.outfit(17, weight: .medium)).foregroundStyle(HV.s1)
                                Text("Available now").font(.outfit(11, weight: .light)).foregroundStyle(HV.alfredGreen)
                            }
                            Spacer()
                            if active {
                                ZStack {
                                    Circle().fill(HV.alfredGreen).frame(width: 26, height: 26)
                                    Image(systemName: "checkmark").font(.system(size: 11, weight: .bold)).foregroundStyle(.white)
                                }
                            } else {
                                Circle().stroke(HV.s7, lineWidth: 1.5).frame(width: 26, height: 26)
                            }
                        }
                        .padding(.horizontal, 16).padding(.vertical, 14)
                        .background(RoundedRectangle(cornerRadius: 18, style: .continuous).fill(active ? HV.alfredGreen.opacity(0.04) : HV.elevated))
                        .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).strokeBorder(active ? HV.alfredGreen : HV.border, lineWidth: active ? 1.5 : 0.5))
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 16)

            VStack(alignment: .leading, spacing: 4) {
                Text("Coming Soon").font(.outfit(12, weight: .medium)).foregroundStyle(HV.s6)
                    .padding(.leading, 4).padding(.top, 24).padding(.bottom, 8)
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(cities.filter { !$0.available }) { c in
                            VStack(spacing: 8) {
                                Text(flags[c.name] ?? "🌍").font(.system(size: 22))
                                    .frame(width: 44, height: 44)
                                    .background(RoundedRectangle(cornerRadius: 12, style: .continuous).fill(c.color.opacity(0.04)))
                                    .overlay(RoundedRectangle(cornerRadius: 12, style: .continuous).strokeBorder(c.color.opacity(0.08), lineWidth: 0.5))
                                Text(c.name).font(.outfit(11, weight: .regular)).foregroundStyle(HV.s6).lineLimit(1)
                            }
                            .frame(width: 72)
                        }
                    }
                }
            }
            .padding(.horizontal, 16)

            Spacer()
        }
        .background(HV.bg)
        .presentationBackground(HV.bg)
        .presentationDetents([.medium])
        .presentationCornerRadius(28)
        .presentationDragIndicator(.visible)
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – HomeView
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
struct HomeView: View {

    // ── Shared ──────────────────────────────────
    @ObservedObject private var storeKit = StoreKitManager.shared
    @StateObject private var locationManager = LocationManager()

    // ── Navigation ──────────────────────────────
    @State private var activeTab: AppTab = .home
    @State private var city = "Paris"
    @State private var showCity = false
    @State private var selectedCategoryId: String = "dining"
    @State private var heroIndex: Int = 0

    // ── Browse overlay ──────────────────────────
    @State private var browseDestination: String? = nil
    @State private var browseOffset: CGFloat = 0
    @State private var diningNavPath = NavigationPath()
    @State private var diningFilterVisible = false
    @State private var nightlifeFilterVisible = false
    @State private var staysFilterVisible = false
    @State private var yachtsFilterVisible = false
    @State private var jetsFilterVisible = false

    // ── Data ────────────────────────────────────
    @State private var featuredRestaurants: [Restaurant] = []
    @State private var diningVenues:        [Restaurant] = []
    @State private var nightlifeVenues:     [Nightclub]  = []
    @State private var wellnessVenues:      [Wellness]   = []
    @State private var stayVenues:          [Accommodation] = []
    @State private var carVenues:           [Car]        = []
    @State private var yachtVenues:         [Yacht]      = []
    @State private var jetVenues:           [Jet]        = []
    @State private var featuredLoading = true
    @State private var isLoadingDetail = false
    @State private var userName = ""

    // ── Detail overlays ─────────────────────────
    @State private var selectedRestaurant: RDRestaurant? = nil
    @State private var selectedCarForDetail: CarDetailDestination? = nil

    // ── Animation ───────────────────────────────
    @State private var appeared = false
    @State private var isHeroPressed = false
    @State private var heroContentOpacity: Double = 1.0
    @State private var heroAutoTimer: Timer? = nil

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: – Computed: current featured venue
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    private var currentFeatured: Restaurant? {
        guard !featuredRestaurants.isEmpty else { return nil }
        let idx = heroIndex % featuredRestaurants.count
        return featuredRestaurants[idx]
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: – Body
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    var body: some View {
        ZStack {
            // Main tab content
            ZStack(alignment: .bottom) {
                HV.bg.ignoresSafeArea()

                switch activeTab {
                case .home:      homeScreen
                case .bookings:  BookingsView(selectedTab: $activeTab)
                case .profile:   ProfileView(selectedTab: $activeTab)
                case .search:    MapSearchView(selectedTab: $activeTab, city: city).environmentObject(locationManager)
                case .concierge: homeScreen
                }

                if activeTab != .search {
                    VStack { Spacer(); FloatingTabBar(activeTab: $activeTab) }
                }
            }

            // Browse overlay
            if let dest = browseDestination {
                ZStack(alignment: .bottom) {
                    HV.bg.ignoresSafeArea()
                    browseDest(dest)
                    if diningNavPath.isEmpty && !diningFilterVisible && !nightlifeFilterVisible && !yachtsFilterVisible && !jetsFilterVisible {
                        VStack { Spacer(); FloatingTabBar(activeTab: $activeTab, onBack: { closeBrowse() }) }
                            .zIndex(100)
                    }
                }
                .transition(
                    .asymmetric(
                        insertion: .scale(scale: 0.86, anchor: .center)
                            .combined(with: .opacity)
                            .animation(.spring(response: 0.55, dampingFraction: 0.86)),
                        removal: .scale(scale: 0.92, anchor: .center)
                            .combined(with: .opacity)
                            .animation(.spring(response: 0.4, dampingFraction: 0.9))
                    )
                )
                .zIndex(50)
            }
        }
        .navigationBarHidden(true)
        .sheet(isPresented: $showCity) {
            CitySheet(cities: hmCities, sel: $city)
        }
        .overlay {
            if let r = selectedRestaurant {
                RestaurantDetailView(restaurant: r, onDismiss: {
                    withAnimation(.spring(response: 0.5, dampingFraction: 0.88)) { selectedRestaurant = nil }
                })
                .transition(
                    .asymmetric(
                        insertion: .scale(scale: 0.86, anchor: .center)
                            .combined(with: .opacity)
                            .animation(.spring(response: 0.55, dampingFraction: 0.86)),
                        removal: .scale(scale: 0.92, anchor: .center)
                            .combined(with: .opacity)
                            .animation(.spring(response: 0.4, dampingFraction: 0.9))
                    )
                )
                .zIndex(100)
            }
        }
        .overlay {
            if let dest = selectedCarForDetail {
                CarDetailView(car: dest.car, onBack: {
                    withAnimation(.spring(response: 0.5, dampingFraction: 0.88)) { selectedCarForDetail = nil }
                })
                .transition(
                    .asymmetric(
                        insertion: .scale(scale: 0.86, anchor: .center)
                            .combined(with: .opacity)
                            .animation(.spring(response: 0.55, dampingFraction: 0.86)),
                        removal: .scale(scale: 0.92, anchor: .center)
                            .combined(with: .opacity)
                            .animation(.spring(response: 0.4, dampingFraction: 0.9))
                    )
                )
                .zIndex(100)
            }
        }
        .onChange(of: activeTab) { _, _ in
            if browseDestination != nil { browseDestination = nil; browseOffset = 0 }
        }
        .onChange(of: activeTab) { _, newTab in
            if newTab == .home { startHeroTimer() } else { stopHeroTimer() }
        }
        .onChange(of: city) { _, _ in reloadData() }
        .onAppear {
            loadData()
            startHeroTimer()
            if !appeared {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
                    withAnimation(.easeOut(duration: 0.5)) { appeared = true }
                }
            }
        }
        .onDisappear { stopHeroTimer() }
        .onReceive(NotificationCenter.default.publisher(for: .loaderDidFinish)) { _ in
            withAnimation(.easeOut(duration: 0.5)) { appeared = true }
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: – Home Screen
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    private var homeScreen: some View {
        GeometryReader { geo in
            let heroH = geo.size.height * HV.heroRatio

            ZStack(alignment: .top) {
                HV.bg.ignoresSafeArea()

                ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 0) {
                    // ── ZONE 1: Hero Card ─────────────
                    ZStack(alignment: .bottom) {
                        // Layer 1: Image
                        Group {
                            if let featured = currentFeatured,
                               let urlStr = featured.heroImageURL, !urlStr.isEmpty,
                               let url = URL(string: urlStr) {
                                AsyncImage(url: url) { phase in
                                    switch phase {
                                    case .success(let img):
                                        img.resizable()
                                            .aspectRatio(contentMode: .fill)
                                            .frame(width: geo.size.width, height: heroH)
                                            .clipped()
                                    case .failure:
                                        HV.elevated.frame(width: geo.size.width, height: heroH)
                                    default:
                                        HV.elevated.frame(width: geo.size.width, height: heroH)
                                            .overlay(ProgressView().tint(HV.s5))
                                    }
                                }
                                .id(featured.id)
                                .transition(.opacity)
                                .opacity(heroContentOpacity)
                            } else {
                                HV.elevated
                                    .frame(width: geo.size.width, height: heroH)
                                    .overlay(
                                        Group {
                                            if featuredLoading { ProgressView().tint(HV.s5) }
                                        }
                                    )
                            }
                        }

                        // Layer 2: Gradient
                        LinearGradient(
                            stops: [
                                .init(color: .black.opacity(0.50), location: 0.00),
                                .init(color: .clear,                location: 0.18),
                                .init(color: .clear,                location: 0.40),
                                .init(color: .black.opacity(0.32), location: 0.55),
                                .init(color: .black.opacity(0.74), location: 0.72),
                                .init(color: .black.opacity(0.92), location: 0.86),
                                .init(color: .black.opacity(0.98), location: 1.00),
                            ],
                            startPoint: .top, endPoint: .bottom
                        )
                        .frame(height: heroH)
                        .allowsHitTesting(false)

                        // Layer 3: Topbar (pinned to top)
                        VStack {
                            HStack {
                                Text("ALFRED")
                                    .font(.outfit(14, weight: .light))
                                    .tracking(14 * 0.42)
                                    .foregroundStyle(HV.s1)

                                Spacer()

                                Button {
                                    UIImpactFeedbackGenerator(style: .light).impactOccurred()
                                    showCity = true
                                } label: {
                                    HStack(spacing: 5) {
                                        Image(systemName: "location.fill")
                                            .font(.system(size: 10, weight: .medium))
                                            .foregroundStyle(.white.opacity(0.88))
                                        Text(city)
                                            .font(.outfit(12, weight: .regular))
                                            .foregroundStyle(.white.opacity(0.88))
                                    }
                                    .padding(.vertical, 6)
                                    .padding(.leading, 9)
                                    .padding(.trailing, 12)
                                    .background(.black.opacity(0.36))
                                    .overlay(Capsule().strokeBorder(.white.opacity(0.20), lineWidth: 0.5))
                                    .clipShape(Capsule())
                                }
                                .buttonStyle(.plain)
                            }
                            .padding(.top, geo.safeAreaInsets.top + 8)
                            .padding(.horizontal, 20)

                            Spacer()
                        }
                        .frame(height: heroH)

                        // Layer 4: Bottom content (title + stats)
                        VStack(alignment: .leading, spacing: 0) {
                            if let featured = currentFeatured {
                                // Title row
                                HStack(alignment: .top) {
                                    Text(featured.name)
                                        .font(.outfit(22, weight: .semibold))
                                        .tracking(-0.4)
                                        .foregroundStyle(.white)
                                        .lineLimit(1)

                                    Spacer(minLength: 8)

                                    Text(priceLabel(featured.priceLevel))
                                        .font(.outfit(19, weight: .semibold))
                                        .foregroundStyle(.white)
                                }

                                // Subtitle
                                Text(heroSubtitle(featured))
                                    .font(.outfit(13, weight: .light))
                                    .foregroundStyle(.white.opacity(0.42))
                                    .lineLimit(1)
                                    .padding(.top, 4)
                                    .padding(.bottom, 11)

                                // Divider
                                Rectangle()
                                    .fill(.white.opacity(0.14))
                                    .frame(height: 0.5)
                                    .padding(.bottom, 11)

                                // Stats row
                                heroStats(featured)
                            }
                        }
                        .padding(.horizontal, 20)
                        .padding(.bottom, 18)
                        .opacity(heroContentOpacity)
                    }
                    .frame(width: geo.size.width, height: heroH)
                    .clipShape(
                        UnevenRoundedRectangle(
                            topLeadingRadius: 0,
                            bottomLeadingRadius: HV.heroRadius,
                            bottomTrailingRadius: HV.heroRadius,
                            topTrailingRadius: 0
                        )
                    )
                    .scaleEffect(isHeroPressed ? 0.985 : 1.0)
                    .animation(.spring(response: 0.3), value: isHeroPressed)
                    .contentShape(Rectangle())
                    .highPriorityGesture(heroGesture)
                    .onTapGesture {
                        if let featured = currentFeatured {
                            openRestaurantDetail(featured)
                        }
                    }
                    .stag(appeared, 0.0)

                    // ── ZONE 2: Bottom Panel (scrollable) ──
                    VStack(spacing: 0) {
                        // Pagination dots
                        if featuredRestaurants.count > 1 {
                            HStack(spacing: 6) {
                                ForEach(0..<min(featuredRestaurants.count, 5), id: \.self) { i in
                                    Circle()
                                        .fill(HV.s1.opacity(i == (heroIndex % min(featuredRestaurants.count, 5)) ? 0.88 : 0.22))
                                        .frame(width: 6, height: 6)
                                        .animation(.easeInOut(duration: 0.25), value: heroIndex)
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.top, 16)
                            .padding(.bottom, 8)
                        }

                        // Category strip
                        categoryStrip
                            .padding(.horizontal, 20)
                            .padding(.top, 12)
                            .padding(.bottom, 18)
                            .stag(appeared, 0.08)

                        // Ask Alfred
                        askAlfredFrame
                            .padding(.horizontal, 20)
                            .padding(.bottom, 8)
                            .stag(appeared, 0.14)

                        // ── Section cards ──────────────

                        // 1. Dining — Big
                        AlfredScrollSection(title: "Dining", trailingAction: { openBrowse("Dining") }) {
                            if diningVenues.isEmpty {
                                ForEach(0..<3, id: \.self) { _ in PlaceholderBigCard() }
                            } else {
                                ForEach(diningVenues.prefix(6)) { r in
                                    AlfredBigCard(dining: r) { openRestaurantDetail(r) }
                                }
                            }
                        }

                        // 2. Membership
                        AlfredSectionHeader(title: "Membership", trailing: "Learn More")
                        AlfredMembershipCard(isMember: storeKit.isMember) {
                            Superwall.shared.register(placement: "campaign_trigger")
                        }

                        // 3. Nightlife — Landscape
                        AlfredScrollSection(title: "Nightlife", trailingAction: { openBrowse("Nightlife") }) {
                            if nightlifeVenues.isEmpty {
                                ForEach(0..<3, id: \.self) { _ in PlaceholderLandscapeCard() }
                            } else {
                                ForEach(nightlifeVenues.prefix(6)) { nc in
                                    AlfredLandscapeCard(nightlife: nc) { openBrowse("Nightlife") }
                                }
                            }
                        }

                        // 4. Wellness — Landscape
                        AlfredScrollSection(title: "Wellness", trailingAction: { openBrowse("Wellness") }) {
                            if wellnessVenues.isEmpty {
                                ForEach(0..<3, id: \.self) { _ in PlaceholderLandscapeCard() }
                            } else {
                                ForEach(wellnessVenues.prefix(6)) { w in
                                    AlfredLandscapeCard(wellness: w) { openBrowse("Wellness") }
                                }
                            }
                        }

                        // 5. Accommodation — Big
                        AlfredScrollSection(title: "Accommodation", trailingAction: { openBrowse("Stays") }) {
                            if stayVenues.isEmpty {
                                ForEach(0..<3, id: \.self) { _ in PlaceholderBigCard() }
                            } else {
                                ForEach(stayVenues.prefix(6)) { s in
                                    AlfredBigCard(stay: s) { openBrowse("Stays") }
                                }
                            }
                        }

                        // 6. Cars — Landscape
                        AlfredScrollSection(title: "Exotic Cars", trailingAction: { openBrowse("Cars") }) {
                            if carVenues.isEmpty {
                                ForEach(0..<3, id: \.self) { _ in PlaceholderLandscapeCard() }
                            } else {
                                ForEach(carVenues.prefix(6)) { c in
                                    AlfredLandscapeCard(car: c) {
                                        withAnimation(.spring(response: 0.55, dampingFraction: 0.86)) {
                                            selectedCarForDetail = CarDetailDestination(car: c.toCDCar())
                                        }
                                    }
                                }
                            }
                        }

                        // 7. Yachts — Landscape
                        AlfredScrollSection(title: "Yachts", trailingAction: { openBrowse("Yachts") }) {
                            if yachtVenues.isEmpty {
                                ForEach(0..<3, id: \.self) { _ in PlaceholderLandscapeCard() }
                            } else {
                                ForEach(yachtVenues.prefix(6)) { y in
                                    AlfredLandscapeCard(yacht: y) { openBrowse("Yachts") }
                                }
                            }
                        }

                        // 8. Jets — Big
                        AlfredScrollSection(title: "Private Jets", trailingAction: { openBrowse("Jets") }) {
                            if jetVenues.isEmpty {
                                ForEach(0..<3, id: \.self) { _ in PlaceholderBigCard() }
                            } else {
                                ForEach(jetVenues.prefix(6)) { j in
                                    AlfredBigCard(jet: j) { openBrowse("Jets") }
                                }
                            }
                        }

                        Spacer().frame(height: 96)
                    }
                    .background(HV.bg)
                }
                } // ScrollView
            }
            .ignoresSafeArea(edges: .top)
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: – Hero Gesture (swipe + tap)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    private var heroGesture: some Gesture {
        DragGesture(minimumDistance: 12)
            .onEnded { v in
                let threshold: CGFloat = 50
                let predicted = v.predictedEndTranslation.width
                let count = featuredRestaurants.count

                if count > 1 && (v.translation.width < -threshold || predicted < -200) {
                    // Swipe left → next
                    crossfadeHero(to: (heroIndex + 1) % count)
                } else if count > 1 && (v.translation.width > threshold || predicted > 200) {
                    // Swipe right → previous
                    crossfadeHero(to: (heroIndex - 1 + count) % count)
                } else if abs(v.translation.width) < 8 && abs(v.translation.height) < 8 {
                    // Tap
                    if let featured = currentFeatured {
                        openRestaurantDetail(featured)
                    }
                }
            }
    }

    private func crossfadeHero(to newIndex: Int) {
        // Reset auto-timer on any transition (manual or auto)
        startHeroTimer()
        // Fade out
        withAnimation(.easeOut(duration: 0.2)) {
            heroContentOpacity = 0
        }
        // Switch content + fade in
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            heroIndex = newIndex
            withAnimation(.easeIn(duration: 0.35)) {
                heroContentOpacity = 1.0
            }
        }
    }

    private func startHeroTimer() {
        heroAutoTimer?.invalidate()
        heroAutoTimer = Timer.scheduledTimer(withTimeInterval: 3.5, repeats: true) { _ in
            let count = featuredRestaurants.count
            guard count > 1 else { return }
            crossfadeHero(to: (heroIndex + 1) % count)
        }
    }

    private func stopHeroTimer() {
        heroAutoTimer?.invalidate()
        heroAutoTimer = nil
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: – Hero Helpers
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    private func heroSubtitle(_ r: Restaurant) -> String {
        let parts = [r.city, r.address?.components(separatedBy: ",").first, r.cuisine].compactMap { $0 }
        return parts.joined(separator: " · ")
    }

    private func heroStats(_ r: Restaurant) -> some View {
        let stats: [(icon: String, label: String, value: String)] = [
            ("fork.knife", "Cuisine", r.cuisine ?? "Fine Dining"),
            ("clock",      "Open",    r.availableTonight == true ? "Tonight" : "See hours"),
            ("mappin",     "City",    r.city),
        ]
        return HStack(spacing: 0) {
            ForEach(Array(stats.enumerated()), id: \.offset) { index, stat in
                if index > 0 {
                    Rectangle()
                        .fill(.white.opacity(0.14))
                        .frame(width: 0.5, height: 14)
                }
                HStack(spacing: 4) {
                    Image(systemName: stat.icon)
                        .font(.system(size: 11))
                        .foregroundStyle(.white.opacity(0.48))
                    Text(stat.label)
                        .font(.outfit(11.5, weight: .light))
                        .foregroundStyle(.white.opacity(0.40))
                    Text(stat.value)
                        .font(.outfit(11.5, weight: .semibold))
                        .foregroundStyle(.white)
                }
                .frame(maxWidth: .infinity)
            }
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: – Category Strip
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    private var categoryStrip: some View {
        VStack(alignment: .leading, spacing: 10) {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 10) {
                    ForEach(hvCategories) { cat in
                        Button {
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                            withAnimation(.spring(response: 0.2, dampingFraction: 0.7)) {
                                selectedCategoryId = cat.id
                            }
                            openBrowse(cat.browseKey)
                        } label: {
                            HStack(spacing: 10) {
                                Text(cat.emoji)
                                    .font(.system(size: 18))
                                    .frame(width: 28, height: 28)
                                Text(cat.label)
                                    .font(.outfit(13, weight: .regular))
                                    .foregroundStyle(HV.s4)
                            }
                            .padding(.horizontal, 14)
                            .padding(.vertical, 12)
                            .background(HV.elevated)
                            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                            .overlay(
                                RoundedRectangle(cornerRadius: 14, style: .continuous)
                                    .strokeBorder(HV.border, lineWidth: 0.5)
                            )
                        }
                        .buttonStyle(CategoryPressStyle())
                        .tint(.clear)
                    }
                }
            }
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: – Ask Alfred Frame
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    private var askAlfredFrame: some View {
        Button {
            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
            openWhatsApp(message: "Hi Alfred,")
        } label: {
            HStack(spacing: 12) {
                // Avatar
                Text("A")
                    .font(.outfit(15, weight: .medium))
                    .foregroundStyle(HV.alfredGreen)
                    .frame(width: 38, height: 38)
                    .background(
                        RoundedRectangle(cornerRadius: 12, style: .continuous)
                            .fill(HV.alfredGreen.opacity(0.13))
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 12, style: .continuous)
                            .strokeBorder(HV.alfredGreen.opacity(0.26), lineWidth: 0.5)
                    )

                // Text
                VStack(alignment: .leading, spacing: 3) {
                    Text("Ask Alfred")
                        .font(.outfit(14, weight: .medium))
                        .tracking(-0.1)
                        .foregroundStyle(HV.s1)
                    HStack(spacing: 5) {
                        PulsingDot()
                        Text("Online now")
                            .font(.outfit(11, weight: .light))
                            .foregroundStyle(HV.alfredGreen)
                    }
                }

                Spacer()

                // Arrow
                Image(systemName: "arrow.up.right")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(HV.s4)
                    .frame(width: 30, height: 30)
                    .background(
                        RoundedRectangle(cornerRadius: 9, style: .continuous)
                            .fill(HV.border)
                    )
            }
            .padding(.horizontal, 16)
            .frame(height: 64)
            .background(HV.elevated)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .strokeBorder(HV.border, lineWidth: 0.5)
            )
        }
        .buttonStyle(AlfredPressStyle(scale: 0.97))
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: – Browse Destination
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    @ViewBuilder
    private func browseDest(_ dest: String) -> some View {
        switch dest {
        case "Dining":
            NavigationStack(path: $diningNavPath) {
                RestaurantsView(externalNavigationPath: $diningNavPath, selectedCity: $city, isFilterVisible: $diningFilterVisible)
                    .navigationDestination(for: Restaurant.self) { r in RestaurantDetailLoader(restaurant: r) }
            }
        case "Cars":
            NavigationStack { ExoticCarsView(selectedCity: $city) }
        case "Nightlife":
            NavigationStack {
                NightclubView(selectedCity: $city, isFilterVisible: $nightlifeFilterVisible)
                    .navigationDestination(for: Nightclub.self) { nc in NightclubDetailView(nightclub: nc) }
            }
        case "Wellness":
            NavigationStack { WellnessView(selectedCity: $city, isFilterVisible: .constant(false)) }
        case "Yachts":
            NavigationStack {
                YachtsView(selectedCity: $city, isFilterVisible: $yachtsFilterVisible)
                    .navigationDestination(for: Yacht.self) { y in YachtDetailView(yacht: y) }
            }
        case "Stays":
            NavigationStack {
                AccommodationView(selectedCity: $city, isFilterVisible: $staysFilterVisible)
                    .navigationDestination(for: Accommodation.self) { a in AccommodationDetailView(accommodation: a) }
            }
        case "Jets":
            NavigationStack {
                JetsView(selectedCity: $city, isFilterVisible: $jetsFilterVisible)
                    .navigationDestination(for: Jet.self) { j in JetDetailView(jet: j) }
            }
        default:
            ZStack {
                HV.bg.ignoresSafeArea()
                VStack(spacing: 16) {
                    Spacer()
                    Image(systemName: "questionmark.circle")
                        .font(.system(size: 48, weight: .ultraLight))
                        .foregroundStyle(HV.s6)
                    Text(dest)
                        .font(.outfit(22, weight: .medium))
                        .foregroundStyle(HV.s1)
                    Text("\(dest) coming soon.")
                        .font(.outfit(14, weight: .light))
                        .foregroundStyle(HV.s5)
                    Spacer()
                }
            }
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: – Navigation
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    private func openBrowse(_ label: String) {
        guard browseDestination == nil else { return }
        withAnimation(.spring(response: 0.55, dampingFraction: 0.86)) {
            browseDestination = label
        }
    }

    private func closeBrowse() {
        withAnimation(.spring(response: 0.4, dampingFraction: 0.9)) {
            browseDestination = nil
        }
    }

    private func openRestaurantDetail(_ r: Restaurant) {
        guard !isLoadingDetail else { return }
        isLoadingDetail = true
        Task {
            do {
                let detail = try await RestaurantDetailService().getRestaurantDetail(id: r.id)
                withAnimation(.spring(response: 0.55, dampingFraction: 0.86)) {
                    selectedRestaurant = RestaurantDetailService.toRDRestaurant(detail)
                }
            } catch {
                withAnimation(.spring(response: 0.55, dampingFraction: 0.86)) {
                    selectedRestaurant = RestaurantDetailService.toRDRestaurant(RestaurantDetail(restaurant: r, dishes: [], reviews: []))
                }
            }
            isLoadingDetail = false
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: – Data Loading
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    private func reloadData() {
        featuredRestaurants = []
        diningVenues = []
        nightlifeVenues = []
        wellnessVenues = []
        stayVenues = []
        carVenues = []
        yachtVenues = []
        jetVenues = []
        featuredLoading = true
        heroIndex = 0
        loadData()
    }

    private func loadData() {
        Task {
            if let session = try? await SupabaseManager.shared.auth.session,
               let profile = try? await UserService().getProfile(userId: session.user.id.uuidString) {
                userName = profile.firstName
            }
            let c = city

            // Featured first
            do { featuredRestaurants = try await RestaurantService().getFeaturedRestaurants(city: c) } catch { featuredRestaurants = [] }
            featuredLoading = false

            // All categories — simple sequential to avoid async let issues
            do { diningVenues = try await RestaurantService().getRestaurants(city: c) } catch { diningVenues = [] }
            do { nightlifeVenues = try await NightclubService().getNightclubs(city: c) } catch { nightlifeVenues = [] }
            do { wellnessVenues = try await WellnessService().getWellness(city: c) } catch { wellnessVenues = [] }
            do { stayVenues = try await AccommodationService().getAccommodations(city: c) } catch { stayVenues = [] }
            do { carVenues = try await CarService().getCars(city: c) } catch { carVenues = [] }
            do { yachtVenues = try await YachtService().getYachts(city: c) } catch { yachtVenues = [] }
            do { jetVenues = try await JetService().getJets(city: c) } catch { jetVenues = [] }
        }
    }

    private func priceLabel(_ level: Int?) -> String {
        switch level ?? 2 {
        case 1: return "€"
        case 3: return "€€€"
        case 4: return "€€€€"
        default: return "€€"
        }
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – Pulsing Dot
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
private struct PulsingDot: View {
    @State private var pulse = false

    var body: some View {
        Circle()
            .fill(HV.alfredGreen)
            .frame(width: 5, height: 5)
            .scaleEffect(pulse ? 1.3 : 1.0)
            .opacity(pulse ? 0.7 : 1.0)
            .animation(
                .easeInOut(duration: 1.2).repeatForever(autoreverses: true),
                value: pulse
            )
            .onAppear { pulse = true }
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – Button Styles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
private struct CategoryPressStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.92 : 1.0)
            .brightness(configuration.isPressed ? -0.02 : 0)
            .animation(.spring(response: 0.4, dampingFraction: 0.78), value: configuration.isPressed)
    }
}

#Preview { HomeView() }
