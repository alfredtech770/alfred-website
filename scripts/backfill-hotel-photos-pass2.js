#!/usr/bin/env node
/**
 * Pass 2 of the photo backfill: retries hotels that pass 1 logged as
 * `no-result` or `ambiguous`. Root cause of most pass-1 misses: our hotel
 * names carry location suffixes ("Amangiri Utah", "Aman New Delhi") that
 * LiteAPI's hotelName search doesn't tolerate.
 *
 * Strategy: progressively trim trailing tokens (up to 3) and re-search.
 * Confidence is scored against the TRIMMED variant with stricter rules the
 * shorter the variant gets (single-token variants require an exact name
 * match plus a star-rating sanity check). Everything else identical to
 * pass 1: confident -> photos + liteapi_id PATCHed; else logged for review.
 *
 * Run after pass 1 completes: node scripts/backfill-hotel-photos-pass2.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

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
      r.on('end', () => { let j = null; try { j = JSON.parse(d); } catch (e) {} resolve({ status: r.statusCode, json: j }); });
    });
    req.on('error', () => resolve({ status: 0, json: null }));
    if (body) req.write(body);
    req.end();
  });
}
async function lite(pathname, attempt = 0) {
  const r = await request({ host: 'api.liteapi.travel', path: pathname, headers: { 'X-API-Key': LITE_KEY, accept: 'application/json' } });
  if ((r.status === 429 || r.status >= 500) && attempt < 4) { await sleep(1000 * Math.pow(2, attempt)); return lite(pathname, attempt + 1); }
  return r;
}
async function supaGet(p) { const r = await request({ host: SUPA_HOST, path: p, headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY } }); return r.json || []; }
async function supaPatch(p, obj) {
  const r = await request({ host: SUPA_HOST, path: p, method: 'PATCH', headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' } }, JSON.stringify(obj));
  return r.status;
}

const STOP = new Set(['hotel', 'hotels', 'the', 'a', 'an', 'de', 'la', 'le', 'du', 'des', 'and', '&', 'by']);
const CHAINS = /\bby (ihg|marriott|hilton|hyatt|accor|sonesta|wyndham|radisson)\b/g;
function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(CHAINS, '').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((t) => t && !STOP.has(t));
}
function score(aTokens, bName) {
  const A = new Set(aTokens), B = new Set(norm(bName));
  if (!A.size || !B.size) return 0;
  let inter = 0; A.forEach((t) => { if (B.has(t)) inter++; });
  const jac = inter / (A.size + B.size - inter);
  const contain = inter === Math.min(A.size, B.size) ? 0.15 : 0;
  return Math.min(1, jac + contain);
}

(async () => {
  const cityCC = JSON.parse(fs.readFileSync(CITY_CACHE, 'utf8'));
  // Latest status per id from the progress log
  const latest = {};
  fs.readFileSync(PROGRESS, 'utf8').split('\n').filter(Boolean).forEach((l) => { try { const o = JSON.parse(l); latest[o.id] = o.status; } catch (e) {} });
  // ids are UUID strings — keep them as-is.
  const retryIds = new Set(Object.entries(latest).filter(([, s]) => s === 'no-result' || s === 'ambiguous').map(([id]) => id));
  const log = (o) => fs.appendFileSync(PROGRESS, JSON.stringify(o) + '\n');

  const hotels = [];
  for (let from = 0; ; from += 1000) {
    const rows = await supaGet('/rest/v1/accommodations?select=id,slug,name,city,star_rating,hero_image_url&is_active=eq.true&order=id.asc&offset=' + from + '&limit=1000');
    if (!rows.length) break;
    hotels.push(...rows);
    if (rows.length < 1000) break;
  }
  const targets = hotels.filter((h) => retryIds.has(h.id) && (!h.hero_image_url || h.hero_image_url.includes('unsplash')));
  console.log(`pass2 targets: ${targets.length}`);

  let matched = 0, still = 0, i = 0;
  for (const h of targets) {
    i++;
    if (i % 250 === 0) console.log(`[p2 ${i}/${targets.length}] matched:${matched} unresolved:${still}`);
    const cc = cityCC[h.city];
    if (!cc) { still++; log({ id: h.id, slug: h.slug, status: 'no-result-p2' }); continue; }

    const full = norm(h.name);
    const cityTok = new Set(norm(h.city));
    let found = null, foundScore = 0, variantLen = 0;

    // Try trimmed variants: drop up to 3 trailing tokens (location suffixes),
    // preferring to drop tokens that appear in the city name first.
    for (let drop = 1; drop <= 3 && full.length - drop >= 1; drop++) {
      const variant = full.slice(0, full.length - drop);
      // Don't bother if we just dropped a token that's clearly part of the
      // brand (heuristic: dropped token not a city token AND variant < 2 tokens)
      const q = variant.join(' ');
      if (q.length < 4) break;
      const sr = await lite('/v3.0/data/hotels?countryCode=' + cc + '&hotelName=' + encodeURIComponent(q) + '&limit=10');
      await sleep(180);
      const cands = (sr.json && sr.json.data) || [];
      for (const c of cands) {
        const s = score(variant, c.name);
        if (s > foundScore) { foundScore = s; found = c; variantLen = variant.length; }
      }
      if (found && foundScore >= 0.85) break;
    }

    const starsOk = !h.star_rating || !found || !found.stars || Math.abs(h.star_rating - found.stars) <= 1;
    const confident = found && (
      (variantLen >= 2 && (foundScore >= 0.85 || (foundScore >= 0.7 && starsOk))) ||
      (variantLen === 1 && foundScore >= 0.99 && starsOk)
    );
    if (!confident) { still++; log({ id: h.id, slug: h.slug, status: 'no-result-p2', score: +foundScore.toFixed(2), candidate: found && found.name }); continue; }

    const dr = await lite('/v3.0/data/hotel?hotelId=' + found.id);
    await sleep(180);
    const hd = dr.json && dr.json.data;
    const imgs = hd ? (hd.hotelImages || []).map((im) => im.urlHd || im.url).filter(Boolean) : [];
    const main = (hd && hd.main_photo) || imgs[0] || found.main_photo;
    if (!main) { still++; log({ id: h.id, slug: h.slug, status: 'no-photos-p2', candidate: found.name }); continue; }
    const gallery = imgs.filter((u) => u !== main).slice(0, 11);

    const st = await supaPatch('/rest/v1/accommodations?id=eq.' + h.id, { hero_image_url: main, photos_order: gallery, liteapi_id: found.id, updated_at: new Date().toISOString() });
    if (st === 204) { matched++; log({ id: h.id, slug: h.slug, status: 'ok-p2', liteapi_id: found.id, name: found.name, score: +foundScore.toFixed(2), photos: 1 + gallery.length }); }
    else { still++; log({ id: h.id, slug: h.slug, status: 'patch-fail-p2', http: st }); }
  }

  console.log('\n==== PASS2 DONE ====');
  console.log(`pass2 matched+updated: ${matched}`);
  console.log(`still unresolved: ${still}`);
})();
