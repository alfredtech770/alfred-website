#!/usr/bin/env node
/**
 * Adds product detail URLs (exotic cars + hotels) to public/sitemap.xml.
 *
 * - Cars: slug must match the site's routing exactly — slugify(brand+name),
 *   skipping the brand prefix when the name already starts with it
 *   (mirrors ExoticCarsPage/CarDetailPage).
 * - Hotels: HotelDetailPage does .eq("slug", slug).single(), which errors if
 *   a slug appears on more than one row — so only globally-unique slugs are
 *   included.
 *
 * Idempotent: strips previously-generated blocks (marked with comments)
 * before appending fresh ones. Run: node scripts/gen-product-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = 'https://fbdgbnnkgyljehtccgaq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZGdibm5rZ3lsamVodGNjZ2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NjA5MzgsImV4cCI6MjA4MjMzNjkzOH0.NmlSkGMDZ-DmhV0bmSCFPQmuFNo4E5H-Sz1cjRyYs8Q';
const BASE = 'https://alfredconcierge.app';
const SITEMAP = path.join(__dirname, '..', 'public', 'sitemap.xml');

function fetchAll(table, select) {
  // Page past Supabase's 1000-row cap.
  const page = (from) => new Promise((resolve) => {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}&offset=${from}&limit=1000`;
    https.get(url, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { resolve([]); } });
    }).on('error', () => resolve([]));
  });
  return (async () => {
    const out = [];
    for (let from = 0; ; from += 1000) {
      const rows = await page(from);
      if (!Array.isArray(rows) || rows.length === 0) break;
      out.push(...rows);
      if (rows.length < 1000) break;
    }
    return out;
  })();
}

const slugify = (n) => (n || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
function carSlug(c) {
  const name = (c.name || '').trim(), brand = (c.brand || '').trim();
  const full = brand && name && name.toLowerCase().indexOf(brand.toLowerCase()) !== 0 ? brand + ' ' + name : name;
  return slugify(full);
}

const entry = (loc, prio) => `  <url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>${prio}</priority></url>`;

(async () => {
  const cars = await fetchAll('cars', 'brand,name,is_active');
  const carSlugs = [...new Set(cars.filter((c) => c.is_active !== false).map(carSlug).filter(Boolean))];

  const hotels = await fetchAll('accommodations', 'slug,is_active');
  const counts = {};
  hotels.forEach((h) => { if (h.slug) counts[h.slug] = (counts[h.slug] || 0) + 1; });
  const hotelSlugs = [...new Set(hotels
    .filter((h) => h.slug && counts[h.slug] === 1 && h.is_active !== false)
    .map((h) => h.slug))].sort();

  // Nightlife + wellness detail pages are data-driven (fetch by slug), and
  // both tables have a unique index on slug — every slug resolves.
  const clubs = await fetchAll('nightclubs', 'slug,is_active');
  const clubSlugs = [...new Set(clubs.filter((r) => r.slug && r.is_active !== false).map((r) => r.slug))].sort();
  const spas = await fetchAll('wellness', 'slug,is_active');
  const spaSlugs = [...new Set(spas.filter((r) => r.slug && r.is_active !== false).map((r) => r.slug))].sort();

  // Restaurants: slugs are unique (backfilled), DiningDetailPage fetches by slug.
  const rests = await fetchAll('restaurants', 'slug,is_active');
  const restSlugs = [...new Set(rests.filter((r) => r.slug && r.is_active !== false).map((r) => r.slug))].sort();

  const block = [
    '  <!-- BEGIN generated: product detail pages (scripts/gen-product-sitemap.js) -->',
    ...restSlugs.map((s) => entry(`${BASE}/catalog/dining/${s}`, '0.9')),
    ...carSlugs.map((s) => entry(`${BASE}/catalog/exotic-cars/${s}`, '0.8')),
    ...hotelSlugs.map((s) => entry(`${BASE}/catalog/hotels/${s}`, '0.7')),
    ...clubSlugs.map((s) => entry(`${BASE}/catalog/nightlife/${s}`, '0.8')),
    ...spaSlugs.map((s) => entry(`${BASE}/catalog/wellness/${s}`, '0.7')),
    '  <!-- END generated -->',
  ].join('\n');

  let xml = fs.readFileSync(SITEMAP, 'utf8');
  xml = xml.replace(/\s*<!-- BEGIN generated:[\s\S]*?<!-- END generated -->/g, '');
  // Drop legacy hand-written nightlife detail entries (pre-DB pretty slugs that
  // rendered a hardcoded placeholder); the generated block replaces them.
  xml = xml.replace(/\s*<url>\s*<loc>https:\/\/alfredconcierge\.app\/catalog\/nightlife\/[a-z0-9-]+<\/loc>[\s\S]*?<\/url>/g, '');
  // Drop legacy dining detail entries too — they covered only 521 of the 741
  // slugged restaurants; the generated block covers all active ones.
  xml = xml.replace(/\s*<url>\s*<loc>https:\/\/alfredconcierge\.app\/catalog\/dining\/[^<]+<\/loc>[\s\S]*?<\/url>/g, '');
  xml = xml.replace(/<\/urlset>/, `${block}\n</urlset>`);
  fs.writeFileSync(SITEMAP, xml, 'utf8');

  console.log(`cars: ${carSlugs.length}, hotels: ${hotelSlugs.length}, nightlife: ${clubSlugs.length}, wellness: ${spaSlugs.length}`);
  console.log(`total <loc>: ${(xml.match(/<loc>/g) || []).length}`);
})();
