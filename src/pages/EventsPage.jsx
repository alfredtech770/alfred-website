import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}
function spotsColor(s){return s<=6?"#FF453A":s<=10?"#FFD60A":"#34C759"}
function spotsShadow(s){return s<=6?"rgba(255,69,58,0.5)":s<=10?"rgba(255,214,10,0.4)":"rgba(52,199,89,0.4)"}

var SB="https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/";

var EVENTS=[
  {name:"Monaco Grand Prix",slug:"monaco-grand-prix",date:"June 4 – 7, 2026",location:"Monte Carlo, Monaco",tag:"F1",color:"#E11D48",spots:12,
   desc:"Two private venues on the Swimming Pool chicane. Private chef, champagne, Nobu catering.",
   img:SB+"DPPI_00124009_1978.jpg"},
  {name:"Miami Grand Prix",slug:"miami-grand-prix",date:"May 1 – 3, 2026",location:"Miami Gardens, Florida",tag:"F1",color:"#F97316",spots:8,
   desc:"Track-side luxury suite at Turn 1 with paddock access. Celebrity after-parties at LIV & E11even.",
   img:SB+"Keinmusik.jpeg"},
  {name:"Ibiza Opening",slug:"ibiza-opening",date:"May – June 2026",location:"Ibiza, Spain",tag:"Nightlife",color:"#8B5CF6",spots:15,
   desc:"Season opening across all four superclubs. Private villa, yacht parties, artist access.",
   img:SB+"image.jpg"},
  {name:"Roland Garros",slug:"roland-garros",date:"May 18 – Jun 7, 2026",location:"Paris, France",tag:"Tennis",color:"#D97706",spots:6,
   desc:"Private box in Philippe Chatrier. Michelin dining, champagne terraces, chauffeur transfers.",
   img:SB+"AlfedHotelCrillionParis.jpeg"},
  {name:"Royal Ascot",slug:"royal-ascot",date:"June 16 – 20, 2026",location:"Ascot, England",tag:"Racing",color:"#0EA5E9",spots:4,
   desc:"Royal Enclosure badges, private box for 12, Michelin chef, helicopter from London.",
   img:SB+"Bulgari-Resort-Bali-Exterior.webp"},
];

var TAGS=["All","F1","Nightlife","Tennis","Racing"];

