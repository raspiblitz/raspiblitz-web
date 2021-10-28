# Raspiblitz Web

![Raspiblitz Dashboard](images/blitz_home.png)

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

### Dev workflow

#### Frontend

```sh
yarn install
yarn start
```

##### Notes on Login and auth

For the login screen, use the password `password`.

#### [Mock backend](./backend-mock)

Open another terminal

```sh
cd backend-mock
yarn install
yarn start
```

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
