import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SEOHead from "../components/SEOHead";
import CatalogSeoBody from "../components/CatalogSeoBody";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gd:"#FFD60A"};

function Mark(p){return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><text x="50" y="80" textAnchor="middle" fontFamily="'Times New Roman','Didot','Bodoni 72',Georgia,serif" fontSize="92" fontStyle="italic" fontWeight="500" fill={p.color||C.s1}>A</text></svg>)}

function HotelCard({hotel}){
  var [hover,setHover]=useState(false);
  var href="/catalog/hotels/"+(hotel.slug||hotel.id);
  return(
    <a href={href} onClick={function(){try{sessionStorage.setItem("alfred_hotel_"+(hotel.slug||hotel.id),JSON.stringify(hotel))}catch(e){}}} onMouseEnter={function(){setHover(true)}} onMouseLeave={function(){setHover(false)}}
      style={{display:"block",textDecoration:"none",borderRadius:18,overflow:"hidden",background:C.el,border:"1px solid "+C.bd,cursor:"pointer",transition:"all 0.3s",transform:hover?"translateY(-4px)":"none",boxShadow:hover?"0 12px 40px rgba(0,0,0,0.3)":"none"}}>
      <div style={{position:"relative",height:220,overflow:"hidden"}}>
        <img src={hotel.hero_image_url||""} alt={hotel.name} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s",transform:hover?"scale(1.05)":"scale(1)"}}/>
        {hotel.status==="coming_soon"&&<div style={{position:"absolute",top:12,left:12,padding:"4px 11px",borderRadius:20,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",border:"0.5px solid rgba(255,255,255,0.12)",...sf(10,600),color:C.s1,letterSpacing:1}}>COMING SOON</div>}
        <div style={{position:"absolute",top:12,right:12,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",...sf(11,600),color:C.s1}}>{"★".repeat(hotel.star_rating||5)}</div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:"linear-gradient(transparent,rgba(0,0,0,0.7))"}}/>
      </div>
      <div style={{padding:"16px 18px"}}>
        <h3 style={{...sf(16,600),color:C.s1,margin:"0 0 4px"}}>{hotel.name}</h3>
        <p style={{...sf(12),color:C.s5,margin:"0 0 10px"}}>{hotel.neighborhood}{hotel.city&&hotel.city!=="Miami"?" · "+hotel.city:""}</p>
        {hotel.amenities&&hotel.amenities.length>0&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
            {hotel.amenities.slice(0,4).map(function(a){return <span key={a} style={{...sf(10,500),padding:"3px 8px",borderRadius:6,background:C.srf,border:"1px solid "+C.bd,color:C.s4}}>{a}</span>})}
            {hotel.amenities.length>4&&<span style={{...sf(10),color:C.s5}}>+{hotel.amenities.length-4}</span>}
          </div>
        )}
        {hotel.perks&&hotel.perks.length>0&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {hotel.perks.slice(0,2).map(function(p){return <span key={p} style={{...sf(10,500),padding:"3px 8px",borderRadius:6,background:C.gn+"10",color:C.gn+"E6"}}>{p}</span>})}
            {hotel.perks.length>2&&<span style={{...sf(10),color:C.s4}}>+{hotel.perks.length-2} more</span>}
          </div>
        )}
      </div>
    </a>
  );
}

export default function HotelsPage(){
  var [searchParams,setSearchParams]=useSearchParams();
  var [hotels,setHotels]=useState([]);
  var [loading,setLoading]=useState(true);
  var [search,setSearch]=useState("");
  var [city,setCity]=useState(searchParams.get("city")||"");
  var [hood,setHood]=useState("");
  var [status,setStatus]=useState("");
  var [visibleCount,setVisibleCount]=useState(24);
  var [isMobile,setIsMobile]=useState(typeof window!=="undefined"&&window.innerWidth<=768);

  useEffect(function(){
    function resize(){setIsMobile(window.innerWidth<=768)}
    window.addEventListener("resize",resize);
    return function(){window.removeEventListener("resize",resize)};
  },[]);

  useEffect(function(){
    supabase.from("accommodations").select("*").neq("is_active",false).order("name").then(function(res){
      setHotels(res.data||[]);setLoading(false);
    });
  },[]);

  useEffect(function(){
    var p={};
    if(city)p.city=city;
    setSearchParams(p,{replace:true});
  },[city]);

  var cityOptions=["Miami","Paris","Ibiza","Saint-Tropez","Mykonos","Dubai","London"];
  var neighborhoods=[...new Set(hotels.map(function(h){return h.neighborhood}).filter(Boolean))].sort();
  var filtered=hotels.filter(function(h){
    if(search){var s=search.toLowerCase();if(!(h.name||"").toLowerCase().includes(s)&&!(h.neighborhood||"").toLowerCase().includes(s))return false;}
    if(city){
      var hCity=(h.city||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
      var wanted=city.toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
      if(hCity!==wanted&&hCity.indexOf(wanted+" ")!==0&&hCity.indexOf(" "+wanted)===-1)return false;
    }
    if(hood&&h.neighborhood!==hood)return false;
    if(status==="open"&&h.status!=="open")return false;
    if(status==="coming_soon"&&h.status!=="coming_soon")return false;
    return true;
  });
  useEffect(function(){setVisibleCount(24)},[search,city,hood,status]);
  var visibleHotels=filtered.slice(0,visibleCount);

  return(
    <div style={{minHeight:"100vh",background:C.bg}}>
      <SEOHead
        title="Hotels in Miami, Paris, Ibiza & More | Alfred Concierge"
        description="Browse hotels in Miami, Paris, Ibiza, Saint-Tropez, Mykonos, Dubai and London. Request current rates, availability and provider terms through Alfred Concierge."
        keywords="luxury hotels, Miami hotels, Paris hotels, Ibiza hotels, Saint Tropez hotels, Mykonos hotels, Dubai hotels, London hotels, Alfred concierge"
        path="/catalog/hotels"
        image="/og-hotels.jpg"
        jsonLd={{
          "@context":"https://schema.org",
          "@type":"CollectionPage",
          "name":"Luxury Hotels",
          "url":"https://alfredconcierge.app/catalog/hotels",
          "description":"Browse hotel listings across Alfred's destinations and request current rates, availability, eligible benefits and provider terms.",
          "breadcrumb":{"@type":"BreadcrumbList","itemListElement":[
            {"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app/"},
            {"@type":"ListItem","position":2,"name":"Hotels","item":"https://alfredconcierge.app/catalog/hotels"}
          ]}
        }}
      />
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:isMobile?"16px 20px":"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(10,10,11,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(44,44,49,0.3)"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <a href="/catalog" style={{...sf(12,500),color:C.s4,textDecoration:"none",letterSpacing:1}}>Back to Catalog</a>
      </nav>

      <div style={{padding:isMobile?"90px 20px 40px":"110px 40px 60px",maxWidth:1200,margin:"0 auto"}}>
        <h1 style={{...sf(isMobile?28:40,700),color:C.s1,marginBottom:8}}>Luxury Hotels</h1>
        <p style={{...sf(isMobile?14:16),color:C.s5,marginBottom:32}}>Browse {hotels.length||"our selection of"} hotels and resorts across Alfred's destinations. Request current rates, eligible benefits, availability and provider terms from the concierge.</p>

        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:28,alignItems:"center"}}>
          <input placeholder="Search hotels..." value={search} onChange={function(e){setSearch(e.target.value)}}
            style={{flex:"1 1 200px",maxWidth:320,padding:"10px 16px",borderRadius:12,border:"1px solid "+C.bd,background:C.srf,...sf(14),color:C.s1,outline:"none"}}/>
          <select value={city} onChange={function(e){setCity(e.target.value);setHood("")}}
            style={{padding:"10px 14px",borderRadius:12,border:"1px solid "+C.bd,background:C.srf,...sf(13),color:C.s3,outline:"none",appearance:"auto"}}>
            <option value="">All Cities</option>
            {cityOptions.map(function(n){return <option key={n} value={n}>{n}</option>})}
          </select>
          <select value={hood} onChange={function(e){setHood(e.target.value)}}
            style={{padding:"10px 14px",borderRadius:12,border:"1px solid "+C.bd,background:C.srf,...sf(13),color:C.s3,outline:"none",appearance:"auto"}}>
            <option value="">All Neighborhoods</option>
            {neighborhoods.map(function(n){return <option key={n} value={n}>{n}</option>})}
          </select>
          <select value={status} onChange={function(e){setStatus(e.target.value)}}
            style={{padding:"10px 14px",borderRadius:12,border:"1px solid "+C.bd,background:C.srf,...sf(13),color:C.s3,outline:"none",appearance:"auto"}}>
            <option value="">All</option>
            <option value="open">Open Now</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
          <span style={{...sf(13),color:C.s5}}>{filtered.length} hotel{filtered.length!==1?"s":""}</span>
        </div>

        {loading?<div style={{padding:"80px",textAlign:"center",...sf(14),color:C.s5}}>Loading hotels...</div>:(
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(320px,1fr))",gap:20}}>
            {visibleHotels.map(function(h){
              return <HotelCard key={h.id} hotel={h}/>;
            })}
          </div>
        )}
        {!loading&&visibleCount<filtered.length&&<div style={{display:"flex",justifyContent:"center",marginTop:32}}>
          <button type="button" onClick={function(){setVisibleCount(function(n){return n+24})}} style={{padding:"13px 24px",borderRadius:12,border:"1px solid "+C.bd,background:C.el,color:C.s2,cursor:"pointer",...sf(13,600)}}>
            Show more hotels ({filtered.length-visibleCount} remaining)
          </button>
        </div>}
      </div>

      <CatalogSeoBody category="hotels"/>
    </div>
  );
}
