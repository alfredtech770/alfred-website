import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";

var sf = function(size, weight){
  return {fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", fontSize:size, fontWeight:weight||400, WebkitFontSmoothing:"antialiased"};
};
var C = {bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}

var STEPS = [
  {n:"01", title:"Download Alfred and choose your tier", body:"Install Alfred from the App Store or Google Play, pick a membership tier — Gold, Platinum or Centurion — and complete a one-time onboarding (preferences, dietary, your usual cities, dress sizes for stylist work, partner names, allergies). The full catalogue unlocks immediately."},
  {n:"02", title:"Browse or ask", body:"Open the catalogue to browse 200+ Michelin restaurants, the top nightclubs in each city, the supercar fleet, the yacht lineup, the jet partners and the spa list. Or just open the chat and ask: \"book me a table for four at Carbone Miami Friday at 8.\" Both work."},
  {n:"03", title:"A real concierge confirms", body:"Every request is verified by a human concierge before it is booked. For partner venues we hold inventory; for everything else we work the back channels — manager calls, host relationships, restaurant management software direct lines. You get a confirmation when it is real, not a 'submitting…' spinner."},
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

export default function HowItWorksPage(){
  var navigate = useNavigate();
  useEffect(function(){ window.scrollTo(0,0); }, []);

  return (
    <div style={{background:C.bg, minHeight:"100vh", color:C.s1}}>
      <SEOHead
        title="How Alfred Works — From Download to First Booking | Alfred Concierge"
        description="See exactly how Alfred Concierge works: download the app, choose a tier, browse 200+ venues or ask for what you need, get a real human concierge to handle it. Booking confirmations in under 15 minutes."
        keywords="how Alfred works, how does a concierge app work, Alfred concierge booking process, luxury concierge how it works, Alfred concierge tutorial"
        path="/how-it-works"
        type="website"
        jsonLd={JSONLD}
      />

      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,10,11,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid "+C.bd,padding:"0 40px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={function(){navigate("/")}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <Mark size={20} color={C.s1}/>
          <span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span>
        </div>
        <div style={{display:"flex",gap:24,alignItems:"center"}}>
          <a href="/about" style={{...sf(13,400),color:C.s5,textDecoration:"none"}}>About</a>
          <a href="/pricing" style={{...sf(13,400),color:C.s5,textDecoration:"none"}}>Pricing</a>
          <a href="/contact" style={{...sf(13,400),color:C.s5,textDecoration:"none"}}>Contact</a>
        </div>
      </nav>

      <article style={{maxWidth:780,margin:"0 auto",padding:"80px 40px 120px"}}>
        <header style={{marginBottom:64}}>
          <p style={{...sf(11,600),color:C.s7,letterSpacing:4,textTransform:"uppercase",marginBottom:16}}>How it Works</p>
          <h1 style={{...sf(56,700),letterSpacing:-2,lineHeight:1.05,marginBottom:24,color:C.s1}}>One app. One concierge team. Every door open.</h1>
          <p style={{...sf(20,400),color:C.s4,lineHeight:1.55}}>Five steps from downloading Alfred to walking into the table that "wasn't available" 30 minutes ago.</p>
        </header>

        <section style={{marginBottom:72}}>
          {STEPS.map(function(s){
            return <div key={s.n} style={{display:"grid",gridTemplateColumns:"60px 1fr",gap:24,marginBottom:40,paddingBottom:40,borderBottom:"1px solid "+C.bd}}>
              <div style={{...sf(28,300),color:C.s7,letterSpacing:-1}}>{s.n}</div>
              <div>
                <h3 style={{...sf(20,600),color:C.s1,marginBottom:10,letterSpacing:-0.3}}>{s.title}</h3>
                <p style={{...sf(15,400),color:C.s4,lineHeight:1.7}}>{s.body}</p>
              </div>
            </div>;
          })}
        </section>

        <section style={{marginBottom:72}}>
          <h2 style={{...sf(32,600),color:C.s1,marginBottom:24,letterSpacing:-0.7}}>The two layers behind every booking</h2>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>Alfred runs on two stacks at once. The app layer holds the catalogue, the AI concierge that triages every request, the integrations with restaurant management systems (Resy, OpenTable, SevenRooms, Tock), the payment rails and the receipts. The human layer is the concierge team itself — operators in Miami, Paris, Dubai and London with direct phone numbers for the venue managers, hosts and operators that decide whether a member walks straight in or waits at the desk.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>The app handles speed and inventory. The humans handle judgement, recovery and the impossible-reservation cases that no API will solve. When you ask Alfred for a 9pm Friday table at Carbone in Miami Beach the week of F1, you do not need an algorithm — you need someone who knows the manager.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75}}>This is why every Alfred booking has a name attached on our side, even at the Gold tier. If something goes wrong, there is a human to escalate to — not a support ticket queue.</p>
        </section>

        <section style={{marginBottom:72}}>
          <h2 style={{...sf(32,600),color:C.s1,marginBottom:24,letterSpacing:-0.7}}>What real human concierge actually means</h2>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75,marginBottom:18}}>"Concierge" is a word that has been diluted by every neobank, credit card and lifestyle app that bolts on a chat window. At Alfred we use it in the original sense: a human who knows the city, has personal relationships at the venues, and gets paid to make problems disappear. Our concierge team has worked the front desks at Le Bristol Paris, the management offices at LIV Miami, the booking desks of major superyacht charter brokers, the dispatch teams of the world's top private jet operators, and the host stands of Michelin-starred kitchens.</p>
          <p style={{...sf(16,400),color:C.s3,lineHeight:1.75}}>That background is the difference between a "request submitted" notification and a Friday-night table at a venue that closed its book three weeks ago.</p>
        </section>

        <section style={{marginBottom:48}}>
          <h2 style={{...sf(32,600),color:C.s1,marginBottom:32,letterSpacing:-0.7}}>FAQ</h2>
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

        <section>
          <div style={{padding:"36px 32px",borderRadius:16,background:C.el,border:"1px solid "+C.bd,textAlign:"center"}}>
            <h3 style={{...sf(24,600),color:C.s1,marginBottom:12,letterSpacing:-0.3}}>Ready to see it in action?</h3>
            <p style={{...sf(15,400),color:C.s4,lineHeight:1.6,marginBottom:24,maxWidth:480,margin:"0 auto 24px"}}>Compare membership tiers or talk to Alfred directly to scope an event, a trip, or a one-off booking.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <a href="/pricing" style={{display:"inline-flex",alignItems:"center",padding:"14px 22px",borderRadius:12,background:C.s1,color:C.bg,...sf(14,600),textDecoration:"none"}}>Compare memberships</a>
              <a href="/contact" style={{display:"inline-flex",alignItems:"center",padding:"14px 22px",borderRadius:12,border:"1px solid "+C.bd,color:C.s1,...sf(14,600),textDecoration:"none"}}>Talk to Alfred</a>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
