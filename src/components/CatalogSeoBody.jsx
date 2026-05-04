/**
 * SEO body content for catalog hub pages, branded to match the iOS app.
 * Renders below the catalog grid + above the existing CTA on each page.
 * Emits FAQPage JSON-LD for the FAQ section.
 *
 * Usage:
 *   import CatalogSeoBody from "../components/CatalogSeoBody";
 *   ...
 *   <CatalogSeoBody category="dining"/>
 */

import { T, type } from "../lib/brand";
import { SectionHeader, GlassCard, Eyebrow, SilverText, useReveal, revealStyle, useMobile } from "./brand";

var T_ = T;

var CONTENT = {
  dining:{
    label:"Dining",
    italic:"dining",
    intro:"Alfred handles restaurant reservations across Miami and Paris with direct relationships at the venues that matter — Michelin-starred kitchens, the impossible-to-book seasonal venues, and the long-running establishments where the right table makes the entire evening. Below is what members consistently want to know about how dining bookings actually work and where the operational benefits sit.",
    sections:[
      {title:"What kind of dining Alfred actually books",body:"The catalogue covers four overlapping tiers. The first is Michelin-starred fine dining — Le Cinq, L'Ambroisie, Plénitude, Epicure in Paris, the city's three- and two-star houses. The second is occasion-driven contemporary dining — Carbone, Komodo, Casa Tua, Papi Steak in Miami; Septime, Frenchie, Girafe in Paris. The third is members'-only and club-attached — ZZ's Club Miami, the Surf Club Restaurant, Mark's Club London, Loulou's. The fourth is the daytime and beach-club restaurants — Casa Tua Cucina, Joia Beach, Beso Beach, Nikki Beach. Alfred's bookings sit across all four; the operational benefits scale up at the top of the catalogue (waived advance payments, reduced minimum spends, VIP table placement) and down at the casual end (priority seating, dietary briefing, off-menu access)."},
      {title:"How impossible reservations actually happen",body:"The typical booking pattern at the top of the dining tier is that public booking systems release tables 30 days out, with prime weekend slots booked within minutes of opening. Alfred's relationships sit outside that booking window — restaurant managers reserve a percentage of seats for trusted concierge partners, walk-ins, and VIP relationships. When you ask for a Friday night at Carbone in three weeks and the public system shows no availability, the answer often is not 'no' but 'who is asking.' Alfred's Miami and Paris teams call the management directly; the booking gets logged on the manager's hold list rather than through the booking software. This is not a guarantee — some weekends are genuinely full — but the hit rate at impossible bookings is materially higher than what's available to the general public."},
      {title:"Dietary, dress code, and table placement",body:"Every Alfred dining booking includes a dietary brief sent to the kitchen ahead of arrival. Vegetarian, vegan, gluten-free, kosher-style, severe allergies — handled in advance rather than negotiated at the table. Dress codes vary materially: ZZ's Club, the Surf Club Restaurant, and Le Jardinier expect jackets and elevated dressy attire; Carbone and Komodo are smart-resort; beach-club restaurants accept resort beachwear. Alfred briefs members on the specific code at the time of booking. Table placement is the operational benefit that members notice most quickly — the difference between the booth at Carbone facing the main dining room versus a table near the kitchen is roughly 12 inches but it's the difference between a memorable and a forgettable evening. Alfred's bookings include placement preferences communicated to the host stand."},
      {title:"Payment, gratuity, and the bill mechanics",body:"Most Alfred-coordinated dining bookings are paid at the venue at end of meal — Alfred does not act as a middleman on the dinner bill. The exception is venues that require advance payment (typically tasting menu venues that take a deposit at booking time); for those, Alfred's relationship often waives the advance payment or significantly reduces it for Platinum and Centurion members. Tipping in Miami runs 20-22% on pre-tax for fine dining; in Paris, service is technically included in the bill (10-15% baked in) and additional gratuity is appreciated but not expected at the same scale as the US. Bottle service and sommelier-paired wine dinners carry separate gratuity expectations that Alfred briefs ahead of arrival."}
    ],
    faqs:[
      {q:"Can Alfred get a table when the restaurant says they're fully booked?",a:"Often yes, particularly at our partner venues where we hold reserved inventory outside the public booking system. Restaurants protect a percentage of seats for relationships and walk-ins; concierge bookings frequently fill those reserved slots. We won't always succeed but our hit rate at impossible bookings is materially higher than what's available to the public."},
      {q:"How far in advance should I book Carbone, Le Cinq, or similar top-tier venues?",a:"Six weeks for prime Friday/Saturday seatings, three weeks for weeknights. Same-week is achievable through Alfred for our members, particularly with flexibility on time. Major event weeks (Art Basel, F1, Fashion Week) compress the calendar — eight to ten weeks of advance notice is the safe window for those."},
      {q:"What if I have severe dietary restrictions?",a:"Disclose during booking and we brief the kitchen ahead of arrival. For severe allergies (nuts, shellfish), the kitchen prepares dishes in dedicated stations to avoid cross-contamination — this is standard at the top of the dining tier. Vegetarian, vegan, gluten-free, and kosher-style requirements are handled at every venue in the catalogue."},
      {q:"Are there off-menu options at the top venues?",a:"Yes. Most fine-dining venues maintain off-menu items for repeat guests and concierge bookings — particular cuts of beef, specific cheese courses, custom cocktails. Mention any specific request during booking; Alfred coordinates with the kitchen ahead of arrival."}
    ]
  },

  nightlife:{
    label:"Nightlife",
    italic:"nightlife",
    intro:"Alfred handles VIP table placement, guest-list access, and bottle service across the world's top nightclubs — LIV and E11even Miami, Story, Club Space, Hyde Beach, Raspoutine and Castel Paris, Annabel's London, SOHO Garden Dubai. The mechanics of how nightclub bookings work are different enough from restaurant reservations that members consistently want clarification on what the membership actually unlocks at the door.",
    sections:[
      {title:"Table service vs guest list — the actual difference",body:"Every premium nightclub operates two parallel systems. Guest list is free entry past the line for groups of one to four, typically requiring you to be inside by 12am-1am to qualify. Table service is paid bottle service — you reserve a physical table with bottle minimums, hosted by a server, with priority entry, no line, and a place to sit and put drinks. The bottle minimum varies wildly: $2,500-5,000 at LIV main floor, $5,000-15,000+ at LIV VIP balcony or owner's table, $2,000-4,000 at E11even main floor, similar at Story. Tables also come with reduced advance-payment requirements at Alfred-partner venues — a $5,000 minimum at LIV typically requires $2,500 upfront via the venue's app, whereas Alfred Platinum and Centurion members have the advance payment waived. Guest list works for the casual visit; table service is the right call for groups of 5+ or anyone who wants to actually sit down at any point in the evening."},
      {title:"Door codes, IDs, and what gets you turned away",body:"Premium nightclubs have strict door policies that are not negotiable, even with concierge bookings. Photo ID is required (passport accepted at most US clubs; some venues prefer state ID or driver's license; for international visitors, passport is the safe default). Age restrictions are 21+ at all US venues including LIV, E11even, Story, Club Space, Hyde Beach. Dress code is enforced — no athletic wear including sneakers (specific exception: clean white sneakers at some Miami venues only), no shorts, no t-shirts without collars at most venues, no flat-brim caps, no flip-flops. Female attire is more permissive but elevated; cocktail dresses or sharp separates are expected. Excessive intoxication at the door is grounds for refusal regardless of reservation status. Alfred briefs all of this ahead of arrival and our concierges can be at the door for first-time visitors to ensure smooth entry."},
      {title:"The seasonal and weekly calendar",body:"Miami nightlife runs Tuesday-Sunday with clear weekly patterns. Tuesday and Wednesday are industry/local nights — quieter, easier entry, smaller crowds. Thursday is when the weekend starts at LIV (Industry Night residency) and at E11even. Friday and Saturday are the peak nights with headlining DJs and the highest table minimums. Sunday is a strong but slightly smaller crowd. Major events compress: Art Basel week (early December), Spring Break (mid-March), F1 weekend (early May) all multiply demand and minimum spends. Paris nightclub schedules are different — Raspoutine and CoCo Club run Wednesday-Saturday; Castel runs Tuesday-Saturday with members-only Sundays; closing times vary by venue but most peak 1am-4am. Dubai nightlife operates Wednesday-Saturday with brunch culture filling Friday daytime."},
      {title:"What Alfred does that the venue's own app can't",body:"Most premium nightclubs now have direct booking apps — Tabler, ResMatic, Discotech, the venue's own native apps. These work fine for entry-level table bookings at standard minimums. What they don't do: negotiate reduced minimums (Alfred regularly secures $3,500 minimums at LIV Saturday night when the public app shows $5,000), waive advance payments (apps require deposits at booking; Alfred relationships waive this for member tiers), guarantee specific table placement (apps assign tables; Alfred specifies the booth, the bottle service team, the host), or coordinate cross-venue evenings (the after-after-party chain from Story to LIV to Club Space). For solo or pair bookings on a quiet weeknight, the apps work; for groups, weekends, or any complexity, concierge access materially improves the night."}
    ],
    faqs:[
      {q:"How much does a VIP table at LIV Miami cost?",a:"Tables at LIV typically start at $2,500-3,500 minimum spend on weekdays and $3,500-5,000+ on weekends with major headliners. VIP balcony and owner's tables run $5,000-15,000+. Alfred Concierge negotiates reduced minimums and guaranteed placement for members; weekend minimums for Platinum members are typically 30-40% below the venue's public rate."},
      {q:"Can I get into Annabel's, 5 Hertford Street, or Castel without a member sponsor?",a:"Annabel's allows guest access through the on-duty host with the right introduction; Alfred secures this for members. 5 Hertford Street and Castel are stricter members-only venues — Alfred can sometimes arrange guest access through partner sponsors but it's case-by-case rather than guaranteed. For dependable access, members of those clubs are the cleanest path; for one-off visits, Alfred does what's possible."},
      {q:"What happens to my bottle if I don't finish it?",a:"Most US nightclubs allow you to leave the bottle behind your name for one or two future visits within a 60-90 day window. The host stand keeps a hold list. Paris and Dubai venues have similar policies. Alfred members get this hold managed actively across visits."},
      {q:"Are after-parties included in concierge bookings?",a:"After-party access at LIV (post-Story), E11even (post-LIV after 1am), and Club Space (4am-noon) is coordinated by Alfred during the evening. Most members don't pre-book the after-after — the concierge handles routing in real time based on which crowd you're with and which venues are running heaviest that night."}
    ]
  },

  "exotic-cars":{
    label:"Exotic Cars",
    italic:"exotic cars",
    intro:"Alfred handles exotic and luxury car rentals across Miami, Paris, and Dubai — Ferrari, Lamborghini, Rolls Royce, McLaren, Porsche, Bentley, and the broader supercar fleet. The catalogue is delivered to your door, fully insured, with a proper handover that briefs you on each vehicle's specific quirks. The operational mechanics differ from regular car hire in ways that catch first-time renters off-guard.",
    sections:[
      {title:"The fleet, by category",body:"The catalogue is structured in four tiers. Daily-driver luxury (Mercedes G-Wagon, Range Rover Autobiography, Porsche Cayenne Turbo, Cadillac Escalade): the everyday tier for groups, families, or members who want luxury without the supercar attention. Sports car tier (Porsche 911 GT3, BMW M8, Audi RS6, AMG GT): the right balance of performance and discretion. Supercar tier (Lamborghini Huracan/Urus, Ferrari Roma/296 GTB, McLaren 720S, Aston Martin DB12): the headline cars for occasion-driven trips, photo opportunities, or members who want the visibility. Ultra-luxury (Rolls Royce Cullinan/Phantom/Spectre, Bentley Continental GT, Maybach S-Class): chauffeur-eligible and oriented toward presence rather than driving dynamics. Within each tier, specific models and years rotate based on inventory and member preference."},
      {title:"Insurance, deposits, and the fine print",body:"Exotic rentals carry materially different insurance and deposit terms from regular car hire. Standard premium insurance covers the first $50,000-$100,000 of damage with deductibles of $5,000-$10,000 — meaning a minor incident can leave you exposed for thousands. Most exotic rental companies require a security hold ranging from $5,000 (entry-level Porsche, BMW M-series) to $25,000-$50,000 (Lamborghini, Rolls Royce, McLaren). The hold releases within 48-72 hours of return assuming no damage. Premium credit cards (Amex Centurion, Chase Sapphire Reserve) include primary collision coverage on rental cars in many cases — verify your card's coverage before declining the rental company's collision damage waiver. Alfred briefs all of this during the booking call rather than at handover, where most surprises happen."},
      {title:"Mileage, fuel, and the daily mechanics",body:"Most exotic rentals include 100-150 miles per day; over that, you pay $1-5 per additional mile depending on the vehicle. For a one-day rental staying within Miami-Dade, this rarely matters. For multi-day rentals or trips to Palm Beach, Naples, or the Keys, the mileage costs accumulate. Unlimited-mileage upgrades are available at most rental companies for an additional 10-20% on the daily rate; for road trips it's almost always worth taking. Fuel is return-on-empty (you pay for what you use) or pre-paid; the pre-paid option is usually marginal cost difference but eliminates the return-by-time pressure. Most exotic cars run premium octane (93 in the US, 98 in Europe); using lower octane voids most damage warranties on the engine. Tolls (typically $5-15/day for Miami driving) are billed separately and processed through the venue's transponder."},
      {title:"Delivery, handover, and the things that go wrong",body:"Alfred-coordinated rentals are delivered to your hotel, residence, or airport in 30-45 minutes with a 15-minute handover walkthrough. The walkthrough covers: starting procedure (some Lamborghinis and Ferraris have specific start sequences), transmission mode selection (most are dual-clutch with multiple drive modes), parking sensors and 360-degree camera operation, infotainment and CarPlay/Android Auto pairing, fuel grade and refueling location recommendations, suspension lift settings (essential for Lamborghinis on Miami's broken pavement), and emergency contact protocol. Things that go wrong: scratched wheels from valet parking (the most common damage event at Miami's premium hotels), low-clearance damage at parking garage entries (use suspension lift), front-bumper damage from speed bumps (lift again), and battery drain on cars left more than 48 hours unused. The walkthrough briefs all of these explicitly."}
    ],
    faqs:[
      {q:"What's the youngest age I can rent an exotic car?",a:"25 minimum at most reputable companies, often with $50-150/day under-25 surcharges for those that allow under-25 rentals. Drivers under 21 cannot rent exotic vehicles regardless of insurance. International drivers need their home license plus an International Driving Permit and a passport for verification. US drivers from out-of-state need a current US license and a credit card matching the license name."},
      {q:"Can I take the car out of state or to the Keys?",a:"Florida-only travel is the default; out-of-state requires explicit advance permission and may carry an additional fee. Florida Keys travel is typically allowed but verify before driving — some companies prohibit certain vehicles on the Overseas Highway due to insurance restrictions on the bridges. Caribbean and international transit is rarely allowed on exotic rentals."},
      {q:"What if I get a parking ticket or scratch a wheel?",a:"Tickets are billed to the rental company's address and forwarded with an administrative fee ($25-75 per violation). Pay promptly to avoid escalation. Wheel scratches from valet parking are unfortunately common — most rental companies charge $300-1,500 per damaged wheel for refurbishment, billed to the security hold. Comprehensive insurance can cover this; Alfred briefs members on whether their card's coverage applies before booking."},
      {q:"Is delivery actually free?",a:"Alfred-coordinated deliveries to South Beach, Brickell, Miami International, Opa-Locka, and the Design District are included for partner-fleet vehicles. Delivery to outlying areas (Aventura, Doral, Coral Gables) may carry a $50-150 fee depending on the company and vehicle. Cross-county delivery (Fort Lauderdale, Palm Beach) is quoted case-by-case."}
    ]
  },

  jets:{
    label:"Private Jets",
    italic:"private jets",
    intro:"Alfred coordinates private jet charter worldwide with empty-leg deals, instant quotes, and dedicated agent handling. The aviation market is fragmented across hundreds of operators with widely-varying safety standards, fleet quality, and pricing transparency. Alfred works through a vetted operator panel with consistent ARGUS Platinum, Wyvern Wingman, or IS-BAO certifications and pricing structures that members can predict.",
    sections:[
      {title:"The four jet categories, by use case",body:"Light jets (Citation CJ3, Phenom 300, Lear 75) seat 6-8, range up to roughly 2,000 nautical miles, suit short-hop flights — Miami to New York, London to Geneva, New York to the Caribbean. Cost runs $3,500-5,500 per hour. Midsize jets (Citation XLS, Hawker 900XP, Praetor 600) seat 8-10, range up to 3,500 nm, suit transcontinental flights — Miami to LA, London to Madrid. Cost runs $5,500-8,000 per hour. Heavy jets (Falcon 7X, Challenger 605, Gulfstream G450) seat 12-16, range up to 5,500 nm, suit transatlantic flights — New York to London or Paris. Cost runs $8,000-12,000 per hour. Ultra-long-range (Gulfstream G650/G700, Global 7500, Falcon 8X) seat 14-18, range up to 7,500+ nm, fly anywhere on Earth nonstop. Cost runs $12,000-16,000+ per hour. Alfred matches aircraft to mission rather than defaulting to the bigger option — for a 4-person Miami-NYC overnight, a light jet is usually the right call; for an 8-person Miami-Paris business trip, a heavy jet wins on cabin comfort across 8 hours."},
      {title:"How empty leg deals actually work",body:"Empty legs are flights an operator is repositioning without passengers — a jet that's flown a client to Aspen returning empty to its base in New York, or a charter dropping in Miami before continuing to a base in Houston. The operator wants to monetize the otherwise-empty leg, so they price it at 50-75% off the standard charter rate. The catch is that empty legs are non-flexible on departure airport, departure time, destination, and date. If your trip is genuinely flexible (you're flying to a destination the empty leg already serves, on the date the empty leg already exists), the savings are substantial — a $30,000 NYC-to-Miami one-way at standard rates becomes $9,000-12,000 as an empty leg. Alfred maintains active visibility on empty leg inventory across our partner panel; for members with flexible travel patterns this is the single biggest cost reduction in private aviation."},
      {title:"FBOs, ground service, and what 'private' actually means",body:"Private aviation eliminates the commercial airport experience. You arrive at an FBO (fixed-base operator) — a private terminal, typically 20-40 minutes from the city center, with curbside drop-off, no security line, no boarding, no luggage carousel. You walk from your car onto the aircraft. Standard FBO offerings: covered drop-off, lounge, refreshments, secure parking, in-flight catering coordination, and ground transport coordination. In Miami: Signature MIA at Miami International, Million Air at Opa-Locka. In London: Farnborough, Biggin Hill, Luton. In Paris: Le Bourget. Alfred coordinates car-to-aircraft transit so members never wait at the FBO — the aircraft is fueled, catered, and ready when you arrive, with departure typically within 10-15 minutes of arrival at the FBO."},
      {title:"Catering, baggage, pets, and the pre-flight brief",body:"Catering is included in most charter rates at a basic level (sandwiches, cheese plate, soft drinks, coffee); custom catering (specific restaurant orders, full-service meals, dietary-specific provisioning) adds $50-300 per person depending on the operator. Alcohol is included in most international flights and US flights at member request. Baggage limits are generous on charter — typically 50-100 lbs per passenger across multiple bags, with hard limits driven by the aircraft's weight-and-balance rather than airline rules. Sports equipment (skis, golf, dive gear) is accommodated. Pets fly in-cabin on private charter — most operators welcome dogs and cats with current vaccinations; larger animals require advance arrangement. The pre-flight brief covers: passenger manifest (full name, date of birth, passport for international), departure timing, baggage count, catering preferences, ground transport at destination, pet manifest if applicable. Alfred handles the brief 24-48 hours before departure."}
    ],
    faqs:[
      {q:"How quickly can Alfred arrange a private jet?",a:"Standard requests confirm in 2-4 hours during operating windows. Same-day departures are achievable for Platinum and Centurion members with sufficient lead time on the aircraft and crew positioning. Empty leg deals are confirmed in minutes once a match is found. International flights add coordination time for permits, customs, and crew duty cycles — typically 12-24 hours for a transatlantic leg."},
      {q:"What's the actual cost difference between commercial first class and a private jet?",a:"For 1-2 passengers on a busy commercial route (NYC-LA, London-Dubai), commercial first class is materially cheaper than private. For 4+ passengers, private becomes competitive with or cheaper than commercial first class on a per-seat basis. The cost calculus shifts significantly in private's favor on routes with limited commercial first class availability, on schedules that don't fit airline timetables, or for members who value the time-saved on FBO arrival vs commercial check-in. A typical Miami-NYC light jet at $20,000 sleeps 4 — competitive with $5,000-7,000 each on Delta One commercial."},
      {q:"What about cancellation policies?",a:"Charter cancellation policies vary by operator. Standard structure: full refund 14+ days out, 50% refund 7-14 days, 25% refund 48 hours-7 days, no refund inside 48 hours. Weather cancellations (declared unsafe by the captain) are typically refunded at 100% regardless of timing. Alfred negotiates flexible cancellation terms for member bookings where possible."},
      {q:"Can I bring my own pilot or crew?",a:"No — commercial charter operates under FAR Part 135 (US), which requires the operator's certificated pilots and dispatch. Bringing personal crew is only possible on owned-aircraft operations or specific fractional ownership programs (NetJets, Flexjet), which are different products from charter. For owners of personal aircraft, Alfred coordinates with your management company; for charter customers, the operator's crew flies."}
    ]
  },

  yachts:{
    label:"Yachts",
    italic:"yachts",
    intro:"Alfred coordinates yacht and superyacht charters from Miami, the French Riviera, Ibiza, Monaco, the Bahamas, and the Caribbean. The catalogue ranges from 30-foot day boats to 100ft+ superyachts with full crew, fuel, water toys, and catering. Yacht charter mechanics are different enough from any other category Alfred coordinates — distinct vocabulary, distinct payment structures, distinct seasonal patterns — that members consistently want clarity on what they're actually buying.",
    sections:[
      {title:"Charter categories, ranked by use case",body:"Day boats and small yachts (30-50ft) seat 8-15 guests, suit half-day or full-day charters in protected water — Biscayne Bay out of Miami, the Côte d'Azur out of Cannes, the Balearic islands out of Ibiza. Cost runs $1,500-5,000/day. Mid-range yachts (50-80ft) seat 10-25 guests with overnight cabins, suit full-day charters or short multi-day trips — Bahamas out of Miami, Corsica from Saint-Tropez. Cost runs $5,000-25,000/day. Superyachts (80-150ft) seat 12-40 guests with full crew (captain, mate, stew, chef, deckhands), suit week-charter cruises through the Mediterranean or Caribbean. Cost runs $25,000-150,000/day. Mega-yachts (150ft+) are weekly or longer charters at $150,000+/day. Most Alfred bookings sit in the day-boat or mid-range tier; superyachts are member-led requests for specific weeks (typically Saint-Tropez to Monaco in May-July, Caribbean December-March)."},
      {title:"What's included vs what's billed separately",body:"Day-charter rates typically include the captain, crew, fuel, dockage, ice, soft drinks and water, basic snorkeling and water-toy gear (paddleboards, snorkel sets, towed inflatables), and standard insurance. Catering is usually a separate line — most members opt for in-house catering by the boat's chef ($80-150 per person for full-day) or arrange food brought aboard from venue restaurants. Alcohol is rarely included in base rates and is either guest-supplied or ordered ahead. Larger superyachts work on a different model — the Advance Provisioning Allowance (APA), typically 25-30% of the charter fee paid into an account that the captain draws from for fuel, food, alcohol, and dockage during the charter, with the unused balance refunded at the end. Crew gratuity is the line that catches first-time charterers off-guard: international standard is 15-20% of the charter fee paid directly to the crew at the end of the trip."},
      {title:"Routes and destinations from Miami",body:"The most common Miami day charter runs Biscayne Bay south to Key Biscayne and Stiltsville, with a swim and lunch stop and return up the bay past the Miami skyline. Half-day charters typically stay inside the bay; full-day extends to Elliott Key, Boca Chita, or No Name Harbor. Multi-day Bahamas: Bimini is two hours from Miami, the Berry Islands four hours, the Exumas six to eight hours, Eleuthera eight to ten hours. Mediterranean charters out of Saint-Tropez, Cannes, Monaco, Ibiza, or Mallorca run May-October peak season; the highest demand is the last week of May (Cannes Festival) through the first week of August (Monaco Yacht Show), with Ibiza-specific peaks during opening and closing weeks. Caribbean charters out of St. Maarten, the BVI, and Antigua peak December-April."},
      {title:"Weather, cancellation, and the captain's discretion clause",body:"Weather drives charter decisions. Miami's November-April season has stable winds and low storm risk; May-October brings heat, humidity, afternoon thunderstorm patterns, and the Atlantic hurricane season (June 1 - November 30). Most charter companies suspend Bahamas crossings during named storm threats. Mediterranean weather is most reliable June-September with mistral winds in the Côte d'Azur sometimes forcing route changes in May or October. Caribbean weather is most reliable December-April with hurricane season June-November. Standard charter contracts include a captain's-discretion clause — if the captain declares conditions unsafe, the charter is rescheduled or refunded depending on the vessel's policy. Alfred briefs weather windows during booking and proactively reaches out if a charter falls in a developing storm window."}
    ],
    faqs:[
      {q:"How quickly can Alfred arrange a yacht charter?",a:"For day charters in Miami, 24-48 hours is typical for our partner fleet — same-day is possible for Platinum and Centurion members during weekdays. For multi-day Bahamas or Mediterranean charters, 5-7 days minimum for provisioning. Last-minute superyacht charters are possible during shoulder seasons but rarely available during peak summer in the Med."},
      {q:"What about gratuity? Is it actually expected?",a:"Yes, and it's significant. International standard is 15-20% of the charter fee paid directly to the crew at the end. On a $5,000 day charter that's $750-1,000; on a $25,000 superyacht week that's $3,750-5,000. Cash is preferred but card or bank transfer is widely accepted. Alfred briefs gratuity expectations during booking so there are no surprises at the dock."},
      {q:"Can I bring my own captain?",a:"No on commercially-chartered yachts due to insurance and Coast Guard/MCA requirements. Bringing a personal captain is only possible on owner-operated vessels (a different category from charter), which require advance arrangement and longer lead times."},
      {q:"What if I get seasick or change my mind mid-charter?",a:"Day charters can return to dock at any point — the captain has full discretion to abort if weather changes or guests are unwell. Multi-day charters have less flexibility (you've paid for the duration), but Alfred works with operators to extract or substitute itinerary if conditions warrant. Crew first-aid kits include seasickness medication; for severe susceptibility we recommend pre-medicating before boarding."}
    ]
  },

  wellness:{
    label:"Wellness",
    italic:"wellness",
    intro:"Alfred coordinates spa and wellness bookings across Miami, Paris, London, and Dubai — Canyon Ranch and Lapis at the Fontainebleau in Miami, Dior Spa Plaza Athénée and Le Spa Ritz in Paris, the Bulgari Spa London and Dorchester Spa in London, Talise and the Mandarin Oriental Spa in Dubai. The catalogue includes single-treatment bookings, multi-day wellness retreats, personal training, and IV therapy. Booking specifics differ from restaurant or club reservations in ways that matter at the high end.",
    sections:[
      {title:"What 'luxury wellness' actually covers",body:"The catalogue spans four categories. The first is hotel-attached luxury spas — Canyon Ranch Miami Beach, Lapis at the Fontainebleau, Four Seasons Surf Club Spa, the Setai Spa, Dior Spa Cheval Blanc Paris, Le Spa Ritz, Spa Le Bristol, Bulgari Spa London. These are the prestige category — full menus of facials, massages, body treatments, and signature rituals, typically with spa pools, hammam, sauna, and relaxation lounges included with treatment booking. The second is brand-led spas — Dior, Guerlain, La Mer, Carita — typically embedded in flagship boutiques or hotels and using proprietary product lines. The third is medical spa and aesthetics — Botox, fillers, laser treatments, IV therapy — offered at concierge medical practices like Eternal Body Care or the Cleveland Clinic Wellness Institute. The fourth is fitness and personal training — private trainers at the SoHo House gym network, Equinox Hotel, or in-residence sessions arranged by Alfred."},
      {title:"Booking lead times and the prestige spas",body:"The most-booked treatments at the prestige spas (Dior Prestige Facial at Cheval Blanc, the Couples Ritual at Le Spa Ritz, the L'Or de Vie ritual at Cheval Blanc, the Cipriani Massage at the Bulgari Spa London) book out 2-4 weeks ahead during peak periods (Fashion Week, Christmas, summer). Same-week is achievable through Alfred for our members at most venues, with Saturday afternoons being the hardest slot. Weekday mornings (Tuesday-Thursday before noon) are the easiest book and tend to have the most senior therapists available — most spa managers schedule top therapists during the week so their staff isn't burning out on weekends. Centurion-tier members get same-day priority for treatments under 90 minutes; longer rituals (180-240 minute experiences) typically require advance booking."},
      {title:"What to know before you arrive",body:"Arrive 30 minutes before treatment start time — most spas charge a full treatment fee for late arrivals reducing actual treatment time, and the pre-treatment relaxation in the spa pools, hammam, or sauna is part of the experience you're paying for. Bring a swimsuit if the venue has wet facilities; most provide robes and slippers. Hydrate before arrival; most prestige spas serve herbal teas and infused water in the relaxation lounge but the pre-treatment hydration matters more for facial and body treatments. Disclose recent dermatological work, pregnancy, recent surgeries, or significant allergies during booking — most spas require this in writing before booking certain treatments. Tipping at US spas runs 15-20% on pre-tax for treatments; Paris and London spas have tipping baked into the service charge with optional small additional gratuity to specific therapists. Mobile phones are typically prohibited in treatment areas; the venue holds them in the locker rooms."},
      {title:"Wellness retreats and multi-day programmes",body:"Beyond single treatments, Alfred coordinates structured wellness retreats — typically 3-7 day programmes combining medical assessment, treatment plans, fitness, nutrition, and relaxation. Canyon Ranch Miami Beach runs structured programmes; the Mayr Clinic Maria Wörth in Austria, SHA Wellness Clinic in Spain, and the Lanserhof in Germany are the European destination retreats most-requested by Alfred members. Pricing for retreats runs $5,000-25,000 per person for 3-7 day programmes including accommodation, treatments, meals, and assessment. Booking lead time is 2-3 months for popular weeks. Alfred handles retreat selection, booking coordination, travel arrangements, and the on-site concierge during the stay."}
    ],
    faqs:[
      {q:"Can Alfred book spa treatments same-day?",a:"For 60-90 minute treatments at our partner venues, same-day is achievable for Platinum and Centurion members during weekday hours. Saturday afternoons are the hardest book and typically require 24-48 hours notice. Longer rituals (180+ minutes) and couples-suite bookings need 24-72 hours."},
      {q:"What's the difference between hotel spas and standalone wellness venues?",a:"Hotel spas (Canyon Ranch, Lapis, Four Seasons, Dior Cheval Blanc, Le Spa Ritz, Bulgari Spa London) are typically more prestigious with broader treatment menus, full wet facilities, and serve hotel guests plus members. Standalone wellness venues (medical spas, yoga studios, IV therapy clinics) are more focused — single-purpose specialty rather than full-spa experience. Alfred books across both based on what fits the request."},
      {q:"Do I need to be a hotel guest to book spa treatments?",a:"At most prestige hotel spas, no — the spa accepts external bookings, with hotel guests sometimes getting priority on peak slots. Some venues (the Surf Club Spa, certain ZZ's Members Club partners) restrict spa access to guests and members. Alfred clarifies eligibility during booking."},
      {q:"What about IV therapy and recovery treatments?",a:"Available through Alfred's medical-spa partner network — IV hydration, vitamin therapy, NAD+ infusions, hangover recovery, and peptide therapies are all bookable. In-residence IV therapy (concierge nurse to your hotel) is available in Miami and Dubai with 4-6 hours notice."}
    ]
  },

  hotels:{
    label:"Luxury Hotels",
    italic:"hotels",
    intro:"Alfred handles luxury hotel reservations across Miami, Paris, Dubai, and London with member benefits — room upgrades, late check-out, complimentary breakfast, food and beverage credits, and waived advance payments where venue policy allows. The hotel catalogue is curated rather than comprehensive — every property in the Alfred catalogue is one our team has stayed in personally and maintains a direct relationship with the management.",
    sections:[
      {title:"The hotel categories that matter",body:"Alfred's catalogue spans five tiers. Iconic flagship hotels — the Four Seasons Surf Club Miami, the Plaza Athénée Paris, the Burj Al Arab Dubai, Claridge's London — properties that are destinations in themselves, often with Michelin-starred restaurants on-site, signature spas, and waiting lists for prime suites. Boutique luxury — the Faena Hotel Miami, the Costes Paris, the Portman Ritz-Carlton London — properties with strong design identity and intimate scale. Resort luxury — Atlantis The Royal Dubai, the Bvlgari Resort Dubai — destinations with resort programming around the accommodations. Members-only and residential-style — ZZ's Members Club Miami (with attached residences), the Bristol Paris (with the long-stay residence wing), the Mandarin Oriental Hyde Park London. New entrants — the Aman Miami Beach (opening 2026), the Bulgari Hotel Tokyo, the Rosewood Munich. Alfred members get consistent benefits across the five tiers, though the operational specifics vary by hotel."},
      {title:"What member benefits actually look like",body:"Standard Alfred-coordinated bookings include: room category upgrade subject to availability at check-in (typically one category, sometimes two during shoulder season), early check-in if requested (typically 11am-12pm rather than the standard 3pm), late check-out (typically 4pm-6pm rather than 11am), complimentary continental breakfast for two, $100-200 food and beverage credit per stay, complimentary high-speed Wi-Fi (where not already free), and a welcome amenity in the room (typically champagne, fruit plate, or local specialty depending on the property). Suite bookings often include additional benefits — butler service, in-room check-in, signature spa treatment credit. The exact benefits vary by hotel and member tier; Centurion members consistently see two-category upgrades and four-figure F&B credits at partner properties."},
      {title:"Booking timing and seasonal pricing",body:"Hotel rate cards are dynamic across all major luxury chains — the same room can vary by 50-100% between low and peak periods. Miami peak runs December-April with absolute peaks at Christmas-New Year, Art Basel (early December), and Spring Break (mid-March). Paris peak runs September-October and May-June with secondary peaks during Fashion Week. Dubai peak runs November-March with absolute peaks during the World Cup of Horse Racing (late March) and Christmas-New Year. London peak runs May-September with major event peaks during Wimbledon, Royal Ascot, and the Coronation Cup. Booking 4-6 weeks ahead during peak periods is the safe lead time for member-rate availability; booking 8-12 weeks ahead unlocks the best inventory. Alfred members get access to flash sales, last-room availability through partner properties, and member-rate inventory that doesn't show in public booking systems."},
      {title:"What's actually different about the Alfred experience",body:"The substantive operational difference between booking through Alfred versus directly through the hotel's website is what happens when something goes wrong. Cancellation outside policy: Alfred's relationship typically secures fee waivers that members couldn't negotiate solo. Room not available at promised category at check-in: Alfred's relationship gets you upgraded to the next available category at no charge, with the difference billed back to the property. Service issue mid-stay: Alfred escalates directly to the management on duty rather than through the front desk queue. Special requests: dietary preparations in the room before arrival, specific bedding configurations, child amenities, pet policies — all handled through Alfred ahead of arrival rather than negotiated at the front desk during check-in."}
    ],
    faqs:[
      {q:"How does Alfred get better rates than booking directly?",a:"Two mechanisms. First, Alfred is an authorized booking partner for properties in the Virtuoso, Fine Hotels & Resorts (Amex), and direct GDS networks — these networks include negotiated rates and member benefits not available to public booking. Second, Alfred's volume relationships with specific properties unlock supplementary benefits (additional credits, suite upgrades, complimentary services) that the property's own website doesn't surface. Net result: comparable or better rates with better benefits."},
      {q:"Can Alfred book during sold-out periods like Art Basel or Fashion Week?",a:"Often yes, particularly at our partner properties where reserved inventory exists outside the public booking system. The most over-subscribed weeks in our four cities — Art Basel Miami, F1 weekend Miami, Fashion Week Paris, the Cannes festival week, Royal Ascot — have member-rate inventory available through Alfred until very close to the date. Some weeks are genuinely full at the top of the catalogue; we work the alternatives."},
      {q:"What about points and loyalty programs?",a:"Alfred-coordinated bookings credit points at all major chains (Marriott Bonvoy, Hilton Honors, World of Hyatt, IHG Rewards, Accor ALL) for our members — confirm your loyalty number is on the booking. Member benefits stack on top of loyalty status: a Platinum-tier Marriott Bonvoy member booking through Alfred gets the loyalty benefits plus the Alfred-specific upgrades and credits. The exception is private members'-club hotels (ZZ's, Soho House) which run their own membership programs separately from public loyalty."},
      {q:"Are pets, children, and special accommodations handled?",a:"Yes — pets at every pet-friendly hotel in the catalogue (most luxury properties accept dogs under 30-50 lbs with a fee; specifics vary by property). Children of any age at family-oriented properties; pre-arrival child amenities (cribs, strollers, child menus) coordinated through Alfred. Special accessibility needs handled property-by-property — disclose during booking and we coordinate with the housekeeping and front desk teams."}
    ]
  }
};

