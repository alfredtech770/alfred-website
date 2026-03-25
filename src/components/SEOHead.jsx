import { useEffect } from "react";

var BASE="https://alfredconcierge.app";
var DEFAULT_IMG=BASE+"/og-image.jpg";
var SITE="Alfred Concierge";

export default function SEOHead(p){
  var title=p.title||(SITE+" — Luxury Concierge App");
  var desc=p.description||"Alfred is the luxury concierge app for Miami, Paris, Dubai & London. Restaurants, nightlife, jets, cars, yachts & more.";
  var path=p.path||window.location.pathname;
  var canonical=BASE+path;
  var image=p.image||DEFAULT_IMG;
  var type=p.type||"website";

  useEffect(function(){
    document.title=title;

    function setMeta(attr,key,val){
      var el=document.querySelector("meta["+attr+'="'+key+'"]');
      if(el){el.setAttribute("content",val)}
      else{el=document.createElement("meta");el.setAttribute(attr,key);el.setAttribute("content",val);document.head.appendChild(el)}
    }

    setMeta("name","description",desc);
    setMeta("name","keywords",p.keywords||"");
    setMeta("property","og:title",title);
    setMeta("property","og:description",desc);
    setMeta("property","og:url",canonical);
    setMeta("property","og:image",image);
    setMeta("property","og:type",type);
    setMeta("name","twitter:title",title);
    setMeta("name","twitter:description",desc);
    setMeta("name","twitter:image",image);

    var link=document.querySelector('link[rel="canonical"]');
    if(link){link.setAttribute("href",canonical)}

    /* JSON-LD per page */
    var existingScript=document.getElementById("seo-jsonld");
    if(existingScript)existingScript.remove();
    if(p.jsonLd){
      var script=document.createElement("script");
      script.id="seo-jsonld";
      script.type="application/ld+json";
      script.textContent=JSON.stringify(p.jsonLd);
      document.head.appendChild(script);
    }

    return function(){
      var s=document.getElementById("seo-jsonld");
      if(s)s.remove();
    };
  },[title,desc,canonical,image,type]);

  return null;
}

