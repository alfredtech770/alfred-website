import { useState, useEffect, useRef } from "react";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gold:"#FFD60A"};

function Mark(p){
  var sw=Math.max(p.size*0.06,1.5);
  return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>);
}

function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

var ECARS=[
  {name:"Bugatti Chiron",brand:"Bugatti",price:8500,hp:1500,accel:"2.4s",top:"420",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/_%20(78).jpeg",locs:["Miami"],available:true,body:"Coupe",seats:2,trans:"Auto",drive:"AWD"},
  {name:"Lamborghini Huracán Spyder",brand:"Lamborghini",price:3500,hp:640,accel:"2.9s",top:"325",img:"https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&h=400&fit=crop&q=80",locs:["Miami","Dubai"],available:true,body:"Convertible",seats:2,trans:"Auto",drive:"AWD"},
  {name:"Ferrari SF90 Stradale",brand:"Ferrari",price:3200,hp:986,accel:"2.5s",top:"340",img:"https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600&h=400&fit=crop&q=80",locs:["Miami","Paris"],available:true,body:"Coupe",seats:2,trans:"Auto",drive:"AWD"},
  {name:"Rolls-Royce Cullinan",brand:"Rolls-Royce",price:2800,hp:563,accel:"5.2s",top:"250",img:"https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600&h=400&fit=crop&q=80",locs:["Miami","Paris","Dubai"],available:true,body:"SUV",seats:5,trans:"Auto",drive:"AWD"},
  {name:"McLaren 750S Spider",brand:"McLaren",price:2700,hp:750,accel:"2.8s",top:"332",img:"https://images.unsplash.com/photo-1621993202323-eb4e3ba02862?w=600&h=400&fit=crop&q=80",locs:["Miami"],available:true,body:"Convertible",seats:2,trans:"Auto",drive:"RWD"},
  {name:"Porsche 911 GT3 RS",brand:"Porsche",price:1800,hp:518,accel:"3.2s",top:"296",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/Aston%20Martin.jpeg",locs:["Paris","Miami"],available:true,body:"Coupe",seats:2,trans:"PDK",drive:"RWD"},
  {name:"Aston Martin DBX707",brand:"Aston Martin",price:1600,hp:707,accel:"3.3s",top:"310",img:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop&q=80",locs:["Miami","Dubai"],available:true,body:"SUV",seats:5,trans:"Auto",drive:"AWD"},
  {name:"Mercedes-AMG GT Roadster",brand:"Mercedes",price:1200,hp:577,accel:"3.1s",top:"315",img:"https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=400&fit=crop&q=80",locs:["Paris"],available:false,body:"Convertible",seats:2,trans:"Auto",drive:"RWD"},
  {name:"Bentley Continental GTC",brand:"Bentley",price:1500,hp:659,accel:"3.5s",top:"335",img:"https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=400&fit=crop&q=80",locs:["Miami","Paris"],available:true,body:"Convertible",seats:4,trans:"Auto",drive:"AWD"},
  {name:"Range Rover SV",brand:"Land Rover",price:950,hp:530,accel:"4.4s",top:"261",img:"https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&h=400&fit=crop&q=80",locs:["Paris","Dubai"],available:true,body:"SUV",seats:5,trans:"Auto",drive:"AWD"},
  {name:"Porsche 911 Turbo S Cab",brand:"Porsche",price:1400,hp:640,accel:"2.7s",top:"330",img:"https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=400&fit=crop&q=80",locs:["Miami","Paris"],available:true,body:"Convertible",seats:4,trans:"PDK",drive:"AWD"},
  {name:"Ferrari Roma",brand:"Ferrari",price:2200,hp:620,accel:"3.4s",top:"320",img:"https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&q=80",locs:["Paris"],available:true,body:"Coupe",seats:4,trans:"Auto",drive:"RWD"},
  {name:"Lamborghini Urus",brand:"Lamborghini",price:1900,hp:666,accel:"3.3s",top:"305",img:"https://images.unsplash.com/photo-1669725942901-f03e32e63ff6?w=600&h=400&fit=crop&q=80",locs:["Miami","Dubai"],available:true,body:"SUV",seats:5,trans:"Auto",drive:"AWD"},
  {name:"Mercedes-Maybach S680",brand:"Mercedes",price:1800,hp:621,accel:"4.5s",top:"250",img:"https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=600&h=400&fit=crop&q=80",locs:["Paris","Dubai"],available:true,body:"Sedan",seats:4,trans:"Auto",drive:"AWD"},
];

var CITIES=["All Cities","Miami","Paris","Dubai"];
var SORT_OPTIONS=["Featured","Price: Low","Price: High","Most Powerful","Fastest"];

/* ═══ Dropdown component ═══ */
function FilterDrop(p){
  var [open,setOpen]=useState(false);
  var ref=useRef(null);
  useEffect(function(){function h(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("mousedown",h);return function(){document.removeEventListener("mousedown",h)}},[]);
  var hasActive=p.value!==p.options[0];
  return(
    <div ref={ref} style={{position:"relative"}}>
      <div onClick={function(){setOpen(!open)}} style={{display:"flex",alignItems:"center",gap:6,padding:"12px 16px",borderRadius:12,background:hasActive?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(hasActive?"rgba(244,244,245,0.15)":open?C.s7:C.bd),cursor:"pointer",transition:"all 0.3s",whiteSpace:"nowrap"}} onMouseEnter={function(e){if(!open)e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){if(!open&&!hasActive)e.currentTarget.style.borderColor=C.bd}}>
        {p.icon}
        <span style={{...sf(11,hasActive?600:400),color:hasActive?C.s1:C.s5}}>{p.value}</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2.5" strokeLinecap="round" style={{marginLeft:2}}><path d="M6 9l6 6 6-6"/></svg>
      </div>
      {open&&<div style={{position:"absolute",top:"100%",left:0,marginTop:6,borderRadius:14,background:C.el,border:"1px solid "+C.bd,overflow:"hidden",zIndex:60,minWidth:180,boxShadow:"0 16px 48px rgba(0,0,0,0.6)"}}>
        {p.options.map(function(opt){
          var active=p.value===opt;
          return <div key={opt} onClick={function(){p.onChange(opt);setOpen(false)}} style={{padding:"11px 16px",cursor:"pointer",background:active?"rgba(244,244,245,0.04)":"transparent",borderBottom:"1px solid rgba(44,44,49,0.5)",display:"flex",alignItems:"center",gap:8,...sf(13,active?600:400),color:active?C.s1:C.s4,transition:"background 0.15s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(244,244,245,0.06)"}} onMouseLeave={function(e){e.currentTarget.style.background=active?"rgba(244,244,245,0.04)":"transparent"}}>
            {active&&<div style={{width:4,height:4,borderRadius:"50%",background:C.gn}}/>}
            {opt}
          </div>
        })}
      </div>}
    </div>
  );
}

function CarCard(p){
  var [hover,setHover]=useState(false);
  var car=p.car;
  return(
    <div style={{borderRadius:24,background:C.el,border:"1px solid "+(hover?C.s7:C.bd),overflow:"hidden",cursor:"pointer",transform:hover?"translateY(-6px)":"translateY(0)",boxShadow:hover?"0 20px 60px rgba(0,0,0,0.4)":"0 4px 20px rgba(0,0,0,0.15)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",opacity:p.vis?1:0,animation:p.vis?"fadeIn 0.6s ease "+(0.1+p.i*0.08)+"s both":"none"}} onMouseEnter={function(){setHover(true)}} onMouseLeave={function(){setHover(false)}}>
      <div style={{height:220,position:"relative",overflow:"hidden"}}>
        <img src={car.img} alt={car.brand+" "+car.name} style={{width:"100%",height:"100%",objectFit:"cover",transform:hover?"scale(1.05)":"scale(1)",transition:"transform 0.6s ease"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(10,10,11,0.8) 100%)"}}/>
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
      <div style={{padding:"20px 22px 24px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
          <div>
            <h3 style={{...sf(20,600),color:C.s1,marginBottom:4}}>{car.name}</h3>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{...sf(12),color:C.s5}}>{car.locs.join(" · ")}</span>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{...sf(22,700),color:C.s1}}>€{car.price.toLocaleString()}</div>
            <div style={{...sf(11),color:C.s6}}>/day</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginTop:12}}>
          {[{v:car.hp+"hp",icon:"⚡"},{v:car.accel,icon:"⏱"},{v:car.seats+" seats",icon:"💺"}].map(function(s,si){
            return(
              <div key={si} style={{flex:1,padding:"10px 0",borderRadius:12,background:C.srf,border:"0.5px solid "+C.bd,textAlign:"center"}}>
                <div style={{fontSize:12,marginBottom:3}}>{s.icon}</div>
                <div style={{...sf(12,600),color:C.s1}}>{s.v}</div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:14,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"12px 0",borderRadius:12,background:hover?C.s1:"transparent",border:"1px solid "+(hover?C.s1:C.bd),...sf(13,600),color:hover?C.bg:C.s4,transition:"all 0.4s"}}>
          {car.available?"Book This Car":"Join Waitlist"}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>
        </div>
      </div>
    </div>
  );
}

export default function ExoticCarsPage(){
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [city,setCity]=useState("All Cities");
  var [bodyType,setBodyType]=useState("Type");
  var [seats,setSeats]=useState("Seats");
  var [hpRange,setHpRange]=useState("Power");
  var [priceRange,setPriceRange]=useState("Price");
  var [driveType,setDriveType]=useState("Drive");
  var [brand,setBrand]=useState("Brand");
  var [sort,setSort]=useState("Featured");
  var [pickup,setPickup]=useState("2026-03-20");
  var [returnD,setReturnD]=useState("2026-03-23");

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
    if(priceRange==="Under €1,500"&&c.price>=1500) return false;
    if(priceRange==="€1,500–€3,000"&&(c.price<1500||c.price>3000)) return false;
    if(priceRange==="€3,000+"&&c.price<3000) return false;
    return true;
  });

  if(sort==="Price: Low") filtered=filtered.slice().sort(function(a,b){return a.price-b.price});
  else if(sort==="Price: High") filtered=filtered.slice().sort(function(a,b){return b.price-a.price});
  else if(sort==="Most Powerful") filtered=filtered.slice().sort(function(a,b){return b.hp-a.hp});
  else if(sort==="Fastest") filtered=filtered.slice().sort(function(a,b){return parseFloat(a.accel)-parseFloat(b.accel)});

  var activeFilters=[city!=="All Cities"?city:null,bodyType!=="Type"?bodyType:null,seats!=="Seats"?seats:null,hpRange!=="Power"?hpRange:null,priceRange!=="Price"?priceRange:null,driveType!=="Drive"?driveType:null,brand!=="Brand"?brand:null].filter(Boolean);

  var clearAll=function(){setCity("All Cities");setBodyType("Type");setSeats("Seats");setHpRange("Power");setPriceRange("Price");setDriveType("Drive");setBrand("Brand")};

  var brands=["Brand"].concat(ECARS.map(function(c){return c.brand}).filter(function(v,i,a){return a.indexOf(v)===i}).sort());

  var inputS={padding:"12px 16px",borderRadius:12,background:C.el,border:"1px solid "+C.bd,color:C.s1,...sf(14),outline:"none",transition:"border-color 0.3s",width:"100%"};

  /* Filter icons */
  var iconBody=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>;
  var iconSeat=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
  var iconHP=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
  var iconPrice=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
  var iconDrive=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/></svg>;
  var iconBrand=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.6);cursor:pointer}
.ec-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1060px;margin:0 auto;padding:0 40px}
.search-bar{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px}
.filter-row{display:flex;gap:6px;align-items:center;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;flex:1;min-width:0}
.filter-row::-webkit-scrollbar{display:none}
@media(max-width:1024px){.ec-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){
  .ec-grid{grid-template-columns:1fr;padding:0 24px!important;max-width:480px}
  .ec-hero{height:340px!important}
  .ec-title{font-size:36px!important}
  .search-bar{grid-template-columns:1fr 1fr!important}
}
@media(max-width:390px){.ec-hero{height:280px!important}.ec-title{font-size:28px!important}.search-bar{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <a href="/catalog" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Catalog</a>
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
      <div style={{maxWidth:1060,margin:"0 auto",padding:"0 40px",position:"relative",zIndex:10}}>
        <div style={{borderRadius:24,background:C.el,border:"1px solid "+C.bd,padding:"24px 28px"}}>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)",marginTop:-24,marginLeft:-28,marginRight:-28,marginBottom:20}}/>
          <div className="search-bar">
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Location</label>
              <FilterDrop value={city} options={CITIES} onChange={setCity} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Pickup</label>
              <input type="date" value={pickup} onChange={function(e){setPickup(e.target.value)}} style={inputS}/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Return</label>
              <input type="date" value={returnD} onChange={function(e){setReturnD(e.target.value)}} style={inputS}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
              <div style={{...inputS,display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:C.gn+"0A",border:"1px solid "+C.gn+"20",marginTop:21}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span style={{...sf(14,600),color:C.gn}}>{days} day{days!==1?"s":""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FILTERS ═══ */}
      <div style={{maxWidth:1060,margin:"0 auto",padding:"28px 40px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:24}}>
          <div className="filter-row">
            <FilterDrop value={bodyType} options={["Type","Coupe","Convertible","SUV","Sedan"]} onChange={setBodyType} icon={iconBody}/>
            <FilterDrop value={seats} options={["Seats","2 Seats","4 Seats","5+ Seats"]} onChange={setSeats} icon={iconSeat}/>
            <FilterDrop value={hpRange} options={["Power","Under 600hp","600-800hp","800hp+"]} onChange={setHpRange} icon={iconHP}/>
            <FilterDrop value={priceRange} options={["Price","Under €1,500","€1,500–€3,000","€3,000+"]} onChange={setPriceRange} icon={iconPrice}/>
            <FilterDrop value={driveType} options={["Drive","AWD","RWD"]} onChange={setDriveType} icon={iconDrive}/>
            <FilterDrop value={brand} options={brands} onChange={setBrand} icon={iconBrand}/>
            <div style={{width:1,height:20,background:C.bd,flexShrink:0}}/>
            <FilterDrop value={sort} options={SORT_OPTIONS} onChange={setSort} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M6 12h12M9 18h6"/></svg>}/>
          </div>
          <span style={{...sf(12),color:C.s6,flexShrink:0,marginLeft:8}}>{filtered.length} car{filtered.length!==1?"s":""}</span>
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
            <a href="https://wa.me/33612345678" target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:14,background:C.s1,...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Ask Alfred</a>
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
