#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const index = read("index.html");
const app = read("src/App.jsx");
const car = read("src/pages/CarDetailPage.jsx");
const dining = read("src/pages/DiningPage.jsx");
const nightlife = read("src/pages/NightlifePage.jsx");
const wellness = read("src/pages/WellnessPage.jsx");
const yachts = read("src/pages/YachtsPage.jsx");
const admin = read("src/pages/AdminPage.jsx");
const proposal = read("src/pages/ProposalBuilderPage.jsx");
const catalogBody = read("src/components/CatalogSeoBody.jsx");
const jsonld = read("src/lib/jsonld.js");
const sitemap = read("public/sitemap.xml");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/\/$/, ""));

if ((index.match(/rel="canonical"/g) || []).length !== 1) failures.push("index.html must contain exactly one canonical");
if (/hreflang=/.test(index)) failures.push("index.html contains unsupported hreflang alternates");
if (/%VITE_[A-Z_]+%|YOURAPPID|REPLACE_WITH_YOUR/.test(index + app)) failures.push("verification or app placeholders remain");
if (/aggregateRating/.test(index)) failures.push("unsubstantiated homepage aggregateRating remains");
if (/clip:\s*"rect\(0,0,0,0\)"/.test(app)) failures.push("hidden crawler-only content remains");
if (/Math\.random\(\).*reviews|var REVIEWS=/.test(car)) failures.push("fabricated car reviews remain");
if (/direct relationships|guaranteed placement|insurance included|full crew, catering|instant quotes/i.test(catalogBody)) failures.push("unsupported AEO claims remain in visible catalog copy");
if (/schema\.org\/InStock/.test(jsonld)) failures.push("request inventory is incorrectly marked InStock");
if (/VITE_SUPABASE_SERVICE_KEY/.test(admin)) failures.push("admin page could expose a Supabase service-role key");
if (!/path="\/admin" noindex/.test(admin)) failures.push("admin page must be noindex");
if (!/path="\/proposal" noindex/.test(proposal)) failures.push("proposal page must be noindex");
for (const [name,source] of [["dining",dining],["nightlife",nightlife],["wellness",wellness],["yachts",yachts]]) {
  if (!new RegExp(`<a href=\\{\\"/catalog/${name === "yachts" ? "yachts" : name}/`).test(source)) failures.push(`${name} cards are not crawlable anchors`);
}
if (new Set(locs).size !== locs.length) failures.push("sitemap contains duplicate URLs");
if (/<(?:lastmod|changefreq|priority)>/.test(sitemap)) failures.push("sitemap contains stale or ignored metadata");

if (failures.length) {
  console.error(failures.map((f) => `- ${f}`).join("\n"));
  process.exit(1);
}
console.log(`SEO validation passed (${locs.length} sitemap URLs)`);
