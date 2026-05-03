import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";

var sf = function(size, weight){
  return {fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", fontSize:size, fontWeight:weight||400, WebkitFontSmoothing:"antialiased"};
};
var C = {bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}

var WHATSAPP = "https://wa.me/447449562204";
var EMAIL = "ethan@alfredconcierge.app";

var CHANNELS = [
  {
    title:"WhatsApp",
    body:"The fastest channel into the concierge team. Members get priority routing; non-members are handled by the duty operator. Available 24/7.",
    cta:"Message on WhatsApp",
    href:WHATSAPP,
    target:"_blank",
    rel:"noopener noreferrer"
  },
  {
    title:"Email",
    body:"For Centurion enquiries, partnership requests, press, and anything that needs a record. Replies within four business hours.",
    cta:"ethan@alfredconcierge.app",
    href:"mailto:"+EMAIL
  },
  {
    title:"Inside the app",
    body:"Members chat directly with the concierge from inside Alfred. Every booking, receipt and conversation lives there. Download the app to start.",
    cta:"Download Alfred",
    href:"#"
  }
];

var ROUTES = [
  {label:"Become a member", body:"See the three tiers and what's included.", href:"/pricing"},
  {label:"Apply for Centurion", body:"Invite-only. Apply via the email above with a brief on what you're looking for.", href:"mailto:"+EMAIL+"?subject=Alfred%20Centurion%20application"},
  {label:"List your venue", body:"Restaurants, nightclubs, yachts, jet operators, car fleets and spas — partner with Alfred.", href:"/business"},
  {label:"Press and media", body:"For press enquiries, founder interviews and brand assets.", href:"mailto:"+EMAIL+"?subject=Press%20enquiry"},
  {label:"Event hospitality", body:"Monaco Grand Prix, Miami F1, Roland Garros, Royal Ascot, Ibiza Opening.", href:"/events"},
  {label:"Existing members", body:"Use the in-app chat or your assigned agent's WhatsApp for the fastest response.", href:"#"}
];

var JSONLD = [
  {
    "@context":"https://schema.org",
    "@type":"ContactPage",
    "name":"Contact Alfred Concierge",
    "url":"https://alfredconcierge.app/contact",
    "description":"Talk to Alfred Concierge directly. WhatsApp 24/7, email replies within four business hours, and partnership and press contacts.",
    "mainEntity":{
      "@type":"Organization",
      "name":"Alfred Concierge",
      "url":"https://alfredconcierge.app",
      "contactPoint":[
        {"@type":"ContactPoint","contactType":"customer service","availableLanguage":["English","French"],"areaServed":["US","FR","AE","GB"],"telephone":"+44-7449-562204","contactOption":"TollFree"},
        {"@type":"ContactPoint","contactType":"sales","email":"ethan@alfredconcierge.app","areaServed":["US","FR","AE","GB"]},
        {"@type":"ContactPoint","contactType":"press","email":"ethan@alfredconcierge.app"}
      ],
      "sameAs":[
        "https://www.instagram.com/alfred",
        "https://x.com/alfredconcierge",
        "https://www.tiktok.com/@alfred"
      ]
    }
  },
  {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},
      {"@type":"ListItem","position":2,"name":"Contact","item":"https://alfredconcierge.app/contact"}
    ]
  }
];

