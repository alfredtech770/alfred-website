import { useParams } from "react-router-dom";
import SEOHead from "../components/SEOHead";

function titleCase(value){
  return String(value||"").split("-").filter(Boolean).map(function(word){return word.charAt(0).toUpperCase()+word.slice(1)}).join(" ");
}

export default function EventRequestPage(){
  var {slug}=useParams();
  var eventName=slug?titleCase(slug):"Event";
  var path=slug?"/events/"+slug:"/events";
  var message=slug
    ? "Hi Alfred, I'd like to request current options for "+eventName+". Please confirm dates, availability, inclusions and final pricing."
    : "Hi Alfred, I'd like help with an event request. Please confirm current options, availability and final terms.";

  return <main style={{minHeight:"100vh",background:"#0A0A0B",color:"#F4F4F5",display:"flex",alignItems:"center",justifyContent:"center",padding:"72px 22px",fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif"}}>
    <SEOHead title={(slug?eventName+" Request":"Event Requests")+" | Alfred Concierge"} description="Request current event and hospitality options through Alfred. Dates, availability, inclusions and pricing require confirmation." path={path} noindex/>
    <div style={{width:"100%",maxWidth:720,padding:"42px 34px",borderRadius:24,background:"#18181B",border:"1px solid #2C2C31"}}>
      <a href="/" style={{color:"#A1A1AA",fontSize:12,textDecoration:"none"}}>← Alfred Concierge</a>
      <p style={{margin:"36px 0 12px",fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"#71717A"}}>Request-based service</p>
      <h1 style={{fontSize:"clamp(36px,7vw,60px)",lineHeight:1.05,letterSpacing:-2,margin:"0 0 20px"}}>{slug?eventName:"Event Requests"}</h1>
      <p style={{fontSize:16,lineHeight:1.7,color:"#A1A1AA",margin:"0 0 16px"}}>Alfred can check current event, ticket and hospitality options using your date, group size and preferences. This page does not represent live inventory or guaranteed access.</p>
      <p style={{fontSize:14,lineHeight:1.7,color:"#71717A",margin:"0 0 30px"}}>The provider must confirm the event date, ticket source, seat or hospitality details, price, fees and cancellation terms before you approve a request.</p>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        <a href={"https://wa.me/33650938152?text="+encodeURIComponent(message)} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",padding:"14px 22px",borderRadius:12,background:"#F4F4F5",color:"#0A0A0B",fontSize:14,fontWeight:650,textDecoration:"none"}}>Ask Alfred on WhatsApp</a>
        <a href="/catalog" style={{display:"inline-flex",padding:"14px 22px",borderRadius:12,border:"1px solid #3F3F46",color:"#D4D4D8",fontSize:14,fontWeight:600,textDecoration:"none"}}>Browse the catalog</a>
      </div>
    </div>
  </main>;
}
