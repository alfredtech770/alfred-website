import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import SEOHead from "../components/SEOHead";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}

function useVis(ref){
  var[v,setV]=useState(false);
  useEffect(function(){
    if(!ref.current)return;
    var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});
    o.observe(ref.current);
    return function(){o.disconnect()}
  },[]);
  return v
}

function FilterDrop(p){
  var[open,setOpen]=useState(false);
  var[pos,setPos]=useState(null);
  var ref=useRef(null);
  var btnRef=useRef(null);
  var isMobile=typeof window!=="undefined"&&window.innerWidth<=768;

  useEffect(function(){
    if(!open)return;
    if(isMobile&&btnRef.current){
      var r=btnRef.current.getBoundingClientRect();
      setPos({top:r.bottom+6,left:Math.max(8,Math.min(r.left,window.innerWidth-220))})
    }
    var timer=setTimeout(function(){
      function h(e){if(ref.current&&!ref.current.contains(e.target)&&!(isMobile&&e.target.closest&&e.target.closest("[data-filter-drop]")))setOpen(false)}
      document.addEventListener("pointerdown",h);
      document.addEventListener("touchstart",h,{passive:true});
      ref.current._cleanup=function(){document.removeEventListener("pointerdown",h);document.removeEventListener("touchstart",h)}
    },10);
    return function(){clearTimeout(timer);if(ref.current&&ref.current._cleanup){ref.current._cleanup();ref.current._cleanup=null};setPos(null)}
  },[open]);

  var hasActive=p.value!==p.options[0];
  var dropStyle=isMobile&&pos?{position:"fixed",top:pos.top,left:pos.left,borderRadius:14,background:"#111113",border:"1px solid rgba(255,255,255,0.12)",overflowY:"auto",zIndex:99999,minWidth:200,maxWidth:"calc(100vw - 16px)",maxHeight:"min(320px, calc(100vh - "+(pos.top+16)+"px))",boxShadow:"0 16px 48px rgba(0,0,0,0.85)",WebkitOverflowScrolling:"touch"}:{position:"absolute",top:"100%",left:0,marginTop:6,borderRadius:14,background:"#111113",border:"1px solid rgba(255,255,255,0.12)",overflowY:"auto",zIndex:9999,minWidth:180,maxWidth:"min(280px, calc(100vw - 32px))",maxHeight:320,boxShadow:"0 16px 48px rgba(0,0,0,0.85)"};

  return(
    <div ref={ref} style={{position:"relative",WebkitTapHighlightColor:"transparent"}} data-filter-drop="true">
      <div ref={btnRef} onClick={function(e){e.stopPropagation();setOpen(!open)}} style={{display:"flex",alignItems:"center",gap:6,padding:"0 16px",height:40,borderRadius:12,background:hasActive?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(hasActive?"rgba(244,244,245,0.15)":open?C.s7:C.bd),cursor:"pointer",transition:"all 0.3s",whiteSpace:"nowrap",WebkitTapHighlightColor:"transparent",touchAction:"manipulation"}} onPointerEnter={function(e){if(e.pointerType==="mouse"&&!open)e.currentTarget.style.borderColor=C.s7}} onPointerLeave={function(e){if(e.pointerType==="mouse"&&!open&&!hasActive)e.currentTarget.style.borderColor=C.bd}}>
        {p.icon}
        <span style={{...sf(11,hasActive?600:400),color:hasActive?C.s1:C.s5}}>{p.value}</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2.5" strokeLinecap="round" style={{marginLeft:2}}><path d="M6 9l6 6 6-6"/></svg>
      </div>
      {open&&<div style={dropStyle}>
        {p.options.map(function(opt){
          var active=p.value===opt;
          return <div key={opt} onClick={function(e){e.stopPropagation();p.onChange(opt);setOpen(false)}} style={{padding:"13px 16px",cursor:"pointer",background:active?"rgba(244,244,245,0.04)":"transparent",borderBottom:"1px solid rgba(44,44,49,0.5)",display:"flex",alignItems:"center",gap:8,...sf(13,active?600:400),color:active?C.s1:C.s4,WebkitTapHighlightColor:"transparent",touchAction:"manipulation"}} onPointerEnter={function(e){if(e.pointerType==="mouse")e.currentTarget.style.background="rgba(244,244,245,0.06)"}} onPointerLeave={function(e){if(e.pointerType==="mouse")e.currentTarget.style.background=active?"rgba(244,244,245,0.04)":"transparent"}}>{active&&<div style={{width:4,height:4,borderRadius:"50%",background:C.gn}}/>}{opt}</div>
        })}
      </div>}
    </div>
  );
}

