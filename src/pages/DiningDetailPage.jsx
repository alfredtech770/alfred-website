import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

var LE_CINQ={
  name:"Le Cinq",tagline:"Where French haute cuisine meets quiet grandeur",
  cuisine:"French Contemporary",address:"31 Avenue George V, 75008 Paris",
  rating:4.9,reviewCount:47,priceLevel:"€€€€",avgSpend:"€280",
  imgs:["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85","https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80","https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=900&q=80","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80"],
  hours:{lunch:"12:00 – 2:30 PM",dinner:"7:00 – 10:00 PM",closed:"Sunday & Monday"},
  dressCode:"Smart Elegant",michelin:3,
  alfredNote:"If I may suggest — request table 14 by the garden window. The light at 8 PM is extraordinary. And do ask for the off-menu cheese course. They reserve it for guests who know.",
  alfredTip:"Mention Alfred at arrival. The maître d' will understand.",
  chef:{name:"Christian Le Squer",title:"Executive Chef",note:"Four Seasons Paris. Triple-starred since 2016."},
  dishes:[
    {name:"Langoustine Carpaccio",desc:"Caviar, citrus gel, gold leaf",price:"€95",popular:true,course:"Starter"},
    {name:"Bresse Chicken",desc:"Black truffle, foie gras jus",price:"€120",course:"Main"},
    {name:"Seasonal Garden",desc:"28 vegetables, herbs, flowers",price:"€85",course:"Main",veg:true},
    {name:"Grand Dessert",desc:"Seven textures of chocolate",price:"€65",popular:true,course:"Dessert"},
  ],
  wineNote:"The sommelier's private reserve includes 3 bottles of 1947 Cheval Blanc. Ask discreetly.",
  atmosphere:[{label:"Noise",value:20},{label:"Intimacy",value:90},{label:"Formality",value:85},{label:"Scene",value:60}],
  bestFor:["Anniversary","Business","Impressing","Celebration"],
  reviews:[
    {name:"Sophia M.",rating:5,text:"Alfred secured the garden table on a Saturday. Unheard of. The langoustine was transcendent.",date:"2 weeks ago",tier:"Member"},
    {name:"James R.",rating:5,text:"The cheese course is the real secret. Worth every euro.",date:"1 month ago",tier:"Black"},
    {name:"Claire D.",rating:4,text:"Impeccable service. Slightly formal for my taste, but the food is beyond compare.",date:"3 weeks ago",tier:"Member"},
  ],
  facts:[{icon:"€",label:"Avg. spend",value:"€280 / person"},{icon:"🕐",label:"Best time",value:"8:00 PM weekdays"},{icon:"👔",label:"Dress code",value:"Smart Elegant"},{icon:"👥",label:"Party size",value:"2 – 8 guests"}],
};

var courseCol=function(c){return c==="Starter"?"#60A5FA":c==="Dessert"?"#F472B6":C.s3};

