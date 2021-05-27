import { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import AppBox from '../../components/AppBox/AppBox';
import ReceiveModal from '../../components/Shared/ReceiveModal/ReceiveModal';
import SendModal from '../../components/Shared/SendModal/SendModal';
import Statistics from '../../components/Statistics/Statistics';
import TransactionDetailModal from '../../components/Wallet/TransactionList/TransactionDetailModal/TransactionDetailModal';
import Wallet from '../../components/Wallet/Wallet';
import useSSE from '../../hooks/use-sse';

export const Home: FC = (props) => {
  const { homeState, transactions, appStatus } = useSSE();

  const [isLoading, setIsLoading] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTxId, setDetailTxId] = useState('');

  useEffect(() => {
    setIsLoading(true);
    Promise.allSettled([
      fetch('http://localhost:8080/syncstatus'),
      fetch('http://localhost:8080/transactions'),
      fetch('http://localhost:8080/appstatus')
    ]).then(() => {
      setIsLoading(false);
    });
  }, []);

  const showSendModalHandler = () => {
    setShowSendModal(true);
  };

  const closeSendModalHandler = () => {
    setShowSendModal(false);
  };

  const showReceiveHandler = () => {
    setShowReceiveModal(true);
  };

  const closeReceiveModalHandler = () => {
    setShowReceiveModal(false);
  };

  const showDetailHandler = (id: string) => {
    setDetailTxId(id);
    setShowDetailModal(true);
  };

  const closeDetailHandler = () => {
    setShowDetailModal(false);
  };

  const receiveModal =
    showReceiveModal &&
    createPortal(<ReceiveModal onClose={closeReceiveModalHandler} />, document.getElementById('modal-root')!);

  const sendModal =
    showSendModal &&
    createPortal(
      <SendModal
        onchainBalance={homeState.onchainBalance}
        lnBalance={homeState.lnBalance}
        onClose={closeSendModalHandler}
      />,
      document.getElementById('modal-root')!
    );

  const detailModal =
    showDetailModal &&
    createPortal(
      <TransactionDetailModal id={detailTxId} close={closeDetailHandler} />,
      document.getElementById('modal-root')!
    );

  return (
    <>
      {receiveModal}
      {sendModal}
      {detailModal}
      <div className='mobile-container md:content-container overflow-y-auto w-full dark:text-white transition-colors'>
        <div className='h-full grid gap-4 grid-cols-1 grid-rows-3 md:grid-cols-2 md:grid-rows-2 xl:grid-cols-3 xl:grid-rows-3'>
          <Wallet
            isLoading={isLoading}
            onchainBalance={homeState.onchainBalance}
            lnBalance={homeState.lnBalance}
            transactions={transactions}
            showDetails={showDetailHandler}
            syncStatus={homeState.syncStatus}
            send={showSendModalHandler}
            receive={showReceiveHandler}
          />
          <Statistics />
          <AppBox apps={appStatus} />
        </div>
      </div>
    </>
  );
};

export default Home;
