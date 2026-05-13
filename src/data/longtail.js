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
