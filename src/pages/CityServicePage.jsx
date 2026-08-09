import { useEffect } from "react";
import { useParams } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { T, type } from "../lib/brand";
import { BrandNav, SectionHeader, GlassCard, PrimaryCTA, GhostCTA, Eyebrow, useMobile } from "../components/brand";
import CITY_GUIDES from "../data/cities";
import CITY_SERVICES, { CITY_SERVICE_ORDER, catalogHref } from "../data/cityServices";
import { appStoreUrl } from "../lib/appStore";

var APP_STORE=appStoreUrl();
var WHATSAPP="https://wa.me/33743713649";
var CITY_ORDER=["miami","paris","ibiza","saint-tropez","mykonos","dubai","london"];

function requestUrl(city,service){
  return WHATSAPP+"?text="+encodeURIComponent("Hi Alfred, I'd like help with a "+service.singular+" request in "+city.name+". Please confirm current availability, pricing and terms.");
}

function schemaFor(city,citySlug,service){
  var path="/city/"+citySlug+"/"+service.slug;
  var canonical="https://alfredconcierge.app"+path;
  var faqs=service.faqs(city.name);
  return [
    {
      "@context":"https://schema.org","@type":"Service",
      "name":service.label+" in "+city.name+" — Alfred Concierge",
      "description":service.introduction(city.name),"url":canonical,
      "serviceType":service.serviceType,
      "areaServed":{"@type":"AdministrativeArea","name":city.name},
      "provider":{"@type":"Organization","name":"Alfred Concierge","url":"https://alfredconcierge.app/"},
      "potentialAction":{"@type":"CommunicateAction","target":requestUrl(city,service),"name":"Request with Alfred"}
    },
    {
      "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app/"},
        {"@type":"ListItem","position":2,"name":city.name,"item":"https://alfredconcierge.app/city/"+citySlug},
        {"@type":"ListItem","position":3,"name":service.label,"item":canonical}
      ]
    },
    {
      "@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(function(faq){return {
        "@type":"Question","name":faq.q,"acceptedAnswer":{"@type":"Answer","text":faq.a}
      };})
    }
  ];
}

function NotFound(){
  return <div style={{minHeight:"100vh",background:T.bg,color:T.text}}>
    <SEOHead title="Service Page Not Found | Alfred Concierge" path="/city/service-not-found" noindex/>
    <BrandNav mobile links={[{label:"Catalog",href:"/catalog"},{label:"Destinations",href:"/#destinations"},{label:"Contact",href:"/contact"}]}/>
    <main style={{minHeight:"75vh",display:"grid",placeItems:"center",padding:"80px 22px",textAlign:"center"}}>
      <div><Eyebrow>Destination service</Eyebrow><h1 style={{...type.heroSerifMobile(),fontSize:48,margin:"18px 0"}}>Page not found</h1><PrimaryCTA href="/catalog">Browse the catalog</PrimaryCTA></div>
    </main>
  </div>;
}

