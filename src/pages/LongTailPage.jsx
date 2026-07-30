import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SEOHead from "../components/SEOHead";
import LONGTAIL from "../data/longtail";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gold:"#FFD60A"};

function Mark(p){return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><text x="50" y="80" textAnchor="middle" fontFamily="'Times New Roman','Didot','Bodoni 72',Georgia,serif" fontSize="92" fontStyle="italic" fontWeight="500" fill={p.color||C.s1}>A</text></svg>)}

var BASE = "https://alfredconcierge.app";
var WHATSAPP = "https://wa.me/33743713649";

function slugify(n){return (n||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}
// Cars: DB stores brand + name split; the catalog links use slugify(brand+name).
function carFullName(r){
  var name=(r.name||"").trim(), brand=(r.brand||"").trim();
  return brand && name && name.toLowerCase().indexOf(brand.toLowerCase())!==0 ? brand+" "+name : name;
}
var dollars=function(n){return n?Array(Math.min(5,n)+1).join("$"):null};

// Per-vertical adapters so one component powers /best/ pages for restaurants,
// exotic cars and hotels. Config entries set `table` (default "restaurants").
var VERTICALS = {
  restaurants: {
    type:"Restaurant", listNoun:"venues", cta:"a table",
    crumb:{label:"Dining", href:"/catalog/dining"},
    browse:{label:"restaurants", href:"/catalog/dining"},
    detailUrl:function(r){return "/catalog/dining/"+(r.slug||"")},
    displayName:function(r){return r.name},
    subtitle:function(r){return [r.cuisine, r.neighborhood||r.city, dollars(r.price_level)].filter(Boolean).join(" · ")},
  },
  cars: {
    type:"Product", listNoun:"cars", cta:"this car",
    crumb:{label:"Exotic Cars", href:"/catalog/exotic-cars"},
    browse:{label:"cars", href:"/catalog/exotic-cars"},
    detailUrl:function(r){return "/catalog/exotic-cars/"+slugify(carFullName(r))},
    displayName:function(r){return carFullName(r)},
    subtitle:function(r){return [r.category||r.type, r.hp?r.hp+" hp":null, r.price_1_day?"$"+r.price_1_day+"/day":null].filter(Boolean).join(" · ")},
  },
  accommodations: {
    type:"Hotel", listNoun:"hotels", cta:"this stay",
    crumb:{label:"Hotels", href:"/catalog/hotels"},
    browse:{label:"hotels", href:"/catalog/hotels"},
    detailUrl:function(r){return "/catalog/hotels/"+(r.slug||r.id)},
    displayName:function(r){return r.name},
    subtitle:function(r){return [r.star_rating?r.star_rating+"-star":null, r.neighborhood||r.city, dollars(r.price_level)].filter(Boolean).join(" · ")},
  },
};

function buildJsonLd(slug, cfg, vert, rows){
  var pageUrl = BASE + "/best/" + slug;

  var itemList = {
    "@context":"https://schema.org",
    "@type":"ItemList",
    "name": cfg.h1,
    "description": cfg.description,
    "numberOfItems": rows.length,
    "itemListOrder":"https://schema.org/ItemListOrderAscending",
    "itemListElement": rows.map(function(r, i){
      var url = BASE + vert.detailUrl(r);
      var item = {
        "@type": vert.type,
        "@id": url,
        "name": vert.displayName(r),
        "url": url,
        "image": r.hero_image_url || undefined,
        "aggregateRating": r.rating ? {
          "@type":"AggregateRating",
          "ratingValue": String(r.rating),
          "reviewCount": String(r.review_count || r.reviews || 1)
        } : undefined
      };
      if(vert.type==="Restaurant"){
        item.servesCuisine = r.cuisine || undefined;
        item.priceRange = dollars(r.price_level) || "$$$";
        item.address = {"@type":"PostalAddress","addressLocality": r.city || cfg.city, "addressCountry": cfg.city==="Paris" ? "FR" : "US"};
        item.acceptsReservations = true;
      } else if(vert.type==="Product"){
        item.brand = r.brand ? {"@type":"Brand","name": r.brand} : undefined;
        item.category = "Luxury & Exotic Car Rental";
        if(r.price_1_day){ item.offers = {"@type":"Offer","price": r.price_1_day, "priceCurrency":"USD","availability":"https://schema.org/InStock","url": url}; }
      } else if(vert.type==="Hotel"){
        if(r.star_rating){ item.starRating = {"@type":"Rating","ratingValue": r.star_rating}; }
        item.priceRange = dollars(r.price_level) || "$$$$";
        item.address = {"@type":"PostalAddress","addressLocality": r.city || cfg.city};
      }
      return {"@type":"ListItem","position": i+1, "url": url, "item": item};
    })
  };

  var faqPage = cfg.faqs && cfg.faqs.length ? {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": cfg.faqs.map(function(f){
      return {"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}};
    })
  } : null;

  var breadcrumb = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item": BASE},
      {"@type":"ListItem","position":2,"name": vert.crumb.label,"item": BASE+vert.crumb.href},
      {"@type":"ListItem","position":3,"name": cfg.h1, "item": pageUrl}
    ]
  };

  return [itemList, faqPage, breadcrumb].filter(Boolean);
}

