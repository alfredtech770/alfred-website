import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { T as BT, type as bType } from "../lib/brand";
import {
  SectionHeader as BSectionHeader, GlassCard as BGlassCard,
  SilverText as BSilverText, useReveal as bUseReveal, revealStyle as bRevealStyle
} from "../components/brand";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

var CITIES={
  miami:{
    name:"Miami",
    tagline:"The World's Premier Destination for Luxury & Nightlife",
    heroDescription:"Alfred gives you access to Miami's most exclusive restaurants, VIP nightclubs, exotic supercars, private jets, and luxury yachts. From impossible dining reservations at Stubborn Seed and Juvia to table service at LIV and E11even, Alfred connects you to the lifestyle. Whether you're navigating Wynwood, South Beach, or Coral Gables, your personal concierge is available 24/7.",
    aboutSections:[
      {title:"The neighbourhoods that matter",body:"Miami is functionally five cities laid end-to-end along Biscayne Bay, and the neighbourhood you base from materially shapes the trip. South Beach (Ocean Drive, Collins, Washington) is where the legendary nightlife sits — LIV, Story, E11even, Mynt — and where the historic Art Deco hotels (the Faena, the Setai, the Edition) cluster. Brickell is the financial district turned restaurant capital, with Komodo, Cipriani, Sexy Fish, La Mar, and the city's best skyline views. The Design District is luxury retail and Michelin dining (L'Atelier de Joël Robuchon, Le Jardinier, ZZ's Club). Wynwood is street art, design-led restaurants and live music. Coconut Grove and Coral Gables are the residential luxury zones — quieter, with Ariete and Boia De respectively. Alfred members typically split between South Beach (for atmosphere) and Brickell (for restaurants) depending on the trip's priority."},
      {title:"The dining scene, ranked by occasion",body:"For impressing a date or a client: Carbone Miami Beach (Major Food Group's Italian-American showpiece), Casa Tua South Beach (Tuscan, members-only feel), or Le Jardinier in the Design District (one Michelin star, French gardens to a tee). For the social occasion: Komodo Brickell, Papi Steak South Beach, Swan in the Design District. For Michelin precision: ZZ's Club Members Only, Stubborn Seed Midtown (Top Chef-winner Jeremy Ford), Boia De Buena Vista. For waterfront: Joia Beach Watson Island, Baia Beach Club, Casa Tua Cucina. Alfred handles bookings at all of these including the impossible cases — Carbone same-week, ZZ's first-time visitors, Casa Tua at peak season — through direct relationships with the management."},
      {title:"After dark, in detail",body:"LIV at the Fontainebleau is the legendary main room, hosting DJ Khaled's residency, regular sets from David Guetta, Tiësto, and Diplo, and the F1 takeover during the Miami Grand Prix weekend. E11even is the only 24-hour ultra-club in the country, with international touring DJs and headline talent (Travis Scott, Drake, Bad Bunny appearances are not uncommon). Story sits between the two with a more curated booking. Hyde Beach at the SLS is the daytime pool-party version. Club Space in Downtown is the after-hours destination — house and techno from 11pm through to noon the following day. Mynt is the boutique smaller-room option. Alfred secures VIP tables at all of these with reduced minimums, no advance payment requirements, and host introductions."},
      {title:"Logistics: airports, transfers, when to come",body:"Miami International (MIA) is the main commercial gateway, with the city's best private terminal at Signature MIA. For private aviation, Opa-Locka Executive (OPF) is the FBO of choice — closer to South Beach (15 min) and quieter than MIA. Fort Lauderdale-Hollywood (FLL) is 45 minutes north and useful for Caribbean connections. Best months: November-April (peak season, with December for Art Basel and February for the South Beach Wine & Food Festival). Avoid August-September (peak hurricane season). Alfred coordinates ground transfers from any airport, FBO, or marina in under 20 minutes notice for Platinum members."}
    ],
    services:[
      {name:"Fine Dining",desc:"Michelin-starred restaurants & impossible reservations",icon:"🍽️"},
      {name:"Nightlife & Tables",desc:"VIP access to LIV, E11even, Story & exclusive clubs",icon:"🍾"},
      {name:"Exotic Cars",desc:"Ferrari, Lamborghini & McLaren rentals, daily to monthly",icon:"🏎️"},
      {name:"Private Jets",desc:"Light to ultra-long range flights, empty leg deals available",icon:"✈️"},
      {name:"Yacht Charters",desc:"Superyachts & day boats in Biscayne Bay & Caribbean",icon:"⛵"},
      {name:"Wellness & Spa",desc:"Premium spas, personal training, treatments & retreats",icon:"🧘"}
    ],
    venues:[
      {name:"Stubborn Seed",desc:"James Beard Award-winning restaurant in Midtown Miami",link:"/catalog/dining/stubborn-seed"},
      {name:"Juvia",desc:"Peruvian-Japanese fusion with rooftop views in Wynwood",link:"/catalog/dining/juvia"},
      {name:"LIV Miami",desc:"South Beach's most exclusive nightclub with A-list guests",link:"/catalog/nightlife/liv-miami"},
      {name:"E11even Miami",desc:"World-class entertainment & bottle service downtown",link:"/catalog/nightlife/e11even-miami"},
      {name:"Miami Dolphins Stadium",desc:"Sports & entertainment venue in downtown Miami",link:"/catalog/events/miami-dolphins"}
    ],
    faqs:[
      {q:"How do I get a reservation at the best restaurants in Miami?",a:"Alfred's concierge team has direct relationships with Miami's top restaurants including Stubborn Seed, Juvia, and Casa Tua. We secure impossible reservations and can often accommodate last-minute requests. Book through the app or contact us on WhatsApp."},
      {q:"What's the average cost of VIP table service at LIV or E11even?",a:"VIP tables at LIV typically start at $2,500-$5,000 depending on night and party size. E11even ranges $2,000-$4,000. Bottle minimums apply. Pricing varies by day—weekends command premium rates. Contact us for current pricing."},
      {q:"Can I rent a Ferrari in Miami for just one day?",a:"Yes, absolutely. Alfred offers daily Ferrari, Lamborghini, McLaren and Rolls Royce rentals starting at 1 day. Vehicles are delivered to your hotel or residence. Insurance is included. Rates start around $800-$2,000 per day depending on model."},
      {q:"Are private jets available for same-day charter?",a:"For light jets within Florida, yes. For longer routes, we typically need 24-48 hours notice. Empty leg deals offer significant savings. Empty legs are flights that would otherwise return empty. Our team can usually find options within your budget."},
      {q:"What's included in a Miami yacht charter?",a:"Our yachts include a professional captain, crew, fuel, and liability insurance. Catering, water toys (jet skis, paddle boards), and spa services can be added. Rates range from $2,000-$15,000+ per day depending on vessel size and crew."}
    ],
    keywords:"luxury concierge miami, miami concierge service, best restaurants miami, exotic car rental miami, VIP nightlife miami, yacht charter miami, Miami fine dining, LIV Miami VIP, E11even Miami, Miami nightclubs, Miami luxury services, Miami private jet, Miami yacht rental",
    jsonLdData:{
      "@context":"https://schema.org",
      "@type":"LocalBusiness",
      "name":"Alfred Concierge — Miami Luxury Services",
      "description":"Premium luxury concierge service in Miami offering fine dining reservations, VIP nightlife access, exotic car rentals, private jet charters, and yacht rentals.",
      "url":"https://alfredconcierge.app/city/miami",
      "telephone":"+1-800-ALFRED-1",
      "areaServed":{"@type":"City","name":"Miami, Florida"},
      "address":{"@type":"PostalAddress","streetAddress":"South Beach, Miami","addressLocality":"Miami","addressRegion":"FL","postalCode":"33139","addressCountry":"US"},
      "openingHoursSpecification":{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"00:00","closes":"23:59"},
      "image":"https://alfredconcierge.app/og-image.jpg",
      "priceRange":"$$$$$"
    }
  },
  paris:{
    name:"Paris",
    tagline:"The City of Light Meets Luxury Concierge Excellence",
    heroDescription:"Alfred elevates your Paris experience with access to Michelin three-star restaurants, legendary nightclubs like Raspoutine and Castel, private jet charters to the French Riviera, and bespoke wellness experiences. From intimate tables at L'Astrance to VIP bottle service on the Left Bank, Alfred's concierge team speaks your language and knows Paris like locals. Discover neighborhoods from Marais to the 8th Arrondissement.",
    aboutSections:[
      {title:"The neighbourhoods that matter",body:"Paris is the most neighbourhood-defined of Alfred's four cities — where you base from shapes which restaurants, nightclubs, and shops are within walking distance and which require a 25-minute crosstown car. The 1st arrondissement (Louvre, Tuileries, Place Vendôme) is luxury hotel territory: the Costes group, the Crillon, the Ritz, the Mandarin Oriental. The 8th (Champs-Élysées, Faubourg Saint-Honoré, Triangle d'Or) is the high-end shopping spine and home to the most heavily-trafficked nightclubs (L'Arc, Manko, Raspoutine). The 16th and 17th are residential luxury — quieter, with the best private members' clubs and old-money restaurants. Saint-Germain (6th, 7th) is the literary-luxury combination — Café de Flore, Les Deux Magots, the Hôtel Lutetia, the Bon Marché. Le Marais (3rd, 4th) is contemporary art, fashion, and design-led restaurants. Most Alfred members stay in the 1st or 8th."},
      {title:"The dining scene, ranked by occasion",body:"For three-star Michelin: Le Cinq at the Four Seasons George V (Christian Le Squer's three stars since 2016), L'Ambroisie on Place des Vosges (Bernard Pacaud, three stars since 1986, the most traditional of the elite), Plénitude at the Cheval Blanc (Arnaud Donckele, the newer arrival), Epicure at Le Bristol (Eric Frechon). For modern French and bistronomy: Septime (Bertrand Grébaut, the Saint Sébastien neighbour Clamato is the casual sister), L'Arpège (Alain Passard's vegetable-focused three-star), Frenchie (Grégory Marchand, the rue du Nil cluster). For occasion dining: Girafe at Trocadéro (Eiffel Tower views, Italian-Mediterranean), Le Jules Verne (in the Eiffel Tower itself), Pavyllon (Yannick Alléno's Champs-Élysées spot). Alfred holds inventory at the three-star tier and handles the casual difficult cases (Septime is famously hard to book) through direct relationships."},
      {title:"After dark, in detail",body:"Paris nightlife is structured around private members' venues rather than the open-format superclubs you find in Miami or Ibiza. Raspoutine on rue de Ponthieu is the most internationally-known — a tightly-curated room that runs late, hosts visiting DJs and celebrity drop-ins, and operates a strict door. Castel in Saint-Germain is the older, more establishment counterpart — restaurant, bar, basement nightclub, members-only with guests on the list. L'Arc on the Champs is the contemporary equivalent — louder, larger, broader booking. CoCo Club is the newer arrival on rue du Faubourg Saint-Honoré with strong early-week programming. Le Montana, Silencio, Le Bain, Le Baron — all worth knowing. Alfred secures table placement and door access at all of these for members."},
      {title:"Logistics: airports, transfers, when to come",body:"Paris-Charles de Gaulle (CDG) is the commercial gateway, 35-50 minutes from central Paris depending on traffic. Le Bourget (LBG) is the city's primary FBO and the most-used private aviation airport in Europe — 25 minutes from the 8th. Orly (ORY) is the secondary commercial airport, useful for southern Europe routes. Best months: April-June (spring) and September-October (autumn) for weather and atmosphere. July-August empties as Parisians leave for the south — many top restaurants close, but the city's quieter feel suits some members. December has the holiday lighting; January is the quietest. Avoid Fashion Week dates (late February, late September) unless that's the reason for the trip."}
    ],
    services:[
      {name:"Michelin Dining",desc:"3-star restaurants & exclusive chef's tables across Paris",icon:"🍽️"},
      {name:"VIP Nightclubs",desc:"Raspoutine, Castel, L'Arc & exclusive Paris nightlife",icon:"🍾"},
      {name:"Private Jets",desc:"Flights to Lyon, Monaco, London & Swiss Alps",icon:"✈️"},
      {name:"Luxury Spas",desc:"Treatments at Four Seasons, Ritz & boutique wellness",icon:"🧘"},
      {name:"Fashion & Shopping",desc:"VIP access to haute couture boutiques & private showings",icon:"👗"},
      {name:"River Cruises",desc:"Private Seine cruises & yacht experiences on waterways",icon:"⛵"}
    ],
    venues:[
      {name:"L'Astrance",desc:"Three Michelin stars in the 7th, innovative French cuisine",link:"/catalog/dining/lastrance"},
      {name:"Raspoutine",desc:"Legendary nightclub on Rue de Ponthieu with A-list clientele",link:"/catalog/nightlife/raspoutine"},
      {name:"Castel",desc:"Historic members club with nightclub, restaurant & bar",link:"/catalog/nightlife/castel"},
      {name:"Ritz Paris Spa",desc:"Luxurious spa experience at the iconic Ritz hotel",link:"/catalog/wellness/ritz-spa"},
      {name:"Musée de Louvre",desc:"Curated private tours and exclusive after-hours access",link:"/catalog/events/louvre-private"}
    ],
    faqs:[
      {q:"How do I get a reservation at L'Astrance or other 3-star Michelin restaurants?",a:"Alfred has established relationships with Paris's most prestigious restaurants including L'Astrance, Le Jules Verne, and Guy Savoy. We book months in advance and handle all arrangements in French. Premium rates apply for high-demand dates."},
      {q:"What's the dress code for Raspoutine or Castel?",a:"Raspoutine and Castel maintain strict dress codes: no sportswear, trainers, or casual beach wear. Men: jacket required. Women: elegant attire. VIP guests are given some flexibility. Alfred ensures you're on the guest list and briefed on expectations."},
      {q:"Can I arrange private tours of the Louvre or other museums?",a:"Yes. Alfred coordinates exclusive after-hours museum access and private curator-led tours. These typically cost €3,000-€8,000 per group and require 2-4 weeks advance booking. Book early during high season."},
      {q:"Are private jets available for Paris to Monaco flights?",a:"Absolutely. Light to midsize jets charter regularly between Paris and Monaco (1hr flight). Rates range €8,000-€15,000 each way. Return trips offer better value. Empty legs sometimes available for €4,000-€6,000."},
      {q:"What wellness experiences would you recommend for a spa day in Paris?",a:"We recommend the Ritz Spa (luxury, historic), Four Seasons George V (modern wellness), or boutique spas like Sothys in the Marais. Treatments range €150-€400. Book 1-2 weeks ahead. We also arrange personal trainers and nutritionists."}
    ],
    keywords:"luxury concierge paris, paris concierge service, best restaurants paris, VIP nightlife paris, Michelin restaurants Paris, Raspoutine Paris, Castel nightclub, Paris fine dining, Paris luxury services, L'Astrance Paris, Paris private jet, luxury spa Paris",
    jsonLdData:{
      "@context":"https://schema.org",
      "@type":"LocalBusiness",
      "name":"Alfred Concierge — Paris Luxury Services",
      "description":"Exclusive luxury concierge service in Paris offering Michelin dining, VIP nightclub access, private jet charters, and bespoke wellness experiences.",
      "url":"https://alfredconcierge.app/city/paris",
      "telephone":"+33-1-ALFRED-1",
      "areaServed":{"@type":"City","name":"Paris, France"},
      "address":{"@type":"PostalAddress","streetAddress":"8th Arrondissement, Paris","addressLocality":"Paris","addressRegion":"Île-de-France","postalCode":"75008","addressCountry":"FR"},
      "openingHoursSpecification":{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"00:00","closes":"23:59"},
      "image":"https://alfredconcierge.app/og-image.jpg",
      "priceRange":"$$$$$"
    }
  },
  dubai:{
    name:"Dubai",
    tagline:"The Pinnacle of Luxury in the Middle East",
    heroDescription:"Alfred unlocks Dubai's most exclusive experiences—from Michelin-dining at Nobu and Zuma to VIP access at Cavalli Club and Omnia, state-of-the-art supercars, private jet charters across the Gulf, and ultra-luxury yacht charters in the Arabian Gulf. Navigate the Palm Jumeirah, Downtown Dubai, and Business Bay with a 24/7 concierge who speaks Arabic, English, French, and beyond.",
    aboutSections:[
      {title:"The neighbourhoods that matter",body:"Dubai is the most architecturally-distributed of Alfred's four cities — luxury sits in pockets along a 40-kilometre arc rather than a dense centre. Downtown Dubai (Burj Khalifa, Dubai Mall, Dubai Opera) is the contemporary tourist core with the most concentrated dining (Zuma, La Petite Maison, COYA, Roberto's nearby in DIFC). DIFC is the financial-district equivalent of Brickell Miami — newer high-rises, polished restaurants (Hakkasan, Cipriani, Roberto's), and the most reliable business-meeting venue density. Palm Jumeirah hosts the resort hotels (Atlantis The Royal, Atlantis The Palm, FIVE Palm Jumeirah, Bvlgari Resort) and the increasingly prominent beach club scene (WHITE Beach, Beach by FIVE, Drift Beach Club). Dubai Marina and JBR is the more casual, beach-walk side. Business Bay is the contemporary middle-tier with strong daytime dining. Most Alfred members stay on the Palm or Downtown depending on whether the trip is leisure or business."},
      {title:"The dining scene, ranked by occasion",body:"For Michelin: the city went from zero to ten Michelin stars between 2022 and 2024, with the leading three-star contender FZN by Björn Frantzén opening in late 2024 in the Atlantis. Two-star Trésind Studio (Modern Indian, Voco Hotel), Row on 45 (Australian, Grosvenor House), and Stay by Yannick Alléno (Armani Hotel) form the upper tier. For high-end social dining: Nobu Atlantis, Zuma Downtown, Roberto's DIFC, Coya DIFC, La Petite Maison DIFC, Cipriani DIFC, Hakkasan Atlantis. For local Emirati and regional cuisine: Logma at the Boxpark, Bait Maryam, Al Mahara at the Burj Al Arab. For occasion: Sumosan Twiga at Tribe Burj Khalifa, Carnival by Tresind, Mimi Kakushi. Alcohol licensing varies by venue (most international hotels are fully licensed); Alfred briefs members ahead of each booking."},
      {title:"After dark, in detail",body:"Dubai nightlife is split between the beach club daytime scene and the late-night hotel-attached clubs. Daytime: WHITE Beach (FIVE Palm), Beach by FIVE, Drift Beach Club (One&Only Royal Mirage), Cove Beach (Caesars Palace), and Aura Skypool (top of Palm Tower). Late-night: SOHO Garden in Meydan (the largest entertainment complex with multiple rooms), Drai's Dubai, BASE Dubai, FIVE Palm's Penthouse. Cavalli Club at Fairmont was Dubai's flagship for years and remains relevant. Boa Steakhouse Dubai runs late. Most clubs operate Wednesday-Saturday with brunch culture filling Friday daytime. Alfred secures table placement and host introductions across all of these. Note that Dubai's nightlife operates within UAE alcohol regulations — venues require ID, and behaviour expectations are strict."},
      {title:"Logistics: airports, transfers, when to come",body:"Dubai International (DXB) is the world's busiest airport for international passengers and the main commercial gateway, 15-30 minutes from most luxury accommodations. Al Maktoum International (DWC, Dubai South) is the secondary commercial airport and the primary FBO for private aviation — 35-45 minutes from Downtown but increasingly used as DXB capacity tightens. The two are 50 km apart. Best months: November-March (peak season, mild weather, 22-28°C). October and April are shoulder months. May-September is summer with daytime temperatures of 35-45°C; many members shift to indoor activities and pool/beach club mornings only. December-February also brings Dubai Shopping Festival and major event programming (Dubai World Cup horse racing in late March, F1 weekend if hosted)."}
    ],
    services:[
      {name:"Fine Dining",desc:"Michelin restaurants & exclusive chef's tables citywide",icon:"🍽️"},
      {name:"Nightlife & Clubs",desc:"VIP tables at Cavalli Club, Omnia & exclusive venues",icon:"🍾"},
      {name:"Exotic Cars",desc:"Lamborghini, Ferrari & supercar rentals in Dubai",icon:"🏎️"},
      {name:"Private Jets",desc:"Gulf & international charters, helicopter tours available",icon:"✈️"},
      {name:"Superyachts",desc:"Mega-yachts & day charters in Arabian Gulf & Indian Ocean",icon:"⛵"},
      {name:"Luxury Shopping",desc:"VIP access to boutiques, private shopping & customization",icon:"👜"}
    ],
    venues:[
      {name:"Nobu Dubai",desc:"Michelin-starred Japanese-Peruvian dining at iconic hotel",link:"/catalog/dining/nobu-dubai"},
      {name:"Zuma Dubai",desc:"Contemporary Japanese cuisine in Downtown Dubai",link:"/catalog/dining/zuma-dubai"},
      {name:"Cavalli Club",desc:"Ultra-luxury nightclub with world-class DJs & performers",link:"/catalog/nightlife/cavalli-club"},
      {name:"Omnia Dubai",desc:"Rooftop nightclub with spectacular city views",link:"/catalog/nightlife/omnia-dubai"},
      {name:"Palm Jumeirah Villas",desc:"Exclusive villa experiences on Dubai's iconic Palm island",link:"/catalog/events/palm-jumeirah"}
    ],
    faqs:[
      {q:"How do I book a table at Nobu or Zuma in Dubai?",a:"Alfred has direct access to Dubai's Michelin-starred venues. Nobu typically books 2-4 weeks in advance; Zuma slightly more available. We handle all reservations and can arrange special requests like private rooms or wine pairings. Premium pricing applies."},
      {q:"What's the entry policy for clubs like Cavalli or Omnia?",a:"Dubai nightclubs require valid ID and smart casual minimum (no flip-flops, athletic wear). Cavalli and Omnia are age 21+. VIP guests bypass lines. Alfred ensures you're on the list with preferred entry and table reservations. Bottle service starts at AED 2,500."},
      {q:"Can I charter a yacht for a day trip in Dubai?",a:"Yes, day yacht charters from 35ft to 180ft+ available daily. Includes crew, catering & water toys. Half-day (4 hours) starts AED 3,000-5,000; full day AED 8,000-20,000+. Book 1-2 days ahead, longer for mega-yachts. Sunset cruises popular."},
      {q:"What private jet options exist for Dubai to Abu Dhabi flights?",a:"30-minute flights charter regularly. Light jets AED 15,000-25,000 each way. We often find empty legs AED 8,000-12,000. Helicopter tours available. Book through Alfred for best rates and availability."},
      {q:"Where should I shop for luxury items in Dubai?",a:"The Dubai Mall, Mall of the Emirates & Bloomingdale's are major hubs. Alfred arranges VIP personal shoppers at Hermès, Louis Vuitton, Cartier & haute couture. Private browsing sessions available for high-value clients. Book 1-2 weeks in advance."}
    ],
    keywords:"luxury concierge dubai, dubai concierge service, Dubai Michelin restaurants, VIP nightlife Dubai, Cavalli Club Dubai, Omnia Dubai, Dubai yacht charter, Dubai private jet, luxury cars Dubai, Dubai superyacht, Dubai fine dining",
    jsonLdData:{
      "@context":"https://schema.org",
      "@type":"LocalBusiness",
      "name":"Alfred Concierge — Dubai Luxury Services",
      "description":"Premier luxury concierge service in Dubai offering Michelin dining, VIP nightclub access, superyacht charters, private aviation, and bespoke luxury experiences.",
      "url":"https://alfredconcierge.app/city/dubai",
      "telephone":"+971-4-ALFRED-1",
      "areaServed":{"@type":"City","name":"Dubai, United Arab Emirates"},
      "address":{"@type":"PostalAddress","streetAddress":"Downtown Dubai, Dubai","addressLocality":"Dubai","addressRegion":"Dubai","postalCode":"00000","addressCountry":"AE"},
      "openingHoursSpecification":{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"00:00","closes":"23:59"},
      "image":"https://alfredconcierge.app/og-image.jpg",
      "priceRange":"$$$$$"
    }
  },
  london:{
    name:"London",
    tagline:"Where British Heritage Meets Cosmopolitan Luxury",
    heroDescription:"Alfred gives you insider access to London's most prestigious dining—Michelin three-stars in Mayfair and Covent Garden—exclusive members clubs like Annabel's, bespoke tailoring in Savile Row, private aviation via Luton & Battersea, and Thames river yacht experiences. From the City to Chelsea, Westminster to Notting Hill, your concierge navigates London's sophisticated landscape with white-glove service.",
    aboutSections:[
      {title:"The neighbourhoods that matter",body:"London is the most stratified by neighbourhood of Alfred's four cities. Mayfair (W1) is luxury's geographic heart — Claridge's, the Connaught, the Berkeley, the Dorchester, the highest concentration of Michelin stars (Sketch, the Connaught Restaurant, Hide, Kitchen Table), Annabel's, 5 Hertford Street, the Birley Clubs, and Savile Row. Belgravia and Knightsbridge sit immediately south — Harrods, the Lanesborough, the Berkeley overlap. Chelsea is residential luxury with the King's Road and the Bibendum. Marylebone is the more relaxed alternative to Mayfair, with Chiltern Firehouse and the Marylebone hotel scene. Soho and Fitzrovia carry the contemporary food scene (Brat, Ikoyi, Lyle's). Notting Hill (W11) is the bourgeois-bohemian counterpart with weekend markets and 108 Garage. The City and Shoreditch are the financial-district and east-London creative axes. Most Alfred members stay in Mayfair or Marylebone."},
      {title:"The dining scene, ranked by occasion",body:"For three-star Michelin: Restaurant Gordon Ramsay (Chelsea), the Hélène Darroze at the Connaught, Sketch (the Lecture Room and Library, Pierre Gagnaire), Core by Clare Smyth (Notting Hill), Alain Ducasse at the Dorchester. For two-star: A. Wong, Story by Tom Sellers, Le Gavroche (Michel Roux Jr's institution before its 2024 closure), Hide, the Fat Duck (in Bray, but London-related). For one-star contemporary: Brat (Shoreditch), Ikoyi (St James's), Kitchen Table (Fitzrovia), Lyle's (Shoreditch), Sabor (Mayfair, Nieves Barragán). For occasion: the Connaught Bar (best cocktails in London by most rankings), Scott's Mayfair, J Sheekey, the Wolseley. For private members' dining: 5 Hertford Street, Mark's Club, Loulou's. Alfred holds inventory across the three-star tier and handles same-week reservations through direct relationships."},
      {title:"After dark and members' clubs, in detail",body:"London's nightlife is members'-club led. Annabel's on Berkeley Square is the most internationally-known — moved to its current Birley-redesigned home in 2018, with restaurants, bars, garden room, basement nightclub, and Saturday-night queues even for members. 5 Hertford Street (Robin Birley's flagship) is the more discreet alternative, members-only with strict no-photos. Loulou's is the basement nightclub at 5HS — small, late-night, the most internationally-mixed crowd. Mark's Club is the older-establishment members'-club restaurant. Soho House and its outposts (76 Dean Street, Shoreditch House, the Ned, White City House) form the broader members' network. Public nightlife: Cirque le Soir (Mayfair, late-night theatricality), Tape London, Bagatelle. Alfred secures Annabel's guest access for members through partner host introductions, and table placement at the public clubs."},
      {title:"Logistics: airports, transfers, when to come",body:"London Heathrow (LHR) is the main commercial gateway, 45-90 minutes to central London depending on traffic and tube vs car. Gatwick (LGW), Stansted (STN), and Luton (LTN) are secondary commercial. For private aviation: Farnborough (FAB) is the premier business aviation airport — 50 minutes from Mayfair, Europe's busiest dedicated business airport. Biggin Hill (BQH) is the southern alternative — 45 minutes. Luton (LTN) handles the larger heavy jets. London City (LCY) lands smaller jets directly into the Docklands. Battersea Heliport handles helicopters from anywhere into central London. Best months: May-September (peak summer with the strongest social calendar — Wimbledon late June, Royal Ascot mid-June, Henley Regatta early July). October and November are autumn social season. December has the Christmas-week activity. January-March is the quieter season."}
    ],
    services:[
      {name:"Michelin Dining",desc:"3-star restaurants & private dining in prestigious venues",icon:"🍽️"},
      {name:"Members Clubs",desc:"Annabel's, Groucho Club & exclusive London establishments",icon:"🍾"},
      {name:"Private Jets",desc:"Charter from Luton, Battersea & Oxford Airports",icon:"✈️"},
      {name:"Bespoke Tailoring",desc:"Savile Row & Mayfair custom tailors & designers",icon:"👔"},
      {name:"Luxury Spa",desc:"Cowshed Spa, Claridge's & premium wellness retreats",icon:"🧘"},
      {name:"Thames Yachts",desc:"Private river cruises & yacht experiences on the Thames",icon:"⛵"}
    ],
    venues:[
      {name:"The Connaught",desc:"Hélène Darroze's three-Michelin-star dining at the Connaught hotel in Mayfair",link:"/catalog/dining/the-connaught"},
      {name:"Sketch",desc:"Pierre Gagnaire's three-star Lecture Room & Library — Mayfair art-meets-cuisine institution",link:"/catalog/dining/sketch"},
      {name:"Annabel's",desc:"Berkeley Square's legendary private members' club — restaurants, bars, basement nightclub",link:"/catalog/nightlife/annabels"},
      {name:"5 Hertford Street",desc:"Robin Birley's discreet Mayfair members' club, with Loulou's nightclub downstairs",link:"/catalog/nightlife/5-hertford-street"},
      {name:"Bulgari Spa London",desc:"Premier Knightsbridge wellness destination with private treatment suites",link:"/catalog/wellness/bulgari-spa-london"}
    ],
    faqs:[
      {q:"How do I access Michelin three-star restaurants in London?",a:"London's three-stars (Elia, Hibiscus, others) require advance booking through connections. Alfred has established relationships and books 6-12 weeks ahead. Premium rates apply. We also arrange wine pairings and special menu requests."},
      {q:"What's required to get into Annabel's or Groucho Club?",a:"Both are members-only clubs. Annabel's membership: invitation-only or book via Alfred's partner network. Groucho: similar. Alfred can arrange guest access with a member or special table bookings. Smart casual minimum. Book 1-2 weeks ahead."},
      {q:"Can I arrange a custom suit on Savile Row?",a:"Yes. Alfred coordinates bespoke tailoring at legendary Savile Row houses (Gieves & Hawkes, Anderson & Sheppard, etc.). First fittings 2-3 weeks, final suit 8-12 weeks. Budget £2,500-£6,000+ per bespoke suit. We arrange all measurements & consultations."},
      {q:"What private aviation options are available from London?",a:"Luton, Battersea, and Oxford airports serve London. European charters to Paris, Geneva, French Riviera common. Charter cost: £8,000-£18,000+ depending on aircraft & distance. Book 48+ hours ahead; shorter notice available at premium."},
      {q:"Are Thames river yacht experiences available?",a:"Yes. Private river cruises with crew, catering & champagne available daily. 2-3 hour cruises start £2,000-3,500. Full-day or overnight river experiences available. Book 1-2 weeks ahead. Seasonal highlights: Henley Regatta, Diamond Jubilee."}
    ],
    keywords:"luxury concierge london, london concierge service, best restaurants london, Michelin restaurants London, VIP nightlife London, Annabel's London, private jet London, London yacht charter, luxury dining London, Savile Row tailoring, London luxury services",
    jsonLdData:{
      "@context":"https://schema.org",
      "@type":"LocalBusiness",
      "name":"Alfred Concierge — London Luxury Services",
      "description":"Exclusive luxury concierge service in London offering Michelin dining, members club access, private aviation, bespoke tailoring, and Thames river experiences.",
      "url":"https://alfredconcierge.app/city/london",
      "telephone":"+44-20-ALFRED-1",
      "areaServed":{"@type":"City","name":"London, United Kingdom"},
      "address":{"@type":"PostalAddress","streetAddress":"Mayfair, London","addressLocality":"London","addressRegion":"England","postalCode":"W1J","addressCountry":"GB"},
      "openingHoursSpecification":{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"00:00","closes":"23:59"},
      "image":"https://alfredconcierge.app/og-image.jpg",
      "priceRange":"$$$$$"
    }
  }
};

