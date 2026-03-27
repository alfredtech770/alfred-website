//
//  HomeCards.swift
//  Alfred — All home section card components
//
//  Card formats:
//  AlfredBigCard       → 280 × 380pt (Dining, Accommodation, Cars, Jets)
//  AlfredLandscapeCard → 300 × 205pt (Nightlife, Wellness, Yachts)
//  AlfredMembershipCard→ full-width  (Membership)
//
import SwiftUI
import SuperwallKit

// ─────────────────────────────────────────────────────────────
// MARK: – Brand Tokens (file-private)
// ─────────────────────────────────────────────────────────────
private let cBG  = Color(hex: "111113")
private let cEl  = Color(hex: "18181B")
private let cBdr = Color(hex: "2C2C31")
private let cS1  = Color(hex: "F4F4F5")
private let cS2  = Color(hex: "E4E4E7")
private let cS4  = Color(hex: "A1A1AA")
private let cS5  = Color(hex: "71717A")
private let cS6  = Color(hex: "52525B")
private let cS7  = Color(hex: "3F3F46")

private func outfit(_ size: CGFloat, _ weight: Font.Weight = .light) -> Font {
    .custom("Outfit", size: size).weight(weight)
}
private func playfair(_ size: CGFloat, italic: Bool = false) -> Font {
    italic
        ? .custom("PlayfairDisplay-Italic", size: size)
        : .custom("PlayfairDisplay-Bold", size: size)
}

// ─────────────────────────────────────────────────────────────
// MARK: – CardStat
// ─────────────────────────────────────────────────────────────
struct CardStat {
    let icon: String
    let label: String
    let value: String
}

