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
import { appStoreUrl } from "../lib/appStore";

var T_ = T; // shadow alias for nested closures

var TIERS = [
  {
    id:"gold", label:"Entry",
    name:"Alfred Gold", italicWord:"Gold",
    price:"See app", cadence:"for current price",
    summary:"A starting plan for browsing the catalog and submitting requests in the Alfred app.",
    features:[
      "Access to the Alfred app",
      "Browse the venue and service catalog",
      "Restaurant and hotel discovery",
      "Submit availability requests",
      "Review request updates",
      "Keep request details in one place"
    ],
    cta:"View Gold in the app", ctaHref:appStoreUrl()
  },
  {
    id:"platinum", label:"Concierge",
    name:"Alfred Platinum", italicWord:"Platinum",
    price:"See app", cadence:"for current price",
    summary:"Additional concierge coordination for requests that involve provider checks or multiple services.",
    badge:"More support",
    features:[
      "Everything in Alfred Gold",
      "Human concierge coordination",
      "Complex multi-service requests",
      "Restaurant and hotel option research",
      "Transport and itinerary coordination",
      "Group requirement handling",
      "Provider term summaries",
      "Request follow-up",
      "WhatsApp request support",
      "Special-occasion planning"
    ],
    cta:"View Platinum in the app", ctaHref:appStoreUrl(),
    featured: true
  },
  {
    id:"centurion", label:"Invite Only",
    name:"Alfred Centurion", italicWord:"Centurion",
    price:"By enquiry", cadence:"",
    summary:"A request-based plan whose availability, scope and commercial terms are confirmed directly with Alfred.",
    features:[
      "Everything in Alfred Platinum",
      "Named contact where included in the proposal",
      "Multi-city request coordination",
      "Airport-to-venue planning",
      "Last-minute availability checks",
      "Travel itinerary assistance",
      "Private event request support",
      "Scope and terms agreed before purchase"
    ],
    cta:"Apply for Centurion", ctaHref:"/contact"
  }
];

var FAQ = [
  {q:"Where can I see current membership prices?", a:"The Alfred app shows the current price, billing period and included features before purchase. App marketplace terms also apply."},
  {q:"What is the difference between Gold and Platinum?", a:"Gold is the starting app plan. Platinum adds the concierge coordination described in the app. Review the current feature comparison before subscribing."},
  {q:"Are provider charges included?", a:"Restaurant bills, deposits, hotel rates, rentals, charters, taxes and provider cancellation fees are separate unless the checkout explicitly says otherwise."},
  {q:"Does membership guarantee availability?", a:"No. Availability and provider terms are checked for each request. A request is not booked until it is confirmed."},
  {q:"How do cancellation and renewal work?", a:"Review the subscription terms presented at purchase. For App Store subscriptions, manage renewal and cancellation through your Apple subscription settings."},
  {q:"Which cities are covered?", a:"Alfred publishes city guides for Miami, Paris, Ibiza, Saint-Tropez, Mykonos, Dubai and London. Specific service coverage is confirmed when you make a request."}
];

var JSONLD = [
  {
    "@context":"https://schema.org",
    "@type":"WebPage",
    "name":"Alfred Concierge Membership",
    "description":"Review Alfred membership options and open the app for current pricing, billing periods and included support.",
    "url":"https://alfredconcierge.app/pricing"
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
        title="Alfred Membership Options — See Current Pricing in the App"
        description="Compare Alfred membership options for catalog access and concierge-supported requests. Open the app for current prices, billing periods and included support."
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
            Three options.<br/>One request flow.<br/>
            <SilverText style={{fontStyle:"italic"}}>Terms made clear.</SilverText>
          </h1>
          <p style={{
            ...type.bodyLg(), color:T_.textMid, marginTop:18, maxWidth:560
          }}>
            Review the current price, billing period and included support in the app before subscribing.
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
        }}>Provider costs and availability are separate unless stated otherwise</p>
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
            Review the options.<br/>
            <SilverText style={{fontStyle:"italic"}}>Choose in the app.</SilverText>
          </h2>
          <p style={{
            ...type.bodyLg(), color:T_.textMid, maxWidth:520, margin:"0 auto 28px"
          }}>The app shows the current plan details and marketplace subscription terms.</p>
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
          <span style={{color:T_.text}}>Gold</span> is the starting option for browsing the catalog and submitting requests in the app. Check the live plan screen for the features currently included.
        </p>
        <p style={{...type.bodyLg(), color:T_.textMid}}>
          <span style={{color:T_.text}}>Platinum</span> adds the concierge coordination described in the app. That can include checking providers, summarizing terms and coordinating requests that involve more than one service.
        </p>
        <p style={{...type.bodyLg(), color:T_.textMid}}>
          <span style={{color:T_.text}}>Centurion</span> is handled by enquiry. Its availability, scope, billing and support commitments must be agreed directly with Alfred; start through the <a href="/contact" style={{color:T_.text, textDecoration:"underline", textUnderlineOffset:3}}>contact page</a>.
        </p>
        <p style={{...type.bodyLg(), color:T_.textMid}}>
          Before purchase, review the price, renewal period and cancellation terms shown by Alfred and the applicable app marketplace. Those live terms control the subscription.
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
          A membership covers only the Alfred features listed for that plan at the time of purchase. It does not automatically cover the restaurant bill, hotel rate, deposit, rental, charter, tax, gratuity or another provider charge.
        </p>
        <p style={{...type.bodyLg(), color:T_.textMid}}>
          Any service fee, provider price, deposit and cancellation policy should be disclosed before a request is approved. Ask Alfred to clarify any amount or term that is not clear.
        </p>
      </div>
    </section>
  );
}
