import { useEffect } from "react";
import SEOHead from "../components/SEOHead";
import { T, type } from "../lib/brand";
import {
  Hero, BrandNav, SilverText, SectionHeader, PrimaryCTA, GhostCTA,
  GlassCard, Eyebrow, Divider, useReveal, revealStyle, useMobile
} from "../components/brand";

var T_ = T;

var WHATSAPP = "https://wa.me/33743713649";
var EMAIL = "ethan@alfredconcierge.app";

var CHANNELS = [
  {
    title:"WhatsApp",
    body:"Send the city, dates and request details to the concierge team. Response timing depends on demand and the type of request.",
    cta:"Message on WhatsApp",
    href:WHATSAPP,
    target:"_blank",
    rel:"noopener noreferrer",
    accent:T.warm
  },
  {
    title:"Email",
    body:"For membership enquiries, partnership requests, press and anything that benefits from a written record.",
    cta: EMAIL,
    href:"mailto:" + EMAIL,
    accent:T.silver
  },
  {
    title:"Inside the app",
    body:"Members chat directly with the concierge from inside Alfred. Every booking, receipt and conversation lives there. Download the app to start.",
    cta:"Download Alfred",
    href:"https://apps.apple.com/app/id6759160130",
    target:"_blank",
    rel:"noopener noreferrer",
    accent:T.silver
  }
];

var ROUTES = [
  {label:"Become a member", body:"See the three tiers and what's included.", href:"/pricing"},
  {label:"Ask about Centurion", body:"Email a brief description of the support you are looking for.", href:"mailto:" + EMAIL + "?subject=Alfred%20Centurion%20enquiry"},
  {label:"List your venue", body:"Restaurants, nightclubs, yachts, jet operators, car fleets and spas — partner with Alfred.", href:"/business"},
  {label:"Press and media", body:"For press enquiries, founder interviews and brand assets.", href:"mailto:" + EMAIL + "?subject=Press%20enquiry"},
  {label:"Custom request", body:"Share the city, dates, party size, preferences and budget.", href:WHATSAPP},
  {label:"Existing members", body:"Use the in-app chat or the contact method shown in your plan.", href:"/support"}
];

var RESPONSE_TIMES = [
  {label:"WhatsApp requests", time:"Timing varies by request"},
  {label:"Provider checks", time:"Depends on provider response"},
  {label:"Email", time:"Monitored by the Alfred team"},
  {label:"Confirmed requests", time:"Written confirmation provided"}
];

var CITIES = [
  {n:"Miami", h:"/city/miami"},
  {n:"Paris", h:"/city/paris"},
  {n:"Ibiza", h:"/city/ibiza"},
  {n:"Saint-Tropez", h:"/city/saint-tropez"},
  {n:"Mykonos", h:"/city/mykonos"},
  {n:"Dubai", h:"/city/dubai"},
  {n:"London", h:"/city/london"}
];

