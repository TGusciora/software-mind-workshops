// Pure store-card rendering for the customer map. No DOM and no Leaflet, so
// Node's test runner can import this module directly.

const DAYS = [
  ["mon", "Mon"],
  ["tue", "Tue"],
  ["wed", "Wed"],
  ["thu", "Thu"],
  ["fri", "Fri"],
  ["sat", "Sat"],
  ["sun", "Sun"],
];

const NO_HOURS = "Hours not available, please call to check";

/** Escapes `& < > " '` for safe use in HTML text and attribute values. */
export function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** `"+1-512-555-0100"` -> `"tel:+15125550100"` (leading `+` and digits only). */
export function telHref(phone) {
  const s = String(phone ?? "").trim();
  const plus = s.startsWith("+") ? "+" : "";
  return `tel:${plus}${s.replace(/\D/g, "")}`;
}

/** A +1 10-digit number -> `"(512) 555-0100"`; anything else unchanged. */
export function formatPhone(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  const m = /^1(\d{3})(\d{3})(\d{4})$/.exec(digits);
  if (!m || !String(phone).trim().startsWith("+")) return phone;
  return `(${m[1]}) ${m[2]}-${m[3]}`;
}

/** Seven Mon->Sun rows `{ day, text }`, or `null` when `hours` is missing. */
export function hoursRows(hours) {
  if (hours == null || typeof hours !== "object") return null;
  return DAYS.map(([key, day]) => {
    const v = hours[key];
    const text =
      typeof v === "string" && v.trim().toLowerCase() === "closed" ? "Closed" : String(v ?? "");
    return { day, text };
  });
}

/** HTML string for a store's popup card. All store text is escaped. */
export function renderCard(store) {
  const parts = ['<div class="store-card">'];
  parts.push(`<h2 class="store-card__name">${escapeHtml(store.name)}</h2>`);
  if (store.address) {
    parts.push(`<p class="store-card__address">${escapeHtml(store.address)}</p>`);
  }
  const rows = hoursRows(store.hours);
  if (rows) {
    parts.push('<ul class="store-card__hours">');
    for (const r of rows) {
      parts.push(
        `<li><span class="store-card__day">${r.day}</span> <span class="store-card__time">${escapeHtml(r.text)}</span></li>`,
      );
    }
    parts.push("</ul>");
  } else {
    parts.push(`<p class="store-card__no-hours">${NO_HOURS}</p>`);
  }
  if (typeof store.phone === "string" && /\d/.test(store.phone)) {
    parts.push(
      `<p class="store-card__phone"><a href="${escapeHtml(telHref(store.phone))}">${escapeHtml(formatPhone(store.phone))}</a></p>`,
    );
  }
  parts.push("</div>");
  return parts.join("");
}
