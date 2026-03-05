import { useState, useEffect, useRef } from "react";

var sf = function(size, weight){
  return {fontFamily:"-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif", fontSize:size, fontWeight:weight||400, WebkitFontSmoothing:"antialiased"};
};

var C = {bg:"#0A0A0B",el:"#18181B",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gd:"#FFD60A"};

function DrawMark(p){
  var sw = Math.max(p.size * 0.06, 1.5);
  var lines=[
    {x1:20,y1:80,x2:40,y2:18,l:65},
    {x1:80,y1:80,x2:60,y2:18,l:65},
    {x1:40,y1:18,x2:60,y2:18,l:20},
    {x1:32,y1:56,x2:68,y2:56,l:36},
  ];
  return (
    <svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}>
      {lines.map(function(ln,i){
        return <line key={i} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2} stroke={p.color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={ln.l} strokeDashoffset={p.active?0:ln.l} style={{transition:"stroke-dashoffset 0.8s cubic-bezier(0.65,0,0.35,1) "+(p.delay+i*0.12)+"s"}}/>;
      })}
    </svg>
  );
}

function Step(p){
  return(<div style={{display:"flex",gap:40,alignItems:"flex-start",opacity:p.vis?1:0,transform:p.vis?"translateY(0)":"translateY(40px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) "+p.delay+"s"}}>
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,width:48}}>
      <div style={{width:48,height:48,borderRadius:"50%",border:"1px solid "+(p.vis?C.s7:C.bd),display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        <span style={{...sf(16,600),color:C.s1}}>{p.num}</span>
      </div>
    </div>
    <div style={{paddingTop:4,paddingBottom:64}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <span style={{fontSize:20}}>{p.icon}</span>
        <h3 style={{...sf(28,600),letterSpacing:-0.5,color:C.s1}}>{p.title}</h3>
      </div>
      <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,maxWidth:400,marginBottom:16}}>{p.desc}</p>
      <p style={{...sf(12,500),color:C.s7,letterSpacing:2,textTransform:"uppercase"}}>{p.detail}</p>
    </div>
  </div>);
}

function AnimCounter(p){
  var ref = useRef(null);
  var valRef = useRef(0);
  var [display, setDisplay] = useState(0);
  useEffect(function(){
    if(!p.active) return;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var prog = Math.min((ts - start) / p.duration, 1);
      var val = Math.floor((1 - Math.pow(1 - prog, 3)) * p.end);
      setDisplay(val);
      if(prog < 1) ref.current = requestAnimationFrame(step);
    }
    ref.current = requestAnimationFrame(step);
    return function(){ if(ref.current) cancelAnimationFrame(ref.current); };
  }, [p.active]);
  return <span>{display}{p.suffix}</span>;
}

