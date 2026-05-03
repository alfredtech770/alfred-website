/**
 * Centralized schema.org JSON-LD generators for Alfred Concierge detail pages.
 * Each generator takes a Supabase row (or the page's view model) and returns a
 * JSON-LD object suitable for the SEOHead `jsonLd` prop.
 *
 * All generators tolerate missing fields — they only emit properties that are
 * actually populated, since incomplete schema is downgraded by Google.
 */

var BASE = "https://alfredconcierge.app";
var ORG = {
  "@type":"Organization",
  "name":"Alfred Concierge",
  "url": BASE
};

function clean(obj){
  // Remove keys whose value is undefined, null, "" or empty array.
  // Schema.org validators penalize empty fields more than missing ones.
  var out = {};
  for(var k in obj){
    var v = obj[k];
    if(v===undefined || v===null) continue;
    if(typeof v==="string" && v.trim()==="") continue;
    if(Array.isArray(v) && v.length===0) continue;
    out[k] = v;
  }
  return out;
}

function imgs(row){
  var arr = [];
  if(row.hero_image_url) arr.push(row.hero_image_url);
  if(Array.isArray(row.photos_order)) row.photos_order.forEach(function(u){ if(u && arr.indexOf(u)===-1) arr.push(u); });
  return arr;
}

function postal(streetAddress, locality, region, postal, country){
  return clean({
    "@type":"PostalAddress",
    "streetAddress": streetAddress,
    "addressLocality": locality,
    "addressRegion": region,
    "postalCode": postal,
    "addressCountry": country
  });
}

/* ─── Hotel / Lodging ─────────────────────────────────────────────────── */

export function hotelJsonLd(h, slug){
  var url = BASE + "/catalog/hotels/" + slug;
  var images = imgs(h);
  var address = postal(
    h.street_address || (h.address_line_1 || ""),
    h.city || "Miami",
    h.region || (h.city==="Miami" ? "FL" : undefined),
    h.postal_code,
    h.country || (h.city==="Paris" ? "FR" : h.city==="London" ? "GB" : h.city==="Dubai" ? "AE" : "US")
  );

  var lodging = clean({
    "@context":"https://schema.org",
    "@type": h.category==="resort" ? "Resort" : "Hotel",
    "@id": url,
    "name": h.name,
    "description": h.description || (h.name + " — luxury hotel in " + (h.neighborhood || h.city || "Miami") + ". Book through Alfred Concierge for member benefits."),
    "url": url,
    "image": images.length ? images : undefined,
    "priceRange": h.price_range || "$$$$",
    "address": Object.keys(address).length>1 ? address : undefined,
    "starRating": h.star_rating ? {"@type":"Rating","ratingValue": String(h.star_rating)} : undefined,
    "telephone": h.phone || undefined,
    "checkinTime": h.checkin_time || "15:00",
    "checkoutTime": h.checkout_time || "11:00",
    "geo": (h.latitude && h.longitude) ? clean({"@type":"GeoCoordinates","latitude":h.latitude,"longitude":h.longitude}) : undefined,
    "amenityFeature": Array.isArray(h.amenities) && h.amenities.length ? h.amenities.map(function(a){ return {"@type":"LocationFeatureSpecification","name": typeof a==="string" ? a : a.name, "value": true}; }) : undefined,
    "isAccessibleForFree": false,
    "potentialAction": {"@type":"ReserveAction","target":url,"name":"Book through Alfred Concierge"},
    "broker": ORG
  });

  var breadcrumb = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item": BASE},
      {"@type":"ListItem","position":2,"name":"Catalog","item": BASE+"/catalog"},
      {"@type":"ListItem","position":3,"name":"Hotels","item": BASE+"/catalog/hotels"},
      {"@type":"ListItem","position":4,"name": h.name, "item": url}
    ]
  };

  return [lodging, breadcrumb];
}

/* ─── Restaurant ──────────────────────────────────────────────────────── */

