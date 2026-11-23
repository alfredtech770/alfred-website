// slack-interactions (v4)
//
// Approve, decline, reopen a closed WhatsApp window, and TAKE OVER from
// Alfred, with one tap inside Slack.
//
// v3 adds the takeover, after a real conversation went wrong on 2026-08-05:
// a colleague answered a client in Slack, the stored record still held the
// old date, and Alfred kept repeating that old date to the client while the
// colleague was telling them something else. The client ended up sending a
// screenshot of our own confirmation back at us. Nobody could switch the
// machine off, so it talked across the human. Now anyone can, per client,
// instantly, and hand it back when the moment has passed.
//
// Pausing does NOT blind Alfred: it still reads and files every message, so
// the Slack card stays accurate. It simply stops speaking.
//
// v4 adds PAY TO CONFIRM: "Send payment link" opens a short form (what,
// total, amount now, currency). On submit, payment-link creates a Stripe
// Checkout link and sends it to the client on WhatsApp; the result is posted
// back in the same thread. stripe-webhook confirms the booking when paid.
//
// Requires Interactivity & Shortcuts ON with the Request URL pointing here.
//
// Secrets: SLACK_SIGNING_SECRET, SLACK_BOT_TOKEN, WHATSAPP_TOKEN.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const ADMIN_INBOX = "https://alfredconcierge.app/admin";
const GRAPH = "v21.0";
const EURO_CITIES = new Set(["paris", "saint-tropez", "ibiza", "mykonos", "monaco", "cannes", "madrid"]);

async function setting(key: string, envName?: string): Promise<string> {
  if (envName) {
    const v = Deno.env.get(envName) ?? "";
    if (v) return v;
  }
  const { data } = await supabase.from("app_settings").select("value").eq("key", key).maybeSingle();
  return data?.value ?? "";
}

const ok = () => new Response("", { status: 200 });
const okJson = (b: unknown) =>
  new Response(JSON.stringify(b), { status: 200, headers: { "Content-Type": "application/json" } });

function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verify(raw: string, ts: string, sig: string, secret: string): Promise<boolean> {
  const age = Math.abs(Date.now() / 1000 - Number(ts));
  if (!ts || !Number.isFinite(age) || age > 300) return false;
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`v0:${ts}:${raw}`));
  const hex = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return same(`v0=${hex}`, sig);
}

const hhmm = (t: unknown) => (t ? String(t).slice(0, 5) : "not set");

function noDash(s: string): string {
  return String(s)
    .replace(/\s+[—–]\s+/g, ", ")
    .replace(/(\S)\s+-\s+(\S)/g, "$1, $2")
    .replace(/[ \t]{2,}/g, " ").trim();
}

async function replaceMessage(responseUrl: string, text: string, blocks: unknown[]) {
  await fetch(responseUrl, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ replace_original: true, text, blocks }),
  }).catch(() => {});
}

async function inThread(responseUrl: string, text: string) {
  await fetch(responseUrl, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ replace_original: false, response_type: "in_channel", text }),
  }).catch(() => {});
}

// ---- pay to confirm -------------------------------------------------------

function parseMoney(v: unknown): number | null {
  const s = String(v ?? "").replace(/[^0-9.,]/g, "").replace(/,(?=\d{3}(\D|$))/g, "").replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null;
}

function money(cents: number, currency: string): string {
  const sym = ({ usd: "$", eur: "€", gbp: "£" } as Record<string, string>)[currency] ?? currency.toUpperCase() + " ";
  const v = cents / 100;
  return sym + (Number.isInteger(v) ? v.toLocaleString("en-US") : v.toFixed(2));
}

async function slackApi(method: string, body: unknown): Promise<any> {
  const token = Deno.env.get("SLACK_BOT_TOKEN") ?? "";
  if (!token) return { ok: false, error: "no_bot_token" };
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  return await res.json().catch(() => ({ ok: false, error: "bad_json" }));
}

