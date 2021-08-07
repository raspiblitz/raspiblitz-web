import { useContext, useEffect } from 'react';
import { AppStatus } from '../models/app-status.model';
import { App } from '../models/app.model';
import { HomeState } from '../models/home-state.model';
import { Transaction } from '../models/transaction.model';
import { SSEContext, SSE_URL } from '../store/sse-context';

const useSSE = () => {
  const sseCtx = useContext(SSEContext);
  const { evtSource, setEvtSource } = sseCtx;

  useEffect(() => {
    if (!evtSource) {
      setEvtSource(new EventSource(SSE_URL));
    }

    const setApps = (event: Event) => {
      sseCtx.setAvailableApps((prev: App[]) => {
        const apps = JSON.parse((event as MessageEvent<string>).data);
        if (prev.length === 0) {
          return apps;
        } else {
          return prev.map((old: App) => apps.find((newApp: App) => old.id === newApp.id) || old);
        }
      });
    };

    const setAppStatus = (event: Event) => {
      sseCtx.setAppStatus((prev: AppStatus[]) => {
        const status = JSON.parse((event as MessageEvent<string>).data);

        if (prev.length === 0) {
          return status;
        } else {
          return prev.map((old: AppStatus) => status.find((newApp: AppStatus) => old.id === newApp.id) || old);
        }
      });
    };

    const setTx = (event: Event) => {
      const t = JSON.parse((event as MessageEvent<string>).data).sort(
        (a: Transaction, b: Transaction) => b.time - a.time
      );
      sseCtx.setTransactions(t);
    };

    const setInstall = (event: Event) => {
      sseCtx.setIsInstalling(JSON.parse((event as MessageEvent<string>).data).id);
    };

    const setSyncStatus = (event: Event) => {
      sseCtx.setHomeState((prev: HomeState) => {
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
      evtSource.addEventListener('appstatus', setAppStatus);
      evtSource.addEventListener('apps', setApps);
      evtSource.addEventListener('install', setInstall);
    }

    return () => {
      // cleanup
      if (evtSource) {
        evtSource.removeEventListener('syncstatus', setSyncStatus);
        evtSource.removeEventListener('transactions', setTx);
        evtSource.removeEventListener('appstatus', setAppStatus);
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
