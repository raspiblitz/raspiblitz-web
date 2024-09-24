import { WEBSOCKET_URL } from "@/hooks/use-ws";
import { AppStatus } from "@/models/app-status";
import { App } from "@/models/app.model";
import { BtcInfo } from "@/models/btc-info";
import { HardwareInfo } from "@/models/hardware-info";
import { LnInfo } from "@/models/ln-info";
import { SystemInfo } from "@/models/system-info";
import { SystemStartupInfo } from "@/models/system-startup-info";
import { Transaction } from "@/models/transaction.model";
import { WalletBalance } from "@/models/wallet-balance";
import type { FC, PropsWithChildren } from "react";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useRef,
  useEffect,
} from "react";

export interface WebSocketContextType {
  websocket: WebSocket | null;
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
  installingApp: any | null;
  setInstallingApp: Dispatch<SetStateAction<any | null>>;
  hardwareInfo: HardwareInfo | null;
  setHardwareInfo: Dispatch<SetStateAction<HardwareInfo | null>>;
  systemStartupInfo: SystemStartupInfo | null;
  setSystemStartupInfo: Dispatch<SetStateAction<SystemStartupInfo | null>>;
}

export const websocketContextDefault: WebSocketContextType = {
  websocket: null,
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

export const WebSocketContext = createContext<WebSocketContextType>(
  websocketContextDefault,
);

const WebSocketContextProvider: FC<PropsWithChildren> = (props) => {
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
  const [installingApp, setInstallingApp] = useState<any | null>(null);
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null);
  const [systemStartupInfo, setSystemStartupInfo] =
    useState<SystemStartupInfo | null>(null);

  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "system_info":
          setSystemInfo((prevState) => ({ ...prevState, ...data.data }));
          break;
        case "btc_info":
          setBtcInfo((prevState) => ({ ...prevState, ...data.data }));
          break;
        case "ln_info":
          setLnInfo((prevState) => ({ ...prevState, ...data.data }));
          break;
        case "wallet_balance":
          setBalance((prevState) => ({ ...prevState, ...data.data }));
          break;
        case "app_status":
          setAppStatus(data.data);
          break;
        case "available_apps":
          setAvailableApps(data.data);
          break;
        case "transaction":
          setTransactions((prevState) => [data.data, ...prevState]);
          break;
        case "installing_app":
          setInstallingApp(data.data);
          break;
        case "hardware_info":
          setHardwareInfo(data.data);
          break;
        case "system_startup_info":
          setSystemStartupInfo(data.data);
          break;
        default:
          console.warn("Unknown message type:", data.type);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    websocketRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const contextValue: WebSocketContextType = {
    websocket: websocketRef.current,
    systemInfo,
    setSystemInfo,
    btcInfo,
    setBtcInfo,
    lnInfo,
    setLnInfo,
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
    <WebSocketContext.Provider value={contextValue}>
      {props.children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContextProvider;
