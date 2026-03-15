import { useState, useEffect, useRef } from "react";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

var J={
  name:"Bombardier Global 7500",tagline:"VistaJet's flagship. Four living spaces. Permanent stateroom.",
  type:"Ultra Long Range",from:"$25,000/hr",
  imgs:["https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80","https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80"],
  pax:19,range:"14,260 km",speed:"Mach 0.925",maxSpeed:"Mach 0.925 (1,142 km/h)",ceiling:"51,000 ft",
  engine:"2× GE Passport",cabin:"6'2\" tall · 8'0\" wide · 54 ft long",
  baggage:"195 cu ft",wifi:"Ka-band high-speed",entertainment:"40\" 4K display · Surround sound · Bluetooth",
  rating:4.9,reviewCount:36,
  alfredNote:"The Global 7500 is the reason VistaJet exists at this level. Four distinct living spaces — use the forward club for meetings, the mid-cabin for dining, the entertainment zone for films, and the permanent stateroom with closing door for sleep. At 4,500 ft cabin altitude at 45,000 ft cruise, you land feeling like you haven't flown. Request the full dining service 24 hours ahead — it's restaurant-quality.",
  alfredTip:"Empty legs are frequently available on the MIA→NYC and CDG→LBG routes. Ask Alfred — we can save you up to 60%.",
  included:["Dedicated crew (2 pilots + flight attendant)","Custom Dior amenity kits","Full catering & premium beverages","Ground transportation coordination","Ka-band Wi-Fi & satellite phone","Permanent stateroom with lie-flat bed","Full-size lavatory with shower","195 cu ft baggage hold"],
  routes:[
    {from:"Miami",to:"Paris",time:"~9 hrs",est:"$225,000"},
    {from:"Miami",to:"New York",time:"~3 hrs",est:"$75,000"},
    {from:"Paris",to:"Dubai",time:"~7 hrs",est:"$175,000"},
    {from:"New York",to:"London",time:"~7.5 hrs",est:"$187,500"},
    {from:"Miami",to:"Ibiza",time:"~10 hrs",est:"$250,000"},
    {from:"Paris",to:"Nice",time:"~1.5 hrs",est:"$37,500"},
  ],
  specs:[
    {l:"Range",v:"14,260 km / 7,700 nmi"},{l:"Max Speed",v:"Mach 0.925"},{l:"Ceiling",v:"51,000 ft"},
    {l:"Engine",v:"2× GE Passport"},{l:"Passengers",v:"Up to 19 (8 sleeping)"},{l:"Crew",v:"2 pilots + 1 attendant"},
    {l:"Cabin Height",v:"6 ft 2 in"},{l:"Cabin Width",v:"8 ft 0 in"},{l:"Cabin Length",v:"54 ft"},
    {l:"Baggage",v:"195 cu ft"},{l:"Wi-Fi",v:"Ka-band high-speed"},{l:"Cabin Altitude",v:"4,500 ft at FL450"},
  ],
  reviews:[
    {name:"Robert C.",tier:"Noir",rating:5,text:"MIA to CDG, 9 hours flat. Slept in the stateroom, woke up to espresso and croissants. Alfred handled ground transport on both ends. VistaJet's silver livery is unmistakable on the tarmac.",date:"2 weeks ago"},
    {name:"Jonathan W.",tier:"Black",rating:5,text:"Booked an empty leg NYC to Miami — 60% off. The Global 7500 cabin is unmatched. Four zones, full shower, Dior amenity kit. This is the benchmark.",date:"1 month ago"},
    {name:"Sarah K.",tier:"Member",rating:5,text:"Team offsite: 12 of us flew Miami to Aspen. Used the forward cabin for a board meeting mid-flight. Catering was restaurant-quality. Never flying commercial again.",date:"3 weeks ago"},
  ],
};

