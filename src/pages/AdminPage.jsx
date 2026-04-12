import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

var sf = function(size, weight){
  return {fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", fontSize:size, fontWeight:weight||400, WebkitFontSmoothing:"antialiased"};
};

var C = {
  bg:"#0A0A0B", el:"#18181B", srf:"#1F1F23", bd:"#2C2C31",
  s1:"#F4F4F5", s2:"#E4E4E7", s3:"#D4D4D8", s4:"#A1A1AA",
  s5:"#71717A", s6:"#52525B", s7:"#3F3F46",
  gn:"#34C759", rd:"#FF3B30", gd:"#FFD60A", bl:"#007AFF"
};

var CATS = [
  {
    id:"restaurants", label:"Restaurants", table:"restaurants", bucket:"restaurant-photos",
    imgField:"hero_image_url",
    tableCols:["name","cuisine","city","price_level","rating","available"],
    fields:[
      {key:"name",label:"Name",type:"text"},
      {key:"slug",label:"Slug",type:"text"},
      {key:"cuisine",label:"Cuisine",type:"text"},
      {key:"city",label:"City",type:"text"},
      {key:"vibe",label:"Vibe",type:"text"},
      {key:"tagline",label:"Tagline",type:"text"},
      {key:"price_level",label:"Price Level (1–4)",type:"number"},
      {key:"rating",label:"Rating",type:"number"},
      {key:"review_count",label:"Review Count",type:"number"},
      {key:"michelin_stars",label:"Michelin Stars",type:"number"},
      {key:"avg_spend",label:"Avg Spend",type:"text"},
      {key:"available",label:"Available",type:"boolean"},
      {key:"hero_image_url",label:"Hero Image",type:"image"},
    ]
  },
  {
    id:"yachts", label:"Yachts", table:"yachts", bucket:"yacht-images",
    imgField:"image_url",
    tableCols:["name","location","capacity","price_per_day","available"],
    fields:[
      {key:"name",label:"Name",type:"text"},
      {key:"slug",label:"Slug",type:"text"},
      {key:"location",label:"Location",type:"text"},
      {key:"city",label:"City",type:"text"},
      {key:"type",label:"Type",type:"text"},
      {key:"length",label:"Length (ft)",type:"number"},
      {key:"capacity",label:"Capacity",type:"number"},
      {key:"price_per_day",label:"Price / Day",type:"number"},
      {key:"rating",label:"Rating",type:"number"},
      {key:"description",label:"Description",type:"textarea"},
      {key:"available",label:"Available",type:"boolean"},
      {key:"image_url",label:"Image",type:"image"},
    ]
  },
  {
    id:"wellness", label:"Wellness", table:"wellness", bucket:"wellness-images",
    imgField:"hero_image_url",
    tableCols:["name","type","city","rating","available"],
    fields:[
      {key:"name",label:"Name",type:"text"},
      {key:"slug",label:"Slug",type:"text"},
      {key:"type",label:"Type",type:"text"},
      {key:"city",label:"City",type:"text"},
      {key:"tagline",label:"Tagline",type:"text"},
      {key:"rating",label:"Rating",type:"number"},
      {key:"review_count",label:"Review Count",type:"number"},
      {key:"description",label:"Description",type:"textarea"},
      {key:"available",label:"Available",type:"boolean"},
      {key:"hero_image_url",label:"Hero Image",type:"image"},
    ]
  },
  {
    id:"nightlife", label:"Nightlife", table:"nightlife", bucket:"nightlife-images",
    imgField:"hero_image_url",
    tableCols:["name","type","city","door_policy","available"],
    fields:[
      {key:"name",label:"Name",type:"text"},
      {key:"slug",label:"Slug",type:"text"},
      {key:"type",label:"Type",type:"text"},
      {key:"city",label:"City",type:"text"},
      {key:"tagline",label:"Tagline",type:"text"},
      {key:"door_policy",label:"Door Policy",type:"text"},
      {key:"rating",label:"Rating",type:"number"},
      {key:"review_count",label:"Review Count",type:"number"},
      {key:"description",label:"Description",type:"textarea"},
      {key:"available",label:"Available",type:"boolean"},
      {key:"hero_image_url",label:"Hero Image",type:"image"},
    ]
  },
  {
    id:"cars", label:"Cars", table:"cars", bucket:"car-images",
    imgField:"hero_image_url",
    tableCols:["name","make","model","year","city","available"],
    fields:[
      {key:"name",label:"Name",type:"text"},
      {key:"slug",label:"Slug",type:"text"},
      {key:"make",label:"Make",type:"text"},
      {key:"model",label:"Model",type:"text"},
      {key:"year",label:"Year",type:"number"},
      {key:"city",label:"City",type:"text"},
      {key:"price_per_day",label:"Price / Day",type:"number"},
      {key:"color",label:"Color",type:"text"},
      {key:"description",label:"Description",type:"textarea"},
      {key:"available",label:"Available",type:"boolean"},
      {key:"hero_image_url",label:"Hero Image",type:"image"},
    ]
  }
];

/* ─── Password Gate ─── */
function PasswordGate(p){
  var [pw, setPw] = useState("");
  var [err, setErr] = useState(false);
  var [shake, setShake] = useState(false);

  function submit(e){
    e.preventDefault();
    if(pw === "alfred2026"){
      p.onAuth();
    } else {
      setErr(true);
      setShake(true);
      setTimeout(function(){ setShake(false); }, 500);
    }
  }

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{
        width:"100%",maxWidth:400,
        background:C.el,
        border:"1px solid "+C.bd,
        borderRadius:20,
        padding:"40px 36px",
        animation:shake?"shake 0.5s ease":undefined
      }}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{...sf(13,600),letterSpacing:3,textTransform:"uppercase",color:C.s5,marginBottom:12}}>ALFRED</div>
          <h1 style={{...sf(26,600),color:C.s1,letterSpacing:-0.5,margin:0}}>Admin Portal</h1>
          <p style={{...sf(14),color:C.s5,marginTop:8}}>Enter your password to continue</p>
        </div>
        <form onSubmit={submit}>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={function(e){ setPw(e.target.value); setErr(false); }}
            autoFocus
            style={{
              width:"100%",boxSizing:"border-box",
              background:C.srf,
              border:"1px solid "+(err?C.rd:C.bd),
              borderRadius:10,
              padding:"12px 14px",
              ...sf(15),color:C.s1,
              outline:"none",
              marginBottom:12,
              transition:"border-color 0.2s"
            }}
          />
          {err && <p style={{...sf(13),color:C.rd,marginBottom:10,textAlign:"center"}}>Incorrect password</p>}
          <button type="submit" style={{
            width:"100%",padding:"13px",
            background:C.s1,border:"none",borderRadius:10,
            ...sf(15,600),color:C.bg,cursor:"pointer",
            transition:"opacity 0.2s"
          }}
            onMouseEnter={function(e){e.currentTarget.style.opacity="0.85"}}
            onMouseLeave={function(e){e.currentTarget.style.opacity="1"}}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Image Upload ─── */
