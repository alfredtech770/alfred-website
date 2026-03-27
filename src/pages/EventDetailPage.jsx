import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}
function useIsMobile(bp){bp=bp||768;var[m,setM]=useState(function(){return typeof window!=="undefined"&&window.innerWidth<=bp});useEffect(function(){function c(){setM(window.innerWidth<=bp)}window.addEventListener("resize",c);return function(){window.removeEventListener("resize",c)}},[bp]);return m}
function spotsColor(s){return s<=6?"#FF453A":s<=10?"#FFD60A":"#34C759"}
function spotsShadow(s){return s<=6?"rgba(255,69,58,0.5)":s<=10?"rgba(255,214,10,0.4)":"rgba(52,199,89,0.4)"}

var SB="https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/";
var WA_NUM="447449562204";
function openWA(msg){window.open("https://wa.me/"+WA_NUM+"?text="+encodeURIComponent(msg),"_blank")}

var EVENTS={
  "monaco-grand-prix":{
    name:"Monaco Grand Prix",slug:"monaco-grand-prix",date:"June 5 – 7, 2026",location:"Monte Carlo, Monaco",tag:"F1",color:"#E11D48",spots:12,
    hero:SB+"Monaco-Race-Page-MAIN.webp",
    imgs:[SB+"Monaco-Race-Page-MAIN.webp",SB+"Monaco%20grand%20prix.jpeg",SB+"DPPI_00124009_1978.jpg"],
    tagline:"Private hospitality on the most famous corner in motorsport",
    desc:"Experience the Monaco Grand Prix from the Swimming Pool chicane — the most iconic corner in Formula 1. Alfred secures a private venue overlooking the chicane with unobstructed views of the action. Caviar and champagne service all weekend, private chef, premium catering, and after-party VIP access. No lanyards, no crowds, no compromises.",
    venue:"The Alfred Lounge · Swimming Pool Chicane",
    perks:["Alfred Lounge · pool-side chicane view","Caviar & champagne service","Private chef · premium catering","After-party VIP access","Black card welcome · no lanyards","Helicopter transfer from Nice","Personal highlight reel"],
    schedule:[
      {day:"Friday, June 5",items:["Free Practice 1 & 2 from the Alfred Lounge","Lunch by private chef","Evening: Monte Carlo Casino night"]},
      {day:"Saturday, June 6",items:["Free Practice 3 & Qualifying","Alfred Lounge hospitality all day","Evening: Amber Lounge after-party"]},
      {day:"Sunday, June 7",items:["Race Day — full hospitality","Champagne & caviar from lights out","Post-race celebration & helicopter transfer"]},
    ],
    includes:["Private hospitality venue","Caviar & champagne all weekend","Premium catering · private chef","Personal concierge on-site","Airport/hotel transfers","After-party VIP access","Professional photography"],
    alfredNote:"This is one of our most exclusive packages. The Swimming Pool chicane is where races are won and lost — you'll feel the cars shake the ground beneath you. We keep it intimate to make sure the experience stays right. Request early — Monaco sells out faster than any other event on our calendar.",
    alfredTip:"Fly into Nice and take our helicopter transfer. The 7-minute flight over the coastline is worth it alone.",
    waMsg:"Hi Alfred, I'm interested in the Monaco Grand Prix experience (June 5–7, 2026). I'd like to learn more about availability and access.",
  },
  "miami-grand-prix":{
    name:"Miami Grand Prix",slug:"miami-grand-prix",date:"May 1 – 3, 2026",location:"Miami Gardens, Florida",tag:"F1",color:"#F97316",spots:8,
    hero:SB+"Screenshot%202026-03-25%20at%2022.36.44.png",
    imgs:[SB+"Screenshot%202026-03-25%20at%2022.36.44.png",SB+"DPPI_00124009_1978.jpg",SB+"Monaco%20grand%20prix.jpeg"],
    tagline:"Track-side luxury with direct paddock access at Turn 1",
    desc:"Our Miami Grand Prix package puts you in a private luxury suite overlooking Turn 1 — the most dramatic braking zone on the circuit. Direct paddock access means you'll walk where the drivers walk. After the race, we take over LIV, Story, and E11even for exclusive after-parties. This is Miami at its most electric.",
    venue:"Track-Side Luxury Suite · Turn 1",
    perks:["Private luxury suite · Turn 1","Paddock Club access","After-race LIV takeover","Supercar parade entry","Personal concierge all weekend","Yacht day party · Saturday","Celebrity meet & greet access"],
    schedule:[
      {day:"Friday, May 1",items:["Arrival & South Beach hotel check-in","Welcome cocktails at Faena rooftop","Free Practice 1 & 2 from suite"]},
      {day:"Saturday, May 2",items:["Free Practice 3 & Sprint Race","Paddock Club access & pit lane walk","Evening: Yacht day party in the bay"]},
      {day:"Sunday, May 3",items:["Race Day from Turn 1 suite","Full hospitality & open bar","Post-race: LIV takeover & E11even"]},
    ],
    includes:["Turn 1 private suite","Paddock Club passes","Full catering & open bar","After-party access (LIV, Story, E11even)","Hotel-circuit transfers","Personal concierge","Supercar parade ride-along"],
    alfredNote:"Miami is our most high-energy package. The after-parties are legendary — last year we had guests stay until sunrise. The Turn 1 suite is limited to 20 guests, so the atmosphere stays right. If you're bringing a group, ask about our full suite buyout.",
    alfredTip:"Stay at the Faena or the Edition. We'll arrange everything — and the after-parties are closer.",
    waMsg:"Hi Alfred, I'm interested in the Miami Grand Prix experience (May 1–3, 2026). I'd like to know more about the Turn 1 suite and paddock access.",
  },
  "ibiza-opening":{
    name:"Ibiza Opening",slug:"ibiza-opening",date:"May – June 2026",location:"Ibiza, Spain",tag:"Nightlife",color:"#8B5CF6",spots:15,
    hero:SB+"slideshow-1740920048.jpg",
    imgs:[SB+"slideshow-1740920048.jpg",SB+"Keinmusik.jpeg",SB+"image.jpg"],
    tagline:"Season opening week across all four superclubs",
    desc:"The Ibiza season opening is the most anticipated week in nightlife. Alfred secures front-row access at Ushuaïa, VIP tables at Hï Ibiza, Pacha, and Amnesia across four incredible nights. Add a private villa with a personal chef, yacht day parties, and exclusive artist meet & greets. This is how Ibiza was meant to be experienced.",
    venue:"Hï Ibiza · Ushuaïa · Pacha · Amnesia",
    perks:["Hï Ibiza VIP table · 4 nights","Ushuaïa front-row access","Private villa with chef","Artist meet & greets","Yacht day party · full crew","Airport transfers","Personal nightlife concierge"],
    schedule:[
      {day:"Day 1 — Arrival",items:["Villa check-in & welcome champagne","Beach club lunch at Nikki Beach","Evening: Hï Ibiza opening night — VIP table"]},
      {day:"Day 2 — Ushuaïa",items:["Morning: yacht day party","Afternoon: pool & recovery at villa","Evening: Ushuaïa front-row, headliner set"]},
      {day:"Day 3 — Pacha",items:["Beach day at Cala Jondal","Private chef dinner at villa","Evening: Pacha — artist meet & greet"]},
      {day:"Day 4 — Amnesia",items:["Brunch at the villa","Sunset catamaran cruise","Evening: Amnesia closing — VIP booth"]},
    ],
    includes:["4 nights VIP club access","Private villa (up to 8 guests)","Personal chef · daily","Yacht day party","Artist meet & greets","Airport transfers","Nightlife concierge every night"],
    alfredNote:"This is our most popular summer package. The villa is the key — having your own private space with a chef means you can recover properly between nights. We've curated the schedule so the energy builds each day. Trust the order.",
    alfredTip:"Book the 8-person villa even if you're fewer — the space is worth it. And pace yourself on night one.",
    waMsg:"Hi Alfred, I'm interested in the Ibiza Opening experience (May–June 2026). I'd like to learn more about the villa and VIP club access.",
  },
  "roland-garros":{
    name:"Roland Garros",slug:"roland-garros",date:"May 18 – Jun 7, 2026",location:"Paris, France",tag:"Tennis",color:"#D97706",spots:6,
    hero:SB+"aEGghrh8WN-LVqbY_LEC06847-2RichardGasquetRG2025.avif",
    imgs:[SB+"aEGghrh8WN-LVqbY_LEC06847-2RichardGasquetRG2025.avif",SB+"AlfedHotelCrillionParis.jpeg",SB+"DPPI_00124009_1978.jpg"],
    tagline:"Courtside hospitality at the French Open",
    desc:"Experience Roland Garros from a private box in Philippe Chatrier — the cathedral of clay-court tennis. Champagne terraces between sets, a Michelin dining experience for lunch, player lounge access, and chauffeur transfers from your hotel. Alfred handles every detail so you can focus on the tennis.",
    venue:"Philippe Chatrier · Private Box",
    perks:["Philippe Chatrier box seats","Champagne terrace access","Michelin dining experience","Player lounge entry","Chauffeur from hotel","Behind-the-scenes tour","Official merchandise pack"],
    schedule:[
      {day:"Match Day",items:["Chauffeur pickup from hotel","Arrival at VIP entrance — no queues","Morning matches from private box","Michelin lunch on the terrace","Afternoon feature match — box seats","Champagne service throughout","Chauffeur return to hotel"]},
    ],
    includes:["Private box seats (up to 4 guests)","Michelin dining experience","Champagne terrace access","Player lounge entry","Chauffeur hotel transfers","Official Roland Garros gift pack","Personal concierge on-site"],
    alfredNote:"Roland Garros is pure elegance. Our private box in Philippe Chatrier gives you the best sightlines in the stadium — centre court, eye level. The Michelin lunch between sessions is extraordinary. We recommend the quarter-finals or semi-finals for the best combination of atmosphere and quality of play.",
    alfredTip:"Stay at the Hôtel de Crillon — it's a 20-minute chauffeur ride and the perfect complement to a day at Roland Garros.",
    waMsg:"Hi Alfred, I'm interested in the Roland Garros experience (May 18–Jun 7, 2026). I'd like to know more about the private box and hospitality.",
  },
  "royal-ascot":{
    name:"Royal Ascot",slug:"royal-ascot",date:"June 16 – 20, 2026",location:"Ascot, England",tag:"Racing",color:"#0EA5E9",spots:4,
    hero:SB+"coverprocessionroyalascot.webp",
    imgs:[SB+"coverprocessionroyalascot.webp",SB+"AlfedHotelCrillionParis.jpeg",SB+"DPPI_00124009_1978.jpg"],
    tagline:"The Royal Enclosure experience — elevated",
    desc:"Royal Ascot is the pinnacle of British racing and social elegance. Alfred secures Royal Enclosure badges, a private box for 12 guests, Michelin chefs on-site, helicopter transfer from central London, and a Savile Row styling consultation so you arrive impeccably dressed. This is tradition, perfected.",
    venue:"Royal Enclosure · Private Box for 12",
    perks:["Royal Enclosure badges","Private box for 12 guests","Michelin chef on-site","Helicopter from London","Savile Row styling session","Fine wine & champagne service","Horse racing tips from our expert"],
    schedule:[
      {day:"Race Day",items:["Morning: Savile Row fitting (first-timers)","Helicopter from Battersea to Ascot","Royal Enclosure arrival — private box","Lunch by Michelin chef in your box","Afternoon racing — all 6 races","Champagne & fine wine throughout","Helicopter return to London"]},
    ],
    includes:["Royal Enclosure badges","Private box (up to 12)","Michelin chef · full day","Helicopter transfers","Savile Row styling consultation","Fine wine & champagne","Racing expert & tips"],
    alfredNote:"Royal Ascot is one of the few events where the experience is as much about the social occasion as the sport. Our private box is in the heart of the Royal Enclosure — you'll see the Royal Procession from your table. The Savile Row consultation is complimentary for first-time guests and genuinely worthwhile.",
    alfredTip:"Ladies' Day (Thursday) has the best atmosphere. Gold Cup Day (Thursday) is the prestige race. We recommend both.",
    waMsg:"Hi Alfred, I'm interested in the Royal Ascot experience (June 16–20, 2026). I'd like to learn more about the Royal Enclosure and private box.",
  },
};

