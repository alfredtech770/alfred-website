import { useState, useEffect, useRef } from "react";
import DarkDatePicker from "../components/DarkDatePicker";
import SEOHead from "../components/SEOHead";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};

function Mark(p){return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><path d="M42 18 C42 30 34 38 22 38 C34 38 42 46 42 58 C42 46 50 38 62 38 C50 38 42 30 42 18Z" fill={p.color||C.s1}/><path d="M58 42 C58 54 50 62 38 62 C50 62 58 70 58 82 C58 70 66 62 78 62 C66 62 58 54 58 42Z" fill={p.color||C.s1}/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

var V={
  name:"LIV",tagline:"Miami Beach's legendary main room",
  type:"Nightclub",address:"4441 Collins Ave, Miami Beach, FL 33140",
  music:"Hip Hop · EDM · Open Format",door:"Table Required",
  rating:4.8,reviewCount:94,capacity:"1,200",
  imgs:["https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=900&q=85","https://images.unsplash.com/photo-1571266028243-d220c6a8b0e7?w=900&q=80","https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&q=80","https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&q=80"],
  hours:"Thursday – Sunday · 11 PM – 5 AM",dressCode:"Upscale · No athletic wear, no hats",
  alfredNote:"LIV is about table placement. Ask for the DJ booth table or second-floor balcony for the best vantage point. Skip the main floor tables — you're paying for real estate, so get the view. And tip your waitress early, generously.",
  alfredTip:"Thursday is industry night — lighter crowd, easier entry. Saturday is the main event.",
  tables:[
    {name:"Main Floor",min:"$2,000",capacity:"Up to 8",location:"Ground level, near dance floor",popular:true},
    {name:"VIP Balcony",min:"$5,000",capacity:"Up to 10",location:"Elevated, full venue view",popular:false},
    {name:"DJ Booth Table",min:"$8,000",capacity:"Up to 8",location:"Next to the DJ, center stage",popular:true},
    {name:"Owner's Table",min:"$15,000",capacity:"Up to 15",location:"Private section, dedicated staff",popular:false},
  ],
  atmosphere:[{label:"Energy",value:95},{label:"Exclusivity",value:85},{label:"Volume",value:90},{label:"Scene",value:95}],
  djs:["DJ Khaled (Resident)","David Guetta","Steve Aoki","Tiësto","Marshmello","Diplo"],
  rules:["Photo ID required","21+ only","No athletic wear, hats, or sandals","Table minimums vary by night & event","Bottle service is not optional at tables","Management reserves all rights"],
  bestFor:["Birthday","Celebration","Bachelor/ette","Networking","Date Night"],
  reviews:[
    {name:"Michael T.",tier:"Black",rating:5,text:"Alfred got us the DJ booth table on a Saturday. The energy was insane. Best night of the trip.",date:"1 week ago"},
    {name:"Alessandra V.",tier:"Noir",rating:5,text:"They handled everything — table, bottles, even a birthday cake. We just showed up. Perfection.",date:"2 weeks ago"},
    {name:"Tyler K.",tier:"Member",rating:4,text:"Great venue, loud as expected. The balcony table was worth the upgrade. Skip main floor.",date:"1 month ago"},
  ],
};

export default function NightlifeDetailPage(){
  var [idx,setIdx]=useState(0);
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);
  var [date,setDate]=useState("2026-03-21");
  var [arrival,setArrival]=useState("11:30 PM");
  var [guests,setGuests]=useState("6");
  var [selTable,setSelTable]=useState(0);
  var [bookMode,setBookMode]=useState("table");

  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var tablesRef=useRef(null);var tablesVis=useVis(tablesRef);
  var atmoRef=useRef(null);var atmoVis=useVis(atmoRef);
  var djRef=useRef(null);var djVis=useVis(djRef);
  var rulesRef=useRef(null);var rulesVis=useVis(rulesRef);
  var revRef=useRef(null);var revVis=useVis(revRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);
  useEffect(function(){var t=setInterval(function(){setIdx(function(c){return(c+1)%V.imgs.length})},4500);return function(){clearInterval(t)}},[]);

  var navOp=Math.min(scrollY/250,1);var heroY=scrollY*0.25;var heroScale=1+scrollY*0.0003;
  var secDiv=<div style={{height:1,background:"linear-gradient(90deg,transparent,"+C.bd+" 20%,"+C.bd+" 80%,transparent)"}}/>;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <SEOHead
        title={V.name+" Miami — Book VIP Table | Alfred Concierge"}
        description={"Reserve a VIP table at "+V.name+" Miami. "+V.music+". Bottle service, guestlist & guaranteed entry through Alfred Concierge."}
        path={"/catalog/nightlife/"+V.slug}
        jsonLd={[
          {
            "@context":"https://schema.org",
            "@type":"NightClub",
            "name":V.name,
            "description":"VIP tables and nightlife booking at "+V.name+". "+V.music+".",
            "image":V.imgs[0],
            "address":{"@type":"PostalAddress","streetAddress":V.address.split(",")[0],"addressLocality":"Miami Beach","addressRegion":"FL","postalCode":"33140","addressCountry":"US"},
            "url":"https://alfredconcierge.app/catalog/nightlife/"+V.slug
          },
          {
            "@context":"https://schema.org",
            "@type":"BreadcrumbList",
            "itemListElement":[
              {"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app"},
              {"@type":"ListItem","position":2,"name":"Catalog","item":"https://alfredconcierge.app/catalog"},
              {"@type":"ListItem","position":3,"name":"Nightlife","item":"https://alfredconcierge.app/catalog/nightlife"},
              {"@type":"ListItem","position":4,"name":V.name,"item":"https://alfredconcierge.app/catalog/nightlife/"+V.slug}
            ]
          }
        ]}
      />
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
.page-wrap{max-width:1060px;margin:0 auto;padding:0 40px}
.two-col{display:flex;gap:40px;align-items:flex-start}
.left-col{flex:1;min-width:0}
.right-col{width:320px;flex-shrink:0;position:sticky;top:80px}
.table-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.rev-row{display:flex;gap:14px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.rev-row::-webkit-scrollbar{display:none}
.dj-row{display:flex;gap:8px;flex-wrap:wrap}
@media(max-width:900px){
  .two-col{flex-direction:column!important}
  .right-col{width:100%!important;position:relative!important;top:auto!important}
}
@media(max-width:768px){
  .page-wrap{padding:0 24px!important}
  .nl-hero{height:380px!important}
  .nl-name{font-size:30px!important}
  .table-grid{grid-template-columns:1fr!important}
}
@media(max-width:390px){.nl-hero{height:320px!important}.nl-name{font-size:26px!important}}
      `}</style>

      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.1,mixBlendMode:"overlay",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",backgroundSize:"180px",animation:"grain 4s steps(5) infinite"}}/>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navOp>0.05?"rgba(10,10,11,"+Math.min(navOp*0.95,0.95)+")":"transparent",backdropFilter:navOp>0.05?"blur(24px) saturate(1.3)":"none",borderBottom:"1px solid rgba(44,44,49,"+navOp*0.8+")"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10}}><Mark size={20} color={C.s1}/><span style={{...sf(11,400),color:C.s4,letterSpacing:6,textTransform:"uppercase"}}>Alfred</span></a>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <a href="/catalog/nightlife" style={{...sf(11),color:C.s5,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s5}}>← All Venues</a>
          <div style={{...sf(12,500),color:C.s1,opacity:Math.min(navOp*2,1),transition:"opacity 0.3s"}}>{V.name}</div>
        </div>
      </nav>

      {/* Hero */}
      <section className="nl-hero" style={{height:520,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,transform:"translateY("+heroY+"px) scale("+heroScale+")"}}>
          {V.imgs.map(function(img,i){return <img key={i} src={img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"120%",objectFit:"cover",opacity:i===idx?1:0,transition:"opacity 0.8s ease"}}/>})}
        </div>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0.4) 0%,transparent 30%,rgba(10,10,11,0.5) 60%,#0A0A0B 100%)"}}/>
        <div style={{position:"absolute",top:56,left:40,display:"flex",gap:6,zIndex:10}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:"#FB923C",padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{V.door}</span>
          <span style={{...sf(9,500),color:C.s5,padding:"4px 8px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)"}}>{V.type}</span>
        </div>
        <div style={{position:"absolute",bottom:48,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:10}}>
          {V.imgs.map(function(_,i){return <div key={i} onClick={function(){setIdx(i)}} style={{width:i===idx?20:5,height:4,borderRadius:2,background:"rgba(255,255,255,"+(i===idx?"0.85":"0.2")+")",transition:"all 0.3s",cursor:"pointer"}}/>})}
        </div>
      </section>

      {/* Two-column: Title + Note | Booking */}
      <div className="page-wrap" style={{marginTop:-40,position:"relative",zIndex:10,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)"}}>
        <div className="two-col">
          <div className="left-col">
            {/* Title */}
            <div style={{marginBottom:40}}>
              <div style={{display:"flex",gap:6,marginBottom:14}}>
                <span style={{...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F",border:"0.5px solid "+C.gn+"1A"}}>✦ ALFRED VERIFIED</span>
              </div>
              <h1 className="nl-name" style={{...sf(38,700),letterSpacing:-1.5,marginBottom:8}}>{V.name}</h1>
              <p style={{...sf(16,300),color:C.s5,marginBottom:16}}>{V.tagline}</p>
              <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span style={{...sf(14,600),color:C.s1}}>{V.rating}</span>
                  <span style={{...sf(12),color:C.s6}}>({V.reviewCount})</span>
                </div>
                <div style={{width:1,height:14,background:C.bd}}/>
                <span style={{...sf(13),color:C.s4}}>{V.music}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginTop:12}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{...sf(12),color:C.s5}}>{V.address}</span>
              </div>
            </div>

            {/* Alfred's Note */}
            <div ref={noteRef} style={{paddingTop:32,marginBottom:40}}>
              {secDiv}
              <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:noteVis?1:0,transition:"all 0.8s ease"}}>Alfred's Note</p>
              <div style={{borderRadius:24,border:"1px solid "+C.bd,background:C.el,padding:"36px 32px",position:"relative",overflow:"hidden",opacity:noteVis?1:0,transform:noteVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
                <div style={{position:"absolute",bottom:20,right:24,opacity:0.025}}><Mark size={100} color={C.s1}/></div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}><Mark size={18} color={C.s5}/><span style={{...sf(11,500),color:C.s5,letterSpacing:1}}>From your concierge</span><div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px rgba(52,199,89,0.4)"}}/></div>
                <p style={{...sf(15,400),color:C.s3,lineHeight:1.8,fontStyle:"italic",marginBottom:22,position:"relative",zIndex:1}}>"{V.alfredNote}"</p>
                <div style={{height:0.5,background:C.bd,marginBottom:18}}/>
                <div style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{...sf(13),color:C.s6,marginTop:1}}>✨</span><span style={{...sf(13),color:C.s5,lineHeight:1.6}}>{V.alfredTip}</span></div>
              </div>
            </div>
          </div>

          {/* RIGHT — Sticky Booking */}
          <div className="right-col">
            <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden"}}>
              <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
              <div style={{padding:"24px 22px"}}>
                {/* Mode tabs */}
                <div style={{display:"flex",gap:0,marginBottom:20,borderRadius:12,background:C.srf,border:"1px solid "+C.bd,overflow:"hidden"}}>
                  {[{id:"access",label:"Priority Access"},{id:"table",label:"Table & Bottles"}].map(function(m){
                    var active=bookMode===m.id;
                    return <div key={m.id} onClick={function(){setBookMode(m.id)}} style={{flex:1,textAlign:"center",padding:"12px 0",cursor:"pointer",background:active?"rgba(244,244,245,0.08)":"transparent",...sf(12,active?600:400),color:active?C.s1:C.s5,transition:"all 0.25s",position:"relative"}}>
                      {m.label}
                      {active&&<div style={{position:"absolute",bottom:0,left:"20%",right:"20%",height:2,borderRadius:1,background:C.s1}}/>}
                    </div>
                  })}
                </div>

                {bookMode==="access"?(
                  <div>
                    {/* Priority Access mode */}
                    <div style={{...sf(16,700),color:C.s1,marginBottom:4}}>Priority Access</div>
                    <div style={{...sf(12),color:C.s5,marginBottom:20}}>Skip the line · VIP entry · No table required</div>
                    {/* Date */}
                    <div style={{marginBottom:14}}>
                      <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Date</div>
                      <DarkDatePicker value={date} onChange={function(v){setDate(v)}} label="Date"/>
                    </div>
                    {/* Arrival */}
                    <div style={{marginBottom:14}}>
                      <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Arrival</div>
                      <div style={{display:"flex",gap:4}}>
                        {["11 PM","11:30","12 AM","12:30","1 AM"].map(function(t){var active=arrival===t;return <div key={t} onClick={function(){setArrival(t)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(10,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{t}</div>})}
                      </div>
                    </div>
                    {/* Names on list */}
                    <div style={{marginBottom:18}}>
                      <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Guests on list</div>
                      <div style={{display:"flex",gap:4}}>
                        {["1","2","3","4","5+"].map(function(g){var active=guests===g;return <div key={g} onClick={function(){setGuests(g)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(13,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{g}</div>})}
                      </div>
                    </div>
                    {/* What you get */}
                    <div style={{padding:"14px 16px",borderRadius:14,background:"rgba(244,244,245,0.03)",border:"1px solid "+C.bd,marginBottom:18}}>
                      {["Skip the general line","VIP entrance","No minimum spend","Subject to capacity"].map(function(item,i){return(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:i>0?"8px 0 0":"0"}}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={i<3?C.gn:C.s6} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                          <span style={{...sf(12,i<3?500:400),color:i<3?C.s3:C.s6}}>{item}</span>
                        </div>
                      )})}
                    </div>
                    {/* Book */}
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                      Request Priority Access
                    </div>
                    <div style={{textAlign:"center",marginTop:10,...sf(11),color:C.s6}}>Free · Confirmation within 2 hours</div>
                  </div>
                ):(
                  <div>
                    {/* Table mode */}
                    <div style={{...sf(16,700),color:C.s1,marginBottom:4}}>Book a Table</div>
                    <div style={{...sf(12),color:C.s5,marginBottom:20}}>Min. {V.tables[selTable].min} · {V.tables[selTable].capacity}</div>
                    {/* Table selector */}
                    <div style={{marginBottom:14}}>
                      <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Table</div>
                      <div style={{display:"flex",flexDirection:"column",gap:4}}>
                        {V.tables.map(function(t,i){var active=selTable===i;return <div key={i} onClick={function(){setSelTable(i)}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderRadius:12,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.15)":C.bd),cursor:"pointer",transition:"all 0.2s"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:8,height:8,borderRadius:"50%",border:active?"2px solid "+C.s1:"2px solid "+C.s7,background:active?C.s1:"transparent",transition:"all 0.2s"}}/>
                            <span style={{...sf(12,active?600:400),color:active?C.s1:C.s5}}>{t.name}</span>
                          </div>
                          <span style={{...sf(12,600),color:active?C.s1:C.s6}}>{t.min}</span>
                        </div>})}
                      </div>
                    </div>
                    {/* Date */}
                    <div style={{marginBottom:14}}>
                      <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Date</div>
                      <DarkDatePicker value={date} onChange={function(v){setDate(v)}} label="Date"/>
                    </div>
                    {/* Arrival */}
                    <div style={{marginBottom:14}}>
                      <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Arrival</div>
                      <div style={{display:"flex",gap:4}}>
                        {["11 PM","11:30","12 AM","12:30","1 AM"].map(function(t){var active=arrival===t;return <div key={t} onClick={function(){setArrival(t)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(10,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{t}</div>})}
                      </div>
                    </div>
                    {/* Party size */}
                    <div style={{marginBottom:18}}>
                      <div style={{...sf(9,600),letterSpacing:1.5,color:C.s7,textTransform:"uppercase",marginBottom:6}}>Party Size</div>
                      <div style={{display:"flex",gap:4}}>
                        {["2","4","6","8","10+"].map(function(g){var active=guests===g;return <div key={g} onClick={function(){setGuests(g)}} style={{flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:active?"rgba(244,244,245,0.06)":"transparent",border:"1px solid "+(active?"rgba(244,244,245,0.12)":C.bd),cursor:"pointer",...sf(13,active?600:400),color:active?C.s1:C.s6,transition:"all 0.2s"}}>{g}</div>})}
                      </div>
                    </div>
                    {/* Book */}
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"15px 0",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(244,244,245,0.12)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                      Book a Table
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:14}}>
                      {["Bottle service","VIP entry","Dedicated server"].map(function(t,i){return <span key={i} style={{...sf(10),color:C.s6}}>{t}</span>})}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Availability */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderRadius:14,background:C.gn+"08",border:"0.5px solid "+C.gn+"1A",marginTop:12}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px "+C.gn+"66",flexShrink:0}}/>
              <div>
                <div style={{...sf(12,600),color:C.s1}}>Tables available Saturday</div>
                <div style={{...sf(11),color:C.gn+"CC",marginTop:1}}>3 tables remaining · Book now</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px 0",borderRadius:14,border:"1px solid "+C.bd,marginTop:10,cursor:"pointer",...sf(12,500),color:C.s4,transition:"all 0.3s"}} onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm interested in booking a table at "+V.name+". Could you arrange VIP access?"),"_blank")}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              Ask about this venue
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FULL-WIDTH SECTIONS ═══ */}

      {/* DJ Lineup */}
      <div ref={djRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:djVis?1:0,transition:"all 0.8s ease"}}>DJ Lineup</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,opacity:djVis?1:0,transform:djVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.djs.map(function(dj,i){var isResident=dj.indexOf("Resident")!==-1;var djName=isResident?dj.replace(" (Resident)",""):dj;return(
            <div key={i} style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"22px 22px",display:"flex",alignItems:"center",gap:14,transition:"all 0.4s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.transform="translateY(-3px)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.transform="translateY(0)"}}>
              <div style={{width:44,height:44,borderRadius:14,background:isResident?"linear-gradient(135deg,#FB923C20,#F472B620)":"rgba(244,244,245,0.04)",border:"1px solid "+(isResident?"rgba(251,146,60,0.2)":"rgba(244,244,245,0.06)"),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:18}}>{isResident?"🎧":"🎵"}</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{...sf(15,600),color:C.s1,marginBottom:2}}>{djName}</div>
                <div style={{...sf(11,500),color:isResident?"#FB923C":C.s5}}>{isResident?"Resident DJ":"Guest DJ"}</div>
              </div>
              {isResident&&<div style={{width:6,height:6,borderRadius:"50%",background:"#FB923C",boxShadow:"0 0 8px rgba(251,146,60,0.4)",flexShrink:0}}/>}
            </div>
          )})}
        </div>
      </div>

      {/* Table Options */}
      <div ref={tablesRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:tablesVis?1:0,transition:"all 0.8s ease"}}>Table Options</p>
        <div className="table-grid" style={{opacity:tablesVis?1:0,transform:tablesVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.tables.map(function(t,i){var active=selTable===i;return(
            <div key={i} onClick={function(){setSelTable(i)}} style={{padding:"24px 24px",borderRadius:20,background:C.el,border:active?"1.5px solid rgba(244,244,245,0.2)":"1px solid "+C.bd,cursor:"pointer",transition:"all 0.3s",transform:active?"translateY(-2px)":"none",boxShadow:active?"0 8px 30px rgba(0,0,0,0.3)":"none"}} onMouseEnter={function(e){if(!active)e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){if(!active)e.currentTarget.style.borderColor=C.bd}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <h3 style={{...sf(18,600),color:C.s1}}>{t.name}</h3>
                <div style={{display:"flex",gap:6}}>
                  {t.popular&&<span style={{...sf(8,600),letterSpacing:0.8,color:"#FB923CCC",padding:"3px 8px",borderRadius:6,background:"#FB923C15",textTransform:"uppercase"}}>Popular</span>}
                  {active&&<span style={{...sf(8,600),letterSpacing:0.8,color:C.gn,padding:"3px 8px",borderRadius:6,background:C.gn+"15",textTransform:"uppercase"}}>Selected</span>}
                </div>
              </div>
              <div style={{...sf(24,700),color:C.s1,marginBottom:8}}>Min. {t.min}</div>
              <div style={{display:"flex",gap:16}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><span style={{...sf(12),color:C.s5}}>{t.capacity}</span></div>
                <div style={{display:"flex",alignItems:"center",gap:5}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg><span style={{...sf(12),color:C.s5}}>{t.location}</span></div>
              </div>
            </div>
          )})}
        </div>
      </div>

      {/* The Vibe */}
      <div ref={atmoRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:atmoVis?1:0,transition:"all 0.8s ease"}}>The Vibe</p>
        <div style={{borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"28px 30px",display:"flex",flexDirection:"column",gap:22,opacity:atmoVis?1:0,transform:atmoVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.atmosphere.map(function(m,i){return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:14}}>
              <span style={{...sf(13,400),color:C.s1,width:90,flexShrink:0}}>{m.label}</span>
              <div style={{flex:1,height:3,borderRadius:2,background:"rgba(244,244,245,0.04)",overflow:"hidden"}}>
                <div style={{height:"100%",width:atmoVis?m.value+"%":"0%",borderRadius:2,background:m.value>80?"linear-gradient(90deg,#FB923C,#F472B6)":m.value>60?"linear-gradient(90deg,"+C.s4+","+C.s3+")":C.s6,transition:"width 1.2s cubic-bezier(0.16,1,0.3,1) "+(0.3+i*0.12)+"s"}}/>
              </div>
              <span style={{...sf(12,500),color:C.s5,width:28,textAlign:"right",flexShrink:0}}>{m.value}</span>
            </div>
          )})}
        </div>
        {/* Best For tags */}
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:20,opacity:atmoVis?1:0,transition:"opacity 0.8s ease 0.5s"}}>
          {V.bestFor.map(function(tag,i){return <span key={i} style={{...sf(12),color:C.s4,padding:"0 16px",height:34,lineHeight:"34px",borderRadius:17,background:C.srf,border:"0.5px solid "+C.bd}}>{tag}</span>})}
        </div>
      </div>

      {/* Rules & Dress Code */}
      <div ref={rulesRef} className="page-wrap" style={{paddingTop:60,marginBottom:40}}>
        {secDiv}
        <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,marginTop:32,opacity:rulesVis?1:0,transition:"all 0.8s ease"}}>Door Policy & Dress Code</p>
        <div style={{display:"flex",gap:14,opacity:rulesVis?1:0,transform:rulesVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          <div style={{flex:1,borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"22px 24px"}}>
            <div style={{...sf(14,600),color:C.s1,marginBottom:4}}>Hours</div>
            <div style={{...sf(13),color:C.s5}}>{V.hours}</div>
            <div style={{height:0.5,background:C.bd,margin:"14px 0"}}/>
            <div style={{...sf(14,600),color:C.s1,marginBottom:4}}>Dress Code</div>
            <div style={{...sf(13),color:C.s5}}>{V.dressCode}</div>
          </div>
          <div style={{flex:1,borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"18px 20px"}}>
            {V.rules.map(function(rule,i){return(
              <div key={i}>
                {i>0&&<div style={{height:0.5,background:C.bd}}/>}
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 4px"}}>
                  <div style={{width:20,height:20,borderRadius:6,background:C.srf,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.s5} strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M2 12h20"/></svg>
                  </div>
                  <span style={{...sf(12),color:C.s4}}>{rule}</span>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div ref={revRef} className="page-wrap" style={{paddingTop:60,marginBottom:60}}>
        {secDiv}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:32,marginBottom:20}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",opacity:revVis?1:0,transition:"all 0.8s ease"}}>From Members</p>
          <span style={{...sf(12),color:C.s6,opacity:revVis?1:0}}>{V.reviewCount} reviews</span>
        </div>
        <div className="rev-row" style={{opacity:revVis?1:0,transform:revVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
          {V.reviews.map(function(r,i){var isTop=r.tier==="Noir"||r.tier==="Black";return(
            <div key={i} style={{width:300,flexShrink:0,borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"24px 22px",transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:C.srf,border:"0.5px solid "+C.bd,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{...sf(15,300),color:C.s5}}>{r.name.charAt(0)}</span></div>
                <div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{...sf(13,600),color:C.s1}}>{r.name}</span><span style={{...sf(8,600),letterSpacing:0.8,color:isTop?C.s3:C.s5,padding:"2px 8px",borderRadius:6,background:isTop?"rgba(244,244,245,0.06)":C.srf,border:"0.5px solid "+(isTop?"rgba(244,244,245,0.1)":C.bd),textTransform:"uppercase"}}>{r.tier}</span></div>
                <div style={{display:"flex",alignItems:"center",gap:3,marginTop:4}}>{Array.from({length:r.rating}).map(function(_,si){return <svg key={si} width="9" height="9" viewBox="0 0 24 24" fill={C.gold}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>})}<span style={{...sf(10),color:C.s6,marginLeft:4}}>{r.date}</span></div></div>
              </div>
              <p style={{...sf(13),color:C.s4,lineHeight:1.7,fontStyle:"italic"}}>"{r.text}"</p>
            </div>
          )})}
        </div>
      </div>

      {/* CTA */}
      <section ref={ctaRef} style={{padding:"120px 0 100px",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"}}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Reserve</p>
          <h2 style={{...sf(44,600),letterSpacing:-1.5,lineHeight:1.1,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Ready for<br/>{V.name}?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginTop:16,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Alfred handles the door, the table, and the bottles. You just show up.</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 36px",borderRadius:14,background:C.s1,cursor:"pointer",...sf(14,600),color:C.bg,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.4s"}} onClick={function(){window.open("https://wa.me/447449562204?text="+encodeURIComponent("Hi Alfred, I'm interested in booking a table at "+V.name+". Could you arrange VIP access?"),"_blank")}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>Book a Table<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg></div>
        </div>
      </section>

      <footer style={{borderTop:"1px solid "+C.bd,padding:"36px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><Mark size={14} color={C.s7}/><span style={{...sf(10),color:C.s7,letterSpacing:4,textTransform:"uppercase"}}>Alfred ©2026</span></div>
        <div style={{display:"flex",gap:20}}>
          <a href="/" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Home</a>
          <a href="/catalog/nightlife" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Nightlife</a>
          <a href="/catalog" style={{...sf(11),color:C.s6,transition:"color 0.3s"}} onMouseEnter={function(e){e.target.style.color=C.s1}} onMouseLeave={function(e){e.target.style.color=C.s6}}>Catalog</a>
        </div>
      </footer>
    </div>
  );
}