export default function ContactPage(){
  var navigate = useNavigate();
  useEffect(function(){ window.scrollTo(0,0); }, []);

  return (
    <div style={{background:C.bg, minHeight:"100vh", color:C.s1}}>
      <SEOHead
        title="Contact Alfred Concierge — WhatsApp, Email & Press | Alfred"
        description="Talk to Alfred directly. WhatsApp 24/7 for the concierge team. Email ethan@alfredconcierge.app for partnerships, press and Centurion applications. Replies within four business hours."
        keywords="contact Alfred Concierge, Alfred concierge phone number, Alfred WhatsApp, Alfred email, Alfred concierge contact, luxury concierge contact"
        path="/contact"
        type="website"
        jsonLd={JSONLD}
      />

      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,10,11,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid "+C.bd,padding:"0 40px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={function(){navigate("/")}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <Mark size={20} color={C.s1}/>
          <span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span>
        </div>
        <div style={{display:"flex",gap:24,alignItems:"center"}}>
          <a href="/about" style={{...sf(13,400),color:C.s5,textDecoration:"none"}}>About</a>
          <a href="/how-it-works" style={{...sf(13,400),color:C.s5,textDecoration:"none"}}>How it Works</a>
          <a href="/pricing" style={{...sf(13,400),color:C.s5,textDecoration:"none"}}>Pricing</a>
        </div>
      </nav>

      <article style={{maxWidth:980,margin:"0 auto",padding:"80px 40px 120px"}}>
        <header style={{textAlign:"center",maxWidth:680,margin:"0 auto 64px"}}>
          <p style={{...sf(11,600),color:C.s7,letterSpacing:4,textTransform:"uppercase",marginBottom:16}}>Contact</p>
          <h1 style={{...sf(56,700),letterSpacing:-2,lineHeight:1.05,marginBottom:24,color:C.s1}}>Talk to Alfred.</h1>
          <p style={{...sf(20,400),color:C.s4,lineHeight:1.55}}>WhatsApp for speed. Email for record. The app for everything in between.</p>
        </header>

        {/* Channels */}
        <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginBottom:80}}>
          {CHANNELS.map(function(ch){
            return <a key={ch.title} href={ch.href} target={ch.target} rel={ch.rel} style={{display:"flex",flexDirection:"column",padding:"32px 28px",borderRadius:20,background:C.el,border:"1px solid "+C.bd,textDecoration:"none",color:"inherit",transition:"border-color 0.2s"}}>
              <div style={{...sf(18,600),color:C.s1,marginBottom:10}}>{ch.title}</div>
              <p style={{...sf(14,400),color:C.s4,lineHeight:1.6,marginBottom:24,flex:1}}>{ch.body}</p>
              <div style={{...sf(13,600),color:C.s2,display:"flex",alignItems:"center",gap:8}}>
                {ch.cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>
              </div>
            </a>;
          })}
        </section>

        {/* Routes */}
        <section style={{marginBottom:80}}>
          <h2 style={{...sf(28,600),color:C.s1,marginBottom:32,letterSpacing:-0.5,textAlign:"center"}}>What are you here for?</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,maxWidth:900,margin:"0 auto"}}>
            {ROUTES.map(function(r){
              return <a key={r.label} href={r.href} style={{padding:"24px 26px",borderRadius:16,background:C.el,border:"1px solid "+C.bd,textDecoration:"none",color:"inherit"}}>
                <div style={{...sf(15,600),color:C.s1,marginBottom:6}}>{r.label}</div>
                <p style={{...sf(13,400),color:C.s4,lineHeight:1.55}}>{r.body}</p>
              </a>;
            })}
          </div>
        </section>

        {/* Response times */}
        <section style={{maxWidth:680,margin:"0 auto",marginBottom:64}}>
          <h2 style={{...sf(28,600),color:C.s1,marginBottom:18,letterSpacing:-0.5}}>Response times</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr",gap:14}}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"16px 20px",borderRadius:12,background:C.el,border:"1px solid "+C.bd}}>
              <span style={{...sf(14,500),color:C.s2}}>WhatsApp (Centurion)</span>
              <span style={{...sf(14,400),color:C.s4}}>under 5 minutes, 24/7</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"16px 20px",borderRadius:12,background:C.el,border:"1px solid "+C.bd}}>
              <span style={{...sf(14,500),color:C.s2}}>WhatsApp (Platinum)</span>
              <span style={{...sf(14,400),color:C.s4}}>under 15 minutes, 24/7</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"16px 20px",borderRadius:12,background:C.el,border:"1px solid "+C.bd}}>
              <span style={{...sf(14,500),color:C.s2}}>WhatsApp (non-member duty desk)</span>
              <span style={{...sf(14,400),color:C.s4}}>under 1 hour</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"16px 20px",borderRadius:12,background:C.el,border:"1px solid "+C.bd}}>
              <span style={{...sf(14,500),color:C.s2}}>Email</span>
              <span style={{...sf(14,400),color:C.s4}}>under 4 business hours</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"16px 20px",borderRadius:12,background:C.el,border:"1px solid "+C.bd}}>
              <span style={{...sf(14,500),color:C.s2}}>Press enquiries</span>
              <span style={{...sf(14,400),color:C.s4}}>same business day</span>
            </div>
          </div>
        </section>

        {/* Cities */}
        <section style={{maxWidth:680,margin:"0 auto"}}>
          <h2 style={{...sf(28,600),color:C.s1,marginBottom:18,letterSpacing:-0.5}}>Where Alfred operates</h2>
          <p style={{...sf(15,400),color:C.s4,lineHeight:1.7,marginBottom:18}}>The Alfred concierge team operates on the ground in Miami, Paris, Dubai and London. The same team handles requests worldwide for travel, hospitality and event work outside those four core cities.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
            {[{n:"Miami",h:"/city/miami"},{n:"Paris",h:"/city/paris"},{n:"Dubai",h:"/city/dubai"},{n:"London",h:"/city/london"}].map(function(c){
              return <a key={c.n} href={c.h} style={{padding:"18px 20px",borderRadius:12,background:C.el,border:"1px solid "+C.bd,textAlign:"center",textDecoration:"none",...sf(15,600),color:C.s1}}>{c.n}</a>;
            })}
          </div>
        </section>
      </article>
    </div>
  );
}
