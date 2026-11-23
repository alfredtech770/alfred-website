// send-email-reminders (v1)
//
// The morning of a reservation, email the guest a short reminder in the
// Alfred design (send-transactional-email, kind "reminder"). Runs daily from
// pg_cron next to send-whatsapp-reminders, which covers WhatsApp.
//
// Who: every confirmed booking for the day that has an email, either the
// guest_email captured by the concierge or the member's account email.
// Once per booking, enforced by public.email_log (primary key booking + kind),
// claimed BEFORE sending so a second run can never email twice.
//
// POST { date?: "YYYY-MM-DD" (default today UTC), dry_run?: boolean }
// Header: x-internal-secret.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const supa = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const KIND = "reminder";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

Deno.serve(async (req) => {
  const secret = await setting("notifications_internal_secret", "NOTIFICATIONS_INTERNAL_SECRET");
  if (!secret || req.headers.get("x-internal-secret") !== secret) return json({ error: "unauthorized" }, 401);

  const body = await req.json().catch(() => ({}));
  const day = /^\d{4}-\d{2}-\d{2}$/.test(String(body.date ?? "")) ? String(body.date) : new Date().toISOString().slice(0, 10);
  const dryRun = body.dry_run === true;

  const { data: bookings, error } = await supa.from("bookings")
    .select("id, user_id, guest_email, guest_name, restaurant_name")
    .eq("reservation_date", day).eq("status", "confirmed");
  if (error) return json({ error: "query_failed", detail: error.message }, 500);

  const results: Record<string, unknown>[] = [];
  for (const b of bookings ?? []) {
    let to = String(b.guest_email ?? "").trim().toLowerCase();
    let first = b.guest_name ? String(b.guest_name).split(" ")[0] : "";
    if (!EMAIL.test(to) && b.user_id) {
      const { data: u } = await supa.from("users").select("email, first_name").eq("id", b.user_id).maybeSingle();
      to = String(u?.email ?? "").trim().toLowerCase();
      first ||= u?.first_name ?? "";
    }
    if (!EMAIL.test(to)) { results.push({ booking: b.id, skipped: "no_email" }); continue; }

    if (dryRun) {
      const { data: done } = await supa.from("email_log").select("status").eq("booking_id", b.id).eq("kind", KIND).maybeSingle();
      results.push({ booking: b.id, venue: b.restaurant_name, to, would_send: !done, already: done?.status ?? null });
      continue;
    }

    // Claim first: if the row exists, someone already reminded this booking.
    const { error: claimErr } = await supa.from("email_log").insert({ booking_id: b.id, kind: KIND, recipient: to });
    if (claimErr) { results.push({ booking: b.id, skipped: "already_reminded" }); continue; }

    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-transactional-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-secret": secret },
      body: JSON.stringify({ kind: KIND, to, booking_id: b.id, first_name: first || undefined }),
    }).catch(() => null);
    const out = res ? await res.json().catch(() => ({})) : {};
    const ok = !!(out as any)?.sent;
    await supa.from("email_log").update({
      status: ok ? "sent" : "failed",
      detail: ok ? (out as any)?.resend?.id ?? null : JSON.stringify(out).slice(0, 500),
    }).eq("booking_id", b.id).eq("kind", KIND);
    results.push({ booking: b.id, to, ok });
  }

  const sent = results.filter((r) => r.ok).length;
  return json({ date: day, dry_run: dryRun, total: (bookings ?? []).length, sent, results });
});