function StarRating(p){
  var full=Math.floor(p.stars||0);
  var half=(p.stars||0)-full>=0.5;
  return(
    <div style={{display:"flex",alignItems:"center",gap:2}}>
      {[1,2,3,4,5].map(function(i){
        var filled=i<=full;
        var isHalf=!filled&&i===full+1&&half;
        return(
          <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={filled||isHalf?C.gold:"none"} stroke={filled||isHalf?C.gold:C.s7} strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )
      })}
    </div>
  )
}

function HotelCard(p){
  var[hover,setHover]=useState(false);
  var h=p.h;
  var isOpen=h.status==="open"||h.status==null;

  return(
    <div
      onClick={function(){sessionStorage.setItem("alfred_hotel_"+h.slug,JSON.stringify(h));window.location.href="/catalog/hotels/"+h.slug}}
      style={{borderRadius:24,background:C.el,border:"1px solid "+(hover?C.s7:C.bd),overflow:"hidden",cursor:"pointer",transform:hover?"translateY(-6px)":"translateY(0)",boxShadow:hover?"0 20px 60px rgba(0,0,0,0.4)":"0 4px 20px rgba(0,0,0,0.15)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",animation:"fadeIn 0.6s ease "+(0.1+p.i*0.07)+"s both",touchAction:"manipulation",WebkitTapHighlightColor:"transparent"}}
      onPointerEnter={function(e){if(e.pointerType==="mouse")setHover(true)}}
      onPointerLeave={function(e){if(e.pointerType==="mouse")setHover(false)}}
    >
      <div style={{height:210,position:"relative",overflow:"hidden"}}>
        {h.hero_image_url?(
          <img src={h.hero_image_url} alt={h.name} style={{width:"100%",height:"100%",objectFit:"cover",transform:hover?"scale(1.05)":"scale(1)",transition:"transform 0.6s ease"}}/>
        ):(
          <div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#1a1a22,#252530)"}}/>
        )}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 30%,rgba(10,10,11,0.85) 100%)"}}/>
        {/* Stars badge */}
        {h.star_rating>0&&(
          <div style={{position:"absolute",top:14,left:14,display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:9,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(12px)"}}>
            <StarRating stars={h.star_rating}/>
          </div>
        )}
        {/* Status badge */}
        <div style={{position:"absolute",top:14,right:14}}>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:isOpen?C.gn:"#FF9F0A"}}/>
            <span style={{...sf(9,500),color:isOpen?C.gn:"#FF9F0A"}}>{isOpen?"Available":"Coming Soon"}</span>
          </div>
        </div>
        {/* Neighborhood tag bottom */}
        <div style={{position:"absolute",bottom:14,left:14,right:14}}>
          {h.neighborhood&&<span style={{...sf(9,500),color:"rgba(255,255,255,0.5)",letterSpacing:1.5,textTransform:"uppercase"}}>{h.neighborhood}</span>}
        </div>
      </div>

      <div style={{padding:"18px 20px 22px"}}>
        <div style={{marginBottom:8}}>
          <h3 style={{...sf(19,600),color:C.s1,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.name}</h3>
          {h.tagline&&<p style={{...sf(12),color:C.s5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.tagline}</p>}
        </div>
        {/* Amenity pills */}
        {h.amenities&&h.amenities.length>0&&(
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
            {h.amenities.slice(0,3).map(function(a,i){
              return <span key={i} style={{...sf(9,500),color:C.s5,padding:"3px 8px",borderRadius:6,background:C.srf,border:"1px solid "+C.bd}}>{a}</span>
            })}
            {h.amenities.length>3&&<span style={{...sf(9,400),color:C.s6,padding:"3px 8px",borderRadius:6,background:C.srf,border:"1px solid "+C.bd}}>+{h.amenities.length-3}</span>}
          </div>
        )}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{...sf(11),color:C.s5}}>{h.neighborhood||h.city||"Miami"}</span>
          </div>
          {h.price_level>0&&(
            <span style={{...sf(11,500),color:C.s4}}>{"$".repeat(h.price_level)}</span>
          )}
          <span style={{...sf(11,500),color:hover?C.s1:C.s5,transition:"color 0.3s"}}>View →</span>
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage(){
  var[loaded,setLoaded]=useState(false);
  var[scrollY,setScrollY]=useState(false);
  var[hotels,setHotels]=useState([]);
  var[fetching,setFetching]=useState(true);
  var[search,setSearch]=useState("");
  var[neighborhood,setNeighborhood]=useState("Neighborhood");
  var[priceLevel,setPriceLevel]=useState("Price");
  var[status,setStatus]=useState("Status");

  var gridRef=useRef(null);var gridVis=useVis(gridRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);

  useEffect(function(){
    async function load(){
      try{
        var{data,error}=await supabase.from("accommodations").select("*").order("name");
        if(error)throw error;
        setHotels(data||[]);
      }catch(e){console.error("Hotels fetch:",e);}
      finally{setFetching(false);}
    }
    load();
  },[]);

  var navOp=Math.min(scrollY/250,1);

  // Build filter options from data
  var neighborhoods=["Neighborhood"].concat([...new Set(hotels.map(function(h){return h.neighborhood}).filter(Boolean))].sort());
  var prices=["Price","$","$$","$$$","$$$$"];
  var statuses=["Status","Open","Coming Soon"];

  var filtered=hotels.filter(function(h){
    if(search&&!h.name.toLowerCase().includes(search.toLowerCase()))return false;
    if(neighborhood!=="Neighborhood"&&h.neighborhood!==neighborhood)return false;
    if(priceLevel!=="Price"){
      var pl=h.price_level||0;
      var ps=pl===1?"$":pl===2?"$$":pl===3?"$$$":pl===4?"$$$$":"";
      if(ps!==priceLevel)return false;
    }
    if(status!=="Status"){
      var isOpen=h.status==="open"||h.status==null;
      if(status==="Open"&&!isOpen)return false;
      if(status==="Coming Soon"&&isOpen)return false;
    }
    return true;
  });

  var activeFilters=[neighborhood!=="Neighborhood"?neighborhood:null,priceLevel!=="Price"?priceLevel:null,status!=="Status"?status:null].filter(Boolean);
  var clearAll=function(){setNeighborhood("Neighborhood");setPriceLevel("Price");setStatus("Status");setSearch("")};

  var SEO_HOTELS={
    title:"Luxury Hotels Miami — Best Hotels & Accommodations | Alfred Concierge",
    description:"Book the best luxury hotels in Miami through Alfred Concierge. South Beach, Brickell, Mid-Beach, and Surfside. 5-star hotels, suites, and exclusive perks. Personal concierge, guaranteed upgrades.",
    keywords:"luxury hotels Miami, best hotels Miami, Miami Beach hotels, South Beach hotels, Brickell hotels, 5 star hotels Miami, hotel concierge Miami, hotel booking Miami, Miami accommodation",
    path:"/catalog/hotels",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"Luxury Hotel Bookings — Alfred Concierge","description":"Book the best luxury hotels in Miami through Alfred Concierge. South Beach, Brickell, Mid-Beach. 5-star hotels, suites, and exclusive perks.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"Luxury Hotel Bookings","areaServed":[{"@type":"City","name":"Miami"}],"url":"https://alfredconcierge.app/catalog/hotels"},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Hotels","item":"https://alfredconcierge.app/catalog/hotels"}]}
    ]
  };

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <SEOHead {...SEO_HOTELS}/>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}
::selection{background:${C.s7};color:${C.s1}}
a{color:inherit;text-decoration:none}
body::-webkit-scrollbar{width:0}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
.h-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1060px;margin:0 auto;padding:0 40px}
.filter-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
@media(max-width:1024px){.h-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){
  .h-grid{grid-template-columns:1fr;padding:0 16px!important;max-width:100%}
  .h-hero{height:300px!important}
  .h-title{font-size:34px!important}
  .filter-row{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:4px}
  .filter-row::-webkit-scrollbar{display:none}
}
@media(max-width:390px){.h-hero{height:260px!important}.h-title{font-size:26px!important}}
      `}</style>

      {/* Grain */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+(Math.min(navOp*0.95,0.95))+")":"transparent",backdropFilter:navOp>0.05?"blur(30px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")",transition:"all 0.3s"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={22} color={C.s1}/></a>
        <div style={{display:"flex",alignItems:"center",gap:28}}>
          <a href="/" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Home</a>
          <a href="/catalog" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Catalog</a>
          <div onClick={function(){window.open("https://wa.me/447449562204","_blank")}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:12,background:C.el,border:"1px solid "+C.bd,...sf(11,500),color:C.s1,cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background=C.s1;e.currentTarget.style.color=C.bg}} onMouseLeave={function(e){e.currentTarget.style.background=C.el;e.currentTarget.style.color=C.s1}}>Contact Alfred</div>
        </div>
      </nav>

      {/* HERO */}
      <section className="h-hero" style={{height:420,position:"relative",overflow:"hidden",display:"flex",alignItems:"flex-end"}}>
        <img src="https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/_%20(82).jpeg" alt="Luxury Hotels Miami" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform:loaded?"scale(1)":"scale(1.04)",transition:"transform 1.2s ease"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0.2) 0%,rgba(10,10,11,0.7) 60%,rgba(10,10,11,0.97) 100%)"}}/>
        <div style={{position:"relative",padding:"0 40px 60px",maxWidth:1060,width:"100%",margin:"0 auto",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(20px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s"}}>
          <p style={{...sf(10,500),color:C.s6,letterSpacing:5,textTransform:"uppercase",marginBottom:12}}>Alfred Collection</p>
          <h1 className="h-title" style={{...sf(52,700),letterSpacing:-2,lineHeight:1.05,marginBottom:12}}>Accommodations</h1>
          <p style={{...sf(16),color:C.s4,maxWidth:440,lineHeight:1.6}}>{fetching?"Loading hotels...":hotels.length+" luxury hotels across Miami"}</p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section style={{padding:"28px 40px 0",maxWidth:1060,margin:"0 auto",boxSizing:"border-box"}}>
        <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
          {/* Search */}
          <div style={{position:"relative",flex:"1 1 220px",minWidth:160,maxWidth:320}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              value={search}
              onChange={function(e){setSearch(e.target.value)}}
              placeholder="Search hotels..."
              style={{paddingLeft:36,paddingRight:16,height:40,borderRadius:12,background:C.el,border:"1px solid "+C.bd,color:C.s1,...sf(13),outline:"none",width:"100%",boxSizing:"border-box"}}
            />
          </div>
          {/* Filters */}
          <div className="filter-row">
            <FilterDrop value={neighborhood} options={neighborhoods} onChange={setNeighborhood} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}/>
            <FilterDrop value={priceLevel} options={prices} onChange={setPriceLevel} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}/>
            <FilterDrop value={status} options={statuses} onChange={setStatus} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}/>
          </div>
          {/* Active filter count + clear */}
          {activeFilters.length>0&&(
            <div onClick={clearAll} style={{display:"flex",alignItems:"center",gap:5,padding:"0 12px",height:40,borderRadius:12,background:"rgba(255,214,10,0.08)",border:"1px solid rgba(255,214,10,0.2)",cursor:"pointer",...sf(11,500),color:C.gold,transition:"all 0.3s"}}>
              <span>{activeFilters.length} filter{activeFilters.length>1?"s":""}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </div>
          )}
        </div>
        <div style={{marginTop:16,height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"}}/>
      </section>

      {/* RESULTS COUNT */}
      {!fetching&&(
        <div style={{padding:"16px 40px 0",maxWidth:1060,margin:"0 auto",boxSizing:"border-box"}}>
          <p style={{...sf(11),color:C.s6,letterSpacing:1}}>{filtered.length} hotel{filtered.length!==1?"s":""}{activeFilters.length>0?" matching filters":""}</p>
        </div>
      )}

      {/* GRID */}
      <section style={{padding:"28px 0 80px"}}>
        <div ref={gridRef} className="h-grid">
          {fetching?(
            <div style={{gridColumn:"1 / -1",textAlign:"center",padding:"60px 20px",...sf(13),color:C.s6,letterSpacing:2,textTransform:"uppercase"}}>Loading hotels...</div>
          ):filtered.length===0?(
            <div style={{gridColumn:"1 / -1",textAlign:"center",padding:"60px 20px"}}>
              <div style={{fontSize:40,marginBottom:16}}>🏨</div>
              <h3 style={{...sf(20,600),color:C.s3,marginBottom:8}}>No hotels match</h3>
              <p style={{...sf(14),color:C.s5,marginBottom:24}}>Try adjusting your filters.</p>
              <div onClick={clearAll} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"12px 24px",borderRadius:12,border:"1px solid "+C.bd,cursor:"pointer",...sf(13,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>Clear all filters</div>
            </div>
          ):filtered.map(function(h,i){return <HotelCard key={h.id||h.slug||i} h={h} i={i}/>})}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} style={{padding:"80px 0 120px",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"}}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Concierge</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:16,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Need a specific hotel?</h2>
          <p style={{...sf(15),color:C.s5,lineHeight:1.7,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Tell Alfred your dates, location, and preferences. We'll secure your room with exclusive perks.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.4s"}}>
            <div onClick={function(){window.open("https://wa.me/447449562204?text=Hi%20Alfred%2C%20I%27m%20looking%20for%20a%20luxury%20hotel%20in%20Miami","_blank")}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:14,background:C.s1,...sf(14,600),color:C.bg,cursor:"pointer",transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(244,244,245,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Ask Alfred</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid "+C.bd,padding:"36px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
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
