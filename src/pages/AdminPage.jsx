import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}

var TABLES=[
  {id:"restaurants",label:"Restaurants",icon:"🍽"},
  {id:"accommodations",label:"Hotels",icon:"🏨"},
  {id:"nightlife",label:"Nightlife",icon:"🎭"},
  {id:"wellness",label:"Wellness",icon:"🧘"},
  {id:"cars",label:"Exotic Cars",icon:"🚗"},
  {id:"yachts",label:"Yachts",icon:"⛵"},
];

function TableView(p){
  var[rows,setRows]=useState([]);
  var[loading,setLoading]=useState(true);
  var[search,setSearch]=useState("");
  var[error,setError]=useState(null);

  useEffect(function(){
    async function load(){
      setLoading(true);setError(null);
      try{
        var{data,error}=await supabase.from(p.table).select("*").order("name",{ascending:true}).limit(200);
        if(error)throw error;
        setRows(data||[]);
      }catch(e){setError(e.message||"Failed to load");}
      finally{setLoading(false);}
    }
    load();
  },[p.table]);

  var filtered=rows.filter(function(r){
    if(!search)return true;
    return Object.values(r).some(function(v){return v&&String(v).toLowerCase().includes(search.toLowerCase())});
  });

  var cols=rows.length>0?Object.keys(rows[0]).slice(0,8):[];

  return(
    <div>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:"1 1 200px"}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5" style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={function(e){setSearch(e.target.value)}} placeholder={"Search "+p.table+"..."} style={{paddingLeft:34,paddingRight:12,height:38,borderRadius:10,background:C.srf,border:"1px solid "+C.bd,color:C.s1,...sf(13),outline:"none",width:"100%",boxSizing:"border-box"}}/>
        </div>
        <span style={{...sf(12),color:C.s5}}>{loading?"Loading...":filtered.length+" rows"}</span>
      </div>

      {error&&<div style={{padding:"16px",borderRadius:12,background:"rgba(255,69,58,0.08)",border:"1px solid rgba(255,69,58,0.2)",...sf(13),color:C.red,marginBottom:16}}>{error}</div>}

      {!loading&&rows.length===0&&!error&&(
        <div style={{padding:"40px",textAlign:"center",...sf(14),color:C.s6}}>No data in this table yet.</div>
      )}

      {!loading&&rows.length>0&&(
        <div style={{overflowX:"auto",borderRadius:14,border:"1px solid "+C.bd}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
            <thead>
              <tr style={{borderBottom:"1px solid "+C.bd,background:C.srf}}>
                {cols.map(function(col){return(
                  <th key={col} style={{padding:"10px 14px",textAlign:"left",...sf(10,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",whiteSpace:"nowrap"}}>{col}</th>
                )})}
              </tr>
            </thead>
            <tbody>
              {filtered.map(function(row,i){return(
                <tr key={row.id||i} style={{borderBottom:"1px solid rgba(44,44,49,0.5)",transition:"background 0.15s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(244,244,245,0.02)"}} onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}>
                  {cols.map(function(col){
                    var val=row[col];
                    var display=val===null||val===undefined?"—":typeof val==="object"?JSON.stringify(val).slice(0,60):String(val).slice(0,80);
                    return(
                      <td key={col} style={{padding:"10px 14px",...sf(12),color:val===null||val===undefined?C.s7:C.s3,whiteSpace:"nowrap",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis"}}>{display}</td>
                    )
                  })}
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminPage(){
  var[activeTable,setActiveTable]=useState("accommodations");
  var[scrollY,setScrollY]=useState(0);
  var navOp=Math.min(scrollY/100,1);

  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(14),color:C.s1}}>
      <style>{`*{margin:0;padding:0;box-sizing:border-box}body::-webkit-scrollbar{width:0}::selection{background:${C.s7};color:${C.s1}}`}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,padding:"16px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(10,10,11,"+(0.9+navOp*0.1)+")",backdropFilter:"blur(20px)",borderBottom:"1px solid "+C.bd}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Mark size={18} color={C.s1}/>
          <span style={{...sf(13,600),color:C.s1}}>Alfred Admin</span>
          <span style={{...sf(9,500),color:C.s6,padding:"3px 8px",borderRadius:6,background:C.srf,border:"1px solid "+C.bd,letterSpacing:1,textTransform:"uppercase"}}>Internal</span>
        </div>
        <a href="/" style={{...sf(11),color:C.s5,transition:"color 0.2s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>← Back to site</a>
      </nav>

      <div style={{display:"flex",minHeight:"calc(100vh - 57px)"}}>
        {/* Sidebar */}
        <div style={{width:220,flexShrink:0,borderRight:"1px solid "+C.bd,padding:"24px 0"}}>
          <p style={{...sf(9,600),color:C.s7,letterSpacing:3,textTransform:"uppercase",padding:"0 20px 12px"}}>Tables</p>
          {TABLES.map(function(t){
            var active=t.id===activeTable;
            return(
              <div key={t.id} onClick={function(){setActiveTable(t.id)}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 20px",cursor:"pointer",background:active?"rgba(244,244,245,0.05)":"transparent",borderLeft:active?"2px solid "+C.s1:"2px solid transparent",transition:"all 0.2s",...sf(13,active?600:400),color:active?C.s1:C.s4}} onMouseEnter={function(e){if(!active)e.currentTarget.style.background="rgba(244,244,245,0.02)"}} onMouseLeave={function(e){if(!active)e.currentTarget.style.background="transparent"}}>
                <span style={{fontSize:14}}>{t.icon}</span>
                <span>{t.label}</span>
              </div>
            )
          })}
        </div>

        {/* Main */}
        <div style={{flex:1,padding:"32px 40px",overflowX:"hidden"}}>
          {TABLES.map(function(t){
            if(t.id!==activeTable)return null;
            return(
              <div key={t.id}>
                <div style={{marginBottom:24}}>
                  <h1 style={{...sf(28,600),letterSpacing:-0.5,marginBottom:6}}>{t.icon} {t.label}</h1>
                  <p style={{...sf(13),color:C.s5}}>Supabase table: <code style={{...sf(12),color:C.s4,background:C.srf,padding:"2px 6px",borderRadius:5}}>{t.id}</code></p>
                </div>
                <TableView table={t.id}/>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
