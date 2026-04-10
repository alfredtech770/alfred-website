import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import DarkDatePicker from "../components/DarkDatePicker";
import SEOHead, { SEO } from "../components/SEOHead";
import ECARS from "../data/cars";


var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gold:"#FFD60A"};

function Mark(p){
  return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><path d="M42 18 C42 30 34 38 22 38 C34 38 42 46 42 58 C42 46 50 38 62 38 C50 38 42 30 42 18Z" fill={p.color||C.s1}/><path d="M58 42 C58 54 50 62 38 62 C50 62 58 70 58 82 C58 70 66 62 78 62 C66 62 58 54 58 42Z" fill={p.color||C.s1}/></svg>);
}

function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.01,rootMargin:"200px"});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

var CITIES=["All Cities","Miami","Paris","Ibiza","Monaco","New York","London"];
var COMING_SOON_CITIES=["Paris","Ibiza","Monaco","New York","London"];
var SORT_OPTIONS=["Featured","Price: Low","Price: High","Most Powerful","Fastest"];

/* ═══ Dropdown component ═══ */
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

function slugify(n){return n.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}

function carDesc(car){
  var e=car.engine||"";var h=car.hp||"";var t=car.category||"";
  if(t==="Hypercar") return h+"hp "+e+" hypercar. The pinnacle of automotive engineering, delivered to your door.";
  if(t==="Supercar") return h+"hp "+e+(car.body==="Convertible"?" open-top supercar":" supercar")+". Pure adrenaline, concierge-delivered.";
  if(t==="Grand Tourer") return e+" grand tourer. Effortless power and luxury for the open road.";
  if(t==="Luxury SUV") return e+" luxury SUV. Commanding presence with "+car.seats+" seats and all-wheel drive.";
  if(t==="Luxury Sedan") return e+" luxury sedan. Ultimate refinement and comfort.";
  if(t==="Sports") return h+"hp "+e+". Precision sports driving, Alfred-delivered.";
  return h+"hp "+(e||car.body)+". Available through Alfred Concierge.";
}

