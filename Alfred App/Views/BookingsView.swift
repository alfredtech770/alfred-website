//
//  BookingsView.swift
//  Alfred App
//
//  V4 — Centurion Edition
//  Rebranded from Black & Gold to Alfred Centurion silver/zinc system
//  SF Pro typography, elevated cards, monoline icons
//  Expandable upcoming cards, compact past rows, saved venue cards
//  Toast, cancel confirm dialog, modify bottom sheet
//

import SwiftUI

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - Design Tokens — Alfred Centurion
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Uses A.* design tokens (A.bg, A.el, A.srf, A.bd, A.s1–A.s7, A.gn, etc.)
//   .sf(size, weight) font helper

private let bkGreen  = A.gn
private let bkOrange = Color(hex: "FB923C")
private let bkPink   = Color(hex: "F472B6")
private let bkPurple = Color(hex: "A78BFA")
private let bkRed    = Color(hex: "FF453A")
private let bkGold   = Color(hex: "FFD60A")


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - Data Models
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

enum BVBookingStatus: String {
    case confirmed = "confirmed"
    case pending   = "pending"
    case completed = "completed"

    var color: Color {
        switch self {
        case .confirmed: return bkGreen
        case .pending:   return bkOrange
        case .completed: return A.s6
        }
    }
    var label: String {
        switch self {
        case .confirmed: return "CONFIRMED"
        case .pending:   return "PENDING"
        case .completed: return "COMPLETED"
        }
    }
}

struct BVUpcomingBooking: Identifiable {
    let id: String       // backend booking UUID
    let venue: String
    let type: String
    let imgURL: String
    let date: String
    let time: String
    var guests: Int
    var status: BVBookingStatus
    let address: String
    let note: String
    let tag: String
}

struct BVPastBooking: Identifiable {
    let id: String      // backend booking UUID
    let venue: String
    let type: String
    let imgURL: String
    let date: String
    let guests: Int
    var rating: Int
}

struct BVSavedVenue: Identifiable {
    let id: Int
    let name: String
    let type: String
    let imgURL: String
    let tag: String
    let tagColor: Color
    let rating: String
    let viewers: Int?
    let cat: String
}

// ── Date label for upcoming (Today, Tomorrow, or short weekday)
private func bkDateLabel(_ date: Date) -> String {
    let cal = Calendar.current
    if cal.isDateInToday(date) { return "Today" }
    if cal.isDateInTomorrow(date) { return "Tomorrow" }
    let formatter = DateFormatter()
    formatter.dateFormat = "EEE"
    return formatter.string(from: date)
}

private func bkPastDateLabel(_ date: Date) -> String {
    let formatter = DateFormatter()
    formatter.dateFormat = "MMM d"
    return formatter.string(from: date)
}

// ── Map BookingItem (from API) to view models
private func bkMapToUpcoming(_ item: BookingItem) -> BVUpcomingBooking {
    let tag: String = {
        let cal = Calendar.current
        if cal.isDateInToday(item.date) { return "TODAY" }
        if cal.isDateInTomorrow(item.date) { return "TOMORROW" }
        let f = DateFormatter(); f.dateFormat = "EEE"; return f.string(from: item.date).uppercased()
    }()
    return BVUpcomingBooking(
        id: item.id,
        venue: item.venueName,
        type: item.serviceType.rawValue,
        imgURL: item.imageURL ?? "",
        date: bkDateLabel(item.date),
        time: item.time,
        guests: item.guests,
        status: item.status == .confirmed ? .confirmed : .pending,
        address: item.location,
        note: "Booking via Alfred.",
        tag: tag
    )
}

private func bkMapToPast(_ item: BookingItem) -> BVPastBooking {
    BVPastBooking(
        id: item.id,
        venue: item.venueName,
        type: item.serviceType.rawValue,
        imgURL: item.imageURL ?? "",
        date: bkPastDateLabel(item.date),
        guests: item.guests,
        rating: 0
    )
}

// ── Saved venues (local/favorites; no backend in this scope)
private let mockSaved: [BVSavedVenue] = [
    BVSavedVenue(id: 10, name: "Le Cinq", type: "Fine Dining · 8th",
        imgURL: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
        tag: "MICHELIN ★★★", tagColor: A.s3, rating: "4.9", viewers: 8, cat: "Dining"),
    BVSavedVenue(id: 11, name: "CoCo Club", type: "Nightlife · Opéra",
        imgURL: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400&q=80",
        tag: "HOT", tagColor: bkPink, rating: "4.7", viewers: 14, cat: "Nightlife"),
    BVSavedVenue(id: 12, name: "Girafe", type: "Rooftop · 16th",
        imgURL: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80",
        tag: "ROOFTOP", tagColor: bkOrange, rating: "4.6", viewers: 12, cat: "Dining"),
    BVSavedVenue(id: 13, name: "Dior Spa", type: "Wellness · 8th",
        imgURL: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80",
        tag: "MEMBERS", tagColor: bkPurple, rating: "4.9", viewers: 4, cat: "Wellness"),
    BVSavedVenue(id: 14, name: "Ferrari F8 Tributo", type: "Supercar · Self-drive",
        imgURL: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=400&q=80",
        tag: "POPULAR", tagColor: bkOrange, rating: "4.9", viewers: 5, cat: "Cars"),
    BVSavedVenue(id: 15, name: "Hôtel Costes", type: "Cocktails · 1st",
        imgURL: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&q=80",
        tag: "EXCLUSIVE", tagColor: A.s3, rating: "4.8", viewers: 6, cat: "Nightlife"),
]

