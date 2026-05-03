import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";

var sf = function(size, weight){
  return {fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", fontSize:size, fontWeight:weight||400, WebkitFontSmoothing:"antialiased"};
};
var C = {bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gold:"#FFD60A"};

var TIERS = [
  {
    id:"gold",
    label:"Entry",
    name:"Alfred Gold",
    price:"$9.99",
    cadence:"/month",
    cta:"Get Alfred Gold",
    summary:"Full app access, the AI concierge and the booking integrations. The right tier to see what Alfred is.",
    features:[
      "Full access to the Alfred app and catalogue",
      "AI concierge chat agent",
      "Restaurant discovery and recommendations",
      "Bookings via Resy, OpenTable, SevenRooms and Tock",
      "Global venue catalogue across Miami, Paris, Dubai and London",
      "Event discovery and ticketing access",
      "Up to four secondary profiles per account",
      "End-to-end encrypted messaging",
      "Cancel anytime"
    ]
  },
  {
    id:"platinum",
    label:"Recommended",
    name:"Alfred Platinum",
    price:"$99",
    cadence:"/month",
    cta:"Get Alfred Platinum",
    badge:"MOST POPULAR",
    summary:"Everything in Gold plus the human concierge team and the operational benefits that real luxury concierge work depends on.",
    features:[
      "Everything in Alfred Gold",
      "Real human concierge team — request fulfilment by named operators",
      "Skip the line — outside and at the check-in desk",
      "Strategic table placement at partner venues",
      "Reduced minimum spend on alcohol and food",
      "Waived advance payment requirement",
      "VIP flag in the venue system — upgrade eligibility",
      "Most experienced waiter and bottle service",
      "Waived valet at partner venues",
      "Waived 15-minute grace period on reservations",
      "Custom bottle parade and shoutouts on request",
      "Music request selection at partner clubs",
      "VIP host at your table all night",
      "Guest companions on request",
      "Exclusive event access and pre-sale windows",
      "Concierge consultancy and trip advice"
    ]
  },
  {
    id:"centurion",
    label:"Invite Only",
    name:"Alfred Centurion",
    price:"By invitation",
    cadence:"",
    cta:"Apply for Centurion",
    summary:"A single named agent for every aspect of a member's life. The full Alfred operation, dedicated, 24/7.",
    features:[
      "Everything in Alfred Platinum",
      "Dedicated personal agent — one human, always your contact",
      "24/7 WhatsApp access to your agent",
      "Worldwide VIP access beyond the four core cities",
      "Airport-to-venue coordination on every arrival",
      "Last-minute and impossible reservations prioritised",
      "Full travel itinerary building",
      "Private event and experience curation",
      "Quarterly branded gifting",
      "Annual member-only experience access"
    ]
  }
];

var FAQ = [
  {q:"What is the difference between Alfred Gold and Alfred Platinum?", a:"Gold is the app and the AI concierge. Platinum adds a real human concierge team, operational benefits at venues — reduced minimum spends, waived advance payments, VIP table placement, the right host on the floor — and concierge consultancy on travel and experiences. If you go out more than once or twice a month at premium venues, Platinum pays for itself in waived deposits and minimums alone."},
  {q:"How does Alfred Centurion get offered?", a:"Centurion is invite-only. Members are invited based on Platinum activity, referrals from existing Centurion members, or a direct application via the contact page. There is no public price; Centurion is structured to fit each member's lifestyle and is billed quarterly or annually. Apply through the contact page if you want to be considered."},
  {q:"Are there annual or quarterly billing options?", a:"Yes. Gold and Platinum can be billed monthly or annually with a discount on annual. Centurion is structured per member. Annual plans can be cancelled at any time with the unused portion refunded; monthly plans cancel at the end of the current billing cycle."},
  {q:"Are bookings included in the membership price?", a:"Bookings themselves are free — Alfred does not charge a per-booking fee on top of the venue's cost. Members pay only what the venue charges. The exception is event hospitality (Monaco GP, Miami F1, Roland Garros, Royal Ascot, Ibiza Opening) where ticket and hospitality packages are sold at face value plus a small handling fee."},
  {q:"Can I gift an Alfred membership?", a:"Yes. Gift memberships are available for Gold and Platinum at the contact page. The recipient receives an onboarding email and gets full member status from day one of the gift period."},
  {q:"What if I only need Alfred for one trip or event?", a:"Members can sign up for a single month at the Platinum tier to cover a trip — Monaco Grand Prix weekend, a week in Paris, a Miami F1 visit — and cancel at the end of the month with no penalty. The full Platinum benefits apply during the active period."},
  {q:"How does Alfred compare to Quintessentially or Velocity Black?", a:"Quintessentially has the broadest global footprint and the longest brand history but is roughly 5–10x the price of Alfred Platinum and runs primarily on email and phone, not an app. Velocity Black was the closest US-based comparable; it was acquired by Capital One in 2023 and the consumer product was discontinued. Alfred is the modern alternative — app-first, transparent pricing, four-city focus, real human team."},
  {q:"What is the cancellation policy?", a:"Cancel any plan at any time from the app's account settings. Monthly plans cancel at the end of the current billing cycle. Annual plans can be cancelled mid-term with the unused portion refunded pro-rata. There are no early-termination fees and no automatic renewal traps."},
  {q:"Are there hidden fees, gratuities or surcharges?", a:"No. The membership price is the price. The only additional costs are what you spend at the venue — the dinner bill, the bottle, the rental, the charter — and any government taxes or service charges that apply to that booking."},
  {q:"Is Alfred available in cities other than Miami, Paris, Dubai and London?", a:"The full concierge team is in those four cities. Alfred can arrange experiences worldwide — private jets, yacht charters in the Mediterranean, ski chalets in the Alps, hotels globally — but on-the-ground concierge support is concentrated in our four core cities."}
];

var JSONLD = [
  {
    "@context":"https://schema.org",
    "@type":"Product",
    "name":"Alfred Concierge Membership",
    "description":"Membership in Alfred Concierge — luxury concierge app for Miami, Paris, Dubai and London. Three tiers from app-only access to a dedicated personal agent.",
    "brand":{"@type":"Brand","name":"Alfred Concierge"},
    "offers":[
      {"@type":"Offer","name":"Alfred Gold","price":"9.99","priceCurrency":"USD","priceSpecification":{"@type":"UnitPriceSpecification","price":"9.99","priceCurrency":"USD","unitCode":"MON"},"availability":"https://schema.org/InStock","url":"https://alfredconcierge.app/pricing#gold"},
      {"@type":"Offer","name":"Alfred Platinum","price":"99","priceCurrency":"USD","priceSpecification":{"@type":"UnitPriceSpecification","price":"99","priceCurrency":"USD","unitCode":"MON"},"availability":"https://schema.org/InStock","url":"https://alfredconcierge.app/pricing#platinum"},
      {"@type":"Offer","name":"Alfred Centurion","priceCurrency":"USD","availability":"https://schema.org/LimitedAvailability","url":"https://alfredconcierge.app/pricing#centurion","description":"Invite-only. Pricing structured per member."}
    ],
    "aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"2400"}
  },
  {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": FAQ.map(function(f){
      return {"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}};
    })
  },
  {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},
      {"@type":"ListItem","position":2,"name":"Pricing","item":"https://alfredconcierge.app/pricing"}
    ]
  }
];

