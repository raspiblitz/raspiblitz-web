# Raspiblitz Web

![Raspiblitz Dashboard](preview.png)

Images of the progress can be found at [raspiblitz-web-progress](https://github.com/cstenglein/raspiblitz-web-progress)

A mobile-first responsive Web UI for the [RaspiBlitz](https://github.com/rootzoll/raspiblitz).

In collaboration with [Bitcoin Design](https://bitcoin.design/).

Built with [React](https://reactjs.org/) & [Tailwind CSS](https://tailwindcss.com/).

## Translations

If you want to bring the Raspiblitz WebUI to other languages, please help us translate it via [Weblate](https://hosted.weblate.org/projects/raspiblitz-web/translations/) :)

Big thanks to our translators, which you can find in detail in this [README](src/i18n/README.md)

## Development

### Dependencies

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [nvm](https://github.com/nvm-sh/nvm#intro) is suppported but not required

#### Update npm dependencies

```sh
yarn upgrade-interactive
```

If you notice several versions of a dep in the `yarn.lock`-file:

```sh
yarn dedupe
```

Further info: https://dev.to/arcanis/yarn-2-2-dedupe-faster-lighter-ha5#dedupe-command

### Dev workflow

#### Frontend

```sh
yarn install
yarn start
```

#### Backend

For the backend, there currently exist two options:

- Using the provided [Mock backend](#mock-backend)
  - Easy to setup, but limited data
- Using [blitz_api](#blitz-api) with Polar
  - Some changes needed for local development
  - Possibly more data (depending on your ln setup :) )

##### Mock backend

See [backend-mock folder](./backend-mock)

Open another terminal

```sh
cd backend-mock
yarn install
yarn start
```

Then go to `http://localhost:3000` and use the password `password`.

##### Blitz API

This guide uses Polar for easier development, but you can also use a real lightning node.

- First, download [Polar](https://lightningpolar.com/) and get it to run.
  - Create at least one bitcoin and one lightning node.
- Next, clone the [blitz_api](https://github.com/fusion44/blitz_api), install the dependencies.
  - In addition, you will need [redis](https://redis.io/) installed for `blitz_api` to work.
- Create a `.env` file (see [.env_sample in blitz_api](https://github.com/fusion44/blitz_api/blob/main/.env_sample)) and copy the bitcoin and ln info into it.
  - Important: When definining `shell_script_path` you need to define a directory where a folder called `config.scripts` and a file called `blitz.debug.sh` reside in. Otherwise `blitz_api` may not work (used on the RaspiBlitz for logging)
- Make the following change in `blitz_api`:
  - In [main/app/main.py](https://github.com/fusion44/blitz_api/blob/main/app/main.py#L48), change the `prefix_format` from `/v{major}` to `/api/v{major}`.

Now you can start the `blitz_api` and run `yarn start` in raspiblitz-web.

Please do not commit the above changes.

### Linting

[eslint](https://eslint.org) and [prettier](https://prettier.io) will be used accoring to the [create-react-app docs](https://create-react-app.dev/docs/setting-up-your-editor)

## Credits & Licenses

- RaspiBlitz Icon from [RaspiBlitz](https://github.com/rootzoll/raspiblitz)
  - [MIT License](https://github.com/rootzoll/raspiblitz/blob/v1.7/LICENSE)
- Bitcoin, Send & Flip vertical Icon from [BitcoinDesign](https://github.com/bitcoindesign/bitcoin-icons)
  - [MIT License](https://github.com/BitcoinDesign/Bitcoin-Icons/blob/main/LICENSE)
- Other icons from [Hero Icons](https://heroicons.com/)
  - [MIT License](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE)
- `qrcode.react` to display QR Codes [lukehaas/css-loaders](https://github.com/zpao/qrcode.react)
  - [ISC License](https://github.com/zpao/qrcode.react/blob/master/LICENSE)
- CSS Loading Spinner from [loading.io](https://loading.io/css/)
  - [CC0 License](https://loading.io/css/)

### App logos

- Sphinx Logo from [Sphinx Chat](https://sphinx.chat/)
  - [MIT License](https://github.com/stakwork/sphinx-relay/blob/master/LICENSE)
- BTC RPC Logo from [Bitcoin Explorer](https://bitcoinexplorer.org)
  - [MIT License](https://github.com/janoside/btc-rpc-explorer)
- BTCPay Logo from [btcpayserver](https://github.com/btcpayserver/btcpayserver)
  - [MIT License](https://github.com/btcpayserver/btcpayserver/blob/master/LICENSE)
- LNDManage Logo from [lndmanage](https://github.com/bitromortac/lndmanage)
  - [MIT License](https://github.com/bitromortac/lndmanage/blob/master/LICENSE)
- RTL Logo from [RTL](https://github.com/Ride-The-Lightning/RTL)
  - [MIT License](https://github.com/Ride-The-Lightning/RTL/blob/master/LICENSE)
- Specter Logo from [specter-desktop](https://github.com/cryptoadvance/specter-desktop)
  - [MIT License](https://github.com/cryptoadvance/specter-desktop/blob/master/LICENSE)
- Mempool.space Logo from [mempool](https://github.com/mempool/mempool)
  - [Mempool.space Trademark Policy](https://mempool.space/trademark-policy)
- LNbits Logo from [lnbits-legend](https://github.com/lnbits/lnbits-legend)
  - [MIT License](https://github.com/lnbits/lnbits-legend/blob/master/LICENSE)