// ── Modify state
private struct BVModifyData {
    var date: String = ""
    var time: String = ""
    var guests: Int = 2
}

// ── Toast state
private struct BVToast: Equatable {
    let msg: String
    let isCancel: Bool
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - Main BookingsView
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

struct BookingsView: View {
    @Binding var selectedTab: AppTab

    // Tab
    @State private var tab: String = "upcoming"

    // Data — loaded from user account (BookingService); starts empty
    @State private var upcoming: [BVUpcomingBooking] = []
    @State private var past:     [BVPastBooking]     = []
    @State private var saved:    [BVSavedVenue]      = mockSaved

    // Loading / error
    @State private var isLoading = false
    @State private var loadError: String?

    // UI state
    @State private var expandedId: String? = nil
    @State private var savedCat: String = "All"
    @State private var pastRatings: [String: Int] = [:]

    // Overlays
    @State private var toast: BVToast?            = nil
    @State private var toastTask: Task<Void,Never>? = nil
    @State private var confirmCancel: BVUpcomingBooking? = nil
    @State private var modifyBooking: BVUpcomingBooking? = nil
    @State private var modifyData = BVModifyData()

    private let savedCategories = ["All", "Dining", "Nightlife", "Wellness", "Cars"]
    private let modifyDates = ["Tonight", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"]
    private let modifyTimes = ["7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM","10:00 PM","10:30 PM","11:00 PM"]

    var body: some View {
        ZStack {
            A.bg.ignoresSafeArea()

            // Main scrollable content
            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    // Header
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Bookings")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundStyle(A.s1)
                        Capsule()
                            .fill(A.s7)
                            .frame(width: 28, height: 2)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 20)
                    .padding(.top, 20)
                    .padding(.bottom, 8)

                    // Tab switcher — segment control
                    HStack(spacing: 4) {
                        ForEach(["upcoming", "past", "saved"], id: \.self) { t in
                            Button {
                                withAnimation(.easeInOut(duration: 0.25)) { tab = t }
                                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                            } label: {
                                Text(t.capitalized)
                                    .font(.sf(13, weight: tab == t ? .semibold : .regular))
                                    .foregroundStyle(tab == t ? A.s1 : A.s5)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 11)
                                    .background(
                                        RoundedRectangle(cornerRadius: 11)
                                            .fill(tab == t ? A.el : Color.clear)
                                    )
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(4)
                    .background(A.srf)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                    .overlay(RoundedRectangle(cornerRadius: 14).stroke(A.bd, lineWidth: 0.5))
                    .padding(.horizontal, 20)
                    .padding(.top, 20)

                    // Tab content
                    Group {
                        switch tab {
                        case "upcoming": upcomingTab
                        case "past":     pastTab
                        case "saved":    savedTab
                        default:         upcomingTab
                        }
                    }
                    .padding(.top, 24)

                    Spacer().frame(height: 110)
                }
            }

            // ─── Toast overlay
            if let t = toast {
                BVToastView(toast: t)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                    .zIndex(60)
                    .frame(maxHeight: .infinity, alignment: .bottom)
                    .padding(.bottom, 90)
            }

            // ─── Cancel confirm dialog
            if let b = confirmCancel {
                BVCancelDialog(
                    venueName: b.venue,
                    onKeep: { withAnimation { confirmCancel = nil } },
                    onCancel: {
                        if b.id.hasPrefix("local-") {
                            withAnimation {
                                upcoming.removeAll { $0.id == b.id }
                                confirmCancel = nil
                                if expandedId == b.id { expandedId = upcoming.first?.id }
                            }
                            showToast("Booking cancelled", isCancel: true)
                        } else {
                            Task {
                                do {
                                    guard let uuid = UUID(uuidString: b.id) else { return }
                                    try await BookingService.shared.cancelBooking(bookingId: uuid, venueName: b.venue, serviceType: b.type, city: nil)
                                    await MainActor.run {
                                        withAnimation {
                                            upcoming.removeAll { $0.id == b.id }
                                            confirmCancel = nil
                                            if expandedId == b.id { expandedId = upcoming.first?.id }
                                        }
                                        showToast("Booking cancelled", isCancel: true)
                                    }
                                } catch {
                                    await MainActor.run {
                                        confirmCancel = nil
                                        showToast("Couldn't cancel: \(error.localizedDescription)", isCancel: true)
                                    }
                                }
                            }
                        }
                    }
                )
                .zIndex(40)
            }

            // ─── Modify bottom sheet
            if let b = modifyBooking {
                Color.black.opacity(0.6)
                    .ignoresSafeArea()
                    .onTapGesture { withAnimation { modifyBooking = nil } }
                    .zIndex(40)

                VStack {
                    Spacer()
                    BVModifySheet(
                        venue: b.venue,
                        data: $modifyData,
                        dates: modifyDates,
                        times: modifyTimes,
                        onCancel: { withAnimation { modifyBooking = nil } },
                        onSave: {
                            let savedData = modifyData
                            // Update local state immediately
                            withAnimation {
                                upcoming = upcoming.map { booking in
                                    guard booking.id == b.id else { return booking }
                                    var m = booking
                                    if !savedData.date.isEmpty {
                                        m = BVUpcomingBooking(
                                            id: m.id, venue: m.venue, type: m.type, imgURL: m.imgURL,
                                            date: savedData.date,
                                            time: savedData.time.isEmpty ? m.time : savedData.time,
                                            guests: savedData.guests,
                                            status: m.status, address: m.address, note: m.note, tag: m.tag
                                        )
                                    }
                                    return m
                                }
                                modifyBooking = nil
                            }
                            showToast("Booking updated")
                            // Persist to backend + notify concierge on Slack
                            if !b.id.hasPrefix("local-"), let uuid = UUID(uuidString: b.id) {
                                let oldDate = b.date
                                let oldTime = b.time
                                let oldGuests = b.guests
                                Task {
                                    try? await BookingService.shared.updateBooking(
                                        bookingId: uuid,
                                        date: savedData.date.isEmpty ? nil : savedData.date,
                                        time: savedData.time.isEmpty ? nil : savedData.time,
                                        guests: savedData.guests,
                                        venueName: b.venue,
                                        serviceType: b.type,
                                        city: nil,
                                        oldDate: oldDate,
                                        oldTime: oldTime,
                                        oldGuests: oldGuests
                                    )
                                }
                            }
                        }
                    )
                    .zIndex(41)
                }
                .ignoresSafeArea()
                .zIndex(40)
            }
        }
        .toolbar(.hidden, for: .navigationBar)
        .task { await loadBookings() }
        .refreshable { await loadBookings() }
    }

