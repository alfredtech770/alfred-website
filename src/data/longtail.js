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
    title: "Best Italian Restaurants in Miami 2026 — Book a Table | Alfred",
    description: "The 15 best Italian restaurants in Miami for 2026 — Carbone, Casa Tua, Cipriani, Macchialina and more. Real concierge-curated guide with reservations included. Book a table through Alfred Concierge.",
    keywords: "best italian restaurants miami, italian restaurants miami beach, italian restaurants south beach, carbone miami reservation, casa tua miami, cipriani miami, where to eat italian in miami, miami italian restaurants 2026",
    intro: [
      "Miami's Italian scene runs from old-school red-sauce institutions to Michelin-pedigree pasta laboratories. The best of them — Carbone, Casa Tua, Cipriani, Forte dei Marmi, Macchialina, Sereno, Fiola — are also some of the hardest tables in the city. We curate the ones we can actually get you into.",
      "Every restaurant on this list is one Alfred Concierge books regularly. We hold direct relationships with the GMs, can secure same-night and impossible reservations for members, and arrange private dining rooms, wine pairings, and end-of-night transport. If you want a specific table or a specific time at a venue marked fully booked online, ask — that's the entire point of the service.",
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
          || /carbone|casa tua|cipriani|fiola|macchialina|forte|sereno|pastis|scarpetta|il mulino|osteria|trattoria|sardinia|enriqueta/.test(name);
    },
    faqs: [
      {
        q: "What is the best Italian restaurant in Miami?",
        a: "The current consensus picks are Carbone (Major Food Group's spicy rigatoni vodka temple in South Beach), Casa Tua (a candlelit South Beach townhouse that's been Miami's most exclusive Italian for two decades), and Cipriani Miami (the Brickell outpost of the Harry's Bar dynasty). For a less-impossible reservation, Macchialina and Fiola are both excellent."
      },
      {
        q: "How do I get a reservation at Carbone Miami?",
        a: "Carbone Miami opens reservations 30 days out at exactly 10am ET via Resy and sells out in seconds. Alfred Concierge holds a direct line for members and can secure same-week tables when public availability shows none. Message Alfred on WhatsApp with your party size, preferred dates, and seating preference."
      },
      {
        q: "Which Italian restaurants in Miami have a Michelin star?",
        a: "As of the 2025 Michelin Guide Florida, Miami's Italian Michelin-starred restaurants include Fiola Miami (1 star) and L'Atelier de Joël Robuchon Miami (1 star, French-Italian crossover). Several others — Boia De, Sereno, Stubborn Seed — hold Bib Gourmand or Michelin-recommended status."
      },
      {
        q: "Where can I find Italian restaurants on the water in Miami?",
        a: "For waterfront Italian: Cipriani Downtown Miami (Biscayne Bay views), Casa Tua Cucina (Brickell City Centre rooftop with bay glimpses), Sereno (Sunny Isles oceanfront), and Forte dei Marmi (Collins Avenue, with patio facing the Atlantic). Alfred can arrange the bay-facing tables specifically."
      },
      {
        q: "Can Alfred book a private dining room at an Italian restaurant in Miami?",
        a: "Yes. Carbone, Casa Tua, Cipriani, Fiola, and Forte dei Marmi all have private dining rooms ranging from 8 to 40 guests. Alfred handles the venue contract, menu curation, wine pairings, and any AV requirements. Typical lead time is 7–14 days; rush bookings available for members."
      },
      {
        q: "What is the dress code at Miami's best Italian restaurants?",
        a: "Most upscale Miami Italian restaurants enforce 'smart elegant' — Carbone, Casa Tua, Cipriani, Sereno require collared shirts for men and prohibit beachwear, athletic wear, and shorts at dinner. Casa Tua is the strictest. Lunch is more relaxed at all venues."
      }
    ],
    related: [
      { label: "Best Restaurants in Miami Beach", href: "/best/restaurants-miami-beach" },
      { label: "Private Dining in Miami", href: "/best/private-dining-miami" },
      { label: "Michelin Restaurants in Miami", href: "/best/michelin-restaurants-miami" },
      { label: "Last-Minute Reservations Miami", href: "/best/last-minute-reservations-miami" }
    ]
  },

  "best-restaurants-miami": {
    city: "Miami",
    h1: "The Best Restaurants in Miami",
    title: "Best Restaurants in Miami 2026 — Book a Table | Alfred Concierge",
    description: "The best restaurants in Miami for 2026, curated by Alfred's concierge team — from Carbone and Zuma to Cote and Stubborn Seed. Priority and same-night reservations included.",
    keywords: "best restaurants miami, best restaurants miami 2026, where to eat in miami, miami fine dining, best restaurants south beach, best restaurants miami beach, top restaurants miami, michelin restaurants miami",
    intro: [
      "Miami's dining scene has quietly become one of the best in America — a mix of Michelin-starred rooms, celebrity-chef imports, and see-and-be-seen scenes where the reservation is as coveted as the food. Carbone, Zuma, Cote, Stubborn Seed, Los Felix, Ariete, Boia De and Cipriani all live here.",
      "This is the list Alfred's concierge team books week in and week out. We hold direct lines to the GMs, secure same-night and 'fully booked' tables for members, and handle private rooms, wine, dietary requests and transport in a single WhatsApp thread.",
      "Below is the current ranking. Tap any restaurant to see its full Alfred page and request the table directly."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      return (r.city||"").toLowerCase().indexOf("miami") !== -1;
    },
    faqs: [
      { q: "What is the best restaurant in Miami right now?", a: "The consensus 2026 picks are Carbone (Italian-American, South Beach), Zuma (contemporary Japanese, Downtown), Cote (Korean steakhouse, Design District) and Stubborn Seed (Michelin-starred tasting menu, South Beach). Alfred can book any of them, including tables that show as sold out online." },
      { q: "How far in advance should I book a restaurant in Miami?", a: "The hardest tables — Carbone, Cote, Casa Tua — open 30 days out and sell out in seconds. Alfred holds concierge access and regularly secures same-week and same-night reservations for members when public availability shows none." },
      { q: "Which Miami restaurants have a Michelin star?", a: "The Michelin Guide Florida recognizes Miami stars including Stubborn Seed, Los Felix, Boia De, Cote, Ariete and L'Atelier de Joël Robuchon. Alfred books all of them and can arrange the chef's counter or tasting menu." },
      { q: "Can Alfred get a same-night reservation in Miami?", a: "Yes — same-night bookings at top Miami restaurants are one of the most common member requests. Message Alfred on WhatsApp with your party size and the neighborhood, and a real concierge confirms a table, usually within minutes." }
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
    title: "Best Steakhouses in Miami 2026 — Book a Table | Alfred Concierge",
    description: "The best steakhouses in Miami for 2026 — Papi Steak, Cote, Smith & Wollensky, Prime 112 and more. Concierge-curated with priority reservations through Alfred.",
    keywords: "best steakhouse miami, best steakhouses miami, papi steak reservation, cote miami, prime 112 miami, smith and wollensky miami, steak miami beach, best steak in miami",
    intro: [
      "Miami does steak like nowhere else — from David Grutman's viral Papi Steak to Cote's Korean-barbecue-meets-steakhouse hybrid and the old-guard power scenes at Prime 112 and Smith & Wollensky. Beef, theater, and a scene, all at once.",
      "Every steakhouse here is one Alfred books directly. We secure the booths that matter, arrange the $1,000 'Beef Case', handle large groups and private rooms, and get members in on nights the public sees no availability.",
      "Here's the current ranking. Tap through to request your table via Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      if((r.city||"").toLowerCase().indexOf("miami") === -1) return false;
      var c = (r.cuisine||"").toLowerCase(), n = (r.name||"").toLowerCase();
      return c.indexOf("steak") !== -1 || /steak|prime|chophouse|papi|wollensky|meat|beef|cote|red the|carne/.test(n);
    },
    faqs: [
      { q: "What is the best steakhouse in Miami?", a: "The top picks are Papi Steak (South Beach, David Grutman's high-energy scene), Cote Miami (Design District, Michelin-starred Korean steakhouse) and Prime 112 (South Beach institution). Alfred books all three, including prime booths and same-night tables." },
      { q: "How do I book Papi Steak in Miami?", a: "Papi Steak books up weeks out, especially weekends. Alfred holds concierge access and can secure tables — including the coveted booths — often on short notice for members. Message on WhatsApp with your date and party size." },
      { q: "Which Miami steakhouse has a Michelin star?", a: "Cote Miami holds a Michelin star for its Korean steakhouse format in the Design District. Alfred can reserve the standard dining room, the counter, or the Butcher's Feast tasting." }
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
    title: "Best Sushi in Miami 2026 — Nobu, Zuma & More | Alfred Concierge",
    description: "The best sushi and Japanese restaurants in Miami for 2026 — Nobu, Zuma, Makoto, Katsuya and omakase counters. Priority reservations through Alfred Concierge.",
    keywords: "best sushi miami, best japanese restaurant miami, nobu miami, zuma miami, makoto miami, omakase miami, sushi miami beach, best sushi in miami 2026",
    intro: [
      "Miami's Japanese scene spans the icons — Nobu, Zuma, Makoto, Katsuya — and a new wave of intimate omakase counters where ten seats and a single chef are the whole experience. It's some of the hardest-to-book dining in the city.",
      "Alfred books every venue on this list directly, secures the omakase counter seats that vanish instantly, and arranges private sushi experiences and same-night tables for members.",
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
      { q: "Where is the best sushi in Miami?", a: "For icons: Nobu Miami (Eden Roc), Zuma (Downtown, riverside) and Makoto (Bal Harbour). For omakase: Azabu, Itamae and intimate counters around the Design District. Alfred books the main rooms and the omakase seats, including same-week availability." },
      { q: "How do I get an omakase reservation in Miami?", a: "Omakase counters seat as few as 8–12 guests per night and sell out days ahead. Alfred holds concierge access and can secure counter seats for members. Message on WhatsApp with your preferred date and number of guests." },
      { q: "Does Alfred book Nobu and Zuma Miami?", a: "Yes. Alfred books Nobu Miami, Zuma, Makoto, Katsuya and the leading omakase counters directly — including prime seating times and same-night tables that the public booking apps show as full." }
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
    title: "Best Restaurants in Paris 2026 — Book a Table | Alfred Concierge",
    description: "The best restaurants in Paris for 2026 — Le Cinq, L'Ambroisie, Septime, Le Clarence and more, from three-star temples to neo-bistros. Priority reservations through Alfred.",
    keywords: "best restaurants paris, best restaurants paris 2026, where to eat in paris, paris fine dining, michelin restaurants paris, le cinq paris, septime paris, best restaurant paris",
    intro: [
      "Paris still sets the standard — three-Michelin-star temples like Le Cinq, L'Ambroisie and Guy Savoy on one end, and the natural-wine neo-bistros like Septime and Clamato that reshaped modern dining on the other. The best tables are booked weeks out.",
      "Alfred's concierge team books across the whole spectrum, holds relationships that secure otherwise-impossible reservations, and arranges private rooms, wine pairings and car service between courses.",
      "The current ranking is below — tap any restaurant to request the table through Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      return (r.city||"").toLowerCase().indexOf("paris") !== -1;
    },
    faqs: [
      { q: "What is the best restaurant in Paris?", a: "The three-Michelin-star benchmarks are Le Cinq (Four Seasons George V), L'Ambroisie (Place des Vosges) and Guy Savoy. For modern icons, Septime and Le Clarence are the tables everyone wants. Alfred books all of them, including hard-to-get times." },
      { q: "How hard is it to get a reservation at Septime?", a: "Septime releases reservations three weeks ahead and books out within minutes. Alfred holds concierge access and can secure tables for members. Message on WhatsApp with your dates and party size." },
      { q: "Can Alfred book a three-Michelin-star restaurant in Paris?", a: "Yes — Le Cinq, L'Ambroisie, Guy Savoy, Plénitude and Arpège are all bookable through Alfred, including the tasting-menu seatings and window tables, often with shorter lead times than the public sees." }
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
    title: "Exotic Car Rental Miami 2026 — Ferrari, Lamborghini & More | Alfred",
    description: "Rent an exotic or luxury car in Miami — Ferrari, Lamborghini, Rolls-Royce, McLaren and more, delivered to your hotel or home. Daily, weekly and monthly rates through Alfred Concierge.",
    keywords: "exotic car rental miami, luxury car rental miami, supercar rental miami, rent a ferrari miami, rent a lamborghini miami, rolls royce rental miami, sports car rental miami, exotic car rental miami beach",
    intro: [
      "Miami is the exotic-car capital of America — and Alfred delivers the whole fleet to your door. Ferrari, Lamborghini, Rolls-Royce, McLaren, Bentley, Porsche and more, available by the day, the week, or the month, with delivery to your hotel, home or the FBO.",
      "Every car below is bookable through Alfred's concierge team. We handle delivery and collection, insurance, driver verification, and swaps mid-trip. Want a specific color or spec for an event or shoot? Ask — we source beyond the standing fleet for members.",
      "Here's the current Miami collection, ranked. Tap any car to see specs, pricing and request it through Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      return (r.city||"").toLowerCase().indexOf("miami") !== -1;
    },
    faqs: [
      { q: "How much does it cost to rent an exotic car in Miami?", a: "Daily rates in Miami typically run from around $500 for entry supercars to $2,000+ for the latest Ferrari, Lamborghini and Rolls-Royce models, with lower per-day pricing on weekly and monthly rentals. A refundable security deposit applies. Alfred confirms the all-in price and deposit before delivery." },
      { q: "Can Alfred deliver an exotic car to my Miami hotel?", a: "Yes — delivery and collection to your hotel, residence or private aviation terminal anywhere in Miami-Dade is standard. Just share the address and timing in the Alfred app and your concierge coordinates the handover." },
      { q: "What do I need to rent a supercar in Miami?", a: "A valid driver's license, proof of insurance (or a policy arranged through the rental), and a refundable security deposit. Most exotics require the driver to be 25+. Your Alfred concierge confirms the exact requirements for each vehicle before booking." },
      { q: "Can I rent a Lamborghini or Ferrari in Miami for a day?", a: "Yes. Daily rentals of Lamborghini, Ferrari, McLaren and Rolls-Royce are available in Miami through Alfred, delivered to you. Message Alfred with your dates and preferred model and your concierge arranges it." }
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
    title: "Lamborghini Rental Miami 2026 — Huracán, Urus & More | Alfred",
    description: "Rent a Lamborghini in Miami — Huracán, Urus, Revuelto and more, delivered to your door. Daily, weekly and monthly rates arranged by Alfred Concierge.",
    keywords: "lamborghini rental miami, rent a lamborghini miami, lamborghini huracan rental miami, lamborghini urus rental miami, lambo rental miami, lamborghini rental miami beach, exotic car rental miami",
    intro: [
      "Nothing announces Miami like a Lamborghini. Alfred delivers the current lineup — Huracán, Urus, Revuelto and more — straight to your hotel, home or the FBO, by the day, week or month.",
      "Every Lamborghini below is bookable through Alfred's concierge team, with delivery, insurance and driver verification handled for you. Need a specific color for an event or shoot? We source beyond the standing fleet for members.",
      "Here's the current Lamborghini collection in Miami. Tap any car for specs, pricing and to request it through Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      if((r.city||"").toLowerCase().indexOf("miami") === -1) return false;
      return /lamborghini|lambo|huracan|urus|aventador|revuelto|gallardo/.test(((r.brand||"")+" "+(r.name||"")).toLowerCase());
    },
    faqs: [
      { q: "How much is it to rent a Lamborghini in Miami?", a: "Lamborghini daily rates in Miami typically range from around $1,000 for a Huracán or Urus to $2,500+ for the latest Revuelto, with better per-day pricing on weekly rentals and a refundable deposit. Alfred confirms the all-in price before delivery." },
      { q: "Can I rent a Lamborghini Urus or Huracán in Miami for a day?", a: "Yes — daily Lamborghini rentals are available and delivered to you anywhere in Miami. Share your date and preferred model with Alfred and your concierge arranges delivery and collection." },
      { q: "Do I need a deposit to rent a Lamborghini in Miami?", a: "Yes, a refundable security deposit is required and varies by model. Drivers are generally 25+ with a valid license and insurance. Your Alfred concierge confirms the exact terms for the specific car before booking." }
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
    title: "Ferrari Rental Miami 2026 — SF90, Roma, 296 & More | Alfred",
    description: "Rent a Ferrari in Miami — SF90, Roma, 296 GTB, Portofino and more, delivered to your door. Daily, weekly and monthly rates arranged by Alfred Concierge.",
    keywords: "ferrari rental miami, rent a ferrari miami, ferrari sf90 rental miami, ferrari roma rental miami, ferrari 296 rental, ferrari rental miami beach, exotic car rental miami",
    intro: [
      "A Ferrari on Ocean Drive is a Miami rite of passage. Alfred delivers the current range — SF90, Roma, 296 GTB, Portofino and more — to your hotel, home or the FBO, by the day, week or month.",
      "Every Ferrari below is bookable through Alfred, with delivery, insurance and driver verification handled end to end. Want a particular model or color for an event or shoot? We source beyond the standing fleet for members.",
      "Here's the current Ferrari collection in Miami. Tap any car for specs, pricing and to request it through Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      if((r.city||"").toLowerCase().indexOf("miami") === -1) return false;
      return /ferrari|sf90|296|roma|portofino|f8|812|purosangue/.test(((r.brand||"")+" "+(r.name||"")).toLowerCase());
    },
    faqs: [
      { q: "How much does it cost to rent a Ferrari in Miami?", a: "Ferrari daily rates in Miami typically run from around $1,200 for a Roma or Portofino to $2,500+ for an SF90, with better per-day pricing on weekly rentals plus a refundable deposit. Alfred confirms the all-in price before delivery." },
      { q: "Can Alfred deliver a Ferrari to my Miami hotel?", a: "Yes — Ferrari delivery and collection to your hotel, residence or private aviation terminal in Miami is standard. Share the address and timing with Alfred and your concierge coordinates the handover." },
      { q: "What are the requirements to rent a Ferrari in Miami?", a: "A valid license, insurance (or a policy arranged through the rental), a refundable deposit, and typically age 25+. Your Alfred concierge confirms the exact requirements for the specific Ferrari before booking." }
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
    title: "Rolls-Royce Rental Miami 2026 — Cullinan, Ghost, Spectre | Alfred",
    description: "Rent a Rolls-Royce in Miami — Cullinan, Ghost, Spectre and Dawn, delivered to your door with optional chauffeur. Daily, weekly and monthly rates through Alfred Concierge.",
    keywords: "rolls royce rental miami, rent a rolls royce miami, rolls royce cullinan rental miami, rolls royce ghost rental, chauffeur rolls royce miami, luxury car rental miami, rolls royce rental miami beach",
    intro: [
      "For weddings, events, or simply arriving the right way, nothing matches a Rolls-Royce. Alfred delivers the Cullinan, Ghost, Spectre and Dawn across Miami — self-drive or with a professional chauffeur — by the day, week or month.",
      "Every Rolls-Royce below is bookable through Alfred, with delivery, insurance, chauffeur and event coordination handled for you. Need matched cars for a wedding party or a specific color? We arrange it for members.",
      "Here's the current Rolls-Royce collection in Miami. Tap any car for specs, pricing and to request it through Alfred."
    ],
    filter: function(r){
      if(!r || r.is_active===false) return false;
      if((r.city||"").toLowerCase().indexOf("miami") === -1) return false;
      return /rolls|royce|cullinan|ghost|spectre|phantom|dawn|wraith/.test(((r.brand||"")+" "+(r.name||"")).toLowerCase());
    },
    faqs: [
      { q: "How much is it to rent a Rolls-Royce in Miami?", a: "Rolls-Royce daily rates in Miami typically range from around $1,500 for a Ghost or Cullinan to $2,500+ for the electric Spectre, with weekly discounts and a refundable deposit. Chauffeur service is available at additional cost. Alfred confirms the all-in price before delivery." },
      { q: "Can I hire a Rolls-Royce with a chauffeur in Miami?", a: "Yes — Alfred arranges Rolls-Royce rentals self-drive or with a professional chauffeur, ideal for weddings, events and airport transfers. Share your date and requirements and your concierge handles the rest." },
      { q: "Can Alfred provide a Rolls-Royce for a Miami wedding?", a: "Yes. Alfred regularly arranges Rolls-Royce cars for weddings — including matched vehicles, ribbon, chauffeur and timed arrivals. Message Alfred with your date, venue and party size to arrange it." }
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
