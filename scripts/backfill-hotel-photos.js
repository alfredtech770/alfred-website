#!/usr/bin/env node
/**
 * Backfill real hotel photos from LiteAPI for every active accommodation
 * still showing an Unsplash placeholder.
 *
 * Pipeline:
 *   1. Geocode each distinct city -> ISO country code via Nominatim (OSM),
 *      1.15s apart per their usage policy, cached in .city-countries.json.
 *   2. For each hotel: LiteAPI /data/hotels?countryCode&hotelName search,
 *      strict name-similarity scoring (stars used as a tiebreaker).
 *   3. Confident match -> /data/hotel details -> hero + up to 11 gallery
 *      photos + liteapi_id PATCHed into Supabase.
 *   4. Ambiguous/no-match -> logged, hotel keeps its current image.
 *
 * Incremental + resumable: progress NDJSON in .backfill-progress.ndjson;
 * re-running skips completed ids. Run: node scripts/backfill-hotel-photos.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

// ---- config ----
const DIR = __dirname;
try {
  fs.readFileSync(path.join(DIR, '..', '.env.local'), 'utf8').split('\n').forEach((l) => {
    const m = l.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  });
} catch (e) {}
const LITE_KEY = process.env.LITEAPI_KEY;
if (!LITE_KEY) { console.error('LITEAPI_KEY missing'); process.exit(1); }
const SUPA_HOST = 'fbdgbnnkgyljehtccgaq.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZGdibm5rZ3lsamVodGNjZ2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NjA5MzgsImV4cCI6MjA4MjMzNjkzOH0.NmlSkGMDZ-DmhV0bmSCFPQmuFNo4E5H-Sz1cjRyYs8Q';
const CITY_CACHE = path.join(DIR, '.city-countries.json');
const PROGRESS = path.join(DIR, '.backfill-progress.ndjson');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function request(opts, body) {
  return new Promise((resolve) => {
    const req = https.request(opts, (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => {
        let j = null; try { j = JSON.parse(d); } catch (e) {}
        resolve({ status: r.statusCode, json: j, raw: d });
      });
    });
    req.on('error', () => resolve({ status: 0, json: null }));
    if (body) req.write(body);
    req.end();
  });
}

async function lite(pathname, attempt = 0) {
  const r = await request({ host: 'api.liteapi.travel', path: pathname, headers: { 'X-API-Key': LITE_KEY, accept: 'application/json' } });
  if ((r.status === 429 || r.status >= 500) && attempt < 4) {
    await sleep(1000 * Math.pow(2, attempt));
    return lite(pathname, attempt + 1);
  }
  return r;
}

async function supaGet(pathname) {
  const r = await request({ host: SUPA_HOST, path: pathname, headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY } });
  return r.json || [];
}

// Verified write: RLS can silently update 0 rows while returning 204, so we
// ask for the row back and only count it as success when it echoes.
// (Requires the temporary backfill RLS policy to be active.)
async function supaPatch(pathname, obj) {
  const body = JSON.stringify(obj);
  const r = await request({ host: SUPA_HOST, path: pathname + '&select=id', method: 'PATCH', headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' } }, body);
  return r.status >= 200 && r.status < 300 && r.json && r.json.length ? 204 : 0;
}

// ---- name matching ----
const STOP = new Set(['hotel', 'hotels', 'the', 'a', 'an', 'de', 'la', 'le', 'du', 'des', 'and', '&', 'by']);
const CHAINS = /\bby (ihg|marriott|hilton|hyatt|accor|sonesta|wyndham|radisson)\b/g;
function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(CHAINS, '').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((t) => t && !STOP.has(t));
}
function score(a, b) {
  const A = new Set(norm(a)), B = new Set(norm(b));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  A.forEach((t) => { if (B.has(t)) inter++; });
  const jac = inter / (A.size + B.size - inter);
  const contain = inter === Math.min(A.size, B.size) ? 0.15 : 0;
  return Math.min(1, jac + contain);
}

// ---- geocoding ----
let cityCC = {};
try { cityCC = JSON.parse(fs.readFileSync(CITY_CACHE, 'utf8')); } catch (e) {}
async function geocode(city) {
  if (city in cityCC) return cityCC[city];
  const r = await request({ host: 'nominatim.openstreetmap.org', path: '/search?format=jsonv2&limit=1&addressdetails=1&q=' + encodeURIComponent(city), headers: { 'User-Agent': 'AlfredConcierge-photo-backfill/1.0 (ethan@alfredconcierge.app)' } });
  const cc = (Array.isArray(r.json) && r.json[0] && r.json[0].address && r.json[0].address.country_code) ? r.json[0].address.country_code.toUpperCase() : null;
  cityCC[city] = cc;
  fs.writeFileSync(CITY_CACHE, JSON.stringify(cityCC, null, 1));
  await sleep(1150);
  return cc;
}

(async () => {
  // done-set for resume
  const done = new Set();
  try { fs.readFileSync(PROGRESS, 'utf8').split('\n').filter(Boolean).forEach((l) => { try { done.add(JSON.parse(l).id); } catch (e) {} }); } catch (e) {}
  const log = (o) => fs.appendFileSync(PROGRESS, JSON.stringify(o) + '\n');

  // fetch all active hotels
  const hotels = [];
  for (let from = 0; ; from += 1000) {
    const rows = await supaGet('/rest/v1/accommodations?select=id,slug,name,city,star_rating,hero_image_url,liteapi_id&is_active=eq.true&order=id.asc&offset=' + from + '&limit=1000');
    if (!rows.length) break;
    hotels.push(...rows);
    if (rows.length < 1000) break;
  }
  const targets = hotels.filter((h) => h.name && h.city && (!h.hero_image_url || h.hero_image_url.includes('unsplash')) && !done.has(h.id));
  console.log(`hotels: ${hotels.length} active, ${targets.length} to process (resume skip: ${done.size})`);

  // geocode distinct cities first (cached)
  const cities = [...new Set(targets.map((h) => h.city))];
  const uncached = cities.filter((c) => !(c in cityCC));
  console.log(`cities: ${cities.length} distinct, ${uncached.length} to geocode (~${Math.round(uncached.length * 1.15 / 60)} min)`);
  for (const c of uncached) await geocode(c);

  let matched = 0, ambiguous = 0, nocc = 0, nores = 0, patchfail = 0, i = 0;
  for (const h of targets) {
    i++;
    if (i % 100 === 0) console.log(`[${i}/${targets.length}] matched:${matched} ambiguous:${ambiguous} no-country:${nocc} no-result:${nores}`);
    const cc = cityCC[h.city];
    if (!cc) { nocc++; log({ id: h.id, slug: h.slug, status: 'no-country', city: h.city }); continue; }

    const sr = await lite('/v3.0/data/hotels?countryCode=' + cc + '&hotelName=' + encodeURIComponent(h.name) + '&limit=10');
    const cands = (sr.json && sr.json.data) || [];
    await sleep(180);
    if (!cands.length) { nores++; log({ id: h.id, slug: h.slug, status: 'no-result', cc }); continue; }

    // best candidate by name score, stars as tiebreak
    let best = null, bestS = 0;
    for (const c of cands) {
      let s = score(h.name, c.name);
      if (h.star_rating && c.stars && Math.abs(h.star_rating - c.stars) <= 1) s += 0.05;
      if (s > bestS) { bestS = s; best = c; }
    }
    const confident = bestS >= 0.78 || (bestS >= 0.6 && h.star_rating && best.stars && Math.abs(h.star_rating - best.stars) <= 1);
    if (!best || !confident) { ambiguous++; log({ id: h.id, slug: h.slug, status: 'ambiguous', score: +bestS.toFixed(2), candidate: best && best.name }); continue; }

    const dr = await lite('/v3.0/data/hotel?hotelId=' + best.id);
    await sleep(180);
    const hd = dr.json && dr.json.data;
    const imgs = hd ? (hd.hotelImages || []).map((im) => im.urlHd || im.url).filter(Boolean) : [];
    const main = (hd && hd.main_photo) || imgs[0] || best.main_photo;
    if (!main) { ambiguous++; log({ id: h.id, slug: h.slug, status: 'no-photos', candidate: best.name }); continue; }
    const gallery = imgs.filter((u) => u !== main).slice(0, 11);

    const st = await supaPatch('/rest/v1/accommodations?id=eq.' + h.id, { hero_image_url: main, photos_order: gallery, liteapi_id: best.id, updated_at: new Date().toISOString() });
    if (st === 204) { matched++; log({ id: h.id, slug: h.slug, status: 'ok', liteapi_id: best.id, name: best.name, score: +bestS.toFixed(2), photos: 1 + gallery.length }); }
    else { patchfail++; log({ id: h.id, slug: h.slug, status: 'patch-fail', http: st }); }
  }

  console.log('\n==== DONE ====');
  console.log(`matched+updated: ${matched}`);
  console.log(`ambiguous/no-photos (kept stock, review list): ${ambiguous}`);
  console.log(`no-result in LiteAPI: ${nores}`);
  console.log(`city not geocoded: ${nocc}`);
  console.log(`patch failures: ${patchfail}`);
})();
