import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gd:"#FFD60A"};

var SB_URL=import.meta.env.VITE_SUPABASE_URL||"https://fbdgbnnkgyljehtccgaq.supabase.co";
var SB_SVC=import.meta.env.VITE_SUPABASE_SERVICE_KEY||"";
var ADM_PASS=import.meta.env.VITE_ADMIN_PASSWORD||"alfred2026";

function getDB(){return createClient(SB_URL,SB_SVC||"placeholder")}

var LUNCH=["11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00"];
var DINNER=["18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"];

var TABS=[
  {id:"restaurants",label:"Restaurants",table:"restaurants"},
  {id:"yachts",label:"Yachts",table:"yachts"},
  {id:"cars",label:"Cars",table:"exotic_cars"},
  {id:"wellness",label:"Wellness",table:"wellness"}
];

var REST_FIELDS=[
  {k:"name",l:"Name",t:"text",req:true},
  {k:"slug",l:"Slug",t:"text",req:true},
  {k:"cuisine",l:"Cuisine",t:"text"},
  {k:"city",l:"City",t:"text"},
  {k:"tagline",l:"Tagline",t:"text",wide:true},
  {k:"address",l:"Address",t:"text",wide:true},
  {k:"hero_image_url",l:"Hero Image URL",t:"text",wide:true},
  {k:"rating",l:"Rating (0–5)",t:"number"},
  {k:"price_level",l:"Price Level (1–4)",t:"number"},
  {k:"michelin_stars",l:"Michelin Stars",t:"number"},
  {k:"price_per_person",l:"Price / Person (€)",t:"number"},
  {k:"peak_price_per_person",l:"Peak Price / Person (€)",t:"number"},
  {k:"avg_spend",l:"Avg Spend",t:"text"},
  {k:"vibe",l:"Vibe",t:"text"},
  {k:"dress_code",l:"Dress Code",t:"text"},
  {k:"chef_name",l:"Chef Name",t:"text"},
  {k:"alfred_note",l:"Alfred's Note",t:"textarea",wide:true},
  {k:"best_for",l:"Best For (comma-separated)",t:"text",wide:true},
  {k:"available",l:"Available",t:"toggle"},
  {k:"opening_hours",l:"Available Time Slots",t:"timeslots",wide:true},
];

var YACHT_FIELDS=[
  {k:"name",l:"Name",t:"text",req:true},
  {k:"brand",l:"Brand",t:"text"},
  {k:"size_ft",l:"Size (ft)",t:"number"},
  {k:"max_passengers",l:"Max Passengers",t:"number"},
  {k:"city",l:"City",t:"text"},
  {k:"location",l:"Location",t:"text"},
  {k:"price_4hr",l:"Price 4hr (€)",t:"number"},
  {k:"price_6hr",l:"Price 6hr (€)",t:"number"},
  {k:"price_8hr",l:"Price 8hr (€)",t:"number"},
  {k:"hero_image_url",l:"Hero Image URL",t:"text",wide:true},
  {k:"available",l:"Available",t:"toggle"},
  {k:"is_featured",l:"Featured",t:"toggle"},
  {k:"is_active",l:"Active",t:"toggle"},
];

var CAR_FIELDS=[
  {k:"name",l:"Name",t:"text",req:true},
  {k:"brand",l:"Brand",t:"text"},
  {k:"category",l:"Category",t:"text"},
  {k:"price",l:"Price / Day (€)",t:"number"},
  {k:"hp",l:"Horsepower",t:"number"},
  {k:"accel",l:"0–60 (e.g. 2.4s)",t:"text"},
  {k:"top_speed",l:"Top Speed (km/h)",t:"number"},
  {k:"location",l:"Location",t:"text"},
  {k:"hero_image_url",l:"Hero Image URL",t:"text",wide:true},
  {k:"available",l:"Available",t:"toggle"},
];

var WELLNESS_FIELDS=[
  {k:"name",l:"Name",t:"text",req:true},
  {k:"type",l:"Type / Category",t:"text"},
  {k:"city",l:"City",t:"text"},
  {k:"description",l:"Description",t:"textarea",wide:true},
  {k:"price_per_person",l:"Price / Person (€)",t:"number"},
  {k:"duration_minutes",l:"Duration (minutes)",t:"number"},
  {k:"hero_image_url",l:"Hero Image URL",t:"text",wide:true},
  {k:"available",l:"Available",t:"toggle"},
];

var TAB_FIELDS={restaurants:REST_FIELDS,yachts:YACHT_FIELDS,cars:CAR_FIELDS,wellness:WELLNESS_FIELDS};

