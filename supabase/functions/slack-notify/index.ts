// slack-notify (v20)
//
// The team's actual inbox. Nobody sits in the admin portal all day.
//
// v15: a changed request resurfaces, because the repeat guard fingerprints
//      the bookable facts instead of comparing a state name.
// v17: one channel per CLIENT, named after them.
// v18: A STOP BUTTON. On 2026-08-05 a colleague answered a client in Slack,
//      the stored record still held the old date, and Alfred kept repeating
//      that old date to the client while the colleague said otherwise. The
//      client sent our own confirmation back as a screenshot. Nobody could
//      switch the machine off, so it talked across the human. Every card now
//      carries Take over, and Hand back once paused, and says plainly which
//      state it is in.
// v20: MARK AS BOOKED. Dining/nightlife cards that need a human carry
//      "Mark as booked": records the booking and confirms by email + WhatsApp
//      (slack-interactions → confirm-booking).
// v19: PAY TO CONFIRM. Priced requests (cars, yachts, hotels, wellness) that
//      need a human carry "Send payment link": the colleague enters the
//      agreed price and the client gets a Stripe link on WhatsApp
//      (slack-interactions → payment-link → stripe-webhook).
//
// Channel routing, per-client mode: that client's own channel, always.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ADMIN_INBOX = "https://alfredconcierge.app/admin";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const DINING = new Set(["dining", "nightlife"]);
const WA_WINDOW_MS = 24 * 60 * 60 * 1000;

const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

async function setting(key: string, envName?: string): Promise<string> {
  if (envName) {
    const fromEnv = Deno.env.get(envName) ?? "";
    if (fromEnv) return fromEnv;
  }
  const { data } = await supabase.from("app_settings").select("value").eq("key", key).maybeSingle();
  return data?.value ?? "";
}

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

function noDash(s: string): string {
  return String(s)
    .replace(/\s+[—–]\s+/g, ", ")
    .replace(/(\S)\s+-\s+(\S)/g, "$1, $2")
    .replace(/,\s*,/g, ",").replace(/\s+,/g, ",")
    .replace(/,\s*([.!?])/g, "$1").replace(/[ \t]{2,}/g, " ").trim();
}

function fingerprint(parts: unknown[]): string {
  const s = parts.map((p) => String(p ?? "")).join("|");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

async function windowState(phone: string): Promise<{ open: boolean; hours: number | null }> {
  if (!phone) return { open: false, hours: null };
  const { data } = await supabase.from("whatsapp_messages")
    .select("created_at").eq("phone", phone).eq("direction", "inbound")
    .order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!data?.created_at) return { open: false, hours: null };
  const elapsed = Date.now() - new Date(data.created_at).getTime();
  return elapsed <= WA_WINDOW_MS
    ? { open: true, hours: Math.max(1, Math.round((WA_WINDOW_MS - elapsed) / 3600000)) }
    : { open: false, hours: Math.floor(elapsed / 3600000) };
}

const FIELD_LABEL: Record<string, string> = {
  venue: "the venue", venue_text: "the venue", restaurant: "the venue",
  date: "the date", reservation_date: "the date",
  time: "the time", reservation_time: "the time",
  party_size: "how many guests", guests: "how many guests", city: "the city",
  check_in: "the start date", check_out: "the end date",
  adults: "how many adults", children: "how many children",
  rooms: "how many rooms", room_type: "the room category",
  budget: "their budget", budget_per_night: "their budget per night",
  specific_property: "whether they have something in mind",
  destination: "the destination",
  vehicle_type: "the model or category", with_driver: "with or without a driver",
  pickup_location: "the pick-up point", duration: "one day or several",
  treatment_type: "which treatment", at_home: "at home or at a venue",
  guest_first: "their first name", guest_last: "their last name",
  guest_email: "their email",
};

function pretty(fields: string[]): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const f of fields) {
    const label = FIELD_LABEL[f] ?? f.replace(/_/g, " ");
    if (!seen.has(label)) { seen.add(label); out.push(label); }
  }
  if (out.length <= 1) return out.join("");
  return out.slice(0, -1).join(", ") + " and " + out[out.length - 1];
}

