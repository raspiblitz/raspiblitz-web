import type { FC, PropsWithChildren } from "react";
import { createContext, type Dispatch, type SetStateAction, useRef, useState } from "react";
import type { App } from "@/models/app.model";
import type { AppStatusQueryResponse } from "@/models/app-status";
import type { BtcInfo } from "@/models/btc-info";
import type { HardwareInfo } from "@/models/hardware-info";
import type { InstallMode, InstallationStatus } from "@/models/installation-status";
import type { LnInfo } from "@/models/ln-info";
import type { SystemInfo } from "@/models/system-info";
import type { SystemStartupInfo } from "@/models/system-startup-info";
import type { Transaction } from "@/models/transaction.model";
import type { WalletBalance } from "@/models/wallet-balance";

import { toast } from "react-toastify";
import { isAppId } from "@/utils/availableApps";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { applyInstallationMessage, parseInstallationMessage } from "@/utils/installation-state";

export interface RealtimeContextType {
  socket: WebSocket | null;
  setSocket: Dispatch<SetStateAction<WebSocket | null>>;
  systemInfo: SystemInfo;
  setSystemInfo: Dispatch<SetStateAction<SystemInfo>>;
  btcInfo: BtcInfo;
  setBtcInfo: Dispatch<SetStateAction<BtcInfo>>;
  lnInfo: LnInfo;
  setLnInfo: Dispatch<SetStateAction<LnInfo>>;
  balance: WalletBalance;
  setBalance: Dispatch<SetStateAction<WalletBalance>>;

  appStatus: AppStatusQueryResponse;
  setAppStatus: Dispatch<SetStateAction<AppStatusQueryResponse>>;
  availableApps: App[];
  setAvailableApps: Dispatch<SetStateAction<App[]>>;
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  manageApp: (id: string, mode: InstallMode) => Promise<void>;
  hardwareInfo: HardwareInfo | null;
  setHardwareInfo: Dispatch<SetStateAction<HardwareInfo | null>>;
  systemStartupInfo: SystemStartupInfo | null;
  setSystemStartupInfo: Dispatch<SetStateAction<SystemStartupInfo | null>>;
  installationStatus: InstallationStatus;
  setInstallationStatus: Dispatch<SetStateAction<InstallationStatus>>;
}

export const realtimeContextDefault: RealtimeContextType = {
  socket: null,
  setSocket: () => {},
  systemInfo: {} as SystemInfo,
  setSystemInfo: () => {},
  btcInfo: {} as BtcInfo,
  setBtcInfo: () => {},
  balance: {} as WalletBalance,
  lnInfo: {} as LnInfo,
  setLnInfo: () => {},
  setBalance: () => {},
  appStatus: { data: [], errors: [], timestamp: 0 },
  setAppStatus: () => {},
  availableApps: [],
  setAvailableApps: () => {},
  transactions: [],
  setTransactions: () => {},
  manageApp: async () => {},
  hardwareInfo: null,
  setHardwareInfo: () => {},
  systemStartupInfo: null,
  setSystemStartupInfo: () => {},
  installationStatus: {},
  setInstallationStatus: () => {},
};

export const RealtimeContext = createContext<RealtimeContextType>(realtimeContextDefault);

export const WS_URL = `${
  window.location.protocol === "https:" ? "wss" : "ws"
}://${window.location.host}/api/ws`;

const RealtimeProvider: FC<PropsWithChildren> = (props) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
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
  const [appStatus, setAppStatus] = useState<AppStatusQueryResponse>({
    data: [],
    errors: [],
    timestamp: 0,
  });
  const [availableApps, setAvailableApps] = useState<App[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null);
  const [systemStartupInfo, setSystemStartupInfo] = useState<SystemStartupInfo | null>(null);
  const [installationStatus, setInstallationStatus] = useState<InstallationStatus>({});

  const requestPending = useRef(false);

  const manageApp = async (id: string, mode: InstallMode): Promise<void> => {
    if (
      !isAppId(id) ||
      requestPending.current ||
      Object.values(installationStatus).some((status) => status.inProgress)
    )
      return;
    requestPending.current = true;
    setInstallationStatus((previous) => ({
      ...previous,
      [id]: {
        mode,
        currentState: "requested",
        messages: [],
        inProgress: true,
        outcome: "pending",
        errorId: null,
      },
    }));
    try {
      if (mode === "on") await instance.post(`apps/install/${id}`);
      else await instance.post("apps/uninstall", { app_id: id, keep_data: true });
    } catch (error) {
      const details = checkError(error);
      const failure = parseInstallationMessage({ id, mode, state: "failure", message: details });
      const finished = parseInstallationMessage({ id, mode, state: "finished" });
      setInstallationStatus((previous) => {
        // A delayed HTTP failure must not overwrite progress already received over WS.
        if (previous[id]?.currentState !== "requested" || !failure || !finished) return previous;
        return applyInstallationMessage(applyInstallationMessage(previous, failure), finished);
      });
      toast.error(details);
    } finally {
      requestPending.current = false;
    }
  };

  const contextValue: RealtimeContextType = {
    socket,
    setSocket,
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
    manageApp,
    hardwareInfo,
    setHardwareInfo,
    systemStartupInfo,
    setSystemStartupInfo,
    installationStatus,
    setInstallationStatus,
  };

  return <RealtimeContext.Provider value={contextValue}>{props.children}</RealtimeContext.Provider>;
};

export default RealtimeProvider;
