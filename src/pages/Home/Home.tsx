import { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import AppStatusCard from '../../components/HomeComponents/AppStatusCard/AppStatusCard';
import BitcoinCard from '../../components/HomeComponents/BitcoinCard/BitcoinCard';
import ConnectionCard from '../../components/HomeComponents/ConnectionCard/ConnectionCard';
import LightningCard from '../../components/HomeComponents/LightningCard/LightningCard';
import TransactionCard from '../../components/HomeComponents/TransactionCard/TransactionCard';
import TransactionDetailModal from '../../components/HomeComponents/TransactionCard/TransactionDetailModal/TransactionDetailModal';
import WalletCard from '../../components/HomeComponents/WalletCard/WalletCard';
import ReceiveModal from '../../components/Shared/ReceiveModal/ReceiveModal';
import SendModal from '../../components/Shared/SendModal/SendModal';
import useSSE from '../../hooks/use-sse';
import { createRequest } from '../../util/util';

export const Home: FC = (props) => {
  const { homeState, transactions, appStatus } = useSSE();

  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTxId, setDetailTxId] = useState('');

  useEffect(() => {
    Promise.allSettled([
      fetch(createRequest('syncstatus', 'GET')),
      fetch(createRequest('transactions', 'GET')),
      fetch(createRequest('appstatus', 'GET'))
    ]).then(() => {});
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
      <div className='mobile-container md:content-container overflow-y-auto w-full dark:text-white'>
        <div className={`h-full grid gap-2 grid-cols-1 grid-rows-${gridRows.toFixed()} md:grid-cols-2 xl:grid-cols-4`}>
          <div className='col-span-2 md:col-span-1 xl:col-span-2 row-span-2'>
            <WalletCard
              onchainBalance={homeState.onchainBalance}
              lnBalance={homeState.lnBalance}
              onReceive={showReceiveHandler}
              onSend={showSendModalHandler}
            />
          </div>
          <div className='w-full col-span-2 md:col-span-1 xl:col-span-2 row-span-4'>
            <TransactionCard transactions={transactions} showDetails={showDetailHandler} />
          </div>
          <div className='w-full col-span-2 md:col-span-1 xl:col-span-2 row-span-2'>
            <ConnectionCard torAddress={homeState.torAddress} sshAddress={homeState.sshAddress} />
          </div>
          <div className='w-full col-span-2 md:col-span-1 xl:col-span-2 row-span-2'>
            <BitcoinCard
              version={homeState.btcVersion}
              network={homeState.btcNetwork}
              status={homeState.btcStatus}
              currBlock={homeState.currBlock}
              maxBlock={homeState.maxBlock}
            />
          </div>
          <div className='w-full col-span-2 md:col-span-1 xl:col-span-2 row-span-2'>
            <LightningCard
              version={homeState.lnVersion}
              status={homeState.lnStatus}
              channelOnline={homeState.channelOnline}
              channelTotal={homeState.channelTotal}
              channelBalance={homeState.lnBalance}
            />
          </div>
          {appStatus.map((app: any, index: number) => {
            return (
              <div key={index} className='col-span-2 md:col-span-1 row-span-1'>
                <AppStatusCard id={app.id} name={app.name} status={app.status} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