const TOLD_REASON: Record<string, string> = {
  outside_24h_window: "WhatsApp only allows a free message within 24 hours of their last one.",
  send_failed: "WhatsApp refused the message.",
  whatsapp_not_configured: "WhatsApp is not configured on the server.",
  not_attempted: "No confirmation was attempted.",
};

const SERVICE_ICON: Record<string, string> = {
  dining: "🍽️", nightlife: "🍸", hotels: "🏨",
  cars: "🚗", yachts: "⛵", wellness: "💆",
};

const hhmm = (t: unknown) => (t ? String(t).slice(0, 5) : null);
const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;

function daysBetween(a: unknown, b: unknown): number | null {
  if (!a || !b) return null;
  const inD = new Date(String(a) + "T12:00:00Z").getTime();
  const outD = new Date(String(b) + "T12:00:00Z").getTime();
  if (isNaN(inD) || isNaN(outD) || outD <= inD) return null;
  return Math.round((outD - inD) / 86400000);
}

function span(a: unknown, b: unknown, unitOne: string, unitMany: string): string | null {
  if (!a) return null;
  if (!b || a === b) return String(a);
  const n = daysBetween(a, b);
  return `${a} to ${b}${n ? ` (${plural(n, unitOne, unitMany)})` : ""}`;
}

function requestLine(intent: any): string {
  const service = String(intent.service_type ?? "dining");
  const icon = SERVICE_ICON[service] ?? "📝";
  const d = (intent.details ?? {}) as Record<string, any>;
  const named = d.specific_property || intent.venue_text || null;
  const budget = d.budget ?? d.budget_per_night ?? null;
  const heads = d.adults ?? intent.party_size ?? null;
  const open = !named ? "open to a suggestion" : null;

  let parts: (string | null)[];
  switch (service) {
    case "hotels": {
      const kids = d.children ? plural(Number(d.children), "child", "children") : null;
      const people = [heads ? plural(Number(heads), "adult", "adults") : null, kids].filter(Boolean).join(" + ");
      parts = [named ? `*${named}*` : null, intent.city ?? null,
        span(d.check_in, d.check_out, "night", "nights") ?? intent.reservation_date ?? null,
        people || null, d.rooms ? plural(Number(d.rooms), "room", "rooms") : null,
        d.room_type ?? null, budget ? `budget ${budget} per night` : null, open];
      break;
    }
    case "cars": {
      parts = [d.vehicle_type ? `*${d.vehicle_type}*` : (named ? `*${named}*` : null),
        intent.city ?? null,
        span(d.check_in, d.check_out, "day", "days") ?? intent.reservation_date ?? null,
        d.with_driver ?? null, d.pickup_location ? `pick-up ${d.pickup_location}` : null,
        budget ? `budget ${budget}` : null];
      break;
    }
    case "yachts": {
      parts = [named ? `*${named}*` : null, intent.city ?? null,
        span(d.check_in, d.check_out, "day", "days") ?? d.check_in ?? intent.reservation_date ?? null,
        d.duration ?? null, heads ? plural(Number(heads), "person", "people") : null,
        budget ? `budget ${budget}` : null, open];
      break;
    }
    case "wellness": {
      parts = [d.treatment_type ? `*${d.treatment_type}*` : (named ? `*${named}*` : null),
        intent.city ?? null, d.check_in ?? intent.reservation_date ?? null,
        hhmm(intent.reservation_time),
        heads ? plural(Number(heads), "person", "people") : null,
        d.at_home ?? null, budget ? `budget ${budget}` : null];
      break;
    }
    default: {
      parts = [intent.venue_text ? `*${intent.venue_text}*` : null,
        intent.reservation_date ?? null, hhmm(intent.reservation_time),
        intent.party_size ? `${intent.party_size} guests` : null, intent.city ?? null];
    }
  }
  const kept = parts.filter(Boolean) as string[];
  return kept.length ? `${icon} ${kept.join("  ·  ")}` : "";
}

function actionPanel(title: string, instruction: string, button?: { text: string; url: string }) {
  const blocks: unknown[] = [
    { type: "divider" },
    { type: "section", text: { type: "mrkdwn", text: `*${title}*\n${instruction}` } },
  ];
  if (button?.url) {
    blocks.push({ type: "actions", elements: [{
      type: "button", style: "primary",
      text: { type: "plain_text", text: button.text, emoji: true }, url: button.url }] });
  }
  return blocks;
}

