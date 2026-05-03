import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><path d="M42 18 C42 30 34 38 22 38 C34 38 42 46 42 58 C42 46 50 38 62 38 C50 38 42 30 42 18Z" fill={p.color||C.s1}/><path d="M58 42 C58 54 50 62 38 62 C50 62 58 70 58 82 C58 70 66 62 78 62 C66 62 58 54 58 42Z" fill={p.color||C.s1}/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}
function useIsMobile(bp){bp=bp||768;var[m,setM]=useState(function(){return typeof window!=="undefined"&&window.innerWidth<=bp});useEffect(function(){function c(){setM(window.innerWidth<=bp)}window.addEventListener("resize",c);return function(){window.removeEventListener("resize",c)}},[bp]);return m}
function spotsColor(s){return s<=6?"#FF453A":s<=10?"#FFD60A":"#34C759"}
function spotsShadow(s){return s<=6?"rgba(255,69,58,0.5)":s<=10?"rgba(255,214,10,0.4)":"rgba(52,199,89,0.4)"}

var SB="https://fbdgbnnkgyljehtccgaq.supabase.co/storage/v1/object/public/Website/";
var WA_NUM="447449562204";
function openWA(msg){window.open("https://wa.me/"+WA_NUM+"?text="+encodeURIComponent(msg),"_blank")}

