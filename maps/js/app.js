// Customer map: loads stores.json, shows one pin per open store and fits the
// initial view to them. Relies on the global `L` from Leaflet 1.9.4.
import { openStores, initialView, loadStores, countLabel } from "./stores.js";
import { renderCard, TAP_TARGET_PX } from "./card.js";

const EMPTY_MESSAGE = "No restaurants are open yet, check back soon";

function showEmpty(mapEl) {
  const msg = document.createElement("p");
  msg.id = "map-empty";
  msg.className = "map-empty";
  msg.setAttribute("role", "status");
  msg.textContent = EMPTY_MESSAGE;
  mapEl.replaceWith(msg);
}

function storeIcon() {
  // 44x44 px tap target; the visible dot is styled in index.html (.store-pin).
  return L.divIcon({
    className: "store-pin",
    html: '<span class="store-pin__dot"></span>',
    iconSize: [TAP_TARGET_PX, TAP_TARGET_PX],
    iconAnchor: [TAP_TARGET_PX / 2, TAP_TARGET_PX / 2],
  });
}

const ERROR_MESSAGE = "We couldn't load our restaurants. Please try again.";

// Replaces the map with a readable error and a "Try again" button (R11, US-01).
// The map element is only hidden, so a retry can render into it; the Leaflet
// map is never created before a successful load, so it is initialised once.
function showLoadError(mapEl) {
  const box = document.createElement("div");
  box.id = "map-error";
  box.className = "map-error";
  box.setAttribute("role", "alert");
  const msg = document.createElement("p");
  msg.textContent = ERROR_MESSAGE;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "map-error__retry";
  btn.textContent = "Try again";
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    const result = await loadStores();
    if (!result.ok) {
      btn.disabled = false;
      return;
    }
    box.remove();
    mapEl.hidden = false;
    render(mapEl, result.stores);
  });
  box.append(msg, btn);
  mapEl.hidden = true;
  mapEl.before(box);
}

async function main() {
  const mapEl = document.getElementById("map");
  // loadStores() uses fetch's default mode (cors, same-origin credentials),
  // which matches <link rel="preload" as="fetch" crossorigin>, so the preload
  // is reused.
  const result = await loadStores();
  // T-006: drop the loading indicator; map, empty state or error replaces it.
  document.getElementById("map-loading")?.remove();
  if (!result.ok) {
    showLoadError(mapEl);
    return;
  }
  render(mapEl, result.stores);
}

function render(mapEl, data) {
  const stores = openStores(data);
  const view = initialView(stores);

  // T-007: count comes from the same filtered array as the markers; it stays
  // hidden in the loading, empty and error states.
  const countEl = document.getElementById("store-count");
  if (view.kind === "empty") {
    if (countEl) countEl.hidden = true;
    showEmpty(mapEl);
    return;
  }
  if (countEl) {
    countEl.textContent = countLabel(stores.length);
    countEl.hidden = false;
  }

  const map = L.map(mapEl, { scrollWheelZoom: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const icon = storeIcon();
  for (const s of stores) {
    L.marker([s.lat, s.lng], { icon, title: s.name })
      .bindPopup(renderCard(s), { maxWidth: Math.min(300, window.innerWidth - 48) })
      .addTo(map);
  }

  // Padding keeps edge pins fully on screen (a pin is 44px wide).
  map.fitBounds(view.bounds, { maxZoom: view.maxZoom, padding: [24, 24] });
}

main();