function Row(props){
  var [hover, setHover] = useState(false);
  var r = props.row, vert = props.vert;
  var url = vert.detailUrl(r);
  return (
    <Link
      to={url}
      onPointerEnter={function(e){if(e.pointerType==="mouse")setHover(true)}}
      onPointerLeave={function(){setHover(false)}}
      style={{
        display:"grid",
        gridTemplateColumns:"36px 1fr auto",
        alignItems:"center",
        gap:18,
        padding:"22px 24px",
        borderBottom:"1px solid "+C.bd,
        background: hover ? "rgba(244,244,245,0.025)" : "transparent",
        textDecoration:"none",
        transition:"background 0.2s ease",
        color: C.s1
      }}
    >
      <span style={{...sf(13,600), color: C.s5, letterSpacing: 1, fontVariantNumeric:"tabular-nums"}}>
        {String(props.index+1).padStart(2,"0")}
      </span>
      <div style={{minWidth:0}}>
        <div style={{...sf(18,600), color: C.s1, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
          {vert.displayName(r)}
        </div>
        <div style={{...sf(13), color: C.s5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
          {vert.subtitle(r)}
        </div>
      </div>
      <div style={{display:"flex", alignItems:"center", gap:14, flexShrink:0}}>
        {r.rating ? (
          <div style={{display:"flex", alignItems:"center", gap:4}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span style={{...sf(13,600), color: C.s1}}>{r.rating}</span>
          </div>
        ) : null}
        <div style={{...sf(11,500), color: hover ? C.s1 : C.s5, transition:"color 0.2s", letterSpacing: 1, textTransform:"uppercase"}}>
          Book →
        </div>
      </div>
    </Link>
  );
}

export default function LongTailPage(){
  var params = useParams();
  var slug = params.slug;
  var cfg = LONGTAIL[slug];
  var vert = VERTICALS[(cfg && cfg.table) || "restaurants"];

  var [rows, setRows] = useState([]);
  var [loading, setLoading] = useState(true);

  useEffect(function(){
    if(!cfg){ setLoading(false); return; }
    var alive = true;
    (async function(){
      var resp = await supabase.from(cfg.table || "restaurants").select("*").neq("is_active", false);
      if(!alive) return;
      var all = resp.data || [];
      var filtered = all.filter(cfg.filter);
      // Stable sort: highest rating, then most reviews, then name
      filtered.sort(function(a,b){
        var ar = a.rating || 0, br = b.rating || 0;
        if(br !== ar) return br - ar;
        var arv = a.review_count || a.reviews || 0, brv = b.review_count || b.reviews || 0;
        if(brv !== arv) return brv - arv;
        return (vert.displayName(a)||"").localeCompare(vert.displayName(b)||"");
      });
      setRows(filtered);
      setLoading(false);
    })();
    return function(){ alive = false; };
  }, [slug]);

  if(!cfg){
    return (
      <div style={{minHeight:"100vh", background: C.bg, color: C.s1, padding:"120px 24px", textAlign:"center"}}>
        <SEOHead title="Page Not Found | Alfred Concierge" path="/best/404"/>
        <h1 style={{...sf(36,700)}}>Page not found</h1>
        <p style={{...sf(15), color: C.s5, marginTop: 16}}>
          We don't have a guide at <code style={{color:C.gold}}>/best/{slug}</code> yet.
        </p>
        <Link to="/catalog/dining" style={{...sf(13,600), color: C.s1, marginTop: 24, display:"inline-block"}}>← Browse the catalog</Link>
      </div>
    );
  }

  var jsonLd = buildJsonLd(slug, cfg, vert, rows);

  return (
    <div style={{minHeight:"100vh", background: C.bg, color: C.s1}}>
      <SEOHead
        title={cfg.title}
        description={cfg.description}
        keywords={cfg.keywords}
        path={"/best/" + slug}
        jsonLd={jsonLd}
      />

      {/* Header */}
      <header style={{position:"sticky", top:0, zIndex:50, background:"rgba(10,10,11,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid "+C.bd}}>
        <div style={{maxWidth:1200, margin:"0 auto", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <Link to="/" style={{display:"flex", alignItems:"center", gap:10, textDecoration:"none"}}>
            <Mark size={28} color={C.s1}/>
            <span style={{...sf(11,400), color: C.s4, letterSpacing: 6, textTransform:"uppercase"}}>Alfred</span>
          </Link>
          <div style={{display:"flex", gap:24, alignItems:"center"}}>
            <Link to={vert.crumb.href} style={{...sf(13,500), color: C.s4, textDecoration:"none"}}>{vert.crumb.label}</Link>
            <Link to="/city/miami" style={{...sf(13,500), color: C.s4, textDecoration:"none"}}>Miami</Link>
            <a href={WHATSAPP+"?text="+encodeURIComponent("Hi Alfred, I'd like help with "+cfg.h1+".")} target="_blank" rel="noopener noreferrer"
               style={{...sf(13,600), color: C.bg, background: C.s1, padding:"10px 18px", borderRadius:10, textDecoration:"none"}}>
              Ask Alfred
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{maxWidth:880, margin:"0 auto", padding:"80px 24px 40px"}}>
        <nav aria-label="Breadcrumb" style={{...sf(11,500), color: C.s5, letterSpacing: 2, textTransform:"uppercase", marginBottom: 28}}>
          <Link to="/" style={{color: C.s5, textDecoration:"none"}}>Home</Link>
          <span style={{margin:"0 8px", color: C.s7}}>/</span>
          <Link to={vert.crumb.href} style={{color: C.s5, textDecoration:"none"}}>{vert.crumb.label}</Link>
          <span style={{margin:"0 8px", color: C.s7}}>/</span>
          <span style={{color: C.s3}}>{cfg.city}</span>
        </nav>
        <h1 style={{...sf("clamp(36px,6vw,60px)",700), color: C.s1, letterSpacing:"-0.02em", lineHeight: 1.05, marginBottom: 28}}>
          {cfg.h1}
        </h1>
        {cfg.intro.map(function(p, i){
          return (
            <p key={i} style={{...sf(17,400), color: C.s3, lineHeight: 1.65, marginBottom: 18}}>
              {p}
            </p>
          );
        })}
      </section>

      {/* List */}
      <section style={{maxWidth:880, margin:"0 auto", padding:"24px 24px 60px"}}>
        <div style={{display:"flex", alignItems:"baseline", justifyContent:"space-between", padding:"0 24px", marginBottom: 12}}>
          <h2 style={{...sf(13,600), color: C.s4, letterSpacing: 3, textTransform:"uppercase", margin: 0}}>
            The list {rows.length ? "· "+rows.length+" "+vert.listNoun : ""}
          </h2>
          <span style={{...sf(11,500), color: C.s6, letterSpacing: 1.5, textTransform:"uppercase"}}>
            Ranked by concierge team
          </span>
        </div>
        <div style={{background: C.el, border:"1px solid "+C.bd, borderRadius: 20, overflow:"hidden"}}>
          {loading ? (
            <div style={{padding:"60px 24px", textAlign:"center", color: C.s5, ...sf(14)}}>Loading...</div>
          ) : rows.length === 0 ? (
            <div style={{padding:"60px 24px", textAlign:"center", color: C.s5, ...sf(14)}}>
              No matches yet. <a href={WHATSAPP} style={{color: C.s1}}>Message Alfred</a> and we'll handle it directly.
            </div>
          ) : (
            rows.map(function(r, i){ return <Row key={r.id || r.slug || i} row={r} index={i} vert={vert}/>; })
          )}
        </div>
      </section>

      {/* Trust block */}
      <section style={{maxWidth:880, margin:"0 auto", padding:"40px 24px 60px"}}>
        <div style={{background: C.el, border:"1px solid "+C.bd, borderRadius: 20, padding: 32}}>
          <h2 style={{...sf(22,600), color: C.s1, marginTop:0, marginBottom: 16}}>
            Why book through Alfred
          </h2>
          <ul style={{...sf(15), color: C.s3, lineHeight: 1.7, paddingLeft: 20, margin: 0}}>
            <li>Direct relationships with every partner on this list.</li>
            <li>Same-day and "fully booked" requests are routine for members.</li>
            <li>Every detail — timing, delivery, extras, transport — handled in one thread.</li>
            <li>Real human concierge on WhatsApp, 24/7. No bots, no DMs into the void.</li>
          </ul>
          <a href={WHATSAPP+"?text="+encodeURIComponent("Hi Alfred, I'd like "+vert.cta+" — "+cfg.h1+".")} target="_blank" rel="noopener noreferrer"
             style={{display:"inline-block", marginTop: 24, padding:"14px 28px", background: C.s1, color: C.bg, borderRadius: 12, textDecoration:"none", ...sf(14,600)}}>
            Ask Alfred →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section style={{maxWidth:880, margin:"0 auto", padding:"40px 24px 60px"}}>
        <h2 style={{...sf(28,700), color: C.s1, marginTop: 0, marginBottom: 24}}>
          Frequently asked
        </h2>
        {cfg.faqs.map(function(f, i){
          return (
            <details key={i} style={{borderBottom:"1px solid "+C.bd, padding:"20px 0"}}>
              <summary style={{...sf(16,600), color: C.s1, cursor:"pointer", listStyle:"none"}}>{f.q}</summary>
              <p style={{...sf(15), color: C.s3, lineHeight: 1.65, marginTop: 12, marginBottom: 0}}>{f.a}</p>
            </details>
          );
        })}
      </section>

      {/* Related */}
      {cfg.related && cfg.related.length ? (
        <section style={{maxWidth:880, margin:"0 auto", padding:"40px 24px 100px"}}>
          <h2 style={{...sf(13,600), color: C.s4, letterSpacing: 3, textTransform:"uppercase", marginBottom: 16}}>
            Related guides
          </h2>
          <div style={{display:"flex", flexWrap:"wrap", gap: 12}}>
            {cfg.related.map(function(rel, i){
              return (
                <Link key={i} to={rel.href}
                      style={{...sf(13,500), color: C.s2, padding:"10px 18px", borderRadius: 999, border:"1px solid "+C.bd, background: C.el, textDecoration:"none"}}>
                  {rel.label} →
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Footer */}
      <footer style={{borderTop:"1px solid "+C.bd, padding:"40px 24px", textAlign:"center", color: C.s5}}>
        <p style={{...sf(12), margin: 0}}>© 2026 Alfred Concierge · Miami · Paris · Dubai · London</p>
      </footer>
    </div>
  );
}