    @MainActor
    private func loadBookings() async {
        isLoading = true
        loadError = nil
        defer { isLoading = false }
        do {
            let items = try await BookingService.shared.fetchBookings()
            let startOfToday = Calendar.current.startOfDay(for: Date())
            let upcomingItems = items
                .filter { $0.status != .cancelled && $0.date >= startOfToday }
                .sorted { $0.date < $1.date }
            let pastItems = items
                .filter { $0.status != .cancelled && ($0.date < startOfToday || $0.status == .completed) }
                .sorted { $0.date > $1.date }
            upcoming = upcomingItems.map(bkMapToUpcoming)
            past = pastItems.map(bkMapToPast)
            if expandedId != nil, !upcoming.contains(where: { $0.id == expandedId }) {
                expandedId = upcoming.first?.id
            } else if expandedId == nil, let first = upcoming.first {
                expandedId = first.id
            }
        } catch {
            loadError = error.localizedDescription
            upcoming = []
            past = []
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: - Upcoming Tab
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private var upcomingTab: some View {
        VStack(spacing: 0) {
            if isLoading && upcoming.isEmpty {
                VStack(spacing: 14) {
                    ProgressView().tint(A.s5).scaleEffect(1.2)
                    Text("Loading your bookings…")
                        .font(.sf(14))
                        .foregroundStyle(A.s5)
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 56)
            } else if let err = loadError, upcoming.isEmpty {
                VStack(spacing: 14) {
                    Image(systemName: "exclamationmark.triangle")
                        .font(.system(size: 30, weight: .light))
                        .foregroundStyle(A.s6)
                    Text("Couldn’t load bookings")
                        .font(.sf(15, weight: .medium))
                        .foregroundStyle(A.s1)
                    Text(err)
                        .font(.sf(13))
                        .foregroundStyle(A.s5)
                        .multilineTextAlignment(.center)
                    Button("Try again") { Task { await loadBookings() } }
                        .font(.sf(14, weight: .medium))
                        .foregroundStyle(A.s1)
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 48)
                .padding(.horizontal, 20)
            } else if upcoming.isEmpty {
                VStack(spacing: 14) {
                    Text("✦")
                        .font(.sf(30))
                        .foregroundStyle(A.s7)
                    Text("No upcoming bookings")
                        .font(.sf(15))
                        .foregroundStyle(A.s5)
                    Text("Book restaurants, experiences, and more — they’ll show up here.")
                        .font(.sf(13))
                        .foregroundStyle(A.s6)
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 48)
                .padding(.horizontal, 32)
            } else {
                VStack(spacing: 12) {
                    ForEach(upcoming) { b in
                        BVUpcomingCard(
                            booking: b,
                            isExpanded: expandedId == b.id,
                            onTap: {
                                withAnimation(.easeInOut(duration: 0.3)) {
                                    expandedId = expandedId == b.id ? nil : b.id
                                }
                                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                            },
                            onModify: {
                                modifyData = BVModifyData(date: b.date, time: b.time, guests: b.guests)
                                withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                    modifyBooking = b
                                }
                            },
                            onCancel: {
                                withAnimation { confirmCancel = b }
                            },
                            onDirections: {
                                let query = "\(b.address), Paris"
                                    .addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
                                UIApplication.shared.open(URL(string: "https://www.google.com/maps/search/\(query)")!)
                            }
                        )
                    }
                }
                .padding(.horizontal, 20)
            }

            // "Ask Alfred" card — matches HomeView AskBar
            Button {
                openWhatsApp(message: "Hi Alfred, I'd like to make a new reservation")
                showToast("Opening WhatsApp…")
            } label: {
                HStack(spacing: 14) {
                    ZStack {
                        Circle().fill(A.srf).frame(width: 46, height: 46)
                        AlfredMarkView(size: 24, color: A.s4)
                    }
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Ask Alfred")
                            .font(.sf(16, weight: .semibold))
                            .foregroundStyle(A.s1)
                        HStack(spacing: 6) {
                            Circle().fill(bkGreen).frame(width: 5, height: 5)
                            Text("Online · Arrange something new")
                                .font(.sf(12))
                                .foregroundStyle(A.s5)
                        }
                    }
                    Spacer()
                    Image(systemName: "arrow.up.right")
                        .font(.system(size: 14, weight: .light))
                        .foregroundStyle(A.s4)
                }
                .padding(.leading, 18)
                .padding(.trailing, 18)
                .padding(.vertical, 16)
                .background(A.el)
                .clipShape(RoundedRectangle(cornerRadius: 18))
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(A.bd, lineWidth: 0.5))
            }
            .buttonStyle(AlfredPressStyle())
            .padding(.horizontal, 20)
            .padding(.top, 24)
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MARK: - Past Tab
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private var pastTab: some View {
        VStack(spacing: 0) {
            if past.isEmpty {
                VStack(spacing: 14) {
                    Image(systemName: "calendar.badge.clock")
                        .font(.system(size: 30, weight: .light))
                        .foregroundStyle(A.s6)
                    Text("No past bookings")
                        .font(.sf(15))
                        .foregroundStyle(A.s5)
                    Text("Completed bookings will appear here.")
                        .font(.sf(13))
                        .foregroundStyle(A.s6)
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 48)
                .padding(.horizontal, 32)
            } else {
            VStack(spacing: 12) {
                ForEach(past) { b in
                    BVPastRow(
                        booking: b,
                        currentRating: pastRatings[b.id] ?? b.rating,
                        onRate: { stars in
                            pastRatings[b.id] = stars
                            showToast("Rated \(stars) stars")
                        },
                        onRebook: {
                            openWhatsApp(message: "Hi Alfred, I'd like to rebook \(b.venue)")
                            showToast("Opening WhatsApp to rebook…")
                        }
                    )
                }
            }
            .padding(.horizontal, 20)

            // Stats footer
            BVPastFooter(
                totalBookings: past.count + upcoming.count,
                totalSpent: Double(past.count) * 350 / 1000,
                avgRating: past.isEmpty ? nil : Double(past.map { pastRatings[$0.id] ?? $0.rating }.reduce(0, +)) / Double(past.count)
            )
            .padding(.horizontal, 20)
            .padding(.top, 16)
            }
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    private func savedCatEmoji(_ cat: String) -> String {
        switch cat {
        case "Dining":    return "🍽️"
        case "Nightlife": return "🍸"
        case "Wellness":  return "🧖"
        case "Cars":      return "🏎️"
        default:          return "✦"
        }
    }

    // MARK: - Saved Tab
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    private var savedTab: some View {
        VStack(spacing: 0) {
            // Category pills — HomeView style
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 10) {
                    ForEach(savedCategories, id: \.self) { cat in
                        let count = cat == "All" ? saved.count : saved.filter { $0.cat == cat }.count
                        if cat == "All" || count > 0 {
                            Button {
                                withAnimation(.spring(response: 0.2, dampingFraction: 0.7)) { savedCat = cat }
                                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                            } label: {
                                HStack(spacing: 8) {
                                    Text(savedCatEmoji(cat))
                                        .font(.system(size: 16))
                                        .frame(width: 24, height: 24)
                                    Text("\(cat) · \(count)")
                                        .font(.outfit(13, weight: savedCat == cat ? .medium : .regular))
                                        .foregroundStyle(savedCat == cat ? A.s1 : A.s4)
                                }
                                .padding(.horizontal, 14)
                                .padding(.vertical, 12)
                                .background(A.el)
                                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                                        .strokeBorder(savedCat == cat ? A.s1.opacity(0.2) : A.bd, lineWidth: 0.5)
                                )
                            }
                            .buttonStyle(AlfredPressStyle())
                        }
                    }
                }
                .padding(.horizontal, 20)
            }
            .padding(.bottom, 16)

            // Saved venue cards — horizontal scroll, HomeView style
            let filtered = savedCat == "All" ? saved : saved.filter { $0.cat == savedCat }

            if filtered.isEmpty {
                VStack(spacing: 14) {
                    Image(systemName: "heart")
                        .font(.system(size: 28, weight: .light))
                        .foregroundStyle(A.s6)
                    Text("No saved places")
                        .font(.sf(15))
                        .foregroundStyle(A.s5)
                    Text("Explore and save your favourites")
                        .font(.sf(13))
                        .foregroundStyle(A.s6)
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 48)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 14) {
                        ForEach(filtered) { v in
                            BVSavedCard(
                                venue: v,
                                onUnsave: {
                                    withAnimation {
                                        saved.removeAll { $0.id == v.id }
                                    }
                                    showToast("\(v.name) removed", isCancel: true)
                                },
                                onTap: {
                                    openWhatsApp(message: "Hi Alfred, I'd like to book \(v.name)")
                                    showToast("Opening WhatsApp to book…")
                                }
                            )
                        }
                    }
                    .padding(.horizontal, 20)
                }
            }
        }
    }

    // ── Toast helper
    private func showToast(_ msg: String, isCancel: Bool = false) {
        toastTask?.cancel()
        withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
            toast = BVToast(msg: msg, isCancel: isCancel)
        }
        toastTask = Task {
            try? await Task.sleep(nanoseconds: 2_200_000_000)
            guard !Task.isCancelled else { return }
            await MainActor.run {
                withAnimation(.easeOut(duration: 0.3)) { toast = nil }
            }
        }
    }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - Upcoming Card (expandable)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

