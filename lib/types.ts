export interface NodePrice {
  node_id: string;
  name: string | null;
  lat: number | null;
  lng: number | null;
  zone: string | null;
  lmp: number | null;
  energy: number | null;
  congestion: number | null;
  loss: number | null;
  ts: string | null;
}

export interface LmpHistoryPoint {
  ts: string;
  iso: string;
  node_id: string;
  node_name: string | null;
  market: string;
  lmp: number | null;
  energy: number | null;
  congestion: number | null;
  loss: number | null;
}

export type Market = "RT" | "DA";
export type IsoKey = "PJM" | "CAISO" | "NYISO" | "MISO" | "ERCOT" | "SPP" | "ISONE";
