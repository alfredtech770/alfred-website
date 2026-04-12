import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

var sf = function(s, w) {
  return { fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", fontSize: s, fontWeight: w || 400, WebkitFontSmoothing: "antialiased" };
};
var C = {
  bg: "#0A0A0B", el: "#18181B", srf: "#1F1F23", bd: "#2C2C31",
  s1: "#F4F4F5", s2: "#E4E4E7", s3: "#D4D4D8", s4: "#A1A1AA",
  s5: "#71717A", s6: "#52525B", s7: "#3F3F46",
  gn: "#34C759", rd: "#FF3B30", bl: "#0A84FF", gold: "#FFD60A"
};

var ADMIN_PWD = "alfred-admin-2024";

var CONFIGS = {
  restaurants: {
    label: "Restaurants", table: "restaurants", bucket: "restaurant-photos",
    display: ["name", "cuisine", "city", "price_level", "peak_price_per_person", "rating", "available"],
    fields: [
      { k: "name", l: "Name", t: "text", req: true },
      { k: "slug", l: "Slug", t: "text", req: true },
      { k: "tagline", l: "Tagline", t: "text" },
      { k: "description", l: "Description", t: "textarea" },
      { k: "cuisine", l: "Cuisine", t: "text" },
      { k: "city", l: "City", t: "text" },
      { k: "location", l: "Location / Address", t: "text" },
      { k: "price_level", l: "Price Level", t: "select", opts: ["$", "$$", "$$$", "$$$$"] },
      { k: "avg_spend", l: "Avg Spend", t: "text" },
      { k: "rating", l: "Rating", t: "number" },
      { k: "review_count", l: "Review Count", t: "number" },
      { k: "michelin_stars", l: "Michelin Stars", t: "number" },
      { k: "vibe", l: "Vibe / Atmosphere", t: "text" },
      { k: "hero_image_url", l: "Hero Image URL", t: "image-url" },
      { k: "image_url", l: "Card Image URL", t: "image-url" },
      { k: "peak_price_per_person", l: "Peak Price/Person", t: "number" },
      { k: "peak_perks", l: "Peak Perks", t: "textarea", wide: true },
      { k: "available_tonight", l: "Available Tonight", t: "boolean" },
      { k: "hours_lunch", l: "Lunch Hours", t: "text" },
      { k: "hours_dinner", l: "Dinner Hours", t: "text" },
      { k: "hours_closed", l: "Closed Days", t: "text" },
      { k: "instant_booking_available", l: "Instant Booking", t: "boolean" },
      { k: "available", l: "Available", t: "boolean" },
    ]
  },
  yachts: {
    label: "Yachts", table: "yachts", bucket: "yacht-images",
    display: ["name", "type", "city", "capacity", "price_4hr", "available"],
    fields: [
      { k: "name", l: "Name", t: "text", req: true },
      { k: "description", l: "Description", t: "textarea" },
      { k: "type", l: "Vessel Type", t: "text" },
      { k: "length", l: "Length (ft)", t: "text" },
      { k: "capacity", l: "Capacity (guests)", t: "number" },
      { k: "city", l: "City / Marina", t: "text" },
      { k: "price_4hr", l: "Price (4hr Weekend)", t: "number" },
      { k: "price_6hr", l: "Price (6hr Weekend)", t: "number" },
      { k: "price_8hr", l: "Price (8hr Weekend)", t: "number" },
      { k: "price_weekday_4hr", l: "Price (4hr Weekday)", t: "number" },
      { k: "price_weekday_6hr", l: "Price (6hr Weekday)", t: "number" },
      { k: "price_weekday_8hr", l: "Price (8hr Weekday)", t: "number" },
      { k: "hero_image_url", l: "Hero Image URL", t: "image-url" },
      { k: "available", l: "Available", t: "boolean" },
    ]
  },
  wellness: {
    label: "Wellness", table: "wellness", bucket: null,
    display: ["name", "type", "city", "price_level", "rating", "available"],
    fields: [
      { k: "name", l: "Name", t: "text", req: true },
      { k: "slug", l: "Slug", t: "text" },
      { k: "description", l: "Description", t: "textarea" },
      { k: "type", l: "Type (Spa / Fitness / etc)", t: "text" },
      { k: "city", l: "City", t: "text" },
      { k: "location", l: "Location / Address", t: "text" },
      { k: "price_level", l: "Price Level", t: "text" },
      { k: "from_price", l: "Starting Price", t: "text" },
      { k: "duration", l: "Session Duration", t: "text" },
      { k: "rating", l: "Rating", t: "number" },
      { k: "review_count", l: "Review Count", t: "number" },
      { k: "hero_image_url", l: "Hero Image URL", t: "image-url" },
      { k: "available", l: "Available", t: "boolean" },
    ]
  },
  nightlife: {
    label: "Nightlife", table: "nightlife", bucket: null,
    display: ["name", "category", "city", "price_level", "rating", "is_active"],
    fields: [
      { k: "name", l: "Name", t: "text", req: true },
      { k: "category", l: "Category (Nightclub / Bar)", t: "text" },
      { k: "city", l: "City", t: "text" },
      { k: "vibe", l: "Vibe", t: "text" },
      { k: "music", l: "Music Genre", t: "text" },
      { k: "reservation", l: "Entry / Reservation Type", t: "text" },
      { k: "crowd_type", l: "Crowd Type", t: "text" },
      { k: "best_night", l: "Best Night", t: "text" },
      { k: "opening_hours", l: "Opening Hours", t: "text" },
      { k: "capacity", l: "Capacity", t: "number" },
      { k: "rating", l: "Rating", t: "number" },
      { k: "review_count", l: "Review Count", t: "number" },
      { k: "price_level", l: "Price Level", t: "text" },
      { k: "hero_image_url", l: "Hero Image URL", t: "image-url" },
      { k: "is_active", l: "Active", t: "boolean" },
    ]
  },
  cars: {
    label: "Cars", table: "cars", bucket: null,
    display: ["name", "make", "model", "city", "price_per_day", "available"],
    fields: [
      { k: "name", l: "Name", t: "text", req: true },
      { k: "slug", l: "Slug", t: "text" },
      { k: "description", l: "Description", t: "textarea" },
      { k: "make", l: "Make (Ferrari / Lamborghini)", t: "text" },
      { k: "model", l: "Model", t: "text" },
      { k: "year", l: "Year", t: "number" },
      { k: "color", l: "Color", t: "text" },
      { k: "city", l: "City", t: "text" },
      { k: "price_per_day", l: "Price per Day ($)", t: "number" },
      { k: "hero_image_url", l: "Hero Image URL", t: "image-url" },
      { k: "available", l: "Available", t: "boolean" },
    ]
  },
};

var TABS = ["restaurants", "yachts", "wellness", "nightlife", "cars", "images"];

function Mark({ size, color }) {
  var sw = Math.max(size * 0.06, 1.5);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ display: "block" }}>
      <line x1="20" y1="80" x2="40" y2="18" stroke={color || C.s1} strokeWidth={sw} strokeLinecap="round" />
      <line x1="80" y1="80" x2="60" y2="18" stroke={color || C.s1} strokeWidth={sw} strokeLinecap="round" />
      <line x1="40" y1="18" x2="60" y2="18" stroke={color || C.s1} strokeWidth={sw} strokeLinecap="round" />
      <line x1="32" y1="56" x2="68" y2="56" stroke={color || C.s1} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: type === "error" ? C.rd : C.gn, color: "#fff", padding: "12px 24px",
      borderRadius: 12, ...sf(14, 500), zIndex: 99999,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)", pointerEvents: "none",
      animation: "fadeInUp 0.3s cubic-bezier(0.16,1,0.3,1)"
    }}>
      {msg}
    </div>
  );
}

