import { useState, useEffect, useRef } from "react";
import DarkDatePicker from "../components/DarkDatePicker";
import SEOHead from "../components/SEOHead";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><path d="M42 18 C42 30 34 38 22 38 C34 38 42 46 42 58 C42 46 50 38 62 38 C50 38 42 30 42 18Z" fill={p.color||C.s1}/><path d="M58 42 C58 54 50 62 38 62 C50 62 58 70 58 82 C58 70 66 62 78 62 C66 62 58 54 58 42Z" fill={p.color||C.s1}/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

var V={
  name:"Dior Spa Cheval Blanc",tagline:"Dior skincare rituals overlooking the Seine",
  type:"Luxury Spa",address:"8 Quai du Louvre, 75001 Paris",
  rating:4.9,reviewCount:48,priceLevel:"€€€€",
  imgs:["https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=900&q=85","https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80","https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=900&q=80","https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900&q=80"],
  hours:{open:"Mon–Sun · 9 AM – 9 PM",lastBooking:"Last appointment at 7 PM"},
  alfredNote:"This is the single best spa experience in Paris. Ask for Marie-Claire — she's been with Dior since the opening and knows the Prestige routine by heart. Book the 180-minute L'Or de Vie if you can. The private suite has a view of Pont Neuf that alone is worth the visit.",
  alfredTip:"Tuesday and Wednesday mornings are the quietest. Weekend afternoons book out 2-3 weeks ahead.",
  treatments:[
    {name:"Dior Prestige Facial",desc:"Anti-aging, rose micro-pearls, LED therapy",price:"€400",duration:"90 min",popular:true,cat:"Facial"},
    {name:"L'Or de Vie Ritual",desc:"Full body. Dior's most luxurious treatment.",price:"€650",duration:"180 min",popular:true,cat:"Ritual"},
    {name:"Hydra Life Express",desc:"Deep hydration, express glow recovery",price:"€200",duration:"60 min",popular:false,cat:"Facial"},
    {name:"Deep Tissue Massage",desc:"Therapeutic. Focus on back, neck, shoulders.",price:"€280",duration:"90 min",popular:false,cat:"Massage"},
    {name:"Couples Ritual Suite",desc:"Side-by-side treatments, champagne, private suite",price:"€1,200",duration:"150 min",popular:true,cat:"Ritual"},
  ],
  atmosphere:[{label:"Luxury",value:98},{label:"Tranquility",value:95},{label:"Privacy",value:90},{label:"Exclusivity",value:92}],
  facilities:["Private treatment suites","Hammam & steam room","Relaxation lounge with Seine views","Dior beauty boutique","Organic herbal tea bar","Heated marble beds"],
  facts:[{icon:"💎",label:"Brand",value:"Dior Skincare"},{icon:"🕐",label:"Best time",value:"Weekday morning"},{icon:"⏱",label:"Sessions",value:"60–180 minutes"},{icon:"👥",label:"Capacity",value:"Couples suites available"}],
  bestFor:["Self-Care","Anniversary","Birthday","Pre-Event","Recovery"],
  reviews:[
    {name:"Isabelle M.",tier:"Noir",rating:5,text:"The L'Or de Vie ritual was three hours of pure bliss. The suite overlooks Pont Neuf. I cried when it ended.",date:"1 week ago"},
    {name:"Charlotte F.",tier:"Black",rating:5,text:"Alfred booked us the couples suite for our anniversary. Champagne, rose petals, the works. Flawless.",date:"2 weeks ago"},
    {name:"Emma R.",tier:"Member",rating:5,text:"The Prestige facial changed my skin. I go once a month now. Marie-Claire is an artist.",date:"1 month ago"},
  ],
};

