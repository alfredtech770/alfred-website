import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import DarkDatePicker from "../components/DarkDatePicker";
import SEOHead, { SEO } from "../components/SEOHead";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}


var SORT_OPTIONS=["Featured","Rating","Price: Low","Price: High","Most Reviewed"];
function capitalize(s){if(!s)return s;return s.charAt(0).toUpperCase()+s.slice(1)}

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
          return <div key={opt} onClick={function(e){e.stopPropagation();p.onChange(opt);setOpen(false)}} style={{padding:"13px 16px",cursor:"pointer",background:active?"rgba(244,244,245,0.04)":"transparent",borderBottom:"1px solid rgba(44,44,49,0.5)",display:"flex",alignItems:"center",gap:8,...sf(13,active?600:400),color:active?C.s1:C.s4,WebkitTapHighlightColor:"transparent",touchAction:"manipulation"}} onPointerEnter={function(e){if(e.pointerType==="mouse")e.currentTarget.style.background="rgba(244,244,245,0.06)"}} onPointerLeave={function(e){if(e.pointerType==="mouse")e.currentTarget.style.background=active?"rgba(244,244,245,0.04)":"transparent"}}>
            {active&&<div style={{width:4,height:4,borderRadius:"50%",background:C.gn}}/>}
            {opt}
          </div>
        })}
      </div>}
    </div>
  );
}