export default function DiningDetailPage(){
  var {slug}=useParams();
  var [restaurant,setRestaurant]=useState(null);
  var [fetching,setFetching]=useState(true);
  var [fetchError,setFetchError]=useState(null);
  var [idx,setIdx]=useState(0);
  var [lightbox,setLightbox]=useState(false);
  var [liked,setLiked]=useState(false);
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [guests,setGuests]=useState("2");
  var [date,setDate]=useState("2026-03-20");
  var [time,setTime]=useState("20:00");

  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var factsRef=useRef(null);var factsVis=useVis(factsRef);
  var dishRef=useRef(null);var dishVis=useVis(dishRef);
  var atmoRef=useRef(null);var atmoVis=useVis(atmoRef);
  var hoursRef=useRef(null);var hoursVis=useVis(hoursRef);
  var revRef=useRef(null);var revVis=useVis(revRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);
  useEffect(function(){
    if(!slug)return;
    async function fetchRestaurant(){
      try{
        var isUUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        var data,err;
        if(isUUID){
          var r1=await supabase.from("restaurants").select("*").eq("id",slug).single();
          data=r1.data;err=r1.error;
          if(!data){var r2=await supabase.from("restaurants").select("*").eq("slug",slug).single();data=r2.data;err=r2.error;}
        }else{
          var r=await supabase.from("restaurants").select("*").eq("slug",slug).single();
          data=r.data;err=r.error;
        }
        if(err&&!data)throw err;
        setRestaurant(data);
      }catch(e){
        console.error("Restaurant fetch error:",e);
        setFetchError("Could not load this restaurant.");
      }finally{
        setFetching(false);
      }
    }
    fetchRestaurant();
  },[slug]);

  function getImgs(r){
    var imgs=[];
    if(r.hero_image_url)imgs.push(r.hero_image_url);
    if(r.photos_order&&Array.isArray(r.photos_order)){r.photos_order.forEach(function(u){if(u&&u!==r.hero_image_url)imgs.push(u)})}
    if(imgs.length===0&&r.img)imgs.push(r.img);
    return imgs;
  }

  var _sess=null;try{_sess=JSON.parse(sessionStorage.getItem("alfred_restaurant_"+slug))}catch(e){}

  var V=restaurant?{
    name:restaurant.name||"",
    tagline:restaurant.tagline||restaurant.description||"",
    cuisine:restaurant.cuisine||"",
    address:restaurant.address||restaurant.loc||restaurant.location||"",
    rating:restaurant.rating||0,
    reviewCount:restaurant.review_count||restaurant.reviews||0,
    priceLevel:restaurant.price||restaurant.price_level||"",
    avgSpend:restaurant.avg||restaurant.avg_spend||"",
    imgs:getImgs(restaurant),
    michelin:restaurant.michelin||0,
    dressCode:restaurant.dress_code||"Smart Casual",
    alfredNote:restaurant.alfred_note||(restaurant.alfred_notes)||"Contact Alfred to arrange your table at "+(restaurant.name||"")+". We handle the reservation, seating preference, and any special occasions.",
    alfredTip:restaurant.alfred_tip||"Mention Alfred at arrival for preferred treatment and the best available table.",
    chef:restaurant.chef||null,
    dishes:restaurant.dishes||null,
    wineNote:restaurant.wine_note||"Our sommelier will guide you through a thoughtful selection paired to your meal.",
    atmosphere:restaurant.atmosphere||null,
    bestFor:Array.isArray(restaurant.best_for)?restaurant.best_for:[],
    reviews:Array.isArray(restaurant.reviews_data)?restaurant.reviews_data:[],
    hours:restaurant.hours||null,
    facts:[
      {icon:"€",label:"Avg. spend",value:restaurant.avg||restaurant.avg_spend||"On request"},
      {icon:"🕐",label:"Best time",value:"8:00 PM weekdays"},
      {icon:"👔",label:"Dress code",value:restaurant.dress_code||"Smart Casual"},
      {icon:"👥",label:"Party size",value:"2 – 8 guests"},
    ],
  }:_sess?{
    name:_sess.name,tagline:_sess.tagline||("Fine dining · "+_sess.cuisine),cuisine:_sess.cuisine,address:_sess.loc,rating:_sess.rating,reviewCount:_sess.reviews,priceLevel:_sess.price,avgSpend:_sess.avg,imgs:_sess.img?[_sess.img]:[],hours:null,dressCode:_sess.vibe==="Formal"?"Smart Elegant":"Smart Casual",michelin:_sess.michelin||0,alfredNote:"Contact Alfred to arrange your table at "+_sess.name+". We handle the reservation, seating preference, and any special occasions.",alfredTip:"Mention Alfred at arrival for preferred treatment and the best available table.",chef:null,dishes:null,wineNote:"",atmosphere:null,bestFor:[],reviews:[],facts:[{icon:"€",label:"Avg. spend",value:(_sess.avg||"")+" / person"},{icon:"👔",label:"Dress code",value:_sess.vibe==="Formal"?"Smart Elegant":"Smart Casual"},{icon:"👥",label:"Party size",value:"2 – 8 guests"},{icon:"🍽",label:"Service",value:_sess.meal}],
  }:LE_CINQ;

  useEffect(function(){
    if(!V||!V.imgs||V.imgs.length===0)return;
    var t=setInterval(function(){setIdx(function(c){return(c+1)%V.imgs.length})},5000);
    return function(){clearInterval(t)};
  },[restaurant,slug]);

  if(fetching&&!_sess){return(<div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,display:"flex",alignItems:"center",justifyContent:"center"}}><style>{"*{margin:0;padding:0;box-sizing:border-box}body::-webkit-scrollbar{width:0}"}</style><div style={{textAlign:"center"}}><Mark size={32} color={C.s7}/><div style={{...sf(13),color:C.s6,marginTop:20,letterSpacing:2}}>LOADING</div></div></div>);}
  if(fetchError&&!restaurant&&!_sess){return(<div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,display:"flex",alignItems:"center",justifyContent:"center"}}><style>{"*{margin:0;padding:0;box-sizing:border-box}body::-webkit-scrollbar{width:0}"}</style><div style={{textAlign:"center",padding:"0 40px"}}><div style={{...sf(20,600),color:C.s5,marginBottom:12}}>{fetchError}</div><a href="/catalog/dining" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:12,border:"1px solid "+C.bd,...sf(13,500),color:C.s1}}>← Back to Dining</a></div></div>);}

  var navOp=Math.min(scrollY/250,1);var heroY=scrollY*0.25;var heroScale=1+scrollY*0.0003;
  var secDiv=<div style={{height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)"}}/>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.6);cursor:pointer}
input[type="date"]{-webkit-appearance:none;appearance:none}
html,body{overflow-x:hidden;max-width:100vw}
.page-wrap{max-width:1200px;margin:0 auto;padding:0 clamp(16px,4vw,40px)}
.two-col{display:flex;gap:48px;align-items:flex-start}
.left-col{flex:1;min-width:0;max-width:100%}
.right-col{width:360px;flex-shrink:0;position:sticky;top:80px}
.mobile-booking{display:none}
.dish-row{display:flex;gap:12px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.dish-row::-webkit-scrollbar{display:none}
.rev-row{display:flex;gap:16px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:4px}
.rev-row::-webkit-scrollbar{display:none}
.facts-g{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media(max-width:900px){
  .two-col{flex-direction:column!important;gap:0!important}
  .right-col{display:none!important}
  .mobile-booking{display:block!important}
  .page-wrap{padding:0 16px!important}
  .dd-hero{height:37vh!important;min-height:220px!important;max-height:340px!important}
  .dd-name{font-size:26px!important}
  .facts-g{grid-template-columns:1fr 1fr!important}
}
@media(max-width:390px){.dd-hero{height:34vh!important;min-height:200px!important}.dd-name{font-size:22px!important}}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"16px clamp(16px,4vw,40px)",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <a href="/catalog/dining" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>← All Restaurants</a>
          <div style={{...sf(12,500),color:C.s1,opacity:Math.min(navOp*2,1),transition:"opacity 0.3s"}}>{V.name}</div>
        </div>
      </nav>

      {/* Fullscreen Lightbox */}
      {lightbox&&<div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.95)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={function(){setLightbox(false)}}>
        <img src={V.imgs[idx]} alt="" style={{maxWidth:"92vw",maxHeight:"88vh",objectFit:"contain",borderRadius:8}}/>
        <div onClick={function(e){e.stopPropagation();setLightbox(false)}} style={{position:"absolute",top:20,right:20,width:44,height:44,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:201}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </div>
        <div onClick={function(e){e.stopPropagation();setIdx(function(c){return c===0?V.imgs.length-1:c-1})}} style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div onClick={function(e){e.stopPropagation();setIdx(function(c){return(c+1)%V.imgs.length})}} style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",...sf(13,500),color:"rgba(255,255,255,0.7)"}}>{idx+1} / {V.imgs.length}</div>
        <div style={{position:"absolute",bottom:56,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5}}>
          {V.imgs.map(function(_,i){return <div key={i} onClick={function(e){e.stopPropagation();setIdx(i)}} style={{width:i===idx?20:5,height:4,borderRadius:2,background:"rgba(255,255,255,"+(i===idx?"0.85":"0.25")+")",transition:"all 0.3s",cursor:"pointer"}}/>})}
        </div>
      </div>}

      {/* Hero */}
      <section className="dd-hero" style={{height:"70vh",maxHeight:700,minHeight:450,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,transform:"translateY("+heroY+"px) scale("+heroScale+")"}}>
          {V.imgs.map(function(img,i){return <img key={i} src={img} alt="" onClick={function(){setLightbox(true)}} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 60%",opacity:i===idx?1:0,transition:"opacity 0.8s ease",filter:"brightness(1.1)",cursor:"pointer"}}/>})}
        </div>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0.25) 0%,transparent 25%,transparent 55%,rgba(10,10,11,0.5) 80%,#0A0A0B 100%)"}}/>
        {/* Left/Right arrows */}
        <div onClick={function(){setIdx(function(c){return c===0?V.imgs.length-1:c-1})}} style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,backdropFilter:"blur(8px)",transition:"background 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(0,0,0,0.5)"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div onClick={function(){setIdx(function(c){return(c+1)%V.imgs.length})}} style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",width:44,height:44,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,backdropFilter:"blur(8px)",transition:"background 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(0,0,0,0.5)"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        {/* Image counter — top right below nav */}
        <div style={{position:"absolute",top:64,right:16,zIndex:10,...sf(11,500),color:"rgba(255,255,255,0.6)",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)"}}>{idx+1} / {V.imgs.length}</div>
        {/* Tags — top left below nav */}
        <div style={{position:"absolute",top:64,left:16,display:"flex",gap:6,zIndex:10,flexWrap:"wrap"}}>
          {V.michelin>0&&<span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{"★".repeat(V.michelin)} MICHELIN</span>}
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.s4,padding:"4px 8px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)"}}>{V.cuisine||"Fine Dining"}</span>
          <span style={{display:"flex",alignItems:"center",gap:4,...sf(9,500),color:C.gn,padding:"4px 8px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)"}}><div style={{width:5,height:5,borderRadius:"50%",background:C.gn}}/>Available</span>
        </div>
        {/* Brand label — bottom left */}
        <div style={{position:"absolute",bottom:48,left:"clamp(16px,4vw,40px)",display:"flex",alignItems:"center",gap:8,zIndex:5}}>
          <div style={{width:20,height:2.5,borderRadius:2,background:"rgba(255,255,255,0.5)"}}/>
          <span style={{...sf(10,500),letterSpacing:3,color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>{V.cuisine||"Restaurant"}</span>
        </div>
        <div style={{position:"absolute",bottom:48,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:10}}>
          {V.imgs.map(function(_,i){return <div key={i} onClick={function(){setIdx(i)}} style={{width:i===idx?20:5,height:4,borderRadius:2,background:"rgba(255,255,255,"+(i===idx?"0.85":"0.2")+")",transition:"all 0.3s",cursor:"pointer"}}/>})}
        </div>
      </section>

      {/* Mobile booking card — shown only on mobile */}
      <div className="mobile-booking" style={{padding:"16px 16px 0"}}>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"22px 20px"}}>
          <div style={{...sf(10,600),color:C.s7,letterSpacing:3,textTransform:"uppercase",marginBottom:10}}>Arrange a Table</div>
          <div style={{display:"flex",alignItems:"baseline",gap:5,marginBottom:16}}>
            <span style={{...sf(24,700),color:C.s1}}>{V.avgSpend||V.priceLevel}</span>
            <span style={{...sf(13),color:C.s6}}>/ person</span>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <div style={{flex:1}}>
              <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Date</div>
              <input type="date" value={date} onChange={function(e){setDate(e.target.value)}} style={{padding:"12px 16px",borderRadius:12,background:C.srf,border:"1px solid "+C.bd,color:C.s1,...sf(13),outline:"none",width:"100%",colorScheme:"dark"}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:4,marginBottom:14}}>
            {["19:00","19:30","20:00","20:30","21:00"].map(function(t){var active=time===t;return <div key={t} onClick={function(){setTime(t)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(11,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{t}</div>})}
          </div>
          <a href="https://wa.me/message/DAO44K3XCXK3F1" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,textDecoration:"none",marginBottom:8}}>Reserve a Table</a>
        </div>
      </div>

      {/* Two-column */}
      <div className="page-wrap" style={{marginTop:-40,position:"relative",zIndex:10,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)"}}>
        <div className="two-col">

          {/* LEFT */}
          <div className="left-col">
            {/* Title */}
            <div style={{marginBottom:40}}>
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                <span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:C.s3+"14"}}>MICHELIN {"★".repeat(V.michelin)}</span>
                <span style={{...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F",border:"0.5px solid "+C.gn+"1A"}}>✦ ALFRED VERIFIED</span>
              </div>
              <h1 className="dd-name" style={{...sf(38,700),letterSpacing:-1.5,marginBottom:8}}>{V.name}</h1>
              <p style={{...sf(16,300),color:C.s5,marginBottom:16}}>{V.tagline}</p>
              <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span style={{...sf(14,600),color:C.s1}}>{V.rating}</span>
                  <span style={{...sf(12),color:C.s6}}>({V.reviewCount})</span>
                </div>
                <div style={{width:1,height:14,background:C.bd}}/>
                <span style={{...sf(13),color:C.s4}}>{V.cuisine}</span>
                <div style={{width:1,height:14,background:C.bd}}/>
                <span style={{...sf(13,500),color:C.s4}}>{V.priceLevel}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginTop:12}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{...sf(12),color:C.s5}}>{V.address}</span>
              </div>
            </div>

            {/* Alfred's Note */}
            <div ref={noteRef} style={{paddingTop:32,marginBottom:40}}>
              {secDiv}
              <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:noteVis?1:0,transition:"all 0.8s ease"}}>Alfred's Note</p>
              <div style={{borderRadius:24,border:"1px solid "+C.bd,background:C.el,padding:"36px 32px",position:"relative",overflow:"hidden",opacity:noteVis?1:0,transform:noteVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
                <div style={{position:"absolute",bottom:20,right:24,opacity:0.025}}><Mark size={100} color={C.s1}/></div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}><Mark size={18} color={C.s5}/><span style={{...sf(11,500),color:C.s5,letterSpacing:1}}>From your concierge</span><div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px rgba(52,199,89,0.4)"}}/></div>
                <p style={{...sf(15,400),color:C.s3,lineHeight:1.8,fontStyle:"italic",marginBottom:22,position:"relative",zIndex:1}}>"{V.alfredNote}"</p>
                <div style={{height:0.5,background:C.bd,marginBottom:18}}/>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{...sf(13),color:C.s6,marginTop:1}}>✨</span><span style={{...sf(13),color:C.s5,lineHeight:1.6}}>{V.alfredTip}</span></div>
              </div>
            </div>
          </div>

          {/* RIGHT — Sticky Booking */}
          <div className="right-col">
            <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden"}}>
              <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
              <div style={{padding:"24px 22px"}}>
                <div style={{...sf(18,700),color:C.s1,marginBottom:4}}>Arrange a Table</div>
                <div style={{...sf(12),color:C.s5,marginBottom:20}}>Avg. {V.avgSpend} / person · {V.priceLevel}</div>

                {/* Date */}
                <div style={{marginBottom:14}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Date</div>
                  <input type="date" value={date} onChange={function(e){setDate(e.target.value)}} style={{padding:"12px 16px",borderRadius:12,background:C.srf,border:"1px solid "+C.bd,color:C.s1,...sf(14),outline:"none",width:"100%"}}/>
                </div>

                {/* Time */}
                <div style={{marginBottom:14}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Time</div>
                  <div style={{display:"flex",gap:4}}>
                    {["19:00","19:30","20:00","20:30","21:00"].map(function(t){var active=time===t;return <div key={t} onClick={function(){setTime(t)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(12,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{t}</div>})}
                  </div>
                </div>

                {/* Guests */}
                <div style={{marginBottom:18}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Guests</div>
                  <div style={{display:"flex",gap:4}}>
                    {["2","4","6","8+"].map(function(g){var active=guests===g;return <div key={g} onClick={function(){setGuests(g)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(13,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{g}</div>})}
                  </div>
                </div>

                {/* Book */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                  Arrange a Table
                </div>

                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:14}}>
                  {["No fees","Confirmed instantly","Free cancellation"].map(function(t,i){return <span key={i} style={{...sf(10),color:C.s6}}>{t}</span>})}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderRadius:14,background:C.gn+"08",border:"0.5px solid "+C.gn+"1A",marginTop:12}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px "+C.gn+"66",flexShrink:0}}/>
              <div>
                <div style={{...sf(12,600),color:C.s1}}>2 tables available tonight</div>
                <div style={{...sf(11),color:C.gn+"CC",marginTop:1}}>8:00 PM and 9:30 PM · Garden room</div>
              </div>
            </div>

            {/* WhatsApp */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px 0",borderRadius:14,border:"1px solid "+C.bd,marginTop:10,cursor:"pointer",...sf(12,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              Ask about this restaurant
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FULL-WIDTH SECTIONS ═══ */}

      {/* At a Glance */}
      <div ref={factsRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:factsVis?1:0,transition:"all 0.8s ease"}}>At a Glance</p>
        <div className="facts-g" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,opacity:factsVis?1:0,transform:factsVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.facts.map(function(f,i){return(<div key={i} style={{padding:"22px 22px",borderRadius:20,background:C.el,border:"1px solid "+C.bd,transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:16}}>{f.icon}</span><span style={{...sf(12),color:C.s5}}>{f.label}</span></div><span style={{...sf(15,600),color:C.s1}}>{f.value}</span></div>)})}
        </div>
      </div>

      {/* Signature Dishes */}
      {V.dishes&&V.dishes.length>0&&<div ref={dishRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:32,marginBottom:20}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",opacity:dishVis?1:0,transition:"all 0.8s ease"}}>Signature Dishes</p>
          <span style={{...sf(12),color:C.s6,opacity:dishVis?1:0}}>Full menu →</span>
        </div>
        <div className="dish-row" style={{opacity:dishVis?1:0,transform:dishVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.dishes.map(function(d,i){var cc=courseCol(d.course);return(
            <div key={i} style={{width:200,flexShrink:0,borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden",display:"flex",flexDirection:"column",transition:"all 0.4s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.transform="translateY(-4px)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.transform="translateY(0)"}}>
              <div style={{height:2,background:"linear-gradient(90deg,"+cc+"4D,"+cc+"1A)"}}/>
              <div style={{padding:"20px 18px",flex:1,display:"flex",flexDirection:"column"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <span style={{...sf(9,500),letterSpacing:1.5,color:cc+"8C",textTransform:"uppercase"}}>{d.course}</span>
                  {d.popular&&<span style={{...sf(8,600),letterSpacing:0.8,color:"#FB923CCC",padding:"3px 7px",borderRadius:6,background:"#FB923C15"}}>POPULAR</span>}
                  {d.veg&&<span style={{...sf(8,600),letterSpacing:0.8,color:C.gn+"B3",padding:"3px 7px",borderRadius:6,background:C.gn+"15"}}>VEG</span>}
                </div>
                <div style={{...sf(16,600),color:C.s1,lineHeight:1.3,marginBottom:6,minHeight:42}}>{d.name}</div>
                <div style={{...sf(12),color:C.s5,lineHeight:1.5}}>{d.desc}</div>
                <div style={{flex:1}}/>
                <div style={{...sf(15,600),color:C.s3,marginTop:14}}>{d.price}</div>
              </div>
            </div>
          )})}
        </div>
      </div>}

      {/* Atmosphere + Wine + Chef */}
      {V.atmosphere&&V.atmosphere.length>0&&<div ref={atmoRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:atmoVis?1:0,transition:"all 0.8s ease"}}>The Atmosphere</p>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"28px 30px",display:"flex",flexDirection:"column",gap:22,opacity:atmoVis?1:0,transform:atmoVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.atmosphere.map(function(m,i){return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{...sf(13,400),color:C.s1,width:76,flexShrink:0}}>{m.label}</span>
              <div style={{flex:1,height:3,borderRadius:2,background:"rgba(244,244,245,0.04)",overflow:"hidden"}}>
                <div style={{height:"100%",width:atmoVis?m.value+"%":"0%",borderRadius:2,background:m.value>70?"linear-gradient(90deg,"+C.s4+","+C.s3+")":C.s6,transition:"width 1.2s cubic-bezier(0.16,1,0.3,1) "+(0.3+i*0.12)+"s"}}/>
              </div>
              <span style={{...sf(12,500),color:C.s5,width:28,textAlign:"right",flexShrink:0}}>{m.value}</span>
            </div>
          )})}
        </div>
        <div style={{display:"flex",gap:14,marginTop:14}}>
          <div style={{flex:1,borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"22px 24px",opacity:atmoVis?1:0,transition:"opacity 0.8s ease 0.4s"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:14}}>🍷</span><span style={{...sf(10,500),letterSpacing:1.5,color:"#A78BFA80",textTransform:"uppercase"}}>Wine Cellar</span></div>
            <p style={{...sf(13),color:C.s4,lineHeight:1.7,fontStyle:"italic"}}>"{V.wineNote}"</p>
          </div>
          {V.chef&&<div style={{flex:1,borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"22px 24px",opacity:atmoVis?1:0,transition:"opacity 0.8s ease 0.5s"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:14}}>🔥</span><span style={{...sf(10,500),letterSpacing:1.5,color:C.s6,textTransform:"uppercase"}}>The Kitchen</span></div>
            <div style={{...sf(16,600),color:C.s1,marginBottom:4}}>{V.chef.name}</div>
            <div style={{...sf(13),color:C.s5,marginBottom:2}}>{V.chef.title}</div>
            <div style={{...sf(12),color:C.s6}}>{V.chef.note}</div>
          </div>}
        </div>
        {V.bestFor&&V.bestFor.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:16,opacity:atmoVis?1:0,transition:"opacity 0.8s ease 0.6s"}}>
          {V.bestFor.map(function(tag,i){return <span key={i} style={{...sf(12),color:C.s4,padding:"0 16px",height:34,lineHeight:"34px",borderRadius:17,background:C.srf,border:"0.5px solid "+C.bd}}>{tag}</span>})}
        </div>}
      </div>}

      {/* Hours */}
      {V.hours&&<div ref={hoursRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:hoursVis?1:0,transition:"all 0.8s ease"}}>Hours & Details</p>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden",opacity:hoursVis?1:0,transform:hoursVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {[{l:"Lunch",v:V.hours.lunch,c:C.gn},{l:"Dinner",v:V.hours.dinner,c:C.gn},{l:"Closed",v:V.hours.closed,c:C.red}].filter(function(r){return r.v}).map(function(r,i){return(<div key={i}><div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 24px"}}><div style={{width:7,height:7,borderRadius:"50%",background:r.c,opacity:0.55,flexShrink:0}}/><span style={{...sf(13,500),color:C.s5,width:56}}>{r.l}</span><span style={{...sf(14),color:C.s1}}>{r.v}</span></div><div style={{height:0.5,background:C.bd,marginLeft:24}}/></div>)})}
        </div>
      </div>}

      {/* Reviews */}
      <div ref={revRef} className="page-wrap" style={{paddingTop:60,marginBottom:60}}>
        {secDiv}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:32,marginBottom:20}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",opacity:revVis?1:0,transition:"all 0.8s ease"}}>From Members</p>
          <span style={{...sf(12),color:C.s6,opacity:revVis?1:0}}>{V.reviewCount} reviews</span>
        </div>
        <div className="rev-row" style={{opacity:revVis?1:0,transform:revVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.reviews.map(function(r,i){var isB=r.tier==="Black";return(
            <div key={i} style={{width:300,flexShrink:0,borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"24px 22px",transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:C.srf,border:"0.5px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{...sf(15,300),color:C.s5}}>{r.name.charAt(0)}</span></div>
                <div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{...sf(13,600),color:C.s1}}>{r.name}</span><span style={{...sf(8,600),letterSpacing:0.8,color:isB?C.s3:C.s5,padding:"2px 8px",borderRadius:6,background:isB?"rgba(244,244,245,0.06)":C.srf,border:"0.5px solid "+(isB?"rgba(244,244,245,0.1)":C.bd),textTransform:"uppercase"}}>{r.tier}</span></div>
                <div style={{display:"flex",alignItems:"center",gap:3,marginTop:4}}>{Array.from({length:r.rating}).map(function(_,si){return <svg key={si} width="9" height="9" viewBox="0 0 24 24" fill={C.gold}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>})}<span style={{...sf(10),color:C.s6,marginLeft:4}}>{r.date}</span></div></div>
              </div>
              <p style={{...sf(13),color:C.s4,lineHeight:1.7,fontStyle:"italic"}}>"{r.text}"</p>
            </div>
          )})}
        </div>
      </div>

      {/* Bottom CTA */}
      <section ref={ctaRef} style={{padding:"120px 0 100px",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"}}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Reserve</p>
          <h2 style={{...sf(44,600),letterSpacing:-1.5,lineHeight:1.1,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Ready for<br/>{V.name}?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginTop:16,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Your concierge handles everything — you just show up.</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 36px",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.4s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Arrange a Table<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg></div>
        </div>
      </section>

      <footer style={{borderTop:"1px solid "+C.bd,padding:"36px clamp(16px,4vw,40px)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><Mark size={14} color={C.s7}/><span style={{...sf(10),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Alfred ©2026</span></div>
        <div style={{display:"flex",gap:20}}>
          <a href="/" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Home</a>
          <a href="/catalog/dining" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Dining</a>
          <a href="/catalog" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Catalog</a>
        </div>
      </footer>
    </div>
  );
}
