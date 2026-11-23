// Supabase Edge Function: whatsapp-webhook (v18)
//
// v13: Meta redeliveries claimed by a unique index; a human can take over.
// v14: make it read as a person, after a prospect said "j'ai vaguement
//      l'impression que c'est backe par Claude". Bursts are waited out,
//      near-duplicates dropped, read receipt and typing indicator shown.
// v15: THE PAUSE IS NOW 30 TO 60 SECONDS, Ethan's call.
// v16: WHEN THE BRAIN IS DOWN, SAY NOTHING. Ethan's call, 2026-08-10.
//      There used to be a canned line here, "Received, your concierge is on
//      it". The Anthropic account ran out of credit on 2026-08-07 and
//      concierge-brain returned 502 on every message for sixty-two hours,
//      so that line was the only thing four clients heard.
//
//      It failed twice over. It told a client their concierge was on it
//      when nobody had been told anything. And because it was identical to
//      the character every time, saidRecently() suppressed the second one
//      inside fifteen minutes, so a client who wrote again simply got
//      silence. The anti-repetition guard turned an outage into a mute.
//
//      Now a failed brain sends nothing to the client and posts a loud
//      handover note to Slack instead. Silence a colleague can see beats a
//      reassurance nobody can honour.
// v17: FALLBACK WELCOME ON FIRST CONTACT, Ethan's call, 2026-08-14.
//      The proactive welcome_alfred template is Marketing, and Meta blocked
//      7 of them with 131049 "not delivered to maintain healthy ecosystem
//      engagement" — roughly half of all welcomes never arrived. Nothing in
//      the code was wrong; Meta simply refuses cold Marketing templates.
//
//      A message sent inside the 24h customer service window is free-form,
//      not a template, so 131049 cannot touch it. So: when somebody writes
//      in and has never actually received a welcome, send it here, as text,
//      before the concierge answers. The proactive template is kept as-is —
//      it still reaches the half who never write first, and this only fills
//      the gap it leaves.
// v18: NOTHING A CLIENT WRITES IS LOST, AND AN OUTAGE IS LOUD. 2026-11-23.
//      - A message superseded by a burst used to return before reaching
//        Slack, so "a table at Diep for 4 tomorrow" arrived in Slack as just
//        "At 8 pm". Every message now lands in the client's channel.
//      - When the brain is down, besides the note in the client's channel,
//        #bookings gets an @here alert (at most every 30 minutes), because a
//        note inside one client channel is easy to miss and the 2026-11-22
//        credit outage went unnoticed for a day.
//
// The whole reply path runs after the 200. Holding the request open while
// deliberately pausing is what caused the redelivery storm, and the pause is
// now a full minute.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DEFAULT_VERIFY_TOKEN = "alfred-wa-hook-2026";
const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN") || DEFAULT_VERIFY_TOKEN;
const APP_SECRET = Deno.env.get("WHATSAPP_APP_SECRET") ?? "";
const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN") ?? "";
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const GRAPH_VERSION = "v21.0";
const COMMAND_MAX_LEN = 40;

// How long to let a burst of messages finish before answering any of it.
const BURST_WAIT_MS = 7000;
// The whole reply, measured from the moment the message landed.
const MIN_DELAY_MS = 30000;
const MAX_DELAY_MS = 60000;
// WhatsApp drops the typing line after about 25 seconds, so re-arm it.
const TYPING_LEAD_MS = 18000;
const DUPLICATE_WINDOW_MS = 15 * 60 * 1000;
// #bookings outage alert: at most once per this window.
const DOWN_ALERT_EVERY_MS = 30 * 60 * 1000;

const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let cachedSecret: string | null = null;
async function internalSecret(): Promise<string> {
  if (cachedSecret !== null) return cachedSecret;
  const fromEnv = Deno.env.get("NOTIFICATIONS_INTERNAL_SECRET") ?? "";
  if (fromEnv) { cachedSecret = fromEnv; return cachedSecret; }
  const { data } = await supabase.from("app_settings").select("value")
    .eq("key", "notifications_internal_secret").maybeSingle();
  cachedSecret = data?.value ?? "";
  return cachedSecret;
}

