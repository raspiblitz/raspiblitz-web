const util = require('./util');

const appStatus = () => {
  console.log('call to appstatus');
  util.sendSSE('appstatus', [
    {
      id: 'specter',
      name: 'Specter Desktop',
      status: 'online'
    },
    {
      id: 'sphinx',
      name: 'Sphinx Chat',
      status: 'online'
    },
    {
      id: 'btc-pay',
      name: 'BTCPay Server',
      status: 'offline'
    },
    {
      id: 'rtl',
      name: 'Ride the Lightning',
      status: 'online'
    },
    {
      id: 'bos',
      name: 'Balance of Satoshis',
      status: 'offline'
    }
  ]);
};

const listApps = () => {
  console.log('call to apps');
  util.sendSSE('apps', [
    { id: 'sphinx', name: 'Sphinx Chat', description: 'Chat and pay over the Lightning Network', installed: true },
    { id: 'btc-rpc-explorer', name: 'BTC RPC Explorer', description: 'Bitcoin RPC Explorer', installed: false },
    {
      id: 'rtl',
      name: 'Ride the Lightning',
      description: 'Ride The Lightning - A full function web browser app for LND, C-Lightning and Eclair',
      installed: true
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
      installed: true
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
      installed: true
    },
    {
      id: 'bos',
      name: 'Balance of Satoshis',
      description: 'Tool for working with the balance of your satoshis on LND',
      installed: false
    }
  ]);
};

module.exports = { appStatus, listApps };