/* ═══ Grid Card for experiences ═══ */
function GridCard(p){
  var [hover, setHover] = useState(false);
  var [loaded, setLoaded] = useState(false);
  return (
    <div onClick={p.onClick} style={{borderRadius:20,overflow:"hidden",position:"relative",cursor:"pointer",aspectRatio:"3/4",border:"1px solid "+(hover?"rgba(255,255,255,0.1)":C.bd),boxShadow:hover?"0 24px 60px rgba(0,0,0,0.5)":"0 8px 30px rgba(0,0,0,0.25)",transform:hover?"translateY(-6px) scale(1.02)":"translateY(0) scale(1)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)"}} onMouseEnter={function(){setHover(true)}} onMouseLeave={function(){setHover(false)}}>
      <img src={p.img} alt={p.title} onLoad={function(){setLoaded(true)}} loading="lazy" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform:hover?"scale(1.06)":"scale(1)",transition:"transform 0.8s cubic-bezier(0.16,1,0.3,1)",opacity:loaded?1:0}}/>
      {!loaded && <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#1a1a22,#252530)"}}/>}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0) 35%,rgba(10,10,11,0.5) 65%,rgba(10,10,11,0.92) 100%)"}}/>
      {/* Tag */}
      <div style={{position:"absolute",top:14,left:14,...sf(9,600),letterSpacing:0.5,textTransform:"uppercase",color:C.s1,padding:"4px 9px",borderRadius:8,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(12px)",border:"0.5px solid rgba(255,255,255,0.08)"}}>{p.tag}</div>
      {/* Bottom */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 18px 20px"}}>
        <div style={{...sf(20,700),color:"#fff",marginBottom:4,letterSpacing:-0.3}}>{p.title}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{...sf(12,400),color:"rgba(255,255,255,0.5)"}}>{p.count}</span>
          <div style={{display:"flex",alignItems:"center",gap:4,...sf(11,500),color:"#fff",padding:"5px 12px",borderRadius:8,background:hover?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.08)",transition:"background 0.3s"}}>
            Explore
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{transform:hover?"translateX(2px)":"translateX(0)",transition:"transform 0.3s"}}><path d="M5 12H19M12 5L19 12L12 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ Category venue data for modal ═══ */
var catVenues = {
  "Fine Dining":["Carbone · Miami","Le Cinq · Paris","Papi Steak · Miami","Girafe · Paris","Komodo · Miami","L'Ambroisie · Paris","Nobu · Miami","Septime · Paris","Gekko · Miami","Le Clarence · Paris","COTE · Miami","Epicure · Paris","Zuma · Miami","La Tour d'Argent · Paris","Swan · Miami","Pavyllon · Paris"],
  "Nightlife & Clubs":["LIV · Miami","CoCo Club · Paris","E11even · Miami","Raspoutine · Paris","Story · Miami","L'Arc · Paris","Basement · Miami","Castel · Paris","Club Space · Miami","Silencio · Paris"],
  "Wellness & Spa":["The Setai Spa · Miami","Dior Spa · Paris","Bamford Spa · Miami","Le Spa Ritz · Paris","The Standard Spa · Miami","Guerlain Spa · Paris","Lapis Spa · Miami","Spa Le Bristol · Paris","Carillon Wellness · Miami"],
  "Luxury Cars":["mph Club · Miami","Blacklane · Paris","Pugachev Luxury · Miami","Paris VTC Premium · Paris","Prestige Rentals · Miami","F1 Luxury · Miami"],
  "Private Chefs":["Chef at Home · Miami","Chef Privé · Paris","Yacht Chef Service · Miami","La Belle Assiette · Paris","Private Dining Co · Miami"],
  "Yachts & Jets":["Miami Yacht Charters","Côte d'Azur Yachts","NetJets Private","XO Aviation","Blade Helicopters","Ahoy Club"],
};

function CityCarousel(p){
  var cities = ["Miami","Paris","Dubai","London","New York","Monaco","Milan","Tokyo","Mykonos","Ibiza","St. Barts","Aspen"];
  var [idx, setIdx] = useState(0);
  useEffect(function(){
    if(!p.loaded) return;
    var t = setInterval(function(){ setIdx(function(prev){ return (prev+1)%cities.length; }); }, 2200);
    return function(){ clearInterval(t); };
  }, [p.loaded]);
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginTop:28,opacity:p.loaded?1:0,transform:p.loaded?"translateY(0)":"translateY(12px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 1.4s",height:20,overflow:"hidden"}}>
      <span style={{...sf(11,400),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Now in</span>
      <div style={{position:"relative",width:120,height:20,overflow:"hidden"}}>
        {cities.map(function(city,i){
          var isCurrent = i === idx;
          var isPrev = i === (idx-1+cities.length)%cities.length;
          return <div key={city} style={{position:"absolute",left:0,right:0,textAlign:"center",...sf(11,600),letterSpacing:4,textTransform:"uppercase",color:isCurrent?C.s1:C.s7,transform:isCurrent?"translateY(0)":isPrev?"translateY(-20px)":"translateY(20px)",opacity:isCurrent?1:0,transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)"}}>{city}</div>;
        })}
      </div>
      <div style={{width:4,height:4,borderRadius:"50%",background:C.s6,animation:p.loaded?"pulseGlow 2.5s ease infinite 2s":"none"}}/>
      <span style={{...sf(11,400),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>& more</span>
    </div>
  );
}

/* ═══ Metallic Tier Card ═══ */
function MetalTier(p){
  var [hover, setHover] = useState(false);
  var dp = p.annual ? p.annualPrice : p.price;
  var savings = p.annual && p.annualPrice !== p.price;
  var mc = p.metalColor;
  var mg = p.metalGrad;

  return (
    <div style={{flex:1,minWidth:0,borderRadius:24,position:"relative",overflow:"hidden",background:"#0E0E11",border:p.popular?"none":"1px solid "+(hover?mc+"40":"rgba(255,255,255,0.06)"),boxShadow:p.popular?(hover?"0 40px 100px rgba(0,0,0,0.5), 0 0 50px "+mc+"15":"0 24px 70px rgba(0,0,0,0.4)"):(hover?"0 24px 64px rgba(0,0,0,0.45)":"0 8px 30px rgba(0,0,0,0.2)"),transform:p.popular?(hover?"translateY(-8px) scale(1.02)":"translateY(-4px) scale(1.01)"):(hover?"translateY(-6px)":"translateY(0)"),opacity:p.vis?1:0,transition:"all 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.9s ease "+p.delay+"s, transform 0.9s ease "+p.delay+"s",cursor:"pointer"}} onMouseEnter={function(){setHover(true)}} onMouseLeave={function(){setHover(false)}}>
      {/* Gradient border for popular */}
      {p.popular && <div style={{position:"absolute",inset:0,borderRadius:24,padding:1,background:mg,WebkitMask:"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",WebkitMaskComposite:"xor",maskComposite:"exclude",pointerEvents:"none",zIndex:2}}/>}
      {/* Top shine */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg, transparent, "+mc+"25 30%, "+mc+"45 50%, "+mc+"25 70%, transparent)",zIndex:3}}/>
      {/* Glow */}
      <div style={{position:"absolute",top:-50,left:"50%",transform:"translateX(-50%)",width:250,height:120,borderRadius:"50%",background:"radial-gradient(ellipse, "+mc+"08 0%, transparent 70%)",pointerEvents:"none"}}/>
      {/* Badge */}
      {p.popular && <div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",zIndex:4,...sf(9,700),letterSpacing:1.5,textTransform:"uppercase",color:"#0E0E11",padding:"6px 20px",borderRadius:"0 0 12px 12px",background:mg}}>Most Popular</div>}

      <div style={{padding:p.popular?"42px 28px 28px":"28px",position:"relative",zIndex:1}}>
        <div style={{...sf(13,600),color:mc,letterSpacing:2,textTransform:"uppercase",marginBottom:20}}>{p.name}</div>
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
          <span style={{...sf(52,700),color:C.s1,letterSpacing:-2}}>{dp}</span>
          {p.period && <span style={{...sf(15,400),color:C.s6}}>{p.period}</span>}
        </div>
        {savings && <div style={{...sf(11,500),color:C.gn,marginBottom:12}}>Save 20% with annual</div>}
        {!savings && <div style={{height:12}}/>}
        <p style={{...sf(14,400),color:C.s5,lineHeight:1.5,marginBottom:28}}>{p.desc}</p>
        <div style={{width:"100%",textAlign:"center",padding:"14px 0",borderRadius:14,...sf(14,600),letterSpacing:0.3,transition:"all 0.35s ease",marginBottom:28,background:hover?mg:"transparent",color:hover?"#0E0E11":mc,border:"1px solid "+(hover?mc:mc+"35"),boxShadow:hover?"0 8px 30px "+mc+"20":"none"}}>{p.cta}</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {p.features.map(function(f,i){
            return <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:mc+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke={mc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{...sf(13,400),color:C.s4,lineHeight:1.4}}>{f}</span>
            </div>;
          })}
        </div>
      </div>
    </div>
  );
}

export default function AlfredSite(){
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [mouse,setMouse]=useState({x:0.5,y:0.5});
  var [hoverCta,setHoverCta]=useState(false);
  var [shimmer,setShimmer]=useState(false);
  var [stepsVis,setStepsVis]=useState(false);
  var [showVis,setShowVis]=useState(false);
  var [statsVis,setStatsVis]=useState(false);
  var [tiersVis,setTiersVis]=useState(false);
  var [dirVis,setDirVis]=useState(false);
  var [ctaVis,setCtaVis]=useState(false);
  var [hoverApp,setHoverApp]=useState(false);
  var [hoverFinal,setHoverFinal]=useState(false);
  var [centerIdx,setCenterIdx]=useState(0);
  var [prevIdx,setPrevIdx]=useState(-1);
  var [annual,setAnnual]=useState(false);
  var [modalCat,setModalCat]=useState(null);

  var stepsRef=useRef(null);
  var showRef=useRef(null);
  var statsRef=useRef(null);
  var tiersRef=useRef(null);
  var dirRef=useRef(null);
  var ctaRef=useRef(null);
  var [wh,setWh]=useState(800);

  useEffect(function(){setWh(window.innerHeight);setTimeout(function(){setLoaded(true)},200);setTimeout(function(){setShimmer(true)},2200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);
  useEffect(function(){var h=function(e){setMouse({x:e.clientX/window.innerWidth,y:e.clientY/window.innerHeight})};window.addEventListener("mousemove",h,{passive:true});return function(){window.removeEventListener("mousemove",h)}},[]);

  useEffect(function(){
    var mk=function(ref,setter){return new IntersectionObserver(function(e){if(e[0].isIntersecting)setter(true)},{threshold:0.08})};
    var o1=mk(stepsRef,setStepsVis),o2=mk(showRef,setShowVis),o3=mk(statsRef,setStatsVis),o4=mk(tiersRef,setTiersVis),o5=mk(dirRef,setDirVis),o6=mk(ctaRef,setCtaVis);
    if(stepsRef.current)o1.observe(stepsRef.current);if(showRef.current)o2.observe(showRef.current);if(statsRef.current)o3.observe(statsRef.current);if(tiersRef.current)o4.observe(tiersRef.current);if(dirRef.current)o5.observe(dirRef.current);if(ctaRef.current)o6.observe(ctaRef.current);
    return function(){o1.disconnect();o2.disconnect();o3.disconnect();o4.disconnect();o5.disconnect();o6.disconnect()};
  },[]);

  var venues=[
    {n:"Carbone",sub:"Italian · Miami",img:"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop&q=80",tag:"4.9",color:"#2563EB"},
    {n:"Le Cinq",sub:"French · Paris",img:"https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=800&h=500&fit=crop&q=80",tag:"4.8",color:"#7C3AED"},
    {n:"LIV",sub:"Nightclub · Miami",img:"https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?w=800&h=500&fit=crop&q=80",tag:"4.7",color:"#1E293B"},
    {n:"Girafe",sub:"Seafood · Paris",img:"https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&h=500&fit=crop&q=80",tag:"4.9",color:"#0D9488"},
    {n:"Papi Steak",sub:"Steakhouse · Miami",img:"https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=500&fit=crop&q=80",tag:"4.8",color:"#DC2626"},
    {n:"CoCo Club",sub:"Members Club · Paris",img:"https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=500&fit=crop&q=80",tag:"4.7",color:"#6D28D9"},
    {n:"The Setai",sub:"Wellness · Miami",img:"https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&h=500&fit=crop&q=80",tag:"4.9",color:"#047857"},
    {n:"L'Ambroisie",sub:"Haute Cuisine · Paris",img:"https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=500&fit=crop&q=80",tag:"5.0",color:"#B45309"},
    {n:"mph Club",sub:"Supercars · Miami",img:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop&q=80",tag:"4.8",color:"#1E3A5F"},
    {n:"Raspoutine",sub:"Nightclub · Paris",img:"https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=500&fit=crop&q=80",tag:"4.6",color:"#9F1239"},
  ];

  useEffect(function(){if(!dirVis)return;var t=setInterval(function(){setCenterIdx(function(prev){setPrevIdx(prev);return(prev+1)%venues.length})},3000);return function(){clearInterval(t)}},[dirVis]);

  var scrollProg=Math.min(scrollY/600,1);
  var heroOp=Math.max(1-scrollProg*1.5,0);
  var heroY=scrollY*0.3;
  var heroScale=1+scrollProg*0.15;
  var heroBlur=scrollProg*12;
  var mx=(mouse.x-0.5)*12,my=(mouse.y-0.5)*8;
  var LETTERS="ALFRED".split("");
  var tagWords="Restaurants, nightlife, and private services — through one quiet, beautiful app.".split(" ");
  var stepsTop=stepsRef.current?stepsRef.current.offsetTop:99999;
  var stepsProgress=Math.max(0,Math.min((scrollY-stepsTop+wh*0.6)/(wh*0.8),1));

  var exps=[
    {title:"Fine Dining",count:"84 restaurants",tag:"Most Popular",img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=800&fit=crop&q=80"},
    {title:"Nightlife & Clubs",count:"23 exclusive venues",tag:"Members Only",img:"https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600&h=800&fit=crop&q=80"},
    {title:"Wellness & Spa",count:"35 wellness partners",tag:"New",img:"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=800&fit=crop&q=80"},
    {title:"Luxury Cars",count:"Supercars & chauffeurs",tag:"On Demand",img:"https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=800&fit=crop&q=80"},
    {title:"Private Chefs",count:"Michelin-trained",tag:"Bespoke",img:"https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=800&fit=crop&q=80"},
    {title:"Yachts & Jets",count:"Day charters",tag:"Ultra Premium",img:"https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&h=800&fit=crop&q=80"},
  ];

  var centerCard=venues[centerIdx];
  function getIdx(off){var i=centerIdx+off;while(i<0)i+=venues.length;return i%venues.length;}
  var leftCard=venues[getIdx(-1)];
  var rightCard=venues[getIdx(1)];

  var SILVER="#A0AEC0",SILVER_G="linear-gradient(135deg,#718096,#A0AEC0,#CBD5E0,#A0AEC0)";
  var GOLD="#D4A853",GOLD_G="linear-gradient(135deg,#92713A,#D4A853,#F0D78C,#D4A853)";
  var PLAT="#D1D5DB",PLAT_G="linear-gradient(135deg,#9CA3AF,#D1D5DB,#F3F4F6,#D1D5DB)";

  var appSvg = "M20.07 22.67c-.46 1.06-.68 1.54-1.27 2.48-.83 1.31-2 2.95-3.45 2.96-1.29.02-1.62-.84-3.37-.83-1.75.01-2.11.85-3.4.83-1.45-.02-2.55-1.5-3.38-2.81C3.12 21.82 2.78 17.82 4.13 15.72c.96-1.5 2.47-2.38 4.07-2.38 1.51 0 2.46.85 3.71.85 1.22 0 1.96-.85 3.71-.85 1.42 0 2.77.77 3.73 2.1-3.28 1.8-2.75 6.49.72 7.73zM15.1 4.26c.65-.84 1.14-2.02.96-3.26-1.06.07-2.3.75-3.03 1.63-.66.8-1.2 1.99-1 3.15 1.16.04 2.36-.65 3.07-1.52z";

  var divider = {position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,#2C2C31 30%,#2C2C31 70%,transparent)"};

  return(
    <div lang="en" style={{width:"100%",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      {/* ═══ SEO: Structured Data (meta tags in index.html) ═══ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
        "@context":"https://schema.org",
        "@type":"MobileApplication",
        "name":"Alfred Concierge",
        "description":"Alfred is the luxury concierge app for Miami and Paris. Book the best restaurants, nightclubs, wellness spas, private chefs, luxury cars, yachts and jets through one app. Real human concierge support available 24/7.",
        "applicationCategory":"LifestyleApplication",
        "operatingSystem":"iOS",
        "url":"https://alfredconcierge.app",
        "offers":{"@type":"AggregateOffer","lowPrice":"0","highPrice":"199","priceCurrency":"USD"},
        "aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","ratingCount":"127"},
        "author":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"}
      })}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
        "@context":"https://schema.org",
        "@type":"Organization",
        "name":"Alfred Concierge",
        "url":"https://alfredconcierge.app",
        "logo":"https://alfredconcierge.app/logo.png",
        "description":"Luxury concierge app for restaurants, nightlife, wellness, private chefs, luxury cars, yachts and jets in Miami and Paris.",
        "sameAs":["https://instagram.com/alfred","https://x.com/alfredconcierge","https://tiktok.com/@alfred"],
        "contactPoint":{"@type":"ContactPoint","contactType":"customer service","availableLanguage":["English","French"]},
        "areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Paris"}]
      })}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
        "@context":"https://schema.org",
        "@type":"FAQPage",
        "mainEntity":[
          {"@type":"Question","name":"What is Alfred Concierge?","acceptedAnswer":{"@type":"Answer","text":"Alfred is a luxury concierge iOS app that lets you book the best restaurants, nightclubs, wellness spas, private chefs, luxury cars, yachts and jets in Miami and Paris through one app with a real human concierge available 24/7."}},
          {"@type":"Question","name":"How does Alfred work?","acceptedAnswer":{"@type":"Answer","text":"Tell Alfred what you want in plain language, a real human concierge checks your request and responds in seconds. They find the best options, make the calls, and confirm everything. Average response time is under 2 minutes."}},
          {"@type":"Question","name":"Where is Alfred available?","acceptedAnswer":{"@type":"Answer","text":"Alfred is currently available in Miami and Paris with expansion planned to Dubai, London, New York, Monaco, Milan, Tokyo, Mykonos, Ibiza, St. Barts, and Aspen."}},
          {"@type":"Question","name":"How much does Alfred cost?","acceptedAnswer":{"@type":"Answer","text":"Alfred offers a free Explorer tier with limited bookings, a Gold membership at $49/month with unlimited bookings and personal concierge, and a Platinum membership at $199/month with a dedicated human concierge and VIP access."}}
        ]
      })}}/>
      {/* Hidden SEO content for crawlers */}
      <div style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap"}} aria-hidden="false">
        <h1>Alfred Concierge — Luxury Concierge App for Miami and Paris</h1>
        <p>Alfred is the premier luxury concierge mobile app available on iOS. Book Michelin-starred restaurants like Carbone, Le Cinq, L'Ambroisie, Girafe, Papi Steak, Komodo, Nobu, Gekko, and Septime. Access exclusive nightlife at LIV Miami, E11even, Story, CoCo Club Paris, Raspoutine, L'Arc, and Castel. Enjoy world-class wellness at The Setai Spa, Dior Spa Plaza Athénée, Le Spa Ritz Paris, Bamford Wellness Spa, and Guerlain Spa. Rent supercars and book chauffeurs through mph Club, Pugachev Luxury, and Prestige Rentals. Hire Michelin-trained private chefs for your home, yacht, or villa. Charter yachts and book private jets.</p>
        <h2>Best Restaurants in Miami</h2>
        <p>Carbone Miami, Komodo Brickell, Papi Steak South Beach, Major Food Group, Cecconi's, Swan Design District, Casa Tua, Zuma Downtown, Nobu Mid-Beach, Gekko South Beach, ZZ's Club Design District, Makoto Bal Harbour, Juvia South Beach, COTE Miami, Bourbon Steak Aventura, Le Jardinier, Baia Beach Club</p>
        <h2>Best Restaurants in Paris</h2>
        <p>Le Cinq Paris, L'Ambroisie Le Marais, Girafe Trocadéro, Le Clarence, Pavyllon, L'Arpège, Epicure Le Bristol, Septime, Frenchie, Le Chateaubriand, La Tour d'Argent, Restaurant Kei, Le Grand Véfour, Plénitude, Le Meurice, L'Abeille, Le Taillevent, Le Pré Catelan, Sur Mesure</p>
        <h2>Best Nightclubs in Miami</h2>
        <p>LIV Miami Beach, E11even Downtown Miami, Story South Beach, Basement Miami, Club Space, Do Not Sit On The Furniture, Floyd Wynwood, Mynt Lounge, Rockwell</p>
        <h2>Best Nightclubs in Paris</h2>
        <p>CoCo Club Paris, Raspoutine, L'Arc, Castel Saint-Germain, Silencio, Le Montana, Le Baron, Rex Club, Concrete</p>
        <h2>Luxury Wellness and Spa in Miami and Paris</h2>
        <p>The Setai Spa Miami, Bamford Wellness Spa Bal Harbour, The Standard Spa Miami Beach, Lapis Spa, Dior Spa Plaza Athénée Paris, Spa Le Bristol Paris, Le Spa Ritz Paris, Guerlain Spa Champs-Élysées, Carillon Miami Wellness Resort</p>
        <h2>Luxury Car Rental and Chauffeur Services</h2>
        <p>mph Club Miami supercar rental, Pugachev Luxury Cars, Prestige Luxury Rentals Miami, South Beach Exotic Rentals, Blacklane Paris chauffeur service, Paris VTC Premium</p>
        <h2>Private Chef and Yacht Charter Services</h2>
        <p>Michelin-trained private chefs in Miami and Paris. Day yacht charters, weekend getaways, private aviation, NetJets, XO Aviation, Blade Helicopters</p>
        <h2>Alfred Concierge Membership Plans</h2>
        <p>Free Explorer membership with smart search and 3 bookings per month. Gold membership $49/month with unlimited bookings, priority reservations, personal concierge, and member-only venues. Platinum membership $199/month with dedicated human concierge, VIP event access, same-day guaranteed bookings, bespoke experience curation, and private chef and yacht access. Alfred Noir $9,999/month invite-only ultimate luxury concierge service.</p>
        <h2>Download Alfred Concierge App</h2>
        <p>Download Alfred on the App Store for iOS. Available in Miami Florida and Paris France. Coming soon to Dubai, London, New York, Monaco, Milan, Tokyo, Mykonos, Ibiza, St. Barts, and Aspen. Luxury concierge service, restaurant reservations, nightclub VIP tables, wellness bookings, supercar rentals, private chef hiring, yacht charters, and private jet bookings.</p>
      </div>
      <style>{`*{margin:0;padding:0;box-sizing:border-box}::selection{background:#2C2C31;color:#F4F4F5}a{color:inherit;text-decoration:none}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
@keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes lineGrowY{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes shimmerSweep{0%{left:-30%}100%{left:130%}}
@keyframes pulseGlow{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
@keyframes slideFromLeft{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideFromRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideFromBottom{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.hide-sb::-webkit-scrollbar{display:none}.hide-sb{-ms-overflow-style:none;scrollbar-width:none}
input::placeholder{color:#52525B}input:focus{outline:none}

/* ── Hero ── */
.hero-title span{font-size:160px!important;letter-spacing:8px!important}
.hero-nav{display:flex!important}
.hero-corner{display:flex!important}
.hero-scroll-l,.hero-scroll-r{display:block!important}

/* ── Section headings ── */
.sec-head{font-size:48px!important}
.sec-sub{font-size:44px!important}

/* ── Experience grid ── */
.exp-grid{grid-template-columns:repeat(3,1fr)!important;gap:16px!important;padding:0 40px!important}

/* ── Stats grid ── */
.stats-grid{grid-template-columns:repeat(4,1fr)!important}
.stat-cell{padding:44px 28px!important}

/* ── Trust row ── */
.trust-row{flex-direction:row!important;gap:40px!important}

/* ── Membership ── */
.tiers-row{flex-direction:row!important;gap:16px!important;padding:0 40px!important}
.noir-bar{flex-direction:column!important;padding:40px 40px 36px!important}
.noir-perks{grid-template-columns:1fr 1fr 1fr!important}
.noir-bottom{flex-direction:row!important}

/* ── Venue carousel ── */
.venue-wrap{flex-direction:row!important;gap:24px!important;padding:0 40px!important}
.venue-peek{display:block!important}
.venue-center{width:440px!important;height:280px!important}

/* ── Steps ── */
.step-wrap{padding:0 40px!important}

/* ── Footer ── */
.footer-grid{grid-template-columns:1.8fr 1fr 1.2fr 1.2fr!important;gap:40px!important}
.footer-alfred{font-size:280px!important}

/* ── Testimonial ── */
.test-card{padding:48px 44px!important}
.test-quote{font-size:20px!important}

/* ── Modal ── */
.modal-inner{width:520px!important}

/* ═══════ TABLET ≤ 1024px ═══════ */
@media(max-width:1024px){
  .hero-title span{font-size:110px!important;letter-spacing:5px!important}
  .sec-head{font-size:38px!important}
  .sec-sub{font-size:36px!important}
  .exp-grid{grid-template-columns:repeat(2,1fr)!important;padding:0 28px!important}
  .stats-grid{grid-template-columns:repeat(2,1fr)!important}
  .tiers-row{flex-direction:column!important;max-width:420px!important;margin-left:auto!important;margin-right:auto!important;padding:0 28px!important}
  .noir-bar{padding:28px 24px 24px!important}
  .noir-perks{grid-template-columns:1fr 1fr!important}
  .venue-center{width:380px!important;height:250px!important}
  .venue-peek{width:140px!important;height:190px!important}
  .footer-grid{grid-template-columns:1fr 1fr!important;gap:40px 32px!important}
  .footer-alfred{font-size:180px!important;letter-spacing:-8px!important}
  .step-wrap{padding:0 28px!important}
  .venue-wrap{padding:0 28px!important}
  .test-card{padding:36px 28px!important}
}

/* ═══════ MOBILE ≤ 640px ═══════ */
@media(max-width:640px){
  .hero-title span{font-size:52px!important;letter-spacing:3px!important}
  .hero-nav{display:none!important}
  .hero-corner{display:none!important}
  .hero-scroll-l,.hero-scroll-r{display:none!important}
  .sec-head{font-size:28px!important;letter-spacing:-1px!important}
  .sec-sub{font-size:28px!important;letter-spacing:-1px!important}
  .exp-grid{grid-template-columns:1fr!important;padding:0 20px!important;max-width:360px!important;margin-left:auto!important;margin-right:auto!important}
  .stats-grid{grid-template-columns:repeat(2,1fr)!important}
  .stat-cell{padding:28px 16px!important}
  .trust-row{flex-direction:column!important;gap:16px!important}
  .tiers-row{padding:0 20px!important;max-width:360px!important}
  .noir-bar{margin:24px 20px 0!important;padding:24px 20px 20px!important}
  .noir-perks{grid-template-columns:1fr!important}
  .venue-wrap{flex-direction:column!important;align-items:center!important;padding:0 20px!important}
  .venue-peek{display:none!important}
  .venue-center{width:100%!important;max-width:380px!important;height:240px!important;border-radius:18px!important}
  .footer-grid{grid-template-columns:1fr!important;gap:36px!important;padding:48px 20px 40px!important}
  .footer-alfred{font-size:72px!important;letter-spacing:-3px!important}
  .step-wrap{padding:0 20px!important}
  .test-card{padding:28px 20px!important;border-radius:18px!important}
  .test-quote{font-size:17px!important}
  .modal-inner{width:calc(100vw - 32px)!important;max-height:90vh!important;border-radius:20px!important}
}`}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      {/* ═══ HERO ═══ */}
      <section aria-label="Hero" style={{height:"100vh",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{position:"absolute",left:(mouse.x*100)+"%",top:(mouse.y*100)+"%",width:600,height:600,marginLeft:-300,marginTop:-300,borderRadius:"50%",background:"radial-gradient(circle,rgba(244,244,245,0.025) 0%,transparent 60%)",pointerEvents:"none",transition:"left 0.8s cubic-bezier(0.16,1,0.3,1),top 0.8s cubic-bezier(0.16,1,0.3,1)",zIndex:1}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",width:"70%",height:1,marginLeft:"-35%",marginTop:-80,background:"linear-gradient(90deg,transparent,#1F1F23 30%,#1F1F23 70%,transparent)",transformOrigin:"center",animation:loaded?"lineGrow 1.4s cubic-bezier(0.16,1,0.3,1) 0.6s both":"none",zIndex:2}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",width:"70%",height:1,marginLeft:"-35%",marginTop:80,background:"linear-gradient(90deg,transparent,#1F1F23 30%,#1F1F23 70%,transparent)",transformOrigin:"center",animation:loaded?"lineGrow 1.4s cubic-bezier(0.16,1,0.3,1) 0.8s both":"none",zIndex:2}}/>
        <div style={{position:"absolute",top:32,left:40,zIndex:10,animation:loaded?"slideFromLeft 1s cubic-bezier(0.16,1,0.3,1) 0.3s both":"none"}}><DrawMark size={22} color={C.s1} active={loaded} delay={0.5} id="mg1"/></div>
        <nav className="hero-nav" style={{position:"absolute",top:36,right:40,zIndex:10,display:"flex",alignItems:"center",gap:28,animation:loaded?"slideFromRight 1s cubic-bezier(0.16,1,0.3,1) 0.4s both":"none"}}>{["Experience","Membership","Contact"].map(function(item){return <a key={item} href={"#"+item.toLowerCase()} style={{...sf(11,400),color:C.s6,letterSpacing:0.3,cursor:"pointer",transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>{item}</a>})}</nav>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:5}}>
          <div style={{textAlign:"center",transform:"translateY("+(heroY+my)+"px) translateX("+mx+"px) scale("+heroScale+")",opacity:heroOp,filter:"blur("+heroBlur+"px)",willChange:"transform,opacity,filter",transition:"transform 0.5s cubic-bezier(0.16,1,0.3,1)"}}>
            <p style={{...sf(10,400),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:28,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s"}}>Luxury Concierge</p>
            <div style={{overflow:"hidden",lineHeight:0.88,position:"relative"}}>
              {LETTERS.map(function(ch,i){return <span key={i} className="hero-title" style={{display:"inline-block",...sf(160,700),letterSpacing:8,opacity:loaded?1:0,transform:loaded?"translateY(0) scale(1)":"translateY(100%) scale(0.9)",transition:"transform 1.1s cubic-bezier(0.16,1,0.3,1) "+(0.7+i*0.07)+"s, opacity 0.6s ease "+(0.7+i*0.07)+"s"}}>{ch}</span>})}
              {shimmer && <div style={{position:"absolute",top:0,bottom:0,width:"25%",background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.08) 50%,transparent)",animation:"shimmerSweep 1.2s cubic-bezier(0.16,1,0.3,1) forwards",pointerEvents:"none"}}/>}
            </div>
            <CityCarousel loaded={loaded}/>
            <p style={{...sf(15,400),color:C.s6,lineHeight:1.7,maxWidth:360,margin:"36px auto 0"}}>{tagWords.map(function(word,i){return <span key={i} style={{display:"inline-block",marginRight:4,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(10px)",transition:"all 0.6s cubic-bezier(0.16,1,0.3,1) "+(1.6+i*0.03)+"s"}}>{word}</span>})}</p>
            <div style={{marginTop:40,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(20px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 2.2s"}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 24px",borderRadius:14,background:hoverCta?C.s1:C.el,border:"1px solid "+(hoverCta?C.s1:C.bd),cursor:"pointer",transform:hoverCta?"translateY(-2px)":"translateY(0)",boxShadow:hoverCta?"0 8px 30px rgba(244,244,245,0.1)":"none",transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)"}} onMouseEnter={function(){setHoverCta(true)}} onMouseLeave={function(){setHoverCta(false)}}>
                <svg width="18" height="22" viewBox="0 0 24 30" fill={hoverCta?C.bg:C.s1} style={{transition:"fill 0.4s"}}><path d={appSvg}/></svg>
                <div style={{display:"flex",flexDirection:"column",gap:1}}>
                  <span style={{...sf(9,400),color:hoverCta?C.bg+"90":C.s6,transition:"color 0.4s",lineHeight:1}}>Download on the</span>
                  <span style={{...sf(15,600),color:hoverCta?C.bg:C.s1,transition:"color 0.4s",lineHeight:1.1,letterSpacing:-0.3}}>App Store</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-l" style={{position:"absolute",bottom:36,left:40,zIndex:10,animation:loaded?"slideFromBottom 1s cubic-bezier(0.16,1,0.3,1) 2.4s both":"none"}}><span style={{...sf(9,400),color:C.s7,letterSpacing:2,textTransform:"uppercase",writingMode:"vertical-lr",transform:"rotate(180deg)"}}>Scroll</span></div>
        <div className="hero-scroll-r" style={{position:"absolute",bottom:36,right:40,zIndex:10,animation:loaded?"slideFromBottom 1s cubic-bezier(0.16,1,0.3,1) 2.5s both":"none"}}><span style={{...sf(9,400),color:C.s7,letterSpacing:2,textTransform:"uppercase",writingMode:"vertical-lr"}}>©2026</span></div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={stepsRef} aria-label="How it works" style={{padding:"140px 0 120px",position:"relative"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 80px"}}><p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:stepsVis?1:0,transition:"all 0.8s ease"}}>How it works</p><h2 className="sec-sub" style={{...sf(44,600),letterSpacing:-1.5,lineHeight:1.1,opacity:stepsVis?1:0,transform:stepsVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Three steps to<br/>everything.</h2></div>
        <div className="step-wrap" style={{maxWidth:560,margin:"0 auto",position:"relative",padding:"0 40px"}}><div style={{position:"absolute",top:24,bottom:80,left:63,width:1,background:"#1F1F23"}}><div style={{width:"100%",height:(stepsProgress*100)+"%",background:"linear-gradient(180deg,#3F3F46,#2C2C31)",transition:"height 0.1s linear"}}/></div>
          <Step num="1" title="Tell Alfred" icon="💬" desc="Type what you want in plain language. A table for tonight, a yacht this weekend, a private chef for Saturday — anything." detail="Alfred checks it · responds in seconds" vis={stepsVis} delay={0.3}/>
          <Step num="2" title="We handle it" icon="⚡" desc="Your request goes straight to a real human concierge who finds the best options, makes the calls, and confirms everything — no bots, no waiting." detail="100% human · always available" vis={stepsVis} delay={0.55}/>
          <Step num="3" title="Show up" icon="✦" desc="Get your confirmation, show up, enjoy. No calls, no back-and-forth, no hassle. That's it." detail="One tap · done" vis={stepsVis} delay={0.8}/>
        </div>
      </section>

      {/* ═══ EXPERIENCES — 2×3 GRID ═══ */}
      <section ref={showRef} aria-label="Experiences" style={{padding:"140px 0 140px",position:"relative"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto",marginBottom:64}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:16,opacity:showVis?1:0,transition:"all 0.8s ease"}}>The App</p>
          <h2 className="sec-head" style={{...sf(48,600),letterSpacing:-1.5,lineHeight:1.08,opacity:showVis?1:0,transform:showVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>One app. Every<br/>experience.</h2>
        </div>

        <div className="exp-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,maxWidth:960,margin:"0 auto",padding:"0 40px",opacity:showVis?1:0,transform:showVis?"translateY(0)":"translateY(20px)",transition:"all 1s ease 0.3s"}}>
          {exps.map(function(e,i){
            return <GridCard key={e.title} title={e.title} count={e.count} tag={e.tag} img={e.img} delay={0.1*i} onClick={function(){setModalCat(e.title)}}/>;
          })}
        </div>

        <div style={{display:"flex",justifyContent:"center",marginTop:56}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 24px",borderRadius:14,background:hoverApp?C.s1:C.el,border:"1px solid "+(hoverApp?C.s1:C.bd),cursor:"pointer",transform:hoverApp?"translateY(-2px)":"translateY(0)",transition:"all 0.4s ease",opacity:showVis?1:0}} onMouseEnter={function(){setHoverApp(true)}} onMouseLeave={function(){setHoverApp(false)}}>
            <svg width="20" height="24" viewBox="0 0 24 30" fill={hoverApp?C.bg:C.s1}><path d={appSvg}/></svg>
            <div style={{display:"flex",flexDirection:"column",gap:1}}>
              <span style={{...sf(9,400),color:hoverApp?C.bg+"90":C.s6,lineHeight:1}}>Download on the</span>
              <span style={{...sf(16,600),color:hoverApp?C.bg:C.s1,lineHeight:1.1,letterSpacing:-0.3}}>App Store</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section ref={statsRef} aria-label="Statistics" style={{padding:"140px 0 160px",position:"relative"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",marginBottom:80}}><p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:statsVis?1:0,transition:"all 0.8s ease"}}>By the numbers</p><h2 className="sec-head" style={{...sf(48,600),letterSpacing:-1.5,lineHeight:1.08,opacity:statsVis?1:0,transform:statsVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Built to exceed<br/>every expectation.</h2></div>
        <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,maxWidth:880,margin:"0 auto",background:C.bd,borderRadius:20,overflow:"hidden",opacity:statsVis?1:0,transform:statsVis?"translateY(0)":"translateY(24px)",transition:"all 1s ease 0.3s"}}>{[{n:200,s:"+",l:"Curated Venues",sb:"Restaurants, clubs & bars",c:"#818CF8"},{n:120,s:"+",l:"Wellness Partners",sb:"Spas, trainers & retreats",c:"#34D399"},{px:"< ",n:2,s:" min",l:"Response Time",sb:"Average concierge reply",c:"#F472B6"},{n:24,s:"/7",l:"Concierge",sb:"Real humans, always on",c:"#FBBF24"}].map(function(stat,i){return <div key={i} className="stat-cell" style={{background:C.bg,padding:"44px 28px",textAlign:"center"}}><div style={{...sf(48,600),color:stat.c,marginBottom:8,lineHeight:1}}>{stat.px||""}<AnimCounter end={stat.n} suffix={stat.s} duration={1800} active={statsVis}/></div><div style={{...sf(14,600),color:C.s2,marginBottom:4}}>{stat.l}</div><div style={{...sf(12,400),color:C.s6}}>{stat.sb}</div></div>})}</div>
        <div style={{maxWidth:880,margin:"80px auto 0",opacity:statsVis?1:0,transform:statsVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.6s",padding:"0 40px"}}>
          <div className="test-card" style={{borderRadius:24,border:"1px solid "+C.bd,background:C.el,padding:"48px 44px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            {/* Subtle top shine */}
            <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg, transparent, rgba(244,244,245,0.06) 30%, rgba(244,244,245,0.1) 50%, rgba(244,244,245,0.06) 70%, transparent)"}}/>
            {/* Quote mark */}
            <div style={{...sf(64,300),color:C.s7,lineHeight:1,marginBottom:12}}>"</div>
            <p className="test-quote" style={{...sf(20,400),color:C.s3,lineHeight:1.7,fontStyle:"italic",marginBottom:32,maxWidth:480,margin:"0 auto 32px"}}>I told Alfred I needed a last-minute dinner for eight in Paris. Twenty minutes later, I had a private room at a Michelin-starred restaurant I couldn't have booked myself.</p>
            {/* Stars */}
            <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:20}}>
              {[1,2,3,4,5].map(function(s){return <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#FBBF24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>})}
            </div>
            {/* Author */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&q=80" alt="Bruce Wayne testimonial" loading="lazy" style={{width:46,height:46,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(255,255,255,0.08)"}}/>
              <div style={{textAlign:"left"}}>
                <div style={{...sf(14,600),color:C.s2}}>Bruce Wayne</div>
                <div style={{...sf(12,400),color:C.s6}}>Founding Member · Miami</div>
              </div>
            </div>
          </div>
        </div>
        <div className="trust-row" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:40,marginTop:72,opacity:statsVis?1:0,transition:"all 0.8s ease 0.8s"}}>{["End-to-end encrypted","Invite-only beta","No ads, ever"].map(function(t,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:8}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke={C.gn} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span style={{...sf(12,400),color:C.s5}}>{t}</span></div>})}</div>
      </section>

      {/* ═══ MEMBERSHIP — METALLIC ═══ */}
      <section ref={tiersRef} aria-label="Membership" id="membership" style={{padding:"140px 0 160px",position:"relative"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:520,margin:"0 auto",marginBottom:20}}><p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:tiersVis?1:0,transition:"all 0.8s ease"}}>Membership</p><h2 className="sec-head" style={{...sf(48,600),letterSpacing:-1.5,lineHeight:1.08,marginBottom:20,opacity:tiersVis?1:0,transform:tiersVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Choose your<br/>level of access.</h2></div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:52,opacity:tiersVis?1:0,transition:"opacity 0.8s ease 0.3s"}}><div style={{display:"flex",alignItems:"center",gap:12,padding:"4px",borderRadius:14,background:C.el,border:"1px solid "+C.bd}}><div onClick={function(){setAnnual(false)}} style={{...sf(13,!annual?600:400),color:!annual?C.s1:C.s5,padding:"9px 20px",borderRadius:10,background:!annual?"rgba(244,244,245,0.06)":"transparent",cursor:"pointer",transition:"all 0.3s"}}>Monthly</div><div onClick={function(){setAnnual(true)}} style={{...sf(13,annual?600:400),color:annual?C.s1:C.s5,padding:"9px 20px",borderRadius:10,background:annual?"rgba(244,244,245,0.06)":"transparent",cursor:"pointer",transition:"all 0.3s",display:"flex",alignItems:"center",gap:8}}>Annual<span style={{...sf(10,600),color:C.gn,padding:"2px 7px",borderRadius:5,background:"rgba(52,199,89,0.12)"}}>-20%</span></div></div></div>

        <div className="tiers-row" style={{display:"flex",gap:16,maxWidth:1020,margin:"0 auto",padding:"0 40px",alignItems:"stretch"}}>
          <MetalTier name="Explorer" price="Free" annualPrice="Free" period="" desc="Browse venues and see what Alfred can do." features={["Browse all venues & menus","Smart venue search","Save favorites","3 bookings per month"]} cta="Get Started Free" popular={false} metalColor={SILVER} metalGrad={SILVER_G} vis={tiersVis} delay={0.3} annual={annual}/>
          <MetalTier name="Gold" price="$49" annualPrice="$39" period="/month" desc="Unlimited access with priority support and personal concierge." features={["Unlimited bookings","Priority reservations","Personal human concierge","Member-only venues","10% off curated packages","WhatsApp support"]} cta="Start 7-day free trial" popular={true} metalColor={GOLD} metalGrad={GOLD_G} vis={tiersVis} delay={0.4} annual={annual}/>
          <MetalTier name="Platinum" price="$199" annualPrice="$159" period="/month" desc="Dedicated human concierge and full VIP treatment." features={["Everything in Gold","Dedicated human concierge","VIP event access","Same-day guaranteed bookings","Bespoke experience curation","Private chef & yacht access"]} cta="Join Platinum" popular={false} metalColor={PLAT} metalGrad={PLAT_G} vis={tiersVis} delay={0.5} annual={annual}/>
        </div>

        {/* Alfred Noir — matching app card style */}
        <div style={{maxWidth:940,margin:"32px auto 0",padding:"0 40px",opacity:tiersVis?1:0,transform:tiersVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.7s"}}>
          <div className="noir-bar" style={{borderRadius:24,padding:"36px 36px 32px",background:"linear-gradient(180deg,#0E0E11,#080809)",border:"1px solid rgba(244,244,245,0.06)",position:"relative",overflow:"hidden",cursor:"pointer",transition:"border-color 0.4s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor="rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor="rgba(244,244,245,0.06)"}}>
            {/* Shimmer overlay */}
            <div style={{position:"absolute",inset:0,pointerEvents:"none",background:"linear-gradient(105deg, transparent 20%, rgba(244,244,245,0.02) 40%, rgba(244,244,245,0.01) 60%, transparent 80%)",backgroundSize:"250% 100%"}}/>

            {/* Header row */}
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:24,position:"relative"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                {/* Key icon in box */}
                <div style={{width:32,height:32,borderRadius:9,background:"rgba(244,244,245,0.05)",border:"0.5px solid rgba(244,244,245,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.s2} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.78 7.78 5.5 5.5 0 017.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{...sf(22,700),color:C.s2}}>Alfred Noir</span>
                    <div style={{padding:"2px 7px",borderRadius:5,background:"rgba(244,244,245,0.05)",border:"0.5px solid rgba(244,244,245,0.08)"}}>
                      <span style={{...sf(8,700),color:C.s5,letterSpacing:0.8,textTransform:"uppercase"}}>Invite Only</span>
                    </div>
                  </div>
                  <div style={{...sf(12,400),color:C.s6,marginTop:3}}>The black card</div>
                </div>
              </div>
              <div style={{...sf(12,500),color:C.s5}}>By invitation</div>
            </div>

            {/* Divider */}
            <div style={{height:0.5,background:"rgba(244,244,245,0.06)",marginBottom:24}}/>

            {/* Perks grid */}
            <div className="noir-perks" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"18px 28px",marginBottom:28}}>
              {[
                {icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.s3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,title:"Dedicated Team",desc:"Your own concierge, 24/7"},
                {icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.s3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>,title:"Private Aviation",desc:"Jets, helicopters, transfers"},
                {icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.s3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 1l1 9a6 6 0 006 6 6 6 0 006-6l1-9"/><path d="M8 22h8M12 15v7"/></svg>,title:"Impossible Tables",desc:"Fully-booked restaurants"},
                {icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.s3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h2m10 0h2M3 9l2-5h14l2 5M3 9v8a1 1 0 001 1h16a1 1 0 001-1V9M3 9h18"/></svg>,title:"Yacht & Supercars",desc:"Villas, yachts, island retreats"},
                {icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.s3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,title:"Sold-Out Events",desc:"Front row, backstage, VIP"},
                {icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.s3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>,title:"No Limits",desc:"If it exists, we make it happen"},
              ].map(function(perk,i){
                return <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:28,height:28,borderRadius:8,background:"rgba(244,244,245,0.04)",border:"0.5px solid rgba(244,244,245,0.07)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {perk.icon}
                  </div>
                  <div>
                    <div style={{...sf(13,600),color:C.s2,marginBottom:2}}>{perk.title}</div>
                    <div style={{...sf(11,400),color:C.s6,lineHeight:1.4}}>{perk.desc}</div>
                  </div>
                </div>;
              })}
            </div>

            {/* Bottom CTA */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{...sf(12,400),color:C.s7}}>Membership by invitation or application</div>
              <div style={{display:"flex",alignItems:"center",gap:8,...sf(13,600),color:C.s1,padding:"11px 24px",borderRadius:12,background:"rgba(244,244,245,0.06)",border:"1px solid rgba(244,244,245,0.08)",transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(244,244,245,0.1)";e.currentTarget.style.borderColor="rgba(244,244,245,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(244,244,245,0.06)";e.currentTarget.style.borderColor="rgba(244,244,245,0.08)"}}>
                Apply for Noir
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>
              </div>
            </div>

            {/* ALFRED watermark */}
            <div style={{position:"absolute",bottom:14,right:18,opacity:0.03,pointerEvents:"none"}}>
              <span style={{...sf(8,700),letterSpacing:4,textTransform:"uppercase",color:C.s2}}>ALFRED</span>
            </div>
          </div>
        </div>
        <p style={{textAlign:"center",marginTop:40,...sf(13,400),color:C.s6,opacity:tiersVis?1:0,transition:"opacity 0.8s ease 0.9s"}}>All plans include end-to-end encryption and no ads. Cancel anytime.</p>
      </section>

      {/* ═══ VENUE CROSSFADE CAROUSEL ═══ */}
      <section ref={dirRef} aria-label="Venues" style={{padding:"140px 0 140px",position:"relative",overflow:"hidden"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:520,margin:"0 auto",marginBottom:20}}><p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:16,opacity:dirVis?1:0,transition:"all 0.8s ease"}}>Our Venues</p><h2 className="sec-head" style={{...sf(48,600),letterSpacing:-1.5,lineHeight:1.08,marginBottom:12,opacity:dirVis?1:0,transform:dirVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Hand-picked.<br/>Verified. Yours.</h2><p style={{...sf(14,400),color:C.s5,opacity:dirVis?1:0,transition:"all 0.8s ease 0.3s"}}>{venues.length} exclusive venues across Miami and Paris</p></div>

        <div className="venue-wrap" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:24,margin:"48px auto",maxWidth:900,padding:"0 40px",opacity:dirVis?1:0,transition:"all 1s ease 0.4s"}}>
          {/* Left peek */}
          <div className="venue-peek" style={{width:200,height:240,borderRadius:18,overflow:"hidden",flexShrink:0,opacity:0.4,transform:"scale(0.92)",position:"relative"}}>
            <img src={leftCard.img} alt={leftCard.n} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,"+leftCard.color+"C0 0%,transparent 60%)"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.4) 100%)"}}/>
            <div style={{position:"absolute",bottom:16,left:16,...sf(15,700),color:"#fff"}}>{leftCard.n}</div>
          </div>

          {/* Center crossfade */}
          <div className="venue-center" style={{width:440,height:280,borderRadius:22,overflow:"hidden",flexShrink:0,position:"relative",boxShadow:"0 24px 70px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.06)",perspective:800}}>
            {venues.map(function(v,i){
              var isActive = i === centerIdx;
              var wasPrev = i === prevIdx;
              return (
                <div key={v.n} style={{
                  position:"absolute",inset:0,
                  opacity:isActive?1:0,
                  transform:isActive?"rotateY(0deg) scale(1)":wasPrev?"rotateY(-12deg) scale(0.95)":"rotateY(12deg) scale(0.95)",
                  transition:"opacity 1s ease, transform 1s cubic-bezier(0.4,0,0.2,1)",
                  zIndex:isActive?2:wasPrev?1:0,
                  backfaceVisibility:"hidden",
                }}>
                  <img src={v.img} alt={v.n} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,"+v.color+"D0 0%,"+v.color+"60 30%,transparent 60%)",zIndex:1}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.35) 100%)",zIndex:1}}/>
                  <div style={{position:"absolute",bottom:0,left:0,padding:"0 28px 24px",zIndex:2}}>
                    <div style={{...sf(26,700),color:"#fff",marginBottom:4,letterSpacing:-0.5}}>{v.n}</div>
                    <div style={{...sf(14,400),color:"rgba(255,255,255,0.6)"}}>{v.sub}</div>
                  </div>
                  <div style={{position:"absolute",top:18,right:18,zIndex:2,display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:10,background:"rgba(0,0,0,0.25)",backdropFilter:"blur(16px)",border:"0.5px solid rgba(255,255,255,0.1)"}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                    <span style={{...sf(12,600),color:"rgba(255,255,255,0.9)"}}>{v.tag}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right peek */}
          <div className="venue-peek" style={{width:200,height:240,borderRadius:18,overflow:"hidden",flexShrink:0,opacity:0.4,transform:"scale(0.92)",position:"relative"}}>
            <img src={rightCard.img} alt={rightCard.n} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(270deg,"+rightCard.color+"C0 0%,transparent 60%)"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.4) 100%)"}}/>
            <div style={{position:"absolute",bottom:16,right:16,...sf(15,700),color:"#fff",textAlign:"right"}}>{rightCard.n}</div>
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:20,opacity:dirVis?1:0,transition:"opacity 0.8s ease 0.6s"}}>{venues.map(function(v,i){return <div key={i} style={{width:i===centerIdx?24:6,height:6,borderRadius:3,background:i===centerIdx?C.s1:C.s7,transition:"all 0.8s ease"}}/>})}</div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section ref={ctaRef} aria-label="Download" style={{padding:"120px 0 140px",position:"relative"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto",padding:"0 40px"}}>
          <div style={{opacity:ctaVis?1:0,transition:"all 0.9s ease 0.1s",marginBottom:28}}><DrawMark size={40} color={C.s1} active={ctaVis} delay={0.3} id="mg2"/></div>
          <h2 className="sec-head" style={{...sf(52,600),letterSpacing:-2,lineHeight:1.06,marginBottom:20,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.2s"}}>Your city.<br/>Your way.</h2>
          <p style={{...sf(17,400),color:C.s5,lineHeight:1.7,maxWidth:420,margin:"0 auto 40px",opacity:ctaVis?1:0,transition:"all 0.8s ease 0.4s"}}>Download Alfred and discover why the best experiences aren't found — they're arranged.</p>

          {/* App Store button */}
          <div style={{opacity:ctaVis?1:0,transition:"all 0.8s ease 0.55s",marginBottom:32}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:12,padding:"16px 28px",borderRadius:16,background:hoverFinal?C.s1:C.el,border:"1px solid "+(hoverFinal?C.s1:C.bd),cursor:"pointer",transform:hoverFinal?"translateY(-3px)":"translateY(0)",boxShadow:hoverFinal?"0 12px 40px rgba(244,244,245,0.1)":"none",transition:"all 0.4s ease"}} onMouseEnter={function(){setHoverFinal(true)}} onMouseLeave={function(){setHoverFinal(false)}}>
              <svg width="22" height="26" viewBox="0 0 24 30" fill={hoverFinal?C.bg:C.s1} style={{transition:"fill 0.4s"}}><path d={appSvg}/></svg>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                <span style={{...sf(10,400),color:hoverFinal?C.bg+"90":C.s6,transition:"color 0.4s",lineHeight:1}}>Download on the</span>
                <span style={{...sf(18,600),color:hoverFinal?C.bg:C.s1,transition:"color 0.4s",lineHeight:1.1,letterSpacing:-0.3}}>App Store</span>
              </div>
            </div>
          </div>

          {/* App Store rating */}
          <div style={{opacity:ctaVis?1:0,transition:"all 0.8s ease 0.7s"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:8}}>
              {[1,2,3,4,5].map(function(s){return <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>})}
            </div>
            <div style={{...sf(14,600),color:C.s3,marginBottom:4}}>4.9 out of 5</div>
            <div style={{...sf(12,400),color:C.s6}}>148 ratings on the App Store</div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER — editorial typographic ═══ */}
      <footer style={{borderTop:"1px solid "+C.bd,position:"relative",overflow:"hidden"}}>
        {/* Top section with columns */}
        <div style={{maxWidth:1060,margin:"0 auto",padding:"80px 40px 60px"}}>
          <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"1.8fr 1fr 1.2fr 1.2fr",gap:40,alignItems:"flex-start"}}>
            {/* Description */}
            <div>
              <div style={{marginBottom:20}}><DrawMark size={28} color={C.s4} active={true} delay={0} id="mg3"/></div>
              <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,maxWidth:260}}>Alfred is the luxury concierge app for people who value their time above everything else.</p>
            </div>

            {/* Explore */}
            <div>
              <div style={{...sf(10,600),color:C.s7,letterSpacing:2,textTransform:"uppercase",marginBottom:20}}>Explore</div>
              {["How it Works","Experiences","Membership","Download"].map(function(l){return <a key={l} href="#" style={{...sf(14,400),color:C.s5,display:"block",marginBottom:14,transition:"color 0.2s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>{l}</a>})}
            </div>

            {/* Follow us */}
            <div>
              <div style={{...sf(10,600),color:C.s7,letterSpacing:2,textTransform:"uppercase",marginBottom:20}}>Follow us</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {[
                  {name:"@alfred",platform:"Instagram",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke={C.s5} strokeWidth="1.5"/><circle cx="12" cy="12" r="5" stroke={C.s5} strokeWidth="1.5"/><circle cx="18" cy="6" r="1.2" fill={C.s5}/></svg>},
                  {name:"@alfredconcierge",platform:"X",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill={C.s5}><path d="M4 4L10.5 12.5L4 20H6L11.5 13.7L16 20H20L13.2 11L19.3 4H17.3L12.2 9.8L8 4H4Z"/></svg>},
                  {name:"@alfred",platform:"TikTok",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill={C.s5}><path d="M9 12C9 13.66 7.66 15 6 15C4.34 15 3 13.66 3 12C3 10.34 4.34 9 6 9V7C3.24 7 1 9.24 1 12C1 14.76 3.24 17 6 17C8.76 17 11 14.76 11 12V6C12.5 7.5 14.5 8 17 8V6C14.5 6 12 4 12 1H10V12C10 12 10 12 9 12Z"/></svg>},
                ].map(function(s){return <a key={s.platform} href="#" style={{display:"flex",alignItems:"center",gap:10,...sf(13,400),color:C.s5,transition:"color 0.2s"}} onMouseEnter={function(e){e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.color=C.s5}}>{s.icon}<span>{s.name}</span></a>})}
              </div>
            </div>

            {/* Newsletter + Download */}
            <div>
              <div style={{...sf(15,600),color:C.s1,marginBottom:6}}>Get invited to the best venues</div>
              <p style={{...sf(12,400),color:C.s6,marginBottom:16,lineHeight:1.5}}>Weekly curated picks and exclusive access. No spam.</p>
              <div style={{display:"flex",gap:8,marginBottom:28}}>
                <input placeholder="Your email" style={{...sf(13,400),color:C.s1,background:"rgba(255,255,255,0.04)",border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",flex:1,outline:"none"}}/>
                <div style={{...sf(12,600),color:"#0E0E11",background:C.s1,padding:"10px 18px",borderRadius:10,cursor:"pointer",whiteSpace:"nowrap",transition:"opacity 0.2s"}} onMouseEnter={function(e){e.target.style.opacity="0.85"}} onMouseLeave={function(e){e.target.style.opacity="1"}}>Subscribe</div>
              </div>

              {/* App Store */}
              <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid "+C.bd,cursor:"pointer",transition:"border-color 0.2s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
                <svg width="16" height="19" viewBox="0 0 24 30" fill={C.s1}><path d={appSvg}/></svg>
                <div style={{display:"flex",flexDirection:"column",gap:1}}>
                  <span style={{...sf(8,400),color:C.s6,lineHeight:1}}>Download on the</span>
                  <span style={{...sf(13,600),color:C.s1,lineHeight:1.1}}>App Store</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Giant ALFRED typography */}
        <div style={{overflow:"hidden",padding:"0 40px",marginTop:-10}}>
          <div className="footer-alfred" style={{...sf(280,900),color:C.s1,letterSpacing:-14,lineHeight:0.8,opacity:0.05,userSelect:"none",textAlign:"center",whiteSpace:"nowrap"}}>
            ALFRED
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{maxWidth:1060,margin:"0 auto",padding:"20px 40px 36px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid "+C.bd,paddingTop:24}}>
            <span style={{...sf(12,400),color:C.s7}}>Alfred ©2026</span>
            <div style={{display:"flex",gap:24}}>
              {["Privacy Policy","Terms"].map(function(l){return <a key={l} href="#" style={{...sf(12,400),color:C.s7,transition:"color 0.2s"}} onMouseEnter={function(e){e.target.style.color=C.s5}} onMouseLeave={function(e){e.target.style.color=C.s7}}>{l}</a>})}
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ VENUE MODAL ═══ */}
      {modalCat && <div onClick={function(){setModalCat(null)}} style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(20px)",display:"flex",alignItems:"center",justifyContent:"center",opacity:1,animation:"fadeIn 0.3s ease"}}>
        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(30px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
        <div onClick={function(e){e.stopPropagation()}} className="modal-inner" style={{width:520,maxHeight:"80vh",borderRadius:24,background:"#111114",border:"1px solid rgba(255,255,255,0.06)",boxShadow:"0 40px 120px rgba(0,0,0,0.6)",overflow:"hidden",animation:"slideUp 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
          {/* Modal header with image */}
          <div style={{position:"relative",height:180,overflow:"hidden"}}>
            <img src={exps.find(function(e){return e.title===modalCat})?.img || exps[0].img} alt="venue" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(17,17,20,0) 30%,rgba(17,17,20,1) 100%)"}}/>
            <div style={{position:"absolute",bottom:20,left:28}}>
              <div style={{...sf(28,700),color:"#fff",letterSpacing:-0.5}}>{modalCat}</div>
              <div style={{...sf(13,400),color:"rgba(255,255,255,0.5)",marginTop:4}}>{(catVenues[modalCat]||[]).length} venues available</div>
            </div>
            {/* Close button */}
            <div onClick={function(){setModalCat(null)}} style={{position:"absolute",top:16,right:16,width:36,height:36,borderRadius:"50%",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"0.5px solid rgba(255,255,255,0.1)"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </div>
          {/* Venue list */}
          <div style={{padding:"8px 28px 28px",maxHeight:"calc(80vh - 180px)",overflowY:"auto"}}>
            {(catVenues[modalCat]||[]).map(function(venue,i){
              return <div key={venue} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:i<(catVenues[modalCat]||[]).length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:C.s7}}/>
                  <span style={{...sf(15,500),color:C.s2}}>{venue}</span>
                </div>
                <span style={{...sf(11,500),color:C.s5,padding:"4px 10px",borderRadius:6,background:"rgba(255,255,255,0.04)"}}>View</span>
              </div>;
            })}
            {/* CTA at bottom of modal */}
            <div style={{marginTop:24,textAlign:"center"}}>
              <div style={{...sf(13,400),color:C.s5,marginBottom:16}}>Download the app to book any venue instantly</div>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:12,background:C.s1,cursor:"pointer",...sf(13,600),color:C.bg}}>
                <svg width="16" height="19" viewBox="0 0 24 30" fill={C.bg}><path d={appSvg}/></svg>
                Download Alfred
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}
