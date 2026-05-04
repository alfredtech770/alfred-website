import { useEffect } from "react";
import SEOHead from "../components/SEOHead";
import { T, type } from "../lib/brand";
import {
  Hero, BrandNav, SilverText, SectionHeader, PrimaryCTA, GhostCTA,
  GlassCard, Eyebrow, Divider, useReveal, revealStyle, useMobile
} from "../components/brand";

var T_ = T;

var DIFFERENTIATORS = [
  {
    title: "Real humans, not chatbots",
    body: "Every booking is verified by a human concierge before it goes out. Centurion members get a single named agent who handles every request, twenty-four hours a day, on WhatsApp."
  },
  {
    title: "Direct relationships at every venue",
    body: "We do not work through third-party APIs for our top venues. Our concierges have direct lines to managers at LIV, E11even, Zuma, Cipriani, Casa Tua, Raspoutine, Castel, and the rest of our partner roster."
  },
  {
    title: "Member benefits that move the needle",
    body: "Reduced minimum spends, waived advance payments, VIP flags in venue systems, priority placement and complimentary upgrades — concrete benefits negotiated on behalf of members, not vague perks."
  },
  {
    title: "One app, four cities, one team",
    body: "Miami, Paris, Dubai and London under a single membership. No regional sub-services, no separate apps, no handoffs between teams when you cross a border."
  }
];

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

function ProseSection({kicker, title, paragraphs, mobile}){
  var r = useReveal();
  return (
    <section ref={r.ref} style={{
      padding: mobile ? "60px 22px" : "100px 56px",
      maxWidth: 880, margin: "0 auto",
      ...revealStyle(r.visible)
    }}>
      <SectionHeader kicker={kicker} title={title}/>
      <div style={{display:"flex", flexDirection:"column", gap:22}}>
        {paragraphs.map(function(p, i){
          return <p key={i} style={{...type.bodyLg(), color:T_.textMid}} dangerouslySetInnerHTML={{__html:p}}/>;
        })}
      </div>
    </section>
  );
}

