// Vercel serverless function: live hotel rates via LiteAPI.
// The API key lives ONLY in the LITEAPI_KEY env var (server-side). If it's
// not configured, we return 503 and the page explains that pricing is on request.
function firstMoney(value) {
  return value && Array.isArray(value) && value[0] && Number.isFinite(Number(value[0].amount))
    ? { amount: Number(value[0].amount), currency: value[0].currency || "USD" }
    : null;
}

function publicMoney(rate) {
  const retail = (rate && rate.retailRate) || {};
  return firstMoney(retail.suggestedSellingPrice) || firstMoney(retail.total);
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { hotelId, checkin, checkout, adults } = req.query || {};
  const KEY = process.env.LITEAPI_KEY;
  if (!KEY) return res.status(503).json({ offers: [] });
  if (!hotelId || !checkin || !checkout) return res.status(400).json({ offers: [] });
  // Basic input hygiene — ids and dates only.
  if (!/^[a-z0-9]+$/i.test(hotelId) || !/^\d{4}-\d{2}-\d{2}$/.test(checkin) || !/^\d{4}-\d{2}-\d{2}$/.test(checkout)) {
    return res.status(400).json({ offers: [] });
  }
  try {
    const r = await fetch("https://api.liteapi.travel/v3.0/hotels/rates", {
      method: "POST",
      headers: { "X-API-Key": KEY, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        hotelIds: [hotelId],
        occupancies: [{ adults: Math.min(8, Number(adults) || 2) }],
        currency: "USD",
        guestNationality: "US",
        checkin,
        checkout,
      }),
    });
    const j = await r.json();
    const h = (j.data || [])[0];
    if (!h || !Array.isArray(h.roomTypes)) return res.status(200).json({ offers: [] });

    // Cheapest public offer per distinct room name. A room type can contain
    // several rates, so inspect every rate rather than assuming the first is
    // the cheapest. Respect suggestedSellingPrice when LiteAPI supplies it.
    const best = {};
    for (const rt of h.roomTypes) {
      for (const rate of (rt.rates || [])) {
        const total = publicMoney(rate);
        if (!total || total.amount <= 0) continue;
        const name = rate.name || rt.name || "Room";
        const fees = rate.retailRate && rate.retailRate.taxesAndFees;
        if (!best[name] || total.amount < best[name].total) {
          best[name] = {
            name,
            total: Math.round(total.amount),
            currency: total.currency,
            taxesIncluded: Array.isArray(fees) && fees.length > 0
              ? fees.every((fee) => fee.included === true)
              : null,
            refundable: !!(rate.cancellationPolicies && rate.cancellationPolicies.refundableTag === "RFN")
          };
        }
      }
    }
    const nights = Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / 86400000));
    const offers = Object.values(best)
      .sort((a, b) => a.total - b.total)
      .slice(0, 4)
      .map((o) => ({ ...o, perNight: Math.round(o.total / nights) }));
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ offers, nights, checkin, checkout, adults: Math.min(8, Number(adults) || 2) });
  } catch (e) {
    return res.status(200).json({ offers: [] });
  }
};
