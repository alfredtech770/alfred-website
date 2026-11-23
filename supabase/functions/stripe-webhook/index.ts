// stripe-webhook (v20)
//
// Stripe → Supabase webhook receiver. Signature-verified.
// Updates public.payments + public.bookings on payment_intent events,
// and pings Slack when a new VIP auth lands or a card is captured /
// canceled / refunded so Alfred sees it in the admin feed.
//
// v20: "pay to confirm" (payment-link). When a payment intent carrying
// metadata.kind = "pay_to_confirm" succeeds, the booking is created here,
// already confirmed and paid, linked to the WhatsApp request, and the team
// is told in the client's Slack thread. Idempotent on the payment intent id.
// These intents skip the VIP-specific handling below.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.0.0";
import { createClient } from "jsr:@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SLACK_WEBHOOK_URL = Deno.env.get("SLACK_WEBHOOK_URL");
const SLACK_BOT_TOKEN = Deno.env.get("SLACK_BOT_TOKEN");
const GRAPH = "v21.0";

function text(body: string, status = 200) {
  return new Response(body, { status, headers: { "Content-Type": "text/plain" } });
}

function money(cents: number, currency = "usd"): string {
  const sym = ({ usd: "$", eur: "€", gbp: "£" } as Record<string, string>)[currency.toLowerCase()] ?? currency.toUpperCase() + " ";
  return `${sym}${(cents / 100).toFixed(2)}`;
}

async function pingSlack(text: string, blocks?: unknown[]) {
  if (!SLACK_WEBHOOK_URL) return;
  try {
    await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blocks ? { text, blocks } : { text }),
    });
  } catch (e) {
    console.error("Slack ping failed:", e);
  }
}