export default function JetDetailPage(){
  var [idx,setIdx]=useState(0);
  var [liked,setLiked]=useState(false);
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [from,setFrom]=useState("Miami (MIA)");
  var [to,setTo]=useState("Paris (CDG)");
  var [date,setDate]=useState("2026-03-25");
  var [pax,setPax]=useState("6");
  var [tripType,setTripType]=useState("One Way");

  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var specsRef=useRef(null);var specsVis=useVis(specsRef);
  var inclRef=useRef(null);var inclVis=useVis(inclRef);
  var routesRef=useRef(null);var routesVis=useVis(routesRef);
  var revRef=useRef(null);var revVis=useVis(revRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);
  useEffect(function(){var t=setInterval(function(){setIdx(function(c){return(c+1)%J.imgs.length})},5000);return function(){clearInterval(t)}},[]);

  var navOp=Math.min(scrollY/250,1);var heroY=scrollY*0.25;var heroScale=1+scrollY*0.0003;
  var secDiv=<div style={{height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)"}}/>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
.page-wrap{max-width:1060px;margin:0 auto;padding:0 40px}
.two-col{display:flex;gap:40px;align-items:flex-start}
.left-col{flex:1;min-width:0}
.right-col{width:320px;flex-shrink:0;position:sticky;top:80px}
.spec-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.routes-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.rev-row{display:flex;gap:14px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.rev-row::-webkit-scrollbar{display:none}
@media(max-width:900px){.two-col{flex-direction:column!important}.right-col{width:100%!important;position:relative!important;top:auto!important}}
@media(max-width:768px){.page-wrap{padding:0 24px!important}.jd-hero{height:380px!important}.jd-name{font-size:30px!important}.spec-grid{grid-template-columns:repeat(2,1fr)!important}.routes-grid{grid-template-columns:1fr 1fr!important}}
@media(max-width:390px){.jd-hero{height:320px!important}.jd-name{font-size:26px!important}.routes-grid{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <a href="/catalog/jets" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>← All Jets</a>
          <div style={{...sf(12,500),color:C.s1,opacity:Math.min(navOp*2,1),transition:"opacity 0.3s"}}>{J.name}</div>
        </div>
      </nav>

      <section className="jd-hero" style={{height:520,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,transform:"translateY("+heroY+"px) scale("+heroScale+")"}}>
          {J.imgs.map(function(img,i){return <img key={i} src={img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"120%",objectFit:"cover",opacity:i===idx?1:0,transition:"opacity 0.8s ease"}}/>})}
        </div>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0.4) 0%,transparent 30%,rgba(10,10,11,0.5) 60%,#0A0A0B 100%)"}}/>
        <div style={{position:"absolute",top:56,right:40,display:"flex",gap:8,zIndex:10}}>
          <div onClick={function(){setLiked(!liked)}} style={{width:36,height:36,borderRadius:12,background:"rgba(0,0,0,0.4)",border:"0.5px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(0,0,0,0.4)"}}><svg width="13" height="13" viewBox="0 0 24 24" fill={liked?C.red:"none"} stroke={liked?C.red:"rgba(255,255,255,0.5)"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>
          <div style={{width:36,height:36,borderRadius:12,background:"rgba(0,0,0,0.4)",border:"0.5px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg></div>
        </div>
        <div style={{position:"absolute",top:56,left:40,display:"flex",gap:6,zIndex:10}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{J.type}</span>
        </div>
        <div style={{position:"absolute",bottom:48,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:10}}>
          {J.imgs.map(function(_,i){return <div key={i} onClick={function(){setIdx(i)}} style={{width:i===idx?20:5,height:4,borderRadius:2,background:"rgba(255,255,255,"+(i===idx?"0.85":"0.2")+")",transition:"all 0.3s",cursor:"pointer"}}/>})}
        </div>
      </section>

      {/* Two-column */}
      <div className="page-wrap" style={{marginTop:-40,position:"relative",zIndex:10,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)"}}>
        <div className="two-col">
          <div className="left-col">
            <div style={{marginBottom:40}}>
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                <span style={{...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F",border:"0.5px solid "+C.gn+"1A"}}>✦ ALFRED VERIFIED</span>
                <span style={{display:"flex",alignItems:"center",gap:5,...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F"}}><div style={{width:5,height:5,borderRadius:"50%",background:C.gn}}/>AVAILABLE</span>
              </div>
              <h1 className="jd-name" style={{...sf(38,700),letterSpacing:-1.5,marginBottom:8}}>{J.name}</h1>
              <p style={{...sf(16,300),color:C.s5,marginBottom:16}}>{J.tagline}</p>
              <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span style={{...sf(14,600),color:C.s1}}>{J.rating}</span>
                  <span style={{...sf(12),color:C.s6}}>({J.reviewCount})</span>
                </div>
                <div style={{width:1,height:14,background:C.bd}}/>
                <span style={{...sf(13),color:C.s4}}>{J.pax} passengers</span>
                <div style={{width:1,height:14,background:C.bd}}/>
                <span style={{...sf(13),color:C.s4}}>{J.range} range</span>
              </div>
              <div style={{display:"flex",alignItems:"baseline",gap:6,marginTop:16}}>
                <span style={{...sf(30,700),color:C.s1}}>$25,000</span>
                <span style={{...sf(14),color:C.s6}}>/flight hour</span>
              </div>
            </div>
            <div ref={noteRef} style={{paddingTop:32,marginBottom:40}}>
              {secDiv}
              <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:noteVis?1:0,transition:"all 0.8s ease"}}>Alfred's Note</p>
              <div style={{borderRadius:24,border:"1px solid "+C.bd,background:C.el,padding:"36px 32px",position:"relative",overflow:"hidden",opacity:noteVis?1:0,transform:noteVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
                <div style={{position:"absolute",bottom:20,right:24,opacity:0.025}}><Mark size={100} color={C.s1}/></div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}><Mark size={18} color={C.s5}/><span style={{...sf(11,500),color:C.s5,letterSpacing:1}}>From your concierge</span><div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px rgba(52,199,89,0.4)"}}/></div>
                <p style={{...sf(15,400),color:C.s3,lineHeight:1.8,fontStyle:"italic",marginBottom:22,position:"relative",zIndex:1}}>"{J.alfredNote}"</p>
                <div style={{height:0.5,background:C.bd,marginBottom:18}}/>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{...sf(13),color:C.s6,marginTop:1}}>✨</span><span style={{...sf(13),color:C.s5,lineHeight:1.6}}>{J.alfredTip}</span></div>
              </div>
            </div>
          </div>

          {/* RIGHT — Quote request */}
          <div className="right-col">
            <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden"}}>
              <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
              <div style={{padding:"24px 22px"}}>
                <div style={{...sf(18,700),color:C.s1,marginBottom:4}}>Request a Quote</div>
                <div style={{...sf(12),color:C.s5,marginBottom:20}}>From $25,000/hr · {J.name}</div>
                {/* Route */}
                <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"flex-end"}}>
                  <div style={{flex:1}}>
                    <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>From</div>
                    <div style={{padding:"12px 14px",borderRadius:12,background:C.srf,border:"1px solid "+C.bd,...sf(13,500),color:C.s1}}>{from.split(" (")[0]}</div>
                  </div>
                  <div onClick={function(){var t=from;setFrom(to);setTo(t)}} style={{width:32,height:32,borderRadius:"50%",background:C.srf,border:"1px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginBottom:4}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>To</div>
                    <div style={{padding:"12px 14px",borderRadius:12,background:C.srf,border:"1px solid "+C.bd,...sf(13,500),color:C.s1}}>{to.split(" (")[0]}</div>
                  </div>
                </div>
                {/* Trip type */}
                <div style={{display:"flex",gap:4,marginBottom:14}}>
                  {["One Way","Round Trip"].map(function(t){var active=tripType===t;return <div key={t} onClick={function(){setTripType(t)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(12,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{t}</div>})}
                </div>
                {/* Date */}
                <div style={{marginBottom:14}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Departure</div>
                  <input type="date" value={date} onChange={function(e){setDate(e.target.value)}} style={{padding:"12px 16px",borderRadius:12,background:C.srf,border:"1px solid "+C.bd,color:C.s1,...sf(14),outline:"none",width:"100%"}}/>
                </div>
                {/* Passengers */}
                <div style={{marginBottom:18}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Passengers</div>
                  <div style={{display:"flex",gap:4}}>
                    {["2","4","6","10","16+"].map(function(g){var active=pax===g;return <div key={g} onClick={function(){setPax(g)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(13,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{g}</div>})}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Request Quote</div>
                <div style={{textAlign:"center",marginTop:10,...sf(11),color:C.s6}}>Quote within 1 hour · No commitment</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderRadius:14,background:C.gn+"08",border:"0.5px solid "+C.gn+"1A",marginTop:12}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px "+C.gn+"66",flexShrink:0}}/>
              <div><div style={{...sf(12,600),color:C.s1}}>Available for charter</div><div style={{...sf(11),color:C.gn+"CC",marginTop:1}}>Next availability: March 25</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px 0",borderRadius:14,border:"1px solid "+C.bd,marginTop:10,cursor:"pointer",...sf(12,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              Ask about this aircraft
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FULL-WIDTH ═══ */}

      {/* Specs */}
      <div ref={specsRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:24,marginTop:32,opacity:specsVis?1:0,transition:"all 0.8s ease"}}>Performance & Cabin</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14,opacity:specsVis?1:0,transform:specsVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.1s"}}>
          {[{emoji:"🌍",value:J.range.split(" ")[0],unit:"km",label:"Range"},{emoji:"⚡",value:J.speed,unit:"",label:"Max Speed"},{emoji:"☁️",value:J.ceiling.replace(" ft",""),unit:"ft",label:"Ceiling"}].map(function(s,i){
            return(<div key={i} style={{padding:"24px 16px",borderRadius:20,background:C.el,border:"1px solid "+C.bd,textAlign:"center",transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}><div style={{fontSize:22,marginBottom:10}}>{s.emoji}</div><div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:3}}><span style={{...sf(28,700),color:C.s1}}>{s.value}</span>{s.unit&&<span style={{...sf(13),color:C.s4}}>{s.unit}</span>}</div><div style={{...sf(10,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",marginTop:6}}>{s.label}</div></div>);
          })}
        </div>
        <div className="spec-grid" style={{opacity:specsVis?1:0,transform:specsVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.2s"}}>
          {J.specs.map(function(s,i){return(<div key={i} style={{padding:"14px 16px",borderRadius:14,background:C.el,border:"1px solid "+C.bd}}><div style={{...sf(10,500),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>{s.l}</div><div style={{...sf(14,500),color:C.s1}}>{s.v}</div></div>)})}
        </div>
      </div>

      {/* What's Included */}
      <div ref={inclRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:24,marginTop:32,opacity:inclVis?1:0,transition:"all 0.8s ease"}}>What's Included</p>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"18px 20px",opacity:inclVis?1:0,transform:inclVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {J.included.map(function(item,i){return(<div key={i}>{i>0&&<div style={{height:0.5,background:C.bd}}/>}<div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 4px"}}><div style={{width:24,height:24,borderRadius:8,background:C.srf,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div><span style={{...sf(13,500),color:C.s1}}>{item}</span></div></div>)})}
        </div>
      </div>

      {/* Sample Routes */}
      <div ref={routesRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:24,marginTop:32,opacity:routesVis?1:0,transition:"all 0.8s ease"}}>Sample Routes & Estimates</p>
        <div className="routes-grid" style={{opacity:routesVis?1:0,transform:routesVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {J.routes.map(function(r,i){return(
            <div key={i} style={{padding:"22px 22px",borderRadius:20,background:C.el,border:"1px solid "+C.bd,transition:"border-color 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{...sf(14,600),color:C.s1}}>{r.from}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M5 12H19M12 5L19 12"/></svg>
                <span style={{...sf(14,600),color:C.s1}}>{r.to}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{...sf(12),color:C.s5}}>{r.time}</span>
                <span style={{...sf(16,700),color:C.s1}}>{r.est}</span>
              </div>
            </div>
          )})}
        </div>
        <div style={{...sf(11),color:C.s6,marginTop:14,opacity:routesVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>* Estimates are one-way, excluding taxes & fees. Final pricing depends on routing, date, and availability.</div>
      </div>

      {/* Reviews */}
      <div ref={revRef} className="page-wrap" style={{paddingTop:60,marginBottom:60}}>
        {secDiv}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:32,marginBottom:20}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",opacity:revVis?1:0,transition:"all 0.8s ease"}}>From Members</p>
          <span style={{...sf(12),color:C.s6,opacity:revVis?1:0}}>{J.reviewCount} reviews</span>
        </div>
        <div className="rev-row" style={{opacity:revVis?1:0,transform:revVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {J.reviews.map(function(r,i){var isTop=r.tier==="Noir"||r.tier==="Black";return(
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
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Charter</p>
          <h2 style={{...sf(44,600),letterSpacing:-1.5,lineHeight:1.1,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Ready to fly<br/>the Global 7500?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginTop:16,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Tell Alfred your route and dates. Quote within the hour, wheels up when you say.</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 36px",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.4s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Request Quote<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg></div>
          <p style={{...sf(12),color:C.s6,marginTop:20,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.6s"}}>Quote within 1 hour · No commitment · Empty legs available</p>
        </div>
      </section>

      <footer style={{borderTop:"1px solid "+C.bd,padding:"36px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><Mark size={14} color={C.s7}/><span style={{...sf(10),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Alfred ©2026</span></div>
        <div style={{display:"flex",gap:20}}>
          <a href="/" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Home</a>
          <a href="/catalog/jets" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Jets</a>
          <a href="/catalog" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Catalog</a>
        </div>
      </footer>
    </div>
  );
}
