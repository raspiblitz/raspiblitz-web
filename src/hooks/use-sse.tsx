import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../store/app-context';

const SSE_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/sse/subscribe'
  : '/sse/subscribe';

const useSSE = () => {
  const appCtx = useContext(AppContext);
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

  const [appStatus, setAppStatus] = useState([]);
  const [availableApps, setAvailableApps] = useState<any[]>([]);
  const [transactions, setTransactions] = useState([]);
  const [isInstalling, setIsInstalling] = useState<string | null>(null);

  const { evtSource, setEvtSource } = appCtx;

  useEffect(() => {
    if (!evtSource) {
      setEvtSource(new EventSource(SSE_URL));
    } else {
      evtSource.addEventListener('syncstatus', setSyncStatus);

      evtSource.addEventListener('transactions', setTx);

      evtSource.addEventListener('appstatus', setAppStat);

      evtSource.addEventListener('apps', setApps);

      evtSource.addEventListener('install', setInstall);
    }

    return () => {
      // cleanup
      if (evtSource) {
        evtSource.removeEventListener('syncstatus', setSyncStatus);
        evtSource.removeEventListener('transactions', setTx);
        evtSource.removeEventListener('appstatus', setAppStat);
        evtSource.removeEventListener('apps', setApps);
        evtSource.removeEventListener('install', setInstall);

        evtSource.close();
      }
    };
  }, [evtSource, setEvtSource]);

  const setApps = (event: Event) => {
    setAvailableApps((prev: any[]) => {
      const apps = JSON.parse((event as MessageEvent<string>).data);
      if (prev.length === 0) {
        return apps;
      } else {
        return prev.map((old) => apps.find((newApp: any) => old.id === newApp.id) || old);
      }
    });
  };

  const setAppStat = (event: Event) => {
    setAppStatus(JSON.parse((event as MessageEvent<string>).data));
  };

  const setTx = (event: Event) => {
    const t = JSON.parse((event as MessageEvent<string>).data).sort((a: any, b: any) => b.time - a.time);
    setTransactions(t);
  };

  const setInstall = (event: Event) => {
    setIsInstalling(JSON.parse((event as MessageEvent<string>).data).id);
  };

  const setSyncStatus = (event: Event) => {
    setHomeState((prev) => {
      const message = JSON.parse((event as MessageEvent<string>).data);

      return {
        ...prev,
        ...message
      };
    });
  };

  return { homeState, transactions, appStatus, availableApps, isInstalling };
};

export default useSSE;

export interface HomeState {
  syncStatus: number;
  onchainBalance: number;
  lnBalance: number;
  currBlock: number;
  maxBlock: number;
  channelOnline: number;
  channelTotal: number;
  btcVersion: string;
  btcStatus: string;
  btcNetwork: string;
  lnVersion: string;
  lnStatus: string;
  torAddress: string;
  sshAddress: string;
}
