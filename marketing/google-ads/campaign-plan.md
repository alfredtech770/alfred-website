# Alfred Google Search pilot

Status: **prepared, not activated**. Launch only after the production deployment, consent verification, conversion test, account access and written budget approval.

## Recommendation

Start with one Search-only pilot for Miami. Do not start with Hotel Ads or Performance Max for Travel Goals: Alfred does not currently publish a direct, bookable hotel rate feed. The conversion is a qualified concierge request, not a completed hotel purchase.

Google Ads can place Alfred among sponsored results, but it cannot guarantee the absolute top position and it does not improve organic ranking. Ad position changes by auction, bid, relevance, landing-page quality, context and competing ads.

## Pilot settings

- Campaign: `Search | Miami | Concierge Requests`
- Objective: qualified WhatsApp concierge requests
- Network: Google Search only; Search Partners and Display off initially
- Language: English
- Location: Miami presence or interest, because many travelers search before arrival
- Schedule: only hours when a concierge can respond promptly; expand after response-time data is available
- Initial bidding: Maximize Clicks with a conservative CPC ceiling while conversion data is validated
- Later bidding: consider Maximize Conversions after enough genuine, qualified lead data exists
- Recommended test budget: **US$75/day for 14 days** (up to about US$1,050 for the test; a full 30.4-day month would be about US$2,280)
- Safety stop: pause for review if the first US$500 produces no qualified concierge conversation
- Primary conversion: advertising-consented click that opens an Alfred WhatsApp request
- Secondary measurement: partner form submission and app-store click; do not optimize the pilot to these initially

## Ad groups and landing pages

1. Concierge — `/city/miami`
2. Restaurants — `/catalog/dining`
3. Hotels — `/catalog/hotels`
4. Exotic cars — `/catalog/exotic-cars`

Keep each ad group tightly aligned with its landing page. Do not send every keyword to the homepage.

## Venue and hotel names

Do not activate hotel-, restaurant- or venue-name keywords until Alfred has verified the listing, current request workflow and any right to use the trademark in ad text. A catalog entry alone does not imply an official partnership. If a venue-name keyword is approved, the ad should still identify Alfred clearly and say “request” or “concierge”; it must not present Alfred as the hotel’s official booking site.

## Launch gate

- Production serves the new route-specific pages and one canonical URL.
- Cookie banner blocks optional analytics and advertising until consent.
- `VITE_GA4_ID`, `VITE_GOOGLE_ADS_ID` and `VITE_GOOGLE_ADS_WHATSAPP_LABEL` are configured in Vercel.
- A test WhatsApp conversion appears in Google Ads diagnostics.
- Search Console and Google Ads are linked for paid/organic reporting.
- Final URL, phone/WhatsApp destination and response hours are verified.
- Budget owner approves the daily budget and payment method.
- Venue-name targets have written relationship/trademark approval where required.

## Weekly controls

- Review search terms and add negatives at least twice per week during the pilot.
- Judge performance by qualified conversations, not clicks or raw WhatsApp opens.
- Record service type, city, qualified/unqualified, quoted and booked for each lead.
- Pause keywords that spend materially without qualified conversations.
- Never advertise live availability, guaranteed access, fixed prices or “official site” status unless the provider and underlying data support the claim.
