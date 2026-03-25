#!/usr/bin/env node

/**
 * Pre-rendering script for SEO optimization
 * Generates static HTML files for all routes by rendering with Puppeteer
 * Run after vite build: node prerender.js
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const http = require('http');
const handler = require('serve-handler');

// Routes to pre-render
const ROUTES = [
  '/',
  '/business',
  '/catalog',
  '/catalog/dining',
  '/catalog/nightlife',
  '/catalog/exotic-cars',
  '/catalog/jets',
  '/catalog/yachts',
  '/catalog/wellness',
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
  '/city/london'
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

    // Wait for React to finish rendering
    await page.waitForTimeout(1000);

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

// Main pre-rendering function
async function prerender() {
  console.log('Starting pre-rendering...\n');

  // Start server
  const server = await startServer();

  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  let browser;
  const results = [];

  try {
    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    console.log('Puppeteer launched, rendering routes...\n');

    // Render all routes sequentially
    for (const route of ROUTES) {
      const result = await renderRoute(browser, route);
      results.push(result);
      // Small delay between renders
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n--- Pre-rendering Summary ---');
    const successful = results.filter(r => r.success).length;
    console.log(`✓ Successful: ${successful}/${ROUTES.length}`);
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
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
    }
    server.close(() => {
      console.log('\nServer stopped.');
      process.exit(results.every(r => r.success) ? 0 : 1);
    });
  }
}

// Run pre-rendering
prerender();