function EventCard(p){
  var [hover,setHover]=useState(false);
  var nav=useNavigate();
  var e=p.evt;
  return(
    <div onClick={function(){nav("/events/"+e.slug)}} onMouseEnter={function(){setHover(true)}} onMouseLeave={function(){setHover(false)}}
      style={{borderRadius:20,overflow:"hidden",background:C.el,border:"1px solid "+(hover?"rgba(255,255,255,0.12)":C.bd),cursor:"pointer",transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",transform:hover?"translateY(-6px)":"translateY(0)",boxShadow:hover?"0 24px 64px rgba(0,0,0,0.5)":"0 4px 16px rgba(0,0,0,0.2)",opacity:p.vis?1:0,animation:p.vis?"evtCardIn 0.7s ease "+(p.delay||0)+"s both":"none"}}>
      {/* Image */}
      <div style={{height:220,overflow:"hidden",position:"relative"}}>
        <img src={e.img} alt={e.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.6s ease",transform:hover?"scale(1.05)":"scale(1)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(10,10,11,0.6) 100%)"}}/>
        {/* Tag */}
        <div style={{position:"absolute",top:14,left:14,padding:"4px 12px",borderRadius:8,...sf(10,700),letterSpacing:0.8,textTransform:"uppercase",background:e.color+"25",border:"1px solid "+e.color+"40",color:e.color}}>{e.tag}</div>
        {/* Spots */}
        <div style={{position:"absolute",top:14,right:14,display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",border:"0.5px solid rgba(255,255,255,0.08)"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:spotsColor(e.spots),boxShadow:"0 0 6px "+spotsShadow(e.spots)}}/>
          <span style={{...sf(10,600),color:spotsColor(e.spots)}}>{e.spots} spots</span>
        </div>
      </div>
      {/* Content */}
      <div style={{padding:"18px 20px 20px"}}>
        <h3 style={{...sf(20,700),letterSpacing:-0.3,marginBottom:6}}>{e.name}</h3>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <span style={{...sf(11,500),color:C.s5}}>{e.date}</span>
          <span style={{...sf(11,400),color:C.s7}}>·</span>
          <span style={{...sf(11,500),color:C.s5}}>{e.location}</span>
        </div>
        <p style={{...sf(13,400),color:C.s4,lineHeight:1.6}}>{e.desc}</p>
        <div style={{marginTop:14,display:"flex",alignItems:"center",gap:6,...sf(12,600),color:C.s1}}>
          <span>View details</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{transition:"transform 0.3s",transform:hover?"translateX(4px)":"translateX(0)"}}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage(){
  var [loaded,setLoaded]=useState(false);
  var [filter,setFilter]=useState("All");
  var gridRef=useRef(null);var gridVis=useVis(gridRef);
  var nav=useNavigate();

  useEffect(function(){setTimeout(function(){setLoaded(true)},200);window.scrollTo(0,0)},[]);

  var filtered=filter==="All"?EVENTS:EVENTS.filter(function(e){return e.tag===filter});

  return(
    <div style={{background:C.bg,color:C.s1,minHeight:"100vh"}}>
      <style>{`
@keyframes evtCardIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Header */}
      <div style={{padding:"20px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid "+C.bd}}>
        <div onClick={function(){nav("/")}} style={{cursor:"pointer"}}><Mark size={28}/></div>
        <div style={{display:"flex",gap:20}}>
          <span onClick={function(){nav("/catalog")}} style={{...sf(12,500),color:C.s5,cursor:"pointer",transition:"color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.color=C.s5}}>Catalog</span>
          <span onClick={function(){nav("/contact")}} style={{...sf(12,500),color:C.s5,cursor:"pointer",transition:"color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.color=C.s5}}>Contact</span>
        </div>
      </div>

      {/* Hero area */}
      <div style={{padding:"80px 40px 0",maxWidth:900,margin:"0 auto",textAlign:"center"}}>
        <p style={{...sf(10,600),color:C.s6,letterSpacing:4,textTransform:"uppercase",marginBottom:16,opacity:loaded?1:0,transition:"all 0.8s ease"}}>Curated Experiences</p>
        <h1 style={{...sf(48,700),letterSpacing:-2,lineHeight:1.05,marginBottom:16,opacity:loaded?1:0,transition:"all 0.9s ease 0.1s"}}>Featured Events</h1>
        <p style={{...sf(16,400),color:C.s4,lineHeight:1.7,maxWidth:550,margin:"0 auto",opacity:loaded?1:0,transition:"all 0.9s ease 0.2s"}}>Exclusive access to the world's most sought-after events. Every detail handled. Every moment elevated.</p>
      </div>

      {/* Filters */}
      <div style={{display:"flex",justifyContent:"center",gap:8,padding:"36px 40px 0",opacity:loaded?1:0,transition:"all 0.8s ease 0.3s"}}>
        {TAGS.map(function(tag){
          var active=filter===tag;
          return <div key={tag} onClick={function(){setFilter(tag)}} style={{padding:"7px 18px",borderRadius:10,cursor:"pointer",background:active?"rgba(244,244,245,0.08)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.15)":C.bd),...sf(12,active?600:400),color:active?C.s1:C.s5,transition:"all 0.3s"}} onMouseEnter={function(e){if(!active)e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){if(!active)e.currentTarget.style.borderColor=C.bd}}>
            {tag}
          </div>
        })}
      </div>

      {/* Grid */}
      <div ref={gridRef} style={{maxWidth:1100,margin:"0 auto",padding:"48px 40px 80px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340,1fr))",gap:24}}>
        {filtered.map(function(evt,i){
          return <EventCard key={evt.slug} evt={evt} vis={gridVis} delay={i*0.1}/>
        })}
      </div>

      {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 0 80px"}}>
        <p style={{...sf(15,500),color:C.s5}}>No events in this category yet.</p>
      </div>}
    </div>
  );
}
