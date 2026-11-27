// HTML for the deal board's pages, built from the deal data. Every value
// that comes from data is escaped before it goes into the page.

import { discountOf, savedOf, VERDICT_LABELS } from "./filters.js";

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const checkedAt = (iso) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }) + " UTC";

function verdictBadge(d) {
  return `<span class="verdict verdict-${d.verdict}">${escape(VERDICT_LABELS[d.verdict])}</span>`;
}

function alsoAtLine(d) {
  if (!d.alsoAt || d.alsoAt.length === 0) return "";
  const parts = d.alsoAt
    .map((a) => `<a href="${escape(a.url)}" target="_blank" rel="noopener">${escape(a.store)} ${usd(a.price)}</a>`)
    .join(" &middot; ");
  return `<p class="also">Also at ${parts}</p>`;
}

function sourceLine(d) {
  const src = d.sourceUrl
    ? `<a href="${escape(d.sourceUrl)}" target="_blank" rel="noopener">${escape(d.source)}</a>`
    : escape(d.source);
  return `<p class="meta">Checked ${checkedAt(d.checked)} &middot; Price read in ${src}</p>`;
}

export function dealCard(d) {
  return `<article class="card" id="deal-${escape(d.id)}">
  <p class="tags"><span class="store">${escape(d.store)}</span><span class="category">${escape(d.category)}</span></p>
  <h2><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h2>
  <p class="price"><span class="sale">${usd(d.price)}</span> <s class="was">${usd(d.was)}</s></p>
  <p class="save">Save ${usd(savedOf(d))} &middot; ${discountOf(d)}% off ${verdictBadge(d)}</p>
  <p class="blurb">${escape(d.blurb)}</p>
  <p class="verdict-note">${escape(d.verdictNote)}</p>
  ${alsoAtLine(d)}
  ${sourceLine(d)}
  <p><a class="buy" href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} &rarr;</a></p>
</article>`;
}

export function dealCards(list) {
  if (list.length === 0) return '<p class="empty">No deal matches those filters. Try clearing the search or picking another category.</p>';
  return `<div class="grid">${list.map(dealCard).join("")}</div>`;
}

export function dealDetail(d) {
  const rows = (d.alsoAt || [])
    .map((a) => `<tr><td>${escape(a.store)}</td><td>${usd(a.price)}</td><td><a href="${escape(a.url)}" target="_blank" rel="noopener">Open &rarr;</a></td></tr>`)
    .join("");
  return `<p><a class="back" href="#/">&larr; All deals</a></p>
<article class="detail">
  <p class="tags"><span class="store">${escape(d.store)}</span><span class="category">${escape(d.category)}</span></p>
  <h1>${escape(d.title)}</h1>
  <p class="price big"><span class="sale">${usd(d.price)}</span> <s class="was">${usd(d.was)}</s></p>
  <p class="save big">Save ${usd(savedOf(d))} &middot; ${discountOf(d)}% off ${verdictBadge(d)}</p>
  <p class="blurb big">${escape(d.blurb)}</p>
  <p class="verdict-note big">${escape(d.verdictNote)}</p>
  <dl class="facts">
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Sale price</dt><dd>${usd(d.price)}</dd>
    <dt>Usual price</dt><dd>${usd(d.was)}</dd>
    <dt>Discount</dt><dd>${discountOf(d)}% off, save ${usd(savedOf(d))}</dd>
    <dt>Checked</dt><dd>${checkedAt(d.checked)}</dd>
    <dt>Price read in</dt><dd>${d.sourceUrl ? `<a href="${escape(d.sourceUrl)}" target="_blank" rel="noopener">${escape(d.source)}</a>` : escape(d.source)}</dd>
  </dl>
  <p><a class="buy big" href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} &rarr;</a></p>
  ${rows ? `<h2>Same product at other stores</h2><table class="compare"><thead><tr><th>Store</th><th>Price</th><th></th></tr></thead><tbody><tr><td>${escape(d.store)}</td><td>${usd(d.price)}</td><td><a href="${escape(d.url)}" target="_blank" rel="noopener">Open &rarr;</a></td></tr>${rows}</tbody></table>` : ""}
</article>`;
}

export function missingDeal() {
  return `<h1>Deal not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
