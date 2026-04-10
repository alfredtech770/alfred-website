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

  function drawAMark(doc,x,y,size){
    var s=size||20;
    var sw=Math.max(s*0.06,0.5);
    doc.setDrawColor("#F4F4F5");
    doc.setLineWidth(sw);
    doc.line(x+s*0.2,y+s*0.8,x+s*0.4,y+s*0.18);
    doc.line(x+s*0.8,y+s*0.8,x+s*0.6,y+s*0.18);
    doc.line(x+s*0.4,y+s*0.18,x+s*0.6,y+s*0.18);
    doc.line(x+s*0.32,y+s*0.56,x+s*0.68,y+s*0.56);
  }

  async function generatePDF(){
    if(!clientName.trim()){
      setError("Please enter a client name");
      return;
    }
    if(selected.size===0){
      setError("Please select at least one car");
      return;
    }
    setError("");
    setGenerating(true);

    try{
      var doc=new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});
      var pageWidth=297;
      var pageHeight=210;

      // Cover page
      doc.setFillColor(10,10,11);
      doc.rect(0,0,pageWidth,pageHeight,"F");

      drawAMark(doc,pageWidth/2-8,40,16);

      doc.setFont("helvetica","bold");
      doc.setFontSize(36);
      doc.setTextColor(244,244,245);
      doc.text("ALFRED CONCIERGE",pageWidth/2,80,{align:"center"});

      doc.setFontSize(24);
      doc.setTextColor(161,161,170);
      doc.text("Curated Selection for "+clientName,pageWidth/2,110,{align:"center"});

      var today=new Date();
      var dateStr=["January","February","March","April","May","June","July","August","September","October","November","December"][today.getMonth()]+" "+today.getDate()+", "+today.getFullYear();
      doc.setFontSize(12);
      doc.text(dateStr,pageWidth/2,pageHeight-20,{align:"center"});

      // Car pages
      var selectedCars=CARS.filter(function(car,idx){return selected.has(idx)});

      for(var i=0;i<selectedCars.length;i++){
        var car=selectedCars[i];
        doc.addPage();
        doc.setFillColor(10,10,11);
        doc.rect(0,0,pageWidth,pageHeight,"F");

        var titleX=20;
        var titleY=20;
        var imgWidth=110;
        var imgHeight=170;
        var imgX=20;
        var imgY=30;

        // Car title
        doc.setFont("helvetica","bold");
        doc.setFontSize(32);
        doc.setTextColor(244,244,245);
        doc.text(car.name,titleX,titleY);

        // Brand and body
        doc.setFontSize(14);
        doc.setTextColor(161,161,170);
        doc.text((car.brand||"")+" "+( car.body||""),titleX,titleY+12);

        // Try to load and add image
        if(car.img){
          try{
            var imgData=await imageToBase64(car.img);
            doc.addImage(imgData,"JPEG",imgX,imgY,imgWidth,imgHeight);
          }catch(e){
            // Placeholder rectangle
            doc.setFillColor(31,31,35);
            doc.rect(imgX,imgY,imgWidth,imgHeight,"F");
            doc.setTextColor(161,161,170);
            doc.setFontSize(10);
            doc.text("Image unavailable",imgX+imgWidth/2,imgY+imgHeight/2,{align:"center"});
          }
        }

        // Specs grid on right side
        var specStartX=150;
        var specStartY=30;
        var specColW=65;
        var specRowH=10;

        var specs=[
          {label:"HP",value:String(car.hp||"—")+" hp"},
          {label:"0-60",value:String(car.accel||"—")},
          {label:"Top Speed",value:String(car.top||"—")+" mph"},
          {label:"Engine",value:String(car.engine||"—")},
          {label:"Transmission",value:String(car.trans||"—")},
          {label:"Drive",value:String(car.drive||"—")},
          {label:"Seats",value:String(car.seats||2)}
        ];

        doc.setFontSize(10);
        doc.setTextColor(161,161,170);

        for(var s=0;s<specs.length;s++){
          var spec=specs[s];
          doc.text(spec.label,specStartX,specStartY+s*specRowH);
          doc.setTextColor(244,244,245);
          doc.text(spec.value,specStartX,specStartY+s*specRowH+3);
          doc.setTextColor(161,161,170);
        }

        // Pricing section if enabled
        if(showPricing){
          var priceY=specStartY+specs.length*specRowH+15;
          doc.setFillColor(31,31,35);
          doc.rect(specStartX-5,priceY-8,specColW,40,"F");

          doc.setFontSize(12);
          doc.setTextColor(52,199,89);
          doc.setFont("helvetica","bold");
          doc.text("$"+car.price.toLocaleString()+"/day",specStartX+specColW/2,priceY,{align:"center"});

          doc.setFontSize(10);
          doc.setTextColor(161,161,170);
          doc.setFont("helvetica","normal");
          doc.text("Deposit: $"+(car.deposit||car.price).toLocaleString(),specStartX+specColW/2,priceY+10,{align:"center"});
        }
      }

      // Closing page
      doc.addPage();
      doc.setFillColor(10,10,11);
      doc.rect(0,0,pageWidth,pageHeight,"F");

      doc.setFont("helvetica","bold");
      doc.setFontSize(40);
      doc.setTextColor(244,244,245);
      doc.text("Thank You",pageWidth/2,90,{align:"center"});

      doc.setFontSize(14);
      doc.setTextColor(161,161,170);
      doc.setFont("helvetica","normal");
      doc.text("ALFRED CONCIERGE",pageWidth/2,130,{align:"center"});
      doc.text("Premium Luxury Transportation",pageWidth/2,140,{align:"center"});
      doc.text("alfredconcierge.app",pageWidth/2,150,{align:"center"});

      var filename="Alfred_Proposal_"+clientName.replace(/\s+/g,"_")+".pdf";
      doc.save(filename);
      setGenerating(false);
    }catch(e){
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