function paymentLinkButton(intentId: string, existing?: { url?: string; amount_cents?: number; currency?: string } | null) {
  return {
    type: "actions", block_id: `pay:${intentId}`,
    elements: [{
      type: "button", style: "primary", action_id: "open_payment_link", value: intentId,
      text: { type: "plain_text", text: existing?.url ? "💳 Send a new payment link" : "💳 Send payment link", emoji: true },
    }],
  };
}

function markBookedButton(intentId: string) {
  return {
    type: "actions", block_id: `booked:${intentId}`,
    elements: [{
      type: "button", style: "primary", action_id: "open_mark_booked", value: intentId,
      text: { type: "plain_text", text: "✅ Mark as booked", emoji: true },
    }],
  };
}

function decisionPanel(title: string, instruction: string, intentId: string, venue: string) {
  return [
    { type: "divider" },
    { type: "section", text: { type: "mrkdwn", text: `*${title}*\n${instruction}` } },
    { type: "actions", block_id: `decide:${intentId}`, elements: [
      { type: "button", style: "primary", action_id: "approve_booking", value: intentId,
        text: { type: "plain_text", text: "Approve and book", emoji: true },
        confirm: {
          title: { type: "plain_text", text: "Book this table?" },
          text: { type: "mrkdwn", text: `This books a real table at *${venue}* in their name.` },
          confirm: { type: "plain_text", text: "Approve" },
          deny: { type: "plain_text", text: "Cancel" } } },
      { type: "button", action_id: "decline_booking", value: intentId,
        text: { type: "plain_text", text: "Handle manually", emoji: true } },
      { type: "button", action_id: "open_mark_booked", value: intentId,
        text: { type: "plain_text", text: "✅ I booked it myself", emoji: true } },
    ] },
  ];
}

type Sent = { ok: boolean; ts?: string; channel?: string; via: string; error?: string };

async function send(
  token: string, webhook: string,
  channel: string, text: string, blocks: unknown[], threadTs?: string | null,
): Promise<Sent> {
  if (token && channel) {
    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ channel, text, blocks,
        ...(threadTs ? { thread_ts: threadTs } : {}), unfurl_links: false, unfurl_media: false }),
    });
    const out = await res.json().catch(() => ({ ok: false, error: "bad_json" }));
    if (out.ok) return { ok: true, ts: out.ts, channel: out.channel, via: "bot" };
    console.warn("slack chat.postMessage failed", out.error);
    if (!webhook) return { ok: false, via: "bot", error: out.error };
  }
  if (!webhook) return { ok: false, via: "none", error: "no bot token and no webhook" };
  const res = await fetch(webhook, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, blocks }),
  });
  return { ok: res.ok, via: "webhook" };
}

