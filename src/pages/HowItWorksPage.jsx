import { useEffect } from "react";
import SEOHead from "../components/SEOHead";
import { T, type } from "../lib/brand";
import {
  Hero, BrandNav, SilverText, SectionHeader, PrimaryCTA, GhostCTA,
  GlassCard, Eyebrow, Divider, useReveal, revealStyle, useMobile
} from "../components/brand";

var T_ = T;

var STEPS = [
  {n:"01", title:"Open Alfred", body:"Install Alfred from the App Store, review the current plan information and complete the account details requested in the app."},
  {n:"02", title:"Browse or describe what you need", body:"Start with the catalog or write a request in plain language. Include the city, dates, party size, preferences and budget so the request can be checked accurately."},
  {n:"03", title:"Alfred checks current options", body:"For concierge-supported requests, a person checks relevant providers and gathers current availability, pricing, deposits and cancellation terms."},
  {n:"04", title:"Review before approving", body:"Compare the available options and provider conditions. A request is not a confirmed booking until you receive a clear confirmation."},
  {n:"05", title:"Keep the details together", body:"Use the app or WhatsApp to follow the request. If the first option is unavailable, Alfred can research alternatives that fit the brief."}
];

var FAQ = [
  {q:"Does Alfred confirm every request instantly?", a:"No. Availability and terms depend on the provider and the requested dates. Alfred will identify when a request is pending and when it has been confirmed."},
  {q:"What cities does Alfred cover?", a:"Alfred publishes guides for Miami, Paris, Ibiza, Saint-Tropez, Mykonos, Dubai and London. Check the relevant city page or make a request to confirm coverage for a specific service."},
  {q:"What information should I include?", a:"Share the city, date and time, party size, preferences, budget and any important constraints. Complete details make it easier to return relevant options."},
  {q:"Are provider prices included in membership?", a:"Provider charges, deposits, taxes and cancellation fees are separate unless the checkout explicitly states otherwise. Review all terms before approving a request."},
  {q:"What happens when the first option is unavailable?", a:"Alfred can research alternatives based on the same brief. You decide whether to approve any replacement option after seeing its current terms."}
];

var JSONLD = [
  {
    "@context":"https://schema.org",
    "@type":"HowTo",
    "name":"How Alfred Concierge works",
    "description":"How to use Alfred Concierge to discover options, submit a request and review provider confirmation.",
    "step": STEPS.map(function(s,i){
      return {"@type":"HowToStep","position":i+1,"name":s.title,"text":s.body};
    })
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
      {"@type":"ListItem","position":2,"name":"How it Works","item":"https://alfredconcierge.app/how-it-works"}
    ]
  }
];

function StepCard({step, mobile}){
  var r = useReveal(0.05);
  return (
    <div ref={r.ref} style={{...revealStyle(r.visible)}}>
      <div style={{
        display:"grid", gridTemplateColumns: mobile ? "auto 1fr" : "120px 1fr",
        gap: mobile ? 18 : 32,
        padding: mobile ? "32px 0" : "44px 0",
        borderBottom: `0.5px solid ${T_.border}`
      }}>
        <div style={{
          ...type.italicSerif(mobile ? 36 : 56), color:T_.silverDim,
          letterSpacing:-1
        }}>{step.n}</div>
        <div>
          <h3 style={{...type.cardSerif(mobile ? 22 : 26), color:T_.text, marginBottom:14, letterSpacing:-0.4}}>{step.title}</h3>
          <p style={{...type.bodyLg(), color:T_.textMid, maxWidth:680}}>{step.body}</p>
        </div>
      </div>
    </div>
  );
}

