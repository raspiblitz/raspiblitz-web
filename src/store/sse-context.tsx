import { createContext, Dispatch, FC, SetStateAction, useState } from "react";
import { AppStatus } from "../models/app-status";
import { App } from "../models/app.model";
import { BtcInfo } from "../models/btc-info";
import { LnStatus } from "../models/ln-status";
import { SystemInfo } from "../models/system-info";
import { Transaction } from "../models/transaction.model";
import { WalletBalance } from "../models/wallet-balance";

interface SSEContextType {
  evtSource: EventSource | null;
  setEvtSource: Dispatch<SetStateAction<EventSource | null>>;
  systemInfo: Partial<SystemInfo>;
  setSystemInfo: Dispatch<SetStateAction<SystemInfo>>;
  btcInfo: Partial<BtcInfo>;
  setBtcInfo: Dispatch<SetStateAction<BtcInfo>>;
  lnStatus: Partial<LnStatus>;
  setLnStatus: Dispatch<SetStateAction<LnStatus>>;
  balance: Partial<WalletBalance>;
  setBalance: Dispatch<SetStateAction<WalletBalance>>;

  appStatus: AppStatus[];
  setAppStatus: Dispatch<SetStateAction<AppStatus[]>>;
  availableApps: App[];
  setAvailableApps: Dispatch<SetStateAction<App[]>>;
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  isInstalling: string | null;
  setIsInstalling: Dispatch<SetStateAction<string | null>>;
}

export const SSEContext = createContext<SSEContextType>({
  evtSource: null,
  setEvtSource: () => {},
  systemInfo: {},
  setSystemInfo: () => {},
  btcInfo: {},
  setBtcInfo: () => {},
  balance: {},
  lnStatus: {},
  setLnStatus: () => {},
  setBalance: () => {},
  appStatus: [],
  setAppStatus: () => {},
  availableApps: [],
  setAvailableApps: () => {},
  transactions: [],
  setTransactions: () => {},
  isInstalling: null,
  setIsInstalling: () => {},
});

export const SSE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:8000/api/sse/subscribe"
  : "/api/sse/subscribe";

const SSEContextProvider: FC = (props) => {
  const [evtSource, setEvtSource] = useState<EventSource | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    alias: "",
    color: "",
    chain: "",
    health: "",
    health_messages: [],
    lan_api: "",
    lan_web_ui: "",
    ssh_address: "",
    tor_api: "",
    tor_web_ui: "",
    version: "",
  });
  const [btcInfo, setBtcInfo] = useState<BtcInfo>({
    blocks: 0,
    connections_in: 0,
    connections_out: 0,
    difficulty: 0,
    headers: 0,
    networks: [],
    size_on_disk: 0,
    subversion: "",
    verification_progress: 0,
    version: 0,
  });
  const [lnStatus, setLnStatus] = useState<LnStatus>({
    block_height: 0,
    implementation: "",
    num_active_channels: 0,
    num_inactive_channels: 0,
    num_pending_channels: 0,
    synced_to_chain: false,
    synced_to_graph: false,
    version: "",
  });
  const [balance, setBalance] = useState<WalletBalance>({
    onchain_total_balance: 0,
    onchain_unconfirmed_balance: 0,
    onchain_confirmed_balance: 0,
    channel_local_balance: 0,
    channel_pending_open_local_balance: 0,
    channel_pending_open_remote_balance: 0,
    channel_remote_balance: 0,
    channel_unsettled_local_balance: 0,
    channel_unsettled_remote_balance: 0,
  });
  const [appStatus, setAppStatus] = useState<AppStatus[]>([]);
  const [availableApps, setAvailableApps] = useState<App[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isInstalling, setIsInstalling] = useState<string | null>(null);

  const contextValue: SSEContextType = {
    evtSource,
    setEvtSource,
    systemInfo,
    setSystemInfo,
    btcInfo,
    setBtcInfo,
    lnStatus,
    setLnStatus,
    balance,
    setBalance,
    appStatus,
    setAppStatus,
    availableApps,
    setAvailableApps,
    transactions,
    setTransactions,
    isInstalling,
    setIsInstalling,
  };

  return (
    <SSEContext.Provider value={contextValue}>
      {props.children}
    </SSEContext.Provider>
  );
};

export default SSEContextProvider;
