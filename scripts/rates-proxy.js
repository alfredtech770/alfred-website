#!/usr/bin/env node
/**
 * Local dev stand-in for the Vercel function at /api/hotel-rates.
 * Vite doesn't run serverless functions, so during `npm run dev` the page
 * calls http://localhost:4956/api/hotel-rates instead. Reads the authorised
 * Little Emperors adapter settings from .env.local (gitignored).
 * Run: node scripts/rates-proxy.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// Minimal .env.local parser (no dotenv dependency).
try {
  const env = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
  env.split('\n').forEach((l) => {
    const m = l.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  });
} catch (e) {}

const handler = require('../api/hotel-rates.js');

http
  .createServer((req, res) => {
    const u = new URL(req.url, 'http://localhost');
    // Adapt Node's req/res to the Vercel handler signature.
    req.query = Object.fromEntries(u.searchParams);
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (o) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); };
    if (u.pathname === '/api/hotel-rates') return handler(req, res);
    res.status(404).json({ error: 'not found' });
  })
  .listen(4956, () => console.log('rates proxy on http://localhost:4956 (Little Emperors endpoint: ' + (process.env.LITTLE_EMPERORS_RATES_ENDPOINT ? 'configured' : 'pending') + ')'));
