// confirm-booking (v1)
//
// "Mark as booked". A colleague has secured a table (by phone, on the venue's
// site, through a contact) and confirms it from Slack. This is the one place
// that turns that into a real booking:
//
//   1. records it in public.bookings (so it shows in the admin's Bookings
//      tab, the 9:00 reminder jobs pick it up, and it counts in reporting)
//   2. links it to the WhatsApp request
//   3. emails the guest the branded confirmation (send-transactional-email)
//   4. confirms on WhatsApp with the approved booking_confirmation template
//      (works outside the 24-hour window)
//
// Members (user_id set) are confirmed by the existing bookings triggers
// (email to their account, WhatsApp template, push), so we don't double up;
// we only email them here if the guest email differs from their account.
//
// Internal callers only (slack-interactions, admin). Header: x-internal-secret.
// POST { intent_id, restaurant_id?, venue_name?, date, time, party_size,
//        guest_name?, guest_email?, reference?, note?, created_by }

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const supa = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const GRAPH = "v21.0";

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

async function setting(key: string, envName?: string): Promise<string> {
  if (envName) {
    const v = Deno.env.get(envName) ?? "";
    if (v) return v;
  }
  const { data } = await supa.from("app_settings").select("value").eq("key", key).maybeSingle();
  return data?.value ?? "";
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function prettyDate(d: string): string {
  const dt = new Date(`${d}T12:00:00Z`);
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  const secret = await setting("notifications_internal_secret", "NOTIFICATIONS_INTERNAL_SECRET");
  if (!secret || req.headers.get("x-internal-secret") !== secret) return json({ error: "unauthorized" }, 401);

  const p = await req.json().catch(() => ({}));
  const intentId = String(p.intent_id ?? "");
  const date = String(p.date ?? "");
  const time = String(p.time ?? "").slice(0, 5);
  const party = Math.round(Number(p.party_size));
  const createdBy = String(p.created_by ?? "a colleague").slice(0, 80);

  if (!intentId) return json({ error: "intent_id required" }, 400);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: "date must be YYYY-MM-DD" }, 400);
  if (!/^\d{2}:\d{2}$/.test(time)) return json({ error: "time must be HH:MM" }, 400);
  if (!Number.isFinite(party) || party < 1 || party > 50) return json({ error: "party size must be 1 to 50" }, 400);

  const { data: it } = await supa.from("concierge_intents")
    .select("id, phone, user_id, restaurant_id, venue_text, city, service_type, booking_id, details")
    .eq("id", intentId).maybeSingle();
  if (!it) return json({ error: "request not found" }, 404);
  if (it.booking_id) return json({ error: "already booked", booking_id: it.booking_id }, 409);

  const d = (it.details ?? {}) as Record<string, any>;
  const restaurantId = p.restaurant_id || it.restaurant_id || null;
  let venueName = String(p.venue_name || it.venue_text || "").trim();
  let venueImage: string | null = null;
  let city = it.city ?? null;
  if (restaurantId) {
    const { data: r } = await supa.from("restaurants")
      .select("name, city, hero_image_url").eq("id", restaurantId).maybeSingle();
    if (r) { venueName ||= r.name; venueImage = r.hero_image_url ?? null; city ||= r.city; }
  }
  if (!venueName) return json({ error: "venue name required" }, 400);

  const guestName = String(p.guest_name || [d.guest_first, d.guest_last].filter(Boolean).join(" ")).trim() || null;
  const guestEmailRaw = String(p.guest_email || d.guest_email || "").trim().toLowerCase();
  const guestEmail = EMAIL.test(guestEmailRaw) ? guestEmailRaw : null;
  const reference = String(p.reference ?? "").trim().slice(0, 60) || null;
  const note = String(p.note ?? "").trim().slice(0, 500) || null;
  const service = String(it.service_type ?? "dining").toLowerCase() === "nightlife" ? "Nightlife" : "Dining";

  const { data: booking, error } = await supa.from("bookings").insert({
    user_id: it.user_id ?? null,
    restaurant_id: restaurantId,
    restaurant_name: venueName,
    party_size: party,
    reservation_date: date,
    reservation_time: `${time}:00`,
    requested_time: `${time}:00`,
    city,
    service_type: service,
    status: "confirmed",
    confirmed_at: new Date().toISOString(),
    guest_name: guestName,
    guest_email: guestEmail,
    guest_phone: it.phone ?? null,
    venue_image_url: venueImage,
    notes: [reference ? `Ref: ${reference}` : null, `Booked by ${createdBy} (marked from Slack).`, note].filter(Boolean).join("\n"),
  }).select("id").single();

  if (error || !booking) {
    // e.g. the venue is marked closed that day in the catalogue.
    return json({ error: error?.message ?? "could not save the booking" }, 422);
  }

  await supa.from("concierge_intents").update({ booking_id: booking.id }).eq("id", intentId);

  // ---- tell the guest ------------------------------------------------------
  const firstName = guestName ? guestName.split(" ")[0] : "";
  let memberEmail: string | null = null;
  if (it.user_id) {
    const { data: u } = await supa.from("users").select("email").eq("id", it.user_id).maybeSingle();
    memberEmail = (u?.email ?? "").toLowerCase() || null;
  }

  // Email: members get theirs from the trigger; send here for everyone else
  // (or when the guest gave a different address than their account).
  let email: string = guestEmail ? "pending" : "no email on file";
  if (guestEmail && guestEmail !== memberEmail) {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-secret": secret },
      body: JSON.stringify({ kind: "confirmed", to: guestEmail, booking_id: booking.id,
        first_name: firstName || undefined, reference: reference ?? undefined, note: note ?? undefined }),
    }).catch(() => null);
    const out = res ? await res.json().catch(() => ({})) : {};
    email = (out as any)?.sent ? `sent to ${guestEmail}`
      : (out as any)?.skipped === "no_resend_key" ? "not sent: email service not connected yet"
      : `failed (${String((out as any)?.error ?? res?.status ?? "no response").slice(0, 80)})`;
  } else if (guestEmail && guestEmail === memberEmail) {
    email = `sent to ${guestEmail} (member)`;
  }

  // WhatsApp: members get the template from the trigger.
  let whatsapp = it.user_id ? "sent (member)" : "not sent";
  if (!it.user_id && it.phone) {
    const token = Deno.env.get("WHATSAPP_TOKEN") ?? "";
    const phoneId = await setting("whatsapp_phone_number_id", "WHATSAPP_PHONE_NUMBER_ID");
    if (token && phoneId) {
      const params = [firstName || "there", venueName, prettyDate(date), time, String(party),
        reference ? `Reference ${reference}. Your concierge is watching this chat` : "Your concierge is watching this chat"]
        .map((t) => ({ type: "text", text: String(t).replace(/\s*\n\s*/g, " · ").slice(0, 1024) }));
      const res = await fetch(`https://graph.facebook.com/${GRAPH}/${phoneId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ messaging_product: "whatsapp", to: it.phone, type: "template",
          template: { name: "booking_confirmation", language: { code: "en" },
            components: [{ type: "body", parameters: params }] } }),
      }).catch(() => null);
      const out = res ? await res.json().catch(() => ({})) : {};
      whatsapp = res?.ok ? "sent" : `failed (${String((out as any)?.error?.message ?? "no response").slice(0, 80)})`;
      await supa.from("whatsapp_messages").insert({
        user_id: null, booking_id: booking.id, phone: it.phone, direction: "outbound",
        kind: "booking_confirmation", template_name: "booking_confirmation",
        body: `Confirmation: ${venueName} on ${date} at ${time} for ${party}`,
        wa_message_id: (out as any)?.messages?.[0]?.id ?? null,
        status: res?.ok ? "sent" : "failed",
        error: res?.ok ? null : JSON.stringify((out as any)?.error ?? out).slice(0, 2000),
      });
    }
  }

  return json({ ok: true, booking_id: booking.id, venue: venueName, date, time, party_size: party,
    email, whatsapp });
});
