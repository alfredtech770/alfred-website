import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){
  var sw=Math.max(p.size*0.06,1.5);
  return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>);
}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}


var TIERS=[{label:"1-2 days",min:1,max:2,disc:0},{label:"3-6 days",min:3,max:6,disc:5},{label:"7-13 days",min:7,max:13,disc:10},{label:"14-29 days",min:14,max:29,disc:15},{label:"30+ days",min:30,max:999,disc:20}];
function getTier(d){return TIERS.find(function(t){return d>=t.min&&d<=t.max})||TIERS[0]}
function dayRate(base,d){return Math.round(base*(1-getTier(d).disc/100))}

var REVIEWS=[
  {name:"Alexander K.",tier:"Noir",rating:5,text:"The handover experience alone is worth it. Alfred had it delivered to my hotel with a full walkthrough. Drove it to Key West — unforgettable.",date:"1 week ago"},
  {name:"Marcus L.",tier:"Black",rating:5,text:"I've rented supercars before. This was different. The concierge handled everything — insurance, route suggestions, even restaurant recs.",date:"3 weeks ago"},
  {name:"David R.",tier:"Member",rating:5,text:"Booked for my birthday. Alfred surprised me with a bottle of Dom in the passenger seat. Will be back for the Revuelto.",date:"1 month ago"},
];

