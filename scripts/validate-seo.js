#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const failures = [];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const index = read("index.html");
const app = read("src/App.jsx");
const car = read("src/pages/CarDetailPage.jsx");
const exoticCars = read("src/pages/ExoticCarsPage.jsx");
const dining = read("src/pages/DiningPage.jsx");
const hotels = read("src/pages/HotelsPage.jsx");
const hotelDetail = read("src/pages/HotelDetailPage.jsx");
const hotelMinRates = read("api/hotel-min-rates.js");
const hotelRateProvider = read("server/hotelRatesProvider.js");
const nightlife = read("src/pages/NightlifePage.jsx");
const wellness = read("src/pages/WellnessPage.jsx");
const yachts = read("src/pages/YachtsPage.jsx");
const admin = read("src/pages/AdminPage.jsx");
const proposal = read("src/pages/ProposalBuilderPage.jsx");
const analytics = read("src/components/SiteAnalytics.jsx");
const cookieConsent = read("src/components/CookieConsent.jsx");
const consent = read("src/lib/consent.js");
const cityPage = read("src/pages/CityPage.jsx");
const cityData = read("src/data/cities.js");
const cityServicePage = read("src/pages/CityServicePage.jsx");
const cityServiceData = read("src/data/cityServices.js");
const brand = read("src/components/brand.jsx");
const jets = read("src/pages/JetsPage.jsx");
const about = read("src/pages/AboutPage.jsx");
const howItWorks = read("src/pages/HowItWorksPage.jsx");
const pricing = read("src/pages/PricingPage.jsx");
const contact = read("src/pages/ContactPage.jsx");
const carPartners = read("src/pages/CarPartnersPage.jsx");
const supabase = read("src/lib/supabase.js");
const envExample = read(".env.example");
const vercel = read("vercel.json");
const catalogBody = read("src/components/CatalogSeoBody.jsx");
const jsonld = read("src/lib/jsonld.js");
const llms = read("public/llms.txt");
const sitemap = read("public/sitemap.xml");
const sitemapGenerator = read("scripts/gen-product-sitemap.js");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/\/$/, ""));

