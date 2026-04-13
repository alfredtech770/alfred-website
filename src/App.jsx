import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SEOHead, { SEO } from "./components/SEOHead";

/* ═══ CATEGORY PAGE IMPORTS ═══ */
/* Place each file in src/pages/ and uncomment these imports: */
import DiningPage from "./pages/DiningPage";
import DiningDetailPage from "./pages/DiningDetailPage";
import NightlifePage from "./pages/NightlifePage";
import NightlifeDetailPage from "./pages/NightlifeDetailPage";
import BarDetailPage from "./pages/BarDetailPage";
import WellnessPage from "./pages/WellnessPage";
import WellnessDetailPage from "./pages/WellnessDetailPage";
import JetsPage from "./pages/JetsPage";
import JetDetailPage from "./pages/JetDetailPage";
import ExoticCarsPage from "./pages/ExoticCarsPage";
import CarDetailPage from "./pages/CarDetailPage";
import YachtsPage from "./pages/YachtsPage";
import YachtDetailPage from "./pages/YachtDetailPage";
import FeaturedEvents from "./pages/FeaturedEvents";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogPost from "./pages/BlogPost";
import CityPage from "./pages/CityPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

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
  return(<div className="step-item" style={{display:"flex",gap:40,alignItems:"flex-start",opacity:p.vis?1:0,transform:p.vis?"translateY(0)":"translateY(40px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) "+p.delay+"s"}}>
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
      <div className="card-tag" style={{position:"absolute",top:14,left:14,...sf(9,600),letterSpacing:0.5,textTransform:"uppercase",color:C.s1,padding:"4px 9px",borderRadius:8,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(12px)",border:"0.5px solid rgba(255,255,255,0.08)"}}>{p.tag}</div>
      {/* Bottom */}
      <div className="card-bottom" style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 18px 16px"}}>
        <div className="card-title" style={{...sf(20,700),color:"#fff",marginBottom:6,letterSpacing:-0.3}}>{p.title}</div>
        <div className="card-row" style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:28}}>
          <span className="card-sub" style={{...sf(12,400),color:"rgba(255,255,255,0.5)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,marginRight:8}}>{p.count}</span>
          <div className="card-explore" style={{display:"flex",alignItems:"center",gap:4,...sf(11,500),color:"#fff",padding:"5px 12px",borderRadius:8,background:hover?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.08)",transition:"background 0.3s"}}>
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
  "Services":["Personal Shopping · Miami","Event Planning · Paris","Home Management · Miami","Relocation Assistance · Paris","Travel Planning · Miami","Pet Services · Paris","Gift Sourcing · Miami","VIP Access · Paris"],
  "Dining":["Carbone · Miami","Le Cinq · Paris","Papi Steak · Miami","Girafe · Paris","Komodo · Miami","L'Ambroisie · Paris","Nobu · Miami","Septime · Paris","Gekko · Miami","Le Clarence · Paris","COTE · Miami","Epicure · Paris","Zuma · Miami","La Tour d'Argent · Paris","Swan · Miami","Pavyllon · Paris"],
  "Nightlife":["LIV · Miami","CoCo Club · Paris","E11even · Miami","Raspoutine · Paris","Story · Miami","L'Arc · Paris","Basement · Miami","Castel · Paris","Club Space · Miami","Silencio · Paris"],
  "Wellness":["The Setai Spa · Miami","Dior Spa · Paris","Bamford Spa · Miami","Le Spa Ritz · Paris","The Standard Spa · Miami","Guerlain Spa · Paris","Lapis Spa · Miami","Spa Le Bristol · Paris","Carillon Wellness · Miami"],
  "Exotic Cars":["mph Club · Miami","Pugachev Luxury · Miami","Prestige Rentals · Miami","South Beach Exotic Rentals · Miami","F1 Luxury · Miami","Classic Car Club · Paris"],
  "Private Transportation":["NetJets Private","XO Aviation","Blade Helicopters","Miami Yacht Charters","Côte d'Azur Yachts","Blacklane · Paris","Ahoy Club"],
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

/* ═══ LOADER CITIES ═══ */
var LOADER_CITIES = [
  "Miami", "Paris", "London", "New York", "Dubai", "Tokyo",
  "Milan", "Monaco", "Los Angeles", "Ibiza", "Saint-Tropez",
  "Mykonos", "Aspen", "Marbella", "Tulum",
];

/* ═══ CANVAS MARK — thin glowing dot traces the A ═══ */
function MarkCanvas(props){
  var canvasRef = useRef(null);
  var litRef = useRef(false);
  useEffect(function(){ litRef.current = props.lit; }, [props.lit]);

  useEffect(function(){
    var c = canvasRef.current;
    if (!c) return;
    var ctx = c.getContext("2d");
    c.width = 380; c.height = 380;
    var W = 380, cx = W/2, cy = W/2, sc = 2.1;
    var ox = cx - 50*sc, oy = cy - 52*sc;
    var segs = [
      {x1:20,y1:82,x2:38,y2:22},{x1:38,y1:22,x2:62,y2:22},
      {x1:62,y1:22,x2:80,y2:82},{x1:30,y1:62,x2:70,y2:62},
    ];
    var pts = [];
    for (var si=0;si<segs.length;si++){
      var s=segs[si],dx=s.x2-s.x1,dy=s.y2-s.y1;
      var len=Math.sqrt(dx*dx+dy*dy),steps=Math.max(Math.floor(len*3),10);
      for(var i=0;i<=steps;i++){var t=i/steps;pts.push({x:ox+(s.x1+dx*t)*sc,y:oy+(s.y1+dy*t)*sc,s:si})}
      if(si===2){
        var gsx=ox+80*sc,gsy=oy+82*sc,gex=ox+30*sc,gey=oy+62*sc;
        var gdx=gex-gsx,gdy=gey-gsy,gl=Math.sqrt(gdx*gdx+gdy*gdy),gn=Math.max(Math.floor(gl*0.8),8);
        for(var gi=1;gi<=gn;gi++)pts.push({x:gsx+gdx*(gi/gn),y:gsy+gdy*(gi/gn),s:-1})
      }
    }
    var total=pts.length,particles=[],time=0,pulse=0,lightT=0,flashT=0,burstDone=false,id;
    var drawMark=function(op,lw){
      ctx.strokeStyle="rgba(244,244,245,"+op+")";ctx.lineWidth=lw;ctx.lineCap="round";
      for(var mi=0;mi<segs.length;mi++){var sg=segs[mi];ctx.beginPath();ctx.moveTo(ox+sg.x1*sc,oy+sg.y1*sc);ctx.lineTo(ox+sg.x2*sc,oy+sg.y2*sc);ctx.stroke()}
    };
    var frame=function(){
      time+=1.0;pulse+=0.015;ctx.clearRect(0,0,W,W);
      var isLit=litRef.current;
      if(isLit){lightT=Math.min(lightT+0.018,1);flashT=Math.min(flashT+0.022,1)}
      var breathe=0.5+0.5*Math.sin(pulse*0.6);
      var gr=100+lightT*50,gs=0.006+breathe*0.006+lightT*0.025;
      var ag=ctx.createRadialGradient(cx,cy,0,cx,cy,gr);ag.addColorStop(0,"rgba(244,244,245,"+gs+")");ag.addColorStop(1,"transparent");ctx.fillStyle=ag;ctx.fillRect(0,0,W,W);
      if(isLit&&flashT<1){var fa=(1-flashT)*0.06,fr=40+flashT*120;var fg=ctx.createRadialGradient(cx,cy-8,0,cx,cy-8,fr);fg.addColorStop(0,"rgba(244,244,245,"+fa+")");fg.addColorStop(0.3,"rgba(244,244,245,"+(fa*0.15)+")");fg.addColorStop(1,"transparent");ctx.fillStyle=fg;ctx.fillRect(0,0,W,W)}
      var el=1-Math.pow(1-lightT,3);drawMark(0.035+breathe*0.015+el*0.55,sc*0.25+el*0.5);
      if(lightT<0.9){var tm=1-lightT,head=Math.floor(time)%(total+65);
        for(var ti=0;ti<60;ti++){var idx=head-ti;if(idx<0||idx>=total)continue;var pt=pts[idx];if(pt.s===-1)continue;
          var prog=1-ti/60,alpha=prog*prog*prog*tm,w=(sc*0.28)*(0.2+prog*0.8);
          if(idx>0&&pts[idx-1].s===pt.s){var pv=pts[idx-1];ctx.beginPath();ctx.moveTo(pv.x,pv.y);ctx.lineTo(pt.x,pt.y);ctx.strokeStyle="rgba(244,244,245,"+(alpha*0.85)+")";ctx.lineWidth=w;ctx.lineCap="round";ctx.stroke()}}
        if(head>=0&&head<total&&pts[head].s!==-1){var hp=pts[head],ha=tm;
          var hg=ctx.createRadialGradient(hp.x,hp.y,0,hp.x,hp.y,18);hg.addColorStop(0,"rgba(244,244,245,"+(0.12*ha)+")");hg.addColorStop(0.5,"rgba(244,244,245,"+(0.03*ha)+")");hg.addColorStop(1,"transparent");ctx.fillStyle=hg;ctx.fillRect(hp.x-18,hp.y-18,36,36);
          ctx.beginPath();ctx.arc(hp.x,hp.y,1.8,0,Math.PI*2);ctx.fillStyle="rgba(244,244,245,"+(0.9*ha)+")";ctx.fill();
          if(Math.random()>0.7){var a=Math.random()*Math.PI*2,sp=0.08+Math.random()*0.25;
            particles.push({x:hp.x+(Math.random()-0.5)*3,y:hp.y+(Math.random()-0.5)*3,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-0.08,life:1,decay:0.015+Math.random()*0.02,sz:0.3+Math.random()*0.8})}}}
      if(isLit&&!burstDone&&flashT<0.08){for(var b=0;b<3;b++){var bs=segs[Math.floor(Math.random()*4)],bt=Math.random();
        var bx=ox+(bs.x1+(bs.x2-bs.x1)*bt)*sc,by=oy+(bs.y1+(bs.y2-bs.y1)*bt)*sc,ba=Math.random()*Math.PI*2,bsp=0.15+Math.random()*0.3;
        particles.push({x:bx,y:by,vx:Math.cos(ba)*bsp,vy:Math.sin(ba)*bsp-0.15,life:1,decay:0.015+Math.random()*0.02,sz:0.3+Math.random()*0.8})}}
      if(isLit&&flashT>=0.1)burstDone=true;
      for(var pi=particles.length-1;pi>=0;pi--){var p=particles[pi];p.x+=p.vx;p.y+=p.vy;p.vy-=0.002;p.vx*=0.997;p.life-=p.decay;
        if(p.life<=0){particles.splice(pi,1);continue}var pa=p.life*p.life*0.35;
        ctx.beginPath();ctx.arc(p.x,p.y,p.sz*p.life,0,Math.PI*2);ctx.fillStyle="rgba(244,244,245,"+pa+")";ctx.fill()}
      id=requestAnimationFrame(frame)};
    id=requestAnimationFrame(frame);
    return function(){cancelAnimationFrame(id)};
  }, []);
  return <canvas ref={canvasRef} style={{width:380,height:380}} />;
}

/* ═══ LOADER ═══ */
function AlfredLoader(p){
  var [percent,setPercent] = useState(0);
  var [lit,setLit] = useState(false);
  var [ready,setReady] = useState(false);
  var [loaderDone,setLoaderDone] = useState(false);

  useEffect(function(){
    var start=null,raf;
    var duration=3000;
    var ease=function(t){
      if(t<0.5)return(t/0.5)*0.75;
      if(t<0.8)return 0.75+((t-0.5)/0.3)*0.17;
      return 0.92+((t-0.8)/0.2)*0.08;
    };
    var tick=function(ts){
      if(!start)start=ts;
      var t=Math.min((ts-start)/duration,1);
      setPercent(Math.floor(ease(t)*100));
      if(t<1){raf=requestAnimationFrame(tick)}
      else{setPercent(100);
        setTimeout(function(){setLit(true)},300);
        setTimeout(function(){setReady(true)},1000);
        setTimeout(function(){setLoaderDone(true)},2400);
        setTimeout(function(){p.onComplete()},3600);
      }
    };
    raf=requestAnimationFrame(tick);
    return function(){cancelAnimationFrame(raf)};
  },[]);

  return (
    <div style={{position:"fixed",inset:0,zIndex:99999,background:"#0A0A0B",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontWeight:300,overflow:"hidden",opacity:loaderDone?0:1,transition:"opacity 1.6s cubic-bezier(0.4,0,0.2,1)"}}>
      <style>{`
        @keyframes ldGrain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
        @keyframes ldFadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ldWordIn{from{opacity:0;letter-spacing:20px}to{opacity:0.4;letter-spacing:10px}}
        @keyframes ldDotPulse{0%,100%{opacity:0.12}50%{opacity:0.4}}
        @keyframes ldCityScroll{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}
      `}</style>

      {/* Grain */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:100,opacity:0.2,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"ldGrain 4s steps(5) infinite"}} />

      {/* Canvas */}
      <div style={{zIndex:2}}><MarkCanvas lit={lit}/></div>

      {/* Wordmark */}
      <p style={{...sf(11,300),color:"#F4F4F5",letterSpacing:10,textTransform:"uppercase",marginTop:-20,zIndex:2,animation:"ldWordIn 3s ease 0.8s both",opacity:lit?0.85:undefined,transition:"opacity 2s"}}>Alfred</p>

      {/* Percentage / Ready — crossfade */}
      <div style={{marginTop:32,zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",gap:12,animation:"ldFadeUp 1.5s ease 1s both",minHeight:60,position:"relative"}}>
        {/* Percentage counter — fades out */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,opacity:ready?0:1,transform:ready?"translateY(-8px) scale(0.96)":"translateY(0) scale(1)",transition:"opacity 1.2s ease, transform 1.2s ease",position:ready?"absolute":"relative"}}>
          <div style={{display:"flex",alignItems:"baseline",gap:2}}>
            <span style={{...sf(22,300),color:"#F4F4F5",letterSpacing:2,minWidth:40,textAlign:"right",display:"inline-block"}}>{percent}</span>
            <span style={{...sf(13,300),color:"#52525B"}}>%</span>
          </div>
          <div style={{width:100,height:1,background:"rgba(63,63,70,0.4)",borderRadius:1,overflow:"hidden",opacity:lit?0:0.5,transition:"opacity 0.8s"}}>
            <div style={{height:"100%",width:percent+"%",background:"linear-gradient(90deg,#3F3F46,#71717A)",borderRadius:1,transition:"width 0.1s linear"}} />
          </div>
        </div>
        {/* "Your concierge is ready" — fades in */}
        <p style={{...sf(13,300),color:"#A1A1AA",letterSpacing:1,opacity:ready?1:0,transform:ready?"translateY(0)":"translateY(10px)",transition:"opacity 1.4s ease 0.3s, transform 1.4s ease 0.3s",position:ready?"relative":"absolute"}}>Your concierge is ready</p>
      </div>

      {/* Dots */}
      <div style={{display:"flex",gap:5,marginTop:20,zIndex:2,animation:"ldFadeUp 1s ease 2s both",opacity:ready?0:1,transform:ready?"scale(0.8)":"scale(1)",transition:"opacity 1s ease, transform 1s ease"}}>
        {[0,1,2].map(function(i){return <div key={i} style={{width:2,height:2,borderRadius:"50%",background:"#3F3F46",animation:"ldDotPulse 1.6s ease infinite "+i*0.3+"s"}} />})}
      </div>

      {/* City carousel */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,overflow:"hidden",zIndex:2}}>
        <div style={{position:"absolute",left:0,top:0,bottom:0,width:120,background:"linear-gradient(to right,#0A0A0B,transparent)",zIndex:3,pointerEvents:"none"}} />
        <div style={{position:"absolute",right:0,top:0,bottom:0,width:120,background:"linear-gradient(to left,#0A0A0B,transparent)",zIndex:3,pointerEvents:"none"}} />
        <div style={{height:1,margin:"0 48px",background:"linear-gradient(90deg,transparent,rgba(44,44,49,0.35) 20%,rgba(44,44,49,0.35) 80%,transparent)"}} />
        <div style={{padding:"16px 0 20px",display:"flex",whiteSpace:"nowrap"}}>
          <div style={{display:"inline-flex",alignItems:"center",animation:"ldCityScroll 40s linear infinite"}}>
            {[0,1,2].map(function(rep){return(
              <span key={rep} style={{display:"inline-flex",alignItems:"center"}}>
                {LOADER_CITIES.map(function(city,ci){return(
                  <span key={rep+"-"+ci} style={{display:"inline-flex",alignItems:"center"}}>
                    <span style={{...sf(9,300),color:"#3F3F46",letterSpacing:4,textTransform:"uppercase",whiteSpace:"nowrap"}}>{city}</span>
                    <span style={{display:"inline-block",width:2,height:2,borderRadius:"50%",background:"#2C2C31",margin:"0 24px",flexShrink:0}} />
                  </span>
                )})}
              </span>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ HOMEPAGE WRAPPER ═══ */
function HomePage(){
  var [showLoader, setShowLoader] = useState(true);
  var [siteVisible, setSiteVisible] = useState(false);

  function handleLoaderComplete(){
    setShowLoader(false);
    setTimeout(function(){ setSiteVisible(true); }, 100);
  }

  return (
    <div>
      <SEOHead {...SEO.home}/>
      {showLoader && <AlfredLoader onComplete={handleLoaderComplete}/>}
      <div style={{opacity:siteVisible?1:0,transition:"opacity 1.2s ease"}}>
        <AlfredSite/>
      </div>
    </div>
  );
}

/* ═══ 404 PAGE ═══ */
function NotFoundPage(){
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif"}}>
      <SEOHead title="Page Not Found | Alfred Concierge" description="The page you're looking for doesn't exist. Explore Alfred's luxury concierge services." path="/404"/>
      <div style={{...sf(120,900),color:C.s7,letterSpacing:-4,marginBottom:8}}>404</div>
      <h1 style={{...sf(28,600),color:C.s1,marginBottom:12}}>Page not found</h1>
      <p style={{...sf(16,400),color:C.s5,marginBottom:40,textAlign:"center",maxWidth:460,lineHeight:1.6}}>The page you're looking for doesn't exist. But there's plenty to explore.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
        {[
          {label:"Browse Catalog",href:"/catalog"},
          {label:"Upcoming Events",href:"/events"},
          {label:"Read Our Blog",href:"/blog"},
          {label:"Go Home",href:"/"}
        ].map(function(l){return <a key={l.href} href={l.href} style={{...sf(14,600),color:C.bg,background:C.s1,padding:"12px 24px",borderRadius:12,textDecoration:"none",transition:"opacity 0.2s"}} onMouseEnter={function(e){e.target.style.opacity="0.85"}} onMouseLeave={function(e){e.target.style.opacity="1"}}>{l.label}</a>})}
      </div>
      <div style={{marginTop:60,textAlign:"center"}}>
        <div style={{...sf(10,600),color:C.s7,letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>Popular</div>
        {[
          {label:"Best Restaurants in Miami",href:"/blog/best-restaurants-miami-2026"},
          {label:"Monaco Grand Prix 2026 Guide",href:"/blog/monaco-grand-prix-2026-guide"},
          {label:"Exotic Car Rental Miami",href:"/catalog/exotic-cars"},
          {label:"VIP Nightlife Miami",href:"/catalog/nightlife"},
          {label:"Yacht Charter Miami",href:"/catalog/yachts"}
        ].map(function(l){return <a key={l.href} href={l.href} style={{...sf(14,400),color:C.s5,display:"block",marginBottom:10,textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>{l.label}</a>})}
      </div>
    </div>
  );
}

/* ═══ ROUTER ═══ */
export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/business" element={<AlfredPartners/>}/>
        <Route path="/catalog" element={<AlfredCatalog/>}/>
        <Route path="/catalog/exotic-cars" element={<ExoticCarsPage/>}/>
        <Route path="/catalog/exotic-cars/:slug" element={<CarDetailPage/>}/>
        <Route path="/catalog/dining" element={<DiningPage/>}/>
        <Route path="/catalog/dining/:slug" element={<DiningDetailPage/>}/>
        <Route path="/catalog/nightlife" element={<NightlifePage/>}/>
        <Route path="/catalog/nightlife/:slug" element={<NightlifeDetailPage/>}/>
        <Route path="/catalog/wellness" element={<WellnessPage/>}/>
        <Route path="/catalog/wellness/:slug" element={<WellnessDetailPage/>}/>
        <Route path="/catalog/jets" element={<JetsPage/>}/>
        <Route path="/catalog/jets/:slug" element={<JetDetailPage/>}/>
        <Route path="/catalog/yachts" element={<YachtsPage/>}/>
        <Route path="/catalog/yachts/:id" element={<YachtDetailPage/>}/>
        <Route path="/events" element={<EventsPage/>}/>
        <Route path="/events/:slug" element={<EventDetailPage/>}/>
        <Route path="/blog" element={<BlogPage/>}/>
        <Route path="/blog/:slug" element={<BlogPost/>}/>
        <Route path="/city/:slug" element={<CityPage/>}/>
        <Route path="/terms" element={<TermsPage/>}/>
        <Route path="/privacy" element={<PrivacyPage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

var COUNTRY_CODES=[
  {code:"+1",flag:"\u{1F1FA}\u{1F1F8}",name:"United States"},{code:"+44",flag:"\u{1F1EC}\u{1F1E7}",name:"United Kingdom"},{code:"+33",flag:"\u{1F1EB}\u{1F1F7}",name:"France"},
  {code:"+971",flag:"\u{1F1E6}\u{1F1EA}",name:"UAE"},{code:"+966",flag:"\u{1F1F8}\u{1F1E6}",name:"Saudi Arabia"},{code:"+41",flag:"\u{1F1E8}\u{1F1ED}",name:"Switzerland"},
  {code:"+377",flag:"\u{1F1F2}\u{1F1E8}",name:"Monaco"},{code:"+34",flag:"\u{1F1EA}\u{1F1F8}",name:"Spain"},{code:"+39",flag:"\u{1F1EE}\u{1F1F9}",name:"Italy"},
  {code:"+49",flag:"\u{1F1E9}\u{1F1EA}",name:"Germany"},{code:"+81",flag:"\u{1F1EF}\u{1F1F5}",name:"Japan"},{code:"+852",flag:"\u{1F1ED}\u{1F1F0}",name:"Hong Kong"},
  {code:"+65",flag:"\u{1F1F8}\u{1F1EC}",name:"Singapore"},{code:"+61",flag:"\u{1F1E6}\u{1F1FA}",name:"Australia"},{code:"+55",flag:"\u{1F1E7}\u{1F1F7}",name:"Brazil"},
  {code:"+52",flag:"\u{1F1F2}\u{1F1FD}",name:"Mexico"},{code:"+91",flag:"\u{1F1EE}\u{1F1F3}",name:"India"},{code:"+86",flag:"\u{1F1E8}\u{1F1F3}",name:"China"},
  {code:"+7",flag:"\u{1F1F7}\u{1F1FA}",name:"Russia"},{code:"+82",flag:"\u{1F1F0}\u{1F1F7}",name:"South Korea"},{code:"+31",flag:"\u{1F1F3}\u{1F1F1}",name:"Netherlands"},
  {code:"+46",flag:"\u{1F1F8}\u{1F1EA}",name:"Sweden"},{code:"+47",flag:"\u{1F1F3}\u{1F1F4}",name:"Norway"},{code:"+351",flag:"\u{1F1F5}\u{1F1F9}",name:"Portugal"},
  {code:"+90",flag:"\u{1F1F9}\u{1F1F7}",name:"Turkey"},{code:"+972",flag:"\u{1F1EE}\u{1F1F1}",name:"Israel"},{code:"+234",flag:"\u{1F1F3}\u{1F1EC}",name:"Nigeria"},
];

function WaitlistModal(p){
  var [formData,setFormData]=useState({name:"",whatsapp:"",email:""});
  var [countryCode,setCountryCode]=useState("+1");
  var [showCodes,setShowCodes]=useState(false);
  var [formSent,setFormSent]=useState(false);
  var [formLoading,setFormLoading]=useState(false);
  function submitWaitlist(){
    if(!formData.name.trim()||!formData.whatsapp.trim())return;
    setFormLoading(true);
    fetch("https://a.klaviyo.com/client/subscriptions/?company_id=RcviU7",{
      method:"POST",headers:{"Content-Type":"application/json","revision":"2024-02-15"},
      body:JSON.stringify({data:{type:"subscription",attributes:{custom_source:"Alfred Waitlist",profile:{data:{type:"profile",attributes:{first_name:formData.name,phone_number:countryCode+formData.whatsapp.replace(/\D/g,""),email:formData.email||undefined,properties:{waitlist:true,source:"website"}}}}},relationships:{list:{data:{type:"list",id:"WeK9YR"}}}}})
    }).catch(function(e){console.log("Klaviyo error:",e)}).finally(function(){setFormLoading(false);setFormSent(true)});
  }
  if(!p.open)return null;
  return(
    <div onClick={function(){p.onClose()}} style={{position:"fixed",inset:0,zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"modalBgIn 0.3s ease both"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(12px)"}}/>
      <div onClick={function(e){e.stopPropagation()}} style={{width:420,maxWidth:"100%",borderRadius:24,background:C.el,border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 40px 120px rgba(0,0,0,0.6)",position:"relative",overflow:"hidden",animation:"modalIn 0.5s cubic-bezier(0.16,1,0.3,1) both"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
        <div onClick={function(){p.onClose()}} style={{position:"absolute",top:16,right:16,width:32,height:32,borderRadius:10,background:"rgba(244,244,245,0.06)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.3s",zIndex:2}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(244,244,245,0.06)"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </div>
        {!formSent?(
          <div style={{padding:"40px 32px 36px"}}>
            <div style={{marginBottom:24}}><DrawMark size={20} color={C.s5} active={true} delay={0} id="wl"/></div>
            <h3 style={{...sf(24,700),letterSpacing:-0.5,marginBottom:6}}>Join the waitlist</h3>
            <p style={{...sf(13,400),color:C.s5,lineHeight:1.6,marginBottom:32}}>Get early access to Alfred. We'll reach out on WhatsApp when it's your turn.</p>
            <div style={{marginBottom:16}}>
              <label style={{...sf(10,500),color:C.s6,letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:8}}>Name</label>
              <input value={formData.name} onChange={function(e){setFormData({...formData,name:e.target.value})}} placeholder="Your name" style={{width:"100%",padding:"14px 16px",borderRadius:12,background:C.bg,border:"1px solid "+C.bd,color:C.s1,...sf(14,400),outline:"none",transition:"border-color 0.3s"}} onFocus={function(e){e.target.style.borderColor=C.s5}} onBlur={function(e){e.target.style.borderColor=C.bd}}/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{...sf(10,500),color:C.s6,letterSpacing:2,textTransform:"uppercase",display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span>WhatsApp</span>
              </label>
              <div style={{display:"flex",gap:8}}>
                <div style={{position:"relative",flexShrink:0}}>
                  <div onClick={function(){setShowCodes(!showCodes)}} style={{display:"flex",alignItems:"center",gap:6,padding:"14px 12px",borderRadius:12,background:C.bg,border:"1px solid "+C.bd,cursor:"pointer",transition:"border-color 0.3s",minWidth:90}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5}} onMouseLeave={function(e){if(!showCodes)e.currentTarget.style.borderColor=C.bd}}>
                    <span style={{fontSize:16}}>{(COUNTRY_CODES.find(function(c){return c.code===countryCode})||{}).flag}</span>
                    <span style={{...sf(14,500),color:C.s1}}>{countryCode}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2" strokeLinecap="round" style={{marginLeft:"auto",transform:showCodes?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                  {showCodes&&(
                    <div className="code-list" style={{position:"absolute",top:"calc(100% + 4px)",left:0,width:240,maxHeight:240,overflowY:"auto",borderRadius:14,background:C.el,border:"1px solid "+C.bd,boxShadow:"0 20px 60px rgba(0,0,0,0.5)",zIndex:20,padding:"6px"}}>
                      {COUNTRY_CODES.map(function(c){return(
                        <div key={c.code} onClick={function(){setCountryCode(c.code);setShowCodes(false)}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,cursor:"pointer",transition:"background 0.2s",...sf(13,400),color:c.code===countryCode?C.s1:C.s4}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(244,244,245,0.06)"}} onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}>
                          <span style={{fontSize:16}}>{c.flag}</span>
                          <span style={{...sf(13,500),color:C.s1}}>{c.name}</span>
                          <span style={{...sf(12,400),color:C.s5,marginLeft:"auto"}}>{c.code}</span>
                        </div>
                      )})}
                    </div>
                  )}
                </div>
                <input value={formData.whatsapp} onChange={function(e){setFormData({...formData,whatsapp:e.target.value})}} placeholder="305 555 0000" type="tel" style={{flex:1,padding:"14px 16px",borderRadius:12,background:C.bg,border:"1px solid "+C.bd,color:C.s1,...sf(14,400),outline:"none",transition:"border-color 0.3s"}} onFocus={function(e){e.target.style.borderColor=C.s5}} onBlur={function(e){e.target.style.borderColor=C.bd}}/>
              </div>
            </div>
            <div style={{marginBottom:28}}>
              <label style={{...sf(10,500),color:C.s6,letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:8}}>Email <span style={{color:C.s7,fontWeight:400,letterSpacing:0,textTransform:"none"}}>(optional)</span></label>
              <input value={formData.email} onChange={function(e){setFormData({...formData,email:e.target.value})}} placeholder="you@email.com" type="email" style={{width:"100%",padding:"14px 16px",borderRadius:12,background:C.bg,border:"1px solid "+C.bd,color:C.s1,...sf(14,400),outline:"none",transition:"border-color 0.3s"}} onFocus={function(e){e.target.style.borderColor=C.s5}} onBlur={function(e){e.target.style.borderColor=C.bd}}/>
            </div>
            <div onClick={submitWaitlist} style={{width:"100%",padding:"16px",borderRadius:14,background:(!formData.name.trim()||!formData.whatsapp.trim())?C.bd:C.s1,cursor:(!formData.name.trim()||!formData.whatsapp.trim())?"not-allowed":"pointer",textAlign:"center",...sf(14,700),color:(!formData.name.trim()||!formData.whatsapp.trim())?C.s6:C.bg,transition:"all 0.3s",opacity:formLoading?0.6:1}}>
              {formLoading?"Joining...":"Get Early Access"}
            </div>
            <p style={{...sf(11,400),color:C.s7,textAlign:"center",marginTop:16,lineHeight:1.5}}>Your concierge will message you on WhatsApp within 24 hours.</p>
          </div>
        ):(
          <div style={{padding:"56px 32px 48px",textAlign:"center"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(52,199,89,0.1)",border:"1.5px solid rgba(52,199,89,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{strokeDasharray:24,animation:"checkDraw 0.5s ease 0.2s both"}}><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h3 style={{...sf(24,700),letterSpacing:-0.5,marginBottom:8}}>You're on the list</h3>
            <p style={{...sf(14,400),color:C.s5,lineHeight:1.6,marginBottom:8}}>Welcome, {formData.name}.</p>
            <p style={{...sf(13,400),color:C.s6,lineHeight:1.6}}>A concierge will reach out to you on WhatsApp shortly. In the meantime, keep scrolling.</p>
            <div onClick={function(){p.onClose()}} style={{display:"inline-block",marginTop:28,padding:"14px 32px",borderRadius:14,background:"rgba(244,244,245,0.06)",border:"1px solid rgba(244,244,245,0.1)",cursor:"pointer",...sf(13,600),color:C.s1,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(244,244,245,0.06)"}}>
              Continue Exploring
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AlfredSite(){
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
  var [annual,setAnnual]=useState(false);
  var [modalCat,setModalCat]=useState(null);
  var [showWaitlist,setShowWaitlist]=useState(false);
  var [mobileMenu,setMobileMenu]=useState(false);

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
    {n:"Hôtel de Crillon",sub:"Palace · Paris",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/AlfedHotelCrillionParis.jpeg",tag:"5.0"},
    {n:"Four Seasons",sub:"Hotel · Miami",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/MFL_1008_original.jpg",tag:"4.9"},
    {n:"Space",sub:"Nightclub · Miami",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/image.jpg",tag:"4.8"},
    {n:"Zuma",sub:"Restaurant · Mykonos",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/zuma-mykonos.jpg",tag:"4.9"},
    {n:"Bvlgari Resort",sub:"Hotel · Bali",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/Bulgari-Resort-Bali-Exterior.webp",tag:"5.0"},
    {n:"F1 Experience",sub:"VIP · Global",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/DPPI_00124009_1978.jpg",tag:"4.9"},
    {n:"Carbone",sub:"Italian · Miami",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/Carbone-Miami---Photo-Credit---Douglas-Friedman_Carbone-Miami-Dining-Room-4---PC-Douglas-Friedman.webp",tag:"4.9"},
    {n:"Nao Beach",sub:"Beach Club · St. Barths",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/1-st-barts-nao-beach-restaurant-st-jean-st-barth.jpg",tag:"4.8"},
    {n:"Bugatti Chiron",sub:"Exotic Car · Miami",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/_%20(78).jpeg",tag:"5.0"},
  ];



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
    {title:"Dining",count:"200+ restaurants",tag:"Most Popular",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/4497bfb501ea6d06db22e718479b90b4.jpg"},
    {title:"Nightlife",count:"23 exclusive venues",tag:"Members Only",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/Keinmusik.jpeg"},
    {title:"Wellness",count:"120+ wellness partners",tag:"Popular",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/_%20(76).jpeg"},
    {title:"Exotic Cars",count:"45+ vehicles",tag:"On Demand",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/Aston%20Martin.jpeg"},
    {title:"Jets",count:"Global fleet access",tag:"Ultra Premium",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/_%20(75).jpeg"},
    {title:"Yachts",count:"Charter & day trips",tag:"Exclusive",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/_%20(83).jpeg"},
  ];



  var SILVER="#A0AEC0",SILVER_G="linear-gradient(135deg,#718096,#A0AEC0,#CBD5E0,#A0AEC0)";
  var GOLD="#D4A853",GOLD_G="linear-gradient(135deg,#92713A,#D4A853,#F0D78C,#D4A853)";
  var PLAT="#D1D5DB",PLAT_G="linear-gradient(135deg,#9CA3AF,#D1D5DB,#F3F4F6,#D1D5DB)";

  var appSvg = "M20.07 22.67c-.46 1.06-.68 1.54-1.27 2.48-.83 1.31-2 2.95-3.45 2.96-1.29.02-1.62-.84-3.37-.83-1.75.01-2.11.85-3.4.83-1.45-.02-2.55-1.5-3.38-2.81C3.12 21.82 2.78 17.82 4.13 15.72c.96-1.5 2.47-2.38 4.07-2.38 1.51 0 2.46.85 3.71.85 1.22 0 1.96-.85 3.71-.85 1.42 0 2.77.77 3.73 2.1-3.28 1.8-2.75 6.49.72 7.73zM15.1 4.26c.65-.84 1.14-2.02.96-3.26-1.06.07-2.3.75-3.03 1.63-.66.8-1.2 1.99-1 3.15 1.16.04 2.36-.65 3.07-1.52z";

  var divider = {position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,#2C2C31 30%,#2C2C31 70%,transparent)"};

  return(
    <div lang="en" style={{width:"100%",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      {/* ═══ SEO: Meta Tags ═══ */}
      <title>Alfred Concierge — Luxury Concierge App for Miami & Paris | Restaurants, Nightlife, Wellness</title>
      <meta name="description" content="Alfred is the luxury concierge app for Miami and Paris. Book Michelin-starred restaurants, VIP nightlife, wellness spas, private chefs, luxury cars, yachts and jets. Real human concierge, 24/7. Download on iOS."/>
      <meta name="keywords" content="luxury concierge app, Miami concierge, Paris concierge, restaurant reservations Miami, best restaurants Miami, best restaurants Paris, VIP nightlife Miami, nightclub VIP tables, wellness spa booking, private chef Miami, luxury car rental, yacht charter, private jet booking, Carbone Miami, LIV Miami, Le Cinq Paris, concierge service, Alfred app"/>
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <link rel="canonical" href="https://alfredconcierge.app"/>
      <meta name="author" content="Alfred Concierge"/>
      <meta name="theme-color" content="#0A0A0B"/>

      {/* Open Graph */}
      <meta property="og:type" content="website"/>
      <meta property="og:title" content="Alfred — Luxury Concierge App for Miami & Paris"/>
      <meta property="og:description" content="Book the best restaurants, nightlife, wellness, private chefs, luxury cars, yachts and jets through one app. Real human concierge available 24/7."/>
      <meta property="og:url" content="https://alfredconcierge.app"/>
      <meta property="og:site_name" content="Alfred Concierge"/>
      <meta property="og:image" content="https://alfredconcierge.app/og-image.jpg"/>
      <meta property="og:image:width" content="1200"/>
      <meta property="og:image:height" content="630"/>
      <meta property="og:locale" content="en_US"/>

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content="Alfred — Luxury Concierge App"/>
      <meta name="twitter:description" content="Restaurants, nightlife, wellness, private chefs, luxury cars, yachts & jets. One app. Miami & Paris."/>
      <meta name="twitter:image" content="https://alfredconcierge.app/og-image.jpg"/>
      <meta name="twitter:site" content="@alfredconcierge"/>

      {/* Apple Smart Banner */}
      <meta name="apple-itunes-app" content="app-id=YOURAPPID"/>

      {/* ═══ SEO: Structured Data ═══ */}
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
@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes modalBgIn{from{opacity:0}to{opacity:1}}
@keyframes checkDraw{from{stroke-dashoffset:24}to{stroke-dashoffset:0}}
.code-list::-webkit-scrollbar{width:4px}.code-list::-webkit-scrollbar-track{background:transparent}.code-list::-webkit-scrollbar-thumb{background:#3F3F46;border-radius:2px}
@keyframes slideFromLeft{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideFromRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideFromBottom{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.hide-sb::-webkit-scrollbar{display:none}.hide-sb{-ms-overflow-style:none;scrollbar-width:none}
input::placeholder{color:#52525B}input:focus{outline:none}

/* ── Hero ── */
.hero-title{font-size:160px!important;letter-spacing:8px!important}
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

/* ── Venue scroll ── */
.venue-scroll::-webkit-scrollbar{display:none}

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
  .hero-title{font-size:110px!important;letter-spacing:5px!important}
  .sec-head{font-size:38px!important}
  .sec-sub{font-size:36px!important}
  .exp-grid{grid-template-columns:repeat(2,1fr)!important;padding:0 28px!important}
  .stats-grid{grid-template-columns:repeat(2,1fr)!important}
  .tiers-row{flex-direction:column!important;max-width:420px!important;margin-left:auto!important;margin-right:auto!important;padding:0 28px!important}
  .noir-bar{padding:28px 24px 24px!important}
  .noir-wrap{padding:0 28px!important;max-width:420px!important;margin-left:auto!important;margin-right:auto!important}
  .noir-perks{grid-template-columns:1fr 1fr!important}
  .footer-grid{grid-template-columns:1fr 1fr!important;gap:40px 32px!important}
  .footer-alfred{font-size:180px!important;letter-spacing:-8px!important}
  .step-wrap{padding:0 28px!important}
  .step-line{left:51px!important}
  .test-card{padding:36px 28px!important}
}

/* ═══════ MOBILE ≤ 640px ═══════ */
@media(max-width:640px){
  .hero-title{font-size:14vw!important;letter-spacing:0.5px!important}
  .hero-nav{display:none!important}
  .mob-menu-btn{display:flex!important}
  .hero-corner{display:none!important}
  .hero-scroll-l,.hero-scroll-r{display:none!important}
  .hero-tagline{font-size:13px!important;max-width:280px!important;margin-top:24px!important}
  .hero-label{font-size:9px!important;letter-spacing:3px!important}
  .hero-cta{margin-top:36px!important}
  .sec-head{font-size:28px!important;letter-spacing:-1px!important}
  .sec-sub{font-size:28px!important;letter-spacing:-1px!important}
  .exp-grid{grid-template-columns:1fr 1fr!important;padding:0 16px!important;gap:10px!important;max-width:100%!important}
  .card-title{font-size:14px!important}
  .card-sub{font-size:10px!important}
  .card-explore{font-size:9px!important;padding:4px 8px!important}
  .card-tag{font-size:7px!important;padding:3px 6px!important;top:10px!important;left:10px!important}
  .card-bottom{padding:0 10px 12px!important}
  .card-row{height:22px!important}
  .stats-grid{grid-template-columns:repeat(2,1fr)!important}
  .stat-cell{padding:28px 16px!important}
  .stat-num{font-size:36px!important}
  .trust-row{flex-direction:column!important;gap:16px!important}
  .tiers-row{padding:0 20px!important;max-width:400px!important;flex-direction:column!important}
  .noir-bar{padding:24px 20px 20px!important}
  .noir-wrap{padding:0 20px!important;max-width:400px!important;margin-left:auto!important;margin-right:auto!important}
  .noir-perks{grid-template-columns:1fr!important}
  .noir-bottom{flex-direction:column!important;gap:16px!important;align-items:flex-start!important}
  .noir-invite{display:none!important}
  .noir-header{flex-direction:column!important;gap:12px!important}
  .footer-grid{grid-template-columns:1fr!important;gap:36px!important;padding:48px 20px 40px!important}
  .footer-alfred{font-size:56px!important;letter-spacing:-2px!important}
  .step-wrap{padding:0 20px!important}
  .step-line{left:43px!important}
  .step-item{gap:24px!important}
  .test-card{padding:28px 20px!important;border-radius:18px!important}
  .test-quote{font-size:17px!important}
  .modal-inner{width:calc(100vw - 32px)!important;max-height:90vh!important;border-radius:20px!important}
  .cta-section{padding:80px 0 100px!important}
  .cta-heading{font-size:36px!important}
  .section-pad{padding-left:20px!important;padding-right:20px!important}
}

/* ═══════ SMALL PHONE ≤ 390px ═══════ */
@media(max-width:390px){
  .hero-title{font-size:14vw!important;letter-spacing:0px!important}
  .hero-tagline{font-size:12px!important;max-width:240px!important}
  .sec-head{font-size:24px!important}
  .sec-sub{font-size:24px!important}
  .exp-grid{grid-template-columns:1fr!important;max-width:300px!important;margin-left:auto!important;margin-right:auto!important}
  .card-title{font-size:18px!important}
  .step-line{left:43px!important}
  .step-item{gap:20px!important}
  .stats-grid{grid-template-columns:1fr 1fr!important}
  .stat-cell{padding:24px 12px!important}
  .stat-num{font-size:32px!important}
  .footer-alfred{font-size:42px!important;letter-spacing:-1px!important}
  .tiers-row{max-width:100%!important}
  .noir-bar{padding:20px 16px 16px!important}
  .noir-wrap{padding:0 12px!important;max-width:100%!important}
  .noir-header{flex-direction:column!important;gap:10px!important}
  .cta-heading{font-size:30px!important}
}`}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      {/* ═══ HERO ═══ */}
      <section aria-label="Hero" style={{height:"100vh",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{position:"absolute",left:(mouse.x*100)+"%",top:(mouse.y*100)+"%",width:600,height:600,marginLeft:-300,marginTop:-300,borderRadius:"50%",background:"radial-gradient(circle,rgba(244,244,245,0.025) 0%,transparent 60%)",pointerEvents:"none",transition:"left 0.8s cubic-bezier(0.16,1,0.3,1),top 0.8s cubic-bezier(0.16,1,0.3,1)",zIndex:1}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",width:"70%",height:1,marginLeft:"-35%",marginTop:-80,background:"linear-gradient(90deg,transparent,#1F1F23 30%,#1F1F23 70%,transparent)",transformOrigin:"center",animation:loaded?"lineGrow 1.4s cubic-bezier(0.16,1,0.3,1) 0.6s both":"none",zIndex:2}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",width:"70%",height:1,marginLeft:"-35%",marginTop:80,background:"linear-gradient(90deg,transparent,#1F1F23 30%,#1F1F23 70%,transparent)",transformOrigin:"center",animation:loaded?"lineGrow 1.4s cubic-bezier(0.16,1,0.3,1) 0.8s both":"none",zIndex:2}}/>
        <div style={{position:"absolute",top:32,left:40,zIndex:10,animation:loaded?"slideFromLeft 1s cubic-bezier(0.16,1,0.3,1) 0.3s both":"none"}}><DrawMark size={22} color={C.s1} active={loaded} delay={0.5} id="mg1"/></div>
        <nav className="hero-nav" style={{position:"absolute",top:36,right:40,zIndex:10,display:"flex",alignItems:"center",gap:28,animation:loaded?"slideFromRight 1s cubic-bezier(0.16,1,0.3,1) 0.4s both":"none"}}>{["Events","Membership","Catalog","Business","Contact"].map(function(item){var href=item==="Business"?"/business":item==="Catalog"?"/catalog":item==="Events"?"/events":item==="Contact"?"https://wa.me/447449562204":"#"+item.toLowerCase();return <a key={item} href={href} target={item==="Contact"?"_blank":undefined} rel={item==="Contact"?"noopener":undefined} style={{...sf(11,400),color:C.s6,letterSpacing:0.3,cursor:"pointer",transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>{item}</a>})}</nav>
        {/* Mobile hamburger button */}
        <div className="mob-menu-btn" onClick={function(){setMobileMenu(true)}} style={{position:"absolute",top:32,right:20,zIndex:110,display:"none",alignItems:"center",justifyContent:"center",width:44,height:44,borderRadius:12,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",animation:loaded?"slideFromRight 1s cubic-bezier(0.16,1,0.3,1) 0.4s both":"none"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
        </div>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:5}}>
          <div style={{textAlign:"center",transform:"translateY("+(heroY+my)+"px) translateX("+mx+"px) scale("+heroScale+")",opacity:heroOp,filter:"blur("+heroBlur+"px)",willChange:"transform,opacity,filter",transition:"transform 0.5s cubic-bezier(0.16,1,0.3,1)"}}>
            <p className="hero-label" style={{...sf(10,400),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:28,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s"}}>Luxury Concierge</p>
            <div style={{overflow:"hidden",lineHeight:0.88,position:"relative",whiteSpace:"nowrap"}}>
              {LETTERS.map(function(ch,i){return <span key={i} className="hero-title" style={{display:"inline-block",...sf(160,700),letterSpacing:8,opacity:loaded?1:0,transform:loaded?"translateY(0) scale(1)":"translateY(100%) scale(0.9)",transition:"transform 1.1s cubic-bezier(0.16,1,0.3,1) "+(0.7+i*0.07)+"s, opacity 0.6s ease "+(0.7+i*0.07)+"s"}}>{ch}</span>})}
              {shimmer && <div style={{position:"absolute",top:0,bottom:0,width:"25%",background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.08) 50%,transparent)",animation:"shimmerSweep 1.2s cubic-bezier(0.16,1,0.3,1) forwards",pointerEvents:"none"}}/>}
            </div>
            <CityCarousel loaded={loaded}/>
            <p className="hero-tagline" style={{...sf(15,400),color:C.s6,lineHeight:1.7,maxWidth:360,margin:"36px auto 0"}}>{tagWords.map(function(word,i){return <span key={i} style={{display:"inline-block",marginRight:4,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(10px)",transition:"all 0.6s cubic-bezier(0.16,1,0.3,1) "+(1.6+i*0.03)+"s"}}>{word}</span>})}</p>
            <div className="hero-cta" style={{marginTop:48,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(20px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 2.2s"}}>
              <div onClick={function(){setShowWaitlist(true)}} style={{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 28px",borderRadius:14,background:hoverCta?C.s1:C.el,border:"1px solid "+(hoverCta?C.s1:C.bd),cursor:"pointer",transform:hoverCta?"translateY(-2px)":"translateY(0)",boxShadow:hoverCta?"0 8px 30px rgba(244,244,245,0.1)":"none",transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",...sf(14,600),color:hoverCta?C.bg:C.s1}} onMouseEnter={function(){setHoverCta(true)}} onMouseLeave={function(){setHoverCta(false)}}>
                <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                Download on the App Store
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-l" style={{position:"absolute",bottom:36,left:40,zIndex:10,animation:loaded?"slideFromBottom 1s cubic-bezier(0.16,1,0.3,1) 2.4s both":"none"}}><span style={{...sf(9,400),color:C.s7,letterSpacing:2,textTransform:"uppercase",writingMode:"vertical-lr",transform:"rotate(180deg)"}}>Scroll</span></div>
        <div className="hero-scroll-r" style={{position:"absolute",bottom:36,right:40,zIndex:10,animation:loaded?"slideFromBottom 1s cubic-bezier(0.16,1,0.3,1) 2.5s both":"none"}}><span style={{...sf(9,400),color:C.s7,letterSpacing:2,textTransform:"uppercase",writingMode:"vertical-lr"}}>©2026</span></div>
      </section>

      {/* ═══ MOBILE MENU OVERLAY ═══ */}
      {mobileMenu&&<div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(5,5,6,0.98)",backdropFilter:"blur(60px) saturate(1.5)",display:"flex",flexDirection:"column",animation:"menuSlideIn 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
        <style>{`
@keyframes menuSlideIn{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
@keyframes menuSlideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(100%)}}
@keyframes menuItemIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes menuFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        `}</style>
        {/* Top bar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"28px 24px"}}>
          <PMark size={22} color={C.s1} style={{opacity:0,animation:"menuFadeUp 0.5s ease 0.2s forwards"}}/>
          <div onClick={function(){setMobileMenu(false)}} style={{width:44,height:44,borderRadius:14,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.3s"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="1.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </div>
        </div>
        {/* Links */}
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 36px"}}>
          {[{label:"Events",href:"/events"},{label:"Membership",href:"/#membership"},{label:"Catalog",href:"/catalog"},{label:"Business",href:"/business"},{label:"Contact",href:"https://wa.me/447449562204",ext:true}].map(function(item,i){
            return <a key={item.label} href={item.href} target={item.ext?"_blank":undefined} rel={item.ext?"noopener":undefined} onClick={function(){setMobileMenu(false)}} style={{...sf(36,300),color:C.s2,letterSpacing:-0.5,textDecoration:"none",padding:"18px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"space-between",opacity:0,animation:"menuItemIn 0.5s cubic-bezier(0.16,1,0.3,1) "+(0.15+i*0.07)+"s forwards"}}>
              <span>{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          })}
        </div>
        {/* Bottom CTA */}
        <div style={{padding:"0 36px 48px",opacity:0,animation:"menuFadeUp 0.5s ease 0.6s forwards"}}>
          <div onClick={function(){setMobileMenu(false);setShowWaitlist(true)}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"18px 0",borderRadius:16,background:C.s1,...sf(15,600),color:C.bg,cursor:"pointer",width:"100%",transition:"transform 0.3s"}}>
            <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
            Download on the App Store
          </div>
          <p style={{...sf(11,400),color:C.s7,textAlign:"center",marginTop:16,letterSpacing:0.5}}>Miami · Paris · Dubai · London</p>
        </div>
      </div>}

      {/* ═══ FEATURED EVENTS ═══ */}
      <FeaturedEvents/>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={stepsRef} aria-label="How it works" style={{padding:"140px 0 120px",position:"relative"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto 80px"}}><p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:stepsVis?1:0,transition:"all 0.8s ease"}}>How it works</p><h2 className="sec-sub" style={{...sf(44,600),letterSpacing:-1.5,lineHeight:1.1,opacity:stepsVis?1:0,transform:stepsVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Three steps to<br/>everything.</h2></div>
        <div className="step-wrap" style={{maxWidth:560,margin:"0 auto",position:"relative",padding:"0 40px"}}><div className="step-line" style={{position:"absolute",top:24,bottom:80,left:63,width:1,background:"#1F1F23"}}><div style={{width:"100%",height:(stepsProgress*100)+"%",background:"linear-gradient(180deg,#3F3F46,#2C2C31)",transition:"height 0.1s linear"}}/></div>
          <Step num="1" title="Tell Alfred" icon="💬" desc="Type what you want in plain language. A table for tonight, a yacht this weekend, a private chef for Saturday — anything." detail="Alfred checks it · responds in seconds" vis={stepsVis} delay={0.3}/>
          <Step num="2" title="We handle it" icon="⚡" desc="Your request goes straight to a real human concierge who finds the best options, makes the calls, and confirms everything — no bots, no waiting." detail="100% human · always available" vis={stepsVis} delay={0.55}/>
          <Step num="3" title="Show up" icon="✦" desc="Get your confirmation, show up, enjoy. No calls, no back-and-forth, no hassle. That's it." detail="One tap · done" vis={stepsVis} delay={0.8}/>
        </div>
      </section>

      {/* ═══ CATEGORIES — 2×3 GRID ═══ */}
      <section ref={showRef} aria-label="Categories" style={{padding:"140px 0 140px",position:"relative"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto",marginBottom:64}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:16,opacity:showVis?1:0,transition:"all 0.8s ease"}}>The App</p>
          <h2 className="sec-head" style={{...sf(48,600),letterSpacing:-1.5,lineHeight:1.08,opacity:showVis?1:0,transform:showVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>One app. Every<br/>experience.</h2>
        </div>

        <div className="exp-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,maxWidth:960,margin:"0 auto",padding:"0 40px",opacity:showVis?1:0,transform:showVis?"translateY(0)":"translateY(20px)",transition:"all 1s ease 0.3s"}}>
          {exps.map(function(e,i){
            var routes={"Dining":"/catalog/dining","Nightlife":"/catalog/nightlife","Wellness":"/catalog/wellness","Exotic Cars":"/catalog/exotic-cars","Jets":"/catalog/jets","Yachts":"/catalog/yachts"};
            return <GridCard key={e.title} title={e.title} count={e.count} tag={e.tag} img={e.img} delay={0.1*i} onClick={function(){if(routes[e.title]){window.location.href=routes[e.title]}else{setModalCat(e.title)}}}/>;
          })}
        </div>

        <div style={{display:"flex",justifyContent:"center",marginTop:56}}>
          <a href="/catalog" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 28px",borderRadius:14,background:C.el,border:"1px solid "+C.bd,cursor:"pointer",...sf(13,600),color:C.s1,transition:"all 0.3s",textDecoration:"none",opacity:showVis?1:0}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.transform="translateY(0)"}}>
            View Full Catalog
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>
          </a>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section ref={statsRef} aria-label="Statistics" style={{padding:"140px 0 160px",position:"relative"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",marginBottom:80}}><p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:statsVis?1:0,transition:"all 0.8s ease"}}>By the numbers</p><h2 className="sec-head" style={{...sf(48,600),letterSpacing:-1.5,lineHeight:1.08,opacity:statsVis?1:0,transform:statsVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Built to exceed<br/>every expectation.</h2></div>
        <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,maxWidth:880,margin:"0 auto",background:C.bd,borderRadius:20,overflow:"hidden",opacity:statsVis?1:0,transform:statsVis?"translateY(0)":"translateY(24px)",transition:"all 1s ease 0.3s"}}>{[{n:200,s:"+",l:"Curated Venues",sb:"Restaurants, clubs & bars",c:"#818CF8"},{n:120,s:"+",l:"Wellness Partners",sb:"Spas, trainers & retreats",c:"#34D399"},{px:"< ",n:2,s:" min",l:"Response Time",sb:"Average concierge reply",c:"#F472B6"},{n:24,s:"/7",l:"Concierge",sb:"Real humans, always on",c:"#FBBF24"}].map(function(stat,i){return <div key={i} className="stat-cell" style={{background:C.bg,padding:"44px 28px",textAlign:"center"}}><div className="stat-num" style={{...sf(48,600),color:stat.c,marginBottom:8,lineHeight:1,whiteSpace:"nowrap"}}>{stat.px||""}<AnimCounter end={stat.n} suffix={stat.s} duration={1800} active={statsVis}/></div><div style={{...sf(14,600),color:C.s2,marginBottom:4}}>{stat.l}</div><div style={{...sf(12,400),color:C.s6}}>{stat.sb}</div></div>})}</div>
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
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <div style={{...sf(14,600),color:C.s3}}>Bruce Wayne</div>
              <div style={{...sf(12,400),color:C.s6}}>· Founding Member · Miami</div>
            </div>
          </div>
        </div>
        <div className="trust-row" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:40,marginTop:72,opacity:statsVis?1:0,transition:"all 0.8s ease 0.8s"}}>{["End-to-end encrypted","Invite-only beta","No ads, ever"].map(function(t,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:8}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke={C.gn} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span style={{...sf(12,400),color:C.s5}}>{t}</span></div>})}</div>
      </section>

      {/* ═══ MEMBERSHIP — THREE TIERS ═══ */}
      <section ref={tiersRef} aria-label="Membership" id="membership" style={{padding:"140px 0 160px",position:"relative"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:520,margin:"0 auto",marginBottom:60}}><p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:tiersVis?1:0,transition:"all 0.8s ease"}}>Membership</p><h2 className="sec-head" style={{...sf(48,600),letterSpacing:-1.5,lineHeight:1.08,marginBottom:16,opacity:tiersVis?1:0,transform:tiersVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Choose your<br/>level of access.</h2><p style={{...sf(16,400),color:C.s5,opacity:tiersVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Three tiers. One concierge. Every door open.</p></div>

        <div className="tiers-row" style={{display:"flex",gap:16,maxWidth:1060,margin:"0 auto",padding:"0 40px",alignItems:"stretch",opacity:tiersVis?1:0,transform:tiersVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.4s"}}>

          {/* ── ALFRED GOLD ── */}
          <div style={{flex:1,borderRadius:24,background:C.el,border:"1px solid "+C.bd,padding:"36px 28px",display:"flex",flexDirection:"column",transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
            <div style={{...sf(10,600),color:C.s6,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Entry</div>
            <div style={{...sf(24,700),color:C.s1,marginBottom:4}}>Alfred Gold</div>
            <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:20}}>
              <span style={{...sf(36,700),color:C.s1}}>$9.99</span>
              <span style={{...sf(14),color:C.s6}}>/month</span>
            </div>
            <div style={{height:0.5,background:C.bd,marginBottom:20}}/>
            {["Full access to the Alfred app","AI concierge chat agent","Restaurant discovery & recommendations","Bookings via Resy, OpenTable & SevenRooms","Global venue catalog","Event discovery"].map(function(f,i){
              return <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:14}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2" strokeLinecap="round" style={{marginTop:2,flexShrink:0}}><path d="M20 6L9 17l-5-5"/></svg>
                <span style={{...sf(13),color:C.s4,lineHeight:1.5}}>{f}</span>
              </div>
            })}
            <div style={{flex:1}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"14px 0",borderRadius:14,border:"1px solid "+C.bd,cursor:"pointer",...sf(14,600),color:C.s1,marginTop:24,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(244,244,245,0.06)";e.currentTarget.style.borderColor=C.s5}} onMouseLeave={function(e){e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=C.bd}}>
              Get Alfred Gold
            </div>
          </div>

          {/* ── ALFRED PLATINUM ── */}
          <div style={{flex:1,borderRadius:24,background:C.el,border:"1.5px solid rgba(244,244,245,0.15)",padding:"36px 28px",display:"flex",flexDirection:"column",position:"relative",transform:"translateY(-8px)",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
            <div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",padding:"5px 16px",borderRadius:"0 0 12px 12px",background:C.s1,...sf(10,700),color:C.bg,letterSpacing:1}}>MOST POPULAR</div>
            <div style={{...sf(10,600),color:C.s4,letterSpacing:2,textTransform:"uppercase",marginBottom:12,marginTop:8}}>Recommended</div>
            <div style={{...sf(24,700),color:C.s1,marginBottom:4}}>Alfred Platinum</div>
            <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:20}}>
              <span style={{...sf(36,700),color:C.s1}}>$99</span>
              <span style={{...sf(14),color:C.s6}}>/month</span>
            </div>
            <div style={{height:0.5,background:C.bd,marginBottom:16}}/>
            <div style={{...sf(12,500),color:C.s3,marginBottom:16}}>Everything in Gold, plus:</div>
            {["Skip the line — outside & check-in desk","Strategic table placement","Reduced minimum spend on alcohol & food","Waived advance payment requirement","VIP flag in venue system — upgrade eligibility","Most experienced waiter & bottle girl","Waived valet","Waived 15-min grace period","Custom bottle parade & shoutouts","Music request selection","VIP host at your table all night","Guest companions on request","Exclusive event access","Concierge consultancy & advice"].map(function(f,i){
              return <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="2" strokeLinecap="round" style={{marginTop:2,flexShrink:0}}><path d="M20 6L9 17l-5-5"/></svg>
                <span style={{...sf(13),color:C.s3,lineHeight:1.5}}>{f}</span>
              </div>
            })}
            <div style={{flex:1}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"14px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,marginTop:24,transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
              Get Alfred Platinum
            </div>
          </div>

          {/* ── ALFRED CENTURION ── */}
          <div style={{flex:1,borderRadius:24,padding:"36px 28px",display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",background:"linear-gradient(180deg,#0E0E11,#080809)",border:"1px solid rgba(244,244,245,0.06)",transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor="rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor="rgba(244,244,245,0.06)"}}>
            <div style={{position:"absolute",inset:0,pointerEvents:"none",background:"linear-gradient(105deg, transparent 20%, rgba(244,244,245,0.02) 40%, rgba(244,244,245,0.01) 60%, transparent 80%)",backgroundSize:"250% 100%"}}/>
            <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{...sf(10,600),color:C.s5,letterSpacing:2,textTransform:"uppercase"}}>Invite Only</span>
                <div style={{padding:"2px 8px",borderRadius:5,background:"rgba(244,244,245,0.05)",border:"0.5px solid rgba(244,244,245,0.08)"}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s3} strokeWidth="1.5" strokeLinecap="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.78 7.78 5.5 5.5 0 017.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </div>
              </div>
              <div style={{...sf(24,700),color:C.s2,marginBottom:20}}>Alfred Centurion</div>
              <div style={{height:0.5,background:"rgba(244,244,245,0.06)",marginBottom:16}}/>
              <div style={{...sf(12,500),color:C.s4,marginBottom:16}}>Everything in Platinum, plus:</div>
              {["Dedicated personal agent — one human, always your contact","24/7 WhatsApp access to your agent","Worldwide VIP access","Airport → venue coordination","Last-minute impossible reservations","Full travel itinerary building","Private event & experience curation","Quarterly branded gifting"].map(function(f,i){
                return <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s3} strokeWidth="2" strokeLinecap="round" style={{marginTop:2,flexShrink:0}}><path d="M20 6L9 17l-5-5"/></svg>
                  <span style={{...sf(13),color:C.s4,lineHeight:1.5}}>{f}</span>
                </div>
              })}
              <div style={{flex:1}}/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 0",borderRadius:14,background:"rgba(244,244,245,0.06)",border:"1px solid rgba(244,244,245,0.08)",cursor:"pointer",...sf(14,600),color:C.s2,marginTop:24,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(244,244,245,0.1)";e.currentTarget.style.borderColor="rgba(244,244,245,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(244,244,245,0.06)";e.currentTarget.style.borderColor="rgba(244,244,245,0.08)"}}>
                Apply for Centurion
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s2} strokeWidth="1.5" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>
              </div>
            </div>
            <div style={{position:"absolute",bottom:14,right:18,opacity:0.03,pointerEvents:"none"}}><span style={{...sf(8,700),letterSpacing:4,textTransform:"uppercase",color:C.s2}}>ALFRED</span></div>
          </div>
        </div>

        <p style={{textAlign:"center",marginTop:40,...sf(13,400),color:C.s6,opacity:tiersVis?1:0,transition:"opacity 0.8s ease 0.9s"}}>All plans include end-to-end encryption and no ads. Cancel anytime.</p>
      </section>

      {/* ═══ VENUE HORIZONTAL SCROLL ═══ */}
      <section ref={dirRef} aria-label="Venues" style={{padding:"140px 0 140px",position:"relative",overflow:"hidden"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:520,margin:"0 auto",marginBottom:48}}><p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:16,opacity:dirVis?1:0,transition:"all 0.8s ease"}}>Our Venues</p><h2 className="sec-head" style={{...sf(48,600),letterSpacing:-1.5,lineHeight:1.08,marginBottom:12,opacity:dirVis?1:0,transform:dirVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Hand-picked.<br/>Verified. Yours.</h2><p style={{...sf(14,400),color:C.s5,opacity:dirVis?1:0,transition:"all 0.8s ease 0.3s"}}>{venues.length} exclusive venues worldwide</p></div>

        <div className="venue-scroll" style={{display:"flex",gap:20,overflowX:"auto",scrollSnapType:"x mandatory",scrollBehavior:"smooth",padding:"0 40px 20px",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",msOverflowStyle:"none",opacity:dirVis?1:0,transform:dirVis?"translateY(0)":"translateY(20px)",transition:"all 1s ease 0.4s"}}>
          {venues.map(function(v,i){return(
            <div key={v.n} style={{width:340,flexShrink:0,borderRadius:22,overflow:"hidden",position:"relative",scrollSnapAlign:"start",cursor:"pointer",border:"1px solid "+C.bd,transition:"border-color 0.3s,transform 0.4s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.transform="translateY(-4px)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.transform="translateY(0)"}}>
              <div style={{height:220,position:"relative",overflow:"hidden"}}>
                <img src={v.img} alt={v.n} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(10,10,11,0.8) 100%)"}}/>
                <div style={{position:"absolute",top:14,right:14,display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:10,background:"rgba(0,0,0,0.3)",backdropFilter:"blur(12px)",border:"0.5px solid rgba(255,255,255,0.08)"}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                  <span style={{...sf(11,600),color:"rgba(255,255,255,0.9)"}}>{v.tag}</span>
                </div>
              </div>
              <div style={{padding:"18px 20px 20px",background:C.el}}>
                <div style={{...sf(20,700),color:C.s1,marginBottom:4,letterSpacing:-0.3}}>{v.n}</div>
                <div style={{...sf(13),color:C.s5}}>{v.sub}</div>
              </div>
            </div>
          )})}
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:8,opacity:dirVis?1:0,transition:"opacity 0.8s ease 0.6s"}}>
          <span style={{...sf(12),color:C.s6}}>← Scroll to explore →</span>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section ref={ctaRef} aria-label="Download" className="cta-section" style={{padding:"120px 0 140px",position:"relative"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:600,margin:"0 auto",padding:"0 40px"}}>
          <h2 className="sec-head cta-heading" style={{...sf(52,600),letterSpacing:-2,lineHeight:1.06,marginBottom:20,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.2s"}}>Your city.<br/>Your way.</h2>
          <p style={{...sf(17,400),color:C.s5,lineHeight:1.7,maxWidth:420,margin:"0 auto 40px",opacity:ctaVis?1:0,transition:"all 0.8s ease 0.4s"}}>Discover why the best experiences aren't found — they're arranged.</p>

          {/* App Store button */}
          <div style={{opacity:ctaVis?1:0,transition:"all 0.8s ease 0.55s",marginBottom:32}}>
            <div onClick={function(){setShowWaitlist(true)}} style={{display:"inline-flex",alignItems:"center",gap:10,padding:"16px 36px",borderRadius:16,background:hoverFinal?C.s1:C.el,border:"1px solid "+(hoverFinal?C.s1:C.bd),cursor:"pointer",transform:hoverFinal?"translateY(-3px)":"translateY(0)",boxShadow:hoverFinal?"0 12px 40px rgba(244,244,245,0.1)":"none",transition:"all 0.4s ease",...sf(16,600),color:hoverFinal?C.bg:C.s1}} onMouseEnter={function(){setHoverFinal(true)}} onMouseLeave={function(){setHoverFinal(false)}}>
              <svg width="18" height="18" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
              Download on the App Store
            </div>
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
              {["How it Works","Events","Catalog","Blog","Business"].map(function(l){var href=l==="Business"?"/business":l==="Catalog"?"/catalog":l==="Events"?"/events":l==="Blog"?"/blog":"#";return <a key={l} href={href} style={{...sf(14,400),color:C.s5,display:"block",marginBottom:14,transition:"color 0.2s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>{l}</a>})}
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
              <div onClick={function(){setShowWaitlist(true)}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid "+C.bd,cursor:"pointer",transition:"border-color 0.2s",...sf(13,600),color:C.s1}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
                <svg width="14" height="14" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                Download on the App Store
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
              {[{label:"Privacy Policy",href:"/privacy"},{label:"Terms",href:"/terms"}].map(function(l){return <a key={l.label} href={l.href} style={{...sf(12,400),color:C.s7,textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={function(e){e.target.style.color=C.s5}} onMouseLeave={function(e){e.target.style.color=C.s7}}>{l.label}</a>})}
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
              <div style={{...sf(13,400),color:C.s5,marginBottom:16}}>Download Alfred to book any venue</div>
              <div onClick={function(){setModalCat(null);setShowWaitlist(true)}} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:12,background:C.s1,cursor:"pointer",...sf(13,600),color:C.bg}}>
                <svg width="14" height="14" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                Download on the App Store
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* Waitlist Modal */}
      <WaitlistModal open={showWaitlist} onClose={function(){setShowWaitlist(false)}}/>
    </div>
  );
}

/* ═══════════════════════════════════════
   PARTNERS PAGE
   ═══════════════════════════════════════ */
var pDiv={position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"};

function PMark(p){
  var sw=Math.max(p.size*0.06,1.5);
  return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>);
}

function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

function PAnimCounter(p){
  var [val,setVal]=useState(0);
  var started=useRef(false);
  useEffect(function(){
    if(!p.active||started.current)return;
    started.current=true;
    var start=null;var dur=p.duration||1600;
    function step(ts){
      if(!start)start=ts;
      var prog=Math.min((ts-start)/dur,1);
      var ease=1-Math.pow(1-prog,3);
      setVal(Math.floor(ease*p.end));
      if(prog<1)requestAnimationFrame(step);else setVal(p.end);
    }
    requestAnimationFrame(step);
  },[p.active]);
  return <span>{p.prefix||""}{val.toLocaleString()}{p.suffix||""}</span>;
}

var CATS=[
  {icon:"🏨",title:"Hotels & Resorts",desc:"Get booked by high-spending guests who trust Alfred for their stays.",examples:"Boutique hotels, 5-star resorts, palace hotels, villas"},
  {icon:"🍽",title:"Restaurants",desc:"Fill your best tables with guests who spend 3x the average cover.",examples:"Fine dining, Michelin-starred, chef's tables, private rooms"},
  {icon:"🌙",title:"Nightlife",desc:"Premium table bookings and VIP guestlists from verified members.",examples:"Clubs, lounges, rooftop bars, members-only venues"},
  {icon:"💆",title:"Wellness & Spas",desc:"Connect with clients seeking premium treatments and retreats.",examples:"Luxury spas, private trainers, clinics, wellness retreats"},
  {icon:"🏎",title:"Exotic Cars",desc:"Rent to verified, insured members with dedicated concierge support.",examples:"Supercar rentals, classic cars, chauffeur services"},
  {icon:"✈️",title:"Private Aviation",desc:"Charter requests from members who book same-week.",examples:"Jet charters, helicopter transfers, fractional operators"},
  {icon:"🛥",title:"Yachts & Marine",desc:"Day charters and extended bookings from our global member base.",examples:"Superyachts, day boats, sailing experiences"},
  {icon:"✦",title:"Experiences",desc:"Offer exclusive access, events, and one-of-a-kind moments.",examples:"VIP events, private tours, personal shopping, concierge"},
];

function AlfredPartners(){
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [formData,setFormData]=useState({business:"",contact:"",email:"",phone:"",category:"",city:"",website:"",message:""});
  var [submitted,setSubmitted]=useState(false);
  var [submitting,setSubmitting]=useState(false);
  var [submitError,setSubmitError]=useState(null);
  var [openFaq,setOpenFaq]=useState(null);

  /* Supabase config — partner_applications table */
  var SUPABASE_URL="https://fbdgbnnkgyljehtccgaq.supabase.co";
  var SUPABASE_ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.REPLACE_WITH_YOUR_ANON_KEY";

  var whyRef=useRef(null); var whyVis=useVis(whyRef);
  var revenueRef=useRef(null); var revenueVis=useVis(revenueRef);
  var catRef=useRef(null); var catVis=useVis(catRef);
  var compareRef=useRef(null); var compareVis=useVis(compareRef);
  var statsRef=useRef(null); var statsVis=useVis(statsRef);
  var howRef=useRef(null); var howVis=useVis(howRef);
  var testRef=useRef(null); var testVis=useVis(testRef);
  var formRef=useRef(null); var formVis=useVis(formRef);
  var faqRef=useRef(null); var faqVis=useVis(faqRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);

  useEffect(function(){
    document.title="Partner with Alfred — Luxury Concierge Platform for Premium Businesses";
    var setMeta=function(n,c,p){var s=p?'meta[property="'+n+'"]':'meta[name="'+n+'"]';var el=document.querySelector(s);if(!el){el=document.createElement("meta");if(p)el.setAttribute("property",n);else el.setAttribute("name",n);document.head.appendChild(el)}el.setAttribute("content",c)};
    setMeta("description","Join Alfred's curated network of hotels, restaurants, nightlife, wellness, exotic cars, and private aviation. Reach ultra-high-net-worth clients. Zero upfront cost. Commission only.");
    setMeta("og:title","Partner with Alfred — Premium Business Network",true);
    setMeta("og:description","Get your venue in front of the world's most discerning clientele. Zero listing fees.",true);
    setMeta("og:type","website",true);
  },[]);

  var navOp=Math.min(scrollY/300,1);
  var heroOp=Math.max(1-scrollY/600,0);
  var handleInput=function(field){return function(e){var obj={};obj[field]=e.target.value;setFormData(Object.assign({},formData,obj))}};
  var handleSubmit=function(){
    if(!formData.business||!formData.email||submitting)return;
    setSubmitting(true);setSubmitError(null);
    fetch(SUPABASE_URL+"/rest/v1/partner_applications",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "apikey":SUPABASE_ANON,
        "Authorization":"Bearer "+SUPABASE_ANON,
        "Prefer":"return=minimal"
      },
      body:JSON.stringify({
        business_name:formData.business,
        contact_name:formData.contact,
        email:formData.email,
        phone:formData.phone||null,
        category:formData.category||null,
        city:formData.city||null,
        website:formData.website||null,
        message:formData.message||null,
        status:"new",
      })
    }).then(function(res){
      if(res.ok){setSubmitted(true)}
      else{res.text().then(function(t){setSubmitError("Something went wrong. Please WhatsApp us instead.");console.error(t)})}
    }).catch(function(){
      setSubmitError("Connection error. Please WhatsApp us instead.");
    }).finally(function(){setSubmitting(false)});
  };
  var inputStyle={width:"100%",padding:"14px 18px",borderRadius:14,background:C.el,border:"1px solid "+C.bd,color:C.s1,...sf(14),outline:"none",transition:"border-color 0.3s"};

  var FAQS=[
    {q:"Is there a fee to join?",a:"No upfront fees. Alfred operates on a commission model — you only pay when we drive real bookings. Rates are discussed during onboarding and vary by category (typically 10-20%)."},
    {q:"What kind of clients will I reach?",a:"Alfred members are verified UHNW individuals, executives, and global travelers who spend 3-5x the average customer. Every member is vetted before joining."},
    {q:"How does the booking process work?",a:"Members request through Alfred's app. Our concierge team coordinates directly with your reservations team via WhatsApp, email, or phone. No new systems to learn."},
    {q:"What cities do you operate in?",a:"Currently Miami and Paris, expanding to London, New York, Dubai, Mykonos, Milan, and more. We onboard partners ahead of launch in new cities."},
    {q:"How quickly can I get listed?",a:"Most partners are live within 1-2 weeks. We handle photography, copywriting, and profile creation. You just confirm availability and pricing."},
    {q:"Can I control my availability?",a:"Absolutely. You set blackout dates, table limits, pricing tiers, minimum spend. Alfred respects your operations completely. You're always in control."},
  ];

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <SEOHead {...SEO.business}/>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
input:focus,textarea:focus,select:focus{border-color:${C.s5}!important;outline:none}
select{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2371717A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center}
textarea{resize:vertical;min-height:100px}
.vw{max-width:880px;margin-left:auto;margin-right:auto;padding-left:40px;padding-right:40px}
.cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;border-radius:20px;overflow:hidden;background:${C.bd}}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.why-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px}
.compare-table{display:grid;grid-template-columns:2fr 1fr 1fr;gap:0}
.test-scroll{display:flex;gap:16px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.test-scroll::-webkit-scrollbar{display:none}
@media(max-width:768px){
  .vw{padding-left:24px!important;padding-right:24px!important}
  .cat-grid{grid-template-columns:1fr 1fr!important}
  .stats-row{grid-template-columns:1fr 1fr!important}
  .form-grid{grid-template-columns:1fr!important}
  .why-grid{grid-template-columns:1fr!important;gap:14px!important}
  .biz-nav-links{display:none!important}
  .biz-menu-btn{display:flex!important}
  .hero-t{font-size:36px!important;letter-spacing:-1px!important}
  .hero-sub{font-size:14px!important;max-width:340px!important}
  .step-row{flex-direction:column!important;gap:32px!important}
  .rev-row{flex-direction:column!important;gap:16px!important}
  .compare-table{grid-template-columns:1.5fr 1fr 1fr!important}
  .contact-row{flex-direction:column!important;gap:12px!important}
}
@media(max-width:390px){
  .cat-grid{grid-template-columns:1fr!important}
  .hero-t{font-size:28px!important}
}
      `}</style>

      {/* Grain */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      {/* ═══ NAV ═══ */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><PMark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div className="biz-nav-links" style={{display:"flex",alignItems:"center",gap:20}}>
          <a href="/" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Home</a>
          <a href="#apply" style={{padding:"10px 20px",borderRadius:12,...sf(11,600),color:C.bg,background:C.s1,transition:"transform 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-1px)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)"}}>Apply Now</a>
        </div>
        <div className="biz-menu-btn" onClick={function(){setMobileMenu(true)}} style={{display:"none",alignItems:"center",justifyContent:"center",width:44,height:44,borderRadius:12,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
        </div>
      </nav>

      {/* ═══ MOBILE MENU (Business) ═══ */}
      {mobileMenu&&<div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(5,5,6,0.98)",backdropFilter:"blur(60px) saturate(1.5)",display:"flex",flexDirection:"column",animation:"menuSlideIn 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
        <style>{`
@keyframes menuSlideIn{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
@keyframes menuItemIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes menuFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        `}</style>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"28px 24px"}}>
          <PMark size={22} color={C.s1}/>
          <div onClick={function(){setMobileMenu(false)}} style={{width:44,height:44,borderRadius:14,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="1.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 36px"}}>
          {[{label:"Home",href:"/"},{label:"Events",href:"/events"},{label:"Catalog",href:"/catalog"},{label:"Business",href:"/business"},{label:"Contact",href:"https://wa.me/447449562204",ext:true}].map(function(item,i){
            return <a key={item.label} href={item.href} target={item.ext?"_blank":undefined} rel={item.ext?"noopener":undefined} onClick={function(){setMobileMenu(false)}} style={{...sf(36,300),color:C.s2,letterSpacing:-0.5,textDecoration:"none",padding:"18px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"space-between",opacity:0,animation:"menuItemIn 0.5s cubic-bezier(0.16,1,0.3,1) "+(0.15+i*0.07)+"s forwards"}}>
              <span>{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          })}
        </div>
        <div style={{padding:"0 36px 48px",opacity:0,animation:"menuFadeUp 0.5s ease 0.6s forwards"}}>
          <a href="#apply" onClick={function(){setMobileMenu(false)}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"18px 0",borderRadius:16,background:C.s1,...sf(15,600),color:C.bg,textDecoration:"none",width:"100%"}}>Apply Now</a>
          <p style={{...sf(11,400),color:C.s7,textAlign:"center",marginTop:16,letterSpacing:0.5}}>Miami · Paris · Dubai · London</p>
        </div>
      </div>}

      {/* ═══ HERO ═══ */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",padding:"0 40px"}}>
        {[700,480,300].map(function(sz,i){return <div key={i} style={{position:"absolute",top:"45%",left:"50%",width:sz,height:sz,borderRadius:"50%",border:"1px solid rgba(244,244,245,"+(0.012+i*0.008)+")",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>})}
        <div style={{textAlign:"center",maxWidth:640,position:"relative",zIndex:2,opacity:heroOp}}>
          <div style={{opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1) 0.2s"}}>
            {/* Urgency badge */}
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:10,background:C.gn+"0F",border:"0.5px solid "+C.gn+"25",marginBottom:28}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px "+C.gn+"66"}}/>
              <span style={{...sf(11,500),color:C.gn}}>Now onboarding Miami & Paris · Limited spots per category</span>
            </div>

            <h1 className="hero-t" style={{...sf(52,700),letterSpacing:-2,lineHeight:1.06,marginBottom:20}}>Grow your business<br/>with Alfred.</h1>
            <p className="hero-sub" style={{...sf(17,400),color:C.s5,lineHeight:1.7,maxWidth:460,margin:"0 auto 36px"}}>Join the concierge platform trusted by the world's most discerning clientele. Zero upfront cost. Premium guests. Real bookings.</p>

            {/* Dual CTA */}
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <a href="#apply" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:14,background:C.s1,...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                Apply to Partner
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>
              </a>
              <a href="https://wa.me/447449562204" target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 28px",borderRadius:14,background:"transparent",border:"1px solid "+C.bd,...sf(14,500),color:C.s4,transition:"all 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.458-1.495A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.278 0-4.403-.733-6.13-1.976l-.44-.324-2.644.887.887-2.644-.324-.44A9.717 9.717 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ REVENUE PROJECTION ═══ */}
      <section ref={revenueRef} style={{padding:"100px 0 80px",position:"relative"}}><div style={pDiv}/>
        <div className="vw">
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:revenueVis?1:0,transition:"all 0.8s ease"}}>The Opportunity</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:48,opacity:revenueVis?1:0,transform:revenueVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>What Alfred partners<br/>earn on average.</h2>

          <div className="rev-row" style={{display:"flex",gap:16,opacity:revenueVis?1:0,transform:revenueVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.3s"}}>
            {[
              {num:6000,period:"/month",label:"Restaurant",sub:"Based on 20 covers/month via Alfred at €300 avg. spend",delay:0},
              {num:17000,period:"/month",label:"Hotel",sub:"Based on 8 room-nights/month at €2,100 avg. rate",delay:200},
              {num:8600,period:"/month",label:"Nightlife",sub:"Based on 12 table bookings/month at €720 avg. minimum",delay:400},
            ].map(function(r,i){
              return(
                <div key={i} style={{flex:1,padding:"32px 28px",borderRadius:24,background:C.el,border:"1px solid "+C.bd,transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
                  <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}>
                    <span style={{...sf(32,700),color:C.s1}}><PAnimCounter prefix="€" end={r.num} active={revenueVis} duration={1800+r.delay}/></span>
                    <span style={{...sf(14),color:C.s6}}>{r.period}</span>
                  </div>
                  <div style={{...sf(14,600),color:C.s3,marginBottom:8}}>{r.label}</div>
                  <div style={{...sf(12,400),color:C.s6,lineHeight:1.5}}>{r.sub}</div>
                </div>
              );
            })}
          </div>
          <p style={{...sf(12,400),color:C.s7,marginTop:16,opacity:revenueVis?1:0,transition:"opacity 0.8s ease 0.5s"}}>* Based on current partner data across Miami and Paris. Results vary by venue, category, and market.</p>
        </div>
      </section>

      {/* ═══ WHY ALFRED ═══ */}
      <section ref={whyRef} style={{padding:"100px 0 80px",position:"relative"}}><div style={pDiv}/>
        <div className="vw">
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:whyVis?1:0,transition:"all 0.8s ease"}}>Why Alfred</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:48,maxWidth:500,opacity:whyVis?1:0,transform:whyVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Not another listing.<br/>A concierge that sells for you.</h2>

          <div className="why-grid" style={{opacity:whyVis?1:0,transform:whyVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.3s"}}>
            {[
              {title:"Premium clientele",desc:"Verified guests who spend 3-5x the average.",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
              {title:"Zero upfront cost",desc:"Commission only. You pay when we deliver.",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>},
              {title:"Human concierge",desc:"Every booking handled personally, not by bots.",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>},
            ].map(function(item,i){
              return(
                <div key={i} style={{padding:"32px 28px",borderRadius:24,background:C.el,border:"1px solid "+C.bd,transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
                  <div style={{width:44,height:44,borderRadius:14,background:C.srf,border:"0.5px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>{item.icon}</div>
                  <h3 style={{...sf(20,600),color:C.s1,marginBottom:8}}>{item.title}</h3>
                  <p style={{...sf(13,400),color:C.s5,lineHeight:1.6}}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ INLINE CTA 1 ═══ */}
      <div className="vw" style={{marginBottom:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"24px 32px",borderRadius:20,background:"rgba(244,244,245,0.03)",border:"1px solid "+C.bd,flexWrap:"wrap",gap:16}}>
          <div><span style={{...sf(15,600),color:C.s1}}>Ready to get started?</span><span style={{...sf(14,400),color:C.s5,marginLeft:8}}>Most partners go live in under 2 weeks.</span></div>
          <a href="#apply" style={{padding:"12px 24px",borderRadius:12,background:C.s1,...sf(13,600),color:C.bg,transition:"transform 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-1px)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)"}}>Apply Now</a>
        </div>
      </div>

      {/* ═══ PLATFORM COMPARISON ═══ */}
      <section ref={compareRef} style={{padding:"100px 0 80px",position:"relative"}}><div style={pDiv}/>
        <div className="vw">
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:compareVis?1:0,transition:"all 0.8s ease"}}>How We Compare</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:48,opacity:compareVis?1:0,transform:compareVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Not like the others.</h2>

          <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden",opacity:compareVis?1:0,transform:compareVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.3s"}}>
            {/* Header */}
            <div className="compare-table" style={{padding:"16px 24px",borderBottom:"1px solid "+C.bd}}>
              <div style={{...sf(11,500),color:C.s6}}></div>
              <div style={{...sf(11,600),color:C.s1,textAlign:"center",letterSpacing:1}}>ALFRED</div>
              <div style={{...sf(11,500),color:C.s6,textAlign:"center"}}>Others</div>
            </div>
            {[
              {feature:"Listing fee",alfred:"Free",other:"$300-2,000/yr"},
              {feature:"Commission",alfred:"10-20%",other:"15-30%"},
              {feature:"Client quality",alfred:"Verified UHNW",other:"Anyone"},
              {feature:"Avg. spend per guest",alfred:"€440+",other:"€80-150"},
              {feature:"No-show rate",alfred:"< 1%",other:"15-25%"},
              {feature:"Booking method",alfred:"Human concierge",other:"Bot / self-serve"},
              {feature:"Onboarding",alfred:"We do everything",other:"DIY setup"},
              {feature:"Support",alfred:"Dedicated partner manager",other:"Email tickets"},
            ].map(function(row,i){
              return(
                <div key={i} className="compare-table" style={{padding:"14px 24px",borderBottom:i<7?"1px solid rgba(44,44,49,0.5)":"none",background:i%2===0?"rgba(244,244,245,0.015)":"transparent"}}>
                  <div style={{...sf(13,400),color:C.s4}}>{row.feature}</div>
                  <div style={{...sf(13,600),color:C.gn,textAlign:"center"}}>{row.alfred}</div>
                  <div style={{...sf(13,400),color:C.s6,textAlign:"center"}}>{row.other}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section ref={catRef} style={{padding:"100px 0 80px",position:"relative"}}><div style={pDiv}/>
        <div className="vw">
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:catVis?1:0,transition:"all 0.8s ease"}}>Who We Work With</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:48,opacity:catVis?1:0,transform:catVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Every category of<br/>luxury, covered.</h2>
          <div className="cat-grid" style={{opacity:catVis?1:0,transform:catVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.3s"}}>
            {[
              {title:"Hotels & Resorts",desc:"5-star stays, villas, palace hotels.",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 7v14M21 7v14M6 11h4v4H6zM14 11h4v4h-4zM9 3h6l3 4H6l3-4z"/></svg>},
              {title:"Restaurants",desc:"Fine dining, Michelin-starred, private rooms.",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>},
              {title:"Nightlife",desc:"Clubs, lounges, VIP tables.",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/><circle cx="12" cy="12" r="4"/></svg>},
              {title:"Wellness & Spas",desc:"Luxury spas, trainers, retreats.",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c-4.97 0-9-2.686-9-6v-.002C3 12.686 7.03 10 12 10s9 2.686 9 5.998V16c0 3.314-4.03 6-9 6z"/><path d="M12 10V2"/><path d="M8 6c0-2.21 1.79-4 4-4s4 1.79 4 4"/></svg>},
              {title:"Exotic Cars",desc:"Supercars, classics, chauffeur services.",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>},
              {title:"Private Aviation",desc:"Jets, helicopters, charter flights.",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>},
              {title:"Yachts & Marine",desc:"Day charters, superyachts, sailing.",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M4 18l1.7-10.2a1 1 0 01.9-.8h10.8a1 1 0 01.9.8L20 18"/><path d="M12 4v4"/></svg>},
              {title:"Experiences",desc:"VIP events, tours, personal shopping.",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>},
            ].map(function(cat,i){
              return(
                <div key={i} style={{padding:"24px 22px",borderRadius:20,background:C.el,border:"1px solid "+C.bd,transition:"all 0.4s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.transform="translateY(-4px)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.transform="translateY(0)"}}>
                  <div style={{width:40,height:40,borderRadius:12,background:C.srf,border:"0.5px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>{cat.icon}</div>
                  <h3 style={{...sf(16,600),color:C.s1,marginBottom:6}}>{cat.title}</h3>
                  <p style={{...sf(12,400),color:C.s5,lineHeight:1.5}}>{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section ref={statsRef} style={{padding:"100px 0 80px",position:"relative"}}><div style={pDiv}/>
        <div className="vw">
          <div className="stats-row" style={{opacity:statsVis?1:0,transform:statsVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
            {[{n:"10,000+",label:"Members",sub:"Verified, high-net-worth",color:"#818CF8"},{n:"€440",label:"Avg. spend",sub:"Per booking, per person",color:"#34D399"},{n:"< 1%",label:"No-show rate",sub:"From Alfred bookings",color:"#F472B6"},{n:"0",label:"Upfront cost",sub:"Commission only model",color:"#FBBF24"}].map(function(s,i){
              return(<div key={i} style={{background:C.bg,padding:"40px 24px",textAlign:"center"}}><div style={{...sf(36,700),color:s.color,marginBottom:8,lineHeight:1}}>{s.n}</div><div style={{...sf(14,600),color:C.s2,marginBottom:4}}>{s.label}</div><div style={{...sf(12,400),color:C.s6}}>{s.sub}</div></div>);
            })}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={howRef} style={{padding:"100px 0 80px",position:"relative"}}><div style={pDiv}/>
        <div className="vw">
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:howVis?1:0,transition:"all 0.8s ease"}}>How It Works</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:56,opacity:howVis?1:0,transform:howVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Live in days,<br/>not months.</h2>
          <div className="step-row" style={{display:"flex",gap:48,opacity:howVis?1:0,transform:howVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.3s"}}>
            {[
              {n:"1",title:"Apply",desc:"Submit the form below. We review every application within 48 hours and prioritize businesses that align with our members."},
              {n:"2",title:"Onboard",desc:"We handle everything — photography, profile copywriting, pricing setup. No tech work on your end. Your dedicated partner manager guides you through."},
              {n:"3",title:"Earn",desc:"Alfred members discover you and book through their concierge. You receive confirmed, high-value reservations. Money in your account, guests at your door."},
            ].map(function(step,i){
              return(<div key={i} style={{flex:1}}><div style={{width:48,height:48,borderRadius:"50%",border:"1px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}><span style={{...sf(18,600),color:C.s1}}>{step.n}</span></div><h3 style={{...sf(20,600),color:C.s1,marginBottom:10}}>{step.title}</h3><p style={{...sf(14,400),color:C.s5,lineHeight:1.7}}>{step.desc}</p></div>);
            })}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS — multiple ═══ */}
      <section ref={testRef} style={{padding:"100px 0 80px",position:"relative"}}><div style={pDiv}/>
        <div className="vw">
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:testVis?1:0,transition:"all 0.8s ease"}}>From Our Partners</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:40,opacity:testVis?1:0,transform:testVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Don't take our word<br/>for it.</h2>
        </div>
        <div className="test-scroll" style={{paddingLeft:40,paddingRight:40,maxWidth:880,margin:"0 auto",opacity:testVis?1:0,transform:testVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.3s"}}>
          {[
            {quote:"Alfred sends us exactly the type of guest we want — high-spending, respectful, and they always show up. Our no-show rate from Alfred bookings is literally zero.",role:"Reservations Director",venue:"Michelin-starred restaurant · Paris"},
            {quote:"We went from 3 exotic car rentals per month to 14 in the first 60 days. Every renter is insured and verified. The concierge team handles all the coordination.",role:"Fleet Manager",venue:"Supercar rental · Miami"},
            {quote:"The onboarding was seamless. They sent a photographer, wrote our profile, and we were live in 5 days. First booking came the same week.",role:"General Manager",venue:"Boutique hotel · South Beach"},
          ].map(function(t,i){
            return(
              <div key={i} style={{width:340,flexShrink:0,borderRadius:24,background:C.el,border:"1px solid "+C.bd,padding:"32px 28px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
                <div style={{...sf(40,300),color:C.s7,lineHeight:1,marginBottom:8}}>"</div>
                <p style={{...sf(14,400),color:C.s3,lineHeight:1.7,fontStyle:"italic",marginBottom:24}}>{t.quote}</p>
                <div style={{...sf(13,600),color:C.s3,marginBottom:2}}>{t.role}</div>
                <div style={{...sf(12,400),color:C.s6}}>{t.venue}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ INLINE CTA 2 ═══ */}
      <div className="vw" style={{marginBottom:0}}>
        <div className="contact-row" style={{display:"flex",alignItems:"center",gap:16,padding:"28px 32px",borderRadius:20,background:C.el,border:"1px solid "+C.bd}}>
          <div style={{flex:1}}>
            <div style={{...sf(16,600),color:C.s1,marginBottom:4}}>Prefer to talk first?</div>
            <div style={{...sf(13,400),color:C.s5}}>Reach our partnerships team directly — no forms, no wait.</div>
          </div>
          <a href="https://wa.me/447449562204" target="_blank" rel="noopener" style={{display:"flex",alignItems:"center",gap:8,padding:"12px 22px",borderRadius:12,background:C.gn+"14",border:"1px solid "+C.gn+"30",...sf(13,600),color:C.gn,flexShrink:0,transition:"all 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.background=C.gn+"22"}} onMouseLeave={function(e){e.currentTarget.style.background=C.gn+"14"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
            WhatsApp
          </a>
          <a href="mailto:partners@alfred.app" style={{display:"flex",alignItems:"center",gap:8,padding:"12px 22px",borderRadius:12,background:C.srf,border:"1px solid "+C.bd,...sf(13,500),color:C.s4,flexShrink:0,transition:"all 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            partners@alfred.app
          </a>
        </div>
      </div>

      {/* ═══ APPLICATION FORM ═══ */}
      <section id="apply" ref={formRef} style={{padding:"100px 0 80px",position:"relative"}}><div style={pDiv}/>
        <div className="vw">
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:formVis?1:0,transition:"all 0.8s ease"}}>Apply</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:16,opacity:formVis?1:0,transform:formVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Join the network.</h2>
          <p style={{...sf(16,400),color:C.s5,lineHeight:1.7,marginBottom:48,maxWidth:480,opacity:formVis?1:0,transition:"opacity 0.8s ease 0.25s"}}>Tell us about your business. No obligations, no fees. We respond within 48 hours.</p>

          {submitted ? (
            <div style={{borderRadius:24,background:C.el,border:"1px solid "+C.bd,padding:"60px 40px",textAlign:"center"}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:C.gn+"14",border:"1px solid "+C.gn+"30",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>
              <h3 style={{...sf(24,600),marginBottom:10}}>Application received.</h3>
              <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,maxWidth:400,margin:"0 auto 24px"}}>Our partnerships team will review and reach out within 48 hours.</p>
              <p style={{...sf(13,400),color:C.s6}}>Want to skip the wait? <a href="https://wa.me/447449562204" target="_blank" rel="noopener" style={{color:C.gn,textDecoration:"underline"}}>WhatsApp us now</a></p>
            </div>
          ) : (
            <div style={{borderRadius:24,background:C.el,border:"1px solid "+C.bd,padding:"36px 36px 40px",opacity:formVis?1:0,transform:formVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.3s"}}>
              <div className="form-grid">
                <div><label style={{display:"block",...sf(11,500),color:C.s5,letterSpacing:0.5,marginBottom:8}}>Business Name *</label><input type="text" value={formData.business} onChange={handleInput("business")} placeholder="e.g. Le Cinq" style={inputStyle}/></div>
                <div><label style={{display:"block",...sf(11,500),color:C.s5,letterSpacing:0.5,marginBottom:8}}>Contact Name *</label><input type="text" value={formData.contact} onChange={handleInput("contact")} placeholder="Full name" style={inputStyle}/></div>
                <div><label style={{display:"block",...sf(11,500),color:C.s5,letterSpacing:0.5,marginBottom:8}}>Email *</label><input type="email" value={formData.email} onChange={handleInput("email")} placeholder="you@business.com" style={inputStyle}/></div>
                <div><label style={{display:"block",...sf(11,500),color:C.s5,letterSpacing:0.5,marginBottom:8}}>Phone / WhatsApp</label><input type="tel" value={formData.phone} onChange={handleInput("phone")} placeholder="+33 6 12 34 56 78" style={inputStyle}/></div>
                <div><label style={{display:"block",...sf(11,500),color:C.s5,letterSpacing:0.5,marginBottom:8}}>Category</label>
                  <select value={formData.category} onChange={handleInput("category")} style={{...inputStyle,color:formData.category?C.s1:C.s6}}>
                    <option value="">Select category</option>
                    <option value="hotel">Hotels & Resorts</option>
                    <option value="restaurant">Restaurants</option>
                    <option value="nightlife">Nightlife</option>
                    <option value="wellness">Wellness & Spas</option>
                    <option value="cars">Exotic Cars</option>
                    <option value="aviation">Private Aviation</option>
                    <option value="yachts">Yachts & Marine</option>
                    <option value="experiences">Experiences</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div><label style={{display:"block",...sf(11,500),color:C.s5,letterSpacing:0.5,marginBottom:8}}>City</label><input type="text" value={formData.city} onChange={handleInput("city")} placeholder="e.g. Miami, Paris" style={inputStyle}/></div>
              </div>
              <div style={{marginTop:14}}><label style={{display:"block",...sf(11,500),color:C.s5,letterSpacing:0.5,marginBottom:8}}>Website (optional)</label><input type="url" value={formData.website} onChange={handleInput("website")} placeholder="https://" style={inputStyle}/></div>
              <div style={{marginTop:14}}><label style={{display:"block",...sf(11,500),color:C.s5,letterSpacing:0.5,marginBottom:8}}>Tell us about your business</label><textarea value={formData.message} onChange={handleInput("message")} placeholder="What makes your business special? What type of clients are you looking to attract?" style={{...inputStyle,minHeight:110}}/></div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:24,flexWrap:"wrap",gap:12}}>
                <div>
                  <span style={{...sf(12,400),color:C.s6}}>* Required · We respond within 48 hours</span>
                  {submitError&&<div style={{...sf(12,500),color:C.red,marginTop:6}}>{submitError}</div>}
                </div>
                <div onClick={handleSubmit} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 32px",borderRadius:14,background:formData.business&&formData.email&&!submitting?C.s1:"rgba(244,244,245,0.08)",cursor:formData.business&&formData.email&&!submitting?"pointer":"default",opacity:submitting?0.6:1,...sf(14,600),color:formData.business&&formData.email&&!submitting?C.bg:C.s6,transition:"all 0.3s"}} onMouseEnter={function(e){if(formData.business&&formData.email&&!submitting){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.1)"}}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                  {submitting?"Submitting...":"Submit Application"}
                  {!submitting&&<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section ref={faqRef} style={{padding:"100px 0 80px",position:"relative"}}><div style={pDiv}/>
        <div className="vw">
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:faqVis?1:0,transition:"all 0.8s ease"}}>FAQ</p>
          <h2 style={{...sf(40,600),letterSpacing:-1.5,lineHeight:1.1,marginBottom:40,opacity:faqVis?1:0,transform:faqVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Common questions.</h2>
          <div style={{opacity:faqVis?1:0,transform:faqVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.3s"}}>
            {FAQS.map(function(faq,i){
              var isOpen=openFaq===i;
              return(<div key={i} style={{borderBottom:i<FAQS.length-1?"1px solid "+C.bd:"none"}}><div onClick={function(){setOpenFaq(isOpen?null:i)}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 0",cursor:"pointer"}}><h3 style={{...sf(16,500),color:isOpen?C.s1:C.s3,transition:"color 0.3s"}}>{faq.q}</h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2" strokeLinecap="round" style={{transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.3s",flexShrink:0,marginLeft:16}}><path d="M6 9l6 6 6-6"/></svg></div><div style={{maxHeight:isOpen?300:0,overflow:"hidden",transition:"max-height 0.4s ease"}}><p style={{...sf(14,400),color:C.s5,lineHeight:1.7,paddingBottom:22}}>{faq.a}</p></div></div>);
            })}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{padding:"140px 0 120px",position:"relative"}}><div style={pDiv}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <PMark size={32} color={C.s5}/>
          <h2 style={{...sf(44,600),letterSpacing:-1.5,lineHeight:1.1,marginTop:24,marginBottom:16}}>Let's build<br/>something together.</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginBottom:36}}>The world's best businesses. The world's most discerning clients. No ads, no algorithms — real concierge, real bookings.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="#apply" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:14,background:C.s1,...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Apply Now</a>
            <a href="https://wa.me/447449562204" target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 28px",borderRadius:14,border:"1px solid "+C.bd,...sf(14,500),color:C.s4,transition:"all 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>WhatsApp Us</a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{borderTop:"1px solid "+C.bd,padding:"36px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><PMark size={14} color={C.s7}/><span style={{...sf(10),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Alfred ©2026</span></div>
        <div style={{display:"flex",gap:20}}>
          <a href="/" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Home</a>
          <a href="/catalog" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Catalog</a>
          <a href="mailto:partners@alfred.app" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>partners@alfred.app</a>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   CATALOG PAGE
   ═══════════════════════════════════════ */

function CDrawMark(p){
  var sw = Math.max(p.size * 0.06, 1.5);
  return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none"><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>);
}

/* ═══ CATEGORY DATA ═══ */
var CATEGORIES = [
  {
    id: "dining",
    title: "Dining",
    subtitle: "The world's best tables",
    count: "200+ restaurants",
    tag: "Most Popular",
    img: "https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/4497bfb501ea6d06db22e718479b90b4.jpg",
    items: [
      {name:"Carbone",loc:"Miami",price:"$$$$"},
      {name:"Le Cinq",loc:"Paris",price:"$$$$"},
      {name:"Zuma",loc:"Mykonos",price:"$$$$"},
      {name:"Nobu",loc:"Miami",price:"$$$$"},
      {name:"Girafe",loc:"Paris",price:"$$$"},
      {name:"Komodo",loc:"Miami",price:"$$$"},
      {name:"L'Ambroisie",loc:"Paris",price:"$$$$"},
      {name:"Gekko",loc:"Miami",price:"$$$"},
      {name:"Septime",loc:"Paris",price:"$$$$"},
      {name:"Swan",loc:"Miami",price:"$$$"},
      {name:"Le Clarence",loc:"Paris",price:"$$$$"},
      {name:"Papi Steak",loc:"Miami",price:"$$$$"},
    ],
    active: true,
  },
  {
    id: "nightlife",
    title: "Nightlife",
    subtitle: "Tables, guestlists & VIP",
    count: "23 exclusive venues",
    tag: "Members Only",
    img: "https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/Keinmusik.jpeg",
    items: [
      {name:"LIV",loc:"Miami",price:"Table min varies"},
      {name:"CoCo Club",loc:"Paris",price:"Members only"},
      {name:"E11even",loc:"Miami",price:"Table min varies"},
      {name:"Raspoutine",loc:"Paris",price:"Members only"},
      {name:"Story",loc:"Miami",price:"Table min varies"},
      {name:"L'Arc",loc:"Paris",price:"Table min varies"},
      {name:"Club Space",loc:"Miami",price:"Guestlist"},
      {name:"Castel",loc:"Paris",price:"Members only"},
    ],
    active: true,
  },
  {
    id: "wellness",
    title: "Wellness",
    subtitle: "Spas, trainers & retreats",
    count: "120+ partners",
    tag: "Popular",
    img: "https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/_%20(76).jpeg",
    items: [
      {name:"The Setai Spa",loc:"Miami",price:"$$$"},
      {name:"Dior Spa",loc:"Paris",price:"$$$$"},
      {name:"Bamford Spa",loc:"Miami",price:"$$$"},
      {name:"Le Spa Ritz",loc:"Paris",price:"$$$$"},
      {name:"The Standard Spa",loc:"Miami",price:"$$$"},
      {name:"Guerlain Spa",loc:"Paris",price:"$$$$"},
      {name:"Lapis Spa",loc:"Miami",price:"$$$"},
      {name:"Spa Le Bristol",loc:"Paris",price:"$$$$"},
    ],
    active: true,
  },
  {
    id: "exotic-cars",
    title: "Exotic Cars",
    subtitle: "Supercars, classics & chauffeurs",
    count: "45+ vehicles",
    tag: "On Demand",
    img: "https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/Aston%20Martin.jpeg",
    items: [
      {name:"Bugatti Chiron",loc:"Miami",price:"From $8,500/day"},
      {name:"Lamborghini Revuelto",loc:"Miami",price:"From $3,500/day"},
      {name:"Ferrari SF90",loc:"Miami",price:"From $3,200/day"},
      {name:"Rolls-Royce Cullinan",loc:"Miami",price:"From $2,800/day"},
      {name:"McLaren 750S",loc:"Miami",price:"From $2,500/day"},
      {name:"Porsche 911 GT3 RS",loc:"Miami",price:"From $1,800/day"},
      {name:"Aston Martin DBX707",loc:"Miami",price:"From $1,600/day"},
      {name:"Mercedes-AMG GT",loc:"Miami",price:"From $1,200/day"},
      {name:"Bentley Continental GT",loc:"Miami",price:"From $1,500/day"},
    ],
    active: true,
  },
  {
    id: "jets",
    title: "Jets",
    subtitle: "Charter, fractional & empty legs",
    count: "Global fleet access",
    tag: "Ultra Premium",
    img: "https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/_%20(75).jpeg",
    items: [
      {name:"NetJets",loc:"Global",price:"From $5,000/hr"},
      {name:"XO Aviation",loc:"Global",price:"From $4,500/hr"},
      {name:"Blade Helicopters",loc:"NYC · Miami",price:"From $195/seat"},
      {name:"VistaJet",loc:"Global",price:"Membership"},
      {name:"Flexjet",loc:"Global",price:"Fractional"},
      {name:"Wheels Up",loc:"US · Europe",price:"Membership"},
    ],
    active: true,
  },
  {
    id: "yachts",
    title: "Yachts",
    subtitle: "Day charters & superyachts",
    count: "108 yachts",
    tag: "Charter",
    img: "https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/_%20(83).jpeg",
    items: [
      {name:"Day Charters",loc:"Miami",price:"From $800/4hr"},
      {name:"Luxury Yachts",loc:"Miami · Fort Lauderdale",price:"From $3,000/4hr"},
      {name:"Superyachts",loc:"Miami",price:"On request"},
    ],
    active: true,
  },
  {
    id: "accommodations",
    title: "Accommodations",
    subtitle: "Hotels, villas & residences",
    count: "Coming soon",
    tag: "Coming Soon",
    img: "https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/_%20(82).jpeg",
    items: [],
    active: false,
  },
  {
    id: "services",
    title: "Services",
    subtitle: "Full concierge, on demand",
    count: "Coming soon",
    tag: "Coming Soon",
    img: "https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/Hotel%20ringbell%20AI%20generation.jpeg",
    items: [],
    active: false,
  },
];

/* ═══ MAIN CATALOG ═══ */
function AlfredCatalog() {
  var [selected, setSelected] = useState(null);
  var [loaded, setLoaded] = useState(false);
  var [scrollY, setScrollY] = useState(0);
  var [mobileMenu, setMobileMenu] = useState(false);

  useEffect(function(){ setTimeout(function(){ setLoaded(true); }, 100); }, []);
  useEffect(function(){
    var h = function(){ setScrollY(window.scrollY); };
    window.addEventListener("scroll", h, {passive:true});
    return function(){ window.removeEventListener("scroll", h); };
  }, []);

  var navOp = Math.min(scrollY / 300, 1);
  var activeCat = selected ? CATEGORIES.find(function(c){ return c.id === selected; }) : null;

  return (
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <SEOHead {...SEO.catalog}/>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}
::selection{background:#2C2C31;color:#F4F4F5}
a{color:inherit;text-decoration:none}
body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes modalIn{from{opacity:0;transform:translateY(24px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes menuSlideIn{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
@keyframes menuItemIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes menuFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:1100px;margin:0 auto;padding:0 40px}
.cat-card{aspect-ratio:3/4}
@media(max-width:1024px){
  .cat-grid{grid-template-columns:repeat(3,1fr);padding:0 28px;gap:14px}
}
@media(max-width:768px){
  .cat-grid{grid-template-columns:repeat(2,1fr);padding:0 20px;gap:12px}
  .cat-title{font-size:16px!important}
  .cat-sub{font-size:10px!important}
  .cat-count{font-size:9px!important}
  .page-title{font-size:36px!important;letter-spacing:-1px!important}
  .page-sub{font-size:13px!important}
  .detail-grid{grid-template-columns:1fr!important;padding:0 20px!important}
  .detail-hero{height:280px!important}
  .detail-title{font-size:32px!important}
  .modal-item{padding:16px 20px!important}
  .cat-nav-links{display:none!important}
  .cat-menu-btn{display:flex!important}
}
@media(max-width:390px){
  .cat-grid{grid-template-columns:repeat(2,1fr);padding:0 16px;gap:10px}
  .cat-title{font-size:14px!important}
  .page-title{font-size:28px!important}
  .detail-title{font-size:26px!important}
}
      `}</style>

      {/* Grain */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      {/* ═══ NAV ═══ */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur("+Math.min(navOp*30,30)+"px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")",transition:"all 0.3s"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}>
          <CDrawMark size={22} color={C.s1}/>
        </a>
        <div className="cat-nav-links" style={{display:"flex",alignItems:"center",gap:28}}>
          <a href="/" style={{...sf(11,400),color:C.s5,letterSpacing:0.3,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Home</a>
          <div style={{...sf(11,400),color:C.s1,letterSpacing:0.3}}>Catalog</div>
          <a href="/" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:12,background:C.el,border:"1px solid "+C.bd,...sf(11,500),color:C.s1,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.background=C.s1;e.currentTarget.style.color=C.bg}} onMouseLeave={function(e){e.currentTarget.style.background=C.el;e.currentTarget.style.color=C.s1}}>Download App</a>
        </div>
        <div className="cat-menu-btn" onClick={function(){setMobileMenu(true)}} style={{display:"none",alignItems:"center",justifyContent:"center",width:44,height:44,borderRadius:12,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
        </div>
      </nav>

      {/* ═══ MOBILE MENU ═══ */}
      {mobileMenu&&<div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(5,5,6,0.98)",backdropFilter:"blur(60px) saturate(1.5)",display:"flex",flexDirection:"column",animation:"menuSlideIn 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"28px 24px"}}>
          <CDrawMark size={22} color={C.s1}/>
          <div onClick={function(){setMobileMenu(false)}} style={{width:44,height:44,borderRadius:14,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="1.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 36px"}}>
          {[{label:"Home",href:"/"},{label:"Events",href:"/events"},{label:"Catalog",href:"/catalog"},{label:"Business",href:"/business"},{label:"Contact",href:"https://wa.me/447449562204",ext:true}].map(function(link,i){
            return <a key={link.label} href={link.href} target={link.ext?"_blank":undefined} rel={link.ext?"noopener":undefined} onClick={function(){setMobileMenu(false)}} style={{...sf(36,300),color:C.s2,letterSpacing:-0.5,textDecoration:"none",padding:"18px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"space-between",opacity:0,animation:"menuItemIn 0.5s cubic-bezier(0.16,1,0.3,1) "+(0.15+i*0.07)+"s forwards"}}>
              <span>{link.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          })}
        </div>
        <div style={{padding:"0 36px 48px",opacity:0,animation:"menuFadeUp 0.5s ease 0.6s forwards"}}>
          <a href="/" onClick={function(){setMobileMenu(false)}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"18px 0",borderRadius:16,background:C.s1,...sf(15,600),color:C.bg,textDecoration:"none",width:"100%"}}>Download App</a>
          <p style={{...sf(11,400),color:C.s7,textAlign:"center",marginTop:16,letterSpacing:0.5}}>Miami · Paris · Dubai · London</p>
        </div>
      </div>}

      {/* ═══ DETAIL VIEW ═══ */}
      {activeCat && (
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s ease"}} onClick={function(){ setSelected(null); }}>
          <div style={{width:"90%",maxWidth:720,maxHeight:"85vh",background:C.bg,borderRadius:28,border:"1px solid "+C.bd,overflow:"hidden",animation:"modalIn 0.4s cubic-bezier(0.16,1,0.3,1)"}} onClick={function(e){ e.stopPropagation(); }}>

            {/* Hero image */}
            <div className="detail-hero" style={{height:320,position:"relative",overflow:"hidden"}}>
              <img src={activeCat.img} alt={activeCat.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0) 30%,rgba(10,10,11,0.95) 100%)"}}/>
              {/* Close */}
              <div style={{position:"absolute",top:20,right:20,width:36,height:36,borderRadius:"50%",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.3s"}} onClick={function(){ setSelected(null); }} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(0,0,0,0.4)"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </div>
              {/* Tag */}
              <div style={{position:"absolute",top:20,left:20,...sf(9,600),letterSpacing:0.5,textTransform:"uppercase",color:C.s1,padding:"5px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)",border:"0.5px solid rgba(255,255,255,0.08)"}}>{activeCat.tag}</div>
              {/* Title overlay */}
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 32px 28px"}}>
                <div className="detail-title" style={{...sf(40,700),letterSpacing:-1,marginBottom:6}}>{activeCat.title}</div>
                <div style={{...sf(14,400),color:C.s4}}>{activeCat.subtitle}</div>
              </div>
            </div>

            {/* Items list */}
            <div style={{padding:"8px 0",maxHeight:"calc(85vh - 320px)",overflowY:"auto"}}>
              <div style={{padding:"12px 32px 8px",...sf(10,500),color:C.s6,letterSpacing:2,textTransform:"uppercase"}}>{activeCat.count}</div>
              {activeCat.items.map(function(item, i){
                return (
                  <div key={i} className="modal-item" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 32px",borderBottom:i<activeCat.items.length-1?"1px solid rgba(44,44,49,0.5)":"none",transition:"background 0.2s",cursor:"default"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.02)"}} onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}>
                    <div>
                      <div style={{...sf(15,600),color:C.s1,marginBottom:3}}>{item.name}</div>
                      <div style={{...sf(12,400),color:C.s5}}>{item.loc}</div>
                    </div>
                    <div style={{...sf(12,400),color:C.s6,flexShrink:0,marginLeft:16}}>{item.price}</div>
                  </div>
                );
              })}
              {/* CTA */}
              <div style={{padding:"24px 32px 28px",textAlign:"center"}}>
                <a href="/" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 28px",borderRadius:14,background:C.s1,color:C.bg,...sf(13,600),letterSpacing:0.3,transition:"transform 0.3s,box-shadow 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                  Book through the app
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section style={{paddingTop:140,paddingBottom:80,textAlign:"center",position:"relative"}}>
        <div style={{opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1) 0.2s"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20}}>The Alfred Collection</p>
          <h1 className="page-title" style={{...sf(52,700),letterSpacing:-2,lineHeight:1.06,marginBottom:16}}>Our Catalog</h1>
          <p className="page-sub" style={{...sf(16,400),color:C.s5,lineHeight:1.7,maxWidth:440,margin:"0 auto"}}>Every experience, service, and luxury we offer — curated across the world's finest cities.</p>
        </div>

        {/* Divider */}
        <div style={{maxWidth:1100,margin:"60px auto 0",padding:"0 40px"}}>
          <div style={{height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)"}}/>
        </div>
      </section>

      {/* ═══ CATEGORY GRID ═══ */}
      <section style={{paddingBottom:120}}>
        <div className="cat-grid">
          {CATEGORIES.map(function(cat, i){
            var isComingSoon = !cat.active;
            return (
              <div key={cat.id} className="cat-card" style={{
                borderRadius:20,overflow:"hidden",position:"relative",cursor:isComingSoon?"default":"pointer",
                border:"1px solid "+C.bd,
                opacity:loaded?1:0,
                transform:loaded?"translateY(0)":"translateY(24px)",
                transition:"all 0.7s cubic-bezier(0.16,1,0.3,1) "+(0.3+i*0.06)+"s",
                filter:isComingSoon?"brightness(0.5)":"none",
              }} onClick={function(){ if(cat.active){ var routes={"dining":"/catalog/dining","nightlife":"/catalog/nightlife","wellness":"/catalog/wellness","exotic-cars":"/catalog/exotic-cars","jets":"/catalog/jets","yachts":"/catalog/yachts"}; if(routes[cat.id]){window.location.href=routes[cat.id]}else{setSelected(cat.id)} } }}
                onMouseEnter={function(e){ if(cat.active){ e.currentTarget.style.transform="translateY(-6px) scale(1.02)"; e.currentTarget.style.boxShadow="0 24px 60px rgba(0,0,0,0.5)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}}
                onMouseLeave={function(e){ e.currentTarget.style.transform="translateY(0) scale(1)"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor=C.bd; }}
              >
                {/* Image */}
                <img src={cat.img} alt={cat.title} loading="lazy" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.8s cubic-bezier(0.16,1,0.3,1)"}}/>
                {/* Gradient */}
                <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0) 30%,rgba(10,10,11,0.5) 60%,rgba(10,10,11,0.92) 100%)"}}/>

                {/* Tag */}
                <div style={{position:"absolute",top:14,left:14,...sf(8,600),letterSpacing:0.5,textTransform:"uppercase",color:isComingSoon?C.s5:C.s1,padding:"4px 8px",borderRadius:7,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(12px)",border:"0.5px solid rgba(255,255,255,0.08)"}}>{cat.tag}</div>

                {/* Bottom text */}
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 16px 18px"}}>
                  <div className="cat-title" style={{...sf(20,700),color:"#fff",marginBottom:4,letterSpacing:-0.3}}>{cat.title}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:24}}>
                    <span className="cat-sub" style={{...sf(11,400),color:"rgba(255,255,255,0.45)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat.subtitle}</span>
                  </div>
                  <div className="cat-count" style={{...sf(10,500),color:isComingSoon?"rgba(255,255,255,0.3)":C.s4,marginTop:6,letterSpacing:0.5}}>{cat.count}</div>
                </div>

                {/* Coming soon overlay */}
                {isComingSoon && (
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{...sf(12,600),color:C.s4,letterSpacing:2,textTransform:"uppercase",padding:"8px 18px",borderRadius:10,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.06)"}}>Coming Soon</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section style={{padding:"80px 40px 120px",textAlign:"center",borderTop:"1px solid "+C.bd}}>
        <div style={{maxWidth:480,margin:"0 auto"}}>
          <CDrawMark size={32} color={C.s5}/>
          <h2 style={{...sf(32,600),letterSpacing:-1,marginTop:24,marginBottom:14}}>Ready to experience it all?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginBottom:36}}>Download Alfred and get access to every venue, every service, every experience — through one concierge.</p>
          <a href="/" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"16px 28px",borderRadius:16,background:C.el,border:"1px solid "+C.bd,...sf(14,500),color:C.s1,transition:"all 0.4s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.background=C.s1;e.currentTarget.style.color=C.bg;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.background=C.el;e.currentTarget.style.color=C.s1;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
            <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
            Download on the App Store
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{borderTop:"1px solid "+C.bd,padding:"40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <CDrawMark size={16} color={C.s7}/>
          <span style={{...sf(10,400),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Alfred ©2026</span>
        </div>
        <div style={{display:"flex",gap:24}}>
          <a href="/" style={{...sf(11,400),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Home</a>
          <a href="/business" style={{...sf(11,400),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Business</a>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   EXOTIC CARS PAGE
   ═══════════════════════════════════════ */

var ECARS=[
  {name:"Bugatti Chiron",brand:"Bugatti",price:8500,hp:1500,accel:"2.4s",top:"420",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/_%20(78).jpeg",loc:"Miami",available:true,category:"Hypercar"},
  {name:"Lamborghini Revuelto",brand:"Lamborghini",price:3500,hp:1015,accel:"2.5s",top:"350",img:"https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&h=400&fit=crop&q=80",loc:"Miami",available:true,category:"Supercar"},
  {name:"Ferrari SF90 Stradale",brand:"Ferrari",price:3200,hp:986,accel:"2.5s",top:"340",img:"https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600&h=400&fit=crop&q=80",loc:"Miami",available:true,category:"Supercar"},
  {name:"Rolls-Royce Cullinan",brand:"Rolls-Royce",price:2800,hp:563,accel:"5.2s",top:"250",img:"https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600&h=400&fit=crop&q=80",loc:"Miami",available:true,category:"Luxury SUV"},
  {name:"McLaren 750S",brand:"McLaren",price:2500,hp:750,accel:"2.8s",top:"332",img:"https://images.unsplash.com/photo-1621993202323-eb4e3ba02862?w=600&h=400&fit=crop&q=80",loc:"Miami",available:true,category:"Supercar"},
  {name:"Porsche 911 GT3 RS",brand:"Porsche",price:1800,hp:518,accel:"3.2s",top:"296",img:"https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/Aston%20Martin.jpeg",loc:"Paris · Miami",available:true,category:"Sports"},
  {name:"Aston Martin DBX707",brand:"Aston Martin",price:1600,hp:707,accel:"3.3s",top:"310",img:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop&q=80",loc:"Miami",available:true,category:"Luxury SUV"},
  {name:"Mercedes-AMG GT",brand:"Mercedes",price:1200,hp:577,accel:"3.1s",top:"315",img:"https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=400&fit=crop&q=80",loc:"Miami",available:false,category:"Grand Tourer"},
  {name:"Bentley Continental GT",brand:"Bentley",price:1500,hp:659,accel:"3.5s",top:"335",img:"https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=400&fit=crop&q=80",loc:"Miami",available:true,category:"Grand Tourer"},
];

function ECMark(p){
  var sw=Math.max(p.size*0.06,1.5);
  return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>);
}

function ECuseVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

function CarCard(p){
  var [hover,setHover]=useState(false);
  var car=p.car;
  return(
    <div style={{borderRadius:24,background:C.el,border:"1px solid "+(hover?C.s7:C.bd),overflow:"hidden",cursor:"pointer",transform:hover?"translateY(-6px)":"translateY(0)",boxShadow:hover?"0 20px 60px rgba(0,0,0,0.4)":"0 4px 20px rgba(0,0,0,0.15)",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",opacity:p.vis?1:0,animation:p.vis?"fadeIn 0.6s ease "+(0.1+p.i*0.08)+"s both":"none"}} onMouseEnter={function(){setHover(true)}} onMouseLeave={function(){setHover(false)}}>
      {/* Image */}
      <div style={{height:220,position:"relative",overflow:"hidden"}}>
        <img src={car.img} alt={car.brand+" "+car.name} style={{width:"100%",height:"100%",objectFit:"cover",transform:hover?"scale(1.05)":"scale(1)",transition:"transform 0.6s ease"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(10,10,11,0.8) 100%)"}}/>
        {/* Category tag */}
        <div style={{position:"absolute",top:16,left:16}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{car.category}</span>
        </div>
        {/* Availability */}
        <div style={{position:"absolute",top:16,right:16}}>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(12px)"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:car.available?C.gn:"#FF453A"}}/>
            <span style={{...sf(9,500),color:car.available?C.gn:"#FF453A"}}>{car.available?"Available":"Reserved"}</span>
          </div>
        </div>
        {/* Brand accent at bottom */}
        <div style={{position:"absolute",bottom:14,left:16,display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:16,height:2,borderRadius:1,background:"rgba(255,255,255,0.4)"}}/>
          <span style={{...sf(9,500),letterSpacing:2,color:"rgba(255,255,255,0.4)",textTransform:"uppercase"}}>{car.brand}</span>
        </div>
      </div>
      {/* Info */}
      <div style={{padding:"20px 22px 24px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <h3 style={{...sf(20,600),color:C.s1,marginBottom:4}}>{car.name}</h3>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{...sf(12),color:C.s5}}>{car.loc}</span>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{...sf(22,700),color:C.s1}}>€{car.price.toLocaleString()}</div>
            <div style={{...sf(11),color:C.s6}}>/day</div>
          </div>
        </div>
        {/* Specs row */}
        <div style={{display:"flex",gap:6}}>
          {[{v:car.hp+"hp",icon:"⚡"},{v:car.accel,icon:"⏱"},{v:car.top+"km/h",icon:"🏁"}].map(function(s,si){
            return(
              <div key={si} style={{flex:1,padding:"10px 0",borderRadius:12,background:C.srf,border:"0.5px solid "+C.bd,textAlign:"center"}}>
                <div style={{fontSize:12,marginBottom:3}}>{s.icon}</div>
                <div style={{...sf(12,600),color:C.s1}}>{s.v}</div>
              </div>
            );
          })}
        </div>
        {/* CTA */}
        <div style={{marginTop:14,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"12px 0",borderRadius:12,background:hover?C.s1:"transparent",border:"1px solid "+(hover?C.s1:C.bd),...sf(13,600),color:hover?C.bg:C.s4,transition:"all 0.4s"}}>
          {car.available?"Book This Car":"Join Waitlist"}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>
        </div>
      </div>
    </div>
  );
}

/* ExoticCarsPage is now imported from ./pages/ExoticCarsPage.jsx */

