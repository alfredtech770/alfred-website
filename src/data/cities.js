function serviceSchema(name,slug,areaType){
  return {
    "@context":"https://schema.org",
    "@type":"Service",
    "name":"Alfred Concierge requests in "+name,
    "description":"A human concierge service for requesting restaurants, hotels, transport and experiences in "+name+". Availability and final terms are confirmed for each request.",
    "url":"https://alfredconcierge.app/city/"+slug,
    "serviceType":"Concierge request coordination",
    "areaServed":{"@type":areaType||"City","name":name},
    "provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app/"}
  };
}

function services(city){
  return [
    {name:"Restaurant requests",desc:"Ask for a table by date, time, party size and dining style in "+city+".",icon:"🍽️"},
    {name:"Hotel requests",desc:"Compare listed stays and request current room options and terms.",icon:"🏨"},
    {name:"Nightlife requests",desc:"Request current table or guest-list options, subject to venue approval.",icon:"🍾"},
    {name:"Exotic cars",desc:"Request a vehicle by model, dates and delivery area; final terms vary by supplier.",icon:"🏎️"},
    {name:"Jets and yachts",desc:"Ask for charter options based on route, date, passengers or group size.",icon:"✈️"},
    {name:"Wellness",desc:"Request treatments and appointments from the current Alfred catalog.",icon:"🧘"},
  ];
}

function catalogLinks(city){
  var query="?city="+encodeURIComponent(city);
  return [
    {name:"Restaurants in "+city,desc:"Browse listed restaurants and request a table.",link:"/catalog/dining"+query},
    {name:"Hotels in "+city,desc:"Browse listed hotels and request current stay options.",link:"/catalog/hotels"+query},
    {name:"Nightlife in "+city,desc:"Browse current venue listings and request options.",link:"/catalog/nightlife"+query},
    {name:"Cars in "+city,desc:"Browse listed vehicles and request current supplier availability.",link:"/catalog/exotic-cars"+query},
    {name:"Yachts in "+city,desc:"Browse listed vessels and request current charter options.",link:"/catalog/yachts?location="+encodeURIComponent(city)},
    {name:"Wellness in "+city,desc:"Browse treatments and request current appointments.",link:"/catalog/wellness"+query},
  ];
}