function normalise(raw: string): string {
  return raw.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

const OPT_OUT_PATTERNS: RegExp[] = [
  /^stop\b/, /\bstop (pub|publicite|marketing|messages?)\b/, /\bdesabonn/,
  /\bunsubscribe\b/, /\bopt ?out\b/, /\bno more\b/,
  /\bplus de (messages?|pub|publicite|sms|notifications?)\b/,
  /\bne plus (recevoir|envoyer)\b/, /\bme (retirer|desinscrire)\b/,
  /\bretirez moi\b/, /^arrete[rz]?\b/, /^remove me\b/,
];
const OPT_IN_PATTERNS: RegExp[] = [
  /^start\b/, /^resume\b/, /\bsubscribe\b/, /\bre ?abonn/, /^reprendre\b/,
];

type OptControl = "out" | "in" | null;
function detectOptControl(text: string): OptControl {
  const n = normalise(text);
  if (!n || n.length > COMMAND_MAX_LEN) return null;
  if (OPT_OUT_PATTERNS.some((re) => re.test(n))) return "out";
  if (OPT_IN_PATTERNS.some((re) => re.test(n))) return "in";
  return null;
}

async function applyOptControl(control: "out" | "in", phone: string, userId: string | null) {
  const optedOut = control === "out";
  await supabase.from("whatsapp_opt_outs").upsert(
    { phone, opted_out: optedOut, source: "inbound_keyword", updated_at: new Date().toISOString() },
    { onConflict: "phone" },
  );
  if (userId) {
    await supabase.from("users").update({ whatsapp_marketing_opt_out: optedOut }).eq("id", userId);
  }
}

async function verifySignature(rawBody: string, header: string | null): Promise<boolean> {
  if (!APP_SECRET) return true;
  if (!header?.startsWith("sha256=")) return false;
  const expectedHex = header.slice(7);
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(APP_SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const hex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === expectedHex;
}

async function findUserByPhone(phone: string) {
  const { data } = await supabase.rpc("member_by_phone", { p_phone: phone });
  const row = Array.isArray(data) ? data[0] ?? null : data ?? null;
  return row ?? null;
}

async function aiPaused(phone: string): Promise<boolean> {
  const { data } = await supabase.from("concierge_ai_pause")
    .select("paused").eq("phone", phone).maybeSingle();
  return data?.paused === true;
}

function describeMessage(msg: any): string {
  switch (msg.type) {
    case "text": return msg.text?.body ?? "";
    case "image": return "[image]" + (msg.image?.caption ? ` ${msg.image.caption}` : "");
    case "video": return "[video]" + (msg.video?.caption ? ` ${msg.video.caption}` : "");
    case "audio": return "[voice note]";
    case "document": return `[document] ${msg.document?.filename ?? ""}`;
    case "location": return `[location] ${msg.location?.latitude},${msg.location?.longitude}`;
    case "button": return msg.button?.text ?? "[button reply]";
    case "interactive":
      return msg.interactive?.button_reply?.title ?? msg.interactive?.list_reply?.title ?? "[interactive reply]";
    case "reaction": return `[reaction] ${msg.reaction?.emoji ?? ""}`;
    default: return `[${msg.type ?? "unknown"}]`;
  }
}

// Blue ticks and the "typing..." line. Its absence is one of the tells, and
// so is showing it once and then going quiet for a minute.
async function showReading(messageId: string) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !messageId) return;
  await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp", status: "read", message_id: messageId,
      typing_indicator: { type: "text" },
    }),
  }).catch(() => {});
}

async function sendText(phone: string, text: string) {
  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: phone, type: "text", text: { body: text } }),
    },
  );
  return { ok: res.ok, body: await res.json().catch(() => ({})) };
}

/** Did a welcome actually LAND for this number? A failed template row does
 *  not count, which is the whole point: those are the ones Meta blocked. */
