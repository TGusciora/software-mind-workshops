// Pure store-data helpers for the customer map. No DOM and no Leaflet, so
// Node's test runner can import this module directly.

/** Zoom cap for the initial view, so a single store opens at neighbourhood zoom. */
export const INITIAL_MAX_ZOOM = 14;

const isCoord = (v) => typeof v === "number" && Number.isFinite(v);

/**
 * Stores a customer may see: `status === "open"` with numeric lat/lng.
 * Entries with any other status, or without numeric coordinates, are dropped.
 */
export function openStores(stores) {
  if (!Array.isArray(stores)) return [];
  return stores.filter(
    (s) => s != null && s.status === "open" && isCoord(s.lat) && isCoord(s.lng),
  );
}

/**
 * Initial map view for the given (already filtered) stores.
 * - 0 stores: `{ kind: "empty" }`
 * - otherwise: `{ kind: "fit", bounds: [[minLat, minLng], [maxLat, maxLng]], maxZoom: 14 }`
 */
export function initialView(stores) {
  if (!Array.isArray(stores) || stores.length === 0) return { kind: "empty" };
  let minLat = Infinity;
  let minLng = Infinity;
  let maxLat = -Infinity;
  let maxLng = -Infinity;
  for (const { lat, lng } of stores) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }
  return {
    kind: "fit",
    bounds: [
      [minLat, minLng],
      [maxLat, maxLng],
    ],
    maxZoom: INITIAL_MAX_ZOOM,
  };
}

/**
 * Fetch and parse the store list. Never throws.
 * Returns `{ ok: true, stores }` for a 2xx JSON array, otherwise `{ ok: false }`
 * (network error, non-2xx status, invalid JSON, or a non-array body).
 */
export async function loadStores(fetchFn = fetch, url = "stores.json") {
  try {
    const res = await fetchFn(url);
    if (!res || !res.ok) return { ok: false };
    const stores = await res.json();
    if (!Array.isArray(stores)) return { ok: false };
    return { ok: true, stores };
  } catch {
    return { ok: false };
  }
}
