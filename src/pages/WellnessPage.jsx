import { useState, useEffect, useRef } from "react";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

var VENUES=[
  {name:"The Spa at Four Seasons",type:"Luxury Spa",loc:"Miami",treatment:"Full-Service",price:"€€€€",rating:4.9,reviews:62,from:"$350",img:"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop&q=80",tagline:"Oceanfront rituals. Signature stone therapy.",slug:"four-seasons-spa",available:true,duration:"60–120 min"},
  {name:"Dior Spa Cheval Blanc",type:"Luxury Spa",loc:"Paris",treatment:"Full-Service",price:"€€€€",rating:4.9,reviews:48,from:"€400",img:"https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&h=400&fit=crop&q=80",tagline:"Dior skincare rituals overlooking the Seine",slug:"dior-spa",available:true,duration:"90–180 min"},
  {name:"Anatomy",type:"Fitness",loc:"Miami",treatment:"Training",price:"€€€",rating:4.8,reviews:71,from:"$75",img:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&q=80",tagline:"Miami's most elite fitness club",slug:"anatomy",available:true,duration:"60 min"},
  {name:"Joanna Czech",type:"Facialist",loc:"Miami",treatment:"Facial",price:"€€€€",rating:4.9,reviews:34,from:"$500",img:"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop&q=80",tagline:"The facialist to the A-list. LED + lymphatic.",slug:"joanna-czech",available:false,duration:"75 min"},
  {name:"Molitor Spa by Clarins",type:"Luxury Spa",loc:"Paris",treatment:"Full-Service",price:"€€€",rating:4.7,reviews:56,from:"€180",img:"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop&q=80",tagline:"Art Deco pool meets Clarins treatment rooms",slug:"molitor-spa",available:true,duration:"60–120 min"},
  {name:"The Standard Spa",type:"Wellness Center",loc:"Miami",treatment:"Full-Service",price:"€€€",rating:4.6,reviews:45,from:"$200",img:"https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=400&fit=crop&q=80",tagline:"Hydrotherapy, sound baths, hammam",slug:"standard-spa",available:true,duration:"Half-day"},
  {name:"Le Bristol Spa",type:"Luxury Spa",loc:"Paris",treatment:"Full-Service",price:"€€€€",rating:4.8,reviews:39,from:"€350",img:"https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&h=400&fit=crop&q=80",tagline:"La Prairie treatments in a palace setting",slug:"le-bristol-spa",available:true,duration:"90–150 min"},
  {name:"Carillon Wellness",type:"Wellness Center",loc:"Miami",treatment:"Full-Service",price:"€€€€",rating:4.7,reviews:58,from:"$300",img:"https://images.unsplash.com/photo-1591343395082-e120087004b4?w=600&h=400&fit=crop&q=80",tagline:"70,000 sq ft. Thermal baths, cryotherapy, IV drips.",slug:"carillon",available:true,duration:"Full-day"},
  {name:"Biologique Recherche",type:"Facialist",loc:"Paris",treatment:"Facial",price:"€€€€",rating:4.8,reviews:31,from:"€280",img:"https://images.unsplash.com/photo-1552693673-1bf958298935?w=600&h=400&fit=crop&q=80",tagline:"Clinical French skincare. The original.",slug:"biologique-recherche",available:true,duration:"60–90 min"},
  {name:"Equinox",type:"Fitness",loc:"Miami",treatment:"Training",price:"€€€",rating:4.6,reviews:44,from:"$100",img:"https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop&q=80",tagline:"Luxury fitness. SoulCycle, Pilates, Recovery.",slug:"equinox",available:true,duration:"60 min"},
];

var CITIES=["All Cities","Miami","Paris"];
var SORT_OPTIONS=["Featured","Rating","Price: Low","Price: High","Most Reviewed"];

function FilterDrop(p){
  var [open,setOpen]=useState(false);
  var ref=useRef(null);
  useEffect(function(){function h(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("mousedown",h);return function(){document.removeEventListener("mousedown",h)}},[]);
  var hasActive=p.value!==p.options[0];
  return(
    <div ref={ref} style={{position:"relative",flexShrink:0}}>
      <div onClick={function(){setOpen(!open)}} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderRadius:10,background:hasActive?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(hasActive?"rgba(244,244,245,0.15)":open?C.s7:C.bd),cursor:"pointer",transition:"all 0.3s",whiteSpace:"nowrap"}} onMouseEnter={function(e){if(!open)e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){if(!open&&!hasActive)e.currentTarget.style.borderColor=C.bd}}>
        {p.icon}
        <span style={{...sf(11,hasActive?600:400),color:hasActive?C.s1:C.s5}}>{p.value}</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2.5" strokeLinecap="round" style={{marginLeft:2}}><path d="M6 9l6 6 6-6"/></svg>
      </div>
      {open&&<div style={{position:"absolute",top:"100%",left:0,marginTop:6,borderRadius:14,background:C.el,border:"1px solid "+C.bd,overflow:"hidden",zIndex:60,minWidth:160,boxShadow:"0 16px 48px rgba(0,0,0,0.6)"}}>
        {p.options.map(function(opt){var active=p.value===opt;return <div key={opt} onClick={function(){p.onChange(opt);setOpen(false)}} style={{padding:"11px 16px",cursor:"pointer",background:active?"rgba(244,244,245,0.04)":"transparent",borderBottom:"1px solid rgba(44,44,49,0.5)",display:"flex",alignItems:"center",gap:8,...sf(13,active?600:400),color:active?C.s1:C.s4,transition:"background 0.15s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(244,244,245,0.06)"}} onMouseLeave={function(e){e.currentTarget.style.background=active?"rgba(244,244,245,0.04)":"transparent"}}>{active&&<div style={{width:4,height:4,borderRadius:"50%",background:C.gn}}/>}{opt}</div>})}
      </div>}
    </div>
  );
}

