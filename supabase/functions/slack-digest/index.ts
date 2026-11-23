// slack-digest (v1)
//
// One message in the action channel every morning so the team starts the day
// knowing exactly what is on: today's bookings, who is waiting for us,
// payment links still unpaid, and yesterday in numbers.
//
// pg_cron 07:00 UTC (08:00 Paris in winter, 09:00 in summer).
// POST {} with x-internal-secret. { dry_run: true } returns the text without posting.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const ADMIN = "https://alfredconcierge.app/admin";

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b, null, 1), { status: s, headers: { "Content-Type": "application/json" } });

async function setting(key: string, envName?: string): Promise<string> {
  if (envName) {
    const v = Deno.env.get(envName) ?? "";
    if (v) return v;
  }
  const { data } = await supa.from("app_settings").select("value").eq("key", key).maybeSingle();
  return data?.value ?? "";
}

const day = (offset = 0) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
const hhmm = (t: unknown) => (t ? String(t).slice(0, 5) : "");
function money(cents: number, cur: string) {
  const sym = ({ usd: "$", eur: "€", gbp: "£" } as Record<string, string>)[cur.toLowerCase()] ?? cur.toUpperCase() + " ";
  return `${sym}${Math.round(cents / 100).toLocaleString("en-US")}`;
}
function ago(iso: string) {
  const m = Math.floor((Date.now() - Date.parse(iso)) / 60000);
  return m < 60 ? `${m} min` : m < 2880 ? `${Math.floor(m / 60)} h` : `${Math.floor(m / 1440)} days`;
}

Deno.serve(async (req) => {
  const secret = await setting("notifications_internal_secret", "NOTIFICATIONS_INTERNAL_SECRET");
  if (!secret || req.headers.get("x-internal-secret") !== secret) return json({ error: "unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const dryRun = body.dry_run === true;

  const today = day(0), yesterday = day(-1);

  // 1. Today's bookings
  const { data: todays } = await supa.from("bookings")
    .select("restaurant_name, city, reservation_time, party_size, guest_name, service_type")
    .eq("reservation_date", today).eq("status", "confirmed").order("reservation_time");

  // 2. Waiting on the team: with the team, not booked, no team reply since handover
  const { data: open } = await supa.from("concierge_intents")
    .select("id, phone, venue_text, city, service_type, reservation_date, reservation_time, party_size, human_reason, updated_at")
    .in("status", ["needs_human", "ready"]).is("booking_id", null).is("approved_at", null)
    .gte("updated_at", new Date(Date.now() - 7 * 86400000).toISOString())
    .or(`reservation_date.is.null,reservation_date.gte.${today}`)
    .order("updated_at");
  const waiting: any[] = [];
  for (const it of open ?? []) {
    const { count } = await supa.from("whatsapp_messages").select("id", { count: "exact", head: true })
      .eq("phone", it.phone).eq("direction", "outbound")
      .in("kind", ["team_slack", "team_app", "payment_link", "booking_confirmation"]).gt("created_at", it.updated_at);
    if (!count) waiting.push(it);
  }

  // 3. Payment links sent but not paid (still valid or expired in the last day)
  const { data: linked } = await supa.from("concierge_intents")
    .select("venue_text, city, details, booking_id")
    .is("booking_id", null).not("details->payment_link", "is", null)
    .gte("updated_at", new Date(Date.now() - 2 * 86400000).toISOString());
  const unpaid = (linked ?? []).map((i: any) => ({ ...i, pl: i.details?.payment_link }))
    .filter((i: any) => i.pl?.created_at && Date.now() - Date.parse(i.pl.created_at) < 2 * 86400000);

  // 4. Yesterday in numbers
  const yStart = `${yesterday}T00:00:00Z`, yEnd = `${today}T00:00:00Z`;
  const { data: newBookings } = await supa.from("bookings")
    .select("service_type, payment_status, deposit_amount_cents, gross_amount, commission_amount, payment_intent_id")
    .gte("created_at", yStart).lt("created_at", yEnd).in("status", ["confirmed", "completed"]);
  const paid = (newBookings ?? []).filter((b: any) => b.payment_status === "paid" && b.deposit_amount_cents);
  const paidTotal = paid.reduce((s: number, b: any) => s + Number(b.deposit_amount_cents || 0), 0);
  const { count: newReq } = await supa.from("concierge_intents").select("id", { count: "exact", head: true })
    .gte("created_at", yStart).lt("created_at", yEnd);
  const { data: inb } = await supa.from("whatsapp_messages").select("phone")
    .eq("direction", "inbound").gte("created_at", yStart).lt("created_at", yEnd);
  const clients = new Set((inb ?? []).map((m: any) => m.phone)).size;

  const lines: string[] = [];
  lines.push(`☀️ *Good morning. ${new Date(today + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" })}*`);

  lines.push("", `*Today's bookings (${todays?.length ?? 0})*`);
  if (todays?.length) {
    for (const b of todays.slice(0, 12)) {
      lines.push(`• ${hhmm(b.reservation_time) || "—"}  ${b.restaurant_name}${b.city ? `, ${b.city}` : ""}  ·  ${b.party_size ?? "?"} pax${b.guest_name ? `  ·  ${b.guest_name}` : ""}`);
    }
  } else lines.push("_None confirmed for today._");

  lines.push("", `*Waiting on us (${waiting.length})*`);
  if (waiting.length) {
    for (const w of waiting.slice(0, 10)) {
      const what = [w.venue_text ?? w.service_type, w.city, w.reservation_date, hhmm(w.reservation_time)].filter(Boolean).join(" · ");
      lines.push(`• 🔴 ${ago(w.updated_at)}  ${what}  <https://wa.me/${w.phone}|+${w.phone}>${w.human_reason ? `\n   _${String(w.human_reason).slice(0, 120)}_` : ""}`);
    }
    if (waiting.length > 10) lines.push(`_…and ${waiting.length - 10} more in the admin._`);
  } else lines.push("_Nobody is waiting. 👌_");

  if (unpaid.length) {
    lines.push("", `*Payment links not paid yet (${unpaid.length})*`);
    for (const u of unpaid.slice(0, 8)) {
      lines.push(`• ${u.venue_text ?? "Request"}${u.city ? `, ${u.city}` : ""}  ·  ${money(Number(u.pl.amount_cents || 0), String(u.pl.currency || "usd"))}  ·  sent ${ago(u.pl.created_at)} ago by ${u.pl.created_by ?? "the team"}`);
    }
  }

  lines.push("", "*Yesterday*",
    `• ${clients} ${clients === 1 ? "client" : "clients"} wrote in, ${newReq ?? 0} new ${newReq === 1 ? "request" : "requests"}`,
    `• ${(newBookings ?? []).length} ${(newBookings ?? []).length === 1 ? "booking" : "bookings"} confirmed${paid.length ? `, ${paid.length} paid online (${money(paidTotal, "usd")})` : ""}`,
    "", `<${ADMIN}|Open the admin>`);

  const text = lines.join("\n");
  if (dryRun) return json({ dry_run: true, text });

  const token = Deno.env.get("SLACK_BOT_TOKEN") ?? "";
  const channel = await setting("slack_action_channel");
  if (!token || !channel) return json({ error: "slack not configured" }, 500);
  const r = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ channel, text, unfurl_links: false }),
  }).then((x) => x.json()).catch(() => ({ ok: false }));
  return json({ posted: !!r?.ok, error: r?.ok ? null : r?.error ?? null });
});
