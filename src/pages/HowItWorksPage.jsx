import { useEffect } from "react";
import SEOHead from "../components/SEOHead";
import { T, type } from "../lib/brand";
import {
  Hero, BrandNav, SilverText, SectionHeader, PrimaryCTA, GhostCTA,
  GlassCard, Eyebrow, Divider, useReveal, revealStyle, useMobile
} from "../components/brand";

var T_ = T;

var STEPS = [
  {n:"01", title:"Download Alfred and choose your tier", body:"Install Alfred from the App Store or Google Play, pick a membership tier — Gold, Platinum or Centurion — and complete a one-time onboarding (preferences, dietary, your usual cities, dress sizes for stylist work, partner names, allergies). The full catalogue unlocks immediately."},
  {n:"02", title:"Browse or ask", body:"Open the catalogue to browse 200+ Michelin restaurants, the top nightclubs in each city, the supercar fleet, the yacht lineup, the jet partners and the spa list. Or just open the chat and ask: \"book me a table for four at Carbone Miami Friday at 8.\" Both work."},
  {n:"03", title:"A real concierge confirms", body:"Every request is verified by a human concierge before it is booked. For partner venues we hold inventory; for everything else we work the back channels — manager calls, host relationships, restaurant management software direct lines. You get a confirmation when it is real, not a 'submitting...' spinner."},
  {n:"04", title:"Show up", body:"Walk in. The host knows your name, the manager knows your tier, the table is set. For Platinum and Centurion members, valet is waived, the 15-minute grace period is removed, and the VIP flag is on your reservation across the venue's system."},
  {n:"05", title:"Alfred handles the rest", body:"Need a car back to your hotel at 2am? Want to extend the yacht charter for another two hours? Lost your wallet? Alfred is on WhatsApp. Centurion members have a single dedicated agent for every request, every time, no rotation."}
];

var FAQ = [
  {q:"Is Alfred a real concierge or just an AI chatbot?", a:"Both. The Gold tier includes an AI concierge that handles search, recommendations and routing. Platinum and Centurion tiers add a real human concierge team — the AI does triage, the humans handle bookings. Centurion members get one named agent assigned to them permanently, contactable on WhatsApp 24/7."},
  {q:"How long does a booking take?", a:"App-integrated bookings (Resy, OpenTable, SevenRooms) confirm in under a minute. Concierge-handled bookings — impossible reservations, VIP tables, last-minute requests — typically confirm within 15 minutes during operating hours and within an hour overnight. Centurion requests are prioritised and target sub-15-minute confirmations regardless of time."},
  {q:"What cities does Alfred cover?", a:"Miami, Paris, Dubai and London with full local concierge teams. We arrange travel and hospitality globally — private jets, yachts in the Mediterranean, ski chalets in the Alps, hotels worldwide — but on-the-ground support is concentrated in those four cities."},
  {q:"How is Alfred different from American Express Centurion or Quintessentially?", a:"Alfred is app-first, with the catalogue, bookings and receipts in one place. Card-issuer concierge services run on email and phone. Quintessentially and similar legacy concierges have broader global coverage but slower response times and less transparency on pricing. Alfred sits between: faster than legacy, more accountable than card concierge, with deeper relationships in our four cities than either."},
  {q:"Can I book on behalf of guests or my family?", a:"Yes. Members can add up to four secondary profiles per account. Bookings under a guest profile carry your member tier benefits."},
  {q:"What happens if a booking falls through?", a:"Alfred re-books at the next-best available venue at no extra charge, and Platinum and Centurion members receive a credit equal to any non-refundable deposit lost. Every booking carries our concierge guarantee — if we confirmed it, we own it."}
];

var JSONLD = [
  {
    "@context":"https://schema.org",
    "@type":"HowTo",
    "name":"How Alfred Concierge works",
    "description":"How to use Alfred Concierge — the luxury concierge app for Miami, Paris, Dubai and London — from download to first booking.",
    "totalTime":"PT5M",
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
        title="How Alfred Works — From Download to First Booking | Alfred Concierge"
        description="See exactly how Alfred Concierge works: download the app, choose a tier, browse 200+ venues or ask for what you need, get a real human concierge to handle it. Booking confirmations in under 15 minutes."
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
            One app. One concierge team.{" "}
            <SilverText style={{fontStyle:"italic"}}>Every door open.</SilverText>
          </h1>
          <p style={{...type.bodyLg(), color:T_.textMid, marginTop:18, maxWidth:580}}>
            Five steps from downloading Alfred to walking into the table that "wasn't available" thirty minutes ago.
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
        title="App layer and human layer, working as one"
        paragraphs={[
          "Alfred runs on two stacks at once. The app layer holds the catalogue, the AI concierge that triages every request, the integrations with restaurant management systems (Resy, OpenTable, SevenRooms, Tock), the payment rails and the receipts. The human layer is the concierge team itself — operators in Miami, Paris, Dubai and London with direct phone numbers for the venue managers, hosts and operators that decide whether a member walks straight in or waits at the desk.",
          "The app handles speed and inventory. The humans handle judgement, recovery and the impossible-reservation cases that no API will solve. When you ask Alfred for a 9pm Friday table at Carbone in Miami Beach the week of F1, you do not need an algorithm — you need someone who knows the manager.",
          "This is why every Alfred booking has a name attached on our side, even at the Gold tier. If something goes wrong, there is a human to escalate to — not a support ticket queue."
        ]}
      />

      <Divider margin={mobile ? "0 22px" : "0 56px"}/>

      <ProseSection
        mobile={mobile}
        kicker="Real concierge"
        title="What real human concierge actually means"
        paragraphs={[
          "<span style=\"color:" + T_.text + "\">Concierge</span> is a word that has been diluted by every neobank, credit card and lifestyle app that bolts on a chat window. At Alfred we use it in the original sense: a human who knows the city, has personal relationships at the venues, and gets paid to make problems disappear. Our concierge team has worked the front desks at Le Bristol Paris, the management offices at LIV Miami, the booking desks of major superyacht charter brokers, the dispatch teams of the world's top private jet operators, and the host stands of Michelin-starred kitchens.",
          "That background is the difference between a <span style=\"color:" + T_.text + "\">request submitted</span> notification and a Friday-night table at a venue that closed its book three weeks ago."
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