export default function CarDetailPage(){
  var params = useParams();
  var storedCar = null;
  try { storedCar = JSON.parse(sessionStorage.getItem("alfred_car_" + params.slug)); } catch(e) {}
  if (!storedCar) {
    return (<div style={{width:"100%",minHeight:"100vh",background:"#0A0A0B",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:20}}>
      <h2 style={{color:"#F4F4F5",fontFamily:"system-ui",fontSize:24}}>Car not found</h2>
      <a href="/catalog/exotic-cars" style={{color:"#A1A1AA",fontFamily:"system-ui",fontSize:14}}>← Back to catalog</a>
    </div>);
  }
  var CAR = {
    name: storedCar.name,
    brand: storedCar.brand,
    body: storedCar.body || "Coupe",
    pricePerDay: storedCar.price,
    imgs: storedCar.imgs || [storedCar.img],
    hp: storedCar.hp,
    torque: "",
    engine: storedCar.engine || "",
    transmission: storedCar.trans || "Auto",
    drive: storedCar.drive || "AWD",
    topSpeed: storedCar.top + " km/h",
    acceleration: storedCar.accel,
    weight: "",
    seats: storedCar.seats || 2,
    rating: 5.0,
    reviews: Math.floor(Math.random() * 20) + 5,
    available: storedCar.available !== false,
    color: "",
    location: (storedCar.locs || []).join(" · "),
    features: ["Unlimited km per day","Full insurance included","Free delivery & pickup","24/7 roadside assistance"],
    deposit: storedCar.deposit || 1000,
    alfredNote: "Contact Alfred for the best experience with this " + storedCar.brand + " " + storedCar.name + ". We handle delivery, insurance, and everything in between.",
    alfredTip: "Book at least 48 hours in advance for guaranteed availability.",
  };

  var [idx,setIdx]=useState(0);
  var [liked,setLiked]=useState(false);
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [days,setDays]=useState(3);
  var [pickup,setPickup]=useState("2026-03-20");
  var [returnD,setReturnD]=useState("2026-03-23");

  var specsRef=useRef(null);var specsVis=useVis(specsRef);
  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var inclRef=useRef(null);var inclVis=useVis(inclRef);
  var priceRef=useRef(null);var priceVis=useVis(priceRef);
  var revRef=useRef(null);var revVis=useVis(revRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  var rate=dayRate(CAR.pricePerDay,days);var total=rate*days;var tier=getTier(days);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);
  useEffect(function(){var t=setInterval(function(){setIdx(function(c){return(c+1)%CAR.imgs.length})},5000);return function(){clearInterval(t)}},[]);

  var navOp=Math.min(scrollY/250,1);var heroY=scrollY*0.25;var heroScale=1+scrollY*0.0003;
  var inputS={padding:"12px 16px",borderRadius:12,background:C.bg,border:"1px solid "+C.bd,color:C.s1,...sf(14),outline:"none",width:"100%",colorScheme:"dark"};
  var secDiv=<div style={{height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)",margin:"0 0 0"}}/>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.6);cursor:pointer}
.page-wrap{max-width:1060px;margin:0 auto;padding:0 40px}
.two-col{display:flex;gap:40px;align-items:flex-start}
.left-col{flex:1;min-width:0}
.right-col{width:320px;flex-shrink:0;position:sticky;top:80px}
.spec-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.detail-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.rev-row{display:flex;gap:14px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.rev-row::-webkit-scrollbar{display:none}
@media(max-width:900px){
  .two-col{flex-direction:column!important}
  .right-col{width:100%!important;position:relative!important;top:auto!important}
}
@media(max-width:768px){
  .page-wrap{padding:0 24px!important}
  .cd-hero{height:380px!important}
  .cd-name{font-size:30px!important}
  .spec-grid{grid-template-columns:repeat(2,1fr)!important}
  .detail-grid{grid-template-columns:repeat(2,1fr)!important}
}
@media(max-width:390px){.cd-hero{height:320px!important}.cd-name{font-size:26px!important}}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      {/* Nav */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <a href="/catalog/exotic-cars" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>← All Cars</a>
          <div style={{...sf(12,500),color:C.s1,opacity:Math.min(navOp*2,1),transition:"opacity 0.3s"}}>{CAR.brand} {CAR.name}</div>
        </div>
      </nav>

      {/* Hero */}
      <section className="cd-hero" style={{height:520,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,transform:"translateY("+heroY+"px) scale("+heroScale+")"}}>
          {CAR.imgs.map(function(img,i){return <img key={i} src={img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"120%",objectFit:"cover",objectPosition:"center",opacity:i===idx?1:0,transition:"opacity 0.8s ease",filter:"brightness(1.25)"}}/>})}
        </div>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0.4) 0%,transparent 30%,rgba(10,10,11,0.5) 60%,#0A0A0B 100%)"}}/>
        <div style={{position:"absolute",bottom:48,left:40,display:"flex",alignItems:"center",gap:8,zIndex:5}}><div style={{width:20,height:2.5,borderRadius:2,background:"rgba(255,255,255,0.5)"}}/><span style={{...sf(10,500),letterSpacing:3,color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>{CAR.brand}</span></div>
        <div style={{position:"absolute",top:56,right:40,display:"flex",gap:8,zIndex:10}}>
          <div onClick={function(){setLiked(!liked)}} style={{width:36,height:36,borderRadius:12,background:"rgba(0,0,0,0.4)",border:"0.5px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(0,0,0,0.4)"}}><svg width="13" height="13" viewBox="0 0 24 24" fill={liked?C.red:"none"} stroke={liked?C.red:"rgba(255,255,255,0.5)"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>
          <div style={{width:36,height:36,borderRadius:12,background:"rgba(0,0,0,0.4)",border:"0.5px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg></div>
        </div>
        <div style={{position:"absolute",top:56,left:40,display:"flex",gap:6,zIndex:10}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{CAR.body}</span>
          <span style={{...sf(9,500),color:C.s5,padding:"4px 8px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)"}}>{CAR.drive}</span>
        </div>
        <div style={{position:"absolute",bottom:48,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:10}}>
          {CAR.imgs.map(function(_,i){return <div key={i} onClick={function(){setIdx(i)}} style={{width:i===idx?20:5,height:4,borderRadius:2,background:"rgba(255,255,255,"+(i===idx?"0.85":"0.2")+")",transition:"all 0.3s",cursor:"pointer"}}/>})}
        </div>
      </section>

      {/* ═══ TWO-COLUMN LAYOUT ═══ */}
      <div className="page-wrap" style={{marginTop:-40,position:"relative",zIndex:10,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)"}}>
        <div className="two-col">

          {/* ═══ LEFT — Content ═══ */}
          <div className="left-col">
            {/* Title */}
            <div style={{marginBottom:40}}>
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                <span style={{...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F",border:"0.5px solid "+C.gn+"1A"}}>✦ ALFRED VERIFIED</span>
                {CAR.available&&<span style={{display:"flex",alignItems:"center",gap:5,...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F"}}><div style={{width:5,height:5,borderRadius:"50%",background:C.gn}}/>AVAILABLE</span>}
              </div>
              <h1 className="cd-name" style={{...sf(38,700),letterSpacing:-1.5,marginBottom:6}}>{CAR.name}</h1>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg><span style={{...sf(12),color:C.s5}}>{CAR.location}</span></div>
                <div style={{width:1,height:12,background:C.bd}}/>
                <div style={{display:"flex",alignItems:"center",gap:4}}><svg width="11" height="11" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><span style={{...sf(13,600),color:C.s1}}>{CAR.rating}</span><span style={{...sf(11),color:C.s6}}>({CAR.reviews})</span></div>
                <div style={{width:1,height:12,background:C.bd}}/>
                <span style={{...sf(12),color:C.s5}}>{CAR.color}</span>
              </div>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                <span style={{...sf(34,700),color:C.s1}}>${CAR.pricePerDay.toLocaleString()}</span>
                <span style={{...sf(14),color:C.s6}}>/day</span>
              </div>
            </div>

            {/* Performance */}
            <div ref={specsRef} style={{paddingTop:32,marginBottom:40}}>
              {secDiv}
              <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:24,marginTop:32,opacity:specsVis?1:0,transition:"all 0.8s ease"}}>Performance</p>
              <div className="spec-grid" style={{marginBottom:14,opacity:specsVis?1:0,transform:specsVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.1s"}}>
                {[{emoji:"⚡",value:""+CAR.hp,unit:"hp",label:"Power"},{emoji:"⏱",value:CAR.acceleration,unit:"",label:"0-100 km/h"},{emoji:"🏁",value:CAR.topSpeed.replace(" km/h",""),unit:"km/h",label:"Top speed"}].map(function(s,i){
                  return(<div key={i} style={{padding:"24px 16px",borderRadius:20,background:C.el,border:"1px solid "+C.bd,textAlign:"center",transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}><div style={{fontSize:22,marginBottom:10}}>{s.emoji}</div><div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:3}}><span style={{...sf(28,700),color:C.s1}}>{s.value}</span>{s.unit&&<span style={{...sf(13),color:C.s4}}>{s.unit}</span>}</div><div style={{...sf(10,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",marginTop:6}}>{s.label}</div></div>);
                })}
              </div>
              <div className="detail-grid" style={{opacity:specsVis?1:0,transform:specsVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.2s"}}>
                {[{l:"Engine",v:CAR.engine},{l:"Transmission",v:CAR.transmission},{l:"Drivetrain",v:CAR.drive},{l:"Seats",v:""+CAR.seats},{l:"Body",v:CAR.body},{l:"Location",v:CAR.location}].filter(function(d){return d.v}).map(function(d,i){
                  return(<div key={i} style={{padding:"14px 16px",borderRadius:14,background:C.el,border:"1px solid "+C.bd}}><div style={{...sf(10,500),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>{d.l}</div><div style={{...sf(14,500),color:C.s1}}>{d.v}</div></div>);
                })}
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
                <p style={{...sf(15,400),color:C.s3,lineHeight:1.8,fontStyle:"italic",marginBottom:22,position:"relative",zIndex:1}}>"{CAR.alfredNote}"</p>
                <div style={{height:0.5,background:C.bd,marginBottom:18}}/>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{...sf(13),color:C.s6,marginTop:1}}>✨</span><span style={{...sf(13),color:C.s5,lineHeight:1.6}}>{CAR.alfredTip}</span></div>
              </div>
            </div>

            {/* What's Included */}
            <div ref={inclRef} style={{paddingTop:32,marginBottom:40}}>
              {secDiv}
              <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:24,marginTop:32,opacity:inclVis?1:0,transition:"all 0.8s ease"}}>What's Included</p>
              <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"18px 20px",opacity:inclVis?1:0,transform:inclVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
                {CAR.features.map(function(item,i){var isPrimary=i<4;return(<div key={i}>{i>0&&<div style={{height:0.5,background:C.bd}}/>}<div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 4px"}}><div style={{width:24,height:24,borderRadius:8,background:C.srf,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div><span style={{...sf(13,isPrimary?500:400),color:isPrimary?C.s1:C.s4}}>{item}</span></div></div>)})}
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",borderRadius:20,background:"rgba(244,244,245,0.03)",border:"1px solid "+C.bd,marginTop:14,opacity:inclVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>
                <div><div style={{...sf(14,500),color:C.s1,marginBottom:3}}>Security deposit</div><div style={{...sf(11),color:C.s6}}>Pre-authorised · fully refundable</div></div>
                <div style={{...sf(24,700),color:C.s1}}>${CAR.deposit.toLocaleString()}</div>
              </div>
            </div>

            {/* Pricing */}
            <div ref={priceRef} style={{paddingTop:32,marginBottom:40}}>
              {secDiv}
              <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:24,marginTop:32,opacity:priceVis?1:0,transition:"all 0.8s ease"}}>Pricing</p>
              <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"18px 20px",opacity:priceVis?1:0,transform:priceVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
                {TIERS.map(function(t,i){var active=tier.label===t.label;var dr=dayRate(CAR.pricePerDay,t.min);return(<div key={i}>{i>0&&<div style={{height:0.5,background:C.bd}}/>}<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 4px"}}><div style={{display:"flex",alignItems:"center",gap:8}}>{active&&<div style={{width:4,height:4,borderRadius:"50%",background:C.s1}}/>}<span style={{...sf(13,active?500:400),color:active?C.s1:C.s6}}>{t.label}</span></div><div style={{display:"flex",alignItems:"center",gap:8}}>{t.disc>0&&<span style={{...sf(10,500),color:C.gn,padding:"2px 6px",borderRadius:6,background:C.gn+"14"}}>-{t.disc}%</span>}<span style={{...sf(15,active?600:400),color:active?C.s1:C.s6}}>${dr.toLocaleString()}</span><span style={{...sf(10),color:C.s7}}>/day</span></div></div></div>)})}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:14,padding:"20px 22px",borderRadius:20,background:"rgba(244,244,245,0.03)",border:"1px solid "+C.bd,cursor:"pointer",marginTop:14,opacity:priceVis?1:0,transition:"opacity 0.8s ease 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
                <span style={{...sf(20),color:C.s4}}>✦</span>
                <div style={{flex:1}}><div style={{...sf(14,500),color:C.s1,marginBottom:3}}>Questions about this car?</div><div style={{...sf(12),color:C.s6}}>Chat with your Alfred concierge</div></div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s7} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </div>

            {/* Reviews */}
            <div ref={revRef} style={{paddingTop:32,marginBottom:40}}>
              {secDiv}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:32,marginBottom:20}}>
                <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",opacity:revVis?1:0,transition:"all 0.8s ease"}}>From Members</p>
                <span style={{...sf(12),color:C.s6,opacity:revVis?1:0}}>{CAR.reviews} reviews</span>
              </div>
              <div className="rev-row" style={{opacity:revVis?1:0,transform:revVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
                {REVIEWS.map(function(r,i){var isTop=r.tier==="Noir"||r.tier==="Black";return(<div key={i} style={{width:280,flexShrink:0,borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"22px 20px",transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:C.srf,border:"0.5px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{...sf(14,300),color:C.s5}}>{r.name.charAt(0)}</span></div>
                    <div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{...sf(12,600),color:C.s1}}>{r.name}</span><span style={{...sf(8,600),letterSpacing:0.8,color:isTop?C.s3:C.s5,padding:"2px 7px",borderRadius:6,background:isTop?"rgba(244,244,245,0.06)":C.srf,border:"0.5px solid "+(isTop?"rgba(244,244,245,0.1)":C.bd),textTransform:"uppercase"}}>{r.tier}</span></div>
                    <div style={{display:"flex",alignItems:"center",gap:2,marginTop:3}}>{Array.from({length:r.rating}).map(function(_,si){return <svg key={si} width="8" height="8" viewBox="0 0 24 24" fill={C.gold}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>})}<span style={{...sf(9),color:C.s6,marginLeft:4}}>{r.date}</span></div></div>
                  </div>
                  <p style={{...sf(12),color:C.s4,lineHeight:1.7,fontStyle:"italic"}}>"{r.text}"</p>
                </div>)})}
              </div>
            </div>
          </div>

          {/* ═══ RIGHT — Sticky Booking Card ═══ */}
          <div className="right-col">
            <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden"}}>
              <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
              <div style={{padding:"24px 22px"}}>
                {/* Total */}
                <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{...sf(26,700),color:C.s1}}>${total.toLocaleString()}</span>
                  {tier.disc>0&&<span style={{...sf(12),color:C.s7,textDecoration:"line-through"}}>${(CAR.pricePerDay*days).toLocaleString()}</span>}
                </div>
                <div style={{...sf(11),color:C.s6,marginBottom:20}}>{days} day{days!==1?"s":""} × ${rate.toLocaleString()}{tier.disc>0?<span style={{color:C.gn}}> (-{tier.disc}%)</span>:""}</div>

                {/* Dates */}
                <div style={{display:"flex",gap:8,marginBottom:16}}>
                  <div style={{flex:1}}>
                    <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Pickup</div>
                    <input type="date" value={pickup} onChange={function(e){setPickup(e.target.value)}} style={inputS}/>
                  </div>
                  <div style={{display:"flex",alignItems:"flex-end",paddingBottom:12}}><div style={{width:10,height:1,background:"rgba(244,244,245,0.08)"}}/></div>
                  <div style={{flex:1}}>
                    <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Return</div>
                    <input type="date" value={returnD} onChange={function(e){setReturnD(e.target.value)}} style={inputS}/>
                  </div>
                </div>

                {/* Duration pills */}
                <div style={{display:"flex",gap:4,marginBottom:18}}>
                  {[1,3,7,14,30].map(function(d){var active=days===d;return <div key={d} onClick={function(){setDays(d)}} style={{flex:1,textAlign:"center",padding:"8px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",transition:"all 0.2s"}}><div style={{...sf(14,active?600:400),color:active?C.s1:C.s6}}>{d}</div><div style={{...sf(9),color:active?C.s4:C.s7}}>{d===1?"day":"days"}</div></div>})}
                </div>

                {/* Book */}
                <a href="https://wa.me/message/DAO44K3XCXK3F1" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                  Book Now
                </a>

                {/* Sub-info */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:14}}>
                  {["Free delivery","Full insurance","24/7 support"].map(function(t,i){return <span key={i} style={{...sf(10),color:C.s6}}>{t}</span>})}
                </div>
              </div>
            </div>

            {/* Availability note */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderRadius:14,background:C.gn+"08",border:"0.5px solid "+C.gn+"1A",marginTop:12}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px "+C.gn+"66",flexShrink:0}}/>
              <div>
                <div style={{...sf(12,600),color:C.s1}}>Available now</div>
                <div style={{...sf(11),color:C.gn+"CC",marginTop:1}}>Next available: Tomorrow</div>
              </div>
            </div>

            {/* WhatsApp quick */}
            <a href="https://wa.me/message/DAO44K3XCXK3F1" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px 0",borderRadius:14,border:"1px solid "+C.bd,marginTop:10,cursor:"pointer",...sf(12,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              Ask about this car
            </a>
          </div>
        </div>
      </div>

      {/* Bottom CTA — full width */}
      <section ref={ctaRef} style={{padding:"120px 0 100px",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"}}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Reserve</p>
          <h2 style={{...sf(44,600),letterSpacing:-1.5,lineHeight:1.1,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Ready to drive<br/>the {CAR.name}?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginTop:16,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Tell Alfred your dates and we'll deliver it to your door. Keys in hand, no paperwork.</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 36px",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.4s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Book Now — ${total.toLocaleString()}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg></div>
          <p style={{...sf(12),color:C.s6,marginTop:20,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.6s"}}>Free delivery · Full insurance · 24/7 concierge</p>
        </div>
      </section>

      <footer style={{borderTop:"1px solid "+C.bd,padding:"36px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><Mark size={14} color={C.s7}/><span style={{...sf(10),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Alfred ©2026</span></div>
        <div style={{display:"flex",gap:20}}>
          <a href="/" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Home</a>
          <a href="/catalog/exotic-cars" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Exotic Cars</a>
          <a href="/catalog" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Catalog</a>
        </div>
      </footer>
    </div>
  );
}