export default function AboutPage(){
  var mobile = useMobile();
  useEffect(function(){ window.scrollTo(0,0); }, []);

  return (
    <div style={{background:T_.bg, minHeight:"100vh", color:T_.text}}>
      <SEOHead
        title="About Alfred — The Luxury Concierge App for Miami, Paris, Dubai & London"
        description="Learn about Alfred Concierge: real human concierges, an AI assistant, and member-only access to Michelin restaurants, VIP nightlife, jets, yachts and exotic cars across Miami, Paris, Dubai and London."
        keywords="about Alfred Concierge, luxury concierge company, who is Alfred, Alfred concierge founders, Alfred app team, Miami concierge company, Paris concierge company"
        path="/about"
        type="website"
        jsonLd={JSONLD}
      />

      <BrandNav mobile={mobile} links={[
        {label:"About", href:"/about", active:true},
        {label:"How it Works", href:"/how-it-works"},
        {label:"Pricing", href:"/pricing"},
        {label:"Contact", href:"/contact"}
      ]}/>

      <Hero mobile={mobile} height={mobile ? 480 : 620}>
        <div style={{
          height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end",
          padding: mobile ? "0 22px 56px" : "0 56px 80px", maxWidth:1200, margin:"0 auto"
        }}>
          <Eyebrow dot accent={T_.warm}>About</Eyebrow>
          <h1 style={{
            ...(mobile ? type.heroSerifMobile() : type.heroSerif()),
            color:T_.text, marginTop:18, maxWidth:980
          }}>
            The luxury concierge for people who value their{" "}
            <SilverText style={{fontStyle:"italic"}}>time</SilverText>{" "}above everything else.
          </h1>
          <p style={{
            ...type.bodyLg(), color:T_.textMid, marginTop:18, maxWidth:580
          }}>
            One app. One concierge team. Every door open across Miami, Paris, Dubai and London.
          </p>
        </div>
      </Hero>

      <ProseSection
        mobile={mobile}
        kicker="Why Alfred exists"
        title="Two systems that didn't quite work — and one that does"
        paragraphs={[
          "The traditional luxury concierge industry runs on phone calls, email chains, fax confirmations and a thousand favours owed across hotel front desks, restaurant managers and event promoters. It works — but it is slow, opaque, and built for a different generation. The newer apps that tried to fix this went the other way: chatbots, generic recommendations, no real relationships, no accountability when things go wrong at 11pm on a Saturday in South Beach.",
          "Alfred sits between the two. We built an app that puts the catalogue, the bookings and the receipts in your pocket — and behind that app sits a real concierge team with real relationships at the venues that matter. Every Michelin restaurant we book has a manager who picks up our call. Every nightclub has a host who walks our members in. Every yacht broker, jet operator and supercar fleet on our platform is one we have used personally.",
          "That combination — modern interface, traditional relationships — is the entire premise of Alfred."
        ]}
      />

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      <ProseSection
        mobile={mobile}
        kicker="What we do"
        title="Seven categories of curated luxury, one chat thread"
        paragraphs={[
          "Alfred members get instant access to seven categories of curated luxury experience: Michelin and impossible-reservation dining, VIP tables and bottle service at the world's top nightclubs, exotic and luxury car rentals delivered to the door, private jet charters with empty-leg deals, day yachts and superyachts with full crew, wellness and spa bookings at the best venues in each city, and luxury hotel reservations with member benefits across our partner network.",
          "We also handle the things that don't fit a category — last-minute private chefs, courtside seats, helicopter transfers, jewellery stylists, surprise proposals on the Eiffel Tower at 9pm. If it can be arranged in one of our cities, Alfred has a person who can arrange it.",
          "Tickets and hospitality for the world's marquee events — Monaco Grand Prix, Miami F1, Roland Garros, Royal Ascot, Ibiza Opening — are sold directly through the app each season."
        ]}
      />

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      {/* Differentiator grid */}
      <DifferentiatorSection mobile={mobile}/>

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      <ProseSection
        mobile={mobile}
        kicker="Where we operate"
        title="Four cities. One team. Same app."
        paragraphs={[
          "Alfred operates a curated catalogue across four cities. Miami is the home market, with the deepest catalogue across dining, nightlife, yacht charters out of Miami Beach and Biscayne Bay, and exotic car rentals delivered anywhere from South Beach to Star Island. Paris covers Michelin and bistronomy reservations, the top nightclubs of the 8th and 1st arrondissements, hotel partnerships from the Costes group through to the Bristol, and the spa and beauty venues that define Parisian wellness. Dubai handles the supercar fleet, beach club access, helicopter transfers and the increasingly important off-season hospitality calendar. London covers private members' clubs, fine dining across Mayfair and Notting Hill, Royal Ascot hospitality and the city's best wellness and spa venues.",
          "Members travelling between cities use the same app, the same concierge team and the same membership tier. There is no <span style=\"color:" + T_.text + "\">Alfred Paris</span> or <span style=\"color:" + T_.text + "\">Alfred Dubai</span> — there is just Alfred."
        ]}
      />

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      <ProseSection
        mobile={mobile}
        kicker="Membership and trust"
        title="Three tiers, end-to-end encryption, no advertising"
        paragraphs={[
          "Alfred operates three membership tiers — <span style=\"color:" + T_.text + "\">Gold</span>, <span style=\"color:" + T_.text + "\">Platinum</span> and <span style=\"color:" + T_.text + "\">Centurion</span> — designed to match the way our members actually live. Gold gives full app access for $9.99 per month and is the right tier for someone who wants the catalogue, the AI concierge and access to the booking integrations. Platinum at $99 per month adds direct human concierge support, VIP venue placement, reduced minimum spends and the operational benefits that real luxury concierge work depends on. Centurion is invite-only and assigns a single named agent to handle every aspect of a member's life — from airport coordination to private event curation.",
          "All plans are protected by end-to-end encryption, contain no advertising, and can be cancelled at any time. Members own their data; Alfred does not sell it, share it with venues without explicit consent, or use it to retarget for advertising."
        ]}
      />

      {/* Final CTA */}
      <section style={{
        padding: mobile ? "40px 22px 100px" : "80px 56px 140px",
        maxWidth:1200, margin:"0 auto"
      }}>
        <GlassCard featured sheen padded={false} style={{
          padding: mobile ? "40px 28px" : "64px 56px",
          textAlign:"center"
        }}>
          <Eyebrow color={T_.silver}>Ready to start</Eyebrow>
          <h2 style={{
            ...type.sectionSerif(), fontSize: mobile ? 28 : 34,
            color:T_.text, marginTop:14, marginBottom:14, lineHeight:1.15
          }}>
            The fastest way to understand Alfred is{" "}
            <SilverText style={{fontStyle:"italic"}}>to use it.</SilverText>
          </h2>
          <p style={{
            ...type.bodyLg(), color:T_.textMid, maxWidth:560, margin:"0 auto 28px"
          }}>
            Browse the catalogue, see how it works, or compare membership tiers.
          </p>
          <div style={{display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap"}}>
            <PrimaryCTA href="/pricing">Compare memberships</PrimaryCTA>
            <GhostCTA href="/contact">Talk to Alfred</GhostCTA>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

function DifferentiatorSection({mobile}){
  var r = useReveal();
  return (
    <section ref={r.ref} style={{
      padding: mobile ? "60px 22px" : "100px 56px",
      maxWidth:1100, margin:"0 auto",
      ...revealStyle(r.visible)
    }}>
      <SectionHeader
        kicker="How we are different"
        title="The four things that change the experience"
        align="center"
      />
      <div style={{
        display:"grid",
        gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
        gap: mobile ? 14 : 18
      }}>
        {DIFFERENTIATORS.map(function(d, i){
          return <GlassCard key={i} style={{padding: mobile ? "28px 24px" : "36px 32px"}}>
            <Eyebrow color={T_.silverDim}>{("0" + (i+1)).slice(-2)}</Eyebrow>
            <h3 style={{...type.cardSerif(22), color:T_.text, margin:"12px 0 12px"}}>{d.title}</h3>
            <p style={{...type.body(), color:T_.textMid}}>{d.body}</p>
          </GlassCard>;
        })}
      </div>
    </section>
  );
}
