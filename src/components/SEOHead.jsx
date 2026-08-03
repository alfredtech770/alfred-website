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
    title:"VIP Event Hospitality — Motorsport, Tennis & Culture | Alfred",
    description:"Explore Alfred's event hospitality guides and request current ticket, travel and concierge options for motorsport, tennis, nightlife and cultural events.",
    keywords:"Monaco Grand Prix tickets, Monaco Grand Prix 2026, Monaco F1 hospitality, Monaco Grand Prix VIP, Miami Grand Prix tickets, Miami F1 2026, Miami Grand Prix hospitality, F1 VIP packages, Roland Garros tickets, Roland Garros private box, Royal Ascot VIP, Ibiza VIP, Ibiza opening 2026, luxury event tickets, F1 hospitality packages",
    path:"/events",
    jsonLd:[
      {"@context":"https://schema.org","@type":"ItemList","name":"Alfred Concierge Featured Events 2026","description":"VIP hospitality packages for the world's most exclusive events in 2026.","itemListElement":[{"@type":"ListItem","position":1,"name":"Monaco Grand Prix 2026","url":"https://alfredconcierge.app/events/monaco-grand-prix"},{"@type":"ListItem","position":2,"name":"Miami Grand Prix 2026","url":"https://alfredconcierge.app/events/miami-grand-prix"},{"@type":"ListItem","position":3,"name":"Ibiza Opening 2026","url":"https://alfredconcierge.app/events/ibiza-opening"},{"@type":"ListItem","position":4,"name":"Roland Garros 2026","url":"https://alfredconcierge.app/events/roland-garros"},{"@type":"ListItem","position":5,"name":"Royal Ascot 2026","url":"https://alfredconcierge.app/events/royal-ascot"}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Events","item":"https://alfredconcierge.app/events"}]}
    ]
  },
  monacoGP:{
    title:"Monaco Grand Prix Concierge Guide | Alfred Concierge",
    description:"Explore Alfred's Monaco Grand Prix concierge guide. Request current hospitality, accommodation and transport options for the next race weekend.",
    keywords:"Monaco Grand Prix tickets, Monaco Grand Prix 2026, Monaco F1 tickets, Monaco Grand Prix hospitality, Monaco F1 VIP, Monaco Grand Prix packages, buy Monaco GP tickets, Monaco Grand Prix swimming pool chicane, Formula 1 Monaco, F1 Monaco 2026",
    path:"/events/monaco-grand-prix",
    type:"event"
  },
  miamiGP:{
    title:"Miami Grand Prix Concierge Guide | Alfred Concierge",
    description:"Explore Alfred's Miami Grand Prix concierge guide. Request current hospitality, accommodation, dining and transport options for the next race weekend.",
    keywords:"Miami Grand Prix tickets, Miami Grand Prix 2026, Miami F1 tickets, Miami Grand Prix hospitality, Miami F1 VIP, Miami Grand Prix paddock, Miami GP Turn 1, F1 Miami, Formula 1 Miami 2026, Miami Grand Prix party LIV",
    path:"/events/miami-grand-prix",
    type:"event"
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
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I book a restaurant through Alfred?","acceptedAnswer":{"@type":"Answer","text":"Contact Alfred via WhatsApp or the app. Share your date, time, party size, and preferred venue. Alfred confirms the reservation instantly for members, or within the hour for requests."}},{"@type":"Question","name":"Can Alfred get last-minute restaurant reservations?","acceptedAnswer":{"@type":"Answer","text":"Yes. Alfred Concierge specialises in impossible and last-minute reservations at fully-booked venues. Platinum and Centurion members have priority access."}},{"@type":"Question","name":"Which restaurants does Alfred cover?","acceptedAnswer":{"@type":"Answer","text":"Alfred covers 200+ curated venues in Miami and Paris, including Michelin-starred restaurants, waterfront dining, and members-only establishments."}}]},
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
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How much does a VIP table at LIV Miami cost?","acceptedAnswer":{"@type":"Answer","text":"VIP tables at LIV Miami typically start at $2,000 minimum spend on weekdays and $5,000+ on weekends with headliners. Alfred Concierge negotiates reduced minimums and guaranteed placement for members."}},{"@type":"Question","name":"Can Alfred get me into E11even Miami?","acceptedAnswer":{"@type":"Answer","text":"Yes. Alfred Concierge has direct relationships with E11even Miami. Members get guestlist access, VIP table placement, and reduced minimum spends."}},{"@type":"Question","name":"What nightclubs does Alfred cover in Paris?","acceptedAnswer":{"@type":"Answer","text":"Alfred covers Raspoutine, Castel, L'Arc, CoCo Club, and other top Paris venues. VIP table booking, guestlist access, and artist meet & greets available."}}]},
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
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How much does it cost to rent an exotic car in Miami?","acceptedAnswer":{"@type":"Answer","text":"Exotic car rentals in Miami through Alfred Concierge start at $800/day for sports cars like the Porsche 911, up to $5,000/day for ultra-luxury vehicles like the Rolls Royce Cullinan. Ferrari and Lamborghini rentals typically range from $1,200 to $2,500/day. Full insurance is always included."}},{"@type":"Question","name":"Does Alfred deliver exotic cars to my hotel in Miami?","acceptedAnswer":{"@type":"Answer","text":"Yes. Alfred Concierge delivers every car directly to your hotel, residence, or airport in Miami. White-glove handover with full walkthrough included."}},{"@type":"Question","name":"What exotic cars can I rent in Miami through Alfred?","acceptedAnswer":{"@type":"Answer","text":"Alfred offers Ferrari, Lamborghini, Rolls Royce, McLaren, Porsche, Bentley, Mercedes AMG, and more. The full catalog is available in the Alfred app."}}]},
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
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How much does it cost to charter a private jet from Miami?","acceptedAnswer":{"@type":"Answer","text":"Private jet charters from Miami start at approximately $3,500/hour for light jets, $6,000/hour for midsize jets, and $10,000+ per hour for heavy jets. Miami to New York on a light jet is typically $15,000–$25,000. Alfred Concierge provides instant quotes."}},{"@type":"Question","name":"How quickly can Alfred arrange a private jet?","acceptedAnswer":{"@type":"Answer","text":"Alfred Concierge can arrange private jet charters within 2–4 hours for standard requests. Same-day departures are available for Platinum and Centurion members."}},{"@type":"Question","name":"Does Alfred offer empty leg flights?","acceptedAnswer":{"@type":"Answer","text":"Yes. Alfred sources empty leg deals which can reduce charter costs by 50–75%. Available routes are shown in the catalog and update daily."}}]},
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
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How much does it cost to charter a yacht in Miami?","acceptedAnswer":{"@type":"Answer","text":"Yacht charters in Miami through Alfred Concierge start at $800 for a 4-hour charter on a 40ft boat, up to $25,000+ per day for superyachts over 100ft. Most day charters for groups of 10–20 cost $2,000–$6,000. Crew and fuel are included."}},{"@type":"Question","name":"How many people can go on a yacht charter?","acceptedAnswer":{"@type":"Answer","text":"Alfred's Miami fleet accommodates groups from 2 to 100+ guests. Day boats fit 10–20 people; mid-range yachts fit 20–40 guests; superyachts accommodate larger groups with full crew."}},{"@type":"Question","name":"What is included in a yacht charter through Alfred?","acceptedAnswer":{"@type":"Answer","text":"Alfred yacht charters include a full professional crew, fuel, insurance, water toys (jet skis, paddleboards, snorkel gear), and catering options. A personal concierge coordinates all details."}}]},
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
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What are the best spas in Miami?","acceptedAnswer":{"@type":"Answer","text":"The best luxury spas in Miami are Canyon Ranch Miami Beach, Lapis Spa at the Fontainebleau, Four Seasons Surf Club Spa, and the Dior Institute. Alfred Concierge books all of these with priority access for members."}},{"@type":"Question","name":"Can Alfred book spa treatments same-day?","acceptedAnswer":{"@type":"Answer","text":"Yes. Alfred Concierge can arrange same-day spa bookings at partner venues in Miami and Paris for Platinum and Centurion members."}},{"@type":"Question","name":"What wellness services does Alfred offer?","acceptedAnswer":{"@type":"Answer","text":"Alfred covers luxury spa treatments, deep tissue and sports massage, facials, personal training sessions, yoga, pilates, IV therapy, and wellness retreats in Miami and Paris."}}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Wellness","item":"https://alfredconcierge.app/catalog/wellness"}]}
    ]
  },
  business:{
    title:"Partner with Alfred — List Your Venue or Service | Alfred Concierge",
    description:"Join Alfred's curated concierge platform. List your restaurant, nightclub, car rental, yacht, jet or wellness venue. Access high-value clientele. Zero upfront cost. Apply to become an Alfred partner.",
    keywords:"concierge partner, list venue, restaurant partner program, luxury venue listing, Alfred partner, Alfred business",
    path:"/business",
    jsonLd:[
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Business","item":"https://alfredconcierge.app/business"}]}
    ]
  }
};
