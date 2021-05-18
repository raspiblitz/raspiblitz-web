import { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import AppBox from '../../components/AppBox/AppBox';
import ReceiveModal from '../../components/Shared/ReceiveModal/ReceiveModal';
import SendModal from '../../components/Shared/SendModal/SendModal';
import Statistics from '../../components/Statistics/Statistics';
import TransactionDetailModal from '../../components/Wallet/TransactionList/TransactionDetailModal/TransactionDetailModal';
import Wallet from '../../components/Wallet/Wallet';

export const Home: FC<{ ws: WebSocket }> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [homeState, setHomeState] = useState<HomeState>({
    syncStatus: 0,
    onchainBalance: 0,
    lnBalance: 0,
    currBlock: 0,
    maxBlock: 0,
    channelOnline: 0,
    channelTotal: 0,
    txId: '',
    showReceiveModal: false,
    showSendModal: false,
    showDetailModal: false
  });

  const [appStatus, setAppStatus] = useState<any[]>([]);
  const [transactions, setTransactions] = useState([]);
  const [isCancelled, setIsCancelled] = useState(false);

  const { ws } = props;

  useEffect(() => {
    setIsCancelled(false);
    if (ws) {
      setIsLoading(true);
      ws.onmessage = (msg) => {
        const message = JSON.parse(msg.data);

        if (!isCancelled) {
          switch (message.id) {
            case 'syncstatus':
              setIsLoading(false);
              setHomeState((prev) => {
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
              break;
            case 'transactions':
              setTransactions(message.transactions);
              break;
            case 'appstatus':
              setAppStatus(message.apps);
              break;
            default:
              return;
          }
        }
      };

      ws.send(JSON.stringify({ id: 'syncstatus' }));
      ws.send(JSON.stringify({ id: 'transactions' }));
      ws.send(JSON.stringify({ id: 'appstatus' }));
    }

    return () => {
      setIsCancelled(true);
    };
  }, [ws, isCancelled]);

  const showSendHandler = () => {
    setHomeState((prevState) => {
      return { ...prevState, showSendModal: true };
    });
  };

  const showReceiveHandler = () => {
    setHomeState((prevState) => {
      return { ...prevState, showReceiveModal: true };
    });
  };

  const closeReceiveModalHandler = () => {
    setHomeState((prevState) => {
      return { ...prevState, showReceiveModal: false };
    });
  };

  const closeSendModalHandler = () => {
    setHomeState((prevState) => {
      return { ...prevState, showSendModal: false };
    });
  };

  const showDetailHandler = (id: string) => {
    setHomeState((prevState) => {
      return { ...prevState, txId: id, showDetailModal: true };
    });
  };

  const closeDetailHandler = () => {
    setHomeState((prevState) => {
      return { ...prevState, showDetailModal: false };
    });
  };

  const receiveModal =
    homeState.showReceiveModal &&
    createPortal(<ReceiveModal onClose={closeReceiveModalHandler} />, document.getElementById('modal-root')!);

  const sendModal =
    homeState.showSendModal &&
    createPortal(
      <SendModal
        onchainBalance={homeState.onchainBalance}
        lnBalance={homeState.lnBalance}
        onClose={closeSendModalHandler}
      />,
      document.getElementById('modal-root')!
    );

  const detailModal =
    homeState.showDetailModal &&
    createPortal(
      <TransactionDetailModal id={homeState.txId} close={closeDetailHandler} />,
      document.getElementById('modal-root')!
    );

  return (
    <>
      {receiveModal}
      {sendModal}
      {detailModal}
      <div className='h-auto w-full dark:text-white transition-colors'>
        <div className='h-full grid gap-4 grid-cols-1 grid-rows-3 md:grid-cols-2 md:grid-rows-2 xl:grid-cols-3 xl:grid-rows-3'>
          <Wallet
            isLoading={isLoading}
            onchainBalance={homeState.onchainBalance}
            lnBalance={homeState.lnBalance}
            transactions={transactions}
            showDetails={showDetailHandler}
            syncStatus={homeState.syncStatus}
            send={showSendHandler}
            receive={showReceiveHandler}
          ></Wallet>
          <Statistics></Statistics>
          <AppBox apps={appStatus}></AppBox>
        </div>
      </div>
    </>
  );
};

export default Home;

export interface HomeState {
  syncStatus: number;
  onchainBalance: number;
  lnBalance: number;
  currBlock: number;
  maxBlock: number;
  txId: string;
  showReceiveModal: boolean;
  showSendModal: boolean;
  showDetailModal: boolean;
  channelOnline: number;
  channelTotal: number;
}