var JSONLD = [
  {
    "@context":"https://schema.org",
    "@type":"ContactPage",
    "name":"Contact Alfred Concierge",
    "url":"https://alfredconcierge.app/contact",
    "description":"Contact Alfred Concierge by WhatsApp, email or the app for city requests, membership questions, partnerships and press.",
    "mainEntity":{
      "@type":"Organization",
      "name":"Alfred Concierge",
      "url":"https://alfredconcierge.app",
      "contactPoint":[
        {"@type":"ContactPoint","contactType":"customer service","availableLanguage":["English","French"],"areaServed":["US","FR","ES","GR","AE","GB"],"telephone":"+33-7-43-71-36-49"},
        {"@type":"ContactPoint","contactType":"sales","email":"ethan@alfredconcierge.app","areaServed":["US","FR","ES","GR","AE","GB"]},
        {"@type":"ContactPoint","contactType":"press","email":"ethan@alfredconcierge.app"}
      ],
      "sameAs":["https://www.instagram.com/askalfred.app","https://www.tiktok.com/@alfred.app"]
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

function ChannelCard({channel, mobile}){
  var r = useReveal(0.05);
  return (
    <a ref={r.ref} href={channel.href} target={channel.target} rel={channel.rel} style={{
      display:"flex", flexDirection:"column",
      textDecoration:"none", color:"inherit",
      ...revealStyle(r.visible)
    }}>
      <GlassCard padded={false} style={{
        padding: mobile ? "32px 26px" : "40px 32px",
        height:"100%", display:"flex", flexDirection:"column",
        transition: "border-color 240ms ease, transform 240ms cubic-bezier(0.16,1,0.3,1)"
      }}>
        <div style={{
          width:46, height:46, borderRadius:"50%",
          background:T_.glassBg, border:`0.5px solid ${T_.glassEdge2}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          marginBottom:18
        }}>
          <span aria-hidden style={{
            width:8, height:8, borderRadius:"50%",
            background: channel.accent, boxShadow:`0 0 12px ${channel.accent}88`
          }}/>
        </div>
        <h3 style={{...type.cardSerif(24), color:T_.text, marginBottom:10}}>{channel.title}</h3>
        <p style={{...type.body(), color:T_.textMid, marginBottom:24, flex:1}}>{channel.body}</p>
        <div style={{
          ...type.kickerLg(), color:T_.text,
          display:"flex", alignItems:"center", gap:8
        }}>
          {channel.cta}
          <span aria-hidden>→</span>
        </div>
      </GlassCard>
    </a>
  );
}

export default function ContactPage(){
  var mobile = useMobile();
  useEffect(function(){ window.scrollTo(0,0); }, []);

  return (
    <div style={{background:T_.bg, minHeight:"100vh", color:T_.text}}>
      <SEOHead
        title="Contact Alfred Concierge — WhatsApp, Email & Press | Alfred"
        description="Contact Alfred Concierge by WhatsApp, email or the app for restaurant, hotel and transport requests, membership questions, partnerships and press."
        keywords="contact Alfred Concierge, Alfred concierge phone number, Alfred WhatsApp, Alfred email, Alfred concierge contact, luxury concierge contact"
        path="/contact"
        type="website"
        jsonLd={JSONLD}
      />

      <BrandNav mobile={mobile} links={[
        {label:"About", href:"/about"},
        {label:"How it Works", href:"/how-it-works"},
        {label:"Pricing", href:"/pricing"},
        {label:"Contact", href:"/contact", active:true}
      ]}/>

      <Hero mobile={mobile} height={mobile ? 460 : 580}>
        <div style={{
          height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end",
          padding: mobile ? "0 22px 56px" : "0 56px 80px", maxWidth:1200, margin:"0 auto"
        }}>
          <Eyebrow dot accent={T_.warm}>Contact</Eyebrow>
          <h1 style={{
            ...(mobile ? type.heroSerifMobile() : type.heroSerif()),
            color:T_.text, marginTop:18, maxWidth:880
          }}>
            Talk to <SilverText style={{fontStyle:"italic"}}>Alfred.</SilverText>
          </h1>
          <p style={{...type.bodyLg(), color:T_.textMid, marginTop:18, maxWidth:560}}>
            WhatsApp for speed. Email for record. The app for everything in between.
          </p>
        </div>
      </Hero>

      {/* Channels */}
      <section style={{
        padding: mobile ? "60px 22px 60px" : "100px 56px 80px",
        maxWidth:1200, margin:"0 auto"
      }}>
        <div style={{
          display:"grid",
          gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
          gap: mobile ? 14 : 18
        }}>
          {CHANNELS.map(function(c){ return <ChannelCard key={c.title} channel={c} mobile={mobile}/>; })}
        </div>
      </section>

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      {/* Routes */}
      <RoutesSection mobile={mobile}/>

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      {/* Response times */}
      <ResponseTimesSection mobile={mobile}/>

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      {/* Cities */}
      <CitiesSection mobile={mobile}/>
    </div>
  );
}

function RoutesSection({mobile}){
  var r = useReveal();
  return (
    <section ref={r.ref} style={{
      padding: mobile ? "60px 22px" : "100px 56px",
      maxWidth:1100, margin:"0 auto",
      ...revealStyle(r.visible)
    }}>
      <SectionHeader kicker="What are you here for" title="The right route into Alfred" align="center"/>
      <div style={{
        display:"grid",
        gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
        gap: mobile ? 12 : 16
      }}>
        {ROUTES.map(function(rt){
          return <a key={rt.label} href={rt.href} style={{
            textDecoration:"none", color:"inherit"
          }}>
            <GlassCard style={{padding:"24px 26px"}}>
              <h3 style={{...type.cardSerif(18), color:T_.text, marginBottom:8}}>{rt.label}</h3>
              <p style={{...type.body(), color:T_.textMid}}>{rt.body}</p>
            </GlassCard>
          </a>;
        })}
      </div>
    </section>
  );
}

function ResponseTimesSection({mobile}){
  var r = useReveal();
  return (
    <section ref={r.ref} style={{
      padding: mobile ? "60px 22px" : "100px 56px",
      maxWidth:780, margin:"0 auto",
      ...revealStyle(r.visible)
    }}>
      <SectionHeader kicker="Request status" title="What you can expect after contacting Alfred"/>
      <GlassCard padded={false} style={{padding:0, overflow:"hidden"}}>
        {RESPONSE_TIMES.map(function(rt, i){
          return <div key={rt.label} style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding: mobile ? "16px 22px" : "20px 28px",
            borderBottom: i < RESPONSE_TIMES.length - 1 ? `0.5px solid ${T_.border}` : "none",
            gap:16, flexWrap:"wrap"
          }}>
            <span style={{...type.body(), color:T_.text, fontSize:14}}>{rt.label}</span>
            <span style={{...type.kickerLg(), color:T_.silverDim}}>{rt.time}</span>
          </div>;
        })}
      </GlassCard>
    </section>
  );
}

function CitiesSection({mobile}){
  var r = useReveal();
  return (
    <section ref={r.ref} style={{
      padding: mobile ? "60px 22px 100px" : "100px 56px 140px",
      maxWidth:880, margin:"0 auto",
      ...revealStyle(r.visible)
    }}>
      <SectionHeader
        kicker="Where Alfred operates"
        title="Start with one of seven destination guides"
      />
      <p style={{...type.bodyLg(), color:T_.textMid, marginBottom:32, maxWidth:680}}>
        Alfred publishes guides for Miami, Paris, Ibiza, Saint-Tropez, Mykonos, Dubai and London. Use a city page or contact the team to confirm current coverage for the service and dates you need.
      </p>
      <div style={{
        display:"grid",
        gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        gap: mobile ? 10 : 14
      }}>
        {CITIES.map(function(c){
          return <a key={c.n} href={c.h} style={{textDecoration:"none", color:"inherit"}}>
            <GlassCard style={{
              padding: mobile ? "26px 16px" : "30px 20px",
              textAlign:"center",
              transition:"border-color 240ms ease, background 240ms ease"
            }}>
              <div style={{...type.cardSerif(22), color:T_.text}}>{c.n}</div>
            </GlassCard>
          </a>;
        })}
      </div>
    </section>
  );
}