async function openPaymentModal(payload: any, intentId: string) {
  const { data: it } = await supabase.from("concierge_intents")
    .select("id, venue_text, city, service_type, reservation_date, details")
    .eq("id", intentId).maybeSingle();
  const d = (it?.details ?? {}) as Record<string, any>;
  const what = d.vehicle_type || d.specific_property || it?.venue_text || "";
  const dates = d.check_in ? (d.check_out && d.check_out !== d.check_in ? `${d.check_in} to ${d.check_out}` : d.check_in)
    : (it?.reservation_date ?? "");
  const description = [what, it?.city, dates].filter(Boolean).join(", ").slice(0, 150);
  const cur = EURO_CITIES.has(String(it?.city ?? "").toLowerCase()) ? "eur" : "usd";
  const opt = (v: string, t: string) => ({ value: v, text: { type: "plain_text", text: t } });

  return await slackApi("views.open", {
    trigger_id: payload.trigger_id,
    view: {
      type: "modal",
      callback_id: "payment_link_submit",
      private_metadata: JSON.stringify({
        intent: intentId,
        channel: payload.channel?.id ?? payload.container?.channel_id ?? null,
        thread: payload.message?.thread_ts ?? payload.message?.ts ?? payload.container?.message_ts ?? null,
      }),
      title: { type: "plain_text", text: "Send payment link" },
      submit: { type: "plain_text", text: "Send to client" },
      close: { type: "plain_text", text: "Cancel" },
      blocks: [
        { type: "context", elements: [{ type: "mrkdwn",
          text: "The client gets a secure Stripe link on WhatsApp. Paying it confirms the booking." }] },
        { type: "input", block_id: "desc", label: { type: "plain_text", text: "What they are paying for" },
          element: { type: "plain_text_input", action_id: "v", initial_value: description || undefined,
            placeholder: { type: "plain_text", text: "Lamborghini Urus, Miami, 12 to 14 Dec" } } },
        { type: "input", block_id: "total", label: { type: "plain_text", text: "Total price for the client" },
          element: { type: "plain_text_input", action_id: "v",
            placeholder: { type: "plain_text", text: "2400" } } },
        { type: "input", block_id: "now", optional: true,
          label: { type: "plain_text", text: "Collect now (deposit)" },
          hint: { type: "plain_text", text: "Leave empty to charge the full total now." },
          element: { type: "plain_text_input", action_id: "v",
            placeholder: { type: "plain_text", text: "500" } } },
        { type: "input", block_id: "cur", label: { type: "plain_text", text: "Currency" },
          element: { type: "static_select", action_id: "v",
            initial_option: cur === "eur" ? opt("eur", "EUR €") : opt("usd", "USD $"),
            options: [opt("usd", "USD $"), opt("eur", "EUR €"), opt("gbp", "GBP £")] } },
      ],
    },
  });
}

