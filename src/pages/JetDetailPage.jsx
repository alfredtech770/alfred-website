import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DarkDatePicker from "../components/DarkDatePicker";
import SEOHead from "../components/SEOHead";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

/* ═══ AIRPORT DATABASE ═══ */
var AIRPORTS=[
  {code:"MIA",city:"Miami",name:"Miami International",country:"US"},
  {code:"OPF",city:"Miami",name:"Opa-Locka Executive",country:"US"},
  {code:"FLL",city:"Fort Lauderdale",name:"Fort Lauderdale-Hollywood Intl",country:"US"},
  {code:"PBI",city:"Palm Beach",name:"Palm Beach International",country:"US"},
  {code:"TEB",city:"New York",name:"Teterboro",country:"US"},
  {code:"HPN",city:"New York",name:"Westchester County",country:"US"},
  {code:"JFK",city:"New York",name:"John F. Kennedy International",country:"US"},
  {code:"EWR",city:"Newark",name:"Newark Liberty International",country:"US"},
  {code:"LGA",city:"New York",name:"LaGuardia",country:"US"},
  {code:"LAX",city:"Los Angeles",name:"Los Angeles International",country:"US"},
  {code:"VNY",city:"Los Angeles",name:"Van Nuys",country:"US"},
  {code:"BUR",city:"Burbank",name:"Hollywood Burbank",country:"US"},
  {code:"SNA",city:"Orange County",name:"John Wayne",country:"US"},
  {code:"SFO",city:"San Francisco",name:"San Francisco International",country:"US"},
  {code:"OAK",city:"Oakland",name:"Oakland International",country:"US"},
  {code:"SJC",city:"San Jose",name:"San Jose International",country:"US"},
  {code:"ORD",city:"Chicago",name:"O'Hare International",country:"US"},
  {code:"MDW",city:"Chicago",name:"Midway International",country:"US"},
  {code:"PWK",city:"Chicago",name:"Chicago Executive",country:"US"},
  {code:"DFW",city:"Dallas",name:"Dallas/Fort Worth International",country:"US"},
  {code:"DAL",city:"Dallas",name:"Dallas Love Field",country:"US"},
  {code:"ADS",city:"Dallas",name:"Addison Airport",country:"US"},
  {code:"IAH",city:"Houston",name:"George Bush Intercontinental",country:"US"},
  {code:"HOU",city:"Houston",name:"William P. Hobby",country:"US"},
  {code:"ATL",city:"Atlanta",name:"Hartsfield-Jackson International",country:"US"},
  {code:"PDK",city:"Atlanta",name:"DeKalb-Peachtree",country:"US"},
  {code:"BOS",city:"Boston",name:"Logan International",country:"US"},
  {code:"BED",city:"Boston",name:"Hanscom Field",country:"US"},
  {code:"DCA",city:"Washington D.C.",name:"Ronald Reagan National",country:"US"},
  {code:"IAD",city:"Washington D.C.",name:"Dulles International",country:"US"},
  {code:"SEA",city:"Seattle",name:"Seattle-Tacoma International",country:"US"},
  {code:"BFI",city:"Seattle",name:"Boeing Field",country:"US"},
  {code:"DEN",city:"Denver",name:"Denver International",country:"US"},
  {code:"APA",city:"Denver",name:"Centennial",country:"US"},
  {code:"LAS",city:"Las Vegas",name:"Harry Reid International",country:"US"},
  {code:"VGT",city:"Las Vegas",name:"North Las Vegas",country:"US"},
  {code:"PHX",city:"Phoenix",name:"Phoenix Sky Harbor",country:"US"},
  {code:"SDL",city:"Scottsdale",name:"Scottsdale Airport",country:"US"},
  {code:"MSP",city:"Minneapolis",name:"Minneapolis-Saint Paul Intl",country:"US"},
  {code:"DTW",city:"Detroit",name:"Detroit Metropolitan",country:"US"},
  {code:"MCO",city:"Orlando",name:"Orlando International",country:"US"},
  {code:"TPA",city:"Tampa",name:"Tampa International",country:"US"},
  {code:"RSW",city:"Fort Myers",name:"Southwest Florida Intl",country:"US"},
  {code:"ASE",city:"Aspen",name:"Aspen/Pitkin County",country:"US"},
  {code:"EGE",city:"Vail",name:"Eagle County Regional",country:"US"},
  {code:"MVY",city:"Martha's Vineyard",name:"Martha's Vineyard",country:"US"},
  {code:"ACK",city:"Nantucket",name:"Nantucket Memorial",country:"US"},
  {code:"SXM",city:"St. Maarten",name:"Princess Juliana Intl",country:"Caribbean"},
  {code:"NAS",city:"Nassau",name:"Lynden Pindling Intl",country:"Bahamas"},
  {code:"PLS",city:"Turks & Caicos",name:"Providenciales Intl",country:"Caribbean"},
  {code:"MBJ",city:"Montego Bay",name:"Sangster International",country:"Jamaica"},
  {code:"CUN",city:"Cancun",name:"Cancun International",country:"Mexico"},
  {code:"SJD",city:"Cabo San Lucas",name:"Los Cabos International",country:"Mexico"},
  {code:"PVR",city:"Puerto Vallarta",name:"Gustavo Diaz Ordaz Intl",country:"Mexico"},
  {code:"MEX",city:"Mexico City",name:"Benito Juarez International",country:"Mexico"},
  {code:"TLC",city:"Toluca",name:"Toluca International",country:"Mexico"},
  {code:"CDG",city:"Paris",name:"Charles de Gaulle",country:"France"},
  {code:"LBG",city:"Paris",name:"Le Bourget",country:"France"},
  {code:"NCE",city:"Nice",name:"Nice Côte d'Azur",country:"France"},
  {code:"MRS",city:"Marseille",name:"Marseille Provence",country:"France"},
  {code:"LHR",city:"London",name:"Heathrow",country:"UK"},
  {code:"LTN",city:"London",name:"Luton",country:"UK"},
  {code:"STN",city:"London",name:"Stansted",country:"UK"},
  {code:"LCY",city:"London",name:"London City",country:"UK"},
  {code:"BQH",city:"London",name:"Biggin Hill",country:"UK"},
  {code:"FAB",city:"London",name:"Farnborough",country:"UK"},
  {code:"MAN",city:"Manchester",name:"Manchester",country:"UK"},
  {code:"EDI",city:"Edinburgh",name:"Edinburgh",country:"UK"},
  {code:"GVA",city:"Geneva",name:"Geneva",country:"Switzerland"},
  {code:"ZRH",city:"Zurich",name:"Zurich",country:"Switzerland"},
  {code:"FCO",city:"Rome",name:"Leonardo da Vinci–Fiumicino",country:"Italy"},
  {code:"CIA",city:"Rome",name:"Ciampino",country:"Italy"},
  {code:"MXP",city:"Milan",name:"Malpensa",country:"Italy"},
  {code:"LIN",city:"Milan",name:"Linate",country:"Italy"},
  {code:"VCE",city:"Venice",name:"Marco Polo",country:"Italy"},
  {code:"NAP",city:"Naples",name:"Naples International",country:"Italy"},
  {code:"OLB",city:"Sardinia",name:"Olbia Costa Smeralda",country:"Italy"},
  {code:"AGP",city:"Malaga",name:"Malaga-Costa del Sol",country:"Spain"},
  {code:"BCN",city:"Barcelona",name:"Barcelona-El Prat",country:"Spain"},
  {code:"MAD",city:"Madrid",name:"Adolfo Suarez Madrid-Barajas",country:"Spain"},
  {code:"IBZ",city:"Ibiza",name:"Ibiza",country:"Spain"},
  {code:"PMI",city:"Palma de Mallorca",name:"Palma de Mallorca",country:"Spain"},
  {code:"FRA",city:"Frankfurt",name:"Frankfurt am Main",country:"Germany"},
  {code:"MUC",city:"Munich",name:"Munich",country:"Germany"},
  {code:"TXL",city:"Berlin",name:"Berlin Brandenburg",country:"Germany"},
  {code:"AMS",city:"Amsterdam",name:"Schiphol",country:"Netherlands"},
  {code:"BRU",city:"Brussels",name:"Brussels",country:"Belgium"},
  {code:"VIE",city:"Vienna",name:"Vienna International",country:"Austria"},
  {code:"LIS",city:"Lisbon",name:"Humberto Delgado",country:"Portugal"},
  {code:"FAO",city:"Faro",name:"Faro",country:"Portugal"},
  {code:"ATH",city:"Athens",name:"Eleftherios Venizelos",country:"Greece"},
  {code:"JMK",city:"Mykonos",name:"Mykonos",country:"Greece"},
  {code:"JTR",city:"Santorini",name:"Santorini (Thira)",country:"Greece"},
  {code:"SKG",city:"Thessaloniki",name:"Makedonia",country:"Greece"},
  {code:"DUB",city:"Dublin",name:"Dublin",country:"Ireland"},
  {code:"DXB",city:"Dubai",name:"Dubai International",country:"UAE"},
  {code:"DWC",city:"Dubai",name:"Al Maktoum International",country:"UAE"},
  {code:"AUH",city:"Abu Dhabi",name:"Zayed International",country:"UAE"},
  {code:"DOH",city:"Doha",name:"Hamad International",country:"Qatar"},
  {code:"RUH",city:"Riyadh",name:"King Khalid International",country:"Saudi Arabia"},
  {code:"JED",city:"Jeddah",name:"King Abdulaziz International",country:"Saudi Arabia"},
  {code:"TLV",city:"Tel Aviv",name:"Ben Gurion International",country:"Israel"},
  {code:"IST",city:"Istanbul",name:"Istanbul Airport",country:"Turkey"},
  {code:"CAI",city:"Cairo",name:"Cairo International",country:"Egypt"},
  {code:"CMN",city:"Casablanca",name:"Mohammed V International",country:"Morocco"},
  {code:"RAK",city:"Marrakech",name:"Menara",country:"Morocco"},
  {code:"CPT",city:"Cape Town",name:"Cape Town International",country:"South Africa"},
  {code:"JNB",city:"Johannesburg",name:"O.R. Tambo International",country:"South Africa"},
  {code:"NRT",city:"Tokyo",name:"Narita International",country:"Japan"},
  {code:"HND",city:"Tokyo",name:"Haneda",country:"Japan"},
  {code:"HKG",city:"Hong Kong",name:"Hong Kong International",country:"China"},
  {code:"PVG",city:"Shanghai",name:"Pudong International",country:"China"},
  {code:"PEK",city:"Beijing",name:"Capital International",country:"China"},
  {code:"SIN",city:"Singapore",name:"Changi",country:"Singapore"},
  {code:"ICN",city:"Seoul",name:"Incheon International",country:"South Korea"},
  {code:"BKK",city:"Bangkok",name:"Suvarnabhumi",country:"Thailand"},
  {code:"SYD",city:"Sydney",name:"Kingsford Smith",country:"Australia"},
  {code:"MEL",city:"Melbourne",name:"Melbourne",country:"Australia"},
  {code:"YYZ",city:"Toronto",name:"Pearson International",country:"Canada"},
  {code:"YUL",city:"Montreal",name:"Trudeau International",country:"Canada"},
  {code:"YVR",city:"Vancouver",name:"Vancouver International",country:"Canada"},
  {code:"GRU",city:"Sao Paulo",name:"Guarulhos International",country:"Brazil"},
  {code:"GIG",city:"Rio de Janeiro",name:"Galeao International",country:"Brazil"},
  {code:"EZE",city:"Buenos Aires",name:"Ministro Pistarini",country:"Argentina"},
  {code:"BOG",city:"Bogota",name:"El Dorado International",country:"Colombia"},
  {code:"SCL",city:"Santiago",name:"Arturo Merino Benitez",country:"Chile"},
  {code:"LIM",city:"Lima",name:"Jorge Chavez International",country:"Peru"},
  {code:"PTY",city:"Panama City",name:"Tocumen International",country:"Panama"},
  {code:"BDA",city:"Bermuda",name:"L.F. Wade International",country:"Bermuda"},
  {code:"AUA",city:"Aruba",name:"Queen Beatrix International",country:"Aruba"},
  {code:"SBH",city:"St. Barts",name:"Gustaf III",country:"Caribbean"},
  {code:"EIS",city:"Tortola",name:"Terrance B. Lettsome Intl",country:"BVI"},
  {code:"ANU",city:"Antigua",name:"V.C. Bird International",country:"Antigua"},
  {code:"BGI",city:"Barbados",name:"Grantley Adams International",country:"Barbados"},
  {code:"MNL",city:"Manila",name:"Ninoy Aquino International",country:"Philippines"},
  {code:"DEL",city:"New Delhi",name:"Indira Gandhi International",country:"India"},
  {code:"BOM",city:"Mumbai",name:"Chhatrapati Shivaji Maharaj Intl",country:"India"},
  {code:"MLE",city:"Maldives",name:"Velana International",country:"Maldives"},
  {code:"MBA",city:"Mombasa",name:"Moi International",country:"Kenya"},
  {code:"NBO",city:"Nairobi",name:"Jomo Kenyatta International",country:"Kenya"},
  {code:"ADD",city:"Addis Ababa",name:"Bole International",country:"Ethiopia"},
  {code:"LOS",city:"Lagos",name:"Murtala Muhammed International",country:"Nigeria"},
  {code:"ACC",city:"Accra",name:"Kotoka International",country:"Ghana"},
  {code:"CMB",city:"Colombo",name:"Bandaranaike International",country:"Sri Lanka"},
  {code:"KUL",city:"Kuala Lumpur",name:"KL International",country:"Malaysia"},
  {code:"DPS",city:"Bali",name:"Ngurah Rai International",country:"Indonesia"},
  {code:"HNL",city:"Honolulu",name:"Daniel K. Inouye International",country:"US"},
  {code:"ANC",city:"Anchorage",name:"Ted Stevens International",country:"US"},
  {code:"SJU",city:"San Juan",name:"Luis Munoz Marin International",country:"Puerto Rico"},
  {code:"STT",city:"St. Thomas",name:"Cyril E. King",country:"USVI"},
  {code:"AGC",city:"Pittsburgh",name:"Allegheny County",country:"US"},
  {code:"PIT",city:"Pittsburgh",name:"Pittsburgh International",country:"US"},
  {code:"CLE",city:"Cleveland",name:"Cleveland Hopkins",country:"US"},
  {code:"CMH",city:"Columbus",name:"John Glenn International",country:"US"},
  {code:"CVG",city:"Cincinnati",name:"Cincinnati/NKY International",country:"US"},
  {code:"IND",city:"Indianapolis",name:"Indianapolis International",country:"US"},
  {code:"MKE",city:"Milwaukee",name:"General Mitchell International",country:"US"},
  {code:"STL",city:"St. Louis",name:"Lambert International",country:"US"},
  {code:"MCI",city:"Kansas City",name:"Kansas City International",country:"US"},
  {code:"MSY",city:"New Orleans",name:"Louis Armstrong International",country:"US"},
  {code:"BNA",city:"Nashville",name:"Nashville International",country:"US"},
  {code:"MEM",city:"Memphis",name:"Memphis International",country:"US"},
  {code:"CLT",city:"Charlotte",name:"Charlotte Douglas International",country:"US"},
  {code:"RDU",city:"Raleigh",name:"Raleigh-Durham International",country:"US"},
  {code:"JAX",city:"Jacksonville",name:"Jacksonville International",country:"US"},
  {code:"SAV",city:"Savannah",name:"Savannah/Hilton Head Intl",country:"US"},
  {code:"PDX",city:"Portland",name:"Portland International",country:"US"},
  {code:"SLC",city:"Salt Lake City",name:"Salt Lake City International",country:"US"},
  {code:"ABQ",city:"Albuquerque",name:"Albuquerque Intl Sunport",country:"US"},
  {code:"AUS",city:"Austin",name:"Austin-Bergstrom International",country:"US"},
  {code:"SAT",city:"San Antonio",name:"San Antonio International",country:"US"},
  {code:"SAN",city:"San Diego",name:"San Diego International",country:"US"},
  {code:"SMO",city:"Santa Monica",name:"Santa Monica Municipal",country:"US"},
  {code:"SDM",city:"San Diego",name:"Brown Field Municipal",country:"US"},
];