export default function EventDetailPage(){
  var {slug}=useParams();
  var nav=useNavigate();
  var mob=useIsMobile(768);
  var V=EVENTS[slug];
  var [imgIdx,setImgIdx]=useState(0);
  var [loaded,setLoaded]=useState(false);
  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var schedRef=useRef(null);var schedVis=useVis(schedRef);
  var inclRef=useRef(null);var inclVis=useVis(inclRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200);window.scrollTo(0,0)},[slug]);

  if(!V)return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <Mark size={48} color={C.s7}/>
      <p style={{...sf(18,500),color:C.s4}}>Event not found</p>
      <button onClick={function(){nav("/events")}} style={{padding:"10px 24px",borderRadius:10,background:C.el,border:"1px solid "+C.bd,color:C.s1,cursor:"pointer",...sf(13,500)}}>View all events</button>
    </div>
  );

  var divider=<div style={{height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)",margin:"0"}}/>;
  var pad=mob?"0 20px":"0 40px";
  var maxW=1160;

  return(
    <div style={{background:C.bg,color:C.s1,minHeight:"100vh",overflowX:"hidden"}}>
      <SEOHead
        title={V.name+" — Book VIP Tickets | Alfred Concierge"}
        description={V.desc}
        path={"/events/"+V.slug}
        keywords={"tickets "+V.name+", "+V.name+" VIP, "+V.name+" hospitality, "+V.name+" 2026"}
        jsonLd={[
          {"@context":"https://schema.org","@type":"Event","name":V.name,"description":V.desc,"startDate":V.date.split(" ")[0],"location":{"@type":"Place","name":V.location},"offers":{"@type":"Offer","url":"https://alfredconcierge.app/events/"+V.slug,"availability":"https://schema.org/PreOrder"}},
          {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Events","item":"https://alfredconcierge.app/events"},{"@type":"ListItem","position":3,"name":V.name,"item":"https://alfredconcierge.app/events/"+V.slug}]}
        ]}
      />
      <style>{`
@keyframes evtSlideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes evtFadeIn{from{opacity:0}to{opacity:1}}
      `}</style>

      {/* Nav */}
      <div style={{padding:mob?"16px 20px":"20px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid "+C.bd,opacity:loaded?1:0,animation:loaded?"evtFadeIn 0.5s ease both":"none",position:"sticky",top:0,background:C.bg,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div onClick={function(){nav("/")}} style={{cursor:"pointer"}}><Mark size={mob?20:24}/></div>
          <div onClick={function(){nav("/events")}} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:mob?"6px 10px":"8px 14px",borderRadius:10,background:C.el,border:"1px solid "+C.bd,transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.s3} strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span style={{...sf(mob?10:11,500),color:C.s3}}>All Events</span>
          </div>
        </div>
        <div onClick={function(){openWA(V.waMsg)}} style={{display:"flex",alignItems:"center",gap:8,padding:mob?"10px 16px":"10px 22px",borderRadius:12,background:C.s1,cursor:"pointer",...sf(mob?12:13,700),color:C.bg,transition:"all 0.3s",whiteSpace:"nowrap"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
          {mob?"Request":"Request Access"}
        </div>
      </div>

      {/* Hero section */}
      <div style={{maxWidth:maxW,margin:"0 auto",padding:mob?"0 20px":"0 40px"}}>
        <div style={{padding:mob?"32px 0 0":"56px 0 0",opacity:loaded?1:0,animation:loaded?"evtSlideUp 0.7s ease 0.2s both":"none"}}>

          {/* Tags row */}
          <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:16}}>
            <div style={{padding:"5px 14px",borderRadius:10,...sf(10,700),letterSpacing:0.8,textTransform:"uppercase",background:V.color+"25",border:"1px solid "+V.color+"40",color:V.color}}>{V.tag}</div>
            <div style={{padding:"5px 12px",borderRadius:10,background:"rgba(255,255,255,0.05)",border:"0.5px solid rgba(255,255,255,0.08)",...sf(10,500),color:C.s4}}>{V.date}</div>
            <div style={{display:"flex",alignItems:"center",gap:4,...sf(10,500),color:C.s5}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {V.location}
            </div>
          </div>

          {/* Title */}
          <h1 style={{...sf(mob?34:56,700),letterSpacing:mob?-1:-2,lineHeight:1.05,marginBottom:12}}>{V.name}</h1>
          <p style={{...sf(mob?14:17,400),color:C.s3,lineHeight:1.6,maxWidth:700,marginBottom:20}}>{V.tagline}</p>

          {/* Info chips */}
          <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:10,background:C.el,border:"1px solid "+C.bd}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:spotsColor(V.spots),boxShadow:"0 0 8px "+spotsShadow(V.spots)}}/>
              <span style={{...sf(12,600),color:spotsColor(V.spots)}}>{V.spots} spots left</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:10,background:C.el,border:"1px solid "+C.bd,...sf(12,500),color:C.s4}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              {V.date}
            </div>
            <div style={{padding:"7px 14px",borderRadius:10,background:C.el,border:"1px solid "+C.bd,...sf(12,500),color:C.s5}}>{V.venue}</div>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div style={{maxWidth:maxW,margin:"0 auto",padding:mob?"28px 20px 0":"40px 40px 0",opacity:loaded?1:0,animation:loaded?"evtSlideUp 0.8s ease 0.4s both":"none"}}>
        <div style={{borderRadius:mob?18:22,overflow:"hidden",height:mob?240:500,position:"relative"}}>
          <img src={V.hero} alt={V.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 60%,rgba(10,10,11,0.35) 100%)"}}/>
        </div>
      </div>

      {/* Request Access banner */}
      <div style={{maxWidth:maxW,margin:"0 auto",padding:mob?"20px 20px 0":"28px 40px 0",opacity:loaded?1:0,animation:loaded?"evtSlideUp 0.8s ease 0.5s both":"none"}}>
        <div style={{padding:mob?"18px 20px":"22px 28px",borderRadius:18,background:C.el,border:"1px solid "+C.bd,display:"flex",alignItems:mob?"stretch":"center",justifyContent:"space-between",flexDirection:mob?"column":"row",gap:mob?14:0}}>
          <div>
            <div style={{...sf(mob?16:18,700),color:C.s1,marginBottom:4}}>Request Access</div>
            <div style={{display:"flex",alignItems:"center",gap:mob?10:12,flexWrap:"wrap"}}>
              {["No fees","Personal concierge","Limited spots"].map(function(t,i){
                return <span key={i} style={{...sf(11,400),color:C.s5,display:"flex",alignItems:"center",gap:5}}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>{t}
                </span>
              })}
            </div>
          </div>
          <div onClick={function(){openWA(V.waMsg)}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:mob?"13px 0":"13px 36px",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,700),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
            Request Access
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{maxWidth:maxW,margin:"0 auto",padding:pad}}>

        {/* Divider */}
        <div style={{margin:"36px 0"}}>{divider}</div>

        {/* What's Included */}
        <div ref={inclRef} style={{paddingBottom:36,opacity:inclVis?1:0,transform:inclVis?"translateY(0)":"translateY(20px)",transition:"all 0.7s ease"}}>
          <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:20}}>What's Included</p>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {V.includes.map(function(item,i){
              return <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",borderRadius:12,background:C.el,border:"1px solid "+C.bd}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                <span style={{...sf(13,500),color:C.s2}}>{item}</span>
              </div>
            })}
          </div>
        </div>

        <div style={{marginBottom:36}}>{divider}</div>

        {/* About */}
        <div style={{paddingBottom:36}}>
          <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:14}}>About This Experience</p>
          <p style={{...sf(mob?14:15,400),color:C.s3,lineHeight:1.85,maxWidth:800}}>{V.desc}</p>
        </div>

        <div style={{marginBottom:36}}>{divider}</div>

        {/* Gallery */}
        <div style={{paddingBottom:36}}>
          <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:18}}>Gallery</p>
          {mob?(
            /* Mobile: vertical stack */
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {V.imgs.map(function(img,i){
                return <div key={i} onClick={function(){setImgIdx(i)}} style={{height:200,borderRadius:14,overflow:"hidden",border:"1px solid "+(imgIdx===i?V.color+"50":C.bd),transition:"all 0.4s",cursor:"pointer",position:"relative"}}>
                  <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
                  {imgIdx!==i&&<div style={{position:"absolute",inset:0,background:"rgba(10,10,11,0.35)"}}/>}
                </div>
              })}
            </div>
          ):(
            /* Desktop: accordion gallery */
            <div style={{display:"flex",gap:12,height:420,borderRadius:20,overflow:"hidden"}}>
              {V.imgs.map(function(img,i){
                return <div key={i} onClick={function(){setImgIdx(i)}} style={{flex:imgIdx===i?3:1,overflow:"hidden",cursor:"pointer",transition:"all 0.7s cubic-bezier(0.16,1,0.3,1)",borderRadius:16,position:"relative",border:"1px solid "+(imgIdx===i?V.color+"40":C.bd)}}>
                  <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",transition:"transform 0.7s ease",transform:imgIdx===i?"scale(1)":"scale(1.08)"}}/>
                  {imgIdx!==i&&<div style={{position:"absolute",inset:0,background:"rgba(10,10,11,0.4)",transition:"all 0.5s"}}/>}
                </div>
              })}
            </div>
          )}
        </div>

        <div style={{marginBottom:36}}>{divider}</div>

        {/* Schedule */}
        <div ref={schedRef} style={{paddingBottom:36,opacity:schedVis?1:0,transform:schedVis?"translateY(0)":"translateY(20px)",transition:"all 0.7s ease"}}>
          <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:18}}>Schedule</p>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":V.schedule.length===1?"1fr":"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {V.schedule.map(function(day,di){
              return <div key={di} style={{padding:"20px 22px",borderRadius:16,background:C.el,border:"1px solid "+C.bd}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:V.color,boxShadow:"0 0 10px "+V.color+"60"}}/>
                  <p style={{...sf(13,700),color:C.s1}}>{day.day}</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  {day.items.map(function(item,ii){
                    return <div key={ii} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                      <div style={{width:1,height:"100%",minHeight:14,marginTop:5,background:V.color+"30",flexShrink:0}}/>
                      <span style={{...sf(13,400),color:C.s3,lineHeight:1.5}}>{item}</span>
                    </div>
                  })}
                </div>
              </div>
            })}
          </div>
        </div>

        <div style={{marginBottom:36}}>{divider}</div>

        {/* Perks */}
        <div style={{paddingBottom:36}}>
          <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:18}}>Experience Highlights</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {V.perks.map(function(pk,i){
              return <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:12,background:V.color+"10",border:"1px solid "+V.color+"25"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:V.color,flexShrink:0}}/>
                <span style={{...sf(13,500),color:C.s2}}>{pk}</span>
              </div>
            })}
          </div>
        </div>

        <div style={{marginBottom:36}}>{divider}</div>

        {/* Alfred's Note */}
        <div ref={noteRef} style={{paddingBottom:mob?48:64,opacity:noteVis?1:0,transform:noteVis?"translateY(0)":"translateY(20px)",transition:"all 0.7s ease"}}>
          <div style={{display:"flex",gap:mob?14:18,alignItems:"flex-start"}}>
            <div style={{width:mob?34:38,height:mob?34:38,borderRadius:10,background:C.el,border:"1px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Mark size={mob?17:19}/>
            </div>
            <div style={{flex:1}}>
              <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:10}}>Alfred's Note</p>
              <p style={{...sf(mob?13:14,400),color:C.s4,lineHeight:1.8,fontStyle:"italic",marginBottom:V.alfredTip?14:0}}>{V.alfredNote}</p>
              {V.alfredTip&&<div style={{padding:"12px 16px",borderRadius:12,background:C.el,border:"1px solid "+C.bd}}>
                <p style={{...sf(12,600),color:C.gold}}>Tip: <span style={{color:C.s3,fontWeight:400}}>{V.alfredTip}</span></p>
              </div>}
            </div>
          </div>
        </div>

      </div>

      {/* Sticky bottom CTA — mobile only */}
      {mob&&<div style={{position:"fixed",bottom:0,left:0,right:0,padding:"14px 20px",background:C.bg,borderTop:"1px solid "+C.bd,zIndex:40,display:"flex",gap:10}}>
        <div onClick={function(){openWA(V.waMsg)}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,700),color:C.bg}}>
          Request Access
        </div>
      </div>}
      {mob&&<div style={{height:80}}/>}
    </div>
  );
}
