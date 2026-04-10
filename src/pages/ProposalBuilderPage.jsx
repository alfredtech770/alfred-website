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
  var PW=297;var PH=210;// A4 landscape mm
  var DPI=3;// canvas scale factor
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
    // subtle gradient overlay
    var grad=ctx.createLinearGradient(0,0,0,CH);
    grad.addColorStop(0,"rgba(24,24,27,0.3)");grad.addColorStop(0.5,"rgba(10,10,11,0)");grad.addColorStop(1,"rgba(24,24,27,0.2)");
    ctx.fillStyle=grad;ctx.fillRect(0,0,CW,CH);
    // top accent line
    var lg=ctx.createLinearGradient(CW*0.2,0,CW*0.8,0);
    lg.addColorStop(0,"transparent");lg.addColorStop(0.5,"rgba(244,244,245,0.08)");lg.addColorStop(1,"transparent");
    ctx.strokeStyle=lg;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(CW*0.2,mm(40));ctx.lineTo(CW*0.8,mm(40));ctx.stroke();
    // A mark
    drawMark(ctx,CW/2,mm(60),14,"#F4F4F5");
    // ALFRED CONCIERGE
    drawText(ctx,"A L F R E D   C O N C I E R G E",CW/2,mm(74),{size:6,weight:500,color:"#71717A",align:"center"});
    // divider
    drawLine(ctx,CW/2-mm(16),mm(82),CW/2+mm(16),mm(82),"#2C2C31",1);
    // Curated Selection
    drawText(ctx,"Curated Selection",CW/2,mm(90),{size:16,weight:700,color:"#F4F4F5",align:"center"});
    drawText(ctx,"for "+clientName,CW/2,mm(100),{size:12,weight:400,color:"#A1A1AA",align:"center"});
    // car count
    var today=new Date();
    var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
    // divider
    drawLine(ctx,CW/2-mm(16),mm(112),CW/2+mm(16),mm(112),"#2C2C31",1);
    // date
    drawText(ctx,months[today.getMonth()]+" "+today.getDate()+", "+today.getFullYear(),CW/2,mm(120),{size:7,weight:400,color:"#52525B",align:"center"});
    // bottom accent
    var lg2=ctx.createLinearGradient(CW*0.2,0,CW*0.8,0);
    lg2.addColorStop(0,"transparent");lg2.addColorStop(0.5,"rgba(244,244,245,0.06)");lg2.addColorStop(1,"transparent");
    ctx.strokeStyle=lg2;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(CW*0.2,mm(PH-20));ctx.lineTo(CW*0.8,mm(PH-20));ctx.stroke();
    // bottom branding
    drawMark(ctx,CW/2,mm(PH-30),6,"#3F3F46");
    drawText(ctx,"alfredconcierge.app",CW/2,mm(PH-22),{size:5,weight:400,color:"#3F3F46",align:"center"});
    return p.canvas;
  }

  /* ── Car detail page (main) ── */
  function renderCarPage(car,heroImg,galleryImgs,showPrice,pageNum,totalPages){
    var p=createPage();var ctx=p.ctx;
    var pad=mm(12);
    var rightPanelW=mm(122);// right panel width
    var rightX=CW-pad-rightPanelW;
    var imgW=rightX-pad-mm(4);// image fills left side up to right panel
    var imgH=mm(128);var imgX=pad;var imgY=pad;

    // ─ Hero image (left side)
    if(heroImg){
      ctx.save();roundRect(ctx,imgX,imgY,imgW,imgH,mm(3));ctx.clip();
      var iw=heroImg.width;var ih=heroImg.height;
      var scale=Math.max(imgW/iw,imgH/ih);
      var sw=iw*scale;var sh=ih*scale;
      ctx.drawImage(heroImg,imgX+(imgW-sw)/2,imgY+(imgH-sh)/2,sw,sh);
      // gradient overlay at bottom
      var imgGrad=ctx.createLinearGradient(0,imgY+imgH*0.65,0,imgY+imgH);
      imgGrad.addColorStop(0,"rgba(10,10,11,0)");imgGrad.addColorStop(1,"rgba(10,10,11,0.6)");
      ctx.fillStyle=imgGrad;ctx.fillRect(imgX,imgY,imgW,imgH);
      ctx.restore();
    }else{
      ctx.save();roundRect(ctx,imgX,imgY,imgW,imgH,mm(3));ctx.clip();
      ctx.fillStyle="#1F1F23";ctx.fillRect(imgX,imgY,imgW,imgH);
      drawText(ctx,"Image unavailable",imgX+imgW/2,imgY+imgH/2-mm(3),{size:8,color:"#52525B",align:"center"});
      ctx.restore();
    }
    // body badge top-left on image
    var bodyTxt=String(car.body||"");
    ctx.font="600 "+mm(3.2)+"px -apple-system,Helvetica,Arial,sans-serif";
    var badgeW=ctx.measureText(bodyTxt).width+mm(5);
    ctx.save();roundRect(ctx,imgX+mm(3),imgY+mm(3),badgeW,mm(5),mm(1.5));
    ctx.fillStyle="rgba(0,0,0,0.6)";ctx.fill();ctx.restore();
    drawText(ctx,bodyTxt,imgX+mm(5.5),imgY+mm(4),{size:3.2,weight:600,color:"#D4D4D8"});
    // page counter bottom-right on image
    drawText(ctx,String(pageNum)+" / "+String(totalPages),imgX+imgW-mm(5),imgY+imgH-mm(5),{size:3.2,weight:500,color:"rgba(255,255,255,0.5)",align:"right"});

    // ─ Gallery thumbnails below hero
    var thumbY=imgY+imgH+mm(2.5);var thumbH=mm(PH-12-2.5)-imgY-imgH-mm(12);// fill remaining height above footer
    var thumbGap=mm(2);
    var availThumbs=galleryImgs.filter(function(g){return g!==null});
    var numThumbs=Math.min(availThumbs.length,4);
    if(numThumbs>0){
      var thumbW=(imgW-(numThumbs-1)*thumbGap)/numThumbs;
      for(var t=0;t<numThumbs;t++){
        var tx=imgX+t*(thumbW+thumbGap);
        ctx.save();roundRect(ctx,tx,thumbY,thumbW,thumbH,mm(2));ctx.clip();
        var tw=availThumbs[t].width;var th=availThumbs[t].height;
        var ts=Math.max(thumbW/tw,thumbH/th);
        ctx.drawImage(availThumbs[t],tx+(thumbW-tw*ts)/2,thumbY+(thumbH-th*ts)/2,tw*ts,th*ts);
        ctx.restore();
      }
    }

    // ─ Right panel: Car info
    var ry=pad;var rpW=rightPanelW;

    // Car name — auto-size to fit
    var nameSize=14;
    ctx.font="700 "+mm(nameSize)+"px -apple-system,Helvetica,Arial,sans-serif";
    while(ctx.measureText(String(car.name)).width>rpW&&nameSize>7){nameSize-=0.5;ctx.font="700 "+mm(nameSize)+"px -apple-system,Helvetica,Arial,sans-serif";}
    drawText(ctx,String(car.name),rightX,ry,{size:nameSize,weight:700,color:"#F4F4F5"});
    ry+=mm(nameSize*0.55+3);

    // Brand + location
    drawText(ctx,String(car.brand||"")+"  ·  "+String((car.locs||[]).join(", ")||"Miami"),rightX,ry,{size:5,weight:400,color:"#71717A",maxWidth:rpW});
    ry+=mm(8);

    // ─ Performance: 3 spec boxes
    drawText(ctx,"PERFORMANCE",rightX,ry,{size:3.2,weight:600,color:"#3F3F46"});
    ry+=mm(4.5);
    var specBoxW=(rpW-mm(4))/3;var specBoxH=mm(18);var specGap=mm(2);
    var perfSpecs=[
      {emoji:"\u26A1",val:String(car.hp||"—"),unit:"hp",label:"Power"},
      {emoji:"\u23F1",val:String(car.accel||"—"),unit:"",label:"0-100"},
      {emoji:"\uD83C\uDFC1",val:String(car.top||"—"),unit:"km/h",label:"Top Speed"}
    ];
    for(var si=0;si<3;si++){
      var bx=rightX+si*(specBoxW+specGap);
      ctx.save();roundRect(ctx,bx,ry,specBoxW,specBoxH,mm(2.5));
      ctx.fillStyle="#18181B";ctx.fill();ctx.strokeStyle="#2C2C31";ctx.lineWidth=1;ctx.stroke();ctx.restore();
      drawText(ctx,perfSpecs[si].emoji,bx+specBoxW/2,ry+mm(2.5),{size:4,align:"center"});
      drawText(ctx,perfSpecs[si].val+(perfSpecs[si].unit?" "+perfSpecs[si].unit:""),bx+specBoxW/2,ry+mm(7.5),{size:6,weight:700,color:"#F4F4F5",align:"center"});
      drawText(ctx,perfSpecs[si].label,bx+specBoxW/2,ry+mm(13.5),{size:3,weight:500,color:"#71717A",align:"center"});
    }
    ry+=specBoxH+mm(4);

    // ─ Details: 3x2 grid
    drawText(ctx,"DETAILS",rightX,ry,{size:3.2,weight:600,color:"#3F3F46"});
    ry+=mm(4.5);
    var details=[
      {l:"Engine",v:String(car.engine||"—")},
      {l:"Transmission",v:String(car.trans||"—")},
      {l:"Drivetrain",v:String(car.drive||"—")},
      {l:"Seats",v:String(car.seats||"—")},
      {l:"Body",v:String(car.body||"—")},
      {l:"Category",v:String(car.category||"—")}
    ];
    var dColW=(rpW-mm(4))/3;var dRowH=mm(10);var dGap=mm(2);
    for(var di=0;di<details.length;di++){
      var col=di%3;var row=Math.floor(di/3);
      var dx=rightX+col*(dColW+dGap);var dy=ry+row*(dRowH+dGap);
      ctx.save();roundRect(ctx,dx,dy,dColW,dRowH,mm(2));
      ctx.fillStyle="#18181B";ctx.fill();ctx.strokeStyle="#2C2C31";ctx.lineWidth=1;ctx.stroke();ctx.restore();
      drawText(ctx,details[di].l,dx+mm(2.5),dy+mm(2),{size:2.5,weight:500,color:"#71717A"});
      drawText(ctx,details[di].v,dx+mm(2.5),dy+mm(5.5),{size:4,weight:500,color:"#F4F4F5",maxWidth:dColW-mm(5)});
    }
    ry+=2*(dRowH+dGap)+mm(3);

    // ─ What's Included
    drawText(ctx,"WHAT'S INCLUDED",rightX,ry,{size:3.2,weight:600,color:"#3F3F46"});
    ry+=mm(4.5);
    var features=[(car.locs||[]).some(function(l){return l.indexOf("Paris")!==-1})?"100 KM per day":"100 Miles per day","Full insurance included","Free delivery & pickup","24/7 roadside assistance"];
    var featRowH=mm(6);
    ctx.save();roundRect(ctx,rightX,ry,rpW,features.length*featRowH+mm(2),mm(2.5));
    ctx.fillStyle="#18181B";ctx.fill();ctx.strokeStyle="#2C2C31";ctx.lineWidth=1;ctx.stroke();ctx.restore();
    for(var fi=0;fi<features.length;fi++){
      var fy=ry+mm(1.5)+fi*featRowH;
      if(fi>0){drawLine(ctx,rightX+mm(2.5),fy,rightX+rpW-mm(2.5),fy,"#2C2C31",0.5);}
      // green check icon
      ctx.save();roundRect(ctx,rightX+mm(2.5),fy+mm(1),mm(3.5),mm(3.5),mm(0.8));ctx.fillStyle="#1F1F23";ctx.fill();ctx.restore();
      ctx.strokeStyle="#34C759";ctx.lineWidth=mm(0.35);ctx.lineCap="round";ctx.lineJoin="round";
      ctx.beginPath();
      var ckx=rightX+mm(3.2);var cky=fy+mm(2.8);
      ctx.moveTo(ckx,cky);ctx.lineTo(ckx+mm(0.7),cky+mm(0.7));ctx.lineTo(ckx+mm(1.8),cky-mm(0.5));ctx.stroke();
      drawText(ctx,features[fi],rightX+mm(7.5),fy+mm(1.3),{size:3.8,weight:400,color:"#D4D4D8"});
    }
    ry+=features.length*featRowH+mm(5);

    // ─ Pricing (if enabled)
    if(showPrice){
      drawText(ctx,"PRICING",rightX,ry,{size:3.2,weight:600,color:"#3F3F46"});
      ry+=mm(4.5);
      var priceH=mm(14);
      ctx.save();roundRect(ctx,rightX,ry,rpW,priceH,mm(2.5));
      ctx.fillStyle="#18181B";ctx.fill();ctx.strokeStyle="#2C2C31";ctx.lineWidth=1;ctx.stroke();ctx.restore();
      // price left
      drawText(ctx,"$"+car.price.toLocaleString(),rightX+mm(5),ry+mm(3),{size:9,weight:700,color:"#F4F4F5"});
      ctx.font="700 "+mm(9)+"px -apple-system,Helvetica,Arial,sans-serif";
      var priceTextW=ctx.measureText("$"+car.price.toLocaleString()).width;
      drawText(ctx,"/day",rightX+mm(5)+priceTextW+mm(1),ry+mm(5),{size:4,weight:400,color:"#52525B"});
      // deposit right
      drawText(ctx,"Deposit: $"+String(car.deposit||car.price).toLocaleString(),rightX+rpW-mm(5),ry+mm(4),{size:4.5,weight:500,color:"#A1A1AA",align:"right"});
      drawText(ctx,"Fully refundable",rightX+rpW-mm(5),ry+mm(9),{size:3,weight:400,color:"#52525B",align:"right"});
    }

    // ─ Footer
    drawLine(ctx,pad,CH-mm(9),CW-pad,CH-mm(9),"#2C2C31",0.5);
    drawMark(ctx,pad+mm(3),CH-mm(5.5),3.5,"#3F3F46");
    drawText(ctx,"ALFRED CONCIERGE",pad+mm(7),CH-mm(7),{size:3,weight:500,color:"#3F3F46"});
    drawText(ctx,"alfredconcierge.app",CW-pad,CH-mm(7),{size:3,weight:400,color:"#3F3F46",align:"right"});

    return p.canvas;
  }

  /* ── Closing page ── */
  function renderClosing(clientName){
    var p=createPage();var ctx=p.ctx;
    var grad=ctx.createLinearGradient(0,0,0,CH);
    grad.addColorStop(0,"rgba(24,24,27,0.2)");grad.addColorStop(1,"rgba(10,10,11,0)");
    ctx.fillStyle=grad;ctx.fillRect(0,0,CW,CH);
    // top line
    var lg=ctx.createLinearGradient(CW*0.2,0,CW*0.8,0);
    lg.addColorStop(0,"transparent");lg.addColorStop(0.5,"rgba(244,244,245,0.06)");lg.addColorStop(1,"transparent");
    ctx.strokeStyle=lg;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(CW*0.2,mm(50));ctx.lineTo(CW*0.8,mm(50));ctx.stroke();
    // Mark
    drawMark(ctx,CW/2,mm(70),16,"#F4F4F5");
    // Thank You
    drawText(ctx,"Thank You",CW/2,mm(85),{size:30,weight:700,color:"#F4F4F5",align:"center"});
    drawText(ctx,clientName,CW/2,mm(98),{size:14,weight:400,color:"#A1A1AA",align:"center"});
    // divider
    drawLine(ctx,CW/2-mm(20),mm(112),CW/2+mm(20),mm(112),"#2C2C31",1);
    // Contact info
    drawText(ctx,"A L F R E D   C O N C I E R G E",CW/2,mm(120),{size:6,weight:500,color:"#52525B",align:"center"});
    drawText(ctx,"alfredconcierge.app",CW/2,mm(128),{size:8,weight:400,color:"#71717A",align:"center"});
    drawText(ctx,"Premium Luxury Concierge · Miami · Paris · Worldwide",CW/2,mm(136),{size:5,weight:400,color:"#3F3F46",align:"center"});
    // watermark
    ctx.globalAlpha=0.015;drawMark(ctx,CW/2,mm(160),60,"#F4F4F5");ctx.globalAlpha=1;
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

      // ─ Build PDF
      var doc=new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});

      // Cover
      var coverCanvas=renderCover(clientName);
      doc.addImage(coverCanvas.toDataURL("image/jpeg",0.95),"JPEG",0,0,PW,PH);

      // Car pages
      for(var i=0;i<selectedCars.length;i++){
        var c=selectedCars[i];
        var imgIdx=i*5;
        var hero=allImages[imgIdx];
        var thumbs=[allImages[imgIdx+1],allImages[imgIdx+2],allImages[imgIdx+3],allImages[imgIdx+4]];
        doc.addPage();
        var carCanvas=renderCarPage(c,hero,thumbs,showPricing,i+1,totalPages);
        doc.addImage(carCanvas.toDataURL("image/jpeg",0.95),"JPEG",0,0,PW,PH);
      }

      // Closing
      doc.addPage();
      var closeCanvas=renderClosing(clientName);
      doc.addImage(closeCanvas.toDataURL("image/jpeg",0.95),"JPEG",0,0,PW,PH);

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
