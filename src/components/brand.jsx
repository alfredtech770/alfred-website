/**
 * Alfred brand primitives — translated from the iOS app's HomeView.swift,
 * OnboardingPrimitives.swift, and Theme.swift.
 *
 * Use these components on any new page that should match the iOS app's
 * design language. Each primitive has a clear iOS counterpart referenced
 * in the comment above it.
 */

import { useEffect, useRef, useState } from "react";
import { T, type } from "../lib/brand";

/* ──────────────────────────────────────────────────────────────────────
 * SerifWordmark — mirrors `SerifWordmark` in OnboardingPrimitives.swift.
 * Italic serif "alfred" with wide tracking. Lowercase. Used in hero and
 * navigation as the primary brand mark.
 * ──────────────────────────────────────────────────────────────────── */
export function SerifWordmark({size, color, opacity}){
  var s = size || 28;
  return (
    <span style={{
      ...type.italicSerif(s),
      letterSpacing: s * 0.18,
      color: color || T.text,
      opacity: opacity == null ? 1 : opacity,
      lineHeight: 1,
      display: "inline-block"
    }}>alfred</span>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * SilverText — mirrors `SilverText` in OnboardingPrimitives.swift. Renders
 * text with the radial silver gradient as the fill colour. Used for
 * premium emphasis (the wordmark, tier names, hero highlight words).
 * ──────────────────────────────────────────────────────────────────── */
export function SilverText({children, style}){
  return (
    <span style={{
      backgroundImage: T.silverGradient,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      color: "transparent",
      display: "inline",
      ...style
    }}>{children}</span>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * FilmGrain — mirrors `FilmGrain` in HomeView.swift. SVG turbulence noise
 * overlaid at 0.5 opacity. Subtle analog/film texture. Use behind hero
 * sections only — too much grain on body content reduces legibility.
 * ──────────────────────────────────────────────────────────────────── */
export function FilmGrain({opacity}){
  var o = opacity == null ? 0.18 : opacity;
  return (
    <div aria-hidden style={{
      position:"absolute", inset:0, pointerEvents:"none",
      mixBlendMode:"overlay", opacity:o,
      backgroundImage:`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
      backgroundSize:"260px 260px"
    }}/>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Hero — mirrors HomeView.HeroB + HeroContent. Full-bleed dark hero with
 * radial-glow gradient layers, film-grain overlay, and rounded bottom
 * corners. Children are placed in the lower 40% over a subtle scrim.
 * ──────────────────────────────────────────────────────────────────── */
export function Hero({children, height, scrim, mobile}){
  var h = height || (mobile ? 540 : 680);
  return (
    <div style={{
      position:"relative", overflow:"hidden",
      width:"100%", height:h,
      borderBottomLeftRadius: T.rHero, borderBottomRightRadius: T.rHero,
      background: T.bg
    }}>
      <div style={{position:"absolute", inset:0, background:T.heroGlow}}/>
      <FilmGrain opacity={0.14}/>
      {scrim !== false && <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(180deg, rgba(12,12,14,0) 35%, rgba(12,12,14,0.55) 80%, rgba(12,12,14,0.85) 100%)"
      }}/>}
      <div style={{position:"relative", zIndex:2, height:"100%"}}>{children}</div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * BrandNav — sticky top nav matching the iOS app's header pattern. Wordmark
 * left, link group right, glass background with film grain.
 * ──────────────────────────────────────────────────────────────────── */
export function BrandNav({links, mobile}){
  return (
    <nav style={{
      position:"sticky", top:0, zIndex:50,
      padding: mobile ? "14px 20px" : "18px 28px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      background:"rgba(12,12,14,0.78)",
      backdropFilter:"saturate(140%) blur(18px)",
      WebkitBackdropFilter:"saturate(140%) blur(18px)",
      borderBottom:`0.5px solid ${T.border2}`
    }}>
      <a href="/" style={{display:"flex", alignItems:"center", gap:10, textDecoration:"none"}}>
        <span style={{...type.kicker(), color:T.silverDim, letterSpacing:3.5}}>ALFRED</span>
      </a>
      <div style={{display:"flex", alignItems:"center", gap: mobile ? 16 : 24}}>
        {links.map(function(l){
          return <a key={l.href} href={l.href} style={{
            ...type.kicker(), color: l.active ? T.text : T.textMid,
            textDecoration:"none", letterSpacing:1.6
          }}>{l.label}</a>;
        })}
      </div>
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * SectionHeader — mirrors HomeView.SectionHeader. Mono kicker in dim,
 * serif title below, optional CTA on the right. Handles the eyebrow→title
 * rhythm used across iOS app sections.
 * ──────────────────────────────────────────────────────────────────── */
export function SectionHeader({kicker, title, subtitle, cta, align}){
  var alignment = align || "left";
  return (
    <div style={{
      display:"flex", flexDirection:"column",
      alignItems: alignment==="center" ? "center" : "flex-start",
      textAlign: alignment, marginBottom:32
    }}>
      {kicker && <p style={{...type.kicker(), color:T.silverDim, marginBottom:14}}>{kicker}</p>}
      <h2 style={{...type.sectionSerif(), color:T.text, marginBottom: subtitle ? 12 : 0}}>{title}</h2>
      {subtitle && <p style={{...type.bodyLg(), color:T.textMid, maxWidth:560}}>{subtitle}</p>}
      {cta && <div style={{marginTop:16}}>{cta}</div>}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * PrimaryCTA — mirrors OnboardingPrimitives.PrimaryCTA. White capsule,
 * black text, semibold sans, drop shadow.
 * ──────────────────────────────────────────────────────────────────── */
export function PrimaryCTA({children, href, onClick, fullWidth, size}){
  var pad = size === "lg" ? "17px 32px" : "15px 24px";
  var style = {
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
    padding: pad, borderRadius:999,
    background:T.text, color:T.bg,
    ...type.button(),
    border:"none", cursor:"pointer", textDecoration:"none",
    boxShadow: T.shadowCta,
    transition:"transform 220ms cubic-bezier(0.16,1,0.3,1), box-shadow 220ms ease",
    width: fullWidth ? "100%" : "auto"
  };
  var onEnter = function(e){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 14px 28px rgba(0,0,0,0.5)"; };
  var onLeave = function(e){ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=T.shadowCta; };
  if(href) return <a href={href} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>{children}</a>;
  return <button onClick={onClick} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>{children}</button>;
}

/* ──────────────────────────────────────────────────────────────────────
 * GhostCTA — mirrors OnboardingPrimitives.GhostCTA. Glass background,
 * thin border, sans medium. The secondary action.
 * ──────────────────────────────────────────────────────────────────── */
export function GhostCTA({children, href, onClick, fullWidth}){
  var style = {
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
    padding:"14px 22px", borderRadius:999,
    background: T.glassBg,
    backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)",
    border:`0.5px solid ${T.glassEdge2}`,
    color:T.text, ...type.buttonSm(),
    cursor:"pointer", textDecoration:"none",
    transition:"background 200ms ease, border-color 200ms ease",
    width: fullWidth ? "100%" : "auto"
  };
  var onEnter = function(e){ e.currentTarget.style.background=T.glassBg2; e.currentTarget.style.borderColor=T.glassEdge; };
  var onLeave = function(e){ e.currentTarget.style.background=T.glassBg; e.currentTarget.style.borderColor=T.glassEdge2; };
  if(href) return <a href={href} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>{children}</a>;
  return <button onClick={onClick} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>{children}</button>;
}

/* ──────────────────────────────────────────────────────────────────────
 * GlassPillButton — mirrors HomeView.GlassPillButton. Smaller pill with
 * arrow trailing, glass background, used for "See all" / "Apply" /
 * inline CTAs alongside section headers.
 * ──────────────────────────────────────────────────────────────────── */
export function GlassPillButton({children, href, onClick, trailing}){
  var style = {
    display:"inline-flex", alignItems:"center", gap:8,
    padding:"12px 18px", borderRadius:999,
    background: T.glassBg2,
    backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
    border:`0.5px solid ${T.glassEdge}`,
    color:T.text,
    fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
    fontSize:12, fontWeight:600, letterSpacing:-0.05,
    cursor:"pointer", textDecoration:"none",
    boxShadow: T.shadowGlass,
    transition:"transform 220ms ease, background 220ms ease"
  };
  var onEnter = function(e){ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.background="rgba(255,255,255,0.22)"; };
  var onLeave = function(e){ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.background=T.glassBg2; };
  var content = <>{children}{trailing!==false && <span aria-hidden style={{display:"inline-flex"}}>→</span>}</>;
  if(href) return <a href={href} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>{content}</a>;
  return <button onClick={onClick} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>{content}</button>;
}

/* ──────────────────────────────────────────────────────────────────────
 * GlassCard — generic dark card with the iOS glass-edge treatment.
 * Optional gradient sheen across the top mirrors the membership strip.
 * ──────────────────────────────────────────────────────────────────── */
export function GlassCard({children, padded, sheen, featured, style}){
  var pad = padded === false ? 0 : 24;
  return (
    <div style={{
      position:"relative", overflow:"hidden",
      background: featured ? "linear-gradient(180deg, #1A1A1D 0%, #1F1F23 100%)" : T.surf1,
      border:`0.5px solid ${featured ? T.border2 : T.border}`,
      borderRadius: T.rLg,
      padding: pad,
      boxShadow: featured ? "0 24px 60px rgba(0,0,0,0.4)" : "none",
      ...style
    }}>
      {sheen && <div aria-hidden style={{
        position:"absolute", top:0, left:"6%", right:"6%", height:1,
        background:`linear-gradient(90deg, transparent, ${T.silver}99, transparent)`,
        opacity:0.6
      }}/>}
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Eyebrow — kicker text in a coloured pill. Used on the iOS app for tags
 * like "ALFRED · SILVER" or category labels.
 * ──────────────────────────────────────────────────────────────────── */
export function Eyebrow({children, color, dot, accent}){
  var c = color || T.silverDim;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:6,
      ...type.kicker(),
      color: c, letterSpacing:1.6
    }}>
      {dot && <span aria-hidden style={{
        width:6, height:6, borderRadius:"50%",
        background: accent || T.warm,
        boxShadow:`0 0 12px ${accent || T.warm}88`
      }}/>}
      {children}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Divider — gradient hairline used between sections in iOS app.
 * ──────────────────────────────────────────────────────────────────── */
export function Divider({margin}){
  return (
    <div style={{
      height:1, margin: margin || "0",
      background:`linear-gradient(90deg, transparent, ${T.border2} 20%, ${T.border2} 80%, transparent)`
    }}/>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * useReveal — IntersectionObserver hook for scroll-revealed sections.
 * Returns {ref, visible} — apply to wrapper, fade in on first intersect.
 * ──────────────────────────────────────────────────────────────────── */
export function useReveal(threshold){
  var ref = useRef(null);
  var [v, setV] = useState(false);
  useEffect(function(){
    if(!ref.current) return;
    var o = new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting){ setV(true); o.disconnect(); }
    }, { threshold: threshold || 0.1 });
    o.observe(ref.current);
    return function(){ o.disconnect(); };
  }, []);
  return { ref: ref, visible: v };
}

export var revealStyle = function(visible, delay){
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${delay||0}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delay||0}ms`
  };
};

/* ──────────────────────────────────────────────────────────────────────
 * useMobile — viewport hook used by every page to switch padding/sizes.
 * Mirrors the SwiftUI horizontalSizeClass pattern.
 * ──────────────────────────────────────────────────────────────────── */
export function useMobile(bp){
  var b = bp || 768;
  var [m, setM] = useState(typeof window !== "undefined" && window.innerWidth <= b);
  useEffect(function(){
    function handler(){ setM(window.innerWidth <= b); }
    window.addEventListener("resize", handler);
    return function(){ window.removeEventListener("resize", handler); };
  }, [b]);
  return m;
}
