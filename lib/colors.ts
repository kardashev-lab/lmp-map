/**
 * Map an LMP price to a hex color using a dynamic scale anchored to the
 * session min/max. Negative prices → bright green, very high → dark red.
 *
 * We use a fixed breakpoint approach rather than purely linear interpolation
 * so the colors stay meaningful even with outlier prices:
 *   price ≤ 0       → #22c55e  (green)
 *   0 to 50       → green → yellow
 *   50 to 150     → yellow → orange
 *   150+            → orange → #dc2626 (red)
 */
export function priceColor(price: number | null): string {
  if (price === null || price === undefined) return "#6b7280"; // gray for missing

  if (price <= 0) return "#22c55e";

  if (price < 50) {
    const t = price / 50; // 0→1
    return lerpHex("#22c55e", "#eab308", t);
  }

  if (price < 150) {
    const t = (price - 50) / 100; // 0→1
    return lerpHex("#eab308", "#f97316", t);
  }

  // 150+
  const t = Math.min((price - 150) / 150, 1); // clamp at 300
  return lerpHex("#f97316", "#dc2626", t);
}

function lerpHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export function priceLabel(price: number | null): string {
  if (price === null || price === undefined) return "—";
  return `$${price.toFixed(2)}/MWh`;
}
