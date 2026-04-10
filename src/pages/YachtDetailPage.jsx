import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import DarkDatePicker from "../components/DarkDatePicker";
import SEOHead from "../components/SEOHead";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){
  return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><path d="M42 18 C42 30 34 38 22 38 C34 38 42 46 42 58 C42 46 50 38 62 38 C50 38 42 30 42 18Z" fill={p.color||C.s1}/><path d="M58 42 C58 54 50 62 38 62 C50 62 58 70 58 82 C58 70 66 62 78 62 C66 62 58 54 58 42Z" fill={p.color||C.s1}/></svg>);
}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}


var TIERS=[{label:"4 hours",hours:4,field:"price_4hr",wkField:"price_weekday_4hr"},{label:"6 hours",hours:6,field:"price_6hr",wkField:"price_weekday_6hr"},{label:"8 hours",hours:8,field:"price_8hr",wkField:"price_weekday_8hr"}];
function getTier(h){return TIERS.find(function(t){return t.hours===h})||TIERS[0]}
function getPrice(yacht,tier){return yacht[tier.field]||yacht[tier.wkField]||yacht.price_4hr||yacht.price_weekday_4hr||0}

var REVIEWS=[
  {name:"Alexander K.",tier:"Noir",rating:5,text:"The handover experience alone is worth it. Alfred had it ready at the dock with a full walkthrough. Sailed to the islands — unforgettable.",date:"1 week ago"},
  {name:"Marcus L.",tier:"Black",rating:5,text:"I've chartered yachts before. This was different. The concierge handled everything — captain, route suggestions, even restaurant recs.",date:"3 weeks ago"},
  {name:"David R.",tier:"Member",rating:5,text:"Booked for my birthday. Alfred surprised me with a bottle of Dom on board. Will be back for a longer charter.",date:"1 month ago"},
];

