import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import posthog from "posthog-js";

/**
 * Loads third-party analytics scripts when their respective env vars are set.
 * Vercel env vars must be prefixed VITE_ to be exposed to the client.
 *
 * VITE_GA4_ID           — e.g. "G-ABC123XYZ"
 * VITE_CLARITY_ID       — Microsoft Clarity project ID
 * VITE_META_PIXEL_ID    — Meta (Facebook) Pixel / dataset ID, 15-16 digits
 *
 * Verification meta tags (GSC, Bing) are static and live in index.html via
 * Vite's %PLACEHOLDER% substitution — see VITE_GSC_VERIFICATION /
 * VITE_BING_VERIFICATION in index.html.
 *
 * Vercel Analytics + Speed Insights remain wired in App.jsx and need no IDs.
 *
 * SPA note: the site is client-routed, so this component also re-fires
 * PageView (Meta) and page_view (GA4) on every route change — the base
 * snippets only fire on the initial document load.
 */
function loadOnce(id, mount){
  if(document.getElementById(id)) return;
  mount();
}

/* Fire the "user headed to the App Store" conversion on every pixel that is
 * loaded. Anchor CTAs are caught by the document-level click listener below;
 * imperative window.open() CTAs (openAppStore in App.jsx) are caught by the
 * window.open wrapper installed in the same effect — so no call sites need
 * to change when CTAs are added. */
export function trackAppStoreClick(){
  if(window.fbq){
    window.fbq("track", "Lead");
    window.fbq("trackCustom", "AppStoreClick", { page: window.location.pathname });
  }
  if(window.gtag){
    window.gtag("event", "app_store_click", { page_path: window.location.pathname });
  }
  if(posthog.__loaded){
    posthog.capture("app_store_click", {source:"website", page_path:window.location.pathname});
  }
}

export default function SiteAnalytics(){
  var location = useLocation();
  var firstRoute = useRef(true);
  var routeStartedAt = useRef(Date.now());
  var previousPath = useRef(null);

  useEffect(function(){
    var ga4 = import.meta.env.VITE_GA4_ID;
    var clarity = import.meta.env.VITE_CLARITY_ID;
    var metaPixel = import.meta.env.VITE_META_PIXEL_ID;
    var posthogKey = import.meta.env.VITE_POSTHOG_KEY || "phc_kJpL4kERD6qwGercTjscu4jaCQBTRKQxuScmLt8XDGo6";
    var posthogHost = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

    /* ── PostHog: one project shared by the website + native app ───── */
    if(posthogKey && !posthog.__loaded){
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: false,
        autocapture: true,
        disable_session_recording: true,
        persistence: "localStorage+cookie",
      });
    }

    /* ── Google Analytics 4 ─────────────────────────────────────────── */
    if(ga4 && /^G-[A-Z0-9]{6,}$/i.test(ga4)){
      loadOnce("ga4-loader", function(){
        var s = document.createElement("script");
        s.id = "ga4-loader";
        s.async = true;
        s.src = "https://www.googletagmanager.com/gtag/js?id="+ga4;
        document.head.appendChild(s);

        var inline = document.createElement("script");
        inline.id = "ga4-init";
        inline.textContent = "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','"+ga4+"',{anonymize_ip:true});";
        document.head.appendChild(inline);
      });
    }

    /* ── Microsoft Clarity ──────────────────────────────────────────── */
    if(clarity && /^[a-z0-9]{8,}$/i.test(clarity)){
      loadOnce("clarity-init", function(){
        var s = document.createElement("script");
        s.id = "clarity-init";
        s.textContent = "(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script','"+clarity+"');";
        document.head.appendChild(s);
      });
    }

    /* ── Meta (Facebook) Pixel ──────────────────────────────────────── */
    if(metaPixel && /^\d{15,16}$/.test(metaPixel)){
      loadOnce("meta-pixel-init", function(){
        var s = document.createElement("script");
        s.id = "meta-pixel-init";
        s.textContent = "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','"+metaPixel+"');fbq('track','PageView');";
        document.head.appendChild(s);
      });
    }
  }, []);

  /* ── SPA route-change page views ──────────────────────────────────── */
  useEffect(function(){
    var path = location.pathname;
    var excluded = path === "/admin" || path.startsWith("/proposal");

    if(previousPath.current && posthog.__loaded){
      posthog.capture("page_exited", {
        page_path: previousPath.current,
        duration_seconds: Math.max(0, Math.round((Date.now()-routeStartedAt.current)/1000)),
        source: "website",
      });
    }
    routeStartedAt.current = Date.now();
    previousPath.current = path;

    if(!excluded && posthog.__loaded){
      posthog.capture("$pageview", {$current_url:window.location.href, page_path:path});
      posthog.capture("page_viewed", {page_path:path, source:"website"});

      var match = path.match(/^\/catalog\/(dining|nightlife|wellness|hotels|yachts|exotic-cars)\/([^/]+)\/?$/);
      if(match){
        posthog.capture("venue_detail_viewed", {
          category:match[1],
          venue_id:decodeURIComponent(match[2]),
          venue_slug:decodeURIComponent(match[2]),
          source:"website",
        });
      }
    }

    if(firstRoute.current){ firstRoute.current = false; return; }
    if(window.fbq) window.fbq("track", "PageView");
    if(window.gtag) window.gtag("event", "page_view", { page_path:path });
  }, [location.pathname]);

  /* ── App Store outbound clicks (anchor + window.open CTAs, site-wide) ─ */
  useEffect(function(){
    function onClick(e){
      var el = e.target && e.target.closest ? e.target.closest("a,button") : null;
      if(!el) return;
      var href = el.tagName === "A" ? (el.href || "") : "";
      var label = (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0,120);
      var props = {source:"website",page_path:window.location.pathname,label:label};

      if(href.indexOf("apps.apple.com") !== -1){
        trackAppStoreClick();
      } else if(/wa\.me|whatsapp/i.test(href)){
        if(posthog.__loaded) posthog.capture("concierge_chat_opened", {...props,context:"website"});
      } else if(/opentable|thefork|resy|sevenrooms|zenchef|tock|quandoo|covermanager/i.test(href)){
        if(posthog.__loaded) posthog.capture("reserve_button_tapped", {...props,booking_url:href});
      } else if(el.tagName === "BUTTON" && /book|reserve|request|secure/i.test(label)){
        if(posthog.__loaded) posthog.capture("cta_clicked", props);
      } else if(href && new URL(href,window.location.href).host !== window.location.host){
        if(posthog.__loaded) posthog.capture("outbound_link_clicked", {...props,destination:new URL(href,window.location.href).host});
      }
    }
    document.addEventListener("click", onClick, true);

    var origOpen = window.open;
    window.open = function(url){
      if(typeof url === "string" && url.indexOf("apps.apple.com") !== -1) trackAppStoreClick();
      return origOpen.apply(window, arguments);
    };

    return function(){
      if(previousPath.current && posthog.__loaded){
        posthog.capture("page_exited", {
          page_path:previousPath.current,
          duration_seconds:Math.max(0,Math.round((Date.now()-routeStartedAt.current)/1000)),
          source:"website",
        });
      }
      document.removeEventListener("click", onClick, true);
      window.open = origOpen;
    };
  }, []);

  return null;
}