function FaqItem({q, a, mobile}){
  return (
    <details style={{borderBottom:`0.5px solid ${T_.border2}`, padding: mobile ? "20px 0" : "24px 0"}}>
      <summary style={{
        ...type.cardSerif(mobile ? 17 : 19),
        color:T_.text, cursor:"pointer", listStyle:"none",
        display:"flex", justifyContent:"space-between", alignItems:"center", gap:16
      }}>
        <span>{q}</span>
        <span aria-hidden style={{...type.kicker(), color:T_.silverDim, flexShrink:0}}>+</span>
      </summary>
      <p style={{...type.bodyLg(), color:T_.textMid, marginTop:14, maxWidth:680}}>{a}</p>
    </details>
  );
}

function Section({sec, mobile}){
  var r = useReveal(0.05);
  return (
    <div ref={r.ref} style={{...revealStyle(r.visible)}}>
      <GlassCard style={{padding: mobile ? "28px 24px" : "36px 36px"}}>
        <h3 style={{...type.cardSerif(mobile ? 19 : 22), color:T_.text, marginBottom:14, letterSpacing:-0.4}}>{sec.title}</h3>
        <p style={{...type.body(), color:T_.textMid}}>{sec.body}</p>
      </GlassCard>
    </div>
  );
}

export default function CatalogSeoBody({category}){
  var data = CONTENT[category];
  var mobile = useMobile();
  if(!data) return null;

  var faqJsonLd = {
    "@context":"https://schema.org",
    "@type":"FAQPage",
    "mainEntity": data.faqs.map(function(f){return {"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}})
  };

  return (
    <section style={{
      borderTop: `0.5px solid ${T_.border2}`,
      background: T_.bg
    }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLd)}}/>

      {/* Intro */}
      <div style={{
        padding: mobile ? "60px 22px 40px" : "100px 56px 60px",
        maxWidth:880, margin:"0 auto"
      }}>
        <SectionHeader
          kicker="The Detail"
          title={<>What members actually use Alfred for in <SilverText style={{fontStyle:"italic"}}>{data.italic}</SilverText></>}
        />
        <p style={{...type.bodyLg(), color:T_.textMid}}>{data.intro}</p>
      </div>

      {/* Sections grid */}
      <div style={{
        padding: mobile ? "0 22px 40px" : "0 56px 60px",
        maxWidth:1100, margin:"0 auto"
      }}>
        <div style={{
          display:"grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap: mobile ? 14 : 18
        }}>
          {data.sections.map(function(s, i){ return <Section key={i} sec={s} mobile={mobile}/>; })}
        </div>
      </div>

      {/* FAQ */}
      <div style={{
        padding: mobile ? "40px 22px 80px" : "60px 56px 120px",
        maxWidth:880, margin:"0 auto"
      }}>
        <SectionHeader kicker="Frequently asked" title="Common questions"/>
        <div>
          {data.faqs.map(function(f, i){ return <FaqItem key={i} q={f.q} a={f.a} mobile={mobile}/>; })}
        </div>
      </div>
    </section>
  );
}
