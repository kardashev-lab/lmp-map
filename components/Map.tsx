"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { NodePrice, IsoKey } from "@/lib/types";
import { ISO_VIEWS } from "@/lib/constants";

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
      tiles: ["https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
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

const SOURCE_ID = "lmp-nodes";
const LAYER_ID = "nodes-circles";

function buildGeoJSON(
  nodes: NodePrice[],
  selectedNodeId: string | null
): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: nodes
      .filter((n) => n.lat !== null && n.lng !== null)
      .map((n) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [n.lng as number, n.lat as number],
        },
        properties: {
          node_id: n.node_id,
          name: n.name ?? n.node_id,
          lmp: n.lmp ?? null,
          energy: n.energy ?? null,
          congestion: n.congestion ?? null,
          loss: n.loss ?? null,
          ts: n.ts ?? null,
          zone: n.zone ?? null,
          selected: n.node_id === selectedNodeId ? 1 : 0,
        },
      })),
  };
}

export default function Map({ nodes, iso, selectedNodeId, onSelectNode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  // Stable refs so event handlers always see latest values without re-registering
  const nodesRef = useRef<NodePrice[]>(nodes);
  nodesRef.current = nodes;
  const onSelectRef = useRef(onSelectNode);
  onSelectRef.current = onSelectNode;

  // Initialize map and layers once
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
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        // promoteId lets us use node_id string as the feature ID for setFeatureState
        promoteId: "node_id",
        data: buildGeoJSON(nodesRef.current, null),
      });

      map.addLayer({
        id: LAYER_ID,
        type: "circle",
        source: SOURCE_ID,
        paint: {
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false], 8,
            ["==", ["get", "selected"], 1], 8,
            5,
          ],
          "circle-color": [
            "case",
            ["==", ["get", "lmp"], null],
            "#6b7280",
            [
              "interpolate",
              ["linear"],
              ["coalesce", ["get", "lmp"], 0],
              -999, "#22c55e",
              0,   "#22c55e",
              50,  "#eab308",
              150, "#f97316",
              300, "#dc2626",
            ],
          ],
          "circle-stroke-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false], 2,
            ["==", ["get", "selected"], 1], 2,
            1.5,
          ],
          "circle-stroke-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false], "#ffffff",
            ["==", ["get", "selected"], 1], "#ffffff",
            "rgba(255,255,255,0.35)",
          ],
          "circle-opacity": 0.9,
        },
      });

      // Hover via feature state — no DOM manipulation, no re-renders
      let hoveredId: string | null = null;

      map.on("mouseenter", LAYER_ID, (e) => {
        map.getCanvas().style.cursor = "pointer";
        const id = e.features?.[0]?.properties?.node_id as string | undefined;
        if (!id) return;
        if (hoveredId && hoveredId !== id) {
          map.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: false });
        }
        hoveredId = id;
        map.setFeatureState({ source: SOURCE_ID, id }, { hover: true });
      });

      map.on("mouseleave", LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
        if (hoveredId) {
          map.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: false });
          hoveredId = null;
        }
      });

      map.on("click", LAYER_ID, (e) => {
        const nodeId = e.features?.[0]?.properties?.node_id as string | undefined;
        if (!nodeId) return;
        const node = nodesRef.current.find((n) => n.node_id === nodeId);
        if (node) onSelectRef.current(node);
      });
    });

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

  // Update source data when nodes or selectedNodeId changes — no markers removed
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
      if (source) source.setData(buildGeoJSON(nodes, selectedNodeId));
    };

    if (map.isStyleLoaded()) {
      apply();
    } else {
      map.once("load", apply);
    }
  }, [nodes, selectedNodeId]);

  return <div ref={containerRef} className="w-full h-full" />;
}
