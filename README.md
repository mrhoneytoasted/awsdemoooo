# AWS Water Station Dashboard

Next.js App Router dashboard for an Adaptive water station fleet. The frontend is ready to deploy on Vercel and currently uses demonstration data so the interface can be reviewed before a station API is connected.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The fleet dashboard is at `/dashboard`; the welcome page is at `/`.

## Main routes

- `/dashboard` — fleet overview and water usage
- `/station` — station management
- `/station/aws-01` — individual station dashboard; use the station navigation for sensors, tank management, water analysis, settings, and station alerts
- `/alert` — fleet alert management

Alert edits are stored in browser local storage for this demo. Sensor readings, station inventory, and usage charts are sample data; connect the UI to your API before using it for live operations.

## Cloud telemetry integration

The fleet dashboard reads the latest `test-node-01` telemetry sample every 4 seconds through a same-origin Next.js route handler. The API base URL is set in `src/app/api/telemetry/latest/route.ts`. The displayed `demo_value` is labeled as simulated data and has no unit assigned.