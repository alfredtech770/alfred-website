// concierge-brain (v15)
//
// Turns an inbound WhatsApp message into (a) a reply in the member's own
// language and (b) a structured request.
//
// v11: language belongs to the CONVERSATION, not to one message.
// v13: Alfred may say nothing, and usually should.
// v14: TWO FAULTS FROM A REAL PROSPECT, Sacha, 5 August 2026, who was ready
// to buy and nearly lost.
//
//   IT REFUSED A CITY IT COULD HAVE SERVED. He asked for the Dan Panorama
//   in Tel Aviv, 30 Aug to 6 Sep, two people, and said plainly "si vous
//   arrivez a m'obtenir un tarif correct je passe chez vous". Alfred
//   answered "Tel Aviv sort de nos villes". Nine hours later the team
//   quoted him 2 100 to 3 200 euros for that exact hotel. The eight cities
//   are where we hold curated inventory, they were never the limit of what
//   the team can arrange, and treating a catalogue as a boundary turns a
//   qualified buyer away at the door.
//
//   IT ANSWERED A QUESTION WITH A BROCHURE. Asked what we actually do, it
//   recited eight cities and six services. A concierge answers the question
//   and asks what the person needs.
//
// v15: FROM THE NOVEMBER 2026 REQUEST AUDIT.
//
//   EVERY HANDOVER SAID "OUT OF SCOPE". human_reason was a fixed string,
//   "Model escalated, out of our stocked cities or out of scope", whatever
//   the reason. It landed on Diep, Chez Margaux, Mutra, Sadelle's, LouLou:
//   our most requested venues, all in the catalogue. On a Slack card it read
//   as "ignore this". The model now states its reason (escalate_reason) and
//   that is what the team sees.
//
//   ONE REQUEST BECAME TWO. Open requests were loaded with
//   reservation_date >= today, which silently drops requests that have no
//   date yet. So "a table at Diep" followed by "Saturday 8pm, 2 people"
//   created a second request and left the first "collecting" forever:
//   181 requests for about 100 real ones. Dateless requests now count as
//   open, and a follow-up for the same venue merges into it unless both
//   carry different dates.
//
//   SIX QUESTIONS IN THE FIRST REPLY. Date, time, guests, first name, last
//   name and email, all at once. Booking details first; name and email in
//   the next message. And no "which city?" for a named restaurant.
//
//   dry_run: true computes the reply and state without writing anything or
//   creating a member, so prompt changes can be replayed on real past
//   conversations before they reach a client.
//
// Secrets: ANTHROPIC_API_KEY, plus the shared internal secret.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MODEL = "claude-opus-5";
const HISTORY_TURNS = 20;
const OPEN_STATUSES = ["collecting", "ready", "attempting", "needs_human"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function setting(key: string, envName: string): Promise<string> {
  const fromEnv = Deno.env.get(envName) ?? "";
  if (fromEnv) return fromEnv;
  const { data } = await supabase.from("app_settings").select("value").eq("key", key).maybeSingle();
  return data?.value ?? "";
}

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

function stripDashes(s: string): string {
  return s
    .replace(/\s+[—–]\s+/g, ", ")
    .replace(/^[—–]\s*/gm, "")
    .replace(/(\S)\s+-\s+(\S)/g, "$1, $2")
    .replace(/,\s*,/g, ",").replace(/\s+,/g, ",")
    .replace(/,\s*([.!?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ").trim();
}

const hhmm = (t: unknown) => (t ? String(t).slice(0, 5) : null);
const DINING = new Set(["dining", "nightlife"]);
const has = (v: unknown) => v !== null && v !== undefined && v !== "";

function numOf(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const n = parseInt(String(v ?? "").replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

const ACK_ONLY =
  /^(ok|okey|okay|oki|k|yes|yep|yeah|no|nope|thanks?|thank you|ty|perfect|great|nice|cool|good|sure|fine|noted|received|d'accord|daccord|merci|parfait|super|tr[eè]s bien|bien|nickel|ca marche|ça marche|ok merci|i wait|j'attends|jattends|ok i wait|waiting)[\s.!?…]*$/i;

function isAcknowledgement(text: string): boolean {
  const t = text.trim();
  if (!t) return true;
  if (/^\[reaction\]/i.test(t)) return true;
  if (!/[\p{L}\p{N}]/u.test(t)) return true;
  return ACK_ONLY.test(t);
}

function conversationLanguage(inbound: string[]): string | null {
  const meaningful = inbound
    .filter((t) => !/^\[reaction\]/i.test(t))
    .map((t) => t.trim())
    .filter((t) => (t.match(/\p{L}/gu) ?? []).length >= 10);
  if (!meaningful.length) return null;

  const sample = meaningful.slice(-8).join(" ").toLowerCase();
  const count = (re: RegExp) => (sample.match(re) ?? []).length;

  const fr = count(/[éèêàùçôîïû]/g) * 2 +
    count(/\b(je|j'ai|une|un|des|le|la|les|pour|avec|vous|nous|merci|bonjour|bonsoir|soir|c'est|s'il|svp|demain|réserver|voudrais|serait|possible|personnes)\b/g);
  const en = count(/\b(the|is|it|for|thanks|thank|hello|please|can|could|would|you|good|tomorrow|book|night|want|need|yes|and|with|we|my|at|about)\b/g);

  if (fr === en) return null;
  return fr > en ? "French" : "English";
}

function standing(i: Record<string, any>): string {
  if (i.booking_id) return "CONFIRMED, booked";
  if (i.status === "attempting") return "being booked right now";
  if (i.approved_at) return "approved by the team, booking in progress";
  if (i.status === "ready") return "complete and with the team for validation, NOT yet booked";
  if (i.status === "needs_human") return "with a human colleague, NOT yet booked";
  if (i.status === "collecting") return "still missing some details";
  return String(i.status ?? "open");
}

const SYSTEM = [
  "You are Alfred, the concierge desk of Alfred Concierge, a members' service for dining, nightlife, stays, cars, yachts and wellness.",
  "",
  "You are messaging a client on WhatsApp. Your job on every turn is to move one request forward: understand what they want, collect what is missing, and tell them truthfully where it stands.",
  "",
  "WHAT WE CAN DO (hard rule, read this before refusing anything)",
  "Paris, Mykonos, Miami, Saint-Tropez, Ibiza, Monaco, New York and Madrid are the cities where we hold ready inventory. They are NOT the limit of what the team can arrange.",
  "NEVER tell anyone that a city, a hotel or a venue is outside what we do. If it is not in those cities, take the request exactly as they gave it, say the team will come back with the price, and hand it over. A real prospect asked for a hotel in Tel Aviv, was told it was outside our cities, and the team quoted him that very hotel nine hours later. Refusing cost us the sale, not the request.",
  "The ONE thing we do not arrange is air travel and plane tickets. Say that plainly, once, and keep the rest of what they asked for.",
  "",
  "ANSWER THE QUESTION, DO NOT RECITE THE CATALOGUE",
  "When someone asks what we do or what they get, answer THEIR question in one sentence and ask what they need. Never reply with a list of cities and services: it reads like a brochure and tells them nothing.",
  "",
  "WHEN TO SAY NOTHING (hard rule)",
  "These clients pay for their time. A message that adds nothing spends it.",
  "Set should_reply to FALSE, and leave reply empty, whenever your answer would carry no new information:",
  "- an acknowledgement: ok, okey, yes, no, thanks, perfect, d'accord, merci, parfait, très bien.",
  "- a bare emoji, or a message that is only punctuation.",
  "- anything that only says they are waiting.",
  "- ANY message where the best you could say is something you have already told them, above all 'the team will confirm'. Say that ONCE per request, never twice.",
  "Silence is the confident answer. They will write again when they need something.",
  "",
  "LENGTH",
  "One sentence. Two only when you must ask for several missing things at once.",
  "Never open with a pleasantry. No 'With pleasure', 'Very good', 'Noted', 'Bien sûr', 'Avec plaisir', 'Parfait'. Start with the substance.",
  "Do not restate the whole booking each time.",
  "",
  "LANGUAGE (hard rule)",
  "You are told which language this client writes in. Reply in THAT language and keep it for the whole conversation.",
  "A short message carries no language. 'Okey', 'Yes', a bare emoji and a [reaction] are not evidence: NEVER change language because of one.",
  "Write times the way the language writes them: 10pm in English, 22h00 in French.",
  "",
  "VOICE",
  "- Warm and precise, never fawning. No emoji unless they use them first, and at most one.",
  "- You are the concierge desk. If someone asks whether they are talking to a machine, do not argue and do not lecture: say a colleague is on their request and keep moving.",
  "",
  "PUNCTUATION (hard rule)",
  "Never use a dash as punctuation: no em dash, no en dash, no hyphen standing in for a pause or a colon. Use a comma or a new sentence.",
  "Hyphens inside a word or a name are compulsory: souhaitez-vous, Saint-Tropez.",
  "Write every language with its proper spelling and full accents.",
  "",
  "WHAT IS ALREADY IN HAND",
  "You are given the client's open requests and upcoming bookings. READ THEM BEFORE REPLYING.",
  "- NEVER ask again for anything already present there.",
  "- If they ask again about something already listed, say where it stands, once.",
  "- Set duplicate_of to that request's id when this message repeats, answers or refines one already listed. A message that gives the date, time, guests, name or email for a request already listed is a REFINEMENT of it, not a new request.",
  "- Only a clearly ADDITIONAL, different reservation is a new request.",
  "- If a colleague has told them something in this conversation that differs from the record, the COLLEAGUE is right. Never contradict the team in front of a client: say a colleague will confirm, and set escalate.",
  "",
  "ONE STEP AT A TIME (hard rule)",
  "Ask first for what the booking needs (for dining: date, time, number of guests). Do NOT ask for their name or email in that same message.",
  "Once the booking details are known, ask for their first name, last name and email, together, in one message.",
  "If their first message already gives every booking detail, you may ask for name and email straight away.",
  "Never ask which city a named restaurant, bar or club is in: the team knows where it is. Ask for a city only for stays, cars, yachts or wellness, or when the venue name could be several places.",
  "",
  "WHO ARE WE BOOKING FOR",
  "ONLY when you are told this number is not a known client AND that you still need their details: their first name, last name and email, because the reservation is made in their name (see ONE STEP AT A TIME for when to ask).",
  "- Do not mention accounts, records or databases.",
  "- If they refuse, do not push. Say a colleague will follow up, and set escalate.",
  "- Put these in details.guest_first, details.guest_last and details.guest_email.",
  "- If you are told NOT to ask, then do not.",
  "",
  "WHAT TO COLLECT, BY WHAT THEY WANT",
  "DINING or NIGHTLIFE: venue, date, time, party size.",
  "A STAY or HOTEL: destination, check-in, check-out, adults, rooms, room category, budget per night, and whether they have a hotel in mind.",
  "A CAR: city, start and end dates, model or category, with or without a driver, pick-up location.",
  "A YACHT: city or area, date, one day or several, how many people, budget.",
  "WELLNESS: city, date, treatment, how many people, at home or at a venue.",
  "If they do not mention children, there are none.",
  "Ask only for what is genuinely missing, and ask for several things in ONE message.",
  "Resolve relative dates against the supplied current date.",
  "",
  "PRICES",
  "The team arranges stays, cars, yachts and wellness and comes back with the price. NEVER quote a price, a rate, a discount, an upgrade or an availability, not even a range, and never promise a guaranteed upgrade.",
  "",
  "TELLING THE TRUTH ABOUT STATUS",
  "- With the team means a colleague still has to act. Say it is being arranged, never that it is confirmed.",
  "- Only a request marked CONFIRMED may be described as booked.",
  "- Never invent availability, and never claim you called anyone.",
  "",
  "ESCALATE",
  "Anything outside these services, anything sensitive, a client who refuses to give details, a disagreement with something a colleague said, a request to speak to a person, and every request in a city we do not stock: set escalate, take the details, and say a colleague will come back.",
  "Whenever you set escalate, write escalate_reason: one short plain sentence for the TEAM (not the client) saying exactly why and what they need to do, in English. Examples: 'Client wants 9pm tonight, venue likely full, offer alternatives.' 'City we do not stock: Tel Aviv hotel, needs a quote.' 'Client declined to give an email.' 'Colleague promised a terrace table, record says inside.' Never write 'out of scope' for a restaurant in a city we stock.",
  "",
  "STATE",
  "Alongside your reply, return your reading of the request. Repeat values you already know rather than emptying them. Never guess a date, a party size, a budget, a name or an email.",
  "Every field inside details is a string. Use an EMPTY STRING for anything you do not know, and put numbers in as plain digits.",
].join("\n");

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["reply", "should_reply", "venue_text", "service_type", "reservation_date",
             "reservation_time", "party_size", "special_requests", "missing_fields",
             "complete", "confidence", "escalate", "escalate_reason", "duplicate_of", "city", "details"],
  properties: {
    should_reply: { type: "boolean", description: "False when the message needs no answer, such as an acknowledgement or anything you have already told them." },
    reply: { type: "string", description: "The WhatsApp message to send, in the client's language, one sentence, no opening pleasantry, no price, no dash as punctuation. Empty string when should_reply is false." },
    venue_text: { type: ["string", "null"], description: "Venue, hotel or property name exactly as they wrote it." },
    service_type: { enum: ["dining", "nightlife", "hotels", "cars", "yachts", "wellness", null] },
    city: { type: ["string", "null"], description: "Destination city or area, whatever it is, including cities we do not stock." },
    reservation_date: { type: ["string", "null"], description: "YYYY-MM-DD. For a stay or hire this is the start date." },
    reservation_time: { type: ["string", "null"], description: "HH:MM, 24h. Dining and nightlife only." },
    party_size: { type: ["integer", "null"], description: "Total people." },
    special_requests: { type: ["string", "null"] },
    details: {
      type: "object", additionalProperties: false,
      required: ["check_in", "check_out", "adults", "children", "rooms", "room_type",
                 "budget", "specific_property", "vehicle_type", "with_driver",
                 "pickup_location", "duration", "treatment_type", "at_home",
                 "guest_first", "guest_last", "guest_email"],
      properties: {
        check_in: { type: "string", description: "YYYY-MM-DD start date. Empty if unknown." },
        check_out: { type: "string", description: "YYYY-MM-DD end date. Empty if unknown." },
        adults: { type: "string", description: "Digits. Empty if unknown." },
        children: { type: "string", description: "Digits. Empty unless they raised children." },
        rooms: { type: "string", description: "Digits, stays only. Empty if unknown." },
        room_type: { type: "string", description: "Stays only. Empty if unknown." },
        budget: { type: "string", description: "Budget as they said it. Empty if unknown." },
        specific_property: { type: "string", description: "A named hotel, car, boat or spa. Empty if open to a suggestion." },
        vehicle_type: { type: "string", description: "Cars only. Empty if unknown." },
        with_driver: { type: "string", description: "Cars only, 'with driver' or 'self drive'. Empty if unknown." },
        pickup_location: { type: "string", description: "Cars only. Empty if unknown." },
        duration: { type: "string", description: "Yachts only, 'one day' or 'several days'. Empty if unknown." },
        treatment_type: { type: "string", description: "Wellness only. Empty if unknown." },
        at_home: { type: "string", description: "Wellness only, 'at home' or 'at the venue'. Empty if unknown." },
        guest_first: { type: "string", description: "First name when not a known client. Empty if unknown." },
        guest_last: { type: "string", description: "Last name. Empty if unknown." },
        guest_email: { type: "string", description: "Email exactly as given. Empty if unknown." },
      },
    },
    missing_fields: { type: "array", items: { type: "string" } },
    complete: { type: "boolean", description: "True only when everything needed for THIS service is known." },
    confidence: { type: "number", description: "0..1 that the venue was identified correctly." },
    escalate: { type: "boolean" },
    escalate_reason: { type: "string", description: "When escalate is true: one short sentence for the team, in English, saying why and what to do. Empty string otherwise." },
    duplicate_of: { type: ["string", "null"], description: "Id of the open request this message repeats, answers or refines, or null." },
  },
} as const;

async function ensureMember(
  phone: string, first: string, last: string, email: string,
): Promise<{ id: string | null; created: boolean; error?: string }> {
  const clean = email.trim().toLowerCase();
  if (!EMAIL_RE.test(clean)) return { id: null, created: false, error: "invalid_email" };

  const { data: existing } = await supabase.from("users")
    .select("id").ilike("email", clean).maybeSingle();

  let id = existing?.id ?? null;
  let created = false;

  if (!id) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: clean, email_confirm: true,
      user_metadata: { first_name: first, last_name: last, source: "whatsapp_concierge" },
    });
    if (error || !data?.user?.id) {
      return { id: null, created: false, error: error?.message ?? "createUser failed" };
    }
    id = data.user.id;
    created = true;
  }

  const digits = phone.replace(/[^0-9]/g, "");
  await supabase.from("users").upsert({
    id, email: clean,
    first_name: first || null, last_name: last || null,
    whatsapp_number: digits || null,
  }, { onConflict: "id" });

  return { id, created };
}

/** Loose venue equality: same catalogue id, or the same name give or take case,
 *  accents, punctuation and one name containing the other ("Diep" / "Diep Paris"). */
function norm(s: unknown): string {
  return String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function sameVenue(a: { venue_text?: unknown; restaurant_id?: unknown }, venueText: unknown, restaurantId: unknown): boolean {
  if (a.restaurant_id && restaurantId) return a.restaurant_id === restaurantId;
  const x = norm(a.venue_text), y = norm(venueText);
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}

serve(async (req) => {
  try {
    const secret = await setting("notifications_internal_secret", "NOTIFICATIONS_INTERNAL_SECRET");
    if (secret && req.headers.get("x-internal-secret") !== secret) return json({ error: "unauthorized" }, 401);

    const key = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
    if (!key) return json({ skipped: true, reason: "missing_anthropic_key" });

    const body = await req.json().catch(() => ({}));
    const phone = String(body.phone ?? "").replace(/[^0-9]/g, "");
    const incoming = String(body.message ?? "").trim();
    const dryRun = body.dry_run === true;
    // Replays can pin the clock and the history cut-off to a past moment.
    const asOf = typeof body.as_of === "string" && !isNaN(Date.parse(body.as_of)) ? body.as_of : null;
    if (!phone || !incoming) return json({ error: "phone and message required" }, 400);

    let histQ = supabase
      .from("whatsapp_messages")
      .select("direction, body, created_at")
      .eq("phone", phone).not("body", "is", null)
      .order("created_at", { ascending: false }).limit(HISTORY_TURNS);
    if (asOf) histQ = histQ.lt("created_at", asOf);
    const { data: rows } = await histQ;

    const history = (rows ?? []).reverse()
      .filter((r) => (r.body ?? "").trim().length > 0)
      .map((r) => ({
        role: r.direction === "inbound" ? "user" : "assistant",
        content: r.body as string,
      }));

    let inQ = supabase.from("whatsapp_messages")
      .select("body").eq("phone", phone).eq("direction", "inbound")
      .not("body", "is", null).order("created_at", { ascending: false }).limit(60);
    if (asOf) inQ = inQ.lt("created_at", asOf);
    const { data: allIn } = await inQ;
    const language = conversationLanguage([incoming, ...(allIn ?? []).map((r: any) => String(r.body ?? ""))]);

    const { data: matches } = await supabase.rpc("member_by_phone", { p_phone: phone });
    const member = Array.isArray(matches) ? matches[0] ?? null : matches ?? null;

    const today = (asOf ? new Date(asOf) : new Date()).toISOString().slice(0, 10);

    // Open requests: upcoming ones AND ones that have no date yet. The
    // dateless ones used to be dropped here, which split every request in two.
    let openQ = supabase.from("concierge_intents")
      .select("id, venue_text, restaurant_id, city, service_type, reservation_date, reservation_time, party_size, special_requests, status, approved_at, booking_id, details, created_at")
      .eq("phone", phone).in("status", OPEN_STATUSES)
      .or(`reservation_date.gte.${today},reservation_date.is.null`)
      .gte("created_at", new Date(Date.parse(today) - 45 * 86400000).toISOString())
      .order("created_at", { ascending: false }).limit(10);
    if (asOf) openQ = openQ.lt("created_at", asOf);
    const { data: openRows } = await openQ;
    const open = openRows ?? [];

    const { data: bookedRows } = member?.id
      ? await supabase.from("bookings")
          .select("restaurant_name, city, reservation_date, reservation_time, party_size, service_type")
          .eq("user_id", member.id).gte("reservation_date", today)
          .order("reservation_date").limit(10)
      : { data: [] as any[] };

    const inHand = [
      ...open.map((i) => ({
        id: i.id, what: i.service_type ?? "dining", venue: i.venue_text,
        destination: i.city, date: i.reservation_date, time: hhmm(i.reservation_time),
        party_size: i.party_size, details: i.details ?? {}, standing: standing(i),
      })),
      ...(bookedRows ?? []).map((b: any) => ({
        id: null, what: b.service_type, venue: b.restaurant_name,
        destination: b.city, date: b.reservation_date, time: hhmm(b.reservation_time),
        party_size: b.party_size, details: {}, standing: "CONFIRMED, booked",
      })),
    ];

    const allBooked = open.length > 0 && open.every((i) => !!i.booking_id);
    const needsIdentity = !member && !allBooked;
    const ack = isAcknowledgement(incoming);

    const preamble = [
      `Today is ${today}.`,
      language
        ? `THIS CLIENT WRITES IN ${language.toUpperCase()}. Reply in ${language}, whatever this particular message looks like.`
        : `The client's language is not established yet.`,
      ack ? `THIS MESSAGE LOOKS LIKE A PLAIN ACKNOWLEDGEMENT. Unless it changes something, set should_reply to false.` : "",
      member?.first_name
        ? `The client is ${member.first_name}.`
        : needsIdentity
          ? `This number is NOT a known client, so you will also need their first name, last name and email, but ask for them only once the booking details are known (ONE STEP AT A TIME).`
          : `This number is not in our records, but everything they asked for is already booked. Do NOT ask for their name or their email.`,
      member?.preferred_city ? `Their usual city is ${member.preferred_city}, but never assume a request is there.` : "",
      "",
      inHand.length
        ? `ALREADY IN HAND for this client:\n${JSON.stringify(inHand, null, 1)}`
        : "ALREADY IN HAND for this client: nothing open, and no upcoming bookings.",
    ].filter((s) => s !== undefined && s !== "").join(" ").replace(/  +/g, " ");

    const messages = history.length
      ? [{ role: "user", content: `${preamble}\n\n${history[0].content}` }, ...history.slice(1)]
      : [{ role: "user", content: `${preamble}\n\n${incoming}` }];
    if (history.length && history[history.length - 1].content !== incoming) {
      messages.push({ role: "user", content: incoming });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: MODEL, max_tokens: 2000,
        system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
        output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
        messages,
      }),
    });

    const out = await res.json().catch(() => ({}));
    if (!res.ok) return json({ error: "model_error", status: res.status, detail: out?.error ?? out }, 502);

    if (out.stop_reason === "refusal") {
      return json({ reply: "Let me put a colleague on this, they will come back to you shortly.",
                    should_reply: true, state: { escalate: true, complete: false, missing_fields: [] },
                    refused: true });
    }

    const text = (out.content ?? []).find((b: { type: string }) => b.type === "text")?.text ?? "{}";
    const parsed = JSON.parse(text);
    const { reply, should_reply, ...state } = parsed;
    const cleanReply = typeof reply === "string" ? stripDashes(reply) : "";
    const shouldReply = should_reply !== false && cleanReply.length > 0;

    const service = String(state.service_type ?? "dining");
    const isDining = DINING.has(service);

    let restaurantId: string | null = null;
    let matchedName: string | null = null;
    let matchedCity: string | null = null;
    if (isDining && state.venue_text) {
      const q = String(state.venue_text).trim();
      const { data: hits } = await supabase
        .from("restaurants").select("id, name, city")
        .eq("is_active", true).ilike("name", `%${q}%`).limit(5);
      if (hits?.length === 1) {
        restaurantId = hits[0].id; matchedName = hits[0].name; matchedCity = hits[0].city;
      } else if (hits && hits.length > 1) {
        const c = String(state.city ?? member?.preferred_city ?? "");
        const inCity = hits.filter((h) => c && h.city === c);
        if (inCity.length === 1) {
          restaurantId = inCity[0].id; matchedName = inCity[0].name; matchedCity = inCity[0].city;
        }
      }
    }

    // Which open request does this message belong to?
    //  1. the one the model named;
    //  2. same service and same venue, unless both carry different dates;
    //  3. no venue in this message: the most recent open, unbooked request
    //     of the same service (they are answering our question).
    const newDate = String(state.reservation_date ?? "");
    const datesClash = (i: any) => !!newDate && !!i.reservation_date && String(i.reservation_date) !== newDate;
    const sameService = (i: any) => !state.service_type || !i.service_type || i.service_type === state.service_type;
    const unbooked = open.filter((i) => !i.booking_id);
    const existing =
      open.find((i) => i.id === state.duplicate_of) ??
      unbooked.find((i) => sameService(i) && sameVenue(i, state.venue_text, restaurantId) && !datesClash(i)) ??
      (!has(state.venue_text) ? unbooked.find((i) => sameService(i) && !datesClash(i)) : undefined);

    const prev = existing ?? null;
    const prevD = (prev?.details ?? {}) as Record<string, any>;
    const newD = (state.details ?? {}) as Record<string, any>;
    const d: Record<string, any> = { ...prevD };
    for (const [k, v] of Object.entries(newD)) if (has(v)) d[k] = v;
    for (const k of ["adults", "children", "rooms"]) {
      if (has(d[k])) { const n = numOf(d[k]); if (n === null) delete d[k]; else d[k] = n; }
    }

    const city = state.city ?? prev?.city ?? matchedCity ?? null;
    const venueText = state.venue_text ?? prev?.venue_text ?? null;
    const resDate = state.reservation_date ?? d.check_in ?? prev?.reservation_date ?? null;
    const resTime = state.reservation_time ?? prev?.reservation_time ?? null;
    const party = state.party_size ?? d.adults ?? prev?.party_size ?? null;

    let memberId: string | null = (member?.id as string) ?? null;
    let memberCreated = false;
    let identityNote: string | null = null;
    if (!memberId && has(d.guest_email) && has(d.guest_first) && !dryRun) {
      const r = await ensureMember(phone, String(d.guest_first), String(d.guest_last ?? ""), String(d.guest_email));
      if (r.id) { memberId = r.id; memberCreated = r.created; }
      else identityNote = r.error ?? "could not create the member";
    }

    const identityKnown = !!memberId || allBooked || (has(d.guest_first) && has(d.guest_email));

    let complete = false;
    if (isDining) {
      complete = has(resDate) && has(resTime) && has(party) && has(venueText);
    } else if (service === "hotels") {
      complete = has(d.check_in) && has(d.check_out) && has(city) &&
                 (has(d.adults) || has(party)) && has(d.rooms);
    } else if (service === "cars") {
      complete = has(city) && has(d.check_in) && has(d.check_out) && has(d.with_driver);
    } else if (service === "yachts") {
      complete = has(city) && has(d.check_in) && has(d.duration) && has(party);
    } else if (service === "wellness") {
      complete = has(city) && has(d.check_in) && has(d.treatment_type) && has(party);
    }
    complete = complete && identityKnown;

    const status = state.escalate ? "needs_human"
                 : !complete ? "collecting"
                 : isDining ? "ready"
                 : "needs_human";

    const WHAT: Record<string, string> = {
      hotels: "Stay request", cars: "Car request",
      yachts: "Yacht request", wellness: "Wellness request",
    };
    const reason = String(state.escalate_reason ?? "").trim();
    const humanReason = state.escalate
      ? (reason ? stripDashes(reason).slice(0, 300) : "Alfred handed this over without a reason, read the conversation.")
      : (complete && !isDining)
        ? `${WHAT[service] ?? service}, everything collected. Arrange it with our partner and come back with the price.`
        : (complete && isDining && !restaurantId) ? "Venue not resolved in catalogue"
        : null;

    const missingSet = new Set<string>(
      Array.isArray(state.missing_fields) ? state.missing_fields.map(String) : []);
    if (!identityKnown) {
      if (!has(d.guest_first)) missingSet.add("guest_first");
      if (!has(d.guest_email)) missingSet.add("guest_email");
    } else {
      for (const k of ["guest_first", "guest_last", "guest_email"]) missingSet.delete(k);
    }
    // A named restaurant needs no city: the catalogue knows it.
    if (isDining && (restaurantId || has(venueText))) missingSet.delete("city");

    const row = {
      venue_text: venueText,
      restaurant_id: restaurantId ?? prev?.restaurant_id ?? null,
      city,
      service_type: state.service_type ?? prev?.service_type ?? null,
      reservation_date: resDate,
      reservation_time: resTime,
      party_size: party,
      special_requests: state.special_requests ?? prev?.special_requests ?? null,
      missing_fields: [...missingSet],
      confidence: state.confidence ?? null,
      details: d,
      status, human_reason: humanReason,
    };

    let intentId: string | null = null;
    let action = "created";

    if (dryRun) {
      intentId = existing?.id ?? null;
      action = existing ? (existing.booking_id ? "already_booked" : "would_update") : "would_create";
    } else if (existing && (existing.booking_id || existing.approved_at || existing.status === "attempting")) {
      intentId = existing.id;
      action = existing.booking_id ? "already_booked" : "already_in_progress";
      if (memberId) await supabase.from("concierge_intents").update({ user_id: memberId }).eq("id", existing.id);
    } else if (existing) {
      const { data: upd } = await supabase.from("concierge_intents")
        .update({ ...row, ...(memberId ? { user_id: memberId } : {}) })
        .eq("id", existing.id).select("id").maybeSingle();
      intentId = upd?.id ?? existing.id;
      action = "updated";
    } else {
      const { data: ins } = await supabase.from("concierge_intents")
        .insert({ phone, user_id: memberId, ...row }).select("id").maybeSingle();
      intentId = ins?.id ?? null;
    }

    return json({
      reply: shouldReply ? cleanReply : "",
      should_reply: shouldReply, looked_like_ack: ack,
      intent_id: intentId, action, language, dry_run: dryRun,
      needs_identity: needsIdentity, service_type: service, status,
      human_reason: humanReason,
      member_id: memberId, member_created: memberCreated,
      identity_known: identityKnown, identity_note: identityNote,
      state: { ...state, complete, city, details: d, restaurant_id: restaurantId, matched_name: matchedName },
      ...(dryRun ? { would_write: row } : {}),
      usage: out.usage,
    });
  } catch (e) {
    return json({ fatal: String((e as Error)?.message ?? e).slice(0, 400) }, 500);
  }
});