const SERVICE_LABEL: Record<string, string> = {
  cars: "Cars", yachts: "Yachts", hotels: "Accommodations", accommodations: "Accommodations",
  wellness: "Wellness", nightlife: "Nightlife", dining: "Dining", jets: "Jets",
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method !== "POST") return text("Method not allowed", 405);
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return text("Stripe webhook not configured (set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET)", 503);
  }

  const sig = req.headers.get("stripe-signature") ?? "";
  const raw = await req.text();
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-09-30.acacia" });
  const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Bad webhook signature:", err);
    return text(`Webhook signature verification failed: ${(err as Error).message}`, 400);
  }

  // ---- pay to confirm ------------------------------------------------------
  async function confirmPaidRequest(intent: Stripe.PaymentIntent) {
    const m = (intent.metadata ?? {}) as Record<string, string>;

    // Idempotent: Stripe retries, and events can arrive twice.
    const { data: existing } = await supa.from("bookings")
      .select("id").eq("payment_intent_id", intent.id).maybeSingle();
    if (existing) return;

    const totalCents = Number(m.total_cents || intent.amount);
    const paidCents = intent.amount_received || intent.amount;
    const userId = UUID.test(m.user_id ?? "") ? m.user_id : null;
    const service = SERVICE_LABEL[(m.service_type ?? "").toLowerCase()] ?? (m.service_type || "Cars");
    const startDate = /^\d{4}-\d{2}-\d{2}$/.test(m.start_date ?? "") ? m.start_date : new Date().toISOString().slice(0, 10);
    const endDate = /^\d{4}-\d{2}-\d{2}$/.test(m.end_date ?? "") ? m.end_date : null;
    const balance = Math.max(0, totalCents - paidCents);

    const { data: booking, error } = await supa.from("bookings").insert({
      user_id: userId,
      restaurant_name: m.description || "Alfred booking",
      party_size: 1,
      reservation_date: startDate,
      end_date: endDate,
      city: m.city || null,
      service_type: service,
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      requires_payment: true,
      payment_status: "paid",
      payment_intent_id: intent.id,
      stripe_payment_intent_id: intent.id,
      deposit_amount_cents: paidCents,
      deposit_payment_intent_id: intent.id,
      balance_amount_cents: balance || null,
      balance_status: balance ? "due" : null,
      gross_amount: totalCents / 100,
      guest_phone: m.phone || null,
      notes: `Paid through a pay-to-confirm link sent by ${m.created_by || "the team"}.`,
    }).select("id").single();
    if (error || !booking) {
      console.error("pay_to_confirm: booking insert failed", error);
      await pingSlack(`🔴 *Payment received but the booking could not be saved* — ${money(paidCents, intent.currency)} for ${m.description}. Stripe: https://dashboard.stripe.com/payments/${intent.id}`);
      return;
    }

    if (userId) {
      await supa.from("payments").insert({
        user_id: userId, booking_id: booking.id, stripe_payment_intent_id: intent.id,
        stripe_customer_id: typeof intent.customer === "string" ? intent.customer : intent.customer?.id ?? null,
        stripe_payment_method_id: typeof intent.payment_method === "string" ? intent.payment_method : null,
        amount_cents: paidCents, currency: intent.currency, status: intent.status,
        manual_capture: false, metadata: m,
      });
    }

    let slackChannel: string | null = null;
    let slackThread: string | null = null;
    if (m.intent_id) {
      const { data: it } = await supa.from("concierge_intents")
        .update({ booking_id: booking.id }).eq("id", m.intent_id)
        .select("slack_channel, slack_thread_ts").maybeSingle();
      slackChannel = it?.slack_channel ?? null;
      slackThread = it?.slack_thread_ts ?? null;
    }

    // Members get the booking_confirmation template from the bookings
    // trigger. Everyone else hears it here, in the chat they paid from.
    let told = userId ? "template (member)" : "not sent";
    if (!userId && m.phone) {
      const token = Deno.env.get("WHATSAPP_TOKEN") ?? "";
      const phoneId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") ?? "";
      if (token && phoneId) {
        const msg = `Payment received, thank you. Your ${m.description} is confirmed` +
          (balance ? `. The balance of ${money(balance, intent.currency)} is due at handover.` : ".") +
          ` We will be in touch with the final details.`;
        const res = await fetch(`https://graph.facebook.com/${GRAPH}/${phoneId}/messages`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ messaging_product: "whatsapp", to: m.phone, type: "text", text: { body: msg } }),
        }).catch(() => null);
        const out = res ? await res.json().catch(() => ({})) : {};
        told = res?.ok ? "sent on WhatsApp" : "WhatsApp refused it, tell them yourself";
        await supa.from("whatsapp_messages").insert({
          user_id: null, booking_id: booking.id, phone: m.phone, direction: "outbound",
          kind: "payment_confirmation", body: msg, wa_message_id: (out as any)?.messages?.[0]?.id ?? null,
          status: res?.ok ? "sent" : "failed",
          error: res?.ok ? null : JSON.stringify((out as any)?.error ?? out).slice(0, 2000),
        });
      }
    }

    const lines = [
      `💰 *Paid: ${money(paidCents, intent.currency)}*${balance ? ` (deposit, ${money(balance, intent.currency)} due at handover)` : " (in full)"}`,
      `${m.description}${m.start_date ? `  ·  ${m.start_date}${m.end_date ? ` to ${m.end_date}` : ""}` : ""}`,
      `Booking confirmed. Client: ${told}.`,
      `*Do:* confirm with the partner and settle their share. <https://dashboard.stripe.com/payments/${intent.id}|Stripe>`,
    ];
    let posted = false;
    if (SLACK_BOT_TOKEN && slackChannel) {
      const r = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}`, "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ channel: slackChannel, text: lines[0], ...(slackThread ? { thread_ts: slackThread } : {}),
          blocks: [{ type: "section", text: { type: "mrkdwn", text: lines.join("\n") } }] }),
      }).then((x) => x.json()).catch(() => ({ ok: false }));
      posted = !!r?.ok;
    }
    if (!posted) await pingSlack(lines.join("\n"));
  }

  // Helper: write status + card metadata back to payments + bookings, and
  // optionally Slack-ping the team.
  async function applyIntent(intent: Stripe.PaymentIntent, kind?: "authorized" | "captured" | "failed" | "canceled") {
    if ((intent.metadata as any)?.kind === "pay_to_confirm") {
      if (kind === "captured" || intent.status === "succeeded") await confirmPaidRequest(intent);
      return;
    }

    let cardBrand: string | null = null;
    let cardLast4: string | null = null;
    let paymentMethodId: string | null = null;

    const pm = intent.payment_method;
    if (pm && typeof pm !== "string") {
      paymentMethodId = pm.id;
      const card = (pm as any).card;
      if (card) { cardBrand = card.brand ?? null; cardLast4 = card.last4 ?? null; }
    } else if (typeof pm === "string") {
      paymentMethodId = pm;
      try {
        const expanded = await stripe.paymentMethods.retrieve(pm);
        cardBrand = expanded.card?.brand ?? null;
        cardLast4 = expanded.card?.last4 ?? null;
      } catch { /* ignore */ }
    }

    const update: Record<string, unknown> = {
      status: intent.status,
      stripe_payment_method_id: paymentMethodId,
    };
    if (cardBrand) update.card_brand = cardBrand;
    if (cardLast4) update.card_last4 = cardLast4;

    await supa.from("payments")
      .update(update)
      .eq("stripe_payment_intent_id", intent.id);

    const bookingId = (intent.metadata as any)?.booking_id as string | undefined;
    if (bookingId) {
      const next: Record<string, unknown> = { payment_status: intent.status };
      if (intent.status === "requires_capture" || intent.status === "succeeded") {
        // Auth held / captured — Alfred can confirm with the venue.
        next.status = "pending";
      }
      if (intent.status === "canceled" || intent.status === "requires_payment_method") {
        next.status = "declined";
      }
      await supa.from("bookings").update(next).eq("id", bookingId);
    }

    // Slack-ping for noteworthy state transitions.
    if (kind && SLACK_WEBHOOK_URL) {
      const meta = intent.metadata as Record<string, string> | null;
      const restaurant = meta?.restaurant_name || "(unknown venue)";
      const partySize = meta?.party_size || "?";
      const amount = money(intent.amount, intent.currency);
      const userId = meta?.supabase_user_id || "(no user)";
      const card = cardBrand && cardLast4 ? `${cardBrand} · •••• ${cardLast4}` : "(card unknown)";
      const titles: Record<string, string> = {
        authorized: "🟡 *VIP auth held* — awaiting venue confirmation",
        captured: "🟢 *VIP card captured*",
        failed: "🔴 *VIP payment failed*",
        canceled: "⚪️ *VIP auth canceled* — customer not charged",
      };
      const title = titles[kind] ?? `VIP · ${kind}`;
      const lines = [
        title,
        `• *Restaurant:* ${restaurant}`,
        `• *Amount:* ${amount}`,
        `• *Party:* ${partySize}`,
        `• *Card:* ${card}`,
        `• *Booking:* ${bookingId ?? "(none)"}`,
        `• *Stripe:* https://dashboard.stripe.com/payments/${intent.id}`,
        `• *User:* ${userId}`,
      ];
      await pingSlack(lines.join("\n"));
    }
  }

  switch (event.type) {
    case "payment_intent.amount_capturable_updated": {
      // Manual-capture intents reach this state when the auth succeeds.
      // This is the headline event for Alfred: card is held, ready to capture.
      await applyIntent(event.data.object as Stripe.PaymentIntent, "authorized");
      break;
    }
    case "payment_intent.succeeded": {
      await applyIntent(event.data.object as Stripe.PaymentIntent, "captured");
      break;
    }
    case "payment_intent.payment_failed": {
      await applyIntent(event.data.object as Stripe.PaymentIntent, "failed");
      break;
    }
    case "payment_intent.canceled": {
      await applyIntent(event.data.object as Stripe.PaymentIntent, "canceled");
      break;
    }
    case "payment_intent.processing":
    case "payment_intent.requires_action":
    case "payment_intent.created": {
      await applyIntent(event.data.object as Stripe.PaymentIntent);
      break;
    }
    case "checkout.session.completed": {
      // Belt and braces: if this event is subscribed, confirm from here too
      // (idempotent with payment_intent.succeeded).
      const s = event.data.object as Stripe.Checkout.Session;
      if ((s.metadata as any)?.kind === "pay_to_confirm" && s.payment_status === "paid" && s.payment_intent) {
        const pi = await stripe.paymentIntents.retrieve(String(s.payment_intent));
        await confirmPaidRequest(pi);
      }
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      if (charge.payment_intent) {
        await supa.from("payments")
          .update({ status: "refunded" })
          .eq("stripe_payment_intent_id", charge.payment_intent as string);
        await supa.from("bookings")
          .update({ payment_status: "refunded" })
          .eq("payment_intent_id", charge.payment_intent as string);
        await pingSlack(`🔵 *Refund issued* — ${money(charge.amount_refunded, charge.currency)} on ${charge.payment_intent}`);
      }
      break;
    }
    default:
      break;
  }

  return text("ok");
});
