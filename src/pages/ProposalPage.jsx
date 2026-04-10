import { useState, useEffect, useRef } from "react";
import { useProposal } from "../components/ProposalContext";
import { jsPDF } from "jspdf";

var sf = function(size, weight){
  return {fontFamily:"-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif", fontSize:size, fontWeight:weight||400, WebkitFontSmoothing:"antialiased"};
};
var C = {bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gd:"#FFD60A",red:"#FF453A"};

var CAT_LABELS = {
  yacht:"Yacht Charters",dining:"Dining",nightlife:"Nightlife",car:"Exotic Cars",wellness:"Wellness & Spa",jet:"Private Jets"
};
var CAT_ORDER = ["yacht","dining","car","nightlife","wellness","jet"];

function fmtPrice(v){
  if(!v) return "";
  if(typeof v==="number") return "$"+v.toLocaleString();
  return v;
}

/* Load image as base64 */
function loadImageB64(url){
  return new Promise(function(resolve){
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function(){
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx2 = canvas.getContext("2d");
      ctx2.drawImage(img, 0, 0);
      try { resolve(canvas.toDataURL("image/jpeg", 0.85)); } catch(e){ resolve(null); }
    };
    img.onerror = function(){ resolve(null); };
    img.src = url;
  });
}

/* Draw the Alfred "A" mark in the PDF */
function drawAlfredMark(doc, x, y, size){
  var s = size / 100;
  doc.setDrawColor(244,244,245);
  doc.setLineWidth(0.8);
  doc.line(x+20*s, y+80*s, x+40*s, y+18*s);
  doc.line(x+80*s, y+80*s, x+60*s, y+18*s);
  doc.line(x+40*s, y+18*s, x+60*s, y+18*s);
  doc.line(x+32*s, y+56*s, x+68*s, y+56*s);
}

