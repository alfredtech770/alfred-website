import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SEOHead from "../components/SEOHead";
import CatalogSeoBody from "../components/CatalogSeoBody";
import { T, type } from "../lib/brand";
import { BrandNav, Eyebrow, GlassCard, useMobile } from "../components/brand";

var DESTINATIONS = ["Miami","Paris","Ibiza","Saint-Tropez","Mykonos","Dubai","London"];

function isoDate(offset){
  var date = new Date();
  date.setHours(12,0,0,0);
  date.setDate(date.getDate()+offset);
  return date.toISOString().slice(0,10);
}

function cityKey(value){
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
}

function matchesCity(hotel, city){
  if(!city) return true;
  var actual = cityKey(hotel.city);
  var wanted = cityKey(city);
  return actual===wanted || actual.indexOf(wanted+" ")===0 || actual.indexOf(" "+wanted)!==-1;
}

function partnerRateId(hotel){
  return hotel && (hotel.little_emperors_id || hotel.partner_rate_id) || "";
}

function money(amount, currency){
  try{
    return new Intl.NumberFormat("en-US",{style:"currency",currency:currency||"USD",maximumFractionDigits:0}).format(amount);
  }catch(error){
    return "$"+Number(amount||0).toLocaleString("en-US");
  }
}

function shortDate(value){
  var date = new Date(value+"T12:00:00");
  return date.toLocaleDateString("en-US",{month:"short",day:"numeric"});
}

function HotelCard({hotel, rate, ratePending, checkin, checkout, adults}){
  var [hover,setHover] = useState(false);
  var query = "?checkin="+encodeURIComponent(checkin)+"&checkout="+encodeURIComponent(checkout)+"&adults="+adults;
  var href = "/catalog/hotels/"+(hotel.slug||hotel.id)+query;
  return (
    <a
      href={href}
      onClick={function(){try{sessionStorage.setItem("alfred_hotel_"+(hotel.slug||hotel.id),JSON.stringify(hotel))}catch(error){}}}
      onMouseEnter={function(){setHover(true)}}
      onMouseLeave={function(){setHover(false)}}
      style={{display:"flex",flexDirection:"column",textDecoration:"none",borderRadius:18,overflow:"hidden",background:T.surf1,border:`0.5px solid ${hover?T.border2:T.border}`,cursor:"pointer",transition:"transform 260ms ease, border-color 260ms ease",transform:hover?"translateY(-4px)":"none"}}
    >
      <div style={{position:"relative",height:220,overflow:"hidden",background:T.surf2}}>
        <img src={hotel.hero_image_url||""} alt={hotel.name+" in "+(hotel.city||hotel.neighborhood||"Alfred's catalog")} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 500ms ease",transform:hover?"scale(1.04)":"scale(1)"}}/>
        {hotel.status==="coming_soon"&&<div style={{position:"absolute",top:12,left:12,padding:"5px 10px",borderRadius:8,background:"rgba(10,10,11,0.72)",backdropFilter:"blur(10px)",...type.kicker(),color:T.text}}>Coming soon</div>}
        <div style={{position:"absolute",top:12,right:12,padding:"5px 9px",borderRadius:8,background:"rgba(10,10,11,0.72)",backdropFilter:"blur(10px)",...type.caption(),color:T.text}}>{hotel.star_rating||5} star</div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:"linear-gradient(transparent,rgba(0,0,0,0.82))"}}/>
      </div>
      <div style={{padding:"18px 18px 16px",display:"flex",flexDirection:"column",flex:1}}>
        <Eyebrow>{hotel.city||hotel.neighborhood||"Hotel"}</Eyebrow>
        <h2 style={{...type.cardSerif(18),color:T.text,margin:"10px 0 6px"}}>{hotel.name}</h2>
        <p style={{...type.bodySm(),color:T.textDim,marginBottom:16}}>{hotel.neighborhood||hotel.city||"Location confirmed on request"}</p>

        {hotel.amenities&&hotel.amenities.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:18}}>
          {hotel.amenities.slice(0,3).map(function(amenity){return <span key={amenity} style={{...type.caption(),padding:"5px 8px",borderRadius:7,background:T.bg2,border:`0.5px solid ${T.border}`,color:T.textMid}}>{amenity}</span>})}
          {hotel.amenities.length>3&&<span style={{...type.caption(),padding:"5px 3px",color:T.textDim}}>+{hotel.amenities.length-3}</span>}
        </div>}

        <div style={{borderTop:`0.5px solid ${T.border2}`,paddingTop:14,marginTop:"auto",display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:14}}>
          <div>
            {rate ? <>
              <div style={{display:"flex",alignItems:"baseline",gap:5}}>
                <span style={{...type.cardSerif(19),color:T.text}}>From {money(rate.perNight,rate.currency)}</span>
                <span style={{...type.caption(),color:T.textDim}}>/ night</span>
              </div>
              <div style={{...type.caption(),color:T.textDim,marginTop:5}}>{shortDate(checkin)}–{shortDate(checkout)} · {adults} guest{adults!==1?"s":""}</div>
            </> : <>
              <div style={{...type.buttonSm(),color:ratePending?T.textMid:T.text}}>Price on request</div>
              <div style={{...type.caption(),color:T.textDim,marginTop:5}}>{ratePending?"Checking lowest live price…":"Ask Alfred for current availability"}</div>
            </>}
          </div>
          <span aria-hidden style={{color:T.silverDim,flexShrink:0}}>→</span>
        </div>
      </div>
    </a>
  );
}

