import { createContext, Dispatch, FC, SetStateAction, useState } from 'react';
import { AppStatus } from '../models/app-status.model';
import { App } from '../models/app.model';
import { HomeState } from '../models/home-state.model';
import { Transaction } from '../models/transaction.model';

interface SSEContextType {
  evtSource: EventSource | null;
  setEvtSource: Dispatch<SetStateAction<EventSource | null>>;
  homeState: HomeState;
  setHomeState: Dispatch<SetStateAction<HomeState>>;
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
  homeState: {
    syncStatus: 0,
    onchainBalance: 0,
    lnBalance: 0,
    currBlock: 0,
    maxBlock: 0,
    channelOnline: 0,
    channelTotal: 0,
    btcVersion: '',
    btcStatus: '',
    btcNetwork: '',
    lnVersion: '',
    lnStatus: '',
    torAddress: '',
    sshAddress: ''
  },
  setHomeState: () => {},
  appStatus: [],
  setAppStatus: () => {},
  availableApps: [],
  setAvailableApps: () => {},
  transactions: [],
  setTransactions: () => {},
  isInstalling: null,
  setIsInstalling: () => {}
});

export const SSE_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/v1/sse/subscribe'
  : '/api/v1/sse/subscribe';

const SSEContextProvider: FC = (props) => {
  const [evtSource, setEvtSource] = useState<EventSource | null>(null);
  const [homeState, setHomeState] = useState<HomeState>({
    syncStatus: 0,
    onchainBalance: 0,
    lnBalance: 0,
    currBlock: 0,
    maxBlock: 0,
    channelOnline: 0,
    channelTotal: 0,
    btcVersion: '',
    btcStatus: '',
    btcNetwork: '',
    lnVersion: '',
    lnStatus: '',
    torAddress: '',
    sshAddress: ''
  });
  const [appStatus, setAppStatus] = useState<AppStatus[]>([]);
  const [availableApps, setAvailableApps] = useState<App[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isInstalling, setIsInstalling] = useState<string | null>(null);

  const contextValue: SSEContextType = {
    evtSource,
    setEvtSource,
    homeState,
    setHomeState,
    appStatus,
    setAppStatus,
    availableApps,
    setAvailableApps,
    transactions,
    setTransactions,
    isInstalling,
    setIsInstalling
  };

  return <SSEContext.Provider value={contextValue}>{props.children}</SSEContext.Provider>;
};

export default SSEContextProvider;
