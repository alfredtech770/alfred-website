import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}
function spotsColor(s){return s<=6?"#FF453A":s<=10?"#FFD60A":"#34C759"}
function spotsShadow(s){return s<=6?"rgba(255,69,58,0.5)":s<=10?"rgba(255,214,10,0.4)":"rgba(52,199,89,0.4)"}

var SB="https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/";

var EVENTS={
  "monaco-grand-prix":{
    name:"Monaco Grand Prix",slug:"monaco-grand-prix",date:"June 4 – 7, 2026",location:"Monte Carlo, Monaco",tag:"F1",color:"#E11D48",spots:12,
    hero:SB+"DPPI_00124009_1978.jpg",
    imgs:[SB+"DPPI_00124009_1978.jpg",SB+"Keinmusik.jpeg",SB+"AlfedHotelCrillionParis.jpeg"],
    tagline:"Two private venues on the most famous corner in motorsport",
    desc:"Experience the Monaco Grand Prix from the Swimming Pool chicane — the most iconic corner in Formula 1. Alfred secures two private venues: the Alfred Lounge and the Nobu Terrace. Both overlook the chicane with unobstructed views of the action. Private chef, continuous champagne service, Nobu catering, and capacity for 25 guests per venue. No lanyards, no crowds, no compromises.",
    venue:"The Alfred Lounge · Nobu Terrace · Swimming Pool Chicane",
    perks:["Alfred Lounge · pool-side chicane view","Nobu Terrace · signature catering","Private chef · continuous service","Black card welcome · no lanyards","Personal highlight reel","Helicopter transfer from Nice","Private yacht after-party option"],
    schedule:[
      {day:"Thursday, June 4",items:["Arrival & hotel check-in","Welcome dinner at the Alfred Lounge","Track walk preview (optional)"]},
      {day:"Friday, June 5",items:["Free Practice 1 & 2 from Nobu Terrace","Lunch by private chef","Evening: Monte Carlo Casino night"]},
      {day:"Saturday, June 6",items:["Free Practice 3 & Qualifying","Alfred Lounge hospitality all day","Evening: Amber Lounge after-party"]},
      {day:"Sunday, June 7",items:["Race Day — both venues open","Champagne service from lights out","Post-race celebration & helicopter transfer"]},
    ],
    includes:["Private hospitality venue","Nobu catering all weekend","Open bar — champagne, spirits, wine","Personal concierge on-site","Airport/hotel transfers","After-party access","Professional photography"],
    alfredNote:"This is one of our most exclusive packages. The Swimming Pool chicane is where races are won and lost — you'll feel the cars shake the ground beneath you. We limit this to 50 guests total across both venues to keep it intimate. Request early — Monaco sells out faster than any other event on our calendar.",
    alfredTip:"Fly into Nice and take our helicopter transfer. The 7-minute flight over the coastline is worth it alone.",
  },
  "miami-grand-prix":{
    name:"Miami Grand Prix",slug:"miami-grand-prix",date:"May 1 – 3, 2026",location:"Miami Gardens, Florida",tag:"F1",color:"#F97316",spots:8,
    hero:SB+"Keinmusik.jpeg",
    imgs:[SB+"Keinmusik.jpeg",SB+"DPPI_00124009_1978.jpg",SB+"image.jpg"],
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
  },
  "ibiza-opening":{
    name:"Ibiza Opening",slug:"ibiza-opening",date:"May – June 2026",location:"Ibiza, Spain",tag:"Nightlife",color:"#8B5CF6",spots:15,
    hero:SB+"image.jpg",
    imgs:[SB+"image.jpg",SB+"Keinmusik.jpeg",SB+"Bulgari-Resort-Bali-Exterior.webp"],
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
  },
  "roland-garros":{
    name:"Roland Garros",slug:"roland-garros",date:"May 18 – Jun 7, 2026",location:"Paris, France",tag:"Tennis",color:"#D97706",spots:6,
    hero:SB+"AlfedHotelCrillionParis.jpeg",
    imgs:[SB+"AlfedHotelCrillionParis.jpeg",SB+"DPPI_00124009_1978.jpg",SB+"Bulgari-Resort-Bali-Exterior.webp"],
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
  },
  "royal-ascot":{
    name:"Royal Ascot",slug:"royal-ascot",date:"June 16 – 20, 2026",location:"Ascot, England",tag:"Racing",color:"#0EA5E9",spots:4,
    hero:SB+"Bulgari-Resort-Bali-Exterior.webp",
    imgs:[SB+"Bulgari-Resort-Bali-Exterior.webp",SB+"AlfedHotelCrillionParis.jpeg",SB+"DPPI_00124009_1978.jpg"],
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
  },
};

