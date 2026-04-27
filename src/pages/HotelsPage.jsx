import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gd:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}

function HotelCard({hotel,onClick}){
  var [hover,setHover]=useState(false);
  return(
    <div onClick={onClick} onMouseEnter={function(){setHover(true)}} onMouseLeave={function(){setHover(false)}}
      style={{borderRadius:18,overflow:"hidden",background:C.el,border:"1px solid "+C.bd,cursor:"pointer",transition:"all 0.3s",transform:hover?"translateY(-4px)":"none",boxShadow:hover?"0 12px 40px rgba(0,0,0,0.3)":"none"}}>
      <div style={{position:"relative",height:220,overflow:"hidden"}}>
        <img src={hotel.hero_image_url||""} alt={hotel.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s",transform:hover?"scale(1.05)":"scale(1)"}}/>
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
    </div>
  );
}

export default function HotelsPage(){
  var nav=useNavigate();
  var [hotels,setHotels]=useState([]);
  var [loading,setLoading]=useState(true);
  var [search,setSearch]=useState("");
  var [hood,setHood]=useState("");
  var [status,setStatus]=useState("");
  var [isMobile,setIsMobile]=useState(typeof window!=="undefined"&&window.innerWidth<=768);

  useEffect(function(){
    function resize(){setIsMobile(window.innerWidth<=768)}
    window.addEventListener("resize",resize);
    return function(){window.removeEventListener("resize",resize)};
  },[]);

  useEffect(function(){
    supabase.from("accommodations").select("*").order("name").then(function(res){
      setHotels(res.data||[]);setLoading(false);
    });
  },[]);

  var neighborhoods=[...new Set(hotels.map(function(h){return h.neighborhood}).filter(Boolean))].sort();
  var filtered=hotels.filter(function(h){
    if(search){var s=search.toLowerCase();if(!(h.name||"").toLowerCase().includes(s)&&!(h.neighborhood||"").toLowerCase().includes(s))return false;}
    if(hood&&h.neighborhood!==hood)return false;
    if(status==="open"&&h.status!=="open")return false;
    if(status==="coming_soon"&&h.status!=="coming_soon")return false;
    return true;
  });

  useEffect(function(){
    document.title="Luxury Hotels Miami — 5-Star Accommodations | Alfred Concierge";
    var meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute("content","Browse 57 luxury hotels in Miami. Five-star beachfront resorts, boutique hotels, and urban retreats. Book through Alfred Concierge for exclusive perks and upgrades.");
  },[]);

  return(
    <div style={{minHeight:"100vh",background:C.bg}}>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:isMobile?"16px 20px":"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(10,10,11,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(44,44,49,0.3)"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <a href="/catalog" style={{...sf(12,500),color:C.s4,textDecoration:"none",letterSpacing:1}}>Back to Catalog</a>
      </nav>

      <div style={{padding:isMobile?"90px 20px 40px":"110px 40px 60px",maxWidth:1200,margin:"0 auto"}}>
        <h1 style={{...sf(isMobile?28:40,700),color:C.s1,marginBottom:8}}>Luxury Hotels</h1>
        <p style={{...sf(isMobile?14:16),color:C.s5,marginBottom:32}}>{hotels.length||"50+"} luxury hotels and resorts in Miami. Book through Alfred for exclusive perks, room upgrades, and VIP treatment.</p>

        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:28,alignItems:"center"}}>
          <input placeholder="Search hotels..." value={search} onChange={function(e){setSearch(e.target.value)}}
            style={{flex:"1 1 200px",maxWidth:320,padding:"10px 16px",borderRadius:12,border:"1px solid "+C.bd,background:C.srf,...sf(14),color:C.s1,outline:"none"}}/>
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
            {filtered.map(function(h){
              return <HotelCard key={h.id} hotel={h} onClick={function(){
                sessionStorage.setItem("alfred_hotel_"+h.slug,JSON.stringify(h));
                nav("/catalog/hotels/"+(h.slug||h.id));
              }}/>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