if ((index.match(/rel="canonical"/g) || []).length !== 1) failures.push("index.html must contain exactly one canonical");
if (/hreflang=/.test(index)) failures.push("index.html contains unsupported hreflang alternates");
if (/%VITE_[A-Z_]+%|YOURAPPID|REPLACE_WITH_YOUR/.test(index + app)) failures.push("verification or app placeholders remain");
if (/aggregateRating/.test(index)) failures.push("unsubstantiated homepage aggregateRating remains");
if (/clip:\s*"rect\(0,0,0,0\)"/.test(app)) failures.push("hidden crawler-only content remains");
if (/Math\.random\(\).*reviews|var REVIEWS=/.test(car)) failures.push("fabricated car reviews remain");
if (/direct relationships|guaranteed placement|insurance included|full crew, catering|instant quotes/i.test(catalogBody)) failures.push("unsupported AEO claims remain in visible catalog copy");
if (!/c\.live_bookable === true/.test(jsonld) || !/y\.live_bookable === true/.test(jsonld)) failures.push("request-only car or yacht prices are still exposed as live Offer inventory");
if (/VITE_SUPABASE_SERVICE_KEY/.test(admin)) failures.push("admin page could expose a Supabase service-role key");
if (/VITE_SLACK|hooks\.slack\.com|alfred2026/.test(admin)) failures.push("admin page contains a browser-exposed webhook or shared password");
if (!/signInWithOtp/.test(admin) || !/rpc\("is_admin"\)/.test(admin)) failures.push("admin page is missing server-verified email OTP access");
if (!/path="\/admin" noindex/.test(admin)) failures.push("admin page must be noindex");
if (!/path="\/proposal" noindex/.test(proposal)) failures.push("proposal page must be noindex");
if (!/<CookieConsent\/>/.test(app)) failures.push("cookie consent UI is not mounted");
if (!/import\("posthog-js"\)/.test(analytics) || /from\s+["']posthog-js["']/.test(analytics)) failures.push("PostHog must load lazily after consent");
if (/phc_[A-Za-z0-9]+/.test(analytics)) failures.push("a hardcoded PostHog project key remains");
if (/eyJhbGciOiJ/.test(supabase)) failures.push("a hardcoded Supabase key remains");
if (!/VITE_SUPABASE_URL=/.test(envExample) || !/VITE_SUPABASE_ANON_KEY=/.test(envExample)) failures.push("Supabase deployment variables are undocumented");
if (!/LITTLE_EMPERORS_RATES_ENDPOINT=/.test(envExample) || !/LITTLE_EMPERORS_API_KEY=/.test(envExample)) failures.push("the server-side Little Emperors adapter variables are undocumented");
if (!/hotel-min-rates/.test(hotels) || !/From \{money\(rate\.perNight/.test(hotels)) failures.push("hotel cards are missing itinerary-specific starting prices");
if (!/fetchPartnerRates/.test(hotelMinRates) || !/publicRate !== true/.test(hotelRateProvider) || !/bookable !== true/.test(hotelRateProvider)) failures.push("hotel listing rates are not restricted to authorised public, bookable partner offers");
if (!/CompoundPriceSpecification/.test(hotelDetail) || !/taxesIncluded===true/.test(hotelDetail)) failures.push("hotel price schema must be limited to fee-inclusive supplier rates");
if (!/Hotel Not Found \| Alfred Concierge[\s\S]{0,220}noindex/.test(hotelDetail)) failures.push("missing hotel detail pages must emit noindex metadata");
if (/\+r\.name\+/.test(hotelDetail)) failures.push("hotel room requests can still contain an undefined room name");
if (!/ad_user_data/.test(consent) || !/ad_personalization/.test(consent)) failures.push("Google consent mode v2 signals are incomplete");
if (!/Necessary only/.test(cookieConsent) || !/Save choices/.test(cookieConsent)) failures.push("granular cookie choices are missing");
if (!/CITY_GUIDES\[slug\]/.test(cityPage)) failures.push("city pages are not using verified request-based content");
for (const slug of ["miami", "paris", "ibiza", "saint-tropez", "mykonos", "dubai", "london"]) {
  const keyPattern = slug === "saint-tropez" ? /["']saint-tropez["']\s*:/ : new RegExp(`\\b${slug}\\s*:`);
  if (!keyPattern.test(cityData)) failures.push(`${slug} is missing from the city-guide data`);
  if (!locs.includes(`https://alfredconcierge.app/city/${slug}`)) failures.push(`${slug} is missing from the sitemap`);
  for (const service of ["hotels", "restaurants", "nightlife", "exotic-cars", "yachts", "jets", "wellness"]) {
    if (!locs.includes(`https://alfredconcierge.app/city/${slug}/${service}`)) failures.push(`${service} in ${slug} is missing from the sitemap`);
  }
}
if (!/path="\/city\/:city\/:service"/.test(app)) failures.push("city-by-service landing-page route is missing");
if (!/path="\/partners\/car-rentals"/.test(app) || !/live availability and pricing integration/i.test(carPartners)) failures.push("car-rental partner onboarding page or route is missing");
if (!locs.includes("https://alfredconcierge.app/partners/car-rentals")) failures.push("car-rental partner page is missing from the sitemap");
if (!/FAQPage/.test(cityServicePage) || !/BreadcrumbList/.test(cityServicePage) || !/Service/.test(cityServicePage)) failures.push("city-service pages are missing required structured data");
if (!/CITY_SERVICE_ORDER/.test(cityServicePage) || !/catalogHref/.test(cityServicePage)) failures.push("city-service pages are missing cross-links or filtered catalog links");
for (const service of ["hotels", "restaurants", "nightlife", "exotic-cars", "yachts", "jets", "wellness"]) {
  const pattern = service === "exotic-cars" ? /["']exotic-cars["']\s*:/ : new RegExp(`\\b${service}\\s*:`);
  if (!pattern.test(cityServiceData)) failures.push(`${service} is missing from the city-service data`);
}
if (!/export function CatalogBrandNav/.test(brand)) failures.push("shared catalog navigation is missing");
for (const [name, source] of [["dining", dining], ["nightlife", nightlife], ["wellness", wellness], ["yachts", yachts], ["exotic cars", exoticCars], ["jets", jets]]) {
  if (!/<CatalogBrandNav/.test(source)) failures.push(`${name} does not use shared catalog navigation`);
  if (/href="\/proposal"/.test(source)) failures.push(`${name} exposes the private proposal route in public navigation`);
}
if (/Instant quotes|same-day booking|24\/7 Concierge|Get notified when we launch/i.test(jets)) failures.push("unsupported jet claims or a non-functional signup remain");
if (/world's best tables|skip every line|crewed & ready|delivered to your door/i.test(dining + nightlife + yachts + exoticCars)) failures.push("unsupported catalog hero claims remain");
if (!/city\/ibiza\/hotels/.test(llms) || !/city\/saint-tropez\/restaurants/.test(llms)) failures.push("LLM discovery file is missing city-service answer pages");
if (!/encodeURIComponent\(city\)/.test(cityData) || !/\?city=/.test(cityData)) failures.push("city guides do not deep-link to city-filtered catalogs");
if (/LocalBusiness|streetAddress|openingHoursSpecification/.test(cityData)) failures.push("city schema invents a physical Alfred location");
if (/direct relationships|guaranteed access|guaranteed entry|fixed price/i.test(cityData)) failures.push("unsupported city-page claims remain");
if (/33743713649/.test(index + app + llms + hotelDetail + dining + nightlife + wellness + yachts + exoticCars)) failures.push("the retired WhatsApp number remains in public website content");
if (!/33650938152/.test(index) || !/33650938152/.test(llms)) failures.push("the confirmed Alfred WhatsApp number is missing from index.html or llms.txt");
if (/direct relationships at every venue|waived advance payments|VIP flags in venue systems|every door open/i.test(about)) failures.push("unsupported About-page claims remain");
if (/booking confirmations in under|200\+ Michelin|concierge guarantee|valet is waived|VIP flag/i.test(howItWorks)) failures.push("unsupported How-it-Works claims remain");
if (/waived advance payment|VIP table placement|pays for itself|Most Popular|Every door open/i.test(pricing)) failures.push("unsupported pricing claims remain");
if (/Under (?:5|15) minutes|24\/7|Replies within four business hours/i.test(contact)) failures.push("unsupported contact response-time claims remain");
if (locs.some((url) => /\/(?:events|blog)(?:\/|$)/.test(url))) failures.push("unverified event or editorial URLs remain in the sitemap");
if (locs.includes("https://alfredconcierge.app/membership")) failures.push("the obsolete /membership URL remains in the sitemap");
if (!/yachtIds/.test(sitemapGenerator) || !/inactive or renamed records becoming soft 404s/.test(sitemapGenerator)) failures.push("the sitemap generator does not replace stale data-driven yacht and catalog URLs");
if (/X-Robots-Tag[\s\S]{0,120}index, follow/.test(vercel)) failures.push("Vercel forces index headers across noindex pages");
if (!/X-Robots-Tag[\s\S]{0,80}noindex, nofollow/.test(vercel)) failures.push("private routes need an HTTP noindex header");
for (const [name,source] of [["dining",dining],["nightlife",nightlife],["wellness",wellness],["yachts",yachts]]) {
  if (!new RegExp(`<a href=\\{\\"/catalog/${name === "yachts" ? "yachts" : name}/`).test(source)) failures.push(`${name} cards are not crawlable anchors`);
}
for (const [name, source] of [["dining", dining], ["hotels", hotels], ["nightlife", nightlife], ["wellness", wellness], ["exotic cars", exoticCars]]) {
  if (!/searchParams\.get\(["']city["']\)/.test(source)) failures.push(`${name} does not support city-filtered deep links`);
}
if (!/searchParams\.get\(["']location["']\)/.test(yachts)) failures.push("yachts do not support destination-filtered deep links");
if (new Set(locs).size !== locs.length) failures.push("sitemap contains duplicate URLs");
for (const row of read("marketing/google-ads/search-keywords.csv").split(/\r?\n/).slice(1)) {
  const finalUrl = row.split(",").pop();
  if (finalUrl && !locs.includes(finalUrl)) failures.push(`Google Ads final URL is not in the sitemap: ${finalUrl}`);
}
if (/<(?:lastmod|changefreq|priority)>/.test(sitemap)) failures.push("sitemap contains stale or ignored metadata");

if (failures.length) {
  console.error(failures.map((f) => `- ${f}`).join("\n"));
  process.exit(1);
}
console.log(`SEO validation passed (${locs.length} sitemap URLs)`);
