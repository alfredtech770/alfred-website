import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

var WA_NUM="447449562204";
function openWA(msg){window.open("https://wa.me/"+WA_NUM+"?text="+encodeURIComponent(msg),"_blank")}

var EVENTS=[
  {name:"Monaco Grand Prix",slug:"monaco-grand-prix",date:"June 5 – 7, 2026",location:"Monte Carlo, Monaco",tag:"F1",
   venue:"The Alfred Lounge · Swimming Pool Chicane",
   desc:"Private hospitality on the Swimming Pool chicane. Caviar & champagne service, private chef, premium catering, and after-party VIP access.",
   perks:["Alfred Lounge · pool-side chicane view","Caviar & champagne service","Private chef · premium catering","After-party VIP access","Helicopter transfer from Nice"],
   img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/Monaco%20grand%20prix.jpeg",color:"#E11D48",spots:12,
   waMsg:"Hi Alfred, I'm interested in the Monaco Grand Prix experience (June 5–7, 2026). I'd like to learn more about availability and access."},
  {name:"Miami Grand Prix",slug:"miami-grand-prix",date:"May 1 – 3, 2026",location:"Miami Gardens, Florida",tag:"F1",
   venue:"Track-Side Luxury Suite · Turn 1",
   desc:"Track-side hospitality suite overlooking Turn 1 with direct paddock access. Celebrity after-race parties at LIV, Story, and E11even — all arranged.",
   perks:["Private luxury suite · Turn 1","Paddock Club access","After-race LIV takeover","Supercar parade entry","Personal concierge all weekend"],
   img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/Keinmusik.jpeg",color:"#F97316",spots:8,
   waMsg:"Hi Alfred, I'm interested in the Miami Grand Prix experience (May 1–3, 2026). I'd like to know more about the Turn 1 suite and paddock access."},
  {name:"Ibiza Opening",slug:"ibiza-opening",date:"May – June 2026",location:"Ibiza, Spain",tag:"Nightlife",
   venue:"Hï Ibiza · Ushuaïa · Pacha · Amnesia",
   desc:"Season opening week across all four superclubs. Front-row Ushuaïa access, VIP tables, private villa with chef, and artist meet & greets.",
   perks:["Hï Ibiza VIP table · 4 nights","Ushuaïa front-row access","Private villa with chef","Artist meet & greets","Yacht day party · full crew"],
   img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/image.jpg",color:"#8B5CF6",spots:15,
   waMsg:"Hi Alfred, I'm interested in the Ibiza Opening experience (May–June 2026). I'd like to learn more about the villa and VIP club access."},
  {name:"Roland Garros",slug:"roland-garros",date:"May 18 – Jun 7, 2026",location:"Paris, France",tag:"Tennis",
   venue:"Philippe Chatrier · Private Box",
   desc:"Courtside hospitality at the French Open. Private box seats in Philippe Chatrier, champagne terraces, Michelin dining experience, and chauffeur transfers.",
   perks:["Philippe Chatrier box seats","Champagne terrace access","Michelin dining experience","Player lounge entry","Chauffeur from hotel"],
   img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/AlfedHotelCrillionParis.jpeg",color:"#D97706",spots:6,
   waMsg:"Hi Alfred, I'm interested in the Roland Garros experience (May 18–Jun 7, 2026). I'd like to know more about the private box and hospitality."},
  {name:"Royal Ascot",slug:"royal-ascot",date:"June 16 – 20, 2026",location:"Ascot, England",tag:"Racing",
   venue:"Royal Enclosure · Private Box for 12",
   desc:"The Royal Enclosure experience. Private box, Michelin chefs, helicopter from central London, and Savile Row styling consultation included.",
   perks:["Royal Enclosure badges","Private box for 12 guests","Michelin chef on-site","Helicopter from London","Savile Row styling session"],
   img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/Bulgari-Resort-Bali-Exterior.webp",color:"#0EA5E9",spots:4,
   waMsg:"Hi Alfred, I'm interested in the Royal Ascot experience (June 16–20, 2026). I'd like to learn more about the Royal Enclosure and private box."},
];

function spotsColor(s){return s<=6?"#FF453A":s<=10?"#FFD60A":"#34C759"}
function spotsShadow(s){return s<=6?"rgba(255,69,58,0.5)":s<=10?"rgba(255,214,10,0.4)":"rgba(52,199,89,0.4)"}

