import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DarkDatePicker from "../components/DarkDatePicker";
import SEOHead from "../components/SEOHead";
import { supabase } from "../lib/supabase";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

export default function HotelDetailPage(){
  var {slug}=useParams();
  var nav=useNavigate();
  var [hotel,setHotel]=useState(null);
  var [loading,setLoading]=useState(true);
  var [idx,setIdx]=useState(0);
  var [lightbox,setLightbox]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [loaded,setLoaded]=useState(false);
  var [date,setDate]=useState("2026-05-15");
  var [nights,setNights]=useState("3");
  var [guests,setGuests]=useState("2");

  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var factsRef=useRef(null);var factsVis=useVis(factsRef);
  var roomsRef=useRef(null);var roomsVis=useVis(roomsRef);
  var amenRef=useRef(null);var amenVis=useVis(amenRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);

  useEffect(function(){
    setLoading(true);
    supabase.from("accommodations").select("*").eq("slug",slug).single().then(function(res){
      if(res.data)setHotel(res.data);
      setLoading(false);
    });
  },[slug]);

  useEffect(function(){
    if(!hotel)return;
    document.title=hotel.name+" — Luxury Hotel Miami | Alfred Concierge";
    var meta=document.querySelector('meta[name="description"]');
    if(meta)meta.setAttribute("content",(hotel.description||hotel.name+" — luxury hotel in "+hotel.neighborhood+", Miami. Book through Alfred Concierge for exclusive perks and upgrades.").slice(0,160));
  },[hotel]);

  // Build images list
  var imgs=hotel?[hotel.hero_image_url].concat(hotel.photos_order||[]).filter(function(v,i,a){return v&&a.indexOf(v)===i}):[];

  // Auto-rotate carousel
  useEffect(function(){
    if(imgs.length<=1)return;
    var t=setInterval(function(){setIdx(function(c){return(c+1)%imgs.length})},5000);
    return function(){clearInterval(t)};
  },[hotel,imgs.length]);

  if(loading){
    return(<div style={{width:"100%",minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{color:C.s5,...sf(14)}}>Loading…</span>
    </div>);
  }
  if(!hotel){
    return(<div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <p style={{...sf(18),color:C.s3}}>Hotel not found</p>
      <button onClick={function(){nav("/catalog/hotels")}} style={{padding:"12px 24px",borderRadius:12,border:"1px solid "+C.bd,background:C.srf,...sf(14,500),color:C.s3,cursor:"pointer"}}>Browse Hotels</button>
    </div>);
  }

  var V=hotel;
  var navOp=Math.min(scrollY/250,1);
  var heroY=scrollY*0.25;
  var heroScale=1+scrollY*0.0003;
  var secDiv=<div style={{height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)"}}/>;
  var waMsg=encodeURIComponent("Hi Alfred, I'd like to arrange a stay at "+V.name+". Could you help with availability and the best rate?");
  var waHref="https://wa.me/447449562204?text="+waMsg;
  var stars=V.star_rating||5;
  var category=V.category==="resort"?"Resort":"Hotel";

  var facts=[
    {icon:"★",label:"Rating",value:stars+" stars"},
    {icon:"◎",label:"Neighborhood",value:V.neighborhood||"Miami"},
    {icon:"❖",label:"Category",value:category},
    {icon:V.status==="coming_soon"?"⏳":"●",label:V.status==="coming_soon"?"Opening":"Status",value:V.status==="coming_soon"?(V.opening_date||"Soon"):"Open now"},
  ];

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <SEOHead
        title={V.name+" — Luxury Hotel "+(V.city||"Miami")+" | Alfred Concierge"}
        description={(V.description||V.name+" — luxury hotel in "+(V.neighborhood||"Miami")+". Book through Alfred Concierge for exclusive perks, room upgrades, and VIP treatment.").slice(0,160)}
        image={imgs[0]}
        path={"/catalog/hotels/"+slug}
        jsonLd={[
          {
            "@context":"https://schema.org",
            "@type":V.category==="resort"?"Resort":"Hotel",
            "name":V.name,
            "description":V.description||V.name+" — luxury hotel in "+(V.neighborhood||"Miami"),
            "image":imgs[0],
            "address":V.address?{"@type":"PostalAddress","streetAddress":V.address,"addressLocality":V.city||"Miami","addressCountry":"US"}:undefined,
            "starRating":{"@type":"Rating","ratingValue":stars},
            "url":"https://alfredconcierge.app/catalog/hotels/"+slug,
            ...(V.rooms&&V.rooms.length>0?{"containsPlace":V.rooms.map(function(r){return{"@type":"HotelRoom","name":r.name,"description":r.description,"occupancy":{"@type":"QuantitativeValue","maxValue":r.max_guests}}})}:{})
          },
          {
            "@context":"https://schema.org",
            "@type":"BreadcrumbList",
            "itemListElement":[
              {"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},
              {"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},
              {"@type":"ListItem","position":3,"name":"Hotels","item":"https://alfredconcierge.app/catalog/hotels"},
              {"@type":"ListItem","position":4,"name":V.name,"item":"https://alfredconcierge.app/catalog/hotels/"+slug}
            ]
          }
        ]}
      />
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
.page-wrap{max-width:1060px;margin:0 auto;padding:0 40px}
.two-col{display:flex;gap:40px;align-items:flex-start}
.left-col{flex:1;min-width:0}
.right-col{width:300px;flex-shrink:0;position:sticky;top:80px}
.rooms-g{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:900px){
  .two-col{flex-direction:column!important}
  .right-col{width:100%!important;position:relative!important;top:auto!important}
}
@media(max-width:768px){
  .page-wrap{padding:0 24px!important}
  .hd-hero{height:380px!important}
  .hd-name{font-size:30px!important}
  .facts-g{grid-template-columns:1fr 1fr!important}
  .rooms-g{grid-template-columns:1fr!important}
}
@media(max-width:390px){.hd-hero{height:320px!important}.hd-name{font-size:26px!important}}
      `}</style>

      {/* Grain */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      {/* Nav */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <a href="/catalog/hotels" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>← All Hotels</a>
          <div style={{...sf(12,500),color:C.s1,opacity:Math.min(navOp*2,1),transition:"opacity 0.3s"}}>{V.name}</div>
        </div>
      </nav>

      {/* Lightbox */}
      {lightbox&&imgs.length>0&&<div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.95)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={function(){setLightbox(false)}}>
        <img src={imgs[idx]} alt="" style={{maxWidth:"92vw",maxHeight:"88vh",objectFit:"contain",borderRadius:8}}/>
        <div onClick={function(e){e.stopPropagation();setLightbox(false)}} style={{position:"absolute",top:20,right:20,width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:201}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </div>
        {imgs.length>1&&<>
          <div onClick={function(e){e.stopPropagation();setIdx(function(c){return c===0?imgs.length-1:c-1})}} style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </div>
          <div onClick={function(e){e.stopPropagation();setIdx(function(c){return(c+1)%imgs.length})}} style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
          <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",...sf(13,500),color:"rgba(255,255,255,0.7)"}}>{idx+1} / {imgs.length}</div>
        </>}
      </div>}

      {/* Hero */}
      <section className="hd-hero" style={{height:520,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,transform:"translateY("+heroY+"px) scale("+heroScale+")"}}>
          {imgs.map(function(im,i){return <img key={i} src={im} alt="" onClick={function(){setLightbox(true)}} style={{position:"absolute",inset:0,width:"100%",height:"120%",objectFit:"cover",opacity:i===idx?1:0,transition:"opacity 0.8s ease",cursor:"pointer"}}/>})}
        </div>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0.4) 0%,transparent 30%,rgba(10,10,11,0.5) 60%,#0A0A0B 100%)"}}/>
        {imgs.length>1&&<>
          <div onClick={function(){setIdx(function(c){return c===0?imgs.length-1:c-1})}} style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,backdropFilter:"blur(8px)",transition:"background 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(0,0,0,0.5)"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </div>
          <div onClick={function(){setIdx(function(c){return(c+1)%imgs.length})}} style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,backdropFilter:"blur(8px)",transition:"background 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(0,0,0,0.5)"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
          <div style={{position:"absolute",top:64,right:16,zIndex:10,...sf(11,500),color:"rgba(255,255,255,0.6)",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)"}}>{idx+1} / {imgs.length}</div>
          <div style={{position:"absolute",bottom:48,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:10}}>
            {imgs.map(function(_,i){return <div key={i} onClick={function(){setIdx(i)}} style={{width:i===idx?20:5,height:4,borderRadius:2,background:"rgba(255,255,255,"+(i===idx?"0.85":"0.2")+")",transition:"all 0.3s",cursor:"pointer"}}/>})}
          </div>
        </>}
      </section>

      {/* Two-column */}
      <div className="page-wrap" style={{marginTop:-40,position:"relative",zIndex:10,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)"}}>
        <div className="two-col">

          {/* LEFT */}
          <div className="left-col">
            {/* Title block */}
            <div style={{marginBottom:40}}>
              <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
                <span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:C.s3+"14"}}>{"★".repeat(stars)}</span>
                <span style={{...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F",border:"0.5px solid "+C.gn+"1A"}}>✦ ALFRED VERIFIED</span>
                {V.status==="coming_soon"&&<span style={{...sf(9,600),letterSpacing:0.8,color:C.s2,padding:"4px 10px",borderRadius:8,background:"rgba(255,255,255,0.05)",border:"0.5px solid rgba(255,255,255,0.1)"}}>COMING SOON{V.opening_date?" · "+V.opening_date:""}</span>}
              </div>
              <h1 className="hd-name" style={{...sf(38,700),letterSpacing:-1.5,marginBottom:8}}>{V.name}</h1>
              <p style={{...sf(16,300),color:C.s5,marginBottom:16}}>{V.neighborhood}, {V.city||"Miami"} · {category}</p>
              <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  {[1,2,3,4,5].slice(0,stars).map(function(i){return <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={C.s3} stroke={C.s3} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>})}
                </div>
                <div style={{width:1,height:14,background:C.bd}}/>
                <span style={{...sf(13),color:C.s4}}>{V.neighborhood}</span>
                <div style={{width:1,height:14,background:C.bd}}/>
                <span style={{...sf(13,500),color:C.s4}}>{category}</span>
              </div>
              {V.address&&<div style={{display:"flex",alignItems:"center",gap:7,marginTop:12}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{...sf(12),color:C.s5}}>{V.address}</span>
              </div>}
            </div>

            {/* Alfred's Note (description) */}
            {V.description&&<div ref={noteRef} style={{paddingTop:32,marginBottom:40}}>
              {secDiv}
              <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:noteVis?1:0,transition:"all 0.8s ease"}}>From your concierge</p>
              <div style={{borderRadius:24,border:"1px solid "+C.bd,background:C.el,padding:"36px 32px",position:"relative",overflow:"hidden",opacity:noteVis?1:0,transform:noteVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
                <div style={{position:"absolute",bottom:20,right:24,opacity:0.025}}><Mark size={100} color={C.s1}/></div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
                  <Mark size={18} color={C.s5}/>
                  <span style={{...sf(11,500),color:C.s5,letterSpacing:1}}>Alfred's notes</span>
                  <div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px rgba(52,199,89,0.4)"}}/>
                </div>
                <p style={{...sf(15,400),color:C.s3,lineHeight:1.8,marginBottom:22,position:"relative",zIndex:1}}>{V.description}</p>
                <div style={{height:0.5,background:C.bd,marginBottom:18}}/>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                  <span style={{...sf(13),color:C.s6,marginTop:1}}>✨</span>
                  <span style={{...sf(13),color:C.s5,lineHeight:1.6}}>Mention Alfred at check-in for VIP recognition, room upgrade subject to availability, and the perks listed below.</span>
                </div>
              </div>
            </div>}
          </div>

          {/* RIGHT — Sticky */}
          <div className="right-col">
            <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"visible"}}>
              <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)",borderRadius:"20px 20px 0 0"}}/>
              <div style={{padding:"24px 22px"}}>
                <div style={{...sf(18,700),color:C.s1,marginBottom:20}}>Arrange Your Stay</div>

                {/* Check-in */}
                <div style={{marginBottom:14}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Check-in</div>
                  <DarkDatePicker value={date} onChange={function(v){setDate(v)}} label="Check-in" align="center"/>
                </div>

                {/* Nights */}
                <div style={{marginBottom:14}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Nights</div>
                  <div style={{display:"flex",gap:4}}>
                    {["1","2","3","5","7+"].map(function(n){var active=nights===n;return <div key={n} onClick={function(){setNights(n)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(12,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{n}</div>})}
                  </div>
                </div>

                {/* Guests */}
                <div style={{marginBottom:18}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Guests</div>
                  <div style={{display:"flex",gap:4}}>
                    {["1","2","3","4+"].map(function(g){var active=guests===g;return <div key={g} onClick={function(){setGuests(g)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(13,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{g}</div>})}
                  </div>
                </div>

                {/* Primary CTA */}
                <a href={waHref} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 0",borderRadius:14,background:C.s1,...sf(14,600),color:C.bg,textDecoration:"none",transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                  Arrange Stay
                </a>

                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:14}}>
                  {["No fees","Best rate","VIP perks"].map(function(t,i){return <span key={i} style={{...sf(10),color:C.s6}}>{t}</span>})}
                </div>
              </div>
            </div>

            {/* Availability */}
            {V.status!=="coming_soon"&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderRadius:14,background:C.gn+"08",border:"0.5px solid "+C.gn+"1A",marginTop:12}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px "+C.gn+"66",flexShrink:0}}/>
              <div>
                <div style={{...sf(12,600),color:C.s1}}>Available now</div>
                <div style={{...sf(11),color:C.gn+"CC",marginTop:1}}>Alfred secures the best available rate</div>
              </div>
            </div>}
            {V.status==="coming_soon"&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderRadius:14,background:"rgba(244,244,245,0.04)",border:"0.5px solid "+C.bd,marginTop:12}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.s4,flexShrink:0}}/>
              <div>
                <div style={{...sf(12,600),color:C.s1}}>Opening {V.opening_date||"soon"}</div>
                <div style={{...sf(11),color:C.s5,marginTop:1}}>Priority booking via Alfred</div>
              </div>
            </div>}

            {/* WhatsApp secondary */}
            <a href={waHref} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px 0",borderRadius:14,border:"1px solid "+C.bd,marginTop:10,textDecoration:"none",...sf(12,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              Ask about this hotel
            </a>
          </div>
        </div>
      </div>

      {/* At a Glance */}
      <div ref={factsRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:factsVis?1:0,transition:"all 0.8s ease"}}>At a Glance</p>
        <div className="facts-g" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,opacity:factsVis?1:0,transform:factsVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {facts.map(function(f,i){return(<div key={i} style={{padding:"22px 22px",borderRadius:20,background:C.el,border:"1px solid "+C.bd,transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:16,color:C.s4}}>{f.icon}</span><span style={{...sf(12),color:C.s5}}>{f.label}</span></div>
            <span style={{...sf(15,600),color:C.s1}}>{f.value}</span>
          </div>)})}
        </div>
      </div>

      {/* Rooms & Suites */}
      {V.rooms&&V.rooms.length>0&&<div ref={roomsRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:32,marginBottom:14}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",opacity:roomsVis?1:0,transition:"all 0.8s ease"}}>Rooms & Suites</p>
          <span style={{...sf(12),color:C.s6,opacity:roomsVis?1:0}}>{V.rooms.length} categories</span>
        </div>
        <p style={{...sf(13),color:C.s5,marginBottom:18,opacity:roomsVis?1:0,transition:"all 0.8s ease 0.1s"}}>Tap any room to request the best available rate from your Alfred concierge.</p>
        <div className="rooms-g" style={{opacity:roomsVis?1:0,transform:roomsVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.rooms.map(function(r){
            var msg=encodeURIComponent("Hi Alfred — I'd like to request the best available rate for the "+r.name+" at "+V.name+".");
            return(<a key={r.id} href={"https://wa.me/447449562204?text="+msg} target="_blank" rel="noopener noreferrer" style={{display:"block",borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden",textDecoration:"none",transition:"all 0.4s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.transform="translateY(-4px)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.transform="translateY(0)"}}>
              {r.hero_image_url&&<div style={{height:180,background:"#222 url("+r.hero_image_url+") center/cover"}}/>}
              <div style={{padding:"22px 22px"}}>
                <div style={{...sf(17,700),color:C.s1,marginBottom:6}}>{r.name}</div>
                <div style={{...sf(12),color:C.s5,marginBottom:12,lineHeight:1.5}}>
                  {r.bed_config}
                  {r.max_guests?" · "+r.max_guests+" guests":""}
                  {r.size_sqft?" · "+r.size_sqft+" sq ft":""}
                  {r.view?" · "+r.view+" view":""}
                </div>
                {r.description&&<p style={{...sf(13),color:C.s3,margin:"0 0 14px",lineHeight:1.6}}>{r.description}</p>}
                <span style={{...sf(12,500),color:C.s2,display:"inline-flex",alignItems:"center",gap:6}}>Request rate via WhatsApp <span style={{color:C.s4}}>→</span></span>
              </div>
            </a>);
          })}
        </div>
      </div>}

      {/* What's Included (amenities + perks combined card) */}
      {((V.amenities&&V.amenities.length>0)||(V.perks&&V.perks.length>0))&&<div ref={amenRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:amenVis?1:0,transition:"all 0.8s ease"}}>What's Included</p>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"28px 30px",opacity:amenVis?1:0,transform:amenVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.amenities&&V.amenities.length>0&&<>
            <div style={{...sf(11,600),color:C.s5,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>Amenities</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:V.perks&&V.perks.length>0?22:0}}>
              {V.amenities.map(function(a){return <span key={a} style={{...sf(13,500),padding:"8px 16px",borderRadius:10,background:C.srf,border:"1px solid "+C.bd,color:C.s3}}>{a}</span>})}
            </div>
          </>}
          {V.amenities&&V.amenities.length>0&&V.perks&&V.perks.length>0&&<div style={{height:0.5,background:C.bd,marginBottom:22}}/>}
          {V.perks&&V.perks.length>0&&<>
            <div style={{...sf(11,600),color:C.gn+"CC",letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>✦ Alfred Exclusive Perks</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {V.perks.map(function(p){return <span key={p} style={{...sf(13,500),padding:"8px 16px",borderRadius:10,background:C.gn+"0F",border:"0.5px solid "+C.gn+"22",color:C.gn+"E6"}}>{p}</span>})}
            </div>
          </>}
        </div>
      </div>}

      {/* CTA */}
      <div ref={ctaRef} className="page-wrap" style={{paddingTop:60,paddingBottom:80}}>
        {secDiv}
        <div style={{paddingTop:48,textAlign:"center",opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease"}}>
          <h2 style={{...sf(28,700),letterSpacing:-1,color:C.s1,marginBottom:10}}>Ready to book {V.name}?</h2>
          <p style={{...sf(14),color:C.s5,marginBottom:24,maxWidth:520,margin:"0 auto 24px"}}>Your Alfred concierge will secure the best available rate, room upgrade subject to availability, and every perk listed above.</p>
          <a href={waHref} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"15px 32px",borderRadius:14,background:C.s1,...sf(14,600),color:C.bg,textDecoration:"none",transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
            Contact Alfred on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
