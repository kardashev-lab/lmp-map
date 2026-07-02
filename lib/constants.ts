import type { IsoKey } from "./types";

export const ISOS: IsoKey[] = ["PJM", "CAISO", "NYISO", "MISO", "ERCOT", "SPP", "ISONE"];

export const ISO_VIEWS: Record<IsoKey, { center: [number, number]; zoom: number }> = {
  PJM:   { center: [-79.0, 40.0], zoom: 5.5 },
  CAISO: { center: [-119.0, 37.0], zoom: 5.5 },
  NYISO: { center: [-75.5, 43.0], zoom: 6.5 },
  MISO:  { center: [-90.0, 42.0], zoom: 4.5 },
  ERCOT: { center: [-99.0, 31.0], zoom: 5.5 },
  SPP:   { center: [-97.0, 38.0], zoom: 5.0 },
  ISONE: { center: [-71.5, 42.5], zoom: 6.5 },
};

export const ISO_COLORS: Record<IsoKey, string> = {
  PJM:   "#6366f1",
  CAISO: "#f59e0b",
  NYISO: "#10b981",
  MISO:  "#3b82f6",
  ERCOT: "#ef4444",
  SPP:   "#8b5cf6",
  ISONE: "#06b6d4",
};

export const STALE_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes
