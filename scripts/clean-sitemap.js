#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "public", "sitemap.xml");
const xml = fs.readFileSync(file, "utf8");
const opening = xml.match(/^[\s\S]*?<urlset\b[^>]*>/);
if (!opening) throw new Error("public/sitemap.xml does not contain a urlset");

const seen = new Set();
const urls = [];
for (const match of xml.matchAll(/<url>\s*[\s\S]*?<\/url>/g)) {
  let block = match[0]
    .replace(/\s*<lastmod>[^<]*<\/lastmod>/g, "")
    .replace(/\s*<changefreq>[^<]*<\/changefreq>/g, "")
    .replace(/\s*<priority>[^<]*<\/priority>/g, "");
  const loc = block.match(/<loc>([^<]+)<\/loc>/);
  if (!loc || !/^https:\/\/alfredconcierge\.app(?:\/|$)/.test(loc[1])) continue;
  if (loc[1].replace(/\/$/, "") === "https://alfredconcierge.app/membership") continue;
  const key = loc[1].replace(/\/$/, "") || "https://alfredconcierge.app";
  if (seen.has(key)) continue;
  seen.add(key);
  urls.push("  " + block.trim().replace(/\n\s*/g, "\n    "));
}

const citySlugs = ["miami", "paris", "ibiza", "saint-tropez", "mykonos", "dubai", "london"];
const serviceSlugs = ["hotels", "restaurants", "nightlife", "exotic-cars", "yachts", "jets", "wellness"];
for (const city of citySlugs) {
  for (const service of serviceSlugs) {
    const loc = `https://alfredconcierge.app/city/${city}/${service}`;
    if (seen.has(loc)) continue;
    seen.add(loc);
    urls.push(`  <url>\n    <loc>${loc}</loc>\n  </url>`);
  }
}

const output = `${opening[0]}\n${urls.join("\n")}\n</urlset>\n`;
fs.writeFileSync(file, output, "utf8");
console.log(`sitemap: ${urls.length} unique URLs`);
