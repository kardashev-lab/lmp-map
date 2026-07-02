"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { NodePrice, IsoKey } from "@/lib/types";
import { ISO_VIEWS } from "@/lib/constants";
import { priceColor } from "@/lib/colors";

interface Props {
  nodes: NodePrice[];
  iso: IsoKey;
  selectedNodeId: string | null;
  onSelectNode: (node: NodePrice) => void;
}

const CARTO_STYLE = {
  version: 8 as const,
  sources: {
    "carto-dark": {
      type: "raster" as const,
      tiles: [
        "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: "carto-dark-layer",
      type: "raster" as const,
      source: "carto-dark",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

export default function Map({ nodes, iso, selectedNodeId, onSelectNode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const view = ISO_VIEWS[iso];
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: CARTO_STYLE,
      center: view.center,
      zoom: view.zoom,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to ISO when it changes
  useEffect(() => {
    if (!mapRef.current) return;
    const view = ISO_VIEWS[iso];
    mapRef.current.flyTo({ center: view.center, zoom: view.zoom, duration: 800 });
  }, [iso]);

  // Render node markers whenever nodes change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    nodes.forEach((node) => {
      if (node.lat === null || node.lng === null) return;

      const color = priceColor(node.lmp);
      const isSelected = node.node_id === selectedNodeId;

      const el = document.createElement("div");
      el.style.cssText = `
        width: ${isSelected ? "14px" : "10px"};
        height: ${isSelected ? "14px" : "10px"};
        border-radius: 50%;
        background: ${color};
        border: ${isSelected ? "2px solid #fff" : "1.5px solid rgba(255,255,255,0.4)"};
        cursor: pointer;
        box-shadow: 0 0 ${isSelected ? "8px" : "4px"} ${color}88;
        transition: transform 0.1s;
      `;

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.4)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectNode(node);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([node.lng, node.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [nodes, selectedNodeId, onSelectNode]);

  return <div ref={containerRef} className="w-full h-full" />;
}