async function welcomeLanded(phone: string, userId: string | null): Promise<boolean> {
  const base = supabase.from("whatsapp_messages")
    .select("id").eq("kind", "welcome")
    .in("status", ["sent", "delivered", "read"]).limit(1);
  const { data } = await (userId
    ? base.or(`phone.eq.${phone},user_id.eq.${userId}`)
    : base.eq("phone", phone));
  return !!data?.length;
}

/** First inbound from somebody the welcome never reached. Free-form inside
 *  the 24h window, so Meta's 131049 marketing block does not apply. */
async function welcomeIfFirstContact(phone: string, user: any) {
  if (!phone || !WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) return;

  const { data: opt } = await supabase.from("whatsapp_opt_outs")
    .select("opted_out").eq("phone", phone).maybeSingle();
  if (opt?.opted_out === true) return;

  if (await welcomeLanded(phone, user?.id ?? null)) return;

  const named = user?.first_name ? `, ${user.first_name}` : "";
  const body =
    `Welcome to Alfred${named}. I am your concierge on WhatsApp, ` +
    `at your service day and night, wherever you are. ` +
    `Let me look into this for you.`;

  const sent = await sendText(phone, body);
  await supabase.from("whatsapp_messages").insert({
    user_id: user?.id ?? null, phone, direction: "outbound",
    kind: "welcome", template_name: null, body,
    wa_message_id: sent.body?.messages?.[0]?.id ?? null,
    status: sent.ok ? "sent" : "failed",
    error: sent.ok ? null : JSON.stringify(sent.body?.error ?? sent.body).slice(0, 2000),
  });
  console.log(`free-form welcome to +${phone}: ${sent.ok ? "sent" : "failed"}`);
}

async function saidRecently(phone: string, reply: string): Promise<boolean> {
  const key = normalise(reply).slice(0, 60);
  if (key.length < 20) return false;
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  const { data } = await supabase.from("whatsapp_messages")
    .select("body").eq("phone", phone).eq("direction", "outbound")
    .gte("created_at", since).order("created_at", { ascending: false }).limit(5);
  return (data ?? []).some((r: any) => normalise(String(r.body ?? "")).slice(0, 60) === key);
}

async function stillTheLastWord(phone: string, mine: string): Promise<boolean> {
  const { data } = await supabase.from("whatsapp_messages")
    .select("wa_message_id").eq("phone", phone).eq("direction", "inbound")
    .order("created_at", { ascending: false }).limit(1).maybeSingle();
  return !data?.wa_message_id || data.wa_message_id === mine;
}

async function notifySlack(
  name: string, phone: string, text: string,
  note?: string, intentId?: string | null, aiReply?: string,
) {
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/slack-notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-secret": await internalSecret() },
      body: JSON.stringify({ type: "inbound", phone, name, text, note,
                             intent_id: intentId ?? null, ai_reply: aiReply ?? "" }),
    });
  } catch (e) {
    console.error("slack notify failed", e);
  }
}

/** Alfred cannot answer: say so in #bookings with @here, at most every 30
 *  minutes, so an outage is seen within minutes rather than a day later. */
async function alertTeamAlfredDown(name: string, phone: string, text: string, err: string) {
  try {
    const token = Deno.env.get("SLACK_BOT_TOKEN") ?? "";
    if (!token) return;
    const { data: ch } = await supabase.from("app_settings").select("value")
      .eq("key", "slack_action_channel").maybeSingle();
    if (!ch?.value) return;
    const { data: last } = await supabase.from("app_settings").select("value")
      .eq("key", "alfred_down_alerted_at").maybeSingle();
    if (last?.value && Date.now() - Date.parse(last.value) < DOWN_ALERT_EVERY_MS) return;
    await supabase.from("app_settings")
      .upsert({ key: "alfred_down_alerted_at", value: new Date().toISOString() }, { onConflict: "key" });

    const credit = /credit balance/i.test(err);
    const why = credit
      ? "The Anthropic account is out of credit. Top it up at console.anthropic.com → Plans & Billing."
      : `Error: ${err}`;
    await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        channel: ch.value, unfurl_links: false,
        text: `<!here> 🚨 *Alfred is not answering WhatsApp clients.* ${why}\n` +
              `Clients get no reply until a person answers them from their #client channel.\n` +
              `Latest: ${name} (+${phone}): "${text.slice(0, 160)}"\n` +
              `_This alert repeats at most every 30 minutes while Alfred is down._`,
      }),
    });
  } catch (e) {
    console.error("down alert failed", e);
  }
}

