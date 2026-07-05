import type { IsoKey, Market, NodePrice } from "./types";

const UPSTREAM = "https://data.kardashevlabs.org";

// Server-side only: fetches the upstream API directly (no CORS concerns here,
// unlike the client which goes through app/api/proxy to dodge browser CORS).
// Used to seed the first page load with real data so bots/crawlers/AI agents
// fetching raw HTML see actual node prices instead of an empty map shell.
export async function fetchNodesServer(iso: IsoKey, market: Market): Promise<NodePrice[]> {
  const res = await fetch(`${UPSTREAM}/lmp/map?iso=${iso}&market=${market}`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Failed to fetch lmp/map for ${iso}/${market}`);
  return res.json();
}
