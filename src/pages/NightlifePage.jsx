import { useState, useEffect, useRef } from "react";
import DarkDatePicker from "../components/DarkDatePicker";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

var VENUES=[
  {name:"LIV",type:"Nightclub",loc:"Miami",vibe:"High Energy",music:"Hip Hop · EDM",door:"Table Required",rating:4.8,reviews:94,tableMin:"$2,000+",img:"https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&h=400&fit=crop&q=80",tagline:"Miami Beach's legendary main room",slug:"liv",available:true,hours:"Thu–Sun · 11 PM – 5 AM",capacity:"1,200"},
  {name:"E11even",type:"Nightclub",loc:"Miami",vibe:"High Energy",music:"EDM · Hip Hop",door:"Guestlist",rating:4.7,reviews:78,tableMin:"$1,500+",img:"https://images.unsplash.com/photo-1571266028243-d220c6a8b0e7?w=600&h=400&fit=crop&q=80",tagline:"24/7. The club that never closes.",slug:"e11even",available:true,hours:"Open 24/7",capacity:"2,000"},
  {name:"Raspoutine",type:"Nightclub",loc:"Paris",vibe:"Exclusive",music:"Hip Hop · House",door:"Members Only",rating:4.8,reviews:52,tableMin:"€3,000+",img:"https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&h=400&fit=crop&q=80",tagline:"The Champs-Élysées institution",slug:"raspoutine",available:true,hours:"Thu–Sat · 11:30 PM – 6 AM",capacity:"400"},
  {name:"CoCo Club",type:"Lounge",loc:"Paris",vibe:"Exclusive",music:"House · Afrobeats",door:"Members Only",rating:4.7,reviews:41,tableMin:"€2,000+",img:"https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop&q=80",tagline:"Paris's most selective door",slug:"coco-club",available:true,hours:"Fri–Sat · Midnight – 6 AM",capacity:"300"},
  {name:"Story",type:"Nightclub",loc:"Miami",vibe:"High Energy",music:"EDM · Live Acts",door:"Table Required",rating:4.6,reviews:67,tableMin:"$2,500+",img:"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop&q=80",tagline:"South Beach's production powerhouse",slug:"story",available:true,hours:"Fri–Sat · 11 PM – 5 AM",capacity:"1,500"},
  {name:"L'Arc",type:"Lounge",loc:"Paris",vibe:"Sophisticated",music:"Deep House · Lounge",door:"Table Required",rating:4.7,reviews:45,tableMin:"€1,500+",img:"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=80",tagline:"Arc de Triomphe views. Private dining to dancing.",slug:"larc",available:true,hours:"Wed–Sat · 8 PM – 4 AM",capacity:"500"},
  {name:"Club Space",type:"Nightclub",loc:"Miami",vibe:"Underground",music:"Techno · House",door:"Guestlist",rating:4.5,reviews:53,tableMin:"$800+",img:"https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&h=400&fit=crop&q=80",tagline:"The terrace at sunrise. Nothing else compares.",slug:"club-space",available:true,hours:"Sat–Sun · 11 PM – Noon",capacity:"3,000"},
  {name:"Castel",type:"Members Club",loc:"Paris",vibe:"Exclusive",music:"Eclectic · Jazz",door:"Members Only",rating:4.8,reviews:36,tableMin:"€2,500+",img:"https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop&q=80",tagline:"Since 1962. Paris's original private club.",slug:"castel",available:false,hours:"Tue–Sat · 8 PM – 5 AM",capacity:"250"},
  {name:"Hyde Beach",type:"Day Club",loc:"Miami",vibe:"Pool Party",music:"House · Pop",door:"Guestlist",rating:4.5,reviews:48,tableMin:"$1,000+",img:"https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=600&h=400&fit=crop&q=80",tagline:"SLS pool deck. Day into night.",slug:"hyde-beach",available:true,hours:"Fri–Sun · 12 PM – 8 PM",capacity:"800"},
  {name:"Le Carmen",type:"Lounge",loc:"Paris",vibe:"Sophisticated",music:"House · Live Sets",door:"Guestlist",rating:4.6,reviews:33,tableMin:"€1,000+",img:"https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&h=400&fit=crop&q=80",tagline:"19th-century hôtel particulier turned dance floor",slug:"le-carmen",available:true,hours:"Thu–Sat · 11 PM – 5 AM",capacity:"350"},
];