var CITY_GUIDES={
  miami:{
    name:"Miami",
    tagline:"Restaurants, hotels, cars and experiences on request",
    heroDescription:"Browse Alfred's Miami catalog, choose an option or describe what you need, then send your date, party size and preferences to a human concierge. Alfred checks current availability and confirms pricing, deposits and cancellation terms before you book.",
    aboutSections:[
      {title:"Choose the right area",body:"South Beach suits beach access and nightlife, Brickell is convenient for dining and business, and the Design District is useful for shopping and restaurants. Tell Alfred where you are staying so travel time can be considered."},
      {title:"Request dining and nightlife",body:"Share your preferred date, time range, party size, budget and atmosphere. Alfred checks the venues currently listed and can suggest alternatives when a first choice is unavailable."},
      {title:"Add transport or a charter",body:"Vehicle, yacht and aviation requests require dates, pickup or route details and guest count. Supplier availability, insurance, deposits, inclusions and final price are confirmed before commitment."},
    ],
    services:services("Miami"),venues:catalogLinks("Miami"),
    faqs:[
      {q:"How do I request a restaurant in Miami?",a:"Choose a restaurant or describe the cuisine and area you want, then send Alfred the date, time range and party size. The concierge checks current availability before confirming anything."},
      {q:"Can Alfred guarantee a Miami reservation?",a:"No. Restaurants and venues control their own availability. Alfred coordinates the request and proposes alternatives when needed."},
      {q:"Can I request a car, yacht or jet in Miami?",a:"Yes. Send the dates, route or pickup area, passenger count and preferences. The relevant supplier confirms availability, insurance, deposits, inclusions and final pricing."},
      {q:"Are prices on the city page final?",a:"No. Prices and terms can change by date and supplier. Alfred confirms the current total and conditions before you approve a booking."},
    ],
    keywords:"concierge Miami, restaurant requests Miami, hotel requests Miami, exotic car requests Miami, yacht charter requests Miami",
    jsonLdData:serviceSchema("Miami","miami"),
  },
  paris:{
    name:"Paris",
    tagline:"Dining, hotels and tailored requests across Paris",
    heroDescription:"Use Alfred to browse Paris restaurants, hotels, nightlife and wellness, then send your date, party size and preferences to a human concierge. Current availability and all final terms are confirmed with the provider.",
    aboutSections:[
      {title:"Plan by arrondissement",body:"The 1st and 8th are convenient for palace hotels and luxury shopping, Saint-Germain offers a Left Bank base, and the Marais suits galleries and contemporary dining. Location affects travel time, so include your hotel or neighbourhood in the request."},
      {title:"Request a restaurant",body:"For high-demand dining, provide flexible dates or time ranges when possible. Alfred checks the current listing and can suggest another restaurant with a similar style if the first option is unavailable."},
      {title:"Confirm every condition",body:"Dress code, deposits, prepaid menus, cancellation rules and access requirements vary by venue. Alfred asks the provider to confirm the relevant conditions before booking."},
    ],
    services:services("Paris"),venues:catalogLinks("Paris"),
    faqs:[
      {q:"How far ahead should I request a Paris restaurant?",a:"Lead times vary by restaurant and date. Send the request as early as practical, but Alfred can still check short-notice options without promising availability."},
      {q:"Can Alfred arrange access to a private members' club?",a:"Access depends on the club's rules, membership requirements and approval. Alfred can check legitimate current options but does not guarantee entry."},
      {q:"Can I request a Paris hotel through Alfred?",a:"Yes. Share dates, guest count, room preferences and budget. Alfred checks current options and confirms the provider's rate and cancellation terms."},
      {q:"Does Alfred publish fixed Paris prices?",a:"No. Restaurant, hotel, transport and experience prices can change. Final pricing is confirmed for the specific request."},
    ],
    keywords:"concierge Paris, restaurant requests Paris, hotel requests Paris, nightlife requests Paris, luxury travel Paris",
    jsonLdData:serviceSchema("Paris","paris"),
  },
  ibiza:{
    name:"Ibiza",
    tagline:"Restaurants, hotels, nightlife and wellness on request",
    heroDescription:"Browse Alfred's Ibiza restaurants, hotels, nightlife and wellness listings, then send your dates, group size and preferences to a human concierge. Availability, seasonal opening dates, deposits and final provider terms are checked for every request.",
    aboutSections:[
      {title:"Choose the right side of the island",body:"Ibiza Town and Marina Botafoch are convenient for restaurants and nightlife, while Santa Eulària suits a quieter base and the west coast is known for sunset locations. Share where you are staying so travel time can be considered."},
      {title:"Plan around the season",body:"Many Ibiza hotels, restaurants and venues operate seasonally or change schedules during the year. Alfred checks whether a listing is open for your dates before presenting it as an option."},
      {title:"Confirm transport and venue terms",body:"Table minimums, deposits, entry policies and transport availability vary by venue and date. Alfred shares the current conditions before you approve a request."},
    ],
    services:services("Ibiza"),venues:catalogLinks("Ibiza"),
    faqs:[
      {q:"Can Alfred request restaurants and nightlife in Ibiza?",a:"Yes. Send the date, preferred area, time range, party size and atmosphere. Each venue controls availability and entry conditions."},
      {q:"Are Ibiza venues open all year?",a:"Not always. Seasonal opening dates and weekly schedules vary, so Alfred checks the venue for the dates in your request."},
      {q:"Can I request an Ibiza hotel or wellness appointment?",a:"Yes. Share your dates, guest count, preferred area and budget. Current rates, availability and cancellation terms are confirmed by the provider."},
      {q:"Does Alfred guarantee entry or a table?",a:"No. The venue makes the final decision. Alfred coordinates the request and can research alternatives when needed."},
    ],
    keywords:"concierge Ibiza, restaurant requests Ibiza, Ibiza nightlife requests, hotel requests Ibiza, wellness Ibiza, luxury travel Ibiza",
    jsonLdData:serviceSchema("Ibiza","ibiza","AdministrativeArea"),
  },
  "saint-tropez":{
    name:"Saint-Tropez",
    tagline:"Hotels, dining and Riviera requests in Saint-Tropez",
    heroDescription:"Use Alfred to browse Saint-Tropez hotel and service listings and send a human concierge your dates, location and preferences. Providers confirm current availability, seasonal schedules, deposits and final terms before booking.",
    aboutSections:[
      {title:"Choose between the village and the beaches",body:"A stay in the village keeps the port and central restaurants close, while the Pampelonne area is better suited to beach plans. Include your accommodation and schedule so transfer time can be considered."},
      {title:"Request early for peak dates",body:"Summer and event periods can create heavy demand. Flexible dates, time ranges or room categories make it easier to return useful alternatives without promising availability."},
      {title:"Review every provider condition",body:"Hotels, restaurants, beach venues and transport suppliers set their own deposits, minimums and cancellation policies. Alfred confirms the applicable conditions before a request is final."},
    ],
    services:services("Saint-Tropez"),venues:catalogLinks("Saint-Tropez"),
    faqs:[
      {q:"Can Alfred request a hotel in Saint-Tropez?",a:"Yes. Share dates, guest count, room preferences, preferred area and budget. The hotel confirms its current rate and cancellation terms."},
      {q:"Can Alfred help with Saint-Tropez dining or beach venues?",a:"Alfred can check current options using your date, party size and preferred atmosphere. The provider controls availability and access conditions."},
      {q:"How far ahead should I make a summer request?",a:"As early as practical. Lead times vary by provider and date, and short-notice options may still be checked without a guarantee."},
      {q:"Are online prices final?",a:"No. Seasonal pricing, deposits and minimums may change. Alfred confirms the current total and terms for the specific request."},
    ],
    keywords:"concierge Saint-Tropez, Saint Tropez hotel requests, restaurant requests Saint Tropez, beach club requests Saint Tropez, French Riviera concierge",
    jsonLdData:serviceSchema("Saint-Tropez","saint-tropez"),
  },
  mykonos:{
    name:"Mykonos",
    tagline:"Hotels, dining and island requests in Mykonos",
    heroDescription:"Browse Alfred's Mykonos listings and send your dates, group size, preferred area and budget to a human concierge. Seasonal openings, current availability, deposits and provider terms are confirmed for each request.",
    aboutSections:[
      {title:"Pick the right base",body:"Mykonos Town is convenient for dining and nightlife, while areas such as Psarou, Ornos and Agios Ioannis suit beach-focused stays. Share your accommodation area so island travel time can be considered."},
      {title:"Allow for seasonal schedules",body:"Hotels and venues may operate only during part of the year or change schedules during the season. Alfred checks current opening information for your dates."},
      {title:"Confirm transfers and booking terms",body:"Island transfers, restaurant requests and hotel stays have provider-specific pricing, deposits and cancellation rules. Those details are shared before approval."},
    ],
    services:services("Mykonos"),venues:catalogLinks("Mykonos"),
    faqs:[
      {q:"Can Alfred request a Mykonos hotel?",a:"Yes. Send your dates, guest count, preferred area, room requirements and budget. The hotel confirms current availability and terms."},
      {q:"Can Alfred coordinate restaurants or nightlife in Mykonos?",a:"Alfred can check relevant providers for your date, time and party size. Availability and entry remain subject to provider approval."},
      {q:"Are all Mykonos listings open year-round?",a:"No. Many operate seasonally, so opening dates are checked for the specific request."},
      {q:"Can Alfred arrange island transport?",a:"A transport request can be coordinated using pickup, destination, date, time and passenger count. The supplier confirms availability and final price."},
    ],
    keywords:"concierge Mykonos, Mykonos hotel requests, restaurant requests Mykonos, Mykonos nightlife requests, luxury travel Mykonos",
    jsonLdData:serviceSchema("Mykonos","mykonos","AdministrativeArea"),
  },
  dubai:{
    name:"Dubai",
    tagline:"Restaurants, hotels, cars and charters on request",
    heroDescription:"Browse Alfred's Dubai catalog and ask a human concierge to check restaurants, hotels, cars, yachts, aviation or wellness for your dates. Providers confirm current availability, local requirements and final terms.",
    aboutSections:[
      {title:"Choose a practical base",body:"Downtown and DIFC are useful for business and dining, while Palm Jumeirah and the marina suit resort stays and waterfront plans. Include your accommodation area so transfers and timing can be considered."},
      {title:"Share the full request",body:"For restaurants and nightlife, include party size, time range and occasion. For vehicles or charters, include dates, route, passenger count and any licence or delivery requirements."},
      {title:"Check local terms",body:"Age rules, identification, dress codes, deposits, insurance and licensing vary by provider and activity. Alfred confirms the applicable conditions before a booking is final."},
    ],
    services:services("Dubai"),venues:catalogLinks("Dubai"),
    faqs:[
      {q:"Can Alfred request restaurants and nightlife in Dubai?",a:"Yes. Send the venue or style you want with your date, time and party size. The provider decides availability and any entry or minimum-spend conditions."},
      {q:"Can I request an exotic car in Dubai?",a:"Yes. Provide the model preference, dates, delivery area and driver details. The supplier confirms eligibility, insurance, deposit and final price."},
      {q:"Can Alfred arrange a Dubai yacht or jet request?",a:"Alfred can coordinate a request using your date, route and passenger count. Aircraft or vessel availability and all inclusions remain subject to supplier confirmation."},
      {q:"Are Dubai prices guaranteed online?",a:"No. Pricing varies by date, provider and specification. Alfred confirms the current quote and terms before you approve it."},
    ],
    keywords:"concierge Dubai, restaurant requests Dubai, hotel requests Dubai, exotic car requests Dubai, yacht charter requests Dubai",
    jsonLdData:serviceSchema("Dubai","dubai"),
  },
  london:{
    name:"London",
    tagline:"Dining, hotels and concierge requests across London",
    heroDescription:"Browse Alfred's London options and send a human concierge your dates, location and preferences. Restaurants, hotels, transport and experiences are requested with the provider, with availability and final conditions confirmed before booking.",
    aboutSections:[
      {title:"Plan around the neighbourhood",body:"Mayfair and Knightsbridge suit luxury hotels and shopping, Soho and Fitzrovia offer dense dining options, and the City is convenient for business. Share your base and schedule so journey times can be considered."},
      {title:"Request dining or nightlife",body:"Provide the venue or atmosphere, preferred date, time range and party size. Alfred checks current options and can suggest an alternative if a venue is unavailable or access rules cannot be met."},
      {title:"Confirm access and transport",body:"Private clubs set their own membership and guest rules. Aviation, chauffeuring and river requests also have supplier-specific conditions. Nothing is represented as confirmed until the relevant provider approves it."},
    ],
    services:services("London"),venues:catalogLinks("London"),
    faqs:[
      {q:"Can Alfred guarantee a London restaurant table?",a:"No. The restaurant controls availability. Alfred coordinates the request and can check alternative times or similar venues."},
      {q:"Can Alfred get me into a private members' club?",a:"Only when a legitimate option exists under the club's current rules. Membership or guest access is never guaranteed."},
      {q:"Can I request a London hotel or chauffeur?",a:"Yes. Send dates, passenger or guest count, locations and preferences. Alfred checks current provider options and confirms final terms."},
      {q:"How are prices confirmed?",a:"The provider supplies the current quote for the requested date and specification. Alfred shares the total, inclusions and cancellation conditions before approval."},
    ],
    keywords:"concierge London, restaurant requests London, hotel requests London, chauffeur requests London, luxury travel London",
    jsonLdData:serviceSchema("London","london"),
  },
};

export default CITY_GUIDES;