async function generatePDF(items, options){
  var doc = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  var pw = 210;
  var ph = 297;
  var margin = 20;
  var contentW = pw - margin*2;
  var y = 0;

  /* ─── COVER PAGE ─── */
  doc.setFillColor(10,10,11);
  doc.rect(0,0,pw,ph,"F");

  /* Subtle border line */
  doc.setDrawColor(44,44,49);
  doc.setLineWidth(0.3);
  doc.rect(12,12,pw-24,ph-24);

  /* Alfred mark */
  drawAlfredMark(doc, pw/2 - 15, 60, 30);

  /* Title */
  doc.setFont("helvetica","bold");
  doc.setFontSize(32);
  doc.setTextColor(244,244,245);
  doc.text("ALFRED", pw/2, 115, {align:"center"});

  doc.setFont("helvetica","normal");
  doc.setFontSize(10);
  doc.setTextColor(113,113,122);
  doc.text("LUXURY CONCIERGE", pw/2, 124, {align:"center",charSpace:3});

  /* Divider line */
  doc.setDrawColor(63,63,70);
  doc.setLineWidth(0.3);
  doc.line(pw/2-30, 135, pw/2+30, 135);

  /* Client info */
  if(options.clientName){
    doc.setFont("helvetica","normal");
    doc.setFontSize(11);
    doc.setTextColor(161,161,170);
    doc.text("Prepared for", pw/2, 152, {align:"center"});
    doc.setFont("helvetica","bold");
    doc.setFontSize(18);
    doc.setTextColor(244,244,245);
    doc.text(options.clientName, pw/2, 163, {align:"center"});
  }

  /* Date */
  doc.setFont("helvetica","normal");
  doc.setFontSize(9);
  doc.setTextColor(82,82,91);
  var today = new Date();
  doc.text(today.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}), pw/2, 185, {align:"center"});

  /* Footer */
  doc.setFontSize(8);
  doc.setTextColor(63,63,70);
  doc.text("alfredconcierge.app", pw/2, ph-20, {align:"center"});

  /* ─── CONTENT PAGES ─── */
  /* Group by category */
  var groups = {};
  items.forEach(function(item){
    if(!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  /* Preload all images */
  var imageCache = {};
  for(var i=0; i<items.length; i++){
    if(items[i].image){
      var b64 = await loadImageB64(items[i].image);
      if(b64) imageCache[items[i].image] = b64;
    }
  }

  for(var ci=0; ci<CAT_ORDER.length; ci++){
    var cat = CAT_ORDER[ci];
    if(!groups[cat]) continue;
    var catItems = groups[cat];

    /* Category header page */
    doc.addPage();
    doc.setFillColor(10,10,11);
    doc.rect(0,0,pw,ph,"F");

    /* Thin border */
    doc.setDrawColor(44,44,49);
    doc.setLineWidth(0.3);
    doc.rect(12,12,pw-24,ph-24);

    /* Category title */
    y = 30;
    doc.setFont("helvetica","normal");
    doc.setFontSize(9);
    doc.setTextColor(82,82,91);
    doc.text("CURATED SELECTION", margin, y, {charSpace:2});

    y += 14;
    doc.setFont("helvetica","bold");
    doc.setFontSize(24);
    doc.setTextColor(244,244,245);
    doc.text((CAT_LABELS[cat]||cat).toUpperCase(), margin, y);

    y += 6;
    doc.setDrawColor(63,63,70);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin+40, y);
    y += 10;

    doc.setFont("helvetica","normal");
    doc.setFontSize(10);
    doc.setTextColor(113,113,122);
    doc.text(catItems.length + " selection" + (catItems.length > 1 ? "s" : ""), margin, y);
    y += 16;

    /* Items */
    for(var ii=0; ii<catItems.length; ii++){
      var item = catItems[ii];
      var cardH = 70; /* estimated card height */

      /* Check if we need a new page */
      if(y + cardH > ph - 30){
        doc.addPage();
        doc.setFillColor(10,10,11);
        doc.rect(0,0,pw,ph,"F");
        doc.setDrawColor(44,44,49);
        doc.setLineWidth(0.3);
        doc.rect(12,12,pw-24,ph-24);
        y = 30;
      }

      /* Item card background */
      doc.setFillColor(24,24,27);
      doc.roundedRect(margin, y, contentW, cardH - 6, 3, 3, "F");
      doc.setDrawColor(44,44,49);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, y, contentW, cardH - 6, 3, 3, "S");

      /* Image */
      var imgX = margin + 5;
      var imgY = y + 5;
      var imgW = 52;
      var imgH = cardH - 16;

      if(item.image && imageCache[item.image]){
        try {
          doc.addImage(imageCache[item.image], "JPEG", imgX, imgY, imgW, imgH);
          /* Rounded corner mask - draw dark rects at corners */
        } catch(e){}
      } else {
        doc.setFillColor(31,31,35);
        doc.rect(imgX, imgY, imgW, imgH, "F");
      }

      /* Text content */
      var textX = margin + imgW + 14;
      var textW = contentW - imgW - 22;
      var textY = y + 12;

      /* Name */
      doc.setFont("helvetica","bold");
      doc.setFontSize(13);
      doc.setTextColor(244,244,245);
      var nameLines = doc.splitTextToSize(item.name || "Untitled", textW);
      doc.text(nameLines[0], textX, textY);
      textY += 6;

      /* Subtitle / details */
      if(item.subtitle){
        doc.setFont("helvetica","normal");
        doc.setFontSize(9);
        doc.setTextColor(161,161,170);
        doc.text(item.subtitle.substring(0, 60), textX, textY);
      }
      textY += 8;

      /* Details row */
      if(item.details){
        doc.setFont("helvetica","normal");
        doc.setFontSize(8);
        doc.setTextColor(113,113,122);
        var detLines = doc.splitTextToSize(item.details.substring(0, 120), textW);
        doc.text(detLines.slice(0,2), textX, textY);
        textY += detLines.slice(0,2).length * 4;
      }

      /* Price */
      if(options.showPricing && item.price){
        textY = y + cardH - 14;
        doc.setFont("helvetica","bold");
        doc.setFontSize(11);
        doc.setTextColor(244,244,245);
        doc.text(typeof item.price === "number" ? fmtPrice(item.price) : item.price, textX, textY);
        if(item.priceLabel){
          doc.setFont("helvetica","normal");
          doc.setFontSize(8);
          doc.setTextColor(113,113,122);
          doc.text(" " + item.priceLabel, textX + doc.getTextWidth(typeof item.price === "number" ? fmtPrice(item.price) : item.price) + 2, textY);
        }
      }

      y += cardH;
    }

    /* Page footer */
    doc.setFont("helvetica","normal");
    doc.setFontSize(7);
    doc.setTextColor(63,63,70);
    doc.text("Alfred Concierge \u2022 alfredconcierge.app", pw/2, ph-16, {align:"center"});
  }

  /* ─── CLOSING PAGE ─── */
  doc.addPage();
  doc.setFillColor(10,10,11);
  doc.rect(0,0,pw,ph,"F");
  doc.setDrawColor(44,44,49);
  doc.setLineWidth(0.3);
  doc.rect(12,12,pw-24,ph-24);

  drawAlfredMark(doc, pw/2 - 12, ph/2 - 30, 24);

  doc.setFont("helvetica","bold");
  doc.setFontSize(16);
  doc.setTextColor(244,244,245);
  doc.text("Thank You", pw/2, ph/2 + 10, {align:"center"});

  doc.setFont("helvetica","normal");
  doc.setFontSize(10);
  doc.setTextColor(113,113,122);
  doc.text("For inquiries and reservations", pw/2, ph/2 + 22, {align:"center"});

  doc.setFont("helvetica","normal");
  doc.setFontSize(10);
  doc.setTextColor(161,161,170);
  doc.text("alfredconcierge.app", pw/2, ph/2 + 34, {align:"center"});

  if(options.showPricing){
    doc.setFont("helvetica","normal");
    doc.setFontSize(8);
    doc.setTextColor(82,82,91);
    doc.text("All prices are subject to availability and may change without notice.", pw/2, ph/2 + 50, {align:"center"});
  }

  doc.setFontSize(7);
  doc.setTextColor(63,63,70);
  doc.text("\u00A9 " + new Date().getFullYear() + " Alfred Concierge. All rights reserved.", pw/2, ph - 20, {align:"center"});

  /* Save */
  var filename = "Alfred_Proposal" + (options.clientName ? "_" + options.clientName.replace(/\s+/g,"_") : "") + (options.showPricing ? "" : "_NoPricing") + ".pdf";
  doc.save(filename);
}