function ImageUpload(p){
  var [uploading, setUploading] = useState(false);
  var [uploadErr, setUploadErr] = useState("");
  var inputRef = useRef(null);

  async function handleFile(e){
    var file = e.target.files[0];
    if(!file) return;
    setUploading(true);
    setUploadErr("");
    var ext = file.name.split(".").pop();
    var path = Date.now()+"-"+Math.random().toString(36).slice(2)+"."+ext;
    var {data, error} = await supabase.storage.from(p.bucket).upload(path, file, {upsert:true});
    if(error){
      setUploadErr("Upload failed: "+error.message);
      setUploading(false);
      return;
    }
    var {data:urlData} = supabase.storage.from(p.bucket).getPublicUrl(path);
    p.onUpload(urlData.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      {p.value && (
        <div style={{marginBottom:8,borderRadius:8,overflow:"hidden",height:100,background:C.srf,position:"relative"}}>
          <img src={p.value} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
          <button onClick={function(){p.onUpload("");}}
            style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.7)",border:"none",borderRadius:6,color:C.s1,width:24,height:24,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
      )}
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button
          type="button"
          onClick={function(){ inputRef.current && inputRef.current.click(); }}
          disabled={uploading}
          style={{
            padding:"8px 14px",background:C.srf,border:"1px solid "+C.bd,
            borderRadius:8,...sf(13,500),color:C.s3,cursor:"pointer",
            opacity:uploading?0.5:1,transition:"opacity 0.2s"
          }}
        >
          {uploading?"Uploading…":"Upload Image"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}} />
        {p.value && <span style={{...sf(11),color:C.s5,wordBreak:"break-all",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.value.split("/").pop()}</span>}
      </div>
      {uploadErr && <p style={{...sf(12),color:C.rd,marginTop:4}}>{uploadErr}</p>}
    </div>
  );
}

