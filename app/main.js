// DealHound's front end: hash routes, live search and filters, sorting.
// Routes:
//   #/                                  the board, filters in the query part
//   #/?category=Audio&sort=discount     same, with filters applied
//   #/deal/<id>                         one deal's page
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals, CHECKED_AT } from "./deals.js";
import { CATEGORIES, applyFilters, sortDeals, storeList, totals } from "./filters.js";
import { dealCards, dealDetail, missingDeal } from "./views.js";

const app = document.getElementById("app");
const countLine = document.getElementById("count-line");
const searchInput = document.getElementById("search");
const categoryChips = document.getElementById("category-chips");
const storeSelect = document.getElementById("store-filter");
const discountSelect = document.getElementById("discount-filter");
const verdictSelect = document.getElementById("verdict-filter");
const sortSelect = document.getElementById("sort");

const DEFAULT_STATE = { query: "", category: "All", store: "All", minDiscount: 0, verdict: "All", sort: "discount" };

function readState() {
  const state = { ...DEFAULT_STATE };
  const hash = location.hash.replace(/^#\//, "");
  const qIndex = hash.indexOf("?");
  if (qIndex === -1) return state;
  const params = new URLSearchParams(hash.slice(qIndex + 1));
  if (params.get("q")) state.query = params.get("q");
  if (params.get("category")) state.category = params.get("category");
  if (params.get("store")) state.store = params.get("store");
  if (params.get("minDiscount")) state.minDiscount = Number(params.get("minDiscount")) || 0;
  if (params.get("verdict")) state.verdict = params.get("verdict");
  if (params.get("sort")) state.sort = params.get("sort");
  return state;
}

function writeState(state) {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category !== "All") params.set("category", state.category);
  if (state.store !== "All") params.set("store", state.store);
  if (state.minDiscount) params.set("minDiscount", String(state.minDiscount));
  if (state.verdict !== "All") params.set("verdict", state.verdict);
  if (state.sort !== "discount") params.set("sort", state.sort);
  const query = params.toString();
  history.replaceState(null, "", query ? `#/?${query}` : "#/");
}

function renderControls(state) {
  searchInput.value = state.query;
  categoryChips.innerHTML = ["All", ...CATEGORIES]
    .map(
      (c) =>
        `<button type="button" class="chip${state.category === c ? " active" : ""}" data-category="${c}">${c}</button>`,
    )
    .join("");
  storeSelect.value = state.store;
  discountSelect.value = String(state.minDiscount);
  verdictSelect.value = state.verdict;
  sortSelect.value = state.sort;
}

function renderList(state) {
  const filtered = sortDeals(applyFilters(deals, state), state.sort);
  renderControls(state);
  app.innerHTML = dealCards(filtered);
  countLine.textContent = `Showing ${filtered.length} of ${deals.length} deals, sorted by ${sortSelect.options[sortSelect.selectedIndex].text.toLowerCase()}.`;
  document.title = "DealHound - Black Friday deal finder";
}

function render() {
  window.__shotReady = false;
  const hash = location.hash.replace(/^#\//, "");
  const dealMatch = hash.match(/^deal\/([^/?]+)/);
  // A deal page is about one deal: hide the board's stats and filters there
  // so the deal, its facts and its store link fit on one screen.
  document.querySelector(".stats").style.display = dealMatch ? "none" : "";
  document.querySelector(".controls").style.display = dealMatch ? "none" : "";
  if (dealMatch) {
    const found = deals.find((d) => d.id === decodeURIComponent(dealMatch[1]));
    document.title = `${found ? found.title : "Deal not found"} | DealHound`;
    app.innerHTML = found ? dealDetail(found) : missingDeal();
    countLine.textContent = "";
  } else {
    renderList(readState());
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function bindControls() {
  for (const s of storeList(deals)) {
    const option = document.createElement("option");
    option.value = s;
    option.textContent = s;
    storeSelect.appendChild(option);
  }
  searchInput.addEventListener("input", () => {
    const state = readState();
    state.query = searchInput.value;
    writeState(state);
    renderList(state);
  });
  categoryChips.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    const state = readState();
    state.category = button.getAttribute("data-category");
    writeState(state);
    renderList(state);
  });
  storeSelect.addEventListener("change", () => {
    const state = readState();
    state.store = storeSelect.value;
    writeState(state);
    renderList(state);
  });
  discountSelect.addEventListener("change", () => {
    const state = readState();
    state.minDiscount = Number(discountSelect.value) || 0;
    writeState(state);
    renderList(state);
  });
  verdictSelect.addEventListener("change", () => {
    const state = readState();
    state.verdict = verdictSelect.value;
    writeState(state);
    renderList(state);
  });
  sortSelect.addEventListener("change", () => {
    const state = readState();
    state.sort = sortSelect.value;
    writeState(state);
    renderList(state);
  });
}

function renderStats() {
  const t = totals(deals);
  const checked = new Date(CHECKED_AT).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
  document.getElementById("stat-deals").textContent = String(t.count);
  document.getElementById("stat-saved").textContent = `$${t.saved.toLocaleString("en-US")}`;
  document.getElementById("stat-lows").textContent = String(t.lows);
  document.getElementById("stat-checked").textContent = `${checked} UTC`;
}

bindControls();
renderStats();
window.addEventListener("hashchange", render);
render();
