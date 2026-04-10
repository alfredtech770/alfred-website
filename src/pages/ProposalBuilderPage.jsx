import { useState, useEffect, useRef } from "react";
import CARS from "../data/cars";
import SEOHead from "../components/SEOHead";
import { jsPDF } from "jspdf";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",gold:"#FFD60A"};

function Mark(p){
  return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><path d="M42 18 C42 30 34 38 22 38 C34 38 42 46 42 58 C42 46 50 38 62 38 C50 38 42 30 42 18Z" fill={p.color||C.s1}/><path d="M58 42 C58 54 50 62 38 62 C50 62 58 70 58 82 C58 70 66 62 78 62 C66 62 58 54 58 42Z" fill={p.color||C.s1}/></svg>);
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

function FilterDrop(p){
  var [open,setOpen]=useState(false);
  var [pos,setPos]=useState(null);
  var ref=useRef(null);
  var btnRef=useRef(null);
  var isMobile=typeof window!=="undefined"&&window.innerWidth<=768;
  useEffect(function(){
    if(!open) return;
    if(isMobile&&btnRef.current){var r=btnRef.current.getBoundingClientRect();setPos({top:r.bottom+6,left:Math.max(8,Math.min(r.left,window.innerWidth-220))})}
    var timer=setTimeout(function(){
      function h(e){if(ref.current&&!ref.current.contains(e.target)&&!(isMobile&&e.target.closest&&e.target.closest("[data-filter-drop]")))setOpen(false)}
      document.addEventListener("pointerdown",h);
      document.addEventListener("touchstart",h,{passive:true});
      ref.current._cleanup=function(){document.removeEventListener("pointerdown",h);document.removeEventListener("touchstart",h)}
    },10);
    return function(){clearTimeout(timer);if(ref.current&&ref.current._cleanup){ref.current._cleanup();ref.current._cleanup=null};setPos(null)}
  },[open]);
  var hasActive=p.value!==p.options[0];
  var dropStyle=isMobile&&pos?{position:"fixed",top:pos.top,left:pos.left,borderRadius:14,background:"#111113",border:"1px solid rgba(255,255,255,0.12)",overflowY:"auto",overflowX:"hidden",zIndex:99999,minWidth:200,maxWidth:"calc(100vw - 16px)",maxHeight:"min(320px, calc(100vh - "+(pos.top+16)+"px))",boxShadow:"0 16px 48px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)",WebkitOverflowScrolling:"touch"}:{position:"absolute",top:"100%",left:0,marginTop:6,borderRadius:14,background:"#111113",border:"1px solid rgba(255,255,255,0.12)",overflowY:"auto",overflowX:"hidden",zIndex:9999,minWidth:180,maxWidth:"min(280px, calc(100vw - 32px))",maxHeight:320,boxShadow:"0 16px 48px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)",WebkitOverflowScrolling:"touch"};
  return(
    <div ref={ref} style={{position:"relative",WebkitTapHighlightColor:"transparent"}} data-filter-drop="true">
      <div ref={btnRef} onClick={function(e){e.stopPropagation();setOpen(!open)}} style={{display:"flex",alignItems:"center",gap:6,padding:"0 16px",height:40,borderRadius:12,background:hasActive?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(hasActive?"rgba(244,244,245,0.15)":open?C.s7:C.bd),cursor:"pointer",transition:"all 0.3s",whiteSpace:"nowrap",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",touchAction:"manipulation"}} onPointerEnter={function(e){if(e.pointerType==="mouse"&&!open)e.currentTarget.style.borderColor=C.s7}} onPointerLeave={function(e){if(e.pointerType==="mouse"&&!open&&!hasActive)e.currentTarget.style.borderColor=C.bd}}>
        {p.icon}
        <span style={{...sf(11,hasActive?600:400),color:hasActive?C.s1:C.s5}}>{p.value}</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2.5" strokeLinecap="round" style={{marginLeft:2}}><path d="M6 9l6 6 6-6"/></svg>
      </div>
      {open&&<div style={dropStyle}>
        {p.options.map(function(opt){
          var active=p.value===opt;
          return <div key={opt} onClick={function(e){e.stopPropagation();p.onChange(opt);setOpen(false)}} style={{padding:"13px 16px",cursor:"pointer",background:active?"rgba(244,244,245,0.04)":"transparent",borderBottom:"1px solid rgba(44,44,49,0.5)",display:"flex",alignItems:"center",gap:8,...sf(13,active?600:400),color:active?C.s1:C.s4,WebkitTapHighlightColor:"transparent",touchAction:"manipulation"}} onPointerEnter={function(e){if(e.pointerType==="mouse")e.currentTarget.style.background="rgba(244,244,245,0.06)"}} onPointerLeave={function(e){if(e.pointerType==="mouse")e.currentTarget.style.background=active?"rgba(244,244,245,0.04)":"transparent"}}>
            {active&&<div style={{width:4,height:4,borderRadius:"50%",background:C.gn}}/>}
            {opt}
          </div>
        })}
      </div>}
    </div>
  );
}

function ProposalBuilderPage(){
  var [clientName,setClientName]=useState("");
  var [showPricing,setShowPricing]=useState(false);
  var [selected,setSelected]=useState(new Set());
  var [pricingDays,setPricingDays]=useState(1);
  var [customPrices,setCustomPrices]=useState({});// {carIdx: customDailyRate}
  var [showBranding,setShowBranding]=useState(true);
  var [generating,setGenerating]=useState(false);
  var [error,setError]=useState("");
  var containerRef=useRef(null);

  /* ── Filter state ── */
  var [city,setCity]=useState("All Cities");
  var [brand,setBrand]=useState("Brand");
  var [bodyType,setBodyType]=useState("Type");
  var [priceRange,setPriceRange]=useState("Price");
  var [seats,setSeats]=useState("Seats");
  var [hpRange,setHpRange]=useState("Power");
  var [driveType,setDriveType]=useState("Drive");
  var [sort,setSort]=useState("Featured");

  var brands=["Brand"].concat(CARS.map(function(c){return c.brand}).filter(function(v,i,a){return a.indexOf(v)===i}).sort());

  /* ── Filter logic ── */
  var filteredWithIdx=CARS.map(function(c,i){return{car:c,idx:i}}).filter(function(o){
    var c=o.car;
    if(city!=="All Cities"&&c.locs.indexOf(city)===-1) return false;
    if(brand!=="Brand"&&c.brand!==brand) return false;
    if(bodyType!=="Type"&&c.body!==bodyType) return false;
    if(driveType!=="Drive"&&c.drive!==driveType) return false;
    if(seats==="2 Seats"&&c.seats!==2) return false;
    if(seats==="4 Seats"&&c.seats!==4) return false;
    if(seats==="5+ Seats"&&c.seats<5) return false;
    if(hpRange==="Under 600hp"&&c.hp>=600) return false;
    if(hpRange==="600-800hp"&&(c.hp<600||c.hp>800)) return false;
    if(hpRange==="800hp+"&&c.hp<800) return false;
    if(priceRange==="Under $1,500"&&c.price>=1500) return false;
    if(priceRange==="$1,500–$3,000"&&(c.price<1500||c.price>3000)) return false;
    if(priceRange==="$3,000+"&&c.price<3000) return false;
    return true;
  });

  if(sort==="Price: Low") filteredWithIdx=filteredWithIdx.slice().sort(function(a,b){return a.car.price-b.car.price});
  else if(sort==="Price: High") filteredWithIdx=filteredWithIdx.slice().sort(function(a,b){return b.car.price-a.car.price});
  else if(sort==="Most Powerful") filteredWithIdx=filteredWithIdx.slice().sort(function(a,b){return b.car.hp-a.car.hp});
  else if(sort==="Fastest") filteredWithIdx=filteredWithIdx.slice().sort(function(a,b){return parseFloat(a.car.accel)-parseFloat(b.car.accel)});

  var activeFilters=[city!=="All Cities"?city:null,brand!=="Brand"?brand:null,bodyType!=="Type"?bodyType:null,seats!=="Seats"?seats:null,hpRange!=="Power"?hpRange:null,priceRange!=="Price"?priceRange:null,driveType!=="Drive"?driveType:null].filter(Boolean);
  var clearAll=function(){setCity("All Cities");setBrand("Brand");setBodyType("Type");setSeats("Seats");setHpRange("Power");setPriceRange("Price");setDriveType("Drive")};

  /* Filter icons */
  var iconBody=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>;
  var iconSeat=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
  var iconHP=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
  var iconPrice=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
  var iconDrive=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/></svg>;
  var iconBrand=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
  var iconCity=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
  var iconSort=<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M3 6h18M6 12h12M9 18h6"/></svg>;

  var TIERS=[{d:1,disc:0},{d:3,disc:5},{d:7,disc:10},{d:14,disc:15},{d:30,disc:20}];

  function toggleCar(id){
    var newSet=new Set(selected);
    if(newSet.has(id)){newSet.delete(id)}else{newSet.add(id)}
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
    ctx.fillStyle=color||"#F4F4F5";
    // Top star (offset upper-left)
    var tx=cx-s*0.16;var ty=cy-s*0.32;
    ctx.beginPath();
    ctx.moveTo(tx,ty-s*0.4);
    ctx.bezierCurveTo(tx,ty-s*0.16,tx-s*0.24,ty,tx-s*0.4,ty);
    ctx.bezierCurveTo(tx-s*0.16,ty,tx,ty+s*0.16,tx,ty+s*0.4);
    ctx.bezierCurveTo(tx,ty+s*0.16,tx+s*0.24,ty,tx+s*0.4,ty);
    ctx.bezierCurveTo(tx+s*0.16,ty,tx,ty-s*0.16,tx,ty-s*0.4);
    ctx.fill();
    // Bottom star (offset lower-right)
    var bx=cx+s*0.16;var by=cy+s*0.32;
    ctx.beginPath();
    ctx.moveTo(bx,by-s*0.4);
    ctx.bezierCurveTo(bx,by-s*0.16,bx-s*0.24,by,bx-s*0.4,by);
    ctx.bezierCurveTo(bx-s*0.16,by,bx,by+s*0.16,bx,by+s*0.4);
    ctx.bezierCurveTo(bx,by+s*0.16,bx+s*0.24,by,bx+s*0.4,by);
    ctx.bezierCurveTo(bx+s*0.16,by,bx,by-s*0.16,bx,by-s*0.4);
    ctx.fill();
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
  function renderCarPage(car,heroImg,galleryImgs,showPrice,pageNum,totalPages,days,customPrice,branding){
    var p=createPage();var ctx=p.ctx;
    var pad=mm(12);var contentW=CW-pad*2;
    var y=0;

    // ═══ 1. HERO IMAGE ═══
    var heroH=mm(93);
    if(heroImg){
      ctx.save();ctx.beginPath();ctx.rect(0,0,CW,heroH);ctx.clip();
      var iw=heroImg.width;var ih=heroImg.height;
      var scale=Math.max(CW/iw,heroH/ih);
      ctx.drawImage(heroImg,(CW-iw*scale)/2,(heroH-ih*scale)/2,iw*scale,ih*scale);
      var topGrad=ctx.createLinearGradient(0,0,0,mm(22));
      topGrad.addColorStop(0,"rgba(10,10,11,0.45)");topGrad.addColorStop(1,"rgba(10,10,11,0)");
      ctx.fillStyle=topGrad;ctx.fillRect(0,0,CW,mm(22));
      var botGrad=ctx.createLinearGradient(0,heroH-mm(28),0,heroH);
      botGrad.addColorStop(0,"rgba(10,10,11,0)");botGrad.addColorStop(1,"#0A0A0B");
      ctx.fillStyle=botGrad;ctx.fillRect(0,heroH-mm(28),CW,mm(28));
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

    y=heroH+mm(2);

    // ═══ 2. THREE GALLERY THUMBNAILS ═══
    var availThumbs=galleryImgs.filter(function(g){return g!==null});
    var numThumbs=Math.min(availThumbs.length,3);
    var thumbH=mm(33);var thumbGap=mm(2);
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
      y+=thumbH+mm(5);
    }else{
      y+=mm(3);
    }

    // ═══ 3. VERIFIED BADGE ═══
    if(branding){
      var verBadge="✦  ALFRED VERIFIED";
      ctx.font="600 "+mm(2.5)+"px -apple-system,Helvetica,Arial,sans-serif";
      var verW=ctx.measureText(verBadge).width+mm(4);
      ctx.save();roundRect(ctx,pad,y,verW,mm(4.5),mm(1.5));
      ctx.fillStyle="rgba(52,199,89,0.05)";ctx.fill();ctx.strokeStyle="rgba(52,199,89,0.12)";ctx.lineWidth=mm(0.15);ctx.stroke();ctx.restore();
      drawText(ctx,verBadge,pad+mm(2),y+mm(1),{size:2.5,weight:600,color:"rgba(52,199,89,0.8)"});
      y+=mm(7);
    }

    // ═══ 4. CAR NAME ═══
    var nameSize=12;
    ctx.font="700 "+mm(nameSize)+"px -apple-system,Helvetica,Arial,sans-serif";
    while(ctx.measureText(String(car.name)).width>contentW&&nameSize>7){nameSize-=0.5;ctx.font="700 "+mm(nameSize)+"px -apple-system,Helvetica,Arial,sans-serif";}
    drawText(ctx,String(car.name),pad,y,{size:nameSize,weight:700,color:"#F4F4F5"});
    y+=mm(nameSize*0.42+9);

    // ═══ 5. LOCATION ═══
    var locText=String((car.locs||[]).join(", ")||"Miami");
    drawText(ctx,locText,pad,y,{size:3.5,weight:400,color:"#71717A"});
    y+=mm(7);

    // ═══ 6. PRICE ═══
    if(showPrice){
      var pDays=days||1;
      var pRate;
      var pDisc=0;
      if(customPrice!==null&&customPrice!==undefined){
        pRate=customPrice;
        pDisc=0;
        pDays=pDays===0?1:pDays;
      }else if(pDays===0){
        pRate=car.price;
      }else{
        var pTier=[{d:1,disc:0},{d:3,disc:5},{d:7,disc:10},{d:14,disc:15},{d:30,disc:20}].filter(function(t){return t.d===pDays})[0]||{d:1,disc:0};
        pRate=Math.round(car.price*(1-pTier.disc/100));
        pDisc=pTier.disc;
      }
      // Price amount
      drawText(ctx,"$"+pRate.toLocaleString(),pad,y,{size:9,weight:700,color:"#F4F4F5"});
      ctx.font="700 "+mm(9)+"px -apple-system,Helvetica,Arial,sans-serif";
      var pw=ctx.measureText("$"+pRate.toLocaleString()).width;
      // /day right after price
      drawText(ctx," /day",pad+pw+mm(1),y+mm(2),{size:3.2,weight:400,color:"#52525B"});
      ctx.font="400 "+mm(3.2)+"px -apple-system,Helvetica,Arial,sans-serif";
      var dayW=ctx.measureText(" /day").width;
      // discount badge after /day with proper gap
      if(pDisc>0){
        var discX=pad+pw+mm(1)+dayW+mm(3);
        var discTxt="-"+pDisc+"%";
        ctx.font="600 "+mm(2.8)+"px -apple-system,Helvetica,Arial,sans-serif";
        var discW=ctx.measureText(discTxt).width+mm(3);
        ctx.save();roundRect(ctx,discX,y+mm(1.2),discW,mm(4.5),mm(1.5));
        ctx.fillStyle="rgba(52,199,89,0.1)";ctx.fill();ctx.restore();
        drawText(ctx,discTxt,discX+mm(1.5),y+mm(1.8),{size:2.8,weight:600,color:C.gn});
      }
      // Multi-day total on second line
      if(pDays>1){
        drawText(ctx,pDays+" days · $"+(pRate*pDays).toLocaleString()+" total",pad,y+mm(10),{size:3,weight:500,color:"#71717A"});
      }
      y+=mm(pDays>1?16:13);
    }

    // ═══ 7. DIVIDER ═══
    var divGrad=ctx.createLinearGradient(pad,0,CW-pad,0);
    divGrad.addColorStop(0,"transparent");divGrad.addColorStop(0.15,"#2C2C31");divGrad.addColorStop(0.85,"#2C2C31");divGrad.addColorStop(1,"transparent");
    ctx.strokeStyle=divGrad;ctx.lineWidth=mm(0.15);ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(CW-pad,y);ctx.stroke();
    y+=mm(5);

    // ═══ 8. PERFORMANCE — 3 spec cards ═══
    drawText(ctx,"PERFORMANCE",pad,y,{size:2.5,weight:600,color:"#52525B"});
    y+=mm(5);
    var specBoxW=(contentW-mm(3))/3;var specBoxH=mm(23);var specGap=mm(1.5);
    var perfSpecs=[
      {emoji:"⚡",val:String(car.hp||"—"),unit:" hp",label:"Power"},
      {emoji:"⏱",val:String(car.accel||"—"),unit:"s",label:"0-100 km/h"},
      {emoji:"🏁",val:String(car.top||"—"),unit:" km/h",label:"Top speed"}
    ];
    for(var si=0;si<3;si++){
      var bx=pad+si*(specBoxW+specGap);
      ctx.save();roundRect(ctx,bx,y,specBoxW,specBoxH,mm(2.5));
      ctx.fillStyle="#141416";ctx.fill();ctx.strokeStyle="#232328";ctx.lineWidth=mm(0.15);ctx.stroke();ctx.restore();
      drawText(ctx,perfSpecs[si].emoji,bx+specBoxW/2,y+mm(3),{size:3.5,align:"center"});
      drawText(ctx,perfSpecs[si].val+perfSpecs[si].unit,bx+specBoxW/2,y+mm(8.5),{size:5.5,weight:700,color:"#F4F4F5",align:"center"});
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
      drawText(ctx,details[di].v,dx+mm(3.5),dy+mm(7.8),{size:3.8,weight:600,color:"#E4E4E7",maxWidth:dColW-mm(7)});
    }
    y+=2*(dRowH+dGap)+mm(4);

    // ═══ 10. WHAT'S INCLUDED ═══
    var features=[(car.locs||[]).some(function(l){return l.indexOf("Paris")!==-1})?"100 KM per day":"100 Miles per day","24/7 roadside assistance"];
    var featRowH=mm(7);
    ctx.save();roundRect(ctx,pad,y,contentW,features.length*featRowH+mm(2.5),mm(2));
    ctx.fillStyle="#141416";ctx.fill();ctx.strokeStyle="#232328";ctx.lineWidth=mm(0.15);ctx.stroke();ctx.restore();
    for(var fi=0;fi<features.length;fi++){
      var fy=y+mm(1.5)+fi*featRowH;
      if(fi>0){drawLine(ctx,pad+mm(3),fy,pad+contentW-mm(3),fy,"#232328",mm(0.15));}
      ctx.save();
      ctx.beginPath();ctx.arc(pad+mm(5.5),fy+mm(3.5),mm(2),0,Math.PI*2);
      ctx.fillStyle="rgba(52,199,89,0.08)";ctx.fill();ctx.restore();
      ctx.strokeStyle="#34C759";ctx.lineWidth=mm(0.35);ctx.lineCap="round";ctx.lineJoin="round";
      ctx.beginPath();
      var ckx=pad+mm(4.3);var cky=fy+mm(3.5);
      ctx.moveTo(ckx,cky);ctx.lineTo(ckx+mm(1),cky+mm(1));ctx.lineTo(ckx+mm(2.4),cky-mm(0.7));ctx.stroke();
      drawText(ctx,features[fi],pad+mm(10),fy+mm(1.8),{size:3.5,weight:400,color:"#D4D4D8"});
    }
    y+=features.length*featRowH+mm(5);

    // ═══ 11. DEPOSIT (if pricing shown) ═══
    if(showPrice){
      ctx.save();roundRect(ctx,pad,y,contentW,mm(13),mm(2));
      ctx.fillStyle="rgba(244,244,245,0.015)";ctx.fill();ctx.strokeStyle="#232328";ctx.lineWidth=mm(0.15);ctx.stroke();ctx.restore();
      drawText(ctx,"Security deposit",pad+mm(5),y+mm(2.8),{size:3.8,weight:500,color:"#E4E4E7"});
      drawText(ctx,"Pre-authorised · fully refundable",pad+mm(5),y+mm(8),{size:2.5,weight:400,color:"#52525B"});
      drawText(ctx,"$"+String(car.deposit||car.price).toLocaleString(),CW-pad-mm(5),y+mm(4),{size:6.5,weight:700,color:"#F4F4F5",align:"right"});
    }

    // ═══ FOOTER ═══
    if(branding){
      drawLine(ctx,pad,CH-mm(8),CW-pad,CH-mm(8),"#232328",mm(0.15));
      drawMark(ctx,pad+mm(3),CH-mm(5),3,"#3F3F46");
      drawText(ctx,"ALFRED CONCIERGE",pad+mm(7),CH-mm(6),{size:2.3,weight:500,color:"#3F3F46"});
      drawText(ctx,"alfredconcierge.app",CW-pad,CH-mm(6),{size:2.3,weight:400,color:"#3F3F46",align:"right"});
    }

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
      var selectedIndices=[];CARS.forEach(function(_,idx){if(selected.has(idx))selectedIndices.push(idx)});
      var selectedCars=selectedIndices.map(function(idx){return CARS[idx]});
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
        var cp=typeof customPrices[selectedIndices[i]]==="number"?customPrices[selectedIndices[i]]:null;
        var carCanvas=renderCarPage(c,hero,thumbs,showPricing,i+1,totalPages,pricingDays,cp,showBranding);
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
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(10,10,11,0.95)",backdropFilter:"blur(30px) saturate(1.3)",borderBottom:"1px solid rgba(44,44,49,0.8)",transition:"all 0.3s"}}>
      <a href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
        <Mark size={28} color={C.s1}/>
      </a>
      <div style={{display:"flex",alignItems:"center",gap:28}}>
        <a href="/" style={{...sf(11,400),color:C.s5,letterSpacing:0.3,textDecoration:"none",transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Home</a>
        <a href="/catalog" style={{...sf(11,400),color:C.s5,letterSpacing:0.3,textDecoration:"none",transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Catalog</a>
        <div style={{...sf(11,400),color:C.s1,letterSpacing:0.3}}>Proposal</div>
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

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px",backgroundColor:C.srf,borderRadius:8,marginTop:8}}>
            <span style={{...sf(14,500),color:C.s1}}>Show Branding</span>
            <Toggle on={showBranding} onChange={function(){setShowBranding(!showBranding)}}/>
          </div>

          {/* Pricing Duration Selector */}
          {showPricing&&<div style={{marginTop:16}}>
            <label style={{...sf(12,500),color:C.s5,display:"block",marginBottom:8}}>Quote duration</label>
            <div style={{display:"flex",gap:6}}>
              {TIERS.map(function(t){
                var isActive=pricingDays===t.d;
                return <div key={t.d} onClick={function(){setPricingDays(t.d)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,cursor:"pointer",transition:"all 0.2s",background:isActive?"rgba(52,199,89,0.1)":C.el,border:"1.5px solid "+(isActive?C.gn:C.bd)}}>
                  <div style={{...sf(13,600),color:isActive?C.s1:C.s4}}>{t.d} {t.d===1?"day":"days"}</div>
                  {t.disc>0&&<div style={{...sf(11,500),color:C.gn,marginTop:2}}>-{t.disc}%</div>}
                </div>
              })}
              <div onClick={function(){setPricingDays(0)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,cursor:"pointer",transition:"all 0.2s",background:pricingDays===0?"rgba(255,214,10,0.1)":C.el,border:"1.5px solid "+(pricingDays===0?C.gold:C.bd)}}>
                <div style={{...sf(13,600),color:pricingDays===0?C.s1:C.s4}}>Custom</div>
                <div style={{...sf(11,500),color:C.gold,marginTop:2}}>per car</div>
              </div>
            </div>
            {pricingDays===0&&<div style={{marginTop:10,padding:"10px 14px",backgroundColor:C.el,borderRadius:8,border:"1px solid "+C.bd}}>
              <span style={{...sf(12),color:C.s5}}>Enter a custom price on each car card below</span>
            </div>}
          </div>}
        </div>
      </div>

      {/* Error message */}
      {error&&<div style={{paddingLeft:24,paddingRight:24,marginBottom:24,padding:"12px 16px",backgroundColor:"rgba(239, 68, 68, 0.1)",border:`1px solid rgba(239, 68, 68, 0.3)`,borderRadius:8,...sf(14),color:"#FCA5A5"}}>
        {error}
      </div>}

      {/* ═══ FILTERS ═══ */}
      <div style={{paddingLeft:24,paddingRight:24,marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",position:"relative",zIndex:50}}>
          <FilterDrop value={city} options={["All Cities","Miami","Paris","Ibiza","Monaco","New York","London"]} onChange={setCity} icon={iconCity}/>
          <FilterDrop value={brand} options={brands} onChange={setBrand} icon={iconBrand}/>
          <FilterDrop value={bodyType} options={["Type","Coupe","Convertible","SUV","Sedan","Hatchback","Van"]} onChange={setBodyType} icon={iconBody}/>
          <FilterDrop value={priceRange} options={["Price","Under $1,500","$1,500–$3,000","$3,000+"]} onChange={setPriceRange} icon={iconPrice}/>
          <FilterDrop value={seats} options={["Seats","2 Seats","4 Seats","5+ Seats"]} onChange={setSeats} icon={iconSeat}/>
          <FilterDrop value={hpRange} options={["Power","Under 600hp","600-800hp","800hp+"]} onChange={setHpRange} icon={iconHP}/>
          <FilterDrop value={driveType} options={["Drive","AWD","RWD"]} onChange={setDriveType} icon={iconDrive}/>
          <div style={{width:1,height:20,background:C.bd,flexShrink:0}}/>
          <FilterDrop value={sort} options={["Featured","Price: Low","Price: High","Most Powerful","Fastest"]} onChange={setSort} icon={iconSort}/>
        </div>
        {/* Active filter tags */}
        {activeFilters.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginTop:16}}>
          {activeFilters.map(function(f){
            return <span key={f} style={{...sf(11,500),color:C.s1,padding:"5px 12px",borderRadius:8,background:"rgba(244,244,245,0.06)",border:"1px solid rgba(244,244,245,0.1)"}}>{f}</span>
          })}
          {activeFilters.length>1&&<span onClick={clearAll} style={{...sf(11,500),color:C.s5,padding:"5px 12px",borderRadius:8,cursor:"pointer",transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Clear all</span>}
        </div>}
      </div>

      {/* Car Selection Grid */}
      <div style={{paddingLeft:24,paddingRight:24}}>
        {filteredWithIdx.length===0?(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:40,marginBottom:16}}>🏎️</div>
            <h3 style={{...sf(20,600),color:C.s3,marginBottom:8}}>No cars match your filters</h3>
            <p style={{...sf(14),color:C.s5,marginBottom:24}}>Try adjusting your filters.</p>
            <div onClick={clearAll} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"12px 24px",borderRadius:12,border:"1px solid "+C.bd,cursor:"pointer",...sf(13,500),color:C.s4,transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>Clear all filters</div>
          </div>
        ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:20}}>
          {filteredWithIdx.map(function(o){
            var car=o.car;var idx=o.idx;
            var isSelected=selected.has(idx);
            var activeTier=TIERS.filter(function(t){return t.d===pricingDays})[0]||TIERS[0];
            var displayRate=Math.round(car.price*(1-activeTier.disc/100));
            return(<div
              key={idx}
              onClick={function(){toggleCar(idx)}}
              style={{position:"relative",backgroundColor:C.el,border:"2px solid "+(isSelected?C.gn:C.bd),borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"all 0.2s ease",transform:isSelected?"scale(0.98)":"scale(1)"}}>

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
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12,paddingBottom:12,borderBottom:"1px solid "+C.bd}}>
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
                {pricingDays===0?(
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{...sf(14,500),color:C.s5}}>$</span>
                      <input
                        type="number"
                        value={customPrices[idx]||""}
                        onClick={function(e){e.stopPropagation()}}
                        onChange={function(e){e.stopPropagation();var v=Object.assign({},customPrices);v[idx]=e.target.value?parseInt(e.target.value):"";setCustomPrices(v)}}
                        placeholder={String(car.price)}
                        style={{width:100,padding:"6px 10px",backgroundColor:C.bg,border:"1px solid "+C.bd,borderRadius:6,...sf(14,600),color:C.gold,outline:"none",boxSizing:"border-box"}}
                        onFocus={function(e){e.target.style.borderColor=C.gold}}
                        onBlur={function(e){e.target.style.borderColor=C.bd}}
                      />
                      <span style={{...sf(12),color:C.s5}}>/day</span>
                    </div>
                    {typeof customPrices[idx]==="number"&&customPrices[idx]!==car.price&&<div style={{...sf(11),color:C.s5,marginTop:4,textDecoration:"line-through"}}>${car.price.toLocaleString()}/day original</div>}
                  </div>
                ):(
                  <div>
                    <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                      <span style={{...sf(16,700),color:typeof customPrices[idx]==="number"?C.gold:C.gn}}>${typeof customPrices[idx]==="number"?customPrices[idx].toLocaleString():displayRate.toLocaleString()}</span>
                      <span style={{...sf(12),color:C.s5}}>/{pricingDays===1?"day":pricingDays+"d"}</span>
                      {typeof customPrices[idx]!=="number"&&activeTier.disc>0&&<span style={{...sf(11,600),color:C.gn,padding:"2px 6px",borderRadius:4,background:"rgba(52,199,89,0.1)"}}>-{activeTier.disc}%</span>}
                      {typeof customPrices[idx]==="number"&&<span style={{...sf(11,600),color:C.gold,padding:"2px 6px",borderRadius:4,background:"rgba(255,214,10,0.1)"}}>custom</span>}
                    </div>
                    {typeof customPrices[idx]==="number"&&customPrices[idx]!==displayRate&&<div style={{...sf(11),color:C.s5,marginTop:2,textDecoration:"line-through"}}>${displayRate.toLocaleString()}/day tier price</div>}
                    {typeof customPrices[idx]!=="number"&&pricingDays>1&&<div style={{...sf(11),color:C.s5,marginTop:4}}>${(displayRate*pricingDays).toLocaleString()} total</div>}
                    {/* Custom price override input */}
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8,paddingTop:8,borderTop:"1px solid "+C.bd}}>
                      <span style={{...sf(11),color:C.s5}}>Custom $</span>
                      <input
                        type="number"
                        value={customPrices[idx]||""}
                        onClick={function(e){e.stopPropagation()}}
                        onChange={function(e){e.stopPropagation();var v=Object.assign({},customPrices);v[idx]=e.target.value?parseInt(e.target.value):"";setCustomPrices(v)}}
                        placeholder={String(displayRate)}
                        style={{width:80,padding:"4px 8px",backgroundColor:C.bg,border:"1px solid "+C.bd,borderRadius:5,...sf(12,600),color:C.gold,outline:"none",boxSizing:"border-box"}}
                        onFocus={function(e){e.target.style.borderColor=C.gold}}
                        onBlur={function(e){e.target.style.borderColor=C.bd}}
                      />
                      <span style={{...sf(11),color:C.s5}}>/day</span>
                      {typeof customPrices[idx]==="number"&&<span onClick={function(e){e.stopPropagation();var v=Object.assign({},customPrices);delete v[idx];setCustomPrices(v)}} style={{...sf(11),color:C.s5,cursor:"pointer",marginLeft:2}}>✕</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>);
          })}
        </div>)}
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
        <div style={{width:40,height:40,margin:"0 auto 16px",animation:"spin 2s ease-in-out infinite"}}><svg width="40" height="40" viewBox="0 0 100 100" fill="none"><path d="M42 18 C42 30 34 38 22 38 C34 38 42 46 42 58 C42 46 50 38 62 38 C50 38 42 30 42 18Z" fill={C.s1} opacity="0.9"/><path d="M58 42 C58 54 50 62 38 62 C50 62 58 70 58 82 C58 70 66 62 78 62 C66 62 58 54 58 42Z" fill={C.s1} opacity="0.5"/></svg></div>
        <p style={{...sf(16),color:C.s1,margin:0}}>Generating PDF...</p>
        <p style={{...sf(12),color:C.s5,margin:"8px 0 0 0"}}>Processing images and formatting</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>}
  </div>);
}

export default ProposalBuilderPage;
