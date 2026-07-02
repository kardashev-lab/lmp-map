"use client";

import type { IsoKey } from "@/lib/types";
import { ISOS, ISO_COLORS } from "@/lib/constants";

interface Props {
  selected: IsoKey;
  onChange: (iso: IsoKey) => void;
}

export default function IsoSelector({ selected, onChange }: Props) {
  return (
    <div className="flex gap-1 flex-wrap">
      {ISOS.map((iso) => {
        const active = iso === selected;
        const color = ISO_COLORS[iso];
        return (
          <button
            key={iso}
            onClick={() => onChange(iso)}
            style={active ? { backgroundColor: color, borderColor: color } : { borderColor: color + "60" }}
            className={`px-3 py-1 rounded text-xs font-mono font-semibold border transition-all ${
              active
                ? "text-white shadow-md"
                : "text-gray-400 bg-transparent hover:text-white"
            }`}
          >
            {iso}
          </button>
        );
      })}
    </div>
  );
}
