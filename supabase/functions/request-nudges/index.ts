// request-nudges (v1)
//
// No request should sit unanswered. The November 2026 audit found the team's
// first reply came about 5 hours after Alfred handed a request over, 18 took
// more than a day and 14 never got one.
//
// Every 10 minutes (pg_cron), for each request with the team (needs_human or
// ready, not booked) that nobody has answered since it was handed over:
//   30 min  -> "⏰ waiting 30 min" in the client's Slack thread
//   2 hours -> @here in the action channel with a link to the thread
//              (no @here between 00:00 and 08:00 Paris time)
// "Answered" = a team message to the client (from Slack or the WhatsApp app),
// a payment link or booking confirmation sent, an approval, or a booking.
// Requests whose date has already passed are ignored. Each level fires once per handover
// (public.request_nudges).
//
// POST {} with x-internal-secret. { dry_run: true } lists what it would send.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const ADMIN_INBOX = "https://alfredconcierge.app/admin";
const LEVELS = [
  { level: 1, minutes: 30 },
  { level: 2, minutes: 120 },
];

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

async function slack(method: string, body: unknown): Promise<any> {
  const token = Deno.env.get("SLACK_BOT_TOKEN") ?? "";
  if (!token) return { ok: false, error: "no_bot_token" };
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  return await res.json().catch(() => ({ ok: false }));
}

function waited(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function parisHour(): number {
  return Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Europe/Paris" }).format(new Date()));
}

Deno.serve(async (req) => {
  const secret = await setting("notifications_internal_secret", "NOTIFICATIONS_INTERNAL_SECRET");
  if (!secret || req.headers.get("x-internal-secret") !== secret) return json({ error: "unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const dryRun = body.dry_run === true;

  const actionCh = await setting("slack_action_channel");
  const since = new Date(Date.now() - 48 * 3600 * 1000).toISOString();

  const { data: intents, error } = await supa.from("concierge_intents")
    .select("id, phone, venue_text, city, service_type, reservation_date, reservation_time, party_size, status, human_reason, updated_at, approved_at, booking_id, slack_channel, slack_thread_ts")
    .in("status", ["needs_human", "ready"]).is("booking_id", null).is("approved_at", null)
    .gte("updated_at", since)
    // A request whose date has passed is history, not a client waiting.
    .or(`reservation_date.is.null,reservation_date.gte.${new Date().toISOString().slice(0, 10)}`);
  if (error) return json({ error: error.message }, 500);

  const quiet = (() => { const h = parisHour(); return h >= 0 && h < 8; })();
  const results: Record<string, unknown>[] = [];

  for (const it of intents ?? []) {
    const handoverAt = it.updated_at as string;
    const mins = Math.floor((Date.now() - Date.parse(handoverAt)) / 60000);
    const due = LEVELS.filter((l) => mins >= l.minutes);
    if (!due.length) continue;

    // Has anyone from the team answered since the handover?
    const { count } = await supa.from("whatsapp_messages")
      .select("id", { count: "exact", head: true })
      .eq("phone", it.phone).eq("direction", "outbound")
      .in("kind", ["team_slack", "team_app", "agent_reply", "payment_link", "booking_confirmation"]).gt("created_at", handoverAt);
    if ((count ?? 0) > 0) continue;

    // Highest level not sent yet for this handover.
    const { data: sent } = await supa.from("request_nudges")
      .select("level").eq("intent_id", it.id).eq("handover_at", handoverAt);
    const done = new Set((sent ?? []).map((r: any) => r.level));
    const next = [...due].reverse().find((l) => !done.has(l.level));
    if (!next) continue;

    const what = [it.venue_text ?? it.service_type ?? "Request", it.city,
      it.reservation_date, it.reservation_time ? String(it.reservation_time).slice(0, 5) : null,
      it.party_size ? `${it.party_size} ${Number(it.party_size) === 1 ? "guest" : "guests"}` : null].filter(Boolean).join("  ·  ");
    const why = it.human_reason ? `\n_${String(it.human_reason).slice(0, 200)}_` : "";

    if (dryRun) { results.push({ intent: it.id, level: next.level, waited: waited(mins), what }); continue; }

    // Claim before posting so two runs can never double-post.
    const { error: claimErr } = await supa.from("request_nudges")
      .insert({ intent_id: it.id, handover_at: handoverAt, level: next.level });
    if (claimErr) continue;
    // Skipping straight to level 2 also marks level 1, so it never fires late.
    if (next.level === 2 && !done.has(1)) {
      await supa.from("request_nudges").insert({ intent_id: it.id, handover_at: handoverAt, level: 1 });
    }

    let r: any = { ok: false };
    if (next.level === 1 && it.slack_channel) {
      r = await slack("chat.postMessage", {
        channel: it.slack_channel, ...(it.slack_thread_ts ? { thread_ts: it.slack_thread_ts } : {}),
        text: `⏰ *Waiting ${waited(mins)} for a reply*: ${what}${why}`,
      });
    } else {
      let link = "";
      if (it.slack_channel && it.slack_thread_ts) {
        const p = await slack("chat.getPermalink", { channel: it.slack_channel, message_ts: it.slack_thread_ts });
        if (p?.ok) link = p.permalink;
      }
      const ch = actionCh || it.slack_channel;
      if (ch) {
        r = await slack("chat.postMessage", {
          channel: ch, unfurl_links: false,
          text: `${quiet ? "" : "<!here> "}🔴 *${waited(mins)} without a reply*: ${what}${why}\n` +
                `${link ? `<${link}|Open the client thread>  ·  ` : ""}<https://wa.me/${it.phone}|WhatsApp +${it.phone}>  ·  <${ADMIN_INBOX}|Admin>`,
        });
      }
    }
    results.push({ intent: it.id, level: next.level, waited: waited(mins), posted: !!r?.ok, error: r?.ok ? null : r?.error ?? null });
  }

  return json({ dry_run: dryRun, checked: (intents ?? []).length, nudged: results.length, quiet_hours: quiet, results });
});
