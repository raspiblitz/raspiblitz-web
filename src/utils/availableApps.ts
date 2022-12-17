import { App } from "../models/app.model";

export const availableApps: Map<string, App> = new Map([
  [
    "btc-rpc-explorer",
    {
      id: "btc-rpc-explorer",
      name: "BTC RPC Explorer",
      author: "janoside",
      version: "v3.3.0",
      repository: "https://github.com/janoside/btc-rpc-explorer",
    },
  ],
  [
    "rtl",
    {
      id: "rtl",
      name: "Ride the Lightning",
      author: "Shahana Farooqui",
      repository: "https://github.com/Ride-The-Lightning/RTL",
    },
  ],
  [
    "specter",
    {
      id: "specter",
      name: "Specter",
      author: "Specter Solutions",
      repository: "https://github.com/cryptoadvance/specter-desktop",
    },
  ],
  [
    "btcpayserver",
    {
      id: "btcpayserver",
      name: "BTCPay Server",
      author: "BTCPay Server",
      repository: "https://github.com/btcpayserver/btcpayserver",
    },
  ],
  [
    "lnbits",
    {
      id: "lnbits",
      name: "LNbits",
      author: "arcbtc",
      repository: "https://github.com/lnbits/lnbits",
    },
  ],
  [
    "mempool",
    {
      id: "mempool",
      name: "Mempool.space",
      author: "The Mempool Open Source Project",
      repository: "https://github.com/mempool/mempool",
    },
  ],
  [
    "thunderhub",
    {
      id: "thunderhub",
      name: "Thunderhub",
      author: "apotdevin",
      repository: "https://github.com/apotdevin/thunderhub",
    },
  ],
]);
