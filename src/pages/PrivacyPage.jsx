import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";

var sf = function(size, weight){
  return {fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", fontSize:size, fontWeight:weight||400, WebkitFontSmoothing:"antialiased"};
};
var C = {bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gold:"#FFD60A"};

var SECTIONS = [
  {id:"information-collected", title:"1. Information We Collect"},
  {id:"how-we-use", title:"2. How We Use Your Information"},
  {id:"sharing", title:"3. Information Sharing"},
  {id:"retention", title:"4. Data Retention"},
  {id:"your-rights", title:"5. Your Rights"},
  {id:"cookies", title:"6. Cookies & Tracking"},
  {id:"children", title:"7. Children's Privacy"},
  {id:"international", title:"8. International Data Transfers"},
  {id:"security", title:"9. Security Measures"},
  {id:"third-party-links", title:"10. Third-Party Links"},
  {id:"push-notifications", title:"11. Push Notifications"},
  {id:"changes", title:"12. Changes to This Policy"},
  {id:"contact", title:"13. Contact & Data Protection"},
  {id:"california", title:"14. California Residents (CCPA)"},
  {id:"europe", title:"15. European Residents (GDPR)"},
];

export default function PrivacyPage() {
  var navigate = useNavigate();
  var [activeSection, setActiveSection] = useState("information-collected");

  useEffect(function(){
    window.scrollTo(0,0);
    var handler = function(){
      var sections = SECTIONS.map(function(s){ return document.getElementById(s.id); }).filter(Boolean);
      var scrollY = window.scrollY + 120;
      for(var i = sections.length - 1; i >= 0; i--){
        if(sections[i].offsetTop <= scrollY){
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler);
    return function(){ window.removeEventListener("scroll", handler); };
  }, []);

  function scrollTo(id){
    var el = document.getElementById(id);
    if(el){ window.scrollTo({top: el.offsetTop - 88, behavior:"smooth"}); }
  }

  return (
    <div style={{background:C.bg, minHeight:"100vh", color:C.s1}}>
      <SEOHead
        title="Privacy Policy — Alfred Concierge"
        description="Alfred Concierge Privacy Policy. Learn how we collect, use, and protect your personal information in compliance with GDPR, CCPA, and App Store requirements."
        keywords="Alfred Concierge privacy policy, data protection, GDPR, CCPA"
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
          <a href="/terms" style={{...sf(13,400),color:C.s5,textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Terms &amp; Conditions</a>
        </div>
      </nav>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"60px 40px 100px",display:"grid",gridTemplateColumns:"240px 1fr",gap:60,alignItems:"start"}}>

        {/* Sidebar TOC */}
        <aside style={{position:"sticky",top:88}}>
          <div style={{...sf(10,700),color:C.s7,letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>Contents</div>
          <nav style={{display:"flex",flexDirection:"column",gap:2}}>
            {SECTIONS.map(function(s){
              var active = activeSection === s.id;
              return (
                <button key={s.id} onClick={function(){scrollTo(s.id)}} style={{background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:"7px 12px",borderRadius:8,borderLeft:"2px solid "+(active?C.gold:"transparent"),...sf(12,active?600:400),color:active?C.s1:C.s6,transition:"all 0.15s",lineHeight:1.4}}>
                  {s.title}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main>
          <div style={{marginBottom:48}}>
            <div style={{...sf(11,600),color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Legal</div>
            <h1 style={{...sf(42,700),color:C.s1,lineHeight:1.1,margin:0}}>Privacy Policy</h1>
            <p style={{...sf(14,400),color:C.s5,marginTop:12}}>Last updated: April 2026 &nbsp;·&nbsp; Effective: April 1, 2026</p>
          </div>

          {/* Intro */}
          <div style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:14,padding:"24px 28px",marginBottom:48}}>
            <p style={{...sf(14,400),color:C.s3,lineHeight:1.8,margin:0}}>
              Alfred Concierge ("Alfred," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our platform, mobile application, and related services. Please read this policy carefully. By using Alfred, you consent to the practices described herein.
            </p>
          </div>

          <Section id="information-collected" title="1. Information We Collect">
            <p>We collect information you provide directly, information collected automatically, and information from third parties.</p>

            <h3>Information You Provide</h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number, date of birth (for age verification), and profile photo</li>
              <li><strong>Payment Information:</strong> Credit/debit card details, billing address, and billing name. Payment data is processed and stored by Stripe — Alfred does not store full card numbers.</li>
              <li><strong>Booking Information:</strong> Booking preferences, party size, special requests, dietary restrictions, and any personal details shared during booking requests</li>
              <li><strong>Identity Verification:</strong> For Platinum and Centurion members, we may request government-issued ID verification</li>
              <li><strong>Communications:</strong> Messages sent to our concierge team, reviews, ratings, and feedback you submit</li>
              <li><strong>Profile Preferences:</strong> Preferred cities, service categories, cuisine types, and other personalization data you provide</li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, features used, search queries, booking history, and interaction patterns within the app</li>
              <li><strong>Device Information:</strong> Device type, operating system, browser type, unique device identifiers (IDFA/GAID), and app version</li>
              <li><strong>Location Data:</strong> With your permission, precise GPS location to show nearby venues and improve recommendations. You can disable location access in your device settings at any time.</li>
              <li><strong>Log Data:</strong> IP address, access times, referring URLs, crash reports, and diagnostic data</li>
              <li><strong>Analytics Data:</strong> Aggregate usage patterns collected through analytics tools to improve our services</li>
            </ul>

            <h3>Information from Third Parties</h3>
            <ul>
              <li><strong>Social Sign-In:</strong> If you create an account using Apple Sign-In or Google Sign-In, we receive basic profile information permitted by those platforms</li>
              <li><strong>Payment Processors:</strong> Transaction status and fraud signals from Stripe</li>
              <li><strong>Partner Venues:</strong> Booking confirmations and feedback from partner venues about your visit</li>
            </ul>
          </Section>

          <Section id="how-we-use" title="2. How We Use Your Information">
            <p>We use the information we collect for the following purposes:</p>

            <h3>Providing &amp; Improving Services</h3>
            <ul>
              <li>Processing booking requests and communicating with partner venues on your behalf</li>
              <li>Sending booking confirmations, updates, and itinerary information</li>
              <li>Personalizing your experience and recommendations based on preferences and history</li>
              <li>Processing payments and managing your membership subscription</li>
              <li>Responding to customer service inquiries and concierge requests</li>
              <li>Analyzing usage patterns to improve features and performance</li>
            </ul>

            <h3>Communications</h3>
            <ul>
              <li><strong>Service Notifications:</strong> Booking confirmations, reminders, status updates, and important account notices — these are mandatory and cannot be opted out of while you have an account</li>
              <li><strong>Marketing Communications:</strong> With your consent, curated venue recommendations, exclusive events, and Alfred updates. You can opt out at any time.</li>
              <li><strong>Push Notifications:</strong> With your permission, real-time updates about bookings and curated recommendations (see Section 11)</li>
            </ul>

            <h3>Safety, Security &amp; Legal</h3>
            <ul>
              <li>Detecting and preventing fraud, abuse, and violations of our Terms</li>
              <li>Verifying identity and preventing unauthorized account access</li>
              <li>Complying with legal obligations, court orders, and government requests</li>
              <li>Enforcing our Terms &amp; Conditions</li>
            </ul>

            <h3>Legal Bases (GDPR)</h3>
            <p>For users in the European Economic Area, our legal bases for processing include: <strong>performance of a contract</strong> (booking services), <strong>legitimate interests</strong> (fraud prevention, service improvement), <strong>legal obligation</strong> (compliance), and <strong>consent</strong> (marketing communications).</p>
          </Section>

          <Section id="sharing" title="3. Information Sharing">
            <p><strong>Alfred does not sell your personal data.</strong> We share information only as described below:</p>

            <h3>With Partner Venues &amp; Service Providers</h3>
            <p>When you make a booking, we share only the information necessary to fulfill that booking with the relevant venue or operator — typically your name, party size, contact number, and any relevant special requests. Partners are contractually prohibited from using your data for any purpose other than fulfilling your booking.</p>

            <h3>With Payment Processors</h3>
            <p>Payment information is shared with <strong>Stripe</strong> to process transactions. Stripe is PCI-DSS Level 1 compliant. We also share limited billing information with Stripe for fraud prevention. Stripe's Privacy Policy governs their use of your data.</p>

            <h3>With Analytics Providers</h3>
            <p>We use analytics services (such as Mixpanel or similar tools) to understand how users interact with our platform. Analytics data is generally aggregated or pseudonymized. We ensure our analytics providers contractually restrict their use of your data.</p>

            <h3>For Legal Reasons</h3>
            <p>We may disclose your information when required by law, subpoena, court order, or government authority, or when we believe disclosure is necessary to protect the safety of Alfred, our users, or the public, or to enforce our Terms.</p>

            <h3>Business Transfers</h3>
            <p>In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred to the acquiring entity. We will notify you via email and/or prominent notice on the Platform before your information is transferred and becomes subject to a different privacy policy.</p>

            <h3>With Your Consent</h3>
            <p>We may share your information with third parties when you have given explicit consent to do so.</p>
          </Section>

          <Section id="retention" title="4. Data Retention">
            <p>We retain your personal information for as long as necessary to provide our services and comply with legal obligations:</p>
            <ul>
              <li><strong>Active Accounts:</strong> Account and profile data is retained for the duration of your account plus 90 days after closure</li>
              <li><strong>Booking History:</strong> Transaction and booking records are retained for 7 years for financial and legal compliance purposes</li>
              <li><strong>Communications:</strong> Concierge chat logs and support tickets are retained for 2 years</li>
              <li><strong>Analytics Data:</strong> Aggregated, anonymized analytics data may be retained indefinitely; personally identifiable analytics data is deleted after 24 months</li>
              <li><strong>Payment Records:</strong> Payment records are retained as required by applicable financial regulations (typically 7 years)</li>
            </ul>
            <h3>Account Deletion</h3>
            <p>When you delete your Alfred account, we will delete or anonymize your personal profile data, booking preferences, and communications within <strong>30 days</strong>. However, we are required to retain certain financial records, booking transactions, and legally mandated data for up to 7 years. Data that has been shared with partner venues for completed bookings cannot be retrieved from those third parties.</p>
            <p>To request account deletion, contact privacy@alfredconcierge.app or use the "Delete Account" option in app settings.</p>
          </Section>

          <Section id="your-rights" title="5. Your Rights">
            <p>Depending on your location, you have the following rights regarding your personal data:</p>

            <h3>Rights for All Users</h3>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete personal data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
              <li><strong>Portability:</strong> Request your personal data in a structured, machine-readable format</li>
              <li><strong>Opt-Out of Marketing:</strong> Unsubscribe from marketing emails at any time using the unsubscribe link in any email, or in app settings</li>
            </ul>

            <h3>GDPR Rights (EEA &amp; UK Residents)</h3>
            <p>See Section 15 for detailed GDPR rights information.</p>

            <h3>CCPA Rights (California Residents)</h3>
            <p>See Section 14 for detailed CCPA rights information.</p>

            <h3>How to Exercise Your Rights</h3>
            <p>To exercise any of these rights, contact us at <strong>privacy@alfredconcierge.app</strong> with "Privacy Request" in the subject line, or write to our mailing address. We will respond within 30 days (or shorter if required by applicable law). We may require identity verification before processing certain requests.</p>
          </Section>

          <Section id="cookies" title="6. Cookies & Tracking">
            <p>Our website (alfredconcierge.app) uses cookies and similar tracking technologies to enhance your experience:</p>

            <h3>Types of Cookies We Use</h3>
            <ul>
              <li><strong>Strictly Necessary Cookies:</strong> Required for the website to function (authentication, security, session management). Cannot be disabled.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (page views, traffic sources, user journeys). We use anonymized analytics where possible.</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences for future visits.</li>
              <li><strong>Marketing Cookies:</strong> Used only with your consent to serve relevant advertisements and track campaign performance.</li>
            </ul>

            <h3>Managing Cookies</h3>
            <p>You can control cookies through your browser settings. Disabling certain cookies may affect website functionality. You can also opt out of analytics tracking via our cookie consent banner on your first visit to the website.</p>

            <h3>Mobile App Tracking</h3>
            <p>Our iOS app may request permission to track activity across apps and websites (App Tracking Transparency). You can choose to allow or deny this request. Denying tracking does not affect core app functionality but may result in less personalized content.</p>
          </Section>

          <Section id="children" title="7. Children's Privacy">
            <p>Alfred Concierge is not directed at individuals under the age of <strong>18</strong>. We do not knowingly collect personal information from children under 18. If we become aware that a user is under 18, we will promptly delete their account and any associated personal data.</p>
            <p>If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at privacy@alfredconcierge.app. We will take immediate steps to remove that information from our systems.</p>
          </Section>

          <Section id="international" title="8. International Data Transfers">
            <p>Alfred Concierge is operated from the <strong>United States</strong>. If you access our services from outside the United States, your personal information will be transferred to, stored, and processed in the United States, where data protection laws may differ from those in your country.</p>

            <h3>Transfers from the EEA/UK</h3>
            <p>For users in the European Economic Area or United Kingdom, we transfer personal data to the US under appropriate safeguards, including:</p>
            <ul>
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Transfers to service providers (Supabase, Stripe) that participate in recognized data transfer frameworks or have implemented SCCs</li>
            </ul>
            <p>You may request a copy of the applicable safeguards by contacting privacy@alfredconcierge.app.</p>

            <h3>Global Service Delivery</h3>
            <p>Given Alfred's operations across Miami, Paris, Dubai, and London, booking data may be processed in multiple jurisdictions. We ensure appropriate safeguards are in place for all international transfers and that partner venues in each city handle data in compliance with local requirements.</p>
          </Section>

          <Section id="security" title="9. Security Measures">
            <p>Alfred takes the security of your personal data seriously. We implement industry-standard security measures including:</p>
            <ul>
              <li><strong>Encryption in Transit:</strong> All data transmitted between your device and Alfred's servers is encrypted using TLS 1.2 or higher (HTTPS)</li>
              <li><strong>Encryption at Rest:</strong> Sensitive data stored in our database is encrypted at rest using AES-256 encryption</li>
              <li><strong>Database Security:</strong> We use <strong>Supabase</strong> as our database infrastructure, which provides enterprise-grade security, Row Level Security (RLS), and SOC 2 Type II compliance</li>
              <li><strong>Payment Security:</strong> All payment processing is handled by <strong>Stripe</strong>, which is PCI-DSS Level 1 certified — the highest level of payment card industry security</li>
              <li><strong>Access Controls:</strong> Employee access to user data is limited to those with a legitimate need, governed by role-based access controls and audit logs</li>
              <li><strong>Authentication:</strong> Support for two-factor authentication (2FA) for user accounts</li>
              <li><strong>Regular Audits:</strong> We conduct periodic security reviews and vulnerability assessments</li>
            </ul>
            <p>Despite these measures, no security system is impenetrable. In the event of a data breach that affects your personal data, we will notify you and applicable authorities as required by law within 72 hours of becoming aware of the breach (for GDPR-applicable incidents).</p>
          </Section>

          <Section id="third-party-links" title="10. Third-Party Links">
            <p>The Alfred Platform may contain links to third-party websites, apps, or services (including venue websites, social media pages, and partner platforms). This Privacy Policy does not apply to third-party sites or services. We are not responsible for the privacy practices of third parties, and we encourage you to review the privacy policies of any third-party site you visit.</p>
            <p>When Alfred's concierge team shares venue information, reservation confirmations, or booking details with partner venues, those venues' privacy practices govern their handling of your information.</p>
          </Section>

          <Section id="push-notifications" title="11. Push Notifications">
            <p>Alfred's iOS app may send push notifications to keep you informed about:</p>
            <ul>
              <li>Booking confirmations and reminders</li>
              <li>Changes to your reservations</li>
              <li>Messages from your concierge</li>
              <li>Curated event recommendations (with consent)</li>
              <li>Exclusive member offers and early access (with consent)</li>
            </ul>
            <p><strong>Booking-related notifications</strong> are functional and sent regardless of marketing preferences, as they are essential to using the service.</p>
            <p><strong>Opting Out:</strong> You can manage notification preferences in the Alfred app under Settings &gt; Notifications, or through your device's iOS notification settings (Settings &gt; Alfred &gt; Notifications). Disabling all notifications may cause you to miss important booking updates.</p>
          </Section>

          <Section id="changes" title="12. Changes to This Privacy Policy">
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make changes:</p>
            <ul>
              <li>We will update the "Last Updated" date at the top of this page</li>
              <li>For material changes, we will notify you via email (at the address associated with your account) at least 14 days before the changes take effect</li>
              <li>For significant changes affecting your rights, we may require you to re-confirm your consent</li>
            </ul>
            <p>We encourage you to periodically review this page to stay informed about our privacy practices. Your continued use of Alfred after changes take effect constitutes acceptance of the updated policy.</p>
          </Section>

          <Section id="contact" title="13. Contact & Data Protection">
            <p>For privacy-related questions, requests, or concerns, please contact us:</p>
            <div style={{background:C.el,borderRadius:12,padding:"24px 28px",marginTop:16,marginBottom:24}}>
              <p style={{...sf(14,600),color:C.s1,marginBottom:8}}>Alfred Concierge — Privacy Team</p>
              <p style={{...sf(13,400),color:C.s4,lineHeight:2,margin:0}}>
                Privacy Requests: <a href="mailto:privacy@alfredconcierge.app" style={{color:C.gold,textDecoration:"none"}}>privacy@alfredconcierge.app</a><br/>
                General Support: <a href="mailto:support@alfredconcierge.app" style={{color:C.gold,textDecoration:"none"}}>support@alfredconcierge.app</a><br/>
                Website: <a href="https://alfredconcierge.app" style={{color:C.gold,textDecoration:"none"}}>alfredconcierge.app</a>
              </p>
            </div>
            <p>We aim to respond to all privacy requests within <strong>30 days</strong> (or sooner as required by applicable law). For urgent matters related to a data breach or security incident, please mark your communication as urgent and we will prioritize your request.</p>
            <p>If you are located in the EEA and are unsatisfied with our response, you have the right to lodge a complaint with your local data protection authority (see Section 15 for details).</p>
          </Section>

          <Section id="california" title="14. California Residents (CCPA)">
            <div style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:12,padding:"16px 20px",marginBottom:24}}>
              <p style={{...sf(12,600),color:C.gold,margin:0}}>This section applies to California residents under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA).</p>
            </div>

            <h3>Categories of Personal Information Collected</h3>
            <p>In the past 12 months, Alfred has collected the following categories of personal information about California consumers:</p>
            <ul>
              <li><strong>Identifiers:</strong> Name, email, phone number, IP address, device ID</li>
              <li><strong>Personal Records:</strong> Payment information, booking history</li>
              <li><strong>Protected Classifications:</strong> Age (for eligibility verification only)</li>
              <li><strong>Commercial Information:</strong> Products and services requested, purchase history</li>
              <li><strong>Internet Activity:</strong> Usage data, browsing behavior on our platform</li>
              <li><strong>Geolocation Data:</strong> Precise location (with consent)</li>
              <li><strong>Inferences:</strong> Preferences and interests derived from usage data</li>
            </ul>

            <h3>Your CCPA Rights</h3>
            <ul>
              <li><strong>Right to Know:</strong> You have the right to know what personal information we collect, use, disclose, and sell about you</li>
              <li><strong>Right to Delete:</strong> You have the right to request deletion of your personal information, subject to certain exceptions</li>
              <li><strong>Right to Opt-Out of Sale/Sharing:</strong> Alfred does not sell personal information. We do not share personal information for cross-context behavioral advertising without consent.</li>
              <li><strong>Right to Correct:</strong> You have the right to request correction of inaccurate personal information</li>
              <li><strong>Right to Limit Use of Sensitive Personal Information:</strong> You may limit our use of sensitive personal information to only what is necessary to provide the services you request</li>
              <li><strong>Right to Non-Discrimination:</strong> Alfred will not discriminate against you for exercising your CCPA rights</li>
            </ul>

            <h3>How to Submit a CCPA Request</h3>
            <p>To submit a request to know, delete, or correct your personal information, contact us at <strong>privacy@alfredconcierge.app</strong> with "CCPA Request" in the subject line, or use the in-app privacy settings. We will verify your identity before processing your request and respond within 45 days (with a potential 45-day extension if necessary).</p>

            <h3>Authorized Agent</h3>
            <p>You may designate an authorized agent to submit CCPA requests on your behalf. We require written authorization and may verify the agent's authority and your identity before processing such requests.</p>
          </Section>

          <Section id="europe" title="15. European Residents (GDPR)">
            <div style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:12,padding:"16px 20px",marginBottom:24}}>
              <p style={{...sf(12,600),color:C.gold,margin:0}}>This section applies to residents of the European Economic Area (EEA) and United Kingdom under GDPR/UK GDPR.</p>
            </div>

            <h3>Data Controller</h3>
            <p>Alfred Concierge acts as the data controller for personal data processed in connection with our services. Contact our privacy team at privacy@alfredconcierge.app for any data protection inquiries.</p>

            <h3>Your GDPR Rights</h3>
            <ul>
              <li><strong>Right of Access (Art. 15):</strong> Request a copy of all personal data we hold about you, including the purposes of processing and categories of data</li>
              <li><strong>Right to Rectification (Art. 16):</strong> Request correction of inaccurate or incomplete personal data without undue delay</li>
              <li><strong>Right to Erasure / "Right to be Forgotten" (Art. 17):</strong> Request deletion of your personal data when it is no longer necessary for the purposes it was collected, or when you withdraw consent</li>
              <li><strong>Right to Restriction of Processing (Art. 18):</strong> Request that we restrict processing of your personal data in certain circumstances</li>
              <li><strong>Right to Data Portability (Art. 20):</strong> Receive your personal data in a structured, commonly used, machine-readable format and transmit it to another controller</li>
              <li><strong>Right to Object (Art. 21):</strong> Object to processing of your personal data for direct marketing or where processing is based on legitimate interests</li>
              <li><strong>Rights Related to Automated Decision-Making (Art. 22):</strong> Not be subject to decisions based solely on automated processing that produce significant legal effects</li>
              <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, withdraw consent at any time without affecting the lawfulness of prior processing</li>
            </ul>

            <h3>Legal Bases for Processing</h3>
            <ul>
              <li><strong>Contract Performance (Art. 6(1)(b)):</strong> Processing necessary to provide booking and concierge services you request</li>
              <li><strong>Legitimate Interests (Art. 6(1)(f)):</strong> Fraud prevention, security, service improvement, and direct marketing (where you have not opted out)</li>
              <li><strong>Legal Obligation (Art. 6(1)(c)):</strong> Financial record-keeping, tax compliance, and responding to legal requests</li>
              <li><strong>Consent (Art. 6(1)(a)):</strong> Marketing communications, location data collection, and push notifications</li>
            </ul>

            <h3>Right to Lodge a Complaint</h3>
            <p>If you are dissatisfied with how we handle your personal data, you have the right to lodge a complaint with your local supervisory authority. In the EU, you can find your supervisory authority at <strong>edpb.europa.eu</strong>. In the UK, the relevant authority is the Information Commissioner's Office (ICO) at <strong>ico.org.uk</strong>.</p>

            <h3>Response Timeframes</h3>
            <p>We will respond to all GDPR requests within <strong>one month</strong> of receipt. This period may be extended by two additional months for complex or numerous requests, in which case we will notify you within the first month. We may request identity verification before fulfilling your request.</p>
          </Section>

        </main>
      </div>

      {/* Footer */}
      <footer style={{borderTop:"1px solid "+C.bd,padding:"32px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:1100,margin:"0 auto",flexWrap:"wrap",gap:12}}>
        <span style={{...sf(12,400),color:C.s7}}>Alfred Concierge ©2026</span>
        <div style={{display:"flex",gap:24}}>
          <a href="/privacy" style={{...sf(12,500),color:C.s5,textDecoration:"none"}}>Privacy Policy</a>
          <a href="/terms" style={{...sf(12,400),color:C.s7,textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={function(e){e.target.style.color=C.s5}} onMouseLeave={function(e){e.target.style.color=C.s7}}>Terms &amp; Conditions</a>
        </div>
      </footer>
    </div>
  );
}

function Section({id, title, children}){
  return (
    <section id={id} style={{marginBottom:48,scrollMarginTop:96}}>
      <h2 style={{...sf(22,700),color:"#F4F4F5",marginBottom:20,paddingBottom:14,borderBottom:"1px solid #2C2C31",lineHeight:1.2}}>{title}</h2>
      <div style={{color:"#A1A1AA",lineHeight:1.85,fontSize:14}}>
        {children}
      </div>
    </section>
  );
}