function WellCard(p){
  var [hover,setHover]=useState(false);
  var v=p.v;
  return(
    <div onClick={function(){if(v.available)window.location.href="/catalog/wellness/"+v.slug}} style={{borderRadius:24,background:C.el,border:"1px solid "+(hover?C.s7:C.bd),overflow:"hidden",cursor:v.available?"pointer":"default",transform:hover&&v.available?"translateY(-6px)":"translateY(0)",boxShadow:hover&&v.available?"0 20px 60px rgba(0,0,0,0.4)":"0 4px 20px rgba(0,0,0,0.15)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",opacity:p.vis?1:0,animation:p.vis?"fadeIn 0.6s ease "+(0.1+p.i*0.08)+"s both":"none"}} onMouseEnter={function(){setHover(true)}} onMouseLeave={function(){setHover(false)}}>
      <div style={{height:200,position:"relative",overflow:"hidden"}}>
        <img src={v.img} alt={v.name} style={{width:"100%",height:"100%",objectFit:"cover",transform:hover?"scale(1.05)":"scale(1)",transition:"transform 0.6s ease",filter:v.available?"none":"brightness(0.4)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 30%,rgba(10,10,11,0.85) 100%)"}}/>
        <div style={{position:"absolute",top:16,left:16}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{v.type}</span>
        </div>
        <div style={{position:"absolute",top:16,right:16}}>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:v.available?C.gn:"#FF453A"}}/>
            <span style={{...sf(9,500),color:v.available?C.gn:"#FF453A"}}>{v.available?"Available":"Waitlist"}</span>
          </div>
        </div>
        <div style={{position:"absolute",bottom:14,left:16}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{...sf(9,500),color:"rgba(255,255,255,0.5)",letterSpacing:1,textTransform:"uppercase"}}>{v.treatment}</span>
            <span style={{...sf(9),color:"rgba(255,255,255,0.25)"}}>·</span>
            <span style={{...sf(9,400),color:"rgba(255,255,255,0.4)"}}>{v.duration}</span>
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
            <span style={{...sf(11,600),color:C.s4}}>From {v.from}</span>
          </div>
          <div style={{...sf(11,500),color:hover&&v.available?C.s1:C.s5,transition:"color 0.3s"}}>
            {v.available?"View →":"Join waitlist"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WellnessPage(){
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [city,setCity]=useState("All Cities");
  var [type,setType]=useState("Type");
  var [treatment,setTreatment]=useState("Treatment");
  var [price,setPrice]=useState("Price");
  var [sort,setSort]=useState("Featured");
  var [date,setDate]=useState("2026-03-20");
  var [time,setTime]=useState("Morning");

  var gridRef=useRef(null);var gridVis=useVis(gridRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);

  var navOp=Math.min(scrollY/250,1);var heroY=scrollY*0.25;

  var filtered=VENUES.filter(function(v){
    if(city!=="All Cities"&&v.loc!==city)return false;
    if(type!=="Type"&&v.type!==type)return false;
    if(treatment!=="Treatment"&&v.treatment!==treatment)return false;
    if(price!=="Price"&&v.price!==price)return false;
    return true;
  });
  if(sort==="Rating")filtered=filtered.slice().sort(function(a,b){return b.rating-a.rating});
  else if(sort==="Most Reviewed")filtered=filtered.slice().sort(function(a,b){return b.reviews-a.reviews});
  else if(sort==="Price: Low")filtered=filtered.slice().sort(function(a,b){return a.price.length-b.price.length});
  else if(sort==="Price: High")filtered=filtered.slice().sort(function(a,b){return b.price.length-a.price.length});

  var activeFilters=[city!=="All Cities"?city:null,type!=="Type"?type:null,treatment!=="Treatment"?treatment:null,price!=="Price"?price:null].filter(Boolean);
  var clearAll=function(){setCity("All Cities");setType("Type");setTreatment("Treatment");setPrice("Price")};

  var inputS={padding:"12px 16px",borderRadius:12,background:C.el,border:"1px solid "+C.bd,color:C.s1,...sf(14),outline:"none",width:"100%"};
  var iconType=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  var iconTreat=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
  var iconPrice=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.6);cursor:pointer}
.w-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1060px;margin:0 auto;padding:0 40px}
.search-bar{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px}
.filter-row{display:flex;gap:6px;align-items:center;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;flex:1;min-width:0}
.filter-row::-webkit-scrollbar{display:none}
@media(max-width:1024px){.w-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.w-grid{grid-template-columns:1fr;padding:0 24px!important;max-width:480px}.w-hero{height:340px!important}.w-title{font-size:36px!important}.search-bar{grid-template-columns:1fr 1fr!important}}
@media(max-width:390px){.w-hero{height:280px!important}.w-title{font-size:28px!important}.search-bar{grid-template-columns:1fr!important}}
      `}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <a href="/catalog" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Catalog</a>
          <div style={{...sf(12,500),color:C.s1,opacity:Math.min(navOp*2,1),transition:"opacity 0.3s"}}>Wellness</div>
        </div>
      </nav>

      <div style={{paddingTop:100,paddingBottom:40,textAlign:"center",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1)"}}>
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:16}}>Alfred Concierge</p>
        <h1 className="w-title" style={{...sf(48,700),letterSpacing:-2,lineHeight:1.06,marginBottom:12}}>Wellness</h1>
        <p style={{...sf(16,400),color:C.s5}}>Spas, fitness & beauty — curated for the best.</p>
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
              <input type="date" value={date} onChange={function(e){setDate(e.target.value)}} style={inputS}/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Preferred Time</label>
              <div style={{display:"flex",gap:0}}>
                {["Morning","Afternoon","Evening"].map(function(t){var active=time===t;return <div key={t} onClick={function(){setTime(t)}} style={{flex:1,textAlign:"center",padding:"11px 10px",background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+C.bd,marginLeft:-1,cursor:"pointer",...sf(12,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{t}</div>})}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"flex-end"}}>
              <div style={{padding:"12px 24px",borderRadius:12,background:C.s1,cursor:"pointer",...sf(13,600),color:C.bg,transition:"transform 0.3s",whiteSpace:"nowrap",marginTop:21}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-1px)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)"}}>Search</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{maxWidth:1060,margin:"0 auto",padding:"28px 40px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:24}}>
          <div className="filter-row">
            <FilterDrop value={type} options={["Type","Luxury Spa","Wellness Center","Facialist","Fitness"]} onChange={setType} icon={iconType}/>
            <FilterDrop value={treatment} options={["Treatment","Full-Service","Facial","Training"]} onChange={setTreatment} icon={iconTreat}/>
            <FilterDrop value={price} options={["Price","€€€","€€€€"]} onChange={setPrice} icon={iconPrice}/>
            <div style={{width:1,height:20,background:C.bd,flexShrink:0}}/>
            <FilterDrop value={sort} options={SORT_OPTIONS} onChange={setSort} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M6 12h12M9 18h6"/></svg>}/>
          </div>
          <span style={{...sf(12),color:C.s6,flexShrink:0,marginLeft:8}}>{filtered.length} venue{filtered.length!==1?"s":""}</span>
        </div>
        {activeFilters.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:24}}>
          {activeFilters.map(function(f){return <span key={f} style={{...sf(11,500),color:C.s1,padding:"5px 12px",borderRadius:8,background:"rgba(244,244,245,0.06)",border:"1px solid rgba(244,244,245,0.1)"}}>{f}</span>})}
          {activeFilters.length>1&&<span onClick={clearAll} style={{...sf(11,500),color:C.s5,padding:"5px 12px",borderRadius:8,cursor:"pointer",transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Clear all</span>}
        </div>}
      </div>

      <div ref={gridRef} className="w-grid" style={{paddingBottom:80}}>
        {filtered.length===0?(
          <div style={{gridColumn:"1 / -1",textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:40,marginBottom:16}}>🧘</div>
            <h3 style={{...sf(20,600),color:C.s3,marginBottom:8}}>No venues match</h3>
            <p style={{...sf(14),color:C.s5,marginBottom:24}}>Try adjusting your filters or location.</p>
            <div onClick={clearAll} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"12px 24px",borderRadius:12,border:"1px solid "+C.bd,cursor:"pointer",...sf(13,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>Clear all filters</div>
          </div>
        ):filtered.map(function(v,i){return <WellCard key={v.name} v={v} i={i} vis={gridVis}/>})}
      </div>

      <section ref={ctaRef} style={{padding:"100px 0 120px",position:"relative"}}><div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"}}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Concierge</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:16,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Need something<br/>specific?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Private treatments, in-villa sessions, IV drips, cryotherapy — whatever you need, Alfred arranges it.</p>
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
