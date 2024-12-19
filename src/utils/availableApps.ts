import { App } from "@/models/app.model";
import Electrs from "@/pages/Apps/customApps/Electrs";

export const availableApps: { [name: string]: App } = {
  "btc-rpc-explorer": {
    id: "btc-rpc-explorer",
    name: "BTC RPC Explorer",
    author: "janoside",
    repository: "https://github.com/janoside/btc-rpc-explorer",
  },
  rtl: {
    id: "rtl",
    name: "Ride the Lightning",
    author: "Shahana Farooqui",
    repository: "https://github.com/Ride-The-Lightning/RTL",
  },
  specter: {
    id: "specter",
    name: "Specter",
    author: "Specter Solutions",
    repository: "https://github.com/cryptoadvance/specter-desktop",
  },
  btcpayserver: {
    id: "btcpayserver",
    name: "BTCPay Server",
    author: "BTCPay Server",
    repository: "https://github.com/btcpayserver/btcpayserver",
  },
  lnbits: {
    id: "lnbits",
    name: "LNbits",
    author: "arcbtc",
    repository: "https://github.com/lnbits/lnbits",
  },
  mempool: {
    id: "mempool",
    name: "Mempool.space",
    author: "The Mempool Open Source Project",
    repository: "https://github.com/mempool/mempool",
  },
  thunderhub: {
    id: "thunderhub",
    name: "Thunderhub",
    author: "apotdevin",
    repository: "https://github.com/apotdevin/thunderhub",
  },
  jam: {
    id: "jam",
    name: "Jam",
    author: "Jam Team",
    repository: "https://github.com/joinmarket-webui/jam",
  },
  electrs: {
    id: "electrs",
    name: "ElectRs",
    author: "romanz",
    repository: "https://github.com/romanz/electrs",
    customComponent: Electrs,
  },
  albyhub: {
    id: "albyhub",
    name: "Alby Hub",
    author: "Alby",
    repository: "https://github.com/getAlby/hub",
  },
};
