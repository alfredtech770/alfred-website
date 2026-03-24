import { useState, useEffect, useRef } from "react";
import DarkDatePicker from "../components/DarkDatePicker";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

var JETS=[
  {name:"Bombardier Global 7500",type:"Ultra Long Range",pax:19,range:"14,260 km",speed:"Mach 0.925",from:"$25,000/hr",img:"https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&h=400&fit=crop&q=80",tagline:"Flagship. Four living spaces. Permanent stateroom.",slug:"global-7500",available:true,cabin:"6'2\" tall · 54 ft long",crew:"2 pilots + 1 attendant"},
  {name:"Bombardier Global 6000",type:"Long Range",pax:17,range:"11,112 km",speed:"Mach 0.89",from:"$20,000/hr",img:"https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=600&h=400&fit=crop&q=80",tagline:"Intercontinental workhorse. Three cabin zones.",slug:"global-6000",available:true,cabin:"6'1\" tall · 48 ft long",crew:"2 pilots + 1 attendant"},
  {name:"Bombardier Global 5000",type:"Long Range",pax:16,range:"9,630 km",speed:"Mach 0.89",from:"$18,000/hr",img:"https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=600&h=400&fit=crop&q=80",tagline:"Transatlantic range. Wide-body comfort.",slug:"global-5000",available:true,cabin:"6'1\" tall · 42 ft long",crew:"2 pilots + 1 attendant"},
  {name:"Bombardier Challenger 850",type:"Large Cabin",pax:14,range:"5,230 km",speed:"Mach 0.85",from:"$16,000/hr",img:"https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&h=400&fit=crop&q=80",tagline:"Widest cabin in class. Conference to bedroom.",slug:"challenger-850",available:true,cabin:"6'1\" tall · 48 ft long",crew:"2 pilots + 1 attendant"},
  {name:"Bombardier Challenger 605",type:"Large Cabin",pax:12,range:"7,408 km",speed:"Mach 0.82",from:"$15,000/hr",img:"https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=600&h=400&fit=crop&q=80",tagline:"Flat floor. Coast-to-coast with margin.",slug:"challenger-605",available:true,cabin:"6'1\" tall · 28 ft long",crew:"2 pilots + 1 attendant"},
  {name:"Bombardier Challenger 350",type:"Super Midsize",pax:10,range:"5,926 km",speed:"Mach 0.83",from:"$15,000/hr",img:"https://images.unsplash.com/photo-1559589688-6ba6beafe1e9?w=600&h=400&fit=crop&q=80",tagline:"Best-in-class super midsize. Standing cabin.",slug:"challenger-350",available:true,cabin:"6'0\" tall · 25 ft long",crew:"2 pilots"},
  {name:"Dassault Falcon 7X",type:"Long Range",pax:16,range:"11,019 km",speed:"Mach 0.90",from:"$18,500/hr",img:"https://images.unsplash.com/photo-1583396082781-aa44e665ee8f?w=600&h=400&fit=crop&q=80",tagline:"Trijet. Whisper-quiet. Short-field capable.",slug:"falcon-7x",available:true,cabin:"6'2\" tall · 39 ft long",crew:"2 pilots + 1 attendant"},
  {name:"Gulfstream G450",type:"Large Cabin",pax:16,range:"8,061 km",speed:"Mach 0.88",from:"$14,000/hr",img:"https://images.unsplash.com/photo-1529832393073-e362750f78b3?w=600&h=400&fit=crop&q=80",tagline:"Iconic Gulfstream. PlaneView cockpit.",slug:"g450",available:true,cabin:"6'2\" tall · 45 ft long",crew:"2 pilots + 1 attendant"},
  {name:"Cessna Citation XLS+",type:"Light Jet",pax:8,range:"3,441 km",speed:"Mach 0.75",from:"$8,500/hr",img:"https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&h=400&fit=crop&q=80",tagline:"Efficient city-hopper. Short runway performer.",slug:"citation-xls",available:true,cabin:"5'8\" tall · 18 ft long",crew:"2 pilots"},
  {name:"Embraer Lineage 1000E",type:"VIP Airliner",pax:19,range:"8,519 km",speed:"Mach 0.82",from:"$22,000/hr",img:"https://images.unsplash.com/photo-1557862921-37829c790f19?w=600&h=400&fit=crop&q=80",tagline:"Five distinct cabin zones. Master suite.",slug:"lineage-1000e",available:false,cabin:"6'7\" tall · 80 ft long",crew:"2 pilots + 2 attendants"},
];

var SORT_OPTIONS=["Featured","Price: Low","Price: High","Range","Passengers"];

