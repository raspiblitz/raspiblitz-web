# Mock Backend for Raspiblitz web

This is a mock backend for raspiblitz web to make interaction with the frontend easier while there is no web api available.

## Usage

Install dependencies with `yarn install` then run with `yarn start`.

This exposes the web server on `localhost:8080`.

## API

- `/receive` - returns an address for receiving payment
  - expects: `type`: 'lightning' for ln invoice or 'onchain' for onchain address
  - expects: `amount`: amount for the invoice (only 'lightning' type)
  - expects: `comment` comment for the invoice (only 'lightning' type)
- `/send` - send payment
- `/tx/:id` - returns details for a specific transactionID
- `/reboot` - for rebooting the system
- `/changepw` - for changing the password
- `/shutdown` - for shutting the system down
- `/events` - registers client for SSE Events. Related Endpoints:
  - `/transactions` - triggers SSE Event for transactions
  - `/syncstatus` - triggers SSE Event for syncstatus
  - `/appstatus` - triggers SSE Event for syncstatus
  - `/apps` - triggers SSE Event for apps (name, description, installed)

### SSE Events

- `syncstatus`
- `appstatus`
- `transactions`
- `apps`