function PasswordGate({ onAuth }) {
  var [pw, setPw] = useState("");
  var [err, setErr] = useState(false);
  var [shake, setShake] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (pw === ADMIN_PWD) {
      sessionStorage.setItem("alfred_admin_auth", "1");
      onAuth();
    } else {
      setErr(true);
      setShake(true);
      setTimeout(function() { setErr(false); setShake(false); }, 2000);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .admin-input:focus { border-color: rgba(244,244,245,0.3) !important; outline: none; }
        .admin-btn:hover { opacity: 0.9; }
        .admin-row-btn:hover { background: rgba(244,244,245,0.06) !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3F3F46; border-radius: 3px; }
      `}</style>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 48 }}>
          <Mark size={40} color={C.s1} />
          <div style={{ textAlign: "center" }}>
            <div style={{ ...sf(22, 600), color: C.s1, letterSpacing: -0.5 }}>Alfred Admin</div>
            <div style={{ ...sf(13, 400), color: C.s5, marginTop: 4 }}>Platform management console</div>
          </div>
        </div>
        <form onSubmit={submit} style={{ animation: shake ? "shake 0.4s ease" : "none" }}>
          <input
            className="admin-input"
            type="password"
            value={pw}
            onChange={function(e) { setPw(e.target.value); }}
            placeholder="Admin password"
            autoFocus
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 12, boxSizing: "border-box",
              background: C.el, border: "1px solid " + (err ? C.rd : C.bd),
              color: C.s1, ...sf(15), transition: "border-color 0.2s", marginBottom: 12
            }}
          />
          <button type="submit" className="admin-btn" style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: C.s1, cursor: "pointer", ...sf(15, 600), color: C.bg, transition: "opacity 0.2s"
          }}>
            Sign In
          </button>
          {err && <p style={{ ...sf(13), color: C.rd, textAlign: "center", marginTop: 12 }}>Incorrect password</p>}
        </form>
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange, bucket }) {
  var fileRef = useRef(null);
  var [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    var file = e.target.files[0];
    if (!file || !bucket) return;
    setUploading(true);
    var ext = file.name.split(".").pop();
    var path = Date.now() + "_" + Math.random().toString(36).slice(2) + "." + ext;
    var { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (!error) {
      var { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
    e.target.value = "";
  }

  var inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 10, boxSizing: "border-box",
    background: C.srf, border: "1px solid " + C.bd, color: C.s1, ...sf(14),
    transition: "border-color 0.2s", resize: "vertical"
  };

  if (field.t === "boolean") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          onClick={function() { onChange(!value); }}
          style={{
            width: 44, height: 26, borderRadius: 13, cursor: "pointer", transition: "background 0.3s",
            background: value ? C.gn : C.s7, position: "relative", flexShrink: 0
          }}
        >
          <div style={{
            position: "absolute", top: 3, left: value ? 21 : 3, width: 20, height: 20,
            borderRadius: "50%", background: "#fff", transition: "left 0.3s cubic-bezier(0.16,1,0.3,1)"
          }} />
        </div>
        <span style={{ ...sf(13), color: value ? C.gn : C.s5 }}>{value ? "Yes" : "No"}</span>
      </div>
    );
  }
  if (field.t === "textarea") {
    return (
      <textarea
        className="admin-input"
        value={value || ""}
        onChange={function(e) { onChange(e.target.value); }}
        rows={3}
        style={inputStyle}
      />
    );
  }
  if (field.t === "select") {
    return (
      <select
        className="admin-input"
        value={value || ""}
        onChange={function(e) { onChange(e.target.value); }}
        style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
      >
        <option value="">— select —</option>
        {field.opts.map(function(o) { return <option key={o} value={o}>{o}</option>; })}
      </select>
    );
  }
  if (field.t === "image-url") {
    return (
      <div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            className="admin-input"
            type="text"
            value={value || ""}
            onChange={function(e) { onChange(e.target.value); }}
            placeholder="https://..."
            style={{ ...inputStyle, flex: 1 }}
          />
          {bucket && (
            <>
              <button
                type="button"
                onClick={function() { fileRef.current && fileRef.current.click(); }}
                disabled={uploading}
                style={{
                  padding: "10px 14px", borderRadius: 10, border: "1px solid " + C.bd,
                  background: C.el, color: uploading ? C.s5 : C.s2, cursor: uploading ? "default" : "pointer",
                  ...sf(12, 500), whiteSpace: "nowrap", flexShrink: 0
                }}
              >
                {uploading ? "Uploading…" : "Upload"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
            </>
          )}
        </div>
        {value && (
          <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", width: 120, height: 72 }}>
            <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>
    );
  }
  return (
    <input
      className="admin-input"
      type={field.t === "number" ? "number" : "text"}
      value={value !== null && value !== undefined ? value : ""}
      onChange={function(e) { onChange(field.t === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value); }}
      style={inputStyle}
    />
  );
}

function RecordModal({ config, record, onSave, onClose }) {
  var isNew = !record || !record.id;
  var [form, setForm] = useState(function() {
    var init = {};
    config.fields.forEach(function(f) {
      init[f.k] = record ? (record[f.k] !== undefined ? record[f.k] : (f.t === "boolean" ? false : "")) : (f.t === "boolean" ? false : "");
    });
    return init;
  });
  var [saving, setSaving] = useState(false);
  var [errors, setErrors] = useState({});

  function setField(k, v) { setForm(function(prev) { return { ...prev, [k]: v }; }); }

  async function handleSave(e) {
    e.preventDefault();
    var errs = {};
    config.fields.forEach(function(f) {
      if (f.req && !form[f.k]) errs[f.k] = true;
    });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    var payload = {};
    config.fields.forEach(function(f) {
      if (form[f.k] !== "" && form[f.k] !== null && form[f.k] !== undefined) payload[f.k] = form[f.k];
      else if (f.t === "boolean") payload[f.k] = form[f.k];
    });
    var { data, error } = isNew
      ? await supabase.from(config.table).insert([payload]).select().single()
      : await supabase.from(config.table).update(payload).eq("id", record.id).select().single();
    setSaving(false);
    if (!error) onSave(data);
    else onSave(null, error);
  }

  return (
    <div
      onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
        zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "flex-end",
        padding: "0", overflowY: "auto"
      }}
    >
      <div style={{
        width: "100%", maxWidth: 560, minHeight: "100vh", background: C.el,
        borderLeft: "1px solid " + C.bd, display: "flex", flexDirection: "column",
        animation: "slideIn 0.35s cubic-bezier(0.16,1,0.3,1)"
      }}>
        <style>{`@keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid " + C.bd, flexShrink: 0
        }}>
          <div>
            <div style={{ ...sf(17, 600), color: C.s1 }}>{isNew ? "Add " + config.label.slice(0, -1) : "Edit Record"}</div>
            {!isNew && record.name && <div style={{ ...sf(12), color: C.s5, marginTop: 2 }}>{record.name}</div>}
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: "none", background: C.srf,
            color: C.s4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", ...sf(18)
          }}>×</button>
        </div>
        {/* Form */}
        <form onSubmit={handleSave} style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {config.fields.map(function(field) {
              return (
                <div key={field.k}>
                  <label style={{ display: "block", ...sf(12, 500), color: C.s4, marginBottom: 6, letterSpacing: 0.3 }}>
                    {field.l}{field.req && <span style={{ color: C.rd, marginLeft: 3 }}>*</span>}
                  </label>
                  <FieldInput
                    field={field}
                    value={form[field.k]}
                    onChange={function(v) { setField(field.k, v); }}
                    bucket={config.bucket}
                  />
                  {errors[field.k] && <div style={{ ...sf(12), color: C.rd, marginTop: 4 }}>Required</div>}
                </div>
              );
            })}
          </div>
          <div style={{ height: 100 }} />
        </form>
        {/* Footer */}
        <div style={{
          display: "flex", gap: 10, padding: "16px 24px", borderTop: "1px solid " + C.bd, flexShrink: 0,
          background: C.el
        }}>
          <button type="button" onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 10, border: "1px solid " + C.bd,
            background: "transparent", color: C.s3, cursor: "pointer", ...sf(14, 500)
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 2, padding: "12px", borderRadius: 10, border: "none",
            background: saving ? C.s7 : C.s1, color: C.bg, cursor: saving ? "default" : "pointer",
            ...sf(14, 600), transition: "background 0.2s"
          }}>
            {saving ? "Saving…" : (isNew ? "Create" : "Save Changes")}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ name, onConfirm, onClose, deleting }) {
  return (
    <div
      onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
        zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: 24
      }}
    >
      <div style={{
        background: C.el, border: "1px solid " + C.bd, borderRadius: 20, padding: "28px 32px",
        maxWidth: 380, width: "100%", textAlign: "center",
        animation: "fadeIn 0.2s ease"
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%", background: "rgba(255,59,48,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px"
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.rd} strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <div style={{ ...sf(17, 600), color: C.s1, marginBottom: 8 }}>Delete Record</div>
        <div style={{ ...sf(14), color: C.s5, lineHeight: 1.5, marginBottom: 24 }}>
          Are you sure you want to delete <strong style={{ color: C.s2 }}>{name}</strong>? This cannot be undone.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", borderRadius: 10, border: "1px solid " + C.bd,
            background: "transparent", color: C.s3, cursor: "pointer", ...sf(14, 500)
          }}>Cancel</button>
          <button onClick={onConfirm} disabled={deleting} style={{
            flex: 1, padding: "11px", borderRadius: 10, border: "none",
            background: C.rd, color: "#fff", cursor: deleting ? "default" : "pointer",
            ...sf(14, 600), opacity: deleting ? 0.6 : 1
          }}>
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageManager() {
  var BUCKETS = ["restaurant-photos", "yacht-images"];
  var [bucket, setBucket] = useState(BUCKETS[0]);
  var [images, setImages] = useState([]);
  var [loading, setLoading] = useState(false);
  var [deleting, setDeleting] = useState(null);
  var [toast, setToast] = useState(null);
  var fileRef = useRef(null);
  var [uploading, setUploading] = useState(false);

  function showToast(msg, type) {
    setToast({ msg, type });
    setTimeout(function() { setToast(null); }, 3000);
  }

  async function loadImages() {
    setLoading(true);
    var { data, error } = await supabase.storage.from(bucket).list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (!error && data) setImages(data.filter(function(f) { return f.name && !f.name.endsWith("/"); }));
    else setImages([]);
    setLoading(false);
  }

  useEffect(function() { loadImages(); }, [bucket]);

  function getPublicUrl(name) {
    return supabase.storage.from(bucket).getPublicUrl(name).data.publicUrl;
  }

  async function handleUpload(e) {
    var file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    var ext = file.name.split(".").pop();
    var path = Date.now() + "_" + Math.random().toString(36).slice(2) + "." + ext;
    var { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (!error) { showToast("Image uploaded", "success"); loadImages(); }
    else showToast("Upload failed: " + error.message, "error");
    setUploading(false);
    e.target.value = "";
  }

  async function handleDelete(name) {
    setDeleting(name);
    var { error } = await supabase.storage.from(bucket).remove([name]);
    if (!error) { showToast("Deleted", "success"); setImages(function(prev) { return prev.filter(function(i) { return i.name !== name; }); }); }
    else showToast("Delete failed: " + error.message, "error");
    setDeleting(null);
  }

  function copyUrl(name) {
    navigator.clipboard.writeText(getPublicUrl(name)).then(function() { showToast("URL copied!", "success"); });
  }

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {BUCKETS.map(function(b) {
            return (
              <button key={b} onClick={function() { setBucket(b); }} style={{
                padding: "8px 16px", borderRadius: 10, border: "1px solid " + (bucket === b ? C.s4 : C.bd),
                background: bucket === b ? C.srf : "transparent", color: bucket === b ? C.s1 : C.s5,
                cursor: "pointer", ...sf(13, bucket === b ? 600 : 400)
              }}>{b}</button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ ...sf(13), color: C.s5 }}>{images.length} files</span>
          <button onClick={function() { fileRef.current && fileRef.current.click(); }} disabled={uploading} style={{
            padding: "9px 18px", borderRadius: 10, border: "none", background: C.s1,
            color: C.bg, cursor: uploading ? "default" : "pointer", ...sf(13, 600),
            opacity: uploading ? 0.6 : 1, display: "flex", alignItems: "center", gap: 6
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {uploading ? "Uploading…" : "Upload"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: C.s5, ...sf(14) }}>Loading images…</div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: C.s5, ...sf(14) }}>No images in this bucket yet.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {images.map(function(img) {
            var url = getPublicUrl(img.name);
            return (
              <div key={img.name} style={{ borderRadius: 12, overflow: "hidden", background: C.srf, border: "1px solid " + C.bd, position: "relative" }}>
                <img src={url} alt={img.name} loading="lazy" style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                <div style={{ padding: "8px 10px" }}>
                  <div style={{ ...sf(11), color: C.s5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 6 }}>{img.name}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={function() { copyUrl(img.name); }} style={{
                      flex: 1, padding: "5px 0", borderRadius: 7, border: "1px solid " + C.bd,
                      background: "transparent", color: C.s4, cursor: "pointer", ...sf(11)
                    }}>Copy URL</button>
                    <button
                      onClick={function() { if (window.confirm("Delete " + img.name + "?")) handleDelete(img.name); }}
                      disabled={deleting === img.name}
                      style={{
                        padding: "5px 8px", borderRadius: 7, border: "none",
                        background: "rgba(255,59,48,0.15)", color: C.rd, cursor: "pointer", ...sf(11)
                      }}
                    >Del</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DataSection({ tabKey }) {
  var config = CONFIGS[tabKey];
  var [records, setRecords] = useState([]);
  var [loading, setLoading] = useState(true);
  var [search, setSearch] = useState("");
  var [editRecord, setEditRecord] = useState(null);
  var [showModal, setShowModal] = useState(false);
  var [deleteTarget, setDeleteTarget] = useState(null);
  var [deleting, setDeleting] = useState(false);
  var [toast, setToast] = useState(null);

  function showToast(msg, type) {
    setToast({ msg, type });
    setTimeout(function() { setToast(null); }, 3000);
  }

  async function loadData() {
    setLoading(true);
    var { data, error } = await supabase.from(config.table).select("*").order("id", { ascending: false });
    if (!error && data) setRecords(data);
    else setRecords([]);
    setLoading(false);
  }

  useEffect(function() { loadData(); }, [tabKey]);

  var filtered = records.filter(function(r) {
    if (!search) return true;
    var q = search.toLowerCase();
    return Object.values(r).some(function(v) { return v && String(v).toLowerCase().includes(q); });
  });

  function openAdd() { setEditRecord(null); setShowModal(true); }
  function openEdit(r) { setEditRecord(r); setShowModal(true); }

  async function handleSave(data, error) {
    if (error) { showToast("Error: " + error.message, "error"); return; }
    setShowModal(false);
    showToast(editRecord ? "Saved successfully" : "Record created", "success");
    loadData();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    var { error } = await supabase.from(config.table).delete().eq("id", deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    if (!error) { showToast("Record deleted", "success"); loadData(); }
    else showToast("Delete failed: " + error.message, "error");
  }

  var boolField = config.display.find(function(k) { return k === "available" || k === "is_active"; });

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {showModal && (
        <RecordModal
          config={config}
          record={editRecord}
          onSave={handleSave}
          onClose={function() { setShowModal(false); }}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name || deleteTarget.id}
          onConfirm={handleDelete}
          onClose={function() { setDeleteTarget(null); }}
          deleting={deleting}
        />
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="admin-input"
            value={search}
            onChange={function(e) { setSearch(e.target.value); }}
            placeholder={"Search " + config.label.toLowerCase() + "…"}
            style={{
              width: "100%", padding: "10px 12px 10px 36px", borderRadius: 12, boxSizing: "border-box",
              background: C.el, border: "1px solid " + C.bd, color: C.s1, ...sf(14)
            }}
          />
        </div>
        <div style={{ ...sf(13), color: C.s5 }}>{filtered.length} records</div>
        <button onClick={openAdd} style={{
          padding: "10px 18px", borderRadius: 12, border: "none", background: C.s1,
          color: C.bg, cursor: "pointer", ...sf(13, 600), display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap"
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Add {config.label.slice(0, -1)}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: C.s5, ...sf(14) }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: C.s5, ...sf(14) }}>
          {search ? "No results for \"" + search + "\"" : "No records yet. Add the first one!"}
        </div>
      ) : (
        <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid " + C.bd }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid " + C.bd }}>
                <th style={{ width: 52, padding: "0 0 0 16px" }} />
                <th style={{ padding: "12px 16px", textAlign: "left", ...sf(11, 600), color: C.s5, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>Name</th>
                {config.display.filter(function(k) { return k !== "name" && k !== "available" && k !== "is_active"; }).map(function(k) {
                  return (
                    <th key={k} style={{ padding: "12px 16px", textAlign: "left", ...sf(11, 600), color: C.s5, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {k.replace(/_/g, " ")}
                    </th>
                  );
                })}
                <th style={{ padding: "12px 16px", textAlign: "center", ...sf(11, 600), color: C.s5, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>Status</th>
                <th style={{ padding: "12px 16px", textAlign: "right", ...sf(11, 600), color: C.s5, letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(function(r, i) {
                var img = r.hero_image_url || r.image_url || "";
                var isAvail = boolField ? r[boolField] : true;
                return (
                  <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid " + C.bd : "none", background: "transparent", transition: "background 0.15s" }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = C.srf; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "10px 8px 10px 16px" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", background: C.srf, flexShrink: 0 }}>
                        {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: C.bd }} />}
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ ...sf(14, 500), color: C.s1 }}>{r.name || "—"}</div>
                      {r.slug && <div style={{ ...sf(11), color: C.s6, marginTop: 2 }}>/{r.slug}</div>}
                    </td>
                    {config.display.filter(function(k) { return k !== "name" && k !== "available" && k !== "is_active"; }).map(function(k) {
                      var v = r[k];
                      var display = v !== null && v !== undefined && v !== "" ? String(v) : "—";
                      return (
                        <td key={k} style={{ padding: "10px 16px", ...sf(13), color: C.s4, whiteSpace: "nowrap" }}>{display}</td>
                      );
                    })}
                    <td style={{ padding: "10px 16px", textAlign: "center" }}>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20,
                        background: isAvail ? "rgba(52,199,89,0.12)" : "rgba(113,113,122,0.15)",
                        ...sf(11, 500), color: isAvail ? C.gn : C.s5
                      }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: isAvail ? C.gn : C.s6 }} />
                        {isAvail ? "Active" : "Inactive"}
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button onClick={function() { openEdit(r); }} className="admin-row-btn" style={{
                          padding: "7px 14px", borderRadius: 9, border: "1px solid " + C.bd,
                          background: "transparent", color: C.s3, cursor: "pointer", ...sf(12, 500), transition: "background 0.15s"
                        }}>Edit</button>
                        <button onClick={function() { setDeleteTarget(r); }} className="admin-row-btn" style={{
                          padding: "7px 10px", borderRadius: 9, border: "none",
                          background: "rgba(255,59,48,0.1)", color: C.rd, cursor: "pointer", ...sf(12, 500)
                        }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  var [authed, setAuthed] = useState(function() {
    return sessionStorage.getItem("alfred_admin_auth") === "1";
  });
  var [tab, setTab] = useState("restaurants");

  if (!authed) return <PasswordGate onAuth={function() { setAuthed(true); }} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fadeInUp { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        .admin-input:focus { border-color: rgba(244,244,245,0.25) !important; outline: none; }
        .admin-row-btn:hover { background: rgba(244,244,245,0.06) !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3F3F46; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid " + C.bd, background: C.el, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Mark size={24} color={C.s1} />
            <span style={{ ...sf(16, 600), color: C.s1 }}>Alfred</span>
            <span style={{ ...sf(10, 600), color: C.s6, letterSpacing: 1.5, textTransform: "uppercase", marginLeft: 4 }}>Admin</span>
          </div>
          <button
            onClick={function() { sessionStorage.removeItem("alfred_admin_auth"); setAuthed(false); }}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid " + C.bd, background: "transparent", color: C.s5, cursor: "pointer", ...sf(12) }}
          >Sign out</button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ borderBottom: "1px solid " + C.bd, background: C.el }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", gap: 2, overflowX: "auto" }}>
          {TABS.map(function(t) {
            var label = t === "images" ? "Images" : CONFIGS[t].label;
            var active = tab === t;
            return (
              <button key={t} onClick={function() { setTab(t); }} style={{
                padding: "14px 16px", border: "none", background: "transparent", cursor: "pointer",
                ...sf(13, active ? 600 : 400), color: active ? C.s1 : C.s5,
                borderBottom: "2px solid " + (active ? C.s1 : "transparent"),
                transition: "all 0.2s", whiteSpace: "nowrap"
              }}>{label}</button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ ...sf(22, 700), color: C.s1, letterSpacing: -0.5 }}>
            {tab === "images" ? "Image Library" : CONFIGS[tab].label}
          </h1>
          <p style={{ ...sf(13), color: C.s5, marginTop: 4 }}>
            {tab === "images" ? "Manage images across all storage buckets" : "Manage all " + CONFIGS[tab].label.toLowerCase() + " on the Alfred platform"}
          </p>
        </div>
        {tab === "images" ? <ImageManager /> : <DataSection key={tab} tabKey={tab} />}
      </div>
    </div>
  );
}
