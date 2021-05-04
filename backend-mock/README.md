# Mock Backend for Raspiblitz web

This is a mock backend for raspiblitz web to make interaction with the frontend easier while there is no web api available.

## Usage

Install dependencies (just `ws` for node WebSocket support) with `yarn install` then run with `yarn start`.

This exposes a WebSocket to `localhost:8080`;

## API

The messages to the WebSocket should look like this:

```json
{
  "id": '<someid>' // identifier to request data
}
```

Currently the ID requests the following:

- 'syncstatus': syncstatus of bitcoind and lnd
- 2: bitcoin transactions
- 3: lightning transactions
- 4: bitcoin receive payment
- 5: bitcoin send payment
