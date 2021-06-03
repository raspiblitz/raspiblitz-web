import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../store/app-context';

const SSE_URL = 'http://localhost:8080/events';

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
  const [availableApps, setAvailableApps] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const { evtSource, setEvtSource } = appCtx;

  useEffect(() => {
    if (!evtSource) {
      setEvtSource(new EventSource(SSE_URL));
    } else {
      evtSource.addEventListener('syncstatus', setSyncStatus);

      evtSource.addEventListener('transactions', setTx);

      evtSource.addEventListener('appstatus', setAppStat);

      evtSource.addEventListener('apps', setApps);
    }

    return () => {
      // cleanup
      if (evtSource) {
        evtSource.removeEventListener('syncstatus', setSyncStatus);
        evtSource.removeEventListener('transactions', setTx);
        evtSource.removeEventListener('appstatus', setAppStat);
        evtSource.removeEventListener('apps', setApps);
      }
    };
  }, [evtSource, setEvtSource]);

  const setApps = (event: any) => {
    setAvailableApps(JSON.parse(event.data));
  };

  const setAppStat = (event: any) => {
    setAppStatus(JSON.parse(event.data));
  };

  const setTx = (event: any) => {
    const t = JSON.parse(event.data).sort((a: any, b: any) => b.time - a.time);
    setTransactions(t);
  };

  const setSyncStatus = (event: any) => {
    setHomeState((prev) => {
      const message = JSON.parse(event.data);

      return {
        ...prev,
        ...message
      };
    });
  };

  return { homeState, transactions, appStatus, availableApps };
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
