const {fetchPartnerRates}=require("../server/hotelRatesProvider");

module.exports=async function(req,res){
  res.setHeader("Access-Control-Allow-Origin","https://alfredconcierge.app");
  var query=req.query||{};
  var hotelId=String(query.hotelId||"");
  var checkin=String(query.checkin||"");
  var checkout=String(query.checkout||"");
  var adults=Math.min(8,Math.max(1,Number(query.adults)||2));
  if(!/^[a-z0-9._:-]+$/i.test(hotelId)||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(checkin)||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(checkout)){
    return res.status(400).json({offers:[],error:"invalid_request"});
  }
  var nights=Math.round((new Date(checkout+"T12:00:00Z")-new Date(checkin+"T12:00:00Z"))/86400000);
  if(nights<1||nights>30)return res.status(400).json({offers:[],error:"invalid_stay_length"});
  try{
    var result=await fetchPartnerRates({hotelIds:[hotelId],checkin:checkin,checkout:checkout,adults:adults});
    var offers=result.rates.filter(function(rate){return rate.hotelId===hotelId}).sort(function(a,b){return a.total-b.total}).slice(0,4).map(function(rate){return {...rate,perNight:Math.round(rate.total/nights)};});
    if(!result.configured)return res.status(503).json({offers:[],error:result.error,provider:"little_emperors"});
    res.setHeader("Cache-Control","s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({offers:offers,nights:nights,checkin:checkin,checkout:checkout,adults:adults,provider:"little_emperors",error:result.error});
  }catch(error){return res.status(200).json({offers:[],error:"partner_unavailable",provider:"little_emperors"});}
};
