import { useEffect } from "react";
import { useParams } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { T, type } from "../lib/brand";
import {
  BrandNav, SectionHeader, GlassCard, PrimaryCTA, GhostCTA,
  Eyebrow, useMobile
} from "../components/brand";
import CITY_GUIDES from "../data/cities";
import { appStoreUrl } from "../lib/appStore";

var APP_STORE = appStoreUrl();
var WHATSAPP = "https://wa.me/33743713649";

var DESTINATIONS = [
  {name:"Miami", slug:"miami"},
  {name:"Paris", slug:"paris"},
  {name:"Ibiza", slug:"ibiza"},
  {name:"Saint-Tropez", slug:"saint-tropez"},
  {name:"Mykonos", slug:"mykonos"},
  {name:"Dubai", slug:"dubai"},
  {name:"London", slug:"london"}
];

var CATEGORY_LINKS = [
  {label:"Restaurants", slug:"restaurants", note:"Dining and table requests"},
  {label:"Hotels", slug:"hotels", note:"Stays and room requests"},
  {label:"Cars", slug:"exotic-cars", note:"Driver and vehicle requests"},
  {label:"Nightlife", slug:"nightlife", note:"Tables and access requests"},
  {label:"Yachts", slug:"yachts", note:"Day boats and charters"},
  {label:"Private aviation", slug:"jets", note:"Aircraft and route requests"},
  {label:"Wellness", slug:"wellness", note:"Treatments and appointment requests"}
];

function requestUrl(cityName, detail){
  return WHATSAPP + "?text=" + encodeURIComponent(
    "Hi Alfred, I'd like help with " + detail + " in " + cityName + ". Please confirm current options, pricing and terms."
  );
}

function siteSchema(city, slug){
  var schema = [city.jsonLdData];
  schema.push({
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},
      {"@type":"ListItem","position":2,"name":city.name,"item":"https://alfredconcierge.app/city/"+slug}
    ]
  });
  if(city.faqs && city.faqs.length){
    schema.push({
      "@context":"https://schema.org",
      "@type":"FAQPage",
      "mainEntity":city.faqs.map(function(f){
        return {"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}};
      })
    });
  }
  return schema;
}

function CityNotFound(){
  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text}}>
      <SEOHead title="City Not Found — Alfred Concierge" path="/city/not-found" description="The city page you're looking for doesn't exist." noindex/>
      <BrandNav mobile links={[{label:"Catalog",href:"/catalog"},{label:"Contact",href:"/contact"}]}/>
      <main style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 22px"}}>
        <div style={{textAlign:"center",maxWidth:560}}>
          <Eyebrow>Destination guide</Eyebrow>
          <h1 style={{...type.heroSerifMobile(),fontSize:48,color:T.text,margin:"18px 0 16px"}}>City not found</h1>
          <p style={{...type.bodyLg(),color:T.textMid,marginBottom:28}}>Choose one of Alfred's live destinations or browse the full catalog.</p>
          <PrimaryCTA href="/catalog">Browse the catalog</PrimaryCTA>
        </div>
      </main>
    </div>
  );
}

