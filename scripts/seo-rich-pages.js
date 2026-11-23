/**
 * Full-content static pages for crawlers and AI assistants.
 *
 * The SPA renders venue data client-side, so non-JS crawlers (GPTBot,
 * PerplexityBot, ClaudeBot, link unfurlers, and Google's first-pass crawl)
 * used to see a ~90-word template. This module fetches the live catalog at
 * build time and writes the same facts the React page shows — description,
 * address, hours, prices, insider tips, FAQ, JSON-LD and internal links —
 * into each route's static HTML. React replaces it on load, so visitors see
 * the normal page and crawlers see matching content (no cloaking).
 *
 * Fail-safe: any fetch error returns null and the generator falls back to
 * the generic shells.
 */
const fs = require("fs");
const path = require("path");

const BASE = "https://alfredconcierge.app";
const WHATSAPP = "33743713649";
const ROOT = path.join(__dirname, "..");

/* ── env + fetch ─────────────────────────────────────────────────────── */

function readEnvFiles() {
  const out = {};
  for (const name of [".env", ".env.local", ".env.production"]) {
    const file = path.join(ROOT, name);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return out;
}

async function fetchAll(url, key, table, select) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${url}/rest/v1/${table}?select=${select}&order=id`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + 999}`, "Range-Unit": "items" }
    });
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status}`);
    const batch = await res.json();
    rows.push(...batch);
    if (batch.length < 1000) break;
  }
  return rows;
}

async function loadCatalog() {
  const env = { ...readEnvFiles(), ...process.env };
  const url = (env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set");
  const [restaurants, cars, hotels, clubs, yachts, wellness] = await Promise.all([
    fetchAll(url, key, "restaurants", "*"),
    fetchAll(url, key, "cars", "*"),
    fetchAll(url, key, "accommodations", "*"),
    fetchAll(url, key, "nightclubs", "*"),
    fetchAll(url, key, "yachts", "*"),
    fetchAll(url, key, "wellness", "*")
  ]);
  const live = (rows) => rows.filter((r) => r.is_active !== false);
  const data = { restaurants: new Map(), cars: new Map(), hotels: new Map(), clubs: new Map(), yachts: new Map(), wellness: new Map(), lists: { restaurants: live(restaurants), cars: live(cars), hotels: live(hotels), clubs: live(clubs), yachts: live(yachts).filter((y) => y.slug), wellness: live(wellness).filter((w) => w.slug) } };
  for (const r of restaurants) if (r.slug) data.restaurants.set(r.slug, r);
  for (const c of live(cars)) {
    // Legacy URLs come from src/data/cars.js, which spells the brand
    // "Mercedes-Benz" where the DB says "Mercedes" — index both spellings.
    const slugs = new Set([slugify(carName(c))]);
    if (/^mercedes$/i.test((c.brand || "").trim())) slugs.add(slugify(carName({ ...c, brand: "Mercedes-Benz" })));
    for (const slug of slugs) {
      if (!data.cars.has(slug)) data.cars.set(slug, []);
      data.cars.get(slug).push(c);
    }
  }
  // Mirror each detail page's own lookup so a static page exists exactly when
  // the live app renders one: HotelDetailPage matches slug only (any status),
  // DiningDetailPage matches slug (any status), NightlifeDetailPage hides
  // inactive venues.
  // Legacy car URLs (from src/data/cars.js) with misspelt slugs that are
  // already indexed: serve them the real car's content, and never list the
  // correctly spelt slug as a second page.
  const LEGACY_CAR_SLUGS = {
    "mercedes-mayback-650": "mercedes-maybach-650",
    "mercedes-maybback": "mercedes-maybach",
    "porsche-718-boxter": "porsche-718-boxster",
    "mini-s-convertoble": "mini-cooper-s-convertible"
  };
  for (const [legacy, real] of Object.entries(LEGACY_CAR_SLUGS)) if (data.cars.has(real) && !data.cars.has(legacy)) data.cars.set(legacy, data.cars.get(real));
  for (const h of hotels) if (h.slug) data.hotels.set(h.slug, h);
  for (const n of live(clubs)) if (n.slug) data.clubs.set(n.slug, n);
  // YachtDetailPage finds a yacht by slug whatever its status;
  // WellnessDetailPage hides inactive venues.
  for (const y of yachts) if (y.slug) data.yachts.set(y.slug, y);
  for (const w of live(wellness)) if (w.slug) data.wellness.set(w.slug, w);
  console.log(`rich SEO: loaded ${restaurants.length} restaurants, ${cars.length} cars, ${hotels.length} hotels, ${clubs.length} nightlife venues, ${yachts.length} yachts, ${wellness.length} wellness venues`);
  return data;
}

/* ── helpers ─────────────────────────────────────────────────────────── */

function slugify(n) { return (n || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function carName(c) {
  const name = (c.name || "").trim(), brand = (c.brand || "").trim();
  return brand && name && name.toLowerCase().indexOf(brand.toLowerCase()) !== 0 ? `${brand} ${name}` : name;
}
function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function clean(obj) {
  const out = {};
  for (const k in obj) {
    const v = obj[k];
    if (v === undefined || v === null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && !v.length)) continue;
    out[k] = v;
  }
  return out;
}
function pickTitle(options) { return options.find((t) => t.length <= 68) || options[options.length - 1].slice(0, 68); }
function trimSentence(text, max = 165) {
  text = text.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" — "));
  return stop > 80 ? cut.slice(0, stop + 1).trim() : cut.slice(0, cut.lastIndexOf(" ")).trim() + "…";
}
function currency(city) {
  if (["Paris", "Saint-Tropez", "Monaco", "Ibiza", "Mykonos", "Madrid", "Cannes"].includes(city)) return { sym: "€", code: "EUR" };
  if (city === "London") return { sym: "£", code: "GBP" };
  if (city === "Dubai") return { sym: "AED ", code: "AED" };
  return { sym: "$", code: "USD" };
}
function money(n, city) { return n == null || n === "" ? null : currency(city).sym + Number(n).toLocaleString("en-US"); }
function country(city) {
  return { Paris: "FR", "Saint-Tropez": "FR", Monaco: "MC", Ibiza: "ES", Madrid: "ES", Mykonos: "GR", London: "GB", Dubai: "AE" }[city] || "US";
}
function images(row) {
  const out = [];
  for (const u of [row.hero_image_url].concat(row.photos_order || [], row.gallery_photos || [])) if (u && !out.includes(u)) out.push(u);
  return out;
}
function waLink(text) { return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`; }
function list(arr) { return (Array.isArray(arr) ? arr : []).map((x) => (typeof x === "string" ? x : x && (x.name || x.title))).filter(Boolean); }
function items(v) {
  if (Array.isArray(v)) return list(v);
  return String(v || "").split(/\n|,|;|•/).map((x) => x.trim()).filter((x) => x && x.length < 80);
}
function label(v) { return String(v || "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); }

const S = {
  main: "max-width:820px;margin:0 auto;padding:72px 24px;color:#F4F4F5;font:16px/1.65 system-ui,sans-serif",
  a: "color:#F4F4F5",
  cta: "display:inline-block;margin:8px 12px 8px 0;padding:12px 20px;border-radius:999px;background:#F4F4F5;color:#0A0A0A;text-decoration:none;font-weight:600"
};

function factsTable(rows) {
  const r = rows.filter(([, v]) => v);
  if (!r.length) return "";
  return `<dl>${r.map(([k, v]) => `<dt><strong>${esc(k)}</strong></dt><dd>${esc(v)}</dd>`).join("")}</dl>`;
}
function faqBlock(faqs) {
  if (!faqs.length) return "";
  return `<section><h2>Frequently asked questions</h2>${faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}</section>`;
}
function faqLd(faqs) {
  return faqs.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) } : null;
}
function crumbs(items) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: BASE + p })) };
}
function related(title, links) {
  if (!links.length) return "";
  return `<section><h2>${esc(title)}</h2><ul>${links.map(([name, href, note]) => `<li><a href="${esc(href)}" style="${S.a}">${esc(name)}</a>${note ? " — " + esc(note) : ""}</li>`).join("")}</ul></section>`;
}
function hero(row, alt) {
  const img = images(row)[0];
  return img ? `<img src="${esc(img)}" alt="${esc(alt)}" width="1200" height="800" style="width:100%;height:auto;border-radius:16px" loading="eager">` : "";
}
function ctaBlock(heading, text, waText, extra) {
  return `<section><h2>${esc(heading)}</h2><p>${esc(text)}</p><p><a href="${esc(waLink(waText))}" style="${S.cta}" rel="nofollow">Request on WhatsApp</a>${extra || ""}</p></section>`;
}

