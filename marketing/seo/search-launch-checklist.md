# Alfred search launch checklist

The website-side work is automated by the build. The account-side steps below require the owner of the relevant Google, Bing, analytics or supplier account.

## Google Search Console

1. Open the existing `https://alfredconcierge.app/` property. The production HTML already contains a Google verification tag.
2. Submit `https://alfredconcierge.app/sitemap.xml` once after this release.
3. Inspect and request indexing for the seven city hubs first, followed by the city/service pages that have real catalogue inventory. Start with hotels and restaurants in Ibiza, Paris, Miami, Saint-Tropez and Mykonos.
4. Review Page Indexing weekly. Fix genuine `404`, server and canonical errors; do not force-index low-quality or unavailable listings.
5. Use the Performance report by page and query. Track non-brand impressions, clicks, average position and qualified WhatsApp requests by city/service page.

## Bing and AI discovery

1. Verify the domain in Bing Webmaster Tools and submit the same sitemap.
2. Keep `public/llms.txt` factual and aligned with visible pages. It is a discovery aid, not a ranking shortcut.
3. Update venue facts, availability wording and destination guidance whenever the underlying catalogue changes.

## Analytics and paid-search measurement

1. Configure `VITE_GA4_ID`, `VITE_GOOGLE_ADS_ID` and `VITE_GOOGLE_ADS_WHATSAPP_LABEL` in Vercel Production.
2. Grant advertising consent on a test session, open a WhatsApp request, and verify one `generate_lead` event and one Google Ads conversion. Repeat with consent declined to confirm the advertising conversion does not fire.
3. Link Search Console and Google Ads to GA4. Use qualified conversations and confirmed bookings as business KPIs; a WhatsApp click alone is only a lead signal.

## Content and authority cadence

- Weekly: refresh incorrect listing facts, broken images and out-of-date seasonal information.
- Twice monthly: publish one genuinely researched destination answer based on real concierge questions, then link it to the relevant city/service hub and catalogue entries.
- Monthly: obtain legitimate editorial or partner mentions from hotels, venues, travel publications and destination businesses. Do not buy bulk links or create copied city pages.
- Quarterly: prune or `noindex` product pages that have no useful details, no current inventory and no search demand.

## Success thresholds

Judge SEO over a 90-day window, not immediately after deployment. Segment brand and non-brand queries. A useful early signal is rising impressions for exact city/service searches; the commercial signal is qualified request rate and confirmed booking value.