function RestCard(p){
  var [hover,setHover]=useState(false);
  var r=p.r;
  return(
    <div onClick={function(){if(r.available){sessionStorage.setItem("alfred_restaurant_"+r.slug,JSON.stringify(r));window.location.href="/catalog/dining/"+r.slug}}} style={{borderRadius:24,background:C.el,border:"1px solid "+(hover?C.s7:C.bd),overflow:"hidden",cursor:r.available?"pointer":"default",transform:hover&&r.available?"translateY(-6px)":"translateY(0)",boxShadow:hover&&r.available?"0 20px 60px rgba(0,0,0,0.4)":"0 4px 20px rgba(0,0,0,0.15)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",opacity:1,animation:"fadeIn 0.6s ease "+(0.1+p.i*0.08)+"s both",touchAction:"manipulation",WebkitTapHighlightColor:"transparent"}} onPointerEnter={function(e){if(e.pointerType==="mouse")setHover(true)}} onPointerLeave={function(e){if(e.pointerType==="mouse")setHover(false)}}>

      <div style={{height:200,position:"relative",overflow:"hidden"}}>
        <img src={r.img} alt={r.name} style={{width:"100%",height:"100%",objectFit:"cover",transform:hover?"scale(1.05)":"scale(1)",transition:"transform 0.6s ease",filter:r.available?"none":"brightness(0.5)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 30%,rgba(10,10,11,0.85) 100%)"}}/>
        {/* Michelin */}
        {r.michelin>0&&<div style={{position:"absolute",top:16,left:16}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)"}}>MICHELIN {"★".repeat(r.michelin)}</span>
        </div>}
        {/* Availability */}
        <div style={{position:"absolute",top:16,right:16}}>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:r.available?C.gn:"#FF453A"}}/>
            <span style={{...sf(9,500),color:r.available?C.gn:"#FF453A"}}>{r.available?"Available":"Fully Booked"}</span>
          </div>
        </div>
        {/* Bottom info on image */}
        <div style={{position:"absolute",bottom:14,left:16,right:16}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
            <span style={{...sf(9,500),color:"rgba(255,255,255,0.5)",letterSpacing:1.5,textTransform:"uppercase"}}>{r.cuisine}</span>
            <span style={{...sf(9),color:"rgba(255,255,255,0.25)"}}>·</span>
            <span style={{...sf(9,500),color:"rgba(255,255,255,0.5)"}}>{r.price}</span>
          </div>
        </div>
      </div>
      <div style={{padding:"18px 20px 22px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:6}}>
          <div style={{flex:1,minWidth:0}}>
            <h3 style={{...sf(20,600),color:C.s1,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</h3>
            <p style={{...sf(12),color:C.s5,marginBottom:8,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.tagline}</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0,marginLeft:12}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span style={{...sf(13,600),color:C.s1}}>{r.rating}</span>
            <span style={{...sf(10),color:C.s6}}>({r.reviews})</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{...sf(11),color:C.s5}}>{r.loc}</span>
            </div>
            {false&&<span style={{...sf(11),color:C.s6}}>Avg. {r.avg}</span>}
          </div>
          <div style={{...sf(11,500),color:hover&&r.available?C.s1:C.s5,transition:"color 0.3s"}}>
            {r.available?"View →":"Notify me"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DiningPage(){
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [restaurants,setRestaurants]=useState([]);
  var [fetching,setFetching]=useState(true);
  var [city,setCity]=useState("All Cities");
  var [cuisine,setCuisine]=useState("Cuisine");
  var [price,setPrice]=useState("Price");
  var [vibe,setVibe]=useState("Vibe");
  var [sort,setSort]=useState("Featured");
  var [guests,setGuests]=useState("2");
  var [date,setDate]=useState("2026-03-20");

  var gridRef=useRef(null);var gridVis=useVis(gridRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);
  useEffect(function(){
    async function load(){
      try{
        var {data,error}=await supabase.from("restaurants").select("*").order("name");
        if(error)throw error;
        setRestaurants((data||[]).map(function(r){
          var pl=r.price_level||0;
          return{
          name:r.name||"",cuisine:r.cuisine||"",
          price:pl===1?"$":pl===2?"$$":pl===3?"$$$":pl===4?"$$$$":"$$$$",
          priceLevel:pl,
          loc:r.city||r.location||r.loc||"",
          vibe:capitalize(r.vibe)||"",
          rating:r.rating||0,reviews:r.review_count||r.reviews||0,
          michelin:r.michelin_stars||r.michelin||0,
          img:r.hero_image_url||r.image_url||r.img||"",
          tagline:r.tagline||"",
          slug:r.slug||(r.id?String(r.id):""),imgs:r.photos_order||r.gallery_photos||[r.hero_image_url||r.image_url||r.img].filter(Boolean),
          available:r.available!==false,
          avg:r.avg_spend||r.avg||"",
          chefName:r.chef_name||"",chefTitle:r.chef_title||"",chefNote:r.chef_note||"",
          wineNote:r.wine_note||"",
          alfredNote:r.alfred_note||"",alfredTip:r.alfred_tip||"",
          address:r.address||"",
          dressCode:r.dress_code||"",
          hoursLunch:r.hours_lunch||"",hoursDinner:r.hours_dinner||"",hoursClosed:r.hours_closed||"",
          atmNoise:r.atm_noise||0,atmIntimacy:r.atm_intimacy||0,atmFormality:r.atm_formality||0,atmScene:r.atm_scene||0,
          bestFor:r.best_for||[],
        }}));
      }catch(e){console.error("Restaurants fetch:",e);}
      finally{setFetching(false);}
    }
    load();
  },[]);

  var navOp=Math.min(scrollY/250,1);var heroY=scrollY*0.25;
  var ecDiv={position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"};

  /* Dynamic filter options from data — group cuisines into broad categories */
  var cities=["All Cities","Miami","Paris"];
  var CUISINE_MAP={
    "French":["French","French Fine Dining","French Bistro","French Brasserie","French Cafe","French Café","French Classic","French Contemporary","French Gastronomic","French Mediterranean","French Seafood","French Steakhouse","French, Bar Lounge","French, Bistro","French, Brasserie","French, Cafe","French, Contemporary","French, Fine Dining","French, Wine Bar","French-American","French-American Fusion","French-Mediterranean","Contemporary French","Modern French","Franco-Japanese Fusion","Pastries, French","Cafe, French"],
    "Italian":["Italian","Italian Fine Dining","Italian Casual","Italian Pasta","Italian Pasta Bar","Italian Pizza","Italian Wine Bar","Italian, Contemporary","Italian, Seafood","Italian, Trattoria","Italian-American","Italian-Ligurian","Italian-Mediterranean","Italian-Mediterranean Cafe","Italian-Piedmont","Italian-Roman","Italian-Sicilian","Italian-Venetian","Italian Bakery","Mediterranean-Italian","Roman Italian","Southern Italian","Sicilian Pizza","Modern Italian"],
    "Japanese":["Japanese","Japanese Omakase","Japanese Sushi","Japanese Kaiseki","Japanese Ramen","Japanese Robata","Japanese Modern","Japanese Hand Rolls","Japanese Steakhouse","Japanese Tea Cafe","Japanese, Cafe","Japanese, Sushi","Japanese-Inspired Café","Japanese-Korean Fusion","Japanese-Kosher","Japanese-Kosher Fusion","Japanese-Peruvian","Japanese-Peruvian Fusion","Nikkei Fusion"],
    "Mediterranean":["Mediterranean","Mediterranean Bakery","Mediterranean-Asian Fusion","Mediterranean-Kosher Fusion","Mediterranean-Middle Eastern","MediterrAsian","Latin-Asian-Mediterranean","Israeli, Mediterranean","Israeli-Mediterranean","Israeli Farm-to-Table","Israeli-Middle Eastern","Greek","Greek Mediterranean"],
    "American":["American","American, Bistro","American-Mediterranean","New American","New American / Mediterranean-Asian Fusion","New York-Contemporary","Farm-to-Table"],
    "Steakhouse":["Steakhouse","Argentine Steakhouse","Korean Steakhouse","Kosher Steakhouse"],
    "Seafood":["Seafood","Seafood Fine Dining"],
    "Asian":["Asian Fusion","Asian-Latin Fusion","Korean-Contemporary","Vietnamese Modern","Chinese"],
    "Latin & Mexican":["Mexican","Mexican Fine Dining","Cuban Cafe","Latin American","Latin American Brunch","Brazilian","Vegetarian-Latin"],
    "Spanish":["Spanish","Spanish, Cafe","Basque","Basque, Spanish","Portuguese, Bistro","Croatian"],
    "Middle Eastern":["Lebanese","Middle Eastern","Modern Middle Eastern","Egyptian","Moroccan, North African"],
    "Cafe & Bakery":["Cafe","Cafe & Market","Cafe, Coffee","Cafe, Contemporary","Cafe, Nordic","Cafe, Pastries","Café","Coffee & Juice","Coffee & Pastries","Specialty Coffee","Bakery, Pastries","Artisan Bakery","European Bakery","Patisserie","Cookies & Desserts","Dessert & Ice Cream","Bagels & Breakfast","Brunch & Coffee","Breakfast & Brunch","Healthy Brunch","Health & Juice Bar","Pastries, Contemporary"],
    "Contemporary":["Contemporary","Contemporary Global","International Bistro","International Modern","Modern Bistro","Modern European","Nordic-Contemporary","Scandinavian","Austrian Modern","Russian-Fine Dining","Cocktail Bar & Bites","Multi-Cuisine","Jewish","Kosher"]
  };
  var cuisineGroupLookup={};Object.keys(CUISINE_MAP).forEach(function(group){CUISINE_MAP[group].forEach(function(c){cuisineGroupLookup[c]=group})});
  /* Add grouped cuisine to each restaurant */
  restaurants.forEach(function(r){r.cuisineGroup=cuisineGroupLookup[r.cuisine]||"Other"});
  var cuisineGroups=["Cuisine"].concat(Object.keys(CUISINE_MAP).filter(function(g){return restaurants.some(function(r){return r.cuisineGroup===g})}));
  var vibes=["Vibe"].concat([...new Set(restaurants.map(function(r){return r.vibe}).filter(Boolean))].sort());
  var prices=["Price","$","$$","$$$","$$$$"];

  function cityMatch(loc,filter){if(filter==="Paris")return loc==="Paris";return loc!=="Paris"}

  var filtered=restaurants.filter(function(r){
    if(city!=="All Cities"&&!cityMatch(r.loc,city))return false;
    if(cuisine!=="Cuisine"&&r.cuisineGroup!==cuisine)return false;
    if(price!=="Price"&&r.price!==price)return false;
    if(vibe!=="Vibe"&&r.vibe!==vibe)return false;
    return true;
  });

  if(sort==="Rating")filtered=filtered.slice().sort(function(a,b){return b.rating-a.rating});
  else if(sort==="Price: Low")filtered=filtered.slice().sort(function(a,b){return a.priceLevel-b.priceLevel});
  else if(sort==="Price: High")filtered=filtered.slice().sort(function(a,b){return b.priceLevel-a.priceLevel});
  else if(sort==="Most Reviewed")filtered=filtered.slice().sort(function(a,b){return b.reviews-a.reviews});

  var activeFilters=[city!=="All Cities"?city:null,cuisine!=="Cuisine"?cuisine:null,price!=="Price"?price:null,vibe!=="Vibe"?vibe:null].filter(Boolean);
  var clearAll=function(){setCity("All Cities");setCuisine("Cuisine");setPrice("Price");setVibe("Vibe")};

  var inputS={padding:"12px 16px",borderRadius:12,background:C.el,border:"1px solid "+C.bd,color:C.s1,...sf(14),outline:"none",width:"100%"};
  var iconCuisine=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>;
  var iconPrice=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
  var iconVibe=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/><circle cx="12" cy="12" r="4"/></svg>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <SEOHead {...SEO.dining}/>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.6);cursor:pointer}
.d-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1060px;margin:0 auto;padding:0 40px}
.search-bar{display:grid;grid-template-columns:1fr 1fr auto auto;gap:12px}
.filter-row{display:flex;gap:6px;align-items:center;overflow:visible;flex:1;min-width:0;flex-wrap:wrap}
@media(max-width:1024px){.d-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){
  .d-grid{grid-template-columns:1fr;padding:0 16px!important;max-width:100%!important;margin:0 auto}
  .d-hero{height:340px!important}
  .d-title{font-size:36px!important}
  .search-bar{grid-template-columns:1fr 1fr!important}
  .filter-row{flex-wrap:nowrap!important;overflow:visible!important;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:4px}
  .filter-row::-webkit-scrollbar{display:none}
}
@media(max-width:390px){.d-hero{height:280px!important}.d-title{font-size:28px!important}.search-bar{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <a href="/catalog" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Catalog</a>
          <div style={{...sf(12,500),color:C.s1}}>Dining</div>
        </div>
      </nav>

      {/* Header */}
      <div style={{paddingTop:100,paddingBottom:40,textAlign:"center",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1)"}}>
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:16}}>Alfred Concierge</p>
        <h1 className="d-title" style={{...sf(48,700),letterSpacing:-2,lineHeight:1.06,marginBottom:12}}>Dining</h1>
        <p style={{...sf(16,400),color:C.s5}}>The world's best tables — reserved for you.</p>
      </div>

      {/* Search Bar */}
      <div style={{maxWidth:1060,margin:"0 auto",padding:"0 40px",position:"relative",zIndex:60}}>
        <div style={{borderRadius:24,background:C.el,border:"1px solid "+C.bd,padding:"24px 28px"}}>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)",marginTop:-24,marginLeft:-28,marginRight:-28,marginBottom:20}}/>
          <div className="search-bar">
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Location</label>
              <FilterDrop value={city} options={cities} onChange={setCity} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Date</label>
              <DarkDatePicker value={date} onChange={function(v){setDate(v)}} label="Date"/>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Guests</label>
              <div style={{display:"flex",alignItems:"center",gap:0,marginTop:0,borderRadius:12,overflow:"hidden",border:"1px solid "+C.bd}}>
                {["2","4","6","8+"].map(function(g,gi){var active=guests===g;return <div key={g} onClick={function(){setGuests(g)}} style={{padding:"11px 14px",background:active?"rgba(244,244,245,0.06)":"transparent",borderLeft:gi>0?"1px solid "+C.bd:"none",cursor:"pointer",...sf(13,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{g}</div>})}
              </div>
            </div>
            <div>
              <label style={{display:"block",...sf(9,600),color:"transparent",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8,userSelect:"none"}}>.</label>
              <div style={{padding:"12px 24px",borderRadius:12,background:C.s1,cursor:"pointer",...sf(13,600),color:C.bg,transition:"transform 0.3s",whiteSpace:"nowrap"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-1px)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)"}}>
                Search
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{maxWidth:1060,margin:"0 auto",padding:"28px 40px 0",position:"relative",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:24,position:"relative",zIndex:50}}>
          <div className="filter-row">
            <FilterDrop value={cuisine} options={cuisineGroups} onChange={setCuisine} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>}/>
            <FilterDrop value={price} options={prices} onChange={setPrice} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}/>
            <FilterDrop value={vibe} options={vibes} onChange={setVibe} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>}/>
            <div style={{width:1,height:20,background:C.bd,flexShrink:0}}/>
            <FilterDrop value={sort} options={SORT_OPTIONS} onChange={setSort} icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M6 12h12M9 18h6"/></svg>}/>
          </div>
        </div>
        {activeFilters.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:24}}>
          {activeFilters.map(function(f){return <span key={f} style={{...sf(11,500),color:C.s1,padding:"5px 12px",borderRadius:8,background:"rgba(244,244,245,0.06)",border:"1px solid rgba(244,244,245,0.1)"}}>{f}</span>})}
          {activeFilters.length>1&&<span onClick={clearAll} style={{...sf(11,500),color:C.s5,padding:"5px 12px",borderRadius:8,cursor:"pointer",transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Clear all</span>}
        </div>}
      </div>

      {/* Grid */}
      <div ref={gridRef} className="d-grid" style={{paddingBottom:80}}>
        {fetching?(
          <div style={{gridColumn:"1 / -1",textAlign:"center",padding:"60px 20px",...sf(13),color:C.s6,letterSpacing:2}}>Loading restaurants...</div>
        ):filtered.length===0?(
          <div style={{gridColumn:"1 / -1",textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:40,marginBottom:16}}>🍽</div>
            <h3 style={{...sf(20,600),color:C.s3,marginBottom:8}}>No restaurants match</h3>
            <p style={{...sf(14),color:C.s5,marginBottom:24}}>Try adjusting your filters or location.</p>
            <div onClick={clearAll} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"12px 24px",borderRadius:12,border:"1px solid "+C.bd,cursor:"pointer",...sf(13,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>Clear all filters</div>
          </div>
        ):filtered.map(function(r,i){return <RestCard key={r.name} r={r} i={i} vis={gridVis}/>})}
      </div>

      {/* CTA */}
      <section ref={ctaRef} style={{padding:"100px 0 120px",position:"relative"}}><div style={ecDiv}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Concierge</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:16,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Looking for<br/>something specific?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Tell Alfred what you're craving. Private rooms, chef's tables, last-minute Michelin — we make it happen.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.4s"}}>
            <div onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm looking for a specific dining experience. Could you help arrange a reservation?"),"_blank")}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:14,background:C.s1,...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Ask Alfred</div>
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
