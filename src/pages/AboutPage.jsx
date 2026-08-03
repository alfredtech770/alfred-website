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
    title: "Human request coordination",
    body: "Concierge-supported requests are reviewed by a person who checks the relevant provider, current availability and the terms offered for your dates."
  },
  {
    title: "Clear confirmations",
    body: "A request is not presented as booked until the provider has confirmed it. Pricing, deposits and cancellation conditions are shared before approval."
  },
  {
    title: "Alternatives when plans change",
    body: "When the first option is unavailable, Alfred can research alternatives that match the location, timing, party size and budget in the request."
  },
  {
    title: "One app, seven destinations, one team",
    body: "The catalog and request flow cover Miami, Paris, Ibiza, Saint-Tropez, Mykonos, Dubai and London in one app. Current coverage for any service is confirmed when you ask."
  }
];

var JSONLD = {
  "@context":"https://schema.org",
  "@type":"AboutPage",
  "name":"About Alfred Concierge",
  "url":"https://alfredconcierge.app/about",
  "description":"Alfred Concierge is a request-based app for restaurants, hotels, transport and private services across seven destinations.",
  "mainEntity":{
    "@type":"Organization",
    "name":"Alfred Concierge",
    "url":"https://alfredconcierge.app",
    "logo":"https://alfredconcierge.app/og-image.jpg",
    "description":"Alfred is a concierge app for discovering options and coordinating requests across seven destinations.",
    "foundingDate":"2024",
    "areaServed":[
      {"@type":"City","name":"Miami"},
      {"@type":"City","name":"Paris"},
      {"@type":"AdministrativeArea","name":"Ibiza"},
      {"@type":"City","name":"Saint-Tropez"},
      {"@type":"AdministrativeArea","name":"Mykonos"},
      {"@type":"City","name":"Dubai"},
      {"@type":"City","name":"London"}
    ],
    "sameAs":["https://www.instagram.com/askalfred.app","https://www.tiktok.com/@alfred.app"]
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
        title="About Alfred — The Concierge Request App"
        description="Learn how Alfred helps people discover and request restaurants, hotels, transport and private services across seven destinations."
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
            One app for discovering options and coordinating requests across seven destinations.
          </p>
        </div>
      </Hero>

      <ProseSection
        mobile={mobile}
        kicker="Why Alfred exists"
        title="A clearer way to coordinate city requests"
        paragraphs={[
          "Planning a night out or a trip often means comparing several websites, calling providers and keeping track of separate terms. Alfred brings discovery and request coordination into one place.",
          "You share the city, dates, party size, preferences and budget. Alfred can then check relevant providers and return current options for review.",
          "Availability and final terms come from the provider. Nothing is described as confirmed until those details are checked and you approve them."
        ]}
      />

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      <ProseSection
        mobile={mobile}
        kicker="What we do"
        title="Multiple service categories, one request flow"
        paragraphs={[
          "The catalog covers dining, nightlife, hotels, cars, yachts, private aviation and wellness. Listings are a starting point: each request is checked for the requested city and dates.",
          "Requests can also combine services, such as a hotel, restaurant and transport plan. Alfred will explain which parts can be coordinated and which provider terms apply.",
          "Catalog inclusion does not imply that Alfred is the provider's official site or that availability is held."
        ]}
      />

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      {/* Differentiator grid */}
      <DifferentiatorSection mobile={mobile}/>

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      <ProseSection
        mobile={mobile}
        kicker="Where we operate"
        title="Seven destination guides. One request flow."
        paragraphs={[
          "Alfred publishes request guides for Miami, Paris, Ibiza, Saint-Tropez, Mykonos, Dubai and London. Each guide links to the relevant restaurant, hotel, nightlife, transport and private-service categories.",
          "Coverage changes by date and provider, so the app and concierge request flow are the source for current availability."
        ]}
      />

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      <ProseSection
        mobile={mobile}
        kicker="Membership and terms"
        title="Plan details before you subscribe"
        paragraphs={[
          "Current plan names, prices, billing periods and included support are shown in the app before purchase. Provider costs are separate from any Alfred membership unless the checkout says otherwise.",
          "Privacy choices and data practices are explained in the Privacy Policy. Subscription cancellation and renewal follow the terms shown by the applicable app marketplace and in Alfred's Terms."
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