/* Pre-built SEO configs for each page */
export var SEO={
  home:{
    title:"Alfred — Luxury Concierge App | Restaurants, Nightlife, Jets, Cars, Yachts",
    description:"Alfred is the best luxury concierge app for Miami, Paris, Dubai & London. Book Michelin restaurants, VIP nightlife at LIV & E11even, private jets, Ferrari & Lamborghini rentals, yacht charters, spa & wellness. Real human concierge 24/7. Monaco Grand Prix & Miami F1 tickets available.",
    keywords:"luxury concierge app, best concierge service, Miami concierge, Paris concierge, Dubai concierge, restaurant reservations, VIP nightlife Miami, private jet charter, exotic car rental Miami, yacht charter, Monaco Grand Prix tickets, Miami F1 tickets, Alfred concierge, Alfred app",
    path:"/"
  },
  events:{
    title:"Exclusive Events — Monaco Grand Prix, Miami F1, Ibiza, Roland Garros | Alfred",
    description:"Get VIP tickets and hospitality packages for the Monaco Grand Prix 2026, Miami Grand Prix, Ibiza Opening, Roland Garros and Royal Ascot. Private lounges, paddock access, helicopter transfers & after-parties. Book through Alfred Concierge.",
    keywords:"Monaco Grand Prix tickets, Monaco Grand Prix 2026, Monaco F1 hospitality, Monaco Grand Prix VIP, Miami Grand Prix tickets, Miami F1 2026, Miami Grand Prix hospitality, F1 VIP packages, Roland Garros tickets, Roland Garros private box, Royal Ascot VIP, Ibiza VIP, Ibiza opening 2026, luxury event tickets, F1 hospitality packages",
    path:"/events"
  },
  monacoGP:{
    title:"Monaco Grand Prix 2026 VIP Tickets & Hospitality | Alfred Concierge",
    description:"Buy Monaco Grand Prix 2026 VIP tickets and hospitality packages. Private lounge on the Swimming Pool chicane, caviar & champagne service, private chef, helicopter transfer from Nice, after-party VIP access. Only 12 spots. Book through Alfred.",
    keywords:"Monaco Grand Prix tickets, Monaco Grand Prix 2026, Monaco F1 tickets, Monaco Grand Prix hospitality, Monaco F1 VIP, Monaco Grand Prix packages, buy Monaco GP tickets, Monaco Grand Prix swimming pool chicane, Formula 1 Monaco, F1 Monaco 2026",
    path:"/events/monaco-grand-prix",
    type:"event"
  },
  miamiGP:{
    title:"Miami Grand Prix 2026 VIP Tickets & Hospitality — Turn 1 Suite | Alfred",
    description:"Miami Grand Prix 2026 VIP hospitality. Track-side luxury suite at Turn 1, paddock access, after-race parties at LIV & E11even, supercar parade. Personal concierge all weekend. Book through Alfred Concierge.",
    keywords:"Miami Grand Prix tickets, Miami Grand Prix 2026, Miami F1 tickets, Miami Grand Prix hospitality, Miami F1 VIP, Miami Grand Prix paddock, Miami GP Turn 1, F1 Miami, Formula 1 Miami 2026, Miami Grand Prix party LIV",
    path:"/events/miami-grand-prix",
    type:"event"
  },
  catalog:{
    title:"Luxury Catalog — Dining, Nightlife, Cars, Jets, Yachts, Wellness | Alfred",
    description:"Browse Alfred's curated catalog of luxury experiences. Michelin restaurants, VIP nightlife, exotic car rentals, private jet charters, yacht charters and wellness spas in Miami, Paris, Dubai and London.",
    keywords:"luxury experiences, luxury catalog, Miami restaurants, Miami nightlife, exotic car rental, private jet, yacht charter, wellness spa, luxury concierge catalog",
    path:"/catalog"
  },
  dining:{
    title:"Best Restaurants in Miami & Paris — Michelin Dining Reservations | Alfred",
    description:"Book the best restaurants in Miami and Paris through Alfred Concierge. Michelin-starred dining, impossible reservations, private dining rooms, waterfront tables. Over 200 curated venues. Real concierge, instant confirmation.",
    keywords:"best restaurants Miami, best restaurants Paris, Michelin restaurants Miami, Michelin restaurants Paris, restaurant reservations Miami, impossible reservations, private dining Miami, fine dining Miami, luxury restaurants, Miami restaurant booking, concierge restaurant reservations",
    path:"/catalog/dining"
  },
  nightlife:{
    title:"VIP Nightlife Miami & Paris — Tables at LIV, E11even, Raspoutine | Alfred",
    description:"Book VIP tables and bottle service at the best nightclubs. LIV Miami, E11even, Story, Club Space, Hyde Beach, Raspoutine Paris, Castel, L'Arc, CoCo Club. Guestlists, table reservations and VIP access through Alfred Concierge.",
    keywords:"LIV Miami table, LIV Miami VIP, E11even Miami, E11even VIP table, Story Miami, Club Space Miami, Hyde Beach Miami, Raspoutine Paris, Castel Paris, nightclub tables Miami, VIP nightlife Miami, bottle service Miami, nightclub reservations, VIP tables Paris, Miami nightclub booking, best nightclubs Miami, best nightclubs Paris",
    path:"/catalog/nightlife"
  },
  exoticCars:{
    title:"Exotic Car Rental Miami — Ferrari, Lamborghini, Rolls Royce | Alfred",
    description:"Rent Ferrari, Lamborghini, Rolls Royce, McLaren, Porsche and luxury supercars in Miami. Delivered to your door. Daily, weekly and monthly rentals. Insurance included. Browse our full exotic car catalog.",
    keywords:"exotic car rental Miami, Ferrari rental Miami, Lamborghini rental Miami, Rolls Royce rental Miami, McLaren rental Miami, Porsche rental Miami, supercar rental Miami, luxury car rental Miami, exotic car hire, sports car rental Miami, car rental Miami Beach, exotic car rental near me, rent a Ferrari, rent a Lamborghini, Miami luxury car rental",
    path:"/catalog/exotic-cars"
  },
  jets:{
    title:"Private Jet Charter — Book Private Flights Worldwide | Alfred",
    description:"Charter private jets worldwide through Alfred Concierge. Light jets, midsize, heavy and ultra-long range aircraft. Empty leg deals. Miami, New York, London, Paris, Dubai and beyond. Instant quotes.",
    keywords:"private jet charter, private jet rental, charter a private jet, private flight, private jet Miami, private jet hire, empty leg flights, private aviation, luxury jet charter, private jet cost, book private jet, private plane charter",
    path:"/catalog/jets"
  },
  yachts:{
    title:"Yacht Charter Miami — Luxury Boat Rental & Yacht Hire | Alfred",
    description:"Charter luxury yachts in Miami, the French Riviera, Ibiza and Monaco. From 30ft day boats to 100ft+ superyachts. Full crew, catering and water toys included. Book through Alfred Concierge.",
    keywords:"yacht charter Miami, yacht rental Miami, boat rental Miami, luxury yacht charter, yacht hire Miami, boat charter Miami, Miami yacht, superyacht charter, day boat rental Miami, Biscayne Bay yacht, yacht rental near me, party boat Miami, Miami boat party",
    path:"/catalog/yachts"
  },
  wellness:{
    title:"Luxury Wellness & Spa — Best Spas in Miami & Paris | Alfred",
    description:"Book premium wellness experiences through Alfred. Luxury spas, personal training, facials, wellness retreats in Miami and Paris. Curated selection of the best wellness venues.",
    keywords:"best spa Miami, luxury spa Miami, wellness Miami, personal trainer Miami, facial Miami, spa booking, wellness retreat, spa Paris, luxury wellness, best spa near me",
    path:"/catalog/wellness"
  },
  business:{
    title:"Partner with Alfred — List Your Venue or Service | Alfred Concierge",
    description:"Join Alfred's curated concierge platform. List your restaurant, nightclub, car rental, yacht, jet or wellness venue. Access high-value clientele. Zero upfront cost. Apply to become an Alfred partner.",
    keywords:"concierge partner, list venue, restaurant partner program, luxury venue listing, Alfred partner, Alfred business",
    path:"/business"
  }
};