export default function YachtDetailPage(){
  var {id}=useParams();
  var [yacht,setYacht]=useState(null);
  var [loading,setLoading]=useState(true);
  var [idx,setIdx]=useState(0);
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [hours,setHours]=useState(4);
  var [pickup,setPickup]=useState("2026-03-20");
  var [returnD,setReturnD]=useState("2026-03-20");
  var [lightbox,setLightbox]=useState(false);
  var touchStartX=useRef(0);
  var touchEndX=useRef(0);

  var specsRef=useRef(null);var specsVis=useVis(specsRef);
  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var inclRef=useRef(null);var inclVis=useVis(inclRef);
  var priceRef=useRef(null);var priceVis=useVis(priceRef);
  var revRef=useRef(null);var revVis=useVis(revRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){
    supabase.from("yachts").select("*").eq("id",id).single().then(function(res){
      setYacht(res.data||null);
      setLoading(false);
    });
  },[id]);
  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);
  useEffect(function(){if(!yacht) return;var imgs=[];if(yacht.hero_image_url) imgs.push(yacht.hero_image_url);if(yacht.photos_order&&Array.isArray(yacht.photos_order)) yacht.photos_order.forEach(function(u){if(u&&u!==yacht.hero_image_url)imgs.push(u)});if(imgs.length<=1) return;var t=setInterval(function(){setIdx(function(c){return(c+1)%imgs.length})},5000);return function(){clearInterval(t)}},[yacht]);

  function pickHours(h){setHours(h)}
  function pickPickup(v){setPickup(v);setReturnD(v)}
  function pickReturn(v){setReturnD(v)}

  /* Touch/swipe handlers for carousel */
  function handleTouchStart(e){touchStartX.current=e.touches[0].clientX}
  function handleTouchMove(e){touchEndX.current=e.touches[0].clientX}
  function handleTouchEnd(imgCount){
    var diff=touchStartX.current-touchEndX.current;
    if(Math.abs(diff)>50){
      if(diff>0){setIdx(function(c){return(c+1)%imgCount})}
      else{setIdx(function(c){return c===0?imgCount-1:c-1})}
    }
  }

  if(loading){
    return(<div style={{width:"100%",minHeight:"100vh",background:"#0A0A0B",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20}}>
      <h2 style={{color:"#F4F4F5",fontFamily:"system-ui",fontSize:24}}>LOADING</h2>
    </div>);
  }
  if(!yacht){
    return(<div style={{width:"100%",minHeight:"100vh",background:"#0A0A0B",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20}}>
      <h2 style={{color:"#F4F4F5",fontFamily:"system-ui",fontSize:24}}>Yacht not found</h2>
      <a href="/catalog/yachts" style={{color:"#A1A1AA",fontFamily:"system-ui",fontSize:14}}>← Back to catalog</a>
    </div>);
  }

  /* Build images array from Supabase hero_image_url + photos_order */
  var yachtImgs = [];
  if(yacht.hero_image_url) yachtImgs.push(yacht.hero_image_url);
  if(yacht.photos_order && Array.isArray(yacht.photos_order)){
    yacht.photos_order.forEach(function(u){if(u && u !== yacht.hero_image_url) yachtImgs.push(u)});
  }
  if(yachtImgs.length===0 && yacht.imgs) yachtImgs = Array.isArray(yacht.imgs) ? yacht.imgs : [yacht.imgs];
  if(yachtImgs.length===0 && yacht.img) yachtImgs = [yacht.img];

  var YACHT = {
    name: yacht.name,
    brand: yacht.brand || "Yacht",
    body: "Yacht",
    sizeFt: yacht.size_ft,
    maxPassengers: yacht.max_passengers,
    pricePerDay: yacht.price_4hr || yacht.price_weekday_4hr,
    imgs: yachtImgs.length > 0 ? yachtImgs : [],
    rating: 5.0,
    reviews: Math.floor(Math.random() * 20) + 5,
    available: yacht.available !== false,
    isFeatured: yacht.is_featured,
    city: yacht.city,
    location: yacht.location || yacht.city || "Charter",
    features: (yacht.whats_included || ["Fuel included","Captain included","First mate","Towels & ice"]).filter(function(item){var low=item.toLowerCase();return low!=="ice box"&&low!=="gratuity"&&low!=="tax"&&low!=="cleaning fee"&&low!=="water"}).map(function(item){return item.toLowerCase()==="ice"?"Ice & Beverages":item}),
    notIncluded: (yacht.not_included || []).filter(function(item){var low=item.toLowerCase();return low!=="ice box"&&low!=="gratuity"&&low!=="tax"&&low!=="cleaning fee"&&low!=="water"}).map(function(item){return item.toLowerCase()==="ice"?"Ice & Beverages":item}),
    tags: yacht.tags || [],
    deposit: yacht.security_deposit || 0,
    description: yacht.description || "",
    paymentMethods: yacht.payment_methods || [],
    notes: yacht.notes || "",
    price4hr: yacht.price_4hr || yacht.price_weekday_4hr,
    price6hr: yacht.price_6hr || yacht.price_weekday_6hr,
    price8hr: yacht.price_8hr || yacht.price_weekday_8hr,
    priceWeekday4hr: yacht.price_weekday_4hr,
    priceWeekday6hr: yacht.price_weekday_6hr,
    priceWeekday8hr: yacht.price_weekday_8hr,
    alfredNote: "Contact Alfred for the best experience with the " + yacht.name + ". We handle boarding, captain, and everything in between.",
    alfredTip: "Book at least 48 hours in advance for guaranteed availability.",
  };

  var tier=getTier(hours);var total=getPrice(yacht,tier);

  var navOp=Math.min(scrollY/250,1);var heroY=scrollY*0.25;var heroScale=1+scrollY*0.0003;
  var inputS={padding:"14px 16px",borderRadius:14,background:C.bg,border:"1px solid "+C.bd,color:C.s1,...sf(14,500),outline:"none",width:"100%",colorScheme:"dark",WebkitAppearance:"none",appearance:"none"};
  var secDiv=<div style={{height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)",maxWidth:"100%",margin:"0 0 0"}}/>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden",maxWidth:"100vw"}}>
      <SEOHead
        title={yacht.name+" "+(yacht.city||"Miami")+" — Charter a Yacht | Alfred Concierge"}
        description={"Charter the "+yacht.name+" in "+(yacht.city||"Miami")+". "+(yacht.size_ft||"")+"ft luxury yacht, up to "+(yacht.max_passengers||"")+" guests. Captain, fuel & crew included. Book through Alfred Concierge."}
        image={yacht.hero_image_url||undefined}
        path={"/catalog/yachts/"+id}
        jsonLd={[
          {
            "@context":"https://schema.org",
            "@type":"Product",
            "name":yacht.name,
            "description":"Charter the "+yacht.name+". "+yacht.size_ft+" ft luxury yacht with full crew in "+yacht.city+". Private yacht charter for your next trip.",
            "image":yacht.hero_image_url||yacht.imgs?.[0],
            "category":"Yacht Charter"
          },
          {
            "@context":"https://schema.org",
            "@type":"BreadcrumbList",
            "itemListElement":[
              {"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},
              {"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},
              {"@type":"ListItem","position":3,"name":"Yachts","item":"https://alfredconcierge.app/catalog/yachts"},
              {"@type":"ListItem","position":4,"name":yacht.name,"item":"https://alfredconcierge.app/catalog/yachts/"+id}
            ]
          }
        ]}
      />
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
html,body{overflow-x:hidden;max-width:100vw}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.6);cursor:pointer}
.page-wrap{max-width:1200px;margin:0 auto;padding:0 clamp(16px,4vw,40px)}
.two-col{display:flex;gap:40px;align-items:flex-start}
.left-col{flex:1;min-width:0;max-width:100%}
.right-col{width:340px;flex-shrink:0;position:sticky;top:80px;overflow:hidden}
.mobile-booking{display:none}
.spec-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.detail-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.facts-g{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.rev-row{display:flex;gap:16px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:4px}
.rev-row::-webkit-scrollbar{display:none}
input[type="date"]{-webkit-appearance:none;appearance:none}
@media(max-width:900px){
  .two-col{flex-direction:column!important;gap:0!important}
  .right-col{display:none!important}
  .mobile-booking{display:block!important}
  .page-wrap{padding:0 16px!important}
  .cd-hero{height:37vh!important;min-height:220px!important;max-height:340px!important}
  .cd-name{font-size:26px!important}
  .spec-grid{grid-template-columns:repeat(3,1fr)!important;gap:6px!important}
  .detail-grid{grid-template-columns:repeat(2,1fr)!important;gap:6px!important}
  .facts-g{grid-template-columns:repeat(2,1fr)!important;gap:8px!important}
  .rev-row{gap:10px!important}
}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      {/* Nav */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"16px clamp(16px,4vw,40px)",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(10,10,11,"+Math.max(navOp*0.95,0.55)+")",backdropFilter:"blur(24px) saturate(1.3)",borderBottom:"1px solid rgba(44,44,49,"+Math.max(navOp*0.8,0.3)+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={28} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <a href="/catalog/yachts" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>← All Yachts</a>
          <div style={{...sf(12,500),color:C.s1,opacity:Math.min(navOp*2,1),transition:"opacity 0.3s"}}>{YACHT.name}</div>
        </div>
      </nav>

      {/* Fullscreen Lightbox */}
      {lightbox&&<div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.95)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={function(){setLightbox(false)}}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={function(){handleTouchEnd(YACHT.imgs.length)}}>
        <img src={YACHT.imgs[idx]} alt="" style={{maxWidth:"92vw",maxHeight:"88vh",objectFit:"contain",borderRadius:8}}/>
        <div onClick={function(e){e.stopPropagation();setLightbox(false)}} style={{position:"absolute",top:20,right:20,width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:201}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </div>
        <div onClick={function(e){e.stopPropagation();setIdx(function(c){return c===0?YACHT.imgs.length-1:c-1})}} style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div onClick={function(e){e.stopPropagation();setIdx(function(c){return(c+1)%YACHT.imgs.length})}} style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",...sf(13,500),color:"rgba(255,255,255,0.7)"}}>{idx+1} / {YACHT.imgs.length}</div>
      </div>}

      {/* Hero */}
      <section className="cd-hero" style={{height:"70vh",maxHeight:700,minHeight:450,position:"relative",overflow:"hidden"}}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={function(){handleTouchEnd(YACHT.imgs.length)}}>
        <div style={{position:"absolute",inset:0,transform:"translateY("+heroY+"px) scale("+heroScale+")"}}>
          {YACHT.imgs.length>0
            ? YACHT.imgs.map(function(img,i){return <img key={i} src={img} alt={YACHT.name} onClick={function(){setLightbox(true)}} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 60%",opacity:i===idx?1:0,transition:"opacity 0.8s ease",filter:"brightness(1.2)",cursor:"pointer"}}/>})
            : <div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#0f1923 0%,#1a2535 50%,#0d1a2a 100%)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeLinecap="round"><path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M4 18l1.7-10.2a1 1 0 01.9-.8h10.8a1 1 0 01.9.8L20 18"/><path d="M12 4v4"/></svg></div>
          }
        </div>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0.25) 0%,transparent 25%,transparent 55%,rgba(10,10,11,0.5) 80%,#0A0A0B 100%)"}}/>
        {/* Left/Right Arrows */}
        {YACHT.imgs.length>1&&<div onClick={function(){setIdx(function(c){return c===0?YACHT.imgs.length-1:c-1})}} style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,backdropFilter:"blur(8px)",transition:"background 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(0,0,0,0.5)"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>}
        {YACHT.imgs.length>1&&<div onClick={function(){setIdx(function(c){return(c+1)%YACHT.imgs.length})}} style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,backdropFilter:"blur(8px)",transition:"background 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(0,0,0,0.5)"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>}
        {/* Image counter — top right below nav */}
        {YACHT.imgs.length>1&&<div style={{position:"absolute",top:64,right:16,zIndex:10,...sf(11,500),color:"rgba(255,255,255,0.6)",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)"}}>{idx+1} / {YACHT.imgs.length}</div>}
        {/* Brand label — bottom left */}
        <div style={{position:"absolute",bottom:48,left:"clamp(16px,4vw,40px)",display:"flex",alignItems:"center",gap:8,zIndex:5}}><div style={{width:20,height:2.5,borderRadius:2,background:"rgba(255,255,255,0.5)"}}/><span style={{...sf(10,500),letterSpacing:3,color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>{YACHT.brand}</span></div>
        {/* Tags — top left below nav */}
        <div style={{position:"absolute",top:64,left:16,display:"flex",gap:6,zIndex:10,flexWrap:"wrap"}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{YACHT.body}</span>
          {YACHT.available&&<span style={{display:"flex",alignItems:"center",gap:4,...sf(9,500),color:C.gn,padding:"4px 8px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)"}}><div style={{width:5,height:5,borderRadius:"50%",background:C.gn}}/>Available</span>}
        </div>
        {YACHT.imgs.length>1&&<div style={{position:"absolute",bottom:48,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:10}}>
          {YACHT.imgs.map(function(_,i){return <div key={i} onClick={function(){setIdx(i)}} style={{width:i===idx?20:5,height:4,borderRadius:2,background:"rgba(255,255,255,"+(i===idx?"0.85":"0.2")+")",transition:"all 0.3s",cursor:"pointer"}}/>})}
        </div>}
      </section>

      {/* ═══ TWO-COLUMN LAYOUT — Title + Booking Card only ═══ */}
      <div className="page-wrap" style={{marginTop:-40,position:"relative",zIndex:10,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)"}}>
        <div className="two-col">

          {/* ═══ LEFT — Title + Alfred's Note ═══ */}
          <div className="left-col">
            {/* Title */}
            <div style={{marginBottom:40}}>
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                <span style={{...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F",border:"0.5px solid "+C.gn+"1A"}}>✦ ALFRED VERIFIED</span>
                {YACHT.isFeatured&&<span style={{...sf(9,600),letterSpacing:0.8,color:C.gold+"D9",padding:"4px 10px",borderRadius:8,background:C.gold+"0F",border:"0.5px solid "+C.gold+"1A"}}>★ FEATURED</span>}
                {YACHT.available&&<span style={{display:"flex",alignItems:"center",gap:5,...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F"}}><div style={{width:5,height:5,borderRadius:"50%",background:C.gn}}/>AVAILABLE</span>}
              </div>
              <h1 className="cd-name" style={{...sf(38,700),letterSpacing:-1.5,marginBottom:6}}>{YACHT.name}</h1>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,flexWrap:"wrap"}}>
                {YACHT.brand&&<span style={{...sf(13,500),color:C.s3}}>{YACHT.brand}</span>}
                {YACHT.brand&&<div style={{width:1,height:12,background:C.bd}}/>}
                <div style={{display:"flex",alignItems:"center",gap:5}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg><span style={{...sf(12),color:C.s5}}>{YACHT.city||YACHT.location}</span></div>
                {YACHT.maxPassengers&&<><div style={{width:1,height:12,background:C.bd}}/><span style={{...sf(12),color:C.s5}}>{YACHT.maxPassengers} passengers max</span></>}
              </div>
              {YACHT.pricePerDay&&<div style={{display:"flex",alignItems:"baseline",gap:6}}>
                <span style={{...sf(34,700),color:C.s1}}>${YACHT.pricePerDay.toLocaleString()}</span>
                <span style={{...sf(14),color:C.s6}}>starting price / 4hr</span>
              </div>}
            </div>

            {/* Alfred's Note */}
            <div ref={noteRef} style={{paddingTop:32,marginBottom:40}}>
              {secDiv}
              <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32}}>Alfred's Note</p>
              <div style={{borderRadius:24,border:"1px solid "+C.bd,background:C.el,padding:"clamp(20px,4vw,36px) clamp(16px,3vw,32px)",position:"relative",overflow:"hidden",wordBreak:"break-word"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
                <div style={{position:"absolute",bottom:20,right:24,opacity:0.025}}><Mark size={100} color={C.s1}/></div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}><Mark size={24} color={C.s5}/><span style={{...sf(11,500),color:C.s5,letterSpacing:1}}>From your concierge</span><div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px rgba(52,199,89,0.4)"}}/></div>
                <p style={{...sf(15,400),color:C.s3,lineHeight:1.8,fontStyle:"italic",marginBottom:22,position:"relative",zIndex:1}}>"{YACHT.alfredNote}"</p>
                <div style={{height:0.5,background:C.bd,marginBottom:18}}/>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{...sf(13),color:C.s6,marginTop:1}}>✨</span><span style={{...sf(13),color:C.s5,lineHeight:1.6}}>{YACHT.alfredTip}</span></div>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT — Sticky Booking Card ═══ */}
          <div className="right-col">
            <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden"}}>
              <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
              <div style={{padding:"24px 22px"}}>
                {/* Total */}
                <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{...sf(26,700),color:C.s1}}>${total.toLocaleString()}</span>
                </div>
                <div style={{...sf(11),color:C.s6,marginBottom:20}}>{hours}-hour charter</div>

                {/* Dates */}
                <div style={{display:"flex",gap:8,marginBottom:16}}>
                  <div style={{flex:1}}>
                    <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Charter Date</div>
                    <DarkDatePicker value={pickup} onChange={pickPickup} label="Charter Date"/>
                  </div>
                  <div style={{display:"flex",alignItems:"flex-end",paddingBottom:12}}><div style={{width:10,height:1,background:"rgba(244,244,245,0.08)"}}/></div>
                  <div style={{flex:1}}>
                    <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Return</div>
                    <DarkDatePicker value={returnD} onChange={pickReturn} label="Return" align="right"/>
                  </div>
                </div>

                {/* Duration pills */}
                <div style={{display:"flex",gap:4,marginBottom:18}}>
                  {[4,6,8].map(function(h){var active=hours===h;return <div key={h} onClick={function(){pickHours(h)}} style={{flex:1,textAlign:"center",padding:"8px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",transition:"all 0.2s"}}><div style={{...sf(14,active?600:400),color:active?C.s1:C.s6}}>{h}</div><div style={{...sf(9),color:active?C.s4:C.s7}}>hrs</div></div>})}
                </div>

                {/* Book */}
                <a onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm interested in chartering the "+YACHT.name+". Could you let me know about availability and pricing?"),"_blank")}} style={{textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                  Book Now
                </a>

                {/* Sub-info */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:14}}>
                  {["Captain included","Fuel included","24/7 support"].map(function(t,i){return <span key={i} style={{...sf(10),color:C.s6}}>{t}</span>})}
                </div>
              </div>
            </div>

            {/* Availability note */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderRadius:14,background:C.gn+"08",border:"0.5px solid "+C.gn+"1A",marginTop:12}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px "+C.gn+"66",flexShrink:0}}/>
              <div>
                <div style={{...sf(12,600),color:C.s1}}>Available now</div>
                <div style={{...sf(11),color:C.gn+"CC",marginTop:1}}>Next available: Tomorrow</div>
              </div>
            </div>

            {/* WhatsApp quick */}
            <a onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm interested in chartering the "+YACHT.name+". Could you let me know about availability and pricing?"),"_blank")}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px 0",borderRadius:14,border:"1px solid "+C.bd,marginTop:10,cursor:"pointer",textDecoration:"none",...sf(12,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              Ask about this yacht
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Booking Card — shown only on small screens */}
      <div className="mobile-booking page-wrap" style={{marginBottom:32}}>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden"}}>
          <div style={{padding:"20px 18px"}}>
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:4}}>
              <span style={{...sf(24,700),color:C.s1}}>${total.toLocaleString()}</span>
            </div>
            <div style={{...sf(11),color:C.s6,marginBottom:16}}>{hours}-hour charter</div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <div style={{flex:1}}>
                <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Charter Date</div>
                <DarkDatePicker value={pickup} onChange={pickPickup} label="Charter Date"/>
              </div>
              <div style={{flex:1}}>
                <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Return</div>
                <DarkDatePicker value={returnD} onChange={pickReturn} label="Return" align="right"/>
              </div>
            </div>
            <div style={{display:"flex",gap:4,marginBottom:16}}>
              {[4,6,8].map(function(h){var active=hours===h;return <div key={h} onClick={function(){pickHours(h)}} style={{flex:1,textAlign:"center",padding:"8px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer"}}><div style={{...sf(14,active?600:400),color:active?C.s1:C.s6}}>{h}</div><div style={{...sf(9),color:active?C.s4:C.s7}}>hrs</div></div>})}
            </div>
            <a onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm interested in chartering the "+YACHT.name+". Could you let me know about availability and pricing?"),"_blank")}} style={{textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg}}>Book Now</a>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:12}}>
              {["Captain included","Fuel included","24/7 support"].map(function(t,i){return <span key={i} style={{...sf(10),color:C.s6}}>{t}</span>})}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FULL-WIDTH SECTIONS (like DiningDetailPage) ═══ */}

      {/* Specifications */}
      <div ref={specsRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32}}>Specifications</p>
        <div className="spec-grid" style={{marginBottom:14}}>
          {[{emoji:"📏",value:YACHT.sizeFt?YACHT.sizeFt+" ft":"—",label:"Length"},{emoji:"👥",value:YACHT.maxPassengers||"—",label:"Max Guests"},{emoji:"⚓",value:YACHT.brand,label:"Brand"}].map(function(s,i){
            return(<div key={i} style={{padding:"18px 10px",borderRadius:16,background:C.el,border:"1px solid "+C.bd,textAlign:"center",transition:"border-color 0.3s",overflow:"hidden"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}><div style={{fontSize:18,marginBottom:8}}>{s.emoji}</div><div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:2}}><span style={{...sf(24,700),color:C.s1}}>{s.value}</span></div><div style={{...sf(9,500),color:C.s5,letterSpacing:0.5,textTransform:"uppercase",marginTop:5}}>{s.label}</div></div>);
          })}
        </div>
        <div className="detail-grid">
          {[{l:"Location",v:YACHT.city||YACHT.location},{l:"Max Passengers",v:YACHT.maxPassengers?YACHT.maxPassengers+" people":null},{l:"Vessel Type",v:YACHT.body}].filter(function(d){return d.v}).map(function(d,i){
            return(<div key={i} style={{padding:"12px 14px",borderRadius:12,background:C.el,border:"1px solid "+C.bd,overflow:"hidden"}}><div style={{...sf(9,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",marginBottom:4}}>{d.l}</div><div style={{...sf(13,500),color:C.s1,wordBreak:"break-word"}}>{d.v}</div></div>);
          })}
        </div>
      </div>

      {/* Description */}
      {YACHT.description&&<div className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(15,400),color:C.s4,lineHeight:1.8,marginTop:32}}>{YACHT.description}</p>
      </div>}

      {/* Pricing Table */}
      <div ref={priceRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32}}>Pricing</p>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"0 20px"}}>
          {[
            {label:"4 hr",price:YACHT.price4hr},
            {label:"6 hr",price:YACHT.price6hr},
            {label:"8 hr",price:YACHT.price8hr},
          ].map(function(row,i){
            return(<div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 4px",borderBottom:i<2?"1px solid "+C.bd:"none"}}>
              <span style={{...sf(13,500),color:C.s5}}>{row.label}</span>
              {row.price?<span style={{...sf(16,600),color:C.s1}}>${row.price.toLocaleString()}</span>:<span style={{...sf(13),color:C.s6}}>On demand</span>}
            </div>);
          })}
        </div>
        {YACHT.deposit>0&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",borderRadius:16,background:"rgba(244,244,245,0.03)",border:"1px solid "+C.bd,marginTop:12}}>
          <div><div style={{...sf(13,500),color:C.s1}}>Security deposit</div><div style={{...sf(11),color:C.s6}}>Pre-authorised · fully refundable</div></div>
          <div style={{...sf(20,700),color:C.s1}}>${YACHT.deposit.toLocaleString()}</div>
        </div>}
        <a onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm interested in chartering the "+YACHT.name+". Could you let me know about availability and pricing?"),"_blank")}} style={{display:"flex",alignItems:"center",gap:14,padding:"16px clamp(14px,3vw,22px)",borderRadius:20,background:"rgba(244,244,245,0.03)",border:"1px solid "+C.bd,cursor:"pointer",marginTop:12,textDecoration:"none",transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
          <span style={{...sf(20),color:C.s4}}>✦</span>
          <div style={{flex:1}}><div style={{...sf(14,500),color:C.s1,marginBottom:3}}>Questions about this yacht?</div><div style={{...sf(12),color:C.s6}}>Chat with your Alfred concierge</div></div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s7} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </a>
      </div>

      {/* What's Included */}
      {YACHT.features.length>0&&<div ref={inclRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32}}>What's Included</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {YACHT.features.map(function(item,i){return(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px",borderRadius:12,background:C.srf,border:"0.5px solid "+C.bd}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:C.gn+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke={C.gn} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{...sf(13,400),color:C.s3,lineHeight:1.5}}>{item}</span>
            </div>
          )})}
        </div>
      </div>}

      {/* Not Included */}
      {YACHT.notIncluded.length>0&&<div className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32}}>Not Included</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {YACHT.notIncluded.map(function(item,i){return(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 14px",borderRadius:12,background:C.srf,border:"0.5px solid "+C.bd}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:C.red+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={C.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{...sf(13,400),color:C.s4,lineHeight:1.5}}>{item}</span>
            </div>
          )})}
        </div>
      </div>}


      {/* Notes */}
      {YACHT.notes&&<div className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32}}>Notes</p>
        <div style={{padding:"16px 18px",borderRadius:14,background:C.el,border:"1px solid "+C.bd,borderLeft:"3px solid "+C.s7}}>
          <p style={{...sf(14,400),color:C.s4,lineHeight:1.7}}>{YACHT.notes}</p>
        </div>
      </div>}

      {/* Reviews */}
      <div ref={revRef} className="page-wrap" style={{paddingTop:60,marginBottom:60}}>
        {secDiv}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:32,marginBottom:20}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase"}}>From Members</p>
          <span style={{...sf(12),color:C.s6}}>{YACHT.reviews} reviews</span>
        </div>
        <div className="rev-row">
          {REVIEWS.map(function(r,i){var isTop=r.tier==="Noir"||r.tier==="Black";return(<div key={i} style={{width:320,minWidth:280,flexShrink:0,borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"22px 20px",transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:C.srf,border:"0.5px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{...sf(14,300),color:C.s5}}>{r.name.charAt(0)}</span></div>
              <div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{...sf(12,600),color:C.s1}}>{r.name}</span><span style={{...sf(8,600),letterSpacing:0.8,color:isTop?C.s3:C.s5,padding:"2px 7px",borderRadius:6,background:isTop?"rgba(244,244,245,0.06)":C.srf,border:"0.5px solid "+(isTop?"rgba(244,244,245,0.1)":C.bd),textTransform:"uppercase"}}>{r.tier}</span></div>
              <div style={{display:"flex",alignItems:"center",gap:2,marginTop:3}}>{Array.from({length:r.rating}).map(function(_,si){return <svg key={si} width="8" height="8" viewBox="0 0 24 24" fill={C.gold}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>})}<span style={{...sf(9),color:C.s6,marginLeft:4}}>{r.date}</span></div></div>
            </div>
            <p style={{...sf(12),color:C.s4,lineHeight:1.7,fontStyle:"italic"}}>"{r.text}"</p>
          </div>)})}
        </div>
      </div>

      {/* Bottom CTA — full width */}
      <section ref={ctaRef} style={{padding:"120px 0 100px",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"}}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20}}>Reserve</p>
          <h2 style={{...sf(44,600),letterSpacing:-1.5,lineHeight:1.1}}>Ready to charter<br/>the {YACHT.name}?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginTop:16,marginBottom:36}}>Tell Alfred your dates and we'll arrange everything. Captain, crew, and open water.</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 36px",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Book Now — ${total.toLocaleString()}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg></div>
          <p style={{...sf(12),color:C.s6,marginTop:20}}>Captain included · Fuel included · 24/7 concierge</p>
        </div>
      </section>

      <footer style={{borderTop:"1px solid "+C.bd,padding:"36px clamp(16px,4vw,40px)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s7}/><span style={{...sf(10),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Alfred ©2026</span></div>
        <div style={{display:"flex",gap:20}}>
          <a href="/" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Home</a>
          <a href="/catalog/yachts" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Yachts</a>
          <a href="/catalog" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Catalog</a>
        </div>
      </footer>
    </div>
  );
}
