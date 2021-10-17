import { FC, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
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
import { AppStatus } from '../../models/app-status';
import { AppContext } from '../../store/app-context';
import { MODAL_ROOT } from '../../util/util';

export const Home: FC = () => {
  const { t } = useTranslation();
  const appCtx = useContext(AppContext);
  const { systemInfo, balance, btcInfo, lnStatus, transactions, appStatus } = useSSE();

  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTxId, setDetailTxId] = useState('');

  const showSendModalHandler = () => {
    setShowSendModal(true);
  };

  const closeSendModalHandler = (confirmed?: boolean) => {
    setShowSendModal(false);
    if (confirmed) {
      const theme = appCtx.darkMode ? 'dark' : 'light';
      toast.success(t('tx.sent'), { theme });
    }
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
        onchainBalance={balance.onchain_confirmed_balance!}
        lnBalance={balance.channel_local_balance!}
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
      <ToastContainer />
      <main
        className={`content-container page-container dark:text-white bg-gray-100 dark:bg-gray-700 transition-colors h-full grid gap-2 grid-cols-1 grid-rows-${gridRows.toFixed()} md:grid-cols-2 xl:grid-cols-4`}
      >
        <article className='col-span-2 md:col-span-1 xl:col-span-2 row-span-2'>
          <WalletCard
            onchainBalance={balance.onchain_total_balance!}
            lnBalance={balance.channel_local_balance!}
            onReceive={showReceiveHandler}
            onSend={showSendModalHandler}
          />
        </article>
        <article className='w-full col-span-2 md:col-span-1 xl:col-span-2 row-span-4'>
          <TransactionCard transactions={transactions} showDetails={showDetailHandler} />
        </article>
        <article className='w-full col-span-2 md:col-span-1 xl:col-span-2 row-span-2'>
          {/* TODO: change */}
          <ConnectionCard torAddress={systemInfo.tor_web_ui!} sshAddress={systemInfo.ssh_address!} />
        </article>
        {/* TODO: change */}
        <article className='w-full col-span-2 md:col-span-1 xl:col-span-2 row-span-2'>
          <BitcoinCard
            version={btcInfo.subversion!}
            peers={btcInfo.connections_in!}
            network={systemInfo.chain!}
            blocks={btcInfo.blocks!}
            headers={btcInfo.headers!}
            progress={btcInfo.verification_progress!}
          />
        </article>
        <article className='w-full col-span-2 md:col-span-1 xl:col-span-2 row-span-2'>
          <LightningCard
            version={lnStatus.version!}
            implementation={lnStatus.implementation!}
            channelActive={lnStatus.num_active_channels!}
            channelPending={lnStatus.num_pending_channels!}
            channelInactive={lnStatus.num_inactive_channels!}
            localBalance={balance.channel_local_balance!}
            remoteBalance={balance.channel_remote_balance!}
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
