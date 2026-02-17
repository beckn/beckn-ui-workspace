# Beckn Hub

Production-ready scaffold for Beckn 2.0. No dependency on workspace packages; all services, payloads, Redux, template processor, and data mapping are in-app and independent.

## Structure

- **lib/types/beckn-2.0** – Context, discover, select, init, confirm types (plain keys).
- **lib/payloads/beckn-2.0** – Independent payload builders: `buildDiscoverPayload`, `buildSelectPayload`, `buildInitPayload`, `buildConfirmPayload`.
- **services/beckn** – Independent API clients: `callDiscover`, `callSelect`, `callInit`, `callConfirm` (axios, no shared RTK API).
- **services/templateProcessor** – `processTemplate(rendererConfig, data)` for renderer.json + data → render-ready output.
- **services/dataMapping** – `mapDiscoverResponse`, `mapDiscoverCatalogs`, `mapOrderToDisplay` for API → template/UI shape.
- **store** – Redux Toolkit: discover, select, init, confirm slices; store configured in-app.
- **utils** – Config (e.g. `NEXT_PUBLIC_BECKN_API_URL`).

## Env

Copy `.env.example` to `.env` and set `NEXT_PUBLIC_BECKN_API_URL` (gateway/BAP API base URL).

## Scripts

- `yarn dev` – Next dev (port 3001)
- `yarn build` – Next build
- `yarn start` – Next start (port 3001)

From repo root: `yarn dev:beckn-hub`, `yarn build:beckn-hub`, `yarn start:beckn-hub`.

## Docker

`docker build -t beckn-hub .` then run with `NEXT_PUBLIC_BECKN_API_URL` set. Uses Next standalone output.
