#!/usr/bin/env node
/**
 * Permanent (301) redirects for catalog URLs Google still has from earlier
 * slug schemes, written into vercel.json's "redirects".
 *
 *   Cars:     /catalog/exotic-cars/huracn-evo  → /catalog/exotic-cars/lamborghini-huracan-evo
 *             (old URLs used the model name only, accents dropped)
 *   Yachts:   /catalog/yachts/116-azimut       → /catalog/yachts/116-azimut-miami
 *   Wellness: /catalog/wellness/the-well       → /catalog/wellness/the-well-miami
 *             (database slugs now end with the city)
 *
 * Old URLs that match nothing go to their category page rather than a
 * "not found" page. vercel.json is read before the build, so this is run by
 * hand and the result committed:
 *
 *   node scripts/legacy-redirects.js          report
 *   node scripts/legacy-redirects.js --write  update vercel.json
 */
const fs = require("fs");
const path = require("path");
const rich = require("./seo-rich-pages.js");

const ROOT = path.join(__dirname, "..");
const VERCEL = path.join(ROOT, "vercel.json");
const SITEMAP = path.join(ROOT, "public", "sitemap.xml");
const RETIRED = path.join(__dirname, "seo-retired-routes.txt");
const WRITE = process.argv.includes("--write");

// Old car URLs Search Console reports that no rule below can derive.
const EXTRA_OLD_CARS = ["benz-glc63s", "benz-gls63-amg", "benz-s580", "benz-gle53-amg-coupe", "9912-carrera", "huracn-lp610", "x2", "x3", "x4m", "x5", "x6", "xm", "s3", "m2", "rs6", "rsq8"];

const ascii = (s) => String(s || "").toLowerCase().replace(/[^\x00-\x7f]/g, "");
const routesIn = (file, re) => fs.existsSync(file) ? [...fs.readFileSync(file, "utf8").matchAll(re)].map((m) => m[1]) : [];

(async function main() {
  const data = await rich.loadCatalog();
  const redirects = new Map();
  const add = (from, to) => { if (from !== to && !redirects.has(from)) redirects.set(from, to); };

  /* cars: every old model-only slug that is not a live car URL */
  const carTarget = new Map(); // live slug for a set of car rows
  const sitemapCars = new Set(routesIn(SITEMAP, /\/catalog\/exotic-cars\/([^<]+)</g));
  for (const [slug, rows] of data.cars) {
    const key = rows.map((c) => c.id).sort().join(",");
    if (sitemapCars.has(slug) || !carTarget.has(key)) carTarget.set(key, slug);
  }
  const liveSlugFor = (c) => {
    for (const [slug, rows] of data.cars) if (rows.some((r) => r.id === c.id)) return carTarget.get(rows.map((r) => r.id).sort().join(",")) || slug;
    return null;
  };
  const carsByOld = new Map();
  const ordered = data.lists.cars.slice().sort((a, b) => (b.city === "Miami") - (a.city === "Miami"));
  for (const c of ordered) {
    for (const old of [rich.slugify(c.name), rich.slugify(ascii(c.name))]) {
      if (old && !carsByOld.has(old)) carsByOld.set(old, c);
    }
  }
  for (const [old, c] of carsByOld) {
    if (data.cars.has(old)) continue; // already a real page
    const to = liveSlugFor(c);
    if (to) add(`/catalog/exotic-cars/${old}`, `/catalog/exotic-cars/${to}`);
  }
  for (const old of EXTRA_OLD_CARS) {
    if (data.cars.has(old) || redirects.has(`/catalog/exotic-cars/${old}`)) continue;
    const want = old.replace(/^benz-/, "").replace(/^huracn-/, "huracan-").replace(/^9912-/, "991-2-");
    const hit = ordered.find((c) => { const s = rich.carSlug(c); return s.endsWith(`-${want}`) || rich.slugify(ascii(c.name)) === want; });
    add(`/catalog/exotic-cars/${old}`, hit ? `/catalog/exotic-cars/${liveSlugFor(hit)}` : "/catalog/exotic-cars");
  }

  /* yachts + wellness: old slug = name (+ "-2"…), new slug = name-city */
  const legacy = (kind, rows, live) => {
    const olds = new Set(routesIn(SITEMAP, new RegExp(`/catalog/${kind}/([^<]+)<`, "g"))
      .concat(routesIn(RETIRED, new RegExp(`^/catalog/${kind}/(.+)$`, "gm"))));
    const byName = new Map();
    for (const r of rows.slice().sort((a, b) => (b.city === "Miami") - (a.city === "Miami") || String(a.slug).length - String(b.slug).length)) {
      const k = rich.slugify(r.name);
      if (!byName.has(k)) byName.set(k, r);
    }
    for (const old of olds) {
      if (live.has(old)) continue;
      const base = old.replace(/-\d+$/, "");
      const hit = byName.get(old) || byName.get(base);
      add(`/catalog/${kind}/${old}`, hit ? `/catalog/${kind}/${hit.slug}` : `/catalog/${kind}`);
    }
  };
  legacy("yachts", data.lists.yachts, data.yachts);
  legacy("wellness", data.lists.wellness, data.wellness);

  const list = [...redirects].map(([source, destination]) => ({ source, destination, permanent: true }));
  const byKind = list.reduce((a, r) => { const k = r.source.split("/")[2]; a[k] = (a[k] || 0) + 1; return a; }, {});
  const toCategory = list.filter((r) => /^\/catalog\/[a-z-]+$/.test(r.destination)).length;
  console.log(`legacy redirects: ${list.length} ${JSON.stringify(byKind)} (${toCategory} to a category page)`);
  for (const r of list.slice(0, 12)) console.log(`  ${r.source} → ${r.destination}`);
  if (!WRITE) return;

  const cfg = JSON.parse(fs.readFileSync(VERCEL, "utf8"));
  // This script owns every catalog-detail redirect; anything else is kept.
  const owned = (r) => /^\/catalog\/(exotic-cars|yachts|wellness)\/[^/]+$/.test(String(r.source));
  cfg.redirects = (cfg.redirects || []).filter((r) => !owned(r)).concat(list);
  fs.writeFileSync(VERCEL, JSON.stringify(cfg, null, 2) + "\n", "utf8");
  console.log(`vercel.json: ${cfg.redirects.length} redirects`);
})().catch((e) => { console.error(e.message); process.exit(1); });
