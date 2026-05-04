import { useEffect } from "react";
import SEOHead from "../components/SEOHead";
import {
  T, type
} from "../lib/brand";
import {
  Hero, BrandNav, SerifWordmark, SilverText, FilmGrain,
  SectionHeader, PrimaryCTA, GhostCTA, GlassCard, Eyebrow, Divider,
  useReveal, revealStyle, useMobile
} from "../components/brand";

var T_ = T; // shadow alias for nested closures

var TIERS = [
  {
    id:"gold", label:"Entry",
    name:"Alfred Gold", italicWord:"Gold",
    price:"$9.99", cadence:"/ month",
    summary:"The catalogue, the AI concierge, and integrated bookings. The right tier to see what Alfred is.",
    features:[
      "Full app and catalogue access",
      "AI concierge chat agent",
      "Bookings via Resy, OpenTable, SevenRooms, Tock",
      "Global venue catalogue across four cities",
      "Event discovery and ticketing access",
      "Up to four secondary profiles",
      "End-to-end encrypted messaging",
      "Cancel anytime"
    ],
    cta:"Get Alfred Gold", ctaHref:"#"
  },
  {
    id:"platinum", label:"Recommended",
    name:"Alfred Platinum", italicWord:"Platinum",
    price:"$99", cadence:"/ month",
    summary:"Everything in Gold plus a real human concierge team and the operational benefits that real luxury concierge work depends on.",
    badge:"Most Popular",
    features:[
      "Everything in Alfred Gold",
      "Real human concierge — named operators",
      "Skip the line outside and at check-in",
      "Strategic table placement at partner venues",
      "Reduced minimum spend on alcohol and food",
      "Waived advance payment requirement",
      "VIP flag in venue systems — upgrade eligibility",
      "Most experienced waiter and bottle service",
      "Waived valet at partner venues",
      "Custom bottle parade and shoutouts on request",
      "Music request selection at partner clubs",
      "Exclusive event access and pre-sale windows",
      "Concierge consultancy and trip advice"
    ],
    cta:"Get Alfred Platinum", ctaHref:"#",
    featured: true
  },
  {
    id:"centurion", label:"Invite Only",
    name:"Alfred Centurion", italicWord:"Centurion",
    price:"By invitation", cadence:"",
    summary:"A single named agent for every aspect of a member's life. The full Alfred operation, dedicated, twenty-four hours a day.",
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
    ],
    cta:"Apply for Centurion", ctaHref:"/contact"
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

function TierCard({tier, mobile}){
  var r = useReveal(0.05);
  var featured = !!tier.featured;
  return (
    <div ref={r.ref} style={{...revealStyle(r.visible), height:"100%"}}>
      <GlassCard featured={featured} sheen={featured} padded={false} style={{
        height:"100%", display:"flex", flexDirection:"column",
        padding: mobile ? "32px 24px" : "40px 30px",
        position:"relative",
        transform: featured ? "translateY(-8px)" : "none"
      }}>
        {tier.badge && <div style={{
          position:"absolute", top:0, left:"50%", transform:"translateX(-50%) translateY(-50%)",
          padding:"6px 16px", borderRadius:999,
          background: T_.silverGradient,
          color:"#0E0E11", ...type.kicker(), letterSpacing:1.4,
          boxShadow:"0 6px 16px rgba(220,220,224,0.15)"
        }}>{tier.badge}</div>}

        <Eyebrow color={featured ? T_.silver : T_.silverDim}>{tier.label}</Eyebrow>

        <div style={{marginTop:14, marginBottom:8, lineHeight:1.1}}>
          <span style={{...type.cardSerif(28), color:T_.text}}>Alfred </span>
          <SilverText style={{...type.cardSerif(28), fontStyle:"italic"}}>{tier.italicWord}</SilverText>
        </div>

        <div style={{display:"flex", alignItems:"baseline", gap:6, marginBottom:18}}>
          <span style={{...type.italicSerif(38), color:T_.text}}>{tier.price}</span>
          {tier.cadence && <span style={{...type.bodySm(), color:T_.textDim}}>{tier.cadence}</span>}
        </div>

        <p style={{...type.body(), color:T_.textMid, marginBottom:24, minHeight:56}}>{tier.summary}</p>

        <div style={{height:0.5, background:T_.border, marginBottom:20}}/>

        <div style={{flex:1, marginBottom:24}}>
          {tier.features.map(function(f, i){
            return <div key={i} style={{display:"flex", alignItems:"flex-start", gap:10, marginBottom:12}}>
              <div style={{
                width:16, height:16, borderRadius:"50%",
                background:"rgba(255,255,255,0.06)",
                border:`0.5px solid ${T_.border2}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                marginTop:2, flexShrink:0
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={featured ? T_.silver : T_.textMid} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <span style={{...type.body(), color: featured ? T_.text : T_.textMid, fontSize:13.5}}>{f}</span>
            </div>;
          })}
        </div>

        {featured ? (
          <PrimaryCTA href={tier.ctaHref} fullWidth size="lg">{tier.cta}</PrimaryCTA>
        ) : (
          <GhostCTA href={tier.ctaHref} fullWidth>{tier.cta}</GhostCTA>
        )}
      </GlassCard>
    </div>
  );
}

function FaqItem({q, a, mobile}){
  return (
    <details style={{
      borderBottom:`0.5px solid ${T_.border2}`,
      padding: mobile ? "20px 0" : "24px 0"
    }}>
      <summary style={{
        ...type.cardSerif(mobile ? 17 : 19),
        color:T_.text, cursor:"pointer", listStyle:"none",
        display:"flex", justifyContent:"space-between", alignItems:"center", gap:16
      }}>
        <span>{q}</span>
        <span aria-hidden style={{...type.kicker(), color:T_.silverDim, flexShrink:0}}>+</span>
      </summary>
      <p style={{...type.bodyLg(), color:T_.textMid, marginTop:14, maxWidth:680}}>{a}</p>
    </details>
  );
}

export default function PricingPage(){
  var mobile = useMobile();
  useEffect(function(){ window.scrollTo(0,0); }, []);

  return (
    <div style={{background:T_.bg, minHeight:"100vh", color:T_.text}}>
      <SEOHead
        title="Alfred Pricing — Membership Tiers from $9.99/month | Alfred Concierge"
        description="Alfred Concierge memberships from $9.99/month. Gold: full app access and AI concierge. Platinum $99/month: real human concierge team, VIP venue benefits. Centurion: invite-only dedicated agent. Compare every tier."
        keywords="Alfred Concierge pricing, Alfred membership cost, luxury concierge price, Alfred Gold price, Alfred Platinum price, Alfred Centurion, concierge app pricing, how much does a concierge cost, luxury concierge subscription"
        path="/pricing"
        type="website"
        jsonLd={JSONLD}
      />

      <BrandNav mobile={mobile} links={[
        {label:"About", href:"/about"},
        {label:"How it Works", href:"/how-it-works"},
        {label:"Pricing", href:"/pricing", active:true},
        {label:"Contact", href:"/contact"}
      ]}/>

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <Hero mobile={mobile} height={mobile ? 480 : 620} scrim={true}>
        <div style={{
          height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end",
          padding: mobile ? "0 22px 56px" : "0 56px 80px", maxWidth:1200, margin:"0 auto"
        }}>
          <Eyebrow dot accent={T_.warm}>Membership</Eyebrow>
          <h1 style={{
            ...(mobile ? type.heroSerifMobile() : type.heroSerif()),
            color:T_.text, marginTop:18, maxWidth:880
          }}>
            Three tiers.<br/>One concierge.<br/>
            <SilverText style={{fontStyle:"italic"}}>Every door open.</SilverText>
          </h1>
          <p style={{
            ...type.bodyLg(), color:T_.textMid, marginTop:18, maxWidth:560
          }}>
            Transparent pricing. No per-booking fees. Cancel any plan at any time.
          </p>
        </div>
      </Hero>

      {/* ─── TIER CARDS ───────────────────────────────────────────── */}
      <section style={{
        padding: mobile ? "60px 22px 80px" : "100px 56px 120px",
        maxWidth:1200, margin:"0 auto"
      }}>
        <div style={{
          display:"grid",
          gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
          gap: mobile ? 16 : 20,
          alignItems:"stretch"
        }}>
          {TIERS.map(function(t){ return <TierCard key={t.id} tier={t} mobile={mobile}/>; })}
        </div>
        <p style={{
          textAlign:"center", marginTop:36,
          ...type.caption(), color:T_.textDim, letterSpacing:1.5, textTransform:"uppercase"
        }}>End-to-end encryption · No advertising · Cancel anytime</p>
      </section>

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      {/* ─── CHOOSING THE RIGHT TIER ──────────────────────────────── */}
      <ChoosingSection mobile={mobile}/>

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      {/* ─── WHAT'S INCLUDED ─────────────────────────────────────── */}
      <IncludedSection mobile={mobile}/>

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      {/* ─── FAQ ─────────────────────────────────────────────────── */}
      <section style={{
        padding: mobile ? "60px 22px 80px" : "100px 56px 120px",
        maxWidth:980, margin:"0 auto"
      }}>
        <SectionHeader
          kicker="Pricing FAQ"
          title="Questions members ask before they sign up"
        />
        <div>
          {FAQ.map(function(f, i){ return <FaqItem key={i} q={f.q} a={f.a} mobile={mobile}/>; })}
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────── */}
      <section style={{
        padding: mobile ? "60px 22px 100px" : "80px 56px 140px",
        maxWidth:1200, margin:"0 auto"
      }}>
        <GlassCard featured sheen padded={false} style={{
          padding: mobile ? "40px 28px" : "64px 56px",
          textAlign:"center"
        }}>
          <Eyebrow color={T_.silver}>Still deciding</Eyebrow>
          <h2 style={{
            ...type.sectionSerif(), fontSize: mobile ? 28 : 34,
            color:T_.text, marginTop:14, marginBottom:14, lineHeight:1.15
          }}>
            Start with <SilverText style={{fontStyle:"italic"}}>Gold</SilverText>.<br/>
            Upgrade any time.
          </h2>
          <p style={{
            ...type.bodyLg(), color:T_.textMid, maxWidth:520, margin:"0 auto 28px"
          }}>Your account, history, and preferences carry across tiers.</p>
          <div style={{
            display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap"
          }}>
            <PrimaryCTA href="/how-it-works">See how it works</PrimaryCTA>
            <GhostCTA href="/contact">Talk to Alfred</GhostCTA>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

function ChoosingSection({mobile}){
  var r = useReveal();
  return (
    <section ref={r.ref} style={{
      padding: mobile ? "60px 22px 60px" : "100px 56px 80px",
      maxWidth:880, margin:"0 auto",
      ...revealStyle(r.visible)
    }}>
      <SectionHeader
        kicker="Choosing your tier"
        title="Which tier is the right entry point"
      />
      <div style={{display:"flex", flexDirection:"column", gap:22}}>
        <p style={{...type.bodyLg(), color:T_.textMid}}>
          Most members start at <span style={{color:T_.text}}>Gold</span> to see the catalogue and use the AI concierge for restaurant discovery and event browsing. It is the right tier for someone who wants the modern app surface — search, recommendations, integrated booking — without committing to the full concierge service.
        </p>
        <p style={{...type.bodyLg(), color:T_.textMid}}>
          <span style={{color:T_.text}}>Platinum</span> is the inflection point. It adds a real human concierge team behind every request and unlocks the operational benefits that make the difference at premium venues — waived advance payments, reduced minimum spends on bottles, VIP table placement, skipped queues, the right waiter on your table. If you book three or four premium nights out a month or take more than one trip a quarter to one of our cities, Platinum pays for itself in waived minimums alone.
        </p>
        <p style={{...type.bodyLg(), color:T_.textMid}}>
          <span style={{color:T_.text}}>Centurion</span> is for members who want a single named agent on call twenty-four hours a day — someone who knows their preferences, their travel patterns, their family, and the standing relationships at venues. It is structured per member rather than priced as a SKU, and the right way to start the conversation is to apply through the <a href="/contact" style={{color:T_.text, textDecoration:"underline", textUnderlineOffset:3}}>contact page</a>.
        </p>
        <p style={{...type.bodyLg(), color:T_.textMid}}>
          All tiers can be cancelled at any time. Memberships paid annually are refunded pro-rata on cancellation. There are no per-booking surcharges, no automatic renewal traps and no upsell pressure once you're in.
        </p>
      </div>
    </section>
  );
}

function IncludedSection({mobile}){
  var r = useReveal();
  return (
    <section ref={r.ref} style={{
      padding: mobile ? "60px 22px 60px" : "80px 56px 100px",
      maxWidth:880, margin:"0 auto",
      ...revealStyle(r.visible)
    }}>
      <SectionHeader
        kicker="What's included"
        title="What the membership covers, and what it doesn't"
      />
      <div style={{display:"flex", flexDirection:"column", gap:22}}>
        <p style={{...type.bodyLg(), color:T_.textMid}}>
          The membership covers the concierge service itself — the catalogue, the bookings, the human team, the relationships and the benefits. It does not cover what you spend at the venue: the dinner, the bottle, the car rental, the yacht day, the jet hour. Those are billed at the venue's rate and paid through the app at point of booking or to the venue at the time of service, depending on the category.
        </p>
        <p style={{...type.bodyLg(), color:T_.textMid}}>
          Event hospitality — Monaco Grand Prix, Miami F1, Roland Garros, Royal Ascot, Ibiza Opening — is sold at face value plus a small handling fee that is disclosed at the time of booking. There is never a hidden mark-up on tickets or hospitality packages.
        </p>
      </div>
    </section>
  );
}
