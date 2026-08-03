import { useParams } from "react-router-dom";
import SEOHead from "../components/SEOHead";

export default function JournalReviewPage(){
  var {slug}=useParams();
  var path=slug?"/blog/"+slug:"/blog";
  return <main style={{minHeight:"100vh",background:"#0A0A0B",color:"#F4F4F5",display:"flex",alignItems:"center",justifyContent:"center",padding:"72px 22px",fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif"}}>
    <SEOHead title="Alfred Journal | Content Review" description="Alfred's editorial guides are being reviewed for accuracy and freshness." path={path} noindex/>
    <div style={{maxWidth:680,padding:"42px 34px",borderRadius:24,background:"#18181B",border:"1px solid #2C2C31"}}>
      <a href="/" style={{color:"#A1A1AA",fontSize:12,textDecoration:"none"}}>← Alfred Concierge</a>
      <p style={{margin:"36px 0 12px",fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"#71717A"}}>Editorial review</p>
      <h1 style={{fontSize:"clamp(36px,7vw,58px)",lineHeight:1.05,letterSpacing:-2,margin:"0 0 20px"}}>The Alfred Journal</h1>
      <p style={{fontSize:16,lineHeight:1.7,color:"#A1A1AA",margin:"0 0 30px"}}>Our editorial guides are temporarily unavailable while dates, prices, access claims and venue details are checked. Use the live catalog for request-based options.</p>
      <a href="/catalog" style={{display:"inline-flex",padding:"14px 22px",borderRadius:12,background:"#F4F4F5",color:"#0A0A0B",fontSize:14,fontWeight:650,textDecoration:"none"}}>Browse the catalog</a>
    </div>
  </main>;
}
