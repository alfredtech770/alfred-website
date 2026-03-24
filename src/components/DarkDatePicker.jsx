import { useState, useRef, useEffect } from "react";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759"};

var MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
var DAYS=["Su","Mo","Tu","We","Th","Fr","Sa"];

function getDaysInMonth(y,m){return new Date(y,m+1,0).getDate()}
function getFirstDayOfWeek(y,m){return new Date(y,m,1).getDay()}
function fmt(d){
  var p=d.split("-");
  if(p.length!==3)return d;
  var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[parseInt(p[1],10)-1]+" "+parseInt(p[2],10)+", "+p[0];
}
function toYMD(y,m,d){return y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0")}

export default function DarkDatePicker(props){
  var value=props.value||"";
  var onChange=props.onChange;
  var label=props.label||"Date";
  var align=props.align||"left";

  var [open,setOpen]=useState(false);
  var ref=useRef(null);

  /* Parse current value to set initial calendar view */
  var parts=value.split("-");
  var initY=parts.length===3?parseInt(parts[0],10):2026;
  var initM=parts.length===3?parseInt(parts[1],10)-1:2;
  var [viewYear,setViewYear]=useState(initY);
  var [viewMonth,setViewMonth]=useState(initM);

  /* Close on outside click */
  useEffect(function(){
    function handler(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false)}
    document.addEventListener("mousedown",handler);
    return function(){document.removeEventListener("mousedown",handler)};
  },[]);

  function prev(){
    if(viewMonth===0){setViewMonth(11);setViewYear(viewYear-1)}
    else{setViewMonth(viewMonth-1)}
  }
  function next(){
    if(viewMonth===11){setViewMonth(0);setViewYear(viewYear+1)}
    else{setViewMonth(viewMonth+1)}
  }
  function pick(day){
    var val=toYMD(viewYear,viewMonth,day);
    onChange(val);
    setOpen(false);
  }

  var daysInMonth=getDaysInMonth(viewYear,viewMonth);
  var firstDay=getFirstDayOfWeek(viewYear,viewMonth);
  var today=new Date();var todayStr=toYMD(today.getFullYear(),today.getMonth(),today.getDate());

  /* Build calendar grid */
  var cells=[];
  for(var i=0;i<firstDay;i++) cells.push(null);
  for(var d=1;d<=daysInMonth;d++) cells.push(d);

  var selectedDay=null;
  if(parts.length===3&&parseInt(parts[0],10)===viewYear&&parseInt(parts[1],10)-1===viewMonth){
    selectedDay=parseInt(parts[2],10);
  }

  return(
    <div ref={ref} style={{position:"relative"}}>
      {/* Trigger button */}
      <div onClick={function(){setOpen(!open)}} style={{
        padding:"13px 14px",borderRadius:14,background:C.bg,border:"1px solid "+(open?C.s6:C.bd),
        color:C.s1,...sf(13,500),cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",
        transition:"border-color 0.2s",userSelect:"none"
      }}>
        <span style={{color:value?C.s1:C.s6}}>{value?fmt(value):"Select date"}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
      </div>

      {/* Dropdown calendar */}
      {open&&<div style={{
        position:"absolute",top:"calc(100% + 6px)",left:align==="right"?"auto":0,right:align==="right"?0:"auto",minWidth:280,width:280,
        zIndex:50,borderRadius:16,background:C.el,border:"1px solid "+C.bd,
        boxShadow:"0 16px 48px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.03)",
        padding:"16px 14px 12px",overflow:"hidden"
      }}>
        {/* Month/Year header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div onClick={prev} style={{width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.2s",background:"transparent"}} onMouseEnter={function(e){e.currentTarget.style.background=C.srf}} onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </div>
          <span style={{...sf(13,600),color:C.s1,letterSpacing:0.3}}>{MONTHS[viewMonth]} {viewYear}</span>
          <div onClick={next} style={{width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background 0.2s",background:"transparent"}} onMouseEnter={function(e){e.currentTarget.style.background=C.srf}} onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>

        {/* Day headers */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:0,marginBottom:4}}>
          {DAYS.map(function(day){return <div key={day} style={{textAlign:"center",padding:"4px 0",...sf(9,500),color:C.s6,letterSpacing:0.5}}>{day}</div>})}
        </div>

        {/* Day cells */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
          {cells.map(function(day,i){
            if(day===null) return <div key={"e"+i}/>;
            var isSelected=day===selectedDay;
            var dayStr=toYMD(viewYear,viewMonth,day);
            var isToday=dayStr===todayStr;
            var isPast=new Date(viewYear,viewMonth,day)<new Date(today.getFullYear(),today.getMonth(),today.getDate());
            return(
              <div key={i} onClick={function(){if(!isPast)pick(day)}} style={{
                textAlign:"center",padding:"7px 0",borderRadius:10,cursor:isPast?"default":"pointer",
                background:isSelected?"rgba(244,244,245,0.12)":"transparent",
                border:isToday&&!isSelected?"1px solid "+C.s7:"1px solid transparent",
                transition:"all 0.15s",
                opacity:isPast?0.3:1,
                ...sf(12,isSelected?600:400),
                color:isSelected?C.s1:C.s4
              }}
              onMouseEnter={function(e){if(!isPast&&!isSelected)e.currentTarget.style.background=C.srf}}
              onMouseLeave={function(e){if(!isSelected)e.currentTarget.style.background="transparent"}}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>}
    </div>
  );
}
