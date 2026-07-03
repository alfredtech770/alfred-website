#!/usr/bin/env node
// Compacts .photo-updates/*.sql (one UPDATE per row) into .photo-compact/
// batch-NN.sql files: one UPDATE...FROM (VALUES ...) per 200 hotels, with the
// repeated CDN prefix factored out. ~3x smaller for applying via admin SQL.
const fs = require('fs');
const path = require('path');

const IN = path.join(__dirname, '.photo-updates');
const OUT = path.join(__dirname, '.photo-compact');
const P = 'https://static.cupid.travel/hotels/';

const rows = [];
for (const f of fs.readdirSync(IN).filter((f) => f.endsWith('.sql')).sort()) {
  for (const line of fs.readFileSync(path.join(IN, f), 'utf8').split('\n').filter(Boolean)) {
    const hero = (line.match(/hero_image_url='([^']+)'/) || [])[1];
    const gal = (line.match(/ARRAY\[([^\]]*)\]/) || [])[1] || '';
    const lite = (line.match(/liteapi_id='([^']+)'/) || [])[1];
    const id = (line.match(/WHERE id='([^']+)'/) || [])[1];
    if (!hero || !id || !lite) continue;
    const g = gal.split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean).slice(0, 5);
    const c = (u) => (u.startsWith(P) ? u.slice(P.length) : u);
    rows.push({ id, lite, h: c(hero), g: g.map(c) });
  }
}
console.log('parsed rows:', rows.length);

fs.mkdirSync(OUT, { recursive: true });
const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const chunks = [];
for (let i = 0; i < rows.length; i += 200) chunks.push(rows.slice(i, i + 200));
chunks.forEach((ch, ci) => {
  const vals = ch.map((r) => `(${q(r.id)},${q(r.h)},${q(r.lite)},ARRAY[${r.g.map(q).join(',')}]::text[])`).join(',\n');
  const sql = `UPDATE accommodations a SET
 hero_image_url = CASE WHEN v.h LIKE 'http%' THEN v.h ELSE '${P}'||v.h END,
 photos_order = (SELECT COALESCE(array_agg(CASE WHEN x LIKE 'http%' THEN x ELSE '${P}'||x END),'{}') FROM unnest(v.g) x),
 liteapi_id = v.l, updated_at = now()
FROM (VALUES
${vals}
) AS v(id,h,l,g)
WHERE a.id = v.id::uuid;`;
  fs.writeFileSync(path.join(OUT, 'batch-' + String(ci + 1).padStart(2, '0') + '.sql'), sql);
});
const sizes = fs.readdirSync(OUT).map((f) => fs.statSync(path.join(OUT, f)).size);
console.log('compact batches:', sizes.length, 'avg bytes:', Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length));
