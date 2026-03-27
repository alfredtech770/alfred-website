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
    path:"/events",
    jsonLd:[
      {"@context":"https://schema.org","@type":"ItemList","name":"Alfred Concierge Featured Events 2026","description":"VIP hospitality packages for the world's most exclusive events in 2026.","itemListElement":[{"@type":"ListItem","position":1,"name":"Monaco Grand Prix 2026","url":"https://alfredconcierge.app/events/monaco-grand-prix"},{"@type":"ListItem","position":2,"name":"Miami Grand Prix 2026","url":"https://alfredconcierge.app/events/miami-grand-prix"},{"@type":"ListItem","position":3,"name":"Ibiza Opening 2026","url":"https://alfredconcierge.app/events/ibiza-opening"},{"@type":"ListItem","position":4,"name":"Roland Garros 2026","url":"https://alfredconcierge.app/events/roland-garros"},{"@type":"ListItem","position":5,"name":"Royal Ascot 2026","url":"https://alfredconcierge.app/events/royal-ascot"}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Events","item":"https://alfredconcierge.app/events"}]}
    ]
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
    path:"/catalog",
    jsonLd:[
      {"@context":"https://schema.org","@type":"ItemList","name":"Alfred Concierge — Luxury Catalog","description":"Curated luxury experiences in Miami, Paris, Dubai and London. Dining, nightlife, exotic cars, private jets, yachts and wellness.","itemListElement":[{"@type":"ListItem","position":1,"name":"Dining","url":"https://alfredconcierge.app/catalog/dining"},{"@type":"ListItem","position":2,"name":"Nightlife","url":"https://alfredconcierge.app/catalog/nightlife"},{"@type":"ListItem","position":3,"name":"Exotic Cars","url":"https://alfredconcierge.app/catalog/exotic-cars"},{"@type":"ListItem","position":4,"name":"Private Jets","url":"https://alfredconcierge.app/catalog/jets"},{"@type":"ListItem","position":5,"name":"Yachts","url":"https://alfredconcierge.app/catalog/yachts"},{"@type":"ListItem","position":6,"name":"Wellness","url":"https://alfredconcierge.app/catalog/wellness"}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"}]}
    ]
  },
  dining:{
    title:"Best Restaurants in Miami & Paris — Michelin Dining Reservations | Alfred",
    description:"Book the best restaurants in Miami and Paris through Alfred Concierge. Michelin-starred dining, impossible reservations, private dining rooms, waterfront tables. Over 200 curated venues. Real concierge, instant confirmation.",
    keywords:"best restaurants Miami, best restaurants Paris, Michelin restaurants Miami, Michelin restaurants Paris, restaurant reservations Miami, impossible reservations, private dining Miami, fine dining Miami, luxury restaurants, Miami restaurant booking, concierge restaurant reservations",
    path:"/catalog/dining",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"Restaurant Reservations — Alfred Concierge","description":"Book the best restaurants in Miami and Paris through Alfred Concierge. Michelin-starred dining, impossible reservations, private dining rooms and waterfront tables. Over 200 curated venues.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"Restaurant Reservations","areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Paris"},{"@type":"City","name":"Dubai"},{"@type":"City","name":"London"}],"url":"https://alfredconcierge.app/catalog/dining"},
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I book a restaurant through Alfred?","acceptedAnswer":{"@type":"Answer","text":"Contact Alfred via WhatsApp or the app. Share your date, time, party size, and preferred venue. Alfred confirms the reservation instantly for members, or within the hour for requests."}},{"@type":"Question","name":"Can Alfred get last-minute restaurant reservations?","acceptedAnswer":{"@type":"Answer","text":"Yes. Alfred Concierge specialises in impossible and last-minute reservations at fully-booked venues. Platinum and Centurion members have priority access."}},{"@type":"Question","name":"Which restaurants does Alfred cover?","acceptedAnswer":{"@type":"Answer","text":"Alfred covers 200+ curated venues in Miami and Paris, including Michelin-starred restaurants, waterfront dining, and members-only establishments."}}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Dining","item":"https://alfredconcierge.app/catalog/dining"}]}
    ]
  },
  nightlife:{
    title:"VIP Nightlife Miami & Paris — Tables at LIV, E11even, Raspoutine | Alfred",
    description:"Book VIP tables and bottle service at the best nightclubs. LIV Miami, E11even, Story, Club Space, Hyde Beach, Raspoutine Paris, Castel, L'Arc, CoCo Club. Guestlists, table reservations and VIP access through Alfred Concierge.",
    keywords:"LIV Miami table, LIV Miami VIP, E11even Miami, E11even VIP table, Story Miami, Club Space Miami, Hyde Beach Miami, Raspoutine Paris, Castel Paris, nightclub tables Miami, VIP nightlife Miami, bottle service Miami, nightclub reservations, VIP tables Paris, Miami nightclub booking, best nightclubs Miami, best nightclubs Paris",
    path:"/catalog/nightlife",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"VIP Nightlife — Alfred Concierge","description":"Book VIP tables and bottle service at LIV Miami, E11even, Story, Club Space, Raspoutine Paris, Castel, L'Arc and more. Skip the line with Alfred Concierge.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"VIP Nightlife Reservations","areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Paris"}],"url":"https://alfredconcierge.app/catalog/nightlife"},
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How much does a VIP table at LIV Miami cost?","acceptedAnswer":{"@type":"Answer","text":"VIP tables at LIV Miami typically start at $2,000 minimum spend on weekdays and $5,000+ on weekends with headliners. Alfred Concierge negotiates reduced minimums and guaranteed placement for members."}},{"@type":"Question","name":"Can Alfred get me into E11even Miami?","acceptedAnswer":{"@type":"Answer","text":"Yes. Alfred Concierge has direct relationships with E11even Miami. Members get guestlist access, VIP table placement, and reduced minimum spends."}},{"@type":"Question","name":"What nightclubs does Alfred cover in Paris?","acceptedAnswer":{"@type":"Answer","text":"Alfred covers Raspoutine, Castel, L'Arc, CoCo Club, and other top Paris venues. VIP table booking, guestlist access, and artist meet & greets available."}}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Nightlife","item":"https://alfredconcierge.app/catalog/nightlife"}]}
    ]
  },
  exoticCars:{
    title:"Exotic Car Rental Miami — Ferrari, Lamborghini, Rolls Royce | Alfred",
    description:"Rent Ferrari, Lamborghini, Rolls Royce, McLaren, Porsche and luxury supercars in Miami. Delivered to your door. Daily, weekly and monthly rentals. Insurance included. Browse our full exotic car catalog.",
    keywords:"exotic car rental Miami, Ferrari rental Miami, Lamborghini rental Miami, Rolls Royce rental Miami, McLaren rental Miami, Porsche rental Miami, supercar rental Miami, luxury car rental Miami, exotic car hire, sports car rental Miami, car rental Miami Beach, exotic car rental near me, rent a Ferrari, rent a Lamborghini, Miami luxury car rental",
    path:"/catalog/exotic-cars",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"Exotic Car Rental — Alfred Concierge","description":"Rent Ferrari, Lamborghini, Rolls Royce, McLaren, Porsche and luxury supercars in Miami. Delivered to your door with insurance included. From $800/day.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"Exotic Car Rental","areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Paris"},{"@type":"City","name":"Dubai"}],"offers":{"@type":"AggregateOffer","lowPrice":"800","highPrice":"5000","priceCurrency":"USD"},"url":"https://alfredconcierge.app/catalog/exotic-cars"},
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How much does it cost to rent an exotic car in Miami?","acceptedAnswer":{"@type":"Answer","text":"Exotic car rentals in Miami through Alfred Concierge start at $800/day for sports cars like the Porsche 911, up to $5,000/day for ultra-luxury vehicles like the Rolls Royce Cullinan. Ferrari and Lamborghini rentals typically range from $1,200 to $2,500/day. Full insurance is always included."}},{"@type":"Question","name":"Does Alfred deliver exotic cars to my hotel in Miami?","acceptedAnswer":{"@type":"Answer","text":"Yes. Alfred Concierge delivers every car directly to your hotel, residence, or airport in Miami. White-glove handover with full walkthrough included."}},{"@type":"Question","name":"What exotic cars can I rent in Miami through Alfred?","acceptedAnswer":{"@type":"Answer","text":"Alfred offers Ferrari, Lamborghini, Rolls Royce, McLaren, Porsche, Bentley, Mercedes AMG, and more. The full catalog is available in the Alfred app."}}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Exotic Cars","item":"https://alfredconcierge.app/catalog/exotic-cars"}]}
    ]
  },
  jets:{
    title:"Private Jet Charter — Book Private Flights Worldwide | Alfred",
    description:"Charter private jets worldwide through Alfred Concierge. Light jets, midsize, heavy and ultra-long range aircraft. Empty leg deals. Miami, New York, London, Paris, Dubai and beyond. Instant quotes.",
    keywords:"private jet charter, private jet rental, charter a private jet, private flight, private jet Miami, private jet hire, empty leg flights, private aviation, luxury jet charter, private jet cost, book private jet, private plane charter",
    path:"/catalog/jets",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"Private Jet Charter — Alfred Concierge","description":"Charter private jets worldwide through Alfred Concierge. Light jets, midsize, heavy and ultra-long range aircraft. Empty leg deals available. Instant quotes from Miami, Paris, Dubai and London.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"Private Jet Charter","areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Paris"},{"@type":"City","name":"Dubai"},{"@type":"City","name":"London"}],"url":"https://alfredconcierge.app/catalog/jets"},
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How much does it cost to charter a private jet from Miami?","acceptedAnswer":{"@type":"Answer","text":"Private jet charters from Miami start at approximately $3,500/hour for light jets, $6,000/hour for midsize jets, and $10,000+ per hour for heavy jets. Miami to New York on a light jet is typically $15,000–$25,000. Alfred Concierge provides instant quotes."}},{"@type":"Question","name":"How quickly can Alfred arrange a private jet?","acceptedAnswer":{"@type":"Answer","text":"Alfred Concierge can arrange private jet charters within 2–4 hours for standard requests. Same-day departures are available for Platinum and Centurion members."}},{"@type":"Question","name":"Does Alfred offer empty leg flights?","acceptedAnswer":{"@type":"Answer","text":"Yes. Alfred sources empty leg deals which can reduce charter costs by 50–75%. Available routes are shown in the catalog and update daily."}}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Jets","item":"https://alfredconcierge.app/catalog/jets"}]}
    ]
  },
  yachts:{
    title:"Yacht Charter Miami — Luxury Boat Rental & Yacht Hire | Alfred",
    description:"Charter luxury yachts in Miami, the French Riviera, Ibiza and Monaco. From 30ft day boats to 100ft+ superyachts. Full crew, catering and water toys included. Book through Alfred Concierge.",
    keywords:"yacht charter Miami, yacht rental Miami, boat rental Miami, luxury yacht charter, yacht hire Miami, boat charter Miami, Miami yacht, superyacht charter, day boat rental Miami, Biscayne Bay yacht, yacht rental near me, party boat Miami, Miami boat party",
    path:"/catalog/yachts",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"Yacht Charter — Alfred Concierge","description":"Charter luxury yachts in Miami, the French Riviera, Ibiza and Monaco. From 30ft day boats to 100ft+ superyachts. Full crew, catering and water toys included.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"Yacht Charter","areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Ibiza"},{"@type":"City","name":"Monaco"}],"offers":{"@type":"AggregateOffer","lowPrice":"800","highPrice":"25000","priceCurrency":"USD"},"url":"https://alfredconcierge.app/catalog/yachts"},
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How much does it cost to charter a yacht in Miami?","acceptedAnswer":{"@type":"Answer","text":"Yacht charters in Miami through Alfred Concierge start at $800 for a 4-hour charter on a 40ft boat, up to $25,000+ per day for superyachts over 100ft. Most day charters for groups of 10–20 cost $2,000–$6,000. Crew and fuel are included."}},{"@type":"Question","name":"How many people can go on a yacht charter?","acceptedAnswer":{"@type":"Answer","text":"Alfred's Miami fleet accommodates groups from 2 to 100+ guests. Day boats fit 10–20 people; mid-range yachts fit 20–40 guests; superyachts accommodate larger groups with full crew."}},{"@type":"Question","name":"What is included in a yacht charter through Alfred?","acceptedAnswer":{"@type":"Answer","text":"Alfred yacht charters include a full professional crew, fuel, insurance, water toys (jet skis, paddleboards, snorkel gear), and catering options. A personal concierge coordinates all details."}}]},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},{"@type":"ListItem","position":3,"name":"Yachts","item":"https://alfredconcierge.app/catalog/yachts"}]}
    ]
  },
  wellness:{
    title:"Luxury Wellness & Spa — Best Spas in Miami & Paris | Alfred",
    description:"Book premium wellness experiences through Alfred. Luxury spas, personal training, facials, wellness retreats in Miami and Paris. Curated selection of the best wellness venues.",
    keywords:"best spa Miami, luxury spa Miami, wellness Miami, personal trainer Miami, facial Miami, spa booking, wellness retreat, spa Paris, luxury wellness, best spa near me",
    path:"/catalog/wellness",
    jsonLd:[
      {"@context":"https://schema.org","@type":"Service","name":"Luxury Wellness & Spa — Alfred Concierge","description":"Book premium wellness experiences in Miami and Paris through Alfred Concierge. Luxury spas, personal training, facials, and wellness retreats at Canyon Ranch, Four Seasons, Dior Spa, and more.","provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"},"serviceType":"Luxury Wellness & Spa Bookings","areaServed":[{"@type":"City","name":"Miami"},{"@type":"City","name":"Paris"}],"url":"https://alfredconcierge.app/catalog/wellness"},
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
