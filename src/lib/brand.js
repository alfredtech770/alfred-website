/**
 * Alfred brand tokens — translated from the iOS app's Theme.swift.
 * Source: /Users/ethan/Desktop/Alfred/Alfred/Theme.swift
 *
 * Use these tokens for any new pages/components. The legacy `C` palette
 * inlined in older pages (#0A0A0B, #FFD60A, etc.) is being phased out.
 */

export var T = {
  /* ─── Backgrounds & surfaces ─────────────────────────────────────── */
  bg: "#0C0C0E",
  bg2: "#141416",
  surf1: "#1A1A1D",
  surf2: "#222226",

  /* ─── Text hierarchy (alpha overlays on bg) ──────────────────────── */
  text: "#FAFAFA",
  textMid: "rgba(250,250,250,0.62)",
  textDim: "rgba(250,250,250,0.38)",
  textFaint: "rgba(250,250,250,0.22)",

  /* ─── Accents ───────────────────────────────────────────────────── */
  silver: "#DCDCE0",
  silverDim: "#868689",
  gold: "#F5C54C",
  warm: "#F5A444",
  warmDim: "#C47A2A",
  warmInk: "#1A0E02",

  /* ─── Glass morphism ────────────────────────────────────────────── */
  glassBg: "rgba(255,255,255,0.10)",
  glassBg2: "rgba(255,255,255,0.16)",
  glassEdge: "rgba(255,255,255,0.22)",
  glassEdge2: "rgba(255,255,255,0.10)",

  /* ─── Borders ────────────────────────────────────────────────────── */
  border: "rgba(255,255,255,0.07)",
  border2: "rgba(255,255,255,0.13)",

  /* ─── Signature gradients ────────────────────────────────────────── */
  silverGradient: "radial-gradient(ellipse at 30% 20%, #FFFFFF 0%, #DCDCE0 35%, #A6A6AA 70%, #6E6E72 100%)",
  warmGradient: "linear-gradient(135deg, #F5A444 0%, #C47A2A 100%)",
  heroGlow: "radial-gradient(ellipse at 70% 0%, rgba(245,164,68,0.18), transparent 50%), radial-gradient(ellipse at 10% 80%, rgba(160,80,140,0.18), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(255,255,255,0.06), transparent 50%)",

  /* ─── Spacing ────────────────────────────────────────────────────── */
  pad: 22,
  padPage: 22,
  gapXs: 6,
  gapSm: 10,
  gapMd: 16,
  gapLg: 22,
  gapXl: 32,
  gapXxl: 48,

  /* ─── Corner radii ───────────────────────────────────────────────── */
  rSm: 14,
  rMd: 16,
  rLg: 20,
  rXl: 22,
  rHero: 28,

  /* ─── Shadows ────────────────────────────────────────────────────── */
  shadowCta: "0 8px 14px rgba(0,0,0,0.40)",
  shadowGlass: "0 6px 12px rgba(0,0,0,0.45)",
  shadowCard: "0 6px 18px rgba(0,0,0,0.40)"
};

/* ─── Typography helpers ───────────────────────────────────────────── */

var SERIF = "ui-serif, 'New York', Georgia, 'Times New Roman', serif";
var SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
var MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

/**
 * Type-style factory. Mirrors the iOS FontStyle enum.
 * Returns a style object you can spread into component styles.
 *
 *   ...type.heroSerif()
 *   ...type.body()
 *   ...type.kicker()
 */
export var type = {
  // Hero, page, section titles
  heroSerif: function(){ return {fontFamily:SERIF, fontSize:56, fontWeight:400, letterSpacing:-1.4, lineHeight:1.05, WebkitFontSmoothing:"antialiased"}; },
  heroSerifMobile: function(){ return {fontFamily:SERIF, fontSize:36, fontWeight:400, letterSpacing:-1, lineHeight:1.08, WebkitFontSmoothing:"antialiased"}; },
  pageSerif: function(){ return {fontFamily:SERIF, fontSize:38, fontWeight:400, letterSpacing:-0.8, lineHeight:1.1, WebkitFontSmoothing:"antialiased"}; },
  sectionSerif: function(){ return {fontFamily:SERIF, fontSize:28, fontWeight:600, letterSpacing:-0.5, lineHeight:1.15, WebkitFontSmoothing:"antialiased"}; },
  cardSerif: function(size){ return {fontFamily:SERIF, fontSize:size||19, fontWeight:400, letterSpacing:-0.3, lineHeight:1.2, WebkitFontSmoothing:"antialiased"}; },
  italicSerif: function(size){ return {fontFamily:SERIF, fontSize:size||28, fontWeight:400, fontStyle:"italic", letterSpacing:-0.3, WebkitFontSmoothing:"antialiased"}; },

  // Body
  body: function(){ return {fontFamily:SANS, fontSize:13, fontWeight:400, letterSpacing:-0.05, lineHeight:1.7, WebkitFontSmoothing:"antialiased"}; },
  bodyLg: function(){ return {fontFamily:SANS, fontSize:15, fontWeight:400, letterSpacing:-0.05, lineHeight:1.75, WebkitFontSmoothing:"antialiased"}; },
  bodySm: function(){ return {fontFamily:SANS, fontSize:12, fontWeight:400, letterSpacing:0, lineHeight:1.55, WebkitFontSmoothing:"antialiased"}; },

  // CTA / button
  button: function(){ return {fontFamily:SANS, fontSize:14, fontWeight:600, letterSpacing:-0.1, WebkitFontSmoothing:"antialiased"}; },
  buttonSm: function(){ return {fontFamily:SANS, fontSize:13, fontWeight:500, letterSpacing:-0.1, WebkitFontSmoothing:"antialiased"}; },

  // Kicker / eyebrow / metadata (mono, uppercase, wide tracking)
  kicker: function(){ return {fontFamily:MONO, fontSize:9, fontWeight:400, letterSpacing:1.5, textTransform:"uppercase", WebkitFontSmoothing:"antialiased"}; },
  kickerLg: function(){ return {fontFamily:MONO, fontSize:10, fontWeight:400, letterSpacing:1.4, textTransform:"uppercase", WebkitFontSmoothing:"antialiased"}; },
  caption: function(){ return {fontFamily:MONO, fontSize:9, fontWeight:400, letterSpacing:0.8, WebkitFontSmoothing:"antialiased"}; }
};

export var fonts = {SERIF, SANS, MONO};
