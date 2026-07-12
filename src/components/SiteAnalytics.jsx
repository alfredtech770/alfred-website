import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

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
}

export default function SiteAnalytics(){
  var location = useLocation();
  var firstRoute = useRef(true);

  useEffect(function(){
    var ga4 = import.meta.env.VITE_GA4_ID;
    var clarity = import.meta.env.VITE_CLARITY_ID;
    var metaPixel = import.meta.env.VITE_META_PIXEL_ID;

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
    if(firstRoute.current){ firstRoute.current = false; return; }
    if(window.fbq) window.fbq("track", "PageView");
    if(window.gtag) window.gtag("event", "page_view", { page_path: location.pathname });
  }, [location.pathname]);

  /* ── App Store outbound clicks (anchor + window.open CTAs, site-wide) ─ */
  useEffect(function(){
    function onClick(e){
      var a = e.target && e.target.closest ? e.target.closest("a[href*='apps.apple.com']") : null;
      if(a) trackAppStoreClick();
    }
    document.addEventListener("click", onClick, true);

    var origOpen = window.open;
    window.open = function(url){
      if(typeof url === "string" && url.indexOf("apps.apple.com") !== -1) trackAppStoreClick();
      return origOpen.apply(window, arguments);
    };

    return function(){
      document.removeEventListener("click", onClick, true);
      window.open = origOpen;
    };
  }, []);

  return null;
}