export default function EventDetailPage(){
  var {slug}=useParams();
  var nav=useNavigate();
  var V=EVENTS[slug];
  var [imgIdx,setImgIdx]=useState(0);
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);

  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var schedRef=useRef(null);var schedVis=useVis(schedRef);
  var inclRef=useRef(null);var inclVis=useVis(inclRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200);window.scrollTo(0,0)},[slug]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);

  if(!V)return(<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
    <Mark size={48} color={C.s7}/>
    <p style={{...sf(18,500),color:C.s4}}>Event not found</p>
    <button onClick={function(){nav("/events")}} style={{padding:"10px 24px",borderRadius:10,background:C.el,border:"1px solid "+C.bd,color:C.s1,cursor:"pointer",...sf(13,500)}}>View all events</button>
  </div>);

  var divider={width:"100%",maxWidth:1200,margin:"0 auto",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)"};

  return(
    <div style={{background:C.bg,color:C.s1,minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
@keyframes evtSlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes evtFadeIn{from{opacity:0}to{opacity:1}}
      `}</style>

      {/* HERO */}
      <div style={{position:"relative",height:"70vh",minHeight:500,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,transform:"translateY("+scrollY*0.3+"px) scale("+(1+scrollY*0.0003)+")",transition:"transform 0.1s linear"}}>
          <img src={V.hero} alt={V.name} style={{width:"100%",height:"120%",objectFit:"cover"}}/>
        </div>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0.2) 0%,rgba(10,10,11,0.4) 50%,rgba(10,10,11,0.95) 85%,#0A0A0B 100%)"}}/>

        {/* Nav */}
        <div style={{position:"absolute",top:0,left:0,right:0,padding:"20px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:10,opacity:loaded?1:0,animation:loaded?"evtFadeIn 0.6s ease 0.2s both":"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div onClick={function(){nav("/")}} style={{cursor:"pointer"}}><Mark size={24}/></div>
            <div onClick={function(){nav("/events")}} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:"8px 14px",borderRadius:10,background:"rgba(0,0,0,0.3)",backdropFilter:"blur(12px)",border:"0.5px solid rgba(255,255,255,0.08)"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s3} strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span style={{...sf(11,500),color:C.s3}}>All Events</span>
            </div>
          </div>
          <div onClick={function(){}} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",borderRadius:12,background:C.s1,cursor:"pointer",...sf(13,700),color:C.bg,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
            Request Access
          </div>
        </div>

        {/* Hero content */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 40px 48px",maxWidth:900,zIndex:5}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,opacity:loaded?1:0,animation:loaded?"evtSlideUp 0.8s ease 0.3s both":"none"}}>
            <div style={{padding:"5px 14px",borderRadius:10,...sf(10,700),letterSpacing:0.8,textTransform:"uppercase",background:V.color+"25",border:"1px solid "+V.color+"40",color:V.color}}>{V.tag}</div>
            <div style={{padding:"5px 14px",borderRadius:10,background:"rgba(255,255,255,0.06)",border:"0.5px solid rgba(255,255,255,0.08)",...sf(10,500),color:C.s4}}>{V.date}</div>
            <div style={{display:"flex",alignItems:"center",gap:5,...sf(10,500),color:C.s4}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {V.location}
            </div>
          </div>
          <h1 style={{...sf(52,700),letterSpacing:-2,lineHeight:1.05,marginBottom:12,opacity:loaded?1:0,animation:loaded?"evtSlideUp 0.8s ease 0.4s both":"none"}}>{V.name}</h1>
          <p style={{...sf(17,400),color:C.s3,lineHeight:1.6,maxWidth:650,opacity:loaded?1:0,animation:loaded?"evtSlideUp 0.8s ease 0.5s both":"none"}}>{V.tagline}</p>
          <div style={{display:"flex",alignItems:"center",gap:12,marginTop:20,opacity:loaded?1:0,animation:loaded?"evtSlideUp 0.8s ease 0.6s both":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:10,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)",border:"0.5px solid rgba(255,255,255,0.08)"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:spotsColor(V.spots),boxShadow:"0 0 8px "+spotsShadow(V.spots)}}/>
              <span style={{...sf(12,600),color:spotsColor(V.spots)}}>{V.spots} spots left</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT — Two column layout */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 40px"}}>
        <style>{`.evt-cols{display:flex;gap:40;align-items:flex-start}.evt-left{flex:1;min-width:0}.evt-right{width:320px;flex-shrink:0;position:sticky;top:80px}@media(max-width:900px){.evt-cols{flex-direction:column}.evt-right{width:100%;position:static}}`}</style>
        <div className="evt-cols">

          {/* LEFT COLUMN — Main content */}
          <div className="evt-left">

            {/* What You Get — straight to the point */}
            <div style={{padding:"40px 0 36px"}}>
              <p style={{...sf(11,600),color:C.s6,letterSpacing:2,textTransform:"uppercase",marginBottom:20}}>What You Get</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {V.includes.map(function(item,i){
                  return <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:12,background:C.el,border:"1px solid "+C.bd}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    <span style={{...sf(13,500),color:C.s2}}>{item}</span>
                  </div>
                })}
              </div>
            </div>

            <div style={divider}/>

            {/* About */}
            <div style={{padding:"36px 0"}}>
              <p style={{...sf(11,600),color:C.s6,letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>About This Event</p>
              <p style={{...sf(15,400),color:C.s3,lineHeight:1.8}}>{V.desc}</p>
            </div>

            <div style={divider}/>

            {/* Gallery */}
            <div style={{padding:"36px 0"}}>
              <div style={{display:"flex",gap:12,overflow:"hidden",borderRadius:18}}>
                {V.imgs.map(function(img,i){
                  return <div key={i} onClick={function(){setImgIdx(i)}} style={{flex:imgIdx===i?"3":"1",height:240,borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"all 0.7s cubic-bezier(0.16,1,0.3,1)",position:"relative"}}>
                    <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.7s ease",transform:imgIdx===i?"scale(1)":"scale(1.1)"}}/>
                    {imgIdx!==i&&<div style={{position:"absolute",inset:0,background:"rgba(10,10,11,0.4)",transition:"all 0.5s"}}/>}
                  </div>
                })}
              </div>
            </div>

            <div style={divider}/>

            {/* Schedule */}
            <div ref={schedRef} style={{padding:"36px 0",opacity:schedVis?1:0,transform:schedVis?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
              <p style={{...sf(11,600),color:C.s6,letterSpacing:2,textTransform:"uppercase",marginBottom:20}}>Schedule</p>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {V.schedule.map(function(day,di){
                  return <div key={di} style={{padding:"18px 20px",borderRadius:16,background:C.el,border:"1px solid "+C.bd}}>
                    <p style={{...sf(13,700),color:C.s1,marginBottom:12}}>{day.day}</p>
                    <div style={{display:"flex",flexDirection:"column",gap:7}}>
                      {day.items.map(function(item,ii){
                        return <div key={ii} style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:5,height:5,borderRadius:"50%",background:V.color,boxShadow:"0 0 6px "+V.color+"40",flexShrink:0}}/>
                          <span style={{...sf(13,400),color:C.s3}}>{item}</span>
                        </div>
                      })}
                    </div>
                  </div>
                })}
              </div>
            </div>

            <div style={divider}/>

            {/* Alfred's Note */}
            <div ref={noteRef} style={{padding:"36px 0 60px",opacity:noteVis?1:0,transform:noteVis?"translateY(0)":"translateY(24px)",transition:"all 0.8s ease"}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:36,height:36,borderRadius:10,background:C.el,border:"1px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Mark size={18}/></div>
                <div>
                  <p style={{...sf(11,600),color:C.s6,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Alfred's Note</p>
                  <p style={{...sf(14,400),color:C.s4,lineHeight:1.7,fontStyle:"italic"}}>{V.alfredNote}</p>
                  {V.alfredTip&&<div style={{marginTop:12,padding:"10px 14px",borderRadius:10,background:C.el,border:"1px solid "+C.bd}}>
                    <p style={{...sf(12,500),color:C.gold}}>Tip: <span style={{color:C.s3,fontWeight:400}}>{V.alfredTip}</span></p>
                  </div>}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Sticky booking card */}
          <div className="evt-right">
            <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden",marginTop:40}}>
              <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
              <div style={{padding:"24px 22px"}}>
                <div style={{...sf(18,700),color:C.s1,marginBottom:6}}>Request Access</div>
                <p style={{...sf(12,400),color:C.s5,marginBottom:20}}>{V.venue}</p>

                {/* Key details */}
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    <span style={{...sf(13,500),color:C.s3}}>{V.date}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span style={{...sf(13,500),color:C.s3}}>{V.location}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:spotsColor(V.spots),boxShadow:"0 0 6px "+spotsShadow(V.spots),marginLeft:3,marginRight:1}}/>
                    <span style={{...sf(13,600),color:spotsColor(V.spots)}}>{V.spots} spots left</span>
                  </div>
                </div>

                {/* CTA */}
                <div onClick={function(){}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                  Request Access
                </div>

                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:14}}>
                  {["No fees","Personal concierge","Limited spots"].map(function(t,i){return <span key={i} style={{...sf(10),color:C.s6}}>{t}</span>})}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer spacer */}
      <div style={{height:40}}/>

      <style>{`
@media(max-width:700px){
  h1{font-size:36px!important}
}
      `}</style>
    </div>
  );
}
