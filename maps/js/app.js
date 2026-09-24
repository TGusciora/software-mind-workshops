// Customer map: loads stores.json, shows one pin per open store and fits the
// initial view to them. Relies on the global `L` from Leaflet 1.9.4.
import { openStores, initialView } from "./stores.js";

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
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

async function main() {
  const mapEl = document.getElementById("map");
  const res = await fetch("stores.json");
  if (!res.ok) throw new Error(`stores.json: HTTP ${res.status}`);
  const stores = openStores(await res.json());
  const view = initialView(stores);

  if (view.kind === "empty") {
    showEmpty(mapEl);
    return;
  }

  const map = L.map(mapEl, { scrollWheelZoom: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const icon = storeIcon();
  for (const s of stores) {
    L.marker([s.lat, s.lng], { icon, title: s.name }).addTo(map);
  }

  // Padding keeps edge pins fully on screen (a pin is 44px wide).
  map.fitBounds(view.bounds, { maxZoom: view.maxZoom, padding: [24, 24] });
}

main();
