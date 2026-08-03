# Hotel price and Google travel readiness

## What is live on the website

- Hotel cards request the lowest current public LiteAPI offer for the selected dates and occupancy when `LITEAPI_KEY` is configured.
- The UI says `From` and explains that price, room, taxes and cancellation terms can change until booking.
- Hotels without a current supplier rate show `Price on request`; the site does not invent a low price.
- Product price schema is limited to supplier rates whose fees are confirmed as included.

## What must happen before Google Hotel Ads

Google's hotel surfaces require accurate property data, continuously maintained prices and landing pages that match the selected itinerary and rate. Alfred currently coordinates requests rather than completing a direct hotel booking, so normal Search ads should be used first.

Do not claim `lowest price`, `best price` or a price guarantee. A low starting rate may be advertised only when it is currently returned for the searched dates and occupancy and the landing page can reproduce it with the same taxes and conditions.

Before a Hotel Center connection, the account owner must provide:

1. A production `LITEAPI_KEY` and stable hotel/property identifiers.
2. A rate feed or approved connectivity partner that can maintain price, room, tax and availability accuracy.
3. Itinerary-specific landing URLs and a compliant booking or referral flow.
4. Reconciliation monitoring for price mismatches and unavailable rates.
5. Google Hotel Center, Ads and billing access.

Until those items exist, bid on high-intent city hotel-concierge searches and send traffic to `/city/{city}/hotels`. Optimize for qualified requests, not raw clicks.
