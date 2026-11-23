// send-transactional-email (v2)
//
// Booking-lifecycle emails (confirmed / cancelled / modified / custom) via
// Resend. Called by the notify_booking_status_change DB trigger (members) and
// by confirm-booking (any guest with an email, incl. WhatsApp-only clients).
//
// v2:
//  - Branded, mobile-friendly HTML: venue photo, date/time/guests, address
//    with a map link, dress code, Alfred's tip, add-to-calendar (Google link
//    + .ics attachment), WhatsApp contact and an "evening" upsell.
//  - Pass booking_id and the venue details are loaded from the database.
//  - Correct WhatsApp number (+33 7 43 71 36 49) and .app sender default.
//  - The internal secret is now resolved from env OR app_settings and is
//    REQUIRED. v1 read it from env only, so with the env var unset anyone
//    could have sent mail from our domain once a Resend key existed.
//
// Env: RESEND_API_KEY, ALFRED_EMAIL_FROM (optional), ALFRED_EMAIL_REPLY_TO (optional).

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM = Deno.env.get("ALFRED_EMAIL_FROM") ?? "Alfred Concierge <concierge@alfredconcierge.app>";
const REPLY_TO = Deno.env.get("ALFRED_EMAIL_REPLY_TO") ?? "";
const SITE = "https://alfredconcierge.app";
const WA_NUMBER = "33743713649";
const WA_DISPLAY = "+33 7 43 71 36 49";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-internal-secret",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

let cachedSecret: string | null = null;
async function internalSecret(): Promise<string> {
  if (cachedSecret !== null) return cachedSecret;
  const env = Deno.env.get("NOTIFICATIONS_INTERNAL_SECRET") ?? "";
  if (env) return (cachedSecret = env);
  const { data } = await supabase.from("app_settings").select("value").eq("key", "notifications_internal_secret").maybeSingle();
  return (cachedSecret = data?.value ?? "");
}

type Kind = "confirmed" | "cancelled" | "modified" | "custom";
interface Body {
  kind: Kind; to: string; booking_id?: string; first_name?: string; venue_name?: string;
  date?: string; time?: string; party_size?: number; reason?: string; alternatives?: string[];
  reference?: string; note?: string; subject?: string; body?: string; preview?: boolean;
  service?: string; end_date?: string;
}

interface Venue {
  name: string; city?: string; address?: string; image?: string; dress?: string; tip?: string;
  phone?: string; slug?: string; lat?: number; lng?: number;
}

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const label = (v?: string) => String(v ?? "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function prettyDate(d?: string): string {
  if (!d) return "";
  const dt = new Date(`${d.slice(0, 10)}T12:00:00Z`);
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
}
function prettyTime(t?: string): string {
  if (!t) return "";
  const [hh, mm = "00"] = t.split(":");
  const h = parseInt(hh, 10);
  if (isNaN(h)) return t;
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${mm.slice(0, 2)} ${h >= 12 ? "PM" : "AM"}`;
}

const TZ: Record<string, string> = {
  paris: "Europe/Paris", "saint-tropez": "Europe/Paris", monaco: "Europe/Monaco", cannes: "Europe/Paris",
  ibiza: "Europe/Madrid", madrid: "Europe/Madrid", mykonos: "Europe/Athens", london: "Europe/London",
  dubai: "Asia/Dubai", miami: "America/New_York", "new york": "America/New_York",
};
const tzFor = (city?: string) => TZ[String(city ?? "").toLowerCase()] ?? "Europe/Paris";

function stamp(date: string, time: string, addHours = 0): string {
  const [h, m] = (time || "20:00").split(":").map((x) => parseInt(x, 10));
  const dt = new Date(`${date.slice(0, 10)}T00:00:00Z`);
  dt.setUTCHours((h || 0) + addHours, m || 0, 0, 0);
  return dt.toISOString().replace(/[-:]/g, "").slice(0, 15); // YYYYMMDDTHHMMSS (venue-local)
}

function calendar(v: Venue, date?: string, time?: string, ref?: string, dining = true) {
  if (!date) return null;
  const tz = tzFor(v.city);
  const start = stamp(date, time ?? "20:00"), end = stamp(date, time ?? "20:00", 2);
  const title = dining ? `Dinner at ${v.name}` : v.name;
  const details = `Booked through Alfred Concierge${ref ? ` (ref ${ref})` : ""}. Changes: WhatsApp ${WA_DISPLAY}.`;
  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}` +
    `&dates=${start}/${end}&ctz=${encodeURIComponent(tz)}&details=${encodeURIComponent(details)}` +
    (v.address ? `&location=${encodeURIComponent(v.address)}` : "");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Alfred Concierge//Booking//EN", "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@alfredconcierge.app`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;TZID=${tz}:${start}`, `DTEND;TZID=${tz}:${end}`,
    `SUMMARY:${title.replace(/[,;]/g, "\\$&")}`,
    v.address ? `LOCATION:${v.address.replace(/[,;]/g, "\\$&")}` : "",
    `DESCRIPTION:${details.replace(/[,;]/g, "\\$&")}`,
    "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
  return { google, ics };
}

