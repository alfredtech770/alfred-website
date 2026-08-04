const {fetchPartnerRates}=require("../server/hotelRatesProvider");

module.exports=async function(req,res){
  res.setHeader("Access-Control-Allow-Origin","https://alfredconcierge.app");
  res.setHeader("Access-Control-Allow-Methods","POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS")return res.status(204).end();
  if(req.method!=="POST")return res.status(405).json({rates:[],error:"method_not_allowed"});
  var body=req.body||{};
  var hotelIds=Array.isArray(body.hotelIds)?body.hotelIds.map(String).slice(0,24):[];
  var checkin=String(body.checkin||"");
  var checkout=String(body.checkout||"");
  var adults=Math.min(8,Math.max(1,Number(body.adults)||2));
  if(!hotelIds.length||hotelIds.some(function(id){return !/^[a-z0-9._:-]+$/i.test(id)}))return res.status(400).json({rates:[],error:"invalid_hotel_ids"});
  if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(checkin)||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(checkout))return res.status(400).json({rates:[],error:"invalid_dates"});
  var nights=Math.round((new Date(checkout+"T12:00:00Z")-new Date(checkin+"T12:00:00Z"))/86400000);
  if(nights<1||nights>30)return res.status(400).json({rates:[],error:"invalid_stay_length"});
  try{
    var result=await fetchPartnerRates({hotelIds:hotelIds,checkin:checkin,checkout:checkout,adults:adults});
    if(!result.configured)return res.status(503).json({rates:[],error:result.error,provider:"little_emperors"});
    var cheapest={};
    result.rates.forEach(function(rate){if(!cheapest[rate.hotelId]||rate.total<cheapest[rate.hotelId].total)cheapest[rate.hotelId]=rate;});
    var rates=Object.values(cheapest).map(function(rate){return {...rate,perNight:Math.round(rate.total/nights)};});
    res.setHeader("Cache-Control","s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({rates:rates,nights:nights,checkin:checkin,checkout:checkout,adults:adults,provider:"little_emperors",error:result.error});
  }catch(error){return res.status(200).json({rates:[],error:"partner_unavailable",provider:"little_emperors"});}
};
