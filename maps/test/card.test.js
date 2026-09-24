import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { escapeHtml, telHref, formatPhone, hoursRows, renderCard, directionsUrl } from "../js/card.js";
import { openStores } from "../js/stores.js";

const STORES = JSON.parse(readFileSync(new URL("../stores.json", import.meta.url), "utf8"));
const SAMPLE = STORES[0];
const SAMPLE_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=1234%20S%20Congress%20Ave%2C%20Austin%2C%20TX%2078704";

test("escapeHtml escapes & < > \" '", () => {
  assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
});

test("telHref keeps leading + and digits", () => {
  assert.equal(telHref("+1-512-555-0100"), "tel:+15125550100");
  assert.equal(telHref("(512) 555-0100"), "tel:5125550100");
});

test("formatPhone formats +1 10-digit numbers, else unchanged", () => {
  assert.equal(formatPhone("+1-512-555-0100"), "(512) 555-0100");
  assert.equal(formatPhone("+44 20 7946 0958"), "+44 20 7946 0958");
  assert.equal(formatPhone("555-0100"), "555-0100");
});

test("hoursRows gives 7 Mon->Sun rows, Closed normalised, null when missing", () => {
  const rows = hoursRows({ ...SAMPLE.hours, sun: "CLOSED" });
  assert.deepEqual(rows.map((r) => r.day), ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  assert.equal(rows[4].text, "11:00–23:00");
  assert.equal(rows[6].text, "Closed");
  assert.equal(hoursRows(undefined), null);
  assert.equal(hoursRows(null), null);
});

test("renderCard for the sample store has name, address, ordered hours, phone link", () => {
  assert.equal(SAMPLE.name, "Austin – South Congress");
  const html = renderCard(SAMPLE);
  assert.ok(html.includes("Austin – South Congress"));
  assert.ok(html.includes("1234 S Congress Ave, Austin, TX 78704"));
  const rows = [...html.matchAll(/<th scope="row" class="store-card__day">(\w+)<\/th><td class="store-card__time">([^<]*)<\/td>/g)];
  assert.deepEqual(rows.map((m) => m[1]), ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  assert.equal(rows[4][2], "11:00–23:00");
  assert.equal(rows[5][2], "11:00–23:00");
  assert.equal(rows[6][2], "Closed");
  assert.ok(html.includes('<a href="tel:+15125550100">(512) 555-0100</a>'));
});

test("renderCard without phone has no tel: link and no <a>", () => {
  const { phone, ...noPhone } = SAMPLE;
  const html = renderCard(noPhone);
  assert.ok(!html.includes("tel:"));
  assert.ok(!html.includes('href="tel'));
});

test("renderCard without hours shows the fallback message", () => {
  const { hours, ...noHours } = SAMPLE;
  const html = renderCard(noHours);
  assert.ok(html.includes("Hours not available, please call to check"));
  assert.ok(!html.includes("store-card__day"));
});

test("renderCard escapes a malicious name", () => {
  const html = renderCard({ ...SAMPLE, name: "<img src=x onerror=alert(1)>" });
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("&lt;img src=x onerror=alert(1)&gt;"));
});

test("directionsUrl for the sample store is the exact Google Maps URL", () => {
  assert.equal(directionsUrl(SAMPLE), SAMPLE_DIRECTIONS);
});

test("renderCard has a Get directions link opening in a new tab", () => {
  const html = renderCard(SAMPLE);
  const href = SAMPLE_DIRECTIONS.replace(/&/g, "&amp;");
  assert.ok(html.includes(`href="${href}" target="_blank" rel="noopener">Get directions</a>`), html);
});

test("every open store in stores.json gets a directions link", () => {
  const open = openStores(STORES);
  assert.ok(open.some((s) => s.name === "Austin – Ghost Kitchen"));
  for (const store of open) {
    const html = renderCard(store);
    const href = escapeHtml(directionsUrl(store));
    assert.ok(html.includes(`href="${href}" target="_blank" rel="noopener">Get directions</a>`), store.name);
  }
});

test("renderCard uses semantic markup in order name -> address -> hours -> phone -> directions (R12)", () => {
  const html = renderCard(SAMPLE);
  const idx = (needle) => {
    const i = html.indexOf(needle);
    assert.ok(i >= 0, `missing ${needle}`);
    return i;
  };
  const name = idx(`<h2 class="store-card__name">${SAMPLE.name}</h2>`);
  const address = idx(`<address class="store-card__address">${SAMPLE.address}</address>`);
  const hours = idx('<table class="store-card__hours">');
  const hoursEnd = idx("</table>");
  const phone = idx('href="tel:');
  const directions = idx("Get directions");
  assert.ok(name < address && address < hours && hoursEnd < phone && phone < directions);
  assert.equal([...html.matchAll(/<th scope="row"/g)].length, 7);
});