private struct BVUpcomingCard: View {
    let booking: BVUpcomingBooking
    let isExpanded: Bool
    let onTap: () -> Void
    let onModify: () -> Void
    let onCancel: () -> Void
    let onDirections: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 0) {
                // ── Collapsed row
                HStack(spacing: 12) {
                    // 54x54 gradient icon
                    ZStack {
                        RoundedRectangle(cornerRadius: 16)
                            .fill(
                                LinearGradient(
                                    colors: [A.srf, A.el],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 54, height: 54)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(A.bd, lineWidth: 0.5)
                            )
                        Image(systemName: booking.type == "restaurant" ? "fork.knife" : booking.type == "nightclub" ? "moon.stars" : "sparkles")
                            .font(.system(size: 20, weight: .light))
                            .foregroundStyle(A.s4)
                    }
                    .padding(.top, 2)

                    // Info
                    VStack(alignment: .leading, spacing: 6) {
                        HStack(spacing: 6) {
                            Text(booking.venue)
                                .font(.sf(15, weight: .semibold))
                                .foregroundStyle(A.s1)
                                .lineLimit(1)

                            // Status badge with colored bg
                            Text(booking.status.label)
                                .font(.sf(9, weight: .semibold))
                                .foregroundStyle(booking.status.color)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(booking.status.color.opacity(0.15))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        }

                        // Date / time / guests
                        HStack(spacing: 10) {
                            HStack(spacing: 4) {
                                Image(systemName: "calendar")
                                    .font(.system(size: 10, weight: .light))
                                    .foregroundStyle(A.s6)
                                Text(booking.date)
                                    .font(.sf(12))
                                    .foregroundStyle(A.s4)
                            }
                            HStack(spacing: 4) {
                                Image(systemName: "clock")
                                    .font(.system(size: 10, weight: .light))
                                    .foregroundStyle(A.s6)
                                Text(booking.time)
                                    .font(.sf(12))
                                    .foregroundStyle(A.s4)
                            }
                            HStack(spacing: 4) {
                                Image(systemName: "person.2")
                                    .font(.system(size: 10, weight: .light))
                                    .foregroundStyle(A.s6)
                                Text("\(booking.guests)")
                                    .font(.sf(12))
                                    .foregroundStyle(A.s4)
                            }
                        }
                    }

                    Spacer()
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 14)

                // ── Expanded section
                if isExpanded {
                    VStack(alignment: .leading, spacing: 0) {
                        // Divider
                        Rectangle()
                            .fill(A.bd)
                            .frame(height: 0.5)
                            .padding(.bottom, 14)

                        // Alfred note
                        HStack(alignment: .top, spacing: 8) {
                            Text("✦")
                                .font(.sf(10))
                                .foregroundStyle(A.s6)
                                .padding(.top, 1)
                            Text(booking.note)
                                .font(.sf(13))
                                .italic()
                                .foregroundStyle(A.s4)
                                .lineSpacing(4)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 12)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(A.srf.opacity(0.5))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(A.bd, lineWidth: 0.5)
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 12))

                        // Address (directions link)
                        Button(action: onDirections) {
                            HStack(spacing: 5) {
                                Image(systemName: "mappin")
                                    .font(.system(size: 11, weight: .light))
                                    .foregroundStyle(A.s6)
                                Text(booking.address)
                                    .font(.sf(12))
                                    .foregroundStyle(A.s5)
                                    .underline(true, color: A.s6)
                            }
                        }
                        .buttonStyle(.plain)
                        .padding(.top, 10)

                        // Action buttons
                        HStack(spacing: 8) {
                            BVActionButton(label: "Modify", isPrimary: true, action: onModify)
                            BVActionButton(label: "Cancel", isPrimary: false, action: onCancel)
                            BVActionButton(label: "Directions", isPrimary: false, action: onDirections)
                        }
                        .padding(.top, 12)
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 16)
                    .transition(.opacity.combined(with: .move(edge: .top)))
                }
            }
            .background(A.el)
            .overlay(
                RoundedRectangle(cornerRadius: 18)
                    .stroke(isExpanded ? A.s1.opacity(0.08) : A.bd, lineWidth: 0.5)
            )
            .clipShape(RoundedRectangle(cornerRadius: 18))
            .shadow(color: Color.black.opacity(isExpanded ? 0.28 : 0.16), radius: isExpanded ? 12 : 5, y: 2)
        }
        .buttonStyle(.plain)
        .animation(.easeInOut(duration: 0.3), value: isExpanded)
    }
}

