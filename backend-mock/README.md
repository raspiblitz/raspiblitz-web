# Mock Backend for Raspiblitz web

This is a mock backend for raspiblitz web to make interaction with the frontend easier while there is no web api available.

## Usage

Install dependencies with `yarn install` then run with `yarn start`.

This exposes a WebSocket to `localhost:8080` and a REST endpoint on `localhost:8081`.

## API

The messages to the WebSocket should look like this:

```json
{
  "id": "<someid>" // identifier to request data
}
```

Currently the ID requests the following:

- `syncstatus`: syncstatus of blockchain & sync stats like open channels etc
- `transactions`: transactions (on-chain & lightning)
- `appstatus`: online / offline status of the installed apps

REST API:

- `/receive` - returns an address for receiving paymen
- `/send` - send payment