function CarCard(p){
  var [hover,setHover]=useState(false);
  var [btnHover,setBtnHover]=useState(false);
  var car=p.car;
  var carSlug=slugify(car.name);
  function goDetail(){sessionStorage.setItem("alfred_car_"+carSlug,JSON.stringify(car));window.location.href="/catalog/exotic-cars/"+carSlug}
  function goWA(e){e.stopPropagation();window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm interested in renting the "+car.name+". Could you let me know about availability and pricing?"),"_blank")}
  return(
    <div onClick={goDetail} style={{borderRadius:24,background:C.el,border:"1px solid "+(hover?C.s7:C.bd),overflow:"hidden",cursor:"pointer",transform:hover?"translateY(-6px)":"translateY(0)",boxShadow:hover?"0 20px 60px rgba(0,0,0,0.4)":"0 4px 20px rgba(0,0,0,0.15)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",opacity:1,animation:"fadeIn 0.6s ease "+(0.1+Math.min(p.i,8)*0.08)+"s both",display:"flex",flexDirection:"column",touchAction:"manipulation",WebkitTapHighlightColor:"transparent"}} onPointerEnter={function(e){if(e.pointerType==="mouse")setHover(true)}} onPointerLeave={function(e){if(e.pointerType==="mouse")setHover(false)}}>
      <div style={{height:260,position:"relative",overflow:"hidden",flexShrink:0}}>
        <img src={car.img} alt={car.brand+" "+car.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 40%",transform:hover?"scale(1.05)":"scale(1)",transition:"transform 0.6s ease",filter:"brightness(1.25)"}} loading="lazy"/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 50%,rgba(10,10,11,0.7) 100%)"}}/>
        <div style={{position:"absolute",top:16,left:16,display:"flex",gap:6}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{car.body}</span>
          <span style={{...sf(9,500),color:C.s5,padding:"4px 8px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)"}}>{car.drive}</span>
        </div>
        <div style={{position:"absolute",top:16,right:16}}>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:car.available?C.gn:"#FF453A"}}/>
            <span style={{...sf(9,500),color:car.available?C.gn:"#FF453A"}}>{car.available?"Available":"Reserved"}</span>
          </div>
        </div>
        <div style={{position:"absolute",bottom:14,left:16,display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:16,height:2,borderRadius:1,background:"rgba(255,255,255,0.4)"}}/>
          <span style={{...sf(9,500),letterSpacing:2,color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>{car.brand}</span>
        </div>
      </div>
      <div style={{padding:"20px 22px 24px",display:"flex",flexDirection:"column",flex:1}}>
        <div style={{height:56,marginBottom:4}}>
          <h3 style={{...sf(18,600),color:C.s1,marginBottom:4,lineHeight:1.25,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{car.name}</h3>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{...sf(12),color:C.s5}}>{car.locs.join(" · ")}</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:12}}>
          <div style={{...sf(24,700),color:C.s1}}>${car.price.toLocaleString()}</div>
          <div style={{...sf(12),color:C.s6}}>/day</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {[{v:car.hp+"hp",icon:"⚡"},{v:car.accel,icon:"⏱"},{v:car.seats+" seats",icon:"💺"}].map(function(s,si){
            return(
              <div key={si} style={{flex:1,padding:"10px 0",borderRadius:12,background:C.srf,border:"0.5px solid "+C.bd,textAlign:"center"}}>
                <div style={{fontSize:12,marginBottom:3}}>{s.icon}</div>
                <div style={{...sf(12,600),color:C.s1}}>{s.v}</div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:"auto",paddingTop:14}}>
          <div style={{display:"flex",gap:8}}>
            <div onClick={goWA} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"12px 0",borderRadius:12,background:btnHover?C.s1:"transparent",border:"1px solid "+(btnHover?C.s1:C.bd),cursor:"pointer",...sf(13,600),color:btnHover?C.bg:C.s4,transition:"all 0.4s",touchAction:"manipulation"}} onPointerEnter={function(e){if(e.pointerType==="mouse")setBtnHover(true)}} onPointerLeave={function(e){if(e.pointerType==="mouse")setBtnHover(false)}}>
              {car.available?"Book This Car":"Join Waitlist"}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExoticCarsPage(){
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [searchParams,setSearchParams]=useSearchParams();
  var [city,setCity]=useState(searchParams.get("city")||"All Cities");
  var [bodyType,setBodyType]=useState(searchParams.get("type")||"Type");
  var [seats,setSeats]=useState(searchParams.get("seats")||"Seats");
  var [hpRange,setHpRange]=useState(searchParams.get("power")||"Power");
  var [priceRange,setPriceRange]=useState(searchParams.get("price")||"Price");
  var [driveType,setDriveType]=useState(searchParams.get("drive")||"Drive");
  var [brand,setBrand]=useState(searchParams.get("brand")||"Brand");
  var [sort,setSort]=useState(searchParams.get("sort")||"Featured");
  var [pickup,setPickup]=useState("2026-03-20");
  var [returnD,setReturnD]=useState("2026-03-23");
  useEffect(function(){
    var p={};
    if(city!=="All Cities")p.city=city;
    if(bodyType!=="Type")p.type=bodyType;
    if(seats!=="Seats")p.seats=seats;
    if(hpRange!=="Power")p.power=hpRange;
    if(priceRange!=="Price")p.price=priceRange;
    if(driveType!=="Drive")p.drive=driveType;
    if(brand!=="Brand")p.brand=brand;
    if(sort!=="Featured")p.sort=sort;
    setSearchParams(p,{replace:true});
  },[city,bodyType,seats,hpRange,priceRange,driveType,brand,sort]);

  var gridRef=useRef(null); var gridVis=useVis(gridRef);
  var ctaRef=useRef(null); var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);

  var navOp=Math.min(scrollY/250,1);
  var heroY=scrollY*0.25;
  var ecDiv={position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"};

  var d1=new Date(pickup);var d2=new Date(returnD);
  var days=Math.max(1,Math.round((d2-d1)/86400000));

  /* Filter logic */
  var filtered=ECARS.filter(function(c){
    if(city!=="All Cities"&&c.locs.indexOf(city)===-1) return false;
    if(bodyType!=="Type"&&c.body!==bodyType) return false;
    if(brand!=="Brand"&&c.brand!==brand) return false;
    if(driveType!=="Drive"&&c.drive!==driveType) return false;
    if(seats==="2 Seats"&&c.seats!==2) return false;
    if(seats==="4 Seats"&&c.seats!==4) return false;
    if(seats==="5+ Seats"&&c.seats<5) return false;
    if(hpRange==="Under 600hp"&&c.hp>=600) return false;
    if(hpRange==="600-800hp"&&(c.hp<600||c.hp>800)) return false;
    if(hpRange==="800hp+"&&c.hp<800) return false;
    if(priceRange==="Under $1,500"&&c.price>=1500) return false;
    if(priceRange==="$1,500–$3,000"&&(c.price<1500||c.price>3000)) return false;
    if(priceRange==="$3,000+"&&c.price<3000) return false;
    return true;
  });

  if(sort==="Price: Low") filtered=filtered.slice().sort(function(a,b){return a.price-b.price});
  else if(sort==="Price: High") filtered=filtered.slice().sort(function(a,b){return b.price-a.price});
  else if(sort==="Most Powerful") filtered=filtered.slice().sort(function(a,b){return b.hp-a.hp});
  else if(sort==="Fastest") filtered=filtered.slice().sort(function(a,b){return parseFloat(a.accel)-parseFloat(b.accel)});

  var activeFilters=[city!=="All Cities"?city:null,bodyType!=="Type"?bodyType:null,seats!=="Seats"?seats:null,hpRange!=="Power"?hpRange:null,priceRange!=="Price"?priceRange:null,driveType!=="Drive"?driveType:null,brand!=="Brand"?brand:null].filter(Boolean);

  var clearAll=function(){setCity("All Cities");setBodyType("Type");setSeats("Seats");setHpRange("Power");setPriceRange("Price");setDriveType("Drive");setBrand("Brand")};

  var brands=["Brand"].concat(ECARS.map(function(c){return c.brand}).filter(function(v,i,a){return a.indexOf(v)===i}).sort());

  var inputS={padding:"0 16px",borderRadius:12,background:"transparent",border:"1px solid "+C.bd,color:C.s1,...sf(11,400),outline:"none",transition:"border-color 0.3s",width:"100%",colorScheme:"dark",height:40,boxSizing:"border-box",WebkitAppearance:"none",MozAppearance:"none",appearance:"none",minHeight:40,maxHeight:40,lineHeight:"40px"};

  /* Filter icons */
  var iconBody=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>;
  var iconSeat=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
  var iconHP=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
  var iconPrice=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
  var iconDrive=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/></svg>;
  var iconBrand=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <SEOHead {...SEO.exoticCars}/>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}
html,body{overflow-x:hidden;max-width:100vw}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
input[type="date"]{-webkit-appearance:none;appearance:none;min-height:40px!important;max-height:40px!important;height:40px!important;font-size:11px!important;line-height:40px!important;padding:0 16px!important;box-sizing:border-box!important}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.6);cursor:pointer}
input[type="date"]::-webkit-date-and-time-value{text-align:left}
input[type="date"]::-webkit-inner-spin-button,input[type="date"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.ec-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1280px;margin:0 auto;padding:0 clamp(16px,4vw,40px);align-items:stretch}
.search-bar{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px}
.filter-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap;flex:1;min-width:0}
@media(max-width:1200px){.ec-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){
  .ec-grid{grid-template-columns:1fr!important;padding:0 24px!important;max-width:480px}
  .ec-hero{height:340px!important}
  .ec-title{font-size:32px!important}
  .search-bar{grid-template-columns:1fr 1fr!important;gap:8px!important}
  .filter-row{flex-wrap:nowrap!important;overflow:visible!important;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:4px}
  .filter-row::-webkit-scrollbar{display:none}
}
@media(max-width:480px){
  .ec-title{font-size:28px!important}
  .search-bar{grid-template-columns:1fr!important}
}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"16px clamp(16px,4vw,40px)",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <a href="/catalog" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Catalog</a>
          <a href="/proposal" title="Create Client Proposal" style={{display:"flex",alignItems:"center",justifyContent:"center",width:28,height:28,borderRadius:8,border:"1px solid "+C.bd,cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.background=C.srf}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.background="transparent"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg></a>
          <div style={{...sf(12,500),color:C.s1,opacity:Math.min(navOp*2,1),transition:"opacity 0.3s"}}>Exotic Cars</div>
        </div>
      </nav>

      {/* Header */}
      <div style={{paddingTop:100,paddingBottom:40,textAlign:"center",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1)"}}>
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:16}}>Alfred Concierge</p>
        <h1 className="ec-title" style={{...sf(48,700),letterSpacing:-2,lineHeight:1.06,marginBottom:12}}>Exotic Cars</h1>
        <p style={{...sf(16,400),color:C.s5}}>Supercars, classics & chauffeurs — delivered to your door.</p>
      </div>

      {/* ═══ SEARCH BAR ═══ */}
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 clamp(16px,4vw,40px)",position:"relative",zIndex:60}}>
        <div style={{borderRadius:24,background:C.el,border:"1px solid "+C.bd,padding:"clamp(16px,3vw,24px) clamp(14px,3vw,28px)"}}>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)",marginTop:-24,marginLeft:-28,marginRight:-28,marginBottom:20}}/>
          <div className="search-bar">
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Location</label>
              <FilterDrop value={city} options={CITIES} comingSoon={COMING_SOON_CITIES} onChange={setCity} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Pickup</label>
              <DarkDatePicker value={pickup} onChange={function(v){setPickup(v)}} label="Pickup"/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Return</label>
              <DarkDatePicker value={returnD} onChange={function(v){setReturnD(v)}} label="Return" align="right"/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Duration</label>
              <div style={{...inputS,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:C.gn+"0A",border:"1px solid "+C.gn+"20"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span style={{...sf(11,600),color:C.gn}}>{days} day{days!==1?"s":""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FILTERS ═══ */}
      <div style={{maxWidth:1280,margin:"0 auto",padding:"28px clamp(16px,4vw,40px) 0",position:"relative",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:24,position:"relative",zIndex:50}}>
          <div className="filter-row">
            <FilterDrop value={brand} options={brands} onChange={setBrand} icon={iconBrand}/>
            <FilterDrop value={bodyType} options={["Type","Coupe","Convertible","SUV","Sedan","Hatchback","Van"]} onChange={setBodyType} icon={iconBody}/>
            <FilterDrop value={priceRange} options={["Price","Under $1,500","$1,500–$3,000","$3,000+"]} onChange={setPriceRange} icon={iconPrice}/>
            <FilterDrop value={seats} options={["Seats","2 Seats","4 Seats","5+ Seats"]} onChange={setSeats} icon={iconSeat}/>
            <FilterDrop value={hpRange} options={["Power","Under 600hp","600-800hp","800hp+"]} onChange={setHpRange} icon={iconHP}/>
            <FilterDrop value={driveType} options={["Drive","AWD","RWD"]} onChange={setDriveType} icon={iconDrive}/>
            <div style={{width:1,height:20,background:C.bd,flexShrink:0}}/>
            <FilterDrop value={sort} options={SORT_OPTIONS} onChange={setSort} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M6 12h12M9 18h6"/></svg>}/>
          </div>
        </div>
        {/* Active filter tags */}
        {activeFilters.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:24}}>
          {activeFilters.map(function(f){
            return <span key={f} style={{...sf(11,500),color:C.s1,padding:"5px 12px",borderRadius:8,background:"rgba(244,244,245,0.06)",border:"1px solid rgba(244,244,245,0.1)"}}>{f}</span>
          })}
          {activeFilters.length>1&&<span onClick={clearAll} style={{...sf(11,500),color:C.s5,padding:"5px 12px",borderRadius:8,cursor:"pointer",transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Clear all</span>}
        </div>}
      </div>

      {/* ═══ GRID ═══ */}
      <div ref={gridRef} className="ec-grid" style={{paddingBottom:80}}>
        {filtered.length===0?(
          <div style={{gridColumn:"1 / -1",textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:40,marginBottom:16}}>🏎️</div>
            <h3 style={{...sf(20,600),color:C.s3,marginBottom:8}}>No cars match your filters</h3>
            <p style={{...sf(14),color:C.s5,marginBottom:24}}>Try adjusting your filters or location.</p>
            <div onClick={clearAll} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"12px 24px",borderRadius:12,border:"1px solid "+C.bd,cursor:"pointer",...sf(13,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>Clear all filters</div>
          </div>
        ):filtered.map(function(car,i){
          return <CarCard key={car.name} car={car} i={i} vis={gridVis}/>;
        })}
      </div>

      {/* CTA */}
      <section ref={ctaRef} style={{padding:"100px 0 120px",position:"relative"}}><div style={ecDiv}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Concierge</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:16,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Can't find<br/>your dream car?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Tell Alfred what you're looking for. We source any car, anywhere — from Paganis to vintage Porsches.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.4s"}}>
            <div onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm looking for a specific exotic car. Could you help me source it?"),"_blank")}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:14,background:C.s1,...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Ask Alfred</div>
            <a href="/catalog" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 28px",borderRadius:14,border:"1px solid "+C.bd,...sf(14,500),color:C.s4,transition:"all 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>Back to Catalog</a>
          </div>
        </div>
      </section>

      <footer style={{borderTop:"1px solid "+C.bd,padding:"36px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><Mark size={14} color={C.s7}/><span style={{...sf(10),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Alfred ©2026</span></div>
        <div style={{display:"flex",gap:20}}>
          <a href="/" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Home</a>
          <a href="/catalog" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Catalog</a>
          <a href="/business" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Business</a>
        </div>
      </footer>
    </div>
  );
}