async function loadBooking(id: string): Promise<{ b: any; v: Venue } | null> {
  const { data: b } = await supabase.from("bookings").select("*").eq("id", id).maybeSingle();
  if (!b) return null;
  let r: any = null;
  if (b.restaurant_id) {
    const { data } = await supabase.from("restaurants")
      .select("name, city, address, hero_image_url, photos_order, dress_code, alfred_tip, phone_number, slug, latitude, longitude")
      .eq("id", b.restaurant_id).maybeSingle();
    r = data;
  }
  const img = r?.hero_image_url || (Array.isArray(r?.photos_order) ? r.photos_order[0] : null) || b.venue_image_url || "";
  return { b, v: {
    name: r?.name ?? b.restaurant_name ?? "your venue", city: r?.city ?? b.city ?? "",
    address: r?.address ?? "", image: img, dress: r?.dress_code ? label(r.dress_code) : "",
    tip: r?.alfred_tip ?? "", phone: r?.phone_number ?? "", slug: r?.slug ?? "",
    lat: r?.latitude ?? undefined, lng: r?.longitude ?? undefined,
  } };
}

// ---- layout ---------------------------------------------------------------

function shell(preheader: string, inner: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Alfred Concierge</title></head>
<body style="margin:0;padding:0;background:#f4f2ee;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ee;"><tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#18181b;">
<tr><td style="background:#0b0b0c;padding:18px 28px;"><span style="color:#f4f4f5;font:600 13px/1 -apple-system,Helvetica,Arial,sans-serif;letter-spacing:4px;">ALFRED</span><span style="color:#a1a1aa;font:400 11px/1 -apple-system,Helvetica,Arial,sans-serif;letter-spacing:2px;">&nbsp;&nbsp;CONCIERGE</span></td></tr>
${inner}
<tr><td style="padding:22px 28px 28px;border-top:1px solid #eee;color:#71717a;font-size:12px;line-height:1.6;">
Alfred Concierge · <a href="${SITE}" style="color:#71717a;">alfredconcierge.app</a><br>
Questions or changes: WhatsApp <a href="https://wa.me/${WA_NUMBER}" style="color:#71717a;">${WA_DISPLAY}</a>
</td></tr></table></td></tr></table></body></html>`;
}

const button = (href: string, text: string, dark = true) =>
  `<a href="${esc(href)}" style="display:inline-block;margin:4px 8px 4px 0;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;${dark ? "background:#0b0b0c;color:#ffffff;" : "background:#ffffff;color:#0b0b0c;border:1px solid #d4d4d8;"}">${esc(text)}</a>`;

const row = (k: string, v: string) => v
  ? `<tr><td style="padding:8px 0;color:#71717a;font-size:13px;width:110px;vertical-align:top;">${esc(k)}</td><td style="padding:8px 0;font-size:15px;font-weight:600;">${esc(v)}</td></tr>` : "";

function renderConfirmed(p: Body, v: Venue, cal: ReturnType<typeof calendar>) {
  const name = p.first_name ? `, ${esc(p.first_name)}` : "";
  const dining = !p.service || /dining|nightlife|restaurant/i.test(p.service);
  const date = prettyDate(p.date), time = dining ? prettyTime(p.time) : "", party = p.party_size ?? 2;
  const dates = p.end_date && p.end_date !== p.date ? `${date} to ${prettyDate(p.end_date)}` : date;
  const maps = v.lat && v.lng ? `https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`
    : v.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name} ${v.address}`)}` : "";
  const waChange = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi Alfred, about my booking at ${v.name} on ${date}: `)}`;
  const waCar = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi Alfred, I'd like a car or chauffeur for my dinner at ${v.name} on ${date}.`)}`;
  const subject = `Confirmed: ${v.name}, ${date}${time ? ` at ${time}` : ""}`;

  const inner = `
${v.image ? `<tr><td><img src="${esc(v.image)}" width="560" alt="${esc(v.name)}" style="display:block;width:100%;max-width:560px;height:auto;border:0;"></td></tr>` : ""}
<tr><td style="padding:28px 28px 8px;">
<p style="margin:0 0 6px;color:#16a34a;font-size:12px;font-weight:700;letter-spacing:2px;">✓ CONFIRMED</p>
<h1 style="margin:0 0 6px;font-size:26px;line-height:1.2;font-weight:700;">${esc(v.name)}</h1>
<p style="margin:0;color:#52525b;font-size:15px;">${dining ? `Your table is booked${name}. We look forward to it.` : `Your booking is confirmed${name}.`}</p>
</td></tr>
<tr><td style="padding:12px 28px 4px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row(dining ? "Date" : "Dates", dining ? date : dates)}${row("Time", time)}${dining ? row("Guests", `${party} ${party > 1 ? "guests" : "guest"}`) : ""}${row("Name", p.first_name ?? "")}${row("Reference", p.reference ?? "")}${row("Address", v.address ?? "")}${row("Dress code", v.dress ?? "")}
</table></td></tr>
${p.note ? `<tr><td style="padding:8px 28px 0;"><p style="margin:0;padding:14px 16px;background:#f4f4f5;border-radius:10px;font-size:14px;line-height:1.55;">${esc(p.note)}</p></td></tr>` : ""}
<tr><td style="padding:18px 28px 6px;">${cal ? button(cal.google, "Add to calendar") : ""}${maps ? button(maps, "Open in Maps", false) : ""}</td></tr>
${v.tip ? `<tr><td style="padding:16px 28px 0;"><p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:2px;color:#a16207;">ALFRED'S TIP</p><p style="margin:0;font-size:14px;line-height:1.6;color:#3f3f46;">${esc(v.tip)}</p></td></tr>` : ""}
<tr><td style="padding:22px 28px 8px;"><p style="margin:0;font-size:14px;line-height:1.6;color:#3f3f46;">${dining ? `Running late, changing the time or the number of guests? Message us and we handle it with ${esc(v.name)}.` : `Any question or change before the day? Message us and we handle it.`}</p>
<p style="margin:12px 0 0;">${button(waChange, "Message Alfred on WhatsApp", false)}</p></td></tr>
${dining ? "" : "<!--"}<tr><td style="padding:18px 28px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0c;border-radius:12px;"><tr><td style="padding:18px 20px;color:#f4f4f5;">
<p style="margin:0 0 4px;font-size:15px;font-weight:700;">Make it an evening</p>
<p style="margin:0 0 12px;font-size:13px;line-height:1.55;color:#d4d4d8;">A chauffeur to the door, or an exotic car for the night. Tell us and it's arranged.</p>
<a href="${esc(waCar)}" style="color:#ffffff;font-size:13px;font-weight:700;text-decoration:underline;">Arrange a car →</a>
</td></tr></table></td></tr>${dining ? "" : "-->"}`;

  const text = [
    `Hi${p.first_name ? ` ${p.first_name}` : ""},`, "",
    dining ? `Your table at ${v.name} is confirmed.` : `Your booking is confirmed: ${v.name}.`,
    `Date: ${dining ? date : dates}`, time ? `Time: ${time}` : "", dining ? `Guests: ${party}` : "",
    p.reference ? `Reference: ${p.reference}` : "", v.address ? `Address: ${v.address}` : "",
    v.dress ? `Dress code: ${v.dress}` : "", p.note ? `\n${p.note}` : "",
    v.tip ? `\nAlfred's tip: ${v.tip}` : "",
    `\nAny change: WhatsApp ${WA_DISPLAY} (https://wa.me/${WA_NUMBER})`,
    cal ? `Add to calendar: ${cal.google}` : "", "", "Alfred Concierge",
  ].filter((l) => l !== "").join("\n");

  return { subject, html: shell(dining ? `Your table at ${v.name} is confirmed for ${date}${time ? ` at ${time}` : ""}.` : `${v.name} is confirmed.`, inner), text };
}

