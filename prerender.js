#!/usr/bin/env node

/**
 * Pre-rendering script for SEO optimization
 * Generates static HTML files for all routes by rendering with Puppeteer
 * Also fetches dynamic routes (restaurants, yachts) from Supabase
 * Run after vite build: node prerender.js
 */

// Prerender static routes to real HTML so non-JS crawlers and AI engines see
// content without executing JS. On CI/Vercel we launch a serverless Chromium
// via @sparticuz/chromium; locally we use full puppeteer. Best-effort and
// fully fail-safe: any problem logs and exits 0, so the build always succeeds
// and the site still works as a SPA. Set PRERENDER=off to skip entirely.
const IS_CI = !!(process.env.CI || process.env.VERCEL || process.env.NOW_BUILDER);
if (process.env.PRERENDER === 'off') {
  console.log('⚠ PRERENDER=off — skipping prerender.');
  process.exit(0);
}

const fs = require('fs');
const path = require('path');
let handler;
try { handler = require('serve-handler'); } catch(e) { console.log('⚠ serve-handler not available — skipping prerender.'); process.exit(0); }

// Launch a headless browser: serverless Chromium on CI/Vercel, full puppeteer
// locally. Returns null (never throws) so callers can skip gracefully.
async function launchBrowser() {
  const COMMON_ARGS = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];
  try {
    if (IS_CI) {
      const chromium = require('@sparticuz/chromium');
      const puppeteerCore = require('puppeteer-core');
      return await puppeteerCore.launch({
        args: [...chromium.args, ...COMMON_ARGS],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }
    const puppeteer = require('puppeteer');
    return await puppeteer.launch({ headless: 'new', args: COMMON_ARGS });
  } catch (e) {
    console.log('⚠ Could not launch Chromium (' + e.message + ') — skipping prerender, SPA still works.');
    return null;
  }
}
const http = require('http');
const https = require('https');

// Supabase config
const SUPABASE_URL = 'https://fbdgbnnkgyljehtccgaq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZGdibm5rZ3lsamVodGNjZ2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NjA5MzgsImV4cCI6MjA4MjMzNjkzOH0.NmlSkGMDZ-DmhV0bmSCFPQmuFNo4E5H-Sz1cjRyYs8Q';

// Fetch all rows from a Supabase table
function supabaseFetch(table, select) {
  return new Promise((resolve) => {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select||'*'}`;
    const req = https.get(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve([]); }
      });
    });
    req.on('error', () => resolve([]));
  });
}

// Static routes to pre-render
const STATIC_ROUTES = [
  '/',
  '/business',
  '/catalog',
  '/catalog/dining',
  '/catalog/nightlife',
  '/catalog/exotic-cars',
  '/catalog/jets',
  '/catalog/yachts',
  '/catalog/wellness',
  '/catalog/hotels',
  '/events',
  '/events/monaco-grand-prix',
  '/events/miami-grand-prix',
  '/events/ibiza-opening',
  '/events/roland-garros',
  '/events/royal-ascot',
  '/blog',
  '/blog/best-restaurants-miami-2026',
  '/blog/monaco-grand-prix-2026-guide',
  '/blog/exotic-car-rental-miami-guide',
  '/blog/best-nightclubs-miami',
  '/blog/yacht-charter-miami-guide',
  '/blog/best-concierge-services',
  '/blog/private-jet-charter-guide',
  '/blog/miami-f1-grand-prix-2026',
  '/city/miami',
  '/city/paris',
  '/city/dubai',
  '/city/london',
  '/about',
  '/how-it-works',
  '/pricing',
  '/contact',
  // Long-tail landing pages (config in src/data/longtail.js — keep in sync)
  '/best/italian-restaurants-miami'
];

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

// Utility to create directory recursively
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Utility to get file path for a route
function getOutputPath(route) {
  if (route === '/') {
    return path.join(DIST_DIR, 'index.html');
  }
  return path.join(DIST_DIR, route.substring(1), 'index.html');
}

// Start local HTTP server to serve dist folder
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      return handler(req, res, {
        public: DIST_DIR,
        cleanUrls: true
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running at ${BASE_URL}`);
      resolve(server);
    });
  });
}

// Render a single route with Puppeteer
async function renderRoute(browser, route) {
  const page = await browser.newPage();
  const url = `${BASE_URL}${route}`;

  try {
    console.log(`Rendering: ${url}`);

    // Navigate to the page with network idle condition
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for React to finish rendering (waitForTimeout was removed in newer
    // puppeteer-core, so use a plain delay).
    await new Promise(r => setTimeout(r, 1200));

    // Only write if React actually rendered meaningful content — otherwise
    // leave the route to the SPA fallback rather than shipping a blank shell.
    const rootLen = await page.evaluate(() => (document.getElementById('root')?.innerHTML || '').length);
    if (rootLen < 500) {
      console.log(`  ⚠ Skipping ${route} — rendered content too small (${rootLen} chars)`);
      await page.close();
      return { route, success: true, skipped: true };
    }

    // Get the full HTML content
    const html = await page.content();

    // Get the output path and ensure directory exists
    const outputPath = getOutputPath(route);
    const outputDir = path.dirname(outputPath);
    ensureDir(outputDir);

    // Write the HTML file
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`✓ Saved: ${outputPath}`);

    await page.close();
    return { route, success: true };
  } catch (error) {
    console.error(`✗ Error rendering ${route}:`, error.message);
    await page.close();
    return { route, success: false, error: error.message };
  }
}

