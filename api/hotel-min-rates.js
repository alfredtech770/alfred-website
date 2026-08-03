// Vercel serverless function: the lowest currently bookable public rate for a
// group of hotels. Used by the hotel catalog so one supplier request can price
// the visible cards without exposing LITEAPI_KEY in the browser.

function firstMoney(value){
  return value && Array.isArray(value) && value[0] && Number.isFinite(Number(value[0].amount))
    ? {amount:Number(value[0].amount),currency:value[0].currency || "USD"}
    : null;
}

function publicMoney(rate){
  var retail = rate && rate.retailRate || {};
  var total = firstMoney(retail.total);
  var suggested = firstMoney(retail.suggestedSellingPrice);
  // LiteAPI documents suggestedSellingPrice as the public display price when
  // it is present. Never expose a closed-user or net rate on a public page.
  return suggested || total;
}

function lowestForHotel(hotel, nights){
  var best = null;
  (hotel.roomTypes || []).forEach(function(room){
    (room.rates || []).forEach(function(rate){
      var money = publicMoney(rate);
      if(!money || money.amount <= 0) return;
      if(!best || money.amount < best.total){
        var fees = rate.retailRate && rate.retailRate.taxesAndFees;
        best = {
          hotelId:hotel.hotelId || hotel.id || hotel.hotel_id,
          name:rate.name || room.name || "Lowest available room",
          total:Math.round(money.amount),
          perNight:Math.round(money.amount / nights),
          currency:money.currency,
          taxesIncluded:Array.isArray(fees) && fees.length > 0
            ? fees.every(function(fee){return fee.included === true})
            : null,
          refundable:rate.cancellationPolicies && rate.cancellationPolicies.refundableTag === "RFN"
        };
      }
    });
  });
  return best;
}

module.exports = async function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "https://alfredconcierge.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if(req.method === "OPTIONS") return res.status(204).end();
  if(req.method !== "POST") return res.status(405).json({rates:[],error:"method_not_allowed"});

  var key = process.env.LITEAPI_KEY;
  if(!key) return res.status(503).json({rates:[],error:"rates_not_configured"});

  var body = req.body || {};
  var hotelIds = Array.isArray(body.hotelIds) ? body.hotelIds.slice(0,24) : [];
  var checkin = body.checkin;
  var checkout = body.checkout;
  var adults = Math.min(8, Math.max(1, Number(body.adults) || 2));

  if(!hotelIds.length || hotelIds.some(function(id){return !/^[a-z0-9]+$/i.test(String(id))})){
    return res.status(400).json({rates:[],error:"invalid_hotel_ids"});
  }
  if(!/^\d{4}-\d{2}-\d{2}$/.test(checkin || "") || !/^\d{4}-\d{2}-\d{2}$/.test(checkout || "")){
    return res.status(400).json({rates:[],error:"invalid_dates"});
  }
  var nights = Math.round((new Date(checkout+"T12:00:00Z") - new Date(checkin+"T12:00:00Z")) / 86400000);
  if(nights < 1 || nights > 30) return res.status(400).json({rates:[],error:"invalid_stay_length"});

  try{
    var response = await fetch("https://api.liteapi.travel/v3.0/hotels/rates", {
      method:"POST",
      headers:{"X-API-Key":key,"Content-Type":"application/json",accept:"application/json"},
      body:JSON.stringify({
        hotelIds:hotelIds.map(String),
        occupancies:[{adults:adults}],
        currency:"USD",
        guestNationality:"US",
        checkin:checkin,
        checkout:checkout,
        maxRatesPerHotel:1,
        timeout:8
      })
    });
    if(!response.ok) return res.status(200).json({rates:[],error:"supplier_unavailable"});
    var payload = await response.json();
    var rates = (payload.data || []).map(function(hotel){return lowestForHotel(hotel,nights)}).filter(Boolean);
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({rates:rates,nights:nights,checkin:checkin,checkout:checkout,adults:adults});
  }catch(error){
    return res.status(200).json({rates:[],error:"supplier_unavailable"});
  }
};

module.exports._test = {firstMoney:firstMoney,publicMoney:publicMoney,lowestForHotel:lowestForHotel};
