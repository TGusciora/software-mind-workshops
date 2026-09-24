import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const HTML = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("index.html has a viewport meta tag", () => {
  assert.match(HTML, /<meta\s+name="viewport"\s+content="[^"]*width=device-width[^"]*"/i);
});

test("index.html loads Leaflet 1.9.4 CSS and JS from cdnjs", () => {
  assert.ok(
    HTML.includes("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"),
    "Leaflet 1.9.4 CSS from cdnjs",
  );
  assert.ok(
    HTML.includes("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"),
    "Leaflet 1.9.4 JS from cdnjs",
  );
});

test("index.html has the map container and loads js/app.js as a module", () => {
  assert.match(HTML, /<div\s+id="map"/);
  assert.match(HTML, /<script\s+type="module"\s+src="js\/app\.js"\s*><\/script>/);
});

test("index.html has no inline store array or inline script", () => {
  const inlineScripts = [...HTML.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([, attrs, body]) => !/\bsrc=/.test(attrs) || body.trim() !== "");
  assert.equal(inlineScripts.length, 0, "all scripts must be external with empty bodies");
  assert.doesNotMatch(HTML, /STORES\s*=/);
  assert.doesNotMatch(HTML, /\blat\s*:/);
  assert.doesNotMatch(HTML, /"lat"/);
});

// T-006: performance budget (R8) and loading indicator (US-12).
const LEAFLET_JS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
const LEAFLET_CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";

test("the only external <script src> is Leaflet 1.9.4 JS", () => {
  const external = [...HTML.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)]
    .map((m) => m[1])
    .filter((src) => /^(https?:)?\/\//i.test(src));
  assert.deepEqual(external, [LEAFLET_JS]);
});

test("the only external stylesheet is Leaflet 1.9.4 CSS", () => {
  const sheets = [...HTML.matchAll(/<link\b[^>]*>/gi)]
    .map((m) => m[0])
    .filter((tag) => /\brel="stylesheet"/i.test(tag))
    .map((tag) => tag.match(/\bhref="([^"]+)"/i)[1]);
  assert.deepEqual(sheets, [LEAFLET_CSS]);
  assert.doesNotMatch(HTML, /@import/i);
});

test("no web-font URLs are referenced", () => {
  assert.doesNotMatch(
    HTML,
    /fonts\.googleapis\.com|fonts\.gstatic\.com|typekit|@font-face|\.woff2?\b|\.ttf\b|\.otf\b/i,
  );
});

test("stores.json is preloaded as fetch with crossorigin", () => {
  assert.match(HTML, /<link\s+rel="preload"\s+href="stores\.json"\s+as="fetch"\s+crossorigin\s*>/);
});

test("the Leaflet CDN and tile hosts are preconnected", () => {
  assert.match(HTML, /<link\s+rel="preconnect"\s+href="https:\/\/cdnjs\.cloudflare\.com"/);
  assert.match(HTML, /<link\s+rel="preconnect"\s+href="https:\/\/tile\.openstreetmap\.org"/);
});

test("the map area shows a loading indicator that app.js removes", () => {
  assert.match(HTML, /<div id="map"><p id="map-loading"[^>]*>Loading restaurants…<\/p><\/div>/);
  const APP = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
  assert.match(APP, /getElementById\("map-loading"\)\?\.remove\(\)/);
});

test("index.html has no planned, franchise or sample-data wording", () => {
  assert.doesNotMatch(HTML, /planned/i);
  assert.doesNotMatch(HTML, /franchise/i);
  assert.doesNotMatch(HTML, /sample data/i);
});

test("index.html has a hidden store count element above #map", () => {
  const count = HTML.search(/<p\s+id="store-count"[^>]*\bhidden\b/);
  assert.ok(count !== -1, "hidden #store-count element");
  assert.ok(count < HTML.indexOf('<div id="map"'), "count precedes #map");
});