export default function WellnessDetailPage(){
  var [idx,setIdx]=useState(0);
  var [lightbox,setLightbox]=useState(false);
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [date,setDate]=useState("2026-03-22");
  var [time,setTime]=useState("10:00 AM");
  var [selTreat,setSelTreat]=useState(0);
  var [guests,setGuests]=useState("1");

  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var factsRef=useRef(null);var factsVis=useVis(factsRef);
  var treatRef=useRef(null);var treatVis=useVis(treatRef);
  var atmoRef=useRef(null);var atmoVis=useVis(atmoRef);
  var hoursRef=useRef(null);var hoursVis=useVis(hoursRef);
  var revRef=useRef(null);var revVis=useVis(revRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);
  useEffect(function(){var t=setInterval(function(){setIdx(function(c){return(c+1)%V.imgs.length})},5000);return function(){clearInterval(t)}},[]);

  var navOp=Math.min(scrollY/250,1);var heroY=scrollY*0.25;var heroScale=1+scrollY*0.0003;
  var secDiv=<div style={{height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)"}}/>;
  var cur=V.treatments[selTreat];

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <SEOHead
        title={V.name+" Paris — Book a Treatment | Alfred Concierge"}
        description={"Book "+V.name+". "+V.type+" with premium treatments in Paris. "+V.priceLevel+" pricing. Full relaxation and rejuvenation."}
        path={"/catalog/wellness/"+V.name.toLowerCase().replace(/\s+/g,"-")}
        jsonLd={[
          {
            "@context":"https://schema.org",
            "@type":"HealthAndBeautyBusiness",
            "name":V.name,
            "description":V.tagline||V.type,
            "image":V.imgs[0],
            "address":{"@type":"PostalAddress","streetAddress":V.address.split(",")[0],"addressLocality":"Paris","addressCountry":"FR"}
          },
          {
            "@context":"https://schema.org",
            "@type":"BreadcrumbList",
            "itemListElement":[
              {"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},
              {"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},
              {"@type":"ListItem","position":3,"name":"Wellness","item":"https://alfredconcierge.app/catalog/wellness"},
              {"@type":"ListItem","position":4,"name":V.name,"item":"https://alfredconcierge.app/catalog/wellness/"+V.name.toLowerCase().replace(/\s+/g,"-")}
            ]
          }
        ]}
      />
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
html,body{overflow-x:hidden;max-width:100vw}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.6);cursor:pointer}
input[type="date"]{-webkit-appearance:none;appearance:none}
.page-wrap{max-width:1200px;margin:0 auto;padding:0 clamp(16px,4vw,40px)}
.two-col{display:flex;gap:48px;align-items:flex-start}
.left-col{flex:1;min-width:0;max-width:100%}
.right-col{width:360px;flex-shrink:0;position:sticky;top:80px}
.mobile-booking{display:none}
.treat-row{display:flex;gap:12px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.treat-row::-webkit-scrollbar{display:none}
.rev-row{display:flex;gap:16px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:4px}
.rev-row::-webkit-scrollbar{display:none}
.facts-g{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media(max-width:900px){
  .two-col{flex-direction:column!important;gap:0!important}
  .right-col{display:none!important}
  .mobile-booking{display:block!important}
  .page-wrap{padding:0 16px!important}
  .wd-hero{height:37vh!important;min-height:220px!important;max-height:340px!important}
  .wd-name{font-size:26px!important}
  .facts-g{grid-template-columns:1fr 1fr!important}
}
@media(max-width:390px){.wd-hero{height:34vh!important;min-height:200px!important}.wd-name{font-size:22px!important}}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"16px clamp(16px,4vw,40px)",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={28} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <a href="/catalog/wellness" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>← All Wellness</a>
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
      <section className="wd-hero" style={{height:"70vh",maxHeight:700,minHeight:450,position:"relative",overflow:"hidden"}}>
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
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{V.type}</span>
          <span style={{display:"flex",alignItems:"center",gap:4,...sf(9,500),color:C.gn,padding:"4px 8px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)"}}><div style={{width:5,height:5,borderRadius:"50%",background:C.gn}}/>Available</span>
        </div>
        {/* Brand label — bottom left */}
        <div style={{position:"absolute",bottom:48,left:"clamp(16px,4vw,40px)",display:"flex",alignItems:"center",gap:8,zIndex:5}}>
          <div style={{width:20,height:2.5,borderRadius:2,background:"rgba(255,255,255,0.5)"}}/>
          <span style={{...sf(10,500),letterSpacing:3,color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>{V.type}</span>
        </div>
        <div style={{position:"absolute",bottom:48,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:10}}>
          {V.imgs.map(function(_,i){return <div key={i} onClick={function(){setIdx(i)}} style={{width:i===idx?20:5,height:4,borderRadius:2,background:"rgba(255,255,255,"+(i===idx?"0.85":"0.2")+")",transition:"all 0.3s",cursor:"pointer"}}/>})}
        </div>
      </section>

      {/* Mobile booking card — shown only on mobile */}
      <div className="mobile-booking" style={{padding:"16px 16px 0"}}>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"22px 20px"}}>
          <div style={{...sf(10,600),color:C.s7,letterSpacing:3,textTransform:"uppercase",marginBottom:10}}>Book a Session</div>
          <div style={{display:"flex",alignItems:"baseline",gap:5,marginBottom:16}}>
            <span style={{...sf(24,700),color:C.s1}}>{cur.price}</span>
            <span style={{...sf(13),color:C.s6}}>· {cur.duration}</span>
          </div>
          <div style={{display:"flex",gap:4,marginBottom:14}}>
            {["9 AM","10 AM","12 PM","2 PM","4 PM"].map(function(t){var active=time===t;return <div key={t} onClick={function(){setTime(t)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(10,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{t}</div>})}
          </div>
          <div onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm interested in booking a session at "+V.name+". Could you help me arrange this?"),"_blank")}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,marginBottom:8}}>Book Session</div>
        </div>
      </div>

      {/* Two-column: Title + Note | Booking */}
      <div className="page-wrap" style={{marginTop:-40,position:"relative",zIndex:10,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)"}}>
        <div className="two-col">
          <div className="left-col">
            <div style={{marginBottom:40}}>
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                <span style={{...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F",border:"0.5px solid "+C.gn+"1A"}}>✦ ALFRED VERIFIED</span>
              </div>
              <h1 className="wd-name" style={{...sf(38,700),letterSpacing:-1.5,marginBottom:8}}>{V.name}</h1>
              <p style={{...sf(16,300),color:C.s5,marginBottom:16}}>{V.tagline}</p>
              <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span style={{...sf(14,600),color:C.s1}}>{V.rating}</span>
                  <span style={{...sf(12),color:C.s6}}>({V.reviewCount})</span>
                </div>
                <div style={{width:1,height:14,background:C.bd}}/>
                <span style={{...sf(13),color:C.s4}}>{V.type}</span>
                <div style={{width:1,height:14,background:C.bd}}/>
                <span style={{...sf(13,500),color:C.s4}}>{V.priceLevel}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginTop:12}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{...sf(12),color:C.s5}}>{V.address}</span>
              </div>
              <div style={{display:"flex",alignItems:"baseline",gap:6,marginTop:20}}>
                <span style={{...sf(34,700),color:C.s1}}>{V.treatments[0].price}</span>
                <span style={{...sf(14),color:C.s6}}>starting from</span>
              </div>
            </div>
            {/* Alfred's Note */}
            <div ref={noteRef} style={{paddingTop:32,marginBottom:40}}>
              {secDiv}
              <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:noteVis?1:0,transition:"all 0.8s ease"}}>Alfred's Note</p>
              <div style={{borderRadius:24,border:"1px solid "+C.bd,background:C.el,padding:"36px 32px",position:"relative",overflow:"hidden",opacity:noteVis?1:0,transform:noteVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
                <div style={{position:"absolute",bottom:20,right:24,opacity:0.025}}><Mark size={100} color={C.s1}/></div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}><Mark size={24} color={C.s5}/><span style={{...sf(11,500),color:C.s5,letterSpacing:1}}>From your concierge</span><div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px rgba(52,199,89,0.4)"}}/></div>
                <p style={{...sf(15,400),color:C.s3,lineHeight:1.8,fontStyle:"italic",marginBottom:22,position:"relative",zIndex:1}}>"{V.alfredNote}"</p>
                <div style={{height:0.5,background:C.bd,marginBottom:18}}/>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{...sf(13),color:C.s6,marginTop:1}}>✨</span><span style={{...sf(13),color:C.s5,lineHeight:1.6}}>{V.alfredTip}</span></div>
              </div>
            </div>
          </div>

          {/* RIGHT — Sticky Appointment Booking */}
          <div className="right-col">
            <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden"}}>
              <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
              <div style={{padding:"24px 22px"}}>
                <div style={{...sf(18,700),color:C.s1,marginBottom:4}}>Book a Session</div>
                <div style={{...sf(12),color:C.s5,marginBottom:20}}>{cur.name} · {cur.duration} · {cur.price}</div>
                {/* Treatment selector */}
                <div style={{marginBottom:14}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Treatment</div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {V.treatments.map(function(t,i){var active=selTreat===i;return <div key={i} onClick={function(){setSelTreat(i)}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderRadius:12,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.15)":C.bd),cursor:"pointer",transition:"all 0.2s"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:8,height:8,borderRadius:"50%",border:active?"2px solid "+C.s1:"2px solid "+C.s7,background:active?C.s1:"transparent",transition:"all 0.2s"}}/>
                        <div><div style={{...sf(11,active?600:400),color:active?C.s1:C.s5}}>{t.name}</div><div style={{...sf(10),color:C.s6}}>{t.duration}</div></div>
                      </div>
                      <span style={{...sf(12,600),color:active?C.s1:C.s6}}>{t.price}</span>
                    </div>})}
                  </div>
                </div>
                {/* Date */}
                <div style={{marginBottom:14}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Date</div>
                  <DarkDatePicker value={date} onChange={function(v){setDate(v)}} label="Date"/>
                </div>
                {/* Time */}
                <div style={{marginBottom:14}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Time</div>
                  <div style={{display:"flex",gap:4}}>
                    {["9 AM","10 AM","12 PM","2 PM","4 PM"].map(function(t){var active=time===t;return <div key={t} onClick={function(){setTime(t)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(10,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{t}</div>})}
                  </div>
                </div>
                {/* Guests */}
                <div style={{marginBottom:18}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Guests</div>
                  <div style={{display:"flex",gap:4}}>
                    {["1","2 (Couples)"].map(function(g){var active=guests===g;return <div key={g} onClick={function(){setGuests(g)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(12,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{g}</div>})}
                  </div>
                </div>
                <div onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm interested in booking a session at "+V.name+". Could you help me arrange this?"),"_blank")}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Book Session</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:14}}>
                  {["Free cancellation","Confirmed instantly"].map(function(t,i){return <span key={i} style={{...sf(10),color:C.s6}}>{t}</span>})}
                </div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderRadius:14,background:C.gn+"08",border:"0.5px solid "+C.gn+"1A",marginTop:12}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px "+C.gn+"66",flexShrink:0}}/>
              <div><div style={{...sf(12,600),color:C.s1}}>Slots available this week</div><div style={{...sf(11),color:C.gn+"CC",marginTop:1}}>Tuesday 10 AM · Wednesday 2 PM</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px 0",borderRadius:14,border:"1px solid "+C.bd,marginTop:10,cursor:"pointer",...sf(12,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              Ask about treatments
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FULL-WIDTH ═══ */}

      {/* At a Glance */}
      <div ref={factsRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:factsVis?1:0,transition:"all 0.8s ease"}}>At a Glance</p>
        <div className="facts-g" style={{opacity:factsVis?1:0,transform:factsVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.facts.map(function(f,i){return(<div key={i} style={{padding:"22px 22px",borderRadius:20,background:C.el,border:"1px solid "+C.bd,transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:16}}>{f.icon}</span><span style={{...sf(12),color:C.s5}}>{f.label}</span></div><span style={{...sf(15,600),color:C.s1}}>{f.value}</span></div>)})}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:16,opacity:factsVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>
          {V.bestFor.map(function(tag,i){return <span key={i} style={{...sf(12),color:C.s4,padding:"0 16px",height:34,lineHeight:"34px",borderRadius:17,background:C.srf,border:"0.5px solid "+C.bd}}>{tag}</span>})}
        </div>
      </div>

      {/* Signature Treatments */}
      <div ref={treatRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:32,marginBottom:20}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",opacity:treatVis?1:0,transition:"all 0.8s ease"}}>Signature Treatments</p>
          <span style={{...sf(12),color:C.s6,opacity:treatVis?1:0}}>Full menu at venue</span>
        </div>
        <div className="treat-row" style={{opacity:treatVis?1:0,transform:treatVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.treatments.map(function(t,i){var active=selTreat===i;var catCol=t.cat==="Facial"?"#60A5FA":t.cat==="Ritual"?"#A78BFA":"#34D399";return(
            <div key={i} onClick={function(){setSelTreat(i)}} style={{width:210,flexShrink:0,borderRadius:20,background:C.el,border:active?"1.5px solid rgba(244,244,245,0.2)":"1px solid "+C.bd,overflow:"hidden",display:"flex",flexDirection:"column",cursor:"pointer",transition:"all 0.4s",transform:active?"translateY(-4px)":"none",boxShadow:active?"0 8px 30px rgba(0,0,0,0.3)":"none"}} onMouseEnter={function(e){if(!active){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.transform="translateY(-3px)"}}} onMouseLeave={function(e){if(!active){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.transform="translateY(0)"}}}>
              <div style={{height:2,background:"linear-gradient(90deg,"+catCol+"4D,"+catCol+"1A)"}}/>
              <div style={{padding:"20px 18px",flex:1,display:"flex",flexDirection:"column"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <span style={{...sf(9,500),letterSpacing:1.5,color:catCol+"8C",textTransform:"uppercase"}}>{t.cat}</span>
                  {t.popular&&<span style={{...sf(8,600),letterSpacing:0.8,color:"#FB923CCC",padding:"3px 7px",borderRadius:6,background:"#FB923C15"}}>POPULAR</span>}
                  {active&&<span style={{...sf(8,600),letterSpacing:0.8,color:C.gn,padding:"3px 7px",borderRadius:6,background:C.gn+"15"}}>SELECTED</span>}
                </div>
                <div style={{...sf(16,600),color:C.s1,lineHeight:1.3,marginBottom:6,minHeight:42}}>{t.name}</div>
                <div style={{...sf(12),color:C.s5,lineHeight:1.5}}>{t.desc}</div>
                <div style={{flex:1}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14}}>
                  <span style={{...sf(15,600),color:C.s3}}>{t.price}</span>
                  <span style={{...sf(11),color:C.s6}}>{t.duration}</span>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>

      {/* The Experience */}
      <div ref={atmoRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:atmoVis?1:0,transition:"all 0.8s ease"}}>The Experience</p>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"28px 30px",display:"flex",flexDirection:"column",gap:22,opacity:atmoVis?1:0,transform:atmoVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.atmosphere.map(function(m,i){return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{...sf(13,400),color:C.s1,width:90,flexShrink:0}}>{m.label}</span>
              <div style={{flex:1,height:3,borderRadius:2,background:"rgba(244,244,245,0.04)",overflow:"hidden"}}>
                <div style={{height:"100%",width:atmoVis?m.value+"%":"0%",borderRadius:2,background:m.value>90?"linear-gradient(90deg,#A78BFA,#F472B6)":"linear-gradient(90deg,"+C.s4+","+C.s3+")",transition:"width 1.2s cubic-bezier(0.16,1,0.3,1) "+(0.3+i*0.12)+"s"}}/>
              </div>
              <span style={{...sf(12,500),color:C.s5,width:28,textAlign:"right",flexShrink:0}}>{m.value}</span>
            </div>
          )})}
        </div>
        {/* Facilities */}
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"18px 20px",marginTop:14,opacity:atmoVis?1:0,transition:"opacity 0.8s ease 0.4s"}}>
          <div style={{...sf(10,500),color:C.s7,letterSpacing:3,textTransform:"uppercase",marginBottom:14}}>Facilities</div>
          {V.facilities.map(function(f,i){return(
            <div key={i}>{i>0&&<div style={{height:0.5,background:C.bd}}/>}<div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 4px"}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg><span style={{...sf(13),color:C.s3}}>{f}</span></div></div>
          )})}
        </div>
      </div>

      {/* Hours */}
      <div ref={hoursRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:hoursVis?1:0,transition:"all 0.8s ease"}}>Hours</p>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden",opacity:hoursVis?1:0,transform:hoursVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {[{l:"Open",v:V.hours.open,c:C.gn},{l:"Last booking",v:V.hours.lastBooking,c:C.gold}].map(function(r,i){return(<div key={i}><div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 24px"}}><div style={{width:7,height:7,borderRadius:"50%",background:r.c,opacity:0.55,flexShrink:0}}/><span style={{...sf(13,500),color:C.s5,width:100}}>{r.l}</span><span style={{...sf(14),color:C.s1}}>{r.v}</span></div>{i<1&&<div style={{height:0.5,background:C.bd,marginLeft:24}}/>}</div>)})}
        </div>
      </div>

      {/* Reviews */}
      <div ref={revRef} className="page-wrap" style={{paddingTop:60,marginBottom:60}}>
        {secDiv}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:32,marginBottom:20}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",opacity:revVis?1:0,transition:"all 0.8s ease"}}>From Members</p>
          <span style={{...sf(12),color:C.s6,opacity:revVis?1:0}}>{V.reviewCount} reviews</span>
        </div>
        <div className="rev-row" style={{opacity:revVis?1:0,transform:revVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.reviews.map(function(r,i){var isTop=r.tier==="Noir"||r.tier==="Black";return(
            <div key={i} style={{width:300,flexShrink:0,borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"24px 22px",transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:C.srf,border:"0.5px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{...sf(15,300),color:C.s5}}>{r.name.charAt(0)}</span></div>
                <div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{...sf(13,600),color:C.s1}}>{r.name}</span><span style={{...sf(8,600),letterSpacing:0.8,color:isTop?C.s3:C.s5,padding:"2px 8px",borderRadius:6,background:isTop?"rgba(244,244,245,0.06)":C.srf,border:"0.5px solid "+(isTop?"rgba(244,244,245,0.1)":C.bd),textTransform:"uppercase"}}>{r.tier}</span></div>
                <div style={{display:"flex",alignItems:"center",gap:3,marginTop:4}}>{Array.from({length:r.rating}).map(function(_,si){return <svg key={si} width="9" height="9" viewBox="0 0 24 24" fill={C.gold}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>})}<span style={{...sf(10),color:C.s6,marginLeft:4}}>{r.date}</span></div></div>
              </div>
              <p style={{...sf(13),color:C.s4,lineHeight:1.7,fontStyle:"italic"}}>"{r.text}"</p>
            </div>
          )})}
        </div>
      </div>

      {/* CTA */}
      <section ref={ctaRef} style={{padding:"120px 0 100px",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"}}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Book</p>
          <h2 style={{...sf(44,600),letterSpacing:-1.5,lineHeight:1.1,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Ready for<br/>{V.name}?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginTop:16,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Your concierge handles everything — just show up and unwind.</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 36px",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.4s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Book a Session<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg></div>
          <p style={{...sf(12),color:C.s6,marginTop:20,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.6s"}}>Free cancellation · Confirmed instantly</p>
        </div>
      </section>

      <footer style={{borderTop:"1px solid "+C.bd,padding:"36px clamp(16px,4vw,40px)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s7}/><span style={{...sf(10),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Alfred ©2026</span></div>
        <div style={{display:"flex",gap:20}}>
          <a href="/" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Home</a>
          <a href="/catalog/wellness" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Wellness</a>
          <a href="/catalog" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Catalog</a>
        </div>
      </footer>
    </div>
  );
}
