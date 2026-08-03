#!/usr/bin/env node

/**
 * Generate a small, route-specific HTML shell for every sitemap URL.
 * React replaces the visible fallback immediately for normal visitors, while
 * non-JS crawlers and link unfurlers receive the correct title, description,
 * canonical and a useful crawlable parent link instead of homepage metadata.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const BASE = "https://alfredconcierge.app";
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const sitemap = fs.readFileSync(path.join(ROOT, "public", "sitemap.xml"), "utf8");

const routes = [...sitemap.matchAll(/<loc>(https:\/\/alfredconcierge\.app(?:\/[^<]*)?)<\/loc>/g)]
  .map((m) => new URL(m[1].replace(/&amp;/g, "&")).pathname)
  .filter((route) => route !== "/");

function words(value) {
  return decodeURIComponent(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bSf(\d+)/g, "SF$1")
    .replace(/\bVip\b/g, "VIP");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

function details(route) {
  const parts = route.split("/").filter(Boolean);
  const slug = parts[parts.length - 1] || "Alfred Concierge";
  const name = words(slug);
  const cityName = route === "/city/saint-tropez" ? "Saint-Tropez" : name;
  const parent = "/" + parts.slice(0, -1).join("/");

  if (route.startsWith("/catalog/dining/")) return {title:`${name} — Restaurant Request | Alfred`, h1:name, description:`View ${name} restaurant details and request a table through Alfred Concierge. Confirm the date, time, party size and current availability with the concierge.`, parent:"/catalog/dining", parentLabel:"Browse restaurants"};
  if (route.startsWith("/catalog/hotels/")) return {title:`${name} — Hotel Request | Alfred Concierge`, h1:name, description:`View ${name} hotel details and request current rates, availability and eligible stay benefits through Alfred Concierge.`, parent:"/catalog/hotels", parentLabel:"Browse hotels"};
  if (route.startsWith("/catalog/exotic-cars/")) return {title:`${name} — Car Rental Request | Alfred`, h1:name, description:`View ${name} specifications and indicative pricing, then request current availability and final rental terms through Alfred Concierge.`, parent:"/catalog/exotic-cars", parentLabel:"Browse exotic cars"};
  if (route.startsWith("/catalog/nightlife/")) return {title:`${name} — Nightlife Request | Alfred`, h1:name, description:`View ${name} venue details and request current table or guest-list options through Alfred Concierge.`, parent:"/catalog/nightlife", parentLabel:"Browse nightlife"};
  if (route.startsWith("/catalog/wellness/")) return {title:`${name} — Wellness Request | Alfred`, h1:name, description:`View ${name} wellness details and request current treatment availability through Alfred Concierge.`, parent:"/catalog/wellness", parentLabel:"Browse wellness"};
  if (route.startsWith("/catalog/yachts/")) return {title:`${name} — Yacht Charter Request | Alfred`, h1:name, description:`View ${name} charter details and request current availability and final terms through Alfred Concierge.`, parent:"/catalog/yachts", parentLabel:"Browse yachts"};
  if (route.startsWith("/catalog/jets/")) return {title:`${name} — Private Jet Charter Request | Alfred`, h1:name, description:`View ${name} aircraft details and request current charter options and a full quote through Alfred Concierge.`, parent:"/catalog/jets", parentLabel:"Browse private jets"};
  if (route.startsWith("/best/")) return {title:`${name} | Alfred Concierge Guide`, h1:name, description:`A concierge-curated guide to ${name.toLowerCase()}, with links to relevant catalog pages and a direct request option.`, parent:"/catalog", parentLabel:"Browse the catalog"};
  if (route.startsWith("/city/")) return {title:`${cityName} Concierge — Restaurants, Hotels & Cars | Alfred`, h1:`Alfred Concierge in ${cityName}`, description:`Explore restaurants, hotels, nightlife, cars and other concierge requests in ${cityName}.`, parent:"/catalog", parentLabel:"Browse the catalog"};

  const labels = {
    "/catalog":"Luxury Services Catalog", "/catalog/dining":"Restaurants", "/catalog/hotels":"Luxury Hotels",
    "/catalog/exotic-cars":"Exotic Cars", "/catalog/nightlife":"VIP Nightlife", "/catalog/yachts":"Yacht Charters",
    "/catalog/jets":"Private Jet Charters", "/catalog/wellness":"Wellness and Spas", "/events":"VIP Event Hospitality",
    "/blog":"Alfred Concierge Journal", "/about":"About Alfred Concierge", "/how-it-works":"How Alfred Works",
    "/pricing":"Alfred Membership", "/contact":"Contact Alfred Concierge", "/business":"Partner with Alfred"
  };
  const h1 = labels[route] || name;
  return {title:`${h1} | Alfred Concierge`, h1, description:`Explore ${h1.toLowerCase()} and send a request to Alfred Concierge.`, parent:parent === "/" ? "/" : parent, parentLabel:"Back to Alfred"};
}

function replaceMeta(html, route, meta) {
  const canonical = BASE + route;
  const safeTitle = escapeHtml(meta.title.slice(0, 68));
  const safeDescription = escapeHtml(meta.description.slice(0, 165));
  const fallback = `<main data-static-seo="true" style="max-width:760px;margin:0 auto;padding:72px 24px;color:#F4F4F5;font:16px/1.65 system-ui,sans-serif"><h1>${escapeHtml(meta.h1)}</h1><p>${safeDescription}</p><p><a href="${escapeHtml(meta.parent)}" style="color:#F4F4F5">${escapeHtml(meta.parentLabel)} →</a></p></main>`;
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/, `<meta name="description" content="${safeDescription}">`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?\s*>/, `<link rel="canonical" href="${canonical}">`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?\s*>/, `<meta property="og:title" content="${safeTitle}">`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?\s*>/, `<meta property="og:description" content="${safeDescription}">`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?\s*>/, `<meta property="og:url" content="${canonical}">`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?\s*>/, `<meta name="twitter:title" content="${safeTitle}">`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?\s*>/, `<meta name="twitter:description" content="${safeDescription}">`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${fallback}</div>`);
}

let written = 0;
for (const route of [...new Set(routes)]) {
  if (route.includes("..")) continue;
  const output = path.join(DIST, route.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.dirname(output), {recursive:true});
  fs.writeFileSync(output, replaceMeta(template, route, details(route)), "utf8");
  written += 1;
}
console.log(`static SEO pages: ${written}`);