// Generate sitemap.xml with all pages
function generateSitemap(restaurantSlugs, yachtIds) {
  const base = 'https://alfredconcierge.app';
  const now = new Date().toISOString().split('T')[0];

  const staticUrls = STATIC_ROUTES.map(r =>
    `  <url><loc>${base}${r}</loc><changefreq>weekly</changefreq><priority>${r==='/'?'1.0':r.startsWith('/catalog')?'0.9':'0.85'}</priority></url>`
  ).join('\n');

  const restaurantUrls = restaurantSlugs.map(({slug, name, city}) =>
    `  <url><loc>${base}/catalog/dining/${slug}</loc><changefreq>weekly</changefreq><priority>0.9</priority>\n    <image:image><image:loc>${base}/og-image.jpg</image:loc><image:title>${name} ${city||'Miami'} — Book a Table | Alfred</image:title></image:image>\n  </url>`
  ).join('\n');

  const yachtUrls = yachtIds.map(({id, name, city}) =>
    `  <url><loc>${base}/catalog/yachts/${id}</loc><changefreq>weekly</changefreq><priority>0.9</priority>\n    <image:image><image:loc>${base}/og-image.jpg</image:loc><image:title>${name} Yacht Charter ${city||'Miami'} | Alfred</image:title></image:image>\n  </url>`
  ).join('\n');

  const nightlifeUrls = ['liv','e11even','story','club-space','raspoutine','castel','larc','coco-club','hyde-beach','le-carmen'].map(slug =>
    `  <url><loc>${base}/catalog/nightlife/${slug}</loc><changefreq>monthly</changefreq><priority>0.85</priority></url>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Static pages -->
${staticUrls}

  <!-- Nightlife venues -->
${nightlifeUrls}

  <!-- Restaurant detail pages -->
${restaurantUrls}

  <!-- Yacht detail pages -->
${yachtUrls}

</urlset>`;
}

// Main pre-rendering function
async function prerender() {
  console.log('Starting pre-rendering...\n');

  // Fetch dynamic routes from Supabase
  console.log('Fetching restaurants from Supabase...');
  const restaurants = await supabaseFetch('restaurants', 'slug,name,city');
  const restaurantSlugs = (restaurants||[]).filter(r => r.slug).map(r => ({slug:r.slug, name:r.name||'', city:r.city||'Miami'}));
  console.log(`Found ${restaurantSlugs.length} restaurants`);

  console.log('Fetching yachts from Supabase...');
  const yachts = await supabaseFetch('yachts', 'id,name,city');
  const yachtIds = (yachts||[]).filter(y => y.id).map(y => ({id:y.id, name:y.name||'', city:y.city||'Miami'}));
  console.log(`Found ${yachtIds.length} yachts`);

  // Build full routes list
  const dynamicRoutes = [
    ...restaurantSlugs.map(r => '/catalog/dining/'+r.slug),
    ...yachtIds.map(y => '/catalog/yachts/'+y.id),
  ];
  // On CI/Vercel prerender only the high-value static routes to keep the build
  // fast; detail pages stay client-rendered (Googlebot executes JS). Locally,
  // prerender everything.
  const ROUTES = IS_CI ? STATIC_ROUTES : [...STATIC_ROUTES, ...dynamicRoutes];

  // NOTE: sitemap.xml is now maintained by hand in public/sitemap.xml (correct
  // /catalog/* detail paths, XML-escaped, includes hotels). Don't overwrite it
  // here — vite already copies public/sitemap.xml into dist during build.
  console.log(`Prerendering ${ROUTES.length} routes (sitemap left as-is)\n`);

  // Start server
  const server = await startServer();

  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  let browser;
  const results = [];

  try {
    // Launch browser (serverless Chromium on CI, puppeteer locally)
    browser = await launchBrowser();
    if (!browser) {
      console.log('No browser available — skipping prerender. SPA still works.');
      return; // finally will close the server and exit 0
    }

    console.log('Browser launched, rendering routes...\n');

    // Render all routes sequentially
    for (const route of ROUTES) {
      const result = await renderRoute(browser, route);
      results.push(result);
      // Small delay between renders
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n--- Pre-rendering Summary ---');
    const successful = results.filter(r => r.success).length;
    console.log(`✓ Successful: ${successful}/${results.length}`);
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      console.log(`✗ Failed: ${failed.length}/${ROUTES.length}`);
      failed.forEach(r => {
        console.log(`  - ${r.route}: ${r.error}`);
      });
    }

    if (successful === ROUTES.length) {
      console.log('\nAll routes pre-rendered successfully!');
    }

  } catch (error) {
    // Prerendering is a best-effort enhancement — never fail the build.
    console.error('Prerender error (continuing as SPA):', error.message);
  } finally {
    // Cleanup — always exit 0 so the build succeeds regardless.
    if (browser) {
      try { await browser.close(); } catch (e) {}
    }
    server.close(() => {
      console.log('\nServer stopped.');
      process.exit(0);
    });
  }
}

// Run pre-rendering
prerender();
