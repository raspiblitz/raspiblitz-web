import { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import AppBox from '../../components/AppBox/AppBox';
import AppStatusCard from '../../components/BDesign/AppStatusCard/AppStatusCard';
import ConnectionCard from '../../components/BDesign/ConnectionCard/ConnectionCard';
import TransactionCard from '../../components/BDesign/TransactionCard/TransactionCard';
import WalletCard from '../../components/BDesign/WalletCard/WalletCard';
import ReceiveModal from '../../components/Shared/ReceiveModal/ReceiveModal';
import SendModal from '../../components/Shared/SendModal/SendModal';
import Statistics from '../../components/Statistics/Statistics';
import TransactionDetailModal from '../../components/Wallet/TransactionList/TransactionDetailModal/TransactionDetailModal';
import Wallet from '../../components/Wallet/Wallet';
import useSSE from '../../hooks/use-sse';
import BTCPay from '../../assets/apps/btc-pay.png';
import LightningCard from '../../components/BDesign/LightningCard/LightningCard';
import BitcoinCard from '../../components/BDesign/BitcoinCard/BitcoinCard';

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

  const gridRows = 6 + appStatus.length / 4;

  return (
    <>
      {receiveModal}
      {sendModal}
      {detailModal}
      <div className='mobile-container md:content-container overflow-y-auto w-full dark:text-white transition-colors'>
        <div className={`h-full grid gap-2 grid-cols-1 grid-rows-${gridRows.toFixed()} md:grid-cols-2 xl:grid-cols-4`}>
          <div className='col-span-2 row-span-2'>
            <WalletCard />
          </div>
          <div className='col-span-2 row-span-4'>
            <TransactionCard />
          </div>
          <div className='col-span-2 row-span-2'>
            <ConnectionCard />
          </div>
          <div className='col-span-2 row-span-2'>
            <BitcoinCard />
          </div>
          <div className='col-span-2 row-span-2'>
            <LightningCard />
          </div>
          {appStatus.map((app: any, index: number) => {
            return (
              <div className='col-span-2 md:col-span-1 row-span-1'>
                <AppStatusCard
                  key={index}
                  name={app.name}
                  description='A desktop GUI for Bitcoin Core optimised to work with hardware wallets'
                  icon={BTCPay}
                  status={app.status}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
