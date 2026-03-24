import { useState, useEffect, useRef } from "react";

var sf=function(s,w){return{fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",fontSize:s,fontWeight:w||400,WebkitFontSmoothing:"antialiased"}};
var C={bg:"#0A0A0B",el:"#18181B",srf:"#1F1F23",bd:"#2C2C31",s1:"#F4F4F5",s2:"#E4E4E7",s3:"#D4D4D8",s4:"#A1A1AA",s5:"#71717A",s6:"#52525B",s7:"#3F3F46",gn:"#34C759",red:"#FF453A",gold:"#FFD60A"};
var divider={position:"absolute",top:0,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,transparent,"+C.bd+",transparent)"};

function Mark(p){var sw=Math.max(p.size*0.06,1.5);return(<svg width={p.size} height={p.size} viewBox="0 0 100 100" fill="none" style={{display:"block"}}><line x1="20" y1="80" x2="40" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="80" y1="80" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="40" y1="18" x2="60" y2="18" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/><line x1="32" y1="56" x2="68" y2="56" stroke={p.color||C.s1} strokeWidth={sw} strokeLinecap="round"/></svg>)}
function useVis(ref){var[v,setV]=useState(false);useEffect(function(){if(!ref.current)return;var o=new IntersectionObserver(function(e){if(e[0].isIntersecting)setV(true)},{threshold:0.08});o.observe(ref.current);return function(){o.disconnect()}},[]);return v}

var V={
  name:"L'Arc",tagline:"Arc de Triomphe views. Private dining to dancing.",
  type:"Lounge · Restaurant · Club",address:"12 Rue de Presbourg, 75016 Paris",
  music:"Deep House · Lounge · Afrobeats",door:"Guestlist · Walk-in",
  rating:4.7,reviewCount:45,capacity:"500",
  imgs:["https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&q=85","https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80","https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=900&q=80","https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80"],
  hours:{restaurant:"Wed–Sat · 8 PM – 12 AM",lounge:"Wed–Sat · 10 PM – 2 AM",club:"Thu–Sat · 12 AM – 4 AM",closed:"Sun–Tue"},
  dressCode:"Smart chic. No sneakers, no sportswear.",
  alfredNote:"L'Arc is three venues in one — arrive at 9 PM for dinner on the terrace with the Arc de Triomphe lit up, move to the lounge for cocktails, then the basement opens at midnight. It's a full evening. The terrace is the real draw. Request it specifically.",
  alfredTip:"Wednesday is the best-kept secret — same vibe, half the crowd. Saturday is fashion-week energy year-round.",
  facts:[
    {icon:"📍",label:"Location",value:"Place de l'Étoile"},
    {icon:"🎵",label:"Music",value:"Deep House · Lounge"},
    {icon:"👔",label:"Dress code",value:"Smart Chic"},
    {icon:"🕐",label:"Best arrival",value:"9 PM for dinner, 11 PM for lounge"},
  ],
  atmosphere:[{label:"Energy",value:75},{label:"Exclusivity",value:80},{label:"Volume",value:60},{label:"Intimacy",value:70}],
  djs:["Resident DJ collective","Guest sets Friday & Saturday","Live saxophone Thursday"],
  drinks:[
    {name:"L'Arc Signature Martini",desc:"Lychee, elderflower, champagne top",price:"€24",popular:true},
    {name:"Tokyo Mule",desc:"Japanese whisky, yuzu, ginger beer",price:"€22",popular:false},
    {name:"Spicy Margarita",desc:"Reposado, jalapeño, agave, lime",price:"€20",popular:true},
    {name:"Champagne by the Glass",desc:"Ruinart Blanc de Blancs",price:"€28",popular:false},
    {name:"Negroni Sbagliato",desc:"Campari, sweet vermouth, prosecco",price:"€22",popular:false},
  ],
  bestFor:["Date Night","After Dinner","Networking","Fashion Crowd","Birthday"],
  reviews:[
    {name:"Camille D.",tier:"Member",rating:5,text:"The terrace at sunset is unreal. Alfred got us in on a Saturday without a reservation. The martini is top 3 in Paris.",date:"1 week ago"},
    {name:"Antoine M.",tier:"Black",rating:5,text:"Perfect for a date. Dinner upstairs, drinks down. The transition from restaurant to club is seamless.",date:"3 weeks ago"},
    {name:"Sophia L.",tier:"Member",rating:4,text:"Great vibe on Wednesday. Less chaotic than the weekend. The DJ was playing deep house all night — exactly what I wanted.",date:"2 weeks ago"},
  ],
};

export default function BarDetailPage(){
  var [idx,setIdx]=useState(0);
  var [loaded,setLoaded]=useState(false);
  var [scrollY,setScrollY]=useState(0);

  var noteRef=useRef(null);var noteVis=useVis(noteRef);
  var factsRef=useRef(null);var factsVis=useVis(factsRef);
  var drinksRef=useRef(null);var drinksVis=useVis(drinksRef);
  var atmoRef=useRef(null);var atmoVis=useVis(atmoRef);
  var hoursRef=useRef(null);var hoursVis=useVis(hoursRef);
  var revRef=useRef(null);var revVis=useVis(revRef);
  var ctaRef=useRef(null);var ctaVis=useVis(ctaRef);

  useEffect(function(){setTimeout(function(){setLoaded(true)},200)},[]);
  useEffect(function(){var h=function(){setScrollY(window.scrollY)};window.addEventListener("scroll",h,{passive:true});return function(){window.removeEventListener("scroll",h)}},[]);
  useEffect(function(){var t=setInterval(function(){setIdx(function(c){return(c+1)%V.imgs.length})},4500);return function(){clearInterval(t)}},[]);

  var navOp=Math.min(scrollY/250,1);var heroY=scrollY*0.25;var heroScale=1+scrollY*0.0003;

  return(
    <div style={{width:"100%",minHeight:"100vh",background:C.bg,...sf(15),color:C.s1,overflowX:"hidden"}}>
      <style>{`
*{margin:0;padding:0;box-sizing:border-box}::selection{background:${C.s7};color:${C.s1}}a{color:inherit;text-decoration:none}body::-webkit-scrollbar{width:0}
@keyframes grain{0%,100%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,2%)}75%{transform:translate(-1%,3%)}}
.vw{max-width:880px;margin-left:auto;margin-right:auto;padding-left:40px;padding-right:40px}
.drink-row{display:flex;gap:12px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.drink-row::-webkit-scrollbar{display:none}
.rev-row{display:flex;gap:14px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.rev-row::-webkit-scrollbar{display:none}
.facts-g{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}
.dj-row{display:flex;gap:8px;flex-wrap:wrap}
@media(max-width:768px){
  .vw{padding-left:24px!important;padding-right:24px!important}
  .bl-hero{height:380px!important}
  .bl-name{font-size:30px!important}
  .facts-g{grid-template-columns:1fr 1fr!important}
}
@media(max-width:390px){.bl-hero{height:320px!important}.bl-name{font-size:26px!important}.facts-g{grid-template-columns:1fr 1fr!important}}
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
      <section className="bl-hero" style={{height:520,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,transform:"translateY("+heroY+"px) scale("+heroScale+")"}}>
          {V.imgs.map(function(img,i){return <img key={i} src={img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"120%",objectFit:"cover",opacity:i===idx?1:0,transition:"opacity 0.8s ease"}}/>})}
        </div>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,0.4) 0%,transparent 30%,rgba(10,10,11,0.5) 60%,#0A0A0B 100%)"}}/>
        <div style={{position:"absolute",top:56,left:40,display:"flex",gap:6,zIndex:10}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.gn,padding:"4px 10px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)",textTransform:"uppercase"}}>{V.door}</span>
          <span style={{...sf(9,500),color:C.s5,padding:"4px 8px",borderRadius:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)"}}>{V.type.split(" · ")[0]}</span>
        </div>
        <div style={{position:"absolute",bottom:48,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,zIndex:10}}>
          {V.imgs.map(function(_,i){return <div key={i} onClick={function(){setIdx(i)}} style={{width:i===idx?20:5,height:4,borderRadius:2,background:"rgba(255,255,255,"+(i===idx?"0.85":"0.2")+")",transition:"all 0.3s",cursor:"pointer"}}/>})}
        </div>
      </section>

      {/* ═══ TITLE — full width, no booking card ═══ */}
      <div className="vw" style={{marginTop:-40,position:"relative",zIndex:10,marginBottom:20,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)"}}>
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          <span style={{...sf(9,600),letterSpacing:0.8,color:C.gn+"D9",padding:"4px 10px",borderRadius:8,background:C.gn+"0F",border:"0.5px solid "+C.gn+"1A"}}>✦ ALFRED VERIFIED</span>
        </div>
        <h1 className="bl-name" style={{...sf(42,700),letterSpacing:-1.5,marginBottom:8}}>{V.name}</h1>
        <p style={{...sf(17,300),color:C.s5,marginBottom:16}}>{V.tagline}</p>
        <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span style={{...sf(14,600),color:C.s1}}>{V.rating}</span>
            <span style={{...sf(12),color:C.s6}}>({V.reviewCount})</span>
          </div>
          <div style={{width:1,height:14,background:C.bd}}/>
          <span style={{...sf(13),color:C.s4}}>{V.type}</span>
          <div style={{width:1,height:14,background:C.bd}}/>
          <span style={{...sf(13),color:C.s4}}>Cap. {V.capacity}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:7,marginTop:12}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.s6} strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span style={{...sf(12),color:C.s5}}>{V.address}</span>
        </div>
        {/* Quick action — WhatsApp only, no booking */}
        <div style={{display:"flex",gap:10,marginTop:24}}>
          <a href="https://wa.me/33612345678" target="_blank" rel="noopener" style={{display:"flex",alignItems:"center",gap:8,padding:"12px 22px",borderRadius:14,background:C.s1,...sf(13,600),color:C.bg,transition:"transform 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-1px)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)"}}>
            Get on the Guestlist
          </a>
          <a href="https://wa.me/33612345678" target="_blank" rel="noopener" style={{display:"flex",alignItems:"center",gap:8,padding:"12px 22px",borderRadius:14,border:"1px solid "+C.bd,...sf(13,500),color:C.s4,transition:"all 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s5;e.currentTarget.style.color=C.s1}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.color=C.s4}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
            Ask Alfred
          </a>
        </div>
      </div>

      {/* ═══ ALFRED'S NOTE ═══ */}
      <section ref={noteRef} style={{padding:"100px 0 60px",position:"relative"}}><div style={divider}/>
        <div className="vw">
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:noteVis?1:0,transition:"all 0.8s ease"}}>Alfred's Note</p>
          <div style={{borderRadius:24,border:"1px solid "+C.bd,background:C.el,padding:"36px 32px",position:"relative",overflow:"hidden",opacity:noteVis?1:0,transform:noteVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(244,244,245,0.06) 30%,rgba(244,244,245,0.1) 50%,rgba(244,244,245,0.06) 70%,transparent)"}}/>
            <div style={{position:"absolute",bottom:20,right:24,opacity:0.025}}><Mark size={100} color={C.s1}/></div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}><Mark size={18} color={C.s5}/><span style={{...sf(11,500),color:C.s5,letterSpacing:1}}>From your concierge</span><div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.gn,boxShadow:"0 0 8px rgba(52,199,89,0.4)"}}/></div>
            <p style={{...sf(15,400),color:C.s3,lineHeight:1.8,fontStyle:"italic",marginBottom:22,position:"relative",zIndex:1}}>"{V.alfredNote}"</p>
            <div style={{height:0.5,background:C.bd,marginBottom:18}}/>
            <div style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{...sf(13),color:C.s6,marginTop:1}}>✨</span><span style={{...sf(13),color:C.s5,lineHeight:1.6}}>{V.alfredTip}</span></div>
          </div>
        </div>
      </section>

      {/* ═══ AT A GLANCE ═══ */}
      <section ref={factsRef} style={{padding:"100px 0 60px",position:"relative"}}><div style={divider}/>
        <div className="vw">
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:factsVis?1:0,transition:"all 0.8s ease"}}>At a Glance</p>
          <div className="facts-g" style={{opacity:factsVis?1:0,transform:factsVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
            {V.facts.map(function(f,i){return(<div key={i} style={{padding:"22px 22px",borderRadius:20,background:C.el,border:"1px solid "+C.bd,transition:"border-color 0.3s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:16}}>{f.icon}</span><span style={{...sf(12),color:C.s5}}>{f.label}</span></div><span style={{...sf(15,600),color:C.s1}}>{f.value}</span></div>)})}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:16,opacity:factsVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>
            {V.bestFor.map(function(tag,i){return <span key={i} style={{...sf(12),color:C.s4,padding:"0 16px",height:34,lineHeight:"34px",borderRadius:17,background:C.srf,border:"0.5px solid "+C.bd}}>{tag}</span>})}
          </div>
        </div>
      </section>

      {/* ═══ COCKTAILS ═══ */}
      <section ref={drinksRef} style={{padding:"100px 0 60px",position:"relative"}}><div style={divider}/>
        <div className="vw">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",opacity:drinksVis?1:0,transition:"all 0.8s ease"}}>Cocktails & Drinks</p>
            <span style={{...sf(12),color:C.s6,opacity:drinksVis?1:0}}>Full menu at venue</span>
          </div>
          <div className="drink-row" style={{opacity:drinksVis?1:0,transform:drinksVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
            {V.drinks.map(function(d,i){return(
              <div key={i} style={{width:200,flexShrink:0,borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden",display:"flex",flexDirection:"column",transition:"all 0.4s"}} onMouseEnter={function(e){e.currentTarget.style.borderColor=C.s7;e.currentTarget.style.transform="translateY(-4px)"}} onMouseLeave={function(e){e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.transform="translateY(0)"}}>
                <div style={{height:2,background:"linear-gradient(90deg,#A78BFA4D,#A78BFA1A)"}}/>
                <div style={{padding:"20px 18px",flex:1,display:"flex",flexDirection:"column"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <span style={{...sf(9,500),letterSpacing:1.5,color:"#A78BFA8C",textTransform:"uppercase"}}>Cocktail</span>
                    {d.popular&&<span style={{...sf(8,600),letterSpacing:0.8,color:"#FB923CCC",padding:"3px 7px",borderRadius:6,background:"#FB923C15"}}>POPULAR</span>}
                  </div>
                  <div style={{...sf(16,600),color:C.s1,lineHeight:1.3,marginBottom:6,minHeight:42}}>{d.name}</div>
                  <div style={{...sf(12),color:C.s5,lineHeight:1.5}}>{d.desc}</div>
                  <div style={{flex:1}}/>
                  <div style={{...sf(15,600),color:C.s3,marginTop:14}}>{d.price}</div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ═══ THE VIBE ═══ */}
      <section ref={atmoRef} style={{padding:"100px 0 60px",position:"relative"}}><div style={divider}/>
        <div className="vw">
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:atmoVis?1:0,transition:"all 0.8s ease"}}>The Vibe</p>
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
          {/* Music / DJs */}
          <div style={{marginTop:20,opacity:atmoVis?1:0,transition:"opacity 0.8s ease 0.4s"}}>
            <div style={{...sf(10,500),color:C.s7,letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>Music & DJs</div>
            <div className="dj-row">
              {V.djs.map(function(dj,i){return <span key={i} style={{...sf(12,500),color:C.s4,padding:"8px 18px",borderRadius:14,background:C.el,border:"1px solid "+C.bd}}>{dj}</span>})}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOURS & DRESS CODE ═══ */}
      <section ref={hoursRef} style={{padding:"100px 0 60px",position:"relative"}}><div style={divider}/>
        <div className="vw">
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:hoursVis?1:0,transition:"all 0.8s ease"}}>Hours & Dress Code</p>
          <div style={{display:"flex",gap:14,opacity:hoursVis?1:0,transform:hoursVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
            {/* Hours */}
            <div style={{flex:1,borderRadius:20,background:C.el,border:"1px solid "+C.bd,overflow:"hidden"}}>
              {[{l:"Restaurant",v:V.hours.restaurant,c:C.gn},{l:"Lounge",v:V.hours.lounge,c:C.gn},{l:"Club",v:V.hours.club,c:"#A78BFA"},{l:"Closed",v:V.hours.closed,c:C.red}].map(function(r,i){return(<div key={i}><div style={{display:"flex",alignItems:"center",gap:12,padding:"16px 24px"}}><div style={{width:7,height:7,borderRadius:"50%",background:r.c,opacity:0.55,flexShrink:0}}/><span style={{...sf(13,500),color:C.s5,width:80}}>{r.l}</span><span style={{...sf(14),color:C.s1}}>{r.v}</span></div>{i<3&&<div style={{height:0.5,background:C.bd,marginLeft:24}}/>}</div>)})}
            </div>
            {/* Dress code */}
            <div style={{flex:1,borderRadius:20,background:C.el,border:"1px solid "+C.bd,padding:"24px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:16}}>👔</span><span style={{...sf(14,600),color:C.s1}}>Dress Code</span></div>
              <p style={{...sf(14),color:C.s5,lineHeight:1.7,marginBottom:16}}>{V.dressCode}</p>
              <div style={{height:0.5,background:C.bd,marginBottom:16}}/>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:16}}>🚪</span><span style={{...sf(14,600),color:C.s1}}>Door Policy</span></div>
              <p style={{...sf(14),color:C.s5,lineHeight:1.7}}>{V.door}. Management reserves all rights. Photo ID required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section ref={revRef} style={{padding:"100px 0 60px",position:"relative"}}><div style={divider}/>
        <div className="vw">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",opacity:revVis?1:0,transition:"all 0.8s ease"}}>From Members</p>
            <span style={{...sf(12),color:C.s6,opacity:revVis?1:0}}>{V.reviewCount} reviews</span>
          </div>
          <div className="rev-row" style={{opacity:revVis?1:0,transform:revVis?"translateY(0)":"translateY(20px)",transition:"all 0.9s ease 0.15s"}}>
            {V.reviews.map(function(r,i){var isTop=r.tier==="Black"||r.tier==="Noir";return(
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
      </section>

      {/* ═══ CTA — no booking, just Alfred WhatsApp ═══ */}
      <section ref={ctaRef} style={{padding:"140px 0 120px",position:"relative"}}><div style={divider}/>
        <div style={{textAlign:"center",maxWidth:500,margin:"0 auto",padding:"0 40px"}}>
          <p style={{...sf(10,500),color:C.s7,letterSpacing:5,textTransform:"uppercase",marginBottom:20,opacity:ctaVis?1:0,transition:"all 0.8s ease"}}>Get In</p>
          <h2 style={{...sf(44,600),letterSpacing:-1.5,lineHeight:1.1,opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(24px)",transition:"all 0.9s ease 0.15s"}}>Heading to<br/>{V.name}?</h2>
          <p style={{...sf(15,400),color:C.s5,lineHeight:1.7,marginTop:16,marginBottom:36,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.3s"}}>Tell Alfred when you're going and we'll make sure you're on the list. No tables required — just show up and walk in.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",opacity:ctaVis?1:0,transform:ctaVis?"translateY(0)":"translateY(16px)",transition:"all 0.9s ease 0.4s"}}>
            <a href="https://wa.me/33612345678" target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:14,background:C.s1,...sf(14,600),color:C.bg,transition:"transform 0.3s,box-shadow 0.3s",cursor:"pointer"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 40px rgba(244,244,245,0.1)"}} onMouseLeave={function(e){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
              Get on the Guestlist
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12H19M12 5L19 12L12 19"/></svg>
            </a>
          </div>
          <p style={{...sf(12),color:C.s6,marginTop:20,opacity:ctaVis?1:0,transition:"opacity 0.8s ease 0.6s"}}>Free · No minimum spend · Priority entry</p>
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