export default function PricingPage(){
  var navigate = useNavigate();
  useEffect(function(){ window.scrollTo(0,0); }, []);

  return (
    <div style={{background:C.bg, minHeight:"100vh", color:C.s1}}>
      <SEOHead
        title="Alfred Pricing — Membership Tiers from $9.99/month | Alfred Concierge"
        description="Alfred Concierge memberships from $9.99/month. Gold: full app access and AI concierge. Platinum $99/month: real human concierge team, VIP venue benefits. Centurion: invite-only dedicated agent. Compare every tier."
        keywords="Alfred Concierge pricing, Alfred membership cost, luxury concierge price, Alfred Gold price, Alfred Platinum price, Alfred Centurion, concierge app pricing, how much does a concierge cost, luxury concierge subscription"
        path="/pricing"
        type="website"
        jsonLd={JSONLD}
      />

      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,10,11,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid "+C.bd,padding:"0 40px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={function(){navigate("/")}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L28 26H4L16 4Z" stroke={C.gold} strokeWidth="1.5" fill="none"/>
            <path d="M16 4L28 26H4L16 4Z" fill={C.gold} fillOpacity="0.1"/>
          </svg>
          <span style={{...sf(16,600),color:C.s1}}>Alfred</span>
        </div>
        <div style={{display:"flex",gap:24,alignItems:"center"}}>
          <a href="/about" style={{...sf(13,400),color:C.s5,textDecoration:"none"}}>About</a>
          <a href="/how-it-works" style={{...sf(13,400),color:C.s5,textDecoration:"none"}}>How it Works</a>
          <a href="/contact" style={{...sf(13,400),color:C.s5,textDecoration:"none"}}>Contact</a>
        </div>
      </nav>

      <article style={{maxWidth:1100,margin:"0 auto",padding:"80px 40px 120px"}}>
        <header style={{textAlign:"center",maxWidth:680,margin:"0 auto 64px"}}>
          <p style={{...sf(11,600),color:C.s7,letterSpacing:4,textTransform:"uppercase",marginBottom:16}}>Pricing</p>
          <h1 style={{...sf(56,700),letterSpacing:-2,lineHeight:1.05,marginBottom:24,color:C.s1}}>Three tiers. One concierge. Every door open.</h1>
          <p style={{...sf(20,400),color:C.s4,lineHeight:1.55}}>Transparent pricing. No per-booking fees. Cancel anytime.</p>
        </header>

        {/* Tier cards */}
        <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20,marginBottom:96}}>
          {TIERS.map(function(t){
            var isPlat = t.id==="platinum";
            return <div key={t.id} id={t.id} style={{position:"relative",borderRadius:24,background:isPlat?C.el:C.el,border:isPlat?"1.5px solid rgba(244,244,245,0.18)":"1px solid "+C.bd,padding:"40px 32px",display:"flex",flexDirection:"column",boxShadow:isPlat?"0 20px 60px rgba(0,0,0,0.3)":"none",transform:isPlat?"translateY(-4px)":"none"}}>
              {t.badge && <div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",padding:"5px 16px",borderRadius:"0 0 12px 12px",background:C.s1,...sf(10,700),color:C.bg,letterSpacing:1}}>{t.badge}</div>}
              <div style={{...sf(10,600),color:C.s6,letterSpacing:2,textTransform:"uppercase",marginBottom:12,marginTop:t.badge?8:0}}>{t.label}</div>
              <div style={{...sf(28,700),color:C.s1,marginBottom:6,letterSpacing:-0.5}}>{t.name}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:18}}>
                <span style={{...sf(38,700),color:C.s1}}>{t.price}</span>
                {t.cadence && <span style={{...sf(15),color:C.s6}}>{t.cadence}</span>}
              </div>
              <p style={{...sf(14,400),color:C.s4,lineHeight:1.6,marginBottom:24,minHeight:60}}>{t.summary}</p>
              <div style={{height:0.5,background:C.bd,marginBottom:20}}/>
              <div style={{flex:1,marginBottom:24}}>
                {t.features.map(function(f,i){
                  return <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:14}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isPlat?C.s2:C.s5} strokeWidth="2" strokeLinecap="round" style={{marginTop:2,flexShrink:0}}><path d="M20 6L9 17l-5-5"/></svg>
                    <span style={{...sf(13,400),color:isPlat?C.s3:C.s4,lineHeight:1.55}}>{f}</span>
                  </div>;
                })}
              </div>
              <a href={t.id==="centurion"?"/contact":"#"} style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"15px 0",borderRadius:14,background:isPlat?C.s1:"transparent",border:isPlat?"none":"1px solid "+C.bd,...sf(14,600),color:isPlat?C.bg:C.s1,textDecoration:"none"}}>{t.cta}</a>
            </div>;
          })}
        </section>

        {/* Comparison narrative */}
        <section style={{maxWidth:780,margin:"0 auto",marginBottom:80}}>
          <h2 style={{...sf(32,600),color:C.s1,marginBottom:24,letterSpacing:-0.7}}>Choosing the right tier</h2>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>Most members start at Gold to see the catalogue and use the AI concierge for restaurant discovery and event browsing. It is the right tier for someone who wants the modern app surface — search, recommendations, integrated booking with Resy and OpenTable — but is not ready to commit to the full concierge service.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>Platinum is the inflection point. It adds a real human concierge team behind every request and unlocks the operational benefits that make the difference at premium venues — waived advance payments, reduced minimum spends on bottles, VIP table placement, skipped queues, the right waiter on your table. If you book three or four premium nights out a month or take more than one trip a quarter to one of our cities, Platinum pays for itself in waived minimums alone. The $99 a month membership is small relative to a single waived $500 advance payment at LIV Miami or a guaranteed table at Carbone the week of Art Basel.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>Centurion is for members who want a single named agent on call 24/7 — someone who knows their preferences, their travel patterns, their family, and the standing relationships at venues. It is structured per member rather than priced as a SKU, and the right way to start the conversation is to apply through the <a href="/contact" style={{color:C.s1,textDecoration:"underline"}}>contact page</a>.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75}}>All tiers can be cancelled at any time. Memberships paid annually are refunded pro-rata on cancellation. There are no per-booking surcharges, no automatic renewal traps and no upsell pressure once you're in.</p>
        </section>

        {/* What's not charged */}
        <section style={{maxWidth:780,margin:"0 auto",marginBottom:80}}>
          <h2 style={{...sf(32,600),color:C.s1,marginBottom:24,letterSpacing:-0.7}}>What is and isn't included</h2>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>The membership covers the concierge service itself — the catalogue, the bookings, the human team, the relationships and the benefits. It does not cover what you spend at the venue: the dinner, the bottle, the car rental, the yacht day, the jet hour. Those are billed at the venue's rate and paid through the app at point of booking or to the venue at the time of service, depending on the category.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75}}>Event hospitality — Monaco Grand Prix, Miami F1, Roland Garros, Royal Ascot, Ibiza Opening — is sold at face value plus a small handling fee that is disclosed at the time of booking. There is never a hidden mark-up on tickets or hospitality packages.</p>
        </section>

        {/* FAQ */}
        <section style={{maxWidth:780,margin:"0 auto",marginBottom:48}}>
          <h2 style={{...sf(32,600),color:C.s1,marginBottom:32,letterSpacing:-0.7}}>Pricing FAQ</h2>
          {FAQ.map(function(f,i){
            return <details key={i} style={{borderBottom:"1px solid "+C.bd,padding:"22px 0"}}>
              <summary style={{...sf(16,500),color:C.s1,cursor:"pointer",listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span>{f.q}</span>
                <span style={{...sf(20,300),color:C.s5}}>+</span>
              </summary>
              <p style={{...sf(15,400),color:C.s4,lineHeight:1.7,marginTop:14}}>{f.a}</p>
            </details>;
          })}
        </section>

        <section style={{maxWidth:780,margin:"0 auto"}}>
          <div style={{padding:"36px 32px",borderRadius:16,background:C.el,border:"1px solid "+C.bd,textAlign:"center"}}>
            <h3 style={{...sf(24,600),color:C.s1,marginBottom:12,letterSpacing:-0.3}}>Still deciding?</h3>
            <p style={{...sf(15,400),color:C.s4,lineHeight:1.6,marginBottom:24,maxWidth:480,margin:"0 auto 24px"}}>Start with Alfred Gold to see the catalogue. Upgrade to Platinum any time — your account, history and preferences carry over.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <a href="/how-it-works" style={{display:"inline-flex",alignItems:"center",padding:"14px 22px",borderRadius:12,background:C.s1,color:C.bg,...sf(14,600),textDecoration:"none"}}>See how it works</a>
              <a href="/contact" style={{display:"inline-flex",alignItems:"center",padding:"14px 22px",borderRadius:12,border:"1px solid "+C.bd,color:C.s1,...sf(14,600),textDecoration:"none"}}>Talk to Alfred</a>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
