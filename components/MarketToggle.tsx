"use client";

import type { Market } from "@/lib/types";

interface Props {
  market: Market;
  onChange: (m: Market) => void;
}

export default function MarketToggle({ market, onChange }: Props) {
  return (
    <div className="flex rounded overflow-hidden border border-gray-700 text-xs font-mono">
      {(["RT", "DA"] as Market[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-3 py-2 min-h-10 transition-colors ${
            market === m
              ? "bg-gray-100 text-gray-900 font-semibold"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
