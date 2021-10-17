import { createContext, Dispatch, FC, SetStateAction, useState } from "react";
import { AppStatus } from "../models/app-status.model";
import { App } from "../models/app.model";
import { Balance } from "../models/balance";
import { BtcStatus } from "../models/btc-status";
import { LnStatus } from "../models/ln-status";
import { NodeInfo } from "../models/node-info";
import { Transaction } from "../models/transaction.model";

interface SSEContextType {
  evtSource: EventSource | null;
  setEvtSource: Dispatch<SetStateAction<EventSource | null>>;
  nodeInfo: NodeInfo;
  setNodeInfo: Dispatch<SetStateAction<NodeInfo>>;
  btcStatus: BtcStatus;
  setBtcStatus: Dispatch<SetStateAction<BtcStatus>>;
  lnStatus: LnStatus;
  setLnStatus: Dispatch<SetStateAction<LnStatus>>;
  balance: Balance;
  setBalance: Dispatch<SetStateAction<Balance>>;
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
  nodeInfo: {
    name: "",
    torAddress: "",
    sshAddress: "",
  },
  setNodeInfo: () => {},
  btcStatus: {
    syncStatus: 0,
    currBlock: 0,
    maxBlock: 0,
    btcStatus: "",
    btcVersion: "",
    btcNetwork: "",
  },
  setBtcStatus: () => {},
  balance: {
    onchainBalance: 0,
    lnBalance: 0,
  },
  lnStatus: {
    channelOnline: 0,
    channelTotal: 0,
    lnStatus: "",
    lnVersion: "",
  },
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
  ? "http://localhost:8080/api/sse/subscribe"
  : "/api/sse/subscribe";

const SSEContextProvider: FC = (props) => {
  const [evtSource, setEvtSource] = useState<EventSource | null>(null);
  const [nodeInfo, setNodeInfo] = useState<NodeInfo>({
    name: "",
    sshAddress: "",
    torAddress: "",
  });
  const [btcStatus, setBtcStatus] = useState<BtcStatus>({
    syncStatus: 0,
    currBlock: 0,
    maxBlock: 0,
    btcNetwork: "",
    btcStatus: "",
    btcVersion: "",
  });
  const [lnStatus, setLnStatus] = useState<LnStatus>({
    channelOnline: 0,
    channelTotal: 0,
    lnStatus: "",
    lnVersion: "",
  });
  const [balance, setBalance] = useState<Balance>({
    onchainBalance: 0,
    lnBalance: 0,
  });
  const [appStatus, setAppStatus] = useState<AppStatus[]>([]);
  const [availableApps, setAvailableApps] = useState<App[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isInstalling, setIsInstalling] = useState<string | null>(null);

  const contextValue: SSEContextType = {
    evtSource,
    setEvtSource,
    nodeInfo,
    setNodeInfo,
    btcStatus,
    setBtcStatus,
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
