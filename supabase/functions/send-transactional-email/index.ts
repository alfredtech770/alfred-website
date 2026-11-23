// send-transactional-email (v4)
//
// Booking-lifecycle emails (confirmed / cancelled / modified / custom) via
// Resend. Called by the notify_booking_status_change DB trigger (members) and
// by confirm-booking (any guest with an email, incl. WhatsApp-only clients).
//
// v4: one photo only; kind "reminder" (day-of email, same design).
// v3: redesigned to match the site (dark editorial, detail tiles, 16:10
//     venue photo, car upsell card, footer with Instagram).
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

type Kind = "confirmed" | "reminder" | "cancelled" | "modified" | "custom";
interface Body {
  kind: Kind; to: string; booking_id?: string; first_name?: string; venue_name?: string;
  date?: string; time?: string; party_size?: number; reason?: string; alternatives?: string[];
  reference?: string; note?: string; subject?: string; body?: string; preview?: boolean;
  service?: string; end_date?: string;
}

interface Venue {
  name: string; city?: string; address?: string; image?: string; dress?: string; tip?: string;
  phone?: string; slug?: string; lat?: number; lng?: number; gallery?: string[];
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
      .select("name, city, address, hero_image_url, photos_order, gallery_photos, dress_code, alfred_tip, phone_number, slug, latitude, longitude")
      .eq("id", b.restaurant_id).maybeSingle();
    r = data;
  }
  // Same photos, same order as the venue page on alfredconcierge.app:
  // photos_order, then gallery_photos, then the hero image.
  const list: string[] = [];
  for (const u of [...(Array.isArray(r?.photos_order) ? r.photos_order : []),
                   ...(Array.isArray(r?.gallery_photos) ? r.gallery_photos : []),
                   r?.hero_image_url, b.venue_image_url]) {
    if (u && typeof u === "string" && !list.includes(u)) list.push(u);
  }
  const img = list[0] ?? "";
  return { b, v: {
    name: r?.name ?? b.restaurant_name ?? "your venue", city: r?.city ?? b.city ?? "",
    address: r?.address ?? "", image: img, dress: r?.dress_code ? label(r.dress_code) : "",
    tip: r?.alfred_tip ?? "", phone: r?.phone_number ?? "", slug: r?.slug ?? "",
    lat: r?.latitude ?? undefined, lng: r?.longitude ?? undefined, gallery: list.slice(1, 4),
  } };
}

// ---- layout ---------------------------------------------------------------
// Matches alfredconcierge.app: black, silver and white, editorial type,
// generous radii. Dark by design, and marked as such so mail apps don't
// "helpfully" invert it.

const C = {
  canvas: "#0A0A0B", card: "#111113", tile: "#18181B", line: "#26262B",
  text: "#FAFAFA", mid: "#A1A1AA", dim: "#71717A", silver: "#DCDCE0", ok: "#4ADE80",
};
const SANS = "-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',Helvetica,Arial,sans-serif";
const INSTAGRAM = "https://www.instagram.com/askalfred.app";
// One of our own Miami cars (Ferrari 296 GTS), cropped 2:1 for the evening offer.
const CAR_IMAGE = "https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/render/image/public/car-photos/miami/ferrari-296-gts/1.jpeg?width=1120&height=520&resize=cover&quality=72";

/** Crop Supabase-hosted photos to a consistent 16:10 frame (falls back to the original). */
function heroUrl(url?: string): string {
  if (!url) return "";
  const m = url.match(/^(https:\/\/[a-z0-9]+\.supabase\.co)\/storage\/v1\/object\/public\/(.+)$/);
  return m ? `${m[1]}/storage/v1/render/image/public/${m[2]}?width=1120&height=700&resize=cover&quality=72` : url;
}

/** Square crop for the small gallery strip. */
function thumbUrl(url: string): string {
  const m = url.match(/^(https:\/\/[a-z0-9]+\.supabase\.co)\/storage\/v1\/object\/public\/(.+)$/);
  return m ? `${m[1]}/storage/v1/render/image/public/${m[2]}?width=360&height=360&resize=cover&quality=70` : url;
}

