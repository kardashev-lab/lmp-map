# LMP Map

Interactive nodal electricity price map for all US ISOs. Live prices at hub and zone nodes, color-coded by price, with 14-day history on click.

**Live:** [lmp-map.kardashevlabs.org](https://lmp-map.kardashevlabs.org)

---

## What it shows

Real-time locational marginal prices (LMP) from NYISO, ERCOT, MISO, SPP, and CAISO. Nodes are color-coded green to red by price. Click any node to see a 14-day price history chart broken down into energy, congestion, and loss components.

Prices refresh every 60 seconds.

---

## Stack

| Layer | Tech |
|---|---|
| UI | Next.js, Tailwind CSS, MapLibre GL JS |
| Map tiles | CARTO Voyager (no API key) |
| Charts | ECharts |
| Data | [kardashev-data](https://data.kardashevlabs.org) REST API |

---

## Running locally

```bash
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_BASE
npm run dev
```

Open http://localhost:3000

---

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE` | Base URL for the kardashev-data API |

---

## License

MIT