/** Everything that happens after we have already told Meta 200. */
async function handle(msg: any, value: any) {
  const landedAt = Date.now();
  const phone = String(msg.from ?? "").replace(/[^0-9]/g, "");
  const text = describeMessage(msg);
  const contactName = value.contacts?.[0]?.profile?.name ?? null;
  const user = phone ? await findUserByPhone(phone) : null;
  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ")
    : (contactName ?? "Unknown client");

  let note: string | undefined;
  const control = msg.type === "text" ? detectOptControl(text) : null;
  if (control && phone) {
    await applyOptControl(control, phone, user?.id ?? null);
    note = control === "out" ? "opted OUT of marketing messages" : "opted back IN to marketing messages";
  }

  const answerable = phone && !control && msg.type === "text" && text.trim();
  const paused = phone ? await aiPaused(phone) : false;

  if (!answerable) {
    await notifySlack(displayName, phone, text, note);
    return;
  }

  await showReading(String(msg.id ?? ""));

  // Let the burst finish. If they kept typing, the last message answers for
  // all of them, but this one still goes to the client's Slack channel so
  // the team reads the whole conversation, not just its last line.
  await sleep(BURST_WAIT_MS);
  if (!(await stillTheLastWord(phone, String(msg.id ?? "")))) {
    console.log(`burst: superseded by a later message from +${phone}`);
    await notifySlack(displayName, phone, text, note);
    return;
  }

  // Past the burst guard exactly one handler survives, so the welcome cannot
  // go out twice. It lands immediately; the concierge answer follows after
  // its usual pause, which reads the way a real greeting does.
  await welcomeIfFirstContact(phone, user)
    .catch((e) => console.error("free-form welcome failed", e));

  let reply = "";
  let intentId: string | null = null;
  let brainAnswered = false;
  let chosenSilence = false;
  let brainError = "";

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/concierge-brain`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-secret": await internalSecret() },
      body: JSON.stringify({ phone, message: text }),
    });
    const out = await res.json().catch(() => ({}));
    if (res.ok && !out.error && !out.fatal) {
      brainAnswered = true;
      intentId = out.intent_id ?? null;
      if (out.should_reply === false) chosenSilence = true;
      else if (typeof out.reply === "string" && out.reply.trim()) reply = out.reply.trim();
    } else {
      brainError = String(out.detail?.message ?? out.error ?? `HTTP ${res.status}`).slice(0, 180);
      console.error(`concierge-brain refused: ${brainError}`);
    }
  } catch (e) {
    brainError = String((e as Error).message).slice(0, 180);
    console.error("concierge-brain unreachable", e);
  }

  if (paused) {
    await notifySlack(displayName, phone, text,
      note ?? "Alfred is paused, a colleague has this one", intentId, "");
    return;
  }

  // THE BRAIN IS DOWN. Nothing goes to the client. A canned holding line
  // here used to be worse than silence: identical every time, so the second
  // one inside fifteen minutes was suppressed as a duplicate and the client
  // heard nothing anyway, having already been promised a concierge was on it.
  if (!brainAnswered) {
    await notifySlack(displayName, phone, text,
      `ALFRED IS DOWN, nothing was sent to this client, answer them yourself. ${brainError}`,
      null, "");
    await alertTeamAlfredDown(displayName, phone, text, brainError);
    return;
  }

  if (chosenSilence || !reply) {
    await notifySlack(displayName, phone, text,
      note ?? "Alfred stayed silent, nothing to add", intentId, "");
    return;
  }

  if (await saidRecently(phone, reply)) {
    console.log(`suppressed a near-duplicate reply to +${phone}`);
    await notifySlack(displayName, phone, text,
      note ?? "Alfred was about to repeat itself, suppressed", intentId, "");
    return;
  }

  // Thirty to sixty seconds from the moment they wrote, never the same twice.
  // The burst wait and the model call are absorbed into it, not added to it.
  const target = MIN_DELAY_MS + Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));
  const remaining = target - (Date.now() - landedAt);
  if (remaining > TYPING_LEAD_MS) {
    // Stay quiet, then start typing again shortly before the message lands.
    await sleep(remaining - TYPING_LEAD_MS);
    await showReading(String(msg.id ?? ""));
    await sleep(TYPING_LEAD_MS);
  } else if (remaining > 0) {
    await sleep(remaining);
  }

  const sent = await sendText(phone, reply);
  await supabase.from("whatsapp_messages").insert({
    user_id: user?.id ?? null, phone, direction: "outbound",
    kind: intentId ? "concierge_ai" : "auto_ack", body: reply,
    wa_message_id: sent.body?.messages?.[0]?.id ?? null,
    status: sent.ok ? "sent" : "failed",
    error: sent.ok ? null : JSON.stringify(sent.body?.error ?? sent.body).slice(0, 2000),
  });
  console.log(`replied to +${phone} after ${Math.round((Date.now() - landedAt) / 1000)}s`);

  await notifySlack(displayName, phone, text, note, intentId, reply);
}

serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && VERIFY_TOKEN && token === VERIFY_TOKEN) {
      return new Response(challenge ?? "", { status: 200 });
    }
    return new Response("forbidden", { status: 403 });
  }

  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  try {
    const rawBody = await req.text();
    if (!(await verifySignature(rawBody, req.headers.get("x-hub-signature-256")))) {
      console.warn("invalid webhook signature");
      return new Response("invalid signature", { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const work: Promise<unknown>[] = [];

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value ?? {};

        for (const msg of value.messages ?? []) {
          const phone = String(msg.from ?? "").replace(/[^0-9]/g, "");
          const text = describeMessage(msg);
          const user = phone ? await findUserByPhone(phone) : null;
          const control = msg.type === "text" ? detectOptControl(text) : null;

          // CLAIM FIRST. The unique index makes this fail on a Meta
          // redelivery, and a failed insert means somebody already has it.
          const { error: claimErr } = await supabase.from("whatsapp_messages").insert({
            user_id: user?.id ?? null, phone, direction: "inbound",
            kind: control ? "opt_control" : "inbound",
            body: text, wa_message_id: msg.id ?? null, status: "received",
          });
          if (claimErr) {
            console.log(`duplicate delivery from Meta ignored: ${msg.id}`);
            continue;
          }

          console.log(`inbound from ${phone}: ${text.slice(0, 120)}`);
          work.push(handle(msg, value));
        }

        for (const echo of value.message_echoes ?? []) {
          const phone = String(echo.to ?? "").replace(/[^0-9]/g, "");
          const user = phone ? await findUserByPhone(phone) : null;
          await supabase.from("whatsapp_messages").insert({
            user_id: user?.id ?? null, phone, direction: "outbound",
            kind: "team_app", body: describeMessage(echo),
            wa_message_id: echo.id ?? null, status: "sent",
          });
        }

        for (const st of value.statuses ?? []) {
          if (!st.id || !st.status) continue;
          const update: Record<string, unknown> = {
            status: st.status, status_updated_at: new Date().toISOString(),
          };
          if (st.status === "failed" && st.errors?.length) {
            update.error = JSON.stringify(st.errors).slice(0, 2000);
          }
          await supabase.from("whatsapp_messages").update(update).eq("wa_message_id", st.id);
        }
      }
    }

    // Answer Meta now and finish in the background: the pause is a full
    // minute and holding the request open is what caused the redeliveries.
    const runtime = (globalThis as any).EdgeRuntime;
    if (work.length) {
      const all = Promise.allSettled(work);
      if (runtime?.waitUntil) runtime.waitUntil(all);
      else await all;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("whatsapp-webhook error:", e);
    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  }
});
