const util = require('./util');
const fs = require('fs');

const listApps = () => {
  console.log('call to apps');
  util.sendSSE('apps', [
    {
      id: 'sphinx',
      name: 'Sphinx Chat',
      description: 'Chat and pay over the Lightning Network',
      installed: true,
      address: 'https://192.168.0.599:4081/',
      hiddenService: 'blablablabla.onion'
    },
    { id: 'btc-rpc-explorer', name: 'BTC RPC Explorer', description: 'Bitcoin RPC Explorer', installed: false },
    {
      id: 'rtl',
      name: 'Ride the Lightning',
      description: 'Ride The Lightning - A full function web browser app for LND, C-Lightning and Eclair',
      installed: true,
      address: 'http://192.168.0.113:599/rtl/login',
      hiddenService: 'blablablabla.onion'
    },
    {
      id: 'specter',
      name: 'Specter Desktop',
      description: 'A desktop GUI for Bitcoin Core optimised to work with hardware wallets',
      installed: false
    },
    {
      id: 'btc-pay',
      name: 'BTCPay Server',
      description: 'Accept Bitcoin payments. Free, open-source & self-hosted, Bitcoin payment processor',
      installed: false
    },
    {
      id: 'electrs',
      name: 'ElectRS',
      description: 'An efficient re-implementation of Electrum Server in Rust',
      installed: true,
      address: null,
      hiddenService: null
    },
    {
      id: 'lndmanage',
      name: 'lndmanage',
      description: 'Channel management tool for lightning network daemon (LND) operators',
      installed: false
    },
    {
      id: 'joinmarket',
      name: 'Joinmarket',
      description: 'CoinJoin implementation with incentive structure to convince people to take part',
      installed: false
    },
    {
      id: 'lnbits',
      name: 'LNBits',
      description: 'LNBits, free and open-source lightning-network wallet/accounts system',
      installed: false
    },
    {
      id: 'mempool',
      name: 'Mempool Space',
      description: 'An open-source explorer developed for the Bitcoin community',
      installed: true,
      address: 'https://192.168.0.599:4081/',
      hiddenService: 'blablablabla.onion'
    },
    {
      id: 'bos',
      name: 'Balance of Satoshis',
      description: 'Tool for working with the balance of your satoshis on LND',
      installed: false
    }
  ]);
};

const installApp = () => {
  console.log('call to installApp');
  util.sendSSE('apps', [
    {
      id: 'btc-pay',
      name: 'BTCPay Server',
      description: 'Accept Bitcoin payments. Free, open-source & self-hosted, Bitcoin payment processor',
      installed: true,
      address: 'https://192.168.0.599:4081/',
      hiddenService: 'blablablabla.onion'
    }
  ]);
  // inform Frontend that no apps are currently installing
  util.sendSSE('install', { id: null });
};

const appDetails = (req) => {
  const img1 =
    'data:image/png;base64,' + Buffer.from(fs.readFileSync('images/btc-rpc-1.png'), 'binary').toString('base64');
  const img2 =
    'data:image/png;base64,' + Buffer.from(fs.readFileSync('images/btc-rpc-2.png'), 'binary').toString('base64');
  const img3 =
    'data:image/png;base64,' + Buffer.from(fs.readFileSync('images/btc-rpc-3.png'), 'binary').toString('base64');
  const details = {
    id: req.params.id,
    name: 'BTC RPC Explorer',
    author: 'Dan Janosik',
    description: getDescription(),
    repository: 'https://github.com/janoside/btc-rpc-explorer',
    version: '1.2.3',
    images: [img1, img2, img3],
    installed: true
  };
  return details;
};

module.exports = { listApps, installApp, appDetails };

const getDescription = () => {
  return 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
};
