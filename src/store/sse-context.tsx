import { createContext, Dispatch, FC, SetStateAction, useState } from 'react';
import { HomeState } from '../hooks/use-sse';

interface SSEContextType {
  evtSource: EventSource | null;
  setEvtSource: Dispatch<SetStateAction<EventSource | null>>;
  homeState: HomeState;
  setHomeState: Dispatch<SetStateAction<any>>;
  appStatus: any[];
  setAppStatus: Dispatch<SetStateAction<any[]>>;
  availableApps: any[];
  setAvailableApps: Dispatch<SetStateAction<any[]>>;
  transactions: any[];
  setTransactions: Dispatch<SetStateAction<any[]>>;
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
  ? 'http://localhost:8080/sse/subscribe'
  : '/sse/subscribe';

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
  const [appStatus, setAppStatus] = useState<any[]>([]);
  const [availableApps, setAvailableApps] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
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