private struct BVActionButton: View {
    let label: String
    let isPrimary: Bool
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.sf(12, weight: isPrimary ? .medium : .regular))
                .foregroundStyle(isPrimary ? A.s1 : A.s5)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 11)
                .background(isPrimary ? A.s1.opacity(0.07) : Color.clear)
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(isPrimary ? A.s1.opacity(0.12) : A.bd, lineWidth: 0.5)
                )
                .clipShape(RoundedRectangle(cornerRadius: 14))
        }
        .buttonStyle(.plain)
    }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - Past Row (compact horizontal)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

private struct BVPastRow: View {
    let booking: BVPastBooking
    let currentRating: Int
    let onRate: (Int) -> Void
    let onRebook: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // Initial avatar — clean surface
            ZStack {
                RoundedRectangle(cornerRadius: 14)
                    .fill(A.el)
                    .frame(width: 52, height: 52)
                    .overlay(
                        RoundedRectangle(cornerRadius: 14)
                            .stroke(A.bd, lineWidth: 0.5)
                    )
                Text(String(booking.venue.prefix(1)))
                    .font(.sf(22, weight: .light))
                    .foregroundStyle(A.s5)
            }

            // Name + date
            VStack(alignment: .leading, spacing: 4) {
                Text(booking.venue)
                    .font(.sf(14, weight: .medium))
                    .foregroundStyle(A.s1)
                    .lineLimit(1)
                HStack(spacing: 5) {
                    Text(booking.date)
                        .font(.sf(12))
                        .foregroundStyle(A.s5)
                    Circle().fill(A.s7).frame(width: 2, height: 2)
                    Text("\(booking.guests) guests")
                        .font(.sf(12))
                        .foregroundStyle(A.s5)
                }
            }

