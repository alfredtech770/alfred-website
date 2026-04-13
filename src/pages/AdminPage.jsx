import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

/* ═══ Admin Supabase Client (service role for full CRUD) ═══ */
var SUPA_URL = import.meta.env.VITE_SUPABASE_URL || "https://fbdgbnnkgyljehtccgaq.supabase.co";
var SUPA_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZGdibm5rZ3lsamVodGNjZ2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NjA5MzgsImV4cCI6MjA4MjMzNjkzOH0.NmlSkGMDZ-DmhV0bmSCFPQmuFNo4E5H-Sz1cjRyYs8Q";
var supabase = createClient(SUPA_URL, SUPA_KEY);

/* ═══ Design Tokens ═══ */
var sf = function(size, weight){
  return {fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", fontSize:size, fontWeight:weight||400, WebkitFontSmoothing:"antialiased"};
};
var C = {
  bg:"#09090B", bg2:"#0F0F12", el:"#18181B", srf:"#1F1F23", bd:"#2C2C31", bd2:"#3F3F46",
  s1:"#F4F4F5", s2:"#E4E4E7", s3:"#D4D4D8", s4:"#A1A1AA",
  s5:"#71717A", s6:"#52525B", s7:"#3F3F46",
  gn:"#34C759", rd:"#FF3B30", gd:"#FFD60A", bl:"#007AFF", or:"#FF9500",
  gdGrad:"linear-gradient(135deg,#FFD60A 0%,#FFF1A8 50%,#FFD60A 100%)"
};

/* ═══ Slack Integration ═══ */
var SLACK_HOOKS = {
  bookings: import.meta.env.VITE_SLACK_BOOKINGS || import.meta.env.VITE_SLACK_WEBHOOK || "",
  signups: import.meta.env.VITE_SLACK_SIGNUPS || "",
  downloads: import.meta.env.VITE_SLACK_DOWNLOADS || "",
  inventory: import.meta.env.VITE_SLACK_INVENTORY || "",
  vip: import.meta.env.VITE_SLACK_VIP || ""
};

function getWebhook(action){
  if(action==="booking")return SLACK_HOOKS.bookings;
  if(action==="signup")return SLACK_HOOKS.signups||SLACK_HOOKS.bookings;
  if(action==="download")return SLACK_HOOKS.downloads||SLACK_HOOKS.bookings;
  if(action==="created"||action==="updated"||action==="deleted"||action==="bulk"||action==="image")return SLACK_HOOKS.inventory||SLACK_HOOKS.bookings;
  if(action==="vip")return SLACK_HOOKS.vip||SLACK_HOOKS.bookings;
  return SLACK_HOOKS.bookings;
}

async function notifySlack(action, category, name, details){
  var emoji = {
    created:":white_check_mark:",updated:":pencil2:",deleted:":wastebasket:",
    status:":arrows_counterclockwise:",image:":frame_with_picture:",
    booking:":calendar:",bulk:":package:",signup:":wave:",download:":arrow_down:",vip:":star2:"
  }[action]||":bell:";
  var color = {
    created:"#34C759",updated:"#007AFF",deleted:"#FF3B30",
    status:"#FF9500",image:"#D4A853",booking:"#D4A853",bulk:"#FF9500"
  }[action]||"#A1A1AA";
  var actionLabel = {
    created:"New Record Added",updated:"Record Updated",deleted:"Record Deleted",
    status:"Status Changed",image:"Images Updated",booking:"Booking Updated",bulk:"Bulk Action",
    signup:"New Member Signed Up",download:"New App Download",vip:"VIP Client Update"
  }[action]||action;
  var webhook=getWebhook(action);
  if(!webhook)return;
  try{
    await fetch(webhook,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        blocks:[
          {type:"header",text:{type:"plain_text",text:emoji+" "+actionLabel}},
          {type:"section",fields:[
            {type:"mrkdwn",text:"*Category:*\n"+category},
            {type:"mrkdwn",text:"*Name:*\n"+(name||"-")}
          ]},
          ...(details?[{type:"section",text:{type:"mrkdwn",text:details}}]:[]),
          {type:"context",elements:[{type:"mrkdwn",text:":clock1: "+new Date().toLocaleString("en-US",{dateStyle:"medium",timeStyle:"short"})+" | Alfred Admin"}]}
        ]
      })
    });
  }catch(e){console.log("Slack notify error:",e);}
}

/* ═══ Icons (inline SVG) ═══ */
function Icon({name,size,color}){
  var s=size||18, c=color||C.s4;
  var paths={
    dashboard:"M4 13h6a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1zm0 7h6a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1zm10 0h6a1 1 0 001-1v-8a1 1 0 00-1-1h-6a1 1 0 00-1 1v8a1 1 0 001 1zm0-18a1 1 0 00-1 1v4a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1h-6z",
    restaurant:"M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z",
    yacht:"M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.13.52-.05.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z",
    wellness:"M17.73 12.02l3.98-3.98a.996.996 0 000-1.41l-4.34-4.34a.996.996 0 00-1.41 0l-3.98 3.98L8 2.29C7.8 2.1 7.55 2 7.29 2c-.25 0-.51.1-.7.29L2.25 6.63a.996.996 0 000 1.41l3.98 3.98L2.25 16a.996.996 0 000 1.41l4.34 4.34c.39.39 1.02.39 1.41 0l3.98-3.98 3.98 3.98c.2.2.45.29.71.29.26 0 .51-.1.71-.29l4.34-4.34a.996.996 0 000-1.41l-3.99-3.98zM12 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4.71 1.96L3.66 7.34l3.63-3.63 3.62 3.62-3.62 3.63zM10 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2.66 9.34l-3.63-3.62 3.63-3.63 3.62 3.62-3.62 3.63z",
    nightlife:"M6 2l.01 6L10 12l-3.99 4.01L6 22h12v-6l-4-4 4-3.99V2H6zm10 14.5V20H8v-3.5l4-4 4 4z",
    car:"M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
    clients:"M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    bookings:"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z",
    images:"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
    search:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    add:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    edit:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    del:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    up:"M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z",
    down:"M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z",
    star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    close:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    menu:"M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    logout:"M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
    slack:"M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 01-2.523 2.521 2.528 2.528 0 01-2.52-2.521V2.522A2.528 2.528 0 0115.163 0a2.528 2.528 0 012.523 2.522v6.312zM15.163 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.163 24a2.528 2.528 0 01-2.52-2.522v-2.522h2.52zm0-1.27a2.528 2.528 0 01-2.52-2.523 2.528 2.528 0 012.52-2.52h6.315A2.528 2.528 0 0124 15.163a2.528 2.528 0 01-2.522 2.523h-6.315z",
    filter:"M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z",
    check:"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d={paths[name]||paths.dashboard}/></svg>;
}

/* ═══ Category Config ═══ */
var CATS = [
  {
    id:"restaurants", label:"Restaurants", table:"restaurants", icon:"restaurant",
    bucket:"restaurant-photos", imgField:"hero_image_url", galleryField:"gallery_photos",
    orderField:"photos_order",
    cols:["name","cuisine","city","price_level","rating","is_active"],
    fields:[
      {k:"name",l:"Name",t:"text",req:true},
      {k:"slug",l:"Slug",t:"text"},
      {k:"cuisine",l:"Cuisine",t:"text"},
      {k:"city",l:"City",t:"select",opts:["Miami","Paris","New York","Los Angeles","London"]},
      {k:"vibe",l:"Vibe",t:"text"},
      {k:"tagline",l:"Tagline",t:"text",wide:true},
      {k:"description",l:"Description",t:"textarea",wide:true},
      {k:"price_level",l:"Price Level",t:"select",opts:["1","2","3","4"]},
      {k:"rating",l:"Rating",t:"number"},
      {k:"avg_spend",l:"Avg Spend",t:"text"},
      {k:"dress_code",l:"Dress Code",t:"text"},
      {k:"address",l:"Address",t:"text",wide:true},
      {k:"phone_number",l:"Phone",t:"text"},
      {k:"website_url",l:"Website",t:"text"},
      {k:"instagram_url",l:"Instagram",t:"text"},
      {k:"booking_platform",l:"Booking Platform",t:"text"},
      {k:"opening_hours",l:"Available Time Slots",t:"timeslots",wide:true},
      {k:"hours_lunch",l:"Lunch Hours (text)",t:"text"},
      {k:"hours_dinner",l:"Dinner Hours (text)",t:"text"},
      {k:"hours_closed",l:"Closed Days",t:"text"},
      {k:"peak_price_per_person",l:"Peak Price / Person",t:"number"},
      {k:"peak_perks",l:"Peak Perks (comma-separated)",t:"tags",wide:true},
      {k:"category",l:"Category",t:"select",opts:["restaurant","bar","cafe","bakery","lounge"]},
      {k:"chef_name",l:"Chef Name",t:"text"},
      {k:"alfred_note",l:"Alfred Note",t:"textarea",wide:true},
      {k:"alfred_tip",l:"Alfred Tip",t:"textarea",wide:true},
      {k:"is_active",l:"Active",t:"bool"},
      {k:"is_featured",l:"Featured",t:"bool"},
      {k:"available_tonight",l:"Available Tonight",t:"bool"},
      {k:"instant_booking_available",l:"Instant Booking",t:"bool"},
    ]
  },
  {
    id:"yachts", label:"Yachts", table:"yachts", icon:"yacht",
    bucket:"yacht-images", imgField:"hero_image_url", galleryField:"photos_order",
    orderField:"photos_order",
    cols:["name","brand","city","max_passengers","price_4hr","is_active"],
    fields:[
      {k:"name",l:"Name",t:"text",req:true},
      {k:"brand",l:"Brand",t:"text"},
      {k:"yacht_type",l:"Type",t:"text"},
      {k:"city",l:"City",t:"select",opts:["Miami","Paris","Monaco","Ibiza","Cannes"]},
      {k:"location",l:"Location",t:"text"},
      {k:"size_ft",l:"Size (ft)",t:"number"},
      {k:"max_passengers",l:"Max Guests",t:"number"},
      {k:"cabins",l:"Cabins",t:"number"},
      {k:"crew",l:"Crew",t:"number"},
      {k:"year_built",l:"Year Built",t:"number"},
      {k:"price_4hr",l:"4hr Price",t:"number"},
      {k:"price_6hr",l:"6hr Price",t:"number"},
      {k:"price_8hr",l:"8hr Price",t:"number"},
      {k:"price_weekday_4hr",l:"Weekday 4hr",t:"number"},
      {k:"price_per_day",l:"Price/Day",t:"number"},
      {k:"security_deposit",l:"Deposit",t:"number"},
      {k:"description",l:"Description",t:"textarea",wide:true},
      {k:"whats_included",l:"Included",t:"textarea",wide:true},
      {k:"not_included",l:"Not Included",t:"textarea",wide:true},
      {k:"payment_methods",l:"Payment",t:"text"},
      {k:"is_active",l:"Active",t:"bool"},
      {k:"is_featured",l:"Featured",t:"bool"},
    ]
  },
  {
    id:"wellness", label:"Wellness", table:"wellness", icon:"wellness",
    bucket:"wellness-images", imgField:"hero_image_url", galleryField:"photos_order",
    orderField:"photos_order",
    cols:["name","type","city","rating","is_active"],
    fields:[
      {k:"name",l:"Name",t:"text",req:true},
      {k:"slug",l:"Slug",t:"text"},
      {k:"type",l:"Type",t:"text"},
      {k:"city",l:"City",t:"select",opts:["Miami","Paris","New York","Los Angeles"]},
      {k:"description",l:"Description",t:"textarea",wide:true},
      {k:"address",l:"Address",t:"text",wide:true},
      {k:"rating",l:"Rating",t:"number"},
      {k:"price_level",l:"Price Level",t:"select",opts:["1","2","3","4"]},
      {k:"phone_number",l:"Phone",t:"text"},
      {k:"website_url",l:"Website",t:"text"},
      {k:"instagram_url",l:"Instagram",t:"text"},
      {k:"is_active",l:"Active",t:"bool"},
      {k:"is_featured",l:"Featured",t:"bool"},
    ]
  },
  {
    id:"cars", label:"Cars", table:"cars", icon:"car",
    bucket:"car-images", imgField:"hero_image_url", galleryField:"photos_order",
    orderField:"photos_order",
    cols:["name","brand","city","price_1_day","is_active"],
    fields:[
      {k:"name",l:"Name",t:"text",req:true},
      {k:"brand",l:"Brand",t:"text"},
      {k:"category",l:"Category",t:"text"},
      {k:"type",l:"Type",t:"text"},
      {k:"city",l:"City",t:"select",opts:["Miami","Paris","Los Angeles","New York","Dubai"]},
      {k:"hp",l:"HP",t:"number"},
      {k:"acceleration",l:"0-60",t:"text"},
      {k:"top_speed",l:"Top Speed",t:"text"},
      {k:"engine",l:"Engine",t:"text"},
      {k:"transmission",l:"Transmission",t:"text"},
      {k:"seats",l:"Seats",t:"number"},
      {k:"deposit",l:"Deposit",t:"number"},
      {k:"price_1_day",l:"1 Day",t:"number"},
      {k:"price_3_day",l:"3 Days",t:"number"},
      {k:"price_7_day",l:"7 Days",t:"number"},
      {k:"price_30_day",l:"30 Days",t:"number"},
      {k:"description",l:"Description",t:"textarea",wide:true},
      {k:"is_active",l:"Active",t:"bool"},
      {k:"is_featured",l:"Featured",t:"bool"},
      {k:"is_convertible",l:"Convertible",t:"bool"},
    ]
  },
  {
    id:"accommodations", label:"Hotels", table:"accommodations", icon:"star",
    bucket:"venue-photos", imgField:"hero_image_url", galleryField:"photos_order",
    orderField:"photos_order",
    cols:["name","neighborhood","star_rating","status","is_active"],
    fields:[
      {k:"name",l:"Hotel Name",t:"text",req:true},
      {k:"slug",l:"Slug",t:"text"},
      {k:"city",l:"City",t:"select",opts:["Miami","Paris","Dubai","London","New York"]},
      {k:"neighborhood",l:"Neighborhood",t:"text"},
      {k:"address",l:"Address",t:"text",wide:true},
      {k:"category",l:"Category",t:"select",opts:["hotel","resort","boutique","residence"]},
      {k:"star_rating",l:"Stars",t:"number"},
      {k:"description",l:"Description",t:"textarea",wide:true},
      {k:"amenities",l:"Amenities",t:"tags",wide:true},
      {k:"perks",l:"Perks",t:"tags",wide:true},
      {k:"price_level",l:"Price Level (1-5)",t:"number"},
      {k:"rating",l:"Rating",t:"number"},
      {k:"website_url",l:"Website",t:"text"},
      {k:"phone_number",l:"Phone",t:"text"},
      {k:"instagram_url",l:"Instagram",t:"text"},
      {k:"opening_date",l:"Opening Date",t:"text"},
      {k:"status",l:"Status",t:"select",opts:["open","coming_soon","closed"]},
      {k:"is_active",l:"Active",t:"bool"},
      {k:"is_featured",l:"Featured",t:"bool"},
      {k:"is_partner",l:"Partner",t:"bool"},
    ]
  }
];

/* ═══ Shared Styles ═══ */
var btn = function(bg,color,opts){
  return {
    padding:(opts&&opts.sm)?"6px 12px":"10px 18px",
    background:bg||C.srf,border:"1px solid "+(opts&&opts.bd||C.bd),
    borderRadius:(opts&&opts.sm)?8:10,...sf((opts&&opts.sm)?12:14,(opts&&opts.sm)?500:600),
    color:color||C.s3,cursor:"pointer",transition:"all 0.15s",
    display:"inline-flex",alignItems:"center",gap:6,whiteSpace:"nowrap",
    ...(opts&&opts.extra||{})
  };
};

/* ═══ Password Gate ═══ */
function PasswordGate({onAuth}){
  var [pw,setPw]=useState("");
  var [err,setErr]=useState(false);
  var [shake,setShake]=useState(false);

  function submit(e){
    e.preventDefault();
    if(pw==="alfred2026"){onAuth();}
    else{setErr(true);setShake(true);setTimeout(function(){setShake(false);},500);}
  }

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:420,background:C.el,border:"1px solid "+C.bd,borderRadius:24,padding:"48px 40px",animation:shake?"shake 0.5s ease":undefined}}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{...sf(12,700),letterSpacing:4,textTransform:"uppercase",background:C.gdGrad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:16}}>ALFRED</div>
          <h1 style={{...sf(28,600),color:C.s1,margin:0}}>Admin Portal</h1>
          <p style={{...sf(14),color:C.s5,marginTop:10}}>Sign in to manage your platform</p>
        </div>
        <form onSubmit={submit}>
          <input type="password" placeholder="Password" value={pw}
            onChange={function(e){setPw(e.target.value);setErr(false);}} autoFocus
            style={{width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+(err?C.rd:C.bd),borderRadius:12,padding:"14px 16px",...sf(15),color:C.s1,outline:"none",marginBottom:err?8:16,transition:"border-color 0.2s"}}/>
          {err&&<p style={{...sf(13),color:C.rd,marginBottom:12,textAlign:"center"}}>Incorrect password</p>}
          <button type="submit" style={{width:"100%",padding:"14px",background:C.gd,border:"none",borderRadius:12,...sf(15,700),color:"#000",cursor:"pointer",transition:"opacity 0.2s"}}
            onMouseEnter={function(e){e.currentTarget.style.opacity="0.85"}}
            onMouseLeave={function(e){e.currentTarget.style.opacity="1"}}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═══ Stat Card ═══ */