// ─────────────────────────────────────────────────────────────
// MARK: – CardDots (private)
// ─────────────────────────────────────────────────────────────
private struct CardDots: View {
    var count: Int = 4
    var active: Int = 0
    var size: CGFloat = 7
    var body: some View {
        HStack(spacing: 6) {
            ForEach(0..<count, id: \.self) { i in
                Circle()
                    .fill(Color.white.opacity(i == active ? 0.88 : 0.30))
                    .frame(
                        width: i == active ? size : size * 0.71,
                        height: i == active ? size : size * 0.71
                    )
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────
// MARK: – CardPhoto (private)
// ─────────────────────────────────────────────────────────────
@ViewBuilder
private func CardPhoto(url: String, pressed: Bool) -> some View {
    AsyncImage(url: URL(string: url)) { phase in
        switch phase {
        case .success(let img):
            img.resizable().scaledToFill()
                .scaleEffect(pressed ? 1.04 : 1.0)
                .animation(.spring(response: 0.55, dampingFraction: 0.75), value: pressed)
        case .failure:
            cEl
        default:
            cEl.overlay(ProgressView().tint(cS6))
        }
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – 1. AlfredBigCard (280 × 380)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
struct AlfredBigCard: View {
    let imageURL: String
    let badge: String?
    let name: String
    let subtitle: String
    let price: String
    let stats: [CardStat]
    var cardWidth: CGFloat? = 280
    var cardHeight: CGFloat = 380
    var onTap: (() -> Void)? = nil

    @State private var pressed = false

    var body: some View {
        ZStack(alignment: .bottom) {
            // A) Photo
            CardPhoto(url: imageURL, pressed: pressed)
                .frame(width: cardWidth, height: cardHeight)
                .clipped()

            // B) Gradient
            LinearGradient(stops: [
                .init(color: .clear,               location: 0.00),
                .init(color: .clear,               location: 0.34),
                .init(color: .black.opacity(0.20), location: 0.50),
                .init(color: .black.opacity(0.68), location: 0.66),
                .init(color: .black.opacity(0.90), location: 0.80),
                .init(color: .black.opacity(0.97), location: 1.00),
            ], startPoint: .top, endPoint: .bottom)

            // C) Badge
            if let badge {
                VStack {
                    HStack {
                        Text(badge)
                            .font(outfit(13, .medium))
                            .foregroundColor(.white.opacity(0.9))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 6)
                            .background(Color.black.opacity(0.72))
                            .clipShape(Capsule())
                            .padding(14)
                        Spacer()
                    }
                    Spacer()
                }
            }

            // D) Dots
            VStack {
                Spacer()
                CardDots(count: 4, active: 0, size: 7)
                    .padding(.bottom, 124)
            }

            // E) Text content
            VStack(alignment: .leading, spacing: 0) {
                // Row 1: Name + Price
                HStack(alignment: .lastTextBaseline) {
                    Text(name)
                        .font(outfit(20, .bold))
                        .foregroundColor(.white)
                        .tracking(-0.3)
                        .lineLimit(1)
                    Spacer()
                    Text(price)
                        .font(outfit(18, .bold))
                        .foregroundColor(.white)
                        .lineLimit(1)
                }
                .padding(.bottom, 3)

                // Row 2: Subtitle
                Text(subtitle)
                    .font(outfit(12.5, .light))
                    .foregroundColor(.white.opacity(0.48))
                    .lineLimit(1)
                    .padding(.bottom, 12)

                // Row 3: Divider
                Rectangle()
                    .fill(Color.white.opacity(0.18))
                    .frame(height: 0.5)
                    .padding(.bottom, 12)

                // Row 4: Stats
                HStack(spacing: 0) {
                    ForEach(Array(stats.enumerated()), id: \.offset) { idx, stat in
                        if idx > 0 {
                            Rectangle()
                                .fill(Color.white.opacity(0.20))
                                .frame(width: 0.5, height: 15)
                        }
                        HStack(spacing: 6) {
                            if !stat.icon.isEmpty {
                                Image(systemName: stat.icon)
                                    .font(.system(size: stat.icon == "circle.fill" ? 6 : 11))
                                    .foregroundColor(stat.icon == "circle.fill" ? Color(hex: "5A8A6A") : .white.opacity(0.50))
                            }
                            if !stat.label.isEmpty {
                                Text(stat.label)
                                    .font(outfit(12.5, .light))
                                    .foregroundColor(.white.opacity(0.48))
                                    .lineLimit(1)
                            }
                            Text(stat.value)
                                .font(outfit(12.5, .bold))
                                .foregroundColor(.white)
                                .lineLimit(1)
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 16)
        }
        .frame(width: cardWidth, height: cardHeight)
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .scaleEffect(pressed ? 0.94 : 1.0)
        .brightness(pressed ? -0.03 : 0)
        .animation(.spring(response: 0.45, dampingFraction: 0.78), value: pressed)
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in if !pressed { pressed = true } }
                .onEnded   { _ in pressed = false; onTap?() }
        )
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – 2. AlfredLandscapeCard (300 × 205)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
struct AlfredLandscapeCard: View {
    let imageURL: String
    let badge: String?
    let name: String
    let subtitle: String
    let price: String
    let stats: [CardStat]
    var imageAlignment: Alignment = .center
    var cardWidth: CGFloat? = 300
    var cardHeight: CGFloat = 205
    var onTap: (() -> Void)? = nil

    @State private var pressed = false

    var body: some View {
        ZStack(alignment: .bottom) {
            // A) Photo
            CardPhoto(url: imageURL, pressed: pressed)
                .frame(width: cardWidth, height: cardHeight, alignment: imageAlignment)
                .clipped()

            // B) Gradient — top 45% fully clear
            LinearGradient(stops: [
                .init(color: .clear,               location: 0.00),
                .init(color: .clear,               location: 0.45),
                .init(color: .black.opacity(0.30), location: 0.58),
                .init(color: .black.opacity(0.75), location: 0.72),
                .init(color: .black.opacity(0.92), location: 0.86),
                .init(color: .black.opacity(0.97), location: 1.00),
            ], startPoint: .top, endPoint: .bottom)

            // C) Badge
            if let badge {
                VStack {
                    HStack {
                        Text(badge)
                            .font(outfit(12, .medium))
                            .foregroundColor(.white.opacity(0.88))
                            .padding(.horizontal, 13)
                            .padding(.vertical, 5)
                            .background(Color.black.opacity(0.65))
                            .clipShape(Capsule())
                            .padding(12)
                        Spacer()
                    }
                    Spacer()
                }
            }

            // D) Dots
            VStack {
                Spacer()
                CardDots(count: 4, active: 0, size: 5)
                    .padding(.bottom, 62)
            }

            // E) Text content
            VStack(alignment: .leading, spacing: 0) {
                // Row 1: Name + Price
                HStack(alignment: .lastTextBaseline) {
                    Text(name)
                        .font(outfit(17, .bold))
                        .foregroundColor(.white)
                        .tracking(-0.3)
                        .lineLimit(1)
                        .minimumScaleFactor(0.85)
                    Spacer()
                    Text(price)
                        .font(outfit(14, .bold))
                        .foregroundColor(.white)
                        .lineLimit(1)
                }
                .padding(.bottom, 2)

                // Row 2: Subtitle
                Text(subtitle)
                    .font(outfit(11, .light))
                    .foregroundColor(.white.opacity(0.46))
                    .lineLimit(1)
                    .padding(.bottom, 9)

                // Row 3: Divider
                Rectangle()
                    .fill(Color.white.opacity(0.18))
                    .frame(height: 0.5)
                    .padding(.bottom, 9)

                // Row 4: Stats
                HStack(spacing: 0) {
                    ForEach(Array(stats.enumerated()), id: \.offset) { idx, stat in
                        if idx > 0 {
                            Rectangle()
                                .fill(Color.white.opacity(0.20))
                                .frame(width: 0.5, height: 13)
                        }
                        HStack(spacing: 5) {
                            Image(systemName: stat.icon)
                                .font(.system(size: 10))
                                .foregroundColor(.white.opacity(0.50))
                            if !stat.label.isEmpty {
                                Text(stat.label)
                                    .font(outfit(11, .light))
                                    .foregroundColor(.white.opacity(0.46))
                                    .lineLimit(1)
                            }
                            Text(stat.value)
                                .font(outfit(11, .bold))
                                .foregroundColor(.white)
                                .lineLimit(1)
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
            }
            .padding(.horizontal, 14)
            .padding(.bottom, 13)
        }
        .frame(width: cardWidth, height: cardHeight)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .scaleEffect(pressed ? 0.95 : 1.0)
        .brightness(pressed ? -0.03 : 0)
        .animation(.spring(response: 0.45, dampingFraction: 0.78), value: pressed)
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in if !pressed { pressed = true } }
                .onEnded   { _ in pressed = false; onTap?() }
        )
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – 3. AlfredMembershipCard
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
struct AlfredMembershipCard: View {
    var isMember: Bool = false
    var onUpgrade: (() -> Void)? = nil

    @State private var pressed = false

    private var perks: [(String, Bool)] {
        isMember
            ? [
                ("Full app access",                 true),
                ("Unlimited concierge requests",    true),
                ("Priority access & VIP bookings",  true),
                ("Dedicated Alfred concierge",      true),
            ]
            : [
                ("Browse restaurants, cars and venues", true),
                ("1 free concierge request",            true),
                ("Unlimited concierge requests",        false),
                ("Priority access & VIP bookings",      false),
            ]
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Top shimmer line
            Rectangle()
                .fill(
                    LinearGradient(
                        colors: [.clear, Color.white.opacity(0.10), .clear],
                        startPoint: .leading, endPoint: .trailing
                    )
                )
                .frame(height: 1)

            VStack(alignment: .leading, spacing: 0) {
                // Tier label
                HStack(spacing: 8) {
                    Circle()
                        .fill(cS1.opacity(0.45))
                        .frame(width: 7, height: 7)
                    Text(isMember ? "ALFRED GOLD \u{2014} ACTIVE" : "ALFRED SILVER \u{2014} FREE")
                        .font(outfit(10, .medium))
                        .foregroundColor(cS6)
                        .kerning(1.6)
                }
                .padding(.bottom, 16)

                // Headline
                Text(isMember ? "You're an Alfred\nGold member." : "Unlock the full\nAlfred experience.")
                    .font(playfair(28, italic: true))
                    .foregroundColor(cS1)
                    .lineSpacing(3)
                    .padding(.bottom, 20)

                // Perks
                VStack(alignment: .leading, spacing: 11) {
                    ForEach(perks, id: \.0) { perk, active in
                        HStack(spacing: 11) {
                            Circle()
                                .fill(active ? cS1.opacity(0.45) : cS7.opacity(0.5))
                                .frame(width: 5, height: 5)
                            Text(perk)
                                .font(outfit(13, .light))
                                .foregroundColor(active ? cS4 : cS7)
                        }
                    }
                }
                .padding(.bottom, 24)

                // Upgrade button
                Button {
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                    onUpgrade?()
                } label: {
                    Text(isMember ? "MANAGE MEMBERSHIP" : "UPGRADE")
                        .font(outfit(14, .semibold))
                        .foregroundColor(cBG)
                        .kerning(0.8)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 15)
                        .background(cS1)
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                }
                .buttonStyle(.plain)
                .scaleEffect(pressed ? 0.97 : 1.0)
                .animation(.spring(response: 0.2, dampingFraction: 0.7), value: pressed)
                .simultaneousGesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { _ in pressed = true }
                        .onEnded   { _ in pressed = false }
                )
            }
            .padding(24)
        }
        .background(cEl)
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .strokeBorder(cBdr, lineWidth: 0.5)
        )
        .padding(.horizontal, 22)
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – 4. AlfredScrollSection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
struct AlfredScrollSection<Card: View>: View {
    let title: String
    var trailing: String = "See All"
    var trailingAction: (() -> Void)? = nil
    @ViewBuilder let content: () -> Card

    var body: some View {
        VStack(spacing: 0) {
            AlfredSectionHeader(title: title, trailing: trailing, action: trailingAction)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 14) {
                    content()
                }
                .padding(.horizontal, 22)
                .padding(.bottom, 4)
            }
        }
        .background(cBG)
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – 5. AlfredSectionHeader
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
struct AlfredSectionHeader: View {
    let title: String
    var trailing: String = "See All"
    var action: (() -> Void)? = nil

    var body: some View {
        HStack(alignment: .lastTextBaseline) {
            Text(title)
                .font(playfair(17))
                .foregroundColor(cS1)
            Spacer()
            if action != nil {
                Button { action?() } label: {
                    Text(trailing.uppercased())
                        .font(outfit(11, .light))
                        .foregroundColor(cS6)
                        .kerning(0.6)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 22)
        .padding(.top, 32)
        .padding(.bottom, 12)
        .background(cBG)
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – 6. AlfredDivider
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
struct AlfredDivider: View {
    var body: some View {
        Rectangle()
            .fill(cBdr)
            .frame(height: 0.5)
            .padding(.horizontal, 22)
            .padding(.top, 20)
            .background(cBG)
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – Price Helper
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
enum HomeCards {
    static func priceLabel(_ level: Int?) -> String {
        switch level ?? 2 {
        case 1:  return "\u{20AC}"
        case 3:  return "\u{20AC}\u{20AC}\u{20AC}"
        case 4:  return "\u{20AC}\u{20AC}\u{20AC}\u{20AC}"
        default: return "\u{20AC}\u{20AC}"
        }
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – Model → Card Initialisers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── Dining ──────────────────────────────────────────────────
extension AlfredBigCard {
    init(dining r: Restaurant, fullWidth: Bool = false, onTap: (() -> Void)? = nil) {
        self.init(
            imageURL: r.heroImageURL ?? "",
            badge:    nil,
            name:     r.name,
            subtitle: r.cuisine ?? "Fine Dining",
            price:    "",
            stats: [
                CardStat(icon: "circle.fill", label: "", value: r.availableTonight == true ? "Available" : "Check"),
                CardStat(icon: "",            label: "", value: HomeCards.priceLabel(r.priceLevel)),
                CardStat(icon: "star.fill",   label: "", value: r.rating.map { String(format: "%.1f", $0) } ?? "\u{2014}"),
            ],
            cardWidth: fullWidth ? UIScreen.main.bounds.width - 44 : 280,
            cardHeight: fullWidth ? 420 : 380,
            onTap: onTap
        )
    }
}

// ── Accommodation ───────────────────────────────────────────
extension AlfredBigCard {
    init(stay s: Accommodation, onTap: (() -> Void)? = nil) {
        self.init(
            imageURL: s.heroImageURL ?? "",
            badge:    s.accommodationType,
            name:     s.name,
            subtitle: [s.neighborhood, s.city].compactMap { $0 }.joined(separator: " \u{00B7} "),
            price:    s.pricePerNight ?? HomeCards.priceLabel(s.priceLevel),
            stats: [
                CardStat(icon: "building.2", label: "Type:",   value: s.accommodationType ?? "Hotel"),
                CardStat(icon: "star.fill",  label: "Rating:", value: s.rating.map { String(format: "%.1f", $0) } ?? "\u{2014}"),
                CardStat(icon: "calendar",   label: "",        value: "Per night"),
            ],
            onTap: onTap
        )
    }
}

// ── Cars (Big) ─────────────────────────────────────────────
extension AlfredBigCard {
    init(car c: Car, onTap: (() -> Void)? = nil) {
        self.init(
            imageURL: c.heroImageURL ?? "",
            badge:    "Available",
            name:     c.displayName,
            subtitle: [c.city, "All-day"].compactMap { $0 }.joined(separator: " \u{00B7} "),
            price:    "$\(c.pricePerDay)/day",
            stats: [
                CardStat(icon: "bolt.fill", label: "Power:",    value: c.hp.map { "\($0) hp" } ?? "\u{2014}"),
                CardStat(icon: "clock",     label: "Duration:", value: "Full day"),
                CardStat(icon: "house",     label: "Delivery:", value: "Included"),
            ],
            onTap: onTap
        )
    }
}

// ── Cars (Landscape) ───────────────────────────────────────
extension AlfredLandscapeCard {
    init(car c: Car, onTap: (() -> Void)? = nil) {
        self.init(
            imageURL: c.heroImageURL ?? "",
            badge:    "Available",
            name:     c.displayName,
            subtitle: [c.city, "All-day"].compactMap { $0 }.joined(separator: " \u{00B7} "),
            price:    "$\(c.pricePerDay)/day",
            stats: [
                CardStat(icon: "bolt.fill", label: "Power:", value: c.hp.map { "\($0) hp" } ?? "\u{2014}"),
                CardStat(icon: "clock",     label: "",       value: "Full day"),
            ],
            imageAlignment: .top,
            onTap: onTap
        )
    }
}

// ── Jets ────────────────────────────────────────────────────
extension AlfredBigCard {
    init(jet j: Jet, onTap: (() -> Void)? = nil) {
        self.init(
            imageURL: j.heroImageURL ?? "",
            badge:    j.jetType,
            name:     j.name,
            subtitle: j.city,
            price:    j.pricePerHour ?? HomeCards.priceLabel(j.priceLevel),
            stats: [
                CardStat(icon: "person.2", label: "Pax:",    value: j.passengers.map { "\($0)" } ?? "\u{2014}"),
                CardStat(icon: "airplane", label: "Range:",  value: j.range ?? "\u{2014}"),
                CardStat(icon: "clock",    label: "Depart:", value: "Anytime"),
            ],
            onTap: onTap
        )
    }
}

// ── Nightlife ───────────────────────────────────────────────
extension AlfredLandscapeCard {
    init(nightlife nc: Nightclub, onTap: (() -> Void)? = nil) {
        self.init(
            imageURL: nc.heroImageURL ?? "",
            badge:    nc.vibe,
            name:     nc.name,
            subtitle: nc.city,
            price:    HomeCards.priceLabel(nc.priceLevel),
            stats: [
                CardStat(icon: "wineglass", label: "Type:",  value: nc.vibe ?? "Club"),
                CardStat(icon: "clock",     label: "Open:",  value: "Tonight"),
            ],
            onTap: onTap
        )
    }
}

// ── Wellness ────────────────────────────────────────────────
extension AlfredLandscapeCard {
    init(wellness w: Wellness, onTap: (() -> Void)? = nil) {
        self.init(
            imageURL: w.heroImageURL ?? "",
            badge:    w.type ?? w.category,
            name:     w.name,
            subtitle: w.city ?? "",
            price:    HomeCards.priceLabel(w.priceLevel),
            stats: [
                CardStat(icon: "sparkles", label: "Type:",     value: w.type ?? w.category),
                CardStat(icon: "clock",    label: "Duration:", value: w.duration ?? "\u{2014}"),
            ],
            onTap: onTap
        )
    }
}

// ── Yachts ──────────────────────────────────────────────────
extension AlfredLandscapeCard {
    init(yacht y: Yacht, onTap: (() -> Void)? = nil) {
        self.init(
            imageURL: y.heroImageURL ?? "",
            badge:    y.yachtType,
            name:     y.name,
            subtitle: y.city,
            price:    HomeCards.priceLabel(y.priceLevel),
            stats: [
                CardStat(icon: "person.2", label: "Guests:",   value: y.capacity.map { "\($0)" } ?? "\u{2014}"),
                CardStat(icon: "clock",    label: "Duration:", value: "Full day"),
            ],
            onTap: onTap
        )
    }
}

// ── Backward-compatible init (for list views using AlfredExperience) ──
extension AlfredBigCard {
    init(experience exp: AlfredExperience, onTap: (() -> Void)? = nil) {
        self.init(
            imageURL: exp.imageName,
            badge:    exp.badge,
            name:     exp.venue,
            subtitle: exp.subtitle,
            price:    exp.price ?? "",
            stats: [
                CardStat(icon: "circle.fill", label: exp.stat1Label, value: exp.stat1Value),
                CardStat(icon: "circle.fill", label: exp.stat2Label, value: exp.stat2Value),
            ],
            onTap: onTap
        )
    }
}

extension AlfredLandscapeCard {
    init(experience exp: AlfredExperience, onTap: (() -> Void)? = nil) {
        self.init(
            imageURL: exp.imageName,
            badge:    exp.badge,
            name:     exp.venue,
            subtitle: exp.subtitle,
            price:    exp.price ?? "",
            stats: [
                CardStat(icon: "circle.fill", label: exp.stat1Label, value: exp.stat1Value),
                CardStat(icon: "circle.fill", label: exp.stat2Label, value: exp.stat2Value),
            ],
            onTap: onTap
        )
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: – Placeholder Cards (shown when data is empty)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
struct PlaceholderBigCard: View {
    var body: some View {
        RoundedRectangle(cornerRadius: 22, style: .continuous)
            .fill(cEl)
            .frame(width: 280, height: 380)
            .overlay(
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .strokeBorder(cBdr, lineWidth: 0.5)
            )
            .overlay(
                VStack(spacing: 10) {
                    ProgressView().tint(cS6)
                    Text("Loading")
                        .font(outfit(12, .light))
                        .foregroundColor(cS6)
                }
            )
    }
}

struct PlaceholderLandscapeCard: View {
    var body: some View {
        RoundedRectangle(cornerRadius: 18, style: .continuous)
            .fill(cEl)
            .frame(width: 300, height: 205)
            .overlay(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .strokeBorder(cBdr, lineWidth: 0.5)
            )
            .overlay(
                VStack(spacing: 10) {
                    ProgressView().tint(cS6)
                    Text("Loading")
                        .font(outfit(12, .light))
                        .foregroundColor(cS6)
                }
            )
    }
}

// ─────────────────────────────────────────────────────────────
// MARK: – Preview
// ─────────────────────────────────────────────────────────────
#Preview {
    ZStack {
        Color(hex: "111113").ignoresSafeArea()
        ScrollView {
            LazyVStack(spacing: 0) {
                // Big card sample
                AlfredScrollSection(title: "Dining") {
                    AlfredBigCard(
                        imageURL: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=90",
                        badge: "Omakase",
                        name: "Nobu Miami",
                        subtitle: "Brickell \u{00B7} Japanese\u{2013}Peruvian",
                        price: "\u{20AC}\u{20AC}\u{20AC}\u{20AC}",
                        stats: [
                            CardStat(icon: "fork.knife", label: "Cuisine:", value: "Omakase"),
                            CardStat(icon: "clock",      label: "Open:",    value: "Tonight"),
                            CardStat(icon: "star.fill",  label: "Rating:",  value: "4.9"),
                        ]
                    )
                }
                AlfredDivider()

                // Membership
                AlfredSectionHeader(title: "Membership", trailing: "Learn More")
                AlfredMembershipCard(isMember: false)
                AlfredDivider()

                // Landscape card sample
                AlfredScrollSection(title: "Nightlife") {
                    AlfredLandscapeCard(
                        imageURL: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600&q=90",
                        badge: "Members Club",
                        name: "Silencio",
                        subtitle: "Le Marais \u{00B7} Paris",
                        price: "from \u{20AC}800",
                        stats: [
                            CardStat(icon: "wineglass", label: "Type:", value: "Club"),
                            CardStat(icon: "clock",     label: "Open:", value: "Tonight"),
                        ]
                    )
                }

                Spacer().frame(height: 40)
            }
        }
    }
    .preferredColorScheme(.dark)
}
