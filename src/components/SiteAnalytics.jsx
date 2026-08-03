import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { applyGoogleConsent, DENIED_CONSENT, readStoredConsent } from "../lib/consent";

var posthogClient=null;

function loadOnce(id,mount){
  if(document.getElementById(id)) return;
  mount();
}

function currentConsent(){
  return readStoredConsent() || DENIED_CONSENT;
}

function capturePosthog(name,props){
  if(currentConsent().analytics && posthogClient && posthogClient.__loaded){
    posthogClient.capture(name,props);
  }
}

export function trackLead(options){
  var opts=options || {};
  var consent=currentConsent();
  var method=opts.method || "website";
  var props={
    method:method,
    page_path:window.location.pathname,
    label:(opts.label || "").slice(0,120),
  };

  if(consent.analytics && window.gtag){
    window.gtag("event","generate_lead",props);
  }
  if(consent.advertising && window.fbq){
    window.fbq("track","Lead",{content_name:props.label,content_category:method});
  }

  var adsId=import.meta.env.VITE_GOOGLE_ADS_ID;
  var conversionLabel=import.meta.env.VITE_GOOGLE_ADS_WHATSAPP_LABEL;
  if(method==="whatsapp" && consent.advertising && window.gtag && /^AW-\d+$/.test(adsId||"") && /^[A-Za-z0-9_-]+$/.test(conversionLabel||"")){
    window.gtag("event","conversion",{send_to:adsId+"/"+conversionLabel});
  }
  capturePosthog(method==="whatsapp"?"concierge_chat_opened":"lead_generated",props);
}

export function trackAppStoreClick(){
  var consent=currentConsent();
  if(consent.analytics && window.gtag){
    window.gtag("event","app_store_click",{page_path:window.location.pathname});
  }
  if(consent.advertising && window.fbq){
    window.fbq("trackCustom","AppStoreClick",{page:window.location.pathname});
  }
  capturePosthog("app_store_click",{source:"website",page_path:window.location.pathname});
}

function configureGoogle(consent){
  var ga4=import.meta.env.VITE_GA4_ID;
  var adsId=import.meta.env.VITE_GOOGLE_ADS_ID;
  var validGa4=/^G-[A-Z0-9]{6,}$/i.test(ga4||"");
  var validAds=/^AW-\d+$/.test(adsId||"");
  var loaderId=consent.analytics&&validGa4?ga4:consent.advertising&&validAds?adsId:null;
  if(!loaderId) return;

  loadOnce("google-tag-loader",function(){
    var script=document.createElement("script");
    script.id="google-tag-loader";
    script.async=true;
    script.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(loaderId);
    document.head.appendChild(script);
  });
  if(!window.__alfredGtagStarted){
    window.__alfredGtagStarted=true;
    window.gtag("js",new Date());
  }
  if(consent.analytics&&validGa4&&!window.__alfredGaConfigured){
    window.__alfredGaConfigured=true;
    window.gtag("config",ga4,{anonymize_ip:true});
  }
  if(consent.advertising&&validAds&&!window.__alfredAdsConfigured){
    window.__alfredAdsConfigured=true;
    window.gtag("config",adsId);
  }
}

