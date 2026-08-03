/**
 * Visible, answer-first content for catalog pages. The copy deliberately
 * avoids guarantees: availability, prices, inclusions and benefits change and
 * are confirmed by the concierge for each request.
 */
import { T, type } from "../lib/brand";
import { SectionHeader, GlassCard, SilverText, useReveal, revealStyle, useMobile } from "./brand";

var T_ = T;
var DESTINATIONS=[
  {name:"Miami",slug:"miami"},{name:"Paris",slug:"paris"},{name:"Ibiza",slug:"ibiza"},
  {name:"Saint-Tropez",slug:"saint-tropez"},{name:"Mykonos",slug:"mykonos"},
  {name:"Dubai",slug:"dubai"},{name:"London",slug:"london"}
];
var SERVICE_SLUG={dining:"restaurants",hotels:"hotels",nightlife:"nightlife","exotic-cars":"exotic-cars",yachts:"yachts",jets:"jets",wellness:"wellness"};

var CONTENT = {
  dining:{
    italic:"restaurant reservations",
    intro:"Browse restaurants by city, cuisine and occasion, then send Alfred your preferred date, time and party size. The catalog helps you compare options; the concierge coordinates confirmation for each request.",
    sections:[
      {title:"What to include in a restaurant request",body:"Share the city, preferred restaurant, date, time range and party size. Add dietary needs, accessibility requirements, whether children are joining and any table preference. A wider time range gives the concierge more options when a venue is busy."},
      {title:"Availability and confirmation",body:"A venue appearing in the catalog does not mean a table is available for a specific time. Availability can change throughout the day. A request is complete only after Alfred sends a confirmation with the venue, date, time and party size."},
      {title:"Deposits, menus and venue policies",body:"Some restaurants require a card guarantee, deposit, prepaid menu or minimum spend. Dress code, cancellation rules and dietary accommodation also vary. Alfred shares the applicable terms before you approve a booking."}
    ],
    faqs:[
      {q:"How do I request a restaurant through Alfred?",a:"Choose a restaurant or describe what you want, then send the city, date, preferred time and party size. Alfred checks current options and replies with a confirmation or alternatives."},
      {q:"Can Alfred help with a last-minute restaurant request?",a:"Yes, you can send a same-day request. The result depends on current venue availability, party size and how flexible you are on time or location."},
      {q:"Does a restaurant page guarantee a table?",a:"No. Catalog pages describe venues and may show indicative information. Alfred confirms live availability and any booking conditions for each request."}
    ]
  },
  nightlife:{
    italic:"nightlife",
    intro:"Explore clubs and nightlife venues, then ask Alfred to check current guest-list, table or bottle-service options. Entry and placement remain subject to the venue's confirmation and door policy.",
    sections:[
      {title:"Guest list or table service",body:"Guest-list access and table service are different products. Tell Alfred the venue, date, arrival time and group size, plus whether you want entry only or a table. The concierge will return the options the venue is offering for that night."},
      {title:"Minimum spend and payment",body:"Table minimums, deposits, taxes and service charges vary by event and table location. Any amounts shown in the catalog are indicative. Alfred confirms the current price and cancellation terms before you approve the request."},
      {title:"Door and age policies",body:"Venue confirmation does not override identification, age, dress or conduct rules. Bring valid photo identification and follow the instructions supplied with the confirmation. Final admission remains at the venue's discretion."}
    ],
    faqs:[
      {q:"How do I request a nightclub table?",a:"Send the venue, date, group size, arrival time and approximate budget. Alfred checks current table locations, minimum spends and deposit terms."},
      {q:"Can Alfred arrange guest-list access?",a:"You can request guest-list access where a venue offers it. Alfred confirms whether it is available for that night and shares the arrival deadline and entry conditions."},
      {q:"Is nightclub entry guaranteed?",a:"No. Alfred can coordinate a confirmed request, but every guest must still meet the venue's identification, age, dress and conduct policies, and final admission is controlled by the venue."}
    ]
  },
  "exotic-cars":{
    italic:"exotic car rental",
    intro:"Compare luxury and performance cars, view indicative daily prices and ask Alfred to confirm the exact vehicle, dates, delivery area and rental terms.",
    sections:[
      {title:"What to include in a car request",body:"Send the city, pickup and return dates, preferred model, delivery location, driver age and licence country. If the exact model is unavailable, say whether a similar vehicle is acceptable."},
      {title:"Price, deposit and insurance",body:"Catalog prices are indicative and can change by date, location and supplier. Security deposit, mileage allowance, insurance, deductible, taxes and delivery fees are supplier-specific. Review the final written terms before paying."},
      {title:"Exact model and live availability",body:"An active catalog listing is not a promise that the same vehicle is free for your dates. Alfred confirms the model or an agreed alternative, along with condition, mileage and handover details, before booking."}
    ],
    faqs:[
      {q:"How do I rent an exotic car through Alfred?",a:"Send the city, dates, preferred car, delivery location and driver details. Alfred returns current options with pricing and supplier terms for approval."},
      {q:"Are insurance and delivery included?",a:"Not automatically. Coverage, deductible, deposit and delivery fees vary by supplier and request. Alfred confirms each item in the final terms."},
      {q:"Are the prices in the catalog final?",a:"No. They are indicative starting points. The final quote depends on the exact vehicle, dates, mileage, location, driver eligibility and supplier conditions."}
    ]
  },
  jets:{
    italic:"private jet charter",
    intro:"Browse aircraft categories and send Alfred your route, date, passenger count and timing. The concierge sources current options and confirms the operator, aircraft and full quote before you commit.",
    sections:[
      {title:"Details needed for a charter quote",body:"Provide departure and arrival airports or cities, preferred departure time, passenger count, luggage, pets and whether the trip is one-way or return. Flexible timing can increase the number of suitable aircraft."},
      {title:"Aircraft and operator confirmation",body:"The aircraft pages explain typical capabilities, not a guaranteed tail number. Alfred confirms the proposed aircraft, operator and schedule for the request. Review the operator and aircraft documents supplied with the quote."},
      {title:"What changes the final price",body:"Routing, aircraft position, airport fees, crew time, de-icing, catering, ground transport and taxes can affect the total. The quote supplied for approval should state inclusions, exclusions and cancellation terms."}
    ],
    faqs:[
      {q:"How do I request a private jet quote?",a:"Send the route, date, preferred time, passenger count and luggage requirements. Alfred returns currently available aircraft and a quote for approval."},
      {q:"Are the route estimates final prices?",a:"No. Route and hourly figures are planning estimates. The final price is based on a specific aircraft, operator, positioning and airport costs."},
      {q:"Can I request an empty-leg flight?",a:"Yes. Empty-leg availability is schedule-dependent and can change or be cancelled if the underlying aircraft movement changes. Alfred confirms the current terms for any option offered."}
    ]
  },
  yachts:{
    italic:"yacht charter",
    intro:"Browse yachts by location, size and indicative charter price, then ask Alfred to confirm the vessel, charter window, guest capacity and final inclusions.",
    sections:[
      {title:"What to include in a yacht request",body:"Send the city or cruising area, date, preferred duration, guest count and occasion. Add any route, catering or water-toy preferences so the concierge can check suitable vessels."},
      {title:"Vessel availability and capacity",body:"A yacht shown in the catalog may already be committed for your date. Alfred confirms the exact vessel and legal guest capacity before booking, or proposes alternatives that fit the request."},
      {title:"Inclusions and extra costs",body:"Crew, fuel, gratuity, dockage, taxes, catering and water toys vary by vessel and route. Only the inclusions listed in the final charter agreement should be treated as included."}
    ],
    faqs:[
      {q:"How do I request a yacht charter?",a:"Send the location, date, duration, guest count and any route or catering preferences. Alfred checks suitable vessels and returns current terms."},
      {q:"Are fuel, crew and water toys always included?",a:"No. Inclusions vary by vessel and itinerary. Alfred confirms fuel policy, crew, amenities and any additional charges in the final quote."},
      {q:"Does a yacht listing mean it is available?",a:"No. The catalog is a discovery tool. Alfred confirms the vessel and charter window for each request before booking."}
    ]
  },
  wellness:{
    italic:"wellness",
    intro:"Explore spas and wellness providers, then ask Alfred to check current treatment times, practitioners, prices and venue policies.",
    sections:[
      {title:"What to include in a wellness request",body:"Send the city, preferred venue or treatment, date, time range and number of guests. Mention pregnancy, allergies, injuries, accessibility needs or practitioner preferences when relevant."},
      {title:"Treatments and suitability",body:"Catalog descriptions are general information and not medical advice. Treatment suitability depends on the provider's assessment and policies. Share relevant health information directly with the qualified provider."},
      {title:"Timing, price and cancellation",body:"Appointment times and prices can change. Some treatments require advance forms, deposits or cancellation notice. Alfred confirms the current appointment and applicable terms before booking."}
    ],
    faqs:[
      {q:"How do I request a spa or wellness appointment?",a:"Send the city, treatment, preferred date and time, and number of guests. Alfred checks current appointment options and replies with the provider's terms."},
      {q:"Can Alfred arrange a same-day treatment?",a:"You can send a same-day request. Confirmation depends on current provider and practitioner availability."},
      {q:"Is the wellness catalog medical advice?",a:"No. It is for discovery and booking requests. Discuss suitability, risks and contraindications with the qualified provider before treatment."}
    ]
  },
  hotels:{
    italic:"hotel stays",
    intro:"Browse hotels by city and style, choose dates and guest count, then compare the lowest current public rate where supplier coverage is available. Alfred rechecks the room, final total, cancellation terms and eligible benefits before booking.",
    sections:[
      {title:"What to include in a hotel request",body:"Send the city, check-in and check-out dates, number of rooms, adults and children, preferred room type and approximate budget. Add bedding, accessibility and location requirements."},
      {title:"Rates and room availability",body:"A displayed starting price is tied to the selected dates and occupancy and can change until booking. When no supplier rate is available, the page says price on request. Alfred confirms the room category, final total, taxes and cancellation policy before booking."},
      {title:"Benefits and special requests",body:"Breakfast, credits, upgrades, early check-in and late checkout depend on the rate, property and availability. Alfred lists confirmed benefits separately; requests that are not confirmed remain subject to the hotel."}
    ],
    faqs:[
      {q:"How do I request a hotel through Alfred?",a:"Send the city, dates, guest count, room requirements and budget. Alfred returns current room and rate options for approval."},
      {q:"Are upgrades and hotel credits guaranteed?",a:"Only benefits explicitly confirmed in the booking are included. Upgrades and arrival or departure times may remain subject to availability."},
      {q:"Are catalog hotel prices live?",a:"Where supplier coverage is available, the displayed starting rate is fetched for the selected dates and guest count. Rates can change until booking, and Alfred rechecks the final total, taxes and cancellation terms. Hotels without a current supplier rate are marked price on request."}
    ]
  }
};

