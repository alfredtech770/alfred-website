import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { supabase } from "../lib/supabase";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}

function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

function StarRating(p){
  var full=Math.floor(p.stars||0);
  var half=(p.stars||0)-full>=0.5;
  return(
    <div style={{display:"flex",alignItems:"center",gap:3}}>
      {[1,2,3,4,5].map(function(i){
        var filled=i<=full;
        var isHalf=!filled&&i===full+1&&half;
        return(
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={filled||isHalf?C.gold:"none"} stroke={filled||isHalf?C.gold:C.s7} strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )
      })}
    </div>
  )
}

export default function HotelDetailPage(){
  var{slug}=useParams();
  var[idx,setIdx]=useState(0);
  var[loaded,setLoaded]=useState(false);
  var[scrollY,setScrollY]=useState(0);
  var[hotel,setHotel]=useState(null);
  var[dbLoading,setDbLoading]=useState(true);

  var amenRef=useRef(null);var amenVis=useVis(amenRef);
  var perksRef=useRef(null);var perksVis=useVis(perksRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},150)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);

  useEffect(function(){
    // Try sessionStorage first (for instant load from listing)
    var sess=null;
    try{sess=JSON.parse(sessionStorage.getItem("alfred_hotel_"+slug))}catch(e){}
    if(sess){setHotel(sess);setDbLoading(false);return;}
    // Otherwise fetch from Supabase (direct URL / Google indexing)
    supabase.from("accommodations").select("*").eq("slug",slug).single().then(function(res){
      if(res.data)setHotel(res.data);
      setDbLoading(false);
    });
  },[slug]);

  var navOp=Math.min(scrollY/250,1);
  var heroY=scrollY*0.25;

  if(dbLoading){
    return(
      <div style={{width:"100%",minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{...sf(13),color:C.s6,letterSpacing:2,textTransform:"uppercase"}}>Loading...</div>
      </div>
    );
  }

  if(!hotel){
    return(
      <div style={{width:"100%",minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
        <Mark size={32} color={C.s7}/>
        <h2 style={{...sf(24,600),color:C.s3}}>Hotel not found</h2>
        <p style={{...sf(14),color:C.s5}}>This hotel may have moved or been removed.</p>
        <a href="/catalog/hotels" style={{...sf(13,500),color:C.s1,padding:"12px 24px",borderRadius:12,background:C.el,border:"1px solid "+C.bd,textDecoration:"none",marginTop:8}}>← Back to Hotels</a>
      </div>
    );
  }

  var photos=hotel.photos_order||hotel.gallery_photos||(hotel.hero_image_url?[hotel.hero_image_url]:[]);
  var amenities=hotel.amenities||[];
  var perks=hotel.perks||hotel.alfred_perks||[];
  var isOpen=hotel.status==="open"||hotel.status==null;
  var pl=hotel.price_level||0;
  var priceStr=pl===1?"$":pl===2?"$$":pl===3?"$$$":pl===4?"$$$$":"";
  var waMsg="Hi%20Alfred%2C%20I%27m%20interested%20in%20booking%20"+encodeURIComponent(hotel.name||"a hotel")+" in%20Miami";

  var seoTitle=(hotel.name||"Hotel")+" - Luxury Hotel Miami | Alfred Concierge";
  var seoDesc="Book "+(hotel.name||"a luxury hotel")+" in "+(hotel.neighborhood||"Miami")+" through Alfred Concierge. "+(hotel.tagline||"Exclusive perks and guaranteed upgrades for Alfred members.")+" "+(hotel.star_rating?hotel.star_rating+"-star hotel.":"");

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        path={"/catalog/hotels/"+slug}
        image={hotel.hero_image_url||""}
        type="place"
        jsonLd={[
          {"@context":"https://schema.org","@type":"Hotel","name":hotel.name||"","description":hotel.description||seoDesc,"image":hotel.hero_image_url||"","address":{"@type":"PostalAddress","addressLocality":hotel.neighborhood||hotel.city||"Miami","addressCountry":"US"},"starRating":hotel.star_rating?{"@type":"Rating","ratingValue":hotel.star_rating}:undefined,"url":"https://alfredconcierge.app/catalog/hotels/"+slug},
          {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Hotels","item":"https://alfredconcierge.app/catalog/hotels"},{"@type":"ListItem","position":4,"name":hotel.name||"","item":"https://alfredconcierge.app/catalog/hotels/"+slug}]}
        ]}
      />
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}
::selection{background:${C.s7};color:${C.s1}}
a{color:inherit;text-decoration:none}
body::-webkit-scrollbar{width:0}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
.thumb-strip{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px}
.thumb-strip::-webkit-scrollbar{display:none}
@media(max-width:768px){
  .detail-hero{height:320px!important}
  .detail-title{font-size:30px!important}
  .detail-layout{flex-direction:column!important;padding:0 20px!important}
  .detail-main{max-width:100%!important}
  .detail-sidebar{width:100%!important;position:static!important}
}
@media(max-width:390px){.detail-hero{height:260px!important}.detail-title{font-size:24px!important}}
      `}</style>

      {/* Grain */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+(Math.min(navOp*0.95,0.95))+")":"transparent",backdropFilter:navOp>0.05?"blur(30px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+(navOp*0.8)+")",transition:"all 0.3s"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={22} color={C.s1}/></a>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <a href="/catalog/hotels" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>← Hotels</a>
          <div onClick={function(){window.open("https://wa.me/447449562204?text="+waMsg,"_blank")}} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:12,background:C.el,border:"1px solid "+C.bd,...sf(11,500),color:C.s1,cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background=C.s1;e.currentTarget.style.color=C.bg}} onMouseLeave={function(e){e.currentTarget.style.background=C.el;e.currentTarget.style.color=C.s1}}>Book via Alfred</div>
        </div>
      </nav>

      {/* HERO CAROUSEL */}
      <div className="detail-hero" style={{height:480,position:"relative",overflow:"hidden",marginTop:0}}>
        {photos.length>0?(
          <img key={idx} src={photos[idx]} alt={(hotel.name||"Hotel")+" photo "+(idx+1)} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform:"translateY("+heroY+"px) scale(1.08)",transition:"transform 0.1s linear",animation:"fadeIn 0.5s ease"}}/>
        ):(
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#1a1a22,#252530)"}}/>
        )}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0.2) 0%,rgba(10,10,11,0.5) 50%,rgba(10,10,11,0.95) 100%)"}}/>

        {/* Photo nav arrows */}
        {photos.length>1&&(
          <>
            <div onClick={function(){setIdx(function(n){return(n-1+photos.length)%photos.length})}} style={{position:"absolute",left:20,top:"50%",transform:"translateY(-50%)",width:40,height:40,borderRadius:"50%",background:"rgba(0,0,0,0.45)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.2s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(0,0,0,0.45)"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </div>
            <div onClick={function(){setIdx(function(n){return(n+1)%photos.length})}} style={{position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",width:40,height:40,borderRadius:"50%",background:"rgba(0,0,0,0.45)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.2s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(0,0,0,0.45)"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            {/* Dot indicators */}
            <div style={{position:"absolute",bottom:80,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
              {photos.map(function(_,i){return <div key={i} onClick={function(){setIdx(i)}} style={{width:i===idx?20:6,height:6,borderRadius:3,background:i===idx?C.s1:"rgba(255,255,255,0.3)",cursor:"pointer",transition:"all 0.3s"}}/>})}
            </div>
          </>
        )}

        {/* Status pill */}
        <div style={{position:"absolute",top:80,right:24}}>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:10,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:isOpen?C.gn:"#FF9F0A"}}/>
            <span style={{...sf(10,500),color:isOpen?C.gn:"#FF9F0A"}}>{isOpen?"Available":"Coming Soon"}</span>
          </div>
        </div>

        {/* Bottom hero info */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 40px 32px",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s"}}>
          {hotel.neighborhood&&<p style={{...sf(10,500),color:C.s5,letterSpacing:4,textTransform:"uppercase",marginBottom:10}}>{hotel.neighborhood}</p>}
          <h1 className="detail-title" style={{...sf(44,700),letterSpacing:-1.5,lineHeight:1.05,marginBottom:10}}>{hotel.name}</h1>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            {hotel.star_rating>0&&<StarRating stars={hotel.star_rating}/>}
            {priceStr&&<span style={{...sf(13),color:C.s4}}>{priceStr}</span>}
            {hotel.neighborhood&&(
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{...sf(12),color:C.s5}}>{hotel.neighborhood}, Miami</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* THUMBNAIL STRIP */}
      {photos.length>1&&(
        <div style={{padding:"12px 40px",maxWidth:1060,margin:"0 auto",boxSizing:"border-box"}}>
          <div className="thumb-strip">
            {photos.map(function(src,i){
              return(
                <div key={i} onClick={function(){setIdx(i)}} style={{flexShrink:0,width:80,height:56,borderRadius:10,overflow:"hidden",cursor:"pointer",border:"2px solid "+(i===idx?C.s1:C.bd),transition:"border-color 0.2s,transform 0.2s",transform:i===idx?"scale(1.04)":"scale(1)"}}>
                  <img src={src} alt={"photo "+(i+1)} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="detail-layout" style={{display:"flex",gap:40,maxWidth:1060,margin:"0 auto",padding:"40px 40px 80px",alignItems:"flex-start"}}>

        {/* LEFT: main details */}
        <div className="detail-main" style={{flex:1,minWidth:0}}>

          {/* Description */}
          {hotel.description&&(
            <section style={{marginBottom:40}}>
              <p style={{...sf(16),color:C.s3,lineHeight:1.8}}>{hotel.description}</p>
            </section>
          )}

          {/* Amenities */}
          {amenities.length>0&&(
            <section ref={amenRef} style={{marginBottom:40,opacity:amenVis?1:0,transform:amenVis?"translateY(0)":"translateY(20px)",transition:"all 0.7s ease"}}>
              <h2 style={{...sf(22,600),letterSpacing:-0.5,marginBottom:16}}>Amenities</h2>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {amenities.map(function(a,i){
                  return(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,background:C.el,border:"1px solid "+C.bd}}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      <span style={{...sf(12,500),color:C.s3}}>{a}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Perks */}
          {perks.length>0&&(
            <section ref={perksRef} style={{marginBottom:40,opacity:perksVis?1:0,transform:perksVis?"translateY(0)":"translateY(20px)",transition:"all 0.7s ease 0.1s"}}>
              <h2 style={{...sf(22,600),letterSpacing:-0.5,marginBottom:16}}>Alfred Perks</h2>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {perks.map(function(perk,i){
                  return(
                    <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 18px",borderRadius:14,background:C.el,border:"1px solid "+C.bd}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(255,214,10,0.1)",border:"1px solid rgba(255,214,10,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill={C.gold}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      </div>
                      <span style={{...sf(13),color:C.s3,lineHeight:1.5}}>{typeof perk==="string"?perk:perk.description||perk.text||JSON.stringify(perk)}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Alfred note */}
          {hotel.alfred_note&&(
            <section style={{marginBottom:40,padding:"24px",borderRadius:18,background:"rgba(255,214,10,0.04)",border:"1px solid rgba(255,214,10,0.12)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <Mark size={16} color={C.gold}/>
                <span style={{...sf(11,600),color:C.gold,letterSpacing:2,textTransform:"uppercase"}}>Alfred's Note</span>
              </div>
              <p style={{...sf(14),color:C.s3,lineHeight:1.7,fontStyle:"italic"}}>{hotel.alfred_note}</p>
            </section>
          )}
        </div>

        {/* RIGHT: booking sidebar */}
        <div className="detail-sidebar" style={{width:320,flexShrink:0,position:"sticky",top:100}}>
          <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:28}}>
            <div style={{marginBottom:20}}>
              {hotel.name&&<h3 style={{...sf(18,600),letterSpacing:-0.5,marginBottom:6}}>{hotel.name}</h3>}
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                {hotel.star_rating>0&&<StarRating stars={hotel.star_rating}/>}
                {priceStr&&<span style={{...sf(12),color:C.s4}}>{priceStr}</span>}
              </div>
            </div>

            {hotel.address&&(
              <div style={{display:"flex",gap:8,marginBottom:20,paddingBottom:20,borderBottom:"1px solid "+C.bd}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" style={{flexShrink:0,marginTop:2}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{...sf(12),color:C.s4,lineHeight:1.5}}>{hotel.address}</span>
              </div>
            )}

            <p style={{...sf(12),color:C.s5,lineHeight:1.6,marginBottom:20}}>Book through Alfred and receive exclusive member perks, guaranteed upgrades, and personal concierge service throughout your stay.</p>

            <div
              onClick={function(){window.open("https://wa.me/447449562204?text="+waMsg,"_blank")}}
              style={{width:"100%",padding:"16px 0",borderRadius:14,background:C.s1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,...sf(14,600),color:C.bg,cursor:"pointer",transition:"all 0.3s",boxSizing:"border-box",marginBottom:12}}
              onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(244,244,245,0.15)"}}
              onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Book via WhatsApp
            </div>

            <div style={{...sf(10),color:C.s6,textAlign:"center",lineHeight:1.5}}>Alfred responds within minutes · 24/7 concierge service</div>
          </div>

          {/* Back link */}
          <a href="/catalog/hotels" style={{display:"flex",alignItems:"center",gap:6,marginTop:16,padding:"12px 0",...sf(12),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.color=C.s5}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            All Hotels
          </a>
        </div>
      </div>

      {/* CTA */}
      <section ref={ctaRef} style={{padding:"60px 40px 100px",borderTop:"1px solid "+C.bd,textAlign:"center"}}>
        <div style={{maxWidth:480,margin:"0 auto",opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(20px)",transition:"all 0.8s ease"}}>
          <Mark size={28} color={C.s7}/>
          <h2 style={{...sf(32,600),letterSpacing:-1,marginTop:20,marginBottom:12}}>Ready to book?</h2>
          <p style={{...sf(14),color:C.s5,lineHeight:1.7,marginBottom:28}}>Tell Alfred your check-in, check-out, and preferences. We handle the rest.</p>
          <div onClick={function(){window.open("https://wa.me/447449562204?text="+waMsg,"_blank")}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:14,background:C.s1,...sf(14,600),color:C.bg,cursor:"pointer",transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(244,244,245,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Contact Alfred</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid "+C.bd,padding:"36px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><Mark size={14} color={C.s7}/><span style={{...sf(10),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Alfred ©2026</span></div>
        <div style={{display:"flex",gap:20}}>
          <a href="/" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Home</a>
          <a href="/catalog/hotels" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Hotels</a>
          <a href="/catalog" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Catalog</a>
        </div>
      </footer>
    </div>
  );
}