export default function HotelsPage(){
  var [searchParams,setSearchParams] = useSearchParams();
  var mobile = useMobile();
  var [hotels,setHotels] = useState([]);
  var [loading,setLoading] = useState(true);
  var [search,setSearch] = useState("");
  var [city,setCity] = useState(searchParams.get("city")||"");
  var [hood,setHood] = useState("");
  var [status,setStatus] = useState("");
  var [stars,setStars] = useState("");
  var [sort,setSort] = useState("recommended");
  var [visibleCount,setVisibleCount] = useState(24);
  var [checkin,setCheckin] = useState(searchParams.get("checkin")||isoDate(21));
  var [checkout,setCheckout] = useState(searchParams.get("checkout")||isoDate(22));
  var [adults,setAdults] = useState(Number(searchParams.get("adults"))||2);
  var [ratesByHotel,setRatesByHotel] = useState({});
  var [ratesLoading,setRatesLoading] = useState(false);

  useEffect(function(){
    supabase.from("accommodations").select("*").neq("is_active",false).order("name").then(function(result){
      setHotels(result.data||[]);
      setLoading(false);
    });
  },[]);

  useEffect(function(){
    var params = {};
    if(city) params.city=city;
    params.checkin=checkin;
    params.checkout=checkout;
    params.adults=String(adults);
    setSearchParams(params,{replace:true});
  },[city,checkin,checkout,adults]);

  var hotelsInCity = hotels.filter(function(hotel){return matchesCity(hotel,city)});
  var neighborhoods = city ? [...new Set(hotelsInCity.map(function(hotel){return hotel.neighborhood}).filter(Boolean))].sort() : [];
  var filtered = hotelsInCity.filter(function(hotel){
    if(search){
      var value=search.toLowerCase();
      if(!(hotel.name||"").toLowerCase().includes(value)&&!(hotel.neighborhood||"").toLowerCase().includes(value)&&!(hotel.city||"").toLowerCase().includes(value)) return false;
    }
    if(hood&&hotel.neighborhood!==hood) return false;
    if(status==="open"&&hotel.status!=="open") return false;
    if(status==="coming_soon"&&hotel.status!=="coming_soon") return false;
    if(stars&&Number(hotel.star_rating||0)<Number(stars)) return false;
    return true;
  });

  filtered.sort(function(a,b){
    if(sort==="name") return String(a.name).localeCompare(String(b.name));
    if(sort==="rating") return Number(b.star_rating||0)-Number(a.star_rating||0)||String(a.name).localeCompare(String(b.name));
    var ai=DESTINATIONS.indexOf(a.city),bi=DESTINATIONS.indexOf(b.city);
    var aLive=ai===-1?1:0,bLive=bi===-1?1:0;
    if(aLive!==bLive) return aLive-bLive;
    if(!!a.is_featured!==!!b.is_featured) return a.is_featured?-1:1;
    return Number(b.star_rating||0)-Number(a.star_rating||0)||String(a.name).localeCompare(String(b.name));
  });

  useEffect(function(){setVisibleCount(24)},[search,city,hood,status,stars,sort]);
  var visibleHotels = filtered.slice(0,visibleCount);
  var rateIdsKey = visibleHotels.map(partnerRateId).filter(Boolean).join(",");

  useEffect(function(){
    var hotelIds=rateIdsKey.split(",").filter(Boolean);
    if(!hotelIds.length){setRatesByHotel({});setRatesLoading(false);return}
    var alive=true;
    setRatesLoading(true);
    fetch("/api/hotel-min-rates",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({hotelIds:hotelIds,checkin:checkin,checkout:checkout,adults:adults})
    }).then(function(response){return response.json()}).then(function(payload){
      if(!alive)return;
      var next={};
      (payload.rates||[]).forEach(function(rate){next[rate.hotelId]=rate});
      setRatesByHotel(next);
      setRatesLoading(false);
    }).catch(function(){if(alive){setRatesByHotel({});setRatesLoading(false)}});
    return function(){alive=false};
  },[rateIdsKey,checkin,checkout,adults]);

  function changeCheckin(value){
    setCheckin(value);
    if(!checkout||checkout<=value){
      var next=new Date(value+"T12:00:00");
      next.setDate(next.getDate()+1);
      setCheckout(next.toISOString().slice(0,10));
    }
  }

  var controlStyle={boxSizing:"border-box",width:"100%",minWidth:0,height:48,padding:"0 14px",borderRadius:10,border:`0.5px solid ${T.border2}`,background:T.surf1,...type.body(),color:T.text,outline:"none",colorScheme:"dark"};

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text}}>
      <SEOHead
        title="Hotels in Miami, Paris, Ibiza & More | Alfred Concierge"
        description="Compare hotels in Miami, Paris, Ibiza, Saint-Tropez, Mykonos, Dubai and London. Choose dates and request the lowest current public rate through Alfred Concierge."
        keywords="luxury hotels, Miami hotels, Paris hotels, Ibiza hotels, Saint Tropez hotels, Mykonos hotels, Dubai hotels, London hotels, hotel prices, Alfred concierge"
        path="/catalog/hotels"
        image="/og-hotels.jpg"
        jsonLd={{
          "@context":"https://schema.org","@type":"CollectionPage","name":"Hotels and current rate requests","url":"https://alfredconcierge.app/catalog/hotels",
          "description":"Browse hotel listings, choose an itinerary and request current public rates and availability through Alfred Concierge.",
          "breadcrumb":{"@type":"BreadcrumbList","itemListElement":[
            {"@type":"ListItem","position":1,"name":"Home","item":"https://alfredconcierge.app/"},
            {"@type":"ListItem","position":2,"name":"Hotels","item":"https://alfredconcierge.app/catalog/hotels"}
          ]}
        }}
      />

      <style>{`
        .hotel-itinerary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          align-items: start;
        }
        .hotel-itinerary-field {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 8px;
        }
        .hotel-itinerary-note {
          grid-column: 1 / -1;
          display: flex;
          min-height: 18px;
          align-items: center;
          justify-content: flex-end;
          text-align: right;
        }
        .hotel-filter-grid {
          display: grid;
          grid-template-columns: minmax(230px, 2fr) repeat(5, minmax(120px, 1fr));
          gap: 10px;
          align-items: stretch;
          margin-bottom: 18px;
        }
        @media (max-width: 1100px) {
          .hotel-filter-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 720px) {
          .hotel-itinerary-grid,
          .hotel-filter-grid {
            grid-template-columns: 1fr;
          }
          .hotel-itinerary-note {
            justify-content: flex-start;
            text-align: left;
          }
        }
      `}</style>

      <BrandNav mobile={mobile} links={[{label:"Catalog",href:"/catalog"},{label:"Destinations",href:"/#destinations"},{label:"Contact",href:"/contact"}]}/>

      <main style={{padding:mobile?"72px 20px 90px":"106px 44px 120px",maxWidth:1280,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1.2fr 0.8fr",gap:mobile?22:80,alignItems:"end",marginBottom:42}}>
          <div>
            <Eyebrow>Alfred hotel catalog</Eyebrow>
            <h1 style={{...(mobile?type.heroSerifMobile():type.heroSerif()),fontSize:mobile?42:64,color:T.text,margin:"18px 0 14px"}}>Find a hotel.<br/>Check the live rate.</h1>
          </div>
          <p style={{...type.bodyLg(),color:T.textMid}}>Choose a destination and itinerary. Where supplier coverage is available, Alfred displays the lowest current public rate found for those dates before you request the stay.</p>
        </div>

        <GlassCard style={{padding:mobile?18:22,marginBottom:18}}>
          <div className="hotel-itinerary-grid">
            <label className="hotel-itinerary-field" style={{...type.kicker(),color:T.textDim}}>
              Check-in
              <input type="date" min={isoDate(1)} value={checkin} onChange={function(event){changeCheckin(event.target.value)}} style={controlStyle}/>
            </label>
            <label className="hotel-itinerary-field" style={{...type.kicker(),color:T.textDim}}>
              Check-out
              <input type="date" min={checkin} value={checkout} onChange={function(event){setCheckout(event.target.value)}} style={controlStyle}/>
            </label>
            <label className="hotel-itinerary-field" style={{...type.kicker(),color:T.textDim}}>
              Guests
              <select value={adults} onChange={function(event){setAdults(Number(event.target.value))}} style={controlStyle}>
                {[1,2,3,4,5,6].map(function(number){return <option key={number} value={number}>{number} adult{number!==1?"s":""}</option>})}
              </select>
            </label>
            <div className="hotel-itinerary-note" style={{...type.caption(),color:T.textDim}}>Rates can change until confirmed</div>
          </div>
        </GlassCard>

        <div className="hotel-filter-grid">
          <input aria-label="Search hotels" placeholder="Search hotel or area" value={search} onChange={function(event){setSearch(event.target.value)}} style={controlStyle}/>
          <select aria-label="Filter by city" value={city} onChange={function(event){setCity(event.target.value);setHood("")}} style={controlStyle}>
            <option value="">All destinations</option>
            {DESTINATIONS.map(function(name){return <option key={name} value={name}>{name}</option>})}
          </select>
          <select aria-label="Filter by neighborhood" value={hood} disabled={!city} onChange={function(event){setHood(event.target.value)}} style={{...controlStyle,color:city?T.text:T.textDim}}>
            <option value="">{city?"All neighborhoods":"Choose city first"}</option>
            {neighborhoods.map(function(name){return <option key={name} value={name}>{name}</option>})}
          </select>
          <select aria-label="Filter by star rating" value={stars} onChange={function(event){setStars(event.target.value)}} style={controlStyle}>
            <option value="">Any rating</option><option value="5">5 stars</option><option value="4">4+ stars</option>
          </select>
          <select aria-label="Filter by status" value={status} onChange={function(event){setStatus(event.target.value)}} style={controlStyle}>
            <option value="">Any status</option><option value="open">Open</option><option value="coming_soon">Coming soon</option>
          </select>
          <select aria-label="Sort hotels" value={sort} onChange={function(event){setSort(event.target.value)}} style={controlStyle}>
            <option value="recommended">Recommended</option><option value="rating">Highest rated</option><option value="name">Name A–Z</option>
          </select>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",marginBottom:24,borderTop:`0.5px solid ${T.border}`,paddingTop:16}}>
          <span style={{...type.kickerLg(),color:T.textMid}}>{filtered.length} hotel{filtered.length!==1?"s":""}{city?" in "+city:""}</span>
          <span style={{...type.caption(),color:T.textDim}}>{ratesLoading?"Checking lowest live prices":"Public rates shown where available"}</span>
        </div>

        {loading ? <div style={{padding:"90px 0",textAlign:"center",...type.body(),color:T.textMid}}>Loading hotels…</div> : visibleHotels.length ? <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(auto-fill,minmax(310px,1fr))",gap:18}}>
          {visibleHotels.map(function(hotel){
            var providerId=partnerRateId(hotel);
            return <HotelCard key={hotel.id} hotel={hotel} rate={ratesByHotel[providerId]} ratePending={ratesLoading&&!!providerId} checkin={checkin} checkout={checkout} adults={adults}/>;
          })}
        </div> : <GlassCard style={{padding:"60px 24px",textAlign:"center"}}>
          <h2 style={{...type.sectionSerif(),color:T.text,marginBottom:10}}>No matching hotels</h2>
          <p style={{...type.body(),color:T.textMid}}>Change the city, dates or filters and try again.</p>
        </GlassCard>}

        {!loading&&visibleCount<filtered.length&&<div style={{display:"flex",justifyContent:"center",marginTop:34}}>
          <button type="button" onClick={function(){setVisibleCount(function(count){return count+24})}} style={{...controlStyle,cursor:"pointer",padding:"13px 24px",...type.buttonSm()}}>Show more hotels ({filtered.length-visibleCount} remaining)</button>
        </div>}
      </main>

      <CatalogSeoBody category="hotels"/>
    </div>
  );
}
