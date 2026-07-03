#!/usr/bin/env node
/**
 * Applies the fetched photo updates via Supabase REST. Requires the
 * temporary backfill RLS policy to be active (created/dropped via admin).
 * Uses Prefer: return=representation and checks the response actually
 * contains the row — no more silent-204 false positives.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPA_HOST = 'fbdgbnnkgyljehtccgaq.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZGdibm5rZ3lsamVodGNjZ2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NjA5MzgsImV4cCI6MjA4MjMzNjkzOH0.NmlSkGMDZ-DmhV0bmSCFPQmuFNo4E5H-Sz1cjRyYs8Q';
const IN = path.join(__dirname, '.photo-updates');
const P = 'https://static.cupid.travel/hotels/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function patch(id, obj) {
  return new Promise((resolve) => {
    const body = JSON.stringify(obj);
    const req = https.request(
      { host: SUPA_HOST, path: '/rest/v1/accommodations?id=eq.' + id + '&select=id', method: 'PATCH',
        headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' } },
      (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => resolve({ status: r.statusCode, body: d })); }
    );
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.write(body);
    req.end();
  });
}

(async () => {
  const rows = [];
  for (const f of fs.readdirSync(IN).filter((f) => f.endsWith('.sql')).sort()) {
    for (const line of fs.readFileSync(path.join(IN, f), 'utf8').split('\n').filter(Boolean)) {
      const hero = (line.match(/hero_image_url='([^']+)'/) || [])[1];
      const gal = (line.match(/ARRAY\[([^\]]*)\]/) || [])[1] || '';
      const lite = (line.match(/liteapi_id='([^']+)'/) || [])[1];
      const id = (line.match(/WHERE id='([^']+)'/) || [])[1];
      if (!hero || !id || !lite) continue;
      const g = gal.split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean);
      rows.push({ id, hero, gallery: g, lite });
    }
  }
  console.log('rows to apply:', rows.length);

  let ok = 0, fail = 0, i = 0;
  for (const r of rows) {
    i++;
    const res = await patch(r.id, { hero_image_url: r.hero, photos_order: r.gallery, liteapi_id: r.lite, updated_at: new Date().toISOString() });
    // Verified write: representation must echo the row id back.
    if (res.status >= 200 && res.status < 300 && res.body.includes(r.id)) ok++;
    else { fail++; if (fail <= 5) console.log('FAIL', r.id, res.status, res.body.slice(0, 120)); }
    if (i % 300 === 0) console.log(`[apply ${i}/${rows.length}] ok:${ok} fail:${fail}`);
    await sleep(30);
  }
  console.log(`\n==== APPLY DONE ==== ok:${ok} fail:${fail}`);
})();