function gallery(v: Venue): string {
  const g = (v.gallery ?? []).slice(0, 3);
  if (g.length < 3) return "";
  const link = v.slug ? `${SITE}/catalog/dining/${v.slug}` : SITE;
  const cell = (u: string, i: number) => `<td width="33%" style="padding:0 ${i < 2 ? 4 : 0}px 0 ${i > 0 ? 4 : 0}px;"><a href="${esc(link)}"><img src="${esc(thumbUrl(u))}" width="180" alt="" style="display:block;width:100%;height:auto;border:0;border-radius:12px;"></a></td>`;
  return `<tr><td style="padding:8px 8px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${g.map(cell).join("")}</tr></table></td></tr>`;
}

function shell(preheader: string, inner: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>Alfred Concierge</title>
<style>:root{color-scheme:dark;supported-color-schemes:dark}a{text-decoration:none}@media (max-width:600px){.px{padding-left:22px!important;padding-right:22px!important}.h1{font-size:30px!important;line-height:34px!important}.tile{display:block!important;width:100%!important}.gap{display:none!important}}</style></head>
<body style="margin:0;padding:0;background:${C.canvas};" bgcolor="${C.canvas}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.canvas};">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.canvas}" style="background:${C.canvas};"><tr><td align="center" style="padding:32px 12px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;font-family:${SANS};color:${C.text};">
<tr><td align="center" style="padding:0 0 26px;"><a href="${SITE}" style="color:${C.text};font:600 15px/1 ${SANS};letter-spacing:7px;">ALFRED</a><div style="margin-top:7px;color:${C.dim};font:500 10px/1 ${SANS};letter-spacing:4px;">CONCIERGE</div></td></tr>
<tr><td bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.line};border-radius:24px;overflow:hidden;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${inner}</table>
</td></tr>
<tr><td align="center" style="padding:28px 20px 0;color:${C.dim};font:400 12px/20px ${SANS};">
<a href="https://wa.me/${WA_NUMBER}" style="color:${C.mid};">WhatsApp</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${INSTAGRAM}" style="color:${C.mid};">Instagram</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${SITE}" style="color:${C.mid};">alfredconcierge.app</a><br>
<span style="color:${C.dim};">Alfred Concierge, Inc. · Your concierge in Miami, Paris, Saint-Tropez, Ibiza, Mykonos, London &amp; Dubai</span>
</td></tr></table></td></tr></table></body></html>`;
}

const button = (href: string, text: string, primary = true) =>
  `<a href="${esc(href)}" style="display:inline-block;margin:0 10px 10px 0;padding:14px 22px;border-radius:999px;font:600 14px/1 ${SANS};letter-spacing:.2px;${primary ? `background:${C.text};color:${C.canvas};` : `background:transparent;color:${C.text};border:1px solid #3F3F46;`}">${esc(text)}</a>`;

/** One detail tile: small caps label over a large value. */
const tile = (k: string, v: string) =>
  `<td class="tile" width="50%" valign="top" style="padding:0 0 10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td bgcolor="${C.tile}" style="background:${C.tile};border:1px solid ${C.line};border-radius:16px;padding:16px 18px;">
<div style="color:${C.dim};font:600 10px/1 ${SANS};letter-spacing:2.4px;text-transform:uppercase;">${esc(k)}</div>
<div style="margin-top:9px;color:${C.text};font:600 17px/22px ${SANS};letter-spacing:-.2px;">${esc(v)}</div></td></tr></table></td>`;

function tiles(items: [string, string][]): string {
  const kept = items.filter(([, v]) => v);
  let out = "";
  for (let i = 0; i < kept.length; i += 2) {
    const a = kept[i], b = kept[i + 1];
    out += `<tr>${tile(a[0], a[1])}<td class="gap" width="10" style="width:10px;">&nbsp;</td>${b ? tile(b[0], b[1]) : `<td class="tile" width="50%">&nbsp;</td>`}</tr>`;
  }
  return out ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${out}</table>` : "";
}

