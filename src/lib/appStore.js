/* Apple App Store campaign attribution.
 *
 * Apple counts downloads per campaign when an App Store link carries a
 * `ct` (campaign token) parameter. Those counts show up in App Store
 * Connect under App Analytics > Acquisition, split by campaign — no SDK
 * and no new app build required, which is why this exists: the Meta SDK
 * inside the iOS app is not shipped yet, so this is the only source of
 * real per-campaign download numbers.
 *
 * Flow: a Meta ad appends its own campaign/ad name to the landing URL
 * (utm_campaign / utm_content), we stash that on first visit, and every
 * App Store link on the site then carries it as `ct`.
 *
 * Apple caps the token at 40 characters and rejects anything that is not
 * a plain identifier, so the value is aggressively sanitised.
 */

const APP_ID = "6759160130";
const BASE_URL = "https://apps.apple.com/app/id" + APP_ID;
const STORAGE_KEY = "alfred_campaign_token_v1";
const TOKEN_MAX = 40;

/* Apple silently drops tokens with spaces or punctuation, so collapse to
 * lowercase alphanumerics + underscore and trim to the documented cap. */
function sanitize(value){
  if(typeof value !== "string") return "";
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"_")
    .replace(/^_+|_+$/g,"")
    .slice(0,TOKEN_MAX);
}

/* The ad set/ad name is the useful part — utm_content identifies which
 * creative was clicked, utm_campaign only which campaign. Prefer the
 * finer grain, fall back to the campaign, then to a generic source. */
function readFromUrl(){
  if(typeof window === "undefined") return "";
  var params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch(e){
    return "";
  }
  var content = sanitize(params.get("utm_content"));
  var campaign = sanitize(params.get("utm_campaign"));
  var source = sanitize(params.get("utm_source"));
  if(content && campaign) return sanitize(campaign + "_" + content);
  return content || campaign || source;
}

/* Persist so the token survives navigation across the site: a visitor
 * often lands on the homepage and taps the App Store button three pages
 * later, long after the query string is gone. */
export function captureCampaignToken(){
  if(typeof window === "undefined") return "";
  var fresh = readFromUrl();
  if(fresh){
    try { window.sessionStorage.setItem(STORAGE_KEY,fresh); } catch(e){ /* private mode */ }
    return fresh;
  }
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) || "";
  } catch(e){
    return "";
  }
}

/* Build an App Store URL carrying the campaign token, if we have one.
 * `pt` (provider token) is deliberately omitted — it is only needed to
 * group campaigns under a provider account, and `ct` alone is what App
 * Analytics reports on. */
export function appStoreUrl(fallbackToken){
  var token = captureCampaignToken() || sanitize(fallbackToken);
  if(!token) return BASE_URL;
  return BASE_URL + "?ct=" + encodeURIComponent(token) + "&mt=8";
}

export { APP_ID, BASE_URL };