function AirportSearch(p){
  var [query,setQuery]=useState("");
  var [open,setOpen]=useState(false);
  var [focusIdx,setFocusIdx]=useState(-1);
  var ref=useRef(null);
  var inputRef=useRef(null);
  var listRef=useRef(null);
  useEffect(function(){
    function h(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false)}
    document.addEventListener("pointerdown",h);
    return function(){document.removeEventListener("pointerdown",h)}
  },[]);
  var displayVal=p.value;
  var q=query.toLowerCase().trim();
  var results=q.length===0?AIRPORTS.slice(0,12):AIRPORTS.filter(function(a){
    return a.city.toLowerCase().indexOf(q)>-1||a.code.toLowerCase().indexOf(q)>-1||a.name.toLowerCase().indexOf(q)>-1||a.country.toLowerCase().indexOf(q)>-1;
  }).slice(0,12);
  function pick(a){p.onChange(a.city+" ("+a.code+")");setQuery("");setOpen(false);setFocusIdx(-1)}
  function onKey(e){
    if(!open)return;
    if(e.key==="ArrowDown"){e.preventDefault();setFocusIdx(function(i){var n=Math.min(i+1,results.length-1);if(listRef.current&&listRef.current.children[n])listRef.current.children[n].scrollIntoView({block:"nearest"});return n})}
    else if(e.key==="ArrowUp"){e.preventDefault();setFocusIdx(function(i){var n=Math.max(i-1,0);if(listRef.current&&listRef.current.children[n])listRef.current.children[n].scrollIntoView({block:"nearest"});return n})}
    else if(e.key==="Enter"&&focusIdx>=0&&focusIdx<results.length){e.preventDefault();pick(results[focusIdx])}
    else if(e.key==="Escape"){setOpen(false)}
  }
  var small=p.small;
  return(
    <div ref={ref} style={{position:"relative"}}>
      <div onClick={function(){setOpen(true);setTimeout(function(){if(inputRef.current)inputRef.current.focus()},50)}} style={{display:"flex",alignItems:"center",gap:8,padding:small?"10px 14px":"0 14px",height:small?"auto":40,borderRadius:12,background:open?"rgba(244,244,245,0.06)":C.srf,border:"1px solid "+(open?C.s5:C.bd),cursor:"text",transition:"all 0.3s"}} onMouseEnter={function(e){if(!open)e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){if(!open)e.currentTarget.style.borderColor=C.bd}}>
        {open?<input ref={inputRef} value={query} onChange={function(e){setQuery(e.target.value);setFocusIdx(-1);if(!open)setOpen(true)}} onKeyDown={onKey} placeholder={displayVal} style={{flex:1,background:"none",border:"none",outline:"none",color:C.s1,...sf(small?13:11,small?500:400),width:"100%"}}/>
        :<span style={{...sf(small?13:11,500),color:C.s1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.displayShort?displayVal.split(" (")[0]:displayVal}</span>}
      </div>
      {open&&results.length>0&&<div ref={listRef} style={{position:"absolute",top:"100%",left:0,right:0,marginTop:6,borderRadius:14,background:C.el,border:"1px solid "+C.bd,overflowY:"auto",overflowX:"hidden",zIndex:9999,maxHeight:280,boxShadow:"0 16px 48px rgba(0,0,0,0.6)"}}>
        {results.map(function(a,i){
          var focused=i===focusIdx;
          return <div key={a.code} onClick={function(){pick(a)}} style={{padding:"11px 14px",cursor:"pointer",background:focused?"rgba(244,244,245,0.08)":"transparent",borderBottom:"1px solid rgba(44,44,49,0.5)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,transition:"background 0.15s"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(244,244,245,0.06)";setFocusIdx(i)}} onMouseLeave={function(e){if(!focused)e.currentTarget.style.background="transparent"}}>
            <div>
              <div style={{...sf(13,500),color:C.s1}}>{a.city}<span style={{...sf(11,400),color:C.s5,marginLeft:6}}>({a.code})</span></div>
              <div style={{...sf(10,400),color:C.s6,marginTop:2}}>{a.name}</div>
            </div>
            <span style={{...sf(9,400),color:C.s7,whiteSpace:"nowrap"}}>{a.country}</span>
          </div>
        })}
        {q.length>0&&results.length===0&&<div style={{padding:"16px 14px",textAlign:"center",...sf(12,400),color:C.s6}}>No airports found</div>}
      </div>}
    </div>
  );
}

/* ═══ CABIN LAYOUT DATA PER JET ═══ */
var CABIN_LAYOUTS={
  "global-7500":{title:"Bombardier Global 7500 — Four-Zone Cabin",zones:[
    {name:"Forward Club",color:"#34C759",x:160,w:160,type:"club4"},
    {name:"Conference & Dining",color:"#FFD60A",x:340,w:170,type:"conference"},
    {name:"Entertainment Suite",color:"#A1A1AA",x:530,w:160,type:"entertainment"},
    {name:"Master Stateroom",color:"#E4E4E7",x:710,w:170,type:"stateroom"}
  ]},
  "global-6000":{title:"Bombardier Global 6000 — Three-Zone Cabin",zones:[
    {name:"Forward Club",color:"#34C759",x:160,w:200,type:"club4"},
    {name:"Mid Lounge",color:"#FFD60A",x:380,w:200,type:"lounge"},
    {name:"Private Suite",color:"#E4E4E7",x:600,w:280,type:"stateroom"}
  ]},
  "global-5000":{title:"Bombardier Global 5000 — Three-Zone Cabin",zones:[
    {name:"Forward Club",color:"#34C759",x:160,w:200,type:"club4"},
    {name:"Lounge",color:"#A1A1AA",x:380,w:200,type:"lounge"},
    {name:"Rest Area",color:"#E4E4E7",x:600,w:280,type:"rest"}
  ]},
  "challenger-850":{title:"Bombardier Challenger 850 — Three-Zone Cabin",zones:[
    {name:"Club Seating",color:"#34C759",x:160,w:220,type:"club4"},
    {name:"Lounge & Divan",color:"#FFD60A",x:400,w:200,type:"lounge"},
    {name:"Bedroom",color:"#E4E4E7",x:620,w:260,type:"stateroom"}
  ]},
  "challenger-605":{title:"Bombardier Challenger 605 — Two-Zone Cabin",zones:[
    {name:"Club Seating",color:"#34C759",x:160,w:340,type:"club6"},
    {name:"Divan & Galley",color:"#A1A1AA",x:520,w:360,type:"divan"}
  ]},
  "challenger-350":{title:"Bombardier Challenger 350 — Two-Zone Cabin",zones:[
    {name:"Club Seating",color:"#34C759",x:160,w:380,type:"club6"},
    {name:"Refreshment Center",color:"#A1A1AA",x:560,w:320,type:"galley"}
  ]},
  "falcon-7x":{title:"Dassault Falcon 7X — Three-Zone Cabin",zones:[
    {name:"Forward Club",color:"#34C759",x:160,w:200,type:"club4"},
    {name:"Dining",color:"#FFD60A",x:380,w:200,type:"conference"},
    {name:"Lounge & Rest",color:"#E4E4E7",x:600,w:280,type:"rest"}
  ]},
  "g450":{title:"Gulfstream G450 — Three-Zone Cabin",zones:[
    {name:"Forward Club",color:"#34C759",x:160,w:220,type:"club4"},
    {name:"Conference",color:"#FFD60A",x:400,w:200,type:"conference"},
    {name:"Rest Area",color:"#E4E4E7",x:620,w:260,type:"rest"}
  ]},
  "citation-xls":{title:"Cessna Citation XLS+ — Single Cabin",zones:[
    {name:"Club Seating",color:"#34C759",x:160,w:720,type:"club8"}
  ]},
  "lineage-1000e":{title:"Embraer Lineage 1000E — Five-Zone Cabin",zones:[
    {name:"Lounge",color:"#34C759",x:160,w:130,type:"club4"},
    {name:"Conference",color:"#FFD60A",x:300,w:130,type:"conference"},
    {name:"Entertainment",color:"#A1A1AA",x:440,w:120,type:"entertainment"},
    {name:"Dining",color:"#FF9F0A",x:570,w:120,type:"lounge"},
    {name:"Master Suite",color:"#E4E4E7",x:700,w:180,type:"stateroom"}
  ]},
  "challenger-604":{title:"Bombardier Challenger 604 — Two-Zone Cabin",zones:[
    {name:"Club Seating",color:"#34C759",x:160,w:340,type:"club6"},
    {name:"Divan & Galley",color:"#A1A1AA",x:520,w:360,type:"divan"}
  ]},
  "challenger-300":{title:"Bombardier Challenger 300 — Two-Zone Cabin",zones:[
    {name:"Club Seating",color:"#34C759",x:160,w:380,type:"club6"},
    {name:"Refreshment Center",color:"#A1A1AA",x:560,w:300,type:"galley"}
  ]},
  "g650":{title:"Gulfstream G650 — Four-Zone Cabin",zones:[
    {name:"Forward Club",color:"#34C759",x:160,w:180,type:"club4"},
    {name:"Conference",color:"#FFD60A",x:360,w:170,type:"conference"},
    {name:"Entertainment",color:"#A1A1AA",x:550,w:160,type:"entertainment"},
    {name:"Private Suite",color:"#E4E4E7",x:730,w:170,type:"stateroom"}
  ]},
  "giv-sp":{title:"Gulfstream GIV-SP — Three-Zone Cabin",zones:[
    {name:"Forward Club",color:"#34C759",x:160,w:220,type:"club4"},
    {name:"Lounge",color:"#FFD60A",x:400,w:200,type:"lounge"},
    {name:"Rest Area",color:"#E4E4E7",x:620,w:260,type:"rest"}
  ]},
  "legacy-600":{title:"Embraer Legacy 600 — Three-Zone Cabin",zones:[
    {name:"Club Seating",color:"#34C759",x:160,w:220,type:"club4"},
    {name:"Lounge",color:"#FFD60A",x:400,w:200,type:"lounge"},
    {name:"Rest Area",color:"#E4E4E7",x:620,w:260,type:"rest"}
  ]},
  "legacy-650":{title:"Embraer Legacy 650 — Three-Zone Cabin",zones:[
    {name:"Club Seating",color:"#34C759",x:160,w:220,type:"club4"},
    {name:"Mid Lounge",color:"#FFD60A",x:400,w:200,type:"lounge"},
    {name:"Private Suite",color:"#E4E4E7",x:620,w:280,type:"stateroom"}
  ]}
};