export function restaurantJsonLd(r, slug){
  var url = BASE + "/catalog/dining/" + slug;
  var images = imgs(r);
  var priceRange = r.price_level ? Array(r.price_level+1).join("$") || "$$$" : "$$$";
  var country = r.country || (r.city==="Paris" ? "FR" : r.city==="London" ? "GB" : r.city==="Dubai" ? "AE" : "US");

  var restaurant = clean({
    "@context":"https://schema.org",
    "@type":"Restaurant",
    "@id": url,
    "name": r.name,
    "description": r.description || (r.name + " — " + (r.cuisine || "fine dining") + " in " + (r.city || "Miami") + ". Reservations through Alfred Concierge."),
    "url": url,
    "image": images.length ? images : undefined,
    "servesCuisine": r.cuisine || undefined,
    "priceRange": priceRange,
    "address": postal(r.street_address, r.city, r.region, r.postal_code, country),
    "telephone": r.phone || undefined,
    "geo": (r.latitude && r.longitude) ? clean({"@type":"GeoCoordinates","latitude":r.latitude,"longitude":r.longitude}) : undefined,
    "aggregateRating": r.rating ? clean({"@type":"AggregateRating","ratingValue": String(r.rating), "reviewCount": String(r.review_count || r.reviews || 1)}) : undefined,
    "acceptsReservations": "True",
    "potentialAction": {"@type":"ReserveAction","target":url,"name":"Reserve through Alfred Concierge"},
    "broker": ORG
  });

  var breadcrumb = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item": BASE},
      {"@type":"ListItem","position":2,"name":"Catalog","item": BASE+"/catalog"},
      {"@type":"ListItem","position":3,"name":"Dining","item": BASE+"/catalog/dining"},
      {"@type":"ListItem","position":4,"name": r.name, "item": url}
    ]
  };

  return [restaurant, breadcrumb];
}

/* ─── Vehicle / Car Rental ────────────────────────────────────────────── */

export function carJsonLd(c, slug){
  var url = BASE + "/catalog/exotic-cars/" + slug;
  var name = (c.brand && c.name && c.name.toLowerCase().indexOf(c.brand.toLowerCase())!==0) ? (c.brand+" "+c.name) : (c.name || c.brand);

  var car = clean({
    "@context":"https://schema.org",
    "@type":"Car",
    "@id": url,
    "name": name,
    "brand": c.brand ? {"@type":"Brand","name":c.brand} : undefined,
    "model": c.name && c.brand && c.name.toLowerCase().indexOf(c.brand.toLowerCase())===0 ? c.name.replace(new RegExp("^"+c.brand+"\\s*","i"),"").trim() : c.name,
    "description": c.description || (name + " — exotic car rental in " + (c.city || "Miami") + " through Alfred Concierge. Delivered to your door, fully insured."),
    "url": url,
    "image": imgs(c).length ? imgs(c) : (c.hero_image_url ? [c.hero_image_url] : undefined),
    "vehicleEngine": c.engine ? clean({"@type":"EngineSpecification","name":c.engine,"enginePower": c.hp ? clean({"@type":"QuantitativeValue","value": String(c.hp), "unitCode":"BHP"}) : undefined}) : undefined,
    "vehicleTransmission": c.transmission || undefined,
    "driveWheelConfiguration": c.is_convertible ? "https://schema.org/RearWheelDriveConfiguration" : "https://schema.org/AllWheelDriveConfiguration",
    "numberOfDoors": c.seats <= 2 ? 2 : 4,
    "vehicleSeatingCapacity": c.seats || 2,
    "bodyType": c.body || c.type || c.category || "Coupe",
    "speed": c.top_speed ? clean({"@type":"QuantitativeValue","value": String(c.top_speed), "unitCode":"KMH"}) : undefined,
    "accelerationTime": c.acceleration || undefined,
    "offers": c.price_1_day ? clean({
      "@type":"Offer",
      "price": String(c.price_1_day),
      "priceCurrency": c.price_currency || "USD",
      "priceSpecification": clean({"@type":"UnitPriceSpecification","price": String(c.price_1_day), "priceCurrency": c.price_currency || "USD", "unitCode":"DAY"}),
      "availability": c.is_active===false ? "https://schema.org/Discontinued" : "https://schema.org/InStock",
      "seller": ORG,
      "areaServed": c.city ? {"@type":"City","name":c.city} : undefined
    }) : undefined
  });

  var breadcrumb = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item": BASE},
      {"@type":"ListItem","position":2,"name":"Catalog","item": BASE+"/catalog"},
      {"@type":"ListItem","position":3,"name":"Exotic Cars","item": BASE+"/catalog/exotic-cars"},
      {"@type":"ListItem","position":4,"name": name, "item": url}
    ]
  };

  return [car, breadcrumb];
}

/* ─── Yacht / Boat Charter ────────────────────────────────────────────── */