export default function CityServicePage(){
  var params=useParams();
  var citySlug=params.city;
  var serviceSlug=params.service;
  var city=CITY_GUIDES[citySlug];
  var service=CITY_SERVICES[serviceSlug];
  var mobile=useMobile();

  useEffect(function(){window.scrollTo(0,0);},[citySlug,serviceSlug]);
  if(!city||!service)return <NotFound/>;

  var path="/city/"+citySlug+"/"+serviceSlug;
  var catalog=catalogHref(service,city.name);
  var request=requestUrl(city,service);
  var faqs=service.faqs(city.name);
  var title=service.label+" in "+city.name+" — Concierge Requests | Alfred";
  var description="Browse "+service.label.toLowerCase()+" in "+city.name+" and ask Alfred to confirm current availability, pricing and provider terms for your dates.";

  return <div style={{minHeight:"100vh",background:T.bg,color:T.text}}>
    <SEOHead title={title} description={description} keywords={service.label+" in "+city.name+", "+service.singular+" request "+city.name+", concierge "+city.name} path={path} jsonLd={schemaFor(city,citySlug,service)}/>
    <BrandNav mobile={mobile} links={[{label:"Catalog",href:"/catalog"},{label:"Destinations",href:"/#destinations"},{label:"Contact",href:"/contact"}]}/>

    <header style={{position:"relative",overflow:"hidden",background:T.heroGlow,borderBottom:`0.5px solid ${T.border}`}}>
      <div style={{maxWidth:1200,minHeight:mobile?580:690,margin:"0 auto",padding:mobile?"52px 22px 64px":"78px 56px 84px",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:56}}>
        <nav aria-label="Breadcrumb" style={{display:"flex",alignItems:"center",gap:9,flexWrap:"wrap",...type.kicker(),color:T.textDim}}>
          <a href="/" style={{color:T.textDim,textDecoration:"none"}}>Home</a><span>/</span>
          <a href={"/city/"+citySlug} style={{color:T.textMid,textDecoration:"none"}}>{city.name}</a><span>/</span><span style={{color:T.text}}>{service.label}</span>
        </nav>
        <div>
          <Eyebrow>{city.name} / {service.label}</Eyebrow>
          <h1 style={{...(mobile?type.heroSerifMobile():type.heroSerif()),fontSize:mobile?"clamp(48px,14vw,68px)":"clamp(70px,8.5vw,126px)",lineHeight:0.9,letterSpacing:mobile?-2.6:-6,margin:"22px 0 28px",maxWidth:1050}}>{service.label}<br/><span style={{color:T.silverDim}}>in {city.name}</span></h1>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"minmax(240px,0.65fr) minmax(420px,1fr)",gap:mobile?20:70,alignItems:"start"}}>
            <p style={{...type.kickerLg(),color:T.silver,lineHeight:1.8}}>Human concierge coordination<br/>Provider-confirmed terms</p>
            <div><p style={{...type.bodyLg(),color:T.textMid,maxWidth:680,marginBottom:26}}>{service.introduction(city.name)}</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><PrimaryCTA href={catalog}>Browse {service.label.toLowerCase()}</PrimaryCTA><GhostCTA href={request}>Request with Alfred</GhostCTA></div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main>
      <section style={{padding:mobile?"72px 22px":"116px 56px",maxWidth:1200,margin:"0 auto"}}>
        <SectionHeader kicker="A more useful request" title={"Plan "+service.label.toLowerCase()+" in "+city.name} subtitle="These details help Alfred return relevant options while keeping availability, pricing and approval with the actual provider."/>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:12}}>
          {service.planning.map(function(item,index){return <GlassCard key={item.title} style={{padding:mobile?"28px 24px":"34px 30px",height:"100%"}}><span style={{...type.kicker(),color:T.textDim}}>{("0"+(index+1)).slice(-2)}</span><h2 style={{...type.cardSerif(21),margin:"17px 0 11px"}}>{item.title}</h2><p style={{...type.body(),color:T.textMid}}>{item.body}</p></GlassCard>;})}
        </div>
      </section>

      <section style={{background:T.bg2,borderTop:`0.5px solid ${T.border}`,borderBottom:`0.5px solid ${T.border}`}}>
        <div style={{padding:mobile?"72px 22px":"116px 56px",maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?48:90}}>
          <div><SectionHeader kicker="Send to Alfred" title="What to include" subtitle="The more precise the request, the easier it is to check the right provider option."/><ol style={{margin:0,padding:0,listStyle:"none"}}>{service.needs.map(function(item,index){return <li key={item} style={{display:"flex",gap:16,padding:"17px 0",borderBottom:`0.5px solid ${T.border2}`}}><span style={{...type.kicker(),color:T.textDim}}>{index+1}</span><span style={{...type.bodyLg(),color:T.text}}>{item}</span></li>;})}</ol></div>
          <div><SectionHeader kicker="Before commitment" title="What gets confirmed" subtitle="Nothing is presented as booked until the relevant provider accepts it and the terms are clear."/><ol style={{margin:0,padding:0,listStyle:"none"}}>{service.confirms.map(function(item,index){return <li key={item} style={{display:"flex",gap:16,padding:"17px 0",borderBottom:`0.5px solid ${T.border2}`}}><span style={{...type.kicker(),color:T.textDim}}>✓</span><span style={{...type.bodyLg(),color:T.text}}>{item}</span></li>;})}</ol></div>
        </div>
      </section>

      <section style={{padding:mobile?"72px 22px":"116px 56px",maxWidth:1200,margin:"0 auto"}}>
        <SectionHeader kicker={city.name+" planning notes"} title="Local context still matters" subtitle={city.aboutSections[0].body}/>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12}}>{city.aboutSections.slice(1).map(function(note){return <GlassCard key={note.title} style={{padding:mobile?"28px 24px":"36px 34px"}}><h2 style={{...type.cardSerif(22),marginBottom:12}}>{note.title}</h2><p style={{...type.body(),color:T.textMid}}>{note.body}</p></GlassCard>;})}</div>
      </section>

      <section style={{background:T.bg2,borderTop:`0.5px solid ${T.border}`,borderBottom:`0.5px solid ${T.border}`}}>
        <div style={{padding:mobile?"72px 22px":"116px 56px",maxWidth:1200,margin:"0 auto"}}>
          <SectionHeader kicker="More in this destination" title={"Explore Alfred in "+city.name} subtitle="Move between service guides without losing the local planning context."/>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:10}}>{CITY_SERVICE_ORDER.filter(function(slug){return slug!==serviceSlug;}).map(function(slug,index){var item=CITY_SERVICES[slug];return <a key={slug} href={"/city/"+citySlug+"/"+slug} style={{textDecoration:"none",color:"inherit"}}><GlassCard style={{padding:"24px 22px",height:"100%",display:"flex",alignItems:"center",gap:16}}><span style={{...type.kicker(),color:T.textDim}}>{("0"+(index+1)).slice(-2)}</span><h3 style={{...type.cardSerif(18),flex:1}}>{item.label}</h3><span aria-hidden style={{color:T.silverDim}}>→</span></GlassCard></a>;})}</div>
        </div>
      </section>

      <section style={{padding:mobile?"72px 22px":"116px 56px",maxWidth:880,margin:"0 auto"}}>
        <SectionHeader kicker="Frequently asked" title={service.label+" in "+city.name}/>
        {faqs.map(function(faq){return <details key={faq.q} style={{borderBottom:`0.5px solid ${T.border2}`,padding:mobile?"20px 0":"24px 0"}}><summary style={{...type.cardSerif(mobile?17:19),cursor:"pointer",listStyle:"none",display:"flex",justifyContent:"space-between",gap:16}}><span>{faq.q}</span><span aria-hidden style={{...type.kicker(),color:T.silverDim}}>+</span></summary><p style={{...type.bodyLg(),color:T.textMid,marginTop:14,maxWidth:720}}>{faq.a}</p></details>;})}
      </section>

      <section style={{padding:mobile?"0 22px 76px":"0 56px 116px",maxWidth:1200,margin:"0 auto"}}>
        <GlassCard featured style={{padding:mobile?"42px 24px":"64px 54px",textAlign:"center"}}><Eyebrow>Request, then confirm</Eyebrow><h2 style={{...type.sectionSerif(),fontSize:mobile?32:46,margin:"18px auto 14px",maxWidth:760}}>Ask Alfred about {service.label.toLowerCase()} in {city.name}</h2><p style={{...type.bodyLg(),color:T.textMid,maxWidth:650,margin:"0 auto 28px"}}>Send the essential details now. Alfred checks current options and the provider's complete terms before you decide.</p><div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}><PrimaryCTA href={request}>Message Alfred</PrimaryCTA><GhostCTA href={APP_STORE}>Download the app</GhostCTA></div></GlassCard>
      </section>

      <section style={{borderTop:`0.5px solid ${T.border}`,padding:mobile?"54px 22px":"70px 56px"}}><div style={{maxWidth:1200,margin:"0 auto"}}><p style={{...type.kicker(),color:T.textDim,marginBottom:20}}>{service.label} by destination</p><div style={{display:"flex",gap:mobile?18:26,flexWrap:"wrap"}}>{CITY_ORDER.map(function(slug){return <a key={slug} href={"/city/"+slug+"/"+serviceSlug} style={{...type.kickerLg(),color:slug===citySlug?T.text:T.textMid,textDecoration:"none"}}>{CITY_GUIDES[slug].name}</a>;})}</div></div></section>
    </main>
  </div>;
}
