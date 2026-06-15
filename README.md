# Fleet Tracking Platform

This repository contains two projects:

- `fleet-frontend`: React + TypeScript frontend for fleet administration and driver workflows.
- `fleet-backend`: Node.js + Express backend with in-memory data to support the frontend.

## Setup

1. Install dependencies for both projects:
   - `cd fleet-backend && npm install`
   - `cd ../fleet-frontend && npm install`

2. Start the backend server:
   - `cd fleet-backend && npm run dev`

3. Start the frontend app:
   - `cd fleet-frontend && npm run dev`

4. Open the app in the browser at the URL shown by Vite.

## Testing

- Run frontend tests: `cd fleet-frontend && npm test`

## Available UI flows

- Admin dashboard: manage hubs, terminals, drivers, vehicles, products, orders, allocations, inventory, and fleet map.
- Driver interface: start a shift, update GPS, complete or fail deliveries, and view shift history.

## Notes

- The backend uses in-memory data and persists only while the server runs.
- The frontend uses React Router and Leaflet for mapping.
- Documentation is available in `docs/`.
