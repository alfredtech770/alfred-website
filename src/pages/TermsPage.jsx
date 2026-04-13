import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";

var sf = function(size, weight){
  return {fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", fontSize:size, fontWeight:weight||400, WebkitFontSmoothing:"antialiased"};
};
var C = {bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gold:"#FFD60A"};

var SECTIONS = [
  {id:"acceptance", title:"1. Acceptance of Terms"},
  {id:"services", title:"2. Description of Services"},
  {id:"eligibility", title:"3. Eligibility"},
  {id:"account", title:"4. Account Registration & Security"},
  {id:"membership", title:"5. Membership Tiers"},
  {id:"booking", title:"6. Booking & Reservations"},
  {id:"payments", title:"7. Payments"},
  {id:"third-party", title:"8. Third-Party Services"},
  {id:"liability", title:"9. Limitation of Liability"},
  {id:"ip", title:"10. Intellectual Property"},
  {id:"user-content", title:"11. User Content"},
  {id:"conduct", title:"12. Prohibited Conduct"},
  {id:"indemnification", title:"13. Indemnification"},
  {id:"disputes", title:"14. Dispute Resolution"},
  {id:"modifications", title:"15. Modification of Terms"},
  {id:"termination", title:"16. Termination"},
  {id:"general", title:"17. General Provisions"},
  {id:"contact", title:"18. Contact Information"},
];

export default function TermsPage() {
  var navigate = useNavigate();
  var [activeSection, setActiveSection] = useState("acceptance");
  var [tocOpen, setTocOpen] = useState(false);

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
    setTocOpen(false);
  }

  return (
    <div style={{background:C.bg, minHeight:"100vh", color:C.s1}}>
      <SEOHead
        title="Terms & Conditions — Alfred Concierge"
        description="Terms and Conditions for Alfred Concierge luxury concierge services including restaurant reservations, nightlife VIP access, exotic car rentals, yacht charters, and private jet bookings."
        keywords="Alfred Concierge terms, terms of service, terms and conditions"
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
          <a href="/privacy" style={{...sf(13,400),color:C.s5,textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>Privacy Policy</a>
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
            <h1 style={{...sf(42,700),color:C.s1,lineHeight:1.1,marginBottom:16,margin:0}}>Terms &amp; Conditions</h1>
            <p style={{...sf(14,400),color:C.s5,marginTop:12}}>Last updated: April 2026 &nbsp;·&nbsp; Effective: April 1, 2026</p>
          </div>

          {/* Intro */}
          <div style={{background:C.srf,border:"1px solid "+C.bd,borderRadius:14,padding:"24px 28px",marginBottom:48}}>
            <p style={{...sf(14,400),color:C.s3,lineHeight:1.8,margin:0}}>
              Please read these Terms &amp; Conditions carefully before using Alfred Concierge. By accessing or using our platform, you agree to be bound by these terms. If you do not agree with any part of these terms, you may not use our services.
            </p>
          </div>

          <Section id="acceptance" title="1. Acceptance of Terms">
            <p>By accessing or using the Alfred Concierge platform, mobile application, or any related services (collectively, the "Platform"), you agree to be legally bound by these Terms &amp; Conditions ("Terms"), our Privacy Policy, and any additional terms applicable to specific services. These Terms constitute a legally binding agreement between you ("User," "you," or "your") and Alfred Concierge ("Alfred," "we," "us," or "our"), operator of alfredconcierge.app.</p>
            <p>Your continued use of the Platform following the posting of any changes to these Terms constitutes acceptance of those changes. If you access the Platform on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms, in which case "you" shall refer to such entity.</p>
          </Section>

          <Section id="services" title="2. Description of Services">
            <p>Alfred Concierge is a luxury concierge platform that <strong>facilitates bookings and connects users with third-party service providers</strong>. Alfred does not directly provide the underlying experiences. Our services include facilitating access to:</p>
            <ul>
              <li><strong>Restaurant Reservations</strong> — securing tables at top-tier and exclusive restaurants in Miami, Paris, Dubai, London, and other cities</li>
              <li><strong>Nightlife &amp; VIP Access</strong> — arranging VIP entry, table reservations, and bottle service at premier nightlife venues</li>
              <li><strong>Exotic Car Rentals</strong> — connecting users with vetted luxury and exotic car rental operators</li>
              <li><strong>Yacht Charters</strong> — facilitating yacht rentals and charter experiences through licensed operators</li>
              <li><strong>Private Jet Bookings</strong> — arranging private aviation through certified air carriers and charter brokers</li>
              <li><strong>Wellness &amp; Spa Bookings</strong> — securing appointments at exclusive spas, wellness centers, and health facilities</li>
            </ul>
            <p><strong>Alfred acts solely as an intermediary.</strong> We are not the venue, car rental company, yacht operator, air carrier, or service provider. Alfred's role is to use our relationships and expertise to secure access and bookings on your behalf. The actual services are rendered by independent third-party providers who have their own terms, conditions, cancellation policies, and liability limitations.</p>
            <p>Alfred currently operates primarily in <strong>Miami, Paris, Dubai, and London</strong>, with additional cities being added periodically. Service availability may vary by city and membership tier.</p>
          </Section>

          <Section id="eligibility" title="3. Eligibility">
            <p>To use the Alfred Concierge Platform, you must:</p>
            <ul>
              <li>Be at least <strong>18 years of age</strong>. Alfred's services involve access to venues that serve alcohol and other age-restricted experiences. By creating an account, you represent and warrant that you are 18 years of age or older.</li>
              <li><strong>Provide accurate, current, and complete information</strong> during registration and at all times when using the Platform. You agree to promptly update your information to keep it accurate and current.</li>
              <li>Have the legal capacity to enter into a binding contract under applicable law.</li>
              <li>Not be a person barred from receiving services under the laws of the United States or other applicable jurisdiction.</li>
              <li>Not have previously had an Alfred account terminated for violations of these Terms.</li>
            </ul>
            <p>Alfred reserves the right to verify your identity and eligibility at any time and to refuse service to anyone who does not meet these requirements. Providing false information may result in immediate account termination.</p>
          </Section>

          <Section id="account" title="4. Account Registration & Security">
            <p>To access Alfred's services, you must create an account. You agree to:</p>
            <ul>
              <li>Provide a valid email address, phone number, and any other required registration information</li>
              <li>Create a strong, unique password and maintain its confidentiality</li>
              <li>Not share your account credentials with any third party</li>
              <li>Notify Alfred immediately at <strong>support@alfredconcierge.app</strong> if you suspect unauthorized access to your account</li>
              <li>Be fully responsible for all activities that occur under your account</li>
            </ul>
            <p>Alfred will not be liable for any loss or damage arising from your failure to comply with these security obligations. You acknowledge that Alfred may use your phone number or email for account verification, booking confirmations, and service communications.</p>
            <p>You may not create multiple accounts or create an account on behalf of another person without their express consent. Accounts are personal and non-transferable.</p>
          </Section>

          <Section id="membership" title="5. Membership Tiers">
            <p>Alfred Concierge offers four membership tiers with different levels of access and service:</p>

            <div style={{background:C.el,borderRadius:12,padding:"20px 24px",margin:"20px 0"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:20}}>
                {[
                  {name:"Free",price:"$0/mo",color:C.s5},
                  {name:"Gold",price:"$29.99/mo",color:"#FFD700"},
                  {name:"Platinum",price:"$99/mo",color:"#E5E4E2"},
                  {name:"Centurion",price:"$499/mo",color:C.gold},
                ].map(function(t){return(
                  <div key={t.name} style={{textAlign:"center"}}>
                    <div style={{...sf(14,700),color:t.color,marginBottom:6}}>{t.name}</div>
                    <div style={{...sf(13,400),color:C.s5}}>{t.price}</div>
                  </div>
                );})}
              </div>
            </div>

            <p><strong>Free:</strong> Basic access to the Alfred platform with limited booking requests per month. Subject to availability and concierge capacity.</p>
            <p><strong>Gold ($29.99/month):</strong> Enhanced access with priority booking for restaurants and nightlife, faster concierge response times, and access to Gold-tier exclusive events.</p>
            <p><strong>Platinum ($99/month):</strong> Full concierge service including yacht, jet, and exotic car bookings, 24/7 dedicated concierge line, VIP access at partnered venues, and Platinum member events.</p>
            <p><strong>Centurion ($499/month, invite-only):</strong> Alfred's most exclusive membership tier, by invitation only. Unlimited concierge requests, dedicated personal concierge, first access to rare experiences, and bespoke trip planning services.</p>

            <p><strong>Auto-Renewal:</strong> Paid memberships automatically renew at the end of each billing period (monthly) unless cancelled. You authorize Alfred to charge your payment method on file for the applicable subscription fee plus any applicable taxes.</p>
            <p><strong>Cancellation:</strong> You may cancel your paid membership at any time through the Alfred app settings or by contacting support@alfredconcierge.app. Cancellation takes effect at the end of the current billing period. No refunds are issued for partial billing periods, except where required by applicable law.</p>
            <p><strong>Price Changes:</strong> Alfred reserves the right to modify subscription pricing with at least 30 days' advance notice to current subscribers. Continued use after the effective date of any price change constitutes your acceptance of the new pricing.</p>
            <p><strong>Trial Periods:</strong> If offered, free trial periods automatically convert to paid subscriptions unless cancelled before the trial period ends. You will be notified of any trial period terms at the time of sign-up.</p>
          </Section>

          <Section id="booking" title="6. Booking & Reservations">
            <p>Alfred facilitates bookings and reservations on your behalf, but <strong>does not guarantee availability</strong> at any venue, property, or service provider. The following terms apply to all bookings:</p>
            <ul>
              <li><strong>No Guarantee of Availability:</strong> Alfred uses best efforts to secure requested bookings. Venues may be fully booked, hold reservations pending confirmation, or decline requests at their discretion.</li>
              <li><strong>Booking Confirmation:</strong> A booking is not confirmed until you receive written confirmation from Alfred. Do not make travel plans or incur expenses based solely on a booking request.</li>
              <li><strong>Cancellation Policies:</strong> Each venue, operator, or service provider has its own cancellation policy. Alfred will communicate applicable policies at the time of booking. Cancellation fees imposed by third-party providers are the sole responsibility of the user.</li>
              <li><strong>No-Shows:</strong> Failure to appear for a confirmed reservation may result in charges from the venue and may affect your standing as an Alfred member. Repeated no-shows may result in account suspension.</li>
              <li><strong>Accuracy of Information:</strong> You are responsible for providing accurate information for all bookings, including party size, dietary restrictions, arrival times, and special requests. Alfred is not liable for issues arising from inaccurate information you provide.</li>
              <li><strong>Special Requests:</strong> Alfred will communicate your special requests to venues, but cannot guarantee that such requests will be accommodated.</li>
              <li><strong>Venue Rules:</strong> You agree to comply with all rules, dress codes, and policies of any venue you access through Alfred. Alfred is not responsible for denied entry or removal from a venue due to non-compliance.</li>
            </ul>
          </Section>

          <Section id="payments" title="7. Payments">
            <p>All payments on the Alfred Platform are processed through <strong>Stripe</strong>, a third-party payment processor. By using Alfred, you agree to Stripe's Terms of Service and Privacy Policy.</p>
            <ul>
              <li><strong>Service Fees:</strong> Alfred charges service fees for concierge services, which may be incorporated into the total price shown or disclosed separately. Service fees are non-refundable unless otherwise stated.</li>
              <li><strong>Venue Minimums &amp; Covers:</strong> Many nightlife venues and restaurants require minimum spend, cover charges, or table minimums. These are separate from Alfred's service fees and are entirely the user's responsibility. Alfred will disclose known minimums at the time of booking where possible.</li>
              <li><strong>Gratuity:</strong> Tips, gratuities, and service charges at venues are the user's responsibility and are not included in Alfred's fees unless specifically stated.</li>
              <li><strong>Currency:</strong> All prices are displayed in US Dollars (USD) unless otherwise specified. International transactions may be subject to foreign exchange fees from your bank or card issuer.</li>
              <li><strong>Failed Payments:</strong> If a payment fails, Alfred may attempt to reprocess the charge and may suspend your account until payment is received.</li>
              <li><strong>Refunds:</strong> Refund eligibility depends on the specific service and the third-party provider's policy. Alfred's service fees are generally non-refundable. Requests for refunds related to third-party cancellations will be handled on a case-by-case basis.</li>
              <li><strong>Disputes:</strong> For payment disputes, contact support@alfredconcierge.app before initiating a chargeback. Unauthorized chargebacks may result in account suspension.</li>
            </ul>
          </Section>

          <Section id="third-party" title="8. Third-Party Services">
            <p>Alfred connects users with independent third-party service providers including restaurants, nightclubs, car rental companies, yacht operators, private aviation brokers, and wellness providers. <strong>Alfred is not responsible for the quality, safety, legality, or availability of any third-party service.</strong></p>
            <ul>
              <li><strong>Independent Contractors:</strong> All venues, operators, and service providers accessed through Alfred are independent businesses, not employees, agents, or partners of Alfred.</li>
              <li><strong>Third-Party Terms:</strong> Each third-party provider has its own terms and conditions, which apply independently of Alfred's Terms. You are responsible for reviewing and complying with the terms of any third-party provider you engage with through Alfred.</li>
              <li><strong>Third-Party Cancellations:</strong> Alfred is not liable for cancellations, closures, or changes made by third-party providers. In the event of a cancellation by a third-party provider, Alfred will use commercially reasonable efforts to arrange an alternative but cannot guarantee a replacement.</li>
              <li><strong>Safety &amp; Quality:</strong> Alfred performs limited vetting of its partner venues but cannot guarantee the safety, quality, or condition of any third-party service. You engage with third-party providers at your own risk.</li>
              <li><strong>Liability:</strong> Alfred expressly disclaims any liability for personal injury, property damage, financial loss, or any other harm arising from your use of third-party services accessed through the Platform.</li>
            </ul>
          </Section>

          <Section id="liability" title="9. Limitation of Liability">
            <p><strong>ALFRED'S SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.</strong> To the fullest extent permitted by applicable law, Alfred disclaims all warranties, express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.</p>
            <p><strong>Liability Cap:</strong> In no event shall Alfred's total liability to you for any claims arising from or related to these Terms or the Platform exceed the <strong>total fees paid by you to Alfred in the twelve (12) months preceding the claim</strong>.</p>
            <p><strong>No Indirect Damages:</strong> Alfred shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of data, loss of goodwill, business interruption, or cost of substitute services, even if Alfred has been advised of the possibility of such damages.</p>
            <p><strong>Force Majeure:</strong> Alfred shall not be liable for any failure or delay in performance resulting from causes beyond Alfred's reasonable control, including acts of God, natural disasters, pandemics, government actions, wars, civil disturbances, strikes, or failures of third-party services.</p>
            <p>Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability for consequential or incidental damages. In such jurisdictions, Alfred's liability is limited to the maximum extent permitted by law.</p>
          </Section>

          <Section id="ip" title="10. Intellectual Property">
            <p>All content on the Alfred Platform, including but not limited to the Alfred name, logo, design, graphics, text, software, features, functionality, and trademarks, is the exclusive property of Alfred Concierge or its licensors and is protected by copyright, trademark, and other intellectual property laws.</p>
            <ul>
              <li><strong>License to Use:</strong> Alfred grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for personal, non-commercial purposes in accordance with these Terms.</li>
              <li><strong>Restrictions:</strong> You may not copy, modify, distribute, sell, lease, or create derivative works from any Alfred content. You may not reverse engineer or attempt to extract the source code of Alfred's software.</li>
              <li><strong>Trademarks:</strong> "Alfred," "Alfred Concierge," and related logos and marks are trademarks of Alfred Concierge. You may not use these marks without prior written consent.</li>
            </ul>
          </Section>

          <Section id="user-content" title="11. User Content">
            <p>Alfred may allow users to submit reviews, photos, ratings, and other content ("User Content"). By submitting User Content, you:</p>
            <ul>
              <li>Represent that you have all rights necessary to grant the license below</li>
              <li>Grant Alfred a worldwide, royalty-free, perpetual, irrevocable, sublicensable, non-exclusive license to use, reproduce, modify, adapt, publish, translate, distribute, and display your User Content in connection with Alfred's services and marketing</li>
              <li>Agree that your User Content does not violate any third party's rights or any applicable law</li>
            </ul>
            <p>Alfred reserves the right to remove any User Content that violates these Terms or that Alfred, in its sole discretion, finds objectionable. Alfred does not endorse any User Content and expressly disclaims any liability arising from User Content.</p>
          </Section>

          <Section id="conduct" title="12. Prohibited Conduct">
            <p>You agree not to engage in any of the following prohibited activities:</p>
            <ul>
              <li>Providing false, misleading, or fraudulent information to Alfred or third-party providers</li>
              <li>Using the Platform for any illegal purpose or in violation of any applicable law</li>
              <li>Harassing, threatening, or abusing Alfred staff, concierge team members, or venue staff</li>
              <li>Attempting to circumvent or manipulate the booking system or membership pricing</li>
              <li>Creating multiple accounts to abuse trial offers or free-tier limitations</li>
              <li>Reselling or transferring bookings or memberships without authorization</li>
              <li>Scraping, harvesting, or systematically extracting data from the Platform</li>
              <li>Interfering with the security, integrity, or operation of the Platform</li>
              <li>Using the Platform to transmit spam, malware, or other harmful content</li>
              <li>Impersonating any person or entity, including Alfred staff</li>
              <li>Engaging in any conduct that could damage Alfred's reputation or business relationships with partner venues</li>
            </ul>
            <p>Violation of these prohibitions may result in immediate account termination and may expose you to civil or criminal liability.</p>
          </Section>

          <Section id="indemnification" title="13. Indemnification">
            <p>You agree to defend, indemnify, and hold harmless Alfred Concierge and its officers, directors, employees, contractors, agents, licensors, and successors from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising from or related to:</p>
            <ul>
              <li>Your use of the Platform or any services facilitated through the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any applicable law or regulation</li>
              <li>Your User Content</li>
              <li>Any dispute between you and a third-party service provider</li>
              <li>Any misrepresentation you make in connection with your account or bookings</li>
            </ul>
            <p>Alfred reserves the right, at its own expense, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you. You agree to cooperate with Alfred's defense of such claims.</p>
          </Section>

          <Section id="disputes" title="14. Dispute Resolution">
            <p><strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of the <strong>State of Florida, United States</strong>, without regard to conflict of law principles.</p>
            <p><strong>Binding Arbitration:</strong> Any dispute, claim, or controversy arising out of or relating to these Terms or the Platform shall be resolved by <strong>binding arbitration</strong> administered by the American Arbitration Association ("AAA") under its Consumer Arbitration Rules. The arbitration shall take place in Miami-Dade County, Florida, or via video conference at either party's election.</p>
            <p><strong>Class Action Waiver:</strong> You agree to resolve disputes with Alfred on an individual basis only. <strong>You waive any right to bring a class action, collective action, or representative proceeding</strong> against Alfred. The arbitrator may not consolidate more than one person's claims.</p>
            <p><strong>Exceptions:</strong> Notwithstanding the above, either party may seek emergency injunctive relief in a court of competent jurisdiction to prevent irreparable harm pending arbitration. Claims relating to intellectual property infringement may be brought in court.</p>
            <p><strong>Informal Resolution:</strong> Before initiating arbitration, you agree to first contact Alfred at legal@alfredconcierge.app with a written description of your dispute. The parties will attempt to resolve the dispute informally within 30 days.</p>
            <p><strong>Time Limit:</strong> Any claim must be brought within one (1) year after the event giving rise to the claim, or such claim is permanently waived.</p>
          </Section>

          <Section id="modifications" title="15. Modification of Terms">
            <p>Alfred reserves the right to modify these Terms at any time. When we make changes, we will:</p>
            <ul>
              <li>Update the "Last Updated" date at the top of this page</li>
              <li>Notify registered users via email and/or in-app notification for material changes</li>
              <li>For significant changes, provide at least 14 days' advance notice before the changes take effect</li>
            </ul>
            <p>Your continued use of the Platform after the effective date of any modification constitutes your acceptance of the updated Terms. If you do not agree to the modified Terms, you must discontinue using the Platform and may cancel your membership.</p>
          </Section>

          <Section id="termination" title="16. Termination">
            <p><strong>Termination by User:</strong> You may close your Alfred account at any time by contacting support@alfredconcierge.app or through the account settings in the app. Paid memberships will continue until the end of the current billing period.</p>
            <p><strong>Termination by Alfred:</strong> Alfred reserves the right to suspend or permanently terminate your account, with or without notice, for:</p>
            <ul>
              <li>Violation of these Terms or any applicable law</li>
              <li>Fraudulent, abusive, or harmful conduct</li>
              <li>Non-payment of fees</li>
              <li>Conduct that harms Alfred's relationships with partner venues</li>
              <li>Any other reason at Alfred's sole discretion</li>
            </ul>
            <p><strong>Effect of Termination:</strong> Upon termination, your license to use the Platform immediately ceases. Alfred may retain certain data as required by law or legitimate business purposes, as described in the Privacy Policy. Termination does not release you from obligations incurred prior to termination.</p>
          </Section>

          <Section id="general" title="17. General Provisions">
            <p><strong>Severability:</strong> If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision will be modified to the minimum extent necessary to make it enforceable.</p>
            <p><strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy and any other terms incorporated by reference, constitute the entire agreement between you and Alfred regarding your use of the Platform and supersede all prior agreements, representations, or understandings.</p>
            <p><strong>Waiver:</strong> Alfred's failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. Any waiver must be in writing and signed by an authorized representative of Alfred to be effective.</p>
            <p><strong>Assignment:</strong> You may not assign or transfer your rights or obligations under these Terms without Alfred's prior written consent. Alfred may assign its rights and obligations under these Terms without restriction.</p>
            <p><strong>No Third-Party Beneficiaries:</strong> These Terms do not create any third-party beneficiary rights in any individual or entity.</p>
            <p><strong>Headings:</strong> Section headings are for convenience only and shall not affect the interpretation of these Terms.</p>
          </Section>

          <Section id="contact" title="18. Contact Information">
            <p>For questions about these Terms &amp; Conditions, please contact:</p>
            <div style={{background:C.el,borderRadius:12,padding:"24px 28px",marginTop:16}}>
              <p style={{...sf(14,600),color:C.s1,marginBottom:8}}>Alfred Concierge</p>
              <p style={{...sf(13,400),color:C.s4,lineHeight:2,margin:0}}>
                General Inquiries: <a href="mailto:support@alfredconcierge.app" style={{color:C.gold,textDecoration:"none"}}>support@alfredconcierge.app</a><br/>
                Legal Matters: <a href="mailto:legal@alfredconcierge.app" style={{color:C.gold,textDecoration:"none"}}>legal@alfredconcierge.app</a><br/>
                Website: <a href="https://alfredconcierge.app" style={{color:C.gold,textDecoration:"none"}}>alfredconcierge.app</a>
              </p>
            </div>
            <p style={{...sf(13,400),color:C.s5,marginTop:24,lineHeight:1.7}}>
              We will respond to all legal inquiries within 5 business days. For urgent matters related to active bookings, please use the in-app concierge chat for fastest response.
            </p>
          </Section>

        </main>
      </div>

      {/* Footer */}
      <footer style={{borderTop:"1px solid "+C.bd,padding:"32px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:1100,margin:"0 auto",flexWrap:"wrap",gap:12}}>
        <span style={{...sf(12,400),color:C.s7}}>Alfred Concierge ©2026</span>
        <div style={{display:"flex",gap:24}}>
          <a href="/privacy" style={{...sf(12,400),color:C.s7,textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={function(e){e.target.style.color=C.s5}} onMouseLeave={function(e){e.target.style.color=C.s7}}>Privacy Policy</a>
          <a href="/terms" style={{...sf(12,500),color:C.s5,textDecoration:"none"}}>Terms &amp; Conditions</a>
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
