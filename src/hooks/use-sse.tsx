import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../store/app-context';

const SSE_URL = window.location.hostname.includes('localhost') ? 'http://localhost:8080/sse/subscribe' : '/sse/subscribe';

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
      evtSource.addEventListener('syncstatus' as any, setSyncStatus);

      evtSource.addEventListener('transactions' as any, setTx);

      evtSource.addEventListener('appstatus' as any, setAppStat);

      evtSource.addEventListener('apps' as any, setApps);

      evtSource.addEventListener('install' as any, setInstall);
    }

    return () => {
      // cleanup
      if (evtSource) {
        evtSource.removeEventListener('syncstatus' as any, setSyncStatus);
        evtSource.removeEventListener('transactions' as any, setTx);
        evtSource.removeEventListener('appstatus' as any, setAppStat);
        evtSource.removeEventListener('apps' as any, setApps);
        evtSource.removeEventListener('install' as any, setInstall);
      }
    };
  }, [evtSource, setEvtSource]);

  const setApps = (event: MessageEvent<string>) => {
    setAvailableApps((prev: any[]) => {
      const apps = JSON.parse(event.data);
      if (prev.length === 0) {
        return apps;
      } else {
        return prev.map((old) => apps.find((newApp: any) => old.id === newApp.id) || old);
      }
    });
  };

  const setAppStat = (event: MessageEvent<string>) => {
    setAppStatus(JSON.parse(event.data));
  };

  const setTx = (event: MessageEvent<string>) => {
    const t = JSON.parse(event.data).sort((a: any, b: any) => b.time - a.time);
    setTransactions(t);
  };

  const setInstall = (event: MessageEvent<string>) => {
    setIsInstalling(JSON.parse(event.data).id);
  };

  const setSyncStatus = (event: MessageEvent<string>) => {
    setHomeState((prev) => {
      const message = JSON.parse(event.data);

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
