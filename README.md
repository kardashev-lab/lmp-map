# LMP Map

Interactive nodal electricity price map for the major US ISOs/RTOs. Live prices at hub and zone nodes, color-coded by price, with 14-day history on click.

**Live:** [lmp-map.kardashevlabs.org](https://lmp-map.kardashevlabs.org)

---

## What it shows

Real-time locational marginal prices (LMP) from PJM, CAISO, NYISO, MISO, ERCOT, SPP, and ISO-NE. Nodes are color-coded green to red by price. Toggle between real-time (RT) and day-ahead (DA) markets. Click any node to see a 14-day price history chart broken down into energy, congestion, and loss components.

Prices refresh every 60 seconds.

---

## Stack

| Layer | Tech |
|---|---|
| UI | Next.js 16, React 19, Tailwind CSS, MapLibre GL JS |
| Map tiles | CARTO dark basemap (no API key) |
| Charts | ECharts (`echarts-for-react`) |
| Data | [kardashev-data](https://data.kardashevlabs.org) REST API, proxied through a Next.js API route to avoid browser CORS issues |

The first page load is server-rendered with real node data (for the default ISO/market) so crawlers and AI agents see actual prices instead of an empty map shell; the client then takes over with SWR polling every 60s.

---

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

The app talks to the production `data.kardashevlabs.org` API by default — no local env setup is required to get it running.

---

## Environment variables

| Variable | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Base URL used for metadata, `robots.ts`, and `sitemap.ts` | No — defaults to `https://lmp-map.kardashevlabs.org` |

The upstream data API URL (`https://data.kardashevlabs.org`) is currently hardcoded in `lib/api.ts` and the `/api/proxy` route rather than configurable via env var.

---

## License

MIT