/* ── restaurants ─────────────────────────────────────────────────────── */

function restaurantPage(r, data) {
  const city = r.city || "";
  const n = String(r.name || "").replace(/\s+/g, " ").trim();
  const where = r.address ? r.address : city;
  const hours = r.opening_hours || [r.hours_lunch && `Lunch ${r.hours_lunch}`, r.hours_dinner && `Dinner ${r.hours_dinner}`, r.hours_closed && `Closed ${r.hours_closed}`].filter(Boolean).join(" · ");
  const dress = r.dress_code ? label(r.dress_code) : null;
  const bestFor = list(r.best_for).join(", ");

  const faqs = [];
  faqs.push({ q: `How do I book a table at ${n}?`, a: `Send Alfred your date, time and party size on WhatsApp or in the Alfred app. A concierge checks availability with ${n} and confirms the reservation with you directly.` });
  if (r.reservation_required) faqs.push({ q: `Do I need a reservation at ${n}?`, a: `Yes. ${n} is reservation-led, especially for dinner and weekends, so it is best to request your table in advance.` });
  if (hours) faqs.push({ q: `What are ${n}'s opening hours?`, a: hours.replace(/\n/g, "; ") + "." });
  if (r.avg_spend) faqs.push({ q: `How much does a meal at ${n} cost?`, a: `Expect around ${r.avg_spend} per person${r.price_level ? ` (price level ${"$".repeat(r.price_level)})` : ""}.` });
  if (dress) faqs.push({ q: `What is the dress code at ${n}?`, a: `${dress}.` });
  if (r.address) faqs.push({ q: `Where is ${n} located?`, a: `${n} is at ${r.address}.` });
  if (r.alfred_tip) faqs.push({ q: `Any tips for dining at ${n}?`, a: r.alfred_tip });

  const sameCity = data.lists.restaurants.filter((x) => x.city === city && x.slug && x.slug !== r.slug);
  sameCity.sort((a, b) => (b.cuisine === r.cuisine) - (a.cuisine === r.cuisine) || (b.rating || 0) - (a.rating || 0));
  const links = sameCity.slice(0, 8).map((x) => [x.name, `/catalog/dining/${x.slug}`, [x.cuisine, x.avg_spend].filter(Boolean).join(", ")]);

  const title = pickTitle([
    `${n} ${city} — Reservations & Hours | Alfred`,
    `${n} ${city} — Reservations & Hours | Alfred`,
    `${n} ${city} Reservations | Alfred`,
    `${n} Reservations | Alfred`
  ]);
  const description = trimSentence(`Book a table at ${n}${r.cuisine ? `, ${r.cuisine}` : ""} in ${city}. ${r.avg_spend ? `Around ${r.avg_spend} per person. ` : ""}Hours, dress code and insider tips — reserve through Alfred Concierge on WhatsApp.`);

  const body = `
<nav><a href="/" style="${S.a}">Alfred</a> › <a href="/catalog/dining" style="${S.a}">Restaurants</a> › <a href="/city/${slugify(city)}/restaurants" style="${S.a}">${esc(city)}</a></nav>
<h1>${esc(n)} — ${esc(city)}</h1>
${r.tagline ? `<p><em>${esc(r.tagline)}</em></p>` : ""}
${hero(r, `${n} restaurant in ${city}`)}
${r.description ? `<p>${esc(r.description)}</p>` : ""}
${r.alfred_note ? `<h2>Alfred's take</h2><p>${esc(r.alfred_note)}</p>` : ""}
<h2>Good to know</h2>
${factsTable([["Cuisine", r.cuisine], ["Address", r.address], ["Hours", hours], ["Average spend", r.avg_spend], ["Dress code", dress], ["Best for", bestFor], ["Chef", r.chef_name && r.chef_name !== "Executive Chef" ? `${r.chef_name}${r.chef_title ? ", " + r.chef_title : ""}` : null], ["Wine & drinks", r.wine_note]])}
${r.alfred_tip ? `<h2>Insider tip</h2><p>${esc(r.alfred_tip)}</p>` : ""}
${ctaBlock(`Reserve a table at ${n}`, `Tell Alfred your date, time and number of guests. We confirm availability with ${n} and come back to you on WhatsApp.`, `Hi Alfred, I'd like a table at ${n} (${city}). Date: , time: , guests: `)}
${faqBlock(faqs)}
${related(`More restaurants in ${city}`, links)}`;

  const imgs = images(r);
  const ld = [
    clean({
      "@context": "https://schema.org", "@type": "Restaurant", "@id": `${BASE}/catalog/dining/${r.slug}`, name: n,
      description: r.description || r.alfred_note, url: `${BASE}/catalog/dining/${r.slug}`, image: imgs.length ? imgs.slice(0, 6) : undefined,
      servesCuisine: r.cuisine, priceRange: r.price_level ? "$".repeat(r.price_level) : undefined,
      address: r.address ? { "@type": "PostalAddress", streetAddress: r.address, addressLocality: city, addressCountry: country(city) } : undefined,
      telephone: r.phone_number, geo: r.latitude && r.longitude ? { "@type": "GeoCoordinates", latitude: r.latitude, longitude: r.longitude } : undefined,
      sameAs: [r.instagram_url, r.website_url && /^https?:/.test(r.website_url) ? r.website_url : null].filter(Boolean),
      acceptsReservations: true,
      potentialAction: { "@type": "ReserveAction", target: waLink(`Hi Alfred, I'd like a table at ${n} (${city}).`), name: `Reserve ${n} through Alfred Concierge` }
    }),
    crumbs([["Home", "/"], ["Restaurants", "/catalog/dining"], [n, `/catalog/dining/${r.slug}`]]),
    faqLd(faqs)
  ].filter(Boolean);
  return { meta: { title, description, h1: `${n} — ${city}` }, body, ld };
}

