/** Alfred web design tokens. Keep public pages visually aligned with the
 * main site's restrained black, silver and white editorial system. */

export var T = {
  /* ─── Backgrounds & surfaces ─────────────────────────────────────── */
  bg: "#0A0A0B",
  bg2: "#111113",
  surf1: "#18181B",
  surf2: "#1F1F23",

  /* ─── Text hierarchy (alpha overlays on bg) ──────────────────────── */
  text: "#FAFAFA",
  textMid: "rgba(250,250,250,0.62)",
  textDim: "rgba(250,250,250,0.38)",
  textFaint: "rgba(250,250,250,0.22)",

  /* ─── Accents ───────────────────────────────────────────────────── */
  silver: "#DCDCE0",
  silverDim: "#868689",
  gold: "#DCDCE0",
  warm: "#DCDCE0",
  warmDim: "#868689",
  warmInk: "#0A0A0B",

  /* ─── Glass morphism ────────────────────────────────────────────── */
  glassBg: "rgba(255,255,255,0.035)",
  glassBg2: "rgba(255,255,255,0.065)",
  glassEdge: "rgba(255,255,255,0.18)",
  glassEdge2: "rgba(255,255,255,0.10)",

  /* ─── Borders ────────────────────────────────────────────────────── */
  border: "rgba(255,255,255,0.07)",
  border2: "rgba(255,255,255,0.13)",

  /* ─── Signature gradients ────────────────────────────────────────── */
  silverGradient: "radial-gradient(ellipse at 30% 20%, #FFFFFF 0%, #DCDCE0 35%, #A6A6AA 70%, #6E6E72 100%)",
  warmGradient: "linear-gradient(135deg, #F4F4F5 0%, #A1A1AA 100%)",
  heroGlow: "radial-gradient(ellipse at 72% 8%, rgba(255,255,255,0.075), transparent 48%), linear-gradient(180deg, #0A0A0B 0%, #0C0C0E 100%)",

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

var SANS = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
var SERIF = SANS;
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
  heroSerif: function(){ return {fontFamily:SANS, fontSize:64, fontWeight:600, letterSpacing:-3.2, lineHeight:0.98, WebkitFontSmoothing:"antialiased"}; },
  heroSerifMobile: function(){ return {fontFamily:SANS, fontSize:40, fontWeight:600, letterSpacing:-1.9, lineHeight:1, WebkitFontSmoothing:"antialiased"}; },
  pageSerif: function(){ return {fontFamily:SANS, fontSize:40, fontWeight:600, letterSpacing:-1.5, lineHeight:1.05, WebkitFontSmoothing:"antialiased"}; },
  sectionSerif: function(){ return {fontFamily:SANS, fontSize:28, fontWeight:600, letterSpacing:-0.9, lineHeight:1.12, WebkitFontSmoothing:"antialiased"}; },
  cardSerif: function(size){ return {fontFamily:SANS, fontSize:size||19, fontWeight:600, letterSpacing:-0.45, lineHeight:1.2, WebkitFontSmoothing:"antialiased"}; },
  italicSerif: function(size){ return {fontFamily:SANS, fontSize:size||28, fontWeight:600, fontStyle:"normal", letterSpacing:-0.7, WebkitFontSmoothing:"antialiased"}; },

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
