import { useState } from "react";
import { useProposal } from "./ProposalContext";

var sf = function(size, weight){
  return {fontFamily:"-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif", fontSize:size, fontWeight:weight||400, WebkitFontSmoothing:"antialiased"};
};
var C = {bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gd:"#FFD60A",red:"#FF453A"};

var CAT_ICONS = {
  yacht: "\u26F5",
  dining: "\uD83C\uDF7D\uFE0F",
  nightlife: "\uD83C\uDF1F",
  car: "\uD83C\uDFCE\uFE0F",
  wellness: "\uD83E\uDDD6",
  jet: "\u2708\uFE0F"
};

export default function ProposalDrawer(){
  var ctx = useProposal();
  var items = ctx.items;
  var open = ctx.drawerOpen;
  var setOpen = ctx.setDrawerOpen;

  if(items.length === 0 && !open) return null;

  /* Floating button when drawer is closed */
  if(!open){
    return (
      <div onClick={function(){ setOpen(true); }} style={{position:"fixed",bottom:24,right:24,zIndex:9990,display:"flex",alignItems:"center",gap:10,padding:"14px 22px",borderRadius:16,background:"rgba(17,17,19,0.92)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",boxShadow:"0 12px 40px rgba(0,0,0,0.6)",transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor="rgba(255,255,255,0.2)";e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.transform="translateY(0)"}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <span style={{...sf(13,600),color:C.s1}}>Proposal</span>
        <span style={{...sf(11,700),color:C.bg,background:C.s1,borderRadius:10,padding:"2px 8px",minWidth:20,textAlign:"center"}}>{items.length}</span>
      </div>
    );
  }

  /* Group items by category */
  var groups = {};
  items.forEach(function(item){
    if(!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  return (
    <>
      {/* Backdrop */}
      <div onClick={function(){ setOpen(false); }} style={{position:"fixed",inset:0,zIndex:9990,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)"}}/>
      {/* Drawer */}
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:380,maxWidth:"calc(100vw - 20px)",zIndex:9991,background:C.bg,borderLeft:"1px solid "+C.bd,display:"flex",flexDirection:"column",boxShadow:"-20px 0 60px rgba(0,0,0,0.5)"}}>
        {/* Header */}
        <div style={{padding:"20px 24px",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.s1} strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span style={{...sf(16,600),color:C.s1}}>Client Proposal</span>
            <span style={{...sf(11,600),color:C.s5,background:C.srf,borderRadius:8,padding:"2px 8px"}}>{items.length} items</span>
          </div>
          <div onClick={function(){ setOpen(false); }} style={{width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"1px solid "+C.bd}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </div>
        </div>

        {/* Items */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          {Object.keys(groups).map(function(cat){
            return (
              <div key={cat} style={{marginBottom:20}}>
                <div style={{...sf(10,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>{CAT_ICONS[cat]||""} {cat}</div>
                {groups[cat].map(function(item){
                  return (
                    <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:12,background:C.el,border:"1px solid "+C.bd,marginBottom:8}}>
                      {item.image && <img src={item.image} alt="" style={{width:48,height:48,borderRadius:8,objectFit:"cover",flexShrink:0}}/>}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{...sf(13,600),color:C.s1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                        {item.price && <div style={{...sf(11,400),color:C.s5,marginTop:2}}>{item.price}</div>}
                      </div>
                      <div onClick={function(){ ctx.removeItem(item.category, item.id); }} style={{width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,69,58,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{padding:"16px 20px",borderTop:"1px solid "+C.bd}}>
          <div onClick={function(){ window.location.href="/proposal"; }} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 24px",borderRadius:12,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.opacity="0.9"}} onMouseLeave={function(e){e.currentTarget.style.opacity="1"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Generate PDF
          </div>
          <div onClick={function(){ if(window.confirm("Clear all items from proposal?")) ctx.clearAll(); }} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px",marginTop:8,...sf(12,500),color:C.s5,cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.color=C.red}} onMouseLeave={function(e){e.currentTarget.style.color=C.s5}}>
            Clear All
          </div>
        </div>
      </div>
    </>
  );
}