function drawZoneSeats(z){
  var cx=z.x,w=z.w,col=z.color;
  var pad=10;/* inner padding from zone edges */
  var x0=cx+pad,x1=cx+w-pad,iw=w-pad*2;/* inner left, inner right, inner width */
  var els=[];
  /* zone background */
  els.push(<rect key="bg" x={cx} y={46} width={w} height={88} rx={8} fill="#1A1A1E" stroke="#2C2C31" strokeWidth="0.8"/>);
  if(z.type==="club4"){
    var sw=Math.min(26,iw*0.22),tw=Math.min(30,iw*0.24),gap=4;
    var grpW=sw+gap+tw+gap+sw;var mx=cx+w/2;
    els.push(<rect key="s1" x={mx-grpW/2} y={56} width={sw} height={28} rx={5} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="s2" x={mx-grpW/2} y={96} width={sw} height={28} rx={5} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="tb" x={mx-tw/2} y={64} width={tw} height={52} rx={4} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.6"/>);
    els.push(<rect key="s3" x={mx+grpW/2-sw} y={56} width={sw} height={28} rx={5} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="s4" x={mx+grpW/2-sw} y={96} width={sw} height={28} rx={5} fill="none" stroke={col} strokeWidth="1.2"/>);
  }else if(z.type==="club6"){
    var sp=iw/3,ssw=Math.min(14,sp*0.22),stw=Math.min(24,sp*0.32);
    for(var i=0;i<3;i++){var bx=x0+sp*i+sp/2;
      els.push(<rect key={"t"+i} x={bx-stw/2} y={64} width={stw} height={52} rx={4} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.6"/>);
      els.push(<rect key={"a"+i} x={bx-stw/2-ssw-3} y={70} width={ssw} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
      els.push(<rect key={"b"+i} x={bx-stw/2-ssw-3} y={92} width={ssw} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
      els.push(<rect key={"c"+i} x={bx+stw/2+3} y={70} width={ssw} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
      els.push(<rect key={"d"+i} x={bx+stw/2+3} y={92} width={ssw} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
    }
  }else if(z.type==="club8"){
    var sp2=iw/4,ssw2=Math.min(14,sp2*0.22),stw2=Math.min(24,sp2*0.32);
    for(var j=0;j<4;j++){var bx2=x0+sp2*j+sp2/2;
      els.push(<rect key={"t"+j} x={bx2-stw2/2} y={64} width={stw2} height={52} rx={4} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.6"/>);
      els.push(<rect key={"a"+j} x={bx2-stw2/2-ssw2-3} y={70} width={ssw2} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
      els.push(<rect key={"b"+j} x={bx2-stw2/2-ssw2-3} y={92} width={ssw2} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
      els.push(<rect key={"c"+j} x={bx2+stw2/2+3} y={70} width={ssw2} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
      els.push(<rect key={"d"+j} x={bx2+stw2/2+3} y={92} width={ssw2} height={18} rx={4} fill="none" stroke={col} strokeWidth="1"/>);
    }
  }else if(z.type==="conference"){
    var tw2=Math.min(iw*0.6,100),sw2=Math.min(16,iw*0.12),hSeat=Math.min(22,iw*0.14);
    var mx2=cx+w/2;
    els.push(<rect key="tbl" x={mx2-tw2/2} y={60} width={tw2} height={60} rx={6} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.6"/>);
    els.push(<rect key="s1" x={mx2-tw2/2-sw2-4} y={65} width={sw2} height={hSeat} rx={4} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="s2" x={mx2-tw2/2-sw2-4} y={93} width={sw2} height={hSeat} rx={4} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="s3" x={mx2+tw2/2+4} y={65} width={sw2} height={hSeat} rx={4} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="s4" x={mx2+tw2/2+4} y={93} width={sw2} height={hSeat} rx={4} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<rect key="s5" x={mx2-20} y={48} width={16} height={12} rx={3} fill="none" stroke={col} strokeWidth="0.8"/>);
    els.push(<rect key="s6" x={mx2+4} y={48} width={16} height={12} rx={3} fill="none" stroke={col} strokeWidth="0.8"/>);
  }else if(z.type==="entertainment"){
    var sofaW=Math.min(iw*0.35,50),seatW=Math.min(iw*0.3,40);
    els.push(<rect key="d1" x={x0} y={54} width={sofaW} height={24} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="d2" x={x0} y={102} width={sofaW} height={24} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    var tvX=x0+sofaW+Math.min((iw-sofaW-seatW)*0.4,20);
    els.push(<rect key="tv" x={tvX} y={64} width={4} height={52} rx={2} fill="#52525B"/>);
    els.push(<rect key="s1" x={x1-seatW} y={56} width={seatW} height={26} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="s2" x={x1-seatW} y={98} width={seatW} height={26} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
  }else if(z.type==="stateroom"){
    var bedW=Math.min(iw*0.45,80),lavW=Math.min(iw*0.25,40);
    els.push(<rect key="bed" x={x0} y={56} width={bedW} height={68} rx={6} fill="none" stroke={col} strokeWidth="1.2"/>);
    els.push(<line key="bl" x1={x0} y1={90} x2={x0+bedW} y2={90} stroke="#3F3F46" strokeWidth="0.5"/>);
    els.push(<rect key="p1" x={x0+6} y={62} width={Math.min(22,bedW*0.35)} height={14} rx={4} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.5"/>);
    if(bedW>50)els.push(<rect key="p2" x={x0+6+Math.min(22,bedW*0.35)+4} y={62} width={Math.min(22,bedW*0.35)} height={14} rx={4} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.5"/>);
    var partX=x0+bedW+8;
    els.push(<line key="part" x1={partX} y1={50} x2={partX} y2={130} stroke="#3F3F46" strokeWidth="0.8"/>);
    var lavX=partX+6;
    els.push(<rect key="lav" x={lavX} y={56} width={lavW} height={30} rx={5} fill="none" stroke="#52525B" strokeWidth="0.8"/>);
    els.push(<circle key="sh" cx={lavX+lavW/2} cy={71} r={Math.min(5,lavW/4)} fill="none" stroke="#52525B" strokeWidth="0.6"/>);
    els.push(<rect key="wc" x={lavX} y={96} width={lavW} height={28} rx={5} fill="none" stroke="#52525B" strokeWidth="0.8"/>);
  }else if(z.type==="lounge"){
    var sofaLW=Math.min(iw*0.4,80),tblW=Math.min(iw*0.3,60);
    els.push(<rect key="sf1" x={x0} y={54} width={sofaLW} height={24} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="sf2" x={x0} y={102} width={sofaLW} height={24} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="tb" x={x1-tblW} y={66} width={tblW} height={48} rx={4} fill="#2C2C31" stroke="#3F3F46" strokeWidth="0.6"/>);
  }else if(z.type==="rest"){
    var divW=Math.min(iw*0.5,100),cabW=Math.min(iw*0.25,50);
    els.push(<rect key="dv1" x={x0} y={54} width={divW} height={28} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="dv2" x={x0} y={98} width={divW} height={28} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="cab" x={x1-cabW} y={56} width={cabW} height={68} rx={5} fill="none" stroke="#52525B" strokeWidth="0.8"/>);
  }else if(z.type==="divan"){
    var dvW=Math.min(iw*0.4,120),glW=Math.min(iw*0.35,100);
    els.push(<rect key="dv" x={x0} y={54} width={dvW} height={72} rx={6} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="gl" x={x1-glW} y={54} width={glW} height={34} rx={5} fill="none" stroke="#52525B" strokeWidth="0.8"/>);
    els.push(<rect key="g2" x={x1-glW} y={96} width={glW} height={28} rx={5} fill="none" stroke="#52525B" strokeWidth="0.8"/>);
  }else if(z.type==="galley"){
    var gW=Math.min(iw*0.35,100),lvW=Math.min(iw*0.35,100);
    els.push(<rect key="g1" x={x0} y={54} width={gW} height={34} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="g2" x={x0} y={96} width={gW} height={28} rx={5} fill="none" stroke={col} strokeWidth="1"/>);
    els.push(<rect key="lv" x={x1-lvW} y={56} width={lvW} height={68} rx={6} fill="none" stroke="#52525B" strokeWidth="0.8"/>);
    els.push(<circle key="sk" cx={x1-lvW/2} cy={90} r={Math.min(10,lvW/4)} fill="none" stroke="#52525B" strokeWidth="0.6"/>);
  }
  /* zone label — positioned below fuselage */
  els.push(<text key="lbl" x={cx+w/2} y={166} style={{fontSize:9,fill:col,fontFamily:"-apple-system,sans-serif",fontWeight:600}} textAnchor="middle">{z.name}</text>);
  return els;
}

function CabinSVG(p){
  var layout=p.layout;if(!layout)return null;
  var zones=layout.zones;
  var lastZ=zones[zones.length-1];
  var svgW=lastZ.x+lastZ.w+80;/* 80px padding for tail curve */
  return(
    <svg viewBox={"0 0 "+svgW+" 185"} style={{width:"100%",minWidth:Math.min(680,svgW),height:"auto",display:"block"}}>
      <path d={"M60 30 Q0 90 60 150 L"+(svgW-60)+" 150 Q"+svgW+" 90 "+(svgW-60)+" 30 Z"} fill="#1F1F23" stroke="#2C2C31" strokeWidth="1.5"/>
      <path d="M60 30 Q20 90 60 150" fill="none" stroke="#3F3F46" strokeWidth="1"/>
      {/* Cockpit */}
      <rect x="65" y="50" width="70" height="80" rx="6" fill="#18181B" stroke="#2C2C31" strokeWidth="1"/>
      <circle cx="85" cy="78" r="6" fill="none" stroke="#52525B" strokeWidth="1"/>
      <circle cx="85" cy="102" r="6" fill="none" stroke="#52525B" strokeWidth="1"/>
      <rect x="100" y="70" width="28" height="16" rx="3" fill="none" stroke="#52525B" strokeWidth="0.8"/>
      <rect x="100" y="94" width="28" height="16" rx="3" fill="none" stroke="#52525B" strokeWidth="0.8"/>
      <text x="100" y="166" style={{fontSize:9,fill:"#71717A",fontFamily:"-apple-system,sans-serif",fontWeight:500}}>Cockpit</text>
      <line x1="145" y1="38" x2="145" y2="142" stroke="#2C2C31" strokeWidth="1" strokeDasharray="3,3"/>
      {/* Zones */}
      {zones.map(function(z,i){
        var items=drawZoneSeats(z);
        var divX=z.x+z.w+5;
        if(i<zones.length-1)items.push(<line key={"div"+i} x1={divX} y1={38} x2={divX} y2={142} stroke="#2C2C31" strokeWidth="1" strokeDasharray="3,3"/>);
        return <g key={i}>{items}</g>;
      })}
      {/* Windows */}
      {Array.from({length:Math.floor((svgW-200)/30)},function(_,i){return 100+i*30}).filter(function(wx){return wx<svgW-80}).map(function(wx,wi){return(<g key={wi}><ellipse cx={wx} cy="34" rx="5" ry="2.5" fill="none" stroke="#2C2C31" strokeWidth="0.6"/><ellipse cx={wx} cy="146" rx="5" ry="2.5" fill="none" stroke="#2C2C31" strokeWidth="0.6"/></g>)})}
    </svg>
  );
}

var JETS={
"global-7500":{
  name:"Bombardier Global 7500",tagline:"VistaJet's flagship. Four living spaces. Permanent stateroom.",
  type:"Ultra Long Range",from:"$25,000/hr",
  imgs:["https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80","https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80"],
  pax:19,range:"14,260 km",speed:"Mach 0.925",ceiling:"51,000 ft",
  engine:"2× GE Passport",cabin:"6'2\" tall · 8'0\" wide · 54 ft long",
  rating:4.9,reviewCount:36,
  alfredNote:"The Global 7500 is the reason VistaJet exists at this level. Four distinct living spaces — use the forward club for meetings, the mid-cabin for dining, the entertainment zone for films, and the permanent stateroom with closing door for sleep. At 4,500 ft cabin altitude at 45,000 ft cruise, you land feeling like you haven't flown.",
  alfredTip:"Empty legs are frequently available on the MIA→NYC and CDG→LBG routes. Ask Alfred — we can save you up to 60%.",
  included:["Dedicated crew (2 pilots + flight attendant)","Custom Dior amenity kits","Full catering & premium beverages","Ground transportation coordination","Ka-band Wi-Fi & satellite phone","Permanent stateroom with lie-flat bed","Full-size lavatory with shower","195 cu ft baggage hold"],
  routes:[{from:"Miami",to:"Paris",time:"~9 hrs",est:"$225,000"},{from:"Miami",to:"New York",time:"~3 hrs",est:"$75,000"},{from:"Paris",to:"Dubai",time:"~7 hrs",est:"$175,000"},{from:"New York",to:"London",time:"~7.5 hrs",est:"$187,500"},{from:"Miami",to:"Ibiza",time:"~10 hrs",est:"$250,000"},{from:"Paris",to:"Nice",time:"~1.5 hrs",est:"$37,500"}],
  specs:[{l:"Range",v:"14,260 km / 7,700 nmi"},{l:"Max Speed",v:"Mach 0.925"},{l:"Ceiling",v:"51,000 ft"},{l:"Engine",v:"2× GE Passport"},{l:"Passengers",v:"Up to 19 (8 sleeping)"},{l:"Crew",v:"2 pilots + 1 attendant"},{l:"Cabin Height",v:"6 ft 2 in"},{l:"Cabin Width",v:"8 ft 0 in"},{l:"Cabin Length",v:"54 ft"},{l:"Baggage",v:"195 cu ft"},{l:"Wi-Fi",v:"Ka-band high-speed"},{l:"Cabin Altitude",v:"4,500 ft at FL450"}],
  reviews:[{name:"Robert C.",tier:"Noir",rating:5,text:"MIA to CDG, 9 hours flat. Slept in the stateroom, woke up to espresso and croissants. Alfred handled ground transport on both ends.",date:"2 weeks ago"},{name:"Jonathan W.",tier:"Black",rating:5,text:"Booked an empty leg NYC to Miami — 60% off. The Global 7500 cabin is unmatched. Four zones, full shower, Dior amenity kit.",date:"1 month ago"},{name:"Sarah K.",tier:"Member",rating:5,text:"Team offsite: 12 of us flew Miami to Aspen. Used the forward cabin for a board meeting mid-flight. Catering was restaurant-quality.",date:"3 weeks ago"}],
},
"global-6000":{
  name:"Bombardier Global 6000",tagline:"Intercontinental workhorse. Three cabin zones.",
  type:"Long Range",from:"$20,000/hr",
  imgs:["https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80","https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80"],
  pax:17,range:"11,112 km",speed:"Mach 0.89",ceiling:"51,000 ft",
  engine:"2× Rolls-Royce BR710",cabin:"6'1\" tall · 7'11\" wide · 48 ft long",
  rating:4.8,reviewCount:28,
  alfredNote:"The Global 6000 delivers serious intercontinental range with three distinct cabin zones. Perfect for transatlantic missions where you need a workspace forward, a lounge mid-cabin, and a private suite aft. The wide-body cabin means you can walk the aisle without hunching.",
  alfredTip:"Popular on the NYC→LON and MIA→CDG corridors. Ask about positioning flights — often available at significant discounts.",
  included:["Dedicated crew (2 pilots + flight attendant)","Premium catering & beverages","Ground transportation coordination","Ka-band Wi-Fi & satellite phone","Three-zone cabin layout","Lie-flat sleeping for 8","Full-size lavatory","170 cu ft baggage hold"],
  routes:[{from:"New York",to:"London",time:"~7 hrs",est:"$140,000"},{from:"Miami",to:"Paris",time:"~9 hrs",est:"$180,000"},{from:"Los Angeles",to:"Tokyo",time:"~12 hrs",est:"$240,000"},{from:"Miami",to:"New York",time:"~2.5 hrs",est:"$50,000"},{from:"London",to:"Dubai",time:"~7 hrs",est:"$140,000"},{from:"Paris",to:"Moscow",time:"~4 hrs",est:"$80,000"}],
  specs:[{l:"Range",v:"11,112 km / 6,000 nmi"},{l:"Max Speed",v:"Mach 0.89"},{l:"Ceiling",v:"51,000 ft"},{l:"Engine",v:"2× Rolls-Royce BR710"},{l:"Passengers",v:"Up to 17 (8 sleeping)"},{l:"Crew",v:"2 pilots + 1 attendant"},{l:"Cabin Height",v:"6 ft 1 in"},{l:"Cabin Width",v:"7 ft 11 in"},{l:"Cabin Length",v:"48 ft"},{l:"Baggage",v:"170 cu ft"},{l:"Wi-Fi",v:"Ka-band high-speed"},{l:"Cabin Altitude",v:"5,680 ft at FL410"}],
  reviews:[{name:"David L.",tier:"Noir",rating:5,text:"NYC to London direct, smooth as glass. Three cabin zones gave our team private meeting space and rest area. Landed ready for the morning session.",date:"1 month ago"},{name:"Elena R.",tier:"Black",rating:5,text:"Regularly fly the Global 6000 for transatlantic trips. The range and comfort combination is hard to beat at this price point.",date:"2 weeks ago"},{name:"Marcus T.",tier:"Member",rating:4,text:"Excellent aircraft for coast-to-coast with room to spare. The cabin width makes all the difference on longer flights.",date:"3 weeks ago"}],
},
"global-5000":{
  name:"Bombardier Global 5000",tagline:"Transatlantic range. Wide-body comfort.",
  type:"Long Range",from:"$18,000/hr",
  imgs:["https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80"],
  pax:16,range:"9,630 km",speed:"Mach 0.89",ceiling:"51,000 ft",
  engine:"2× Rolls-Royce BR710",cabin:"6'1\" tall · 7'11\" wide · 42 ft long",
  rating:4.7,reviewCount:22,
  alfredNote:"The Global 5000 offers genuine transatlantic capability at a more accessible price point. Same wide-body cabin cross-section as its bigger siblings, with three living areas — forward club for work, mid lounge for relaxation, and aft rest area for sleep.",
  alfredTip:"The sweet spot for Atlantic crossings when the 7500 isn't available. Often positioned in the Northeast — ask about one-way availability.",
  included:["Dedicated crew (2 pilots + flight attendant)","Premium catering & beverages","Ground transportation coordination","High-speed Wi-Fi","Three-zone cabin layout","Lie-flat sleeping for 6","Full lavatory","150 cu ft baggage hold"],
  routes:[{from:"New York",to:"London",time:"~7.5 hrs",est:"$135,000"},{from:"Miami",to:"Bermuda",time:"~2.5 hrs",est:"$45,000"},{from:"Los Angeles",to:"New York",time:"~5 hrs",est:"$90,000"},{from:"Paris",to:"Marrakech",time:"~3.5 hrs",est:"$63,000"},{from:"Miami",to:"Cancun",time:"~2 hrs",est:"$36,000"},{from:"London",to:"Nice",time:"~2 hrs",est:"$36,000"}],
  specs:[{l:"Range",v:"9,630 km / 5,200 nmi"},{l:"Max Speed",v:"Mach 0.89"},{l:"Ceiling",v:"51,000 ft"},{l:"Engine",v:"2× Rolls-Royce BR710"},{l:"Passengers",v:"Up to 16 (6 sleeping)"},{l:"Crew",v:"2 pilots + 1 attendant"},{l:"Cabin Height",v:"6 ft 1 in"},{l:"Cabin Width",v:"7 ft 11 in"},{l:"Cabin Length",v:"42 ft"},{l:"Baggage",v:"150 cu ft"},{l:"Wi-Fi",v:"Ka-band high-speed"},{l:"Cabin Altitude",v:"5,680 ft at FL410"}],
  reviews:[{name:"Thomas B.",tier:"Black",rating:5,text:"Flew Miami to London nonstop. The wide cabin cross-section makes it feel bigger than competitors in the same class. Very comfortable overnight crossing.",date:"1 month ago"},{name:"Claudia M.",tier:"Member",rating:4,text:"Great transatlantic option. Cabin is quiet and well-appointed. The crew was exceptional — personalized everything down to the pillow firmness.",date:"2 weeks ago"},{name:"James F.",tier:"Noir",rating:5,text:"My go-to for NYC to Europe runs. Reliable, comfortable, and the price-to-range ratio is excellent.",date:"3 weeks ago"}],
},
"challenger-850":{
  name:"Bombardier Challenger 850",tagline:"Widest cabin in class. Conference to bedroom.",
  type:"Large Cabin",from:"$16,000/hr",
  imgs:["https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80"],
  pax:14,range:"5,230 km",speed:"Mach 0.85",ceiling:"41,000 ft",
  engine:"2× GE CF34-3B1",cabin:"6'1\" tall · 8'2\" wide · 48 ft long",
  rating:4.7,reviewCount:19,
  alfredNote:"The Challenger 850 is the widest cabin you'll find in its class — wider than many heavy jets. Based on the CRJ airframe, it gives you airliner-level cabin volume at a fraction of the cost. Three zones: club seating forward, a social lounge mid-cabin, and a full bedroom aft.",
  alfredTip:"Ideal for groups of 8-14 heading to the Caribbean or coast-to-coast. Ask about group pricing — it's competitive with first class per seat.",
  included:["Dedicated crew (2 pilots + flight attendant)","Full catering & bar service","Ground transportation coordination","Wi-Fi connectivity","Three-zone cabin with bedroom","Widest-in-class cabin","Full lavatory","Generous baggage hold"],
  routes:[{from:"Miami",to:"Aspen",time:"~4.5 hrs",est:"$72,000"},{from:"New York",to:"Miami",time:"~3 hrs",est:"$48,000"},{from:"Los Angeles",to:"Las Vegas",time:"~1 hr",est:"$16,000"},{from:"Miami",to:"Nassau",time:"~1 hr",est:"$16,000"},{from:"Chicago",to:"Cabo",time:"~5 hrs",est:"$80,000"},{from:"New York",to:"Cancun",time:"~4 hrs",est:"$64,000"}],
  specs:[{l:"Range",v:"5,230 km / 2,825 nmi"},{l:"Max Speed",v:"Mach 0.85"},{l:"Ceiling",v:"41,000 ft"},{l:"Engine",v:"2× GE CF34-3B1"},{l:"Passengers",v:"Up to 14 (6 sleeping)"},{l:"Crew",v:"2 pilots + 1 attendant"},{l:"Cabin Height",v:"6 ft 1 in"},{l:"Cabin Width",v:"8 ft 2 in"},{l:"Cabin Length",v:"48 ft"},{l:"Baggage",v:"200 cu ft"},{l:"Wi-Fi",v:"Air-to-ground"},{l:"Cabin Altitude",v:"8,000 ft at FL370"}],
  reviews:[{name:"Victoria S.",tier:"Black",rating:5,text:"The cabin width is unreal for this price point. We had 10 people and it never felt crowded. Miami to Aspen was smooth.",date:"3 weeks ago"},{name:"Ryan P.",tier:"Member",rating:4,text:"Perfect for our team retreat — enough space for everyone with a separate meeting area. Great value.",date:"1 month ago"},{name:"Lisa H.",tier:"Noir",rating:5,text:"The bedroom in the back is a game-changer for red-eye flights. Wider than my Global flights somehow.",date:"2 weeks ago"}],
},
"challenger-605":{
  name:"Bombardier Challenger 605",tagline:"Flat floor. Coast-to-coast with margin.",
  type:"Large Cabin",from:"$15,000/hr",
  imgs:["https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80"],
  pax:12,range:"7,408 km",speed:"Mach 0.82",ceiling:"41,000 ft",
  engine:"2× GE CF34-3B",cabin:"6'1\" tall · 7'11\" wide · 28 ft long",
  rating:4.8,reviewCount:31,
  alfredNote:"The Challenger 605 is the gold standard for coast-to-coast business travel. Flat floor throughout, stand-up cabin, and enough range to reach Europe from the East Coast. The two-zone layout gives you club seating for work and a divan for rest.",
  alfredTip:"One of the most popular charter aircraft in the US. Book early for peak weekends — Aspen, Nantucket, and Sun Valley fill fast.",
  included:["Dedicated crew (2 pilots + flight attendant)","Premium catering & beverages","Ground transportation coordination","Wi-Fi & entertainment system","Club seating for 8","Aft divan/berthing","Full galley","115 cu ft baggage hold"],
  routes:[{from:"New York",to:"Los Angeles",time:"~5.5 hrs",est:"$82,500"},{from:"Miami",to:"Aspen",time:"~4 hrs",est:"$60,000"},{from:"Teterboro",to:"Nantucket",time:"~1 hr",est:"$15,000"},{from:"Chicago",to:"Miami",time:"~3 hrs",est:"$45,000"},{from:"New York",to:"Bermuda",time:"~2.5 hrs",est:"$37,500"},{from:"Los Angeles",to:"Cabo",time:"~2.5 hrs",est:"$37,500"}],
  specs:[{l:"Range",v:"7,408 km / 4,000 nmi"},{l:"Max Speed",v:"Mach 0.82"},{l:"Ceiling",v:"41,000 ft"},{l:"Engine",v:"2× GE CF34-3B"},{l:"Passengers",v:"Up to 12 (4 sleeping)"},{l:"Crew",v:"2 pilots + 1 attendant"},{l:"Cabin Height",v:"6 ft 1 in"},{l:"Cabin Width",v:"7 ft 11 in"},{l:"Cabin Length",v:"28 ft"},{l:"Baggage",v:"115 cu ft"},{l:"Wi-Fi",v:"Air-to-ground"},{l:"Cabin Altitude",v:"7,900 ft at FL410"}],
  reviews:[{name:"Michael K.",tier:"Noir",rating:5,text:"My go-to for NYC to LA. Flat floor, stand-up cabin, arrives before you finish your second espresso. The 605 just works.",date:"1 week ago"},{name:"Andrew T.",tier:"Black",rating:5,text:"Chartered for a Teterboro to Aspen ski trip. Eight of us fit comfortably with all our gear. Alfred even arranged the SUV at the FBO.",date:"2 weeks ago"},{name:"Natalie D.",tier:"Member",rating:4,text:"Solid coast-to-coast option. The divan in the back is perfect for napping on red-eye flights.",date:"1 month ago"}],
},
"challenger-350":{
  name:"Bombardier Challenger 350",tagline:"Best-in-class super midsize. Standing cabin.",
  type:"Super Midsize",from:"$15,000/hr",
  imgs:["https://images.unsplash.com/photo-1559589688-6ba6beafe1e9?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80"],
  pax:10,range:"5,926 km",speed:"Mach 0.83",ceiling:"45,000 ft",
  engine:"2× Honeywell HTF7350",cabin:"6'0\" tall · 7'2\" wide · 25 ft long",
  rating:4.8,reviewCount:42,
  alfredNote:"The Challenger 350 is the world's best-selling super midsize jet for good reason. Standing cabin height, flat floor, and enough range for coast-to-coast with reserves. It punches well above its weight class — you get big-jet comfort at midsize economics.",
  alfredTip:"Best value for groups of 4-8 on domestic routes. Ask about empty legs on the TEB→PBI corridor — they pop up weekly.",
  included:["Dedicated crew (2 pilots)","Premium catering & beverages","Ground transportation coordination","Wi-Fi connectivity","Club seating for 8-10","Refreshment center","Full lavatory","106 cu ft baggage hold"],
  routes:[{from:"Teterboro",to:"Palm Beach",time:"~2.5 hrs",est:"$37,500"},{from:"Los Angeles",to:"New York",time:"~5 hrs",est:"$75,000"},{from:"Miami",to:"Nassau",time:"~1 hr",est:"$15,000"},{from:"Chicago",to:"Aspen",time:"~3 hrs",est:"$45,000"},{from:"Dallas",to:"Las Vegas",time:"~3 hrs",est:"$45,000"},{from:"Atlanta",to:"Cancun",time:"~3 hrs",est:"$45,000"}],
  specs:[{l:"Range",v:"5,926 km / 3,200 nmi"},{l:"Max Speed",v:"Mach 0.83"},{l:"Ceiling",v:"45,000 ft"},{l:"Engine",v:"2× Honeywell HTF7350"},{l:"Passengers",v:"Up to 10"},{l:"Crew",v:"2 pilots"},{l:"Cabin Height",v:"6 ft 0 in"},{l:"Cabin Width",v:"7 ft 2 in"},{l:"Cabin Length",v:"25 ft"},{l:"Baggage",v:"106 cu ft"},{l:"Wi-Fi",v:"Air-to-ground"},{l:"Cabin Altitude",v:"4,850 ft at FL450"}],
  reviews:[{name:"Chris W.",tier:"Black",rating:5,text:"The 350 is my workhorse. TEB to PBI every other week — it's faster than commercial door-to-door and the cabin is surprisingly spacious.",date:"1 week ago"},{name:"Sophia L.",tier:"Member",rating:5,text:"First time chartering. The Challenger 350 exceeded every expectation. Standing cabin, great food, landed refreshed.",date:"3 weeks ago"},{name:"Peter J.",tier:"Noir",rating:4,text:"Excellent for domestic missions. Not quite as wide as the 605 but the range and performance make up for it.",date:"2 weeks ago"}],
},
"falcon-7x":{
  name:"Dassault Falcon 7X",tagline:"Trijet. Whisper-quiet. Short-field capable.",
  type:"Long Range",from:"$18,500/hr",
  imgs:["https://images.unsplash.com/photo-1583396082781-aa44e665ee8f?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80","https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80"],
  pax:16,range:"11,019 km",speed:"Mach 0.90",ceiling:"51,000 ft",
  engine:"3× Pratt & Whitney PW307A",cabin:"6'2\" tall · 7'8\" wide · 39 ft long",
  rating:4.9,reviewCount:24,
  alfredNote:"The Falcon 7X is engineering art. Three engines give you the safety margin to fly routes other jets can't — over water, into challenging airports, in any weather. The cabin is whisper-quiet thanks to Dassault's aerodynamics. It can land at airports like St. Barth's and Lugano that most large-cabin jets can't touch.",
  alfredTip:"The short-field capability is the hidden gem. Ask about St. Barth's, Aspen, and European mountain airports — the 7X handles them all.",
  included:["Dedicated crew (2 pilots + flight attendant)","Gourmet catering & wine selection","Ground transportation coordination","Ka-band Wi-Fi","Three-zone cabin layout","Lie-flat sleeping for 6","Full galley & lavatory","140 cu ft baggage hold"],
  routes:[{from:"New York",to:"Paris",time:"~7.5 hrs",est:"$138,750"},{from:"Miami",to:"St. Barth's",time:"~3 hrs",est:"$55,500"},{from:"London",to:"Moscow",time:"~4 hrs",est:"$74,000"},{from:"Paris",to:"Dubai",time:"~7 hrs",est:"$129,500"},{from:"Geneva",to:"Nice",time:"~1 hr",est:"$18,500"},{from:"New York",to:"Aspen",time:"~4.5 hrs",est:"$83,250"}],
  specs:[{l:"Range",v:"11,019 km / 5,950 nmi"},{l:"Max Speed",v:"Mach 0.90"},{l:"Ceiling",v:"51,000 ft"},{l:"Engine",v:"3× Pratt & Whitney PW307A"},{l:"Passengers",v:"Up to 16 (6 sleeping)"},{l:"Crew",v:"2 pilots + 1 attendant"},{l:"Cabin Height",v:"6 ft 2 in"},{l:"Cabin Width",v:"7 ft 8 in"},{l:"Cabin Length",v:"39 ft"},{l:"Baggage",v:"140 cu ft"},{l:"Wi-Fi",v:"Ka-band high-speed"},{l:"Cabin Altitude",v:"4,800 ft at FL410"}],
  reviews:[{name:"Philippe D.",tier:"Noir",rating:5,text:"The trijet is in a class of its own. Flew into St. Barth's — no other large-cabin jet can do that runway. Absolute confidence in every approach.",date:"2 weeks ago"},{name:"Catherine R.",tier:"Black",rating:5,text:"Quietest cabin I've flown in. Paris to Dubai felt like 3 hours. The Dassault attention to detail is everywhere.",date:"1 month ago"},{name:"Henry M.",tier:"Member",rating:5,text:"The short-field performance sold me. Aspen in winter, no diversions, no stress. The 7X just handles it.",date:"3 weeks ago"}],
},
"g450":{
  name:"Gulfstream G450",tagline:"Iconic Gulfstream. PlaneView cockpit.",
  type:"Large Cabin",from:"$14,000/hr",
  imgs:["https://images.unsplash.com/photo-1529832393073-e362750f78b3?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80"],
  pax:16,range:"8,061 km",speed:"Mach 0.88",ceiling:"45,000 ft",
  engine:"2× Rolls-Royce Tay 611-8C",cabin:"6'2\" tall · 7'4\" wide · 45 ft long",
  rating:4.7,reviewCount:34,
  alfredNote:"The G450 is the quintessential Gulfstream — elegant, reliable, and with that unmistakable oval-window silhouette. Three cabin zones with 14 panoramic windows flood the space with natural light. The PlaneView cockpit is still one of the most advanced in aviation.",
  alfredTip:"The G450 offers excellent value — Gulfstream quality at a competitive hourly rate. Popular for same-day round trips on the East Coast.",
  included:["Dedicated crew (2 pilots + flight attendant)","Premium catering & beverages","Ground transportation coordination","Wi-Fi & satellite phone","Three-zone cabin layout","Lie-flat sleeping for 6","Full galley & dual lavatory","169 cu ft baggage hold"],
  routes:[{from:"Teterboro",to:"Palm Beach",time:"~2.5 hrs",est:"$35,000"},{from:"New York",to:"London",time:"~7.5 hrs",est:"$105,000"},{from:"Miami",to:"Los Angeles",time:"~5 hrs",est:"$70,000"},{from:"Chicago",to:"Cabo",time:"~5 hrs",est:"$70,000"},{from:"Dallas",to:"New York",time:"~3.5 hrs",est:"$49,000"},{from:"Atlanta",to:"Bermuda",time:"~3 hrs",est:"$42,000"}],
  specs:[{l:"Range",v:"8,061 km / 4,353 nmi"},{l:"Max Speed",v:"Mach 0.88"},{l:"Ceiling",v:"45,000 ft"},{l:"Engine",v:"2× Rolls-Royce Tay 611-8C"},{l:"Passengers",v:"Up to 16 (6 sleeping)"},{l:"Crew",v:"2 pilots + 1 attendant"},{l:"Cabin Height",v:"6 ft 2 in"},{l:"Cabin Width",v:"7 ft 4 in"},{l:"Cabin Length",v:"45 ft"},{l:"Baggage",v:"169 cu ft"},{l:"Wi-Fi",v:"Air-to-ground"},{l:"Cabin Altitude",v:"6,000 ft at FL450"}],
  reviews:[{name:"Alexandra V.",tier:"Black",rating:5,text:"The Gulfstream oval windows never get old. 14 of them in the G450 — the cabin is bathed in light. TEB to PBI is my weekly commute now.",date:"1 week ago"},{name:"Daniel R.",tier:"Member",rating:4,text:"Solid performer for coast-to-coast. The three-zone layout works well for our team — work up front, relax in back.",date:"3 weeks ago"},{name:"Isabella C.",tier:"Noir",rating:5,text:"The G450 is the Gulfstream sweet spot. Enough range for Europe, enough cabin for a team dinner, and that iconic ramp presence.",date:"2 weeks ago"}],
},
"citation-xls":{
  name:"Cessna Citation XLS+",tagline:"Efficient city-hopper. Short runway performer.",
  type:"Light Jet",from:"$8,500/hr",
  imgs:["https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1559589688-6ba6beafe1e9?w=900&q=80","https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80"],
  pax:8,range:"3,441 km",speed:"Mach 0.75",ceiling:"45,000 ft",
  engine:"2× Pratt & Whitney PW545C",cabin:"5'8\" tall · 5'7\" wide · 18 ft long",
  rating:4.6,reviewCount:48,
  alfredNote:"The Citation XLS+ is the most delivered business jet in history for good reason. It's the smart choice for regional hops — efficient, fast to board, and can operate from shorter runways that larger jets can't access. Perfect for 2-4 passengers on trips under 3 hours.",
  alfredTip:"At $8,500/hr, this is your most cost-effective private option. Great for Teterboro to Nantucket, Palm Beach, or the Hamptons.",
  included:["Dedicated crew (2 pilots)","Light catering & beverages","Ground transportation coordination","Club seating for 8","Enclosed lavatory","75 cu ft baggage hold"],
  routes:[{from:"Teterboro",to:"Nantucket",time:"~50 min",est:"$7,100"},{from:"Miami",to:"Key West",time:"~45 min",est:"$6,400"},{from:"New York",to:"Washington DC",time:"~1 hr",est:"$8,500"},{from:"Los Angeles",to:"San Francisco",time:"~1.5 hrs",est:"$12,750"},{from:"Chicago",to:"Detroit",time:"~1 hr",est:"$8,500"},{from:"Dallas",to:"Houston",time:"~1 hr",est:"$8,500"}],
  specs:[{l:"Range",v:"3,441 km / 1,858 nmi"},{l:"Max Speed",v:"Mach 0.75"},{l:"Ceiling",v:"45,000 ft"},{l:"Engine",v:"2× Pratt & Whitney PW545C"},{l:"Passengers",v:"Up to 8"},{l:"Crew",v:"2 pilots"},{l:"Cabin Height",v:"5 ft 8 in"},{l:"Cabin Width",v:"5 ft 7 in"},{l:"Cabin Length",v:"18 ft"},{l:"Baggage",v:"75 cu ft"},{l:"Wi-Fi",v:"Optional"},{l:"Cabin Altitude",v:"8,000 ft at FL430"}],
  reviews:[{name:"Mark T.",tier:"Member",rating:5,text:"TEB to ACK in 50 minutes. By the time you'd clear security at JFK, I'm already on the beach. The XLS is the perfect weekend escape jet.",date:"1 week ago"},{name:"Julie F.",tier:"Black",rating:4,text:"Efficient and no-fuss. We use the XLS for all our East Coast day trips. Four of us fit perfectly with luggage.",date:"2 weeks ago"},{name:"Steven B.",tier:"Member",rating:5,text:"Best value in private aviation. Miami to Key West for a dinner and back same night — try doing that on a commercial flight.",date:"1 month ago"}],
},
"lineage-1000e":{
  name:"Embraer Lineage 1000E",tagline:"Five distinct cabin zones. Master suite.",
  type:"VIP Airliner",from:"$22,000/hr",
  imgs:["https://images.unsplash.com/photo-1557862921-37829c790f19?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80"],
  pax:19,range:"8,519 km",speed:"Mach 0.82",ceiling:"41,000 ft",
  engine:"2× GE CF34-10E",cabin:"6'7\" tall · 8'9\" wide · 80 ft long",
  rating:4.9,reviewCount:12,
  alfredNote:"The Lineage 1000E is a converted Embraer E-190 airliner — 80 feet of cabin with five distinct zones. Walk-around master suite, full shower, stand-up bar, conference room, and entertainment lounge. This isn't a jet — it's a flying penthouse. Perfect for groups, events, or when you want to make a statement.",
  alfredTip:"Available for special events and group charters. Ask about the Miami→Ibiza direct route — it's a signature Alfred experience.",
  included:["Dedicated crew (2 pilots + 2 attendants)","Gourmet catering & sommelier service","Ground transportation coordination","Ka-band Wi-Fi & satellite phone","Five-zone cabin layout","Walk-around master suite with shower","Full stand-up bar","700 cu ft baggage hold"],
  routes:[{from:"Miami",to:"Ibiza",time:"~10 hrs",est:"$220,000"},{from:"New York",to:"London",time:"~8 hrs",est:"$176,000"},{from:"Los Angeles",to:"New York",time:"~5 hrs",est:"$110,000"},{from:"Miami",to:"Cancun",time:"~2 hrs",est:"$44,000"},{from:"New York",to:"Paris",time:"~8 hrs",est:"$176,000"},{from:"London",to:"Dubai",time:"~7 hrs",est:"$154,000"}],
  specs:[{l:"Range",v:"8,519 km / 4,600 nmi"},{l:"Max Speed",v:"Mach 0.82"},{l:"Ceiling",v:"41,000 ft"},{l:"Engine",v:"2× GE CF34-10E"},{l:"Passengers",v:"Up to 19 (VIP config)"},{l:"Crew",v:"2 pilots + 2 attendants"},{l:"Cabin Height",v:"6 ft 7 in"},{l:"Cabin Width",v:"8 ft 9 in"},{l:"Cabin Length",v:"80 ft"},{l:"Baggage",v:"700 cu ft"},{l:"Wi-Fi",v:"Ka-band high-speed"},{l:"Cabin Altitude",v:"6,900 ft at FL410"}],
  reviews:[{name:"Alexander P.",tier:"Noir",rating:5,text:"Chartered the Lineage for a corporate retreat — 16 executives, Miami to Cancun. Five zones meant everyone had space. The bar area was the highlight.",date:"2 weeks ago"},{name:"Victoria H.",tier:"Black",rating:5,text:"The master suite with shower is unlike anything else in the sky. Flew NYC to London and arrived looking like I'd just left a spa.",date:"1 month ago"},{name:"Omar K.",tier:"Noir",rating:5,text:"Used the Lineage for a wedding party — Teterboro to Nassau. 18 guests, full bar, DJ setup in the lounge. Unforgettable.",date:"3 weeks ago"}],
},
"challenger-604":{
  name:"Bombardier Challenger 604",tagline:"Proven wide-body. Transatlantic capable.",
  type:"Large Cabin",from:"$8,500/hr",
  imgs:["https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80","https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80"],
  pax:12,range:"7,408 km",speed:"Mach 0.82",ceiling:"41,000 ft",
  engine:"2× GE CF34-3B",cabin:"6'1\" tall · 7'11\" wide · 28 ft long",
  rating:4.7,reviewCount:22,
  alfredNote:"The Challenger 604 is one of the most proven wide-body platforms in private aviation. With transatlantic range and a full stand-up cabin, it bridges the gap between super-mid and large-cabin jets. The wide fuselage cross-section means genuine comfort on 6+ hour missions.",
  alfredTip:"One of Alfred's best value-for-range options. Frequently available on the East Coast corridor. Ask about empty legs — we see them weekly.",
  included:["Dedicated crew (2 pilots + flight attendant)","Premium catering & beverages","Ground transportation coordination","Broadband Wi-Fi","Wide-body cabin layout","Lie-flat sleeping for 4","Full galley","115 cu ft baggage hold"],
  routes:[{from:"New York",to:"London",time:"~7.5 hrs",est:"$63,750"},{from:"Miami",to:"New York",time:"~2.5 hrs",est:"$21,250"},{from:"Chicago",to:"Los Angeles",time:"~4 hrs",est:"$34,000"},{from:"Miami",to:"Cancun",time:"~2 hrs",est:"$17,000"},{from:"New York",to:"Paris",time:"~8 hrs",est:"$68,000"},{from:"Toronto",to:"Miami",time:"~3 hrs",est:"$25,500"}],
  specs:[{l:"Range",v:"7,408 km / 4,000 nmi"},{l:"Max Speed",v:"Mach 0.82"},{l:"Ceiling",v:"41,000 ft"},{l:"Engine",v:"2× GE CF34-3B"},{l:"Passengers",v:"Up to 12"},{l:"Crew",v:"2 pilots + 1 attendant"},{l:"Cabin Height",v:"6 ft 1 in"},{l:"Cabin Width",v:"7 ft 11 in"},{l:"Cabin Length",v:"28 ft"},{l:"Baggage",v:"115 cu ft"},{l:"Wi-Fi",v:"Broadband"},{l:"Cabin Altitude",v:"7,200 ft at FL410"}],
  reviews:[{name:"Thomas B.",tier:"Black",rating:5,text:"NYC to London on the 604 — wide cabin, smooth ride, and at a fraction of the Global price. Perfect for business trips when you need range without excess.",date:"3 weeks ago"},{name:"Laura M.",tier:"Member",rating:4,text:"Regular Miami to Teterboro runs. The 604 is reliable, comfortable, and the crew Alfred assigns always delivers.",date:"1 month ago"},{name:"Chris D.",tier:"Noir",rating:5,text:"Chartered for a group of 10 to Cancun. Everyone had space, catering was on point, and the wide cabin made it feel like a much bigger jet.",date:"2 weeks ago"}],
},
"challenger-300":{
  name:"Bombardier Challenger 300",tagline:"Super-mid performance. Coast-to-coast range.",
  type:"Super Midsize",from:"$7,000/hr",
  imgs:["https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80"],
  pax:9,range:"5,741 km",speed:"Mach 0.82",ceiling:"45,000 ft",
  engine:"2× Honeywell HTF7000",cabin:"6'1\" tall · 7'2\" wide · 24 ft long",
  rating:4.7,reviewCount:30,
  alfredNote:"The Challenger 300 punches well above its class. Super-mid pricing with near-large-cabin comfort — the flat floor and stand-up cabin make it a favorite for coast-to-coast business trips. Fast climbs to FL450 get you above weather and traffic quickly.",
  alfredTip:"Ideal for domestic routes under 5 hours. One of Alfred's most-requested aircraft for NYC↔MIA and LA↔NYC runs.",
  included:["Dedicated crew (2 pilots + flight attendant)","Premium catering & beverages","Ground transportation coordination","Broadband Wi-Fi","Flat-floor cabin","Refreshment center","Full lavatory","106 cu ft baggage hold"],
  routes:[{from:"New York",to:"Miami",time:"~2.5 hrs",est:"$17,500"},{from:"Los Angeles",to:"New York",time:"~5 hrs",est:"$35,000"},{from:"Chicago",to:"Miami",time:"~3 hrs",est:"$21,000"},{from:"Dallas",to:"Aspen",time:"~2 hrs",est:"$14,000"},{from:"Miami",to:"Cancun",time:"~2 hrs",est:"$14,000"},{from:"New York",to:"Bahamas",time:"~3 hrs",est:"$21,000"}],
  specs:[{l:"Range",v:"5,741 km / 3,100 nmi"},{l:"Max Speed",v:"Mach 0.82"},{l:"Ceiling",v:"45,000 ft"},{l:"Engine",v:"2× Honeywell HTF7000"},{l:"Passengers",v:"Up to 9"},{l:"Crew",v:"2 pilots + 1 attendant"},{l:"Cabin Height",v:"6 ft 1 in"},{l:"Cabin Width",v:"7 ft 2 in"},{l:"Cabin Length",v:"24 ft"},{l:"Baggage",v:"106 cu ft"},{l:"Wi-Fi",v:"Broadband"},{l:"Cabin Altitude",v:"7,200 ft at FL450"}],
  reviews:[{name:"Jason R.",tier:"Black",rating:5,text:"My go-to for coast-to-coast. The 300 has a wide enough cabin to spread out and the range to make LA to NYC nonstop. Best value in super-mid.",date:"1 month ago"},{name:"Amanda P.",tier:"Member",rating:5,text:"Flew Dallas to Aspen with 6 friends — perfect ski trip jet. Enough room for gear and the cabin felt spacious the whole flight.",date:"2 weeks ago"},{name:"Michael S.",tier:"Noir",rating:4,text:"Solid performer for domestic routes. Not the biggest cabin but the flat floor and stand-up height make it comfortable. Climbs fast.",date:"3 weeks ago"}],
},
"g650":{
  name:"Gulfstream G650",tagline:"The gold standard. Fastest. Farthest. Most refined.",
  type:"Ultra Long Range",from:"$23,000/hr",
  imgs:["https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80"],
  pax:19,range:"12,964 km",speed:"Mach 0.925",ceiling:"51,000 ft",
  engine:"2× Rolls-Royce BR725",cabin:"6'5\" tall · 8'6\" wide · 47 ft long",
  rating:4.9,reviewCount:42,
  alfredNote:"The G650 is the benchmark of private aviation. Mach 0.925 cruise, 7,000 nmi range, and a cabin with 16 panoramic windows. Four living zones, the lowest cabin altitude in the industry at 4,850 ft, and a 100% fresh-air system. This is the jet that redefined what 'flagship' means.",
  alfredTip:"High demand means limited availability. Book 48+ hours ahead when possible. Ask Alfred about G650ER availability for even longer range.",
  included:["Dedicated crew (2 pilots + 2 attendants)","Gourmet catering & sommelier service","Ground transportation coordination","Ka-band Wi-Fi & satellite phone","Four-zone cabin layout","16 panoramic windows","Full-size lavatory with vanity","195 cu ft baggage hold"],
  routes:[{from:"New York",to:"Dubai",time:"~12 hrs",est:"$276,000"},{from:"Los Angeles",to:"London",time:"~10 hrs",est:"$230,000"},{from:"Miami",to:"Paris",time:"~9 hrs",est:"$207,000"},{from:"New York",to:"Miami",time:"~2.5 hrs",est:"$57,500"},{from:"Singapore",to:"London",time:"~13 hrs",est:"$299,000"},{from:"Miami",to:"Ibiza",time:"~10 hrs",est:"$230,000"}],
  specs:[{l:"Range",v:"12,964 km / 7,000 nmi"},{l:"Max Speed",v:"Mach 0.925"},{l:"Ceiling",v:"51,000 ft"},{l:"Engine",v:"2× Rolls-Royce BR725"},{l:"Passengers",v:"Up to 19 (10 sleeping)"},{l:"Crew",v:"2 pilots + 2 attendants"},{l:"Cabin Height",v:"6 ft 5 in"},{l:"Cabin Width",v:"8 ft 6 in"},{l:"Cabin Length",v:"47 ft"},{l:"Baggage",v:"195 cu ft"},{l:"Wi-Fi",v:"Ka-band high-speed"},{l:"Cabin Altitude",v:"4,850 ft at FL510"}],
  reviews:[{name:"Richard H.",tier:"Noir",rating:5,text:"The G650 is everything they say it is. NYC to Dubai nonstop, arrived feeling fresh. The cabin altitude technology is a game-changer. Nothing else compares.",date:"1 week ago"},{name:"Patricia N.",tier:"Noir",rating:5,text:"My third time chartering the G650 through Alfred. LA to London in 10 hours, four-zone cabin, impeccable service. This is the gold standard.",date:"2 weeks ago"},{name:"Steven C.",tier:"Black",rating:5,text:"Chartered for a group of 14 — business meeting in the forward cabin, entertainment zone for downtime. The panoramic windows alone make this aircraft special.",date:"1 month ago"}],
},
"giv-sp":{
  name:"Gulfstream GIV-SP",tagline:"Legendary reliability. Proven intercontinental range.",
  type:"Large Cabin",from:"$8,000/hr",
  imgs:["https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80","https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80"],
  pax:14,range:"7,820 km",speed:"Mach 0.80",ceiling:"45,000 ft",
  engine:"2× Rolls-Royce Tay 611-8",cabin:"6'1\" tall · 7'4\" wide · 45 ft long",
  rating:4.6,reviewCount:19,
  alfredNote:"The GIV-SP is one of the most legendary airframes ever built — over 500 delivered, with a reputation for bulletproof reliability. The cabin is wide enough to be comfortable on transatlantic crossings, and the economics make it one of the best large-cabin values in the sky.",
  alfredTip:"Best value for transatlantic range. Ask about positioning flights from the Northeast — availability is strong.",
  included:["Dedicated crew (2 pilots + flight attendant)","Premium catering & beverages","Ground transportation coordination","Broadband Wi-Fi","Three-zone cabin layout","Lie-flat sleeping for 6","Full galley & lavatory","169 cu ft baggage hold"],
  routes:[{from:"New York",to:"London",time:"~7.5 hrs",est:"$60,000"},{from:"Miami",to:"New York",time:"~2.5 hrs",est:"$20,000"},{from:"Los Angeles",to:"New York",time:"~5 hrs",est:"$40,000"},{from:"Miami",to:"Cancun",time:"~2 hrs",est:"$16,000"},{from:"Chicago",to:"Miami",time:"~3 hrs",est:"$24,000"},{from:"New York",to:"Bermuda",time:"~2.5 hrs",est:"$20,000"}],
  specs:[{l:"Range",v:"7,820 km / 4,220 nmi"},{l:"Max Speed",v:"Mach 0.80"},{l:"Ceiling",v:"45,000 ft"},{l:"Engine",v:"2× Rolls-Royce Tay 611-8"},{l:"Passengers",v:"Up to 14"},{l:"Crew",v:"2 pilots + 1 attendant"},{l:"Cabin Height",v:"6 ft 1 in"},{l:"Cabin Width",v:"7 ft 4 in"},{l:"Cabin Length",v:"45 ft"},{l:"Baggage",v:"169 cu ft"},{l:"Wi-Fi",v:"Broadband"},{l:"Cabin Altitude",v:"6,660 ft at FL450"}],
  reviews:[{name:"Daniel F.",tier:"Black",rating:5,text:"Old school Gulfstream but the cabin is still incredibly comfortable. NYC to London on a GIV-SP at this price point — unbeatable value.",date:"1 month ago"},{name:"Karen W.",tier:"Member",rating:4,text:"Solid, reliable aircraft. Flew Miami to Teterboro and the ride was smooth. Not the newest interior but Alfred's operator had it well appointed.",date:"3 weeks ago"},{name:"James L.",tier:"Noir",rating:5,text:"We use the GIV-SP regularly for team travel — 12 seats, plenty of room, and the economics make sense for our use case. Great aircraft.",date:"2 weeks ago"}],
},
"legacy-600":{
  name:"Embraer Legacy 600",tagline:"Brazilian engineering. Wide-body comfort.",
  type:"Large Cabin",from:"$7,500/hr",
  imgs:["https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80"],
  pax:13,range:"6,019 km",speed:"Mach 0.80",ceiling:"41,000 ft",
  engine:"2× Rolls-Royce AE 3007-A1E",cabin:"5'11\" tall · 6'11\" wide · 42 ft long",
  rating:4.6,reviewCount:18,
  alfredNote:"The Legacy 600 is built on the ERJ-135 airliner platform, giving it a wide, three-zone cabin that feels bigger than most jets in its class. The airliner DNA means excellent ride quality and impressive baggage capacity. Strong performer for domestic and Caribbean routes.",
  alfredTip:"Great for group trips to the Caribbean or cross-country runs. Ask about one-way pricing — Legacy 600s reposition frequently.",
  included:["Dedicated crew (2 pilots + flight attendant)","Premium catering & beverages","Ground transportation coordination","Broadband Wi-Fi","Three-zone cabin layout","Divan for rest","Full galley","240 cu ft baggage hold"],
  routes:[{from:"Miami",to:"New York",time:"~2.5 hrs",est:"$18,750"},{from:"Miami",to:"Cancun",time:"~2 hrs",est:"$15,000"},{from:"New York",to:"Bahamas",time:"~3 hrs",est:"$22,500"},{from:"Chicago",to:"Los Angeles",time:"~4 hrs",est:"$30,000"},{from:"Dallas",to:"Miami",time:"~2.5 hrs",est:"$18,750"},{from:"New York",to:"Bermuda",time:"~2.5 hrs",est:"$18,750"}],
  specs:[{l:"Range",v:"6,019 km / 3,250 nmi"},{l:"Max Speed",v:"Mach 0.80"},{l:"Ceiling",v:"41,000 ft"},{l:"Engine",v:"2× Rolls-Royce AE 3007-A1E"},{l:"Passengers",v:"Up to 13"},{l:"Crew",v:"2 pilots + 1 attendant"},{l:"Cabin Height",v:"5 ft 11 in"},{l:"Cabin Width",v:"6 ft 11 in"},{l:"Cabin Length",v:"42 ft"},{l:"Baggage",v:"240 cu ft"},{l:"Wi-Fi",v:"Broadband"},{l:"Cabin Altitude",v:"6,930 ft at FL410"}],
  reviews:[{name:"Roberto M.",tier:"Black",rating:5,text:"The Legacy 600 surprised me — the cabin is wider than expected and the ride quality is airliner-smooth. Miami to Nassau was effortless.",date:"2 weeks ago"},{name:"Nicole P.",tier:"Member",rating:4,text:"Flew a group of 10 from New York to Cancun. Great baggage capacity — we brought golf bags, luggage, everything fit easily.",date:"1 month ago"},{name:"Anthony G.",tier:"Black",rating:5,text:"Reliable workhorse. Use it for regular Miami-New York runs. The three-zone layout gives good separation between work and rest areas.",date:"3 weeks ago"}],
},
"legacy-650":{
  name:"Embraer Legacy 650",tagline:"Extended range. Three-zone luxury.",
  type:"Large Cabin",from:"$8,000/hr",
  imgs:["https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=900&q=80","https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=85","https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=900&q=80","https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80"],
  pax:14,range:"7,223 km",speed:"Mach 0.80",ceiling:"41,000 ft",
  engine:"2× Rolls-Royce AE 3007-A1E",cabin:"5'11\" tall · 6'11\" wide · 42 ft long",
  rating:4.7,reviewCount:21,
  alfredNote:"The Legacy 650 takes the proven 600 platform and extends the range to near-transatlantic capability. Three distinct cabin zones with a private suite aft, conference area forward, and mid-cabin lounge. The airliner-derived fuselage means best-in-class ride quality and baggage capacity.",
  alfredTip:"The 650's extended range opens up Caribbean, South American, and even transatlantic routes. Ask Alfred about London routing via Azores refuel stop.",
  included:["Dedicated crew (2 pilots + flight attendant)","Premium catering & beverages","Ground transportation coordination","Broadband Wi-Fi","Three-zone cabin layout","Private suite with divan","Full galley","240 cu ft baggage hold"],
  routes:[{from:"Miami",to:"London",time:"~9 hrs",est:"$72,000"},{from:"New York",to:"Sao Paulo",time:"~10 hrs",est:"$80,000"},{from:"Miami",to:"New York",time:"~2.5 hrs",est:"$20,000"},{from:"Miami",to:"Cancun",time:"~2 hrs",est:"$16,000"},{from:"New York",to:"Bahamas",time:"~3 hrs",est:"$24,000"},{from:"Chicago",to:"Miami",time:"~3 hrs",est:"$24,000"}],
  specs:[{l:"Range",v:"7,223 km / 3,900 nmi"},{l:"Max Speed",v:"Mach 0.80"},{l:"Ceiling",v:"41,000 ft"},{l:"Engine",v:"2× Rolls-Royce AE 3007-A1E"},{l:"Passengers",v:"Up to 14"},{l:"Crew",v:"2 pilots + 1 attendant"},{l:"Cabin Height",v:"5 ft 11 in"},{l:"Cabin Width",v:"6 ft 11 in"},{l:"Cabin Length",v:"42 ft"},{l:"Baggage",v:"240 cu ft"},{l:"Wi-Fi",v:"Broadband"},{l:"Cabin Altitude",v:"6,930 ft at FL410"}],
  reviews:[{name:"Gabriel R.",tier:"Noir",rating:5,text:"Flew Miami to London with a fuel stop in the Azores — the Legacy 650 handled it beautifully. Three cabin zones, private suite aft, arrived rested.",date:"1 month ago"},{name:"Sophia T.",tier:"Black",rating:5,text:"Regular NYC to Bahamas charter. The 650 has more range than we need but the cabin quality and baggage space make it our go-to.",date:"2 weeks ago"},{name:"William K.",tier:"Member",rating:4,text:"Great value for a large-cabin jet. Took 12 colleagues Chicago to Miami — everyone comfortable, full catering, smooth ride.",date:"3 weeks ago"}],
},
};

export default function JetDetailPage(){
  var {slug}=useParams();
  var [idx,setIdx]=useState(0);
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [from,setFrom]=useState("Miami (MIA)");
  var [to,setTo]=useState("Paris (CDG)");
  var [date,setDate]=useState("2026-03-25");
  var [pax,setPax]=useState("6");
  var [tripType,setTripType]=useState("One Way");
  var J=JETS[slug]||JETS["global-7500"];
  var cabinLayout=CABIN_LAYOUTS[slug]||CABIN_LAYOUTS["global-7500"];

  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var specsRef=useRef(null);var specsVis=useVis(specsRef);
  var cabinRef=useRef(null);var cabinVis=useVis(cabinRef);
  var inclRef=useRef(null);var inclVis=useVis(inclRef);
  var routesRef=useRef(null);var routesVis=useVis(routesRef);
  var revRef=useRef(null);var revVis=useVis(revRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);
  useEffect(function(){var t=setInterval(function(){setIdx(function(c){return(c+1)%J.imgs.length})},5000);return function(){clearInterval(t)}},[]);

  var navOp=Math.min(scrollY/250,1);var heroY=scrollY*0.25;var heroScale=1+scrollY*0.0003;
  var secDiv=<div style={{height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)"}}/>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <SEOHead
        title={J.name+" — Private Jet Charter | Book Now | Alfred"}
        description={"Charter the "+J.name+" for your next flight. "+J.range+" range, "+J.pax+" passengers. Worldwide flights, empty legs available."}
        path={"/catalog/jets/"+slug}
        jsonLd={[
          {
            "@context":"https://schema.org",
            "@type":"Product",
            "name":J.name,
            "description":"Charter the "+J.name+" for your next flight. "+J.range+" range, "+J.pax+" passengers. Worldwide flights, empty legs available.",
            "image":J.imgs[0],
            "category":"Private Jet Charter"
          },
          {
            "@context":"https://schema.org",
            "@type":"BreadcrumbList",
            "itemListElement":[
              {"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},
              {"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},
              {"@type":"ListItem","position":3,"name":"Private Jets","item":"https://alfredconcierge.app/catalog/jets"},
              {"@type":"ListItem","position":4,"name":J.name,"item":"https://alfredconcierge.app/catalog/jets/"+slug}
            ]
          }
        ]}
      />
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
.page-wrap{max-width:1060px;margin:0 auto;padding:0 40px}
.two-col{display:flex;gap:40px;align-items:flex-start}
.left-col{flex:1;min-width:0}
.right-col{width:320px;flex-shrink:0;position:sticky;top:80px}
.spec-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.routes-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.rev-row{display:flex;gap:14px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.rev-row::-webkit-scrollbar{display:none}
@media(max-width:900px){.two-col{flex-direction:column!important}.right-col{width:100%!important;position:relative!important;top:auto!important}}
@media(max-width:768px){.page-wrap{padding:0 24px!important}.jd-hero{height:380px!important}.jd-name{font-size:30px!important}.spec-grid{grid-template-columns:repeat(2,1fr)!important}.routes-grid{grid-template-columns:1fr 1fr!important}}
@media(max-width:390px){.jd-hero{height:320px!important}.jd-name{font-size:26px!important}.routes-grid{grid-template-columns:1fr!important}}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <a href="/catalog/jets" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>← All Jets</a>
          <div style={{...sf(12,500),color:C.s1,opacity:Math.min(navOp*2,1),transition:"opacity 0.3s"}}>{J.name}</div>
        </div>
      </nav>

      <section className="jd-hero" style={{height:520,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,transform:"translateY("+heroY+"px) scale("+heroScale+")"}}>
          {J.imgs.map(function(img,i){return <img key={i} src={img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"120%",objectFit:"cover",opacity:i===idx?1:0,transition:"opacity 0.8s ease"}}/>})}
        </div>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0.4) 0%,transparent 30%,rgba(10,10,11,0.5) 60%,#0A0A0B 100%)"}}/>
        <div style={{position:"absolute",top:56,left:40,display:"flex",gap:6,zIndex:10}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.s3+"D9",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{J.type}</span>
        </div>
        <div style={{position:"absolute",bottom:48,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:10}}>
          {J.imgs.map(function(_,i){return <div key={i} onClick={function(){setIdx(i)}} style={{width:i===idx?20:5,height:4,borderRadius:2,background:"rgba(255,255,255,"+(i===idx?"0.85":"0.2")+")",transition:"all 0.3s",cursor:"pointer"}}/>})}
        </div>
      </section>

      {/* Two-column */}
      <div className="page-wrap" style={{marginTop:-40,position:"relative",zIndex:10,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)"}}>
        <div className="two-col">
          <div className="left-col">
            <div style={{marginBottom:40}}>
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                <span style={{...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F",border:"0.5px solid "+C.gn+"1A"}}>✦ ALFRED VERIFIED</span>
                <span style={{display:"flex",alignItems:"center",gap:5,...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F"}}><div style={{width:5,height:5,borderRadius:"50%",background:C.gn}}/>AVAILABLE</span>
              </div>
              <h1 className="jd-name" style={{...sf(38,700),letterSpacing:-1.5,marginBottom:8}}>{J.name}</h1>
              <p style={{...sf(16,300),color:C.s5,marginBottom:16}}>{J.tagline}</p>
              <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span style={{...sf(14,600),color:C.s1}}>{J.rating}</span>
                  <span style={{...sf(12),color:C.s6}}>({J.reviewCount})</span>
                </div>
                <div style={{width:1,height:14,background:C.bd}}/>
                <span style={{...sf(13),color:C.s4}}>{J.pax} passengers</span>
                <div style={{width:1,height:14,background:C.bd}}/>
                <span style={{...sf(13),color:C.s4}}>{J.range} range</span>
              </div>
              <div style={{display:"flex",alignItems:"baseline",gap:6,marginTop:16}}>
                <span style={{...sf(30,700),color:C.s1}}>{J.from.replace("/hr","")}</span>
                <span style={{...sf(14),color:C.s6}}>/flight hour</span>
              </div>
            </div>
            <div ref={noteRef} style={{paddingTop:32,marginBottom:40}}>
              {secDiv}
              <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:noteVis?1:0,transition:"all 0.8s ease"}}>Alfred's Note</p>
              <div style={{borderRadius:24,border:"1px solid "+C.bd,background:C.el,padding:"36px 32px",position:"relative",overflow:"hidden",opacity:noteVis?1:0,transform:noteVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
                <div style={{position:"absolute",bottom:20,right:24,opacity:0.025}}><Mark size={100} color={C.s1}/></div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}><Mark size={18} color={C.s5}/><span style={{...sf(11,500),color:C.s5,letterSpacing:1}}>From your concierge</span><div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px rgba(52,199,89,0.4)"}}/></div>
                <p style={{...sf(15,400),color:C.s3,lineHeight:1.8,fontStyle:"italic",marginBottom:22,position:"relative",zIndex:1}}>"{J.alfredNote}"</p>
                <div style={{height:0.5,background:C.bd,marginBottom:18}}/>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{...sf(13),color:C.s6,marginTop:1}}>✨</span><span style={{...sf(13),color:C.s5,lineHeight:1.6}}>{J.alfredTip}</span></div>
              </div>
            </div>
          </div>

          {/* RIGHT — Quote request */}
          <div className="right-col">
            <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden"}}>
              <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
              <div style={{padding:"24px 22px"}}>
                <div style={{...sf(18,700),color:C.s1,marginBottom:4}}>Request a Quote</div>
                <div style={{...sf(12),color:C.s5,marginBottom:20}}>From {J.from} · {J.name}</div>
                {/* Route */}
                <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"flex-end"}}>
                  <div style={{flex:1}}>
                    <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>From</div>
                    <AirportSearch value={from} onChange={setFrom} small displayShort/>
                  </div>
                  <div onClick={function(){var t=from;setFrom(to);setTo(t)}} style={{width:32,height:32,borderRadius:"50%",background:C.srf,border:"1px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginBottom:4}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>To</div>
                    <AirportSearch value={to} onChange={setTo} small displayShort/>
                  </div>
                </div>
                {/* Trip type */}
                <div style={{display:"flex",gap:4,marginBottom:14}}>
                  {["One Way","Round Trip"].map(function(t){var active=tripType===t;return <div key={t} onClick={function(){setTripType(t)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(12,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{t}</div>})}
                </div>
                {/* Date */}
                <div style={{marginBottom:14}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Departure</div>
                  <DarkDatePicker value={date} onChange={function(v){setDate(v)}} label="Date"/>
                </div>
                {/* Passengers */}
                <div style={{marginBottom:18}}>
                  <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Passengers</div>
                  <div style={{display:"flex",gap:4}}>
                    {["2","4","6","10","16+"].map(function(g){var active=pax===g;return <div key={g} onClick={function(){setPax(g)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(13,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{g}</div>})}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s"}} onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm interested in chartering the "+J.name+". Could you provide a quote?"),"_blank")}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Request Quote</div>
                <div style={{textAlign:"center",marginTop:10,...sf(11),color:C.s6}}>Quote within 1 hour · No commitment</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderRadius:14,background:C.gn+"08",border:"0.5px solid "+C.gn+"1A",marginTop:12}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px "+C.gn+"66",flexShrink:0}}/>
              <div><div style={{...sf(12,600),color:C.s1}}>Available for charter</div><div style={{...sf(11),color:C.gn+"CC",marginTop:1}}>Next availability: March 25</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px 0",borderRadius:14,border:"1px solid "+C.bd,marginTop:10,cursor:"pointer",...sf(12,500),color:C.s4,transition:"all 0.3s"}} onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm interested in chartering the "+J.name+". Could you provide a quote?"),"_blank")}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              Ask about this aircraft
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FULL-WIDTH ═══ */}

      {/* Specs */}
      <div ref={specsRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:24,marginTop:32,opacity:specsVis?1:0,transition:"all 0.8s ease"}}>Performance & Cabin</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14,opacity:specsVis?1:0,transform:specsVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.1s"}}>
          {[{emoji:"🌍",value:J.range.split(" ")[0],unit:"km",label:"Range"},{emoji:"⚡",value:J.speed,unit:"",label:"Max Speed"},{emoji:"☁️",value:J.ceiling.replace(" ft",""),unit:"ft",label:"Ceiling"}].map(function(s,i){
            return(<div key={i} style={{padding:"24px 16px",borderRadius:20,background:C.el,border:"1px solid "+C.bd,textAlign:"center",transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}><div style={{fontSize:22,marginBottom:10}}>{s.emoji}</div><div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:3}}><span style={{...sf(28,700),color:C.s1}}>{s.value}</span>{s.unit&&<span style={{...sf(13),color:C.s4}}>{s.unit}</span>}</div><div style={{...sf(10,500),color:C.s5,letterSpacing:0.8,textTransform:"uppercase",marginTop:6}}>{s.label}</div></div>);
          })}
        </div>
        <div className="spec-grid" style={{opacity:specsVis?1:0,transform:specsVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.2s"}}>
          {J.specs.map(function(s,i){return(<div key={i} style={{padding:"14px 16px",borderRadius:14,background:C.el,border:"1px solid "+C.bd}}><div style={{...sf(10,500),color:C.s5,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>{s.l}</div><div style={{...sf(14,500),color:C.s1}}>{s.v}</div></div>)})}
        </div>
      </div>

      {/* Cabin Configuration */}
      <div ref={cabinRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:24,marginTop:32,opacity:cabinVis?1:0,transition:"all 0.8s ease"}}>Cabin Configuration</p>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"32px 24px",opacity:cabinVis?1:0,transform:cabinVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s",overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.s4} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            <span style={{...sf(14,600),color:C.s1}}>{cabinLayout.title}</span>
          </div>
          <div style={{width:"100%",overflowX:"auto",WebkitOverflowScrolling:"touch",paddingBottom:8}}>
            <CabinSVG layout={cabinLayout}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginTop:20}}>
            {cabinLayout.zones.map(function(z,i){
              return(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 12px",borderRadius:10,background:"rgba(244,244,245,0.02)"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:z.color,flexShrink:0,marginTop:4}}/>
                <div><div style={{...sf(12,600),color:C.s1}}>{z.name}</div></div>
              </div>);
            })}
          </div>
          <div style={{...sf(11),color:C.s6,marginTop:16}}>Cabin: {J.cabin} · Standard configuration shown — custom layouts available on request.</div>
        </div>
      </div>

      {/* What's Included */}
      <div ref={inclRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:24,marginTop:32,opacity:inclVis?1:0,transition:"all 0.8s ease"}}>What's Included</p>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"18px 20px",opacity:inclVis?1:0,transform:inclVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {J.included.map(function(item,i){return(<div key={i}>{i>0&&<div style={{height:0.5,background:C.bd}}/>}<div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 4px"}}><div style={{width:24,height:24,borderRadius:8,background:C.srf,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.gn} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div><span style={{...sf(13,500),color:C.s1}}>{item}</span></div></div>)})}
        </div>
      </div>

      {/* Sample Routes */}
      <div ref={routesRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:24,marginTop:32,opacity:routesVis?1:0,transition:"all 0.8s ease"}}>Sample Routes & Estimates</p>
        <div className="routes-grid" style={{opacity:routesVis?1:0,transform:routesVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {J.routes.map(function(r,i){return(
            <div key={i} style={{padding:"22px 22px",borderRadius:20,background:C.el,border:"1px solid "+C.bd,transition:"border-color 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <span style={{...sf(14,600),color:C.s1}}>{r.from}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="1.5" strokeLinecap="round"><path d="M5 12H19M12 5L19 12"/></svg>
                <span style={{...sf(14,600),color:C.s1}}>{r.to}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{...sf(12),color:C.s5}}>{r.time}</span>
                <span style={{...sf(16,700),color:C.s1}}>{r.est}</span>
              </div>
            </div>
          )})}
        </div>
        <div style={{...sf(11),color:C.s6,marginTop:14,opacity:routesVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>* Estimates are one-way, excluding taxes & fees. Final pricing depends on routing, date, and availability.</div>
      </div>

      {/* Reviews */}
      <div ref={revRef} className="page-wrap" style={{paddingTop:60,marginBottom:60}}>
        {secDiv}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:32,marginBottom:20}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",opacity:revVis?1:0,transition:"all 0.8s ease"}}>From Members</p>
          <span style={{...sf(12),color:C.s6,opacity:revVis?1:0}}>{J.reviewCount} reviews</span>
        </div>
        <div className="rev-row" style={{opacity:revVis?1:0,transform:revVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {J.reviews.map(function(r,i){var isTop=r.tier==="Noir"||r.tier==="Black";return(
            <div key={i} style={{width:300,flexShrink:0,borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"24px 22px",transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:C.srf,border:"0.5px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{...sf(15,300),color:C.s5}}>{r.name.charAt(0)}</span></div>
                <div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{...sf(13,600),color:C.s1}}>{r.name}</span><span style={{...sf(8,600),letterSpacing:0.8,color:isTop?C.s3:C.s5,padding:"2px 8px",borderRadius:6,background:isTop?"rgba(244,244,245,0.06)":C.srf,border:"0.5px solid "+(isTop?"rgba(244,244,245,0.1)":C.bd),textTransform:"uppercase"}}>{r.tier}</span></div>
                <div style={{display:"flex",alignItems:"center",gap:3,marginTop:4}}>{Array.from({length:r.rating}).map(function(_,si){return <svg key={si} width="9" height="9" viewBox="0 0 24 24" fill={C.gold}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>})}<span style={{...sf(10),color:C.s6,marginLeft:4}}>{r.date}</span></div></div>
              </div>
              <p style={{...sf(13),color:C.s4,lineHeight:1.7,fontStyle:"italic"}}>"{r.text}"</p>
            </div>
          )})}
        </div>
      </div>

      {/* CTA */}
      <section ref={ctaRef} style={{padding:"120px 0 100px",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"}}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Charter</p>
          <h2 style={{...sf(44,600),letterSpacing:-1.5,lineHeight:1.1,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Ready to fly<br/>the Global 7500?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginTop:16,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Tell Alfred your route and dates. Quote within the hour, wheels up when you say.</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 36px",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.4s"}} onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm interested in chartering the "+J.name+". Could you provide a quote?"),"_blank")}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Request Quote<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg></div>
          <p style={{...sf(12),color:C.s6,marginTop:20,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.6s"}}>Quote within 1 hour · No commitment · Empty legs available</p>
        </div>
      </section>

      <footer style={{borderTop:"1px solid "+C.bd,padding:"36px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><Mark size={14} color={C.s7}/><span style={{...sf(10),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Alfred ©2026</span></div>
        <div style={{display:"flex",gap:20}}>
          <a href="/" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Home</a>
          <a href="/catalog/jets" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Jets</a>
          <a href="/catalog" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Catalog</a>
        </div>
      </footer>
    </div>
  );
}
