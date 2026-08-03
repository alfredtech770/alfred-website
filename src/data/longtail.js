/**
 * Long-tail landing-page configs.
 *
 * Each entry produces a high-intent, SEO-optimized page at `/best/<slug>`.
 * The page is rendered by src/pages/LongTailPage.jsx and is config-only —
 * to add a new long-tail page, append a new entry below and run the
 * prerender step. No new component code needed.
 *
 * SEO playbook this hits:
 *   • Exact-match URL slug         (e.g. /best/italian-restaurants-miami)
 *   • Exact-match H1 + title       (the keyword as a natural sentence)
 *   • Substantive intro copy       (~120-200 words, keyword + variants)
 *   • Live indexable list of items pulled from Supabase
 *   • Restaurant + ItemList + FAQPage + BreadcrumbList JSON-LD
 *   • Internal links to related pages and to each restaurant detail
 *   • Quote-ready FAQ phrased as people search / prompt AI
 *
 * `filter(row)` runs against a row from the `restaurants` Supabase table.
 * Return true to include the venue in the page's list.
 */

var LONGTAIL = {
  "italian-restaurants-miami": {
    city: "Miami",
    h1: "The Best Italian Restaurants in Miami",
    title: "Best Italian Restaurants in Miami — Request a Table | Alfred",
    description: "Explore 15 Italian restaurants in Miami, compare styles and locations, and ask Alfred Concierge to check current table availability for your date and party size.",
    keywords: "best italian restaurants miami, italian restaurants miami beach, italian restaurants south beach, carbone miami reservation, casa tua miami, cipriani miami, where to eat italian in miami, miami italian restaurants 2026",
    maxItems: 15,
    intro: [
      "Miami's Italian scene runs from old-school red-sauce institutions to modern pasta counters and occasion-driven dining rooms. This guide helps you compare the Italian venues currently listed in Alfred's catalog.",
      "Choose a restaurant or describe the style you want, then send Alfred your date, time range and party size. The concierge checks current availability and confirms any deposit, menu or cancellation terms before booking.",
      "Below: the current list, ranked by our concierge team. Each card links to the venue's full Alfred page where you can request the reservation directly via WhatsApp."
    ],
    // Filter the Supabase `restaurants` table down to what belongs here.
    filter: function(r){
      if(!r || (r.is_active===false)) return false;
      var city = (r.city||"").toLowerCase();
      if(city.indexOf("miami") === -1) return false;
      var cuisine = (r.cuisine||"").toLowerCase();
      var name = (r.name||"").toLowerCase();
      return cuisine.indexOf("italian") !== -1
          || cuisine.indexOf("pasta") !== -1
          || /carbone|casa tua|cipriani|fiola|macchialina|forte|sereno|scarpetta|il mulino|osteria|trattoria|sardinia/.test(name);
    },
    faqs: [
      {
        q: "What is the best Italian restaurant in Miami?",
        a: "The best choice depends on the occasion, neighborhood, budget and atmosphere you want. Use the current list to compare options, then ask Alfred to check tables for your date."
      },
      {
        q: "How do I get a reservation at Carbone Miami?",
        a: "Send Alfred your preferred dates, time range, party size and seating preference. The concierge checks the venue's current reservation options and suggests alternatives if your first choice is unavailable."
      },
      {
        q: "Which Italian restaurants in Miami have a Michelin star?",
        a: "Michelin distinctions can change each guide year. Check the current Michelin Guide for the official list, then use Alfred to request a table at a restaurant in the catalog."
      },
      {
        q: "Where can I find Italian restaurants on the water in Miami?",
        a: "Filter the catalog by Miami and review each venue's location and description. Waterfront views and specific table placement remain requests until the restaurant confirms them."
      },
      {
        q: "Can Alfred book a private dining room at an Italian restaurant in Miami?",
        a: "Send the date, guest count, budget and event requirements. Alfred checks which venues currently offer a suitable private space and returns the venue's menu, deposit and contract terms."
      },
      {
        q: "What is the dress code at Miami's best Italian restaurants?",
        a: "Dress codes vary by restaurant, service and time of day. Alfred shares the current venue policy with the booking confirmation; when in doubt, smart evening attire is the safer choice."
      }
    ],
    related: [
      { label: "Best Restaurants in Miami", href: "/best/best-restaurants-miami" },
      { label: "Best Steakhouses in Miami", href: "/best/steakhouses-miami" },
      { label: "Best Sushi in Miami", href: "/best/sushi-restaurants-miami" },
      { label: "Exotic Car Rental in Miami", href: "/best/exotic-car-rental-miami" }
    ]
  },

  "best-restaurants-miami": {
    city: "Miami",
    h1: "The Best Restaurants in Miami",
    title: "Best Restaurants in Miami — Request a Table | Alfred Concierge",
    description: "Explore restaurants in Miami by cuisine, neighborhood and occasion, then ask Alfred Concierge to check current availability for your date and party size.",
    keywords: "best restaurants miami, best restaurants miami 2026, where to eat in miami, miami fine dining, best restaurants south beach, best restaurants miami beach, top restaurants miami, michelin restaurants miami",
    intro: [
      "Miami's dining scene has quietly become one of the best in America — a mix of Michelin-starred rooms, celebrity-chef imports, and see-and-be-seen scenes where the reservation is as coveted as the food. Carbone, Zuma, Cote, Stubborn Seed, Los Felix, Ariete, Boia De and Cipriani all live here.",
      "This list is generated from Alfred's active Miami restaurant catalog. Send the concierge your date, time range, party size, dietary needs and preferred atmosphere to check current options.",
      "Below is the current ranking. Tap any restaurant to see its full Alfred page and request the table directly."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      return (r.city||"").toLowerCase().indexOf("miami") !== -1;
    },
    faqs: [
      { q: "What is the best restaurant in Miami right now?", a: "The right choice depends on cuisine, neighborhood, budget and atmosphere. Compare the active catalog, then ask Alfred to check current tables for your date." },
      { q: "How far in advance should I book a restaurant in Miami?", a: "Popular weekend times often require more notice, while flexible or weekday requests may have more options. Send your request early and include an acceptable time range." },
      { q: "Which Miami restaurants have a Michelin star?", a: "Michelin distinctions can change each guide year. Use the current Michelin Guide for the official list and Alfred's catalog to request a restaurant." },
      { q: "Can Alfred help with a same-night reservation in Miami?", a: "Yes, you can send a same-day request. Confirmation depends on current venue availability, party size and flexibility on time or neighborhood." }
    ],
    related: [
      { label: "Best Steakhouses in Miami", href: "/best/steakhouses-miami" },
      { label: "Best Sushi in Miami", href: "/best/sushi-restaurants-miami" },
      { label: "Best Italian Restaurants in Miami", href: "/best/italian-restaurants-miami" },
      { label: "Exotic Car Rental in Miami", href: "/best/exotic-car-rental-miami" }
    ]
  },

  "steakhouses-miami": {
    city: "Miami",
    h1: "The Best Steakhouses in Miami",
    title: "Best Steakhouses in Miami — Request a Table | Alfred Concierge",
    description: "Explore steakhouses in Miami, compare locations and styles, and ask Alfred Concierge to check current table availability and venue terms.",
    keywords: "best steakhouse miami, best steakhouses miami, papi steak reservation, cote miami, prime 112 miami, smith and wollensky miami, steak miami beach, best steak in miami",
    intro: [
      "Miami does steak like nowhere else — from David Grutman's viral Papi Steak to Cote's Korean-barbecue-meets-steakhouse hybrid and the old-guard power scenes at Prime 112 and Smith & Wollensky. Beef, theater, and a scene, all at once.",
      "This guide is drawn from Alfred's active catalog. Send the date, time range, party size and any seating or private-room request so the concierge can check current options.",
      "Here's the current ranking. Tap through to request your table via Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      if((r.city||"").toLowerCase().indexOf("miami") === -1) return false;
      var c = (r.cuisine||"").toLowerCase(), n = (r.name||"").toLowerCase();
      return c.indexOf("steak") !== -1 || /steak|prime|chophouse|papi|wollensky|meat|beef|cote|red the|carne/.test(n);
    },
    faqs: [
      { q: "What is the best steakhouse in Miami?", a: "The best fit depends on whether you want a classic steakhouse, a lively scene or a tasting format. Compare the active list and ask Alfred to check your preferred date." },
      { q: "How do I request Papi Steak in Miami?", a: "Send Alfred the date, time range and party size. The concierge checks the current booking options and confirms any deposit or cancellation policy." },
      { q: "Which Miami steakhouse has a Michelin star?", a: "Michelin distinctions can change. Check the current Michelin Guide for the official status, then use Alfred to request an available seating option." }
    ],
    related: [
      { label: "Best Restaurants in Miami", href: "/best/best-restaurants-miami" },
      { label: "Best Italian Restaurants in Miami", href: "/best/italian-restaurants-miami" },
      { label: "Exotic Car Rental in Miami", href: "/best/exotic-car-rental-miami" }
    ]
  },

  "sushi-restaurants-miami": {
    city: "Miami",
    h1: "The Best Sushi & Japanese Restaurants in Miami",
    title: "Best Sushi in Miami — Japanese Restaurants | Alfred Concierge",
    description: "Explore sushi and Japanese restaurants in Miami, from larger dining rooms to omakase counters, and ask Alfred to check current reservation options.",
    keywords: "best sushi miami, best japanese restaurant miami, nobu miami, zuma miami, makoto miami, omakase miami, sushi miami beach, best sushi in miami 2026",
    intro: [
      "Miami's Japanese scene spans the icons — Nobu, Zuma, Makoto, Katsuya — and a new wave of intimate omakase counters where ten seats and a single chef are the whole experience. It's some of the hardest-to-book dining in the city.",
      "This guide is drawn from Alfred's active Miami catalog. Send the date, time range, party size and whether you prefer a dining room or omakase counter so the concierge can check current options.",
      "The current ranking is below. Tap any venue to request the reservation through Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      if((r.city||"").toLowerCase().indexOf("miami") === -1) return false;
      var c = (r.cuisine||"").toLowerCase(), n = (r.name||"").toLowerCase();
      return c.indexOf("japanese") !== -1 || c.indexOf("sushi") !== -1
          || /nobu|zuma|sushi|makoto|katsuya|omakase|hiro|uchi|osaka|gekko|azabu|itamae|maido|kojin/.test(n);
    },
    faqs: [
      { q: "Where is the best sushi in Miami?", a: "The best fit depends on neighborhood, budget and whether you want a lively dining room or a chef-led omakase. Compare the current catalog and ask Alfred to check your date." },
      { q: "How do I request an omakase reservation in Miami?", a: "Send the preferred date, time range, party size and dietary restrictions. Alfred checks current counter availability and the venue's menu and cancellation terms." },
      { q: "Can I request Nobu or Zuma Miami through Alfred?", a: "You can send Alfred a request for any venue listed in the catalog. The concierge confirms current availability and, if needed, proposes comparable alternatives." }
    ],
    related: [
      { label: "Best Restaurants in Miami", href: "/best/best-restaurants-miami" },
      { label: "Best Steakhouses in Miami", href: "/best/steakhouses-miami" },
      { label: "Best Italian Restaurants in Miami", href: "/best/italian-restaurants-miami" }
    ]
  },

  "best-restaurants-paris": {
    city: "Paris",
    h1: "The Best Restaurants in Paris",
    title: "Best Restaurants in Paris — Request a Table | Alfred Concierge",
    description: "Explore restaurants in Paris, from fine dining to neo-bistros, then ask Alfred Concierge to check current reservation options for your date and party size.",
    keywords: "best restaurants paris, best restaurants paris 2026, where to eat in paris, paris fine dining, michelin restaurants paris, le cinq paris, septime paris, best restaurant paris",
    intro: [
      "Paris still sets the standard — three-Michelin-star temples like Le Cinq, L'Ambroisie and Guy Savoy on one end, and the natural-wine neo-bistros like Septime and Clamato that reshaped modern dining on the other. The best tables are booked weeks out.",
      "This guide is drawn from Alfred's active Paris catalog. Send your date, time range, party size, budget and preferred style so the concierge can check current options.",
      "The current ranking is below — tap any restaurant to request the table through Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      return (r.city||"").toLowerCase().indexOf("paris") !== -1;
    },
    faqs: [
      { q: "What is the best restaurant in Paris?", a: "The answer depends on cuisine, formality, budget and neighborhood. Compare the current catalog and ask Alfred to check a shortlist for your dates." },
      { q: "How do I request a reservation at Septime?", a: "Send Alfred your dates, party size and acceptable time range. The concierge checks the venue's current options and suggests alternatives if needed." },
      { q: "Can I request a Michelin-starred restaurant in Paris?", a: "Yes. Use the current Michelin Guide for official distinctions, then send Alfred the restaurant, date, time range and party size. Confirmation depends on the venue's availability and policies." }
    ],
    related: [
      { label: "Best Restaurants in Miami", href: "/best/best-restaurants-miami" },
      { label: "Best Italian Restaurants in Miami", href: "/best/italian-restaurants-miami" }
    ]
  },

  "exotic-car-rental-miami": {
    table: "cars",
    city: "Miami",
    h1: "Exotic & Luxury Car Rental in Miami",
    title: "Exotic Car Rental Miami — Ferrari, Lamborghini & More | Alfred",
    description: "Compare exotic and luxury cars in Miami, view indicative pricing and ask Alfred to confirm the exact vehicle, dates, delivery options and supplier terms.",
    keywords: "exotic car rental miami, luxury car rental miami, supercar rental miami, rent a ferrari miami, rent a lamborghini miami, rolls royce rental miami, sports car rental miami, exotic car rental miami beach",
    intro: [
      "Browse Ferrari, Lamborghini, Rolls-Royce, McLaren, Bentley, Porsche and other vehicles currently listed in Alfred's Miami catalog. Catalog status is not live availability for a specific date.",
      "Send the dates, preferred model, delivery location, driver age and licence country. Alfred confirms the exact vehicle or an agreed alternative, plus price, deposit, mileage, insurance and delivery terms.",
      "Here's the current Miami collection, ranked. Tap any car to see specs, pricing and request it through Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      return (r.city||"").toLowerCase().indexOf("miami") !== -1;
    },
    faqs: [
      { q: "How much does it cost to rent an exotic car in Miami?", a: "The price depends on the exact vehicle, dates, mileage, driver eligibility, delivery and supplier terms. Catalog figures are indicative; Alfred confirms the full quote and deposit before booking." },
      { q: "Can Alfred request delivery to my Miami hotel?", a: "Yes, include the address and timing in your request. Whether delivery is available and any fee are confirmed by the supplier." },
      { q: "What do I need to rent a supercar in Miami?", a: "Age, licence, insurance, deposit and payment requirements vary by supplier and vehicle. Alfred confirms the exact eligibility and documents before booking." },
      { q: "Can I request a Lamborghini or Ferrari in Miami for a day?", a: "Yes. Send the date, preferred model and delivery location. Alfred checks current one-day options and returns the supplier's full terms." }
    ],
    related: [
      { label: "Rent a Lamborghini in Miami", href: "/best/lamborghini-rental-miami" },
      { label: "Rent a Ferrari in Miami", href: "/best/ferrari-rental-miami" },
      { label: "Rent a Rolls-Royce in Miami", href: "/best/rolls-royce-rental-miami" },
      { label: "Best Restaurants in Miami", href: "/best/best-restaurants-miami" }
    ]
  },

  "lamborghini-rental-miami": {
    table: "cars",
    city: "Miami",
    h1: "Lamborghini Rental in Miami",
    title: "Lamborghini Rental Miami — Huracán, Urus & More | Alfred",
    description: "Compare Lamborghini models listed in Miami and ask Alfred to confirm the exact car, dates, pricing, delivery options and supplier terms.",
    keywords: "lamborghini rental miami, rent a lamborghini miami, lamborghini huracan rental miami, lamborghini urus rental miami, lambo rental miami, lamborghini rental miami beach, exotic car rental miami",
    intro: [
      "Browse Huracán, Urus, Revuelto and other Lamborghini models currently listed in Alfred's Miami catalog. A listing does not guarantee live availability for your dates.",
      "Send the dates, preferred model, delivery location, driver age and licence country. Alfred confirms the exact car or an agreed alternative and supplies the price, deposit, mileage and insurance terms.",
      "Here's the current Lamborghini collection in Miami. Tap any car for specs, pricing and to request it through Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      if((r.city||"").toLowerCase().indexOf("miami") === -1) return false;
      return /lamborghini|lambo|huracan|urus|aventador|revuelto|gallardo/.test(((r.brand||"")+" "+(r.name||"")).toLowerCase());
    },
    faqs: [
      { q: "How much is it to rent a Lamborghini in Miami?", a: "The quote depends on the model, dates, mileage, driver eligibility, delivery and supplier conditions. Catalog prices are indicative; Alfred confirms the total and deposit." },
      { q: "Can I request a Lamborghini Urus or Huracán in Miami for a day?", a: "Yes. Share the date, preferred model and delivery location. Alfred checks current one-day options and confirms the supplier's terms." },
      { q: "Do I need a deposit to rent a Lamborghini in Miami?", a: "Deposit and eligibility requirements vary by vehicle and supplier. Alfred confirms the amount, payment method, insurance and licence requirements before booking." }
    ],
    related: [
      { label: "Exotic Car Rental in Miami", href: "/best/exotic-car-rental-miami" },
      { label: "Rent a Ferrari in Miami", href: "/best/ferrari-rental-miami" },
      { label: "Rent a Rolls-Royce in Miami", href: "/best/rolls-royce-rental-miami" }
    ]
  },

  "ferrari-rental-miami": {
    table: "cars",
    city: "Miami",
    h1: "Ferrari Rental in Miami",
    title: "Ferrari Rental Miami — SF90, Roma, 296 & More | Alfred",
    description: "Compare Ferrari models listed in Miami and ask Alfred to confirm the exact car, dates, pricing, delivery options and supplier terms.",
    keywords: "ferrari rental miami, rent a ferrari miami, ferrari sf90 rental miami, ferrari roma rental miami, ferrari 296 rental, ferrari rental miami beach, exotic car rental miami",
    intro: [
      "Browse SF90, Roma, 296 GTB, Portofino and other Ferrari models currently listed in Alfred's Miami catalog. A listing does not guarantee live availability for your dates.",
      "Send the dates, preferred model, delivery location, driver age and licence country. Alfred confirms the exact car or an agreed alternative and supplies the price, deposit, mileage and insurance terms.",
      "Here's the current Ferrari collection in Miami. Tap any car for specs, pricing and to request it through Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      if((r.city||"").toLowerCase().indexOf("miami") === -1) return false;
      return /ferrari|sf90|296|roma|portofino|f8|812|purosangue/.test(((r.brand||"")+" "+(r.name||"")).toLowerCase());
    },
    faqs: [
      { q: "How much does it cost to rent a Ferrari in Miami?", a: "The quote depends on the model, dates, mileage, driver eligibility, delivery and supplier conditions. Catalog prices are indicative; Alfred confirms the total and deposit." },
      { q: "Can Alfred request Ferrari delivery to my Miami hotel?", a: "Yes, include the address and timing. The supplier confirms whether delivery is available and any associated fee." },
      { q: "What are the requirements to rent a Ferrari in Miami?", a: "Age, licence, insurance, deposit and payment requirements vary by vehicle and supplier. Alfred confirms the exact terms before booking." }
    ],
    related: [
      { label: "Exotic Car Rental in Miami", href: "/best/exotic-car-rental-miami" },
      { label: "Rent a Lamborghini in Miami", href: "/best/lamborghini-rental-miami" },
      { label: "Rent a Rolls-Royce in Miami", href: "/best/rolls-royce-rental-miami" }
    ]
  },

  "rolls-royce-rental-miami": {
    table: "cars",
    city: "Miami",
    h1: "Rolls-Royce Rental in Miami",
    title: "Rolls-Royce Rental Miami — Cullinan, Ghost, Spectre | Alfred",
    description: "Compare Rolls-Royce models listed in Miami and ask Alfred to confirm the exact car, dates, pricing, chauffeur or delivery options, and supplier terms.",
    keywords: "rolls royce rental miami, rent a rolls royce miami, rolls royce cullinan rental miami, rolls royce ghost rental, chauffeur rolls royce miami, luxury car rental miami, rolls royce rental miami beach",
    intro: [
      "Browse Cullinan, Ghost, Spectre, Dawn and other Rolls-Royce models currently listed in Alfred's Miami catalog. A listing does not guarantee live availability for your dates.",
      "Send the dates, preferred model, delivery location and whether you want self-drive or chauffeur service. Alfred confirms available options and the supplier's full terms.",
      "Here's the current Rolls-Royce collection in Miami. Tap any car for specs, pricing and to request it through Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      if((r.city||"").toLowerCase().indexOf("miami") === -1) return false;
      return /rolls|royce|cullinan|ghost|spectre|phantom|dawn|wraith/.test(((r.brand||"")+" "+(r.name||"")).toLowerCase());
    },
    faqs: [
      { q: "How much is it to rent a Rolls-Royce in Miami?", a: "The quote depends on the model, dates, mileage, driver eligibility and whether chauffeur or delivery service is requested. Alfred confirms the total and deposit." },
      { q: "Can I request a Rolls-Royce with a chauffeur in Miami?", a: "Yes. Include the date, route, passenger count and timing. Alfred checks current chauffeur-driven options and confirms the operator's terms." },
      { q: "Can I request a Rolls-Royce for a Miami wedding?", a: "Yes. Send the date, venues, schedule, vehicle count, color preference and chauffeur requirements. Alfred returns available options and the supplier's terms." }
    ],
    related: [
      { label: "Exotic Car Rental in Miami", href: "/best/exotic-car-rental-miami" },
      { label: "Rent a Lamborghini in Miami", href: "/best/lamborghini-rental-miami" },
      { label: "Rent a Ferrari in Miami", href: "/best/ferrari-rental-miami" }
    ]
  }

  /* To add another long-tail page, append a new entry:
   *
   * "private-dining-miami": {
   *   city: "Miami",
   *   h1: "Private Dining Rooms in Miami",
   *   title: "...",
   *   description: "...",
   *   keywords: "...",
   *   intro: [...],
   *   filter: function(r){ return r.has_private_room === true && r.city === "Miami"; },
   *   faqs: [...],
   *   related: [...]
   * }
   */
};

export default LONGTAIL;
