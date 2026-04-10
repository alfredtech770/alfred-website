import { useState, useEffect, useRef } from "react";
import CARS from "../data/cars";
import SEOHead from "../components/SEOHead";
import { jsPDF } from "jspdf";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gold:"#FFD60A"};

function Mark(p){
  var sw=Math.max(p.size*0.06,1.5);
  return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>);
}

function CheckBox(p){
  return(<div style={{width:p.size||24,height:p.size||24,borderRadius:4,backgroundColor:p.checked?C.gn:C.bd,border:`2px solid ${p.checked?C.gn:C.s6}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s ease"}}>
    {p.checked&&<svg width={16} height={16} viewBox="0 0 16 16" fill="none"><path d="M2 8L6 12L14 4" stroke={C.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
  </div>);
}

function Toggle(p){
  return(<div onClick={p.onChange} style={{width:44,height:28,backgroundColor:p.on?C.gn:C.bd,borderRadius:14,cursor:"pointer",transition:"background 0.3s ease",display:"flex",alignItems:"center",padding:"2px 3px"}}>
    <div style={{width:22,height:22,backgroundColor:C.bg,borderRadius:11,transition:"transform 0.3s ease",transform:p.on?"translateX(16px)":"translateX(0)"}}/>
  </div>);
}

function ProposalBuilderPage(){
  var [clientName,setClientName]=useState("");
  var [showPricing,setShowPricing]=useState(false);
  var [selected,setSelected]=useState(new Set());
  var [generating,setGenerating]=useState(false);
  var [error,setError]=useState("");
  var containerRef=useRef(null);

  function toggleCar(id){
    var newSet=new Set(selected);
    if(newSet.has(id)){
      newSet.delete(id);
    }else{
      newSet.add(id);
    }
    setSelected(newSet);
  }

  function imageToBase64(url){
    return new Promise(function(resolve,reject){
      var img=new Image();
      img.crossOrigin="anonymous";
      img.onload=function(){
        var canvas=document.createElement("canvas");
        canvas.width=img.width;
        canvas.height=img.height;
        var ctx=canvas.getContext("2d");
        ctx.drawImage(img,0,0);
        resolve(canvas.toDataURL("image/jpeg",0.8));
      };
      img.onerror=function(){
        reject(new Error("Failed to load image: "+url));
      };
      img.src=url;
    });
  }

  /* ─── Canvas-based page renderer for pixel-perfect dark PDF ─── */
  var PW=210;var PH=297;// A4 portrait mm
  var DPI=10;// canvas scale factor — ultra HD
  var CW=PW*DPI;var CH=PH*DPI;

  function createPage(){
    var c=document.createElement("canvas");c.width=CW;c.height=CH;
    var ctx=c.getContext("2d");
    // dark bg
    ctx.fillStyle="#0A0A0B";ctx.fillRect(0,0,CW,CH);
    return{canvas:c,ctx:ctx};
  }

  function mm(v){return v*DPI}

  function drawMark(ctx,cx,cy,size,color){
    var s=mm(size);
    ctx.strokeStyle=color||"#F4F4F5";ctx.lineWidth=Math.max(s*0.055,1);ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(cx-s*0.3,cy+s*0.3);ctx.lineTo(cx-s*0.1,cy-s*0.3);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+s*0.3,cy+s*0.3);ctx.lineTo(cx+s*0.1,cy-s*0.3);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-s*0.1,cy-s*0.3);ctx.lineTo(cx+s*0.1,cy-s*0.3);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-s*0.18,cy+s*0.06);ctx.lineTo(cx+s*0.18,cy+s*0.06);ctx.stroke();
  }

  function roundRect(ctx,x,y,w,h,r){
    ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
  }

  function drawText(ctx,txt,x,y,opts){
    var o=opts||{};
    ctx.fillStyle=o.color||"#F4F4F5";
    ctx.font=(o.weight||400)+" "+mm(o.size||10)+"px -apple-system,Helvetica,Arial,sans-serif";
    ctx.textAlign=o.align||"left";ctx.textBaseline=o.baseline||"top";
    var s=String(txt);
    if(o.maxWidth){
      // truncate with ellipsis if too wide
      while(ctx.measureText(s).width>o.maxWidth&&s.length>1){s=s.slice(0,-1)}
      if(s.length<String(txt).length)s=s.slice(0,-1)+"…";
    }
    ctx.fillText(s,x,y);
  }

  function drawLine(ctx,x1,y1,x2,y2,color,w){
    ctx.strokeStyle=color||"#2C2C31";ctx.lineWidth=w||1;
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  }

  /* ── Cover page ── */
  function renderCover(clientName){
    var p=createPage();var ctx=p.ctx;
    // subtle gradient
    var grad=ctx.createLinearGradient(0,0,0,CH);
    grad.addColorStop(0,"rgba(24,24,27,0.25)");grad.addColorStop(0.5,"rgba(10,10,11,0)");grad.addColorStop(1,"rgba(24,24,27,0.15)");
    ctx.fillStyle=grad;ctx.fillRect(0,0,CW,CH);
    // accent line top
    var lg=ctx.createLinearGradient(CW*0.15,0,CW*0.85,0);
    lg.addColorStop(0,"transparent");lg.addColorStop(0.5,"rgba(244,244,245,0.07)");lg.addColorStop(1,"transparent");
    ctx.strokeStyle=lg;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(CW*0.15,mm(80));ctx.lineTo(CW*0.85,mm(80));ctx.stroke();
    // A mark
    drawMark(ctx,CW/2,mm(108),20,"#F4F4F5");
    // ALFRED CONCIERGE
    drawText(ctx,"A L F R E D   C O N C I E R G E",CW/2,mm(126),{size:7,weight:500,color:"#71717A",align:"center"});
    // divider
    drawLine(ctx,CW/2-mm(20),mm(138),CW/2+mm(20),mm(138),"#2C2C31",1);
    // Curated Selection
    drawText(ctx,"Curated Selection",CW/2,mm(150),{size:18,weight:700,color:"#F4F4F5",align:"center"});
    drawText(ctx,"for "+clientName,CW/2,mm(162),{size:12,weight:400,color:"#A1A1AA",align:"center"});
    // date
    var today=new Date();
    var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
    drawLine(ctx,CW/2-mm(20),mm(178),CW/2+mm(20),mm(178),"#2C2C31",1);
    drawText(ctx,months[today.getMonth()]+" "+today.getDate()+", "+today.getFullYear(),CW/2,mm(185),{size:7,weight:400,color:"#52525B",align:"center"});
    // bottom branding
    drawMark(ctx,CW/2,mm(PH-35),7,"#3F3F46");
    drawText(ctx,"alfredconcierge.app",CW/2,mm(PH-24),{size:5,weight:400,color:"#3F3F46",align:"center"});
    return p.canvas;
  }

  /* ── Car detail page — A4 portrait, luxury layout ── */
  function renderCarPage(car,heroImg,galleryImgs,showPrice,pageNum,totalPages){
    var p=createPage();var ctx=p.ctx;
    var pad=mm(16);var contentW=CW-pad*2;
    var y=0;

    // ═══ 1. HERO IMAGE ═══
    var heroH=mm(105);
    if(heroImg){
      ctx.save();ctx.beginPath();ctx.rect(0,0,CW,heroH);ctx.clip();
      var iw=heroImg.width;var ih=heroImg.height;
      var scale=Math.max(CW/iw,heroH/ih);
      ctx.drawImage(heroImg,(CW-iw*scale)/2,(heroH-ih*scale)/2,iw*scale,ih*scale);
      var topGrad=ctx.createLinearGradient(0,0,0,mm(25));
      topGrad.addColorStop(0,"rgba(10,10,11,0.45)");topGrad.addColorStop(1,"rgba(10,10,11,0)");
      ctx.fillStyle=topGrad;ctx.fillRect(0,0,CW,mm(25));
      var botGrad=ctx.createLinearGradient(0,heroH-mm(30),0,heroH);
      botGrad.addColorStop(0,"rgba(10,10,11,0)");botGrad.addColorStop(1,"#0A0A0B");
      ctx.fillStyle=botGrad;ctx.fillRect(0,heroH-mm(30),CW,mm(30));
      ctx.restore();
    }else{
      ctx.fillStyle="#18181B";ctx.fillRect(0,0,CW,heroH);
      drawText(ctx,"Image unavailable",CW/2,heroH/2-mm(3),{size:4,color:"#52525B",align:"center"});
    }
    // badges — top left
    var bodyTxt=String(car.body||"");
    ctx.font="600 "+mm(2.8)+"px -apple-system,Helvetica,Arial,sans-serif";
    var badgeW=ctx.measureText(bodyTxt).width+mm(4);
    ctx.save();roundRect(ctx,pad,mm(7),badgeW,mm(5),mm(1.5));
    ctx.fillStyle="rgba(0,0,0,0.5)";ctx.fill();ctx.restore();
    drawText(ctx,bodyTxt,pad+mm(2),mm(8.2),{size:2.8,weight:600,color:"#D4D4D8"});
    var driveTxt=String(car.drive||"");
    ctx.font="500 "+mm(2.6)+"px -apple-system,Helvetica,Arial,sans-serif";
    var driveW=ctx.measureText(driveTxt).width+mm(4);
    ctx.save();roundRect(ctx,pad+badgeW+mm(1.5),mm(7),driveW,mm(5),mm(1.5));
    ctx.fillStyle="rgba(0,0,0,0.5)";ctx.fill();ctx.restore();
    drawText(ctx,driveTxt,pad+badgeW+mm(3.5),mm(8.4),{size:2.6,weight:500,color:"#A1A1AA"});
    // page counter — top right
    drawText(ctx,String(pageNum)+" / "+String(totalPages),CW-pad,mm(9),{size:2.8,weight:500,color:"rgba(255,255,255,0.4)",align:"right"});

    y=heroH+mm(3);

    // ═══ 2. THREE GALLERY THUMBNAILS ═══
    var availThumbs=galleryImgs.filter(function(g){return g!==null});
    var numThumbs=Math.min(availThumbs.length,3);
    var thumbH=mm(36);var thumbGap=mm(2);
    if(numThumbs>0){
      var thumbW=(contentW-(numThumbs-1)*thumbGap)/numThumbs;
      for(var t=0;t<numThumbs;t++){
        var tx=pad+t*(thumbW+thumbGap);
        ctx.save();roundRect(ctx,tx,y,thumbW,thumbH,mm(2));ctx.clip();
        var tw=availThumbs[t].width;var th=availThumbs[t].height;
        var ts=Math.max(thumbW/tw,thumbH/th);
        ctx.drawImage(availThumbs[t],tx+(thumbW-tw*ts)/2,y+(thumbH-th*ts)/2,tw*ts,th*ts);
        ctx.restore();
      }
      y+=thumbH+mm(6);
    }else{
      y+=mm(4);
    }

    // ═══ 3. VERIFIED BADGE ═══
    var verBadge="✦  ALFRED VERIFIED";
    ctx.font="600 "+mm(2.5)+"px -apple-system,Helvetica,Arial,sans-serif";
    var verW=ctx.measureText(verBadge).width+mm(4);
    ctx.save();roundRect(ctx,pad,y,verW,mm(4.5),mm(1.5));
    ctx.fillStyle="rgba(52,199,89,0.05)";ctx.fill();ctx.strokeStyle="rgba(52,199,89,0.12)";ctx.lineWidth=mm(0.15);ctx.stroke();ctx.restore();
    drawText(ctx,verBadge,pad+mm(2),y+mm(1),{size:2.5,weight:600,color:"rgba(52,199,89,0.8)"});
    y+=mm(8);

    // ═══ 4. CAR NAME ═══
    var nameSize=12;
    ctx.font="700 "+mm(nameSize)+"px -apple-system,Helvetica,Arial,sans-serif";
    while(ctx.measureText(String(car.name)).width>contentW&&nameSize>7){nameSize-=0.5;ctx.font="700 "+mm(nameSize)+"px -apple-system,Helvetica,Arial,sans-serif";}
    drawText(ctx,String(car.name),pad,y,{size:nameSize,weight:700,color:"#F4F4F5"});
    y+=mm(nameSize*0.42+8);

    // ═══ 5. LOCATION ═══
    var locText=String((car.locs||[]).join(", ")||"Miami");
    drawText(ctx,locText,pad,y,{size:3.5,weight:400,color:"#71717A"});
    y+=mm(8);

    // ═══ 6. PRICE ═══
    if(showPrice){
      drawText(ctx,"$"+car.price.toLocaleString(),pad,y,{size:10,weight:700,color:"#F4F4F5"});
      ctx.font="700 "+mm(10)+"px -apple-system,Helvetica,Arial,sans-serif";
      var pw=ctx.measureText("$"+car.price.toLocaleString()).width;
      drawText(ctx," /day",pad+pw+mm(0.5),y+mm(2.5),{size:3.5,weight:400,color:"#52525B"});
      y+=mm(14);
    }

    // ═══ 7. DIVIDER ═══
    var divGrad=ctx.createLinearGradient(pad,0,CW-pad,0);
    divGrad.addColorStop(0,"transparent");divGrad.addColorStop(0.15,"#2C2C31");divGrad.addColorStop(0.85,"#2C2C31");divGrad.addColorStop(1,"transparent");
    ctx.strokeStyle=divGrad;ctx.lineWidth=mm(0.15);ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(CW-pad,y);ctx.stroke();
    y+=mm(6);

    // ═══ 8. PERFORMANCE — 3 spec cards ═══
    drawText(ctx,"PERFORMANCE",pad,y,{size:2.5,weight:600,color:"#52525B"});
    y+=mm(5);
    var specBoxW=(contentW-mm(3))/3;var specBoxH=mm(24);var specGap=mm(1.5);
    var perfSpecs=[
      {emoji:"⚡",val:String(car.hp||"—"),unit:" hp",label:"Power"},
      {emoji:"⏱",val:String(car.accel||"—"),unit:"s",label:"0-100 km/h"},
      {emoji:"🏁",val:String(car.top||"—"),unit:" km/h",label:"Top speed"}
    ];
    for(var si=0;si<3;si++){
      var bx=pad+si*(specBoxW+specGap);
      ctx.save();roundRect(ctx,bx,y,specBoxW,specBoxH,mm(2.5));
      ctx.fillStyle="#141416";ctx.fill();ctx.strokeStyle="#232328";ctx.lineWidth=mm(0.15);ctx.stroke();ctx.restore();
      drawText(ctx,perfSpecs[si].emoji,bx+specBoxW/2,y+mm(3.5),{size:3.5,align:"center"});
      drawText(ctx,perfSpecs[si].val+perfSpecs[si].unit,bx+specBoxW/2,y+mm(9),{size:5.5,weight:700,color:"#F4F4F5",align:"center"});
      drawText(ctx,perfSpecs[si].label,bx+specBoxW/2,y+mm(17),{size:2.5,weight:500,color:"#71717A",align:"center"});
    }
    y+=specBoxH+mm(4);

    // ═══ 9. DETAILS — 3x2 grid ═══
    var details=[
      {l:"Engine",v:String(car.engine||"—")},
      {l:"Transmission",v:String(car.trans||"—")},
      {l:"Drivetrain",v:String(car.drive||"—")},
      {l:"Seats",v:String(car.seats||"—")},
      {l:"Body",v:String(car.body||"—")},
      {l:"Location",v:String((car.locs||[]).join(", ")||"Miami")}
    ];
    var dColW=(contentW-mm(3))/3;var dRowH=mm(14);var dGap=mm(1.5);
    for(var di=0;di<details.length;di++){
      var col=di%3;var row=Math.floor(di/3);
      var dx=pad+col*(dColW+dGap);var dy=y+row*(dRowH+dGap);
      ctx.save();roundRect(ctx,dx,dy,dColW,dRowH,mm(2.5));
      ctx.fillStyle="#141416";ctx.fill();ctx.strokeStyle="#232328";ctx.lineWidth=mm(0.15);ctx.stroke();ctx.restore();
      drawText(ctx,details[di].l,dx+mm(3.5),dy+mm(3),{size:2.3,weight:500,color:"#71717A"});
      drawText(ctx,details[di].v,dx+mm(3.5),dy+mm(8),{size:3.8,weight:600,color:"#E4E4E7",maxWidth:dColW-mm(7)});
    }
    y+=2*(dRowH+dGap)+mm(5);

    // ═══ 10. WHAT'S INCLUDED ═══
    var features=[(car.locs||[]).some(function(l){return l.indexOf("Paris")!==-1})?"100 KM per day":"100 Miles per day","24/7 roadside assistance"];
    var featRowH=mm(7);
    ctx.save();roundRect(ctx,pad,y,contentW,features.length*featRowH+mm(2.5),mm(2));
    ctx.fillStyle="#141416";ctx.fill();ctx.strokeStyle="#232328";ctx.lineWidth=mm(0.15);ctx.stroke();ctx.restore();
    for(var fi=0;fi<features.length;fi++){
      var fy=y+mm(1.5)+fi*featRowH;
      if(fi>0){drawLine(ctx,pad+mm(3),fy,pad+contentW-mm(3),fy,"#232328",mm(0.15));}
      // green check circle
      ctx.save();
      ctx.beginPath();ctx.arc(pad+mm(5.5),fy+mm(3.5),mm(2),0,Math.PI*2);
      ctx.fillStyle="rgba(52,199,89,0.08)";ctx.fill();ctx.restore();
      ctx.strokeStyle="#34C759";ctx.lineWidth=mm(0.35);ctx.lineCap="round";ctx.lineJoin="round";
      ctx.beginPath();
      var ckx=pad+mm(4.3);var cky=fy+mm(3.5);
      ctx.moveTo(ckx,cky);ctx.lineTo(ckx+mm(1),cky+mm(1));ctx.lineTo(ckx+mm(2.4),cky-mm(0.7));ctx.stroke();
      drawText(ctx,features[fi],pad+mm(10),fy+mm(1.8),{size:3.5,weight:400,color:"#D4D4D8"});
    }
    y+=features.length*featRowH+mm(6);

    // ═══ 11. DEPOSIT (if pricing shown) ═══
    if(showPrice){
      ctx.save();roundRect(ctx,pad,y,contentW,mm(12),mm(2));
      ctx.fillStyle="rgba(244,244,245,0.015)";ctx.fill();ctx.strokeStyle="#232328";ctx.lineWidth=mm(0.15);ctx.stroke();ctx.restore();
      drawText(ctx,"Security deposit",pad+mm(5),y+mm(2.5),{size:3.8,weight:500,color:"#E4E4E7"});
      drawText(ctx,"Pre-authorised · fully refundable",pad+mm(5),y+mm(7.5),{size:2.5,weight:400,color:"#52525B"});
      drawText(ctx,"$"+String(car.deposit||car.price).toLocaleString(),CW-pad-mm(5),y+mm(3.5),{size:7,weight:700,color:"#F4F4F5",align:"right"});
    }

    // ═══ FOOTER ═══
    drawLine(ctx,pad,CH-mm(9),CW-pad,CH-mm(9),"#232328",mm(0.15));
    drawMark(ctx,pad+mm(3),CH-mm(5.5),3,"#3F3F46");
    drawText(ctx,"ALFRED CONCIERGE",pad+mm(7),CH-mm(6.8),{size:2.5,weight:500,color:"#3F3F46"});
    drawText(ctx,"alfredconcierge.app",CW-pad,CH-mm(6.8),{size:2.5,weight:400,color:"#3F3F46",align:"right"});

    return p.canvas;
  }

  /* ── Closing page — centered on A4 portrait ── */
  function renderClosing(clientName){
    var p=createPage();var ctx=p.ctx;
    var grad=ctx.createLinearGradient(0,0,0,CH);
    grad.addColorStop(0,"rgba(24,24,27,0.2)");grad.addColorStop(1,"rgba(10,10,11,0)");
    ctx.fillStyle=grad;ctx.fillRect(0,0,CW,CH);
    // top accent line
    var lg=ctx.createLinearGradient(CW*0.15,0,CW*0.85,0);
    lg.addColorStop(0,"transparent");lg.addColorStop(0.5,"rgba(244,244,245,0.06)");lg.addColorStop(1,"transparent");
    ctx.strokeStyle=lg;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(CW*0.15,mm(95));ctx.lineTo(CW*0.85,mm(95));ctx.stroke();
    // Mark
    drawMark(ctx,CW/2,mm(115),18,"#F4F4F5");
    // Thank You
    drawText(ctx,"Thank You",CW/2,mm(132),{size:30,weight:700,color:"#F4F4F5",align:"center"});
    drawText(ctx,clientName,CW/2,mm(148),{size:14,weight:400,color:"#A1A1AA",align:"center"});
    // divider
    drawLine(ctx,CW/2-mm(20),mm(164),CW/2+mm(20),mm(164),"#2C2C31",1);
    // Contact info
    drawText(ctx,"A L F R E D   C O N C I E R G E",CW/2,mm(174),{size:6,weight:500,color:"#52525B",align:"center"});
    drawText(ctx,"alfredconcierge.app",CW/2,mm(183),{size:8,weight:400,color:"#71717A",align:"center"});
    drawText(ctx,"Premium Luxury Concierge · Miami · Paris · Worldwide",CW/2,mm(192),{size:5,weight:400,color:"#3F3F46",align:"center"});
    // watermark
    ctx.globalAlpha=0.015;drawMark(ctx,CW/2,mm(230),60,"#F4F4F5");ctx.globalAlpha=1;
    // bottom branding
    drawMark(ctx,CW/2,mm(PH-35),7,"#3F3F46");
    drawText(ctx,"alfredconcierge.app",CW/2,mm(PH-24),{size:5,weight:400,color:"#3F3F46",align:"center"});
    return p.canvas;
  }

  /* ── Main generate function ── */
  async function generatePDF(){
    if(!clientName.trim()){setError("Please enter a client name");return}
    if(selected.size===0){setError("Please select at least one car");return}
    setError("");setGenerating(true);

    try{
      var selectedCars=CARS.filter(function(_,idx){return selected.has(idx)});
      var totalPages=selectedCars.length;

      // ─ Preload all images
      var loadImg=function(url){
        return new Promise(function(resolve){
          if(!url){resolve(null);return}
          var img=new Image();img.crossOrigin="anonymous";
          img.onload=function(){resolve(img)};
          img.onerror=function(){resolve(null)};
          img.src=url;
        });
      };
      // load hero + up to 4 gallery for each car
      var imagePromises=[];
      for(var ci=0;ci<selectedCars.length;ci++){
        var car=selectedCars[ci];
        imagePromises.push(loadImg(car.img));
        var gallery=(car.imgs||[]).filter(function(u){return u!==car.img}).slice(0,4);
        for(var gi=0;gi<4;gi++){
          imagePromises.push(loadImg(gallery[gi]||null));
        }
      }
      var allImages=await Promise.all(imagePromises);

      // ─ Build PDF — car pages only, no cover/closing
      var doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});

      for(var i=0;i<selectedCars.length;i++){
        var c=selectedCars[i];
        var imgIdx=i*5;
        var hero=allImages[imgIdx];
        var thumbs=[allImages[imgIdx+1],allImages[imgIdx+2],allImages[imgIdx+3],allImages[imgIdx+4]];
        if(i>0){doc.addPage()}
        var carCanvas=renderCarPage(c,hero,thumbs,showPricing,i+1,totalPages);
        doc.addImage(carCanvas.toDataURL("image/png"),"PNG",0,0,PW,PH);
      }

      doc.save("Alfred_Proposal_"+clientName.replace(/\s+/g,"_")+".pdf");
      setGenerating(false);
    }catch(e){
      console.error(e);
      setError("Error generating PDF: "+e.message);
      setGenerating(false);
    }
  }

  return(<div style={{backgroundColor:C.bg,color:C.s1,minHeight:"100vh"}}>
    <SEOHead title="Proposal Builder - Alfred Concierge" description="Build custom proposals for luxury car selections"/>

    {/* Nav Bar */}
    <div style={{position:"fixed",top:0,left:0,right:0,height:64,backgroundColor:C.bg,backdropFilter:"blur(10px)",borderBottom:`1px solid ${C.bd}`,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",paddingLeft:24,paddingRight:24}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <Mark size={32} color={C.s1}/>
        <span style={{...sf(18,600),color:C.s1}}>Alfred</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:24}}>
        <a href="/catalog" style={{...sf(14),color:C.s4,textDecoration:"none",cursor:"pointer"}}>Catalog</a>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:20,height:20,borderRadius:4,backgroundColor:C.gn,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none"><path d="M1 7L4 10L11 1" stroke={C.bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{...sf(14),color:C.s1}}>Proposal</span>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div ref={containerRef} style={{paddingTop:80,paddingBottom:100}}>
      {/* Header Section */}
      <div style={{paddingLeft:24,paddingRight:24,marginBottom:48}}>
        <h1 style={{...sf(40,700),color:C.s1,margin:"0 0 8px 0"}}>Client Proposal Builder</h1>
        <p style={{...sf(16),color:C.s4,margin:0}}>Select cars and generate a custom PDF proposal</p>
      </div>

      {/* Client Info Section */}
      <div style={{paddingLeft:24,paddingRight:24,marginBottom:48}}>
        <div style={{maxWidth:600}}>
          <div style={{marginBottom:24}}>
            <label style={{...sf(14,500),color:C.s2,display:"block",marginBottom:8}}>Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={function(e){setClientName(e.target.value);setError("")}}
              placeholder="Enter client name"
              style={{width:"100%",padding:"12px 16px",backgroundColor:C.el,border:`1px solid ${C.bd}`,borderRadius:8,...sf(14),color:C.s1,boxSizing:"border-box",outline:"none",transition:"border 0.2s"}}
              onFocus={function(e){e.target.style.borderColor=C.gn}}
              onBlur={function(e){e.target.style.borderColor=C.bd}}
            />
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px",backgroundColor:C.srf,borderRadius:8}}>
            <span style={{...sf(14,500),color:C.s1}}>Show Pricing</span>
            <Toggle on={showPricing} onChange={function(){setShowPricing(!showPricing)}}/>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error&&<div style={{paddingLeft:24,paddingRight:24,marginBottom:24,padding:"12px 16px",backgroundColor:"rgba(239, 68, 68, 0.1)",border:`1px solid rgba(239, 68, 68, 0.3)`,borderRadius:8,...sf(14),color:"#FCA5A5"}}>
        {error}
      </div>}

      {/* Car Selection Grid */}
      <div style={{paddingLeft:24,paddingRight:24}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:20}}>
          {CARS.map(function(car,idx){
            var isSelected=selected.has(idx);
            return(<div
              key={idx}
              onClick={function(){toggleCar(idx)}}
              style={{position:"relative",backgroundColor:C.el,border:`2px solid ${isSelected?C.gn:C.bd}`,borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"all 0.2s ease",transform:isSelected?"scale(0.98)":"scale(1)"}}>

              {/* Checkbox */}
              <div style={{position:"absolute",top:12,right:12,zIndex:10}}>
                <CheckBox size={24} checked={isSelected}/>
              </div>

              {/* Car Image */}
              {car.img&&<img
                src={car.img}
                alt={car.name}
                style={{width:"100%",height:200,objectFit:"cover",display:"block"}}
              />}
              {!car.img&&<div style={{width:"100%",height:200,backgroundColor:C.srf,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{...sf(12),color:C.s5}}>No image</span>
              </div>}

              {/* Car Info */}
              <div style={{padding:16}}>
                <h3 style={{...sf(16,600),color:C.s1,margin:"0 0 4px 0"}}>{car.name}</h3>
                <p style={{...sf(12),color:C.s4,margin:"0 0 12px 0"}}>{car.brand}</p>

                {/* Quick Specs */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${C.bd}`}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{...sf(11),color:C.s5,marginBottom:4}}>HP</div>
                    <div style={{...sf(13,600),color:C.s1}}>{car.hp}</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{...sf(11),color:C.s5,marginBottom:4}}>0-60</div>
                    <div style={{...sf(13,600),color:C.s1}}>{car.accel}</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{...sf(11),color:C.s5,marginBottom:4}}>Top</div>
                    <div style={{...sf(13,600),color:C.s1}}>{car.top}</div>
                  </div>
                </div>

                {/* Price */}
                <div style={{...sf(14,600),color:C.gn}}>
                  ${car.price.toLocaleString()}/day
                </div>
              </div>
            </div>);
          })}
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    {selected.size>0&&<div style={{position:"fixed",bottom:0,left:0,right:0,height:80,backgroundColor:C.el,borderTop:`1px solid ${C.bd}`,display:"flex",alignItems:"center",justifyContent:"space-between",paddingLeft:24,paddingRight:24,zIndex:50}}>
      <div style={{...sf(16,500),color:C.s4}}>
        {selected.size} car{selected.size!==1?"s":""} selected
      </div>
      <button
        onClick={generatePDF}
        disabled={generating}
        style={{padding:"12px 32px",backgroundColor:generating?C.s6:C.gn,color:generating?C.s4:C.bg,border:"none",borderRadius:8,...sf(14,600),cursor:generating?"not-allowed":"pointer",transition:"all 0.2s ease",opacity:generating?0.6:1}}>
        {generating?"Generating...":"Generate PDF"}
      </button>
    </div>}

    {/* Loading Overlay */}
    {generating&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
      <div style={{backgroundColor:C.el,padding:32,borderRadius:12,textAlign:"center"}}>
        <div style={{width:40,height:40,margin:"0 auto 16px",border:`3px solid ${C.bd}`,borderTop:`3px solid ${C.gn}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
        <p style={{...sf(16),color:C.s1,margin:0}}>Generating PDF...</p>
        <p style={{...sf(12),color:C.s5,margin:"8px 0 0 0"}}>Processing images and formatting</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>}
  </div>);
}

export default ProposalBuilderPage;