function FaqItem({q, a, mobile}){
  return (
    <details style={{borderBottom:`0.5px solid ${T_.border2}`, padding: mobile ? "20px 0" : "24px 0"}}>
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

export default function HowItWorksPage(){
  var mobile = useMobile();
  useEffect(function(){ window.scrollTo(0,0); }, []);

  return (
    <div style={{background:T_.bg, minHeight:"100vh", color:T_.text}}>
      <SEOHead
        title="How Alfred Works — Request Restaurants, Hotels & More"
        description="See how Alfred Concierge works: share a city and dates, review current options and provider terms, then approve a confirmed restaurant, hotel, car or private-service request."
        keywords="how Alfred works, how does a concierge app work, Alfred concierge booking process, luxury concierge how it works, Alfred concierge tutorial"
        path="/how-it-works"
        type="website"
        jsonLd={JSONLD}
      />

      <BrandNav mobile={mobile} links={[
        {label:"About", href:"/about"},
        {label:"How it Works", href:"/how-it-works", active:true},
        {label:"Pricing", href:"/pricing"},
        {label:"Contact", href:"/contact"}
      ]}/>

      <Hero mobile={mobile} height={mobile ? 480 : 620}>
        <div style={{
          height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end",
          padding: mobile ? "0 22px 56px" : "0 56px 80px", maxWidth:1200, margin:"0 auto"
        }}>
          <Eyebrow dot accent={T_.warm}>How it Works</Eyebrow>
          <h1 style={{
            ...(mobile ? type.heroSerifMobile() : type.heroSerif()),
            color:T_.text, marginTop:18, maxWidth:980
          }}>
            One app. One request flow.{" "}
            <SilverText style={{fontStyle:"italic"}}>Clear confirmations.</SilverText>
          </h1>
          <p style={{...type.bodyLg(), color:T_.textMid, marginTop:18, maxWidth:580}}>
            Five steps from describing what you need to reviewing a provider-confirmed option.
          </p>
        </div>
      </Hero>

      {/* Steps */}
      <section style={{
        padding: mobile ? "40px 22px 60px" : "80px 56px 100px",
        maxWidth:980, margin:"0 auto"
      }}>
        {STEPS.map(function(s){ return <StepCard key={s.n} step={s} mobile={mobile}/>; })}
      </section>

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      {/* Two layers section */}
      <ProseSection
        mobile={mobile}
        kicker="The two layers"
        title="Discovery and coordination, working together"
        paragraphs={[
          "The catalog helps you discover restaurants, hotels, transport and private services. The request layer captures the exact city, dates and preferences needed to check an option.",
          "Concierge-supported requests add human review where provider availability, pricing or policies need confirmation. The provider remains responsible for the underlying service.",
          "The result is a clear status: requested, awaiting provider confirmation, or confirmed — with the relevant terms attached."
        ]}
      />

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      <ProseSection
        mobile={mobile}
        kicker="Human review"
        title="What concierge coordination means"
        paragraphs={[
          "A concierge-supported request is reviewed by a person who can clarify the brief, contact relevant providers and summarize the options returned.",
          "Human review does not override provider capacity or policies. It makes the status, price and conditions easier to understand before you decide."
        ]}
      />

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      {/* FAQ */}
      <section style={{
        padding: mobile ? "60px 22px 80px" : "100px 56px 120px",
        maxWidth:880, margin:"0 auto"
      }}>
        <SectionHeader kicker="FAQ" title="Questions before you sign up"/>
        <div>
          {FAQ.map(function(f, i){ return <FaqItem key={i} q={f.q} a={f.a} mobile={mobile}/>; })}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: mobile ? "40px 22px 100px" : "60px 56px 140px",
        maxWidth:1200, margin:"0 auto"
      }}>
        <GlassCard featured sheen padded={false} style={{
          padding: mobile ? "40px 28px" : "64px 56px",
          textAlign:"center"
        }}>
          <Eyebrow color={T_.silver}>Ready to see it</Eyebrow>
          <h2 style={{
            ...type.sectionSerif(), fontSize: mobile ? 28 : 34,
            color:T_.text, marginTop:14, marginBottom:14, lineHeight:1.15
          }}>
            Compare tiers or talk to{" "}
            <SilverText style={{fontStyle:"italic"}}>Alfred</SilverText>{" "}directly.
          </h2>
          <p style={{...type.bodyLg(), color:T_.textMid, maxWidth:520, margin:"0 auto 28px"}}>
            Scope an event, a trip, or a one-off booking with the concierge team.
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
