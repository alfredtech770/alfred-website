import { useEffect } from "react";
import SEOHead from "../components/SEOHead";
import { T, type } from "../lib/brand";
import {
  BrandNav, Hero, SilverText, Eyebrow, SectionHeader, GlassCard,
  PrimaryCTA, GhostCTA, Divider, useMobile
} from "../components/brand";

var REQUIREMENTS = [
  {title:"Vehicle identity",body:"Stable vehicle or class IDs, make, model, year, category, seats and approved imagery."},
  {title:"Pickup coverage",body:"Exact service locations, delivery zones, operating hours and any one-way restrictions."},
  {title:"Current availability",body:"A calendar or API response that reflects the supplier's actual inventory for the requested dates."},
  {title:"Transparent pricing",body:"The customer-facing total, currency, taxes, delivery fees, deposit and any mandatory extras."},
  {title:"Rental conditions",body:"Insurance, mileage, driver-age and licence rules, cancellation terms and payment timing."},
  {title:"Confirmation workflow",body:"A named operational contact or API path for booking, changes, cancellations and support."}
];

var JSONLD = [
  {
    "@context":"https://schema.org","@type":"WebPage",
    "name":"Car Rental Partnerships with Alfred Concierge",
    "url":"https://alfredconcierge.app/partners/car-rentals",
    "description":"Information for car rental companies, brokers and fleet operators that want to receive requests or provide live inventory to Alfred Concierge."
  },
  {
    "@context":"https://schema.org","@type":"Service",
    "name":"Alfred car-rental partner onboarding",
    "provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},
    "areaServed":["Miami","Paris","Ibiza","Saint-Tropez","Mykonos","Dubai","London"],
    "serviceType":"Car rental partner onboarding"
  }
];

export default function CarPartnersPage(){
  var mobile=useMobile();
  useEffect(function(){window.scrollTo(0,0);},[]);
  return <div style={{background:T.bg,minHeight:"100vh",color:T.text}}>
    <SEOHead
      title="Car Rental Partners — List Your Fleet with Alfred"
      description="Car rental companies, brokers and fleet operators can receive concierge requests or discuss a live inventory integration with Alfred Concierge."
      keywords="Alfred car rental partner, list car rental fleet, luxury car rental distribution, car rental API partner"
      path="/partners/car-rentals"
      jsonLd={JSONLD}
    />
    <BrandNav mobile={mobile} links={[
      {label:"Car partners",href:"/partners/car-rentals",active:true},
      {label:"All partners",href:"/business"},
      {label:"Catalog",href:"/catalog/exotic-cars"},
      {label:"Contact",href:"/contact"}
    ]}/>

    <Hero mobile={mobile} height={mobile?570:680}>
      <div style={{height:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:mobile?"0 22px 60px":"0 56px 82px",maxWidth:1200,margin:"0 auto"}}>
        <Eyebrow dot>CAR RENTAL PARTNERS</Eyebrow>
        <h1 style={{...(mobile?type.heroSerifMobile():type.heroSerif()),maxWidth:980,marginTop:18}}>
          Put your fleet in front of travellers who want a car—and a human to <SilverText style={{fontStyle:"italic"}}>coordinate it.</SilverText>
        </h1>
        <p style={{...type.bodyLg(),color:T.textMid,maxWidth:680,marginTop:20}}>
          Alfred works with rental companies, licensed brokers and fleet operators. Start with supplier-confirmed requests, or discuss a live availability and pricing integration when your systems support it.
        </p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:28}}>
          <PrimaryCTA href="/business?category=Exotic%20Cars#apply">Apply as a fleet partner</PrimaryCTA>
          <GhostCTA href="mailto:ethan@alfredconcierge.app?subject=Car%20rental%20distribution%20partnership">Discuss an integration</GhostCTA>
        </div>
      </div>
    </Hero>

    <section style={{padding:mobile?"64px 22px":"96px 56px",maxWidth:1200,margin:"0 auto"}}>
      <SectionHeader kicker="TWO OPERATING MODELS" title="Start at the level your inventory supports" subtitle="A request listing and a live metasearch feed are different products. Alfred describes each one accurately."/>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:14}}>
        <GlassCard style={{padding:mobile?24:32}}>
          <Eyebrow>01 · REQUEST-BASED</Eyebrow>
          <h2 style={{...type.cardSerif(25),margin:"18px 0 12px"}}>Supplier-confirmed requests</h2>
          <p style={{...type.body(),color:T.textMid}}>Alfred sends the dates, location and vehicle preference to the partner. The partner confirms the exact vehicle, final price, deposit, insurance and cancellation terms before the customer commits.</p>
          <p style={{...type.kicker(),color:T.silverDim,marginTop:22}}>Suitable without a live API</p>
        </GlassCard>
        <GlassCard featured sheen style={{padding:mobile?24:32}}>
          <Eyebrow>02 · LIVE DISTRIBUTION</Eyebrow>
          <h2 style={{...type.cardSerif(25),margin:"18px 0 12px"}}>Availability and pricing feed</h2>
          <p style={{...type.body(),color:T.textMid}}>Approved suppliers can discuss a feed that returns current availability, customer-facing totals and rental conditions. Live prices are displayed only when the source is authorised and the itinerary can be fulfilled.</p>
          <p style={{...type.kicker(),color:T.silverDim,marginTop:22}}>Required for metasearch distribution</p>
        </GlassCard>
      </div>
    </section>

    <Divider/>
    <section style={{padding:mobile?"64px 22px":"96px 56px",maxWidth:1200,margin:"0 auto"}}>
      <SectionHeader kicker="LIVE-INVENTORY CHECKLIST" title="What a distribution connection must provide" subtitle="These fields protect the customer, the supplier and the accuracy of every public price."/>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:12}}>
        {REQUIREMENTS.map(function(item,index){return <GlassCard key={item.title} style={{height:"100%",padding:26}}>
          <span style={{...type.kicker(),color:T.silverDim}}>{("0"+(index+1)).slice(-2)}</span>
          <h3 style={{...type.cardSerif(19),margin:"15px 0 9px"}}>{item.title}</h3>
          <p style={{...type.body(),color:T.textMid}}>{item.body}</p>
        </GlassCard>;})}
      </div>
    </section>

    <Divider/>
    <section style={{padding:mobile?"64px 22px 82px":"96px 56px 112px",maxWidth:900,margin:"0 auto",textAlign:"center"}}>
      <SectionHeader align="center" kicker="NEXT STEP" title="Tell us where you operate and how your inventory is managed" subtitle="We review the service area, licensing, insurance, fulfilment process and commercial terms before a listing or integration goes live."/>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <PrimaryCTA href="/business?category=Exotic%20Cars#apply">Apply now</PrimaryCTA>
        <GhostCTA href="https://wa.me/33743713649?text=Hi%20Alfred%2C%20I%27d%20like%20to%20discuss%20a%20car%20rental%20fleet%20partnership.">WhatsApp partnerships</GhostCTA>
      </div>
      <p style={{...type.body(),color:T.textDim,marginTop:24}}>Approval, placement and request volume are not guaranteed. Commercial terms are agreed in writing before activation.</p>
    </section>
  </div>;
}
