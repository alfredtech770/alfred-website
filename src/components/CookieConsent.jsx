import { useEffect, useState } from "react";
import { announceConsent, applyGoogleConsent, DENIED_CONSENT, readStoredConsent } from "../lib/consent";

var baseButton={borderRadius:10,padding:"11px 16px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif"};

export default function CookieConsent(){
  var initial=readStoredConsent();
  var [saved,setSaved]=useState(initial);
  var [open,setOpen]=useState(!initial);
  var [customizing,setCustomizing]=useState(false);
  var [analytics,setAnalytics]=useState(initial?initial.analytics:false);
  var [advertising,setAdvertising]=useState(initial?initial.advertising:false);

  useEffect(function(){
    applyGoogleConsent(initial || DENIED_CONSENT);
  },[]);

  function save(next){
    var previous=readStoredConsent();
    var consent=announceConsent(next);
    setSaved(consent);
    setAnalytics(consent.analytics);
    setAdvertising(consent.advertising);
    setOpen(false);
    setCustomizing(false);
    if(previous && ((previous.analytics&&!consent.analytics)||(previous.advertising&&!consent.advertising))){
      window.setTimeout(function(){window.location.reload()},50);
    }
  }

  function openPreferences(){
    var current=readStoredConsent() || DENIED_CONSENT;
    setAnalytics(current.analytics);
    setAdvertising(current.advertising);
    setCustomizing(true);
    setOpen(true);
  }

  return <>
    {open&&<div role="dialog" aria-modal="true" aria-labelledby="cookie-title" style={{position:"fixed",left:16,right:16,bottom:16,zIndex:100000,maxWidth:620,margin:"0 auto",padding:"22px 22px 18px",borderRadius:18,background:"rgba(18,18,20,0.98)",border:"1px solid #3F3F46",boxShadow:"0 18px 70px rgba(0,0,0,0.65)",color:"#F4F4F5",fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif"}}>
      <div id="cookie-title" style={{fontSize:17,fontWeight:650,marginBottom:8}}>Your privacy choices</div>
      <p style={{fontSize:13,lineHeight:1.55,color:"#A1A1AA",margin:"0 0 16px"}}>We use optional analytics to improve Alfred and optional advertising measurement to understand whether campaigns lead to concierge requests. Necessary site functions work without either. See our <a href="/privacy#cookies" style={{color:"#E4E4E7"}}>privacy policy</a>.</p>
      {customizing&&<div style={{display:"grid",gap:10,marginBottom:16}}>
        <label style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,padding:"12px 14px",borderRadius:12,background:"#1F1F23",fontSize:13}}><span><strong style={{display:"block",marginBottom:3}}>Analytics</strong><span style={{color:"#A1A1AA"}}>Usage and performance measurement</span></span><input aria-label="Allow analytics cookies" type="checkbox" checked={analytics} onChange={function(e){setAnalytics(e.target.checked)}} style={{width:20,height:20}}/></label>
        <label style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,padding:"12px 14px",borderRadius:12,background:"#1F1F23",fontSize:13}}><span><strong style={{display:"block",marginBottom:3}}>Advertising measurement</strong><span style={{color:"#A1A1AA"}}>Campaign attribution and conversion tracking</span></span><input aria-label="Allow advertising cookies" type="checkbox" checked={advertising} onChange={function(e){setAdvertising(e.target.checked)}} style={{width:20,height:20}}/></label>
      </div>}
      <div style={{display:"flex",gap:9,flexWrap:"wrap",justifyContent:"flex-end"}}>
        {!customizing&&<button type="button" onClick={function(){setCustomizing(true)}} style={{...baseButton,color:"#D4D4D8",background:"transparent",border:"1px solid #52525B"}}>Customize</button>}
        <button type="button" onClick={function(){save(DENIED_CONSENT)}} style={{...baseButton,color:"#D4D4D8",background:"#27272A",border:"1px solid #3F3F46"}}>Necessary only</button>
        {customizing&&<button type="button" onClick={function(){save({analytics:analytics,advertising:advertising})}} style={{...baseButton,color:"#0A0A0B",background:"#F4F4F5",border:"1px solid #F4F4F5"}}>Save choices</button>}
        {!customizing&&<button type="button" onClick={function(){save({analytics:true,advertising:true})}} style={{...baseButton,color:"#0A0A0B",background:"#F4F4F5",border:"1px solid #F4F4F5"}}>Accept all</button>}
      </div>
    </div>}
    {!open&&saved&&<button type="button" onClick={openPreferences} aria-label="Open cookie preferences" style={{position:"fixed",left:12,bottom:12,zIndex:99990,padding:"7px 10px",borderRadius:9,border:"1px solid #3F3F46",background:"rgba(18,18,20,0.94)",color:"#A1A1AA",fontSize:11,cursor:"pointer"}}>Cookie preferences</button>}
  </>;
}
