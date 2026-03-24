import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DarkDatePicker from "../components/DarkDatePicker";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

/* ═══ CABIN LAYOUT DATA PER JET ═══ */
var CABIN_LAYOUTS={
  "global-7500":{title:"Bombardier Global 7500 — Four-Zone Cabin",zones:[
    {name:"Forward Club",color:"#34C759",x:160,w:160,type:"club4"},
    {name:"Conference & Dining",color:"#FFD60A",x:340,w:170,type:"conference"},
    {name:"Entertainment Suite",color:"#A1A1AA",x:530,w:160,type:"entertainment"},
    {name:"Master Stateroom",color:"#E4E4E7",x:710,w:170,type:"stateroom"}
  ]},
  "global-6000":{title:"Bombardier Global 6000 — Three-Zone Cabin",zones:[
    {name:"Forward Club",color:"#34C759",x:160,w:200,type:"club4"},
    {name:"Mid Lounge",color:"#FFD60A",x:380,w:200,type:"lounge"},
    {name:"Private Suite",color:"#E4E4E7",x:600,w:280,type:"stateroom"}
  ]},
  "global-5000":{title:"Bombardier Global 5000 — Three-Zone Cabin",zones:[
    {name:"Forward Club",color:"#34C759",x:160,w:200,type:"club4"},
    {name:"Lounge",color:"#A1A1AA",x:380,w:200,type:"lounge"},
    {name:"Rest Area",color:"#E4E4E7",x:600,w:280,type:"rest"}
  ]},
  "challenger-850":{title:"Bombardier Challenger 850 — Three-Zone Cabin",zones:[
    {name:"Club Seating",color:"#34C759",x:160,w:220,type:"club4"},
    {name:"Lounge & Divan",color:"#FFD60A",x:400,w:200,type:"lounge"},
    {name:"Bedroom",color:"#E4E4E7",x:620,w:260,type:"stateroom"}
  ]},
  "challenger-605":{title:"Bombardier Challenger 605 — Two-Zone Cabin",zones:[
    {name:"Club Seating",color:"#34C759",x:160,w:340,type:"club6"},
    {name:"Divan & Galley",color:"#A1A1AA",x:520,w:360,type:"divan"}
  ]},
  "challenger-350":{title:"Bombardier Challenger 350 — Two-Zone Cabin",zones:[
    {name:"Club Seating",color:"#34C759",x:160,w:380,type:"club6"},
    {name:"Refreshment Center",color:"#A1A1AA",x:560,w:320,type:"galley"}
  ]},
  "falcon-7x":{title:"Dassault Falcon 7X — Three-Zone Cabin",zones:[
    {name:"Forward Club",color:"#34C759",x:160,w:200,type:"club4"},
    {name:"Dining",color:"#FFD60A",x:380,w:200,type:"conference"},
    {name:"Lounge & Rest",color:"#E4E4E7",x:600,w:280,type:"rest"}
  ]},
  "g450":{title:"Gulfstream G450 — Three-Zone Cabin",zones:[
    {name:"Forward Club",color:"#34C759",x:160,w:220,type:"club4"},
    {name:"Conference",color:"#FFD60A",x:400,w:200,type:"conference"},
    {name:"Rest Area",color:"#E4E4E7",x:620,w:260,type:"rest"}
  ]},
  "citation-xls":{title:"Cessna Citation XLS+ — Single Cabin",zones:[
    {name:"Club Seating",color:"#34C759",x:160,w:720,type:"club8"}
  ]},
  "lineage-1000e":{title:"Embraer Lineage 1000E — Five-Zone Cabin",zones:[
    {name:"Lounge",color:"#34C759",x:160,w:130,type:"club4"},
    {name:"Conference",color:"#FFD60A",x:300,w:130,type:"conference"},
    {name:"Entertainment",color:"#A1A1AA",x:440,w:120,type:"entertainment"},
    {name:"Dining",color:"#FF9F0A",x:570,w:120,type:"lounge"},
    {name:"Master Suite",color:"#E4E4E7",x:700,w:180,type:"stateroom"}
  ]}
};

