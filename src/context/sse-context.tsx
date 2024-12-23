import type { AppStatus } from "@/models/app-status";
import type { App } from "@/models/app.model";
import type { BtcInfo } from "@/models/btc-info";
import type { HardwareInfo } from "@/models/hardware-info";
import type { LnInfo } from "@/models/ln-info";
import type { SystemInfo } from "@/models/system-info";
import type { SystemStartupInfo } from "@/models/system-startup-info";
import type { Transaction } from "@/models/transaction.model";
import type { WalletBalance } from "@/models/wallet-balance";
import type { FC, PropsWithChildren } from "react";
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useState,
} from "react";

export interface SSEContextType {
  evtSource: EventSource | null;
  setEvtSource: Dispatch<SetStateAction<EventSource | null>>;
  systemInfo: SystemInfo;
  setSystemInfo: Dispatch<SetStateAction<SystemInfo>>;
  btcInfo: BtcInfo;
  setBtcInfo: Dispatch<SetStateAction<BtcInfo>>;
  lnInfo: LnInfo;
  setLnInfo: Dispatch<SetStateAction<LnInfo>>;
  balance: WalletBalance;
  setBalance: Dispatch<SetStateAction<WalletBalance>>;

  appStatus: AppStatus[];
  setAppStatus: Dispatch<SetStateAction<AppStatus[]>>;
  availableApps: App[];
  setAvailableApps: Dispatch<SetStateAction<App[]>>;
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  installingApp: any | null;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  setInstallingApp: Dispatch<SetStateAction<any | null>>;
  hardwareInfo: HardwareInfo | null;
  setHardwareInfo: Dispatch<SetStateAction<HardwareInfo | null>>;
  systemStartupInfo: SystemStartupInfo | null;
  setSystemStartupInfo: Dispatch<SetStateAction<SystemStartupInfo | null>>;
}

export const sseContextDefault: SSEContextType = {
  evtSource: null,
  setEvtSource: () => {},
  systemInfo: {} as SystemInfo,
  setSystemInfo: () => {},
  btcInfo: {} as BtcInfo,
  setBtcInfo: () => {},
  balance: {} as WalletBalance,
  lnInfo: {} as LnInfo,
  setLnInfo: () => {},
  setBalance: () => {},
  appStatus: [],
  setAppStatus: () => {},
  availableApps: [],
  setAvailableApps: () => {},
  transactions: [],
  setTransactions: () => {},
  installingApp: null,
  setInstallingApp: () => {},
  hardwareInfo: {} as HardwareInfo,
  setHardwareInfo: () => {},
  systemStartupInfo: {} as SystemStartupInfo,
  setSystemStartupInfo: () => {},
};

export const SSEContext = createContext<SSEContextType>(sseContextDefault);

export const SSE_URL = "/api/sse/subscribe";

const SSEContextProvider: FC<PropsWithChildren> = (props) => {
  const [evtSource, setEvtSource] = useState<EventSource | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    alias: "",
    color: "",
    platform: "",
    platform_version: "",
    api_version: "",
    chain: "",
    lan_api: "",
    lan_web_ui: "",
    ssh_address: "",
    tor_api: "",
    tor_web_ui: "",
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
  const [lnInfo, setLnInfo] = useState<LnInfo>({
    alias: "",
    best_header_timestamp: 0,
    block_hash: "",
    color: "",
    commit_hash: "",
    num_peers: 0,
    block_height: 0,
    implementation: null,
    identity_pubkey: "",
    identity_uri: "",
    num_active_channels: 0,
    num_inactive_channels: 0,
    num_pending_channels: 0,
    synced_to_chain: false,
    synced_to_graph: false,
    version: "",
    chains: [],
    uris: [],
    features: [],
  });
  const [balance, setBalance] = useState<WalletBalance>({
    onchain_total_balance: null,
    onchain_unconfirmed_balance: null,
    onchain_confirmed_balance: null,
    channel_local_balance: null,
    channel_pending_open_local_balance: null,
    channel_pending_open_remote_balance: null,
    channel_remote_balance: null,
    channel_unsettled_local_balance: null,
    channel_unsettled_remote_balance: null,
  });
  const [appStatus, setAppStatus] = useState<AppStatus[]>([]);
  const [availableApps, setAvailableApps] = useState<App[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [installingApp, setInstallingApp] = useState<any | null>(null);
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null);
  const [systemStartupInfo, setSystemStartupInfo] =
    useState<SystemStartupInfo | null>(null);

  const contextValue: SSEContextType = {
    evtSource,
    setEvtSource,
    systemInfo,
    setSystemInfo,
    btcInfo,
    setBtcInfo,
    lnInfo: lnInfo,
    setLnInfo: setLnInfo,
    balance,
    setBalance,
    appStatus,
    setAppStatus,
    availableApps,
    setAvailableApps,
    transactions,
    setTransactions,
    installingApp,
    setInstallingApp,
    hardwareInfo,
    setHardwareInfo,
    systemStartupInfo,
    setSystemStartupInfo,
  };

  return (
    <SSEContext.Provider value={contextValue}>
      {props.children}
    </SSEContext.Provider>
  );
};

export default SSEContextProvider;