const rule = `<tr><td class="px" style="padding:8px 36px;"><div style="height:1px;line-height:1px;background:${C.line};">&nbsp;</div></td></tr>`;
const kicker = (t: string, color = C.mid) =>
  `<div style="color:${color};font:600 11px/1 ${SANS};letter-spacing:3px;text-transform:uppercase;">${t}</div>`;

function renderConfirmed(p: Body, v: Venue, cal: ReturnType<typeof calendar>, reminder = false) {
  const dining = !p.service || /dining|nightlife|restaurant/i.test(p.service);
  const date = prettyDate(p.date), time = dining ? prettyTime(p.time) : "", party = p.party_size ?? 2;
  const dates = p.end_date && p.end_date !== p.date ? `${date} to ${prettyDate(p.end_date)}` : date;
  const maps = v.lat && v.lng ? `https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`
    : v.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name} ${v.address}`)}` : "";
  const waChange = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi Alfred, about my booking at ${v.name} on ${date}: `)}`;
  const waCar = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi Alfred, I'd like a car or chauffeur for my dinner at ${v.name} on ${date}.`)}`;
  const subject = reminder
    ? `Today: ${v.name}${time ? ` at ${time}` : ""}`
    : `Confirmed: ${v.name}, ${date}${time ? ` at ${time}` : ""}`;
  const hello = p.first_name ? `${esc(p.first_name)}, your` : "Your";
  const venueLink = v.slug ? `${SITE}/catalog/dining/${v.slug}` : "";

  const inner = `
${v.image ? `<tr><td style="padding:0;line-height:0;"><img src="${esc(heroUrl(v.image))}" width="600" alt="${esc(v.name)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:24px 24px 0 0;"></td></tr>` : ""}
<tr><td class="px" style="padding:34px 36px 6px;">
${kicker(`<span style="color:${C.ok};">●</span>&nbsp;&nbsp;${reminder ? "Today" : "Confirmed"}`, C.text)}
<h1 class="h1" style="margin:16px 0 0;color:${C.text};font:600 36px/40px ${SANS};letter-spacing:-1.4px;">${esc(v.name)}</h1>
<p style="margin:12px 0 0;color:${C.mid};font:400 16px/25px ${SANS};">${reminder
  ? (dining ? `A quick reminder${p.first_name ? `, ${esc(p.first_name)}` : ""}: your table is today${time ? ` at ${esc(time)}` : ""}. Enjoy your evening.` : `A quick reminder${p.first_name ? `, ${esc(p.first_name)}` : ""}: your booking starts today.`)
  : (dining ? `${hello} table is booked${v.city ? ` in ${esc(v.city)}` : ""}. Everything is arranged; all that's left is to enjoy it.` : `${hello} booking is confirmed${v.city ? ` in ${esc(v.city)}` : ""}.`)}</p>
</td></tr>
<tr><td class="px" style="padding:24px 36px 4px;">
${tiles(dining
  ? [["Date", date], ["Time", time], ["Guests", `${party} ${party > 1 ? "guests" : "guest"}`], ["Reference", p.reference ?? (p.first_name ? `Under ${p.first_name}` : "")]]
  : [["Dates", dates], ["Reference", p.reference ?? ""]])}
