import type { App } from "@/models/app.model";
import { AppId, isAppId } from "@/models/app-status";
import Electrs from "@/pages/Apps/customApps/Electrs";

export const availableApps: Record<AppId, App> = {
  [AppId.BTC_RPC_EXPLORER]: {
    id: AppId.BTC_RPC_EXPLORER,
    name: "BTC RPC Explorer",
    author: "janoside",
    repository: "https://github.com/janoside/btc-rpc-explorer",
  },
  [AppId.RTL]: {
    id: AppId.RTL,
    name: "Ride the Lightning",
    author: "Shahana Farooqui",
    repository: "https://github.com/Ride-The-Lightning/RTL",
  },
  [AppId.SPECTER]: {
    id: AppId.SPECTER,
    name: "Specter",
    author: "Specter Solutions",
    repository: "https://github.com/cryptoadvance/specter-desktop",
  },
  [AppId.BTCPAYSERVER]: {
    id: AppId.BTCPAYSERVER,
    name: "BTCPay Server",
    author: "BTCPay Server",
    repository: "https://github.com/btcpayserver/btcpayserver",
  },
  [AppId.LNBITS]: {
    id: AppId.LNBITS,
    name: "LNbits",
    author: "arcbtc",
    repository: "https://github.com/lnbits/lnbits",
  },
  [AppId.MEMPOOL]: {
    id: AppId.MEMPOOL,
    name: "Mempool.space",
    author: "The Mempool Open Source Project",
    repository: "https://github.com/mempool/mempool",
  },
  [AppId.THUNDERHUB]: {
    id: AppId.THUNDERHUB,
    name: "Thunderhub",
    author: "apotdevin",
    repository: "https://github.com/apotdevin/thunderhub",
  },
  [AppId.JAM]: {
    id: AppId.JAM,
    name: "Jam",
    author: "Jam Team",
    repository: "https://github.com/joinmarket-webui/jam",
  },
  [AppId.ELECTRS]: {
    id: AppId.ELECTRS,
    name: "ElectRs",
    author: "romanz",
    repository: "https://github.com/romanz/electrs",
    customComponent: Electrs,
  },
  [AppId.ALBYHUB]: {
    id: AppId.ALBYHUB,
    name: "Alby Hub",
    author: "Alby",
    repository: "https://github.com/getAlby/hub",
  },
};

export { isAppId };
