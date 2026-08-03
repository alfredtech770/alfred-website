import { useState, useEffect } from "react";
import SEOHead from "../components/SEOHead";
import CatalogSeoBody from "../components/CatalogSeoBody";
import { CatalogBrandNav } from "../components/brand";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gd:"#FFD60A"};

function Mark(p){return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><text x="50" y="80" textAnchor="middle" fontFamily="'Times New Roman','Didot','Bodoni 72',Georgia,serif" fontSize="92" fontStyle="italic" fontWeight="500" fill={p.color||C.s1}>A</text></svg>)}

export default function JetsPage(){
  var [isMobile,setIsMobile]=useState(typeof window!=="undefined"&&window.innerWidth<=768);

  useEffect(function(){
    function onResize(){setIsMobile(window.innerWidth<=768);}
    window.addEventListener("resize",onResize);
    return function(){window.removeEventListener("resize",onResize);};
  },[]);

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
      <SEOHead
        title="Private Jet Charter Requests | Alfred Concierge"
        description="Send Alfred your private aviation route, dates, passenger count and requirements. A licensed charter provider confirms aircraft availability, the complete quote and terms."
        path="/catalog/jets"
      />

      <CatalogBrandNav active="Catalog"/>

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
            <span style={{...sf(12,600),color:C.gd,letterSpacing:2,textTransform:"uppercase"}}>Request coordination</span>
          </div>

          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>

          <h1 style={{...sf(isMobile?36:56,700),color:C.s1,margin:"0 0 20px",letterSpacing:-1,lineHeight:1.1}}>
            Private Jets
          </h1>

          <p style={{...sf(isMobile?16:20,300),color:C.s4,lineHeight:1.7,marginBottom:12}}>
            Request private aviation through Alfred.
          </p>
          <p style={{...sf(isMobile?14:16,300),color:C.s5,lineHeight:1.7,marginBottom:40}}>
            Share the route, dates, passengers, luggage and timing. Alfred coordinates the request, while a licensed charter provider confirms the aircraft, operator, airports, complete quote and operating terms.
          </p>

          {/* Features */}
          <div style={{display:"flex",flexWrap:"wrap",gap:16,justifyContent:"center",marginBottom:48}}>
            {["Route-specific requests","Provider-confirmed aircraft","Licensed operator details","Complete quote terms","Ground transfer requests"].map(function(f){
              return <div key={f} style={{padding:"10px 20px",borderRadius:12,border:"1px solid "+C.bd,background:C.el,...sf(13,500),color:C.s3}}>
                {f}
              </div>;
            })}
          </div>

          <a href="https://wa.me/33743713649?text=Hi%20Alfred%2C%20I%27d%20like%20help%20with%20a%20private%20jet%20request.%20Please%20confirm%20current%20aircraft%20options%2C%20pricing%20and%20terms." target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",padding:"14px 28px",borderRadius:12,background:C.gd,...sf(15,700),color:"#000",textDecoration:"none"}}>Send a jet request</a>
        </div>
      </div>

      <CatalogSeoBody category="jets"/>

      {/* Footer */}
      <div style={{padding:"24px 40px",borderTop:"1px solid "+C.bd,textAlign:"center"}}>
        <p style={{...sf(12),color:C.s6}}>Alfred coordinates the request; the licensed provider confirms the flight, complete quote and operating terms.</p>
      </div>
    </div>
  );
}