export default function ProposalPage(){
  var ctx = useProposal();
  var items = ctx.items;
  var [clientName, setClientName] = useState("");
  var [showPricing, setShowPricing] = useState(true);
  var [generating, setGenerating] = useState(false);
  var [loaded, setLoaded] = useState(false);

  useEffect(function(){
    window.scrollTo(0,0);
    setTimeout(function(){ setLoaded(true); }, 100);
  }, []);

  /* Group items */
  var groups = {};
  items.forEach(function(item){
    if(!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  async function handleGenerate(){
    setGenerating(true);
    try {
      await generatePDF(items, {clientName:clientName, showPricing:showPricing});
    } catch(e){
      console.error("PDF generation error:", e);
      alert("Error generating PDF. Please try again.");
    }
    setGenerating(false);
  }

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.s1}}>
      {/* Nav */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(10,10,11,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid "+C.bd}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div onClick={function(){ window.history.back(); }} style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"1px solid "+C.bd}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </div>
          <span style={{...sf(15,600),color:C.s1}}>Client Proposal</span>
          <span style={{...sf(11,500),color:C.s5,background:C.srf,borderRadius:8,padding:"3px 10px"}}>{items.length} items</span>
        </div>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"100px 24px 60px",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"all 0.6s cubic-bezier(0.16,1,0.3,1)"}}>
        {items.length === 0 ? (
          <div style={{textAlign:"center",paddingTop:80}}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1" strokeLinecap="round" style={{marginBottom:20}}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <div style={{...sf(18,600),color:C.s4,marginBottom:8}}>No items in proposal</div>
            <div style={{...sf(14,400),color:C.s6,marginBottom:24}}>Browse the catalog and add items to create a client proposal</div>
            <div onClick={function(){ window.location.href="/"; }} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:12,background:C.s1,...sf(13,600),color:C.bg,cursor:"pointer"}}>Browse Catalog</div>
          </div>
        ) : (
          <>
            {/* Settings */}
            <div style={{marginBottom:40}}>
              <div style={{...sf(10,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:16}}>Proposal Settings</div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:240}}>
                  <label style={{display:"block",...sf(12,500),color:C.s4,marginBottom:6}}>Client Name</label>
                  <input value={clientName} onChange={function(e){setClientName(e.target.value)}} placeholder="Enter client name..." style={{width:"100%",padding:"12px 16px",borderRadius:12,background:C.el,border:"1px solid "+C.bd,...sf(14,400),color:C.s1,outline:"none",boxSizing:"border-box"}} onFocus={function(e){e.target.style.borderColor=C.s7}} onBlur={function(e){e.target.style.borderColor=C.bd}}/>
                </div>
                <div style={{display:"flex",alignItems:"flex-end"}}>
                  <div onClick={function(){setShowPricing(!showPricing)}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 20px",borderRadius:12,background:showPricing?C.el:"transparent",border:"1px solid "+(showPricing?C.s7:C.bd),cursor:"pointer",transition:"all 0.3s"}}>
                    <div style={{width:36,height:20,borderRadius:10,background:showPricing?"#34C759":"#3F3F46",position:"relative",transition:"background 0.3s"}}>
                      <div style={{width:16,height:16,borderRadius:8,background:"#fff",position:"absolute",top:2,left:showPricing?18:2,transition:"left 0.3s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}/>
                    </div>
                    <span style={{...sf(13,500),color:showPricing?C.s1:C.s5}}>Include Pricing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div style={{...sf(10,600),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",marginBottom:16}}>Preview ({items.length} items)</div>

            {CAT_ORDER.map(function(cat){
              if(!groups[cat]) return null;
              return (
                <div key={cat} style={{marginBottom:28}}>
                  <div style={{...sf(13,600),color:C.s4,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:3,height:16,borderRadius:2,background:C.s7}}/>
                    {CAT_LABELS[cat]||cat}
                    <span style={{...sf(11,400),color:C.s6}}>({groups[cat].length})</span>
                  </div>
                  {groups[cat].map(function(item){
                    return (
                      <div key={item.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",borderRadius:14,background:C.el,border:"1px solid "+C.bd,marginBottom:8}}>
                        {item.image && <img src={item.image} alt="" style={{width:56,height:56,borderRadius:10,objectFit:"cover",flexShrink:0}}/>}
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{...sf(14,600),color:C.s1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                          {item.subtitle && <div style={{...sf(11,400),color:C.s5,marginTop:2}}>{item.subtitle}</div>}
                        </div>
                        {showPricing && item.price && (
                          <div style={{textAlign:"right",flexShrink:0}}>
                            <div style={{...sf(14,700),color:C.s1}}>{typeof item.price==="number"?fmtPrice(item.price):item.price}</div>
                            {item.priceLabel && <div style={{...sf(9,400),color:C.s6}}>{item.priceLabel}</div>}
                          </div>
                        )}
                        <div onClick={function(){ctx.removeItem(item.category,item.id)}} style={{width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,border:"1px solid transparent"}} onMouseEnter={function(e){e.currentTarget.style.borderColor="rgba(255,69,58,0.3)";e.currentTarget.style.background="rgba(255,69,58,0.08)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor="transparent";e.currentTarget.style.background="transparent"}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Generate button */}
            <div style={{position:"sticky",bottom:24,marginTop:32,padding:16,background:"rgba(10,10,11,0.9)",backdropFilter:"blur(12px)",borderRadius:16,border:"1px solid "+C.bd}}>
              <div onClick={generating?null:handleGenerate} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"16px 32px",borderRadius:12,background:generating?"#3F3F46":C.s1,cursor:generating?"wait":"pointer",...sf(15,700),color:generating?C.s5:C.bg,transition:"all 0.3s"}}>
                {generating ? (
                  <>
                    <div style={{width:18,height:18,border:"2px solid "+C.s6,borderTopColor:C.s4,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download Proposal PDF
                  </>
                )}
              </div>
            </div>

            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </>
        )}
      </div>
    </div>
  );
}