export default function CityPage(){
  var {slug}=useParams();
  var navigate=useNavigate();
  var city=CITIES[slug];
  var [mob,setMob]=useState(window.innerWidth<768);
  var [expandedFaq,setExpandedFaq]=useState(null);

  useEffect(function(){
    function h(){setMob(window.innerWidth<768)}
    window.addEventListener("resize",h);
    return function(){window.removeEventListener("resize",h)}
  },[]);

  if(!city){
    return(
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg,padding:"40px 20px"}}>
        <SEOHead title="City Not Found — Alfred Concierge" path="/city/404" description="The city page you're looking for doesn't exist."/>
        <div style={{textAlign:"center"}}>
          <h1 style={{...sf(48,700),color:C.s1,marginBottom:12}}>City Not Found</h1>
          <p style={{...sf(16),color:C.s5,marginBottom:32}}>We don't have a concierge service in this city yet.</p>
          <button onClick={function(){navigate("/catalog")}} style={{...sf(14,600),padding:"12px 24px",background:C.gn,color:C.bg,border:"none",borderRadius:12,cursor:"pointer",transition:"all 0.3s"}}>Browse All Services</button>
        </div>
      </div>
    );
  }

  var seoTitle="Luxury Concierge "+city.name+" — Restaurants, Nightlife, Cars, Jets | Alfred";
  var seoDesc="Alfred luxury concierge in "+city.name+". "+city.tagline+" Book fine dining, VIP nightlife, exotic car rentals, private jets, yachts & more.";
  var seoPath="/city/"+slug;

  return(
    <div style={{minHeight:"100vh",background:C.bg}}>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        keywords={city.keywords}
        path={seoPath}
        jsonLd={(function(){
          var schema = [city.jsonLdData];
          schema.push({
            "@context":"https://schema.org",
            "@type":"BreadcrumbList",
            "itemListElement":[
              {"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},
              {"@type":"ListItem","position":2,"name":city.name,"item":"https://alfredconcierge.app/city/"+slug}
            ]
          });
          if(city.faqs&&city.faqs.length){
            schema.push({
              "@context":"https://schema.org",
              "@type":"FAQPage",
              "mainEntity": city.faqs.map(function(f){return {"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}})
            });
          }
          return schema;
        })()}
      />

      {/* Hero Section */}
      <section style={{paddingTop:mob?80:120,paddingBottom:mob?60:100,paddingLeft:mob?20:60,paddingRight:mob?20:60,background:`linear-gradient(135deg, ${C.el} 0%, ${C.srf} 100%)`}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <h1 style={{...sf(mob?40:72,700),color:C.s1,marginBottom:12,lineHeight:1.2}}>
            {city.name}
          </h1>
          <p style={{...sf(mob?16:20,600),color:C.gold,marginBottom:20,lineHeight:1.4}}>
            {city.tagline}
          </p>
          <p style={{...sf(mob?14:16),color:C.s4,maxWidth:800,lineHeight:1.6,marginBottom:40}}>
            {city.heroDescription}
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button style={{...sf(14,600),padding:"14px 28px",background:C.gn,color:C.bg,border:"none",borderRadius:12,cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={function(e){e.target.style.transform="scale(1.05)"}} onMouseLeave={function(e){e.target.style.transform="scale(1)"}}>Download Alfred App</button>
            <button style={{...sf(14,600),padding:"14px 28px",background:"transparent",border:"1px solid "+C.bd,color:C.s1,borderRadius:12,cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={function(e){e.target.style.borderColor=C.s7}} onMouseLeave={function(e){e.target.style.borderColor=C.bd}}>Contact on WhatsApp</button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{paddingTop:mob?60:100,paddingBottom:mob?60:100,paddingLeft:mob?20:60,paddingRight:mob?20:60}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <h2 style={{...sf(mob?32:48,700),color:C.s1,marginBottom:12,textAlign:"center"}}>
            Our Services in {city.name}
          </h2>
          <p style={{...sf(mob?14:16),color:C.s5,textAlign:"center",marginBottom:60,maxWidth:600,margin:"0 auto 60px"}}>
            Everything you need for an unforgettable luxury experience
          </p>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3, 1fr)",gap:mob?16:24}}>
            {city.services.map(function(svc,i){
              return(
                <div key={i} style={{padding:mob?20:24,background:C.el,border:"1px solid "+C.bd,borderRadius:16,transition:"all 0.3s"}}>
                  <div style={{...sf(32),marginBottom:12}}>{svc.icon}</div>
                  <h3 style={{...sf(18,600),color:C.s1,marginBottom:8}}>{svc.name}</h3>
                  <p style={{...sf(13),color:C.s5,lineHeight:1.5}}>{svc.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      <section style={{paddingTop:mob?60:100,paddingBottom:mob?60:100,paddingLeft:mob?20:60,paddingRight:mob?20:60,background:C.el}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <h2 style={{...sf(mob?32:48,700),color:C.s1,marginBottom:12,textAlign:"center"}}>
            Featured Venues in {city.name}
          </h2>
          <p style={{...sf(mob?14:16),color:C.s5,textAlign:"center",marginBottom:60,maxWidth:600,margin:"0 auto 60px"}}>
            Signature experiences curated by our concierge team
          </p>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(2, 1fr)",gap:mob?16:24}}>
            {city.venues.map(function(venue,i){
              return(
                <div key={i} onClick={function(){window.location.href=venue.link}} style={{padding:mob?20:24,background:C.srf,border:"1px solid "+C.bd,borderRadius:16,cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.transform="translateY(-4px)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.transform="translateY(0)"}}>
                  <h3 style={{...sf(18,600),color:C.s1,marginBottom:8}}>{venue.name}</h3>
                  <p style={{...sf(13),color:C.s5,lineHeight:1.6,marginBottom:12}}>{venue.desc}</p>
                  <div style={{...sf(12,600),color:C.gn}}>Explore →</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deep-dive about sections — branded to iOS app design */}
      {city.aboutSections&&city.aboutSections.length>0&&<section style={{
        background: BT.bg, borderTop:`0.5px solid ${BT.border2}`,
        padding: mob ? "60px 22px" : "100px 56px"
      }}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <BSectionHeader
            kicker="The Detail"
            title={<>What members actually use <BSilverText style={{fontStyle:"italic"}}>{city.name}</BSilverText> for</>}
            align="center"
          />
          <div style={{
            display:"grid",
            gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
            gap: mob ? 14 : 18,
            marginTop:32
          }}>
            {city.aboutSections.map(function(sec,i){
              return <CityAboutCard key={i} sec={sec} mob={mob}/>;
            })}
          </div>
        </div>
      </section>}

      {/* FAQ Section — branded */}
      <section style={{
        background: BT.bg, borderTop:`0.5px solid ${BT.border2}`,
        padding: mob ? "60px 22px" : "100px 56px"
      }}>
        <div style={{maxWidth:880,margin:"0 auto"}}>
          <BSectionHeader
            kicker="Frequently asked"
            title={<>Questions about Alfred in <BSilverText style={{fontStyle:"italic"}}>{city.name}</BSilverText></>}
          />
          <div style={{marginTop:8}}>
            {city.faqs.map(function(faq,i){
              return <details key={i} style={{borderBottom:`0.5px solid ${BT.border2}`, padding: mob ? "20px 0" : "24px 0"}}>
                <summary style={{
                  ...bType.cardSerif(mob ? 17 : 19),
                  color:BT.text, cursor:"pointer", listStyle:"none",
                  display:"flex", justifyContent:"space-between", alignItems:"center", gap:16
                }}>
                  <span>{faq.q}</span>
                  <span aria-hidden style={{...bType.kicker(), color:BT.silverDim, flexShrink:0}}>+</span>
                </summary>
                <p style={{...bType.bodyLg(), color:BT.textMid, marginTop:14, maxWidth:680}}>{faq.a}</p>
              </details>;
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{paddingTop:mob?60:100,paddingBottom:mob?60:100,paddingLeft:mob?20:60,paddingRight:mob?20:60,background:`linear-gradient(135deg, ${C.el} 0%, ${C.srf} 100%)`,textAlign:"center"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <h2 style={{...sf(mob?36:52,700),color:C.s1,marginBottom:16}}>
            Ready to Experience {city.name} Like Never Before?
          </h2>
          <p style={{...sf(mob?14:16),color:C.s4,marginBottom:40,lineHeight:1.6}}>
            Your personal concierge is available 24/7 to handle every detail. From impossible restaurant reservations to private jet charters, we make luxury effortless.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
            <button style={{...sf(14,600),padding:"14px 32px",background:C.gold,color:C.bg,border:"none",borderRadius:12,cursor:"pointer",transition:"all 0.3s"}} onMouseEnter={function(e){e.target.style.transform="scale(1.05)"}} onMouseLeave={function(e){e.target.style.transform="scale(1)"}}>Download Alfred App</button>
            <a href={"https://wa.me/+18005273353?text=Hi Alfred, I'd like to book luxury experiences in "+city.name} target="_blank" rel="noopener noreferrer" style={{...sf(14,600),padding:"14px 32px",background:"transparent",border:"1px solid "+C.s1,color:C.s1,borderRadius:12,cursor:"pointer",transition:"all 0.3s",textDecoration:"none",display:"inline-block"}} onMouseEnter={function(e){e.target.style.background=C.s1;e.target.style.color=C.bg}} onMouseLeave={function(e){e.target.style.background="transparent";e.target.style.color=C.s1}}>Message on WhatsApp</a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * CityAboutCard — single deep-dive section card matching the iOS brand.
 * Scroll-revealed glass card with serif title + sans body.
 * ──────────────────────────────────────────────────────────────────── */
function CityAboutCard({sec, mob}){
  var r = bUseReveal(0.05);
  return (
    <div ref={r.ref} style={{...bRevealStyle(r.visible)}}>
      <BGlassCard style={{padding: mob ? "28px 24px" : "36px 36px"}}>
        <h3 style={{...bType.cardSerif(mob ? 19 : 22), color:BT.text, marginBottom:14, letterSpacing:-0.4}}>{sec.title}</h3>
        <p style={{...bType.body(), color:BT.textMid}}>{sec.body}</p>
      </BGlassCard>
    </div>
  );
}
