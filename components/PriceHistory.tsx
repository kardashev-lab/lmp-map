"use client";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { LmpHistoryPoint } from "@/lib/types";
import { priceColor } from "@/lib/colors";

interface Props {
  data: LmpHistoryPoint[];
  nodeId: string;
}

function fmtTs(ts: string) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    hour12: true,
  });
}

export default function PriceHistory({ data, nodeId }: Props) {
  const sorted = [...data].sort(
    (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime()
  );

  const latest = sorted[sorted.length - 1];
  const color = latest ? priceColor(latest.lmp) : "#6b7280";

  const option: EChartsOption = {
    backgroundColor: "transparent",
    grid: { top: 8, right: 12, bottom: 36, left: 52 },
    xAxis: {
      type: "category",
      data: sorted.map((d) => d.ts),
      axisLabel: {
        color: "#6b7280",
        fontSize: 9,
        formatter: fmtTs,
        interval: "auto",
      },
      axisLine: { lineStyle: { color: "#374151" } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#6b7280",
        fontSize: 9,
        formatter: (v: number) => `$${v}`,
      },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#1f2937" } },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#111827",
      borderColor: "#374151",
      textStyle: { color: "#f3f4f6", fontSize: 11 },
      formatter: (params) => {
        const p = (params as { dataIndex: number }[])[0];
        const d = sorted[p.dataIndex];
        const c = priceColor(d.lmp);
        return `
          <div style="color:#9ca3af;font-size:10px;margin-bottom:4px">${fmtTs(d.ts)}</div>
          <div style="color:${c};font-weight:600">LMP: $${d.lmp?.toFixed(2) ?? "—"}/MWh</div>
          ${d.congestion !== null ? `<div style="color:#9ca3af;font-size:10px">Congestion: $${d.congestion?.toFixed(2)}</div>` : ""}
          ${d.loss !== null ? `<div style="color:#9ca3af;font-size:10px">Loss: $${d.loss?.toFixed(2)}</div>` : ""}
        `;
      },
    },
    series: [
      {
        type: "line",
        data: sorted.map((d) => d.lmp),
        name: nodeId,
        symbol: "none",
        lineStyle: { color, width: 1.5 },
        areaStyle: { color, opacity: 0.08 },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 160 }} />;
}