/* ─── Field Input ─── */
function FieldInput(p){
  var inputStyle = {
    width:"100%",boxSizing:"border-box",
    background:C.srf, border:"1px solid "+C.bd,
    borderRadius:8, padding:"9px 12px",
    ...sf(14), color:C.s1, outline:"none",
    transition:"border-color 0.2s",
    resize:"vertical"
  };

  if(p.field.type === "boolean"){
    return (
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div
          onClick={function(){ p.onChange(!p.value); }}
          style={{
            width:44,height:24,borderRadius:12,
            background:p.value?C.gn:C.s7,
            position:"relative",cursor:"pointer",
            transition:"background 0.2s",flexShrink:0
          }}
        >
          <div style={{
            position:"absolute",top:3,
            left:p.value?22:3,
            width:18,height:18,
            borderRadius:"50%",background:"#fff",
            transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"
          }}/>
        </div>
        <span style={{...sf(13),color:C.s4}}>{p.value?"Yes":"No"}</span>
      </div>
    );
  }
  if(p.field.type === "image"){
    return <ImageUpload value={p.value||""} bucket={p.bucket} onUpload={p.onChange} />;
  }
  if(p.field.type === "textarea"){
    return (
      <textarea
        value={p.value||""}
        onChange={function(e){ p.onChange(e.target.value); }}
        rows={3}
        style={inputStyle}
        onFocus={function(e){e.target.style.borderColor=C.s5}}
        onBlur={function(e){e.target.style.borderColor=C.bd}}
      />
    );
  }
  return (
    <input
      type={p.field.type==="number"?"number":"text"}
      value={p.value===undefined||p.value===null?"":p.value}
      onChange={function(e){ p.onChange(p.field.type==="number"?(e.target.value===""?null:Number(e.target.value)):e.target.value); }}
      style={inputStyle}
      onFocus={function(e){e.target.style.borderColor=C.s5}}
      onBlur={function(e){e.target.style.borderColor=C.bd}}
    />
  );
}

