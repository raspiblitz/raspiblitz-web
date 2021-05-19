import { useEffect, useState } from 'react';

const useSSE = () => {
  const [homeState, setHomeState] = useState<HomeState>({
    syncStatus: 0,
    onchainBalance: 0,
    lnBalance: 0,
    currBlock: 0,
    maxBlock: 0,
    channelOnline: 0,
    channelTotal: 0
  });

  const [appStatus, setAppStatus] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const url = 'http://localhost:8080/events';

  useEffect(() => {
    const evtSource = new EventSource(url);
    evtSource.addEventListener('syncstatus', (event: any) => {
      setHomeState((prev) => {
        console.log(event);
        const message = JSON.parse(event.data);

        return {
          ...prev,
          syncStatus: message.syncStatus,
          onchainBalance: message.onchainBalance.toFixed(8),
          lnBalance: message.lnBalance.toFixed(8),
          currBlock: message.currBlock,
          maxBlock: message.currBlock,
          channelOnline: message.channelOnline,
          channelTotal: message.channelTotal
        };
      });
    });

    evtSource.addEventListener('transactions', (event: any) => {
      setTransactions(JSON.parse(event.data));
    });

    evtSource.addEventListener('appstatus', (event: any) => {
      setAppStatus(JSON.parse(event.data));
    });
  }, []);

  return { homeState, transactions, appStatus };
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
}
