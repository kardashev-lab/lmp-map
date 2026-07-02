export default function PriceLegend() {
  const stops = [
    { label: "≤ $0", color: "#22c55e" },
    { label: "$50", color: "#eab308" },
    { label: "$150", color: "#f97316" },
    { label: "$300+", color: "#dc2626" },
  ];

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
      <span>LMP</span>
      <div className="flex items-center gap-1">
        {stops.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