export function yachtJsonLd(y, id){
  var url = BASE + "/catalog/yachts/" + id;
  var lowPrice = y.price_4hr || y.price_weekday_4hr;
  var highPrice = y.price_8hr || y.price_weekday_8hr || (lowPrice ? lowPrice*2 : undefined);

  var product = clean({
    "@context":"https://schema.org",
    "@type":"Product",
    "@id": url,
    "name": y.name + (y.size_ft ? " — "+y.size_ft+"ft Yacht Charter" : " — Yacht Charter"),
    "category":"Yacht Charter",
    "description": y.description || (y.name + " — " + (y.size_ft || "luxury") + "ft yacht charter in " + (y.city || "Miami") + " with full crew, fuel, water toys and catering. Book through Alfred Concierge."),
    "url": url,
    "image": imgs(y).length ? imgs(y) : (y.hero_image_url ? [y.hero_image_url] : undefined),
    "brand": y.brand ? {"@type":"Brand","name":y.brand} : undefined,
    "additionalProperty": [
      y.size_ft ? {"@type":"PropertyValue","name":"Length","value": String(y.size_ft)+" ft"} : null,
      y.max_passengers ? {"@type":"PropertyValue","name":"Max Passengers","value": String(y.max_passengers)} : null,
      y.year ? {"@type":"PropertyValue","name":"Year","value": String(y.year)} : null,
      y.captain_included ? {"@type":"PropertyValue","name":"Captain","value":"Included"} : null
    ].filter(Boolean),
    "offers": (lowPrice || highPrice) ? clean({
      "@type":"AggregateOffer",
      "lowPrice": lowPrice ? String(lowPrice) : undefined,
      "highPrice": highPrice ? String(highPrice) : undefined,
      "priceCurrency": y.price_currency || "USD",
      "availability":"https://schema.org/InStock",
      "seller": ORG,
      "areaServed": y.city ? {"@type":"City","name":y.city} : undefined
    }) : undefined
  });

  var breadcrumb = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item": BASE},
      {"@type":"ListItem","position":2,"name":"Catalog","item": BASE+"/catalog"},
      {"@type":"ListItem","position":3,"name":"Yachts","item": BASE+"/catalog/yachts"},
      {"@type":"ListItem","position":4,"name": y.name, "item": url}
    ]
  };

  return [product, breadcrumb];
}

/* ─── Wellness / Spa ──────────────────────────────────────────────────── */

export function spaJsonLd(s, slug){
  var url = BASE + "/catalog/wellness/" + slug;
  var country = s.country || (s.city==="Paris" ? "FR" : s.city==="London" ? "GB" : s.city==="Dubai" ? "AE" : "US");

  var spa = clean({
    "@context":"https://schema.org",
    "@type":"HealthAndBeautyBusiness",
    "@id": url,
    "name": s.name,
    "description": s.description || (s.tagline || s.type || "Luxury spa") + " — " + (s.city || "Miami") + ". Book through Alfred Concierge.",
    "url": url,
    "image": imgs(s).length ? imgs(s) : (Array.isArray(s.imgs) && s.imgs.length ? s.imgs : undefined),
    "address": postal(s.street_address || (s.address && s.address.split(",")[0]), s.city, s.region, s.postal_code, country),
    "priceRange": s.priceLevel || s.price_range || "$$$$",
    "telephone": s.phone || undefined,
    "aggregateRating": s.rating ? clean({"@type":"AggregateRating","ratingValue": String(s.rating), "reviewCount": String(s.reviewCount || s.review_count || 1)}) : undefined,
    "openingHours": s.openingHours || undefined
  });

  var breadcrumb = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item": BASE},
      {"@type":"ListItem","position":2,"name":"Catalog","item": BASE+"/catalog"},
      {"@type":"ListItem","position":3,"name":"Wellness","item": BASE+"/catalog/wellness"},
      {"@type":"ListItem","position":4,"name": s.name, "item": url}
    ]
  };

  return [spa, breadcrumb];
}

/* ─── Nightclub / Bar ─────────────────────────────────────────────────── */

export function nightclubJsonLd(n, slug){
  var url = BASE + "/catalog/nightlife/" + slug;
  var country = n.country || (n.city==="Paris" ? "FR" : n.city==="London" ? "GB" : n.city==="Dubai" ? "AE" : "US");

  var club = clean({
    "@context":"https://schema.org",
    "@type":"NightClub",
    "@id": url,
    "name": n.name,
    "description": n.description || ("VIP tables and bottle service at " + n.name + ". " + (n.music || "") + " Reservations through Alfred Concierge."),
    "url": url,
    "image": Array.isArray(n.imgs) && n.imgs.length ? n.imgs : undefined,
    "address": postal(n.address && n.address.split(",")[0], n.city || "Miami Beach", n.region || (country==="US" ? "FL" : undefined), n.postal_code, country),
    "telephone": n.phone || undefined,
    "aggregateRating": n.rating ? clean({"@type":"AggregateRating","ratingValue": String(n.rating), "reviewCount": String(n.reviewCount || 1)}) : undefined,
    "openingHours": n.hours || undefined
  });

  var breadcrumb = {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item": BASE},
      {"@type":"ListItem","position":2,"name":"Catalog","item": BASE+"/catalog"},
      {"@type":"ListItem","position":3,"name":"Nightlife","item": BASE+"/catalog/nightlife"},
      {"@type":"ListItem","position":4,"name": n.name, "item": url}
    ]
  };

  return [club, breadcrumb];
}
