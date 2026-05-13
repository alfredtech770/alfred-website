import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";

var sf = function(size, weight){
  return {fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", fontSize:size, fontWeight:weight||400, WebkitFontSmoothing:"antialiased"};
};
var C = {bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gold:"#FFD60A"};

var FAQS = [
  {
    q: "How do I sign in to the Alfred app?",
    a: "Download Alfred from the App Store and open it. Enter your email address and we'll send you a 6-digit verification code — no password needed. You can also sign in with your Apple ID. If you'd like to explore the app first, tap 'Browse as Guest'."
  },
  {
    q: "What subscription plans are available?",
    a: "Alfred offers three membership tiers — Gold ($29.99/month), Platinum ($99.99/month), and Centurion ($499.99/month). Gold and Platinum are also available on a yearly billing option. Each tier unlocks progressively exclusive concierge services and experiences."
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel anytime through your iPhone or iPad Settings → [Your Name] → Subscriptions → Alfred. Cancellations take effect at the end of the current billing period. You retain access to member benefits until then."
  },
  {
    q: "How do I restore my subscription on a new device?",
    a: "Open the Alfred app, go to the paywall screen, and tap 'Restore' at the bottom. Your subscription will be restored automatically if it's active on the same Apple ID."
  },
  {
    q: "What cities does Alfred operate in?",
    a: "Alfred is currently available in Paris, Miami, Dubai, London, Monaco, and New York, with more cities being added regularly. Check the app for the latest city coverage."
  },
  {
    q: "How does the concierge service work?",
    a: "Once you're a member, you can request reservations, bookings, and personalised recommendations directly through the app. Your dedicated Alfred concierge handles everything — from restaurant reservations to private jet charters — and responds via in-app chat or WhatsApp."
  },
  {
    q: "I have a technical issue with the app. What should I do?",
    a: "First, try closing and reopening the app. If the issue persists, ensure you're on the latest version from the App Store. For persistent issues, contact our support team at support@alfredconcierge.app and we'll respond within 24 hours."
  },
  {
    q: "I didn't receive my verification code. What should I do?",
    a: "Check your spam or junk mail folder. If it's not there, wait 60 seconds and try sending the code again. Make sure you entered your email address correctly. If problems persist, contact us at support@alfredconcierge.app."
  },
  {
    q: "Is my personal information secure?",
    a: "Yes. Alfred uses industry-standard encryption and secure authentication. We never sell your personal data to third parties. For full details, see our Privacy Policy."
  },
  {
    q: "How do I delete my account?",
    a: "To request account deletion, email us at support@alfredconcierge.app with the subject line 'Account Deletion Request' and include the email address associated with your account. We'll process your request within 30 days."
  },
];

export default function SupportPage() {
  var navigate = useNavigate();

  useEffect(function(){ window.scrollTo(0,0); }, []);

  return (
    <div style={{background:C.bg, minHeight:"100vh", color:C.s1}}>
      <SEOHead
        title="Support — Alfred Concierge"
        description="Alfred Concierge support centre. Get help with your account, subscription, sign-in, and concierge services. Contact our team at support@alfredconcierge.app."
        keywords="Alfred Concierge support, help, contact, FAQ, subscription help"
      />

      {/* Nav */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,10,11,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid "+C.bd,padding:"0 40px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={function(){navigate("/")}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M16 4L28 26H4L16 4Z" stroke={C.gold} strokeWidth="1.5" fill="none"/>
            <path d="M16 4L28 26H4L16 4Z" fill={C.gold} fillOpacity="0.1"/>
          </svg>
          <span style={{...sf(16,600),color:C.s1}}>Alfred</span>
        </div>
        <div style={{display:"flex",gap:24,alignItems:"center"}}>
          <a href="/terms" style={{...sf(13,400),color:C.s5,textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Terms</a>
          <a href="/privacy" style={{...sf(13,400),color:C.s5,textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Privacy</a>
        </div>
      </nav>

      <div style={{maxWidth:760,margin:"0 auto",padding:"72px 32px 120px"}}>

        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:72}}>
          <div style={{width:64,height:64,borderRadius:18,background:C.el,border:"1px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px"}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
          </div>
          <h1 style={{...sf(40,700),color:C.s1,margin:"0 0 14px",lineHeight:1.15}}>How can we help?</h1>
          <p style={{...sf(17,400),color:C.s5,margin:0,lineHeight:1.6}}>
            Find answers below or reach our team directly at{" "}
            <a href="mailto:support@alfredconcierge.app" style={{color:C.gold,textDecoration:"none"}}>support@alfredconcierge.app</a>.
            We respond within 24 hours.
          </p>
        </div>

        {/* Contact Cards */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:72}}>
          <ContactCard
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            }
            title="Email Support"
            detail="support@alfredconcierge.app"
            sub="Response within 24 hours"
            href="mailto:support@alfredconcierge.app"
          />
          <ContactCard
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            }
            title="WhatsApp Concierge"
            detail="Available for members"
            sub="Real-time concierge chat"
            href="https://wa.me/33612345678"
          />
        </div>

        {/* FAQ */}
        <div style={{marginBottom:72}}>
          <h2 style={{...sf(22,700),color:C.s1,margin:"0 0 32px"}}>Frequently Asked Questions</h2>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {FAQS.map(function(faq, i){
              return <FaqItem key={i} q={faq.q} a={faq.a}/>;
            })}
          </div>
        </div>

        {/* App Store */}
        <div style={{background:C.el,border:"1px solid "+C.bd,borderRadius:20,padding:"40px 40px",textAlign:"center"}}>
          <p style={{...sf(13,600),color:C.s7,letterSpacing:2,textTransform:"uppercase",margin:"0 0 12px"}}>Alfred App</p>
          <h3 style={{...sf(24,700),color:C.s1,margin:"0 0 10px"}}>Download Alfred</h3>
          <p style={{...sf(14,400),color:C.s5,margin:"0 0 28px",lineHeight:1.6}}>Available exclusively on the App Store for iPhone and iPad.</p>
          <a
            href="https://apps.apple.com/app/alfred-concierge/id6471520020"
            target="_blank"
            rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:10,background:C.s1,color:C.bg,borderRadius:12,padding:"14px 28px",textDecoration:"none",...sf(15,600)}}
          >
            <svg width="18" height="18" viewBox="0 0 814 1000" fill="currentColor">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.6 0 280.3 0 188.9c0-85.7 35.2-164.5 93.3-220.5C150.9 12.5 225.7-10 296.7-10c68.7 0 123.2 34.6 166.3 34.6 41.5 0 107-35.4 183.2-35.4 28.2 0 130.4 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
            </svg>
            Download on the App Store
          </a>
        </div>

        {/* Footer links */}
        <div style={{marginTop:60,display:"flex",gap:28,justifyContent:"center",flexWrap:"wrap"}}>
          {[
            {label:"Terms & Conditions", href:"/terms"},
            {label:"Privacy Policy", href:"/privacy"},
            {label:"Email Support", href:"mailto:support@alfredconcierge.app"},
          ].map(function(l){
            return (
              <a key={l.href} href={l.href} style={{...sf(13,400),color:C.s6,textDecoration:"none",transition:"color 0.2s"}}
                onMouseEnter={function(e){e.target.style.color=C.s3}}
                onMouseLeave={function(e){e.target.style.color=C.s6}}>
                {l.label}
              </a>
            );
          })}
        </div>

      </div>
    </div>
  );
}

function ContactCard({icon, title, detail, sub, href}){
  return (
    <a href={href} style={{display:"block",background:C.el,border:"1px solid "+C.bd,borderRadius:16,padding:"28px 24px",textDecoration:"none",transition:"border-color 0.2s"}}
      onMouseEnter={function(e){e.currentTarget.style.borderColor=C.gold+"44"}}
      onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
      <div style={{marginBottom:16}}>{icon}</div>
      <div style={{...sf(15,600),color:C.s1,marginBottom:6}}>{title}</div>
      <div style={{...sf(13,400),color:C.gold,marginBottom:4}}>{detail}</div>
      <div style={{...sf(12,400),color:C.s6}}>{sub}</div>
    </a>
  );
}

function FaqItem({q, a}){
  var [open, setOpen] = React.useState(false);

  return (
    <div style={{background:open?C.el:C.bg,border:"1px solid "+(open?C.bd+"88":C.bd+"44"),borderRadius:12,overflow:"hidden",transition:"all 0.2s"}}>
      <button
        onClick={function(){setOpen(!open)}}
        style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px",background:"none",border:"none",cursor:"pointer",gap:16}}>
        <span style={{...sf(15,500),color:C.s2,textAlign:"left",lineHeight:1.4}}>{q}</span>
        <span style={{color:C.s5,flexShrink:0,transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s",fontSize:18}}>⌄</span>
      </button>
      {open && (
        <div style={{padding:"0 20px 20px"}}>
          <p style={{...sf(14,400),color:C.s5,margin:0,lineHeight:1.7}}>{a}</p>
        </div>
      )}
    </div>
  );
}

// Need React for useState in FaqItem
import React from "react";
