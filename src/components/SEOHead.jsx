import { useEffect } from "react";

var BASE="https://alfredconcierge.app";
var DEFAULT_IMG=BASE+"/og-image.jpg";
var SITE="Alfred Concierge";

function canonicalUrl(path){
  var url;
  try{url=new URL(path||"/",BASE)}catch(e){url=new URL("/",BASE)}
  var pathname=url.pathname.replace(/\/{2,}/g,"/");
  if(pathname.length>1)pathname=pathname.replace(/\/+$/g,"");
  return BASE+pathname;
}

function absoluteUrl(value){
  try{return new URL(value||DEFAULT_IMG,BASE).href}catch(e){return DEFAULT_IMG}
}

export default function SEOHead(p){
  var title=p.title||(SITE+" — Luxury Concierge App");
  var desc=p.description||"Browse restaurants, hotels, nightlife, exotic cars, yachts, private jets and wellness, then send your request to Alfred Concierge.";
  var path=p.path||(typeof window!=="undefined"?window.location.pathname:"/");
  var canonical=canonicalUrl(path);
  var image=absoluteUrl(p.image);
  var type=p.type||"website";
  var robots=p.noindex?"noindex, nofollow":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  var jsonLdText=p.jsonLd?JSON.stringify(p.jsonLd):"";

  useEffect(function(){
    document.title=title;

    function setMeta(attr,key,val){
      var el=document.querySelector("meta["+attr+'="'+key+'"]');
      if(!val){if(el)el.remove();return}
      if(el){el.setAttribute("content",val)}
      else{el=document.createElement("meta");el.setAttribute(attr,key);el.setAttribute("content",val);document.head.appendChild(el)}
    }

    setMeta("name","description",desc);
    setMeta("name","keywords",p.keywords||"");
    setMeta("name","robots",robots);
    setMeta("property","og:title",title);
    setMeta("property","og:description",desc);
    setMeta("property","og:url",canonical);
    setMeta("property","og:image",image);
    setMeta("property","og:type",type);
    setMeta("name","twitter:title",title);
    setMeta("name","twitter:description",desc);
    setMeta("name","twitter:image",image);

    var links=document.querySelectorAll('link[rel="canonical"]');
    var link=links[0];
    if(!link){link=document.createElement("link");link.setAttribute("rel","canonical");document.head.appendChild(link)}
    link.setAttribute("href",canonical);
    for(var i=1;i<links.length;i++)links[i].remove();

    document.documentElement.setAttribute("lang",p.lang||"en");

    /* JSON-LD per page */
    var existingScript=document.getElementById("seo-jsonld");
    if(existingScript)existingScript.remove();
    if(jsonLdText){
      var data=JSON.parse(jsonLdText);
      // CatalogSeoBody emits the FAQ that users can actually read. Avoid a
      // second, conflicting FAQ schema from the page-level SEO preset.
      if(document.querySelector("script[data-visible-faq]")&&Array.isArray(data)){
        data=data.filter(function(item){return !item||item["@type"]!=="FAQPage"});
      }
      var script=document.createElement("script");
      script.id="seo-jsonld";
      script.type="application/ld+json";
      script.textContent=JSON.stringify(data);
      document.head.appendChild(script);
    }

    return function(){
      var s=document.getElementById("seo-jsonld");
      if(s)s.remove();
    };
  },[title,desc,canonical,image,type,robots,jsonLdText,p.keywords,p.lang]);

  return null;
}