/* ─── Time Slot Picker ─── */
function TimeSlotPicker({value,onChange}){
  // value = [{time:"19:00",peak:false}, ...]
  var map={};
  (value||[]).forEach(function(s){map[s.time]=s.peak});

  function toggle(time){
    if(map[time]!==undefined){
      onChange((value||[]).filter(function(s){return s.time!==time}));
    } else {
      var next=[...(value||[]),{time:time,peak:false}];
      next.sort(function(a,b){return a.time<b.time?-1:1});
      onChange(next);
    }
  }

  function togglePeak(time){
    onChange((value||[]).map(function(s){return s.time===time?{time:s.time,peak:!s.peak}:s}));
  }

  function Group({label,slots}){
    return(
      <div style={{marginBottom:18}}>
        <div style={{...sf(10,600),color:C.s6,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>{label}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {slots.map(function(time){
            var active=map[time]!==undefined;
            var peak=active&&map[time];
            return(
              <div key={time} style={{display:"flex"}}>
                <button
                  type="button"
                  onClick={function(){toggle(time)}}
                  style={{
                    ...sf(12,active?600:400),
                    padding:"7px 11px",
                    borderRadius:active?"8px 0 0 8px":8,
                    background:active?(peak?C.gd:C.gn):C.srf,
                    color:active?C.bg:C.s5,
                    border:"1px solid "+(active?(peak?C.gd:C.gn):C.bd),
                    cursor:"pointer",
                    transition:"all 0.15s",
                    WebkitTapHighlightColor:"transparent"
                  }}
                >{time}</button>
                {active&&(
                  <button
                    type="button"
                    onClick={function(){togglePeak(time)}}
                    title={peak?"Remove peak":"Mark as peak"}
                    style={{
                      padding:"7px 7px",
                      borderRadius:"0 8px 8px 0",
                      background:peak?C.gd:C.srf,
                      color:peak?C.bg:C.s6,
                      border:"1px solid "+(peak?C.gd:C.bd),
                      borderLeft:"none",
                      cursor:"pointer",
                      fontSize:10,
                      lineHeight:1,
                      transition:"all 0.15s",
                      WebkitTapHighlightColor:"transparent"
                    }}
                  >⚡</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return(
    <div style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"16px 18px"}}>
      <Group label="Lunch  11:00 – 15:00" slots={LUNCH}/>
      <Group label="Dinner  18:00 – 23:30" slots={DINNER}/>
      <div style={{...sf(11),color:C.s6,marginTop:4}}>
        <span style={{color:C.gn}}>■</span> Available &nbsp;·&nbsp; <span style={{color:C.gd}}>■</span> Peak pricing (⚡ to toggle)
      </div>
    </div>
  );
}

/* ─── Field renderer ─── */
function FieldInput({f,value,onChange}){
  var inp={
    background:C.srf,border:"1px solid "+C.bd,borderRadius:8,
    padding:"10px 12px",color:C.s1,width:"100%",boxSizing:"border-box",
    ...sf(14),outline:"none",transition:"border 0.2s"
  };

  if(f.t==="toggle"){
    return(
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div onClick={function(){onChange(!value)}} style={{width:44,height:24,borderRadius:12,background:value?C.gn:C.s7,position:"relative",cursor:"pointer",transition:"background 0.25s"}}>
          <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:value?23:3,transition:"left 0.2s"}}/>
        </div>
        <span style={{...sf(13),color:value?C.s1:C.s5}}>{value?"Yes":"No"}</span>
      </div>
    );
  }

  if(f.t==="textarea"){
    return(
      <textarea value={value||""} onChange={function(e){onChange(e.target.value)}} rows={3}
        style={{...inp,resize:"vertical"}}
        onFocus={function(e){e.target.style.borderColor=C.gn}}
        onBlur={function(e){e.target.style.borderColor=C.bd}}/>
    );
  }

  if(f.t==="timeslots"){
    var slots=[];
    if(Array.isArray(value)){
      slots=value.map(function(s){return typeof s==="string"?{time:s,peak:false}:s});
    }
    return <TimeSlotPicker value={slots} onChange={onChange}/>;
  }

  return(
    <input type={f.t==="number"?"number":"text"} value={value!=null?value:""}
      onChange={function(e){onChange(f.t==="number"?(e.target.value===""?"":Number(e.target.value)):e.target.value)}}
      style={inp}
      onFocus={function(e){e.target.style.borderColor=C.gn}}
      onBlur={function(e){e.target.style.borderColor=C.bd}}/>
  );
}

/* ─── Record Modal ─── */
function RecordModal({tabId,record,onClose,onSave}){
  var fields=TAB_FIELDS[tabId]||[];
  var init={};
  fields.forEach(function(f){
    if(record&&record[f.k]!==undefined){init[f.k]=record[f.k]}
    else if(f.t==="toggle"){init[f.k]=false}
    else if(f.t==="timeslots"){init[f.k]=[]}
    else{init[f.k]=""}
  });
  var [form,setForm]=useState(init);
  var [saving,setSaving]=useState(false);
  var [err,setErr]=useState("");

  function setF(k,v){setForm(function(prev){var n={};Object.keys(prev).forEach(function(pk){n[pk]=prev[pk]});n[k]=v;return n})}

  async function save(){
    setSaving(true);setErr("");
    try{
      var data={};
      Object.keys(form).forEach(function(k){
        var v=form[k];
        if(v===""||v===null||v===undefined)return;
        data[k]=v;
      });
      // Convert timeslots to proper JSON
      if(tabId==="restaurants"&&data.opening_hours!==undefined){
        // already array of {time,peak}
      }
      var db=getDB();
      var tbl=TABS.find(function(t){return t.id===tabId}).table;
      var res;
      if(record&&record.id){
        res=await db.from(tbl).update(data).eq("id",record.id).select().single();
      } else {
        res=await db.from(tbl).insert(data).select().single();
      }
      if(res.error)throw res.error;
      onSave(res.data);
    } catch(e){
      setErr(e.message||"Error saving");
    } finally {
      setSaving(false);
    }
  }

  var tabLabel=tabId.charAt(0).toUpperCase()+tabId.slice(1);

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:1000,overflowY:"auto",padding:"32px 16px 80px"}} onClick={function(e){if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:C.el,borderRadius:20,border:"1px solid "+C.bd,width:"100%",maxWidth:680,padding:32}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h2 style={{...sf(20,600),color:C.s1}}>{record?"Edit":"Add New"} {tabLabel.slice(0,-1)}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.s5,cursor:"pointer",fontSize:28,lineHeight:1}}>×</button>
        </div>

        {err&&<div style={{background:"rgba(255,69,58,0.12)",border:"1px solid "+C.red,borderRadius:8,padding:"12px 16px",marginBottom:16,...sf(13),color:C.red}}>{err}</div>}

        {!SB_SVC&&<div style={{background:"rgba(255,214,10,0.1)",border:"1px solid "+C.gd,borderRadius:8,padding:"12px 16px",marginBottom:16,...sf(12),color:C.gd}}>⚠ VITE_SUPABASE_SERVICE_KEY not set — operations will fail. Add it to your .env file.</div>}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {fields.map(function(f){
            return(
              <div key={f.k} style={{gridColumn:(f.wide||f.t==="textarea"||f.t==="timeslots")?"1 / -1":"auto"}}>
                <label style={{...sf(11,600),color:C.s5,letterSpacing:0.5,textTransform:"uppercase",display:"block",marginBottom:6}}>
                  {f.l}{f.req&&<span style={{color:C.red}}> *</span>}
                </label>
                <FieldInput f={f} value={form[f.k]} onChange={function(v){setF(f.k,v)}}/>
              </div>
            );
          })}
        </div>

        <div style={{display:"flex",gap:12,marginTop:28,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{...sf(14,500),padding:"12px 20px",background:"transparent",border:"1px solid "+C.bd,borderRadius:10,color:C.s4,cursor:"pointer"}}>Cancel</button>
          <button onClick={save} disabled={saving} style={{...sf(14,600),padding:"12px 28px",background:saving?C.s7:C.gn,border:"none",borderRadius:10,color:C.bg,cursor:saving?"not-allowed":"pointer",transition:"all 0.2s"}}>
            {saving?"Saving…":"Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab Content ─── */
function TabContent({tab}){
  var [records,setRecords]=useState([]);
  var [loading,setLoading]=useState(true);
  var [error,setError]=useState("");
  var [modal,setModal]=useState(null);
  var [delId,setDelId]=useState(null);
  var [deleting,setDeleting]=useState(false);

  async function load(){
    setLoading(true);setError("");
    try{
      var db=getDB();
      var {data,error:e}=await db.from(tab.table).select("*").order("name",{ascending:true});
      if(e)throw e;
      setRecords(data||[]);
    } catch(e){
      setError("Could not load: "+e.message);
    } finally{setLoading(false)}
  }

  useEffect(function(){load()},[tab.id]);

  async function del(id){
    setDeleting(true);
    try{
      var db=getDB();
      var {error:e}=await db.from(tab.table).delete().eq("id",id);
      if(e)throw e;
      setRecords(function(prev){return prev.filter(function(r){return r.id!==id})});
      setDelId(null);
    } catch(e){
      alert("Delete failed: "+e.message);
    } finally{setDeleting(false)}
  }

  function handleSave(saved){
    setRecords(function(prev){
      var exists=prev.find(function(r){return r.id===saved.id});
      if(exists)return prev.map(function(r){return r.id===saved.id?saved:r});
      return [...prev,saved];
    });
    setModal(null);
  }

  var cols=(TAB_FIELDS[tab.id]||[]).filter(function(f){return f.t!=="toggle"&&f.t!=="textarea"&&f.t!=="timeslots"}).slice(0,4);

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <span style={{...sf(13),color:C.s5}}>{records.length} record{records.length!==1?"s":""}</span>
        <button onClick={function(){setModal("new")}} style={{...sf(14,600),padding:"10px 22px",background:C.gn,border:"none",borderRadius:10,color:C.bg,cursor:"pointer",transition:"all 0.2s"}}
          onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-1px)"}}
          onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)"}}>
          + Add New
        </button>
      </div>

      {loading&&<div style={{padding:48,textAlign:"center",...sf(14),color:C.s5}}>Loading…</div>}
      {error&&<div style={{...sf(13),color:C.red,marginBottom:16,padding:"12px 16px",background:"rgba(255,69,58,0.08)",borderRadius:8,border:"1px solid rgba(255,69,58,0.2)"}}>{error}<button onClick={load} style={{marginLeft:12,...sf(12,500),color:C.gn,background:"none",border:"none",cursor:"pointer"}}>Retry</button></div>}

      {!loading&&records.length===0&&!error&&(
        <div style={{padding:48,textAlign:"center",background:C.srf,borderRadius:12,border:"1px solid "+C.bd}}>
          <p style={{...sf(14),color:C.s5,marginBottom:4}}>No records yet</p>
          <p style={{...sf(12),color:C.s6}}>Click "+ Add New" to create the first one</p>
        </div>
      )}

      {!loading&&records.length>0&&(
        <div style={{overflowX:"auto",borderRadius:12,border:"1px solid "+C.bd}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
            <thead>
              <tr style={{background:C.srf}}>
                {cols.map(function(f){return(
                  <th key={f.k} style={{...sf(10,600),color:C.s5,textAlign:"left",padding:"11px 16px",letterSpacing:0.8,textTransform:"uppercase",borderBottom:"1px solid "+C.bd,whiteSpace:"nowrap"}}>{f.l}</th>
                )})}
                <th style={{...sf(10,600),color:C.s5,textAlign:"right",padding:"11px 16px",letterSpacing:0.8,textTransform:"uppercase",borderBottom:"1px solid "+C.bd}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(function(r,i){
                return(
                  <tr key={r.id||i} style={{borderBottom:i<records.length-1?"1px solid "+C.bd+"40":"none",transition:"background 0.15s"}}
                    onMouseEnter={function(e){e.currentTarget.style.background=C.srf+"60"}}
                    onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}>
                    {cols.map(function(f){return(
                      <td key={f.k} style={{...sf(13),color:f.k==="name"?C.s1:C.s4,padding:"13px 16px",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {String(r[f.k]!=null?r[f.k]:"")}
                      </td>
                    )})}
                    <td style={{padding:"13px 16px",textAlign:"right",whiteSpace:"nowrap"}}>
                      <button onClick={function(){setModal(r)}}
                        style={{...sf(12,500),padding:"6px 14px",background:"transparent",border:"1px solid "+C.bd,borderRadius:7,color:C.s4,cursor:"pointer",marginRight:8,transition:"all 0.15s"}}
                        onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s1;e.currentTarget.style.color=C.s1}}
                        onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>
                        Edit
                      </button>
                      <button onClick={function(){setDelId(r.id)}}
                        style={{...sf(12,500),padding:"6px 14px",background:"transparent",border:"1px solid rgba(255,69,58,0.25)",borderRadius:7,color:"rgba(255,69,58,0.6)",cursor:"pointer",transition:"all 0.15s"}}
                        onMouseEnter={function(e){e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red}}
                        onMouseLeave={function(e){e.currentTarget.style.borderColor="rgba(255,69,58,0.25)";e.currentTarget.style.color="rgba(255,69,58,0.6)"}}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirm */}
      {delId&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000}}>
          <div style={{background:C.el,borderRadius:16,padding:32,border:"1px solid "+C.bd,maxWidth:360,width:"90%",textAlign:"center"}}>
            <h3 style={{...sf(18,600),color:C.s1,marginBottom:10}}>Delete Record?</h3>
            <p style={{...sf(14),color:C.s5,marginBottom:24}}>This cannot be undone.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button onClick={function(){setDelId(null)}} style={{...sf(14,500),padding:"11px 22px",background:"transparent",border:"1px solid "+C.bd,borderRadius:10,color:C.s4,cursor:"pointer"}}>Cancel</button>
              <button onClick={function(){del(delId)}} disabled={deleting} style={{...sf(14,600),padding:"11px 22px",background:C.red,border:"none",borderRadius:10,color:"#fff",cursor:deleting?"not-allowed":"pointer"}}>
                {deleting?"Deleting…":"Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal&&(
        <RecordModal
          tabId={tab.id}
          record={modal==="new"?null:modal}
          onClose={function(){setModal(null)}}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/* ─── Main AdminPage ─── */
export default function AdminPage(){
  var [authed,setAuthed]=useState(function(){try{return localStorage.getItem("alfred_admin")==="1"}catch(e){return false}});
  var [pass,setPass]=useState("");
  var [passErr,setPassErr]=useState("");
  var [tab,setTab]=useState(TABS[0]);

  function login(){
    if(pass===ADM_PASS){
      try{localStorage.setItem("alfred_admin","1")}catch(e){}
      setAuthed(true);
    } else {
      setPassErr("Incorrect password");
    }
  }

  function logout(){
    try{localStorage.removeItem("alfred_admin")}catch(e){}
    setAuthed(false);
    setPass("");
  }

  if(!authed){
    return(
      <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <div style={{background:C.el,borderRadius:20,padding:"40px 36px",border:"1px solid "+C.bd,width:"100%",maxWidth:360,textAlign:"center"}}>
          <div style={{...sf(28,700),color:C.s1,marginBottom:4}}>Alfred</div>
          <div style={{...sf(11,500),color:C.s6,letterSpacing:3,textTransform:"uppercase",marginBottom:32}}>Admin Panel</div>
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={function(e){setPass(e.target.value);setPassErr("")}}
            onKeyDown={function(e){if(e.key==="Enter")login()}}
            autoFocus
            style={{
              width:"100%",boxSizing:"border-box",
              padding:"13px 16px",
              background:C.srf,
              border:"1px solid "+(passErr?C.red:C.bd),
              borderRadius:10,color:C.s1,...sf(15),
              outline:"none",marginBottom:passErr?8:20,
              transition:"border 0.2s"
            }}
            onFocus={function(e){e.target.style.borderColor=passErr?C.red:C.gn}}
            onBlur={function(e){e.target.style.borderColor=passErr?C.red:C.bd}}
          />
          {passErr&&<p style={{...sf(12),color:C.red,marginBottom:16,textAlign:"left"}}>{passErr}</p>}
          <button onClick={login} style={{width:"100%",padding:14,background:C.gn,border:"none",borderRadius:10,...sf(15,600),color:C.bg,cursor:"pointer",transition:"all 0.2s"}}
            onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-1px)"}}
            onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)"}}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.s1}}>
      {/* Header */}
      <div style={{background:C.el,borderBottom:"1px solid "+C.bd,padding:"0 32px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{...sf(18,700),color:C.s1}}>Alfred</span>
          <span style={{...sf(10,500),color:C.s6,letterSpacing:3,textTransform:"uppercase"}}>Admin</span>
        </div>
        <button onClick={logout} style={{...sf(13,500),padding:"7px 16px",background:"transparent",border:"1px solid "+C.bd,borderRadius:8,color:C.s5,cursor:"pointer",transition:"all 0.2s"}}
          onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}}
          onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s5}}>
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div style={{background:C.el,borderBottom:"1px solid "+C.bd,paddingLeft:32,display:"flex",overflowX:"auto"}}>
        {TABS.map(function(t){
          var active=t.id===tab.id;
          return(
            <button key={t.id} onClick={function(){setTab(t)}} style={{
              ...sf(14,active?600:400),
              padding:"15px 20px",
              background:"transparent",
              border:"none",
              borderBottom:active?"2px solid "+C.gn:"2px solid transparent",
              color:active?C.s1:C.s5,
              cursor:"pointer",
              transition:"all 0.2s",
              whiteSpace:"nowrap",
              WebkitTapHighlightColor:"transparent"
            }}>{t.label}</button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 24px"}}>
        <TabContent key={tab.id} tab={tab}/>
      </div>
    </div>
  );
}