            Spacer()

            // Stars + Rebook
            VStack(alignment: .trailing, spacing: 6) {
                HStack(spacing: 2) {
                    ForEach(1...5, id: \.self) { s in
                        Button { onRate(s) } label: {
                            Image(systemName: s <= currentRating ? "star.fill" : "star")
                                .font(.system(size: 10, weight: .light))
                                .foregroundStyle(s <= currentRating ? bkGold : A.s7)
                        }
                        .buttonStyle(.plain)
                    }
                }
                Button(action: onRebook) {
                    Text("Rebook")
                        .font(.sf(11, weight: .medium))
                        .foregroundStyle(A.s4)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 4)
                        .background(A.srf)
                        .overlay(
                            RoundedRectangle(cornerRadius: 9)
                                .stroke(A.bd, lineWidth: 0.5)
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 9))
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 14)
        .background(A.el)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(A.bd, lineWidth: 0.5)
        )
        .clipShape(RoundedRectangle(cornerRadius: 18))
    }
}

private struct BVPastFooter: View {
    let totalBookings: Int
    let totalSpent: Double
    let avgRating: Double?

    var body: some View {
        VStack(spacing: 14) {
            Text("Member since February 2026")
                .font(.sf(12))
                .foregroundStyle(A.s6)

            HStack(spacing: 16) {
                BVStatCell(value: "\(totalBookings)", label: "Bookings")
                Rectangle().fill(A.bd).frame(width: 0.5, height: 24)
                BVStatCell(value: "€\(String(format: "%.1f", totalSpent))K", label: "Spent")
                Rectangle().fill(A.bd).frame(width: 0.5, height: 24)
                BVStatCell(value: avgRating.map { String(format: "%.1f", $0) } ?? "—", label: "Avg ★")
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 20)
    }
}

private struct BVStatCell: View {
    let value: String
    let label: String
    var body: some View {
        VStack(spacing: 3) {
            Text(value)
                .font(.sf(16, weight: .medium))
                .foregroundStyle(A.s1)
            Text(label)
                .font(.sf(11))
                .foregroundStyle(A.s6)
        }
    }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - Saved Venue Card (image + overlay)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

private struct BVSavedCard: View {
    let venue: BVSavedVenue
    let onUnsave: () -> Void
    let onTap: () -> Void
    @State private var pressed = false

    private let cardWidth: CGFloat = 300
    private let cardHeight: CGFloat = 205