function StatCard({label,value,icon,color}){
  return(
    <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 24px",flex:"1 1 180px",minWidth:160}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <span style={{...sf(12,600),color:C.s5,letterSpacing:1,textTransform:"uppercase"}}>{label}</span>
        <div style={{width:36,height:36,borderRadius:10,background:(color||C.gd)+"15",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon name={icon} size={18} color={color||C.gd}/>
        </div>
      </div>
      <div style={{...sf(32,700),color:C.s1,letterSpacing:-1}}>{value}</div>
    </div>
  );
}

/* ═══ Dashboard View ═══ */
function DashboardView({counts,onNav}){
  var [analytics,setAnalytics]=useState({users:0,bookings:[],recentBookings:[],revenue:0,confirmedBookings:0,cancelledBookings:0,avgPartySize:0,topRestaurants:[],citySplit:{}});

  useEffect(function(){
    async function load(){
      var {data:bookings}=await supabase.from("bookings").select("*").order("created_at",{ascending:false});
      var {data:users}=await supabase.from("users").select("*").order("created_at",{ascending:false});
      bookings=bookings||[];users=users||[];

      var revenue=bookings.reduce(function(s,b){return s+(Number(b.payment_amount)||0);},0);
      var confirmed=bookings.filter(function(b){return b.status==="confirmed";}).length;
      var cancelled=bookings.filter(function(b){return b.status==="cancelled";}).length;
      var avgParty=bookings.length?Math.round(bookings.reduce(function(s,b){return s+(b.party_size||0);},0)/bookings.length*10)/10:0;

      var restCount={};
      bookings.forEach(function(b){if(b.restaurant_name){restCount[b.restaurant_name]=(restCount[b.restaurant_name]||0)+1;}});
      var topRestaurants=Object.entries(restCount).sort(function(a,b){return b[1]-a[1];}).slice(0,5);

      var citySplit={};
      bookings.forEach(function(b){if(b.city){citySplit[b.city]=(citySplit[b.city]||0)+1;}});

      setAnalytics({users:users.length,bookings:bookings,recentBookings:bookings.slice(0,5),revenue:revenue,confirmedBookings:confirmed,cancelledBookings:cancelled,avgPartySize:avgParty,topRestaurants:topRestaurants,citySplit:citySplit,usersList:users});
    }
    load();
  },[]);

  var a=analytics;

  return(
    <div>
      <h2 style={{...sf(24,600),color:C.s1,marginBottom:8,marginTop:0}}>Dashboard</h2>
      <p style={{...sf(14),color:C.s5,marginBottom:28}}>Alfred Admin — real-time platform overview</p>

      {/* Top Stats Row */}
      <div style={{display:"flex",flexWrap:"wrap",gap:16,marginBottom:24}}>
        <StatCard label="Total Users" value={a.users} icon="clients" color={C.gd}/>
        <StatCard label="Bookings" value={a.bookings.length} icon="bookings" color={C.bl}/>
        <StatCard label="Confirmed" value={a.confirmedBookings} icon="check" color={C.gn}/>
        <StatCard label="Cancelled" value={a.cancelledBookings} icon="close" color={C.rd}/>
        <StatCard label="Avg Party" value={a.avgPartySize} icon="clients" color={C.or}/>
      </div>

      {/* Inventory Stats */}
      <div style={{display:"flex",flexWrap:"wrap",gap:16,marginBottom:32}}>
        <StatCard label="Restaurants" value={counts.restaurants||0} icon="restaurant" color={C.gn}/>
        <StatCard label="Yachts" value={counts.yachts||0} icon="yacht" color={C.bl}/>
        <StatCard label="Wellness" value={counts.wellness||0} icon="wellness" color={C.or}/>
        <StatCard label="Cars" value={counts.cars||0} icon="car" color={C.rd}/>
      </div>

      {/* Two Column Layout */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:32}}>
        {/* Recent Bookings */}
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 24px",gridColumn:window.innerWidth<=768?"1/-1":"auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <h3 style={{...sf(15,600),color:C.s2,margin:0}}>Recent Bookings</h3>
            <button onClick={function(){onNav("bookings");}} style={{...sf(12,500),color:C.gd,background:"none",border:"none",cursor:"pointer"}}>View All</button>
          </div>
          {a.recentBookings.length===0?<p style={{...sf(13),color:C.s5}}>No bookings yet</p>:
          a.recentBookings.map(function(b,i){
            var sc={confirmed:C.gn,cancelled:C.rd,pending:C.or}[b.status]||C.s5;
            return(
              <div key={b.id||i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:i<a.recentBookings.length-1?"1px solid "+C.bd:"none"}}>
                <div>
                  <p style={{...sf(13,500),color:C.s2,margin:0}}>{b.restaurant_name}</p>
                  <p style={{...sf(11),color:C.s5,margin:"2px 0 0"}}>{b.reservation_date} · {b.party_size} guests · {b.city}</p>
                </div>
                <span style={{...sf(11,600),padding:"3px 10px",borderRadius:20,background:sc+"15",color:sc,textTransform:"capitalize"}}>{b.status}</span>
              </div>
            );
          })}
        </div>

        {/* Top Venues & City Split */}
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 24px",gridColumn:window.innerWidth<=768?"1/-1":"auto"}}>
          <h3 style={{...sf(15,600),color:C.s2,margin:"0 0 16px"}}>Top Booked Venues</h3>
          {a.topRestaurants.length===0?<p style={{...sf(13),color:C.s5}}>No data yet</p>:
          a.topRestaurants.map(function(t,i){
            var maxCount=a.topRestaurants[0][1];
            return(
              <div key={t[0]} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{...sf(13,500),color:C.s2}}>{t[0]}</span>
                  <span style={{...sf(12,600),color:C.gd}}>{t[1]} booking{t[1]!==1?"s":""}</span>
                </div>
                <div style={{height:6,background:C.srf,borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:(t[1]/maxCount*100)+"%",background:C.gd,borderRadius:3,transition:"width 0.5s"}}/>
                </div>
              </div>
            );
          })}

          <h3 style={{...sf(15,600),color:C.s2,margin:"24px 0 12px"}}>Bookings by City</h3>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {Object.entries(a.citySplit).map(function(e){
              return <div key={e[0]} style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"8px 16px",textAlign:"center"}}>
                <p style={{...sf(18,700),color:C.s1,margin:0}}>{e[1]}</p>
                <p style={{...sf(11),color:C.s5,margin:"2px 0 0"}}>{e[0]}</p>
              </div>;
            })}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      {a.usersList&&a.usersList.length>0&&(
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 24px",marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <h3 style={{...sf(15,600),color:C.s2,margin:0}}>Members</h3>
            <button onClick={function(){onNav("clients");}} style={{...sf(12,500),color:C.gd,background:"none",border:"none",cursor:"pointer"}}>View All</button>
          </div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {a.usersList.slice(0,6).map(function(u){
              return <div key={u.id} style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:12,padding:"12px 16px",minWidth:160,flex:"1 1 160px"}}>
                <p style={{...sf(13,600),color:C.s1,margin:0}}>{(u.first_name||"")+" "+(u.last_name||"")}</p>
                <p style={{...sf(11),color:C.s5,margin:"4px 0 0"}}>{u.email}</p>
                <p style={{...sf(11),color:C.s4,margin:"2px 0 0"}}>{u.preferred_city||"No city"}{u.instagram_handle?" · @"+u.instagram_handle:""}</p>
              </div>;
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h3 style={{...sf(16,600),color:C.s2,marginBottom:16}}>Quick Actions</h3>
      <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
        {CATS.map(function(c){
          return <button key={c.id} onClick={function(){onNav(c.id);}} style={btn(C.srf,C.s2,{bd:C.bd})}>
            <Icon name={c.icon} size={16} color={C.gd}/> Manage {c.label}
          </button>;
        })}
        <button onClick={function(){onNav("bookings");}} style={btn(C.srf,C.s2,{bd:C.bd})}>
          <Icon name="bookings" size={16} color={C.gd}/> View Bookings
        </button>
        <button onClick={function(){onNav("images");}} style={btn(C.srf,C.s2,{bd:C.bd})}>
          <Icon name="images" size={16} color={C.gd}/> Image Library
        </button>
      </div>
    </div>
  );
}

/* ═══ Image Upload Component ═══ */
function ImageUploadBtn({bucket,onUpload,multi}){
  var ref=useRef(null);
  var [uploading,setUploading]=useState(false);

  async function handleFiles(e){
    var files=Array.from(e.target.files);
    if(!files.length)return;
    setUploading(true);
    var urls=[];
    for(var i=0;i<files.length;i++){
      var file=files[i];
      var ext=file.name.split(".").pop();
      var path=Date.now()+"-"+Math.random().toString(36).slice(2,8)+"."+ext;
      var {error}=await supabase.storage.from(bucket).upload(path,file,{upsert:true});
      if(!error){
        var {data:u}=supabase.storage.from(bucket).getPublicUrl(path);
        urls.push(u.publicUrl);
      }
    }
    onUpload(urls);
    setUploading(false);
    if(ref.current)ref.current.value="";
  }

  return(
    <>
      <button onClick={function(){ref.current&&ref.current.click();}} disabled={uploading}
        style={btn(C.srf,C.s3,{sm:true,extra:{opacity:uploading?0.5:1}})}>
        {uploading?"Uploading...":"+ Upload"}
      </button>
      <input ref={ref} type="file" accept="image/*" multiple={!!multi} onChange={handleFiles} style={{display:"none"}}/>
    </>
  );
}

/* ═══ Image Gallery Manager ═══ */
function ImageGalleryManager({record,cat,onUpdate}){
  var hero=record[cat.imgField]||"";
  var gallery=(record[cat.galleryField]||record[cat.orderField]||[]).filter(Boolean);
  var allImages=[hero].concat(gallery).filter(function(v,i,a){return v&&a.indexOf(v)===i;});

  function setHero(url){
    var up={};
    up[cat.imgField]=url;
    onUpdate(up);
  }
  function removeImage(url){
    var up={};
    var newGallery=gallery.filter(function(u){return u!==url;});
    up[cat.galleryField||cat.orderField]=newGallery;
    if(url===hero&&newGallery.length>0)up[cat.imgField]=newGallery[0];
    else if(url===hero)up[cat.imgField]="";
    onUpdate(up);
  }
  function moveImage(url,dir){
    var arr=allImages.slice();
    var idx=arr.indexOf(url);
    if(idx<0)return;
    var newIdx=idx+dir;
    if(newIdx<0||newIdx>=arr.length)return;
    var tmp=arr[newIdx];arr[newIdx]=arr[idx];arr[idx]=tmp;
    var up={};
    up[cat.imgField]=arr[0]||"";
    up[cat.galleryField||cat.orderField]=arr.slice(1);
    onUpdate(up);
  }
  function addImages(urls){
    var up={};
    var newGallery=gallery.concat(urls);
    up[cat.galleryField||cat.orderField]=newGallery;
    if(!hero&&urls.length>0)up[cat.imgField]=urls[0];
    notifySlack("image",cat.label,record.name||"Unknown","*"+urls.length+" image"+(urls.length!==1?"s":"")+"* uploaded to gallery");
    onUpdate(up);
  }

  if(allImages.length===0){
    return(
      <div style={{textAlign:"center",padding:"40px 20px",background:C.srf,borderRadius:12,border:"1px dashed "+C.bd}}>
        <Icon name="images" size={32} color={C.s6}/>
        <p style={{...sf(14),color:C.s5,margin:"12px 0"}}>No images yet</p>
        <ImageUploadBtn bucket={cat.bucket} multi={true} onUpload={addImages}/>
      </div>
    );
  }

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <span style={{...sf(14,600),color:C.s2}}>{allImages.length} image{allImages.length!==1?"s":""}</span>
        <ImageUploadBtn bucket={cat.bucket} multi={true} onUpload={addImages}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
        {allImages.map(function(url,i){
          var isHero=url===hero;
          return(
            <div key={url+i} style={{position:"relative",borderRadius:12,overflow:"hidden",border:"2px solid "+(isHero?C.gd:"transparent"),background:C.srf,aspectRatio:"1"}}>
              <img src={url} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
              {isHero&&<div style={{position:"absolute",top:6,left:6,background:C.gd,borderRadius:6,padding:"2px 8px",...sf(10,700),color:"#000"}}>HERO</div>}
              <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.85))",padding:"24px 6px 6px",display:"flex",gap:4,justifyContent:"center"}}>
                <button onClick={function(){moveImage(url,-1);}} style={{width:26,height:26,borderRadius:6,background:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} title="Move left">
                  <Icon name="up" size={14} color="#fff"/>
                </button>
                <button onClick={function(){moveImage(url,1);}} style={{width:26,height:26,borderRadius:6,background:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} title="Move right">
                  <Icon name="down" size={14} color="#fff"/>
                </button>
                {!isHero&&<button onClick={function(){setHero(url);}} style={{width:26,height:26,borderRadius:6,background:"rgba(212,168,83,0.3)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} title="Set as hero">
                  <Icon name="star" size={14} color={C.gd}/>
                </button>}
                <button onClick={function(){removeImage(url);}} style={{width:26,height:26,borderRadius:6,background:"rgba(255,59,48,0.3)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} title="Remove">
                  <Icon name="del" size={14} color={C.rd}/>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ Field Input ═══ */
function FieldInput({field,value,onChange}){
  var inputStyle={
    width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,
    borderRadius:10,padding:"10px 14px",...sf(14),color:C.s1,outline:"none",
    transition:"border-color 0.2s"
  };

  if(field.t==="bool"){
    return(
      <div onClick={function(){onChange(!value);}} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
        <div style={{width:44,height:24,borderRadius:12,background:value?C.gn:C.s7,position:"relative",transition:"background 0.2s",flexShrink:0}}>
          <div style={{position:"absolute",top:3,left:value?22:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
        </div>
        <span style={{...sf(13),color:C.s4}}>{value?"Active":"Inactive"}</span>
      </div>
    );
  }
  if(field.t==="select"){
    return(
      <select value={value||""} onChange={function(e){onChange(e.target.value);}}
        style={{...inputStyle,appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2371717A' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center"}}>
        <option value="">Select...</option>
        {(field.opts||[]).map(function(o){return <option key={o} value={o}>{o}</option>;})}
      </select>
    );
  }
  if(field.t==="textarea"){
    return <textarea value={value||""} onChange={function(e){onChange(e.target.value);}} rows={3}
      style={{...inputStyle,resize:"vertical"}}
      onFocus={function(e){e.target.style.borderColor=C.gd;}}
      onBlur={function(e){e.target.style.borderColor=C.bd;}}/>;
  }
  if(field.t==="tags"){
    var arr=value||[];
    if(typeof arr==="string")try{arr=JSON.parse(arr)}catch(e){arr=arr.split(",").map(function(s){return s.trim();}).filter(Boolean);}
    var [tagInput,setTagInput]=useState("");
    function addTag(){
      if(!tagInput.trim())return;
      var newArr=arr.concat(tagInput.trim());
      onChange(newArr);setTagInput("");
    }
    function removeTag(i){var a=arr.slice();a.splice(i,1);onChange(a);}
    return(
      <div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
          {arr.map(function(tag,i){
            return <span key={i} style={{...sf(12,500),padding:"4px 10px",borderRadius:8,background:C.gd+"15",color:C.gd,display:"inline-flex",alignItems:"center",gap:6}}>
              {tag}<span onClick={function(){removeTag(i);}} style={{cursor:"pointer",opacity:0.6,fontSize:14}}>×</span>
            </span>;
          })}
        </div>
        <div style={{display:"flex",gap:6}}>
          <input value={tagInput} onChange={function(e){setTagInput(e.target.value);}}
            onKeyDown={function(e){if(e.key==="Enter"){e.preventDefault();addTag();}}}
            placeholder="Type and press Enter"
            style={{...inputStyle,flex:1}}/>
          <button type="button" onClick={addTag} style={{padding:"8px 14px",background:C.srf,border:"1px solid "+C.bd,borderRadius:8,...sf(12,500),color:C.s3,cursor:"pointer"}}>Add</button>
        </div>
      </div>
    );
  }
  if(field.t==="timeslots"){
    var slots=value||[];
    if(typeof slots==="string")try{slots=JSON.parse(slots)}catch(e){slots=[];}
    var LUNCH=["11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00"];
    var DINNER=["18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"];
    function toggleSlot(s){
      var arr=slots.slice();
      var idx=arr.indexOf(s);
      if(idx>=0)arr.splice(idx,1);else arr.push(s);
      arr.sort();
      onChange(arr);
    }
    function toggleAll(group){
      var arr=slots.slice();
      var allIn=group.every(function(s){return arr.indexOf(s)>=0;});
      if(allIn){arr=arr.filter(function(s){return group.indexOf(s)<0;});}
      else{group.forEach(function(s){if(arr.indexOf(s)<0)arr.push(s);});}
      arr.sort();onChange(arr);
    }
    function renderGroup(label,group){
      var allIn=group.every(function(s){return slots.indexOf(s)>=0;});
      return(
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{...sf(12,600),color:C.s3,letterSpacing:0.5}}>{label}</span>
            <button type="button" onClick={function(){toggleAll(group);}}
              style={{...sf(10,500),color:allIn?C.rd:C.gn,background:"none",border:"1px solid "+(allIn?C.rd+"40":C.gn+"40"),borderRadius:6,padding:"2px 8px",cursor:"pointer"}}>
              {allIn?"Clear All":"Select All"}
            </button>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {group.map(function(s){
              var active=slots.indexOf(s)>=0;
              return <button key={s} type="button" onClick={function(){toggleSlot(s);}}
                style={{padding:"6px 12px",borderRadius:8,border:"1px solid "+(active?C.gn+"60":C.bd),
                  background:active?"rgba(52,199,89,0.12)":C.srf,...sf(12,active?600:400),
                  color:active?C.gn:C.s5,cursor:"pointer",transition:"all 0.15s",minWidth:52,textAlign:"center"}}>
                {s}
              </button>;
            })}
          </div>
        </div>
      );
    }
    return(
      <div>
        {renderGroup("Lunch",LUNCH)}
        {renderGroup("Dinner",DINNER)}
        <p style={{...sf(11),color:C.s5,marginTop:4}}>{slots.length} slot{slots.length!==1?"s":""} selected</p>
      </div>
    );
  }
  return(
    <input type={field.t==="number"?"number":"text"} value={value===undefined||value===null?"":value}
      onChange={function(e){onChange(field.t==="number"?(e.target.value===""?null:Number(e.target.value)):e.target.value);}}
      style={inputStyle}
      onFocus={function(e){e.target.style.borderColor=C.gd;}}
      onBlur={function(e){e.target.style.borderColor=C.bd;}}/>
  );
}

/* ═══ Edit Modal ═══ */
function EditModal({cat,record,onClose,onSave}){
  var [form,setForm]=useState(record?{...record}:{is_active:true,category:cat.id==="restaurants"?"restaurant":undefined});
  var [saving,setSaving]=useState(false);
  var [saveErr,setSaveErr]=useState("");
  var [tab,setTab]=useState("details");

  function setField(k,v){setForm(function(p){return{...p,[k]:v};});}

  async function save(){
    setSaving(true);setSaveErr("");
    var payload={...form};
    delete payload.id;delete payload.created_at;delete payload.updated_at;
    var result;
    if(record&&record.id){
      result=await supabase.from(cat.table).update(payload).eq("id",record.id).select();
    }else{
      result=await supabase.from(cat.table).insert(payload).select();
    }
    setSaving(false);
    if(result.error){setSaveErr(result.error.message);return;}
    var action=record&&record.id?"updated":"created";
    notifySlack(action,cat.label,form.name||"Unnamed","*Fields:* "+(cat.fields.filter(function(f){return form[f.k]!==undefined&&form[f.k]!==null&&form[f.k]!==""}).map(function(f){return f.l}).join(", ")));
    onSave();
  }

  function handleImageUpdate(updates){
    Object.keys(updates).forEach(function(k){setField(k,updates[k]);});
  }

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16,backdropFilter:"blur(6px)"}}
      onClick={function(e){if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:20,width:"100%",maxWidth:680,maxHeight:"92vh",display:"flex",flexDirection:"column",animation:"modalIn 0.3s cubic-bezier(0.16,1,0.3,1)"}}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(24px) scale(0.96)}to{opacity:1;transform:none}}`}</style>

        {/* Header */}
        <div style={{padding:"20px 24px",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h2 style={{...sf(18,600),color:C.s1,margin:0}}>{record?"Edit":"Add"} {cat.label.slice(0,-1)}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.s5,cursor:"pointer",padding:4}}>
            <Icon name="close" size={20} color={C.s5}/>
          </button>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:0,borderBottom:"1px solid "+C.bd,padding:"0 24px"}}>
          {["details","images"].map(function(t){
            var active=tab===t;
            return <button key={t} onClick={function(){setTab(t);}}
              style={{padding:"12px 20px",background:"none",border:"none",borderBottom:"2px solid "+(active?C.gd:"transparent"),
                ...sf(13,active?600:400),color:active?C.s1:C.s5,cursor:"pointer",textTransform:"capitalize",transition:"all 0.15s"}}>
              {t}
            </button>;
          })}
        </div>

        {/* Body */}
        <div style={{overflowY:"auto",padding:"20px 24px",flex:1}}>
          {tab==="details"?(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {cat.fields.map(function(field){
                return(
                  <div key={field.k} style={{gridColumn:field.wide?"1 / -1":"auto"}}>
                    <label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>
                      {field.l}{field.req&&<span style={{color:C.rd}}> *</span>}
                    </label>
                    <FieldInput field={field} value={form[field.k]} onChange={function(v){setField(field.k,v);}}/>
                  </div>
                );
              })}
            </div>
          ):(
            <ImageGalleryManager record={form} cat={cat} onUpdate={handleImageUpdate}/>
          )}
          {saveErr&&<p style={{...sf(13),color:C.rd,marginTop:12,padding:"10px 14px",background:"rgba(255,59,48,0.08)",borderRadius:10}}>{saveErr}</p>}
        </div>

        {/* Footer */}
        <div style={{padding:"16px 24px",borderTop:"1px solid "+C.bd,display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={btn("none",C.s3,{bd:C.bd})}>Cancel</button>
          <button onClick={save} disabled={saving}
            style={{...btn(C.gd,"#000"),opacity:saving?0.6:1,cursor:saving?"not-allowed":"pointer",fontWeight:700}}>
            {saving?"Saving...":"Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Delete Modal ═══ */
function DeleteModal({table,id,name,onCancel,onDone}){
  var [deleting,setDeleting]=useState(false);
  async function confirm(){
    setDeleting(true);
    await supabase.from(table).delete().eq("id",id);
    notifySlack("deleted",table,name,"Record permanently deleted from "+table);
    onDone();
  }
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1001,padding:16,backdropFilter:"blur(6px)"}}>
      <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:18,padding:"32px",width:"100%",maxWidth:380,textAlign:"center"}}>
        <div style={{width:48,height:48,borderRadius:"50%",background:"rgba(255,59,48,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
          <Icon name="del" size={24} color={C.rd}/>
        </div>
        <p style={{...sf(16,600),color:C.s1,marginBottom:8}}>Delete {name||"this record"}?</p>
        <p style={{...sf(13),color:C.s5,marginBottom:24}}>This action cannot be undone.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button onClick={onCancel} style={btn("none",C.s3,{bd:C.bd})}>Cancel</button>
          <button onClick={confirm} disabled={deleting}
            style={{...btn(C.rd,"#fff"),opacity:deleting?0.6:1}}>
            {deleting?"Deleting...":"Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Cell Value Renderer ═══ */
function CellVal({col,row}){
  var v=row[col];
  if(v===undefined||v===null)return <span style={{color:C.s6}}>-</span>;
  if(col==="is_active"||col==="available")return(
    <span style={{...sf(11,600),padding:"3px 10px",borderRadius:20,letterSpacing:0.5,
      background:v?"rgba(52,199,89,0.1)":"rgba(255,59,48,0.08)",color:v?C.gn:C.rd}}>
      {v?"Active":"Inactive"}
    </span>
  );
  if(col==="price_level")return <span style={{color:C.gd}}>{"$".repeat(Number(v))||"-"}</span>;
  if(col==="rating"&&v>0)return <span style={{color:C.gd}}>{"★ "+v}</span>;
  if(typeof v==="number"&&(col.includes("price")||col.includes("deposit")))return <span>${v.toLocaleString()}</span>;
  return <span style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"inline-block"}}>{String(v)}</span>;
}

/* ═══ Category View ═══ */
function CategoryView({cat}){
  var [records,setRecords]=useState([]);
  var [loading,setLoading]=useState(true);
  var [search,setSearch]=useState("");
  var [cityFilter,setCityFilter]=useState("");
  var [activeFilter,setActiveFilter]=useState("");
  var [sortCol,setSortCol]=useState("name");
  var [sortDir,setSortDir]=useState("asc");
  var [editRec,setEditRec]=useState(null);
  var [showAdd,setShowAdd]=useState(false);
  var [deleteRec,setDeleteRec]=useState(null);
  var [selected,setSelected]=useState([]);

  async function load(){
    setLoading(true);
    var {data}=await supabase.from(cat.table).select("*").order("name");
    setRecords(data||[]);
    setLoading(false);
  }
  useEffect(function(){load();setSelected([]);},[cat.id]);

  var cities=[...new Set(records.map(function(r){return r.city;}).filter(Boolean))].sort();
  var filtered=records.filter(function(r){
    if(search){
      var s=search.toLowerCase();
      var match=(r.name||"").toLowerCase().includes(s)||
        (r.city||"").toLowerCase().includes(s)||
        (r.brand||"").toLowerCase().includes(s)||
        (r.cuisine||"").toLowerCase().includes(s)||
        (r.type||"").toLowerCase().includes(s);
      if(!match)return false;
    }
    if(cityFilter&&r.city!==cityFilter)return false;
    if(activeFilter==="active"&&!r.is_active)return false;
    if(activeFilter==="inactive"&&r.is_active)return false;
    return true;
  }).sort(function(a,b){
    var av=a[sortCol],bv=b[sortCol];
    if(av==null)return 1;if(bv==null)return -1;
    if(typeof av==="string")av=av.toLowerCase();
    if(typeof bv==="string")bv=bv.toLowerCase();
    if(av<bv)return sortDir==="asc"?-1:1;
    if(av>bv)return sortDir==="asc"?1:-1;
    return 0;
  });

  function toggleSort(col){
    if(sortCol===col)setSortDir(sortDir==="asc"?"desc":"asc");
    else{setSortCol(col);setSortDir("asc");}
  }
  function toggleSelect(id){
    setSelected(function(s){return s.includes(id)?s.filter(function(x){return x!==id;}):s.concat(id);});
  }
  function selectAll(){
    if(selected.length===filtered.length)setSelected([]);
    else setSelected(filtered.map(function(r){return r.id;}));
  }
  async function bulkDelete(){
    if(!selected.length)return;
    await supabase.from(cat.table).delete().in("id",selected);
    notifySlack("bulk",cat.label,selected.length+" records","*Action:* Bulk delete — "+selected.length+" records removed");
    setSelected([]);load();
  }
  async function bulkToggle(val){
    if(!selected.length)return;
    await supabase.from(cat.table).update({is_active:val}).in("id",selected);
    notifySlack("bulk",cat.label,selected.length+" records","*Action:* Bulk "+(val?"activate":"deactivate")+" — "+selected.length+" records");
    setSelected([]);load();
  }

  var colLabels={name:"Name",cuisine:"Cuisine",city:"City",price_level:"Price",rating:"Rating",is_active:"Status",
    brand:"Brand",max_passengers:"Guests",price_4hr:"4hr Rate",price_per_day:"$/Day",price_1_day:"Day Rate",
    type:"Type",capacity:"Capacity",location:"Location",door_policy:"Door"};

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:24}}>
        <h2 style={{...sf(24,600),color:C.s1,margin:0}}>{cat.label}</h2>
        <button onClick={function(){setShowAdd(true);}}
          style={{...btn(C.gd,"#000"),fontWeight:700}}>
          <Icon name="add" size={18} color="#000"/> Add {cat.label.slice(0,-1)}
        </button>
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20,alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 200px",maxWidth:320}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}>
            <Icon name="search" size={16} color={C.s5}/>
          </div>
          <input placeholder={"Search "+cat.label.toLowerCase()+"..."} value={search}
            onChange={function(e){setSearch(e.target.value);}}
            style={{width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px 10px 36px",...sf(14),color:C.s1,outline:"none"}}/>
        </div>
        <select value={cityFilter} onChange={function(e){setCityFilter(e.target.value);}}
          style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(13),color:C.s3,outline:"none",appearance:"auto"}}>
          <option value="">All Cities</option>
          {cities.map(function(c){return <option key={c} value={c}>{c}</option>;})}
        </select>
        <select value={activeFilter} onChange={function(e){setActiveFilter(e.target.value);}}
          style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(13),color:C.s3,outline:"none",appearance:"auto"}}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span style={{...sf(13),color:C.s5}}>{filtered.length} record{filtered.length!==1?"s":""}</span>
      </div>

      {/* Bulk Actions */}
      {selected.length>0&&(
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16,padding:"10px 14px",background:C.srf,borderRadius:10,border:"1px solid "+C.bd}}>
          <span style={{...sf(13,600),color:C.s2}}>{selected.length} selected</span>
          <button onClick={function(){bulkToggle(true);}} style={btn("rgba(52,199,89,0.1)",C.gn,{sm:true,bd:"rgba(52,199,89,0.2)"})}>Activate</button>
          <button onClick={function(){bulkToggle(false);}} style={btn("rgba(255,149,0,0.1)",C.or,{sm:true,bd:"rgba(255,149,0,0.2)"})}>Deactivate</button>
          <button onClick={bulkDelete} style={btn("rgba(255,59,48,0.1)",C.rd,{sm:true,bd:"rgba(255,59,48,0.2)"})}>Delete</button>
          <button onClick={function(){setSelected([]);}} style={btn("none",C.s5,{sm:true})}>Clear</button>
        </div>
      )}

      {/* Table */}
      {loading?(
        <div style={{padding:"60px 20px",textAlign:"center",color:C.s5,...sf(14)}}>Loading...</div>
      ):(
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:14,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
              <thead>
                <tr style={{borderBottom:"1px solid "+C.bd}}>
                  <th style={{padding:"12px 14px",textAlign:"left",width:40}}>
                    <input type="checkbox" checked={selected.length===filtered.length&&filtered.length>0}
                      onChange={selectAll} style={{accentColor:C.gd}}/>
                  </th>
                  <th style={{padding:"12px 14px",textAlign:"left",width:48}}>
                    <span style={{...sf(10,600),color:C.s6,letterSpacing:1}}>IMG</span>
                  </th>
                  {cat.cols.map(function(col){
                    var active=sortCol===col;
                    return(
                      <th key={col} onClick={function(){toggleSort(col);}}
                        style={{...sf(11,600),color:active?C.s2:C.s5,letterSpacing:0.8,textTransform:"uppercase",
                          padding:"12px 14px",textAlign:"left",cursor:"pointer",whiteSpace:"nowrap",userSelect:"none",
                          transition:"color 0.15s"}}>
                        {colLabels[col]||col}
                        {active&&<span style={{marginLeft:4}}>{sortDir==="asc"?"↑":"↓"}</span>}
                      </th>
                    );
                  })}
                  <th style={{...sf(11,600),color:C.s5,padding:"12px 14px",textAlign:"right"}}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length===0?(
                  <tr><td colSpan={cat.cols.length+3} style={{padding:"40px",textAlign:"center",...sf(14),color:C.s5}}>No records found</td></tr>
                ):filtered.map(function(row){
                  var sel=selected.includes(row.id);
                  return(
                    <tr key={row.id} style={{borderBottom:"1px solid "+C.bd,background:sel?C.srf:"transparent",transition:"background 0.1s"}}
                      onMouseEnter={function(e){if(!sel)e.currentTarget.style.background=C.srf;}}
                      onMouseLeave={function(e){if(!sel)e.currentTarget.style.background="transparent";}}>
                      <td style={{padding:"10px 14px"}}>
                        <input type="checkbox" checked={sel} onChange={function(){toggleSelect(row.id);}} style={{accentColor:C.gd}}/>
                      </td>
                      <td style={{padding:"10px 14px"}}>
                        {row[cat.imgField]?(
                          <img src={row[cat.imgField]} alt="" style={{width:40,height:40,borderRadius:8,objectFit:"cover",display:"block"}}/>
                        ):(
                          <div style={{width:40,height:40,borderRadius:8,background:C.srf,display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <Icon name="images" size={16} color={C.s6}/>
                          </div>
                        )}
                      </td>
                      {cat.cols.map(function(col){
                        return(
                          <td key={col} style={{...sf(13),color:C.s3,padding:"10px 14px",cursor:"pointer"}}
                            onClick={function(){setEditRec(row);}}>
                            <CellVal col={col} row={row}/>
                          </td>
                        );
                      })}
                      <td style={{padding:"10px 14px",textAlign:"right",whiteSpace:"nowrap"}}>
                        <button onClick={function(){setEditRec(row);}}
                          style={btn(C.srf,C.s3,{sm:true,extra:{marginRight:6}})}
                          onMouseEnter={function(e){e.currentTarget.style.background=C.bd2;}}
                          onMouseLeave={function(e){e.currentTarget.style.background=C.srf;}}>
                          Edit
                        </button>
                        <button onClick={function(){setDeleteRec(row);}}
                          style={btn("rgba(255,59,48,0.08)",C.rd,{sm:true,bd:"rgba(255,59,48,0.2)"})}
                          onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,59,48,0.16)";}}
                          onMouseLeave={function(e){e.currentTarget.style.background="rgba(255,59,48,0.08)";}}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editRec&&<EditModal cat={cat} record={editRec} onClose={function(){setEditRec(null);}} onSave={function(){setEditRec(null);load();}}/>}
      {showAdd&&<EditModal cat={cat} record={null} onClose={function(){setShowAdd(false);}} onSave={function(){setShowAdd(false);load();}}/>}
      {deleteRec&&<DeleteModal table={cat.table} id={deleteRec.id} name={deleteRec.name} onCancel={function(){setDeleteRec(null);}} onDone={function(){setDeleteRec(null);load();}}/>}
    </div>
  );
}

/* ═══ Bookings View ═══ */
function BookingsView(){
  var [bookings,setBookings]=useState([]);
  var [users,setUsers]=useState([]);
  var [loading,setLoading]=useState(true);
  var [filter,setFilter]=useState("");
  var [dateFilter,setDateFilter]=useState("");
  var [cityFilter,setCityFilter]=useState("");
  var [search,setSearch]=useState("");
  var [viewMode,setViewMode]=useState("day");
  var [selectedBooking,setSelectedBooking]=useState(null);
  var [showAdd,setShowAdd]=useState(false);

  async function load(){
    setLoading(true);
    var {data:b}=await supabase.from("bookings").select("*").order("reservation_date",{ascending:false});
    var {data:u}=await supabase.from("users").select("*");
    setBookings(b||[]);setUsers(u||[]);setLoading(false);
  }
  useEffect(function(){load();},[]);

  function getUser(userId){return users.find(function(u){return u.id===userId;})||{};}

  var statusColors={pending:C.or,confirmed:C.gn,completed:C.bl,cancelled:C.rd,requested:C.bl};
  var statusIcons={pending:"⏳",confirmed:"✅",completed:"✓",cancelled:"✕",requested:"📩"};

  var filtered=bookings.filter(function(b){
    if(filter&&b.status!==filter)return false;
    if(dateFilter&&b.reservation_date!==dateFilter)return false;
    if(cityFilter&&b.city!==cityFilter)return false;
    if(search){
      var s=search.toLowerCase();
      var user=getUser(b.user_id);
      var userName=((user.first_name||"")+" "+(user.last_name||"")).toLowerCase();
      if(!(b.restaurant_name||"").toLowerCase().includes(s)&&!userName.includes(s)&&!(user.email||"").toLowerCase().includes(s))return false;
    }
    return true;
  });

  var dates=[...new Set(bookings.map(function(b){return b.reservation_date;}))].sort().reverse();
  var cities=[...new Set(bookings.map(function(b){return b.city;}).filter(Boolean))].sort();
  var counts={all:bookings.length,pending:0,confirmed:0,completed:0,cancelled:0,requested:0};
  bookings.forEach(function(b){if(counts[b.status]!==undefined)counts[b.status]++;});

  // Group by date
  var byDate={};
  filtered.forEach(function(b){
    var d=b.reservation_date||"Unknown";
    if(!byDate[d])byDate[d]=[];
    byDate[d].push(b);
  });
  var sortedDates=Object.keys(byDate).sort().reverse();

  // Today's bookings
  var today=new Date().toISOString().slice(0,10);
  var todayBookings=bookings.filter(function(b){return b.reservation_date===today;});
  var tomorrowDate=new Date(Date.now()+86400000).toISOString().slice(0,10);
  var tomorrowBookings=bookings.filter(function(b){return b.reservation_date===tomorrowDate;});

  async function updateStatus(id,status){
    var booking=bookings.find(function(b){return b.id===id;});
    var user=getUser(booking?booking.user_id:"");
    await supabase.from("bookings").update({status:status,updated_at:new Date().toISOString()}).eq("id",id);
    pushToKlaviyo("Booking "+status.charAt(0).toUpperCase()+status.slice(1),user.email||"",{restaurant_name:booking?booking.restaurant_name:"",status:status,party_size:booking?booking.party_size:0,city:booking?booking.city:""});
    notifySlack("booking","Bookings",(user.first_name||"")+" "+(user.last_name||""),"*Status:* "+status+" | *Venue:* "+(booking?booking.restaurant_name:"")+" | *Date:* "+(booking?booking.reservation_date:"")+" "+(booking?booking.reservation_time:""));
    load();
  }

  async function addNote(id,note){
    await supabase.from("bookings").update({notes:note,updated_at:new Date().toISOString()}).eq("id",id);
    load();
  }

  async function saveBooking(form){
    if(form.id){
      var id=form.id;delete form.id;delete form.created_at;
      form.updated_at=new Date().toISOString();
      await supabase.from("bookings").update(form).eq("id",id);
    }else{
      form.created_at=new Date().toISOString();
      form.updated_at=new Date().toISOString();
      await supabase.from("bookings").insert(form);
    }
    setSelectedBooking(null);setShowAdd(false);load();
  }

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <h2 style={{...sf(24,600),color:C.s1,margin:0}}>Reservations</h2>
        <button onClick={function(){setShowAdd(true);}} style={{...btn(C.gd,"#000"),fontWeight:700}}>+ New Reservation</button>
      </div>

      {/* Stats Row */}
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:20}}>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:12,padding:"14px 18px",flex:"1 1 100px",textAlign:"center"}}>
          <p style={{...sf(22,700),color:C.gd,margin:0}}>{todayBookings.length}</p>
          <p style={{...sf(10,500),color:C.s5,margin:"2px 0 0",letterSpacing:1}}>TODAY</p>
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:12,padding:"14px 18px",flex:"1 1 100px",textAlign:"center"}}>
          <p style={{...sf(22,700),color:C.bl,margin:0}}>{tomorrowBookings.length}</p>
          <p style={{...sf(10,500),color:C.s5,margin:"2px 0 0",letterSpacing:1}}>TOMORROW</p>
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:12,padding:"14px 18px",flex:"1 1 100px",textAlign:"center"}}>
          <p style={{...sf(22,700),color:C.or,margin:0}}>{counts.pending+counts.requested}</p>
          <p style={{...sf(10,500),color:C.s5,margin:"2px 0 0",letterSpacing:1}}>PENDING</p>
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:12,padding:"14px 18px",flex:"1 1 100px",textAlign:"center"}}>
          <p style={{...sf(22,700),color:C.gn,margin:0}}>{counts.confirmed}</p>
          <p style={{...sf(10,500),color:C.s5,margin:"2px 0 0",letterSpacing:1}}>CONFIRMED</p>
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:12,padding:"14px 18px",flex:"1 1 100px",textAlign:"center"}}>
          <p style={{...sf(22,700),color:C.s1,margin:0}}>{counts.all}</p>
          <p style={{...sf(10,500),color:C.s5,margin:"2px 0 0",letterSpacing:1}}>TOTAL</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12,alignItems:"center"}}>
        {["","pending","requested","confirmed","completed","cancelled"].map(function(s){
          var active=filter===s;var label=s||"All";var count=s?counts[s]||0:counts.all;
          return <button key={s} onClick={function(){setFilter(s);}}
            style={{padding:"7px 14px",background:active?C.srf:"none",border:"1px solid "+(active?C.bd:"transparent"),
              borderRadius:10,...sf(12,active?600:400),color:active?C.s1:C.s5,cursor:"pointer",textTransform:"capitalize",display:"flex",alignItems:"center",gap:6}}>
            {label}<span style={{...sf(10,600),color:active?C.gd:C.s6,background:active?C.gd+"15":C.srf,padding:"1px 6px",borderRadius:10}}>{count}</span>
          </button>;
        })}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20,alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 180px",maxWidth:280}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><Icon name="search" size={14} color={C.s5}/></div>
          <input placeholder="Search by guest, venue, email..." value={search} onChange={function(e){setSearch(e.target.value);}}
            style={{width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"9px 12px 9px 32px",...sf(13),color:C.s1,outline:"none"}}/>
        </div>
        <select value={dateFilter} onChange={function(e){setDateFilter(e.target.value);}}
          style={{padding:"9px 12px",borderRadius:10,border:"1px solid "+C.bd,background:C.srf,...sf(12),color:C.s3,outline:"none",appearance:"auto"}}>
          <option value="">All Dates</option>
          <option value={today}>Today ({today})</option>
          <option value={tomorrowDate}>Tomorrow</option>
          {dates.slice(0,20).map(function(d){return <option key={d} value={d}>{d}</option>;})}
        </select>
        <select value={cityFilter} onChange={function(e){setCityFilter(e.target.value);}}
          style={{padding:"9px 12px",borderRadius:10,border:"1px solid "+C.bd,background:C.srf,...sf(12),color:C.s3,outline:"none",appearance:"auto"}}>
          <option value="">All Cities</option>
          {cities.map(function(c){return <option key={c} value={c}>{c}</option>;})}
        </select>
        <span style={{...sf(12),color:C.s5}}>{filtered.length} reservation{filtered.length!==1?"s":""}</span>
      </div>

      {/* Bookings grouped by date */}
      {loading?<div style={{padding:"60px",textAlign:"center",color:C.s5}}>Loading reservations...</div>:filtered.length===0?(
        <div style={{textAlign:"center",padding:"60px 20px",background:C.el,borderRadius:16,border:"1px solid "+C.bd}}>
          <p style={{...sf(16,500),color:C.s3,margin:"0 0 8px"}}>No reservations found</p>
          <p style={{...sf(13),color:C.s5}}>Try adjusting your filters or add a new reservation.</p>
        </div>
      ):(
        <div style={{display:"grid",gap:20}}>
          {sortedDates.map(function(date){
            var dayBookings=byDate[date];
            var isToday=date===today;
            var isTomorrow=date===tomorrowDate;
            var dayLabel=isToday?"Today":isTomorrow?"Tomorrow":new Date(date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
            var totalGuests=dayBookings.reduce(function(s,b){return s+(b.party_size||0);},0);

            return(
              <div key={date}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <h3 style={{...sf(16,600),color:isToday?C.gd:isTomorrow?C.bl:C.s2,margin:0}}>{dayLabel}</h3>
                  <span style={{...sf(11),color:C.s5}}>{dayBookings.length} reservation{dayBookings.length!==1?"s":""} · {totalGuests} guests</span>
                  {isToday&&<span style={{...sf(10,600),padding:"2px 8px",borderRadius:20,background:C.gd+"15",color:C.gd}}>TODAY</span>}
                </div>
                <div style={{display:"grid",gap:8}}>
                  {dayBookings.sort(function(a,b){return (a.reservation_time||"").localeCompare(b.reservation_time||"");}).map(function(b){
                    var user=getUser(b.user_id);
                    var sc=statusColors[b.status]||C.s5;
                    var userName=(user.first_name||"")+" "+(user.last_name||"");
                    return(
                      <div key={b.id} style={{display:"flex",gap:14,padding:"14px 18px",background:C.el,border:"1px solid "+C.bd,borderRadius:14,alignItems:"center",borderLeft:"3px solid "+sc,cursor:"pointer",transition:"background 0.15s"}}
                        onClick={function(){setSelectedBooking(b);}}
                        onMouseEnter={function(e){e.currentTarget.style.background=C.srf;}}
                        onMouseLeave={function(e){e.currentTarget.style.background=C.el;}}>
                        {/* Time */}
                        <div style={{minWidth:50,textAlign:"center",flexShrink:0}}>
                          <p style={{...sf(16,700),color:C.s1,margin:0}}>{b.reservation_time?(b.reservation_time.slice(0,5)):"-"}</p>
                        </div>
                        {/* Venue + Guest info */}
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                            <p style={{...sf(14,600),color:C.s1,margin:0}}>{b.restaurant_name}</p>
                            <span style={{...sf(11),color:C.s5}}>· {b.party_size} guest{b.party_size!==1?"s":""}</span>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                            <span style={{...sf(12),color:C.s3}}>{userName.trim()||"Unknown"}</span>
                            {user.email&&<span style={{...sf(11),color:C.s5}}>{user.email}</span>}
                            {user.instagram_handle&&<span style={{...sf(11),color:C.s5}}>@{user.instagram_handle}</span>}
                            {b.occasion&&<span style={{...sf(10,500),padding:"2px 8px",borderRadius:6,background:C.srf,border:"1px solid "+C.bd,color:C.s4}}>{b.occasion}</span>}
                            {b.seating_preference&&<span style={{...sf(10,500),padding:"2px 8px",borderRadius:6,background:C.srf,border:"1px solid "+C.bd,color:C.s4}}>{b.seating_preference}</span>}
                          </div>
                          {b.notes&&<p style={{...sf(11),color:C.gd,margin:"4px 0 0"}}>Note: {b.notes}</p>}
                        </div>
                        {/* City */}
                        <span style={{...sf(11),color:C.s5,flexShrink:0}}>{b.city||""}</span>
                        {/* Status */}
                        <select value={b.status||"pending"} onChange={function(e){e.stopPropagation();updateStatus(b.id,e.target.value);}} onClick={function(e){e.stopPropagation();}}
                          style={{background:sc+"15",border:"1px solid "+sc+"30",borderRadius:8,padding:"5px 10px",...sf(11,600),color:sc,outline:"none",appearance:"auto",flexShrink:0,cursor:"pointer"}}>
                          {["pending","requested","confirmed","completed","cancelled"].map(function(s){return <option key={s} value={s}>{s}</option>;})}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking&&(function(){
        var b=selectedBooking;
        var user=getUser(b.user_id);
        var sc=statusColors[b.status]||C.s5;
        var [note,setNote]=useState(b.notes||"");
        return(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16,backdropFilter:"blur(6px)"}}
            onClick={function(e){if(e.target===e.currentTarget)setSelectedBooking(null);}}>
            <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:20,width:"100%",maxWidth:560,maxHeight:"90vh",overflow:"auto"}}>
              <div style={{padding:"24px",borderBottom:"1px solid "+C.bd,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <h2 style={{...sf(20,600),color:C.s1,margin:"0 0 4px"}}>{b.restaurant_name}</h2>
                  <p style={{...sf(13),color:C.s5,margin:0}}>{b.reservation_date} at {b.reservation_time?b.reservation_time.slice(0,5):"-"} · {b.city}</p>
                </div>
                <button onClick={function(){setSelectedBooking(null);}} style={{background:"none",border:"none",color:C.s5,cursor:"pointer",fontSize:22}}>×</button>
              </div>
              <div style={{padding:"24px",display:"grid",gap:20}}>
                {/* Status */}
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{...sf(12,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",width:80}}>Status</span>
                  <select value={b.status} onChange={function(e){updateStatus(b.id,e.target.value);setSelectedBooking({...b,status:e.target.value});}}
                    style={{background:sc+"15",border:"1px solid "+sc+"30",borderRadius:10,padding:"8px 14px",...sf(14,600),color:sc,outline:"none",appearance:"auto",flex:1}}>
                    {["pending","requested","confirmed","completed","cancelled"].map(function(s){return <option key={s} value={s}>{s}</option>;})}
                  </select>
                </div>
                {/* Guest Info */}
                <div style={{background:C.srf,borderRadius:14,padding:"16px 20px",border:"1px solid "+C.bd}}>
                  <p style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Guest Information</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div><span style={{...sf(10),color:C.s5}}>Name</span><p style={{...sf(14,600),color:C.s1,margin:"2px 0 0"}}>{(user.first_name||"")+" "+(user.last_name||"")||"Unknown"}</p></div>
                    <div><span style={{...sf(10),color:C.s5}}>Email</span><p style={{...sf(13),color:C.s3,margin:"2px 0 0"}}>{user.email||"-"}</p></div>
                    <div><span style={{...sf(10),color:C.s5}}>Instagram</span><p style={{...sf(13),color:C.s3,margin:"2px 0 0"}}>{user.instagram_handle?"@"+user.instagram_handle:"-"}</p></div>
                    <div><span style={{...sf(10),color:C.s5}}>City</span><p style={{...sf(13),color:C.s3,margin:"2px 0 0"}}>{user.preferred_city||"-"}</p></div>
                  </div>
                </div>
                {/* Reservation Details */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><span style={{...sf(10),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Party Size</span><p style={{...sf(18,700),color:C.s1,margin:"4px 0 0"}}>{b.party_size} guest{b.party_size!==1?"s":""}</p></div>
                  <div><span style={{...sf(10),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Time</span><p style={{...sf(18,700),color:C.s1,margin:"4px 0 0"}}>{b.reservation_time?b.reservation_time.slice(0,5):"-"}</p></div>
                  {b.occasion&&<div><span style={{...sf(10),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Occasion</span><p style={{...sf(14),color:C.s3,margin:"4px 0 0"}}>{b.occasion}</p></div>}
                  {b.seating_preference&&<div><span style={{...sf(10),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Seating</span><p style={{...sf(14),color:C.s3,margin:"4px 0 0"}}>{b.seating_preference}</p></div>}
                  {b.payment_amount&&<div><span style={{...sf(10),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Payment</span><p style={{...sf(14,600),color:C.gd,margin:"4px 0 0"}}>${b.payment_amount}</p></div>}
                </div>
                {/* Notes */}
                <div>
                  <span style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>Concierge Notes</span>
                  <div style={{display:"flex",gap:8}}>
                    <textarea value={note} onChange={function(e){setNote(e.target.value);}} rows={2} placeholder="Add a note about this reservation..."
                      style={{flex:1,background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(13),color:C.s1,outline:"none",resize:"vertical"}}/>
                    <button onClick={function(){addNote(b.id,note);}} style={btn(C.srf,C.s3,{sm:true})}>Save</button>
                  </div>
                </div>
                {/* Timestamps */}
                <div style={{borderTop:"1px solid "+C.bd,paddingTop:12}}>
                  <p style={{...sf(11),color:C.s6,margin:0}}>Created: {b.created_at?new Date(b.created_at).toLocaleString():"-"}</p>
                  <p style={{...sf(11),color:C.s6,margin:"2px 0 0"}}>Updated: {b.updated_at?new Date(b.updated_at).toLocaleString():"-"}</p>
                  <p style={{...sf(10),color:C.s6,margin:"2px 0 0"}}>ID: {b.id}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Reservation Modal */}
      {showAdd&&<BookingAddModal users={users} onClose={function(){setShowAdd(false);}} onSave={saveBooking}/>}
    </div>
  );
}

function BookingAddModal({users,onClose,onSave}){
  var [form,setForm]=useState({restaurant_name:"",party_size:2,reservation_date:new Date().toISOString().slice(0,10),reservation_time:"19:00",status:"confirmed",city:"Miami",occasion:"",seating_preference:"",notes:"",user_id:""});
  function set(k,v){setForm(function(p){return{...p,[k]:v};});}
  var inputStyle={width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(14),color:C.s1,outline:"none"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16,backdropFilter:"blur(6px)"}} onClick={function(e){if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:20,width:"100%",maxWidth:560}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid "+C.bd,display:"flex",justifyContent:"space-between"}}>
          <h2 style={{...sf(18,600),color:C.s1,margin:0}}>New Reservation</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.s5,cursor:"pointer",fontSize:20}}>×</button>
        </div>
        <div style={{padding:"20px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div style={{gridColumn:"1/-1"}}><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Guest</label>
            <select value={form.user_id} onChange={function(e){set("user_id",e.target.value);}} style={{...inputStyle,appearance:"auto"}}>
              <option value="">Select guest...</option>
              {users.map(function(u){return <option key={u.id} value={u.id}>{(u.first_name||"")+" "+(u.last_name||"")+" ("+u.email+")"}</option>;})}
            </select>
          </div>
          <div style={{gridColumn:"1/-1"}}><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Venue</label><input value={form.restaurant_name} onChange={function(e){set("restaurant_name",e.target.value);}} placeholder="Restaurant name" style={inputStyle}/></div>
          <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Date</label><input type="date" value={form.reservation_date} onChange={function(e){set("reservation_date",e.target.value);}} style={inputStyle}/></div>
          <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Time</label><input type="time" value={form.reservation_time} onChange={function(e){set("reservation_time",e.target.value);}} style={inputStyle}/></div>
          <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Guests</label><input type="number" value={form.party_size} onChange={function(e){set("party_size",Number(e.target.value));}} style={inputStyle}/></div>
          <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>City</label><select value={form.city} onChange={function(e){set("city",e.target.value);}} style={{...inputStyle,appearance:"auto"}}><option>Miami</option><option>Paris</option><option>Dubai</option><option>London</option></select></div>
          <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Occasion</label><input value={form.occasion} onChange={function(e){set("occasion",e.target.value);}} placeholder="Birthday, Date night..." style={inputStyle}/></div>
          <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Seating</label><input value={form.seating_preference} onChange={function(e){set("seating_preference",e.target.value);}} placeholder="Outdoor, Private room..." style={inputStyle}/></div>
          <div style={{gridColumn:"1/-1"}}><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Notes</label><textarea value={form.notes} onChange={function(e){set("notes",e.target.value);}} rows={2} placeholder="Special requests, allergies..." style={{...inputStyle,resize:"vertical"}}/></div>
        </div>
        <div style={{padding:"16px 24px",borderTop:"1px solid "+C.bd,display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={btn("none",C.s3,{bd:C.bd})}>Cancel</button>
          <button onClick={function(){if(!form.restaurant_name)return;onSave(form);}} style={{...btn(C.gd,"#000"),fontWeight:700}}>Create Reservation</button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Clients/Users View ═══ */
function ClientsView(){
  var [users,setUsers]=useState([]);
  var [loading,setLoading]=useState(true);
  var [search,setSearch]=useState("");

  async function load(){
    setLoading(true);
    var {data}=await supabase.from("users").select("*").order("created_at",{ascending:false});
    setUsers(data||[]);
    setLoading(false);
  }
  useEffect(function(){load();},[]);

  var filtered=users.filter(function(u){
    if(!search)return true;
    var s=search.toLowerCase();
    return (u.first_name||"").toLowerCase().includes(s)||(u.last_name||"").toLowerCase().includes(s)||(u.email||"").toLowerCase().includes(s)||(u.preferred_city||"").toLowerCase().includes(s);
  });

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:24}}>
        <h2 style={{...sf(24,600),color:C.s1,margin:0}}>Members ({users.length})</h2>
      </div>

      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20,alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 200px",maxWidth:320}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><Icon name="search" size={16} color={C.s5}/></div>
          <input placeholder="Search members..." value={search} onChange={function(e){setSearch(e.target.value);}}
            style={{width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px 10px 36px",...sf(14),color:C.s1,outline:"none"}}/>
        </div>
        <span style={{...sf(13),color:C.s5}}>{filtered.length} member{filtered.length!==1?"s":""}</span>
      </div>

      {loading?(
        <div style={{padding:"60px",textAlign:"center",color:C.s5}}>Loading...</div>
      ):filtered.length===0?(
        <div style={{textAlign:"center",padding:"60px 20px",background:C.el,borderRadius:16,border:"1px solid "+C.bd}}>
          <Icon name="clients" size={40} color={C.s6}/>
          <p style={{...sf(16,500),color:C.s3,margin:"16px 0"}}>No members found</p>
        </div>
      ):(
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:14,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:"1px solid "+C.bd}}>
                  {["Name","Email","City","Instagram","Referral Code","Referrals","Joined"].map(function(h){
                    return <th key={h} style={{...sf(11,600),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",padding:"12px 14px",textAlign:"left"}}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {filtered.map(function(u){
                  return(
                    <tr key={u.id} style={{borderBottom:"1px solid "+C.bd}}
                      onMouseEnter={function(e){e.currentTarget.style.background=C.srf;}}
                      onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
                      <td style={{...sf(13,500),color:C.s1,padding:"12px 14px"}}>{(u.first_name||"")+" "+(u.last_name||"")}</td>
                      <td style={{...sf(13),color:C.s4,padding:"12px 14px"}}>{u.email||"-"}</td>
                      <td style={{...sf(13),color:C.s4,padding:"12px 14px"}}>{u.preferred_city||"-"}</td>
                      <td style={{...sf(13),color:C.s4,padding:"12px 14px"}}>{u.instagram_handle?"@"+u.instagram_handle:"-"}</td>
                      <td style={{padding:"12px 14px"}}>
                        {u.referral_code?<span style={{...sf(11,600),padding:"3px 10px",borderRadius:20,background:C.gd+"15",color:C.gd,fontFamily:"monospace"}}>{u.referral_code}</span>:"-"}
                      </td>
                      <td style={{...sf(13,600),color:u.referral_count>0?C.gn:C.s5,padding:"12px 14px"}}>{u.referral_count||0}</td>
                      <td style={{...sf(12),color:C.s5,padding:"12px 14px"}}>{u.created_at?u.created_at.slice(0,10):"-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ Global Image Browser ═══ */
function ImageBrowserView(){
  var [images,setImages]=useState([]);
  var [loading,setLoading]=useState(true);
  var [catFilter,setCatFilter]=useState("");
  var [searchQ,setSearchQ]=useState("");

  async function load(){
    setLoading(true);
    var all=[];
    for(var i=0;i<CATS.length;i++){
      var c=CATS[i];
      var {data}=await supabase.from(c.table).select("id,name,"+c.imgField+","+c.galleryField+","+c.orderField).order("name");
      if(data){
        data.forEach(function(r){
          var urls=[r[c.imgField]].concat(r[c.galleryField]||[],r[c.orderField]||[]).filter(function(v,j,a){return v&&a.indexOf(v)===j;});
          urls.forEach(function(url){
            all.push({url:url,category:c.label,recordName:r.name,recordId:r.id,table:c.table});
          });
        });
      }
    }
    setImages(all);
    setLoading(false);
  }
  useEffect(function(){load();},[]);

  var filtered=images.filter(function(img){
    if(catFilter&&img.category!==catFilter)return false;
    if(searchQ){
      var s=searchQ.toLowerCase();
      if(!(img.recordName||"").toLowerCase().includes(s)&&!img.url.toLowerCase().includes(s))return false;
    }
    return true;
  });

  return(
    <div>
      <h2 style={{...sf(24,600),color:C.s1,margin:"0 0 8px"}}>Image Library</h2>
      <p style={{...sf(14),color:C.s5,marginBottom:24}}>All images across every category. Filter by type or search by name.</p>

      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20,alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 200px",maxWidth:320}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}>
            <Icon name="search" size={16} color={C.s5}/>
          </div>
          <input placeholder="Search images..." value={searchQ} onChange={function(e){setSearchQ(e.target.value);}}
            style={{width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px 10px 36px",...sf(14),color:C.s1,outline:"none"}}/>
        </div>
        <select value={catFilter} onChange={function(e){setCatFilter(e.target.value);}}
          style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(13),color:C.s3,outline:"none",appearance:"auto"}}>
          <option value="">All Categories</option>
          {CATS.map(function(c){return <option key={c.id} value={c.label}>{c.label}</option>;})}
        </select>
        <span style={{...sf(13),color:C.s5}}>{filtered.length} image{filtered.length!==1?"s":""}</span>
      </div>

      {loading?(
        <div style={{padding:"60px",textAlign:"center",color:C.s5}}>Loading images...</div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:14}}>
          {filtered.map(function(img,i){
            return(
              <div key={img.url+i} style={{background:C.el,border:"1px solid "+C.bd,borderRadius:14,overflow:"hidden",transition:"transform 0.15s"}}
                onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={function(e){e.currentTarget.style.transform="none";}}>
                <div style={{aspectRatio:"4/3",overflow:"hidden",background:C.srf}}>
                  <img src={img.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                </div>
                <div style={{padding:"10px 12px"}}>
                  <p style={{...sf(12,500),color:C.s2,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{img.recordName}</p>
                  <p style={{...sf(11),color:C.s5,margin:"4px 0 0"}}>{img.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══ Sidebar ═══ */
/* ═══ Featured Management ═══ */
function FeaturedView(){
  var [items,setItems]=useState([]);
  var [loading,setLoading]=useState(true);
  var [catFilter,setCatFilter]=useState("");

  async function load(){
    setLoading(true);
    var all=[];
    var tables=[
      {table:"restaurants",cat:"Restaurants"},
      {table:"yachts",cat:"Yachts"},
      {table:"cars",cat:"Cars"},
      {table:"wellness",cat:"Wellness"},
      {table:"accommodations",cat:"Hotels"},
    ];
    for(var i=0;i<tables.length;i++){
      var t=tables[i];
      var {data}=await supabase.from(t.table).select("id,name,city,hero_image_url,is_featured,is_active").order("name");
      if(data){
        data.forEach(function(r){
          all.push({...r,_table:t.table,_cat:t.cat});
        });
      }
    }
    setItems(all);
    setLoading(false);
  }
  useEffect(function(){load();},[]);

  async function toggleFeatured(item){
    var newVal=!item.is_featured;
    await supabase.from(item._table).update({is_featured:newVal}).eq("id",item.id);
    notifySlack(newVal?"updated":"status",item._cat,item.name,"*Featured:* "+(newVal?"Added to featured":"Removed from featured"));
    load();
  }

  var featured=items.filter(function(i){return i.is_featured;});
  var filtered=items.filter(function(i){
    if(catFilter&&i._cat!==catFilter)return false;
    return true;
  });
  var cats=[...new Set(items.map(function(i){return i._cat;}))].sort();

  return(
    <div>
      <h2 style={{...sf(24,600),color:C.s1,margin:"0 0 8px"}}>Featured Management</h2>
      <p style={{...sf(14),color:C.s5,marginBottom:24}}>Control which venues appear in the featured section on the website. Currently {featured.length} featured.</p>

      {/* Currently Featured */}
      <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 24px",marginBottom:24}}>
        <h3 style={{...sf(15,600),color:C.gd,marginBottom:14}}>Currently Featured ({featured.length})</h3>
        {featured.length===0?<p style={{...sf(13),color:C.s5}}>No featured venues yet. Toggle the star on any venue below.</p>:(
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {featured.map(function(item){
              return <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:10,background:C.srf,border:"1px solid "+C.gd+"30"}}>
                {item.hero_image_url&&<img src={item.hero_image_url} alt="" style={{width:32,height:32,borderRadius:6,objectFit:"cover"}}/>}
                <div>
                  <p style={{...sf(12,600),color:C.s1,margin:0}}>{item.name}</p>
                  <p style={{...sf(10),color:C.s5,margin:0}}>{item._cat}</p>
                </div>
                <button onClick={function(){toggleFeatured(item);}} style={{background:"none",border:"none",color:C.rd,cursor:"pointer",...sf(14),marginLeft:4}} title="Remove from featured">×</button>
              </div>;
            })}
          </div>
        )}
      </div>

      {/* All Venues */}
      <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
        <select value={catFilter} onChange={function(e){setCatFilter(e.target.value);}}
          style={{padding:"8px 14px",borderRadius:10,border:"1px solid "+C.bd,background:C.srf,...sf(13),color:C.s3,outline:"none",appearance:"auto"}}>
          <option value="">All Categories</option>
          {cats.map(function(c){return <option key={c} value={c}>{c}</option>;})}
        </select>
        <span style={{...sf(13),color:C.s5}}>{filtered.length} venue{filtered.length!==1?"s":""}</span>
      </div>

      {loading?<div style={{padding:"40px",textAlign:"center",color:C.s5}}>Loading...</div>:(
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:14,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:"1px solid "+C.bd}}>
                  <th style={{...sf(11,600),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",padding:"12px 14px",textAlign:"center",width:60}}>FEATURED</th>
                  <th style={{...sf(11,600),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",padding:"12px 14px",textAlign:"left",width:48}}>IMG</th>
                  <th style={{...sf(11,600),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",padding:"12px 14px",textAlign:"left"}}>NAME</th>
                  <th style={{...sf(11,600),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",padding:"12px 14px",textAlign:"left"}}>CATEGORY</th>
                  <th style={{...sf(11,600),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",padding:"12px 14px",textAlign:"left"}}>CITY</th>
                  <th style={{...sf(11,600),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",padding:"12px 14px",textAlign:"left"}}>ACTIVE</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(function(item){
                  return(
                    <tr key={item.id+item._table} style={{borderBottom:"1px solid "+C.bd}}
                      onMouseEnter={function(e){e.currentTarget.style.background=C.srf;}}
                      onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
                      <td style={{padding:"10px 14px",textAlign:"center"}}>
                        <button onClick={function(){toggleFeatured(item);}}
                          style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:item.is_featured?C.gd:C.s6,transition:"color 0.2s"}}
                          title={item.is_featured?"Remove from featured":"Add to featured"}>
                          {item.is_featured?"★":"☆"}
                        </button>
                      </td>
                      <td style={{padding:"10px 14px"}}>
                        {item.hero_image_url?<img src={item.hero_image_url} alt="" style={{width:36,height:36,borderRadius:6,objectFit:"cover"}}/>:
                        <div style={{width:36,height:36,borderRadius:6,background:C.srf}}/>}
                      </td>
                      <td style={{...sf(13,500),color:C.s1,padding:"10px 14px"}}>{item.name}</td>
                      <td style={{...sf(12),color:C.s4,padding:"10px 14px"}}>{item._cat}</td>
                      <td style={{...sf(12),color:C.s4,padding:"10px 14px"}}>{item.city||"-"}</td>
                      <td style={{padding:"10px 14px"}}>
                        <span style={{...sf(11,600),padding:"3px 8px",borderRadius:20,background:item.is_active?"rgba(52,199,89,0.1)":"rgba(255,59,48,0.08)",color:item.is_active?C.gn:C.rd}}>
                          {item.is_active?"Active":"Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ Blog Management ═══ */
function BlogView(){
  var [posts,setPosts]=useState([]);
  var [loading,setLoading]=useState(true);
  var [editPost,setEditPost]=useState(null);
  var [showAdd,setShowAdd]=useState(false);

  async function load(){
    setLoading(true);
    var {data}=await supabase.from("blog_posts").select("*").order("created_at",{ascending:false});
    setPosts(data||[]);setLoading(false);
  }
  useEffect(function(){load();},[]);

  async function togglePublish(post){
    await supabase.from("blog_posts").update({is_published:!post.is_published}).eq("id",post.id);
    load();
  }
  async function deletePost(id){
    if(!confirm("Delete this article?"))return;
    await supabase.from("blog_posts").delete().eq("id",id);
    load();
  }
  async function savePost(form,isNew){
    if(isNew){
      await supabase.from("blog_posts").insert(form);
    }else{
      var id=form.id;delete form.id;delete form.created_at;delete form.updated_at;
      await supabase.from("blog_posts").update(form).eq("id",id);
    }
    setEditPost(null);setShowAdd(false);load();
  }

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:24}}>
        <h2 style={{...sf(24,600),color:C.s1,margin:0}}>Blog ({posts.length} articles)</h2>
        <button onClick={function(){setShowAdd(true);}} style={{...btn(C.gd,"#000"),fontWeight:700}}>+ New Article</button>
      </div>
      {loading?<div style={{padding:"40px",textAlign:"center",color:C.s5}}>Loading...</div>:(
        <div style={{display:"grid",gap:16}}>
          {posts.map(function(p){return(
            <div key={p.id} style={{display:"flex",gap:16,padding:16,background:C.el,border:"1px solid "+C.bd,borderRadius:14,alignItems:"center"}}
              onMouseEnter={function(e){e.currentTarget.style.background=C.srf;}}
              onMouseLeave={function(e){e.currentTarget.style.background=C.el;}}>
              {p.image&&<img src={p.image} alt="" style={{width:80,height:56,borderRadius:8,objectFit:"cover",flexShrink:0}}/>}
              <div style={{flex:1,minWidth:0}}>
                <p style={{...sf(14,600),color:C.s1,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</p>
                <p style={{...sf(11),color:C.s5,margin:"4px 0 0"}}>{p.category} · {p.date} · {p.reading_time||7} min read</p>
              </div>
              <span style={{...sf(11,600),padding:"3px 10px",borderRadius:20,background:p.is_published?"rgba(52,199,89,0.1)":"rgba(255,149,0,0.1)",color:p.is_published?C.gn:C.or,flexShrink:0}}>
                {p.is_published?"Published":"Draft"}
              </span>
              <button onClick={function(){togglePublish(p);}} style={btn(C.srf,C.s3,{sm:true})}>{p.is_published?"Unpublish":"Publish"}</button>
              <button onClick={function(){setEditPost(p);}} style={btn(C.srf,C.s3,{sm:true})}>Edit</button>
              <button onClick={function(){deletePost(p.id);}} style={btn("rgba(255,59,48,0.08)",C.rd,{sm:true,bd:"rgba(255,59,48,0.2)"})}>Delete</button>
            </div>
          );})}
        </div>
      )}
      {(editPost||showAdd)&&<BlogEditModal post={editPost} onClose={function(){setEditPost(null);setShowAdd(false);}} onSave={savePost}/>}
    </div>
  );
}

function BlogEditModal({post,onClose,onSave}){
  var [form,setForm]=useState(post?{...post}:{slug:"",title:"",excerpt:"",date:"2026-04-13",reading_time:7,category:"Dining",keywords:"",image:"",content:"",is_published:true,author:"Alfred Concierge"});
  function set(k,v){setForm(function(p){return{...p,[k]:v};});}
  var inputStyle={width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(14),color:C.s1,outline:"none"};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16,backdropFilter:"blur(6px)"}} onClick={function(e){if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:20,width:"100%",maxWidth:700,maxHeight:"92vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h2 style={{...sf(18,600),color:C.s1,margin:0}}>{post?"Edit Article":"New Article"}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.s5,cursor:"pointer",fontSize:20}}>×</button>
        </div>
        <div style={{overflowY:"auto",padding:"20px 24px",flex:1}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{gridColumn:"1/-1"}}><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Title</label><input value={form.title} onChange={function(e){set("title",e.target.value);}} style={inputStyle}/></div>
            <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Slug</label><input value={form.slug} onChange={function(e){set("slug",e.target.value);}} style={inputStyle}/></div>
            <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Category</label><select value={form.category} onChange={function(e){set("category",e.target.value);}} style={{...inputStyle,appearance:"auto"}}><option>Dining</option><option>Nightlife</option><option>Travel</option><option>Events</option><option>Wellness</option><option>Lifestyle</option></select></div>
            <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Date</label><input value={form.date} onChange={function(e){set("date",e.target.value);}} style={inputStyle}/></div>
            <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Reading Time (min)</label><input type="number" value={form.reading_time} onChange={function(e){set("reading_time",Number(e.target.value));}} style={inputStyle}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Excerpt</label><textarea value={form.excerpt} onChange={function(e){set("excerpt",e.target.value);}} rows={2} style={{...inputStyle,resize:"vertical"}}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Image URL</label><input value={form.image} onChange={function(e){set("image",e.target.value);}} style={inputStyle}/>{form.image&&<img src={form.image} alt="" style={{width:"100%",height:120,objectFit:"cover",borderRadius:8,marginTop:8}}/>}</div>
            <div style={{gridColumn:"1/-1"}}><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Keywords</label><input value={form.keywords} onChange={function(e){set("keywords",e.target.value);}} style={inputStyle}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Content (HTML)</label><textarea value={form.content} onChange={function(e){set("content",e.target.value);}} rows={12} style={{...inputStyle,resize:"vertical",fontFamily:"monospace",fontSize:12}}/></div>
          </div>
        </div>
        <div style={{padding:"16px 24px",borderTop:"1px solid "+C.bd,display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={btn("none",C.s3,{bd:C.bd})}>Cancel</button>
          <button onClick={function(){onSave(form,!post);}} style={{...btn(C.gd,"#000"),fontWeight:700}}>Save Article</button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Notifications Management ═══ */
function NotificationsView(){
  var [notifs,setNotifs]=useState([]);
  var [loading,setLoading]=useState(true);
  var [showCompose,setShowCompose]=useState(false);
  var [users,setUsers]=useState([]);

  async function load(){
    setLoading(true);
    var {data}=await supabase.from("notifications").select("*").order("created_at",{ascending:false});
    var {data:u}=await supabase.from("users").select("id,first_name,last_name,email,preferred_city");
    setNotifs(data||[]);setUsers(u||[]);setLoading(false);
  }
  useEffect(function(){load();},[]);

  async function sendNotification(form){
    var payload={...form,is_sent:true,sent_at:new Date().toISOString()};
    await supabase.from("notifications").insert(payload);
    notifySlack("created","Notifications",form.title,"*Type:* "+form.type+" | *Target:* "+form.target+(form.target_city?" ("+form.target_city+")":""));
    setShowCompose(false);load();
  }
  async function deleteNotif(id){
    await supabase.from("notifications").delete().eq("id",id);load();
  }

  var typeColors={general:C.bl,promotional:C.gd,booking:C.gn,alert:C.rd,welcome:C.or};

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:24}}>
        <h2 style={{...sf(24,600),color:C.s1,margin:0}}>Notifications</h2>
        <button onClick={function(){setShowCompose(true);}} style={{...btn(C.gd,"#000"),fontWeight:700}}>+ Compose</button>
      </div>

      {/* Stats */}
      <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:24}}>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:12,padding:"16px 20px",flex:"1 1 120px"}}>
          <p style={{...sf(24,700),color:C.s1,margin:0}}>{notifs.length}</p>
          <p style={{...sf(11),color:C.s5,margin:"4px 0 0"}}>Total Sent</p>
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:12,padding:"16px 20px",flex:"1 1 120px"}}>
          <p style={{...sf(24,700),color:C.s1,margin:0}}>{users.length}</p>
          <p style={{...sf(11),color:C.s5,margin:"4px 0 0"}}>Total Users</p>
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:12,padding:"16px 20px",flex:"1 1 120px"}}>
          <p style={{...sf(24,700),color:C.gn,margin:0}}>{notifs.filter(function(n){return n.is_sent;}).length}</p>
          <p style={{...sf(11),color:C.s5,margin:"4px 0 0"}}>Delivered</p>
        </div>
      </div>

      {/* History */}
      {loading?<div style={{padding:"40px",textAlign:"center",color:C.s5}}>Loading...</div>:notifs.length===0?(
        <div style={{textAlign:"center",padding:"60px 20px",background:C.el,borderRadius:16,border:"1px solid "+C.bd}}>
          <p style={{...sf(16,500),color:C.s3,margin:"0 0 8px"}}>No notifications sent yet</p>
          <p style={{...sf(13),color:C.s5}}>Click "Compose" to send your first notification.</p>
        </div>
      ):(
        <div style={{display:"grid",gap:12}}>
          {notifs.map(function(n){
            var tc=typeColors[n.type]||C.bl;
            return(
              <div key={n.id} style={{display:"flex",gap:14,padding:16,background:C.el,border:"1px solid "+C.bd,borderRadius:14,alignItems:"center"}}>
                <div style={{width:4,height:40,borderRadius:2,background:tc,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{...sf(14,600),color:C.s1,margin:0}}>{n.title}</p>
                  <p style={{...sf(12),color:C.s4,margin:"4px 0 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.body}</p>
                  <p style={{...sf(10),color:C.s5,margin:"4px 0 0"}}>{n.type} · {n.target}{n.target_city?" · "+n.target_city:""} · {n.sent_at?new Date(n.sent_at).toLocaleDateString():""}</p>
                </div>
                <span style={{...sf(10,600),padding:"3px 8px",borderRadius:20,background:n.is_sent?C.gn+"15":C.or+"15",color:n.is_sent?C.gn:C.or}}>{n.is_sent?"Sent":"Draft"}</span>
                <button onClick={function(){deleteNotif(n.id);}} style={btn("rgba(255,59,48,0.08)",C.rd,{sm:true,bd:"rgba(255,59,48,0.2)"})}>Delete</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Compose Modal */}
      {showCompose&&<ComposeNotification users={users} onClose={function(){setShowCompose(false);}} onSend={sendNotification}/>}
    </div>
  );
}

function ComposeNotification({users,onClose,onSend}){
  var [form,setForm]=useState({title:"",body:"",type:"general",target:"all",target_user_id:null,target_city:"",image_url:"",action_url:""});
  function set(k,v){setForm(function(p){return{...p,[k]:v};});}
  var inputStyle={width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(14),color:C.s1,outline:"none"};

  var cities=[...new Set(users.map(function(u){return u.preferred_city;}).filter(Boolean))].sort();

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16,backdropFilter:"blur(6px)"}} onClick={function(e){if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:20,width:"100%",maxWidth:560,maxHeight:"92vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h2 style={{...sf(18,600),color:C.s1,margin:0}}>Compose Notification</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.s5,cursor:"pointer",fontSize:20}}>×</button>
        </div>
        <div style={{overflowY:"auto",padding:"20px 24px",flex:1}}>
          <div style={{display:"grid",gap:14}}>
            <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Type</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["general","promotional","booking","alert","welcome"].map(function(t){
                  var active=form.type===t;
                  return <button key={t} onClick={function(){set("type",t);}} style={{padding:"8px 16px",borderRadius:10,border:"1px solid "+(active?C.gd:C.bd),background:active?C.gd+"15":"none",...sf(13,active?600:400),color:active?C.gd:C.s5,cursor:"pointer",textTransform:"capitalize"}}>{t}</button>;
                })}
              </div>
            </div>
            <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Target Audience</label>
              <select value={form.target} onChange={function(e){set("target",e.target.value);}} style={{...inputStyle,appearance:"auto"}}>
                <option value="all">All Users</option>
                <option value="city">By City</option>
                <option value="individual">Individual User</option>
              </select>
            </div>
            {form.target==="city"&&<div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>City</label>
              <select value={form.target_city} onChange={function(e){set("target_city",e.target.value);}} style={{...inputStyle,appearance:"auto"}}>
                <option value="">Select city...</option>
                {cities.map(function(c){return <option key={c} value={c}>{c}</option>;})}
                <option value="Miami">Miami</option><option value="Paris">Paris</option><option value="Dubai">Dubai</option><option value="London">London</option>
              </select>
            </div>}
            {form.target==="individual"&&<div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>User</label>
              <select value={form.target_user_id||""} onChange={function(e){set("target_user_id",e.target.value||null);}} style={{...inputStyle,appearance:"auto"}}>
                <option value="">Select user...</option>
                {users.map(function(u){return <option key={u.id} value={u.id}>{(u.first_name||"")+" "+(u.last_name||"")+" ("+u.email+")"}</option>;})}
              </select>
            </div>}
            <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Title</label><input value={form.title} onChange={function(e){set("title",e.target.value);}} placeholder="Weekend in Miami?" style={inputStyle}/></div>
            <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Body</label><textarea value={form.body} onChange={function(e){set("body",e.target.value);}} rows={3} placeholder="New restaurants just added to Alfred..." style={{...inputStyle,resize:"vertical"}}/></div>
            <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Image URL (optional)</label><input value={form.image_url} onChange={function(e){set("image_url",e.target.value);}} style={inputStyle}/></div>
            <div><label style={{...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6}}>Action URL (optional)</label><input value={form.action_url} onChange={function(e){set("action_url",e.target.value);}} placeholder="/catalog/dining" style={inputStyle}/></div>
          </div>
        </div>
        <div style={{padding:"16px 24px",borderTop:"1px solid "+C.bd,display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={btn("none",C.s3,{bd:C.bd})}>Cancel</button>
          <button onClick={function(){if(!form.title||!form.body)return;onSend(form);}} disabled={!form.title||!form.body}
            style={{...btn(C.gd,"#000"),fontWeight:700,opacity:(!form.title||!form.body)?0.5:1}}>Send Notification</button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({active,onNav,onLogout,collapsed,onToggle}){
  var items=[
    {id:"dashboard",label:"Dashboard",icon:"dashboard"},
    {id:"divider1",divider:true},
    ...CATS.map(function(c){return{id:c.id,label:c.label,icon:c.icon};}),
    {id:"divider2",divider:true},
    {id:"bookings",label:"Bookings",icon:"bookings"},
    {id:"clients",label:"Members",icon:"clients"},
    {id:"images",label:"Images",icon:"images"},
    {id:"featured",label:"Featured",icon:"star"},
    {id:"blog",label:"Blog",icon:"edit"},
    {id:"notifications",label:"Notifications",icon:"star"},
  ];

  return(
    <div style={{
      width:collapsed?64:240,minHeight:"100vh",background:C.bg2,
      borderRight:"1px solid "+C.bd,display:"flex",flexDirection:"column",
      transition:"width 0.25s cubic-bezier(0.16,1,0.3,1)",overflow:"hidden",flexShrink:0
    }}>
      {/* Logo */}
      <div style={{padding:collapsed?"16px":"20px 24px",borderBottom:"1px solid "+C.bd,display:"flex",alignItems:"center",gap:12,minHeight:60}}>
        {!collapsed&&(
          <div style={{flex:1}}>
            <div style={{...sf(11,700),letterSpacing:3,textTransform:"uppercase",background:C.gdGrad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>ALFRED</div>
            <div style={{...sf(11),color:C.s5,marginTop:2}}>Admin Portal</div>
          </div>
        )}
        <button onClick={onToggle} style={{background:"none",border:"none",cursor:"pointer",padding:collapsed?"0 auto":0,display:"flex"}}>
          <Icon name="menu" size={20} color={C.s4}/>
        </button>
      </div>

      {/* Nav Items */}
      <div style={{flex:1,padding:"12px 8px",overflowY:"auto"}}>
        {items.map(function(item,i){
          if(item.divider)return <div key={item.id} style={{height:1,background:C.bd,margin:"8px 8px"}}/>;
          var isActive=active===item.id;
          return(
            <button key={item.id} onClick={function(){onNav(item.id);}}
              style={{
                width:"100%",display:"flex",alignItems:"center",gap:12,
                padding:collapsed?"10px":"10px 16px",
                background:isActive?"rgba(212,168,83,0.08)":"none",
                border:"none",borderRadius:10,cursor:"pointer",
                transition:"all 0.15s",marginBottom:2,
                justifyContent:collapsed?"center":"flex-start"
              }}
              onMouseEnter={function(e){if(!isActive)e.currentTarget.style.background=C.srf;}}
              onMouseLeave={function(e){if(!isActive)e.currentTarget.style.background=isActive?"rgba(212,168,83,0.08)":"none";}}>
              <Icon name={item.icon} size={18} color={isActive?C.gd:C.s5}/>
              {!collapsed&&<span style={{...sf(13,isActive?600:400),color:isActive?C.s1:C.s4,whiteSpace:"nowrap"}}>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div style={{padding:"12px 8px",borderTop:"1px solid "+C.bd}}>
        <button onClick={onLogout}
          style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:collapsed?"10px":"10px 16px",
            background:"none",border:"none",borderRadius:10,cursor:"pointer",justifyContent:collapsed?"center":"flex-start"}}
          onMouseEnter={function(e){e.currentTarget.style.background=C.srf;}}
          onMouseLeave={function(e){e.currentTarget.style.background="none";}}>
          <Icon name="logout" size={18} color={C.s5}/>
          {!collapsed&&<span style={{...sf(13),color:C.s5}}>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

/* ═══ Mobile Header ═══ */
function MobileHeader({onMenuToggle,onLogout}){
  return(
    <div style={{display:"flex",alignItems:"center",padding:"12px 16px",background:C.bg2,borderBottom:"1px solid "+C.bd,position:"sticky",top:0,zIndex:100}}>
      <button onClick={onMenuToggle} style={{background:"none",border:"none",cursor:"pointer",padding:4,marginRight:12}}>
        <Icon name="menu" size={22} color={C.s3}/>
      </button>
      <div style={{flex:1}}>
        <span style={{...sf(12,700),letterSpacing:3,background:C.gdGrad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>ALFRED</span>
        <span style={{...sf(11),color:C.s5,marginLeft:8}}>Admin</span>
      </div>
      <button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
        <Icon name="logout" size={18} color={C.s5}/>
      </button>
    </div>
  );
}

/* ═══ Mobile Drawer ═══ */
function MobileDrawer({active,onNav,onClose}){
  var items=[
    {id:"dashboard",label:"Dashboard",icon:"dashboard"},
    ...CATS.map(function(c){return{id:c.id,label:c.label,icon:c.icon};}),
    {id:"bookings",label:"Bookings",icon:"bookings"},
    {id:"clients",label:"Members",icon:"clients"},
    {id:"images",label:"Images",icon:"images"},
    {id:"featured",label:"Featured",icon:"star"},
    {id:"blog",label:"Blog",icon:"edit"},
    {id:"notifications",label:"Notifications",icon:"star"},
  ];
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)"}} onClick={onClose}/>
      <div style={{position:"relative",width:280,background:C.bg2,borderRight:"1px solid "+C.bd,animation:"slideIn 0.25s ease",display:"flex",flexDirection:"column"}}>
        <style>{`@keyframes slideIn{from{transform:translateX(-100%)}to{transform:none}}`}</style>
        <div style={{padding:"20px 24px",borderBottom:"1px solid "+C.bd}}>
          <div style={{...sf(12,700),letterSpacing:3,background:C.gdGrad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>ALFRED ADMIN</div>
        </div>
        <div style={{flex:1,padding:"12px 8px",overflowY:"auto"}}>
          {items.map(function(item){
            var isActive=active===item.id;
            return(
              <button key={item.id} onClick={function(){onNav(item.id);onClose();}}
                style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 16px",
                  background:isActive?"rgba(212,168,83,0.08)":"none",border:"none",borderRadius:10,cursor:"pointer",marginBottom:2}}>
                <Icon name={item.icon} size={18} color={isActive?C.gd:C.s5}/>
                <span style={{...sf(14,isActive?600:400),color:isActive?C.s1:C.s4}}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══ Admin Dashboard (Main) ═══ */
function AdminDashboard({onLogout}){
  var [page,setPage]=useState("dashboard");
  var [collapsed,setCollapsed]=useState(false);
  var [isMobile,setIsMobile]=useState(window.innerWidth<=768);
  var [drawer,setDrawer]=useState(false);
  var [counts,setCounts]=useState({});

  useEffect(function(){
    function onResize(){setIsMobile(window.innerWidth<=768);}
    window.addEventListener("resize",onResize);
    return function(){window.removeEventListener("resize",onResize);};
  },[]);

  useEffect(function(){
    async function loadCounts(){
      var c={};
      for(var i=0;i<CATS.length;i++){
        var {count}=await supabase.from(CATS[i].table).select("id",{count:"exact",head:true});
        c[CATS[i].id]=count||0;
      }
      var {count:bc}=await supabase.from("bookings").select("id",{count:"exact",head:true});
      c.bookings=bc||0;
      setCounts(c);
    }
    loadCounts();
  },[]);

  var activeCat=CATS.find(function(c){return c.id===page;});

  function renderContent(){
    if(page==="dashboard")return <DashboardView counts={counts} onNav={setPage}/>;
    if(page==="bookings")return <BookingsView/>;
    if(page==="clients")return <ClientsView/>;
    if(page==="images")return <ImageBrowserView/>;
    if(page==="featured")return <FeaturedView/>;
    if(page==="blog")return <BlogView/>;
    if(page==="notifications")return <NotificationsView/>;
    if(activeCat)return <CategoryView key={activeCat.id} cat={activeCat}/>;
    return <DashboardView counts={counts} onNav={setPage}/>;
  }

  if(isMobile){
    return(
      <div style={{minHeight:"100vh",background:C.bg}}>
        <MobileHeader onMenuToggle={function(){setDrawer(true);}} onLogout={onLogout}/>
        {drawer&&<MobileDrawer active={page} onNav={setPage} onClose={function(){setDrawer(false);}}/>}
        <div style={{padding:"20px 16px"}}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.bg}}>
      <Sidebar active={page} onNav={setPage} onLogout={onLogout} collapsed={collapsed} onToggle={function(){setCollapsed(!collapsed);}}/>
      <div style={{flex:1,padding:"28px 32px",overflowY:"auto"}}>
        {renderContent()}
      </div>
    </div>
  );
}

/* ═══ AdminPage (Default Export) ═══ */
export default function AdminPage(){
  var [authed,setAuthed]=useState(function(){
    return sessionStorage.getItem("alfred_admin_auth")==="1";
  });

  function handleAuth(){
    sessionStorage.setItem("alfred_admin_auth","1");
    setAuthed(true);
  }
  function handleLogout(){
    sessionStorage.removeItem("alfred_admin_auth");
    setAuthed(false);
  }

  if(!authed)return <PasswordGate onAuth={handleAuth}/>;
  return <AdminDashboard onLogout={handleLogout}/>;
}
