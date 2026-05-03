import { useEffect } from "react";

/**
 * Loads third-party analytics scripts when their respective env vars are set.
 * Vercel env vars must be prefixed VITE_ to be exposed to the client.
 *
 * VITE_GA4_ID         — e.g. "G-ABC123XYZ"
 * VITE_CLARITY_ID     — Microsoft Clarity project ID
 *
 * Verification meta tags (GSC, Bing) are static and live in index.html via
 * Vite's %PLACEHOLDER% substitution — see VITE_GSC_VERIFICATION /
 * VITE_BING_VERIFICATION in index.html.
 *
 * Vercel Analytics + Speed Insights remain wired in App.jsx and need no IDs.
 */
function loadOnce(id, mount){
  if(document.getElementById(id)) return;
  mount();
}

export default function SiteAnalytics(){
  useEffect(function(){
    var ga4 = import.meta.env.VITE_GA4_ID;
    var clarity = import.meta.env.VITE_CLARITY_ID;

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
  }, []);

  return null;
}