/* ─── Edit Modal ─── */
function EditModal(p){
  var cat = p.cat;
  var [form, setForm] = useState(p.record ? {...p.record} : {available:true});
  var [saving, setSaving] = useState(false);
  var [saveErr, setSaveErr] = useState("");

  function setField(key, val){
    setForm(function(prev){ return {...prev, [key]:val}; });
  }

  async function save(){
    setSaving(true);
    setSaveErr("");
    var payload = {...form};
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;

    var result;
    if(p.record && p.record.id){
      result = await supabase.from(cat.table).update(payload).eq("id", p.record.id).select();
    } else {
      result = await supabase.from(cat.table).insert(payload).select();
    }
    setSaving(false);
    if(result.error){ setSaveErr(result.error.message); return; }
    p.onSave();
  }

  return (
    <div style={{
      position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",
      display:"flex",alignItems:"center",justifyContent:"center",
      zIndex:1000,padding:"16px",backdropFilter:"blur(4px)"
    }} onClick={function(e){ if(e.target===e.currentTarget) p.onClose(); }}>
      <div style={{
        background:C.el,border:"1px solid "+C.bd,
        borderRadius:18,width:"100%",maxWidth:540,
        maxHeight:"90vh",display:"flex",flexDirection:"column",
        animation:"modalIn 0.25s cubic-bezier(0.16,1,0.3,1)"
      }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px 0"}}>
          <h2 style={{...sf(18,600),color:C.s1,margin:0}}>
            {p.record ? "Edit "+cat.label.slice(0,-1) : "Add "+cat.label.slice(0,-1)}
          </h2>
          <button onClick={p.onClose} style={{background:"none",border:"none",color:C.s5,fontSize:22,cursor:"pointer",padding:"4px 8px",lineHeight:1}}>×</button>
        </div>

        {/* Fields */}
        <div style={{overflowY:"auto",padding:"20px 24px",flex:1}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {cat.fields.map(function(field){
              var isWide = field.type==="textarea"||field.type==="image"||field.key==="tagline"||field.key==="description";
              return (
                <div key={field.key} style={{gridColumn:isWide?"1 / -1":"auto"}}>
                  <label style={{...sf(11,500),color:C.s5,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>
                    {field.label}
                  </label>
                  <FieldInput
                    field={field}
                    value={form[field.key]}
                    bucket={cat.bucket}
                    onChange={function(val){ setField(field.key, val); }}
                  />
                </div>
              );
            })}
          </div>
          {saveErr && <p style={{...sf(13),color:C.rd,marginTop:12,padding:"10px 12px",background:"rgba(255,59,48,0.08)",borderRadius:8}}>{saveErr}</p>}
        </div>

        {/* Footer */}
        <div style={{padding:"16px 24px",borderTop:"1px solid "+C.bd,display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={p.onClose} style={{
            padding:"10px 20px",background:"none",border:"1px solid "+C.bd,
            borderRadius:10,...sf(14,500),color:C.s3,cursor:"pointer",transition:"background 0.15s"
          }}
            onMouseEnter={function(e){e.currentTarget.style.background=C.srf}}
            onMouseLeave={function(e){e.currentTarget.style.background="none"}}
          >Cancel</button>
          <button onClick={save} disabled={saving} style={{
            padding:"10px 24px",background:C.s1,border:"none",
            borderRadius:10,...sf(14,600),color:C.bg,cursor:saving?"not-allowed":"pointer",
            opacity:saving?0.6:1,transition:"opacity 0.2s"
          }}>
            {saving?"Saving…":"Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm ─── */
function DeleteConfirm(p){
  var [deleting, setDeleting] = useState(false);

  async function confirm(){
    setDeleting(true);
    await supabase.from(p.table).delete().eq("id", p.id);
    p.onDone();
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1001,padding:16,backdropFilter:"blur(4px)"}}>
      <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"28px 28px 24px",width:"100%",maxWidth:360,textAlign:"center"}}>
        <p style={{...sf(16,500),color:C.s1,marginBottom:6}}>Delete this record?</p>
        <p style={{...sf(13),color:C.s5,marginBottom:24}}>This cannot be undone.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button onClick={p.onCancel} style={{
            padding:"10px 22px",background:"none",border:"1px solid "+C.bd,
            borderRadius:10,...sf(14,500),color:C.s3,cursor:"pointer"
          }}>Cancel</button>
          <button onClick={confirm} disabled={deleting} style={{
            padding:"10px 22px",background:C.rd,border:"none",
            borderRadius:10,...sf(14,600),color:"#fff",cursor:deleting?"not-allowed":"pointer",
            opacity:deleting?0.6:1
          }}>
            {deleting?"Deleting…":"Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Records Table ─── */
function RecordsTable(p){
  var cat = p.cat;
  var records = p.records;
  var isMobile = p.isMobile;

  var colLabels = {
    name:"Name",cuisine:"Cuisine",city:"City",price_level:"Price",
    rating:"Rating",available:"Status",capacity:"Capacity",
    price_per_day:"$/Day",location:"Location",type:"Type",
    door_policy:"Door",make:"Make",model:"Model",year:"Year"
  };

  function cellValue(col, row){
    var val = row[col];
    if(val===undefined||val===null) return <span style={{color:C.s6}}>—</span>;
    if(col==="available") return (
      <span style={{
        ...sf(11,600),letterSpacing:0.5,
        padding:"3px 8px",borderRadius:20,
        background:val?"rgba(52,199,89,0.12)":"rgba(255,59,48,0.1)",
        color:val?C.gn:C.rd
      }}>
        {val?"Active":"Inactive"}
      </span>
    );
    if(col==="price_level") return <span style={{color:C.gd}}>{"$".repeat(val)||"—"}</span>;
    if(col==="rating") return <span>{val > 0 ? "★ "+val : "—"}</span>;
    return <span style={{color:C.s2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:isMobile?80:180,display:"inline-block"}}>{String(val)}</span>;
  }

  if(records.length === 0){
    return (
      <div style={{textAlign:"center",padding:"60px 20px",color:C.s5}}>
        <p style={{...sf(15),marginBottom:8}}>No records found</p>
        <p style={{...sf(13)}}>Click "Add New" to create one</p>
      </div>
    );
  }

  var displayCols = isMobile ? cat.tableCols.slice(0,2) : cat.tableCols;

  return (
    <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <table style={{width:"100%",borderCollapse:"collapse",minWidth:isMobile?0:600}}>
        <thead>
          <tr style={{borderBottom:"1px solid "+C.bd}}>
            {displayCols.map(function(col){
              return <th key={col} style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",padding:"10px 14px",textAlign:"left",whiteSpace:"nowrap"}}>{colLabels[col]||col}</th>;
            })}
            <th style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",padding:"10px 14px",textAlign:"right"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(function(row, i){
            return (
              <tr key={row.id||i}
                style={{borderBottom:"1px solid "+C.bd,transition:"background 0.15s",cursor:"pointer"}}
                onMouseEnter={function(e){e.currentTarget.style.background=C.srf}}
                onMouseLeave={function(e){e.currentTarget.style.background="transparent"}}
              >
                {displayCols.map(function(col){
                  return (
                    <td key={col} style={{...sf(13),color:C.s3,padding:"12px 14px",verticalAlign:"middle"}}
                      onClick={function(){ p.onEdit(row); }}>
                      {cellValue(col, row)}
                    </td>
                  );
                })}
                <td style={{padding:"12px 14px",textAlign:"right",whiteSpace:"nowrap",verticalAlign:"middle"}}>
                  <button
                    onClick={function(e){ e.stopPropagation(); p.onEdit(row); }}
                    style={{
                      padding:"6px 12px",background:C.srf,border:"1px solid "+C.bd,
                      borderRadius:8,...sf(12,500),color:C.s3,cursor:"pointer",
                      marginRight:6,transition:"background 0.15s"
                    }}
                    onMouseEnter={function(e){e.currentTarget.style.background=C.s7}}
                    onMouseLeave={function(e){e.currentTarget.style.background=C.srf}}
                  >
                    Edit
                  </button>
                  <button
                    onClick={function(e){ e.stopPropagation(); p.onDelete(row); }}
                    style={{
                      padding:"6px 12px",background:"rgba(255,59,48,0.08)",border:"1px solid rgba(255,59,48,0.2)",
                      borderRadius:8,...sf(12,500),color:C.rd,cursor:"pointer",
                      transition:"background 0.15s"
                    }}
                    onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,59,48,0.16)"}}
                    onMouseLeave={function(e){e.currentTarget.style.background="rgba(255,59,48,0.08)"}}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Category Panel ─── */
function CategoryPanel(p){
  var cat = p.cat;
  var [records, setRecords] = useState([]);
  var [loading, setLoading] = useState(true);
  var [editRecord, setEditRecord] = useState(null);
  var [showAdd, setShowAdd] = useState(false);
  var [deleteRecord, setDeleteRecord] = useState(null);
  var [search, setSearch] = useState("");

  async function load(){
    setLoading(true);
    var {data} = await supabase.from(cat.table).select("*").order("name");
    setRecords(data||[]);
    setLoading(false);
  }

  useEffect(function(){ load(); }, [cat.id]);

  var filtered = records.filter(function(r){
    if(!search) return true;
    var s = search.toLowerCase();
    return (r.name||"").toLowerCase().includes(s) ||
           (r.city||"").toLowerCase().includes(s) ||
           (r.cuisine||"").toLowerCase().includes(s) ||
           (r.type||"").toLowerCase().includes(s);
  });

  return (
    <div>
      {/* Toolbar */}
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:20,flexWrap:"wrap"}}>
        <input
          type="text"
          placeholder={"Search "+cat.label.toLowerCase()+"…"}
          value={search}
          onChange={function(e){ setSearch(e.target.value); }}
          style={{
            flex:1,minWidth:160,maxWidth:300,
            background:C.srf,border:"1px solid "+C.bd,
            borderRadius:10,padding:"9px 14px",
            ...sf(14),color:C.s1,outline:"none"
          }}
        />
        <div style={{...sf(13),color:C.s5}}>
          {loading ? "Loading…" : filtered.length+" record"+(filtered.length!==1?"s":"")}
        </div>
        <button
          onClick={function(){ setShowAdd(true); }}
          style={{
            marginLeft:"auto",padding:"10px 18px",
            background:C.s1,border:"none",borderRadius:10,
            ...sf(14,600),color:C.bg,cursor:"pointer",
            transition:"opacity 0.2s",whiteSpace:"nowrap"
          }}
          onMouseEnter={function(e){e.currentTarget.style.opacity="0.85"}}
          onMouseLeave={function(e){e.currentTarget.style.opacity="1"}}
        >
          + Add New
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{padding:"60px 20px",textAlign:"center",color:C.s5,...sf(14)}}>Loading…</div>
      ) : (
        <RecordsTable
          cat={cat}
          records={filtered}
          isMobile={p.isMobile}
          onEdit={function(row){ setEditRecord(row); }}
          onDelete={function(row){ setDeleteRecord(row); }}
        />
      )}

      {/* Edit Modal */}
      {editRecord && (
        <EditModal
          cat={cat}
          record={editRecord}
          onClose={function(){ setEditRecord(null); }}
          onSave={function(){ setEditRecord(null); load(); }}
        />
      )}

      {/* Add Modal */}
      {showAdd && (
        <EditModal
          cat={cat}
          record={null}
          onClose={function(){ setShowAdd(false); }}
          onSave={function(){ setShowAdd(false); load(); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteRecord && (
        <DeleteConfirm
          table={cat.table}
          id={deleteRecord.id}
          onCancel={function(){ setDeleteRecord(null); }}
          onDone={function(){ setDeleteRecord(null); load(); }}
        />
      )}
    </div>
  );
}

/* ─── Admin Dashboard ─── */
function AdminDashboard(p){
  var [activeCat, setActiveCat] = useState(CATS[0].id);
  var [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(function(){
    function onResize(){ setIsMobile(window.innerWidth <= 640); }
    window.addEventListener("resize", onResize);
    return function(){ window.removeEventListener("resize", onResize); };
  }, []);

  var cat = CATS.find(function(c){ return c.id === activeCat; }) || CATS[0];

  return (
    <div style={{minHeight:"100vh",background:C.bg}}>
      {/* Top Bar */}
      <div style={{
        position:"sticky",top:0,zIndex:100,
        background:"rgba(10,10,11,0.9)",
        backdropFilter:"blur(16px)",
        borderBottom:"1px solid "+C.bd,
        padding:isMobile?"12px 16px":"14px 28px",
        display:"flex",alignItems:"center",gap:16
      }}>
        <span style={{...sf(isMobile?14:16,600),color:C.s1,letterSpacing:-0.3}}>Alfred Admin</span>
        <span style={{...sf(11,500),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginLeft:4}}>Internal</span>
        <button
          onClick={p.onLogout}
          style={{
            marginLeft:"auto",padding:"6px 14px",
            background:"none",border:"1px solid "+C.bd,
            borderRadius:8,...sf(12,500),color:C.s5,cursor:"pointer",
            transition:"all 0.15s"
          }}
          onMouseEnter={function(e){e.currentTarget.style.color=C.s1;e.currentTarget.style.borderColor=C.s5}}
          onMouseLeave={function(e){e.currentTarget.style.color=C.s5;e.currentTarget.style.borderColor=C.bd}}
        >
          Sign Out
        </button>
      </div>

      <div style={{padding:isMobile?"16px":"24px 28px",maxWidth:1200,margin:"0 auto"}}>
        {/* Category Tabs */}
        <div style={{
          display:"flex",gap:4,
          overflowX:"auto",WebkitOverflowScrolling:"touch",
          marginBottom:24,
          scrollbarWidth:"none",
          borderBottom:"1px solid "+C.bd,
          paddingBottom:0
        }}>
          <style>{`.admin-tabs::-webkit-scrollbar{display:none}`}</style>
          {CATS.map(function(c){
            var active = c.id === activeCat;
            return (
              <button key={c.id}
                onClick={function(){ setActiveCat(c.id); }}
                style={{
                  padding:"10px 18px",
                  background:"none",border:"none",
                  borderBottom:"2px solid "+(active?C.s1:"transparent"),
                  ...sf(13,active?600:400),
                  color:active?C.s1:C.s5,
                  cursor:"pointer",whiteSpace:"nowrap",
                  transition:"color 0.15s,border-color 0.15s",
                  marginBottom:-1
                }}
                onMouseEnter={function(e){ if(!active) e.currentTarget.style.color=C.s3; }}
                onMouseLeave={function(e){ if(!active) e.currentTarget.style.color=C.s5; }}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div style={{
          background:C.el,
          border:"1px solid "+C.bd,
          borderRadius:16,
          overflow:"hidden",
          padding:isMobile?"16px":"20px 24px"
        }}>
          <CategoryPanel key={activeCat} cat={cat} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}

/* ─── AdminPage (default export) ─── */
export default function AdminPage(){
  var [authed, setAuthed] = useState(function(){
    return sessionStorage.getItem("alfred_admin_auth") === "1";
  });

  function handleAuth(){
    sessionStorage.setItem("alfred_admin_auth", "1");
    setAuthed(true);
  }

  function handleLogout(){
    sessionStorage.removeItem("alfred_admin_auth");
    setAuthed(false);
  }

  if(!authed) return <PasswordGate onAuth={handleAuth} />;
  return <AdminDashboard onLogout={handleLogout} />;
}