</td></tr>
${p.note ? `<tr><td class="px" style="padding:6px 36px 4px;"><p style="margin:0;padding:16px 18px;border-left:2px solid ${C.silver};background:${C.tile};border-radius:0 14px 14px 0;color:${C.text};font:400 15px/23px ${SANS};">${esc(p.note)}</p></td></tr>` : ""}
${v.address || v.dress ? `<tr><td class="px" style="padding:18px 36px 4px;">
${v.address ? `<p style="margin:0 0 6px;color:${C.dim};font:600 10px/1 ${SANS};letter-spacing:2.4px;text-transform:uppercase;">Where</p><p style="margin:0 0 16px;color:${C.text};font:500 15px/22px ${SANS};">${maps ? `<a href="${esc(maps)}" style="color:${C.text};border-bottom:1px solid #3F3F46;">${esc(v.address)}</a>` : esc(v.address)}</p>` : ""}
${v.dress ? `<p style="margin:0 0 6px;color:${C.dim};font:600 10px/1 ${SANS};letter-spacing:2.4px;text-transform:uppercase;">Dress code</p><p style="margin:0;color:${C.text};font:500 15px/22px ${SANS};">${esc(v.dress)}</p>` : ""}
</td></tr>` : ""}
<tr><td class="px" style="padding:26px 36px 8px;">${cal && !reminder ? button(cal.google, "Add to calendar") : ""}${maps ? button(maps, "Directions", reminder) : ""}</td></tr>
${v.tip ? `${rule}<tr><td class="px" style="padding:18px 36px 6px;">${kicker("Alfred's note")}<p style="margin:12px 0 0;color:${C.text};font:400 16px/26px Georgia,'Times New Roman',serif;font-style:italic;">“${esc(v.tip)}”</p></td></tr>` : ""}
${rule}
<tr><td class="px" style="padding:18px 36px 30px;">
<p style="margin:0;color:${C.mid};font:400 14px/22px ${SANS};">${dining ? `Running late, adding a guest or changing the time? Message us and we'll handle it with ${esc(v.name)}.` : `Any question or change before the day? Message us and we'll handle it.`}</p>
<p style="margin:16px 0 0;">${button(waChange, "Message your concierge", false)}${venueLink ? `<a href="${esc(venueLink)}" style="display:inline-block;margin:0 0 10px;padding:14px 4px;color:${C.mid};font:500 14px/1 ${SANS};">About ${esc(v.name)} →</a>` : ""}</p>
</td></tr>
${dining ? `<tr><td style="padding:0 12px 12px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.tile}" style="background:${C.tile};border:1px solid ${C.line};border-radius:18px;">
<tr><td style="padding:0;line-height:0;"><a href="${esc(waCar)}"><img src="${esc(CAR_IMAGE)}" width="574" alt="Ferrari 296 GTS" style="display:block;width:100%;height:auto;border:0;border-radius:18px 18px 0 0;"></a></td></tr>
<tr><td style="padding:24px 24px 16px;">
${kicker("Make it an evening", C.silver)}
<p style="margin:12px 0 0;color:${C.text};font:600 22px/27px ${SANS};letter-spacing:-.5px;">Arrive in style.</p>
<p style="margin:8px 0 18px;color:${C.mid};font:400 14px/21px ${SANS};">A chauffeur to the door, or an exotic car for the night. One message and it's arranged.</p>
${button(waCar, "Arrange a car")}
</td></tr></table></td></tr>` : ""}`;

  const text = [
    reminder ? `A reminder: ${v.name} is today${time ? ` at ${time}` : ""}.`
             : `${p.first_name ? `${p.first_name}, your` : "Your"} ${dining ? "table" : "booking"} is confirmed.`, "",
    v.name, `${dining ? "Date" : "Dates"}: ${dining ? date : dates}`, time ? `Time: ${time}` : "",
    dining ? `Guests: ${party}` : "", p.reference ? `Reference: ${p.reference}` : "",
    v.address ? `Where: ${v.address}` : "", v.dress ? `Dress code: ${v.dress}` : "",
    p.note ? `\n${p.note}` : "", v.tip ? `\nAlfred's note: ${v.tip}` : "",
    cal ? `\nAdd to calendar: ${cal.google}` : "", maps ? `Directions: ${maps}` : "",
    `\nAny change: WhatsApp ${WA_DISPLAY} (https://wa.me/${WA_NUMBER})`, "", "Alfred Concierge",
  ].filter((l) => l !== "").join("\n");

  const preheader = reminder ? `See you today${time ? ` at ${time}` : ""} at ${v.name}.`
    : dining ? `Your table at ${v.name} is confirmed for ${date}${time ? ` at ${time}` : ""}.` : `${v.name} is confirmed.`;
  return { subject, html: shell(preheader, inner), text };
}

