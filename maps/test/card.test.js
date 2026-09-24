import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { escapeHtml, telHref, formatPhone, hoursRows, renderCard } from "../js/card.js";

const SAMPLE = JSON.parse(readFileSync(new URL("../stores.json", import.meta.url), "utf8"))[0];

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
  const rows = [...html.matchAll(/<span class="store-card__day">(\w+)<\/span> <span class="store-card__time">([^<]*)<\/span>/g)];
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
  assert.ok(!html.includes("<a"));
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
