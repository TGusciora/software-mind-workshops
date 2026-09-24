import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { TAP_TARGET_PX } from "../js/card.js";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const appJs = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");

/** Relative luminance of a #rgb or #rrggbb colour (WCAG 2.x). */
function luminance(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function tokens(block) {
  const out = {};
  for (const m of block.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\b/g)) out[m[1]] = m[2];
  return out;
}

const lightBlock = html.match(/(?:^|\n):root\s*\{([^}]*)\}/)?.[1] ?? "";
const darkBlock =
  html.match(/@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{([^}]*)\}/)?.[1] ?? "";
const light = tokens(lightBlock);
const dark = tokens(darkBlock);

test("light and dark themes define all colour tokens", () => {
  for (const t of ["bg", "fg", "muted", "card", "border"]) {
    assert.ok(light[t], `light --${t}`);
    assert.ok(dark[t], `dark --${t}`);
  }
  assert.notEqual(light.bg, dark.bg);
});

for (const [name, theme] of [["light", light], ["dark", dark]]) {
  test(`${name}: --fg/--bg and --fg/--card contrast >= 4.5:1`, () => {
    assert.ok(contrast(theme.fg, theme.bg) >= 4.5, `fg/bg ${contrast(theme.fg, theme.bg)}`);
    assert.ok(contrast(theme.fg, theme.card) >= 4.5, `fg/card ${contrast(theme.fg, theme.card)}`);
  });
}

test("page and popup use the tokens", () => {
  assert.match(html, /body\{[^}]*background:var\(--bg\);color:var\(--fg\)/);
  assert.match(html, /\.leaflet-popup-content-wrapper,\.leaflet-popup-tip\{[^}]*background:var\(--card\)/);
});

test("close button and card links have 44px min tap targets", () => {
  assert.match(html, /leaflet-popup-close-button\{[^}]*min-width:44px;min-height:44px/);
  assert.match(html, /\.leaflet-popup-content a\{[^}]*min-width:44px;min-height:44px/);
});

test("contrast helper sanity: black on white is 21:1", () => {
  assert.equal(Math.round(contrast("#000", "#fff")), 21);
});

test("TAP_TARGET_PX >= 44 and app.js uses it for the marker icon size", () => {
  assert.ok(TAP_TARGET_PX >= 44);
  assert.match(appJs, /iconSize:\s*\[TAP_TARGET_PX,\s*TAP_TARGET_PX\]/);
  assert.match(appJs, /import\s*\{[^}]*TAP_TARGET_PX[^}]*\}\s*from\s*"\.\/card\.js"/);
});

test("popup maxWidth fits a 360px viewport", () => {
  assert.match(appJs, /maxWidth:\s*Math\.min\(300,\s*window\.innerWidth\s*-\s*48\)/);
});
