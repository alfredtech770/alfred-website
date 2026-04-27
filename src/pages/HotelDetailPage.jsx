import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gd:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}

export default function HotelDetailPage(){
  var {slug}=useParams();
  var nav=useNavigate();
  var [hotel,setHotel]=useState(null);
  var [loading,setLoading]=useState(true);
  var [imgIdx,setImgIdx]=useState(0);
  var [isMobile,setIsMobile]=useState(typeof window!=="undefined"&&window.innerWidth<=768);

  useEffect(function(){
    function resize(){setIsMobile(window.innerWidth<=768)}
    window.addEventListener("resize",resize);
    return function(){window.removeEventListener("resize",resize)};
  },[]);

  useEffect(function(){
    // Try sessionStorage first
    var cached=null;
    try{cached=JSON.parse(sessionStorage.getItem("alfred_hotel_"+slug))}catch(e){}
    if(cached){setHotel(cached);setLoading(false);return;}
    // Fallback to Supabase
    supabase.from("accommodations").select("*").eq("slug",slug).single().then(function(res){
      if(res.data){setHotel(res.data)}
      setLoading(false);
    });
  },[slug]);

  useEffect(function(){
    if(!hotel)return;
    document.title=hotel.name+" — Luxury Hotel Miami | Alfred Concierge";
    var meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute("content",(hotel.description||hotel.name+" — 5-star luxury hotel in "+hotel.neighborhood+", Miami. Book through Alfred Concierge for exclusive perks and upgrades.").slice(0,160));
  },[hotel]);

  if(loading)return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",...sf(16),color:C.s5}}>Loading...</div>;
  if(!hotel)return <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}><p style={{...sf(18),color:C.s3}}>Hotel not found</p><button onClick={function(){nav("/catalog/hotels")}} style={{padding:"12px 24px",borderRadius:12,border:"1px solid "+C.bd,background:C.srf,...sf(14,500),color:C.s3,cursor:"pointer"}}>Browse Hotels</button></div>;

  var V=hotel;
  var imgs=[V.hero_image_url].concat(V.photos_order||[]).filter(function(v,i,a){return v&&a.indexOf(v)===i});

  return(
    <div style={{minHeight:"100vh",background:C.bg}}>
      {/* Nav */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:isMobile?"16px 20px":"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(10,10,11,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(44,44,49,0.3)"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <button onClick={function(){nav("/catalog/hotels")}} style={{...sf(12,500),color:C.s4,background:"none",border:"none",cursor:"pointer",letterSpacing:1}}>All Hotels</button>
      </nav>

      {/* Hero Carousel */}
      <div style={{position:"relative",height:isMobile?"50vh":"60vh",overflow:"hidden",marginTop:60}}>
        <img src={imgs[imgIdx]||""} alt={V.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"opacity 0.5s"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"50%",background:"linear-gradient(transparent,rgba(10,10,11,0.9))"}}/>
        {imgs.length>1&&(
          <div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8}}>
            {imgs.map(function(_,i){return <button key={i} onClick={function(){setImgIdx(i)}} style={{width:i===imgIdx?24:8,height:8,borderRadius:4,background:i===imgIdx?C.s1:"rgba(255,255,255,0.3)",border:"none",cursor:"pointer",transition:"all 0.3s"}}/>})}
          </div>
        )}
        {imgs.length>1&&<>
          <button onClick={function(){setImgIdx(function(c){return c>0?c-1:imgs.length-1})}} style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",width:40,height:40,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <button onClick={function(){setImgIdx(function(c){return c<imgs.length-1?c+1:0})}} style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",width:40,height:40,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
        </>}
        {V.status==="coming_soon"&&<div style={{position:"absolute",top:80,left:isMobile?20:40,padding:"6px 16px",borderRadius:20,background:C.gd,...sf(12,700),color:"#000",letterSpacing:1}}>COMING SOON</div>}
      </div>

      {/* Content */}
      <div style={{maxWidth:900,margin:"0 auto",padding:isMobile?"24px 20px 60px":"40px 40px 80px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:16,marginBottom:24}}>
          <div>
            <h1 style={{...sf(isMobile?28:36,700),color:C.s1,margin:"0 0 8px"}}>{V.name}</h1>
            <p style={{...sf(14),color:C.s5,margin:0}}>{V.neighborhood}, {V.city||"Miami"} · {"★".repeat(V.star_rating||5)} · {V.category==="resort"?"Resort":"Hotel"}</p>
          </div>
          <a href="https://wa.me/447449562204" target="_blank" rel="noopener noreferrer"
            style={{padding:"14px 28px",borderRadius:14,background:C.gd,border:"none",...sf(15,700),color:"#000",textDecoration:"none",whiteSpace:"nowrap",transition:"opacity 0.2s"}}
            onMouseEnter={function(e){e.currentTarget.style.opacity="0.85"}}
            onMouseLeave={function(e){e.currentTarget.style.opacity="1"}}>
            Book via Concierge
          </a>
        </div>

        {V.description&&<p style={{...sf(isMobile?15:16),color:C.s3,lineHeight:1.8,marginBottom:32}}>{V.description}</p>}

        {/* Amenities */}
        {V.amenities&&V.amenities.length>0&&(
          <div style={{marginBottom:32}}>
            <h2 style={{...sf(18,600),color:C.s2,marginBottom:14}}>Amenities</h2>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {V.amenities.map(function(a){return <span key={a} style={{...sf(13,500),padding:"8px 16px",borderRadius:10,background:C.srf,border:"1px solid "+C.bd,color:C.s3}}>{a}</span>})}
            </div>
          </div>
        )}

        {/* Perks */}
        {V.perks&&V.perks.length>0&&(
          <div style={{marginBottom:32}}>
            <h2 style={{...sf(18,600),color:C.s2,marginBottom:14}}>Alfred Exclusive Perks</h2>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {V.perks.map(function(p){return <span key={p} style={{...sf(13,500),padding:"8px 16px",borderRadius:10,background:C.gd+"10",border:"1px solid "+C.gd+"30",color:C.gd}}>{p}</span>})}
            </div>
          </div>
        )}

        {/* Rooms */}
        {V.rooms&&V.rooms.length>0&&(
          <div style={{marginBottom:32}}>
            <h2 style={{...sf(20,700),color:C.s1,marginBottom:6}}>Rooms & Suites</h2>
            <p style={{...sf(13),color:C.s5,marginBottom:18}}>Tap any room to request the best available rate from your Alfred concierge.</p>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:14}}>
              {V.rooms.map(function(r){
                var msg = encodeURIComponent("Hi Alfred — I'd like to request the best available rate for the "+r.name+" at "+V.name+".");
                return (
                  <a key={r.id} href={"https://wa.me/447449562204?text="+msg} target="_blank" rel="noopener noreferrer"
                    style={{display:"block",borderRadius:14,overflow:"hidden",background:C.el,border:"1px solid "+C.bd,textDecoration:"none",transition:"all 0.2s",cursor:"pointer"}}
                    onMouseEnter={function(e){e.currentTarget.style.borderColor=C.gd+"60";e.currentTarget.style.transform="translateY(-2px)"}}
                    onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.transform="translateY(0)"}}>
                    {r.hero_image_url&&<div style={{height:160,background:"#222",backgroundImage:"url("+r.hero_image_url+")",backgroundSize:"cover",backgroundPosition:"center"}}/>}
                    <div style={{padding:"14px 16px"}}>
                      <h3 style={{...sf(16,700),color:C.s1,margin:"0 0 4px"}}>{r.name}</h3>
                      <p style={{...sf(12),color:C.s5,margin:"0 0 10px",lineHeight:1.5}}>
                        {r.bed_config}
                        {r.max_guests?" · "+r.max_guests+" guests":""}
                        {r.size_sqft?" · "+r.size_sqft+" sq ft":""}
                        {r.view?" · "+r.view+" view":""}
                      </p>
                      {r.description&&<p style={{...sf(13),color:C.s3,margin:"0 0 12px",lineHeight:1.6}}>{r.description}</p>}
                      <span style={{...sf(12,700),color:C.gd}}>Request rate via WhatsApp →</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags */}
        {V.tags&&V.tags.length>0&&(
          <div style={{marginBottom:32}}>
            <h2 style={{...sf(18,600),color:C.s2,marginBottom:14}}>Tags</h2>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {V.tags.map(function(t){return <span key={t} style={{...sf(11,500),padding:"4px 12px",borderRadius:20,background:C.el,border:"1px solid "+C.bd,color:C.s4,textTransform:"capitalize"}}>{t.replace(/-/g," ")}</span>})}
            </div>
          </div>
        )}

        {/* Details */}
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"24px",marginBottom:32}}>
          <h2 style={{...sf(18,600),color:C.s2,marginBottom:16}}>Details</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {V.address&&<div><span style={{...sf(11),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Address</span><p style={{...sf(14),color:C.s3,margin:"4px 0 0"}}>{V.address}</p></div>}
            {V.neighborhood&&<div><span style={{...sf(11),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Neighborhood</span><p style={{...sf(14),color:C.s3,margin:"4px 0 0"}}>{V.neighborhood}</p></div>}
            {V.opening_date&&<div><span style={{...sf(11),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Opening</span><p style={{...sf(14),color:C.s3,margin:"4px 0 0"}}>{V.opening_date}</p></div>}
            {V.website_url&&<div><span style={{...sf(11),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Website</span><p style={{...sf(14),margin:"4px 0 0"}}><a href={V.website_url} target="_blank" rel="noopener noreferrer" style={{color:C.gd,textDecoration:"none"}}>{V.website_url.replace("https://","").replace("www.","")}</a></p></div>}
          </div>
        </div>

        {/* CTA */}
        <div style={{textAlign:"center",padding:"40px 20px",background:C.el,border:"1px solid "+C.bd,borderRadius:20}}>
          <p style={{...sf(18,600),color:C.s1,marginBottom:8}}>Ready to book {V.name}?</p>
          <p style={{...sf(14),color:C.s5,marginBottom:20}}>Your Alfred concierge will secure the best rate, room upgrade, and exclusive perks.</p>
          <a href="https://wa.me/447449562204" target="_blank" rel="noopener noreferrer"
            style={{display:"inline-block",padding:"16px 36px",borderRadius:14,background:C.gd,...sf(16,700),color:"#000",textDecoration:"none"}}>
            Contact Concierge on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
