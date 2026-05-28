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
    check:"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    pin:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z",
    globe:"M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d={paths[name]||paths.dashboard}/></svg>;
}

/* ═══ Category Config ═══ */
var CATS = [
  {
    id:"restaurants", label:"Restaurants", table:"restaurants", icon:"restaurant",
    bucket:"restaurant-photos", imgField:"hero_image_url", galleryField:"gallery_photos",
    orderField:"photos_order",
    cols:["name","city","time_slots","peak_price_per_person","reservation_required","kosher","is_active"],
    fields:[
      {k:"name",l:"Name",t:"text",req:true},
      {k:"slug",l:"Slug",t:"text"},
      {k:"cuisine",l:"Cuisine",t:"text"},
      {k:"city",l:"City",t:"select",opts:["Paris","Miami","Ibiza","Saint-Tropez","Mykonos","New York","Los Angeles","London","Monaco","Miami Beach"]},
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
      {k:"time_slots",l:"Available Booking Time Slots",t:"timeslots",wide:true},
      {k:"vip_slots",l:"VIP / Peak Slots (premium-priced)",t:"vipslots",wide:true},
      {k:"peak_price_per_person",l:"Premium / VIP Price Per Person ($)",t:"number"},
      {k:"peak_perks",l:"Premium Perks (comma-separated)",t:"tags",wide:true},
      {k:"hours_lunch",l:"Lunch Hours (display)",t:"text"},
      {k:"hours_dinner",l:"Dinner Hours (display)",t:"text"},
      {k:"opening_hours",l:"Opening Hours (display)",t:"text",wide:true},
      {k:"hours_closed",l:"Closed Days (display)",t:"text"},
      {k:"closed_weekdays",l:"Closed Weekdays (date validation)",t:"weekdays",wide:true},
      {k:"closed_months",l:"Closed Months (seasonal)",t:"months",wide:true},
      {k:"category",l:"Category",t:"select",opts:["restaurant","cafe","brunch","bakery","beach_club","bar","lounge"]},
      {k:"chef_name",l:"Chef Name",t:"text"},
      {k:"alfred_note",l:"Alfred Note",t:"textarea",wide:true},
      {k:"alfred_tip",l:"Alfred Tip",t:"textarea",wide:true},
      {k:"is_active",l:"Active",t:"bool"},
      {k:"is_featured",l:"Featured",t:"bool"},
      {k:"available_tonight",l:"Available Tonight",t:"bool"},
      {k:"instant_booking_available",l:"Instant Booking",t:"bool"},
      {k:"reservation_required",l:"Reservation Required (off = walk-in)",t:"bool"},
      {k:"kosher",l:"Kosher / Cacher",t:"bool"},
    ]
  },
  {
    id:"nightlife", label:"Nightlife", table:"nightclubs", icon:"nightlife",
    bucket:"nightlife-images", imgField:"hero_image_url", galleryField:"photos_order",
    orderField:"photos_order",
    cols:["name","category","city","vibe","rating","is_active"],
    fields:[
      {k:"name",l:"Name",t:"text",req:true},
      {k:"category",l:"Category",t:"select",opts:["nightclub","bar","lounge","rooftop"]},
      {k:"city",l:"City",t:"select",opts:["Paris","Miami","Ibiza","Saint-Tropez","Mykonos","London","New York","Dubai","Miami Beach"]},
      {k:"vibe",l:"Vibe",t:"text"},
      {k:"music",l:"Music",t:"text"},
      {k:"description",l:"Description",t:"textarea",wide:true},
      {k:"address",l:"Address",t:"text",wide:true},
      {k:"price_level",l:"Price Level",t:"select",opts:["1","2","3","4"]},
      {k:"rating",l:"Rating",t:"number"},
      {k:"entry_type",l:"Entry Type",t:"select",opts:["Free Entry","Guestlist","Tickets","Table Only"]},
      {k:"dress_code",l:"Dress Code",t:"text"},
      {k:"opening_hours",l:"Opening Hours",t:"text"},
      {k:"capacity",l:"Capacity",t:"text"},
      {k:"reservation",l:"Reservation",t:"text"},
      {k:"age_policy",l:"Age Policy",t:"text"},
      {k:"crowd_type",l:"Crowd Type",t:"text"},
      {k:"best_night",l:"Best Night",t:"text"},
      {k:"phone_number",l:"Phone",t:"text"},
      {k:"website_url",l:"Website",t:"text"},
      {k:"instagram_url",l:"Instagram",t:"text"},
      {k:"is_active",l:"Active",t:"bool"},
      {k:"is_featured",l:"Featured",t:"bool"},
      {k:"is_partner",l:"Partner",t:"bool"},
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
      {k:"city",l:"City",t:"select",opts:["Paris","Miami","Ibiza","Saint-Tropez","Mykonos","Monaco","Cannes"]},
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
      {k:"city",l:"City",t:"select",opts:["Paris","Miami","Ibiza","Saint-Tropez","Mykonos","New York","Los Angeles"]},
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
      {k:"city",l:"City",t:"select",opts:["Paris","Miami","Ibiza","Saint-Tropez","Mykonos","Los Angeles","New York","Dubai"]},
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
    cols:["name","city","neighborhood","star_rating","kosher","status","is_active"],
    fields:[
      {k:"name",l:"Hotel Name",t:"text",req:true},
      {k:"slug",l:"Slug",t:"text"},
      {k:"city",l:"City",t:"select",opts:["Paris","Miami","Ibiza","Saint-Tropez","Mykonos","London","New York","Dubai"]},
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
      {k:"room_types",l:"Room Types & Prices",t:"rooms",wide:true},
      {k:"status",l:"Status",t:"select",opts:["open","coming_soon","closed"]},
      {k:"is_active",l:"Active",t:"bool"},
      {k:"is_featured",l:"Featured",t:"bool"},
      {k:"is_partner",l:"Partner",t:"bool"},
      {k:"kosher",l:"Kosher / Cacher",t:"bool"},
    ]
  },
  {
    id:"featured_events", label:"Featured Events", table:"featured_events", icon:"event",
    bucket:"Website", imgField:"hero_image_url", galleryField:null,
    orderField:null,
    cols:["name","tag","date","location","spots","is_active"],
    fields:[
      {k:"name",l:"Event Name",t:"text",req:true},
      {k:"slug",l:"Slug",t:"text",req:true},
      {k:"tag",l:"Tag",t:"select",opts:["F1","Tennis","Racing","Nightlife","Football","Yachting","Golf","Festival"]},
      {k:"date",l:"Date (free text)",t:"text"},
      {k:"location",l:"Location",t:"text"},
      {k:"venue",l:"Venue / Hospitality",t:"text",wide:true},
      {k:"description",l:"Description",t:"textarea",wide:true},
      {k:"perks",l:"Perks (comma-separated)",t:"tags",wide:true},
      {k:"color",l:"Accent Color (hex)",t:"text"},
      {k:"spots",l:"Spots Remaining",t:"number"},
      {k:"wa_msg",l:"WhatsApp Pre-fill",t:"textarea",wide:true},
      {k:"sort_order",l:"Sort Order",t:"number"},
      {k:"is_active",l:"Active",t:"bool"},
      {k:"is_featured",l:"Featured",t:"bool"},
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
  var [analytics,setAnalytics]=useState({users:0,bookings:[],recentBookings:[],totalCommission:0,totalGross:0,monthCommission:0,monthGross:0,confirmedBookings:0,cancelledBookings:0,avgPartySize:0,topRestaurants:[],citySplit:{},byCategory:{}});

  useEffect(function(){
    async function load(){
      var {data:bookings}=await supabase.from("bookings").select("*").order("created_at",{ascending:false});
      var {data:users}=await supabase.from("users").select("*").order("created_at",{ascending:false});
      bookings=bookings||[];users=users||[];

      var totalCommission=0,totalGross=0,monthCommission=0,monthGross=0;
      var now=new Date();
      var monthStart=now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-01";
      var nextMonthStart=(now.getMonth()===11?(now.getFullYear()+1):now.getFullYear())+"-"+String((now.getMonth()+2-1)%12+1).padStart(2,"0")+"-01";
      var byCategory={}; // {svc:{count,commission,gross}}
      bookings.forEach(function(b){
        var c=Number(b.commission_amount)||0;
        var g=Number(b.gross_amount)||0;
        totalCommission+=c;totalGross+=g;
        if(b.reservation_date&&b.reservation_date>=monthStart&&b.reservation_date<nextMonthStart){
          monthCommission+=c;monthGross+=g;
        }
        var cat=b.service_type||"Dining";
        if(!byCategory[cat])byCategory[cat]={count:0,commission:0,gross:0};
        byCategory[cat].count++;byCategory[cat].commission+=c;byCategory[cat].gross+=g;
      });
      var confirmed=bookings.filter(function(b){return b.status==="confirmed"||b.status==="completed";}).length;
      var cancelled=bookings.filter(function(b){return b.status==="cancelled"||b.status==="no_show";}).length;
      var avgParty=bookings.length?Math.round(bookings.reduce(function(s,b){return s+(b.party_size||0);},0)/bookings.length*10)/10:0;

      var restCount={};
      bookings.forEach(function(b){if(b.restaurant_name){restCount[b.restaurant_name]=(restCount[b.restaurant_name]||0)+1;}});
      var topRestaurants=Object.entries(restCount).sort(function(a,b){return b[1]-a[1];}).slice(0,5);

      var citySplit={};
      bookings.forEach(function(b){if(b.city){citySplit[b.city]=(citySplit[b.city]||0)+1;}});

      setAnalytics({users:users.length,bookings:bookings,recentBookings:bookings.slice(0,5),totalCommission:totalCommission,totalGross:totalGross,monthCommission:monthCommission,monthGross:monthGross,confirmedBookings:confirmed,cancelledBookings:cancelled,avgPartySize:avgParty,topRestaurants:topRestaurants,citySplit:citySplit,byCategory:byCategory,usersList:users});
    }
    load();
  },[]);

  var a=analytics;
  var monthLabel=new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"});
  var avgCommission=a.bookings.length?a.totalCommission/a.bookings.length:0;
  var categoryRows=Object.keys(a.byCategory).map(function(k){return {k:k,count:a.byCategory[k].count,commission:a.byCategory[k].commission,gross:a.byCategory[k].gross};}).sort(function(x,y){return y.commission-x.commission||y.count-x.count;});
  var maxCatCommission=categoryRows.reduce(function(m,r){return Math.max(m,r.commission);},1);

  return(
    <div>
      <h2 style={{...sf(24,600),color:C.s1,marginBottom:8,marginTop:0}}>Dashboard</h2>
      <p style={{...sf(14),color:C.s5,marginBottom:28}}>Alfred Admin — real-time platform overview</p>

      {/* Revenue Row (highlighted) */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:16}}>
        <RevCard label="Revenue (Commission)" value={money(a.totalCommission)} sub={a.bookings.length+" booking"+(a.bookings.length!==1?"s":"")+" all-time"} color={C.gd} hi/>
        <RevCard label="Gross Booking Value" value={money(a.totalGross)} sub={"Avg "+money(avgCommission)+" commission/booking"} color={C.bl}/>
        <RevCard label={"This Month — "+monthLabel.split(" ")[0]} value={money(a.monthCommission)} sub={"of "+money(a.monthGross)+" gross"} color={C.gn}/>
        <button onClick={function(){onNav("bookings");}} style={{background:C.el,border:"1px dashed "+C.bd2,borderRadius:14,padding:"16px 18px",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}
          onMouseEnter={function(e){e.currentTarget.style.borderColor=C.gd;}}
          onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd2;}}>
          <p style={{...sf(11,600),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",margin:"0 0 8px"}}>Bookings & Revenue</p>
          <p style={{...sf(20,700),color:C.gd,margin:0,display:"flex",alignItems:"center",gap:8}}>Open tab <Icon name="bookings" size={18} color={C.gd}/></p>
          <p style={{...sf(11),color:C.s5,margin:"6px 0 0"}}>Filter, edit, export, add manual reservations</p>
        </button>
      </div>

      {/* Top Stats Row */}
      <div style={{display:"flex",flexWrap:"wrap",gap:16,marginBottom:24}}>
        <StatCard label="Total Members" value={a.users} icon="clients" color={C.gd}/>
        <StatCard label="Bookings" value={a.bookings.length} icon="bookings" color={C.bl}/>
        <StatCard label="Confirmed / Completed" value={a.confirmedBookings} icon="check" color={C.gn}/>
        <StatCard label="Cancelled / No-show" value={a.cancelledBookings} icon="close" color={C.rd}/>
        <StatCard label="Avg Party" value={a.avgPartySize} icon="clients" color={C.or}/>
      </div>

      {/* Revenue by Category */}
      {categoryRows.length>0&&(
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 24px",marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <h3 style={{...sf(15,600),color:C.s2,margin:0}}>Revenue by Category</h3>
            <span style={{...sf(11),color:C.s5}}>{money(a.totalCommission)} total commission</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
            {categoryRows.map(function(r){
              var meta=svcMeta(r.k);
              var pct=maxCatCommission?r.commission/maxCatCommission*100:0;
              return(
                <div key={r.k}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{...sf(12,500),color:C.s2,display:"flex",alignItems:"center",gap:6}}>
                      <Icon name={meta.icon} size={13} color={meta.color}/>{meta.label}
                      <span style={{...sf(10),color:C.s5}}>({r.count})</span>
                    </span>
                    <span style={{...sf(13,700),color:C.gd}}>{money(r.commission)}</span>
                  </div>
                  <div style={{height:6,background:C.srf,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:pct+"%",background:meta.color,borderRadius:3,transition:"width 0.4s"}}/>
                  </div>
                  {r.gross>0&&<p style={{...sf(10),color:C.s5,margin:"3px 0 0"}}>{money(r.gross)} gross</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
            var sc={confirmed:C.gn,completed:C.s2,cancelled:C.rd,pending:C.or,requested:C.bl,no_show:"#8E8E93"}[b.status]||C.s5;
            var meta=svcMeta(b.service_type);
            return(
              <div key={b.id||i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<a.recentBookings.length-1?"1px solid "+C.bd:"none"}}>
                <div title={meta.label} style={{width:28,height:28,borderRadius:8,background:meta.color+"15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon name={meta.icon} size={13} color={meta.color}/>
                </div>
                <div style={{minWidth:0,flex:1,overflow:"hidden"}}>
                  <p style={{...sf(13,500),color:C.s2,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.restaurant_name}</p>
                  <p style={{...sf(11),color:C.s5,margin:"2px 0 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.reservation_date} · {b.party_size||1} {b.party_size===1?"guest":"guests"}{b.city?" · "+b.city:""}</p>
                </div>
                {b.commission_amount?<span style={{...sf(12,700),color:C.gd,flexShrink:0,whiteSpace:"nowrap"}}>{money(b.commission_amount)}</span>:null}
                <span style={{...sf(11,600),padding:"3px 10px",borderRadius:20,background:sc+"15",color:sc,textTransform:"capitalize",flexShrink:0,whiteSpace:"nowrap"}}>{(b.status||"pending").replace("_"," ")}</span>
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
  var [uploadErr,setUploadErr]=useState(null);
  var [progress,setProgress]=useState("");

  async function handleFiles(e){
    var files=Array.from(e.target.files);
    if(!files.length)return;
    setUploading(true);
    setUploadErr(null);
    var urls=[];
    var errs=[];
    for(var i=0;i<files.length;i++){
      var file=files[i];
      var ext=file.name.split(".").pop().toLowerCase();
      var path="uploads/"+Date.now()+"-"+Math.random().toString(36).slice(2,8)+"."+ext;
      setProgress(files.length>1?"("+(i+1)+"/"+files.length+") Uploading…":"Uploading…");
      var {data:uploadData,error}=await supabase.storage.from(bucket).upload(path,file,{
        upsert:true,
        contentType:file.type||"image/jpeg",
        cacheControl:"3600"
      });
      if(error){
        console.error("Storage upload error:",error);
        errs.push(error.message||JSON.stringify(error));
      }else{
        var {data:u}=supabase.storage.from(bucket).getPublicUrl(uploadData?uploadData.path:path);
        if(u&&u.publicUrl)urls.push(u.publicUrl);
      }
    }
    setProgress("");
    setUploading(false);
    if(ref.current)ref.current.value="";
    if(errs.length>0){
      // Show the raw error so the user knows what to fix (usually a missing bucket or RLS policy)
      setUploadErr("Upload failed: "+errs[0]);
    }
    if(urls.length>0)onUpload(urls);
  }

  return(
    <div style={{display:"inline-flex",flexDirection:"column",alignItems:"flex-start",gap:4}}>
      <button onClick={function(){if(!uploading)ref.current&&ref.current.click();}} disabled={uploading}
        style={btn(uploading?C.srf:C.srf,uploading?C.s5:C.s3,{sm:true,extra:{opacity:uploading?0.7:1,minWidth:90}})}>
        {uploading?(progress||"Uploading…"):"+ Upload"}
      </button>
      {uploadErr&&<p style={{...sf(11),color:C.rd,margin:0,maxWidth:260,wordBreak:"break-word"}}>{uploadErr}</p>}
      <input ref={ref} type="file" accept="image/*" multiple={!!multi} onChange={handleFiles} style={{display:"none"}}/>
    </div>
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
function FieldInput({field,value,record,onChange}){
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
  if(field.t==="vipslots"){
    // VIP slot picker — subset of the venue's `time_slots`. Each chip
    // is a slot that's already bookable; toggling it marks the slot
    // as premium-priced (`peak_price_per_person`). If `time_slots` is
    // empty we tell the user to set those first so we don't end up
    // with VIP slots that aren't actually offered.
    var bookable=(record&&Array.isArray(record.time_slots))?record.time_slots:[];
    if(typeof bookable==="string")try{bookable=JSON.parse(bookable)}catch(e){bookable=[];}
    var vip=value||[];
    if(typeof vip==="string")try{vip=JSON.parse(vip)}catch(e){vip=[];}
    if(!Array.isArray(vip))vip=[];
    if(!bookable.length){
      return <p style={{...sf(12),color:C.s5,margin:0,padding:"10px 14px",border:"1px dashed "+C.bd,borderRadius:10}}>
        Set "Available Booking Time Slots" first — VIP slots are chosen from that list.
      </p>;
    }
    function toggleVip(s){
      var arr=vip.slice();
      var idx=arr.indexOf(s);
      if(idx>=0)arr.splice(idx,1);else arr.push(s);
      arr.sort();
      onChange(arr);
    }
    // Drop any VIP slot that's no longer in time_slots so the array
    // never stores orphans. Fires on every render — cheap enough.
    var orphans=vip.filter(function(s){return bookable.indexOf(s)<0;});
    if(orphans.length){
      var cleaned=vip.filter(function(s){return bookable.indexOf(s)>=0;});
      setTimeout(function(){onChange(cleaned);},0);
    }
    return(
      <div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {bookable.map(function(s){
            var active=vip.indexOf(s)>=0;
            return <button key={s} type="button" onClick={function(){toggleVip(s);}}
              style={{padding:"6px 12px",borderRadius:8,border:"1px solid "+(active?C.gd+"80":C.bd),
                background:active?"rgba(245,197,76,0.14)":C.srf,...sf(12,active?600:400),
                color:active?C.gd:C.s5,cursor:"pointer",transition:"all 0.15s",minWidth:52,textAlign:"center"}}>
              {s}{active&&" ★"}
            </button>;
          })}
        </div>
        <p style={{...sf(11),color:C.s5,marginTop:6}}>
          {vip.length===0
            ? "All slots are standard-priced"
            : vip.length+" VIP slot"+(vip.length===1?"":"s")+" — charged at premium price"}
        </p>
      </div>
    );
  }
  if(field.t==="weekdays"){
    // closed_weekdays — int[] where 0=Sunday .. 6=Saturday. Drives both
    // the iOS DateChip disable + the Postgres booking-insert trigger.
    var picked=value||[];
    if(typeof picked==="string")try{picked=JSON.parse(picked)}catch(e){picked=[];}
    if(!Array.isArray(picked))picked=[];
    var WEEKDAYS=[
      {n:0,label:"Sun"},{n:1,label:"Mon"},{n:2,label:"Tue"},
      {n:3,label:"Wed"},{n:4,label:"Thu"},{n:5,label:"Fri"},{n:6,label:"Sat"}
    ];
    function toggleDay(n){
      var arr=picked.slice();
      var idx=arr.indexOf(n);
      if(idx>=0)arr.splice(idx,1);else arr.push(n);
      arr.sort(function(a,b){return a-b;});
      onChange(arr);
    }
    return(
      <div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {WEEKDAYS.map(function(d){
            var active=picked.indexOf(d.n)>=0;
            return <button key={d.n} type="button" onClick={function(){toggleDay(d.n);}}
              style={{padding:"8px 14px",borderRadius:8,border:"1px solid "+(active?C.rd+"80":C.bd),
                background:active?"rgba(255,69,58,0.12)":C.srf,...sf(12,active?600:400),
                color:active?C.rd:C.s5,cursor:"pointer",transition:"all 0.15s",minWidth:54,textAlign:"center"}}>
              {d.label}
            </button>;
          })}
        </div>
        <p style={{...sf(11),color:C.s5,marginTop:6}}>
          {picked.length===0?"Open every day":"Closed: "+picked.map(function(n){return WEEKDAYS[n].label;}).join(", ")}
        </p>
      </div>
    );
  }
  if(field.t==="months"){
    // closed_months — int[] 1=Jan .. 12=Dec. Seasonal closures.
    var pickedM=value||[];
    if(typeof pickedM==="string")try{pickedM=JSON.parse(pickedM)}catch(e){pickedM=[];}
    if(!Array.isArray(pickedM))pickedM=[];
    var MONTHS=[
      {n:1,label:"Jan"},{n:2,label:"Feb"},{n:3,label:"Mar"},{n:4,label:"Apr"},
      {n:5,label:"May"},{n:6,label:"Jun"},{n:7,label:"Jul"},{n:8,label:"Aug"},
      {n:9,label:"Sep"},{n:10,label:"Oct"},{n:11,label:"Nov"},{n:12,label:"Dec"}
    ];
    function toggleMonth(n){
      var arr=pickedM.slice();
      var idx=arr.indexOf(n);
      if(idx>=0)arr.splice(idx,1);else arr.push(n);
      arr.sort(function(a,b){return a-b;});
      onChange(arr);
    }
    return(
      <div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {MONTHS.map(function(m){
            var active=pickedM.indexOf(m.n)>=0;
            return <button key={m.n} type="button" onClick={function(){toggleMonth(m.n);}}
              style={{padding:"6px 12px",borderRadius:8,border:"1px solid "+(active?C.rd+"80":C.bd),
                background:active?"rgba(255,69,58,0.12)":C.srf,...sf(12,active?600:400),
                color:active?C.rd:C.s5,cursor:"pointer",transition:"all 0.15s",minWidth:48,textAlign:"center"}}>
              {m.label}
            </button>;
          })}
        </div>
        <p style={{...sf(11),color:C.s5,marginTop:6}}>
          {pickedM.length===0?"Open year-round":"Closed in: "+pickedM.map(function(n){return MONTHS[n-1].label;}).join(", ")}
        </p>
      </div>
    );
  }
  if(field.t==="rooms"){
    var rooms=value||[];
    if(typeof rooms==="string")try{rooms=JSON.parse(rooms)}catch(e){rooms=[];}
    var [roomName,setRoomName]=useState("");
    var [roomPrice,setRoomPrice]=useState("");
    function addRoom(){
      if(!roomName.trim())return;
      onChange(rooms.concat({name:roomName.trim(),price:Number(roomPrice)||0}));
      setRoomName("");setRoomPrice("");
    }
    function removeRoom(i){var a=rooms.slice();a.splice(i,1);onChange(a);}
    function updateRoom(i,key,val){var a=rooms.map(function(r,idx){return idx===i?{...r,[key]:val}:r;});onChange(a);}
    return(
      <div>
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
          {rooms.map(function(room,i){
            return(
              <div key={i} style={{display:"flex",gap:8,alignItems:"center",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"8px 12px"}}>
                <input value={room.name||""} onChange={function(e){updateRoom(i,"name",e.target.value);}}
                  placeholder="Room name" style={{...inputStyle,flex:2,padding:"6px 10px"}}/>
                <input type="number" value={room.price||""} onChange={function(e){updateRoom(i,"price",Number(e.target.value)||0);}}
                  placeholder="Price/night" style={{...inputStyle,flex:1,padding:"6px 10px"}}/>
                <span style={{...sf(10),color:C.s5}}>$/night</span>
                <button type="button" onClick={function(){removeRoom(i);}} style={{background:"none",border:"none",color:C.rd,cursor:"pointer",fontSize:18,lineHeight:1,padding:"0 4px"}}>×</button>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={roomName} onChange={function(e){setRoomName(e.target.value);}}
            onKeyDown={function(e){if(e.key==="Enter"){e.preventDefault();addRoom();}}}
            placeholder="Room type (e.g. Deluxe Suite)" style={{...inputStyle,flex:2}}/>
          <input type="number" value={roomPrice} onChange={function(e){setRoomPrice(e.target.value);}}
            placeholder="Price/night" style={{...inputStyle,flex:1}}/>
          <button type="button" onClick={addRoom} style={{padding:"8px 14px",background:C.srf,border:"1px solid "+C.bd,borderRadius:8,...sf(12,500),color:C.s3,cursor:"pointer",whiteSpace:"nowrap"}}>+ Add</button>
        </div>
        {rooms.length>0&&<p style={{...sf(11),color:C.s5,marginTop:6}}>{rooms.length} room type{rooms.length!==1?"s":""}</p>}
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
  var defaultCity=(cat.fields.find(function(f){return f.k==="city";})||{}).opts;
  defaultCity=defaultCity?defaultCity[0]:"Paris";
  var [form,setForm]=useState(record?{...record}:{is_active:true,city:defaultCity,category:cat.id==="restaurants"?"restaurant":cat.id==="nightlife"?"nightclub":undefined});
  var [saving,setSaving]=useState(false);
  var [saveErr,setSaveErr]=useState("");
  var [tab,setTab]=useState("details");

  function setField(k,v){setForm(function(p){return{...p,[k]:v};});}

  async function save(){
    setSaving(true);setSaveErr("");
    var payload={...form};
    delete payload.id;delete payload.created_at;delete payload.updated_at;
    // Strip empty strings to null so DB doesn't reject optional fields
    Object.keys(payload).forEach(function(k){if(payload[k]==="")payload[k]=null;});
    // Ensure city is never null
    if(!payload.city){payload.city=defaultCity;}
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

  // Auto-save image fields immediately to DB so uploads don't require "Save Changes"
  async function handleImageAutoSave(updates){
    handleImageUpdate(updates);
    if(!(record&&record.id))return; // new record — fall through to normal save
    var payload={};
    Object.keys(updates).forEach(function(k){payload[k]=updates[k]===""?null:updates[k];});
    var {error}=await supabase.from(cat.table).update(payload).eq("id",record.id);
    if(error){setSaveErr("Image save failed: "+error.message);}
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
                    <FieldInput field={field} value={form[field.k]} record={form} onChange={function(v){setField(field.k,v);}}/>
                  </div>
                );
              })}
            </div>
          ):(
            <ImageGalleryManager record={form} cat={cat} onUpdate={handleImageAutoSave}/>
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
  // Special-case before the null check so an empty array still renders
  // as "Not set" rather than blanking.
  if(col==="time_slots"){
    var n=Array.isArray(v)?v.length:0;
    return n>0
      ? <span style={{...sf(11,600),padding:"3px 10px",borderRadius:20,background:"rgba(52,199,89,0.1)",color:C.gn,letterSpacing:0.4}}>{n} slot{n===1?"":"s"}</span>
      : <span style={{...sf(11,600),padding:"3px 10px",borderRadius:20,background:"rgba(255,149,0,0.10)",color:C.or,letterSpacing:0.4}}>Not set</span>;
  }
  if(col==="peak_price_per_person"){
    return v>0
      ? <span style={{color:C.gd,...sf(13,600)}}>${v}</span>
      : <span style={{...sf(11),color:C.s5}}>—</span>;
  }
  if(v===undefined||v===null)return <span style={{color:C.s6}}>-</span>;
  if(col==="is_active"||col==="available")return(
    <span style={{...sf(11,600),padding:"3px 10px",borderRadius:20,letterSpacing:0.5,
      background:v?"rgba(52,199,89,0.1)":"rgba(255,59,48,0.08)",color:v?C.gn:C.rd}}>
      {v?"Active":"Inactive"}
    </span>
  );
  if(col==="reservation_required")return(
    <span style={{...sf(11,600),padding:"3px 10px",borderRadius:20,letterSpacing:0.5,
      background:v?"rgba(52,199,89,0.1)":"rgba(245,197,76,0.12)",color:v?C.gn:C.gd}}>
      {v?"Reserve":"Walk-in"}
    </span>
  );
  if(col==="kosher")return v?(
    <span style={{...sf(11,600),padding:"3px 10px",borderRadius:20,letterSpacing:0.5,
      background:"rgba(0,122,255,0.12)",color:"#5AC8FA"}}>Kosher</span>
  ):<span style={{color:C.s6}}>—</span>;
  if(col==="price_level")return <span style={{color:C.gd}}>{"$".repeat(Number(v))||"-"}</span>;
  if(col==="rating"&&v>0)return <span style={{color:C.gd}}>{"★ "+v}</span>;
  if(typeof v==="number"&&(col.includes("price")||col.includes("deposit")))return <span>${v.toLocaleString()}</span>;
  return <span style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"inline-block"}}>{String(v)}</span>;
}

/* ═══ City Overview ═══
 *
 * One city, one unified list. The operator sees every venue in (e.g.)
 * Paris as a single scrollable list with category tabs above it that
 * filter the list in-place. Click a venue row → edit modal opens with
 * the right field set for that venue's category. Click "+ Add" → opens
 * an empty form for the currently-selected category (or Dining when
 * "All" is active so we never open an ambiguous picker).
 *
 * Data: one query per CITY_CATEGORIES table, in parallel. Merged into a
 * single in-memory list keyed by category for cheap tab filtering. */
function CityOverviewView({city,onClearCity}){
  var [data,setData]=useState({});
  var [loading,setLoading]=useState(true);
  var [activeCat,setActiveCat]=useState("all");
  var [search,setSearch]=useState("");
  // Filters that apply to every list, regardless of category tab.
  var [statusFilter,setStatusFilter]=useState("active");   // "all"|"active"|"inactive"
  // Per-category filters — keyed by tab, reset when the tab changes.
  // diningType: "all"|"restaurant"|"cafe"|"brunch"|"bakery"|"beach_club"
  // kosher:     "all"|"kosher"|"non_kosher"   (applies on Dining + Hotels)
  // walkIn:     "all"|"walk_in"|"reservation" (Dining only)
  // starRating: 0 (all) | 5 | 4 | 3 ...       (Hotels only)
  // hotelStatus:"all"|"open"|"coming_soon"|"closed"
  // brand:      "" | exact match              (Cars + Yachts)
  // wellnessType / nightlifeCat: exact match
  var [diningType,setDiningType]=useState("all");
  var [kosher,setKosher]=useState("all");
  var [walkIn,setWalkIn]=useState("all");
  var [starRating,setStarRating]=useState(0);
  var [hotelStatus,setHotelStatus]=useState("all");
  var [brand,setBrand]=useState("");
  var [wellnessType,setWellnessType]=useState("");
  var [nightlifeCat,setNightlifeCat]=useState("");
  var [editRec,setEditRec]=useState(null);
  var [editCat,setEditCat]=useState(null);
  var [showAdd,setShowAdd]=useState(false);

  // Reset per-category filters when the tab changes so old chips don't
  // silently hide rows in a category they don't apply to.
  function resetCatFilters(){
    setDiningType("all");setKosher("all");setWalkIn("all");
    setStarRating(0);setHotelStatus("all");
    setBrand("");setWellnessType("");setNightlifeCat("");
  }
  function switchTab(key){setActiveCat(key);resetCatFilters();}

  var cityLabel=city==="__other__"?"Other cities":city;

  // Build a flat list of every loaded venue, tagged with its category.
  // We carry the resolved CAT config on each row so the edit modal can
  // open against the right form even when "All" is the active tab.
  function flatten(byCat){
    var out=[];
    CITY_CATEGORIES.forEach(function(cc){
      var c=CATS.find(function(x){return x.id===cc.catId;});
      if(!c)return;
      (byCat[c.id]||[]).forEach(function(row){
        out.push({row:row,cat:c,catLabel:cc.label});
      });
    });
    return out;
  }

  useEffect(function(){
    async function load(){
      setLoading(true);
      var cityCats=CITY_CATEGORIES.map(function(cc){
        return CATS.find(function(c){return c.id===cc.catId;});
      }).filter(Boolean);
      var promises=cityCats.map(function(c){
        var q=supabase.from(c.table).select("*").order("name");
        if(city==="__other__"){
          q=q.not("city","in","("+PRIMARY_CITIES.map(function(c){return'"'+c+'"';}).join(",")+")");
        }else{
          q=q.eq("city",city);
        }
        return q.then(function(r){return{catId:c.id,rows:r.data||[]};});
      });
      var results=await Promise.all(promises);
      var byId={};
      results.forEach(function(r){byId[r.catId]=r.rows;});
      setData(byId);
      setLoading(false);
    }
    if(city)load();
  },[city]);

  // Refetch just one category — used after a save so the list reflects
  // the new state without re-querying the other 5 tables.
  function refreshCategory(c){
    var q=supabase.from(c.table).select("*").order("name");
    if(city==="__other__"){
      q=q.not("city","in","("+PRIMARY_CITIES.map(function(c){return'"'+c+'"';}).join(",")+")");
    }else{
      q=q.eq("city",city);
    }
    q.then(function(r){
      setData(function(p){var n={...p};n[c.id]=r.data||[];return n;});
    });
  }

  // Tabs: All + one per CITY_CATEGORIES entry with live count.
  var counts={};
  CITY_CATEGORIES.forEach(function(cc){counts[cc.catId]=(data[cc.catId]||[]).length;});
  var totalCount=CITY_CATEGORIES.reduce(function(t,cc){return t+(counts[cc.catId]||0);},0);
  var tabs=[{key:"all",label:"All",count:totalCount}].concat(
    CITY_CATEGORIES.map(function(cc){return{key:cc.catId,label:cc.label,count:counts[cc.catId]||0};})
  );

  // The currently visible list — filtered by tab + search + status +
  // whichever per-category filters apply.
  var allRows=flatten(data);
  var visible=allRows.filter(function(item){
    var r=item.row;
    if(activeCat!=="all"&&item.cat.id!==activeCat)return false;
    if(search){
      var s=search.toLowerCase();
      var hay=(r.name+" "+(r.neighborhood||"")+" "+(r.cuisine||"")+" "+(r.brand||"")+" "+(r.type||"")).toLowerCase();
      if(hay.indexOf(s)<0)return false;
    }
    // Status — applies to every category. Default "active" matches
    // most operator workflows (don't waste eyeballs on inactive rows).
    if(statusFilter==="active"&&r.is_active===false)return false;
    if(statusFilter==="inactive"&&r.is_active!==false)return false;
    // Dining-specific
    if(item.cat.id==="restaurants"){
      if(diningType!=="all"&&r.category!==diningType)return false;
      if(kosher==="kosher"&&r.kosher!==true)return false;
      if(kosher==="non_kosher"&&r.kosher===true)return false;
      if(walkIn==="walk_in"&&r.reservation_required!==false)return false;
      if(walkIn==="reservation"&&r.reservation_required===false)return false;
    }
    // Hotel-specific
    if(item.cat.id==="accommodations"){
      if(kosher==="kosher"&&r.kosher!==true)return false;
      if(kosher==="non_kosher"&&r.kosher===true)return false;
      if(starRating>0&&Number(r.star_rating||0)!==starRating)return false;
      if(hotelStatus!=="all"&&r.status!==hotelStatus)return false;
    }
    // Cars / Yachts — brand
    if((item.cat.id==="cars"||item.cat.id==="yachts")&&brand&&r.brand!==brand)return false;
    // Wellness — type
    if(item.cat.id==="wellness"&&wellnessType&&r.type!==wellnessType)return false;
    // Nightlife — sub-category
    if(item.cat.id==="nightlife"&&nightlifeCat&&r.category!==nightlifeCat)return false;
    return true;
  });

  // Build distinct option lists for brand / wellness type from loaded data.
  function distinctValues(catId,key){
    var seen={};
    (data[catId]||[]).forEach(function(r){
      var v=r[key];
      if(v&&!seen[v])seen[v]=true;
    });
    return Object.keys(seen).sort();
  }
  var brandTable=activeCat==="yachts"?"yachts":"cars";
  var brandOptions=distinctValues(brandTable,"brand");
  var wellnessTypeOptions=distinctValues("wellness","type");

  // When "+ Add" is clicked, the form needs to know which category to
  // open. If a specific tab is active, use that. Otherwise default to
  // Dining so we never show a category-picker dialog before the form.
  var addCatId=activeCat==="all"?"restaurants":activeCat;
  var addCat=CATS.find(function(c){return c.id===addCatId;});

  // Compact chip + label-prefixed row used by every filter group. Kept
  // here (not extracted to a module-level helper) so the component
  // closure can reference the parent's state setters directly.
  function Chip({on,onClick,tone,children}){
    var goldOn=tone!=="kosher";
    var onBg=goldOn?"rgba(245,197,76,0.12)":"rgba(90,200,250,0.12)";
    var onBorder=goldOn?C.gd:"#5AC8FA";
    var onColor=goldOn?C.gd:"#5AC8FA";
    return(
      <button onClick={onClick}
        style={{...sf(12,600),padding:"6px 11px",borderRadius:18,
          border:"1px solid "+(on?onBorder:C.bd),
          background:on?onBg:"transparent",
          color:on?onColor:C.s3,
          cursor:"pointer",letterSpacing:0.3,transition:"all 0.12s"}}>
        {children}
      </button>
    );
  }
  function FilterRow({label,children}){
    return(
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10,alignItems:"center"}}>
        <span style={{...sf(10,700),color:C.s6,letterSpacing:1.2,textTransform:"uppercase",marginRight:4,minWidth:80}}>{label}</span>
        {children}
      </div>
    );
  }

  function renderRow(item){
    var c=item.cat;
    var row=item.row;
    var img=row[c.imgField||"hero_image_url"];
    var meta=[row.neighborhood,row.cuisine,row.brand,row.type].filter(Boolean).slice(0,2).join(" · ");
    return(
      <button key={c.id+"_"+row.id} onClick={function(){setEditCat(c);setEditRec(row);}}
        style={{display:"flex",alignItems:"center",gap:14,width:"100%",
          padding:"12px 14px",background:"transparent",border:"none",borderBottom:"1px solid "+C.bd,
          cursor:"pointer",textAlign:"left",transition:"background 0.12s"}}
        onMouseEnter={function(e){e.currentTarget.style.background=C.srf;}}
        onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
        {img?(
          <img src={img} alt="" style={{width:56,height:56,borderRadius:10,objectFit:"cover",border:"1px solid "+C.bd,flexShrink:0}}/>
        ):(
          <div style={{width:56,height:56,borderRadius:10,background:C.srf,border:"1px dashed "+C.bd,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon name="images" size={18} color={C.s6}/>
          </div>
        )}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{...sf(14,600),color:C.s1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.name}</span>
            <span style={{...sf(10,600),padding:"2px 8px",borderRadius:10,background:"rgba(212,168,83,0.10)",color:C.gd,letterSpacing:0.4,whiteSpace:"nowrap"}}>{item.catLabel}</span>
          </div>
          {meta&&<div style={{...sf(11),color:C.s5,marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{meta}</div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          {row.rating>0&&<span style={{...sf(12,600),color:C.gd}}>★ {row.rating}</span>}
          {row.is_active===false?(
            <span style={{...sf(10,600),padding:"3px 9px",borderRadius:12,background:"rgba(255,59,48,0.08)",color:C.rd,letterSpacing:0.4}}>OFF</span>
          ):(
            <span style={{...sf(10,600),padding:"3px 9px",borderRadius:12,background:"rgba(52,199,89,0.10)",color:C.gn,letterSpacing:0.4}}>Active</span>
          )}
        </div>
      </button>
    );
  }

  return(
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:6}}>
        <div style={{display:"flex",alignItems:"baseline",gap:14,flexWrap:"wrap"}}>
          <h2 style={{...sf(28,700),color:C.s1,margin:0,letterSpacing:-0.5}}>{cityLabel}</h2>
          <span style={{...sf(13),color:C.s5}}>{loading?"Loading…":(totalCount+" venues")}</span>
        </div>
        <button onClick={function(){setShowAdd(true);}}
          style={{...btn(C.gd,"#000"),fontWeight:700}}>
          <Icon name="add" size={18} color="#000"/> Add {(activeCat==="all"?"venue":(tabs.find(function(t){return t.key===activeCat;})||{}).label||"venue")}
        </button>
      </div>

      {/* Active-city pill */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
        <span style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 10px 6px 12px",
          borderRadius:20,background:"rgba(212,168,83,0.10)",border:"1px solid rgba(212,168,83,0.30)",
          ...sf(12,600),color:C.gd,letterSpacing:0.3}}>
          <Icon name="pin" size={12} color={C.gd}/>
          {cityLabel}
          <button onClick={onClearCity}
            style={{background:"none",border:"none",cursor:"pointer",padding:2,display:"flex",alignItems:"center",borderRadius:10,marginLeft:2}}
            title="Clear city filter">
            <Icon name="close" size={14} color={C.gd}/>
          </button>
        </span>
      </div>

      {/* Category tabs */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18,padding:"4px",
        background:C.bg2,border:"1px solid "+C.bd,borderRadius:14,width:"fit-content",maxWidth:"100%"}}>
        {tabs.map(function(t){
          var on=activeCat===t.key;
          return(
            <button key={t.key} onClick={function(){switchTab(t.key);}}
              style={{...sf(13,on?600:500),padding:"8px 14px",borderRadius:10,border:"none",
                background:on?C.srf:"transparent",color:on?C.s1:C.s4,
                cursor:"pointer",letterSpacing:0.2,transition:"all 0.12s",
                display:"flex",alignItems:"center",gap:7}}>
              {t.label}
              <span style={{...sf(11,500),color:on?C.gd:C.s5}}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters — universal (status + search) + per-category chips. */}
      <FilterRow label="Status">
        {[
          {v:"all",l:"All"},{v:"active",l:"Active"},{v:"inactive",l:"Inactive"},
        ].map(function(o){return(
          <Chip key={o.v} on={statusFilter===o.v} onClick={function(){setStatusFilter(o.v);}}>{o.l}</Chip>
        );})}
      </FilterRow>

      {activeCat==="restaurants"&&(
        <FilterRow label="Type">
          {[{v:"all",l:"All"},{v:"restaurant",l:"Restaurant"},{v:"cafe",l:"Coffee shop"},
            {v:"brunch",l:"Breakfast"},{v:"bakery",l:"Bakery"},{v:"beach_club",l:"Beach club"}
          ].map(function(o){return(
            <Chip key={o.v} on={diningType===o.v} onClick={function(){setDiningType(o.v);}}>{o.l}</Chip>
          );})}
        </FilterRow>
      )}

      {(activeCat==="restaurants"||activeCat==="accommodations")&&(
        <FilterRow label="Kosher">
          {[{v:"all",l:"All"},{v:"kosher",l:"Kosher only"},{v:"non_kosher",l:"Non-kosher"}].map(function(o){return(
            <Chip key={o.v} on={kosher===o.v} tone="kosher" onClick={function(){setKosher(o.v);}}>{o.l}</Chip>
          );})}
        </FilterRow>
      )}

      {activeCat==="restaurants"&&(
        <FilterRow label="Reservation">
          {[{v:"all",l:"All"},{v:"reservation",l:"Reservation required"},{v:"walk_in",l:"Walk-in only"}].map(function(o){return(
            <Chip key={o.v} on={walkIn===o.v} onClick={function(){setWalkIn(o.v);}}>{o.l}</Chip>
          );})}
        </FilterRow>
      )}

      {activeCat==="accommodations"&&(
        <>
          <FilterRow label="Stars">
            {[0,5,4,3].map(function(n){return(
              <Chip key={n} on={starRating===n} onClick={function(){setStarRating(n);}}>{n===0?"All":(n+"★")}</Chip>
            );})}
          </FilterRow>
          <FilterRow label="Status">
            {[{v:"all",l:"All"},{v:"open",l:"Open"},{v:"coming_soon",l:"Coming soon"},{v:"closed",l:"Closed"}].map(function(o){return(
              <Chip key={o.v} on={hotelStatus===o.v} onClick={function(){setHotelStatus(o.v);}}>{o.l}</Chip>
            );})}
          </FilterRow>
        </>
      )}

      {(activeCat==="cars"||activeCat==="yachts")&&brandOptions.length>0&&(
        <FilterRow label="Brand">
          <Chip on={!brand} onClick={function(){setBrand("");}}>All</Chip>
          {brandOptions.map(function(b){return(
            <Chip key={b} on={brand===b} onClick={function(){setBrand(b);}}>{b}</Chip>
          );})}
        </FilterRow>
      )}

      {activeCat==="wellness"&&wellnessTypeOptions.length>0&&(
        <FilterRow label="Type">
          <Chip on={!wellnessType} onClick={function(){setWellnessType("");}}>All</Chip>
          {wellnessTypeOptions.map(function(t){return(
            <Chip key={t} on={wellnessType===t} onClick={function(){setWellnessType(t);}}>{t}</Chip>
          );})}
        </FilterRow>
      )}

      {activeCat==="nightlife"&&(
        <FilterRow label="Type">
          {[{v:"",l:"All"},{v:"nightclub",l:"Nightclub"},{v:"bar",l:"Bar"},{v:"lounge",l:"Lounge"},{v:"rooftop",l:"Rooftop"}].map(function(o){return(
            <Chip key={o.v||"all"} on={nightlifeCat===o.v} onClick={function(){setNightlifeCat(o.v);}}>{o.l}</Chip>
          );})}
        </FilterRow>
      )}

      {/* Search */}
      <div style={{position:"relative",maxWidth:420,marginBottom:14}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}>
          <Icon name="search" size={16} color={C.s5}/>
        </div>
        <input placeholder={"Search "+cityLabel+" venues..."} value={search}
          onChange={function(e){setSearch(e.target.value);}}
          style={{width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px 10px 36px",...sf(14),color:C.s1,outline:"none"}}/>
      </div>

      {/* Unified venue list */}
      {loading?(
        <div style={{padding:"60px 20px",textAlign:"center",color:C.s5,...sf(14)}}>Loading {cityLabel} venues…</div>
      ):visible.length===0?(
        <div style={{padding:"60px 20px",textAlign:"center",color:C.s5,...sf(14),background:C.el,border:"1px solid "+C.bd,borderRadius:14}}>
          {search?("No venues match \""+search+"\" in "+cityLabel)
            :(activeCat==="all"?"No venues in "+cityLabel+" yet":"No "+(tabs.find(function(t){return t.key===activeCat;})||{}).label+" in "+cityLabel+" yet")}
          <div style={{marginTop:14}}>
            <button onClick={function(){setShowAdd(true);}}
              style={{...sf(12,600),color:"#000",background:C.gd,border:"none",padding:"8px 16px",borderRadius:16,cursor:"pointer"}}>
              + Add first {(activeCat==="all"?"venue":(tabs.find(function(t){return t.key===activeCat;})||{}).label||"venue")}
            </button>
          </div>
        </div>
      ):(
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:14,overflow:"hidden"}}>
          {visible.map(renderRow)}
        </div>
      )}

      {/* Edit modal */}
      {editRec&&editCat&&(
        <EditModal cat={editCat} record={editRec}
          onClose={function(){setEditRec(null);setEditCat(null);}}
          onSave={function(){setEditRec(null);setEditCat(null);refreshCategory(editCat);}}/>
      )}

      {/* Add modal — pre-fill the current city + the same is_active /
          category defaults the EditModal would set for a blank record,
          so the operator never re-types "Paris". For "Other cities" we
          leave city undefined since the bucket isn't a single city. */}
      {showAdd&&addCat&&(
        <EditModal cat={addCat} record={{
          is_active:true,
          city:city==="__other__"?undefined:city,
          category:addCat.id==="restaurants"?"restaurant":addCat.id==="nightlife"?"nightclub":undefined
        }}
          onClose={function(){setShowAdd(false);}}
          onSave={function(){setShowAdd(false);refreshCategory(addCat);}}/>
      )}
    </div>
  );
}

/* ═══ Category View ═══ */
function CategoryView({cat,globalCity,onClearCity}){
  var [records,setRecords]=useState([]);
  var [loading,setLoading]=useState(true);
  var [search,setSearch]=useState("");
  // Local city dropdown still works for one-off picks (e.g. "Monaco"
  // which isn't a sidebar shortcut). The global sidebar pick takes
  // precedence — see the `globalCity` branch below.
  var [cityFilter,setCityFilter]=useState("");
  var [activeFilter,setActiveFilter]=useState("");
  // Restaurants-only: lets ops triage which venues still need their
  // booking-config filled in (time_slots empty, closed_weekdays empty
  // on a restaurant that should have closures, no peak price set, etc.)
  var [configFilter,setConfigFilter]=useState("");
  // Restaurants: dining sub-category chip filter.
  // ""=all | "restaurant" | "cafe" | "brunch" | "bakery" | "beach_club"
  var [diningTypeFilter,setDiningTypeFilter]=useState("");
  // Restaurants + Hotels: kosher pill filter.
  // ""=all | "kosher" | "non_kosher"
  var [kosherFilter,setKosherFilter]=useState("");
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
    // Sidebar global city filter — wins over the local dropdown.
    // Empty = no filter. "__other__" = anything not in the 5 primary
    // markets. Otherwise exact match on the city string.
    if(globalCity){
      if(globalCity==="__other__"){
        if(PRIMARY_CITIES.indexOf(r.city)>=0)return false;
      }else if(r.city!==globalCity){
        return false;
      }
    }else if(cityFilter&&r.city!==cityFilter){
      return false;
    }
    if(activeFilter==="active"&&!r.is_active)return false;
    if(activeFilter==="inactive"&&r.is_active)return false;
    if(cat.id==="restaurants"&&configFilter){
      var hasSlots=Array.isArray(r.time_slots)&&r.time_slots.length>0;
      var hasPeak=r.peak_price_per_person!=null&&r.peak_price_per_person>0;
      var hasHours=(r.hours_dinner&&r.hours_dinner.length)||(r.hours_lunch&&r.hours_lunch.length);
      if(configFilter==="needs_slots"&&hasSlots)return false;
      if(configFilter==="needs_peak"&&hasPeak)return false;
      if(configFilter==="needs_hours"&&hasHours)return false;
      if(configFilter==="walk_in"&&r.reservation_required!==false)return false;
    }
    if(cat.id==="restaurants"&&diningTypeFilter&&r.category!==diningTypeFilter)return false;
    if((cat.id==="restaurants"||cat.id==="accommodations")&&kosherFilter){
      if(kosherFilter==="kosher"&&r.kosher!==true)return false;
      if(kosherFilter==="non_kosher"&&r.kosher===true)return false;
    }
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
    reservation_required:"Booking",kosher:"Kosher",
    time_slots:"Slots",peak_price_per_person:"Premium $",
    brand:"Brand",max_passengers:"Guests",price_4hr:"4hr Rate",price_per_day:"$/Day",price_1_day:"Day Rate",
    type:"Type",capacity:"Capacity",location:"Location",door_policy:"Door"};

  // Pretty label for the global-city pill. "__other__" reads as a label,
  // not a SQL marker, in the UI.
  var globalCityLabel=globalCity==="__other__"?"Other cities":globalCity;

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:24}}>
        <div style={{display:"flex",alignItems:"baseline",gap:14,flexWrap:"wrap"}}>
          <h2 style={{...sf(24,600),color:C.s1,margin:0}}>{cat.label}</h2>
          {globalCity&&(
            <span style={{...sf(12,500),color:C.s5}}>
              in <span style={{color:C.gd,fontWeight:600}}>{globalCityLabel}</span>
            </span>
          )}
        </div>
        <button onClick={function(){setShowAdd(true);}}
          style={{...btn(C.gd,"#000"),fontWeight:700}}>
          <Icon name="add" size={18} color="#000"/> Add {cat.label.slice(0,-1)}
        </button>
      </div>

      {/* Global city pill — only shows when the sidebar set a city. Clicking
          the × clears the global filter and goes back to "All cities". */}
      {globalCity&&(
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
          <span style={{...sf(10,700),color:C.s6,letterSpacing:1.2,textTransform:"uppercase"}}>Filtered by</span>
          <span style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 10px 6px 12px",
            borderRadius:20,background:"rgba(212,168,83,0.10)",border:"1px solid rgba(212,168,83,0.30)",
            ...sf(12,600),color:C.gd,letterSpacing:0.3}}>
            <Icon name="pin" size={12} color={C.gd}/>
            {globalCityLabel}
            <button onClick={onClearCity}
              style={{background:"none",border:"none",cursor:"pointer",padding:2,display:"flex",alignItems:"center",borderRadius:10,marginLeft:2}}
              title="Clear city filter"
              onMouseEnter={function(e){e.currentTarget.style.background="rgba(0,0,0,0.2)";}}
              onMouseLeave={function(e){e.currentTarget.style.background="none";}}>
              <Icon name="close" size={14} color={C.gd}/>
            </button>
          </span>
          <span style={{...sf(12),color:C.s5}}>· {filtered.length} {cat.label.toLowerCase()}</span>
        </div>
      )}

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
        {cat.id==="restaurants"&&(
          <select value={configFilter} onChange={function(e){setConfigFilter(e.target.value);}}
            style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(13),color:C.s3,outline:"none",appearance:"auto"}}
            title="Triage restaurants by booking-config completeness">
            <option value="">All Configs</option>
            <option value="needs_slots">Missing time slots</option>
            <option value="needs_hours">Missing display hours</option>
            <option value="needs_peak">No premium price</option>
            <option value="walk_in">Walk-in only (no reservation)</option>
          </select>
        )}
        <span style={{...sf(13),color:C.s5}}>{filtered.length} record{filtered.length!==1?"s":""}</span>
      </div>

      {/* Dining sub-category chips (restaurants only) */}
      {cat.id==="restaurants"&&(
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14,alignItems:"center"}}>
          <span style={{...sf(10,600),color:C.s6,letterSpacing:1,textTransform:"uppercase",marginRight:4}}>Type</span>
          {[
            {v:"",l:"All"},
            {v:"restaurant",l:"Restaurant"},
            {v:"cafe",l:"Coffee shop"},
            {v:"brunch",l:"Breakfast"},
            {v:"bakery",l:"Bakery"},
            {v:"beach_club",l:"Beach club"},
          ].map(function(opt){
            var on=diningTypeFilter===opt.v;
            return(
              <button key={opt.v||"all"} onClick={function(){setDiningTypeFilter(opt.v);}}
                style={{...sf(12,600),padding:"6px 12px",borderRadius:20,border:"1px solid "+(on?C.gd:C.bd),
                  background:on?"rgba(245,197,76,0.12)":"transparent",color:on?C.gd:C.s3,
                  cursor:"pointer",letterSpacing:0.3,transition:"all 0.15s"}}>
                {opt.l}
              </button>
            );
          })}
        </div>
      )}

      {/* Kosher chips (restaurants + hotels) */}
      {(cat.id==="restaurants"||cat.id==="accommodations")&&(
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20,alignItems:"center"}}>
          <span style={{...sf(10,600),color:C.s6,letterSpacing:1,textTransform:"uppercase",marginRight:4}}>Kosher</span>
          {[
            {v:"",l:"All"},
            {v:"kosher",l:"Kosher only"},
            {v:"non_kosher",l:"Non-kosher only"},
          ].map(function(opt){
            var on=kosherFilter===opt.v;
            return(
              <button key={opt.v||"all"} onClick={function(){setKosherFilter(opt.v);}}
                style={{...sf(12,600),padding:"6px 12px",borderRadius:20,border:"1px solid "+(on?"#5AC8FA":C.bd),
                  background:on?"rgba(90,200,250,0.12)":"transparent",color:on?"#5AC8FA":C.s3,
                  cursor:"pointer",letterSpacing:0.3,transition:"all 0.15s"}}>
                {opt.l}
              </button>
            );
          })}
        </div>
      )}

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
                  <th style={{padding:"12px 14px",textAlign:"left",width:80}}>
                    <span style={{...sf(10,600),color:C.s6,letterSpacing:1}}>PHOTO</span>
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
                      <td style={{padding:"10px 14px",cursor:"pointer"}} onClick={function(){setEditRec(row);}}>
                        {row[cat.imgField]?(
                          <img src={row[cat.imgField]} alt="" style={{width:64,height:64,borderRadius:10,objectFit:"cover",display:"block",border:"1px solid "+C.bd}}/>
                        ):(
                          <div style={{width:64,height:64,borderRadius:10,background:C.srf,display:"flex",alignItems:"center",justifyContent:"center",border:"1px dashed "+C.bd}}>
                            <Icon name="images" size={20} color={C.s6}/>
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
// Service-type metadata for the Bookings tab. `id` matches the
// `service_type` column in public.bookings.
var SERVICE_TYPES=[
  {id:"Dining",         label:"Dining",     icon:"restaurant", color:"#FF9500"},
  {id:"Nightlife",      label:"Nightlife",  icon:"nightlife",  color:"#AF52DE"},
  {id:"Yachts",         label:"Yachts",     icon:"yacht",      color:"#007AFF"},
  {id:"Wellness",       label:"Wellness",   icon:"wellness",   color:"#34C759"},
  {id:"Cars",           label:"Cars",       icon:"car",        color:"#FF3B30"},
  {id:"Jets",           label:"Jets",       icon:"yacht",      color:"#5AC8FA"},
  {id:"Accommodations", label:"Hotels",     icon:"star",       color:"#FFD60A"}
];
var STATUSES=["pending","requested","confirmed","completed","cancelled","no_show"];

function svcMeta(svc){
  for(var i=0;i<SERVICE_TYPES.length;i++){if(SERVICE_TYPES[i].id===svc)return SERVICE_TYPES[i];}
  return {id:svc||"Dining",label:svc||"Dining",icon:"bookings",color:C.s5};
}
function money(n){
  var v=Number(n)||0;
  return "$"+v.toLocaleString("en-US",{minimumFractionDigits:v%1?2:0,maximumFractionDigits:2});
}
function csvEscape(s){
  if(s==null)return "";
  var v=String(s);
  if(v.indexOf(",")<0&&v.indexOf("\"")<0&&v.indexOf("\n")<0)return v;
  return "\""+v.replace(/"/g,"\"\"")+"\"";
}
function downloadCSV(rows,filename){
  var blob=new Blob([rows.join("\n")],{type:"text/csv;charset=utf-8"});
  var url=URL.createObjectURL(blob);
  var a=document.createElement("a");
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();
  document.body.removeChild(a);URL.revokeObjectURL(url);
}

function BookingsView(){
  var [bookings,setBookings]=useState([]);
  var [users,setUsers]=useState([]);
  var [loading,setLoading]=useState(true);
  var [statusFilter,setStatusFilter]=useState("");
  var [categoryFilter,setCategoryFilter]=useState("");
  var [cityFilter,setCityFilter]=useState("");
  var [dateFrom,setDateFrom]=useState("");
  var [dateTo,setDateTo]=useState("");
  var [search,setSearch]=useState("");
  var [selectedBooking,setSelectedBooking]=useState(null);
  var [showAdd,setShowAdd]=useState(false);
  var [confirmDelete,setConfirmDelete]=useState(null);

  async function load(){
    setLoading(true);
    var {data:b}=await supabase.from("bookings").select("*").order("reservation_date",{ascending:false});
    var {data:u}=await supabase.from("users").select("*");
    setBookings(b||[]);setUsers(u||[]);setLoading(false);
  }
  useEffect(function(){
    load();
    // Real-time: notify Slack whenever a new booking is inserted from the app
    var channel=supabase.channel("new-bookings-notify")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"bookings"},function(payload){
        var bk=payload.new;
        notifySlack("booking","New Booking 🎉",bk.restaurant_name||"","*Status:* "+(bk.status||"pending")+" | *Date:* "+(bk.reservation_date||"-")+" "+(bk.reservation_time?("at "+bk.reservation_time.slice(0,5)):"")+" | *Party:* "+(bk.party_size||1)+(bk.city?" | *City:* "+bk.city:"")+(bk.occasion?" | *Occasion:* "+bk.occasion:""));
        load();
      })
      .subscribe();
    return function(){supabase.removeChannel(channel);};
  },[]);

  function getUser(userId){return users.find(function(u){return u.id===userId;})||{};}
  function num(v){return Number(v)||0;}

  var statusColors={pending:C.or,requested:C.bl,confirmed:C.gn,completed:C.s2,cancelled:C.rd,no_show:"#8E8E93"};

  // Apply filters
  var filtered=bookings.filter(function(b){
    if(statusFilter&&b.status!==statusFilter)return false;
    if(categoryFilter&&(b.service_type||"Dining")!==categoryFilter)return false;
    if(cityFilter&&b.city!==cityFilter)return false;
    if(dateFrom&&(b.reservation_date||"")<dateFrom)return false;
    if(dateTo&&(b.reservation_date||"")>dateTo)return false;
    if(search){
      var s=search.toLowerCase();
      var user=getUser(b.user_id);
      var userName=((user.first_name||"")+" "+(user.last_name||"")).toLowerCase();
      if(!(b.restaurant_name||"").toLowerCase().includes(s)&&!userName.includes(s)&&!(user.email||"").toLowerCase().includes(s)&&!(b.notes||"").toLowerCase().includes(s))return false;
    }
    return true;
  });

  // ===== Revenue & operational metrics (scoped to filtered set) =====
  var metrics={
    count:filtered.length,confirmedCount:0,completedCount:0,cancelledCount:0,noShowCount:0,pendingCount:0,
    totalGross:0,totalCommission:0,totalGuests:0,
    byCategory:{},byCity:{},byVenue:{},byMember:{}
  };
  filtered.forEach(function(b){
    var s=b.status||"pending";
    if(s==="confirmed")metrics.confirmedCount++;
    else if(s==="completed")metrics.completedCount++;
    else if(s==="cancelled")metrics.cancelledCount++;
    else if(s==="no_show")metrics.noShowCount++;
    else if(s==="pending"||s==="requested")metrics.pendingCount++;
    var gross=num(b.gross_amount);
    var commission=num(b.commission_amount);
    metrics.totalGross+=gross;
    metrics.totalCommission+=commission;
    metrics.totalGuests+=num(b.party_size);
    var cat=b.service_type||"Dining";
    var city=b.city||"Unknown";
    var venue=b.restaurant_name||"—";
    if(!metrics.byCategory[cat])metrics.byCategory[cat]={count:0,gross:0,commission:0};
    metrics.byCategory[cat].count++;metrics.byCategory[cat].gross+=gross;metrics.byCategory[cat].commission+=commission;
    if(!metrics.byCity[city])metrics.byCity[city]={count:0,gross:0,commission:0};
    metrics.byCity[city].count++;metrics.byCity[city].gross+=gross;metrics.byCity[city].commission+=commission;
    if(!metrics.byVenue[venue])metrics.byVenue[venue]={count:0,gross:0,commission:0};
    metrics.byVenue[venue].count++;metrics.byVenue[venue].gross+=gross;metrics.byVenue[venue].commission+=commission;
    if(b.user_id){
      var u=getUser(b.user_id);
      var name=((u.first_name||"")+" "+(u.last_name||"")).trim()||u.email||"Member";
      if(!metrics.byMember[b.user_id])metrics.byMember[b.user_id]={name:name,count:0,gross:0,commission:0};
      metrics.byMember[b.user_id].count++;metrics.byMember[b.user_id].gross+=gross;metrics.byMember[b.user_id].commission+=commission;
    }
  });
  var avgCommission=metrics.count?metrics.totalCommission/metrics.count:0;
  var avgGross=metrics.count?metrics.totalGross/metrics.count:0;
  var conversionRate=metrics.count?(metrics.confirmedCount+metrics.completedCount)/metrics.count*100:0;
  var noShowRate=metrics.count?metrics.noShowCount/metrics.count*100:0;

  // Group by date (descending)
  var byDate={};
  filtered.forEach(function(b){
    var d=b.reservation_date||"Unknown";
    if(!byDate[d])byDate[d]=[];
    byDate[d].push(b);
  });
  var sortedDates=Object.keys(byDate).sort().reverse();

  var today=new Date().toISOString().slice(0,10);
  var tomorrowDate=new Date(Date.now()+86400000).toISOString().slice(0,10);

  // Status counts across ALL bookings (chip badges)
  var statusCountsAll={"":bookings.length};
  bookings.forEach(function(b){var s=b.status||"pending";statusCountsAll[s]=(statusCountsAll[s]||0)+1;});

  var cities=[...new Set(bookings.map(function(b){return b.city;}).filter(Boolean))].sort();

  async function updateStatus(id,status){
    var booking=bookings.find(function(b){return b.id===id;});
    var user=getUser(booking?booking.user_id:"");
    await supabase.from("bookings").update({status:status,updated_at:new Date().toISOString()}).eq("id",id);
    notifySlack("booking","Bookings",(user.first_name||"")+" "+(user.last_name||""),"*Status changed to:* "+status+" | *Venue:* "+(booking?booking.restaurant_name:"")+" | *Guest:* "+(user.email||booking&&booking.user_id||"unknown")+" | *Date:* "+(booking?booking.reservation_date:"")+" "+(booking?booking.reservation_time?"at "+(booking.reservation_time.slice(0,5)):"":""));
    load();
  }
  async function addNote(id,note){
    await supabase.from("bookings").update({notes:note,updated_at:new Date().toISOString()}).eq("id",id);
    load();
  }
  async function saveBooking(form){
    var clean={...form};
    if(clean.party_size!==undefined&&clean.party_size!=="")clean.party_size=Number(clean.party_size);
    clean.gross_amount=(clean.gross_amount===""||clean.gross_amount==null)?null:Number(clean.gross_amount);
    clean.commission_amount=(clean.commission_amount===""||clean.commission_amount==null)?null:Number(clean.commission_amount);
    if(clean.payment_amount!==undefined&&clean.payment_amount!=="")clean.payment_amount=Number(clean.payment_amount);
    if(!clean.user_id)delete clean.user_id;
    var isUpdate=!!clean.id;
    if(isUpdate){
      var id=clean.id;delete clean.id;delete clean.created_at;
      clean.updated_at=new Date().toISOString();
      var r1=await supabase.from("bookings").update(clean).eq("id",id);
      if(r1.error){alert("Update failed: "+r1.error.message);return;}
      notifySlack("updated","Bookings",clean.restaurant_name||"","Reservation updated · "+(clean.reservation_date||"")+" "+(clean.reservation_time||"")+" · status: "+(clean.status||""));
    }else{
      clean.created_at=new Date().toISOString();
      clean.updated_at=new Date().toISOString();
      var r2=await supabase.from("bookings").insert(clean);
      if(r2.error){alert("Insert failed: "+r2.error.message);return;}
      notifySlack("created","Bookings",clean.restaurant_name||"","New reservation · "+(clean.service_type||"Dining")+" · "+(clean.reservation_date||"")+" "+(clean.reservation_time||""));
    }
    setSelectedBooking(null);setShowAdd(false);load();
  }
  async function deleteBooking(id){
    var b=bookings.find(function(x){return x.id===id;});
    var r=await supabase.from("bookings").delete().eq("id",id);
    if(r.error){alert("Delete failed: "+r.error.message);return;}
    notifySlack("deleted","Bookings",b?b.restaurant_name||"":"","Reservation deleted"+(b?" · "+(b.reservation_date||"")+" "+(b.reservation_time||""):""));
    setConfirmDelete(null);setSelectedBooking(null);load();
  }

  function exportCSV(){
    var headers=["id","status","service_type","reservation_date","reservation_time","venue","city","party_size","gross_amount","commission_amount","payment_amount","guest_name","guest_email","occasion","seating_preference","notes","created_at"];
    var lines=[headers.join(",")];
    filtered.forEach(function(b){
      var u=getUser(b.user_id);
      var name=((u.first_name||b.guest_name||"")+" "+(u.last_name||"")).trim();
      var row=[b.id,b.status||"",b.service_type||"",b.reservation_date||"",b.reservation_time?b.reservation_time.slice(0,5):"",b.restaurant_name||"",b.city||"",b.party_size||"",b.gross_amount||"",b.commission_amount||"",b.payment_amount||"",name,u.email||b.guest_email||"",b.occasion||"",b.seating_preference||"",(b.notes||"").replace(/\n/g," "),b.created_at||""];
      lines.push(row.map(csvEscape).join(","));
    });
    downloadCSV(lines,"alfred-bookings-"+today+".csv");
  }

  var categoryRows=Object.keys(metrics.byCategory).map(function(k){return {k:k,count:metrics.byCategory[k].count,gross:metrics.byCategory[k].gross,commission:metrics.byCategory[k].commission};}).sort(function(a,b){return b.commission-a.commission||b.count-a.count;});
  var topVenues=Object.keys(metrics.byVenue).map(function(k){return {k:k,count:metrics.byVenue[k].count,gross:metrics.byVenue[k].gross,commission:metrics.byVenue[k].commission};}).sort(function(a,b){return b.commission-a.commission||b.count-a.count;}).slice(0,5);
  var topMembers=Object.keys(metrics.byMember).map(function(k){return metrics.byMember[k];}).sort(function(a,b){return b.commission-a.commission||b.count-a.count;}).slice(0,5);
  var maxCatCommission=categoryRows.reduce(function(m,r){return Math.max(m,r.commission);},1);

  function clearFilters(){setStatusFilter("");setCategoryFilter("");setCityFilter("");setDateFrom("");setDateTo("");setSearch("");}
  var anyFilter=!!(statusFilter||categoryFilter||cityFilter||dateFrom||dateTo||search);

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <div>
          <h2 style={{...sf(24,600),color:C.s1,margin:0}}>Reservations</h2>
          <p style={{...sf(12),color:C.s5,margin:"4px 0 0"}}>{filtered.length} of {bookings.length} reservation{bookings.length!==1?"s":""}{anyFilter?" · filtered":""}</p>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button onClick={exportCSV} style={btn(C.srf,C.s2,{bd:C.bd})} title="Download filtered reservations as CSV">
            <Icon name="down" size={14} color={C.s3}/> Export CSV
          </button>
          <button onClick={function(){setShowAdd(true);}} style={{...btn(C.gd,"#000"),fontWeight:700}}>
            <Icon name="add" size={14} color="#000"/> New Reservation
          </button>
        </div>
      </div>

      {/* Revenue Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12,marginBottom:16}}>
        <RevCard label="Revenue (Commission)" value={money(metrics.totalCommission)} sub={metrics.count+" booking"+(metrics.count!==1?"s":"")} color={C.gd} hi/>
        <RevCard label="Gross Booking Value" value={money(metrics.totalGross)} sub={"Avg "+money(avgGross)+"/booking"} color={C.bl}/>
        <RevCard label="Avg Commission" value={money(avgCommission)} sub="per booking" color={C.gn}/>
        <RevCard label="Confirmed / Completed" value={String(metrics.confirmedCount+metrics.completedCount)} sub={conversionRate.toFixed(0)+"% conversion"} color={C.gn}/>
        <RevCard label="Pending / Requested" value={String(metrics.pendingCount)} sub="awaiting action" color={C.or}/>
        <RevCard label="Cancelled / No-show" value={String(metrics.cancelledCount+metrics.noShowCount)} sub={noShowRate.toFixed(0)+"% no-show"} color={C.rd}/>
      </div>

      {/* Insights Panel */}
      {metrics.count>0&&(
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12,marginBottom:20}}>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:14,padding:"16px 18px"}}>
          <p style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",margin:"0 0 12px"}}>Revenue by Category</p>
          {categoryRows.length===0?<p style={{...sf(12),color:C.s5,margin:0}}>No revenue recorded</p>:categoryRows.map(function(r){
            var meta=svcMeta(r.k);
            var pct=maxCatCommission?r.commission/maxCatCommission*100:0;
            return(
              <div key={r.k} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{...sf(12,500),color:C.s2,display:"flex",alignItems:"center",gap:6}}>
                    <Icon name={meta.icon} size={12} color={meta.color}/> {meta.label}
                    <span style={{...sf(10),color:C.s5}}>({r.count})</span>
                  </span>
                  <span style={{...sf(12,600),color:C.gd}}>{money(r.commission)}</span>
                </div>
                <div style={{height:6,background:C.srf,borderRadius:3,overflow:"hidden"}}>
                  <div style={{width:pct+"%",height:"100%",background:meta.color,borderRadius:3}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:14,padding:"16px 18px"}}>
          <p style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",margin:"0 0 12px"}}>Top Venues by Revenue</p>
          {topVenues.length===0?<p style={{...sf(12),color:C.s5,margin:0}}>No venues</p>:topVenues.map(function(r,i){
            return(
              <div key={r.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i<topVenues.length-1?"1px solid "+C.bd:"none"}}>
                <div style={{minWidth:0,flex:1}}>
                  <p style={{...sf(13,500),color:C.s2,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.k}</p>
                  <p style={{...sf(10),color:C.s5,margin:"2px 0 0"}}>{r.count} booking{r.count!==1?"s":""} · {money(r.gross)} gross</p>
                </div>
                <span style={{...sf(13,600),color:C.gd,marginLeft:10,flexShrink:0}}>{money(r.commission)}</span>
              </div>
            );
          })}
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:14,padding:"16px 18px"}}>
          <p style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",margin:"0 0 12px"}}>Top Members by Spend</p>
          {topMembers.length===0?<p style={{...sf(12),color:C.s5,margin:0}}>No member spend recorded</p>:topMembers.map(function(r,i){
            return(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i<topMembers.length-1?"1px solid "+C.bd:"none"}}>
                <div style={{minWidth:0,flex:1}}>
                  <p style={{...sf(13,500),color:C.s2,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name}</p>
                  <p style={{...sf(10),color:C.s5,margin:"2px 0 0"}}>{r.count} booking{r.count!==1?"s":""} · {money(r.gross)} gross</p>
                </div>
                <span style={{...sf(13,600),color:C.gd,marginLeft:10,flexShrink:0}}>{money(r.commission)}</span>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Status chips */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10,alignItems:"center"}}>
        {["","pending","requested","confirmed","completed","cancelled","no_show"].map(function(s){
          var active=statusFilter===s;
          var label=s?s.replace("_"," "):"All Status";
          var count=statusCountsAll[s]||0;
          var color=s?(statusColors[s]||C.s5):C.s2;
          return <button key={s||"all"} onClick={function(){setStatusFilter(s);}}
            style={{padding:"6px 12px",background:active?C.srf:"none",border:"1px solid "+(active?color+"50":"transparent"),
              borderRadius:8,...sf(12,active?600:500),color:active?C.s1:C.s5,cursor:"pointer",textTransform:"capitalize",display:"flex",alignItems:"center",gap:6}}>
            {label}<span style={{...sf(10,600),color:active?color:C.s6,background:active?color+"15":C.srf,padding:"1px 6px",borderRadius:8}}>{count}</span>
          </button>;
        })}
      </div>

      {/* Category chips */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10,alignItems:"center"}}>
        <button onClick={function(){setCategoryFilter("");}}
          style={{padding:"6px 12px",background:categoryFilter===""?C.srf:"none",border:"1px solid "+(categoryFilter===""?C.bd:"transparent"),borderRadius:8,...sf(12,categoryFilter===""?600:500),color:categoryFilter===""?C.s1:C.s5,cursor:"pointer"}}>
          All Categories
        </button>
        {SERVICE_TYPES.map(function(t){
          var active=categoryFilter===t.id;
          var count=bookings.filter(function(b){return (b.service_type||"Dining")===t.id;}).length;
          if(count===0&&!active)return null;
          return <button key={t.id} onClick={function(){setCategoryFilter(t.id);}}
            style={{padding:"6px 12px",background:active?C.srf:"none",border:"1px solid "+(active?t.color+"50":"transparent"),borderRadius:8,...sf(12,active?600:500),color:active?C.s1:C.s5,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            <Icon name={t.icon} size={11} color={t.color}/>{t.label}
            <span style={{...sf(10,600),color:active?t.color:C.s6,background:active?t.color+"15":C.srf,padding:"1px 6px",borderRadius:8}}>{count}</span>
          </button>;
        })}
      </div>

      {/* Search + date range + city */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20,alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 220px",maxWidth:320}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><Icon name="search" size={14} color={C.s5}/></div>
          <input placeholder="Search guest, venue, email, notes..." value={search} onChange={function(e){setSearch(e.target.value);}}
            style={{width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"9px 12px 9px 32px",...sf(13),color:C.s1,outline:"none"}}/>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"4px 10px"}}>
          <span style={{...sf(11),color:C.s5}}>From</span>
          <input type="date" value={dateFrom} onChange={function(e){setDateFrom(e.target.value);}}
            style={{background:"transparent",border:"none",...sf(12),color:C.s1,outline:"none",colorScheme:"dark"}}/>
          <span style={{...sf(11),color:C.s5}}>To</span>
          <input type="date" value={dateTo} onChange={function(e){setDateTo(e.target.value);}}
            style={{background:"transparent",border:"none",...sf(12),color:C.s1,outline:"none",colorScheme:"dark"}}/>
        </div>
        <button onClick={function(){setDateFrom(today);setDateTo(today);}} style={btn("none",C.s4,{sm:true,bd:C.bd})}>Today</button>
        <button onClick={function(){
          var d=new Date();d.setDate(d.getDate()-7);
          setDateFrom(d.toISOString().slice(0,10));setDateTo(today);
        }} style={btn("none",C.s4,{sm:true,bd:C.bd})}>Last 7d</button>
        <button onClick={function(){
          var d=new Date();d.setDate(d.getDate()-30);
          setDateFrom(d.toISOString().slice(0,10));setDateTo(today);
        }} style={btn("none",C.s4,{sm:true,bd:C.bd})}>Last 30d</button>
        <select value={cityFilter} onChange={function(e){setCityFilter(e.target.value);}}
          style={{padding:"9px 12px",borderRadius:10,border:"1px solid "+C.bd,background:C.srf,...sf(12),color:C.s3,outline:"none",appearance:"auto"}}>
          <option value="">All Cities</option>
          {cities.map(function(c){return <option key={c} value={c}>{c}</option>;})}
        </select>
        {anyFilter&&<button onClick={clearFilters} style={btn("none",C.s4,{sm:true,bd:C.bd})}>Clear filters</button>}
      </div>

      {/* Bookings grouped by date */}
      {loading?<div style={{padding:"60px",textAlign:"center",color:C.s5}}>Loading reservations...</div>:filtered.length===0?(
        <div style={{textAlign:"center",padding:"60px 20px",background:C.el,borderRadius:16,border:"1px solid "+C.bd}}>
          <p style={{...sf(16,500),color:C.s3,margin:"0 0 8px"}}>No reservations found</p>
          <p style={{...sf(13),color:C.s5}}>{anyFilter?"Try adjusting your filters or ":""}<button onClick={function(){setShowAdd(true);}} style={{background:"none",border:"none",color:C.gd,cursor:"pointer",...sf(13),textDecoration:"underline"}}>add a new reservation</button>.</p>
        </div>
      ):(
        <div style={{display:"grid",gap:20}}>
          {sortedDates.map(function(date){
            var dayBookings=byDate[date];
            var isToday=date===today;
            var isTomorrow=date===tomorrowDate;
            var dayLabel=isToday?"Today":isTomorrow?"Tomorrow":new Date(date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
            var totalGuests=dayBookings.reduce(function(s,b){return s+(b.party_size||0);},0);
            var dayCommission=dayBookings.reduce(function(s,b){return s+num(b.commission_amount);},0);

            return(
              <div key={date}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}>
                  <h3 style={{...sf(16,600),color:isToday?C.gd:isTomorrow?C.bl:C.s2,margin:0}}>{dayLabel}</h3>
                  <span style={{...sf(11),color:C.s5}}>{dayBookings.length} reservation{dayBookings.length!==1?"s":""} · {totalGuests} guests{dayCommission>0?" · "+money(dayCommission)+" commission":""}</span>
                  {isToday&&<span style={{...sf(10,600),padding:"2px 8px",borderRadius:20,background:C.gd+"15",color:C.gd}}>TODAY</span>}
                </div>
                <div style={{display:"grid",gap:8}}>
                  {dayBookings.sort(function(a,b){return (a.reservation_time||"").localeCompare(b.reservation_time||"");}).map(function(b){
                    var user=getUser(b.user_id);
                    var sc=statusColors[b.status||"pending"]||C.s5;
                    var userName=(user.first_name||b.guest_name||"")+" "+(user.last_name||"");
                    var meta=svcMeta(b.service_type);
                    return(
                      <div key={b.id} style={{display:"grid",gridTemplateColumns:"48px 36px minmax(0,1fr) auto",columnGap:12,rowGap:4,padding:"12px 14px",background:C.el,border:"1px solid "+C.bd,borderRadius:14,alignItems:"center",borderLeft:"3px solid "+sc,cursor:"pointer",transition:"background 0.15s"}}
                        onClick={function(){setSelectedBooking(b);}}
                        onMouseEnter={function(e){e.currentTarget.style.background=C.srf;}}
                        onMouseLeave={function(e){e.currentTarget.style.background=C.el;}}>
                        {/* Time — col 1, rows 1-2 */}
                        <div style={{gridRow:"1 / span 2",textAlign:"center"}}>
                          {b.end_date&&b.end_date!==b.reservation_date?(
                            <div style={{lineHeight:1.1}}>
                              <p style={{...sf(11,700),color:C.s2,margin:0}}>{new Date(b.reservation_date+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}</p>
                              <p style={{...sf(9,500),color:C.s6,margin:"2px 0"}}>↓</p>
                              <p style={{...sf(11,700),color:C.s2,margin:0}}>{new Date(b.end_date+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}</p>
                            </div>
                          ):(b.reservation_time&&b.reservation_time.slice(0,5)!=="00:00")?(
                            <>
                              <p style={{...sf(15,700),color:C.s1,margin:0,lineHeight:1.1}}>{b.reservation_time.slice(0,5)}</p>
                              {b.party_size>1&&<p style={{...sf(10,500),color:C.s5,margin:"3px 0 0"}}>{b.party_size} pax</p>}
                            </>
                          ):(
                            <p style={{...sf(13,600),color:C.s4,margin:0,lineHeight:1.1}}>—</p>
                          )}
                        </div>
                        {/* Category icon — col 2, rows 1-2 */}
                        <div title={meta.label} style={{gridRow:"1 / span 2",width:36,height:36,borderRadius:9,background:meta.color+"15",display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <Icon name={meta.icon} size={16} color={meta.color}/>
                        </div>
                        {/* Venue line — col 3, row 1 */}
                        <div style={{minWidth:0,overflow:"hidden"}}>
                          <p style={{...sf(14,600),color:C.s1,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.restaurant_name||"—"}</p>
                        </div>
                        {/* Revenue — col 4, row 1 */}
                        <div style={{textAlign:"right",whiteSpace:"nowrap"}}>
                          {b.commission_amount?(
                            <p style={{...sf(14,700),color:C.gd,margin:0,lineHeight:1.1}}>{money(b.commission_amount)}{b.gross_amount?<span style={{...sf(10,500),color:C.s5,marginLeft:6}}>/ {money(b.gross_amount)}</span>:null}</p>
                          ):b.gross_amount?(
                            <p style={{...sf(13,600),color:C.s3,margin:0,lineHeight:1.1}}>{money(b.gross_amount)}</p>
                          ):b.payment_amount?(
                            <p style={{...sf(12,500),color:C.s5,margin:0,lineHeight:1.1}}>{money(b.payment_amount)} dep.</p>
                          ):<p style={{...sf(11),color:C.s6,margin:0,lineHeight:1.1}}>—</p>}
                        </div>
                        {/* Guest line — col 3, row 2 */}
                        <div style={{minWidth:0,overflow:"hidden",display:"flex",alignItems:"center",gap:8}}>
                          <span style={{...sf(12),color:C.s3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:"0 1 auto",minWidth:0}}>
                            {userName.trim()||"Walk-in"}
                            {user.email&&<span style={{color:C.s5}}> · {user.email}</span>}
                            {b.city&&<span style={{color:C.s5}}> · {b.city}</span>}
                          </span>
                          {b.occasion&&<span style={{...sf(10,500),padding:"1px 7px",borderRadius:5,background:C.srf,border:"1px solid "+C.bd,color:C.s4,whiteSpace:"nowrap",flexShrink:0}}>{b.occasion}</span>}
                          {b.seating_preference&&<span style={{...sf(10,500),padding:"1px 7px",borderRadius:5,background:C.srf,border:"1px solid "+C.bd,color:C.s4,whiteSpace:"nowrap",flexShrink:0}}>{b.seating_preference}</span>}
                        </div>
                        {/* Status + delete — col 4, row 2 */}
                        <div style={{display:"flex",gap:4,alignItems:"center",justifyContent:"flex-end",whiteSpace:"nowrap"}}>
                          <select value={b.status||"pending"} onChange={function(e){e.stopPropagation();updateStatus(b.id,e.target.value);}} onClick={function(e){e.stopPropagation();}}
                            style={{background:sc+"15",border:"1px solid "+sc+"30",borderRadius:8,padding:"4px 8px",...sf(11,600),color:sc,outline:"none",appearance:"auto",cursor:"pointer",maxWidth:118}}>
                            {STATUSES.map(function(s){return <option key={s} value={s}>{s.replace("_"," ")}</option>;})}
                          </select>
                          <button title="Delete reservation" onClick={function(e){e.stopPropagation();setConfirmDelete(b);}}
                            style={{background:"transparent",border:"none",cursor:"pointer",padding:4,borderRadius:6,opacity:0.5,transition:"opacity 0.15s",display:"flex"}}
                            onMouseEnter={function(e){e.currentTarget.style.opacity="1";}}
                            onMouseLeave={function(e){e.currentTarget.style.opacity="0.5";}}>
                            <Icon name="del" size={14} color={C.rd}/>
                          </button>
                        </div>
                        {/* Notes — spans col 3-4, row 3 (only if present) */}
                        {b.notes&&(
                          <p style={{gridColumn:"3 / span 2",margin:"4px 0 0",...sf(11),color:C.gd,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Note: {b.notes}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedBooking&&<BookingDetailModal booking={selectedBooking} user={getUser(selectedBooking.user_id)} users={users} statusColors={statusColors} onClose={function(){setSelectedBooking(null);}} onUpdateStatus={updateStatus} onAddNote={addNote} onSave={saveBooking} onDelete={function(){setConfirmDelete(selectedBooking);}} onLoad={load}/>}
      {showAdd&&<BookingAddModal users={users} onClose={function(){setShowAdd(false);}} onSave={saveBooking}/>}
      {confirmDelete&&<DeleteBookingConfirm booking={confirmDelete} onCancel={function(){setConfirmDelete(null);}} onConfirm={function(){deleteBooking(confirmDelete.id);}}/>}
    </div>
  );
}

function RevCard({label,value,sub,color,hi}){
  return(
    <div style={{background:hi?"linear-gradient(135deg,"+C.el+","+(color||C.gd)+"08)":C.el,border:"1px solid "+(hi?(color||C.gd)+"40":C.bd),borderRadius:14,padding:"16px 18px"}}>
      <p style={{...sf(11,600),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",margin:"0 0 8px"}}>{label}</p>
      <p style={{...sf(24,700),color:hi?(color||C.gd):C.s1,margin:0,letterSpacing:-0.5}}>{value}</p>
      {sub&&<p style={{...sf(11),color:C.s5,margin:"4px 0 0"}}>{sub}</p>}
    </div>
  );
}

function DeleteBookingConfirm({booking,onCancel,onConfirm}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1100,padding:16,backdropFilter:"blur(8px)"}}
      onClick={function(e){if(e.target===e.currentTarget)onCancel();}}>
      <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:18,padding:"28px 32px",width:"100%",maxWidth:420}}>
        <div style={{width:48,height:48,borderRadius:12,background:C.rd+"15",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
          <Icon name="del" size={22} color={C.rd}/>
        </div>
        <h3 style={{...sf(18,600),color:C.s1,margin:"0 0 8px"}}>Delete reservation?</h3>
        <p style={{...sf(13),color:C.s4,margin:"0 0 20px",lineHeight:1.5}}>
          {booking.restaurant_name||"This booking"} · {booking.reservation_date||"—"}{booking.reservation_time?" at "+booking.reservation_time.slice(0,5):""}. This cannot be undone.
        </p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onCancel} style={btn("none",C.s3,{bd:C.bd})}>Cancel</button>
          <button onClick={onConfirm} style={btn(C.rd,"#FFF")}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function BookingDetailModal({booking,user,users,statusColors,onClose,onUpdateStatus,onAddNote,onSave,onDelete,onLoad}){
  var b=booking;
  var sc=statusColors[b.status||"pending"]||"#71717A";
  var [note,setNote]=useState(b.notes||"");
  var [editMode,setEditMode]=useState(false);
  var [form,setForm]=useState({...b,reservation_time:b.reservation_time?b.reservation_time.slice(0,5):""});
  function set(k,v){setForm(function(p){var n={};for(var key in p)n[key]=p[key];n[k]=v;return n;});}

  var bookingLinks={
    "Carbone":"https://www.exploretock.com/carbone",
    "Zuma":"https://www.sevenrooms.com/reservations/zumamia",
    "Komodo":"https://www.opentable.com/r/komodo-miami",
    "LIV":"https://www.taogroup.com/venues/liv/",
    "Nobu":"https://www.noburestaurants.com/miami/reservations",
    "Gekko":"https://www.exploretock.com/gekko",
    "Swan":"https://www.opentable.com/r/swan-miami",
    "Papi Steak":"https://www.opentable.com/r/papi-steak-miami-beach",
    "Prime 112":"https://www.mylesrestaurantgroup.com/prime-112",
    "Joia Beach":"https://www.opentable.com/r/joia-beach-miami",
    "Cecconis":"https://www.opentable.com/r/cecconis-miami-beach",
    "Casa Tua":"https://www.casatualife.com/miami-beach",
  };
  var venueLink=null;
  var venueName=b.restaurant_name||"";
  Object.keys(bookingLinks).forEach(function(key){
    if(venueName.toLowerCase().includes(key.toLowerCase()))venueLink=bookingLinks[key];
  });
  var [venueData,setVenueData]=useState(null);
  useEffect(function(){
    if(b.restaurant_id){
      supabase.from("restaurants").select("booking_platform,booking_venue_id,website_url,phone_number").eq("id",b.restaurant_id).single().then(function(res){
        if(res.data)setVenueData(res.data);
      });
    }
  },[b.restaurant_id]);

  var meta=svcMeta(b.service_type);
  var inputStyle={width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(14),color:C.s1,outline:"none"};
  var labelStyle={...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16,backdropFilter:"blur(6px)"}}
      onClick={function(e){if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:20,width:"100%",maxWidth:620,maxHeight:"90vh",overflow:"auto"}}>
        <div style={{padding:"24px",borderBottom:"1px solid "+C.bd,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
          <div style={{display:"flex",gap:12,alignItems:"center",minWidth:0,flex:1}}>
            <div style={{width:40,height:40,borderRadius:10,background:meta.color+"15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name={meta.icon} size={20} color={meta.color}/>
            </div>
            <div style={{minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{...sf(10,600),padding:"2px 8px",borderRadius:6,background:meta.color+"15",color:meta.color,textTransform:"uppercase",letterSpacing:0.6}}>{meta.label}</span>
              </div>
              <h2 style={{...sf(20,600),color:C.s1,margin:"0 0 4px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.restaurant_name||"—"}</h2>
              <p style={{...sf(13),color:C.s5,margin:0}}>{b.reservation_date||"—"}{b.end_date&&b.end_date!==b.reservation_date?" → "+b.end_date:""}{b.reservation_time&&b.reservation_time.slice(0,5)!=="00:00"?" at "+b.reservation_time.slice(0,5):""} · {b.city||"—"}</p>
            </div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.s5,cursor:"pointer",fontSize:22,padding:0,lineHeight:1}}>×</button>
        </div>

        <div style={{padding:"24px",display:"grid",gap:20}}>
          {editMode?(
            <div style={{display:"grid",gap:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{gridColumn:"1/-1"}}>
                  <label style={labelStyle}>Category</label>
                  <select value={form.service_type||"Dining"} onChange={function(e){set("service_type",e.target.value);}} style={{...inputStyle,appearance:"auto"}}>
                    {SERVICE_TYPES.map(function(t){return <option key={t.id} value={t.id}>{t.label}</option>;})}
                  </select>
                </div>
                <div style={{gridColumn:"1/-1"}}>
                  <label style={labelStyle}>Venue / item</label>
                  <input value={form.restaurant_name||""} onChange={function(e){set("restaurant_name",e.target.value);}} style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>Member (optional)</label>
                  <select value={form.user_id||""} onChange={function(e){set("user_id",e.target.value);}} style={{...inputStyle,appearance:"auto"}}>
                    <option value="">— Walk-in / off-app —</option>
                    {(users||[]).map(function(u){return <option key={u.id} value={u.id}>{(u.first_name||"")+" "+(u.last_name||"")+" ("+(u.email||"")+")"}</option>;})}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={form.status||"pending"} onChange={function(e){set("status",e.target.value);}} style={{...inputStyle,appearance:"auto"}}>
                    {STATUSES.map(function(s){return <option key={s} value={s}>{s.replace("_"," ")}</option>;})}
                  </select>
                </div>
                {!form.user_id&&(
                  <>
                    <div><label style={labelStyle}>Guest name</label><input value={form.guest_name||""} onChange={function(e){set("guest_name",e.target.value);}} placeholder="e.g. Dan Sebban" style={inputStyle}/></div>
                    <div><label style={labelStyle}>Guest email / phone</label><input value={form.guest_email||form.guest_phone||""} onChange={function(e){set("guest_email",e.target.value);}} placeholder="optional" style={inputStyle}/></div>
                  </>
                )}
                <div><label style={labelStyle}>Start date</label><input type="date" value={form.reservation_date||""} onChange={function(e){set("reservation_date",e.target.value);}} style={inputStyle}/></div>
                <div><label style={labelStyle}>End date (multi-day)</label><input type="date" value={form.end_date||""} onChange={function(e){set("end_date",e.target.value);}} style={inputStyle}/></div>
                <div><label style={labelStyle}>Time</label><input type="time" value={form.reservation_time||""} onChange={function(e){set("reservation_time",e.target.value);}} style={inputStyle}/></div>
                <div><label style={labelStyle}>Pax / party</label><input type="number" min="1" value={form.party_size||1} onChange={function(e){set("party_size",e.target.value);}} style={inputStyle}/></div>
                <div>
                  <label style={labelStyle}>City</label>
                  <select value={form.city||"Miami"} onChange={function(e){set("city",e.target.value);}} style={{...inputStyle,appearance:"auto"}}>
                    <option>Miami</option><option>Paris</option><option>Dubai</option><option>London</option><option>New York</option><option>Monaco</option><option>Other</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Gross amount (customer pays)</label><input type="number" step="0.01" min="0" value={form.gross_amount==null?"":form.gross_amount} onChange={function(e){set("gross_amount",e.target.value);}} placeholder="892.00" style={inputStyle}/></div>
                <div><label style={labelStyle}>Commission (our revenue)</label><input type="number" step="0.01" min="0" value={form.commission_amount==null?"":form.commission_amount} onChange={function(e){set("commission_amount",e.target.value);}} placeholder="250.00" style={inputStyle}/></div>
                <div><label style={labelStyle}>Stripe deposit</label><input type="number" step="0.01" min="0" value={form.payment_amount==null?"":form.payment_amount} onChange={function(e){set("payment_amount",e.target.value);}} style={inputStyle}/></div>
                <div>
                  <label style={labelStyle}>Payment status</label>
                  <select value={form.payment_status||""} onChange={function(e){set("payment_status",e.target.value);}} style={{...inputStyle,appearance:"auto"}}>
                    <option value="">—</option><option value="pending">pending</option><option value="paid">paid</option><option value="refunded">refunded</option><option value="failed">failed</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Occasion</label><input value={form.occasion||""} onChange={function(e){set("occasion",e.target.value);}} style={inputStyle}/></div>
                <div><label style={labelStyle}>Seating / setup</label><input value={form.seating_preference||""} onChange={function(e){set("seating_preference",e.target.value);}} style={inputStyle}/></div>
                <div style={{gridColumn:"1/-1"}}><label style={labelStyle}>Notes</label><textarea rows={3} value={form.notes||""} onChange={function(e){set("notes",e.target.value);}} style={{...inputStyle,resize:"vertical"}}/></div>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
                <button onClick={onDelete} style={btn("transparent",C.rd,{bd:C.rd+"40"})}>
                  <Icon name="del" size={13} color={C.rd}/> Delete reservation
                </button>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={function(){setEditMode(false);setForm({...b,reservation_time:b.reservation_time?b.reservation_time.slice(0,5):""});}} style={btn("none",C.s3,{bd:C.bd})}>Cancel</button>
                  <button onClick={function(){onSave({...form,reservation_time:form.reservation_time||null});}} style={{...btn(C.gd,"#000"),fontWeight:700}}>Save changes</button>
                </div>
              </div>
            </div>
          ):(
            <div style={{display:"grid",gap:20}}>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button onClick={function(){setEditMode(true);}} style={btn(C.gd+"15",C.gd,{bd:C.gd+"30"})}>
                  <Icon name="edit" size={13} color={C.gd}/> Edit reservation
                </button>
                {venueLink&&<a href={venueLink} target="_blank" rel="noopener noreferrer" style={{padding:"8px 16px",borderRadius:10,background:C.srf,border:"1px solid "+C.bd,...sf(12,500),color:C.s3,textDecoration:"none"}}>Book on Platform</a>}
                {venueData&&venueData.website_url&&<a href={venueData.website_url} target="_blank" rel="noopener noreferrer" style={{padding:"8px 16px",borderRadius:10,background:C.srf,border:"1px solid "+C.bd,...sf(12,500),color:C.s3,textDecoration:"none"}}>Website</a>}
                {venueData&&venueData.phone_number&&<a href={"tel:"+venueData.phone_number} style={{padding:"8px 16px",borderRadius:10,background:C.srf,border:"1px solid "+C.bd,...sf(12,500),color:C.s3,textDecoration:"none"}}>Call {venueData.phone_number}</a>}
                {!venueLink&&!venueData&&<a href={"https://www.google.com/search?q="+encodeURIComponent((b.restaurant_name||"")+" "+(b.city||"")+" reservations")} target="_blank" rel="noopener noreferrer" style={{padding:"8px 16px",borderRadius:10,background:C.srf,border:"1px solid "+C.bd,...sf(12,500),color:C.s3,textDecoration:"none"}}>Search Booking</a>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{...sf(12,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",width:80}}>Status</span>
                <select value={b.status||"pending"} onChange={function(e){onUpdateStatus(b.id,e.target.value);}}
                  style={{background:sc+"15",border:"1px solid "+sc+"30",borderRadius:10,padding:"8px 14px",...sf(14,600),color:sc,outline:"none",appearance:"auto",flex:1}}>
                  {STATUSES.map(function(s){return <option key={s} value={s}>{s.replace("_"," ")}</option>;})}
                </select>
              </div>
              <div style={{background:C.srf,borderRadius:14,padding:"16px 20px",border:"1px solid "+C.bd}}>
                <p style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Revenue</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                  <div><span style={{...sf(10),color:C.s5}}>Gross</span><p style={{...sf(18,700),color:C.s1,margin:"4px 0 0"}}>{b.gross_amount?money(b.gross_amount):"—"}</p></div>
                  <div><span style={{...sf(10),color:C.s5}}>Commission</span><p style={{...sf(18,700),color:C.gd,margin:"4px 0 0"}}>{b.commission_amount?money(b.commission_amount):"—"}</p></div>
                  <div><span style={{...sf(10),color:C.s5}}>Stripe deposit</span><p style={{...sf(14,600),color:C.s3,margin:"4px 0 0"}}>{b.payment_amount?money(b.payment_amount):"—"}{b.payment_status?" · "+b.payment_status:""}</p></div>
                </div>
              </div>
              <div style={{background:C.srf,borderRadius:14,padding:"16px 20px",border:"1px solid "+C.bd}}>
                <p style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Guest Information</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><span style={{...sf(10),color:C.s5}}>Name</span><p style={{...sf(14,600),color:C.s1,margin:"2px 0 0"}}>{((user.first_name||"")+" "+(user.last_name||"")).trim()||b.guest_name||"—"}</p></div>
                  <div><span style={{...sf(10),color:C.s5}}>Email</span><p style={{...sf(13),color:C.s3,margin:"2px 0 0"}}>{user.email||b.guest_email||"—"}</p></div>
                  <div><span style={{...sf(10),color:C.s5}}>Instagram</span><p style={{...sf(13),color:C.s3,margin:"2px 0 0"}}>{user.instagram_handle?"@"+user.instagram_handle:b.guest_instagram?"@"+b.guest_instagram:"—"}</p></div>
                  <div><span style={{...sf(10),color:C.s5}}>Phone</span><p style={{...sf(13),color:C.s3,margin:"2px 0 0"}}>{user.phone_number||b.guest_phone||"—"}</p></div>
                  <div><span style={{...sf(10),color:C.s5}}>City</span><p style={{...sf(13),color:C.s3,margin:"2px 0 0"}}>{user.preferred_city||b.city||"—"}</p></div>
                  {b.user_id&&<div><span style={{...sf(10),color:C.s5}}>User ID</span><p style={{...sf(10),color:C.s6,margin:"2px 0 0",fontFamily:"monospace",wordBreak:"break-all"}}>{b.user_id}</p></div>}
                </div>
                {!user.id&&b.user_id&&<p style={{...sf(11),color:C.or,marginTop:8,marginBottom:0}}>⚠ No user profile found — user may not have completed onboarding yet.</p>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><span style={{...sf(10),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Party Size</span><p style={{...sf(18,700),color:C.s1,margin:"4px 0 0"}}>{b.party_size} guest{b.party_size!==1?"s":""}</p></div>
                <div><span style={{...sf(10),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Time</span><p style={{...sf(18,700),color:C.s1,margin:"4px 0 0"}}>{b.reservation_time?b.reservation_time.slice(0,5):"—"}</p></div>
                {b.occasion&&<div><span style={{...sf(10),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Occasion</span><p style={{...sf(14),color:C.s3,margin:"4px 0 0"}}>{b.occasion}</p></div>}
                {b.seating_preference&&<div><span style={{...sf(10),color:C.s5,textTransform:"uppercase",letterSpacing:1}}>Seating</span><p style={{...sf(14),color:C.s3,margin:"4px 0 0"}}>{b.seating_preference}</p></div>}
              </div>
              <div>
                <span style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>Concierge Notes</span>
                <div style={{display:"flex",gap:8}}>
                  <textarea value={note} onChange={function(e){setNote(e.target.value);}} rows={2} placeholder="Add a note about this reservation..."
                    style={{flex:1,background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(13),color:C.s1,outline:"none",resize:"vertical"}}/>
                  <button onClick={function(){onAddNote(b.id,note);}} style={{padding:"8px 14px",background:C.srf,border:"1px solid "+C.bd,borderRadius:8,...sf(12,500),color:C.s3,cursor:"pointer",alignSelf:"flex-end"}}>Save</button>
                </div>
              </div>
              <div style={{borderTop:"1px solid "+C.bd,paddingTop:12,display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:12,flexWrap:"wrap"}}>
                <div>
                  <p style={{...sf(11),color:C.s6,margin:0}}>Created: {b.created_at?new Date(b.created_at).toLocaleString():"-"}</p>
                  <p style={{...sf(11),color:C.s6,margin:"2px 0 0"}}>Updated: {b.updated_at?new Date(b.updated_at).toLocaleString():"-"}</p>
                  <p style={{...sf(10),color:C.s6,margin:"2px 0 0"}}>ID: {b.id}</p>
                </div>
                <button onClick={onDelete} style={btn("transparent",C.rd,{bd:C.rd+"40",sm:true})}>
                  <Icon name="del" size={12} color={C.rd}/> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingAddModal({users,onClose,onSave}){
  var [form,setForm]=useState({
    restaurant_name:"",
    service_type:"Dining",
    party_size:1,
    reservation_date:new Date().toISOString().slice(0,10),
    end_date:"",
    reservation_time:"",
    status:"confirmed",
    city:"Miami",
    occasion:"",
    seating_preference:"",
    notes:"",
    user_id:"",
    guest_name:"",
    guest_email:"",
    guest_phone:"",
    gross_amount:"",
    commission_amount:""
  });
  function set(k,v){setForm(function(p){var n={};for(var key in p)n[key]=p[key];n[k]=v;return n;});}
  var inputStyle={width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(14),color:C.s1,outline:"none"};
  var labelStyle={...sf(11,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",display:"block",marginBottom:6};
  var venueLabel=form.service_type==="Cars"?"Vehicle":form.service_type==="Yachts"?"Yacht / Trip":form.service_type==="Jets"?"Jet":form.service_type==="Accommodations"?"Hotel":form.service_type==="Wellness"?"Spa / Wellness venue":form.service_type==="Nightlife"?"Club / Bar":"Restaurant";
  var isMultiDay=form.service_type==="Cars"||form.service_type==="Yachts"||form.service_type==="Jets"||form.service_type==="Accommodations";
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16,backdropFilter:"blur(6px)"}} onClick={function(e){if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:20,width:"100%",maxWidth:640,maxHeight:"90vh",overflow:"auto"}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid "+C.bd,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 style={{...sf(18,600),color:C.s1,margin:0}}>New Reservation</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.s5,cursor:"pointer",fontSize:20}}>×</button>
        </div>
        <div style={{padding:"20px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div style={{gridColumn:"1/-1"}}>
            <label style={labelStyle}>Category</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {SERVICE_TYPES.map(function(t){
                var active=form.service_type===t.id;
                return <button key={t.id} type="button" onClick={function(){set("service_type",t.id);}}
                  style={{padding:"8px 12px",border:"1px solid "+(active?t.color+"60":C.bd),background:active?t.color+"15":C.srf,borderRadius:10,...sf(12,active?600:500),color:active?t.color:C.s3,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  <Icon name={t.icon} size={12} color={active?t.color:C.s5}/>{t.label}
                </button>;
              })}
            </div>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <label style={labelStyle}>Member (optional — leave blank for walk-in / off-app)</label>
            <select value={form.user_id} onChange={function(e){set("user_id",e.target.value);}} style={{...inputStyle,appearance:"auto"}}>
              <option value="">— Walk-in / off-app —</option>
              {users.map(function(u){return <option key={u.id} value={u.id}>{(u.first_name||"")+" "+(u.last_name||"")+" ("+(u.email||"")+")"}</option>;})}
            </select>
          </div>
          {!form.user_id&&(
            <>
              <div><label style={labelStyle}>Guest name</label><input value={form.guest_name} onChange={function(e){set("guest_name",e.target.value);}} placeholder="e.g. Dan Sebban" style={inputStyle}/></div>
              <div><label style={labelStyle}>Guest email / phone (optional)</label><input value={form.guest_email} onChange={function(e){set("guest_email",e.target.value);}} placeholder="email or phone" style={inputStyle}/></div>
            </>
          )}
          <div style={{gridColumn:"1/-1"}}>
            <label style={labelStyle}>{venueLabel}</label>
            <input value={form.restaurant_name} onChange={function(e){set("restaurant_name",e.target.value);}} placeholder="e.g. Carbone Miami / Porsche Macan / 1 Hotel South Beach" style={inputStyle}/>
          </div>
          <div><label style={labelStyle}>{isMultiDay?"Start date":"Date"}</label><input type="date" value={form.reservation_date} onChange={function(e){set("reservation_date",e.target.value);}} style={inputStyle}/></div>
          <div>
            <label style={labelStyle}>{isMultiDay?"End date (multi-day)":"Time"}</label>
            {isMultiDay?
              <input type="date" value={form.end_date} onChange={function(e){set("end_date",e.target.value);}} style={inputStyle}/>
              :<input type="time" value={form.reservation_time} onChange={function(e){set("reservation_time",e.target.value);}} style={inputStyle}/>
            }
          </div>
          <div><label style={labelStyle}>Pax / party</label><input type="number" min="1" value={form.party_size} onChange={function(e){set("party_size",Number(e.target.value));}} style={inputStyle}/></div>
          <div>
            <label style={labelStyle}>City</label>
            <select value={form.city} onChange={function(e){set("city",e.target.value);}} style={{...inputStyle,appearance:"auto"}}>
              <option>Miami</option><option>Paris</option><option>Dubai</option><option>London</option><option>New York</option><option>Monaco</option><option>Bahamas</option><option>Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={function(e){set("status",e.target.value);}} style={{...inputStyle,appearance:"auto"}}>
              {STATUSES.map(function(s){return <option key={s} value={s}>{s.replace("_"," ")}</option>;})}
            </select>
          </div>
          <div></div>
          <div><label style={labelStyle}>Gross amount</label><input type="number" step="0.01" min="0" value={form.gross_amount} onChange={function(e){set("gross_amount",e.target.value);}} placeholder="What customer pays · e.g. 1710" style={inputStyle}/></div>
          <div><label style={labelStyle}>Commission (our cut)</label><input type="number" step="0.01" min="0" value={form.commission_amount} onChange={function(e){set("commission_amount",e.target.value);}} placeholder="e.g. 220" style={inputStyle}/></div>
          <div><label style={labelStyle}>Occasion</label><input value={form.occasion} onChange={function(e){set("occasion",e.target.value);}} placeholder="Birthday, Date night..." style={inputStyle}/></div>
          <div><label style={labelStyle}>Seating / setup</label><input value={form.seating_preference} onChange={function(e){set("seating_preference",e.target.value);}} placeholder="Outdoor, Private room..." style={inputStyle}/></div>
          <div style={{gridColumn:"1/-1"}}><label style={labelStyle}>Notes</label><textarea value={form.notes} onChange={function(e){set("notes",e.target.value);}} rows={2} placeholder="Special requests, referrer, daily rate..." style={{...inputStyle,resize:"vertical"}}/></div>
        </div>
        <div style={{padding:"16px 24px",borderTop:"1px solid "+C.bd,display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onClose} style={btn("none",C.s3,{bd:C.bd})}>Cancel</button>
          <button onClick={function(){
            if(!form.restaurant_name){alert("Please enter a venue / item name");return;}
            if(!form.user_id&&!form.guest_name){alert("Pick a member, or enter a guest name for this walk-in.");return;}
            var payload={...form};
            if(!payload.reservation_time)payload.reservation_time="00:00";
            if(!payload.end_date)delete payload.end_date;
            onSave(payload);
          }} style={{...btn(C.gd,"#000"),fontWeight:700}}>Create Reservation</button>
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
  // Filter chips: tier (free/gold/plat/cent) and reachability
  // ("missing WhatsApp" — directly tied to the May 2026 incident where
  // Alfred couldn't tell a user a restaurant was closed).
  var [tierFilter,setTierFilter]=useState("");
  var [reachableFilter,setReachableFilter]=useState("");

  async function load(){
    setLoading(true);
    var {data}=await supabase.from("users").select("*").order("created_at",{ascending:false});
    setUsers(data||[]);
    setLoading(false);
  }
  useEffect(function(){load();},[]);

  function tierLabel(t){
    if(!t)return "Free";
    switch(t){case "gold":return "Gold";case "plat":case "platinum":return "Platinum";case "cent":case "centurion":return "Centurion";case "free":return "Free";default:return t;}
  }
  function tierColor(t){
    switch(t){case "gold":return C.gd;case "plat":case "platinum":return C.s2;case "cent":case "centurion":return C.s1;default:return C.s5;}
  }
  function hasWhatsApp(u){
    return !!(u.whatsapp_number&&String(u.whatsapp_number).trim().length>=5);
  }

  var filtered=users.filter(function(u){
    if(search){
      var s=search.toLowerCase();
      var match=(u.first_name||"").toLowerCase().includes(s)||(u.last_name||"").toLowerCase().includes(s)||(u.email||"").toLowerCase().includes(s)||(u.preferred_city||"").toLowerCase().includes(s);
      if(!match)return false;
    }
    if(tierFilter){
      var t=(u.tier||"free").toLowerCase();
      if(tierFilter==="free"&&t!=="free")return false;
      if(tierFilter==="paid"&&t==="free")return false;
      if(tierFilter==="gold"&&t!=="gold")return false;
      if(tierFilter==="plat"&&!(t==="plat"||t==="platinum"))return false;
      if(tierFilter==="cent"&&!(t==="cent"||t==="centurion"))return false;
    }
    if(reachableFilter==="missing_whatsapp"&&hasWhatsApp(u))return false;
    if(reachableFilter==="has_whatsapp"&&!hasWhatsApp(u))return false;
    return true;
  });

  // Headline counts so ops see at a glance how many members are
  // unreachable. Drives the "missing WhatsApp" chip's badge count.
  var missingWA=users.filter(function(u){return !hasWhatsApp(u);}).length;

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:24}}>
        <h2 style={{...sf(24,600),color:C.s1,margin:0}}>Members ({users.length})</h2>
        {missingWA>0&&(
          <span style={{...sf(11,600),padding:"5px 12px",borderRadius:20,background:"rgba(255,149,0,0.12)",color:C.or,letterSpacing:0.4}}>
            ⚠ {missingWA} unreachable (no WhatsApp)
          </span>
        )}
      </div>

      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20,alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 200px",maxWidth:320}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><Icon name="search" size={16} color={C.s5}/></div>
          <input placeholder="Search members..." value={search} onChange={function(e){setSearch(e.target.value);}}
            style={{width:"100%",boxSizing:"border-box",background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px 10px 36px",...sf(14),color:C.s1,outline:"none"}}/>
        </div>
        <select value={tierFilter} onChange={function(e){setTierFilter(e.target.value);}}
          style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(13),color:C.s3,outline:"none",appearance:"auto"}}>
          <option value="">All Tiers</option>
          <option value="free">Free</option>
          <option value="paid">All paid</option>
          <option value="gold">Gold</option>
          <option value="plat">Platinum</option>
          <option value="cent">Centurion</option>
        </select>
        <select value={reachableFilter} onChange={function(e){setReachableFilter(e.target.value);}}
          style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:10,padding:"10px 14px",...sf(13),color:C.s3,outline:"none",appearance:"auto"}}>
          <option value="">All</option>
          <option value="has_whatsapp">Has WhatsApp</option>
          <option value="missing_whatsapp">Missing WhatsApp</option>
        </select>
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
                  {["Name","Tier","WhatsApp","Email","City","Instagram","Joined"].map(function(h){
                    return <th key={h} style={{...sf(11,600),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",padding:"12px 14px",textAlign:"left"}}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {filtered.map(function(u){
                  var tier=u.tier||"free";
                  var wa=hasWhatsApp(u);
                  var waDisplay=wa?((u.whatsapp_country_code?u.whatsapp_country_code+" ":"")+(u.whatsapp_number||"")):"";
                  return(
                    <tr key={u.id} style={{borderBottom:"1px solid "+C.bd}}
                      onMouseEnter={function(e){e.currentTarget.style.background=C.srf;}}
                      onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
                      <td style={{...sf(13,500),color:C.s1,padding:"12px 14px"}}>{(u.first_name||"")+" "+(u.last_name||"")}</td>
                      <td style={{padding:"12px 14px"}}>
                        <span style={{...sf(11,600),padding:"3px 10px",borderRadius:20,background:tier==="free"?C.bd+"40":tierColor(tier)+"22",color:tierColor(tier),letterSpacing:0.4}}>
                          {tierLabel(tier)}
                        </span>
                      </td>
                      <td style={{padding:"12px 14px"}}>
                        {wa
                          ? <span style={{...sf(12),color:C.s3,fontFamily:"monospace"}}>{waDisplay}</span>
                          : <span style={{...sf(11,600),padding:"3px 10px",borderRadius:20,background:"rgba(255,149,0,0.12)",color:C.or,letterSpacing:0.4}}>Missing</span>}
                      </td>
                      <td style={{...sf(13),color:C.s4,padding:"12px 14px"}}>{u.email||"-"}</td>
                      <td style={{...sf(13),color:C.s4,padding:"12px 14px"}}>{u.preferred_city||"-"}</td>
                      <td style={{...sf(13),color:C.s4,padding:"12px 14px"}}>{u.instagram_handle?"@"+u.instagram_handle:"-"}</td>
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

/* ═══ Finance & Revenue ═══ */
function FinanceView(){
  var [bookings,setBookings]=useState([]);
  var [users,setUsers]=useState([]);
  var [loading,setLoading]=useState(true);
  var [period,setPeriod]=useState("all");

  useEffect(function(){
    async function load(){
      setLoading(true);
      var {data:b}=await supabase.from("bookings").select("*").order("created_at",{ascending:false});
      var {data:u}=await supabase.from("users").select("*").order("created_at",{ascending:false});
      setBookings(b||[]);setUsers(u||[]);setLoading(false);
    }
    load();
  },[]);

  // Filter by period
  var now=new Date();
  var filteredBookings=bookings.filter(function(b){
    if(period==="all")return true;
    var d=new Date(b.created_at);
    if(period==="today")return d.toDateString()===now.toDateString();
    if(period==="week"){var w=new Date(now);w.setDate(w.getDate()-7);return d>=w;}
    if(period==="month"){var m=new Date(now);m.setMonth(m.getMonth()-1);return d>=m;}
    if(period==="year"){var y=new Date(now);y.setFullYear(y.getFullYear()-1);return d>=y;}
    return true;
  });

  // Calculations
  var totalRevenue=filteredBookings.reduce(function(s,b){return s+(Number(b.payment_amount)||0);},0);
  var totalBookings=filteredBookings.length;
  var confirmedBookings=filteredBookings.filter(function(b){return b.status==="confirmed"||b.status==="completed";}).length;
  var cancelledBookings=filteredBookings.filter(function(b){return b.status==="cancelled";}).length;
  var pendingBookings=filteredBookings.filter(function(b){return b.status==="pending"||b.status==="requested";}).length;
  var avgPartySize=totalBookings?Math.round(filteredBookings.reduce(function(s,b){return s+(b.party_size||0);},0)/totalBookings*10)/10:0;
  var totalGuests=filteredBookings.reduce(function(s,b){return s+(b.party_size||0);},0);
  var conversionRate=totalBookings?Math.round(confirmedBookings/totalBookings*100):0;

  // Revenue by city
  var revenueByCity={};
  filteredBookings.forEach(function(b){
    var city=b.city||"Unknown";
    revenueByCity[city]=(revenueByCity[city]||0)+(Number(b.payment_amount)||0);
  });

  // Bookings by city
  var bookingsByCity={};
  filteredBookings.forEach(function(b){
    var city=b.city||"Unknown";
    bookingsByCity[city]=(bookingsByCity[city]||0)+1;
  });

  // Top venues by bookings
  var venueCount={};
  filteredBookings.forEach(function(b){
    var v=b.restaurant_name||"Unknown";
    venueCount[v]=(venueCount[v]||0)+1;
  });
  var topVenues=Object.entries(venueCount).sort(function(a,b){return b[1]-a[1];}).slice(0,10);

  // Monthly revenue breakdown
  var monthlyRevenue={};
  var monthlyBookings={};
  bookings.forEach(function(b){
    var d=new Date(b.created_at);
    var key=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
    monthlyRevenue[key]=(monthlyRevenue[key]||0)+(Number(b.payment_amount)||0);
    monthlyBookings[key]=(monthlyBookings[key]||0)+1;
  });
  var months=Object.keys(monthlyRevenue).sort().reverse().slice(0,12);

  // User growth
  var usersByMonth={};
  users.forEach(function(u){
    var d=new Date(u.created_at);
    var key=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
    usersByMonth[key]=(usersByMonth[key]||0)+1;
  });

  // Membership tiers (estimated from free_until field)
  var freeUsers=users.filter(function(u){return !u.free_until||new Date(u.free_until)>now;}).length;
  var paidUsers=users.length-freeUsers;

  // Estimated MRR (Monthly Recurring Revenue)
  var estimatedMRR=paidUsers*29.99; // Assuming Gold tier

  if(loading)return <div style={{padding:"60px",textAlign:"center",color:C.s5}}>Loading financial data...</div>;

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <h2 style={{...sf(24,600),color:C.s1,margin:0}}>Finance & Revenue</h2>
        <div style={{display:"flex",gap:6}}>
          {[{k:"all",l:"All Time"},{k:"year",l:"Year"},{k:"month",l:"Month"},{k:"week",l:"Week"},{k:"today",l:"Today"}].map(function(p){
            var active=period===p.k;
            return <button key={p.k} onClick={function(){setPeriod(p.k);}}
              style={{padding:"7px 14px",borderRadius:10,border:"1px solid "+(active?C.gd:C.bd),background:active?C.gd+"15":"none",...sf(12,active?600:400),color:active?C.gd:C.s5,cursor:"pointer"}}>{p.l}</button>;
          })}
        </div>
      </div>

      {/* Revenue Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:14,marginBottom:24}}>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 22px"}}>
          <p style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Total Revenue</p>
          <p style={{...sf(28,700),color:C.gd,margin:0}}>${totalRevenue.toLocaleString("en-US",{minimumFractionDigits:2})}</p>
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 22px"}}>
          <p style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Est. MRR</p>
          <p style={{...sf(28,700),color:C.gn,margin:0}}>${estimatedMRR.toFixed(2)}</p>
          <p style={{...sf(10),color:C.s5,margin:"4px 0 0"}}>{paidUsers} paid · {freeUsers} free</p>
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 22px"}}>
          <p style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Total Bookings</p>
          <p style={{...sf(28,700),color:C.s1,margin:0}}>{totalBookings}</p>
          <p style={{...sf(10),color:C.s5,margin:"4px 0 0"}}>{totalGuests} total guests</p>
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 22px"}}>
          <p style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Conversion Rate</p>
          <p style={{...sf(28,700),color:conversionRate>=50?C.gn:C.or,margin:0}}>{conversionRate}%</p>
          <p style={{...sf(10),color:C.s5,margin:"4px 0 0"}}>{confirmedBookings} confirmed / {totalBookings}</p>
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 22px"}}>
          <p style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Avg Party Size</p>
          <p style={{...sf(28,700),color:C.bl,margin:0}}>{avgPartySize}</p>
        </div>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 22px"}}>
          <p style={{...sf(11,600),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Total Members</p>
          <p style={{...sf(28,700),color:C.s1,margin:0}}>{users.length}</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        {/* Monthly Breakdown */}
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 24px"}}>
          <h3 style={{...sf(15,600),color:C.s2,marginBottom:16}}>Monthly Breakdown</h3>
          {months.length===0?<p style={{...sf(13),color:C.s5}}>No data yet</p>:
          months.map(function(m){
            var rev=monthlyRevenue[m]||0;
            var bk=monthlyBookings[m]||0;
            var newUsers=usersByMonth[m]||0;
            return(
              <div key={m} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid "+C.bd}}>
                <span style={{...sf(13,500),color:C.s2,minWidth:80}}>{m}</span>
                <span style={{...sf(12),color:C.s4}}>{bk} bookings</span>
                <span style={{...sf(12),color:C.gn}}>+{newUsers} users</span>
                <span style={{...sf(13,600),color:C.gd}}>${rev.toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        {/* Top Venues */}
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 24px"}}>
          <h3 style={{...sf(15,600),color:C.s2,marginBottom:16}}>Top Venues by Bookings</h3>
          {topVenues.length===0?<p style={{...sf(13),color:C.s5}}>No data yet</p>:
          topVenues.map(function(v,i){
            var maxCount=topVenues[0][1];
            return(
              <div key={v[0]} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{...sf(13,500),color:C.s2}}>{i+1}. {v[0]}</span>
                  <span style={{...sf(12,600),color:C.gd}}>{v[1]}</span>
                </div>
                <div style={{height:6,background:C.srf,borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:(v[1]/maxCount*100)+"%",background:C.gd,borderRadius:3}}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bookings by City + Status Breakdown */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 24px"}}>
          <h3 style={{...sf(15,600),color:C.s2,marginBottom:16}}>Bookings by City</h3>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            {Object.entries(bookingsByCity).sort(function(a,b){return b[1]-a[1];}).map(function(e){
              return <div key={e[0]} style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:12,padding:"12px 18px",textAlign:"center",flex:"1 1 100px"}}>
                <p style={{...sf(22,700),color:C.s1,margin:0}}>{e[1]}</p>
                <p style={{...sf(11),color:C.s5,margin:"4px 0 0"}}>{e[0]}</p>
                {revenueByCity[e[0]]>0&&<p style={{...sf(11,600),color:C.gd,margin:"2px 0 0"}}>${revenueByCity[e[0]].toFixed(0)}</p>}
              </div>;
            })}
          </div>
        </div>

        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 24px"}}>
          <h3 style={{...sf(15,600),color:C.s2,marginBottom:16}}>Status Breakdown</h3>
          <div style={{display:"grid",gap:10}}>
            {[["Confirmed",confirmedBookings,C.gn],["Pending",pendingBookings,C.or],["Cancelled",cancelledBookings,C.rd]].map(function(s){
              var pct=totalBookings?Math.round(s[1]/totalBookings*100):0;
              return(
                <div key={s[0]}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{...sf(13,500),color:C.s2}}>{s[0]}</span>
                    <span style={{...sf(12,600),color:s[2]}}>{s[1]} ({pct}%)</span>
                  </div>
                  <div style={{height:8,background:C.srf,borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:pct+"%",background:s[2],borderRadius:4,transition:"width 0.5s"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"20px 24px"}}>
        <h3 style={{...sf(15,600),color:C.s2,marginBottom:16}}>Recent Transactions</h3>
        {filteredBookings.filter(function(b){return b.payment_amount;}).length===0?(
          <p style={{...sf(13),color:C.s5}}>No paid transactions yet. Revenue will appear here when bookings include payment amounts.</p>
        ):(
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:"1px solid "+C.bd}}>
                  {["Date","Venue","Guest","City","Amount","Status"].map(function(h){
                    return <th key={h} style={{...sf(11,600),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",padding:"10px 14px",textAlign:"left"}}>{h}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.filter(function(b){return b.payment_amount;}).slice(0,20).map(function(b){
                  var user=users.find(function(u){return u.id===b.user_id;})||{};
                  var sc=statusColors[b.status]||C.s5;
                  return(
                    <tr key={b.id} style={{borderBottom:"1px solid "+C.bd}}>
                      <td style={{...sf(12),color:C.s4,padding:"10px 14px"}}>{b.reservation_date}</td>
                      <td style={{...sf(12,500),color:C.s1,padding:"10px 14px"}}>{b.restaurant_name}</td>
                      <td style={{...sf(12),color:C.s3,padding:"10px 14px"}}>{(user.first_name||"")+" "+(user.last_name||"")}</td>
                      <td style={{...sf(12),color:C.s4,padding:"10px 14px"}}>{b.city||"-"}</td>
                      <td style={{...sf(13,600),color:C.gd,padding:"10px 14px"}}>${Number(b.payment_amount).toFixed(2)}</td>
                      <td style={{padding:"10px 14px"}}><span style={{...sf(10,600),padding:"3px 8px",borderRadius:20,background:sc+"15",color:sc}}>{b.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Sidebar({active,onNav,onLogout,collapsed,onToggle,
  globalCity,onCityClick,cityCounts}){
  // Operations — daily workflow items at the top of the sidebar.
  var opsItems=[
    {id:"dashboard",label:"Dashboard",icon:"dashboard"},
    {id:"bookings",label:"Bookings",icon:"bookings"},
    {id:"clients",label:"Members",icon:"clients"},
    {id:"finance",label:"Finance",icon:"star"},
  ];
  // Content & lifecycle tools — used less often, parked at the bottom.
  var bottomItems=[
    {id:"images",label:"Images",icon:"images"},
    {id:"featured",label:"Featured",icon:"star"},
    {id:"blog",label:"Blog",icon:"edit"},
    {id:"notifications",label:"Notifications",icon:"star"},
  ];
  var cityKeys=PRIMARY_CITIES.concat(["__other__"]);

  function SectionLabel({text}){
    if(collapsed)return <div style={{height:1,background:C.bd,margin:"10px 12px 6px"}}/>;
    return <div style={{...sf(10,700),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",padding:"14px 16px 6px"}}>{text}</div>;
  }

  function Row({label,icon,count,isActive,onClick,muted}){
    return(
      <button onClick={onClick}
        style={{
          width:"100%",display:"flex",alignItems:"center",gap:10,
          padding:collapsed?"10px":"9px 14px",
          background:isActive?"rgba(212,168,83,0.10)":"none",
          border:"none",borderRadius:10,cursor:"pointer",
          transition:"all 0.12s",marginBottom:1,
          justifyContent:collapsed?"center":"space-between"
        }}
        onMouseEnter={function(e){if(!isActive)e.currentTarget.style.background=C.srf;}}
        onMouseLeave={function(e){e.currentTarget.style.background=isActive?"rgba(212,168,83,0.10)":"none";}}>
        <span style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
          {icon&&<Icon name={icon} size={18} color={isActive?C.gd:(muted?C.s6:C.s5)}/>}
          {!collapsed&&<span style={{...sf(13,isActive?600:400),color:isActive?C.s1:(muted?C.s5:C.s4),whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{label}</span>}
        </span>
        {!collapsed&&typeof count==="number"&&<span style={{...sf(11,500),color:isActive?C.gd:C.s6,paddingLeft:6}}>{count}</span>}
      </button>
    );
  }

  return(
    <div style={{
      width:collapsed?64:248,minHeight:"100vh",background:C.bg2,
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
        {/* Operations — daily workflow, kept at the top so it's always
            one click away. */}
        <SectionLabel text="Operations"/>
        {opsItems.map(function(item){
          return <Row key={item.id} label={item.label} icon={item.icon}
            isActive={active===item.id} onClick={function(){onNav(item.id);}}/>;
        })}

        {/* Cities — pick a city, the main pane shows the City Overview
            with every venue category as a card. No tree expansion: the
            categories live in the right pane, not the sidebar. */}
        <SectionLabel text="Cities"/>
        <Row label="All cities" icon="globe"
          count={(cityCounts.__all__||{}).__all__}
          isActive={!globalCity&&active==="city_overview"}
          onClick={function(){onCityClick("");}}/>
        {cityKeys.map(function(key){
          var label=key==="__other__"?"Other cities":key;
          var bucket=cityCounts[key]||{};
          var isActive=globalCity===key;
          return <Row key={"city_"+key} label={label} icon="pin"
            count={bucket.__all__||0}
            isActive={isActive}
            muted={key==="__other__"}
            onClick={function(){onCityClick(key);}}/>;
        })}

        {/* Content tools — Images, Featured, Blog, Notifications. Used
            less often than the city/booking workflows, so they live at
            the bottom of the scrollable area, above Sign Out. */}
        <SectionLabel text="Content"/>
        {bottomItems.map(function(item){
          return <Row key={item.id} label={item.label} icon={item.icon}
            isActive={active===item.id} onClick={function(){onNav(item.id);}}/>;
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
function DrawerSection({text}){
  return <div style={{...sf(10,700),color:C.s6,letterSpacing:1.5,textTransform:"uppercase",padding:"14px 16px 6px"}}>{text}</div>;
}
function DrawerRow({label,icon,count,isActive,onClick,depth,leadingArrow}){
  var pad=depth===1?"10px 16px 10px 36px":"12px 16px";
  return(
    <button onClick={onClick}
      style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,
        padding:pad,background:isActive?"rgba(212,168,83,0.10)":"none",
        border:"none",borderRadius:10,cursor:"pointer",marginBottom:1}}>
      <span style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
        {leadingArrow&&<span style={{...sf(10),color:C.s5,width:10,display:"inline-flex",justifyContent:"center"}}>{leadingArrow}</span>}
        <Icon name={icon} size={depth===1?15:18} color={isActive?C.gd:C.s5}/>
        <span style={{...sf(depth===1?12:14,isActive?600:400),color:isActive?C.s1:C.s4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{label}</span>
      </span>
      {typeof count==="number"&&<span style={{...sf(11,500),color:isActive?C.gd:C.s6}}>{count}</span>}
    </button>
  );
}
function MobileDrawer({active,onNav,onClose,globalCity,onCityClick,cityCounts}){
  var cityKeys=PRIMARY_CITIES.concat(["__other__"]);
  var opsItems=[
    {id:"dashboard",label:"Dashboard",icon:"dashboard"},
    {id:"bookings",label:"Bookings",icon:"bookings"},
    {id:"clients",label:"Members",icon:"clients"},
    {id:"finance",label:"Finance",icon:"star"},
  ];
  var bottomItems=[
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
          {/* Operations — at the top, same as desktop */}
          <DrawerSection text="Operations"/>
          {opsItems.map(function(item){
            var isActive=active===item.id;
            return(
              <DrawerRow key={item.id} label={item.label} icon={item.icon}
                isActive={isActive}
                onClick={function(){onNav(item.id);onClose();}}/>
            );
          })}

          {/* Cities */}
          <DrawerSection text="Cities"/>
          <DrawerRow label="All cities" icon="globe"
            count={(cityCounts.__all__||{}).__all__}
            isActive={!globalCity&&active==="city_overview"}
            onClick={function(){onCityClick("");onClose();}}/>
          {cityKeys.map(function(key){
            var label=key==="__other__"?"Other cities":key;
            var bucket=cityCounts[key]||{};
            var cityActive=globalCity===key;
            return(
              <DrawerRow key={"city_"+key} label={label} icon="pin" count={bucket.__all__||0}
                isActive={cityActive}
                onClick={function(){onCityClick(key);onClose();}}/>
            );
          })}

          {/* Content tools at the bottom */}
          <DrawerSection text="Content"/>
          {bottomItems.map(function(item){
            var isActive=active===item.id;
            return(
              <DrawerRow key={item.id} label={item.label} icon={item.icon}
                isActive={isActive}
                onClick={function(){onNav(item.id);onClose();}}/>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══ Admin Dashboard (Main) ═══ */
// The five live Alfred cities. The sidebar's "Cities" section pins these
// at the top in this order. Any other city present in the DB is grouped
// under "Other cities" so the sidebar stays focused on the markets we
// actually merchandise. Saint-Tropez uses the exact spelling already in
// public.accommodations so the filter matches existing rows.
var PRIMARY_CITIES=["Paris","Miami","Ibiza","Saint-Tropez","Mykonos"];

// Categories shown on the City Overview page, in display order. Every
// city always shows the same six cards — even when empty — so the
// operator's mental map stays stable from one city to the next. We
// override "Restaurants" → "Dining" because that's the public-facing
// label members see in the app.
var CITY_CATEGORIES=[
  {catId:"restaurants",label:"Dining"},
  {catId:"cars",label:"Cars"},
  {catId:"wellness",label:"Wellness"},
  {catId:"yachts",label:"Yachts"},
  {catId:"accommodations",label:"Hotels"},
  {catId:"nightlife",label:"Nightlife"},
];

function AdminDashboard({onLogout}){
  var [page,setPage]=useState("dashboard");
  var [collapsed,setCollapsed]=useState(false);
  var [isMobile,setIsMobile]=useState(window.innerWidth<=768);
  var [drawer,setDrawer]=useState(false);
  var [counts,setCounts]=useState({});
  // Global city filter — persists across category switches so flipping
  // from Restaurants → Hotels with Paris selected keeps you in Paris.
  // "" means "no global filter, show everything".
  // "__other__" is the synthetic bucket for any city not in PRIMARY_CITIES.
  var [globalCity,setGlobalCity]=useState("");
  // Nested counts: cityCounts[city] = { __all__: 337, restaurants: 128, accommodations: 70, ... }
  // Plus cityCounts.__all__ = totals across all cities.
  var [cityCounts,setCityCounts]=useState({});

  useEffect(function(){
    function onResize(){setIsMobile(window.innerWidth<=768);}
    window.addEventListener("resize",onResize);
    return function(){window.removeEventListener("resize",onResize);};
  },[]);

  useEffect(function(){
    async function loadCounts(){
      // Per-category totals (used by Dashboard tiles + the "All venues"
      // section in the sidebar).
      var c={};
      for(var i=0;i<CATS.length;i++){
        var {count}=await supabase.from(CATS[i].table).select("id",{count:"exact",head:true});
        c[CATS[i].id]=count||0;
      }
      var {count:bc}=await supabase.from("bookings").select("id",{count:"exact",head:true});
      c.bookings=bc||0;
      setCounts(c);

      // Per-city, per-category counts. One query per table — pull just
      // the `city` column, bucket client-side. Cheaper than 6 cities × 6
      // categories = 36 head requests.
      function emptyBucket(){
        var b={__all__:0};
        CATS.forEach(function(c){b[c.id]=0;});
        return b;
      }
      var perCity={__all__:emptyBucket(),__other__:emptyBucket()};
      PRIMARY_CITIES.forEach(function(c){perCity[c]=emptyBucket();});
      var promises=CATS.map(function(cat){
        return supabase.from(cat.table).select("city").then(function(r){
          (r.data||[]).forEach(function(row){
            var city=row.city||"";
            var bucket=PRIMARY_CITIES.indexOf(city)>=0?city:"__other__";
            perCity.__all__.__all__+=1;
            perCity.__all__[cat.id]+=1;
            perCity[bucket].__all__+=1;
            perCity[bucket][cat.id]+=1;
          });
        });
      });
      await Promise.all(promises);
      setCityCounts(perCity);
    }
    loadCounts();
  },[]);

  var activeCat=CATS.find(function(c){return c.id===page;});

  function renderContent(){
    if(page==="dashboard")return <DashboardView counts={counts} onNav={setPage}/>;
    if(page==="city_overview"&&globalCity){
      return <CityOverviewView key={globalCity} city={globalCity}
        onClearCity={function(){setGlobalCity("");setPage("dashboard");}}/>;
    }
    if(page==="bookings")return <BookingsView/>;
    if(page==="clients")return <ClientsView/>;
    if(page==="images")return <ImageBrowserView/>;
    if(page==="featured")return <FeaturedView/>;
    if(page==="blog")return <BlogView/>;
    if(page==="notifications")return <NotificationsView/>;
    if(page==="finance")return <FinanceView/>;
    if(activeCat)return <CategoryView key={activeCat.id+"_"+globalCity} cat={activeCat} globalCity={globalCity} onClearCity={function(){setGlobalCity("");}}/>;
    return <DashboardView counts={counts} onNav={setPage}/>;
  }

  // Click a city in the sidebar → open its City Overview in the main
  // pane. That page shows every Paris venue in one list with category
  // tabs at the top to filter (Dining, Cars, Wellness, Yachts, Hotels,
  // Nightlife). No separate per-category navigation — everything
  // happens in one view.
  function handleCityNav(cityKey){
    if(!cityKey){
      setGlobalCity("");
      if(page==="city_overview")setPage("dashboard");
      return;
    }
    setGlobalCity(cityKey);
    setPage("city_overview");
  }

  if(isMobile){
    return(
      <div style={{minHeight:"100vh",background:C.bg}}>
        <MobileHeader onMenuToggle={function(){setDrawer(true);}} onLogout={onLogout}/>
        {drawer&&<MobileDrawer active={page} onNav={setPage} onClose={function(){setDrawer(false);}}
          globalCity={globalCity}
          onCityClick={handleCityNav}
          cityCounts={cityCounts}/>}
        <div style={{padding:"20px 16px"}}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.bg}}>
      <Sidebar active={page} onNav={setPage} onLogout={onLogout}
        collapsed={collapsed} onToggle={function(){setCollapsed(!collapsed);}}
        globalCity={globalCity}
        onCityClick={handleCityNav}
        cityCounts={cityCounts}/>
      <div style={{flex:1,minWidth:0,padding:"28px 32px",overflowY:"auto",overflowX:"hidden"}}>
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