export default function CityPage(){
  var params = useParams();
  var slug = params.slug;
  var city = CITY_GUIDES[slug];
  var mobile = useMobile();

  useEffect(function(){ window.scrollTo(0,0); }, [slug]);

  if(!city) return <CityNotFound/>;

  var seoTitle = "Concierge Requests in "+city.name+" — Restaurants, Hotels & More | Alfred";
  var seoDesc = "Browse restaurants, hotels, cars and experiences in "+city.name+", then ask Alfred to check current availability, pricing and terms.";
  var cityRequest = requestUrl(city.name, "a restaurant, hotel, car or experience");

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text}}>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        keywords={city.keywords}
        path={"/city/"+slug}
        jsonLd={siteSchema(city, slug)}
      />

      <BrandNav mobile={mobile} links={[
        {label:"Catalog",href:"/catalog"},
        {label:"Destinations",href:"/#destinations"},
        {label:"Contact",href:"/contact"}
      ]}/>

      <header style={{
        position:"relative",overflow:"hidden",borderBottom:`0.5px solid ${T.border}`,
        background:T.heroGlow
      }}>
        <div style={{
          minHeight:mobile?560:700,maxWidth:1280,margin:"0 auto",
          padding:mobile?"84px 22px 64px":"126px 56px 88px",
          display:"flex",flexDirection:"column",justifyContent:"space-between"
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:20}}>
            <Eyebrow>Destination / {city.name}</Eyebrow>
            <span style={{...type.kicker(),color:T.textDim}}>Requests checked by Alfred</span>
          </div>
          <div>
            <h1 style={{
              ...(mobile?type.heroSerifMobile():type.heroSerif()),
              fontSize:mobile?64:"clamp(84px, 12vw, 164px)",
              letterSpacing:mobile?-3:-8,lineHeight:0.82,textTransform:"uppercase",
              color:T.text,margin:"0 0 30px"
            }}>{city.name}</h1>
            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"minmax(240px, 0.7fr) minmax(360px, 1fr)",gap:mobile?18:72,alignItems:"start"}}>
              <p style={{...type.kickerLg(),color:T.silver,letterSpacing:1.7,lineHeight:1.7}}>{city.tagline}</p>
              <div>
                <p style={{...type.bodyLg(),color:T.textMid,maxWidth:650,marginBottom:26}}>{city.heroDescription}</p>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <PrimaryCTA href={APP_STORE}>Download Alfred</PrimaryCTA>
                  <GhostCTA href={cityRequest}>Request in {city.name}</GhostCTA>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section style={{padding:mobile?"72px 22px":"120px 56px",maxWidth:1200,margin:"0 auto"}}>
          <SectionHeader
            kicker={"Concierge in "+city.name}
            title="Start with what you need"
            subtitle="Browse a category, then share your dates, party size, preferences and budget. Alfred checks the provider's current availability and terms."
          />
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3, 1fr)",borderTop:`0.5px solid ${T.border2}`}}>
            {city.services.map(function(service, index){
              return <div key={service.name} style={{
                padding:mobile?"28px 0":"34px 30px",
                borderBottom:`0.5px solid ${T.border2}`,
                borderRight:!mobile && index%3!==2?`0.5px solid ${T.border2}`:"none"
              }}>
                <span style={{...type.kicker(),color:T.textDim}}>{("0"+(index+1)).slice(-2)}</span>
                <h2 style={{...type.cardSerif(20),color:T.text,margin:"18px 0 8px"}}>{service.name}</h2>
                <p style={{...type.body(),color:T.textMid,maxWidth:290}}>{service.desc}</p>
              </div>;
            })}
          </div>
        </section>

        <section style={{background:T.bg2,borderTop:`0.5px solid ${T.border}`,borderBottom:`0.5px solid ${T.border}`}}>
          <div style={{padding:mobile?"72px 22px":"120px 56px",maxWidth:1200,margin:"0 auto"}}>
            <SectionHeader kicker="Browse the catalog" title={"Explore "+city.name} subtitle="Use Alfred's live catalog as a starting point for your request."/>
            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(2, 1fr)",gap:12}}>
              {CATEGORY_LINKS.map(function(category, index){
                return <a key={category.label} href={"/city/"+slug+"/"+category.slug} style={{textDecoration:"none",color:"inherit"}}>
                  <GlassCard style={{padding:mobile?"24px 22px":"28px 30px",display:"flex",alignItems:"center",gap:20}}>
                    <span style={{...type.kicker(),color:T.textDim}}>{("0"+(index+1)).slice(-2)}</span>
                    <div style={{flex:1}}>
                      <h3 style={{...type.cardSerif(19),color:T.text,marginBottom:6}}>{category.label}</h3>
                      <p style={{...type.bodySm(),color:T.textMid}}>{category.note}</p>
                    </div>
                    <span aria-hidden style={{color:T.silverDim}}>→</span>
                  </GlassCard>
                </a>;
              })}
            </div>
          </div>
        </section>

        {city.venues && city.venues.length>0 && <section style={{padding:mobile?"72px 22px":"120px 56px",maxWidth:1200,margin:"0 auto"}}>
          <SectionHeader kicker="Places to consider" title={"Featured in "+city.name} subtitle="These guide entries are starting points, not guarantees of inventory. Alfred confirms current options when you request."/>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(2, 1fr)",gap:12}}>
            {city.venues.map(function(venue){
              return <a key={venue.name} href={venue.link} style={{textDecoration:"none",color:"inherit"}}>
                <GlassCard style={{padding:mobile?"28px 24px":"34px 32px",height:"100%"}}>
                  <Eyebrow>Guide entry</Eyebrow>
                  <h3 style={{...type.cardSerif(22),color:T.text,margin:"16px 0 10px"}}>{venue.name}</h3>
                  <p style={{...type.body(),color:T.textMid,marginBottom:22}}>{venue.desc}</p>
                  <span style={{...type.kickerLg(),color:T.silver}}>Explore →</span>
                </GlassCard>
              </a>;
            })}
          </div>
        </section>}

        {city.aboutSections && city.aboutSections.length>0 && <section style={{background:T.bg2,borderTop:`0.5px solid ${T.border}`,borderBottom:`0.5px solid ${T.border}`}}>
          <div style={{padding:mobile?"72px 22px":"120px 56px",maxWidth:1100,margin:"0 auto"}}>
            <SectionHeader kicker="Destination notes" title={"A practical guide to "+city.name} subtitle="Context to help you plan a more precise request."/>
            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12}}>
              {city.aboutSections.map(function(section, index){
                return <GlassCard key={section.title} style={{padding:mobile?"28px 24px":"36px 34px"}}>
                  <span style={{...type.kicker(),color:T.textDim}}>{("0"+(index+1)).slice(-2)}</span>
                  <h3 style={{...type.cardSerif(21),color:T.text,margin:"16px 0 12px"}}>{section.title}</h3>
                  <p style={{...type.body(),color:T.textMid}}>{section.body}</p>
                </GlassCard>;
              })}
            </div>
          </div>
        </section>}

        <section style={{padding:mobile?"72px 22px":"120px 56px",maxWidth:880,margin:"0 auto"}}>
          <SectionHeader kicker="Frequently asked" title={"Questions about Alfred in "+city.name}/>
          <div>
            {city.faqs.map(function(faq){
              return <details key={faq.q} style={{borderBottom:`0.5px solid ${T.border2}`,padding:mobile?"20px 0":"24px 0"}}>
                <summary style={{...type.cardSerif(mobile?17:19),color:T.text,cursor:"pointer",listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
                  <span>{faq.q}</span><span aria-hidden style={{...type.kicker(),color:T.silverDim}}>+</span>
                </summary>
                <p style={{...type.bodyLg(),color:T.textMid,marginTop:14,maxWidth:700}}>{faq.a}</p>
              </details>;
            })}
          </div>
        </section>

        <section style={{padding:mobile?"0 22px 90px":"0 56px 140px",maxWidth:1200,margin:"0 auto"}}>
          <GlassCard featured style={{padding:mobile?"44px 26px":"70px 56px",textAlign:"center"}}>
            <Eyebrow>Make a request</Eyebrow>
            <h2 style={{...type.sectionSerif(),fontSize:mobile?32:46,color:T.text,margin:"18px auto 14px",maxWidth:760}}>Tell Alfred what you need in {city.name}</h2>
            <p style={{...type.bodyLg(),color:T.textMid,maxWidth:650,margin:"0 auto 28px"}}>Send the dates, location, party size or route and your preferences. Alfred checks current options before you commit.</p>
            <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
              <PrimaryCTA href={APP_STORE}>Download Alfred</PrimaryCTA>
              <GhostCTA href={cityRequest}>Message on WhatsApp</GhostCTA>
            </div>
          </GlassCard>
        </section>
      </main>

      <footer style={{borderTop:`0.5px solid ${T.border}`,padding:mobile?"44px 22px":"52px 56px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",flexDirection:mobile?"column":"row",justifyContent:"space-between",gap:34}}>
          <div>
            <span style={{...type.kicker(),color:T.text,letterSpacing:3.2}}>ALFRED</span>
            <p style={{...type.bodySm(),color:T.textDim,marginTop:12}}>Concierge requests across seven destinations.</p>
          </div>
          <div style={{display:"flex",gap:mobile?20:28,flexWrap:"wrap",maxWidth:720}}>
            {DESTINATIONS.map(function(destination){
              return <a key={destination.slug} href={"/city/"+destination.slug} style={{...type.kicker(),color:destination.slug===slug?T.text:T.textMid,textDecoration:"none"}}>{destination.name}</a>;
            })}
            <a href="/catalog" style={{...type.kicker(),color:T.textMid,textDecoration:"none"}}>Catalog</a>
            <a href="/contact" style={{...type.kicker(),color:T.textMid,textDecoration:"none"}}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
