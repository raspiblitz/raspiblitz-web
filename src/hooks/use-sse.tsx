import { useContext, useEffect } from 'react';
import { SSEContext, SSE_URL } from '../store/sse-context';

const useSSE = () => {
  const sseCtx = useContext(SSEContext);
  const { evtSource, setEvtSource } = sseCtx;

  useEffect(() => {
    if (!evtSource) {
      setEvtSource(new EventSource(SSE_URL));
    }

    const setApps = (event: Event) => {
      sseCtx.setAvailableApps((prev: any[]) => {
        const apps = JSON.parse((event as MessageEvent<string>).data);
        if (prev.length === 0) {
          return apps;
        } else {
          return prev.map((old: any) => apps.find((newApp: any) => old.id === newApp.id) || old);
        }
      });
    };

    const setAppStat = (event: Event) => {
      sseCtx.setAppStatus((prev: any) => {
        const status = JSON.parse((event as MessageEvent<string>).data);

        if (prev.length === 0) {
          return status;
        } else {
          return prev.map((old: any) => status.find((newApp: any) => old.id === newApp.id) || old);
        }
      });
    };

    const setTx = (event: Event) => {
      const t = JSON.parse((event as MessageEvent<string>).data).sort((a: any, b: any) => b.time - a.time);
      sseCtx.setTransactions(t);
    };

    const setInstall = (event: Event) => {
      sseCtx.setIsInstalling(JSON.parse((event as MessageEvent<string>).data).id);
    };

    const setSyncStatus = (event: Event) => {
      sseCtx.setHomeState((prev: any) => {
        const message = JSON.parse((event as MessageEvent<string>).data);

        return {
          ...prev,
          ...message
        };
      });
    };

    if (evtSource) {
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
      }
    };
  }, [evtSource, setEvtSource, sseCtx]);

  return {
    homeState: sseCtx.homeState,
    appStatus: sseCtx.appStatus,
    transactions: sseCtx.transactions,
    availableApps: sseCtx.availableApps,
    isInstalling: sseCtx.isInstalling
  };
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