function renderSimple(kind: "cancelled" | "modified", p: Body, v: Venue) {
  const name = p.first_name ? `, ${esc(p.first_name)}` : "";
  const date = prettyDate(p.date), time = prettyTime(p.time);
  const wa = `https://wa.me/${WA_NUMBER}`;
  if (kind === "modified") {
    const subject = `Updated: ${v.name}, ${date}${time ? ` at ${time}` : ""}`;
    const inner = `<tr><td style="padding:28px;"><p style="margin:0 0 6px;color:#2563eb;font-size:12px;font-weight:700;letter-spacing:2px;">UPDATED</p>
<h1 style="margin:0 0 10px;font-size:24px;">${esc(v.name)}</h1>
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">Hi${name}, your reservation is now <strong>${esc(date)}${time ? ` at ${esc(time)}` : ""}</strong>. Everything else is unchanged.</p>
${button(wa, "Message Alfred on WhatsApp", false)}</td></tr>`;
    return { subject, html: shell(`Your reservation at ${v.name} is now ${date}.`, inner),
      text: `Hi${p.first_name ? ` ${p.first_name}` : ""},\n\nYour reservation at ${v.name} is now ${date}${time ? ` at ${time}` : ""}. Everything else is unchanged.\n\nWhatsApp ${WA_DISPLAY}\n\nAlfred Concierge` };
  }
  const reason = p.reason ?? "due to a venue-side conflict";
  const alts = (p.alternatives ?? []).map((a) => `<li style="margin:4px 0;">${esc(a)}</li>`).join("");
  const subject = `${v.name}: let us make this right`;
  const inner = `<tr><td style="padding:28px;"><p style="margin:0 0 6px;color:#dc2626;font-size:12px;font-weight:700;letter-spacing:2px;">CANCELLED</p>
<h1 style="margin:0 0 10px;font-size:24px;">${esc(v.name)}</h1>
<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#3f3f46;">Hi${name}, your reservation has been cancelled ${esc(reason)}. No card was charged.</p>
${alts ? `<p style="margin:0 0 6px;font-size:15px;">A few alternatives we can secure for you:</p><ul style="margin:0 0 14px;padding-left:20px;font-size:15px;">${alts}</ul>` : ""}
<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3f3f46;">Reply on WhatsApp and we'll find you something just as good.</p>
${button(wa, "Message Alfred on WhatsApp")}</td></tr>`;
  return { subject, html: shell(`Your reservation at ${v.name} was cancelled. We'll find an alternative.`, inner),
    text: `Hi${p.first_name ? ` ${p.first_name}` : ""},\n\nYour reservation at ${v.name} has been cancelled ${reason}. No card was charged.\n${(p.alternatives ?? []).map((a) => `- ${a}`).join("\n")}\n\nWhatsApp ${WA_DISPLAY}\n\nAlfred Concierge` };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const secret = await internalSecret();
  if (!secret || req.headers.get("x-internal-secret") !== secret) return json({ error: "unauthorized" }, 401);

  try {
    const p = await req.json() as Body;
    if (!p.kind) return json({ error: "missing kind" }, 400);

    // Fill venue + booking details from the database when we have a booking.
    let v: Venue = { name: p.venue_name ?? "your venue" };
    if (p.booking_id) {
      const loaded = await loadBooking(p.booking_id);
      if (loaded) {
        v = loaded.v;
        p.date ??= loaded.b.reservation_date;
        p.time ??= loaded.b.reservation_time;
        p.party_size ??= loaded.b.party_size;
        p.service ??= loaded.b.service_type;
        p.end_date ??= loaded.b.end_date ?? undefined;
        p.to ||= loaded.b.guest_email ?? "";
        if (!p.first_name && loaded.b.guest_name) p.first_name = String(loaded.b.guest_name).split(" ")[0];
      }
    }

    let subject: string, html: string, text: string;
    let attachments: { filename: string; content: string }[] | undefined;
    if (p.kind === "confirmed") {
      const cal = calendar(v, p.date, p.time, p.reference, !p.service || /dining|nightlife|restaurant/i.test(p.service));
      ({ subject, html, text } = renderConfirmed(p, v, cal));
      if (cal) attachments = [{ filename: "reservation.ics", content: btoa(unescape(encodeURIComponent(cal.ics))) }];
    } else if (p.kind === "cancelled" || p.kind === "modified") {
      ({ subject, html, text } = renderSimple(p.kind, p, v));
    } else if (p.kind === "custom") {
      subject = p.subject ?? ""; html = p.body ?? ""; text = (p.body ?? "").replace(/<[^>]+>/g, "");
    } else {
      return json({ error: `unknown kind: ${p.kind}` }, 400);
    }

    // Preview: return the rendered email without sending (used for checks).
    if (p.preview) return json({ preview: true, subject, html, text, has_calendar: !!attachments });

    if (!RESEND_API_KEY) {
      console.log("[skip] no RESEND_API_KEY set", { kind: p.kind });
      return json({ skipped: "no_resend_key" });
    }
    if (!p.to) return json({ error: "missing to" }, 400);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [p.to], subject, html, text,
        ...(REPLY_TO ? { reply_to: REPLY_TO } : {}), ...(attachments ? { attachments } : {}) }),
    });
    const out = await res.text();
    if (!res.ok) {
      console.error("resend error", res.status, out);
      return json({ error: "resend_failed", status: res.status, body: out.slice(0, 500) }, 502);
    }
    return json({ sent: true, resend: JSON.parse(out) });
  } catch (e) {
    console.error("send-transactional-email error", e);
    return json({ error: (e as Error).message }, 500);
  }
});