export default function SiteAnalytics(){
  var location=useLocation();
  var [consent,setConsent]=useState(readStoredConsent() || DENIED_CONSENT);
  var firstRoute=useRef(true);
  var routeStartedAt=useRef(Date.now());
  var previousPath=useRef(null);

  useEffect(function(){
    function onConsent(event){setConsent(event.detail || DENIED_CONSENT)}
    window.addEventListener("alfred:consent",onConsent);
    return function(){window.removeEventListener("alfred:consent",onConsent)};
  },[]);

  useEffect(function(){
    var cancelled=false;
    applyGoogleConsent(consent);
    configureGoogle(consent);

    if(consent.analytics){
      var posthogKey=import.meta.env.VITE_POSTHOG_KEY;
      var posthogHost=import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";
      if(posthogKey && !posthogClient){
        import("posthog-js").then(function(module){
          if(cancelled || !currentConsent().analytics) return;
          posthogClient=module.default;
          posthogClient.init(posthogKey,{
            api_host:posthogHost,
            person_profiles:"identified_only",
            capture_pageview:false,
            capture_pageleave:false,
            autocapture:false,
            disable_session_recording:true,
            persistence:"localStorage+cookie",
          });
          capturePosthog("$pageview",{$current_url:window.location.href,page_path:window.location.pathname});
        });
      }

      var clarity=import.meta.env.VITE_CLARITY_ID;
      if(clarity && /^[a-z0-9]{8,}$/i.test(clarity)){
        loadOnce("clarity-init",function(){
          var script=document.createElement("script");
          script.id="clarity-init";
          script.textContent="(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script','"+clarity+"');";
          document.head.appendChild(script);
        });
      }
    }

    if(consent.advertising){
      var metaPixel=import.meta.env.VITE_META_PIXEL_ID;
      if(metaPixel && /^\d{15,16}$/.test(metaPixel)){
        loadOnce("meta-pixel-init",function(){
          var script=document.createElement("script");
          script.id="meta-pixel-init";
          script.textContent="!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','"+metaPixel+"');fbq('track','PageView');";
          document.head.appendChild(script);
        });
      }
    }
    return function(){cancelled=true};
  },[consent.analytics,consent.advertising]);

  useEffect(function(){
    var path=location.pathname;
    var excluded=path==="/admin" || path.startsWith("/proposal");

    if(previousPath.current && consent.analytics){
      capturePosthog("page_exited",{
        page_path:previousPath.current,
        duration_seconds:Math.max(0,Math.round((Date.now()-routeStartedAt.current)/1000)),
        source:"website",
      });
    }
    routeStartedAt.current=Date.now();
    previousPath.current=path;

    if(!excluded && consent.analytics){
      capturePosthog("$pageview",{$current_url:window.location.href,page_path:path});
      capturePosthog("page_viewed",{page_path:path,source:"website"});
      if(window.gtag && !firstRoute.current) window.gtag("event","page_view",{page_path:path});

      var match=path.match(/^\/catalog\/(dining|nightlife|wellness|hotels|yachts|exotic-cars)\/([^/]+)\/?$/);
      if(match){
        capturePosthog("venue_detail_viewed",{
          category:match[1],venue_id:decodeURIComponent(match[2]),venue_slug:decodeURIComponent(match[2]),source:"website",
        });
      }
      var cityService=path.match(/^\/city\/([^/]+)\/(hotels|restaurants|nightlife|exotic-cars|yachts|jets|wellness)\/?$/);
      if(cityService){
        capturePosthog("city_service_viewed",{city:cityService[1],service:cityService[2],source:"website"});
        if(window.gtag)window.gtag("event","view_item_list",{item_list_id:"city_service",item_list_name:cityService[2]+" in "+cityService[1]});
      }
    }
    firstRoute.current=false;
    if(!excluded && consent.advertising && window.fbq) window.fbq("track","PageView");
  },[location.pathname,consent.analytics,consent.advertising]);

  useEffect(function(){
    function onClick(event){
      var element=event.target&&event.target.closest?event.target.closest("a,button"):null;
      if(!element) return;
      var href=element.tagName==="A"?(element.href||""):"";
      var label=(element.innerText||element.getAttribute("aria-label")||"").trim().slice(0,120);
      var props={source:"website",page_path:window.location.pathname,label:label};

      if(href.indexOf("apps.apple.com")!==-1){
        trackAppStoreClick();
      } else if(/wa\.me|whatsapp/i.test(href)){
        trackLead({method:"whatsapp",label:label});
      } else if(/^mailto:/i.test(href)){
        trackLead({method:"email",label:label});
      } else if(/opentable|thefork|resy|sevenrooms|zenchef|tock|quandoo|covermanager/i.test(href)){
        capturePosthog("reserve_button_tapped",{...props,booking_url:href});
      } else if(element.tagName==="BUTTON"&&/book|reserve|request|secure/i.test(label)){
        capturePosthog("cta_clicked",props);
      } else if(href&&new URL(href,window.location.href).host!==window.location.host){
        capturePosthog("outbound_link_clicked",{...props,destination:new URL(href,window.location.href).host});
      }
    }
    document.addEventListener("click",onClick,true);

    var originalOpen=window.open;
    window.open=function(url){
      if(typeof url==="string"&&url.indexOf("apps.apple.com")!==-1){
        trackAppStoreClick();
      } else if(typeof url==="string"&&/wa\.me|whatsapp/i.test(url)){
        trackLead({method:"whatsapp",label:"Concierge request"});
      }
      return originalOpen.apply(window,arguments);
    };

    return function(){
      document.removeEventListener("click",onClick,true);
      window.open=originalOpen;
    };
  },[]);

  return null;
}