/* Pre-built SEO configs for each page */
export var SEO={
  home:{
    title:"Alfred Concierge — Restaurants, Hotels, Cars & Luxury Services",
    description:"Browse curated restaurants, luxury hotels, nightlife, exotic cars, yachts, private jets and wellness in Miami, Paris, Dubai and London, then send your request to Alfred Concierge.",
    keywords:"luxury concierge app, best concierge service, Miami concierge, Paris concierge, Dubai concierge, restaurant reservations, VIP nightlife Miami, private jet charter, exotic car rental Miami, yacht charter, Monaco Grand Prix tickets, Miami F1 tickets, Alfred concierge, Alfred app",
    path:"/"
  },
  events:{
    title:"Event Requests | Alfred Concierge",
    description:"Ask Alfred to check current event and hospitality options. Dates, availability, inclusions and final prices require confirmation.",
    path:"/events",
    noindex:true
  },
  monacoGP:{
    title:"Monaco Grand Prix Request | Alfred Concierge",
    description:"Ask Alfred to check current Monaco Grand Prix options. Ticket source, availability, inclusions and final pricing require confirmation.",
    path:"/events/monaco-grand-prix",
    noindex:true
  },
  miamiGP:{
    title:"Miami Grand Prix Request | Alfred Concierge",
    description:"Ask Alfred to check current Miami Grand Prix options. Ticket source, availability, inclusions and final pricing require confirmation.",
    path:"/events/miami-grand-prix",
    noindex:true
  },
  catalog:{
    title:"Luxury Catalog — Dining, Nightlife, Cars, Jets, Yachts, Wellness | Alfred",
    description:"Browse Alfred's curated catalog of luxury experiences. Michelin restaurants, VIP nightlife, exotic car rentals, private jet charters, yacht charters and wellness spas in Miami, Paris, Dubai and London.",
    keywords:"luxury experiences, luxury catalog, Miami restaurants, Miami nightlife, exotic car rental, private jet, yacht charter, wellness spa, luxury concierge catalog",
    path:"/catalog",
    jsonLd:[
      {"@context":"https://schema.org","@type":"ItemList","name":"Alfred Concierge — Luxury Catalog","description":"Curated luxury experiences in Miami, Paris, Dubai and London. Dining, nightlife, exotic cars, private jets, yachts and wellness.","itemListElement":[{"@type":"ListItem","position":1,"name":"Dining","url":"https://alfredconcierge.app/catalog/dining"},{"@type":"ListItem","position":2,"name":"Nightlife","url":"https://alfredconcierge.app/catalog/nightlife"},{"@type":"ListItem","position":3,"name":"Exotic Cars","url":"https://alfredconcierge.app/catalog/exotic-cars"},{"@type":"ListItem","position":4,"name":"Private Jets","url":"https://alfredconcierge.app/catalog/jets"},{"@type":"ListItem","position":5,"name":"Yachts","url":"https://alfredconcierge.app/catalog/yachts"},{"@type":"ListItem","position":6,"name":"Wellness","url":"https://alfredconcierge.app/catalog/wellness"}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"}]}
    ]
  },
  dining:{
    title:"Best Restaurants in Miami & Paris — Michelin Dining Reservations | Alfred",
    description:"Browse curated restaurants in Miami and Paris, including Michelin dining, private rooms and waterfront venues. Send Alfred your date, time and party size to request a table.",
    keywords:"best restaurants Miami, best restaurants Paris, Michelin restaurants Miami, Michelin restaurants Paris, restaurant reservations Miami, impossible reservations, private dining Miami, fine dining Miami, luxury restaurants, Miami restaurant booking, concierge restaurant reservations",
    path:"/catalog/dining",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"Restaurant Requests — Alfred Concierge","description":"Browse restaurants and ask Alfred Concierge to confirm current reservation options for your date, time and party size.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"Restaurant reservation requests","areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Paris"},{"@type":"City","name":"Dubai"},{"@type":"City","name":"London"}],"url":"https://alfredconcierge.app/catalog/dining"},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Dining","item":"https://alfredconcierge.app/catalog/dining"}]}
    ]
  },
  nightlife:{
    title:"VIP Nightlife Miami & Paris — Request Tables & Guest Lists | Alfred",
    description:"Browse nightlife venues in Miami and Paris, then ask Alfred to check current guest-list, table and bottle-service options for your date and group size.",
    keywords:"LIV Miami table, LIV Miami VIP, E11even Miami, E11even VIP table, Story Miami, Club Space Miami, Hyde Beach Miami, Raspoutine Paris, Castel Paris, nightclub tables Miami, VIP nightlife Miami, bottle service Miami, nightclub reservations, VIP tables Paris, Miami nightclub booking, best nightclubs Miami, best nightclubs Paris",
    path:"/catalog/nightlife",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"Nightlife Requests — Alfred Concierge","description":"Browse nightlife venues and ask Alfred to confirm current guest-list, table or bottle-service options and venue terms.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"Nightlife booking requests","areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Paris"}],"url":"https://alfredconcierge.app/catalog/nightlife"},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Nightlife","item":"https://alfredconcierge.app/catalog/nightlife"}]}
    ]
  },
  exoticCars:{
    title:"Exotic Car Rental Miami — Ferrari, Lamborghini, Rolls Royce | Alfred",
    description:"Browse Ferrari, Lamborghini, Rolls-Royce, McLaren, Porsche and other luxury cars in Miami. View indicative daily pricing and request current availability, delivery and rental terms through Alfred.",
    keywords:"exotic car rental Miami, Ferrari rental Miami, Lamborghini rental Miami, Rolls Royce rental Miami, McLaren rental Miami, Porsche rental Miami, supercar rental Miami, luxury car rental Miami, exotic car hire, sports car rental Miami, car rental Miami Beach, exotic car rental near me, rent a Ferrari, rent a Lamborghini, Miami luxury car rental",
    path:"/catalog/exotic-cars",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"Exotic Car Rental Requests — Alfred Concierge","description":"Compare luxury cars and request current vehicle availability, pricing, delivery options and supplier terms through Alfred Concierge.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"Exotic car rental requests","areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Paris"},{"@type":"City","name":"Dubai"}],"url":"https://alfredconcierge.app/catalog/exotic-cars"},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Exotic Cars","item":"https://alfredconcierge.app/catalog/exotic-cars"}]}
    ]
  },
  jets:{
    title:"Private Jet Charter — Request Current Aircraft & Quotes | Alfred",
    description:"Browse private aircraft categories and request current charter options and a full quote for your route, date and passenger count through Alfred Concierge.",
    keywords:"private jet charter, private jet rental, charter a private jet, private flight, private jet Miami, private jet hire, empty leg flights, private aviation, luxury jet charter, private jet cost, book private jet, private plane charter",
    path:"/catalog/jets",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"Private Jet Charter Requests — Alfred Concierge","description":"Request current aircraft options and a charter quote for a specific route, date and passenger count.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"Private jet charter requests","areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Paris"},{"@type":"City","name":"Dubai"},{"@type":"City","name":"London"}],"url":"https://alfredconcierge.app/catalog/jets"},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Jets","item":"https://alfredconcierge.app/catalog/jets"}]}
    ]
  },
  yachts:{
    title:"Yacht Charter Miami — Luxury Boat Rental & Yacht Hire | Alfred",
    description:"Browse yachts in Miami, the French Riviera, Ibiza and Monaco, then request current vessel availability, charter pricing and confirmed inclusions through Alfred.",
    keywords:"yacht charter Miami, yacht rental Miami, boat rental Miami, luxury yacht charter, yacht hire Miami, boat charter Miami, Miami yacht, superyacht charter, day boat rental Miami, Biscayne Bay yacht, yacht rental near me, party boat Miami, Miami boat party",
    path:"/catalog/yachts",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"Yacht Charter Requests — Alfred Concierge","description":"Browse yachts and request current vessel availability, charter pricing, guest capacity and confirmed inclusions.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"Yacht charter requests","areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Ibiza"},{"@type":"City","name":"Monaco"}],"url":"https://alfredconcierge.app/catalog/yachts"},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Yachts","item":"https://alfredconcierge.app/catalog/yachts"}]}
    ]
  },
  wellness:{
    title:"Luxury Wellness & Spa — Best Spas in Miami & Paris | Alfred",
    description:"Browse spas and wellness providers in Miami and Paris, then ask Alfred to confirm current treatment times, prices and provider terms.",
    keywords:"best spa Miami, luxury spa Miami, wellness Miami, personal trainer Miami, facial Miami, spa booking, wellness retreat, spa Paris, luxury wellness, best spa near me",
    path:"/catalog/wellness",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"Wellness Requests — Alfred Concierge","description":"Browse wellness providers and request current treatment times, pricing and provider terms through Alfred Concierge.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"Wellness appointment requests","areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Paris"}],"url":"https://alfredconcierge.app/catalog/wellness"},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Wellness","item":"https://alfredconcierge.app/catalog/wellness"}]}
    ]
  },
  business:{
    title:"Partner with Alfred — List Your Venue or Service | Alfred Concierge",
    description:"Apply to list a restaurant, hotel, nightclub, car rental, yacht, jet or wellness service. Alfred confirms fit, workflow and commercial terms before onboarding.",
    keywords:"concierge partner, list venue, restaurant partner program, luxury venue listing, Alfred partner, Alfred business",
    path:"/business",
    jsonLd:[
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Business","item":"https://alfredconcierge.app/business"}]}
    ]
  }
};
