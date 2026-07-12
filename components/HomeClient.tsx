"use client";

import { useCallback, useState } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import type { IsoKey, Market, NodePrice } from "@/lib/types";
import IsoSelector from "@/components/IsoSelector";
import MarketToggle from "@/components/MarketToggle";
import PriceLegend from "@/components/PriceLegend";
import NodePanel from "@/components/NodePanel";

// MapLibre must be client-only (uses browser APIs)
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const DEFAULT_ISO: IsoKey = "NYISO";
const DEFAULT_MARKET: Market = "RT";

interface HomeClientProps {
  initialNodes?: NodePrice[];
}

export default function HomeClient({ initialNodes }: HomeClientProps) {
  const [iso, setIso] = useState<IsoKey>(DEFAULT_ISO);
  const [market, setMarket] = useState<Market>(DEFAULT_MARKET);
  const [selectedNode, setSelectedNode] = useState<NodePrice | null>(null);

  const { data, error } = useSWR<NodePrice[]>(
    `/api/proxy/lmp/map?iso=${iso}&market=${market}`,
    fetcher,
    {
      refreshInterval: 60_000,
      dedupingInterval: 30_000,
      fallbackData: iso === DEFAULT_ISO && market === DEFAULT_MARKET ? initialNodes : undefined,
    }
  );
  // SWR's `isLoading` ignores fallbackData by design (stays true until a real
  // fetch resolves), which would show "Loading..." on first render despite
  // `data` already being populated from the server. Check `data` itself instead.
  const isLoading = !data;

  const nodes = Array.isArray(data) ? data : [];
  const validNodes = nodes.filter((n) => n.lat !== null && n.lng !== null);

  const handleSelectNode = useCallback((node: NodePrice) => {
    setSelectedNode(node);
  }, []);

  const handleIsoChange = (newIso: IsoKey) => {
    setIso(newIso);
    setSelectedNode(null);
  };

  return (
    <main className="relative w-screen h-screen bg-gray-950 overflow-hidden">
      <h1 className="sr-only">Kardashev Labs: Live LMP Map</h1>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex flex-wrap items-center gap-3 px-3 py-2 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <a
          href="https://kardashevlabs.org"
          className="text-sm font-semibold text-white font-mono tracking-tight shrink-0"
        >
          Kardashev Labs
        </a>
        <span className="text-gray-700 text-sm hidden sm:inline">·</span>
        <IsoSelector selected={iso} onChange={handleIsoChange} />
        <div className="ml-auto flex items-center gap-3 flex-wrap justify-end">
          <MarketToggle market={market} onChange={setMarket} />
          {isLoading && (
            <span className="text-xs text-gray-400 font-mono animate-pulse">
              Loading...
            </span>
          )}
          {error && (
            <span className="text-xs text-red-500 font-mono">API error</span>
          )}
          {!isLoading && !error && (
            <span className="text-xs text-gray-400 font-mono">
              {validNodes.length} nodes · refreshes every 60s
            </span>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="absolute inset-0 pt-10">
        <Map
          nodes={validNodes}
          iso={iso}
          selectedNodeId={selectedNode?.node_id ?? null}
          onSelectNode={handleSelectNode}
        />
      </div>

      {/* Node detail panel */}
      {selectedNode && (
        <NodePanel
          node={selectedNode}
          iso={iso}
          market={market}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Legend */}
      <div className="absolute bottom-8 left-3 z-10 bg-gray-950/80 backdrop-blur rounded px-3 py-2 border border-gray-800">
        <PriceLegend />
      </div>

      {/* Python attribution */}
      <div className="absolute bottom-8 right-3 z-10 bg-gray-950/80 backdrop-blur rounded px-3 py-2 border border-gray-800 text-xs text-gray-400">
        Use this data in Python:{" "}
        <a
          href="https://pypi.org/project/kardashev/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 underline"
        >
          pip install kardashev
        </a>
      </div>

      {/* Empty state */}
      {!isLoading && validNodes.length === 0 && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-900/90 rounded-lg px-6 py-4 text-center border border-gray-700">
            <div className="text-gray-300 font-mono text-sm">No live price data for {iso}</div>
            <div className="text-gray-400 text-xs mt-1 font-mono">
              Data refreshes every 5 minutes. Try NYISO, ERCOT, MISO, or SPP.
            </div>
          </div>
        </div>
      )}

      {/* Server-rendered explainer for crawlers/screen readers; visually subtle */}
      <p className="sr-only">
        LMP stands for locational marginal price: the real-time cost of electricity at a specific
        point on the grid, made up of an energy component, a congestion component, and a loss
        component. This map shows live nodal LMPs across major US ISOs and RTOs (PJM, CAISO,
        NYISO, MISO, ERCOT, SPP, and ISO-NE), sourced directly from each ISO&apos;s real-time
        and day-ahead wholesale electricity markets. Click any node on the map to inspect its
        current price and price history.
      </p>
    </main>
  );
}
