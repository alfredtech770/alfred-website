//
//  BookingService.swift
//  Alfred App
//
//  Booking service — fetch, cancel, update bookings.
//

import Foundation

class BookingService {
    static let shared = BookingService()
    private var supabase: SupabaseManager { SupabaseManager.shared }

    private init() {}

    /// Fetch all bookings for the current user
    @MainActor
    func fetchBookings() async throws -> [BookingItem] {
        guard let session = try? await supabase.auth.session else { return [] }

        let bookings: [BookingItem] = try await supabase.database
            .from("bookings")
            .select()
            .eq("user_id", value: session.user.id.uuidString)
            .order("date", ascending: false)
            .execute()
            .value

        return bookings
    }

    /// Cancel a booking
    @MainActor
    func cancelBooking(bookingId: UUID, venueName: String, serviceType: String, city: String?) async throws {
        try await supabase.database
            .from("bookings")
            .update(["status": "cancelled"])
            .eq("id", value: bookingId.uuidString)
            .execute()
    }

    /// Update a booking (date, time, guests)
    @MainActor
    func updateBooking(
        bookingId: UUID,
        date: String?,
        time: String?,
        guests: Int,
        venueName: String,
        serviceType: String,
        city: String?,
        oldDate: String,
        oldTime: String,
        oldGuests: Int
    ) async throws {
        var updates: [String: String] = [
            "guests": "\(guests)"
        ]
        if let date = date { updates["date"] = date }
        if let time = time { updates["time"] = time }

        try await supabase.database
            .from("bookings")
            .update(updates)
            .eq("id", value: bookingId.uuidString)
            .execute()
    }
}
