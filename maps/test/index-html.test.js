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

test("index.html has no planned, franchise or sample-data wording", () => {
  assert.doesNotMatch(HTML, /planned/i);
  assert.doesNotMatch(HTML, /franchise/i);
  assert.doesNotMatch(HTML, /sample data/i);
});