function renderSimple(kind: "cancelled" | "modified", p: Body, v: Venue) {
  const date = prettyDate(p.date), time = prettyTime(p.time);
  const wa = `https://wa.me/${WA_NUMBER}`;
  const hello = p.first_name ? `${esc(p.first_name)}, your` : "Your";
  if (kind === "modified") {
    const subject = `Updated: ${v.name}, ${date}${time ? ` at ${time}` : ""}`;
    const inner = `${v.image ? `<tr><td style="padding:0;line-height:0;"><img src="${esc(heroUrl(v.image))}" width="600" alt="${esc(v.name)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:24px 24px 0 0;"></td></tr>` : ""}
<tr><td class="px" style="padding:34px 36px 6px;">${kicker(`<span style="color:#60A5FA;">●</span>&nbsp;&nbsp;Updated`, C.text)}
<h1 class="h1" style="margin:16px 0 0;color:${C.text};font:600 36px/40px ${SANS};letter-spacing:-1.4px;">${esc(v.name)}</h1>
<p style="margin:12px 0 0;color:${C.mid};font:400 16px/25px ${SANS};">${hello} reservation has moved. Everything else is unchanged.</p></td></tr>
<tr><td class="px" style="padding:24px 36px 4px;">${tiles([["New date", date], ["New time", time]])}</td></tr>
<tr><td class="px" style="padding:20px 36px 32px;">${button(wa, "Message your concierge", false)}</td></tr>`;
    return { subject, html: shell(`Your reservation at ${v.name} is now ${date}.`, inner),
      text: `${p.first_name ? `${p.first_name}, your` : "Your"} reservation at ${v.name} is now ${date}${time ? ` at ${time}` : ""}. Everything else is unchanged.\n\nWhatsApp ${WA_DISPLAY}\n\nAlfred Concierge` };
  }
  const reason = p.reason ?? "due to a venue-side conflict";
  const alts = (p.alternatives ?? []).map((a) => `<tr><td style="padding:0 0 8px;"><a href="${esc(`${wa}?text=${encodeURIComponent(`Hi Alfred, please book: ${a}`)}`)}" style="display:block;padding:14px 16px;background:${C.tile};border:1px solid ${C.line};border-radius:14px;color:${C.text};font:500 15px/20px ${SANS};">${esc(a)}&nbsp;&nbsp;<span style="color:${C.dim};">→</span></a></td></tr>`).join("");
  const subject = `${v.name}: let us make this right`;
  const inner = `<tr><td class="px" style="padding:36px 36px 6px;">${kicker(`<span style="color:#F87171;">●</span>&nbsp;&nbsp;Cancelled`, C.text)}
<h1 class="h1" style="margin:16px 0 0;color:${C.text};font:600 32px/36px ${SANS};letter-spacing:-1.2px;">${esc(v.name)}</h1>
<p style="margin:12px 0 0;color:${C.mid};font:400 16px/25px ${SANS};">${hello} reservation has been cancelled ${esc(reason)}. No card was charged.</p></td></tr>
${alts ? `<tr><td class="px" style="padding:22px 36px 6px;">${kicker("We can secure instead")}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">${alts}</table></td></tr>` : ""}
<tr><td class="px" style="padding:18px 36px 32px;"><p style="margin:0 0 16px;color:${C.mid};font:400 14px/22px ${SANS};">Reply on WhatsApp and we'll find you something just as good.</p>${button(wa, "Message your concierge")}</td></tr>`;
  return { subject, html: shell(`Your reservation at ${v.name} was cancelled. We'll find an alternative.`, inner),
    text: `${p.first_name ? `${p.first_name}, your` : "Your"} reservation at ${v.name} has been cancelled ${reason}. No card was charged.\n${(p.alternatives ?? []).map((a) => `- ${a}`).join("\n")}\n\nWhatsApp ${WA_DISPLAY}\n\nAlfred Concierge` };
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
    if (p.kind === "confirmed" || p.kind === "reminder") {
      const cal = calendar(v, p.date, p.time, p.reference, !p.service || /dining|nightlife|restaurant/i.test(p.service));
      ({ subject, html, text } = renderConfirmed(p, v, cal, p.kind === "reminder"));
      // The calendar file only goes with the confirmation, not the day-of reminder.
      if (cal && p.kind === "confirmed") attachments = [{ filename: "reservation.ics", content: btoa(unescape(encodeURIComponent(cal.ics))) }];
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