async function submitPaymentLink(payload: any) {
  const v = payload.view?.state?.values ?? {};
  const meta = JSON.parse(payload.view?.private_metadata || "{}");
  const description = String(v.desc?.v?.value ?? "").trim();
  const total = parseMoney(v.total?.v?.value);
  const nowRaw = String(v.now?.v?.value ?? "").trim();
  const now = nowRaw ? parseMoney(nowRaw) : total;
  const currency = String(v.cur?.v?.selected_option?.value ?? "usd");
  const who = String(payload.user?.name || payload.user?.username || payload.user?.id || "a colleague");

  const errors: Record<string, string> = {};
  if (!description) errors.desc = "Say what the client is paying for.";
  if (!total) errors.total = "Enter the total, e.g. 2400.";
  if (nowRaw && !now) errors.now = "Enter an amount, e.g. 500, or leave it empty.";
  if (total && now && now > total) errors.now = "Can't be more than the total.";
  if (now && now < 100) errors.now = "At least 1.00.";
  if (Object.keys(errors).length) return { errors };

  return { work: async () => {
    const post = async (text: string) => {
      if (!meta.channel) return;
      await slackApi("chat.postMessage", { channel: meta.channel, text,
        ...(meta.thread ? { thread_ts: meta.thread } : {}), unfurl_links: false });
    };
    try {
      const secret = await setting("notifications_internal_secret", "NOTIFICATIONS_INTERNAL_SECRET");
      const res = await fetch(`${SUPABASE_URL}/functions/v1/payment-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-internal-secret": secret },
        body: JSON.stringify({ action: "create", intent_id: meta.intent, description,
          total_cents: total, amount_cents: now, currency, created_by: who }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out?.url) {
        await post(`:x: *Payment link not created:* ${String(out?.error ?? res.status).slice(0, 200)}`);
        return;
      }
      const amount = now! < total! ? `${money(now!, currency)} deposit on ${money(total!, currency)}` : money(now!, currency);
      const sent = out.whatsapp === "sent"
        ? "Sent to the client on WhatsApp."
        : out.whatsapp === "window_closed"
        ? "*Not sent:* the free WhatsApp window is closed. Send the reopen template from the card, then paste them this link."
        : "*Not sent:* WhatsApp refused it. Paste them this link yourself.";
      await post([
        `:credit_card: *Payment link created by ${who}* · ${amount}${out.livemode === false ? "  _(Stripe test mode)_" : ""}`,
        `${description}`,
        sent,
        `<${out.url}|Payment link> (valid 23 hours). The booking confirms itself when they pay, and you will see it here.`,
      ].join("\n"));
    } catch (e) {
      await post(`:x: *Payment link failed:* ${String((e as Error)?.message ?? e).slice(0, 200)}`);
    }
  } };
}

serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

    const signingSecret = await setting("slack_signing_secret", "SLACK_SIGNING_SECRET");
    if (!signingSecret) {
      console.warn("slack-interactions: SLACK_SIGNING_SECRET is not set, refusing everything.");
      return new Response("not configured", { status: 500 });
    }

    const raw = await req.text();
    const ts = req.headers.get("x-slack-request-timestamp") ?? "";
    const sig = req.headers.get("x-slack-signature") ?? "";
    if (!(await verify(raw, ts, sig, signingSecret))) {
      return new Response("bad signature", { status: 401 });
    }

    const payload = JSON.parse(new URLSearchParams(raw).get("payload") ?? "{}");

    // ---- payment link form submitted --------------------------------------
    if (payload.type === "view_submission" && payload.view?.callback_id === "payment_link_submit") {
      const r = await submitPaymentLink(payload);
      if ("errors" in r) return okJson({ response_action: "errors", errors: r.errors });
      // Slack wants an answer within 3 seconds; do the work after replying.
      // @ts-ignore EdgeRuntime is provided by Supabase.
      EdgeRuntime.waitUntil(r.work());
      return okJson({ response_action: "clear" });
    }

    if (payload.type !== "block_actions") return ok();

    const action = (payload.actions ?? [])[0] ?? {};
    const kind = String(action.action_id ?? "");
    const value = String(action.value ?? "");
    const responseUrl = String(payload.response_url ?? "");
    if (!value || !responseUrl) return ok();

    const who = String(
      payload.user?.name || payload.user?.username || payload.user?.id || "a colleague",
    );

    // ---- open the payment link form ---------------------------------------
    if (kind === "open_payment_link") {
      const r = await openPaymentModal(payload, value);
      if (!r?.ok) await inThread(responseUrl, `:x: Could not open the payment form (${r?.error ?? "unknown"}).`);
      return ok();
    }

    // ---- take over from Alfred, or hand it back ------------------------
    // These carry a PHONE, not an intent: taking over is about the person,
    // and a colleague may need to step in before any request exists.
    if (kind === "pause_ai" || kind === "resume_ai") {
      const phone = value.replace(/[^0-9]/g, "");
      const pausing = kind === "pause_ai";
      await supabase.from("concierge_ai_pause").upsert({
        phone, paused: pausing, paused_by: who,
        paused_at: new Date().toISOString(),
        resumed_at: pausing ? null : new Date().toISOString(),
      }, { onConflict: "phone" });

      await inThread(responseUrl, pausing
        ? `:no_entry: *${who} has taken over.* Alfred will not answer this client until someone hands it back. ` +
          `It still reads and files everything, so the cards here stay accurate.`
        : `:white_check_mark: *${who} handed this client back to Alfred.* It will answer again from the next message.`);
      return ok();
    }

    const intentId = value;
    const { data: it } = await supabase.from("concierge_intents")
      .select("id, phone, user_id, venue_text, restaurant_id, city, service_type, reservation_date, reservation_time, party_size, status, approved_at, approved_by, booking_id")
      .eq("id", intentId).maybeSingle();

    if (!it) {
      await replaceMessage(responseUrl, "Request not found", [{
        type: "section", text: { type: "mrkdwn",
          text: "⚠️ *This request no longer exists.* It was removed since the card was posted." },
      }]);
      return ok();
    }

    let venue = it.venue_text ?? "the venue";
    let venuePhone = "";
    if (it.restaurant_id) {
      const { data: v } = await supabase.from("restaurants")
        .select("name, phone_number").eq("id", it.restaurant_id).maybeSingle();
      venue = v?.name ?? venue;
      venuePhone = v?.phone_number ?? "";
    }

    let member = it.phone ? `+${it.phone}` : "the client";
    let firstName = "there";
    if (it.phone) {
      const { data: m } = await supabase.rpc("member_by_phone", { p_phone: it.phone });
      const row = Array.isArray(m) ? m[0] ?? null : m ?? null;
      if (row) {
        member = [row.first_name, row.last_name].filter(Boolean).join(" ") || member;
        firstName = row.first_name || firstName;
      }
    }

    const when = [it.reservation_date, hhmm(it.reservation_time),
                  it.party_size ? `${it.party_size} guests` : null].filter(Boolean).join("  ·  ");
    const line = `*${venue}*  ·  ${when}\nFor ${member}`;
    const footer = { type: "context", elements: [{ type: "mrkdwn",
      text: `<${ADMIN_INBOX}|Admin inbox>` }] };

    if (kind === "reopen_window") {
      const tplName = await setting("whatsapp_reopen_template");
      const tplLang = (await setting("whatsapp_reopen_template_lang")) || "en";
      const token = Deno.env.get("WHATSAPP_TOKEN") ?? "";
      const phoneId = await setting("whatsapp_phone_number_id", "WHATSAPP_PHONE_NUMBER_ID");

      if (!tplName || !token || !phoneId) {
        await inThread(responseUrl,
          ":warning: No reopen template is configured yet, so nothing was sent.");
        return ok();
      }

      const res = await fetch(`https://graph.facebook.com/${GRAPH}/${phoneId}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp", to: it.phone, type: "template",
          template: {
            name: tplName, language: { code: tplLang },
            components: [{ type: "body", parameters: [{ type: "text", text: firstName }] }],
          },
        }),
      });
      const out = await res.json().catch(() => ({}));

      await supabase.from("whatsapp_messages").insert({
        user_id: it.user_id ?? null, phone: it.phone, direction: "outbound",
        kind: "reopen_template", body: `template: ${tplName}`,
        wa_message_id: out?.messages?.[0]?.id ?? null,
        status: res.ok ? "sent" : "failed",
        error: res.ok ? null : JSON.stringify(out?.error ?? out).slice(0, 2000),
      });

      await inThread(responseUrl, res.ok
        ? `:envelope_with_arrow: ${who} sent the *${tplName}* template to ${member}.`
        : `:x: The template could not be sent: ${String(out?.error?.message ?? "unknown error").slice(0, 200)}`);
      return ok();
    }

    if (it.booking_id) {
      await replaceMessage(responseUrl, `${venue}: already booked`, [
        { type: "section", text: { type: "mrkdwn", text: `✅ *Already booked*\n${line}` } }, footer,
      ]);
      return ok();
    }
    if (it.approved_at) {
      await replaceMessage(responseUrl, `${venue}: already approved`, [
        { type: "section", text: { type: "mrkdwn",
          text: `⏳ *Already approved by ${it.approved_by ?? "a colleague"}*\n${line}` } }, footer,
      ]);
      return ok();
    }

    if (kind === "approve_booking") {
      const { data, error } = await supabase.rpc("approve_intent",
        { p_intent: intentId, p_by: who, p_note: "Approved from Slack" });
      const done = Array.isArray(data) ? data[0] : data;
      if (error || !done) {
        await replaceMessage(responseUrl, `${venue}: could not approve`, [
          { type: "section", text: { type: "mrkdwn",
            text: `🔴 *Could not approve*\n${line}\n_No longer in a state that can be approved._` } }, footer,
        ]);
        return ok();
      }
      await replaceMessage(responseUrl, `${venue}: approved by ${who}`, [
        { type: "section", text: { type: "mrkdwn", text: `🟢 *Approved by ${who}*\n${line}` } },
        { type: "context", elements: [{ type: "mrkdwn",
          text: "The booking runs automatically within two minutes and the result is posted here." }] },
        footer,
      ]);
      return ok();
    }

    if (kind === "decline_booking") {
      await supabase.from("concierge_intents")
        .update({ status: "needs_human",
                  human_reason: noDash(`Declined by ${who}, handle manually`) })
        .eq("id", intentId);
      await replaceMessage(responseUrl, `${venue}: left to a human`, [
        { type: "section", text: { type: "mrkdwn",
          text: `🔴 *${who} is handling this manually*\n${line}\n*Nothing will be booked automatically.*` +
                (venuePhone ? `\n*Do:* call ${venue} on ${venuePhone}.` : "") } }, footer,
      ]);
      return ok();
    }

    return ok();
  } catch (e) {
    console.error("slack-interactions fatal", String((e as Error)?.message ?? e));
    return ok();
  }
});
