// payment-link (v1)
//
// "Pay to confirm" for rentals and other priced requests. A colleague agrees
// a price with the partner, then sends the client a Stripe Checkout link on
// WhatsApp. Paying it is what confirms the booking: stripe-webhook creates the
// booking on payment_intent.succeeded (kind = "pay_to_confirm"). Nothing is
// written to bookings until money has actually arrived, so abandoned links
// leave no half-made bookings behind.
//
// Called by slack-interactions (and later the admin) with the internal secret.
//
// POST { action: "create", intent_id, description, total_cents, amount_cents,
//        currency, created_by, send_whatsapp?: boolean }
//   -> { ok, url, session_id, expires_at, whatsapp: "sent" | "window_closed" | "failed" | "skipped" }
// POST { action: "expire", session_id }  -> { ok, status }
//
// Secrets: STRIPE_SECRET_KEY, WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID,
//          NOTIFICATIONS_INTERNAL_SECRET (env or app_settings).

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.0.0";
import { createClient } from "jsr:@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const supa = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const GRAPH = "v21.0";
const WA_WINDOW_MS = 24 * 60 * 60 * 1000;
const SITE = "https://alfredconcierge.app";

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

function money(cents: number, currency: string): string {
  const sym = ({ usd: "$", eur: "€", gbp: "£" } as Record<string, string>)[currency] ?? currency.toUpperCase() + " ";
  const v = cents / 100;
  return sym + (Number.isInteger(v) ? v.toLocaleString("en-US") : v.toFixed(2));
}

async function windowOpen(phone: string): Promise<boolean> {
  const { data } = await supa.from("whatsapp_messages")
    .select("created_at").eq("phone", phone).eq("direction", "inbound")
    .order("created_at", { ascending: false }).limit(1).maybeSingle();
  return !!data?.created_at && Date.now() - new Date(data.created_at).getTime() <= WA_WINDOW_MS;
}

async function sendText(phone: string, text: string, userId: string | null): Promise<"sent" | "failed"> {
  const token = Deno.env.get("WHATSAPP_TOKEN") ?? "";
  const phoneId = await setting("whatsapp_phone_number_id", "WHATSAPP_PHONE_NUMBER_ID");
  if (!token || !phoneId) return "failed";
  const res = await fetch(`https://graph.facebook.com/${GRAPH}/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: phone, type: "text",
      text: { body: text, preview_url: true } }),
  });
  const out = await res.json().catch(() => ({}));
  await supa.from("whatsapp_messages").insert({
    user_id: userId, phone, direction: "outbound", kind: "payment_link", body: text,
    wa_message_id: out?.messages?.[0]?.id ?? null,
    status: res.ok ? "sent" : "failed",
    error: res.ok ? null : JSON.stringify(out?.error ?? out).slice(0, 2000),
  });
  return res.ok ? "sent" : "failed";
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  // Internal callers only (slack-interactions, admin backend). Never public.
  const secret = await setting("notifications_internal_secret", "NOTIFICATIONS_INTERNAL_SECRET");
  if (!secret || req.headers.get("x-internal-secret") !== secret) return json({ error: "unauthorized" }, 401);
  if (!STRIPE_SECRET_KEY) return json({ error: "Stripe not configured" }, 503);

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-09-30.acacia" });
  const body = await req.json().catch(() => ({}));

  if (body.action === "expire") {
    const id = String(body.session_id ?? "");
    if (!id.startsWith("cs_")) return json({ error: "session_id required" }, 400);
    const s = await stripe.checkout.sessions.expire(id).catch((e) => ({ status: `error: ${e.message}` }));
    return json({ ok: true, status: (s as any).status });
  }

  if (body.action !== "create") return json({ error: "unknown action" }, 400);

  const intentId = String(body.intent_id ?? "");
  const description = String(body.description ?? "").trim().slice(0, 200);
  const totalCents = Math.round(Number(body.total_cents));
  const amountCents = Math.round(Number(body.amount_cents));
  const currency = String(body.currency ?? "usd").toLowerCase();
  const createdBy = String(body.created_by ?? "a colleague").slice(0, 80);

  if (!intentId) return json({ error: "intent_id required" }, 400);
  if (!description) return json({ error: "description required" }, 400);
  if (!["usd", "eur", "gbp"].includes(currency)) return json({ error: "currency must be usd, eur or gbp" }, 400);
  if (!Number.isFinite(amountCents) || amountCents < 100) return json({ error: "amount must be at least 1.00" }, 400);
  if (!Number.isFinite(totalCents) || totalCents < amountCents) return json({ error: "total must be at least the amount charged now" }, 400);

  const { data: it } = await supa.from("concierge_intents")
    .select("id, phone, user_id, city, service_type, venue_text, reservation_date, details")
    .eq("id", intentId).maybeSingle();
  if (!it) return json({ error: "request not found" }, 404);
  if (!it.phone) return json({ error: "request has no phone number" }, 400);

  const d = (it.details ?? {}) as Record<string, unknown>;
  const startDate = String(d.check_in ?? it.reservation_date ?? "");
  const endDate = String(d.check_out ?? "");
  const isDeposit = amountCents < totalCents;

  const meta: Record<string, string> = {
    kind: "pay_to_confirm",
    intent_id: intentId,
    phone: String(it.phone),
    user_id: String(it.user_id ?? ""),
    service_type: String(it.service_type ?? ""),
    city: String(it.city ?? ""),
    description,
    start_date: startDate,
    end_date: endDate,
    total_cents: String(totalCents),
    amount_cents: String(amountCents),
    currency,
    created_by: createdBy,
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{
      quantity: 1,
      price_data: {
        currency,
        unit_amount: amountCents,
        product_data: {
          name: isDeposit ? `Deposit: ${description}` : description,
          description: isDeposit
            ? `Deposit of ${money(amountCents, currency)} on a total of ${money(totalCents, currency)}. Balance due at handover.`
            : `Paid in full through Alfred Concierge.`,
        },
      },
    }],
    customer_creation: "always",
    // Keep the card on file so the balance can be charged at handover
    // (charge-rental-balance). Stripe shows the client the saving notice.
    payment_intent_data: { metadata: meta, setup_future_usage: "off_session",
      description: `Alfred · ${description}` },
    metadata: meta,
    expires_at: Math.floor(Date.now() / 1000) + 23 * 3600,
    success_url: `${SITE}/?payment=success`,
    cancel_url: `${SITE}/?payment=cancelled`,
  });

  // Remember the open link on the request, so the team can see it.
  await supa.from("concierge_intents").update({
    details: { ...d, payment_link: { session_id: session.id, url: session.url,
      amount_cents: amountCents, total_cents: totalCents, currency,
      created_by: createdBy, created_at: new Date().toISOString() } },
  }).eq("id", intentId);

  let whatsapp: "sent" | "window_closed" | "failed" | "skipped" = "skipped";
  if (body.send_whatsapp !== false) {
    if (!(await windowOpen(String(it.phone)))) {
      whatsapp = "window_closed";
    } else {
      const lines = [
        `Here is your secure payment link for ${description}:`,
        isDeposit
          ? `Deposit: ${money(amountCents, currency)} (total ${money(totalCents, currency)}, balance at handover).`
          : `Total: ${money(amountCents, currency)}.`,
        session.url!,
        `Your booking is confirmed as soon as payment goes through. The link is valid for 23 hours.`,
      ];
      whatsapp = await sendText(String(it.phone), lines.join("\n\n"), it.user_id ?? null);
    }
  }

  return json({ ok: true, url: session.url, session_id: session.id,
    expires_at: session.expires_at, whatsapp, livemode: session.livemode });
});