function drawZoneSeats(z){
  var cx=z.x,w=z.w,col=z.color;
  var els=[];
  /* zone background */
  els.push(<rect key="bg" x={cx} y={46} width={w} height={88} rx={8} fill="#1A1A1E" stroke="#2C2C31" strokeWidth="0.8"/>);
  if(z.type==="club4"){
    var mx=cx+w/2;
    els.push(<rect key="s1" x={mx-50} y={56} width={26} height={28} rx={5} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="s2" x={mx-50} y={96} width={26} height={28} rx={5} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="tb" x={mx-15} y={64} width={30} height={52} rx={4} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.6"/>);
    els.push(<rect key="s3" x={mx+24} y={56} width={26} height={28} rx={5} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="s4" x={mx+24} y={96} width={26} height={28} rx={5} fill="none" stroke={col} strokeWidth="1.2"/>);
  }else if(z.type==="club6"){
    var sp=w/3;
    for(var i=0;i<3;i++){var bx=cx+sp*i+sp/2-15;
      els.push(<rect key={"t"+i} x={bx} y={64} width={30} height={52} rx={4} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.6"/>);
      els.push(<rect key={"a"+i} x={bx-20} y={70} width={16} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
      els.push(<rect key={"b"+i} x={bx-20} y={92} width={16} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
      els.push(<rect key={"c"+i} x={bx+34} y={70} width={16} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
      els.push(<rect key={"d"+i} x={bx+34} y={92} width={16} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
    }
  }else if(z.type==="club8"){
    var sp2=w/4;
    for(var j=0;j<4;j++){var bx2=cx+sp2*j+sp2/2-15;
      els.push(<rect key={"t"+j} x={bx2} y={64} width={30} height={52} rx={4} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.6"/>);
      els.push(<rect key={"a"+j} x={bx2-20} y={70} width={16} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
      els.push(<rect key={"b"+j} x={bx2-20} y={92} width={16} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
      els.push(<rect key={"c"+j} x={bx2+34} y={70} width={16} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
      els.push(<rect key={"d"+j} x={bx2+34} y={92} width={16} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
    }
  }else if(z.type==="conference"){
    var mx2=cx+w/2;
    els.push(<rect key="tbl" x={mx2-50} y={60} width={100} height={60} rx={6} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.6"/>);
    els.push(<rect key="s1" x={mx2-65} y={65} width={16} height={22} rx={4} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="s2" x={mx2-65} y={93} width={16} height={22} rx={4} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="s3" x={mx2+49} y={65} width={16} height={22} rx={4} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="s4" x={mx2+49} y={93} width={16} height={22} rx={4} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="s5" x={mx2-30} y={48} width={22} height={14} rx={3} fill="none" stroke={col} strokeWidth="0.8"/>);
    els.push(<rect key="s6" x={mx2+8} y={48} width={22} height={14} rx={3} fill="none" stroke={col} strokeWidth="0.8"/>);
  }else if(z.type==="entertainment"){
    els.push(<rect key="d1" x={cx+15} y={54} width={50} height={24} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="d2" x={cx+15} y={102} width={50} height={24} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="tv" x={cx+w/2+5} y={64} width={4} height={52} rx={2} fill="#52525B"/>);
    els.push(<rect key="s1" x={cx+w/2+25} y={56} width={40} height={26} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="s2" x={cx+w/2+25} y={98} width={40} height={26} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
  }else if(z.type==="stateroom"){
    var bw=Math.min(80,w*0.4);
    els.push(<rect key="bed" x={cx+15} y={56} width={bw} height={68} rx={6} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<line key="bl" x1={cx+15} y1={90} x2={cx+15+bw} y2={90} stroke="#3F3F46" strokeWidth="0.5"/>);
    els.push(<rect key="p1" x={cx+25} y={62} width={24} height={14} rx={4} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.5"/>);
    if(bw>60)els.push(<rect key="p2" x={cx+55} y={62} width={24} height={14} rx={4} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.5"/>);
    var lx=cx+15+bw+18;
    els.push(<line key="part" x1={lx-8} y1={50} x2={lx-8} y2={130} stroke="#3F3F46" strokeWidth="0.8"/>);
    els.push(<rect key="lav" x={lx} y={56} width={Math.min(40,w-bw-50)} height={30} rx={5} fill="none" stroke="#52525B" strokeWidth="0.8"/>);
    els.push(<circle key="sh" cx={lx+Math.min(20,w-bw-50)/2+5} cy={71} r={5} fill="none" stroke="#52525B" strokeWidth="0.6"/>);
    els.push(<rect key="wc" x={lx} y={96} width={Math.min(40,w-bw-50)} height={28} rx={5} fill="none" stroke="#52525B" strokeWidth="0.8"/>);
  }else if(z.type==="lounge"){
    els.push(<rect key="sf1" x={cx+15} y={54} width={w*0.4} height={24} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="sf2" x={cx+15} y={102} width={w*0.4} height={24} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="tb" x={cx+w*0.5} y={66} width={w*0.3} height={48} rx={4} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.6"/>);
  }else if(z.type==="rest"){
    els.push(<rect key="dv1" x={cx+15} y={54} width={w*0.5} height={28} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="dv2" x={cx+15} y={98} width={w*0.5} height={28} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="cab" x={cx+w*0.7} y={56} width={w*0.2} height={68} rx={5} fill="none" stroke="#52525B" strokeWidth="0.8"/>);
  }else if(z.type==="divan"){
    els.push(<rect key="dv" x={cx+15} y={54} width={w*0.4} height={72} rx={6} fill="none" stroke={col} strokeWidth="1"/>);
    var gx=cx+w*0.55;
    els.push(<rect key="gl" x={gx} y={54} width={w*0.35} height={34} rx={5} fill="none" stroke="#52525B" strokeWidth="0.8"/>);
    els.push(<rect key="g2" x={gx} y={96} width={w*0.35} height={28} rx={5} fill="none" stroke="#52525B" strokeWidth="0.8"/>);
  }else if(z.type==="galley"){
    els.push(<rect key="g1" x={cx+15} y={54} width={w*0.35} height={34} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="g2" x={cx+15} y={96} width={w*0.35} height={28} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="lv" x={cx+w*0.55} y={56} width={w*0.35} height={68} rx={6} fill="none" stroke="#52525B" strokeWidth="0.8"/>);
    els.push(<circle key="sk" cx={cx+w*0.55+w*0.175} cy={90} r={10} fill="none" stroke="#52525B" strokeWidth="0.6"/>);
  }
  /* zone label */
  els.push(<text key="lbl" x={cx+w/2} y={153} style={{fontSize:9,fill:col,fontFamily:"-apple-system,sans-serif",fontWeight:600}} textAnchor="middle">{z.name}</text>);
  return els;
}

function CabinSVG(p){
  var layout=p.layout;if(!layout)return null;
  var zones=layout.zones;
  var lastZ=zones[zones.length-1];
  var totalW=lastZ.x+lastZ.w+20;
  var svgW=Math.max(totalW,500);
  return(
    <svg viewBox={"0 0 "+svgW+" 180"} style={{width:"100%",minWidth:Math.min(680,svgW),height:"auto",display:"block"}}>
      <path d={"M60 30 Q0 90 60 150 L"+(svgW-60)+" 150 Q"+svgW+" 90 "+(svgW-60)+" 30 Z"} fill="#1F1F23" stroke="#2C2C31" strokeWidth="1.5"/>
      <path d="M60 30 Q20 90 60 150" fill="none" stroke="#3F3F46" strokeWidth="1"/>
      {/* Cockpit */}
      <rect x="65" y="50" width="70" height="80" rx="6" fill="#18181B" stroke="#2C2C31" strokeWidth="1"/>
      <circle cx="85" cy="78" r="6" fill="none" stroke="#52525B" strokeWidth="1"/>
      <circle cx="85" cy="102" r="6" fill="none" stroke="#52525B" strokeWidth="1"/>
      <rect x="100" y="70" width="28" height="16" rx="3" fill="none" stroke="#52525B" strokeWidth="0.8"/>
      <rect x="100" y="94" width="28" height="16" rx="3" fill="none" stroke="#52525B" strokeWidth="0.8"/>
      <text x="100" y="145" style={{fontSize:9,fill:"#71717A",fontFamily:"-apple-system,sans-serif",fontWeight:500}}>Cockpit</text>
      <line x1="145" y1="38" x2="145" y2="142" stroke="#2C2C31" strokeWidth="1" strokeDasharray="3,3"/>
      {/* Zones */}
      {zones.map(function(z,i){
        var items=drawZoneSeats(z);
        var divX=z.x+z.w+5;
        if(i<zones.length-1)items.push(<line key={"div"+i} x1={divX} y1={38} x2={divX} y2={142} stroke="#2C2C31" strokeWidth="1" strokeDasharray="3,3"/>);
        return <g key={i}>{items}</g>;
      })}
      {/* Windows */}
      {Array.from({length:Math.floor((svgW-200)/30)},function(_,i){return 100+i*30}).map(function(wx,wi){return(<g key={wi}><ellipse cx={wx} cy="34" rx="5" ry="2.5" fill="none" stroke="#2C2C31" strokeWidth="0.6"/><ellipse cx={wx} cy="146" rx="5" ry="2.5" fill="none" stroke="#2C2C31" strokeWidth="0.6"/></g>)})}
    </svg>
  );
}

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
  var {slug}=useParams();
  var [idx,setIdx]=useState(0);
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [from,setFrom]=useState("Miami (MIA)");
  var [to,setTo]=useState("Paris (CDG)");
  var [date,setDate]=useState("2026-03-25");
  var [pax,setPax]=useState("6");
  var [tripType,setTripType]=useState("One Way");
  var cabinLayout=CABIN_LAYOUTS[slug]||CABIN_LAYOUTS["global-7500"];

  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var specsRef=useRef(null);var specsVis=useVis(specsRef);
  var cabinRef=useRef(null);var cabinVis=useVis(cabinRef);
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
                  <DarkDatePicker value={date} onChange={function(v){setDate(v)}} label="Date"/>
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

      {/* Cabin Configuration */}
      <div ref={cabinRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:24,marginTop:32,opacity:cabinVis?1:0,transition:"all 0.8s ease"}}>Cabin Configuration</p>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"32px 24px",opacity:cabinVis?1:0,transform:cabinVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s",overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            <span style={{...sf(14,600),color:C.s1}}>{cabinLayout.title}</span>
          </div>
          <div style={{width:"100%",overflowX:"auto",WebkitOverflowScrolling:"touch",paddingBottom:8}}>
            <CabinSVG layout={cabinLayout}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginTop:20}}>
            {cabinLayout.zones.map(function(z,i){
              return(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 12px",borderRadius:10,background:"rgba(244,244,245,0.02)"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:z.color,flexShrink:0,marginTop:4}}/>
                <div><div style={{...sf(12,600),color:C.s1}}>{z.name}</div></div>
              </div>);
            })}
          </div>
          <div style={{...sf(11),color:C.s6,marginTop:16}}>Cabin: {J.cabin} · Standard configuration shown — custom layouts available on request.</div>
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
