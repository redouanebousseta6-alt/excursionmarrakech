/**
 * Shared pricing helpers (mirror of frontend logic)
 */
function startingPrice(pricing) {
  if (!pricing) return null;
  if (pricing.type === "flat") return pricing.price;
  if (pricing.type === "private-group") {
    const vals = [pricing.groupPrice, pricing.privatePrice].filter((v) => v != null);
    return vals.length ? Math.min(...vals) : null;
  }
  if (pricing.type === "options") return Math.min(...pricing.options.map((o) => o.price));
  if (pricing.type === "driver-passenger") return pricing.passengerPrice;
  return null;
}

function resolveUnitPrice(pricing, selection = {}) {
  if (!pricing) return { amount: null, unit: "", note: "" };

  if (pricing.type === "flat") {
    return { amount: pricing.price, unit: pricing.unit || "per person", note: pricing.note || "" };
  }

  if (pricing.type === "private-group") {
    const mode = selection.mode || (pricing.groupPrice != null ? "group" : "private");
    if (mode === "private" && pricing.privatePrice != null) {
      return {
        amount: pricing.privatePrice,
        unit: pricing.unit || "per person",
        note: pricing.minPrivate ? `Minimum ${pricing.minPrivate} persons` : pricing.note || "",
      };
    }
    if (mode === "group" && pricing.groupPrice != null) {
      return { amount: pricing.groupPrice, unit: pricing.unit || "per person", note: pricing.note || "" };
    }
    const fallback = pricing.groupPrice != null ? pricing.groupPrice : pricing.privatePrice;
    return { amount: fallback, unit: pricing.unit || "per person", note: pricing.note || "" };
  }

  if (pricing.type === "options") {
    const optId = selection.optionId || pricing.options[0]?.id;
    const opt = pricing.options.find((o) => o.id === optId) || pricing.options[0];
    return { amount: opt.price, unit: opt.unit || "per person", note: opt.label };
  }

  if (pricing.type === "driver-passenger") {
    const role = selection.role || "driver";
    if (role === "passenger") {
      return { amount: pricing.passengerPrice, unit: "per passenger", note: "" };
    }
    return { amount: pricing.driverPrice, unit: "per driver", note: "" };
  }

  return { amount: null, unit: "", note: "" };
}

function computeTotal(pricing, selection, travelers) {
  const resolved = resolveUnitPrice(pricing, selection);
  const qty = Math.max(1, Number(travelers) || 1);
  // Buggy / per-buggy prices are not multiplied by travelers the same way
  const unit = (resolved.unit || "").toLowerCase();
  if (unit.includes("buggy") || unit.includes("per buggy")) {
    return { ...resolved, travelers: qty, total: resolved.amount };
  }
  return { ...resolved, travelers: qty, total: resolved.amount * qty };
}

const CATEGORIES = [
  { id: "desert", name: "Desert Adventures" },
  { id: "day-trips", name: "Day Trips" },
  { id: "city", name: "City Tours" },
  { id: "wellness", name: "Wellness" },
  { id: "multi-day", name: "Multi-day" },
];

module.exports = { startingPrice, resolveUnitPrice, computeTotal, CATEGORIES };