function FaqItem({q, a, mobile}){
  return (
    <details style={{borderTop:`0.5px solid ${T_.border2}`,padding:mobile?"20px 0":"24px 0"}}>
      <summary style={{...type.body(),fontWeight:500,color:T_.text,cursor:"pointer",listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
        <span>{q}</span>
        <span aria-hidden style={{...type.kicker(),color:T_.silverDim,flexShrink:0}}>+</span>
      </summary>
      <p style={{...type.bodyLg(),color:T_.textMid,marginTop:14,maxWidth:680}}>{a}</p>
    </details>
  );
}

function Section({sec, mobile}){
  var r=useReveal(0.05);
  return <div ref={r.ref} style={{...revealStyle(r.visible)}}>
    <GlassCard style={{padding:mobile?"28px 24px":"36px 36px"}}>
      <h3 style={{...type.cardSerif(mobile?19:22),color:T_.text,marginBottom:14,letterSpacing:-0.4}}>{sec.title}</h3>
      <p style={{...type.body(),color:T_.textMid}}>{sec.body}</p>
    </GlassCard>
  </div>;
}

export default function CatalogSeoBody({category}){
  var data=CONTENT[category];
  var mobile=useMobile();
  if(!data)return null;
  var faqJsonLd={"@context":"https://schema.org","@type":"FAQPage","mainEntity":data.faqs.map(function(f){return{"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}})};
  return <section style={{borderTop:`0.5px solid ${T_.border2}`,background:T_.bg}}>
    <script data-visible-faq="true" type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqJsonLd)}}/>
    <div style={{padding:mobile?"60px 22px 40px":"100px 56px 60px",maxWidth:880,margin:"0 auto"}}>
      <SectionHeader kicker="The Detail" title={<>How Alfred handles <SilverText style={{fontStyle:"italic"}}>{data.italic}</SilverText></>}/>
      <p style={{...type.bodyLg(),color:T_.textMid}}>{data.intro}</p>
    </div>
    <div style={{padding:mobile?"0 22px 40px":"0 56px 60px",maxWidth:1100,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?14:18}}>{data.sections.map(function(s,i){return <Section key={i} sec={s} mobile={mobile}/>})}</div>
    </div>
    <div style={{padding:mobile?"28px 22px 44px":"40px 56px 64px",maxWidth:1100,margin:"0 auto"}}>
      <SectionHeader kicker="Browse by destination" title={data.italic.charAt(0).toUpperCase()+data.italic.slice(1)+" in every Alfred city"} subtitle="Open a city-specific guide for local planning notes, the information to include and direct links into the filtered catalog."/>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:10}}>
        {DESTINATIONS.map(function(city){return <a key={city.slug} href={"/city/"+city.slug+"/"+SERVICE_SLUG[category]} style={{textDecoration:"none",color:"inherit"}}><GlassCard style={{padding:"21px 22px",display:"flex",alignItems:"center",gap:12,height:"100%"}}><span style={{...type.cardSerif(18),flex:1}}>{city.name}</span><span aria-hidden style={{color:T_.silverDim}}>→</span></GlassCard></a>;})}
      </div>
    </div>
    <div style={{padding:mobile?"40px 22px 80px":"60px 56px 120px",maxWidth:880,margin:"0 auto"}}>
      <SectionHeader kicker="Frequently asked" title="Common questions"/>
      <div>{data.faqs.map(function(f,i){return <FaqItem key={i} q={f.q} a={f.a} mobile={mobile}/>})}</div>
    </div>
  </section>;
}
