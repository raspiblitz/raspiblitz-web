# Mock Backend for Raspiblitz web

This is a mock backend for raspiblitz web to make interaction with the frontend easier.

Data it returns is based on [blitz_api](https://github.com/fusion44/blitz_api).

## Usage

Install dependencies with `npm ci` then run with `npm run start`.

This exposes the web server on `localhost:8000`.

Realtime updates use `/api/ws`. Send `{ "type": "auth", "token": "mock-token" }` as the first message; the mock accepts any nonempty token. Initial snapshots go only to that client, while later updates are broadcast to authenticated clients.

Run `npm test` here (or `npm test --prefix backend-mock` from the repository root) to verify warmup isolation, broadcasts, disconnect cleanup, and malformed authentication.