serve(async (req) => {
  try {
    const secret = await setting("notifications_internal_secret", "NOTIFICATIONS_INTERNAL_SECRET");
    if (secret && req.headers.get("x-internal-secret") !== secret) return json({ error: "unauthorized" }, 401);

    const token = Deno.env.get("SLACK_BOT_TOKEN") ?? "";
    const webhook = await setting("slack_webhook_url", "SLACK_WEBHOOK_URL");
    if (!token && !webhook) return json({ skipped: true, reason: "no_slack_credentials" });

    const actionCh = await setting("slack_action_channel");
    const logCh = (await setting("slack_log_channel")) || actionCh;
    const perClient = (await setting("slack_channel_per_request")) === "true";

    const body = await req.json().catch(() => ({}));

    if (body.type === "test") {
      const r = await send(token, webhook, actionCh, "Alfred: Slack is wired up.",
        [{ type: "section", text: { type: "mrkdwn", text: "✅ *Alfred: Slack is wired up.*" } }]);
      return json({ ...r, per_client: perClient });
    }

    async function clientChannel(phone: string): Promise<string | null> {
      if (!perClient || !phone) return null;
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/slack-channels`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-internal-secret": secret },
          body: JSON.stringify({ action: "ensure", phone }),
        });
        const out = await res.json().catch(() => ({}));
        return typeof out?.channel === "string" ? out.channel : null;
      } catch { return null; }
    }

    async function threadOf(id: string) {
      const { data } = await supabase.from("concierge_intents")
        .select("slack_channel, slack_thread_ts").eq("id", id).maybeSingle();
      return { channel: data?.slack_channel ?? null, ts: data?.slack_thread_ts ?? null };
    }

    async function postFor(id: string | null, phone: string, want: string, text: string, blocks: unknown[]) {
      const own = await clientChannel(phone);
      if (own) return await send(token, webhook, own, text, blocks);
      if (!id) return await send(token, webhook, want, text, blocks);
      const t = await threadOf(id);
      const promote = want === actionCh && t.channel !== actionCh;
      if (t.ts && t.channel && !promote) {
        const r = await send(token, webhook, t.channel, text, blocks, t.ts);
        if (r.ok) return r;
      }
      const r = await send(token, webhook, want, text, blocks);
      if (r.ok && r.ts) {
        await supabase.from("concierge_intents")
          .update({ slack_channel: r.channel ?? want, slack_thread_ts: r.ts }).eq("id", id);
      }
      return r;
    }

    // Who is holding this conversation, Alfred or a person?
    async function pauseState(phone: string) {
      if (!phone) return { paused: false, by: null as string | null };
      const { data } = await supabase.from("concierge_ai_pause")
        .select("paused, paused_by").eq("phone", phone).maybeSingle();
      return { paused: data?.paused === true, by: data?.paused_by ?? null };
    }

    function handoverBlocks(phone: string, paused: boolean, by: string | null) {
      if (!phone) return [];
      return [{
        type: "actions", block_id: `handover:${phone}`,
        elements: [paused
          ? { type: "button", style: "primary", action_id: "resume_ai", value: phone,
              text: { type: "plain_text", text: "Hand back to Alfred", emoji: true } }
          : { type: "button", action_id: "pause_ai", value: phone,
              text: { type: "plain_text", text: "Take over, stop Alfred", emoji: true },
              confirm: {
                title: { type: "plain_text", text: "Take this client over?" },
                text: { type: "mrkdwn", text: "Alfred stops answering them until someone hands it back. It keeps reading and filing, so these cards stay accurate." },
                confirm: { type: "plain_text", text: "Take over" },
                deny: { type: "plain_text", text: "Cancel" } } },
        ],
      }];
    }

    if (body.type === "booking_outcome") {
      const id = String(body.intent_id ?? "");
      const status = String(body.status ?? "");
      const reason = body.reason ? noDash(String(body.reason)) : "";
      const told = String(body.member_told ?? "not_attempted");

      const { data: it } = await supabase.from("concierge_intents")
        .select("phone, venue_text, restaurant_id, reservation_date, reservation_time, party_size, approved_by, attempt_url")
        .eq("id", id).maybeSingle();

      let venueName = it?.venue_text ?? "the venue";
      let venuePhone = "";
      if (it?.restaurant_id) {
        const { data: v } = await supabase.from("restaurants")
          .select("name, phone_number").eq("id", it.restaurant_id).maybeSingle();
        venueName = v?.name ?? venueName;
        venuePhone = v?.phone_number ?? "";
      }

      const when = [it?.reservation_date, hhmm(it?.reservation_time),
                    it?.party_size ? `${it.party_size} guests` : null].filter(Boolean).join("  ·  ");
      const booked = status === "booked";
      const memberKnows = told === "sent";

      const lines = [
        booked ? `✅ *Booked: ${venueName}*`
           : status === "needs_human" ? `🔴 *Could not book ${venueName}*`
           : status === "failed" ? `⚠️ *Booking run failed: ${venueName}*`
           : `*${venueName}*: ${status}`,
      ];
      if (when) lines.push(when);
      if (body.dry_run) lines.push("_Rehearsal only, nothing was booked._");

      const blocks: unknown[] = [{ type: "section", text: { type: "mrkdwn", text: lines.join("\n") } }];

      if (booked && memberKnows) {
        blocks.push(...actionPanel("✅ Done, no action needed",
          `Confirmed${it?.approved_by ? `, approved by ${it.approved_by}` : ""}, and they have been told on WhatsApp.`));
      } else if (booked) {
        blocks.push(...actionPanel("🔴 Booked, but they have NOT been told",
          [`*Why:* ${TOLD_REASON[told] ?? told}`, `*Do:* tell them it is confirmed for ${when || "the requested time"}.`].join("\n"),
          it?.phone ? { text: "Message on WhatsApp", url: `https://wa.me/${it.phone}` } : undefined));
      } else {
        blocks.push(...actionPanel("🔴 A human needs to finish this", [
          reason ? `*Why it stopped:* ${reason}` : "*Why it stopped:* the run could not complete.",
          venuePhone ? `*1.* Call ${venueName} on ${venuePhone} and book it manually.`
                     : `*1.* Book ${venueName} manually, no phone number on file.`,
          `*2.* Click *Mark as booked*: they get the confirmation by email and WhatsApp.`,
        ].join("\n"), it?.phone ? { text: "Message on WhatsApp", url: `https://wa.me/${it.phone}` } : undefined));
        if (id) blocks.push(markBookedButton(id));
      }

      blocks.push({ type: "context", elements: [{ type: "mrkdwn",
        text: [it?.attempt_url ? `<${it.attempt_url}|Booking page>` : "",
               `<${ADMIN_INBOX}|Admin inbox>`].filter(Boolean).join("  ·  ") }] });

      const done = booked && memberKnows;
      const r = await postFor(id, String(it?.phone ?? ""), done ? logCh : actionCh,
        `${venueName}: ${status}`, blocks);
      return json({ ...r, member_told: told });
    }

    const phone = String(body.phone ?? "").replace(/[^0-9]/g, "");
    const text = String(body.text ?? "");
    const note = body.note ? noDash(String(body.note)) : "";
    const intentId = body.intent_id ? String(body.intent_id) : "";
    const aiReply = String(body.ai_reply ?? "").trim();

    const { data: matches } = await supabase.rpc("member_by_phone", { p_phone: phone });
    const member = Array.isArray(matches) ? matches[0] ?? null : matches ?? null;

    const displayName = member
      ? [member.first_name, member.last_name].filter(Boolean).join(" ").trim() || "Member"
      : (String(body.name ?? "").trim() || "Unknown number");

    const hold = await pauseState(phone);

    const blocks: unknown[] = [{
      type: "section",
      text: { type: "mrkdwn",
        text: perClient
          ? `💬 ${note ? `_${note}_\n` : ""}>${text.slice(0, 600)}`
          : `💬 *${displayName}*, <https://wa.me/${phone}|+${phone}>${note ? `\n_${note}_` : ""}\n>${text.slice(0, 600)}` },
    }];

    if (hold.paused) {
      blocks.push({ type: "section", text: { type: "mrkdwn",
        text: `🚫 *Alfred is switched off for this client*, taken over by ${hold.by ?? "a colleague"}. ` +
              `It is still reading and filing, but it will not answer. You have the conversation.` } });
    } else if (aiReply) {
      blocks.push({ type: "section", text: { type: "mrkdwn",
        text: `🤖 *Alfred replied:*\n>${aiReply.slice(0, 600)}` } });
    }

    const win = await windowState(phone);

    let needsHuman = false;
    let stateKey = "message";
    let alreadyAsked = false;

    if (intentId) {
      const { data: intent } = await supabase.from("concierge_intents")
        .select("venue_text, restaurant_id, city, service_type, details, reservation_date, reservation_time, party_size, missing_fields, status, confidence, human_reason, approved_at, approved_by, booking_id, slack_last_state")
        .eq("id", intentId).maybeSingle();

      if (intent) {
        const missing = Array.isArray(intent.missing_fields) ? intent.missing_fields as string[] : [];
        const service = String(intent.service_type ?? "dining");
        const isDining = DINING.has(service);

        const line = requestLine(intent);
        if (line) blocks.push({ type: "section", text: { type: "mrkdwn", text: line } });

        const status = String(intent.status ?? "");
        const venueUnmatched = isDining && !intent.restaurant_id && intent.venue_text;

        const fp = fingerprint([intent.venue_text, intent.restaurant_id, intent.reservation_date,
          hhmm(intent.reservation_time), intent.party_size,
          // A payment link being sent is not a change to the request itself.
          JSON.stringify({ ...((intent.details ?? {}) as Record<string, unknown>), payment_link: undefined })]);

        stateKey = intent.booking_id ? "booked"
                 : status === "needs_human" ? `needs_human:${fp}`
                 : intent.approved_at ? "approved"
                 : `${status}${status === "ready" && venueUnmatched ? ":unmatched" : ""}:${fp}`;
        alreadyAsked = intent.slack_last_state === stateKey;

        if (intent.booking_id) {
          blocks.push(...actionPanel("✅ Booked, no action needed", "This is confirmed."));
        } else if (status === "needs_human") {
          needsHuman = true;
          const priced = !isDining && service !== "";
          blocks.push(...actionPanel(
            `${isDining ? "🔴" : (SERVICE_ICON[service] ?? "🔴")} A human needs to take this`,
            [intent.human_reason ? `*Why:* ${noDash(String(intent.human_reason))}` : "*Why:* Alfred handed it over.",
             missing.length && !isDining ? `_Still unknown: ${pretty(missing)}._` : "",
             win.open ? `*Do:* write here and it reaches them on WhatsApp.`
                      : `*Do:* the free reply window is shut, send a template first.`,
             priced ? `*Once the price is agreed with the partner:* send them a payment link. Paying it confirms the booking.`
                    : `*Once the table is secured:* click *Mark as booked*. They get the confirmation by email and WhatsApp.`,
            ].filter(Boolean).join("\n")));
          if (priced) blocks.push(paymentLinkButton(intentId, (intent.details as any)?.payment_link ?? null));
          else blocks.push(markBookedButton(intentId));
        } else if (intent.approved_at) {
          blocks.push(...actionPanel("⏳ Approved, booking in progress",
            `Approved by ${intent.approved_by ?? "a colleague"}.`));
        } else if (status === "collecting") {
          blocks.push(...actionPanel("🟡 Alfred is still collecting, no action needed",
            missing.length ? `He has asked for ${pretty(missing)}.` : "He is gathering the missing details."));
        } else if (status === "ready") {
          needsHuman = true;
          const venueName = String(intent.venue_text ?? "this venue");
          if (venueUnmatched) {
            blocks.push(...actionPanel("🔴 Cannot be booked automatically",
              `*${venueName}* is not in the catalogue. Book it manually, then click *Mark as booked*.`));
            blocks.push(markBookedButton(intentId));
          } else {
            blocks.push(...decisionPanel("🟢 Waiting on you to approve",
              "*Approving books exactly what is written above.*", intentId, venueName));
          }
        }
      }
    }

    blocks.push({ type: "context", elements: [{ type: "mrkdwn",
      text: (win.open ? `🟢 Free reply open for about ${win.hours}h`
            : win.hours === null ? "🔴 No inbound message on record, only a template can reach them"
            : `🔴 Free reply closed, their last message was ${win.hours}h ago`) +
        `  ·  <${ADMIN_INBOX}|Admin inbox>` }] });

    blocks.push(...handoverBlocks(phone, hold.paused, hold.by));

    if (!win.open && intentId) {
      blocks.push({ type: "actions", block_id: `reopen:${intentId}`, elements: [{
        type: "button", action_id: "reopen_window", value: intentId,
        text: { type: "plain_text", text: "Send a template to reopen", emoji: true } }] });
    }

    const toAction = needsHuman && !alreadyAsked;
    const r = await postFor(intentId || null, phone, toAction ? actionCh : logCh,
      `${displayName}: ${text.slice(0, 140)}`, blocks);

    if (toAction && intentId) {
      await supabase.from("concierge_intents")
        .update({ slack_last_state: stateKey }).eq("id", intentId);
    }

    return json({ ...r, matched_member: !!member, window_open: win.open,
                  ai_paused: hold.paused, per_client: perClient,
                  repeat_suppressed: needsHuman && alreadyAsked });
  } catch (e) {
    return json({ fatal: String((e as Error)?.message ?? e).slice(0, 300) }, 500);
  }
});