var EVENTS={
  "monaco-grand-prix":{
    name:"Monaco Grand Prix",slug:"monaco-grand-prix",date:"June 5 – 7, 2026",location:"Monte Carlo, Monaco",tag:"F1",color:"#E11D48",spots:12,
    hero:SB+"Monaco-Race-Page-MAIN.webp",
    imgs:[SB+"Monaco-Race-Page-MAIN.webp",SB+"Monaco-Race-Page-MAIN.webp",SB+"Monaco-Race-Page-MAIN.webp"],
    tagline:"Private hospitality on the most famous corner in motorsport",
    desc:"Experience the Monaco Grand Prix from the Swimming Pool chicane — the most iconic corner in Formula 1. Alfred secures a private venue overlooking the chicane with unobstructed views of the action. Caviar and champagne service all weekend, private chef, premium catering, and after-party VIP access. No lanyards, no crowds, no compromises. The Monaco Grand Prix has been the crown jewel of Formula 1 since 1929 — a 3.337 km street circuit threaded through the principality, with elevation changes, blind apexes, and barriers that punish the smallest mistake. Of every venue on the F1 calendar, Monaco is the one drivers describe as a different category of difficulty entirely. Watching it from the right room transforms the weekend from a ticket purchase into a milestone — somewhere you go once and remember for the rest of your life.",
    venue:"The Alfred Lounge · Swimming Pool Chicane",
    perks:["Alfred Lounge · pool-side chicane view","Caviar & champagne service","Private chef · premium catering","After-party VIP access","Black card welcome · no lanyards","Helicopter transfer from Nice","Personal highlight reel"],
    schedule:[
      {day:"Friday, June 5",items:["Free Practice 1 & 2 from the Alfred Lounge","Lunch by private chef","Evening: Monte Carlo Casino night"]},
      {day:"Saturday, June 6",items:["Free Practice 3 & Qualifying","Alfred Lounge hospitality all day","Evening: Amber Lounge after-party"]},
      {day:"Sunday, June 7",items:["Race Day — full hospitality","Champagne & caviar from lights out","Post-race celebration & helicopter transfer"]},
    ],
    includes:["Private hospitality venue","Caviar & champagne all weekend","Premium catering · private chef","Personal concierge on-site","Airport/hotel transfers","After-party VIP access","Professional photography"],
    aboutSections:[
      {title:"Why the Swimming Pool Chicane",body:"The Swimming Pool section sits between the harbour-side run from Tabac and the right-hander into La Rascasse. It is the busiest, fastest, most-replayed stretch of the circuit — drivers brake from over 240 km/h to take the entrance kink, then thread the chicane in a single committed movement. From the Alfred Lounge balcony you are roughly fifteen metres above track level, with sightlines through the chicane and onto the Rascasse exit. Cars pass roughly every 50 to 80 seconds during the Sunday race. You feel the engine notes change against the seafront before the cars come into view, and you watch overtaking moves develop in real time rather than catching them on a screen. There is no better seat in Monaco."},
      {title:"What the weekend actually looks like",body:"Friday is two free-practice sessions, lunch by a private chef in the lounge, and a Monte Carlo Casino evening. Saturday is the third practice plus qualifying — the most tactical session of the weekend, where cars run lower fuel and softer compounds and the gaps between teams become visible. Saturday evening is Amber Lounge, the after-party that has been part of the Monaco calendar since 2003 and still draws current and former drivers, principals, and the wider paddock. Sunday is the race itself: doors open three hours before lights out, full hospitality runs across the morning, and post-race we move you from the lounge to a celebration dinner before the helicopter transfer back to Nice or your accommodation. The package includes professional photography across all three days — you get a private highlight reel within 72 hours."},
      {title:"Where to stay and how to arrive",body:"Most Alfred members stay in Monaco itself — the Hôtel de Paris, the Hermitage, or the Métropole — or across the border in Cap-Ferrat or Èze if they want quiet at the end of the day. We arrange every transfer. The recommended arrival is to fly into Nice (NCE) and take the seven-minute helicopter transfer to Monaco Heliport — included in the package and genuinely worth it for the coastline view alone. If you are flying private into Cannes-Mandelieu or Côte d'Azur, we coordinate ground transfer from the FBO. Sunday evening helicopter slots are at a premium across the principality during race weekend; book early and Alfred holds your slot."},
      {title:"Dress code and what to bring",body:"Monaco is the most formal F1 race on the calendar. The lounge dress code is smart — collared shirts, blazers, dresses, leather shoes — though casual within that frame is fine in the daytime. Evenings (Amber Lounge, casino, dinners) are jacket required. Bring layers; the harbour gets cool after sunset. The hospitality is fully catered so you do not need to plan around food, but a cap or sunglasses for the daytime is sensible — the chicane balcony is partially open. Phones, cameras, and noise-cancelling earplugs are all welcome. Cars are loud at this distance, and most members find earplugs improve their experience after the first hour."}
    ],
    faq:[
      {q:"How is this different from a regular Monaco hospitality package?",a:"Most Monaco hospitality is sold by the FIA Paddock Club or by the teams themselves — they cover the paddock side and pit lane but the trackside views are limited. The Alfred Lounge is privately held inventory at the Swimming Pool chicane with twelve seats. You get the trackside view that the paddock packages do not, plus full concierge support across the weekend, helicopter transfers, and curated evenings. The pricing sits between mid-tier paddock packages and the top-tier Casino-side terraces — for a materially better view of the racing."},
      {q:"What happens if it rains?",a:"Monaco often runs in mixed conditions — rain on Friday and Sunday is statistically common. The Alfred Lounge is fully covered with retractable openings, so hospitality continues uninterrupted. If a session is cancelled or red-flagged, your package is unaffected. The race itself rarely cancels — it has been red-flagged and restarted in the wet but full cancellations are exceptionally rare in modern F1."},
      {q:"Can I bring children?",a:"The lounge is age 12 and over for the Sunday race for safety and ear-protection reasons. Friday and Saturday sessions are open to under-12s with parental consent and provided ear protection. We recommend the Saturday qualifying session for younger family members — the atmosphere is excellent and the noise exposure is shorter than race day."},
      {q:"How early do I need to commit?",a:"Monaco is the most over-subscribed event on the Alfred calendar. We typically sell the lounge by mid-February for a June race. If you are reading this in March or later, the answer is request access immediately — we may be on a waitlist already. Centurion members have priority over Platinum members."}
    ],
    alfredNote:"This is one of our most exclusive packages. The Swimming Pool chicane is where races are won and lost — you'll feel the cars shake the ground beneath you. We keep it intimate to make sure the experience stays right. Request early — Monaco sells out faster than any other event on our calendar.",
    alfredTip:"Fly into Nice and take our helicopter transfer. The 7-minute flight over the coastline is worth it alone.",
    waMsg:"Hi Alfred, I'm interested in the Monaco Grand Prix experience (June 5–7, 2026). I'd like to learn more about availability and access.",
  },
  "miami-grand-prix":{
    name:"Miami Grand Prix",slug:"miami-grand-prix",date:"May 1 – 3, 2026",location:"Miami Gardens, Florida",tag:"F1",color:"#F97316",spots:8,
    hero:SB+"Screenshot%202026-03-25%20at%2022.36.44.png",
    imgs:[SB+"Screenshot%202026-03-25%20at%2022.36.44.png",SB+"Screenshot%202026-03-25%20at%2022.36.44.png",SB+"Screenshot%202026-03-25%20at%2022.36.44.png"],
    tagline:"Track-side luxury with direct paddock access at Turn 1",
    desc:"Our Miami Grand Prix package puts you in a private luxury suite overlooking Turn 1 — the most dramatic braking zone on the circuit. Direct paddock access means you'll walk where the drivers walk. After the race, we take over LIV, Story, and E11even for exclusive after-parties. This is Miami at its most electric. The Miami International Autodrome is a 5.41 km purpose-built circuit threaded around the Hard Rock Stadium complex in Miami Gardens, with 19 corners, three DRS zones, and a long flat-out run that produces some of the highest top speeds of the F1 calendar. The race joined the F1 calendar in 2022 and has rapidly established itself as the premier sporting and social weekend in Miami's spring season — the only event that genuinely competes with Art Basel for atmosphere.",
    venue:"Track-Side Luxury Suite · Turn 1",
    perks:["Private luxury suite · Turn 1","Paddock Club access","After-race LIV takeover","Supercar parade entry","Personal concierge all weekend","Yacht day party · Saturday","Celebrity meet & greet access"],
    schedule:[
      {day:"Friday, May 1",items:["Arrival & South Beach hotel check-in","Welcome cocktails at Faena rooftop","Free Practice 1 & 2 from suite"]},
      {day:"Saturday, May 2",items:["Free Practice 3 & Sprint Race","Paddock Club access & pit lane walk","Evening: Yacht day party in the bay"]},
      {day:"Sunday, May 3",items:["Race Day from Turn 1 suite","Full hospitality & open bar","Post-race: LIV takeover & E11even"]},
    ],
    includes:["Turn 1 private suite","Paddock Club passes","Full catering & open bar","After-party access (LIV, Story, E11even)","Hotel-circuit transfers","Personal concierge","Supercar parade ride-along"],
    aboutSections:[
      {title:"Why Turn 1",body:"Turn 1 at the Miami International Autodrome is the heaviest braking zone on the circuit. Cars approach at over 320 km/h on the long run from the start line and brake to roughly 140 km/h to take the right-hand entry, before transitioning into the Turn 2 left-hander. It is the most likely overtaking spot of the race — particularly on the opening lap and into the first DRS zone. The Alfred Turn 1 suite sits trackside on the inside of the corner, with elevated views down the start-finish straight on one side and into the apex of Turn 1 on the other. You see the entire braking event from the moment cars come off the racing line, and you have a direct sightline to the giant infield screen for replays of the rest of the lap. This is the corner where Miami races have been won and lost since 2022."},
      {title:"What the weekend actually looks like",body:"Friday is arrival and South Beach check-in (we recommend the Faena, the Edition, or the Setai — all walking distance from the after-party venues). Welcome cocktails at the Faena rooftop, then practice sessions one and two from the suite. Saturday is third practice and the Sprint Race — a shorter, points-paying race format that sets up Sunday's grid. Saturday daytime hospitality continues in the suite; evening is the Alfred yacht day party in Biscayne Bay. Sunday is race day: doors open 4 hours before lights out, full hospitality and open bar, paddock walk during the lunch break, the race itself, then directly to the LIV takeover and E11even afterparty. We have ground vehicles holding all weekend — you message your concierge and your car appears in under 10 minutes."},
      {title:"The after-parties are the second event",body:"Unlike Monaco or Silverstone, the Miami Grand Prix is a 50-50 split between the racing and the nightlife. LIV Miami runs an annual F1 takeover on the Sunday night with a rotating headliner — past years have hosted David Guetta, Tiësto, and Calvin Harris. E11even runs through to sunrise. Story usually books a major hip-hop or Latin act for the Saturday after the Sprint. The Alfred package includes guaranteed VIP table placement at all three venues — Story Saturday night, LIV Sunday immediate post-race, E11even from 1am onwards. Drivers, team principals, and the wider paddock are at all three venues across the weekend. The hospitality is structurally connected: members move from race to after-party with one concierge handling the entire transition."},
      {title:"Where to stay and how to arrive",body:"Stay in South Beach (Faena, Edition, Setai, 1 Hotel, W) or Brickell (Four Seasons Brickell, EAST, SLS) depending on whether you want oceanfront or city. The circuit is in Miami Gardens — about 35 minutes from South Beach, 25 from Brickell, including race-week traffic. We arrange every transfer. If you are flying private, Opa-Locka Executive Airport (OPF) is the closest FBO at roughly 15 minutes from the circuit. Miami International (MIA) is 25 minutes; Fort Lauderdale (FLL) is 45 minutes. We coordinate FBO and ground service for both."}
    ],
    faq:[
      {q:"What's the difference between the Turn 1 suite and the Paddock Club?",a:"The Paddock Club sits over the team garages with views of the pit lane and start-finish straight — strong for atmosphere but with limited visibility into the actual corners where racing happens. The Alfred Turn 1 suite is trackside at the corner where the most overtaking takes place. Most members find the Turn 1 suite is the better racing view, while the Paddock Club is better for paddock walks and team access. The Alfred package includes both — daytime in the Turn 1 suite, paddock walks during the lunch break."},
      {q:"How does the after-party access work?",a:"Your concierge handles entry at LIV, Story, and E11even — you walk in, your name is on the host stand, and your table is held. Bottle service is included up to a fixed minimum (which is high enough that most members do not exceed it). If your group goes over, the concierge bills the difference to your account at the venue's rate without markup."},
      {q:"What dress code applies?",a:"Daytime at the circuit is casual — shorts, polos, sneakers, sun protection. Saturday evening at the yacht party is resort wear. After-parties at LIV, Story, and E11even are upscale — collared shirts and closed-toe shoes for men, dresses or sharp separates for women. Athletic wear and hats are universally rejected at all three nightclubs. Pack accordingly."},
      {q:"Is this a good event for first-time F1 attendees?",a:"Yes. Miami is one of the most accessible Grands Prix on the calendar — modern facilities, English-speaking, easier travel logistics than Monaco or Silverstone, plus the after-party scene gives non-fans something to engage with even if the racing itself isn't their priority. We recommend it as a first F1 weekend if you're choosing between this and Monaco."}
    ],
    alfredNote:"Miami is our most high-energy package. The after-parties are legendary — last year we had guests stay until sunrise. The Turn 1 suite is limited to 20 guests, so the atmosphere stays right. If you're bringing a group, ask about our full suite buyout.",
    alfredTip:"Stay at the Faena or the Edition. We'll arrange everything — and the after-parties are closer.",
    waMsg:"Hi Alfred, I'm interested in the Miami Grand Prix experience (May 1–3, 2026). I'd like to know more about the Turn 1 suite and paddock access.",
  },
  "ibiza-opening":{
    name:"Ibiza Opening",slug:"ibiza-opening",date:"May – June 2026",location:"Ibiza, Spain",tag:"Nightlife",color:"#8B5CF6",spots:15,
    hero:SB+"slideshow-1740920048.jpg",
    imgs:[SB+"slideshow-1740920048.jpg",SB+"slideshow-1740920048.jpg",SB+"slideshow-1740920048.jpg"],
    tagline:"Season opening week across all four superclubs",
    desc:"The Ibiza season opening is the most anticipated week in nightlife. Alfred secures front-row access at Ushuaïa, VIP tables at Hï Ibiza, Pacha, and Amnesia across four incredible nights. Add a private villa with a personal chef, yacht day parties, and exclusive artist meet & greets. This is how Ibiza was meant to be experienced. The Ibiza season runs roughly from late May through to early October, and the opening week is by some distance the most concentrated and ambitious of the calendar — every superclub launches their summer residencies in the same seven-day window, every major DJ on the international circuit plays, and every villa, restaurant, and yacht charter on the island is booked at peak rates. The atmosphere is unrepeatable. The flip side is that planning it without help becomes a full-time job.",
    venue:"Hï Ibiza · Ushuaïa · Pacha · Amnesia",
    perks:["Hï Ibiza VIP table · 4 nights","Ushuaïa front-row access","Private villa with chef","Artist meet & greets","Yacht day party · full crew","Airport transfers","Personal nightlife concierge"],
    schedule:[
      {day:"Day 1 — Arrival",items:["Villa check-in & welcome champagne","Beach club lunch at Nikki Beach","Evening: Hï Ibiza opening night — VIP table"]},
      {day:"Day 2 — Ushuaïa",items:["Morning: yacht day party","Afternoon: pool & recovery at villa","Evening: Ushuaïa front-row, headliner set"]},
      {day:"Day 3 — Pacha",items:["Beach day at Cala Jondal","Private chef dinner at villa","Evening: Pacha — artist meet & greet"]},
      {day:"Day 4 — Amnesia",items:["Brunch at the villa","Sunset catamaran cruise","Evening: Amnesia closing — VIP booth"]},
    ],
    includes:["4 nights VIP club access","Private villa (up to 8 guests)","Personal chef · daily","Yacht day party","Artist meet & greets","Airport transfers","Nightlife concierge every night"],
    aboutSections:[
      {title:"The four superclubs, in order",body:"Hï Ibiza is the newest of the four, opened in 2017 on the site of the old Space, and operates two rooms — the Theatre (which hosts the headline residencies, including Black Coffee, Anyma, and FISHER in recent seasons) and the Club, which runs as a more intimate underground space. Ushuaïa is open-air, with the main stage facing a hotel pool and the audience standing or in tables on the deck — the energy is daytime-into-evening rather than late-night. Pacha is the original — running since 1973, hosting Solomun's flagship residency on Sundays, and the only club on the island where the original 1970s Balearic ethos genuinely survives. Amnesia is the most pure-electronic of the four, with the Terrace (open-air) and the Club Room running parallel programming. The Alfred package covers all four across the opening week, in the order that makes sense for the energy curve."},
      {title:"The villa is the platform, not the accommodation",body:"Member feedback on this package is consistent: the villa matters more than any individual club night. Having a private space with a personal chef, a pool, and proper recovery time between nights is the difference between four good nights and one good night plus three burned-out ones. We hold a roster of villas across the island — most of our partner villas are on the south coast (Cala Jondal, Cala Tarida, Es Cubells) for proximity to Ushuaïa, Hï, and Nikki Beach, with a smaller selection in the north (San Juan, Santa Eulalia) for members who want quieter mornings. Capacity ranges from 6 to 16 guests; chefs and housekeeping are included; pre-stocked groceries can be arranged on request."},
      {title:"Day plan, not just night plan",body:"Ibiza in late May or early June is roughly 24-28°C and the sea is warming. The Alfred package includes a full-day yacht charter (full crew, fuel, water toys, catering) — most members run this on day two or three with a swim stop at Es Vedrà and lunch at one of the floating restaurants in the marine reserve. We coordinate beach-club access at Nikki Beach (south coast), Beso Beach Club (Formentera), and Experimental Beach Club (Cap des Falcó) — usually one beach club per daytime, in rotation. Sunset catamaran cruises are available on day four for groups that want a quieter close to the week."},
      {title:"What to expect from the artist access",body:"The Alfred Ibiza package includes one or two artist meet & greets per week — coordinated through the venues' management rather than artist agents directly. Specific artists are confirmed roughly 4-6 weeks before the event because residencies and guest sets shift up to the last minute. We do not promise specific names; we promise access at the level the venue offers, which is consistently strong. If a member has a specific artist they want to meet, raise it on booking and we will tell you honestly whether it is achievable for that week."}
    ],
    faq:[
      {q:"How is opening week different from the rest of the season?",a:"Opening week (typically the last week of May into the first week of June) sees every venue launching their summer residency, with most DJs playing back-to-back debut sets across the four superclubs. Crowd density is higher than mid-season but the atmosphere is unmatched — there is a celebratory quality to opening week that the rest of the summer doesn't replicate. Mid-season (July) is hotter and busier; closing week (late September) is more reflective. Opening is the right choice for first-time visitors and for the most peak experience."},
      {q:"Is this suitable for non-clubbers in the group?",a:"Yes. The package is structured so that someone who does not want to be at a superclub every night can run the daytime programme (yacht, beach clubs, villa, restaurants) and join evenings selectively. We've had members bring partners who attended one of the four club nights and skipped the rest, and they had a strong week regardless. The villa makes this work — there's a base to come back to that isn't a hotel room."},
      {q:"What about food and water-toy logistics?",a:"The yacht charter includes lunch catering and a fully-stocked bar; water toys (jet skis, paddleboards, snorkel gear, towed inflatables) are on the boat. Villa breakfasts and at least one dinner per day are by your private chef; lunches are typically out at beach clubs or restaurants. Reservations at the top restaurants — Sublimotion, Heart Ibiza, La Gaia, Cas Costas, Beachouse — are booked through Alfred ahead of arrival; opening week walk-ins are essentially impossible at the top venues."},
      {q:"What's the realistic minimum and maximum group size?",a:"Minimum is 4 guests; maximum is 16 (limited by villa capacity). Our most common group is 8. For groups of 12+, we typically hold two adjacent villas rather than a single mega-villa for better sleep quality. Pricing scales with group size and villa selection — request access for a quote tied to your specific dates and group."}
    ],
    alfredNote:"This is our most popular summer package. The villa is the key — having your own private space with a chef means you can recover properly between nights. We've curated the schedule so the energy builds each day. Trust the order.",
    alfredTip:"Book the 8-person villa even if you're fewer — the space is worth it. And pace yourself on night one.",
    waMsg:"Hi Alfred, I'm interested in the Ibiza Opening experience (May–June 2026). I'd like to learn more about the villa and VIP club access.",
  },
  "roland-garros":{
    name:"Roland Garros",slug:"roland-garros",date:"May 18 – Jun 7, 2026",location:"Paris, France",tag:"Tennis",color:"#D97706",spots:6,
    hero:SB+"aEGghrh8WN-LVqbY_LEC06847-2RichardGasquetRG2025.avif",
    imgs:[SB+"aEGghrh8WN-LVqbY_LEC06847-2RichardGasquetRG2025.avif",SB+"aEGghrh8WN-LVqbY_LEC06847-2RichardGasquetRG2025.avif",SB+"aEGghrh8WN-LVqbY_LEC06847-2RichardGasquetRG2025.avif"],
    tagline:"Courtside hospitality at the French Open",
    desc:"Experience Roland Garros from a private box in Philippe Chatrier — the cathedral of clay-court tennis. Champagne terraces between sets, a Michelin dining experience for lunch, player lounge access, and chauffeur transfers from your hotel. Alfred handles every detail so you can focus on the tennis. Roland Garros is the only Grand Slam played on red clay — a surface that materially changes the game from what you see at the Australian Open, Wimbledon, or the US Open. Rallies are longer, points last more shots, sliding into shots is rewarded, and the players who specialise on this surface (Nadal across 22 years, Iga Świątek in the modern era) develop a level of dominance that does not appear at the other Slams. Watching the French Open in person is the best way to understand why clay-court tennis is its own sport.",
    venue:"Philippe Chatrier · Private Box",
    perks:["Philippe Chatrier box seats","Champagne terrace access","Michelin dining experience","Player lounge entry","Chauffeur from hotel","Behind-the-scenes tour","Official merchandise pack"],
    schedule:[
      {day:"Match Day",items:["Chauffeur pickup from hotel","Arrival at VIP entrance — no queues","Morning matches from private box","Michelin lunch on the terrace","Afternoon feature match — box seats","Champagne service throughout","Chauffeur return to hotel"]},
    ],
    includes:["Private box seats (up to 4 guests)","Michelin dining experience","Champagne terrace access","Player lounge entry","Chauffeur hotel transfers","Official Roland Garros gift pack","Personal concierge on-site"],
    aboutSections:[
      {title:"Why a private box in Philippe Chatrier",body:"Court Philippe Chatrier seats roughly 15,000 and is the largest of the three principal courts at Roland Garros (Suzanne Lenglen and Simonne Mathieu being the others). General-admission seating in Chatrier is excellent at the lower tier and merely adequate higher up — the angles compress as you move further from court level, and on a long match in heavy sun the experience can become tiring. The Alfred private box is in the lower tier on the centre line, eye-level with the players when they serve. Boxes hold up to four guests and are private to your group across the day, which means you control the rhythm — when to watch, when to walk to the player lounge, when to take lunch on the terrace. For genuine fans of the sport, the difference is significant; for guests who are there primarily for the social occasion, the difference is even bigger."},
      {title:"Which days are best",body:"Roland Garros runs across three weeks — qualifying, then two weeks of main draw — but the strongest combination of atmosphere and tennis quality is the second-week quarter-finals through to the men's and women's finals on the last weekend. First-week sessions can be excellent value if you want to see specific players in earlier rounds, particularly the Day Sessions on Court Suzanne Lenglen which often feature top-ten names without the centre-court premium. The semifinals and finals are the prestige sessions and book out first. Alfred holds inventory across all sessions; tell us your preference (specific player, specific round, specific date) and we work to it."},
      {title:"What the day looks like",body:"Morning chauffeur from your hotel — typically the Hôtel de Crillon, the Bristol, the Plaza Athénée, or a Costes property — and arrival at the VIP entrance bypasses the general-admission queues entirely (which on a final Saturday can be 90 minutes long). Morning matches from the private box, a champagne and canapés service mid-session, then lunch in the players' lounge or on the terrace by a Michelin chef. Afternoon feature match returns to the box. Between sets your concierge can walk you through to the practice courts to watch the next day's competitors warm up — a quirk of Roland Garros that the casual visitor never sees. Chauffeur return to your hotel after the last point."},
      {title:"Dress code and what to bring",body:"Roland Garros is the most relaxed of the four Grand Slams in terms of dress code — there is no formal requirement — but the private box and Michelin dining areas are smart-casual environments and most members dress for them. Smart trousers or a midi dress, leather shoes or quality flats, a light jacket. The clay courts in late May / early June can run hot in direct sun and cool in the shade, so layers help. Bring sunglasses (the clay reflects light), a hat (optional but recommended for centre-court sun), and bottled water (provided in the box but you may want extra). Phones are welcome; SLR cameras with telephoto lenses require a press credential and are not allowed for spectators."}
    ],
    faq:[
      {q:"How is the Alfred box different from official Roland Garros hospitality?",a:"The official Roland Garros hospitality programme is run through Lagardère Sports and provides good-quality boxes and dining in dedicated hospitality villages adjacent to the courts. The Alfred difference is the chauffeur transfers, the on-site concierge, the access to player lounges (which the official package does not always include depending on session), and the integration with the rest of your Paris stay — restaurant reservations, after-hours nightlife, and additional days of programming. Pricing is comparable to the upper-tier Lagardère packages."},
      {q:"Can we attend multiple days?",a:"Yes — the most common Alfred Roland Garros booking is two or three days within the same week, allowing you to see different players, different match types (singles vs doubles), and different courts (Chatrier, Lenglen, Mathieu). We discount the multi-day package and rotate dining to keep it fresh. Members coming from outside Paris often combine two days of tennis with two days of city programming."},
      {q:"What if play is suspended for rain?",a:"Court Philippe Chatrier and Court Suzanne Lenglen both have retractable roofs (added in 2020 and 2024 respectively), so play continues regardless of weather. Court Simonne Mathieu does not have a roof and rain delays push matches there to a later session or another day. The Alfred package is unaffected by rain delays — your box, your dining, and your transfers continue regardless. If a match you specifically came to see is rescheduled to a different day, we work with you on the next steps."},
      {q:"Can children attend?",a:"Yes — Roland Garros is the most child-friendly of the Grand Slams. Younger family members do well in the boxes for shorter sessions (3-4 hours rather than full days). Tennis is a slower-paced spectator sport than F1 or football, which suits younger attention spans, and the player practice courts are visible behind the scenes which children typically find engaging."}
    ],
    alfredNote:"Roland Garros is pure elegance. Our private box in Philippe Chatrier gives you the best sightlines in the stadium — centre court, eye level. The Michelin lunch between sessions is extraordinary. We recommend the quarter-finals or semi-finals for the best combination of atmosphere and quality of play.",
    alfredTip:"Stay at the Hôtel de Crillon — it's a 20-minute chauffeur ride and the perfect complement to a day at Roland Garros.",
    waMsg:"Hi Alfred, I'm interested in the Roland Garros experience (May 18–Jun 7, 2026). I'd like to know more about the private box and hospitality.",
  },
  "royal-ascot":{
    name:"Royal Ascot",slug:"royal-ascot",date:"June 16 – 20, 2026",location:"Ascot, England",tag:"Racing",color:"#0EA5E9",spots:4,
    hero:SB+"coverprocessionroyalascot.webp",
    imgs:[SB+"coverprocessionroyalascot.webp",SB+"coverprocessionroyalascot.webp",SB+"coverprocessionroyalascot.webp"],
    tagline:"The Royal Enclosure experience — elevated",
    desc:"Royal Ascot is the pinnacle of British racing and social elegance. Alfred secures Royal Enclosure badges, a private box for 12 guests, Michelin chefs on-site, helicopter transfer from central London, and a Savile Row styling consultation so you arrive impeccably dressed. This is tradition, perfected. Royal Ascot has been run since 1711 — over three hundred years of racing on the same Berkshire course, and one of the longest continuously-running sporting events in the world. Across five days in the third week of June, the meeting hosts more Group 1 races than any other in the calendar (eight, including the Gold Cup, the Prince of Wales's Stakes, the Diamond Jubilee Stakes, and the Coronation Stakes), and serves as the social centrepiece of the British summer.",
    venue:"Royal Enclosure · Private Box for 12",
    perks:["Royal Enclosure badges","Private box for 12 guests","Michelin chef on-site","Helicopter from London","Savile Row styling session","Fine wine & champagne service","Horse racing tips from our expert"],
    schedule:[
      {day:"Race Day",items:["Morning: Savile Row fitting (first-timers)","Helicopter from Battersea to Ascot","Royal Enclosure arrival — private box","Lunch by Michelin chef in your box","Afternoon racing — all 6 races","Champagne & fine wine throughout","Helicopter return to London"]},
    ],
    includes:["Royal Enclosure badges","Private box (up to 12)","Michelin chef · full day","Helicopter transfers","Savile Row styling consultation","Fine wine & champagne","Racing expert & tips"],
    aboutSections:[
      {title:"What the Royal Enclosure actually is",body:"The Royal Enclosure is the most prestigious admissions tier at Royal Ascot, with attendance restricted to badge-holders sponsored by an existing member who has attended at least four times. Without that sponsorship route, badges are not available for direct purchase. The Alfred package includes Royal Enclosure badges through our partnership network — this is why the package is sold as a package rather than a standalone ticket. Inside the enclosure, dress code is strictly enforced (morning suits with top hats for gentlemen; formal day dresses with hats covering at least the crown of the head for ladies), and the atmosphere is materially different from the King George V Stand or Queen Anne Enclosure — quieter, more deliberate, more focused on the quality of the racing and the social occasion."},
      {title:"The Royal Procession",body:"Each day at 2pm, the Royal Procession brings the King and senior members of the Royal Family from Windsor Castle along the racecourse in an open carriage, with Royal Ascot Outriders leading the way. The Procession is visible from the Royal Enclosure and from the private boxes; the Alfred box is positioned with a clear sightline to the parade route. This is one of the most photographed five minutes of the British sporting summer, and watching it from a private box (with champagne in hand, top hat on the table) is a particular kind of experience. The carriage horses change daily; the Royal party varies; the timing is precisely 2pm regardless of weather."},
      {title:"The five days, ranked",body:"Tuesday opens the meeting with the Queen Anne Stakes and the King's Stand Stakes — strong opening cards but quieter atmosphere. Wednesday hosts the Prince of Wales's Stakes and the Royal Hunt Cup. Thursday is Gold Cup Day, also informally known as Ladies' Day — the most prestigious race of the meeting (the Gold Cup itself is a 2.5-mile staying race) and the most photographed day for fashion. Friday is the Coronation Stakes and the Commonwealth Cup — strong sprint racing. Saturday is the Diamond Jubilee Stakes and the Hardwicke Stakes, with the closing card. If you can attend only one day, attend Thursday. If you can attend two, add Saturday for the closing atmosphere or Wednesday for the racing card."},
      {title:"Dress code, in detail",body:"The Royal Enclosure dress code is the most formal at any UK sporting event and is rigorously enforced — guests not in compliance are denied entry. For gentlemen: black or grey morning dress (morning coat, waistcoat, white shirt with collar and tie, top hat in matching colour), with the top hat removed indoors and replaced outdoors, and trousers properly tailored. For ladies: dresses or skirts of modest length (above-knee is not permitted), strap width of at least one inch, hats with a base of at least four inches in diameter, no fascinators (a recent rule change). The Alfred package includes a Savile Row styling consultation for first-time attendees, with introductions to Henry Poole, Anderson & Sheppard, or Gieves & Hawkes for gentlemen; for ladies, we recommend hat designers including Philip Treacy and Stephen Jones. Allow a minimum of six weeks for any bespoke fittings."}
    ],
    faq:[
      {q:"I've never attended Royal Ascot — is this the right entry point?",a:"Yes, particularly because the Alfred package handles the dress code and the Royal Enclosure access — the two pieces that create the most friction for first-time attendees. The Savile Row introduction (free to first-time guests) ensures you arrive correctly dressed, the helicopter transfer eliminates the M3/M25 traffic that adds two hours to a London-Ascot trip on race day, and the on-site concierge handles the small etiquette pieces (where to stand for the Procession, when to remove your top hat, how to read the racecard) that the venue expects but does not explain."},
      {q:"How does the betting work in the box?",a:"Tote betting is available in your box through your concierge — most members place modest bets on each race for the social aspect of having a horse to follow rather than for serious wagering. The on-site racing expert provides commentary and form analysis ahead of each race, which most members find materially more interesting than the betting itself. If you want to bet larger, we coordinate with one of the on-course bookmakers; this is rare among Alfred members."},
      {q:"What if it rains?",a:"Royal Ascot runs in any weather short of frozen ground or unsafe wind. The Royal Enclosure has covered seating areas and the private boxes are fully covered with a heated indoor section, so you remain dry. Light rain on a Royal Ascot day is part of the British summer and many members consider it adds to the atmosphere; heavy rain affects the going (the underfoot conditions for the horses) and shifts which horses are likely to perform well — the on-site racing expert factors this into pre-race commentary."},
      {q:"Can I bring younger family members?",a:"Children under 18 are welcome in the Royal Enclosure with an accompanying badge-holder, but younger ages can find the day long and the dress code uncomfortable. Most Alfred members bring children 14 and over for the Royal Procession portion of the day and arrange shorter attendance for younger family members. Saturday tends to be the most family-friendly day of the meeting."}
    ],
    alfredNote:"Royal Ascot is one of the few events where the experience is as much about the social occasion as the sport. Our private box is in the heart of the Royal Enclosure — you'll see the Royal Procession from your table. The Savile Row consultation is complimentary for first-time guests and genuinely worthwhile.",
    alfredTip:"Ladies' Day (Thursday) has the best atmosphere. Gold Cup Day (Thursday) is the prestige race. We recommend both.",
    waMsg:"Hi Alfred, I'm interested in the Royal Ascot experience (June 16–20, 2026). I'd like to learn more about the Royal Enclosure and private box.",
  },
};

