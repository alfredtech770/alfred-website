/*
 * Normalised server-side adapter for Alfred's authorised hotel partner.
 *
 * Little Emperors does not publish a public pricing API contract. This adapter
 * therefore calls only an endpoint explicitly issued/approved for Alfred and
 * accepts a deliberately strict response. Nothing is exposed to the browser,
 * and private/member-only rates are rejected from public catalogue pages.
 */

function configuration(){
  return {
    endpoint:process.env.LITTLE_EMPERORS_RATES_ENDPOINT || "",
    token:process.env.LITTLE_EMPERORS_API_KEY || ""
  };
}

function normaliseOffer(value){
  if(!value || value.publicRate !== true || value.bookable !== true) return null;
  var total=Number(value.total);
  if(!Number.isFinite(total) || total<=0) return null;
  var hotelId=String(value.hotelId || "");
  if(!hotelId) return null;
  return {
    hotelId:hotelId,
    name:String(value.name || "Available room").slice(0,160),
    total:Math.round(total),
    currency:/^[A-Z]{3}$/.test(value.currency || "")?value.currency:"USD",
    taxesIncluded:value.taxesIncluded === true,
    refundable:value.refundable === true,
    publicRate:true,
    bookable:true
  };
}

async function fetchPartnerRates(input){
  var config=configuration();
  if(!config.endpoint) return {configured:false,rates:[],error:"partner_integration_pending"};
  var parsed;
  try{parsed=new URL(config.endpoint);}catch(error){return {configured:false,rates:[],error:"invalid_partner_endpoint"};}
  if(parsed.protocol!=="https:") return {configured:false,rates:[],error:"invalid_partner_endpoint"};

  var response=await fetch(config.endpoint,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Accept":"application/json",
      ...(config.token?{"Authorization":"Bearer "+config.token}:{})
    },
    body:JSON.stringify({
      schemaVersion:"1.0",
      hotelIds:input.hotelIds,
      checkin:input.checkin,
      checkout:input.checkout,
      occupancies:[{adults:input.adults}],
      currency:"USD",
      channel:"alfredconcierge.app-public"
    })
  });
  if(!response.ok) return {configured:true,rates:[],error:"partner_unavailable"};
  var payload=await response.json();
  var values=Array.isArray(payload.rates)?payload.rates:[];
  return {configured:true,rates:values.map(normaliseOffer).filter(Boolean)};
}

module.exports={configuration:configuration,normaliseOffer:normaliseOffer,fetchPartnerRates:fetchPartnerRates};