    var body: some View {
        ZStack(alignment: .bottom) {
            // A) Photo
            AsyncImage(url: URL(string: venue.imgURL)) { phase in
                switch phase {
                case .success(let img):
                    img.resizable().aspectRatio(contentMode: .fill)
                case .failure:
                    ZStack {
                        A.el
                        Text(String(venue.name.prefix(1)))
                            .font(.sf(36, weight: .light))
                            .foregroundStyle(A.s7)
                    }
                default:
                    A.srf.opacity(0.3)
                }
            }
            .frame(width: cardWidth, height: cardHeight)
            .clipped()

            // B) Gradient — matches AlfredLandscapeCard
            LinearGradient(stops: [
                .init(color: .clear,               location: 0.00),
                .init(color: .clear,               location: 0.45),
                .init(color: .black.opacity(0.30), location: 0.58),
                .init(color: .black.opacity(0.75), location: 0.72),
                .init(color: .black.opacity(0.92), location: 0.86),
                .init(color: .black.opacity(0.97), location: 1.00),
            ], startPoint: .top, endPoint: .bottom)

            // C) Top: badge (left) + unsave heart (right)
            VStack {
                HStack {
                    Text(venue.tag)
                        .font(.outfit(12, weight: .medium))
                        .foregroundStyle(.white.opacity(0.88))
                        .padding(.horizontal, 13)
                        .padding(.vertical, 5)
                        .background(Color.black.opacity(0.65))
                        .clipShape(Capsule())
                    Spacer()
                    Button(action: {
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        onUnsave()
                    }) {
                        ZStack {
                            Circle()
                                .fill(Color.black.opacity(0.45))
                                .frame(width: 32, height: 32)
                            Image(systemName: "heart.fill")
                                .font(.system(size: 13, weight: .medium))
                                .foregroundStyle(bkRed)
                        }
                    }
                    .buttonStyle(.plain)
                }
                .padding(12)
                Spacer()
            }

            // D) Bottom text — matches AlfredLandscapeCard layout
            VStack(alignment: .leading, spacing: 0) {
                HStack(alignment: .lastTextBaseline) {
                    Text(venue.name)
                        .font(.outfit(17, weight: .bold))
                        .foregroundStyle(.white)
                        .tracking(-0.3)
                        .lineLimit(1)
                        .minimumScaleFactor(0.85)
                    Spacer()
                }
                .padding(.bottom, 2)

                Text(venue.type)
                    .font(.outfit(11, weight: .light))
                    .foregroundStyle(.white.opacity(0.46))
                    .lineLimit(1)
                    .padding(.bottom, 9)

                Rectangle()
                    .fill(Color.white.opacity(0.18))
                    .frame(height: 0.5)
                    .padding(.bottom, 9)

                HStack(spacing: 0) {
                    HStack(spacing: 5) {
                        Image(systemName: "star.fill")
                            .font(.system(size: 10))
                            .foregroundStyle(.white.opacity(0.50))
                        Text(venue.rating)
                            .font(.outfit(11, weight: .bold))
                            .foregroundStyle(.white)
                    }
                    .frame(maxWidth: .infinity)

                    Rectangle()
                        .fill(Color.white.opacity(0.20))
                        .frame(width: 0.5, height: 13)

                    HStack(spacing: 5) {
                        Image(systemName: "tag")
                            .font(.system(size: 10))
                            .foregroundStyle(.white.opacity(0.50))
                        Text(venue.cat)
                            .font(.outfit(11, weight: .bold))
                            .foregroundStyle(.white)
                    }
                    .frame(maxWidth: .infinity)

                    if let viewers = venue.viewers {
                        Rectangle()
                            .fill(Color.white.opacity(0.20))
                            .frame(width: 0.5, height: 13)
                        HStack(spacing: 5) {
                            Circle()
                                .fill(bkGreen)
                                .frame(width: 5, height: 5)
                            Text("\(viewers) now")
                                .font(.outfit(11, weight: .bold))
                                .foregroundStyle(.white)
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
                .onEnded { _ in
                    pressed = false
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                    onTap()
                }
        )
    }
}

private struct BVSmallTag: View {
    let text: String
    let color: Color
    var body: some View {
        Text(text)
            .font(.sf(9, weight: .medium))
            .foregroundStyle(color.opacity(0.85))
            .padding(.horizontal, 7)
            .padding(.vertical, 3)
            .background(color.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 6))
    }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - Toast
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

private struct BVToastView: View {
    let toast: BVToast
    var body: some View {
        HStack(spacing: 8) {
            ZStack {
                Circle()
                    .fill(toast.isCancel ? bkRed.opacity(0.12) : A.s1.opacity(0.08))
                    .frame(width: 20, height: 20)
                Image(systemName: toast.isCancel ? "xmark" : "checkmark")
                    .font(.system(size: 9, weight: .medium))
                    .foregroundStyle(toast.isCancel ? bkRed : A.s1)
            }
            Text(toast.msg)
                .font(.sf(12))
                .foregroundStyle(A.s1)
                .lineLimit(1)
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 10)
        .background(
            Capsule()
                .fill(A.el.opacity(0.95))
                .shadow(color: Color.black.opacity(0.5), radius: 15, y: 8)
        )
        .overlay(
            Capsule()
                .stroke(A.bd, lineWidth: 0.5)
        )
    }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - Cancel Confirm Dialog
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

private struct BVCancelDialog: View {
    let venueName: String
    let onKeep: () -> Void
    let onCancel: () -> Void

    var body: some View {
        ZStack {
            Color.black.opacity(0.70)
                .ignoresSafeArea()

            VStack(spacing: 0) {
                Text("Cancel booking?")
                    .font(.system(size: 22, weight: .bold))
                    .foregroundStyle(A.s1)
                    .multilineTextAlignment(.center)

                Text("Your reservation at \(venueName) will be cancelled. Alfred will notify the venue.")
                    .font(.sf(14))
                    .foregroundStyle(A.s4)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
                    .padding(.top, 8)

                HStack(spacing: 10) {
                    Button(action: onKeep) {
                        Text("Keep it")
                            .font(.sf(14, weight: .medium))
                            .foregroundStyle(bkGreen)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(bkGreen.opacity(0.08))
                            .overlay(
                                RoundedRectangle(cornerRadius: 14)
                                    .stroke(bkGreen.opacity(0.15), lineWidth: 0.5)
                            )
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                    .buttonStyle(.plain)

                    Button(action: onCancel) {
                        Text("Cancel booking")
                            .font(.sf(14))
                            .foregroundStyle(A.s5)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 14)
                                    .stroke(A.bd, lineWidth: 0.5)
                            )
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                    .buttonStyle(.plain)
                }
                .padding(.top, 24)
            }
            .padding(24)
            .frame(width: UIScreen.main.bounds.width * 0.80)
            .background(A.el)
            .overlay(
                RoundedRectangle(cornerRadius: 18)
                    .stroke(A.bd, lineWidth: 0.5)
            )
            .clipShape(RoundedRectangle(cornerRadius: 18))
        }
    }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - Modify Bottom Sheet
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

private struct BVModifySheet: View {
    let venue: String
    @Binding var data: BVModifyData
    let dates: [String]
    let times: [String]
    let onCancel: () -> Void
    let onSave: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Handle
            Capsule()
                .fill(A.s7)
                .frame(width: 32, height: 3)
                .frame(maxWidth: .infinity)
                .padding(.top, 16)
                .padding(.bottom, 16)

            Text("Modify \(venue)")
                .font(.system(size: 22, weight: .bold))
                .foregroundStyle(A.s1)
                .padding(.horizontal, 20)

            Text("Alfred will confirm changes with the venue")
                .font(.sf(13))
                .foregroundStyle(A.s5)
                .padding(.horizontal, 20)
                .padding(.top, 4)

            // DATE
            VStack(alignment: .leading, spacing: 8) {
                Text("Date")
                    .font(.sf(13, weight: .medium))
                    .foregroundStyle(A.s1)
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(dates, id: \.self) { d in
                            Button {
                                data.date = d
                                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                            } label: {
                                Text(d)
                                    .font(.sf(12, weight: data.date == d ? .medium : .regular))
                                    .foregroundStyle(data.date == d ? A.s1 : A.s4)
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 9)
                                    .background(data.date == d ? A.s1.opacity(0.06) : A.srf)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 10)
                                            .stroke(data.date == d ? A.s1.opacity(0.12) : A.bd, lineWidth: 0.5)
                                    )
                                    .clipShape(RoundedRectangle(cornerRadius: 10))
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.horizontal, 20)
                }
            }
            .padding(.top, 18)

            // TIME
            VStack(alignment: .leading, spacing: 8) {
                Text("Time")
                    .font(.sf(13, weight: .medium))
                    .foregroundStyle(A.s1)
                    .padding(.horizontal, 20)
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(times, id: \.self) { t in
                            Button {
                                data.time = t
                                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                            } label: {
                                Text(t)
                                    .font(.sf(12, weight: data.time == t ? .medium : .regular))
                                    .foregroundStyle(data.time == t ? A.s1 : A.s4)
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 9)
                                    .background(data.time == t ? A.s1.opacity(0.06) : A.srf)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 10)
                                            .stroke(data.time == t ? A.s1.opacity(0.12) : A.bd, lineWidth: 0.5)
                                    )
                                    .clipShape(RoundedRectangle(cornerRadius: 10))
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.horizontal, 20)
                }
            }
            .padding(.top, 16)

