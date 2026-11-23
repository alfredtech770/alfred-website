#!/usr/bin/env node
/**
 * Keep public/sitemap.xml in step with the live catalog.
 *
 * - Adds catalog pages that exist in Supabase but were missing from the
 *   sitemap (cars, restaurants, nightlife, yachts, wellness, and hotels —
 *   one page per property, duplicates skipped).
 * - Retires catalog URLs the live app can't render ("not found"). They are
 *   recorded in scripts/seo-retired-routes.txt so generate-seo-pages.js keeps
 *   serving them a noindex page instead of the homepage shell.
 * - Never touches anything else: every other URL is kept as-is, in order.
 *
 * Guard: the build fails if any URL would disappear without being a verified
 * dead catalog page, or if an implausible number of URLs would be retired.
 * If the catalog can't be fetched, the sitemap is left untouched.
 *
 *   node scripts/sync-sitemap.js          write changes
 *   node scripts/sync-sitemap.js --dry    report only
 */
const fs = require("fs");
const path = require("path");
const rich = require("./seo-rich-pages.js");

const ROOT = path.join(__dirname, "..");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");
const RETIRED = path.join(__dirname, "seo-retired-routes.txt");
const BASE = "https://alfredconcierge.app";
const DRY = process.argv.includes("--dry");
const MAX_RETIRE = 1500;
const ADD_HOTELS = process.argv.includes("--with-hotels");

function readRetired() {
  if (!fs.existsSync(RETIRED)) return [];
  return fs.readFileSync(RETIRED, "utf8").split("\n").map((s) => s.trim()).filter((s) => s.startsWith("/"));
}

(async function main() {
  let data;
  try { data = await rich.loadCatalog(); }
  catch (error) { console.warn(`sitemap sync skipped (catalog unavailable: ${error.message}); sitemap left unchanged`); return; }

  const xml = fs.readFileSync(SITEMAP, "utf8");
  const opening = xml.match(/^[\s\S]*?<urlset\b[^>]*>/)[0];
  const blocks = [...xml.matchAll(/<url>\s*[\s\S]*?<\/url>/g)].map((m) => m[0]);
  const routeOf = (block) => new URL(block.match(/<loc>([^<]+)<\/loc>/)[1].replace(/&amp;/g, "&")).pathname.replace(/\/+$/, "") || "/";

  const kept = [], retired = [], present = new Set();
  for (const block of blocks) {
    const route = routeOf(block);
    present.add(route);
    // Only catalog detail URLs the app cannot render are retired; cars never
    // are (CarDetailPage falls back to src/data/cars.js).
    if (rich.isCatalogDetail(route) && !rich.renderRoute(route, data)) retired.push(route);
    else kept.push("  " + block.trim());
  }

  const additions = [];
  const badSlugs = [];
  const add = (route) => {
    if (present.has(route)) return;
    // Only clean, URL-safe slugs go in the sitemap ("El dorado hôtel" doesn't).
    if (!/^\/catalog\/[a-z-]+\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(route)) { badSlugs.push(route); return; }
    present.add(route); additions.push(route);
  };
  for (const r of data.lists.restaurants) if (r.slug) add(`/catalog/dining/${r.slug}`);
  // One page per car: skip a car if it's already listed under any spelling
  // (e.g. "mercedes-benz-g550" for the DB's "Mercedes G550").
  const carKey = (rows) => rows.map((c) => c.id).sort().join(",");
  const listedCars = new Set();
  for (const [slug, rows] of data.cars) if (present.has(`/catalog/exotic-cars/${slug}`)) listedCars.add(carKey(rows));
  for (const [slug, rows] of data.cars) {
    if (!rows.some((c) => slug === rich.carSlug(c)) || listedCars.has(carKey(rows))) continue;
    listedCars.add(carKey(rows));
    add(`/catalog/exotic-cars/${slug}`);
  }
  for (const n of data.lists.clubs) if (n.slug) add(`/catalog/nightlife/${n.slug}`);
  for (const y of data.lists.yachts) add(`/catalog/yachts/${y.slug}`);
  for (const w of data.lists.wellness) add(`/catalog/wellness/${w.slug}`);

  // Hotels: the table holds many copies of the same property ("Six Senses
  // Laamu" four times). Add a hotel only when no other record for the same
  // name in the same city is already listed, so each property has one page.
  const hotelKey = (h) => `${rich.slugify(h.name)}|${rich.slugify(h.city)}`;
  const listedHotels = new Set();
  for (const h of data.lists.hotels) if (h.slug && present.has(`/catalog/hotels/${h.slug}`)) listedHotels.add(hotelKey(h));
  let hotelDuplicates = 0;
  const hotelOrder = data.lists.hotels.slice().sort((a, b) => (/-\d+$/.test(a.slug || "") - /-\d+$/.test(b.slug || "")) || String(a.slug).length - String(b.slug).length);
  for (const h of hotelOrder) {
    if (!h.slug || present.has(`/catalog/hotels/${h.slug}`)) continue;
    if (listedHotels.has(hotelKey(h)) && !ADD_HOTELS) { hotelDuplicates++; continue; }
    listedHotels.add(hotelKey(h));
    add(`/catalog/hotels/${h.slug}`);
  }

  // Every new URL must render a full page, or it doesn't go in.
  const unrenderable = additions.filter((route) => !rich.renderRoute(route, data));
  if (unrenderable.length) throw new Error(`refusing to add URLs with no page: ${unrenderable.slice(0, 5).join(", ")}`);

  // Guard: nothing disappears except verified dead catalog pages.
  const keptRoutes = new Set(kept.map(routeOf));
  const lost = [...blocks.map(routeOf)].filter((r) => !keptRoutes.has(r) && !retired.includes(r));
  if (lost.length) throw new Error(`sitemap sync would drop live URLs: ${lost.slice(0, 5).join(", ")}`);
  if (retired.length > MAX_RETIRE) throw new Error(`sitemap sync would retire ${retired.length} URLs (limit ${MAX_RETIRE}); check the catalog fetch`);

  const byType = (list) => list.reduce((acc, r) => { const t = r.split("/")[2] || r; acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  console.log(`sitemap sync: ${blocks.length} → ${kept.length + additions.length} URLs`);
  console.log(`  added   ${additions.length} ${JSON.stringify(byType(additions))}`);
  console.log(`  retired ${retired.length} ${JSON.stringify(byType(retired))}`);
  if (hotelDuplicates) console.log(`  (${hotelDuplicates} hotel records left out as duplicates of a listed property)`);
  if (badSlugs.length) console.log(`  skipped ${badSlugs.length} records with non-URL-safe slugs (fix the slug in Supabase): ${badSlugs.slice(0, 10).join(", ")}`);
  if (DRY) { console.log("  dry run: nothing written"); return; }

  const newBlocks = additions.map((route) => `  <url>\n    <loc>${BASE}${route}</loc>\n  </url>`);
  fs.writeFileSync(SITEMAP, `${opening}\n${kept.concat(newBlocks).join("\n")}\n</urlset>\n`, "utf8");
  const allRetired = [...new Set(readRetired().concat(retired))].sort();
  fs.writeFileSync(RETIRED, "# Catalog URLs removed from the sitemap because the app shows \"not found\".\n# generate-seo-pages.js still writes a noindex page for each. Maintained by scripts/sync-sitemap.js.\n" + allRetired.join("\n") + "\n", "utf8");
})().catch((error) => { console.error(error.message); process.exit(1); });