/* ── exotic cars ─────────────────────────────────────────────────────── */

function carPage(variants, slug, data) {
  const ordered = variants.slice().sort((a, b) => (b.city === "Miami") - (a.city === "Miami") || (a.price_1_day || 1e9) - (b.price_1_day || 1e9));
  const c = ordered[0];
  const name = carName(c);
  const city = c.city || "Miami";
  const cities = [...new Set(ordered.map((v) => v.city).filter(Boolean))];
  const from = money(c.price_1_day, city);
  const specs = [["Engine", c.engine], ["Horsepower", c.hp ? `${c.hp} hp` : null], ["0–60 / 0–100", c.acceleration], ["Top speed", c.top_speed ? `${c.top_speed}` : null], ["Transmission", c.transmission], ["Seats", c.seats], ["Body", c.type || c.category], ["Convertible", c.is_convertible ? "Yes" : null]];

  const priceRows = ordered.filter((v) => v.price_1_day).map((v) =>
    `<tr><td>${esc(v.city)}</td><td>${esc(money(v.price_1_day, v.city) || "—")}</td><td>${esc(money(v.price_3_day, v.city) || "—")}</td><td>${esc(money(v.price_7_day, v.city) || "—")}</td><td>${esc(money(v.price_30_day, v.city) || "—")}</td><td>${esc(money(v.deposit, v.city) || "—")}</td></tr>`).join("");
  const priceTable = priceRows ? `<h2>${esc(name)} rental prices</h2><table><thead><tr><th>City</th><th>1 day</th><th>3 days</th><th>7 days</th><th>30 days</th><th>Deposit</th></tr></thead><tbody>${priceRows}</tbody></table><p>Guide prices per rental period. Alfred confirms live availability, insurance and final terms before you pay.</p>` : "";

  const faqs = [];
  if (from) faqs.push({ q: `How much does it cost to rent a ${name} in ${city}?`, a: `${name} rentals in ${city} start from about ${from} per day${c.price_7_day ? `, or ${money(c.price_7_day, city)} for a week` : ""}. Final pricing depends on dates and is confirmed by Alfred before booking.` });
  if (c.deposit) faqs.push({ q: `Is there a security deposit for the ${name}?`, a: `Yes. The refundable security deposit is about ${money(c.deposit, city)} in ${city}.` });
  faqs.push({ q: `Where can I rent the ${name}?`, a: `Alfred arranges the ${name} in ${cities.join(", ")}.` });
  faqs.push({ q: `How do I book the ${name}?`, a: `Send your dates and pickup location to Alfred on WhatsApp. A concierge confirms availability with the rental partner, then sends you the final quote and payment link.` });

  const peers = data.lists.cars.filter((x) => x.city === city && slugify(carName(x)) !== slug && x.price_1_day);
  peers.sort((a, b) => (b.brand === c.brand) - (a.brand === c.brand) || Math.abs((a.price_1_day || 0) - (c.price_1_day || 0)) - Math.abs((b.price_1_day || 0) - (c.price_1_day || 0)));
  const seen = new Set();
  const links = [];
  for (const x of peers) {
    const s = slugify(carName(x));
    if (seen.has(s)) continue;
    seen.add(s);
    links.push([carName(x), `/catalog/exotic-cars/${s}`, `from ${money(x.price_1_day, x.city)}/day`]);
    if (links.length === 8) break;
  }

  const title = pickTitle([
    `Rent a ${name} in ${city}${from ? ` — from ${from}/day` : ""} | Alfred`,
    `${name} Rental ${city}${from ? ` from ${from}/day` : ""} | Alfred`,
    `${name} Rental ${city} | Alfred`,
    `${name} Rental | Alfred`
  ]);
  const description = trimSentence(`Rent the ${name} in ${cities.join(", ")}${from ? ` from ${from}/day` : ""}. ${c.hp ? `${c.hp} hp${c.engine ? ", " + c.engine : ""}. ` : ""}Prices, deposit and specs — book through Alfred Concierge on WhatsApp.`);

  const body = `
<nav><a href="/" style="${S.a}">Alfred</a> › <a href="/catalog/exotic-cars" style="${S.a}">Exotic cars</a> › <a href="/city/${slugify(city)}/exotic-cars" style="${S.a}">${esc(city)}</a></nav>
<h1>${esc(name)} rental in ${esc(cities.join(", "))}</h1>
${hero(c, `${name} rental in ${city}`)}
${c.description ? `<p>${esc(c.description)}</p>` : ""}
${priceTable}
<h2>Specifications</h2>
${factsTable(specs)}
${ctaBlock(`Book the ${name}`, `Send Alfred your dates and pickup location. We confirm the car with our ${city} partner and send you the final quote.`, `Hi Alfred, I'd like to rent the ${name} in ${city}. Dates: , pickup: `)}
${faqBlock(faqs)}
${related(`More cars to rent in ${city}`, links)}`;

  const ld = [
    clean({
      "@context": "https://schema.org", "@type": "Car", "@id": `${BASE}/catalog/exotic-cars/${slug}`, name,
      brand: c.brand ? { "@type": "Brand", name: c.brand } : undefined, description: c.description,
      url: `${BASE}/catalog/exotic-cars/${slug}`, image: images(c).slice(0, 6),
      vehicleEngine: c.engine ? clean({ "@type": "EngineSpecification", name: c.engine, enginePower: c.hp ? { "@type": "QuantitativeValue", value: String(c.hp), unitCode: "BHP" } : undefined }) : undefined,
      vehicleTransmission: c.transmission, vehicleSeatingCapacity: c.seats, bodyType: c.type || c.category
    }),
    crumbs([["Home", "/"], ["Exotic cars", "/catalog/exotic-cars"], [name, `/catalog/exotic-cars/${slug}`]]),
    faqLd(faqs)
  ].filter(Boolean);
  return { meta: { title, description, h1: `${name} rental in ${cities.join(", ")}` }, body, ld };
}

/* ── hotels ──────────────────────────────────────────────────────────── */

function hotelPage(h, slug, data) {
  const n = String(h.name || "").replace(/\s+/g, " ").trim(), city = h.city || "";
  const area = h.neighborhood ? `${h.neighborhood}, ${city}` : city;
  const perks = list(h.perks), amenities = list(h.amenities);
  const rooms = (Array.isArray(h.rooms) ? h.rooms : []).map((r) => (typeof r === "string" ? r : r && r.name)).filter(Boolean);
  const from = h.starting_price ? money(h.starting_price, city) : null;

  const faqs = [];
  faqs.push({ q: `How do I book ${n} through Alfred?`, a: `Send Alfred your dates and number of guests on WhatsApp. A concierge checks current rates and room availability at ${n} and books it for you${perks.length ? `, including eligible member perks such as ${perks.slice(0, 2).join(" and ").toLowerCase()}` : ""}.` });
  if (from) faqs.push({ q: `How much does a night at ${n} cost?`, a: `Rates start from around ${from} per night depending on dates and room type. Alfred confirms the live rate before booking.` });
  if (h.address) faqs.push({ q: `Where is ${n}?`, a: `${n} is located at ${h.address}${h.neighborhood ? ` in ${h.neighborhood}` : ""}.` });
  if (amenities.length) faqs.push({ q: `What amenities does ${n} offer?`, a: amenities.slice(0, 10).join(", ") + "." });

  const peers = data.lists.hotels.filter((x) => x.city === city && x.slug && x.slug !== h.slug);
  peers.sort((a, b) => (b.neighborhood === h.neighborhood) - (a.neighborhood === h.neighborhood) || (b.star_rating || 0) - (a.star_rating || 0));
  const links = peers.slice(0, 8).map((x) => [x.name, `/catalog/hotels/${x.slug}`, [x.neighborhood, x.star_rating ? `${x.star_rating}★` : null].filter(Boolean).join(", ")]);

  const nc = city && !n.toLowerCase().includes(city.toLowerCase()) ? `${n} ${city}` : n;
  const title = pickTitle([
    `${nc} — Rates, Rooms & Member Perks | Alfred`,
    `${nc} — Rates & Perks | Alfred`,
    `${nc} | Alfred Concierge`,
    `${n} | Alfred`
  ]);
  const description = trimSentence(`Book ${n}${h.star_rating ? `, a ${h.star_rating}-star hotel` : ""} in ${area}.${from ? ` From ${from}/night.` : ""} Rooms, amenities and member perks — request your stay through Alfred Concierge.`);

  const body = `
<nav><a href="/" style="${S.a}">Alfred</a> › <a href="/catalog/hotels" style="${S.a}">Hotels</a> › <a href="/city/${slugify(city)}/hotels" style="${S.a}">${esc(city)}</a></nav>
<h1>${esc(n)} — ${esc(area)}</h1>
${hero(h, `${n} hotel in ${city}`)}
${h.description ? `<p>${esc(h.description)}</p>` : ""}
<h2>At a glance</h2>
${factsTable([["Location", area], ["Address", h.address], ["Category", h.star_rating ? `${h.star_rating}-star ${h.category || "hotel"}` : h.category], ["Rates from", from ? `${from} per night` : null], ["Room types", rooms.slice(0, 8).join(", ")]])}
${perks.length ? `<h2>Alfred member perks</h2><ul>${perks.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
${amenities.length ? `<h2>Amenities</h2><p>${esc(amenities.join(", "))}</p>` : ""}
${ctaBlock(`Book ${n}`, `Tell Alfred your dates and guests. We check live rates and availability and confirm your stay.`, `Hi Alfred, I'd like to book ${n} (${city}). Check-in: , check-out: , guests: `)}
${faqBlock(faqs)}
${related(`More hotels in ${city}`, links)}`;

  const ld = [
    clean({
      "@context": "https://schema.org", "@type": h.category === "resort" ? "Resort" : "Hotel", "@id": `${BASE}/catalog/hotels/${slug}`, name: n,
      description: h.description, url: `${BASE}/catalog/hotels/${slug}`, image: images(h).slice(0, 6),
      address: h.address ? { "@type": "PostalAddress", streetAddress: h.address, addressLocality: city, addressCountry: country(city) } : undefined,
      starRating: h.star_rating ? { "@type": "Rating", ratingValue: String(h.star_rating) } : undefined,
      telephone: h.phone_number, geo: h.latitude && h.longitude ? { "@type": "GeoCoordinates", latitude: h.latitude, longitude: h.longitude } : undefined,
      amenityFeature: amenities.length ? amenities.slice(0, 20).map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })) : undefined
    }),
    crumbs([["Home", "/"], ["Hotels", "/catalog/hotels"], [n, `/catalog/hotels/${slug}`]]),
    faqLd(faqs)
  ].filter(Boolean);
  return { meta: { title, description, h1: `${n} — ${area}` }, body, ld };
}

/* ── nightlife ───────────────────────────────────────────────────────── */

function clubPage(v, slug, data) {
  const n = String(v.name || "").replace(/\s+/g, " ").trim(), city = v.city || "";
  const music = list(v.music).join(", ") || (typeof v.music === "string" ? v.music : "");
  const faqs = [];
  faqs.push({ q: `How do I get a table at ${n}?`, a: `Message Alfred on WhatsApp with your date and group size. A concierge confirms table or guest-list options and minimum spend with ${n}.` });
  if (v.dress_code) faqs.push({ q: `What is the dress code at ${n}?`, a: `${label(v.dress_code)}.` });
  if (v.best_night) faqs.push({ q: `What is the best night at ${n}?`, a: `${label(v.best_night)}.` });
  if (v.age_policy) faqs.push({ q: `What is the age policy at ${n}?`, a: `${v.age_policy}.` });
  if (v.address) faqs.push({ q: `Where is ${n}?`, a: `${n} is at ${v.address}.` });

  const links = data.lists.clubs.filter((x) => x.city === city && x.id !== v.id).slice(0, 8)
    .map((x) => [x.name, `/catalog/nightlife/${x.slug || x.id}`, label(x.category)]);
  const title = pickTitle([`${n} ${city} — Table Booking & Guest List | Alfred`, `${n} ${city} — VIP Tables | Alfred`, `${n} ${city} | Alfred`]);
  const description = trimSentence(`Book a VIP table or guest list at ${n} in ${city}.${music ? ` Music: ${music}.` : ""} Dress code, best nights and bookings through Alfred Concierge on WhatsApp.`);
  const body = `
<nav><a href="/" style="${S.a}">Alfred</a> › <a href="/catalog/nightlife" style="${S.a}">Nightlife</a> › <a href="/city/${slugify(city)}/nightlife" style="${S.a}">${esc(city)}</a></nav>
<h1>${esc(n)} — ${esc(city)}</h1>
${hero(v, `${n} in ${city}`)}
${v.description ? `<p>${esc(v.description)}</p>` : ""}
<h2>Good to know</h2>
${factsTable([["Type", label(v.category)], ["Music", music], ["Best night", label(v.best_night)], ["Dress code", label(v.dress_code)], ["Entry", label(v.entry_type)], ["Address", v.address], ["Hours", v.opening_hours]])}
${ctaBlock(`Book a table at ${n}`, `Send Alfred your date and group size, and we come back with table options and minimum spend.`, `Hi Alfred, I'd like a table at ${n} (${city}). Date: , guests: `)}
${faqBlock(faqs)}
${related(`More nightlife in ${city}`, links)}`;
  const ld = [
    clean({
      "@context": "https://schema.org", "@type": "NightClub", "@id": `${BASE}/catalog/nightlife/${slug}`, name: n, description: v.description,
      url: `${BASE}/catalog/nightlife/${slug}`, image: images(v).slice(0, 6), telephone: v.phone_number,
      address: v.address ? { "@type": "PostalAddress", streetAddress: v.address, addressLocality: city, addressCountry: country(city) } : undefined
    }),
    crumbs([["Home", "/"], ["Nightlife", "/catalog/nightlife"], [n, `/catalog/nightlife/${slug}`]]),
    faqLd(faqs)
  ].filter(Boolean);
  return { meta: { title, description, h1: `${n} — ${city}` }, body, ld };
}

/* ── yachts ───────────────────────────────────────────────────────────── */

function yachtPage(y, slug, data) {
  const n = String(y.name || "").replace(/\s+/g, " ").trim(), city = y.city || "Miami";
  const where = y.location && !String(y.location).toLowerCase().includes(city.toLowerCase()) ? `${y.location}, ${city}` : (y.location || city);
  const guests = y.max_passengers || y.capacity;
  const durations = [["4 hours", y.price_4hr || y.price_weekday_4hr], ["6 hours", y.price_6hr || y.price_weekday_6hr], ["8 hours", y.price_8hr || y.price_weekday_8hr], ["12 hours", y.price_12hr], ["24 hours", y.price_24hr], ["Full day", y.price_per_day], ["Week", y.price_per_week]].filter(([, v]) => v);
  const fromN = durations.length ? Math.min(...durations.map(([, v]) => Number(v)).filter(Boolean)) : null;
  const from = fromN ? money(fromN, city) : null;
  const included = items(y.whats_included || y.includes), excluded = items(y.not_included), amenities = items(y.amenities);
  const length = y.size_ft ? `${y.size_ft} ft` : (y.length_meters ? `${y.length_meters} m` : null);

  const faqs = [];
  if (from) faqs.push({ q: `How much does it cost to charter the ${n} in ${city}?`, a: `Charters of the ${n} start from about ${from}${durations[0] ? ` for ${durations.find(([, v]) => Number(v) === fromN)[0]}` : ""}. The final price depends on the date, duration and extras, and Alfred confirms it before you pay.` });
  if (guests) faqs.push({ q: `How many guests can the ${n} take?`, a: `Up to ${guests} guests.` });
  if (included.length) faqs.push({ q: `What is included in the ${n} charter?`, a: included.slice(0, 10).join(", ") + "." });
  if (y.security_deposit) faqs.push({ q: `Is there a security deposit?`, a: `Yes, a refundable security deposit of about ${money(y.security_deposit, city)}.` });
  faqs.push({ q: `How do I book the ${n}?`, a: `Send Alfred your date, duration and number of guests on WhatsApp. A concierge confirms availability with the captain and sends you the final quote and payment link.` });

  const peers = data.lists.yachts.filter((x) => x.city === city && x.slug !== slug);
  peers.sort((a, b) => Math.abs((a.size_ft || 0) - (y.size_ft || 0)) - Math.abs((b.size_ft || 0) - (y.size_ft || 0)));
  const links = peers.slice(0, 8).map((x) => [x.name, `/catalog/yachts/${x.slug}`, [x.max_passengers ? `${x.max_passengers} guests` : null, x.price_4hr ? `from ${money(x.price_4hr, city)}` : null].filter(Boolean).join(", ")]);

  const title = pickTitle([
    `${n} Yacht Charter ${city}${from ? ` — from ${from}` : ""} | Alfred`,
    `${n} Yacht Rental ${city}${from ? ` from ${from}` : ""} | Alfred`,
    `${n} Yacht Charter ${city} | Alfred`,
    `${n} Yacht Charter | Alfred`
  ]);
  const description = trimSentence(`Charter the ${n}${length ? `, a ${length} ${y.yacht_type || "yacht"}` : ""} in ${city}${guests ? ` for up to ${guests} guests` : ""}.${from ? ` From ${from}.` : ""} Prices, inclusions and booking through Alfred Concierge on WhatsApp.`);

  const priceTable = durations.length ? `<h2>${esc(n)} charter prices</h2><table><thead><tr><th>Duration</th><th>Price</th></tr></thead><tbody>${durations.map(([d, v]) => `<tr><td>${esc(d)}</td><td>${esc(money(v, city))}</td></tr>`).join("")}</tbody></table><p>Guide prices. Alfred confirms the live rate, fuel, crew and extras before you pay.</p>` : "";
  const body = `
<nav><a href="/" style="${S.a}">Alfred</a> › <a href="/catalog/yachts" style="${S.a}">Yacht charters</a> › <a href="/city/${slugify(city)}/yachts" style="${S.a}">${esc(city)}</a></nav>
<h1>${esc(n)} yacht charter in ${esc(city)}</h1>
${hero(y, `${n} yacht charter in ${city}`)}
${y.description ? `<p>${esc(y.description)}</p>` : ""}
${priceTable}
<h2>The yacht</h2>
${factsTable([["Length", length], ["Guests", guests], ["Cabins", y.cabins], ["Crew", y.crew], ["Builder", y.builder || y.brand], ["Year", y.year_built], ["Type", y.yacht_type ? label(y.yacht_type) : null], ["Departure", where], ["Security deposit", money(y.security_deposit, city)]])}
${included.length ? `<h2>What's included</h2><ul>${included.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
${excluded.length ? `<h2>Not included</h2><ul>${excluded.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
${amenities.length ? `<h2>On board</h2><p>${esc(amenities.join(", "))}</p>` : ""}
${ctaBlock(`Book the ${n}`, `Send Alfred your date, duration and number of guests. We confirm with the captain and send you the final quote.`, `Hi Alfred, I'd like to charter the ${n} in ${city}. Date: , hours: , guests: `)}
${faqBlock(faqs)}
${related(`More yachts to charter in ${city}`, links)}`;

  const prices = durations.map(([, v]) => Number(v)).filter(Boolean);
  const ld = [
    clean({
      "@context": "https://schema.org", "@type": "Product", "@id": `${BASE}/catalog/yachts/${slug}`, name: `${n} yacht charter in ${city}`,
      description: y.description, url: `${BASE}/catalog/yachts/${slug}`, image: images(y).slice(0, 6), category: "Yacht charter",
      brand: y.builder || y.brand ? { "@type": "Brand", name: y.builder || y.brand } : undefined,
      offers: prices.length ? { "@type": "AggregateOffer", priceCurrency: currency(city).code, lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: prices.length, availability: "https://schema.org/InStock", url: `${BASE}/catalog/yachts/${slug}` } : undefined
    }),
    crumbs([["Home", "/"], ["Yacht charters", "/catalog/yachts"], [n, `/catalog/yachts/${slug}`]]),
    faqLd(faqs)
  ].filter(Boolean);
  return { meta: { title, description, h1: `${n} yacht charter in ${city}` }, body, ld };
}

/* ── wellness ────────────────────────────────────────────────────────── */

function wellnessPage(w, slug, data) {
  const n = String(w.name || "").replace(/\s+/g, " ").trim(), city = w.city || "";
  const kind = label(w.type || w.category || "wellness");
  const tags = items(w.tags), amenities = items(w.amenities);

  const faqs = [];
  faqs.push({ q: `How do I book ${n}?`, a: `Send Alfred the day, time and treatment or class you want on WhatsApp. A concierge checks availability with ${n} and confirms your booking.` });
  if (w.address) faqs.push({ q: `Where is ${n}?`, a: `${n} is at ${w.address}.` });
  if (w.duration) faqs.push({ q: `How long is a session at ${n}?`, a: `About ${w.duration}.` });
  if (w.price_level) faqs.push({ q: `How expensive is ${n}?`, a: `Price level ${"$".repeat(Number(w.price_level) || 1)}. Alfred confirms the exact price when booking.` });
  if (amenities.length) faqs.push({ q: `What does ${n} offer?`, a: amenities.slice(0, 10).join(", ") + "." });

  const peers = data.lists.wellness.filter((x) => x.city === city && x.slug !== slug);
  peers.sort((a, b) => ((b.type || b.category) === (w.type || w.category)) - ((a.type || a.category) === (w.type || w.category)) || (b.rating || 0) - (a.rating || 0));
  const links = peers.slice(0, 8).map((x) => [x.name, `/catalog/wellness/${x.slug}`, label(x.type || x.category)]);

  const nc = city && !n.toLowerCase().includes(city.toLowerCase()) ? `${n} ${city}` : n;
  const title = pickTitle([`${nc} — Booking, Prices & Classes | Alfred`, `${nc} — Book a Session | Alfred`, `${nc} | Alfred`, `${n} | Alfred`]);
  const description = trimSentence(`Book ${n}, ${kind.toLowerCase()} in ${city}. ${w.description ? w.description : "Treatments, classes and availability"} — reserve through Alfred Concierge on WhatsApp.`);

  const body = `
<nav><a href="/" style="${S.a}">Alfred</a> › <a href="/catalog/wellness" style="${S.a}">Wellness</a> › <a href="/city/${slugify(city)}/wellness" style="${S.a}">${esc(city)}</a></nav>
<h1>${esc(n)} — ${esc(city)}</h1>
${hero(w, `${n} in ${city}`)}
${w.description ? `<p>${esc(w.description)}</p>` : ""}
<h2>Good to know</h2>
${factsTable([["Type", kind], ["Address", w.address], ["Session length", w.duration], ["Price level", w.price_level ? "$".repeat(Number(w.price_level) || 1) : null], ["Setting", w.indoor_outdoor ? label(w.indoor_outdoor) : null], ["Intensity", w.physical_intensity ? label(w.physical_intensity) : null], ["Good for", tags.slice(0, 8).join(", ")]])}
${amenities.length ? `<h2>Amenities</h2><p>${esc(amenities.join(", "))}</p>` : ""}
${ctaBlock(`Book ${n}`, `Tell Alfred the day, time and what you would like. We confirm with ${n} and come back to you on WhatsApp.`, `Hi Alfred, I'd like to book ${n} (${city}). Day: , time: , treatment or class: `)}
${faqBlock(faqs)}
${related(`More wellness in ${city}`, links)}`;

  const ld = [
    clean({
      "@context": "https://schema.org", "@type": /spa/i.test(`${w.type} ${w.category}`) ? "DaySpa" : "HealthAndBeautyBusiness", "@id": `${BASE}/catalog/wellness/${slug}`, name: n,
      description: w.description, url: `${BASE}/catalog/wellness/${slug}`, image: images(w).slice(0, 6), telephone: w.phone_number,
      priceRange: w.price_level ? "$".repeat(Number(w.price_level) || 1) : undefined,
      address: w.address ? { "@type": "PostalAddress", streetAddress: w.address, addressLocality: city, addressCountry: country(city) } : undefined,
      geo: w.latitude && w.longitude ? { "@type": "GeoCoordinates", latitude: w.latitude, longitude: w.longitude } : undefined,
      sameAs: [w.instagram_url, w.website_url && /^https?:/.test(w.website_url) ? w.website_url : null].filter(Boolean)
    }),
    crumbs([["Home", "/"], ["Wellness", "/catalog/wellness"], [n, `/catalog/wellness/${slug}`]]),
    faqLd(faqs)
  ].filter(Boolean);
  return { meta: { title, description, h1: `${n} — ${city}` }, body, ld };
}

/* ── routing + HTML injection ────────────────────────────────────────── */

function renderRoute(route, data) {
  const m = route.match(/^\/catalog\/(dining|exotic-cars|hotels|nightlife|yachts|wellness)\/([^/]+)\/?$/);
  if (!m) return null;
  const slug = decodeURIComponent(m[2]);
  if (m[1] === "dining" && data.restaurants.has(slug)) return restaurantPage(data.restaurants.get(slug), data);
  if (m[1] === "exotic-cars" && data.cars.has(slug)) return carPage(data.cars.get(slug), slug, data);
  if (m[1] === "hotels" && data.hotels.has(slug)) return hotelPage(data.hotels.get(slug), slug, data);
  if (m[1] === "nightlife" && data.clubs.has(slug)) return clubPage(data.clubs.get(slug), slug, data);
  if (m[1] === "yachts" && data.yachts.has(slug)) return yachtPage(data.yachts.get(slug), slug, data);
  if (m[1] === "wellness" && data.wellness.has(slug)) return wellnessPage(data.wellness.get(slug), slug, data);
  return null;
}

function applyRich(html, page) {
  const main = `<main data-static-seo="true" style="${S.main}">${page.body}</main>`;
  const ld = page.ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("");
  let out = html.replace(/<main data-static-seo="true"[\s\S]*?<\/main>/, () => main);
  const img = (page.body.match(/<img src="([^"]+)"/) || [])[1];
  if (img) out = out.replace(/<meta property="og:image" content="[^"]*"\s*\/?\s*>/, () => `<meta property="og:image" content="${img}">`);
  return out.replace("</head>", () => `<meta name="alfred-rich" content="1">${ld}</head>`);
}

// Only routes the live app cannot render. Cars are excluded: CarDetailPage
// falls back to src/data/cars.js, so an unmatched car URL still works.
function isCatalogDetail(route) { return /^\/catalog\/(dining|hotels|nightlife|yachts|wellness)\/[^/]+\/?$/.test(route); }

function carSlug(c) { return slugify(carName(c)); }

module.exports = { loadCatalog, renderRoute, applyRich, isCatalogDetail, carSlug, slugify, carName };