var CITIES=["All Cities","Miami","Paris"];
var SORT_OPTIONS=["Featured","Rating","Table Min: Low","Table Min: High","Most Reviewed"];

function FilterDrop(p){
  var [open,setOpen]=useState(false);
  var ref=useRef(null);
  useEffect(function(){function h(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("mousedown",h);return function(){document.removeEventListener("mousedown",h)}},[]);
  var hasActive=p.value!==p.options[0];
  return(
    <div ref={ref} style={{position:"relative",flexShrink:0,zIndex:open?70:1}}>
      <div onClick={function(){setOpen(!open)}} style={{display:"flex",alignItems:"center",gap:6,padding:"12px 16px",borderRadius:12,background:hasActive?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(hasActive?"rgba(244,244,245,0.15)":open?C.s7:C.bd),cursor:"pointer",transition:"all 0.3s",whiteSpace:"nowrap"}} onMouseEnter={function(e){if(!open)e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){if(!open&&!hasActive)e.currentTarget.style.borderColor=C.bd}}>
        {p.emoji&&<span style={{fontSize:13}}>{p.emoji}</span>}
        {!p.emoji&&p.icon}
        <span style={{...sf(11,hasActive?600:400),color:hasActive?C.s1:C.s5}}>{p.value}</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2.5" strokeLinecap="round" style={{marginLeft:2,transform:open?"rotate(180deg)":"none",transition:"transform 0.2s"}}><path d="M6 9l6 6 6-6"/></svg>
      </div>
      {open&&<div style={{position:"absolute",top:"calc(100% + 8px)",left:0,borderRadius:16,background:C.el,border:"1px solid "+C.bd,zIndex:70,minWidth:220,maxHeight:340,overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.04)",padding:"6px",scrollbarWidth:"thin",scrollbarColor:C.s7+" transparent"}}>
        {p.options.map(function(opt,i){var active=p.value===opt;var isFirst=i===0;var em=p.emojiMap&&p.emojiMap[opt];return <div key={opt} onClick={function(){p.onChange(opt);setOpen(false)}} style={{padding:"10px 14px",cursor:"pointer",background:active?"rgba(244,244,245,0.06)":"transparent",borderRadius:10,display:"flex",alignItems:"center",gap:10,marginBottom:1,...sf(13,active?600:400),color:active?C.s1:isFirst?C.s5:C.s3,transition:"background 0.15s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(244,244,245,0.08)"}} onMouseLeave={function(e){e.currentTarget.style.background=active?"rgba(244,244,245,0.06)":"transparent"}}>
          {em&&<span style={{fontSize:15,width:20,textAlign:"center"}}>{em}</span>}
          <span style={{flex:1}}>{opt}</span>
          {active&&!isFirst&&<div style={{width:6,height:6,borderRadius:"50%",background:C.gn,flexShrink:0}}/>}
        </div>})}
      </div>}
    </div>
  );
}

function VenueCard(p){
  var [hover,setHover]=useState(false);
  var v=p.v;
  var doorColor=v.door==="Members Only"?"#A78BFA":v.door==="Table Required"?"#FB923C":C.gn;
  return(
    <div onClick={function(){if(v.available)window.location.href="/catalog/nightlife/"+v.slug}} style={{borderRadius:24,background:C.el,border:"1px solid "+(hover?C.s7:C.bd),overflow:"hidden",cursor:v.available?"pointer":"default",transform:hover&&v.available?"translateY(-6px)":"translateY(0)",boxShadow:hover&&v.available?"0 20px 60px rgba(0,0,0,0.4)":"0 4px 20px rgba(0,0,0,0.15)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",opacity:1,animation:p.vis?"fadeIn 0.6s ease "+(0.1+p.i*0.08)+"s both":"none"}} onMouseEnter={function(){setHover(true)}} onMouseLeave={function(){setHover(false)}}>
      <div style={{height:200,position:"relative",overflow:"hidden"}}>
        <img src={v.img} alt={v.name} style={{width:"100%",height:"100%",objectFit:"cover",transform:hover?"scale(1.05)":"scale(1)",transition:"transform 0.6s ease",filter:v.available?"none":"brightness(0.4)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 25%,rgba(10,10,11,0.85) 100%)"}}/>
        {/* Door policy */}
        <div style={{position:"absolute",top:16,left:16}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:doorColor,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{v.door}</span>
        </div>
        {/* Availability */}
        <div style={{position:"absolute",top:16,right:16}}>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:v.available?C.gn:"#FF453A"}}/>
            <span style={{...sf(9,500),color:v.available?C.gn:"#FF453A"}}>{v.available?"Available":"Fully Booked"}</span>
          </div>
        </div>
        {/* Type + music on image */}
        <div style={{position:"absolute",bottom:14,left:16}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{...sf(9,500),color:"rgba(255,255,255,0.5)",letterSpacing:1,textTransform:"uppercase"}}>{v.type}</span>
            <span style={{...sf(9),color:"rgba(255,255,255,0.25)"}}>·</span>
            <span style={{...sf(9,400),color:"rgba(255,255,255,0.4)"}}>{v.music}</span>
          </div>
        </div>
      </div>
      <div style={{padding:"18px 20px 22px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
          <div style={{flex:1,minWidth:0}}>
            <h3 style={{...sf(20,600),color:C.s1,marginBottom:4}}>{v.name}</h3>
            <p style={{...sf(12),color:C.s5,marginBottom:8}}>{v.tagline}</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0,marginLeft:12}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span style={{...sf(13,600),color:C.s1}}>{v.rating}</span>
            <span style={{...sf(10),color:C.s6}}>({v.reviews})</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{...sf(11),color:C.s5}}>{v.loc}</span>
            </div>
            <span style={{...sf(11,600),color:C.s4}}>Min. {v.tableMin}</span>
          </div>
          <div style={{...sf(11,500),color:hover&&v.available?C.s1:C.s5,transition:"color 0.3s"}}>
            {v.available?"View →":"Notify me"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NightlifePage(){
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [city,setCity]=useState("All Cities");
  var [type,setType]=useState("Type");
  var [vibe,setVibe]=useState("Vibe");
  var [door,setDoor]=useState("Door");
  var [music,setMusic]=useState("Music");
  var [sort,setSort]=useState("Featured");
  var [date,setDate]=useState("2026-03-20");
  var [guests,setGuests]=useState("4");

  var gridRef=useRef(null);var gridVis=useVis(gridRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);

  var navOp=Math.min(scrollY/250,1);var heroY=scrollY*0.25;
  var ecDiv={position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"};

  var filtered=VENUES.filter(function(v){
    if(city!=="All Cities"){if(city==="Paris"&&v.loc!=="Paris")return false;if(city==="Miami"&&v.loc==="Paris")return false;}
    if(type!=="Type"&&v.type!==type)return false;
    if(vibe!=="Vibe"&&v.vibe!==vibe)return false;
    if(door!=="Door"&&v.door!==door)return false;
    if(music!=="Music"&&v.music.indexOf(music)===-1)return false;
    return true;
  });

  if(sort==="Rating")filtered=filtered.slice().sort(function(a,b){return b.rating-a.rating});
  else if(sort==="Most Reviewed")filtered=filtered.slice().sort(function(a,b){return b.reviews-a.reviews});
  else if(sort==="Table Min: Low")filtered=filtered.slice().sort(function(a,b){return parseInt(a.tableMin.replace(/[^0-9]/g,""))-parseInt(b.tableMin.replace(/[^0-9]/g,""))});
  else if(sort==="Table Min: High")filtered=filtered.slice().sort(function(a,b){return parseInt(b.tableMin.replace(/[^0-9]/g,""))-parseInt(a.tableMin.replace(/[^0-9]/g,""))});

  var activeFilters=[city!=="All Cities"?city:null,type!=="Type"?type:null,vibe!=="Vibe"?vibe:null,door!=="Door"?door:null,music!=="Music"?music:null].filter(Boolean);
  var clearAll=function(){setCity("All Cities");setType("Type");setVibe("Vibe");setDoor("Door");setMusic("Music")};

  var inputS={padding:"12px 16px",borderRadius:12,background:C.el,border:"1px solid "+C.bd,color:C.s1,...sf(14),outline:"none",width:"100%"};
  var iconType=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/><circle cx="12" cy="12" r="4"/></svg>;
  var iconVibe=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
  var iconDoor=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M14 10h1"/></svg>;
  var iconMusic=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.6);cursor:pointer}
.n-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1060px;margin:0 auto;padding:0 40px}
.search-bar{display:grid;grid-template-columns:1fr 1fr auto auto;gap:12px}
.filter-row{display:flex;gap:6px;align-items:center;overflow:visible;flex:1;min-width:0;flex-wrap:wrap}
@media(max-width:1024px){.n-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){
  .n-grid{grid-template-columns:1fr;padding:0 24px!important;max-width:480px}
  .n-hero{height:340px!important}
  .n-title{font-size:36px!important}
  .search-bar{grid-template-columns:1fr 1fr!important}
}
@media(max-width:390px){.n-hero{height:280px!important}.n-title{font-size:28px!important}.search-bar{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <a href="/catalog" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Catalog</a>
          <div style={{...sf(12,500),color:C.s1,opacity:Math.min(navOp*2,1),transition:"opacity 0.3s"}}>Nightlife</div>
        </div>
      </nav>

      {/* Header */}
      <div style={{paddingTop:100,paddingBottom:40,textAlign:"center",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1)"}}>
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:16}}>Alfred Concierge</p>
        <h1 className="n-title" style={{...sf(48,700),letterSpacing:-2,lineHeight:1.06,marginBottom:12}}>Nightlife</h1>
        <p style={{...sf(16,400),color:C.s5}}>Tables, guestlists & VIP — skip every line.</p>
      </div>

      {/* Search Bar */}
      <div style={{maxWidth:1060,margin:"0 auto",padding:"0 40px",position:"relative",zIndex:10}}>
        <div style={{borderRadius:24,background:C.el,border:"1px solid "+C.bd,padding:"24px 28px"}}>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)",marginTop:-24,marginLeft:-28,marginRight:-28,marginBottom:20}}/>
          <div className="search-bar">
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Location</label>
              <FilterDrop value={city} options={CITIES} onChange={setCity} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Date</label>
              <DarkDatePicker value={date} onChange={function(v){setDate(v)}} label="Date"/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Party Size</label>
              <div style={{display:"flex",gap:0,borderRadius:12,overflow:"hidden",border:"1px solid "+C.bd}}>
                {["2","4","6","10+"].map(function(g,gi){var active=guests===g;return <div key={g} onClick={function(){setGuests(g)}} style={{padding:"11px 14px",background:active?"rgba(244,244,245,0.06)":"transparent",borderLeft:gi>0?"1px solid "+C.bd:"none",cursor:"pointer",...sf(13,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{g}</div>})}
              </div>
            </div>
            <div><label style={{display:"block",fontSize:9,color:"transparent",letterSpacing:1.5,marginBottom:8,userSelect:"none"}}>.</label>
              <div style={{padding:"12px 24px",borderRadius:12,background:C.s1,cursor:"pointer",...sf(13,600),color:C.bg,transition:"transform 0.3s",whiteSpace:"nowrap"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-1px)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)"}}>Search</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{maxWidth:1060,margin:"0 auto",padding:"28px 40px 0",position:"relative",zIndex:40}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:24,position:"relative",zIndex:40}}>
          <div className="filter-row">
            <FilterDrop value={type} options={["Type","Nightclub","Lounge","Members Club","Day Club"]} onChange={setType} emoji="🏛" emojiMap={{Type:"🏛",Nightclub:"🪩",Lounge:"🛋","Members Club":"🔑","Day Club":"☀️"}}/>
            <FilterDrop value={vibe} options={["Vibe","High Energy","Exclusive","Sophisticated","Underground","Pool Party"]} onChange={setVibe} emoji="✨" emojiMap={{Vibe:"✨","High Energy":"🔥",Exclusive:"💎",Sophisticated:"🥂",Underground:"🌀","Pool Party":"🏊"}}/>
            <FilterDrop value={door} options={["Door","Members Only","Table Required","Guestlist"]} onChange={setDoor} emoji="🚪" emojiMap={{Door:"🚪","Members Only":"🔐","Table Required":"🍾",Guestlist:"📋"}}/>
            <FilterDrop value={music} options={["Music","EDM","Hip Hop","House","Techno","Afrobeats"]} onChange={setMusic} emoji="🎵" emojiMap={{Music:"🎵",EDM:"⚡","Hip Hop":"🎤",House:"🎧",Techno:"🖤",Afrobeats:"🥁"}}/>
            <div style={{width:1,height:20,background:C.bd,flexShrink:0}}/>
            <FilterDrop value={sort} options={SORT_OPTIONS} onChange={setSort} emoji="⚡" emojiMap={{Featured:"⚡",Rating:"⭐","Table Min: Low":"📉","Table Min: High":"📈","Most Reviewed":"💬"}}/>
          </div>
          <span style={{...sf(12),color:C.s6,flexShrink:0,marginLeft:8}}>{filtered.length} venue{filtered.length!==1?"s":""}</span>
        </div>
        {activeFilters.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:24}}>
          {activeFilters.map(function(f){return <span key={f} style={{...sf(11,500),color:C.s1,padding:"5px 12px",borderRadius:8,background:"rgba(244,244,245,0.06)",border:"1px solid rgba(244,244,245,0.1)"}}>{f}</span>})}
          {activeFilters.length>1&&<span onClick={clearAll} style={{...sf(11,500),color:C.s5,padding:"5px 12px",borderRadius:8,cursor:"pointer",transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Clear all</span>}
        </div>}
      </div>

      {/* Grid */}
      <div ref={gridRef} className="n-grid" style={{paddingBottom:80}}>
        {filtered.length===0?(
          <div style={{gridColumn:"1 / -1",textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:40,marginBottom:16}}>🌙</div>
            <h3 style={{...sf(20,600),color:C.s3,marginBottom:8}}>No venues match</h3>
            <p style={{...sf(14),color:C.s5,marginBottom:24}}>Try adjusting your filters or location.</p>
            <div onClick={clearAll} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"12px 24px",borderRadius:12,border:"1px solid "+C.bd,cursor:"pointer",...sf(13,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>Clear all filters</div>
          </div>
        ):filtered.map(function(v,i){return <VenueCard key={v.name} v={v} i={i} vis={gridVis}/>})}
      </div>

      {/* CTA */}
      <section ref={ctaRef} style={{padding:"100px 0 120px",position:"relative"}}><div style={ecDiv}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Concierge</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:16,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Need a table<br/>tonight?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Last-minute tables, private rooms, and guestlists. Alfred handles the door — you just show up.</p>
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
