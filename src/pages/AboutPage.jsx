import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";

var sf = function(size, weight){
  return {fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", fontSize:size, fontWeight:weight||400, WebkitFontSmoothing:"antialiased"};
};
var C = {bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}

var JSONLD = {
  "@context":"https://schema.org",
  "@type":"AboutPage",
  "name":"About Alfred Concierge",
  "url":"https://alfredconcierge.app/about",
  "description":"Alfred Concierge is the luxury concierge app for Miami, Paris, Dubai and London. Real human concierges, instant bookings, and member-only access to the world's best venues.",
  "mainEntity":{
    "@type":"Organization",
    "name":"Alfred Concierge",
    "url":"https://alfredconcierge.app",
    "logo":"https://alfredconcierge.app/og-image.jpg",
    "description":"Alfred is a luxury concierge app combining real human concierges with an AI assistant, serving members in Miami, Paris, Dubai and London.",
    "foundingDate":"2024",
    "areaServed":[
      {"@type":"City","name":"Miami"},
      {"@type":"City","name":"Paris"},
      {"@type":"City","name":"Dubai"},
      {"@type":"City","name":"London"}
    ],
    "sameAs":[
      "https://www.instagram.com/alfred",
      "https://x.com/alfredconcierge",
      "https://www.tiktok.com/@alfred"
    ]
  }
};

export default function AboutPage(){
  var navigate = useNavigate();

  useEffect(function(){ window.scrollTo(0,0); }, []);

  return (
    <div style={{background:C.bg, minHeight:"100vh", color:C.s1}}>
      <SEOHead
        title="About Alfred — The Luxury Concierge App for Miami, Paris, Dubai & London"
        description="Learn about Alfred Concierge: real human concierges, an AI assistant, and member-only access to Michelin restaurants, VIP nightlife, jets, yachts and exotic cars across Miami, Paris, Dubai and London."
        keywords="about Alfred Concierge, luxury concierge company, who is Alfred, Alfred concierge founders, Alfred app team, Miami concierge company, Paris concierge company"
        path="/about"
        type="website"
        jsonLd={JSONLD}
      />

      {/* Nav */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,10,11,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid "+C.bd,padding:"0 40px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={function(){navigate("/")}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <Mark size={20} color={C.s1}/>
          <span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span>
        </div>
        <div style={{display:"flex",gap:24,alignItems:"center"}}>
          <a href="/how-it-works" style={{...sf(13,400),color:C.s5,textDecoration:"none"}}>How it Works</a>
          <a href="/pricing" style={{...sf(13,400),color:C.s5,textDecoration:"none"}}>Pricing</a>
          <a href="/contact" style={{...sf(13,400),color:C.s5,textDecoration:"none"}}>Contact</a>
        </div>
      </nav>

      <article style={{maxWidth:780,margin:"0 auto",padding:"80px 40px 120px"}}>
        <header style={{marginBottom:56}}>
          <p style={{...sf(11,600),color:C.s7,letterSpacing:4,textTransform:"uppercase",marginBottom:16}}>About</p>
          <h1 style={{...sf(56,700),letterSpacing:-2,lineHeight:1.05,marginBottom:24,color:C.s1}}>The luxury concierge for people who value their time above everything else.</h1>
          <p style={{...sf(20,400),color:C.s4,lineHeight:1.55}}>Alfred is a private concierge built for the modern luxury client — one app, one chat, one team handling every detail across Miami, Paris, Dubai and London.</p>
        </header>

        <section style={{marginBottom:48}}>
          <h2 style={{...sf(28,600),color:C.s1,marginBottom:18,letterSpacing:-0.5}}>Why Alfred exists</h2>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>The traditional luxury concierge industry runs on phone calls, email chains, fax confirmations and a thousand favours owed across hotel front desks, restaurant managers and event promoters. It works — but it is slow, opaque, and built for a different generation. The newer apps that tried to fix this went the other way: chatbots, generic recommendations, no real relationships, no accountability when things go wrong at 11pm on a Saturday in South Beach.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>Alfred sits between the two. We built an app that puts the catalogue, the bookings and the receipts in your pocket — and behind that app sits a real concierge team with real relationships at the venues that matter. Every Michelin restaurant we book has a manager who picks up our call. Every nightclub has a host who walks our members in. Every yacht broker, jet operator and supercar fleet on our platform is one we have used personally.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75}}>That combination — modern interface, traditional relationships — is the entire premise of Alfred.</p>
        </section>

        <section style={{marginBottom:48}}>
          <h2 style={{...sf(28,600),color:C.s1,marginBottom:18,letterSpacing:-0.5}}>What we do</h2>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>Alfred members get instant access to seven categories of curated luxury experience: Michelin and impossible-reservation dining, VIP tables and bottle service at the world's top nightclubs, exotic and luxury car rentals delivered to the door, private jet charters with empty-leg deals, day yachts and superyachts with full crew, wellness and spa bookings at the best venues in each city, and luxury hotel reservations with member benefits across our partner network.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>We also handle the things that don't fit a category — last-minute private chefs, courtside seats, helicopter transfers, jewellery stylists, surprise proposals on the Eiffel Tower at 9pm. If it can be arranged in one of our cities, Alfred has a person who can arrange it.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75}}>Tickets and hospitality for the world's marquee events — Monaco Grand Prix, Miami F1, Roland Garros, Royal Ascot, Ibiza Opening — are sold directly through the app each season.</p>
        </section>

        <section style={{marginBottom:48}}>
          <h2 style={{...sf(28,600),color:C.s1,marginBottom:18,letterSpacing:-0.5}}>How we are different</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr",gap:24}}>
            <div style={{padding:"24px 28px",borderRadius:16,background:C.el,border:"1px solid "+C.bd}}>
              <h3 style={{...sf(16,600),color:C.s1,marginBottom:8}}>Real humans, not chatbots</h3>
              <p style={{...sf(14,400),color:C.s4,lineHeight:1.65}}>Every booking is verified by a human concierge before it goes out. Centurion members get a single named agent who handles every request, 24/7, on WhatsApp.</p>
            </div>
            <div style={{padding:"24px 28px",borderRadius:16,background:C.el,border:"1px solid "+C.bd}}>
              <h3 style={{...sf(16,600),color:C.s1,marginBottom:8}}>Direct relationships at every venue</h3>
              <p style={{...sf(14,400),color:C.s4,lineHeight:1.65}}>We do not work through third-party APIs for our top venues. Our concierges have direct lines to managers at LIV, E11even, Zuma, Cipriani, Casa Tua, Raspoutine, Castel and the rest of our partner roster.</p>
            </div>
            <div style={{padding:"24px 28px",borderRadius:16,background:C.el,border:"1px solid "+C.bd}}>
              <h3 style={{...sf(16,600),color:C.s1,marginBottom:8}}>Member benefits that actually move the needle</h3>
              <p style={{...sf(14,400),color:C.s4,lineHeight:1.65}}>Reduced minimum spends, waived advance payments, VIP flags in venue systems, priority placement and complimentary upgrades — concrete benefits negotiated on behalf of members, not vague "perks."</p>
            </div>
            <div style={{padding:"24px 28px",borderRadius:16,background:C.el,border:"1px solid "+C.bd}}>
              <h3 style={{...sf(16,600),color:C.s1,marginBottom:8}}>One app, four cities, one team</h3>
              <p style={{...sf(14,400),color:C.s4,lineHeight:1.65}}>Miami, Paris, Dubai and London under a single membership. No regional sub-services, no separate apps, no handoffs between teams when you cross a border.</p>
            </div>
          </div>
        </section>

        <section style={{marginBottom:48}}>
          <h2 style={{...sf(28,600),color:C.s1,marginBottom:18,letterSpacing:-0.5}}>Where we operate</h2>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>Alfred operates a curated catalogue across four cities. Miami is the home market, with the deepest catalogue across dining, nightlife, yacht charters out of Miami Beach and Biscayne Bay, and exotic car rentals delivered anywhere from South Beach to Star Island. Paris covers Michelin and bistronomy reservations, the top nightclubs of the 8th and 1st arrondissements, hotel partnerships from the Costes group through to the Bristol, and the spa and beauty venues that define Parisian wellness. Dubai handles the supercar fleet, beach club access, helicopter transfers and the increasingly important off-season hospitality calendar. London covers private members' clubs, fine dining across Mayfair and Notting Hill, Royal Ascot hospitality and the city's best wellness and spa venues.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75}}>Members travelling between cities use the same app, the same concierge team and the same membership tier. There is no "Alfred Paris" or "Alfred Dubai" — there is just Alfred.</p>
        </section>

        <section style={{marginBottom:48}}>
          <h2 style={{...sf(28,600),color:C.s1,marginBottom:18,letterSpacing:-0.5}}>Membership and trust</h2>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>Alfred operates three membership tiers — Gold, Platinum and Centurion — designed to match the way our members actually live. Gold gives full app access for $9.99 per month and is the right tier for someone who wants the catalogue, the AI concierge and access to the booking integrations. Platinum at $99 per month adds direct human concierge support, VIP venue placement, reduced minimum spends and the operational benefits that real luxury concierge work depends on. Centurion is invite-only and assigns a single named agent to handle every aspect of a member's life — from airport coordination to private event curation.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75}}>All plans are protected by end-to-end encryption, contain no advertising, and can be cancelled at any time. Members own their data; Alfred does not sell it, share it with venues without explicit consent, or use it to retarget for advertising.</p>
        </section>

        <section style={{marginBottom:24}}>
          <h2 style={{...sf(28,600),color:C.s1,marginBottom:18,letterSpacing:-0.5}}>Ready to start</h2>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:24}}>The fastest way to understand Alfred is to use it. Browse the <a href="/catalog" style={{color:C.s1,textDecoration:"underline"}}>catalogue</a>, see how <a href="/how-it-works" style={{color:C.s1,textDecoration:"underline"}}>it works</a>, or compare <a href="/pricing" style={{color:C.s1,textDecoration:"underline"}}>membership tiers</a>. For event hospitality and direct enquiries, the <a href="/contact" style={{color:C.s1,textDecoration:"underline"}}>contact page</a> has the fastest channels into the team.</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <a href="/pricing" style={{display:"inline-flex",alignItems:"center",padding:"14px 22px",borderRadius:12,background:C.s1,color:C.bg,...sf(14,600),textDecoration:"none"}}>Compare memberships</a>
            <a href="/contact" style={{display:"inline-flex",alignItems:"center",padding:"14px 22px",borderRadius:12,border:"1px solid "+C.bd,color:C.s1,...sf(14,600),textDecoration:"none"}}>Talk to Alfred</a>
          </div>
        </section>
      </article>
    </div>
  );
}
