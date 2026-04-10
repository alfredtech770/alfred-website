import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import DarkDatePicker from "../components/DarkDatePicker";
import SEOHead, { SEO } from "../components/SEOHead";
import { useProposal } from "../components/ProposalContext";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gold:"#FFD60A"};

function Mark(p){
  var sw=Math.max(p.size*0.06,1.5);
  return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>);
}

function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.05});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}
function FilterDrop(p){
  var [open,setOpen]=useState(false);
  var [pos,setPos]=useState(null);
  var ref=useRef(null);
  var btnRef=useRef(null);
  var isMobile=typeof window!=="undefined"&&window.innerWidth<=768;
  useEffect(function(){
    if(!open) return;
    if(isMobile&&btnRef.current){var r=btnRef.current.getBoundingClientRect();setPos({top:r.bottom+6,left:Math.max(8,Math.min(r.left,window.innerWidth-220))})}
    var timer=setTimeout(function(){
      function h(e){if(ref.current&&!ref.current.contains(e.target)&&!(isMobile&&e.target.closest&&e.target.closest("[data-filter-drop]")))setOpen(false)}
      document.addEventListener("pointerdown",h);
      document.addEventListener("touchstart",h,{passive:true});
      ref.current._cleanup=function(){document.removeEventListener("pointerdown",h);document.removeEventListener("touchstart",h)}
    },10);
    return function(){clearTimeout(timer);if(ref.current&&ref.current._cleanup){ref.current._cleanup();ref.current._cleanup=null};setPos(null)}
  },[open]);
  var hasActive=p.value!==p.options[0];
  var dropStyle=isMobile&&pos?{position:"fixed",top:pos.top,left:pos.left,borderRadius:14,background:"#111113",border:"1px solid rgba(255,255,255,0.12)",overflowY:"auto",overflowX:"hidden",zIndex:99999,minWidth:200,maxWidth:"calc(100vw - 16px)",maxHeight:"min(320px, calc(100vh - "+(pos.top+16)+"px))",boxShadow:"0 16px 48px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)",WebkitOverflowScrolling:"touch"}:{position:"absolute",top:"100%",left:0,marginTop:6,borderRadius:14,background:"#111113",border:"1px solid rgba(255,255,255,0.12)",overflowY:"auto",overflowX:"hidden",zIndex:9999,minWidth:180,maxWidth:"min(280px, calc(100vw - 32px))",maxHeight:320,boxShadow:"0 16px 48px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)",WebkitOverflowScrolling:"touch"};
  return(
    <div ref={ref} style={{position:"relative",WebkitTapHighlightColor:"transparent"}} data-filter-drop="true">
      <div ref={btnRef} onClick={function(e){e.stopPropagation();setOpen(!open)}} style={{display:"flex",alignItems:"center",gap:6,padding:"0 16px",height:40,borderRadius:12,background:hasActive?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(hasActive?"rgba(244,244,245,0.15)":open?C.s7:C.bd),cursor:"pointer",transition:"all 0.3s",whiteSpace:"nowrap",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",touchAction:"manipulation"}} onPointerEnter={function(e){if(e.pointerType==="mouse"&&!open)e.currentTarget.style.borderColor=C.s7}} onPointerLeave={function(e){if(e.pointerType==="mouse"&&!open&&!hasActive)e.currentTarget.style.borderColor=C.bd}}>
        {p.icon}
        <span style={{...sf(11,hasActive?600:400),color:hasActive?C.s1:C.s5}}>{p.value}</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2.5" strokeLinecap="round" style={{marginLeft:2}}><path d="M6 9l6 6 6-6"/></svg>
      </div>
      {open&&<div style={dropStyle}>
        {p.options.map(function(opt){
          var active=p.value===opt;
          var soon=p.comingSoon&&p.comingSoon.indexOf(opt)!==-1;
          return <div key={opt} onClick={function(e){e.stopPropagation();if(soon)return;p.onChange(opt);setOpen(false)}} style={{padding:"13px 16px",cursor:soon?"default":"pointer",background:active?"rgba(244,244,245,0.04)":"transparent",borderBottom:"1px solid rgba(44,44,49,0.5)",display:"flex",alignItems:"center",gap:8,...sf(13,active?600:400),color:soon?"rgba(255,255,255,0.2)":active?C.s1:C.s4,WebkitTapHighlightColor:"transparent",touchAction:"manipulation",justifyContent:"space-between"}} onPointerEnter={function(e){if(e.pointerType==="mouse"&&!soon)e.currentTarget.style.background="rgba(244,244,245,0.06)"}} onPointerLeave={function(e){if(e.pointerType==="mouse")e.currentTarget.style.background=active?"rgba(244,244,245,0.04)":"transparent"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {active&&<div style={{width:4,height:4,borderRadius:"50%",background:C.gn}}/>}
              {opt}
            </div>
            {soon&&<span style={{...sf(8,600),color:"rgba(255,255,255,0.25)",letterSpacing:1,textTransform:"uppercase",padding:"2px 6px",borderRadius:4,border:"1px solid rgba(255,255,255,0.08)"}}>Soon</span>}
          </div>
        })}
      </div>}
    </div>
  );
}

function YachtCard(p){
  var [hover,setHover]=useState(false);
  var y=p.yacht;
  var price=y.price_4hr||y.price_weekday_4hr||null;
  var hasImg=!!y.hero_image_url;
  return(
    <div onClick={function(){window.location.href="/catalog/yachts/"+y.id}} style={{borderRadius:24,background:C.el,border:"1px solid "+(hover?C.s7:C.bd),overflow:"hidden",cursor:"pointer",transform:hover?"translateY(-6px)":"translateY(0)",boxShadow:hover?"0 20px 60px rgba(0,0,0,0.4)":"0 4px 20px rgba(0,0,0,0.15)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",opacity:1,animation:p.vis?"fadeIn 0.6s ease "+(0.05+p.i*0.06)+"s both":"none",touchAction:"manipulation",WebkitTapHighlightColor:"transparent"}} onPointerEnter={function(e){if(e.pointerType==="mouse")setHover(true)}} onPointerLeave={function(e){if(e.pointerType==="mouse")setHover(false)}}>
      <div style={{height:220,position:"relative",overflow:"hidden",background:hasImg?"transparent":"linear-gradient(135deg,#0f1923,#1a2535)"}}>
        {hasImg
          ? <img src={y.hero_image_url} alt={y.name} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",transform:hover?"scale(1.05)":"scale(1)",transition:"transform 0.6s ease"}}/>
          : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10}}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeLinecap="round"><path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M4 18l1.7-10.2a1 1 0 01.9-.8h10.8a1 1 0 01.9.8L20 18"/><path d="M12 4v4"/></svg>
            </div>
        }
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 30%,rgba(10,10,11,0.85) 100%)"}}/>
        <div style={{position:"absolute",top:16,left:16,display:"flex",gap:6,flexWrap:"wrap"}}>
          {y.size_ft&&<span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{y.size_ft} ft</span>}
          {y.brand&&<span style={{...sf(9,500),color:C.s5,padding:"4px 8px",borderRadius:8,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(12px)"}}>{y.brand}</span>}
        </div>
        <div style={{position:"absolute",top:16,right:16}}>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(12px)"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:y.available!==false?C.gn:"#FF453A"}}/>
            <span style={{...sf(9,500),color:y.available!==false?C.gn:"#FF453A"}}>{y.available!==false?"Available":"On Request"}</span>
          </div>
        </div>
        <div style={{position:"absolute",bottom:14,left:16,display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:16,height:2,borderRadius:1,background:"rgba(255,255,255,0.35)"}}/>
          <span style={{...sf(9,500),letterSpacing:2,color:"rgba(255,255,255,0.35)",textTransform:"uppercase"}}>{y.city||y.location||"Charter"}</span>
        </div>
      </div>

      <div style={{padding:"20px 22px 24px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
          <div style={{flex:1,minWidth:0}}>
            <h3 style={{...sf(19,600),color:C.s1,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{y.name}</h3>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{...sf(12),color:C.s5}}>{y.city||y.location||"—"}</span>
            </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
            {price
              ? <><div style={{...sf(21,700),color:C.s1}}>${price.toLocaleString()}</div><div style={{...sf(10),color:C.s6}}>from / 4hr</div></>
              : <div style={{...sf(13,500),color:C.s5}}>On demand</div>
            }
          </div>
        </div>

        {/* Stat pills */}
        <div style={{display:"flex",gap:6,marginTop:12}}>
          {[
            {v:y.size_ft?y.size_ft+" ft":"—",icon:"📏"},
            {v:y.max_passengers?y.max_passengers+" pax":"—",icon:"👥"},
            {v:y.tags&&y.tags.length>0?y.tags[0]:"Charter",icon:"⚓"}
          ].map(function(s,si){
            return(
              <div key={si} style={{flex:1,padding:"9px 0",borderRadius:12,background:C.srf,border:"0.5px solid "+C.bd,textAlign:"center"}}>
                <div style={{fontSize:11,marginBottom:3}}>{s.icon}</div>
                <div style={{...sf(11,600),color:C.s1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",padding:"0 4px"}}>{s.v}</div>
              </div>
            );
          })}
        </div>

        {/* Tags row */}
        {y.tags&&y.tags.length>0&&
          <div style={{display:"flex",gap:5,marginTop:12,flexWrap:"wrap"}}>
            {y.tags.slice(0,3).map(function(t){
              return <span key={t} style={{...sf(9,500),color:C.s5,padding:"3px 8px",borderRadius:6,background:C.srf,border:"0.5px solid "+C.bd}}>{t}</span>;
            })}
            {y.tags.length>3&&<span style={{...sf(9,400),color:C.s7,padding:"3px 8px"}}>+{y.tags.length-3}</span>}
          </div>
        }

        <div style={{marginTop:14,display:"flex",gap:8}}>
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"12px 0",borderRadius:12,background:hover?C.s1:"transparent",border:"1px solid "+(hover?C.s1:C.bd),...sf(13,600),color:hover?C.bg:C.s4,transition:"all 0.4s"}}>
            View Details
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>
          </div>
          {p.onProposal&&<div onClick={function(e){e.stopPropagation();p.onProposal(y)}} style={{width:42,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,border:"1px solid "+(p.inProposal?C.gn:C.bd),background:p.inProposal?"rgba(52,199,89,0.1)":"transparent",cursor:"pointer",transition:"all 0.3s"}} onPointerEnter={function(e){if(e.pointerType==="mouse"&&!p.inProposal)e.currentTarget.style.borderColor=C.s7}} onPointerLeave={function(e){if(e.pointerType==="mouse"&&!p.inProposal)e.currentTarget.style.borderColor=C.bd}}>
            {p.inProposal
              ?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              :<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
            }
          </div>}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard(){
  return(
    <div style={{borderRadius:24,background:C.el,border:"1px solid "+C.bd,overflow:"hidden"}}>
      <div style={{height:220,background:"linear-gradient(90deg,#18181B 25%,#1F1F23 50%,#18181B 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}}/>
      <div style={{padding:"20px 22px 24px"}}>
        <div style={{height:20,borderRadius:6,background:"linear-gradient(90deg,#18181B 25%,#1F1F23 50%,#18181B 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite",marginBottom:10}}/>
        <div style={{height:14,width:"60%",borderRadius:6,background:"linear-gradient(90deg,#18181B 25%,#1F1F23 50%,#18181B 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite",marginBottom:16}}/>
        <div style={{display:"flex",gap:6}}>
          {[0,1,2].map(function(i){return <div key={i} style={{flex:1,height:52,borderRadius:12,background:"linear-gradient(90deg,#18181B 25%,#1F1F23 50%,#18181B 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}}/>})}
        </div>
      </div>
    </div>
  );
}

export default function YachtsPage(){
  var proposal=useProposal();
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [yachts,setYachts]=useState([]);
  var [fetching,setFetching]=useState(true);
  var [error,setError]=useState(null);

  /* Filters — init from URL params */
  var [searchParams,setSearchParams]=useSearchParams();
  var [brand,setBrand]=useState(searchParams.get("brand")||"Brand");
  var [sizeRange,setSizeRange]=useState(searchParams.get("size")||"Size");
  var [priceRange,setPriceRange]=useState(searchParams.get("price")||"Price");
  var [location,setLocation]=useState(searchParams.get("location")||"Location");
  var [sort,setSort]=useState(searchParams.get("sort")||"Featured");
  var [charter,setCharter]=useState(searchParams.get("from")||"2026-03-20");
  var [returnD,setReturnD]=useState(searchParams.get("to")||"2026-03-23");
  useEffect(function(){
    var p={};
    if(location!=="Location")p.location=location;
    if(brand!=="Brand")p.brand=brand;
    if(sizeRange!=="Size")p.size=sizeRange;
    if(priceRange!=="Price")p.price=priceRange;
    if(sort!=="Featured")p.sort=sort;
    setSearchParams(p,{replace:true});
  },[location,brand,sizeRange,priceRange,sort]);
  var d1=new Date(charter);var d2=new Date(returnD);
  var days=Math.max(1,Math.round((d2-d1)/86400000));

  var gridRef=useRef(null); var gridVis=useVis(gridRef);
  var heroRef=useRef(null);

  useEffect(function(){
    setTimeout(function(){setLoaded(true)},200);
  },[]);

  useEffect(function(){
    var h=function(){setScrollY(window.scrollY)};
    window.addEventListener("scroll",h,{passive:true});
    return function(){window.removeEventListener("scroll",h)};
  },[]);

  /* Fetch yachts */
  useEffect(function(){
    async function fetch(){
      try{
        var {data,error:err}=await supabase
          .from("yachts")
          .select("id,name,brand,size_ft,max_passengers,location,city,price_4hr,price_6hr,price_8hr,price_weekday_4hr,price_weekday_6hr,price_weekday_8hr,hero_image_url,tags,available,is_featured,is_active")
          .eq("is_active",true)
          .order("is_featured",{ascending:false})
          .order("name",{ascending:true});
        if(err) throw err;
        setYachts(data||[]);
      }catch(e){
        console.error("Yachts fetch error:",e);
        setError("Could not load yachts. Please try again.");
      }finally{
        setFetching(false);
      }
    }
    fetch();
  },[]);

  var navOp=Math.min(scrollY/250,1);
  var heroY=scrollY*0.2;

  /* Dynamic filter options from data */
  var brands=["Brand"].concat([...new Set(yachts.map(function(y){return y.brand}).filter(Boolean))].sort());
  var locations=["Location","Miami","Paris","Ibiza","Monaco","New York","London"];
  var comingSoonCities=["Paris","Ibiza","Monaco","New York","London"];

  /* Filter logic */
  var filtered=yachts.filter(function(y){
    if(brand!=="Brand"&&y.brand!==brand) return false;
    if(location!=="Location"&&location==="Miami"){var yLoc=(y.city||y.location||"").toLowerCase();if(yLoc&&yLoc!=="miami")return false;}
    if(sizeRange==="Under 40 ft"&&(y.size_ft===null||y.size_ft>=40)) return false;
    if(sizeRange==="40–60 ft"&&(y.size_ft===null||y.size_ft<40||y.size_ft>60)) return false;
    if(sizeRange==="60–80 ft"&&(y.size_ft===null||y.size_ft<60||y.size_ft>80)) return false;
    if(sizeRange==="80 ft+"&&(y.size_ft===null||y.size_ft<80)) return false;
    var p4=y.price_4hr||y.price_weekday_4hr||null;
    if(priceRange==="Under $1,000"&&(p4===null||p4>=1000)) return false;
    if(priceRange==="$1,000–$3,000"&&(p4===null||p4<1000||p4>3000)) return false;
    if(priceRange==="$3,000–$6,000"&&(p4===null||p4<3000||p4>6000)) return false;
    if(priceRange==="$6,000+"&&(p4===null||p4<6000)) return false;
    return true;
  });

  if(sort==="Price: Low") filtered=filtered.slice().sort(function(a,b){return (a.price_4hr||a.price_weekday_4hr||99999)-(b.price_4hr||b.price_weekday_4hr||99999)});
  else if(sort==="Price: High") filtered=filtered.slice().sort(function(a,b){return (b.price_4hr||b.price_weekday_4hr||0)-(a.price_4hr||a.price_weekday_4hr||0)});
  else if(sort==="Largest") filtered=filtered.slice().sort(function(a,b){return (b.size_ft||0)-(a.size_ft||0)});
  else if(sort==="Most Passengers") filtered=filtered.slice().sort(function(a,b){return (b.max_passengers||0)-(a.max_passengers||0)});

  var activeFilters=[brand!=="Brand"?brand:null,sizeRange!=="Size"?sizeRange:null,priceRange!=="Price"?priceRange:null,location!=="Location"?location:null].filter(Boolean);
  var clearAll=function(){setBrand("Brand");setSizeRange("Size");setPriceRange("Price");setLocation("Location")};

  /* Icons */
  var iconBrand=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
  var iconSize=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M21 3L3 21M9 3H3v6M15 21h6v-6"/></svg>;
  var iconPrice=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
  var iconLoc=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <SEOHead {...SEO.yachts}/>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}
::selection{background:${C.s7};color:${C.s1}}
a{color:inherit;text-decoration:none}
body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.yc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1060px;margin:0 auto;padding:0 40px}
.filter-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap;flex:1;min-width:0}
.search-bar{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px}
.yc-hero{height:460px}
@media(max-width:1024px){.yc-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){
  .yc-grid{grid-template-columns:1fr;padding:0 24px!important;max-width:480px}
  .yc-hero{height:320px!important}
  .yc-title{font-size:34px!important}
  .search-bar{grid-template-columns:1fr 1fr!important}
  .filter-row{flex-wrap:nowrap!important;overflow:visible!important;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:4px}
  .filter-row::-webkit-scrollbar{display:none}
}
@media(max-width:390px){.yc-hero{height:260px!important}.yc-title{font-size:26px!important}.search-bar{grid-template-columns:1fr!important}}
      `}</style>

      {/* Film grain */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.08,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      {/* Nav */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <a href="/catalog" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Catalog</a>
          <div style={{...sf(12,500),color:C.s1,opacity:Math.min(navOp*2,1),transition:"opacity 0.3s"}}>Yachts</div>
        </div>
      </nav>

      {/* Header */}
      <div style={{paddingTop:100,paddingBottom:40,textAlign:"center",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1)"}}>
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:16}}>Alfred Concierge</p>
        <h1 className="yc-title" style={{...sf(48,700),letterSpacing:-2,lineHeight:1.06,marginBottom:12}}>Yachts</h1>
        <p style={{...sf(16,400),color:C.s5}}>Charter yachts for the day or week — crewed & ready.</p>
      </div>

      {/* Search Bar */}
      <div style={{maxWidth:1060,margin:"0 auto",padding:"0 40px",position:"relative",zIndex:60}}>
        <div style={{borderRadius:24,background:C.el,border:"1px solid "+C.bd,padding:"24px 28px"}}>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)",marginTop:-24,marginLeft:-28,marginRight:-28,marginBottom:20}}/>
          <div className="search-bar">
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Location</label>
              <FilterDrop value={location} options={locations} comingSoon={comingSoonCities} onChange={setLocation} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Charter Date</label>
              <DarkDatePicker value={charter} onChange={function(v){setCharter(v)}} label="Charter Date"/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Return</label>
              <DarkDatePicker value={returnD} onChange={function(v){setReturnD(v)}} label="Return" align="right"/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Duration</label>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"0 16px",height:40,borderRadius:12,background:C.gn+"0A",border:"1px solid "+C.gn+"20",boxSizing:"border-box"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span style={{...sf(11,600),color:C.gn}}>{days} day{days!==1?"s":""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{maxWidth:1060,margin:"0 auto",padding:"28px 40px 0",position:"relative",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:24,position:"relative",zIndex:50}}>
          <div className="filter-row">
            <FilterDrop icon={iconBrand} value={brand} options={brands} onChange={setBrand}/>
            <FilterDrop icon={iconSize} value={sizeRange} options={["Size","Under 40 ft","40–60 ft","60–80 ft","80 ft+"]} onChange={setSizeRange}/>
            <FilterDrop icon={iconPrice} value={priceRange} options={["Price","Under $1,000","$1,000–$3,000","$3,000–$6,000","$6,000+"]} onChange={setPriceRange}/>
            <FilterDrop icon={iconLoc} value={location} options={locations} comingSoon={comingSoonCities} onChange={setLocation}/>
            <div style={{width:1,height:20,background:C.bd,flexShrink:0}}/>
            <FilterDrop value={sort} options={["Featured","Price: Low","Price: High","Largest","Most Passengers"]} onChange={setSort} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M6 12h12M9 18h6"/></svg>}/>
          </div>
        </div>
        {activeFilters.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:24}}>
          {activeFilters.map(function(f){return <span key={f} style={{...sf(11,500),color:C.s1,padding:"5px 12px",borderRadius:8,background:"rgba(244,244,245,0.06)",border:"1px solid rgba(244,244,245,0.1)"}}>{f}</span>})}
          {activeFilters.length>1&&<span onClick={clearAll} style={{...sf(11,500),color:C.s5,padding:"5px 12px",borderRadius:8,cursor:"pointer",transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Clear all</span>}
        </div>}
      </div>

      {/* Grid */}
      <section ref={gridRef} style={{padding:"48px 0 120px"}}>
        {error&&
          <div style={{textAlign:"center",padding:"80px 40px"}}>
            <div style={{...sf(15),color:C.s5,marginBottom:16}}>{error}</div>
            <div onClick={function(){window.location.reload()}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:12,border:"1px solid "+C.bd,...sf(13,500),color:C.s1,cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>Retry</div>
          </div>
        }

        {!error&&fetching&&
          <div className="yc-grid">
            {[0,1,2,3,4,5].map(function(i){return <SkeletonCard key={i}/>})}
          </div>
        }

        {!error&&!fetching&&filtered.length===0&&
          <div style={{textAlign:"center",padding:"80px 40px"}}>
            <div style={{...sf(24,600),color:C.s7,marginBottom:12}}>No yachts found</div>
            <div style={{...sf(15),color:C.s6,marginBottom:24}}>Try adjusting your filters</div>
            <div onClick={clearAll} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:12,border:"1px solid "+C.bd,...sf(13,500),color:C.s1,cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>Clear filters</div>
          </div>
        }

        {!error&&!fetching&&filtered.length>0&&
          <div className="yc-grid">
            {filtered.map(function(y,i){
              return <YachtCard key={y.id} yacht={y} i={i} vis={gridVis} inProposal={proposal.isInProposal("yacht",y.id)} onProposal={function(yy){proposal.addItem({category:"yacht",id:yy.id,name:yy.name,image:yy.hero_image_url,subtitle:(yy.brand||"")+" \u2022 "+(yy.size_ft?yy.size_ft+"ft":"")+" \u2022 "+(yy.city||yy.location||"Miami"),price:yy.price_4hr||yy.price_weekday_4hr||null,priceLabel:"from / 4hr",details:(yy.max_passengers?yy.max_passengers+" passengers":"")+(yy.tags&&yy.tags.length>0?" \u2022 "+yy.tags.slice(0,2).join(", "):"")})}}/>;
            })}
          </div>
        }
      </section>

      {/* Divider */}
      <div style={{height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)",margin:"0 40px"}}/>

      {/* Footer */}
      <footer style={{padding:"40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Mark size={14} color={C.s7}/>
          <span style={{...sf(10,400),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Alfred ©2026</span>
        </div>
        <div style={{display:"flex",gap:24}}>
          <a href="/" style={{...sf(11,400),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Home</a>
          <a href="/catalog" style={{...sf(11,400),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Catalog</a>
          <a href="/catalog/exotic-cars" style={{...sf(11,400),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Cars</a>
        </div>
      </footer>
    </div>
  );
}
