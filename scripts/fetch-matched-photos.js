#!/usr/bin/env node
/**
 * Recovery step: the backfill PATCHes were silently blocked by RLS (204 with
 * zero rows). All confident matches are in .backfill-progress.ndjson with
 * their liteapi_id — re-fetch each hotel's gallery and emit batched SQL
 * files (scripts/.photo-updates/updates-NNN.sql) to apply via the admin
 * SQL channel. Resumable via .photo-fetch-done.txt.
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
const PROGRESS = path.join(DIR, '.backfill-progress.ndjson');
const OUTDIR = path.join(DIR, '.photo-updates');
const DONE = path.join(DIR, '.photo-fetch-done.txt');
const BATCH = 100;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function lite(pathname, attempt = 0) {
  return new Promise((resolve) => {
    https.get({ host: 'api.liteapi.travel', path: pathname, headers: { 'X-API-Key': LITE_KEY, accept: 'application/json' } }, (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', async () => {
        if ((r.statusCode === 429 || r.statusCode >= 500) && attempt < 4) {
          await sleep(1000 * Math.pow(2, attempt));
          resolve(await lite(pathname, attempt + 1));
        } else {
          try { resolve(JSON.parse(d)); } catch (e) { resolve(null); }
        }
      });
    }).on('error', () => resolve(null));
  });
}

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";

(async () => {
  // matched entries (latest status wins per id)
  const latest = {};
  fs.readFileSync(PROGRESS, 'utf8').split('\n').filter(Boolean).forEach((l) => {
    try { const o = JSON.parse(l); latest[o.id] = o; } catch (e) {}
  });
  const matches = Object.values(latest).filter((o) => o.status === 'ok' || o.status === 'ok-p2');

  const done = new Set();
  try { fs.readFileSync(DONE, 'utf8').split('\n').filter(Boolean).forEach((id) => done.add(id)); } catch (e) {}
  fs.mkdirSync(OUTDIR, { recursive: true });

  const todo = matches.filter((m) => !done.has(m.id));
  console.log(`matched: ${matches.length}, to fetch: ${todo.length}`);

  let batch = [], fileNo = fs.readdirSync(OUTDIR).length, fetched = 0, failed = 0;
  const flush = () => {
    if (!batch.length) return;
    fileNo++;
    fs.writeFileSync(path.join(OUTDIR, 'updates-' + String(fileNo).padStart(3, '0') + '.sql'), batch.join('\n'));
    batch = [];
  };

  for (const m of todo) {
    const j = await lite('/v3.0/data/hotel?hotelId=' + m.liteapi_id);
    await sleep(160);
    const hd = j && j.data;
    const imgs = hd ? (hd.hotelImages || []).map((im) => im.urlHd || im.url).filter(Boolean) : [];
    const main = (hd && hd.main_photo) || imgs[0];
    if (!main) { failed++; fs.appendFileSync(DONE, m.id + '\n'); continue; }
    const gallery = imgs.filter((u) => u !== main).slice(0, 8);
    batch.push(
      'UPDATE accommodations SET hero_image_url=' + q(main) +
      ', photos_order=ARRAY[' + gallery.map(q).join(',') + ']::text[]' +
      ', liteapi_id=' + q(m.liteapi_id) +
      ", updated_at=now() WHERE id=" + q(m.id) + ';'
    );
    fetched++;
    fs.appendFileSync(DONE, m.id + '\n');
    if (batch.length >= BATCH) flush();
    if (fetched % 250 === 0) console.log(`[fetch ${fetched}/${todo.length}]`);
  }
  flush();
  console.log(`\n==== FETCH DONE ==== fetched:${fetched} no-photos:${failed} sqlFiles:${fs.readdirSync(OUTDIR).length}`);
})();