export default function EventDetailPage(){
  var {slug}=useParams();
  var nav=useNavigate();
  var mob=useIsMobile(768);
  var V=EVENTS[slug];
  var [imgIdx,setImgIdx]=useState(0);
  var [loaded,setLoaded]=useState(false);
  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var schedRef=useRef(null);var schedVis=useVis(schedRef);
  var inclRef=useRef(null);var inclVis=useVis(inclRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200);window.scrollTo(0,0)},[slug]);

  if(!V)return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <Mark size={48} color={C.s7}/>
      <p style={{...sf(18,500),color:C.s4}}>Event not found</p>
      <button onClick={function(){nav("/events")}} style={{padding:"10px 24px",borderRadius:10,background:C.el,border:"1px solid "+C.bd,color:C.s1,cursor:"pointer",...sf(13,500)}}>View all events</button>
    </div>
  );

  var divider=<div style={{height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)",margin:"0"}}/>;
  var pad=mob?"0 20px":"0 40px";
  var maxW=1160;

  return(
    <div style={{background:C.bg,color:C.s1,minHeight:"100vh",overflowX:"hidden"}}>
      <SEOHead
        title={V.name+" — Book VIP Tickets | Alfred Concierge"}
        description={V.desc}
        path={"/events/"+V.slug}
        keywords={"tickets "+V.name+", "+V.name+" VIP, "+V.name+" hospitality, "+V.name+" 2026"}
        jsonLd={(function(){
          var schema = [
            {"@context":"https://schema.org","@type":"Event","name":V.name,"description":V.desc,"startDate":V.date.split(" ")[0],"location":{"@type":"Place","name":V.location},"image":V.hero,"offers":{"@type":"Offer","url":"https://alfredconcierge.app/events/"+V.slug,"availability":"https://schema.org/PreOrder","priceCurrency":"USD"},"organizer":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app"}},
            {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},{"@type":"ListItem","position":2,"name":"Events","item":"https://alfredconcierge.app/events"},{"@type":"ListItem","position":3,"name":V.name,"item":"https://alfredconcierge.app/events/"+V.slug}]}
          ];
          if(V.faq&&V.faq.length){
            schema.push({"@context":"https://schema.org","@type":"FAQPage","mainEntity":V.faq.map(function(f){return {"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}})});
          }
          return schema;
        })()}
      />
      <style>{`
@keyframes evtSlideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes evtFadeIn{from{opacity:0}to{opacity:1}}
      `}</style>

      {/* Nav */}
      <div style={{padding:mob?"16px 20px":"20px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid "+C.bd,opacity:loaded?1:0,animation:loaded?"evtFadeIn 0.5s ease both":"none",position:"sticky",top:0,background:C.bg,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div onClick={function(){nav("/")}} style={{cursor:"pointer"}}><Mark size={mob?20:24}/></div>
          <div onClick={function(){nav("/events")}} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:mob?"6px 10px":"8px 14px",borderRadius:10,background:C.el,border:"1px solid "+C.bd,transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.s3} strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span style={{...sf(mob?10:11,500),color:C.s3}}>All Events</span>
          </div>
        </div>
        <div onClick={function(){openWA(V.waMsg)}} style={{display:"flex",alignItems:"center",gap:8,padding:mob?"10px 16px":"10px 22px",borderRadius:12,background:C.s1,cursor:"pointer",...sf(mob?12:13,700),color:C.bg,transition:"all 0.3s",whiteSpace:"nowrap"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.15)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
          {mob?"Request":"Request Access"}
        </div>
      </div>

      {/* Hero section */}
      <div style={{maxWidth:maxW,margin:"0 auto",padding:mob?"0 20px":"0 40px"}}>
        <div style={{padding:mob?"32px 0 0":"56px 0 0",opacity:loaded?1:0,animation:loaded?"evtSlideUp 0.7s ease 0.2s both":"none"}}>

          {/* Tags row */}
          <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:16}}>
            <div style={{padding:"5px 14px",borderRadius:10,...sf(10,700),letterSpacing:0.8,textTransform:"uppercase",background:V.color+"25",border:"1px solid "+V.color+"40",color:V.color}}>{V.tag}</div>
            <div style={{padding:"5px 12px",borderRadius:10,background:"rgba(255,255,255,0.05)",border:"0.5px solid rgba(255,255,255,0.08)",...sf(10,500),color:C.s4}}>{V.date}</div>
            <div style={{display:"flex",alignItems:"center",gap:4,...sf(10,500),color:C.s5}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {V.location}
            </div>
          </div>

          {/* Title */}
          <h1 style={{...sf(mob?34:56,700),letterSpacing:mob?-1:-2,lineHeight:1.05,marginBottom:12}}>{V.name}</h1>
          <p style={{...sf(mob?14:17,400),color:C.s3,lineHeight:1.6,maxWidth:700,marginBottom:20}}>{V.tagline}</p>

          {/* Info chips */}
          <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:10,background:C.el,border:"1px solid "+C.bd}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:spotsColor(V.spots),boxShadow:"0 0 8px "+spotsShadow(V.spots)}}/>
              <span style={{...sf(12,600),color:spotsColor(V.spots)}}>{V.spots} spots left</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:10,background:C.el,border:"1px solid "+C.bd,...sf(12,500),color:C.s4}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              {V.date}
            </div>
            <div style={{padding:"7px 14px",borderRadius:10,background:C.el,border:"1px solid "+C.bd,...sf(12,500),color:C.s5}}>{V.venue}</div>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div style={{maxWidth:maxW,margin:"0 auto",padding:mob?"28px 20px 0":"40px 40px 0",opacity:loaded?1:0,animation:loaded?"evtSlideUp 0.8s ease 0.4s both":"none"}}>
        <div style={{borderRadius:mob?18:22,overflow:"hidden",height:mob?240:500,position:"relative"}}>
          <img src={V.hero} alt={V.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 60%,rgba(10,10,11,0.35) 100%)"}}/>
        </div>
      </div>

      {/* Request Access banner */}
      <div style={{maxWidth:maxW,margin:"0 auto",padding:mob?"20px 20px 0":"28px 40px 0",opacity:loaded?1:0,animation:loaded?"evtSlideUp 0.8s ease 0.5s both":"none"}}>
        <div style={{padding:mob?"18px 20px":"22px 28px",borderRadius:18,background:C.el,border:"1px solid "+C.bd,display:"flex",alignItems:mob?"stretch":"center",justifyContent:"space-between",flexDirection:mob?"column":"row",gap:mob?14:0}}>
          <div>
            <div style={{...sf(mob?16:18,700),color:C.s1,marginBottom:4}}>Request Access</div>
            <div style={{display:"flex",alignItems:"center",gap:mob?10:12,flexWrap:"wrap"}}>
              {["No fees","Personal concierge","Limited spots"].map(function(t,i){
                return <span key={i} style={{...sf(11,400),color:C.s5,display:"flex",alignItems:"center",gap:5}}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>{t}
                </span>
              })}
            </div>
          </div>
          <div onClick={function(){openWA(V.waMsg)}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:mob?"13px 0":"13px 36px",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,700),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
            Request Access
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{maxWidth:maxW,margin:"0 auto",padding:pad}}>

        {/* Divider */}
        <div style={{margin:"36px 0"}}>{divider}</div>

        {/* What's Included */}
        <div ref={inclRef} style={{paddingBottom:36,opacity:inclVis?1:0,transform:inclVis?"translateY(0)":"translateY(20px)",transition:"all 0.7s ease"}}>
          <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:20}}>What's Included</p>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {V.includes.map(function(item,i){
              return <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",borderRadius:12,background:C.el,border:"1px solid "+C.bd}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                <span style={{...sf(13,500),color:C.s2}}>{item}</span>
              </div>
            })}
          </div>
        </div>

        <div style={{marginBottom:36}}>{divider}</div>

        {/* About */}
        <div style={{paddingBottom:36}}>
          <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:14}}>About This Experience</p>
          <p style={{...sf(mob?14:15,400),color:C.s3,lineHeight:1.85,maxWidth:800}}>{V.desc}</p>
        </div>

        <div style={{marginBottom:36}}>{divider}</div>

        {/* Gallery */}
        <div style={{paddingBottom:36}}>
          <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:18}}>Gallery</p>
          {mob?(
            /* Mobile: vertical stack */
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {V.imgs.map(function(img,i){
                return <div key={i} onClick={function(){setImgIdx(i)}} style={{height:200,borderRadius:14,overflow:"hidden",border:"1px solid "+(imgIdx===i?V.color+"50":C.bd),transition:"all 0.4s",cursor:"pointer",position:"relative"}}>
                  <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
                  {imgIdx!==i&&<div style={{position:"absolute",inset:0,background:"rgba(10,10,11,0.35)"}}/>}
                </div>
              })}
            </div>
          ):(
            /* Desktop: accordion gallery */
            <div style={{display:"flex",gap:12,height:420,borderRadius:20,overflow:"hidden"}}>
              {V.imgs.map(function(img,i){
                return <div key={i} onClick={function(){setImgIdx(i)}} style={{flex:imgIdx===i?3:1,overflow:"hidden",cursor:"pointer",transition:"all 0.7s cubic-bezier(0.16,1,0.3,1)",borderRadius:16,position:"relative",border:"1px solid "+(imgIdx===i?V.color+"40":C.bd)}}>
                  <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",transition:"transform 0.7s ease",transform:imgIdx===i?"scale(1)":"scale(1.08)"}}/>
                  {imgIdx!==i&&<div style={{position:"absolute",inset:0,background:"rgba(10,10,11,0.4)",transition:"all 0.5s"}}/>}
                </div>
              })}
            </div>
          )}
        </div>

        <div style={{marginBottom:36}}>{divider}</div>

        {/* Schedule */}
        <div ref={schedRef} style={{paddingBottom:36,opacity:schedVis?1:0,transform:schedVis?"translateY(0)":"translateY(20px)",transition:"all 0.7s ease"}}>
          <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:18}}>Schedule</p>
          <div style={{display:"grid",gridTemplateColumns:mob?"1fr":V.schedule.length===1?"1fr":"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {V.schedule.map(function(day,di){
              return <div key={di} style={{padding:"20px 22px",borderRadius:16,background:C.el,border:"1px solid "+C.bd}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:V.color,boxShadow:"0 0 10px "+V.color+"60"}}/>
                  <p style={{...sf(13,700),color:C.s1}}>{day.day}</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  {day.items.map(function(item,ii){
                    return <div key={ii} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                      <div style={{width:1,height:"100%",minHeight:14,marginTop:5,background:V.color+"30",flexShrink:0}}/>
                      <span style={{...sf(13,400),color:C.s3,lineHeight:1.5}}>{item}</span>
                    </div>
                  })}
                </div>
              </div>
            })}
          </div>
        </div>

        <div style={{marginBottom:36}}>{divider}</div>

        {/* Perks */}
        <div style={{paddingBottom:36}}>
          <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:18}}>Experience Highlights</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {V.perks.map(function(pk,i){
              return <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:12,background:V.color+"10",border:"1px solid "+V.color+"25"}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:V.color,flexShrink:0}}/>
                <span style={{...sf(13,500),color:C.s2}}>{pk}</span>
              </div>
            })}
          </div>
        </div>

        <div style={{marginBottom:36}}>{divider}</div>

        {/* Deep-dive about sections */}
        {V.aboutSections&&V.aboutSections.length>0&&<>
          <div style={{paddingBottom:36}}>
            <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:18}}>The Detail</p>
            <div style={{display:"flex",flexDirection:"column",gap:24,maxWidth:820}}>
              {V.aboutSections.map(function(sec,i){
                return <div key={i}>
                  <h3 style={{...sf(mob?17:19,600),color:C.s1,marginBottom:10,letterSpacing:-0.3}}>{sec.title}</h3>
                  <p style={{...sf(mob?14:15,400),color:C.s3,lineHeight:1.8}}>{sec.body}</p>
                </div>;
              })}
            </div>
          </div>
          <div style={{marginBottom:36}}>{divider}</div>
        </>}

        {/* FAQ */}
        {V.faq&&V.faq.length>0&&<>
          <div style={{paddingBottom:36}}>
            <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:18}}>Frequently Asked</p>
            <div style={{maxWidth:820}}>
              {V.faq.map(function(item,i){
                return <details key={i} style={{borderBottom:"1px solid "+C.bd,padding:"20px 0"}}>
                  <summary style={{...sf(mob?14:15,500),color:C.s1,cursor:"pointer",listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
                    <span>{item.q}</span>
                    <span style={{...sf(20,300),color:C.s5,flexShrink:0}}>+</span>
                  </summary>
                  <p style={{...sf(mob?13:14,400),color:C.s4,lineHeight:1.7,marginTop:12}}>{item.a}</p>
                </details>;
              })}
            </div>
          </div>
          <div style={{marginBottom:36}}>{divider}</div>
        </>}

        {/* Alfred's Note */}
        <div ref={noteRef} style={{paddingBottom:mob?48:64,opacity:noteVis?1:0,transform:noteVis?"translateY(0)":"translateY(20px)",transition:"all 0.7s ease"}}>
          <div style={{display:"flex",gap:mob?14:18,alignItems:"flex-start"}}>
            <div style={{width:mob?34:38,height:mob?34:38,borderRadius:10,background:C.el,border:"1px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Mark size={mob?17:19}/>
            </div>
            <div style={{flex:1}}>
              <p style={{...sf(10,600),color:C.s6,letterSpacing:2.5,textTransform:"uppercase",marginBottom:10}}>Alfred's Note</p>
              <p style={{...sf(mob?13:14,400),color:C.s4,lineHeight:1.8,fontStyle:"italic",marginBottom:V.alfredTip?14:0}}>{V.alfredNote}</p>
              {V.alfredTip&&<div style={{padding:"12px 16px",borderRadius:12,background:C.el,border:"1px solid "+C.bd}}>
                <p style={{...sf(12,600),color:C.gold}}>Tip: <span style={{color:C.s3,fontWeight:400}}>{V.alfredTip}</span></p>
              </div>}
            </div>
          </div>
        </div>

      </div>

      {/* Sticky bottom CTA — mobile only */}
      {mob&&<div style={{position:"fixed",bottom:0,left:0,right:0,padding:"14px 20px",background:C.bg,borderTop:"1px solid "+C.bd,zIndex:40,display:"flex",gap:10}}>
        <div onClick={function(){openWA(V.waMsg)}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,700),color:C.bg}}>
          Request Access
        </div>
      </div>}
      {mob&&<div style={{height:80}}/>}
    </div>
  );
}