function FilterDrop(p){
  var [open,setOpen]=useState(false);
  var ref=useRef(null);
  useEffect(function(){function h(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("mousedown",h);return function(){document.removeEventListener("mousedown",h)}},[]);
  var hasActive=p.value!==p.options[0];
  return(
    <div ref={ref} style={{position:"relative",flexShrink:0}}>
      <div onClick={function(){setOpen(!open)}} style={{display:"flex",alignItems:"center",gap:6,padding:"12px 16px",borderRadius:12,background:hasActive?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(hasActive?"rgba(244,244,245,0.15)":open?C.s7:C.bd),cursor:"pointer",transition:"all 0.3s",whiteSpace:"nowrap"}} onMouseEnter={function(e){if(!open)e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){if(!open&&!hasActive)e.currentTarget.style.borderColor=C.bd}}>
        {p.icon}
        <span style={{...sf(11,hasActive?600:400),color:hasActive?C.s1:C.s5}}>{p.value}</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2.5" strokeLinecap="round" style={{marginLeft:2}}><path d="M6 9l6 6 6-6"/></svg>
      </div>
      {open&&<div style={{position:"absolute",top:"100%",left:0,marginTop:6,borderRadius:14,background:C.el,border:"1px solid "+C.bd,overflow:"hidden",zIndex:60,minWidth:170,boxShadow:"0 16px 48px rgba(0,0,0,0.6)"}}>
        {p.options.map(function(opt){var active=p.value===opt;return <div key={opt} onClick={function(){p.onChange(opt);setOpen(false)}} style={{padding:"11px 16px",cursor:"pointer",background:active?"rgba(244,244,245,0.04)":"transparent",borderBottom:"1px solid rgba(44,44,49,0.5)",display:"flex",alignItems:"center",gap:8,...sf(13,active?600:400),color:active?C.s1:C.s4,transition:"background 0.15s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(244,244,245,0.06)"}} onMouseLeave={function(e){e.currentTarget.style.background=active?"rgba(244,244,245,0.04)":"transparent"}}>{active&&<div style={{width:4,height:4,borderRadius:"50%",background:C.gn}}/>}{opt}</div>})}
      </div>}
    </div>
  );
}

function JetCard(p){
  var [hover,setHover]=useState(false);
  var j=p.j;
  return(
    <div onClick={function(){if(j.available)window.location.href="/catalog/jets/"+j.slug}} style={{borderRadius:24,background:C.el,border:"1px solid "+(hover?C.s7:C.bd),overflow:"hidden",cursor:j.available?"pointer":"default",transform:hover&&j.available?"translateY(-6px)":"translateY(0)",boxShadow:hover&&j.available?"0 20px 60px rgba(0,0,0,0.4)":"0 4px 20px rgba(0,0,0,0.15)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",opacity:p.vis?1:0,animation:p.vis?"fadeIn 0.6s ease "+(0.1+p.i*0.08)+"s both":"none"}} onMouseEnter={function(){setHover(true)}} onMouseLeave={function(){setHover(false)}}>
      <div style={{height:200,position:"relative",overflow:"hidden"}}>
        <img src={j.img} alt={j.name} style={{width:"100%",height:"100%",objectFit:"cover",transform:hover?"scale(1.05)":"scale(1)",transition:"transform 0.6s ease",filter:j.available?"none":"brightness(0.4)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 30%,rgba(10,10,11,0.85) 100%)"}}/>
        <div style={{position:"absolute",top:16,left:16}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{j.type}</span>
        </div>
        <div style={{position:"absolute",top:16,right:16}}>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:j.available?C.gn:"#FF453A"}}/>
            <span style={{...sf(9,500),color:j.available?C.gn:"#FF453A"}}>{j.available?"Available":"On Request"}</span>
          </div>
        </div>
        <div style={{position:"absolute",bottom:14,left:16}}>
          <span style={{...sf(9,500),color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase"}}>{j.pax} passengers · {j.speed}</span>
        </div>
      </div>
      <div style={{padding:"18px 20px 22px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
          <div style={{flex:1,minWidth:0}}>
            <h3 style={{...sf(20,600),color:C.s1,marginBottom:4}}>{j.name}</h3>
            <p style={{...sf(12),color:C.s5,marginBottom:8}}>{j.tagline}</p>
          </div>
          <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
            <div style={{...sf(16,700),color:C.s1}}>{j.from}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          {[{v:j.range,icon:"🌍"},{v:j.pax+" pax",icon:"👥"},{v:j.cabin.split(" · ")[0],icon:"📐"}].map(function(s,si){
            return(<div key={si} style={{flex:1,padding:"8px 0",borderRadius:10,background:C.srf,border:"0.5px solid "+C.bd,textAlign:"center"}}><div style={{fontSize:11,marginBottom:2}}>{s.icon}</div><div style={{...sf(10,500),color:C.s4}}>{s.v}</div></div>);
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 0",borderRadius:12,background:hover&&j.available?C.s1:"transparent",border:"1px solid "+(hover&&j.available?C.s1:C.bd),...sf(12,600),color:hover&&j.available?C.bg:C.s4,transition:"all 0.4s"}}>
          {j.available?"Request Quote":"Enquire"}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>
        </div>
      </div>
    </div>
  );
}

export default function JetsPage(){
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [type,setType]=useState("Class");
  var [pax,setPax]=useState("Passengers");
  var [rangeF,setRangeF]=useState("Range");
  var [sort,setSort]=useState("Featured");
  var [from,setFrom]=useState("Miami (MIA)");
  var [to,setTo]=useState("Paris (CDG)");
  var [date,setDate]=useState("2026-03-25");
  var [tripType,setTripType]=useState("One Way");

  var gridRef=useRef(null);var gridVis=useVis(gridRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);

  var navOp=Math.min(scrollY/250,1);var heroY=scrollY*0.25;

  var filtered=JETS.filter(function(j){
    if(type!=="Class"&&j.type!==type)return false;
    if(pax==="1-8"&&j.pax>8)return false;
    if(pax==="9-16"&&(j.pax<9||j.pax>16))return false;
    if(pax==="17+"&&j.pax<17)return false;
    if(rangeF==="Under 5,000 km"&&parseInt(j.range.replace(/,/g,""))>=5000)return false;
    if(rangeF==="5,000-10,000 km"){var r=parseInt(j.range.replace(/,/g,""));if(r<5000||r>10000)return false}
    if(rangeF==="10,000+ km"&&parseInt(j.range.replace(/,/g,""))<10000)return false;
    return true;
  });
  if(sort==="Price: Low")filtered=filtered.slice().sort(function(a,b){return parseInt(a.from.replace(/[^0-9]/g,""))-parseInt(b.from.replace(/[^0-9]/g,""))});
  else if(sort==="Price: High")filtered=filtered.slice().sort(function(a,b){return parseInt(b.from.replace(/[^0-9]/g,""))-parseInt(a.from.replace(/[^0-9]/g,""))});
  else if(sort==="Range")filtered=filtered.slice().sort(function(a,b){return parseInt(b.range.replace(/,/g,""))-parseInt(a.range.replace(/,/g,""))});
  else if(sort==="Passengers")filtered=filtered.slice().sort(function(a,b){return b.pax-a.pax});

  var activeFilters=[type!=="Class"?type:null,pax!=="Passengers"?pax:null,rangeF!=="Range"?rangeF:null].filter(Boolean);
  var clearAll=function(){setType("Class");setPax("Passengers");setRangeF("Range")};

  var iconClass=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
  var iconPax=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
  var iconRange=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.6);cursor:pointer}
.j-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1060px;margin:0 auto;padding:0 40px}
.search-bar{display:grid;grid-template-columns:1fr auto 1fr 1fr auto;gap:12px;align-items:end}
.filter-row{display:flex;gap:6px;align-items:center;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;flex:1;min-width:0}
.filter-row::-webkit-scrollbar{display:none}
@media(max-width:1024px){.j-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.j-grid{grid-template-columns:1fr;padding:0 24px!important;max-width:480px}.j-hero{height:340px!important}.j-title{font-size:36px!important}.search-bar{grid-template-columns:1fr 1fr!important}}
@media(max-width:390px){.j-hero{height:280px!important}.j-title{font-size:28px!important}.search-bar{grid-template-columns:1fr!important}}
      `}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <a href="/catalog" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Catalog</a>
          <div style={{...sf(12,500),color:C.s1,opacity:Math.min(navOp*2,1),transition:"opacity 0.3s"}}>Jets</div>
        </div>
      </nav>

      <div style={{paddingTop:100,paddingBottom:40,textAlign:"center",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1)"}}>
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:16}}>Alfred Concierge</p>
        <h1 className="j-title" style={{...sf(48,700),letterSpacing:-2,lineHeight:1.06,marginBottom:12}}>Private Jets</h1>
        <p style={{...sf(16,400),color:C.s5}}>Charter flights — light jets to VIP airliners.</p>
      </div>

      {/* Search Bar */}
      <div style={{maxWidth:1060,margin:"0 auto",padding:"0 40px",position:"relative",zIndex:10}}>
        <div style={{borderRadius:24,background:C.el,border:"1px solid "+C.bd,padding:"24px 28px"}}>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)",marginTop:-24,marginLeft:-28,marginRight:-28,marginBottom:20}}/>
          <div className="search-bar">
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>From</label>
              <FilterDrop value={from} options={["Miami (MIA)","Paris (CDG)","Paris (LBG)","New York (TEB)","London (LTN)","Dubai (DWC)"]} onChange={setFrom} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>}/>
            </div>
            {/* Swap */}
            <div style={{display:"flex",alignItems:"flex-end",paddingBottom:4}}>
              <div onClick={function(){var t=from;setFrom(to);setTo(t)}} style={{width:36,height:36,borderRadius:"50%",background:C.srf,border:"1px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
              </div>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>To</label>
              <FilterDrop value={to} options={["Paris (CDG)","Paris (LBG)","Miami (MIA)","New York (TEB)","London (LTN)","Dubai (DWC)","Ibiza (IBZ)","Nice (NCE)"]} onChange={setTo} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Date</label>
              <DarkDatePicker value={date} onChange={function(v){setDate(v)}} label="Date"/>
            </div>
            <div style={{display:"flex",alignItems:"flex-end"}}>
              <div style={{padding:"12px 24px",borderRadius:12,background:C.s1,cursor:"pointer",...sf(13,600),color:C.bg,transition:"transform 0.3s",whiteSpace:"nowrap"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-1px)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)"}}>Search</div>
            </div>
          </div>
          {/* Trip type */}
          <div style={{display:"flex",gap:8,marginTop:14}}>
            {["One Way","Round Trip","Multi-Leg"].map(function(t){var active=tripType===t;return <div key={t} onClick={function(){setTripType(t)}} style={{padding:"6px 16px",borderRadius:8,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(11,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{t}</div>})}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{maxWidth:1060,margin:"0 auto",padding:"28px 40px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:24}}>
          <div className="filter-row">
            <FilterDrop value={type} options={["Class","Ultra Long Range","Long Range","Large Cabin","Super Midsize","Light Jet","VIP Airliner"]} onChange={setType} icon={iconClass}/>
            <FilterDrop value={pax} options={["Passengers","1-8","9-16","17+"]} onChange={setPax} icon={iconPax}/>
            <FilterDrop value={rangeF} options={["Range","Under 5,000 km","5,000-10,000 km","10,000+ km"]} onChange={setRangeF} icon={iconRange}/>
            <div style={{width:1,height:20,background:C.bd,flexShrink:0}}/>
            <FilterDrop value={sort} options={SORT_OPTIONS} onChange={setSort} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M6 12h12M9 18h6"/></svg>}/>
          </div>
          <span style={{...sf(12),color:C.s6,flexShrink:0,marginLeft:8}}>{filtered.length} aircraft{filtered.length!==1?"s":""}</span>
        </div>
        {activeFilters.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:24}}>
          {activeFilters.map(function(f){return <span key={f} style={{...sf(11,500),color:C.s1,padding:"5px 12px",borderRadius:8,background:"rgba(244,244,245,0.06)",border:"1px solid rgba(244,244,245,0.1)"}}>{f}</span>})}
          {activeFilters.length>1&&<span onClick={clearAll} style={{...sf(11,500),color:C.s5,padding:"5px 12px",borderRadius:8,cursor:"pointer",transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Clear all</span>}
        </div>}
      </div>

      <div ref={gridRef} className="j-grid" style={{paddingBottom:80}}>
        {filtered.length===0?(
          <div style={{gridColumn:"1 / -1",textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:40,marginBottom:16}}>✈️</div>
            <h3 style={{...sf(20,600),color:C.s3,marginBottom:8}}>No aircraft match</h3>
            <p style={{...sf(14),color:C.s5,marginBottom:24}}>Try adjusting your filters.</p>
            <div onClick={clearAll} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"12px 24px",borderRadius:12,border:"1px solid "+C.bd,cursor:"pointer",...sf(13,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>Clear all filters</div>
          </div>
        ):filtered.map(function(j,i){return <JetCard key={j.name} j={j} i={i} vis={gridVis}/>})}
      </div>

      <section ref={ctaRef} style={{padding:"100px 0 120px",position:"relative"}}><div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"}}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Concierge</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:16,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Need a custom<br/>flight plan?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Multi-leg itineraries, cargo flights, empty legs, last-minute charters — Alfred arranges it all.</p>
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