function useIsMobile(breakpoint){
  var bp=breakpoint||768;
  var [mob,setMob]=useState(function(){return typeof window!=="undefined"&&window.innerWidth<=bp});
  useEffect(function(){
    function check(){setMob(window.innerWidth<=bp)}
    window.addEventListener("resize",check);
    return function(){window.removeEventListener("resize",check)};
  },[bp]);
  return mob;
}

export default function FeaturedEvents(){
  var nav=useNavigate();
  var [idx,setIdx]=useState(0);
  var [entered,setEntered]=useState(false);
  var sectionRef=useRef(null);
  var lastWheel=useRef(0);
  var mob=useIsMobile(768);

  useEffect(function(){
    var el=sectionRef.current;if(!el)return;
    var obs=new IntersectionObserver(function(entries){if(entries[0].isIntersecting)setEntered(true)},{threshold:0.15});
    obs.observe(el);
    return function(){obs.disconnect()};
  },[]);

  /* scroll hijack */
  useEffect(function(){
    var el=sectionRef.current;if(!el)return;
    function onWheel(e){
      var rect=el.getBoundingClientRect();
      var inView=rect.top<=50&&rect.bottom>=window.innerHeight-50;
      if(!inView)return;
      var now=Date.now();
      if(now-lastWheel.current<800){e.preventDefault();return}
      if(Math.abs(e.deltaY)<25)return;
      if(e.deltaY>0&&idx<EVENTS.length-1){e.preventDefault();lastWheel.current=now;setIdx(idx+1)}
      else if(e.deltaY<0&&idx>0){e.preventDefault();lastWheel.current=now;setIdx(idx-1)}
    }
    window.addEventListener("wheel",onWheel,{passive:false});
    return function(){window.removeEventListener("wheel",onWheel)};
  },[idx]);

  /* touch swipe */
  var touchY=useRef(0);
  function onTouchStart(e){touchY.current=e.touches[0].clientY}
  function onTouchEnd(e){
    var diff=touchY.current-e.changedTouches[0].clientY;
    var now=Date.now();
    if(now-lastWheel.current<800)return;
    if(Math.abs(diff)<40)return;
    if(diff>0&&idx<EVENTS.length-1){lastWheel.current=now;setIdx(idx+1)}
    else if(diff<0&&idx>0){lastWheel.current=now;setIdx(idx-1)}
  }

  function goTo(n){if(n>=0&&n<EVENTS.length)setIdx(n)}
  var cur=EVENTS[idx];

  return(
    <section ref={sectionRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{minHeight:"100vh",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",padding:mob?"20px 0":"40px 0",overflow:"hidden"}}>
      <style>{`
@keyframes evtFadeSlideUp{from{opacity:0;transform:translateY(40px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes evtFloatSlow{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-6px)}}
      `}</style>

      {/* Clean background */}
      <div style={{position:"absolute",inset:0,background:C.bg,zIndex:0}}/>

      {/* CARD + ARROWS WRAPPER */}
      <div style={{display:"flex",alignItems:"center",gap:mob?0:20,zIndex:5,opacity:entered?1:0,transform:entered?"translateY(0) scale(1)":"translateY(40px) scale(0.97)",transition:"all 1s cubic-bezier(0.16,1,0.3,1) 0.3s",width:mob?"100%":"auto",justifyContent:"center"}}>

      {/* Left arrow — hidden on mobile */}
      {!mob&&<div onClick={function(){if(idx>0)goTo(idx-1)}} style={{width:48,height:48,borderRadius:"50%",background:idx>0?"rgba(255,255,255,0.06)":"transparent",border:idx>0?"1px solid rgba(255,255,255,0.1)":"1px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:idx>0?"pointer":"default",transition:"all 0.3s",opacity:idx>0?1:0.2,flexShrink:0}} onMouseEnter={function(e){if(idx>0){e.currentTarget.style.background="rgba(255,255,255,0.12)";e.currentTarget.style.borderColor="rgba(255,255,255,0.2)"}}} onMouseLeave={function(e){e.currentTarget.style.background=idx>0?"rgba(255,255,255,0.06)":"transparent";e.currentTarget.style.borderColor=idx>0?"rgba(255,255,255,0.1)":"transparent"}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </div>}

      {/* CENTER CARD */}
      <div style={{width:mob?"100%":780,maxWidth:mob?"calc(100vw - 40px)":"68vw",borderRadius:mob?24:28,overflow:"hidden",background:"rgba(24,24,27,0.85)",backdropFilter:"blur(40px) saturate(1.3)",border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 60px 160px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.03)",position:"relative",flexShrink:1,margin:mob?"0 20px":"0"}}>
        {/* shine line */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)",zIndex:10}}/>

        {/* Counter */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:mob?10:14,padding:mob?"24px 0 0":"18px 0 0"}}>
          <span style={{...sf(mob?12:13,300),color:C.s3,fontVariantNumeric:"tabular-nums"}}>{String(idx+1).padStart(2,"0")}</span>
          <div style={{width:mob?44:50,height:2,background:C.bd,borderRadius:1,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,height:"100%",width:((idx+1)/EVENTS.length*100)+"%",background:C.s1,borderRadius:1,transition:"width 0.7s cubic-bezier(0.16,1,0.3,1)"}}/>
          </div>
          <span style={{...sf(mob?12:13,300),color:C.s3,fontVariantNumeric:"tabular-nums"}}>{"0"+EVENTS.length}</span>
        </div>

        {/* Name */}
        <div style={{position:"relative",height:mob?44:46,margin:mob?"20px 20px 20px":"12px 24px 14px",overflow:"hidden"}}>
          {EVENTS.map(function(evt,i){
            var isActive=i===idx;
            return <div key={i} style={{position:"absolute",left:0,right:0,textAlign:"center",opacity:isActive?1:0,transform:isActive?"translateY(0)":i<idx?"translateY(-30px)":"translateY(30px)",transition:"all 0.7s cubic-bezier(0.16,1,0.3,1)"}}>
              <h3 style={{...sf(mob?26:30,700),letterSpacing:-0.5,lineHeight:1.2,whiteSpace:mob?"normal":"nowrap",margin:0}}>{evt.name}</h3>
            </div>
          })}
        </div>

        {/* Image */}
        <div style={{height:mob?360:260,margin:mob?"0 14px":"0 16px",borderRadius:mob?16:18,overflow:"hidden",position:"relative"}}>
          {EVENTS.map(function(evt,i){
            var isActive=i===idx;
            return <div key={i} style={{position:"absolute",inset:0,opacity:isActive?1:0,transform:isActive?"scale(1)":"scale(1.06)",transition:"opacity 0.9s ease, transform 6s ease",zIndex:isActive?2:1}}>
              <img src={evt.img} alt={evt.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 50%,rgba(24,24,27,0.4) 100%)"}}/>
            </div>
          })}
          {/* Tags overlay */}
          <div style={{position:"absolute",top:mob?12:16,left:mob?12:16,display:"flex",gap:6,zIndex:10,flexWrap:"wrap"}}>
            <div style={{padding:mob?"5px 12px":"5px 14px",borderRadius:mob?8:10,backdropFilter:"blur(8px)",...sf(mob?10:10,700),letterSpacing:0.8,textTransform:"uppercase",background:cur.color+"30",border:"1px solid "+cur.color+"50",color:cur.color,transition:"all 0.5s"}}>{cur.tag}</div>
            <div style={{padding:mob?"5px 12px":"5px 14px",borderRadius:mob?8:10,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)",border:"0.5px solid rgba(255,255,255,0.08)",...sf(mob?10:10,500),color:"rgba(255,255,255,0.7)"}}>{cur.date}</div>
          </div>
          {/* Location */}
          <div style={{position:"absolute",bottom:mob?12:16,left:mob?12:16,display:"flex",alignItems:"center",gap:5,zIndex:10,...sf(mob?11:11,500),color:"rgba(255,255,255,0.6)"}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>{cur.location}</span>
          </div>
          {/* Spots */}
          <div style={{position:"absolute",bottom:mob?12:16,right:mob?12:16,display:"flex",alignItems:"center",gap:6,padding:mob?"5px 12px":"6px 14px",borderRadius:mob?8:10,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)",border:"0.5px solid rgba(255,255,255,0.08)",zIndex:10,...sf(mob?11:11,600),transition:"all 0.5s"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:spotsColor(cur.spots),boxShadow:"0 0 8px "+spotsShadow(cur.spots)}}/>
            <span style={{color:spotsColor(cur.spots)}}>{cur.spots} spots left</span>
          </div>
        </div>

        {/* Description */}
        <div style={{position:"relative",minHeight:mob?56:56,margin:mob?"24px 20px 0":"14px 24px 0",overflow:"hidden"}}>
          {EVENTS.map(function(evt,i){
            var isActive=i===idx;
            return <p key={i} style={{...sf(mob?13:13,400),color:C.s4,lineHeight:1.75,textAlign:"center",opacity:isActive?1:0,transform:isActive?"translateY(0)":"translateY(12px)",transition:"all 0.6s ease",position:i===0&&isActive?"relative":"absolute",top:0,left:0,right:0,margin:0}}>{evt.desc}</p>
          })}
        </div>

        {/* Venue */}
        <div style={{position:"relative",height:mob?18:18,margin:mob?"16px 20px 4px":"0 24px 2px",overflow:"hidden"}}>
          {EVENTS.map(function(evt,i){
            var isActive=i===idx;
            return <div key={i} style={{position:"absolute",left:0,right:0,textAlign:"center",...sf(mob?9:10,500),color:C.s6,letterSpacing:1,textTransform:"uppercase",opacity:isActive?1:0,transition:"all 0.6s ease"}}>{evt.venue}</div>
          })}
        </div>

        {/* Perks */}
        <div style={{margin:mob?"20px 16px 0":"10px 24px 0",display:"flex",flexWrap:"wrap",justifyContent:"center",gap:mob?6:6,minHeight:mob?26:26,position:"relative"}}>
          {EVENTS.map(function(evt,i){
            var isActive=i===idx;
            var displayPerks=mob?evt.perks.slice(0,3):evt.perks;
            return <div key={i} style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:mob?6:6,position:isActive?"relative":"absolute",top:0,left:0,right:0,opacity:isActive?1:0,transition:"all 0.6s ease"}}>
              {displayPerks.map(function(pk,j){
                return <span key={j} style={{padding:mob?"4px 10px":"4px 10px",borderRadius:mob?7:7,background:"rgba(244,244,245,0.04)",border:"0.5px solid rgba(244,244,245,0.06)",...sf(mob?10:10,500),color:C.s5}}>{pk}</span>
              })}
            </div>
          })}
        </div>

        {/* CTA */}
        <div style={{padding:mob?"24px 20px 6px":"16px 24px 4px",display:"flex",justifyContent:"center"}}>
          <button onClick={function(){nav("/events/"+cur.slug)}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:mob?"14px 28px":"14px 32px",borderRadius:mob?14:14,background:C.s1,border:"none",cursor:"pointer",...sf(mob?13:13,700),color:C.bg,letterSpacing:0.5,transition:"all 0.4s",width:mob?"100%":"auto",justifyContent:"center"}} onMouseEnter={function(e){if(!mob){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 16px 48px rgba(244,244,245,0.15)"}}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
            View Experience <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        {/* Dots */}
        <div style={{display:"flex",justifyContent:"center",gap:6,padding:mob?"18px 0 24px":"12px 0 18px"}}>
          {EVENTS.map(function(evt,i){
            var isActive=i===idx;
            return <div key={i} onClick={function(){goTo(i)}} style={{height:mob?7:8,borderRadius:5,cursor:"pointer",width:isActive?(mob?22:26):(mob?7:8),background:isActive?evt.color:C.s7,boxShadow:isActive?"0 0 16px "+evt.color+"40":"none",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)"}}/>
          })}
        </div>
      </div>

      {/* Right arrow — hidden on mobile */}
      {!mob&&<div onClick={function(){if(idx<EVENTS.length-1)goTo(idx+1)}} style={{width:48,height:48,borderRadius:"50%",background:idx<EVENTS.length-1?"rgba(255,255,255,0.06)":"transparent",border:idx<EVENTS.length-1?"1px solid rgba(255,255,255,0.1)":"1px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:idx<EVENTS.length-1?"pointer":"default",transition:"all 0.3s",opacity:idx<EVENTS.length-1?1:0.2,flexShrink:0}} onMouseEnter={function(e){if(idx<EVENTS.length-1){e.currentTarget.style.background="rgba(255,255,255,0.12)";e.currentTarget.style.borderColor="rgba(255,255,255,0.2)"}}} onMouseLeave={function(e){e.currentTarget.style.background=idx<EVENTS.length-1?"rgba(255,255,255,0.06)":"transparent";e.currentTarget.style.borderColor=idx<EVENTS.length-1?"rgba(255,255,255,0.1)":"transparent"}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>}

      </div>{/* end wrapper */}

      {/* Scroll hint */}
      <div style={{position:"absolute",bottom:mob?16:24,left:"50%",transform:"translateX(-50%)",zIndex:10,textAlign:"center",animation:"evtFloatSlow 3s ease-in-out infinite"}}>
        <div style={{width:1,height:mob?24:32,background:"linear-gradient(180deg,transparent,"+C.s7+")",margin:"0 auto 8px",opacity:0.5}}/>
        <span style={{...sf(9,500),color:C.s7,letterSpacing:3,textTransform:"uppercase"}}>{idx<EVENTS.length-1?"↓ Swipe for next":"↓ Continue"}</span>
      </div>
    </section>
  );
}
