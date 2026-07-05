"use client";

import { useEffect, useState } from "react";
import type { NodePrice, LmpHistoryPoint, Market } from "@/lib/types";
import { priceColor, priceLabel } from "@/lib/colors";
import PriceHistory from "./PriceHistory";

interface Props {
  node: NodePrice;
  iso: string;
  market: Market;
  onClose: () => void;
}

export default function NodePanel({ node, iso, market, onClose }: Props) {
  const [history, setHistory] = useState<LmpHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setHistory([]);
    fetch(
      `/api/proxy/lmp?iso=${iso}&node_id=${encodeURIComponent(node.node_id)}&market=${market}&limit=2016`
    )
      .then((r) => r.json())
      .then((data) => {
        setHistory(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [node.node_id, iso, market]);

  const color = priceColor(node.lmp);
  const ageMin = node.ts
    ? Math.floor((Date.now() - new Date(node.ts).getTime()) / 60000)
    : null;

  return (
    <div className="absolute top-16 right-3 z-10 w-72 bg-gray-950 border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-3 border-b border-gray-800">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">
            {iso} · {node.zone ?? "—"}
          </div>
          <div className="text-sm font-semibold text-white mt-0.5 truncate">
            {node.name ?? node.node_id}
          </div>
          <div className="text-xs text-gray-400 font-mono">{node.node_id}</div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="ml-2 text-gray-400 hover:text-white transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Current price */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold" style={{ color }}>
            {priceLabel(node.lmp)}
          </span>
          <span className="text-xs text-gray-400 font-mono">{market}</span>
        </div>
        {ageMin !== null && (
          <div className="text-xs text-gray-400 mt-0.5 font-mono">
            {ageMin < 1 ? "just now" : `${ageMin} min ago`}
          </div>
        )}

        {/* Price components */}
        <div className="mt-2 grid grid-cols-3 gap-1 text-xs font-mono">
          {[
            { label: "Energy", val: node.energy },
            { label: "Cong.", val: node.congestion },
            { label: "Loss", val: node.loss },
          ].map(({ label, val }) => (
            <div key={label} className="bg-gray-900 rounded p-1.5">
              <div className="text-gray-400 text-[10px]">{label}</div>
              <div className="text-gray-200">
                {val !== null && val !== undefined ? `$${val.toFixed(2)}` : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History chart */}
      <div className="p-3">
        <div className="text-xs text-gray-400 font-mono mb-1">14-day history</div>
        {loading ? (
          <div className="h-40 flex items-center justify-center text-gray-700 text-xs">
            Loading...
          </div>
        ) : history.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-gray-700 text-xs">
            No history available
          </div>
        ) : (
          <PriceHistory data={history} nodeId={node.node_id} />
        )}
      </div>
    </div>
  );
}
