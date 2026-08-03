var CITY_SERVICES={
  hotels:{
    slug:"hotels",label:"Hotels",singular:"hotel",serviceType:"Hotel request coordination",
    catalogPath:"/catalog/hotels",queryKey:"city",
    introduction:function(city){return "Compare hotels listed for "+city+" and ask Alfred to check live room availability for your dates. Displayed starting rates are a search aid, not a final quote: the hotel or booking provider confirms the available room, taxes, inclusions and cancellation terms."},
    needs:["Check-in and check-out dates","Number of adults, children and rooms","Preferred area, room type and approximate budget","Any accessibility, connecting-room or transfer requirements"],
    confirms:["The exact room category and occupancy","Current total price, taxes and included benefits","Deposit, payment and cancellation conditions","Check-in requirements and any provider restrictions"],
    planning:[
      {title:"Compare the complete stay",body:"A lower headline rate may exclude breakfast, taxes, transfers or flexible cancellation. Alfred asks the provider to confirm the comparable total and inclusions before you choose."},
      {title:"Keep dates and rooms precise",body:"Hotel inventory changes by date, guest count and room category. Exact stay details produce more useful options than a general availability request."},
      {title:"Use alternatives intelligently",body:"If a first choice is unavailable, Alfred can check a nearby area, a different room category or another listed hotel that fits the same priorities."}
    ],
    faqs:function(city){return [
      {q:"Can Alfred book a hotel in "+city+"?",a:"Alfred can coordinate a hotel request using your dates, guest count, room preferences and budget. The hotel or booking provider confirms current availability and the final terms."},
      {q:"Are the starting hotel prices guaranteed?",a:"No. Starting prices are the lowest public rates returned for the searched dates and occupancy when live rate data is available. Room type, taxes, availability and conditions can change before confirmation."},
      {q:"Can I ask for a specific room or hotel benefit?",a:"Yes. Add the preferred room category, view, bed type, breakfast, transfer or other requirement to the request. Each item remains subject to provider confirmation."},
      {q:"What happens if my first hotel is unavailable?",a:"Alfred can check another room category, nearby dates or comparable listed hotels in "+city+" without representing an alternative as confirmed until the provider approves it."}
    ];}
  },
  restaurants:{
    slug:"restaurants",label:"Restaurants",singular:"restaurant",serviceType:"Restaurant reservation request coordination",
    catalogPath:"/catalog/dining",queryKey:"city",
    introduction:function(city){return "Browse restaurants listed in "+city+" and send Alfred the date, time range, party size and dining preferences. Alfred checks the restaurant's current table options and communicates any deposit, menu or cancellation conditions before a request is treated as confirmed."},
    needs:["Preferred date and an acceptable time range","Number of adults and children","Cuisine, area, atmosphere and approximate budget","Dietary, accessibility or occasion details"],
    confirms:["The accepted date, time and party size","Deposit, prepaid menu or minimum-spend conditions","Cancellation policy, dress code and age rules","Any dietary request acknowledged by the restaurant"],
    planning:[
      {title:"Give a useful time range",body:"A flexible time range can create more options on high-demand dates. Alfred still asks the restaurant to confirm the exact seating time."},
      {title:"Share the occasion",body:"A business dinner, family meal and late celebration need different settings. Party composition and atmosphere help narrow the catalogue responsibly."},
      {title:"Confirm venue conditions",body:"Restaurants control deposits, menus, table duration, dress codes and cancellations. Alfred shares the relevant current conditions before commitment."}
    ],
    faqs:function(city){return [
      {q:"How do I request a restaurant in "+city+"?",a:"Choose a listed restaurant or describe the cuisine and atmosphere you want, then send the date, preferred time range and party size. Alfred checks current availability with the venue."},
      {q:"Does Alfred guarantee a restaurant table?",a:"No. The restaurant controls availability and makes the final confirmation. Alfred coordinates the request and can check alternative times or similar venues."},
      {q:"Can Alfred help with dietary requirements?",a:"Yes. Include allergies or dietary preferences in the request. Alfred passes them to the restaurant, but the venue must confirm whether it can accommodate them safely."},
      {q:"Are restaurant deposits included in Alfred's page?",a:"Not necessarily. Deposits, prepaid menus, minimum spends and cancellation rules vary by venue and date and are confirmed for the specific request."}
    ];}
  },
  nightlife:{
    slug:"nightlife",label:"Nightlife",singular:"nightlife venue",serviceType:"Nightlife table and access request coordination",
    catalogPath:"/catalog/nightlife",queryKey:"city",
    introduction:function(city){return "Explore nightlife venues listed in "+city+" and ask Alfred to check current table or legitimate guest-list options. The venue retains control of availability, entry, identification, dress code, minimum spend and final admission."},
    needs:["Date, arrival time and party size","Preferred music, atmosphere and area","Table budget or access preference","Guest ages and any relevant occasion details"],
    confirms:["Whether the venue accepts the request","Table minimum, deposit and included credit","Entry, identification, dress and age conditions","Cancellation rules and the named point of contact"],
    planning:[
      {title:"Name every guest correctly",body:"Many venues require accurate guest details and valid identification. A table request never overrides door policy or local rules."},
      {title:"Separate access from a table",body:"Guest-list access and table service can have different conditions. Alfred clarifies what is actually being offered before you approve it."},
      {title:"Confirm the complete minimum",body:"Minimum spends, deposits, service charges and included items vary by night and table location. The current terms should be reviewed together."}
    ],
    faqs:function(city){return [
      {q:"Can Alfred arrange nightlife access in "+city+"?",a:"Alfred can check legitimate table or guest-list options for your date and group. The venue controls approval and all final entry decisions."},
      {q:"Is club entry guaranteed after a request?",a:"No. Identification, age, dress code, conduct, capacity and venue policy still apply at the door, even when a table or list request has been accepted."},
      {q:"How are table minimum spends confirmed?",a:"The venue provides the current table location, minimum spend, deposit, inclusions and service conditions for the requested date."},
      {q:"Can Alfred suggest another venue?",a:"Yes. If a first choice is unavailable, Alfred can check another listed venue in "+city+" that better matches the group, music and budget."}
    ];}
  },
  "exotic-cars":{
    slug:"exotic-cars",label:"Exotic cars",singular:"vehicle",serviceType:"Exotic car rental request coordination",
    catalogPath:"/catalog/exotic-cars",queryKey:"city",
    introduction:function(city){return "Browse exotic and luxury vehicles listed for "+city+" and send Alfred the model, dates, delivery area and driver details. The rental supplier confirms the exact vehicle, eligibility, insurance, mileage, deposit and final price."},
    needs:["Rental dates and pickup or delivery location","Preferred model or comparable vehicle class","Driver age, licence country and driving history if requested","Expected mileage and any additional drivers"],
    confirms:["Exact vehicle or permitted substitute","Driver eligibility and licence requirements","Insurance, security deposit and excess","Mileage, delivery, fuel and cancellation terms"],
    planning:[
      {title:"Check eligibility first",body:"Minimum age, licence history, identification and payment-card rules vary by vehicle and supplier. Approval should be confirmed before other plans depend on the car."},
      {title:"Compare the full rental",body:"Daily rate alone does not show mileage, delivery, insurance, deposit or excess. Alfred asks the supplier for the relevant complete terms."},
      {title:"Treat the model accurately",body:"A request for a specific model is only confirmed when the supplier approves that exact vehicle. Any substitution should be disclosed before acceptance."}
    ],
    faqs:function(city){return [
      {q:"Can I request an exotic car in "+city+"?",a:"Yes. Send the model preference, rental dates, delivery area and driver details. A relevant supplier confirms current availability and eligibility."},
      {q:"Is the displayed car price final?",a:"No. Final pricing can include delivery, mileage, insurance, taxes and other supplier terms. Alfred requests a current quote for the exact dates and driver."},
      {q:"What driving documents are required?",a:"Requirements vary by supplier and licence country. The supplier may request a valid licence, passport, payment card, proof of address or an international driving permit."},
      {q:"Is a specific model guaranteed?",a:"Only after the supplier confirms the exact vehicle. Alfred will identify any proposed substitute before you accept the rental."}
    ];}
  },
  yachts:{
    slug:"yachts",label:"Yachts",singular:"yacht",serviceType:"Yacht charter request coordination",
    catalogPath:"/catalog/yachts",queryKey:"location",
    introduction:function(city){return "Browse yachts listed around "+city+" and ask Alfred to check a day charter, event or multi-day itinerary. The operator confirms vessel location, capacity, crew, fuel basis, taxes, itinerary limits and weather terms."},
    needs:["Charter date, duration and preferred departure area","Number of guests and the purpose of the charter","Preferred vessel size, style and approximate budget","Route ideas, catering and transfer requirements"],
    confirms:["Exact vessel, marina and operating schedule","Licensed guest capacity and crew","Fuel, taxes, catering and other inclusions","Deposit, cancellation and weather policy"],
    planning:[
      {title:"Start with guests and route",body:"Licensed capacity, departure marina and travel time determine which vessels are suitable. A realistic route also depends on weather and local operating limits."},
      {title:"Separate price from inclusions",body:"Fuel, crew, berth fees, taxes, catering and water toys may be included or charged separately. Alfred asks for a clear current charter basis."},
      {title:"Respect the final weather call",body:"The captain and operator retain responsibility for safety and route decisions. Weather-related changes follow the operator's confirmed policy."}
    ],
    faqs:function(city){return [
      {q:"Can Alfred request a yacht charter near "+city+"?",a:"Yes. Provide the date, guest count, departure preference, duration and budget. The operator confirms a suitable vessel and current charter terms."},
      {q:"What is included in a yacht price?",a:"Inclusions vary. Crew, fuel, taxes, berth fees, catering and equipment must be checked on the specific quote before comparison."},
      {q:"Can I choose the itinerary?",a:"You can share a preferred route, but the operator and captain confirm what is practical and safe for the vessel, duration, local rules and weather."},
      {q:"What happens in bad weather?",a:"The operator's weather and cancellation policy applies. Alfred asks for that policy before confirmation; the captain retains the final safety decision."}
    ];}
  },
  jets:{
    slug:"jets",label:"Private jets",singular:"private jet",serviceType:"Private aviation charter request coordination",
    catalogPath:"/catalog/jets",queryKey:null,
    introduction:function(city){return "Use Alfred to request private aviation to or from "+city+". Share the route, dates, passenger count, luggage and timing; a licensed charter provider confirms the aircraft, airports, operating permissions, complete quote and terms."},
    needs:["Origin, destination and preferred departure time","Travel date, return or onward sectors","Passenger count, names when required and luggage","Pet, catering, accessibility or ground-transfer needs"],
    confirms:["Aircraft type and licensed operating provider","Departure and arrival airports or terminals","Taxes, handling, positioning and other quote items","Payment, cancellation and operational conditions"],
    planning:[
      {title:"Use the complete route",body:"Aircraft suitability and price depend on every sector, passenger count, luggage and positioning. Nearby airports may improve timing or availability."},
      {title:"Review the operator",body:"The charter provider should identify the licensed operator and aircraft before confirmation. Alfred coordinates the request without representing itself as the air carrier."},
      {title:"Allow for operations",body:"Slots, permits, weather, crew duty and airport restrictions can affect timing. Final operations remain with the licensed provider."}
    ],
    faqs:function(city){return [
      {q:"Can Alfred arrange a private jet to or from "+city+"?",a:"Alfred can coordinate a charter request with a relevant provider using the route, dates, passengers, luggage and timing. The licensed operator confirms the flight."},
      {q:"Is Alfred the aircraft operator?",a:"No. Alfred coordinates the request. A licensed charter provider or air operator supplies and operates the flight under its own approvals and terms."},
      {q:"What does a private jet quote include?",a:"The provider should confirm aircraft, sectors, positioning, airport fees, handling, taxes, catering and other applicable charges in the specific quote."},
      {q:"Can departure times change?",a:"Yes. Slots, permits, weather, crew duty and operational restrictions can affect a proposed schedule. The licensed provider confirms final timings."}
    ];}
  },
  wellness:{
    slug:"wellness",label:"Wellness",singular:"wellness appointment",serviceType:"Wellness appointment request coordination",
    catalogPath:"/catalog/wellness",queryKey:"city",
    introduction:function(city){return "Browse wellness providers listed in "+city+" and ask Alfred to check a treatment or appointment for your preferred date. The provider confirms the practitioner, duration, price, suitability, location and cancellation terms."},
    needs:["Preferred date, time range and location","Treatment or service requested","Number of guests and practitioner preferences","Relevant accessibility or provider-facing health information"],
    confirms:["Appointment time, duration and location","Practitioner and treatment selected","Current price and included facilities","Preparation, suitability and cancellation conditions"],
    planning:[
      {title:"Choose the setting",body:"Hotel spa, clinic and in-villa appointments have different facilities and travel requirements. Share where you will be and the experience you prefer."},
      {title:"Check treatment suitability",body:"Providers may need relevant health or pregnancy information before accepting a treatment. Medical questions should be handled by an appropriately qualified professional."},
      {title:"Confirm time and facilities",body:"Treatment duration does not always include facility access. Alfred asks the provider to clarify arrival time, amenities and what the appointment includes."}
    ],
    faqs:function(city){return [
      {q:"Can Alfred request a wellness appointment in "+city+"?",a:"Yes. Choose a listed provider or describe the treatment, location, date and time range you want. The provider confirms current availability."},
      {q:"Can I request an in-hotel or in-villa treatment?",a:"You can include the location in your request. Mobile service depends on provider coverage, property access and practitioner availability."},
      {q:"Does Alfred give medical advice?",a:"No. Alfred coordinates requests. Treatment suitability and medical questions must be addressed by the qualified provider or your own healthcare professional."},
      {q:"Are treatment prices final online?",a:"Not always. Duration, location, practitioner and facility access can affect the price. The provider confirms the current total and cancellation terms."}
    ];}
  }
};

export var CITY_SERVICE_ORDER=["hotels","restaurants","nightlife","exotic-cars","yachts","jets","wellness"];

export function catalogHref(service,cityName){
  if(!service.queryKey)return service.catalogPath;
  return service.catalogPath+"?"+service.queryKey+"="+encodeURIComponent(cityName);
}

export default CITY_SERVICES;
