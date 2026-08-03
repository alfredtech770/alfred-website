export const CONSENT_STORAGE_KEY = "alfred_cookie_consent_v1";

export const DENIED_CONSENT = Object.freeze({analytics:false, advertising:false});

function normalize(value){
  if(!value || typeof value !== "object") return null;
  return {
    analytics:value.analytics === true,
    advertising:value.advertising === true,
  };
}

export function readStoredConsent(){
  if(typeof window === "undefined") return null;
  try {
    return normalize(JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY)));
  } catch(e){
    return null;
  }
}

export function persistConsent(value){
  var consent=normalize(value) || DENIED_CONSENT;
  window.localStorage.setItem(CONSENT_STORAGE_KEY,JSON.stringify({
    ...consent,
    updatedAt:new Date().toISOString(),
  }));
  return consent;
}

export function applyGoogleConsent(value){
  if(typeof window === "undefined") return;
  var consent=normalize(value) || DENIED_CONSENT;
  window.__alfredConsent=consent;
  window.dataLayer=window.dataLayer || [];
  window.gtag=window.gtag || function(){window.dataLayer.push(arguments)};
  window.gtag("consent","update",{
    analytics_storage:consent.analytics?"granted":"denied",
    ad_storage:consent.advertising?"granted":"denied",
    ad_user_data:consent.advertising?"granted":"denied",
    ad_personalization:consent.advertising?"granted":"denied",
  });
}

export function announceConsent(value){
  var consent=persistConsent(value);
  applyGoogleConsent(consent);
  window.dispatchEvent(new CustomEvent("alfred:consent",{detail:consent}));
  return consent;
}