            // GUESTS
            VStack(alignment: .leading, spacing: 10) {
                Text("Guests")
                    .font(.sf(13, weight: .medium))
                    .foregroundStyle(A.s1)
                HStack(spacing: 16) {
                    Spacer()
                    Button {
                        if data.guests > 1 {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                                data.guests -= 1
                            }
                        }
                    } label: {
                        Image(systemName: "minus")
                            .font(.system(size: 16))
                            .foregroundStyle(A.s4)
                            .frame(width: 42, height: 42)
                            .background(A.srf)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(A.bd, lineWidth: 0.5)
                            )
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .buttonStyle(.plain)

                    Text("\(data.guests)")
                        .font(.sf(24, weight: .light))
                        .foregroundStyle(A.s1)
                        .frame(minWidth: 40, alignment: .center)
                        .contentTransition(.numericText())
                        .animation(.spring(response: 0.3, dampingFraction: 0.6), value: data.guests)

                    Button {
                        if data.guests < 12 {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                                data.guests += 1
                            }
                        }
                    } label: {
                        Image(systemName: "plus")
                            .font(.system(size: 16))
                            .foregroundStyle(A.s4)
                            .frame(width: 42, height: 42)
                            .background(A.srf)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(A.bd, lineWidth: 0.5)
                            )
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .buttonStyle(.plain)
                    Spacer()
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)

            // Buttons
            HStack(spacing: 10) {
                Button(action: onCancel) {
                    Text("Cancel")
                        .font(.sf(14))
                        .foregroundStyle(A.s4)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .overlay(
                            RoundedRectangle(cornerRadius: 14)
                                .stroke(A.bd, lineWidth: 0.5)
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)

                Button(action: onSave) {
                    Text("Save changes")
                        .font(.sf(14, weight: .medium))
                        .foregroundStyle(A.bg)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(A.s1)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 20)
            .padding(.top, 24)
            .padding(.bottom, 32)
        }
        .background(A.el)
        .overlay(
            UnevenRoundedRectangle(
                topLeadingRadius: 20,
                bottomLeadingRadius: 0,
                bottomTrailingRadius: 0,
                topTrailingRadius: 20
            )
            .stroke(A.bd, lineWidth: 0.5)
        )
        .clipShape(
            UnevenRoundedRectangle(
                topLeadingRadius: 20,
                bottomLeadingRadius: 0,
                bottomTrailingRadius: 0,
                topTrailingRadius: 20
            )
        )
    }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARK: - Preview
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

#Preview {
    BookingsView(selectedTab: .constant(.bookings))
        .preferredColorScheme(.dark)
}
