// Filtering and sorting for the deal board. Pure functions, no DOM here,
// so the same rules drive the list page and the result count line.

export const CATEGORIES = ["Audio", "Laptops", "TVs", "Gaming", "Smart home", "Kitchen", "Home", "Toys", "Wearables"];

export const VERDICT_LABELS = {
  "all-time-low": "All-time low",
  strong: "Strong deal",
  good: "Good deal",
  routine: "Routine sale",
};

export function discountOf(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function savedOf(deal) {
  return Math.round((deal.was - deal.price) * 100) / 100;
}

// state: { query, category, store, minDiscount, verdict, sort }
export function applyFilters(all, state) {
  const q = (state.query || "").trim().toLowerCase();
  return all.filter((d) => {
    if (q !== "" && `${d.title} ${d.store} ${d.category} ${d.blurb}`.toLowerCase().indexOf(q) === -1) return false;
    if (state.category && state.category !== "All" && d.category !== state.category) return false;
    if (state.store && state.store !== "All" && d.store !== state.store) return false;
    if (state.minDiscount && discountOf(d) < state.minDiscount) return false;
    if (state.verdict && state.verdict !== "All" && d.verdict !== state.verdict) return false;
    return true;
  });
}

export function sortDeals(list, sort) {
  const out = list.slice();
  if (sort === "discount") out.sort((a, b) => discountOf(b) - discountOf(a) || savedOf(b) - savedOf(a));
  else if (sort === "savings") out.sort((a, b) => savedOf(b) - savedOf(a) || discountOf(b) - discountOf(a));
  else if (sort === "price-low") out.sort((a, b) => a.price - b.price);
  else if (sort === "price-high") out.sort((a, b) => b.price - a.price);
  else if (sort === "name") out.sort((a, b) => a.title.localeCompare(b.title));
  return out;
}

export function storeList(all) {
  const seen = [];
  for (const d of all) if (seen.indexOf(d.store) === -1) seen.push(d.store);
  return seen.sort();
}

export function totals(all) {
  let saved = 0;
  let lows = 0;
  for (const d of all) {
    saved += d.was - d.price;
    if (d.verdict === "all-time-low") lows += 1;
  }
  return { count: all.length, saved: Math.round(saved), lows };
}
