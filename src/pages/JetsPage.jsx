import { useState, useEffect } from "react";
import SEOHead from "../components/SEOHead";
import CatalogSeoBody from "../components/CatalogSeoBody";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gd:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}

export default function JetsPage(){
  var [email,setEmail]=useState("");
  var [submitted,setSubmitted]=useState(false);
  var [isMobile,setIsMobile]=useState(typeof window!=="undefined"&&window.innerWidth<=768);

  useEffect(function(){
    function onResize(){setIsMobile(window.innerWidth<=768);}
    window.addEventListener("resize",onResize);
    return function(){window.removeEventListener("resize",onResize);};
  },[]);

  function handleSubmit(e){
    e.preventDefault();
    if(!email.trim())return;
    setSubmitted(true);
  }

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
      <SEOHead
        title="Private Jets — Coming Soon | Alfred Concierge"
        description="Charter private jets through Alfred Concierge. Gulfstream, Global, Falcon, Citation — worldwide. Coming soon."
        path="/catalog/jets"
      />

      {/* Nav */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:isMobile?"16px 20px":"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(10,10,11,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(44,44,49,0.3)"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
          <Mark size={20} color={C.s1}/>
          <span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span>
        </a>
        <a href="/catalog" style={{...sf(12,500),color:C.s4,textDecoration:"none",letterSpacing:1}}>Back to Catalog</a>
      </nav>

      {/* Hero */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:isMobile?"100px 24px 60px":"120px 40px 80px",textAlign:"center",position:"relative",overflow:"hidden"}}>

        {/* Background plane icon */}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:0.03,pointerEvents:"none"}}>
          <svg width={isMobile?300:500} height={isMobile?300:500} viewBox="0 0 24 24" fill={C.s1}>
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>

        {/* Content */}
        <div style={{position:"relative",zIndex:2,maxWidth:640}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 20px",borderRadius:100,border:"1px solid "+C.gd+"30",background:C.gd+"08",marginBottom:32}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.gd,animation:"pulse 2s ease infinite"}}/>
            <span style={{...sf(12,600),color:C.gd,letterSpacing:2,textTransform:"uppercase"}}>Coming Soon</span>
          </div>

          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>

          <h1 style={{...sf(isMobile?36:56,700),color:C.s1,margin:"0 0 20px",letterSpacing:-1,lineHeight:1.1}}>
            Private Jets
          </h1>

          <p style={{...sf(isMobile?16:20,300),color:C.s4,lineHeight:1.7,marginBottom:12}}>
            Charter the world’s finest private aircraft through Alfred.
          </p>
          <p style={{...sf(isMobile?14:16,300),color:C.s5,lineHeight:1.7,marginBottom:40}}>
            Gulfstream G650, Global 7500, Falcon 7X, Challenger 350, Citation XLS — light jets to ultra-long range. Instant quotes, same-day booking, empty leg deals from Miami, New York, London, Paris and Dubai.
          </p>

          {/* Features */}
          <div style={{display:"flex",flexWrap:"wrap",gap:16,justifyContent:"center",marginBottom:48}}>
            {["Worldwide Coverage","Same-Day Booking","Empty Leg Deals","Dedicated Agent","24/7 Concierge"].map(function(f){
              return <div key={f} style={{padding:"10px 20px",borderRadius:12,border:"1px solid "+C.bd,background:C.el,...sf(13,500),color:C.s3}}>
                {f}
              </div>;
            })}
          </div>

          {/* Email signup */}
          {!submitted?(
            <div>
              <p style={{...sf(14,500),color:C.s3,marginBottom:16}}>Get notified when we launch</p>
              <form onSubmit={handleSubmit} style={{display:"flex",gap:10,maxWidth:420,margin:"0 auto",flexDirection:isMobile?"column":"row"}}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={function(e){setEmail(e.target.value);}}
                  style={{flex:1,padding:"14px 18px",borderRadius:12,border:"1px solid "+C.bd,background:C.srf,...sf(15),color:C.s1,outline:"none",transition:"border-color 0.2s"}}
                  onFocus={function(e){e.target.style.borderColor=C.gd;}}
                  onBlur={function(e){e.target.style.borderColor=C.bd;}}
                />
                <button type="submit" style={{padding:"14px 28px",borderRadius:12,border:"none",background:C.gd,...sf(15,700),color:"#000",cursor:"pointer",transition:"opacity 0.2s",whiteSpace:"nowrap"}}
                  onMouseEnter={function(e){e.currentTarget.style.opacity="0.85";}}
                  onMouseLeave={function(e){e.currentTarget.style.opacity="1";}}>
                  Notify Me
                </button>
              </form>
            </div>
          ):(
            <div style={{padding:"20px 32px",borderRadius:16,border:"1px solid "+C.gn+"40",background:C.gn+"08"}}>
              <p style={{...sf(16,600),color:C.gn,margin:"0 0 4px"}}>You’re on the list</p>
              <p style={{...sf(13),color:C.s4,margin:0}}>We’ll notify you as soon as private jets go live on Alfred.</p>
            </div>
          )}
        </div>
      </div>

      <CatalogSeoBody category="jets"/>

      {/* Footer */}
      <div style={{padding:"24px 40px",borderTop:"1px solid "+C.bd,textAlign:"center"}}>
        <p style={{...sf(12),color:C.s6}}>Meanwhile, contact your Alfred concierge on <a href="https://wa.me/447449562204" style={{color:C.gd,textDecoration:"none"}}>WhatsApp</a> for jet charter quotes.</p>
      </div>
    </div>
  );
}
