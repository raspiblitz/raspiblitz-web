import { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import AppStatusCard from '../../components/Home/AppStatusCard/AppStatusCard';
import BitcoinCard from '../../components/Home/BitcoinCard/BitcoinCard';
import ConnectionCard from '../../components/Home/ConnectionCard/ConnectionCard';
import LightningCard from '../../components/Home/LightningCard/LightningCard';
import TransactionCard from '../../components/Home/TransactionCard/TransactionCard';
import TransactionDetailModal from '../../components/Home/TransactionCard/TransactionDetailModal/TransactionDetailModal';
import WalletCard from '../../components/Home/WalletCard/WalletCard';
import ReceiveModal from '../../components/Shared/ReceiveModal/ReceiveModal';
import SendModal from '../../components/Shared/SendModal/SendModal';
import useSSE from '../../hooks/use-sse';
import { AppStatus } from '../../models/app-status.model';
import { MODAL_ROOT } from '../../util/util';

export const Home: FC = () => {
  const { homeState, transactions, appStatus } = useSSE();

  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTxId, setDetailTxId] = useState('');

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
    showReceiveModal && createPortal(<ReceiveModal onClose={closeReceiveModalHandler} />, MODAL_ROOT);

  const sendModal =
    showSendModal &&
    createPortal(
      <SendModal
        onchainBalance={homeState.onchainBalance}
        lnBalance={homeState.lnBalance}
        onClose={closeSendModalHandler}
      />,
      MODAL_ROOT
    );

  const detailModal =
    showDetailModal && createPortal(<TransactionDetailModal id={detailTxId} close={closeDetailHandler} />, MODAL_ROOT);

  const gridRows = 6 + appStatus.length / 4;

  return (
    <>
      {receiveModal}
      {sendModal}
      {detailModal}
      <main
        className={`content-container page-container dark:text-white bg-gray-100 dark:bg-gray-700 transition-colorsh-full grid gap-2 grid-cols-1 grid-rows-${gridRows.toFixed()} md:grid-cols-2 xl:grid-cols-4`}
      >
        <article className='col-span-2 md:col-span-1 xl:col-span-2 row-span-2'>
          <WalletCard
            onchainBalance={homeState.onchainBalance}
            lnBalance={homeState.lnBalance}
            onReceive={showReceiveHandler}
            onSend={showSendModalHandler}
          />
        </article>
        <article className='w-full col-span-2 md:col-span-1 xl:col-span-2 row-span-4'>
          <TransactionCard transactions={transactions} showDetails={showDetailHandler} />
        </article>
        <article className='w-full col-span-2 md:col-span-1 xl:col-span-2 row-span-2'>
          <ConnectionCard torAddress={homeState.torAddress} sshAddress={homeState.sshAddress} />
        </article>
        <article className='w-full col-span-2 md:col-span-1 xl:col-span-2 row-span-2'>
          <BitcoinCard
            version={homeState.btcVersion}
            network={homeState.btcNetwork}
            status={homeState.btcStatus}
            currBlock={homeState.currBlock}
            maxBlock={homeState.maxBlock}
          />
        </article>
        <article className='w-full col-span-2 md:col-span-1 xl:col-span-2 row-span-2'>
          <LightningCard
            version={homeState.lnVersion}
            status={homeState.lnStatus}
            channelOnline={homeState.channelOnline}
            channelTotal={homeState.channelTotal}
            channelBalance={homeState.lnBalance}
          />
        </article>
        {appStatus.map((app: AppStatus) => {
          return (
            <article key={app.id} className='col-span-2 md:col-span-1 row-span-1'>
              <AppStatusCard app={app} />
            </article>
          );
        })}
      </main>
    </>
  );
};

export default Home;
