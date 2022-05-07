import { AxiosResponse } from "axios";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import AppStatusCard from "../components/Home/AppStatusCard/AppStatusCard";
import BitcoinCard from "../components/Home/BitcoinCard/BitcoinCard";
import ConnectionCard from "../components/Home/ConnectionCard/ConnectionCard";
import HardwareCard from "../components/Home/HardwareCard/HardwareCard";
import LightningCard from "../components/Home/LightningCard/LightningCard";
import TransactionCard from "../components/Home/TransactionCard/TransactionCard";
import TransactionDetailModal from "../components/Home/TransactionCard/TransactionDetailModal/TransactionDetailModal";
import WalletCard from "../components/Home/WalletCard/WalletCard";
import ReceiveModal from "../components/Shared/ReceiveModal/ReceiveModal";
import SendModal from "../components/Shared/SendModal/SendModal";
import UnlockModal from "../components/Shared/UnlockModal/UnlockModal";
import useSSE from "../hooks/use-sse";
import { AppStatus } from "../models/app-status";
import { Transaction } from "../models/transaction.model";
import { AppContext } from "../store/app-context";
import { instance } from "../util/interceptor";
import { enableGutter } from "../util/util";

const Home: FC = () => {
  const { t } = useTranslation();
  const { darkMode, walletLocked, setWalletLocked } = useContext(AppContext);
  const { systemInfo, balance, btcInfo, lnStatus, appStatus, hardwareInfo } =
    useSSE();

  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [txError, setTxError] = useState("");

  const theme = darkMode ? "dark" : "light";

  useEffect(() => {
    enableGutter();
    if (!walletLocked) {
      setIsLoadingTransactions(true);
      setTxError("");

      instance
        .get("/lightning/list-all-tx?reversed=true")
        .then((tx: AxiosResponse<Transaction[]>) => {
          setTransactions(tx.data);
        })
        .catch((err) => {
          if (err.response.status === 423) {
            setWalletLocked(true);
          } else {
            setTxError(
              `${t("login.error")}: ${
                err.response?.data?.detail?.[0]?.msg ||
                err.response?.data?.detail
              }`
            );
          }
          setTransactions([]);
        })
        .finally(() => {
          setIsLoadingTransactions(false);
        });
    }
  }, [t, walletLocked, setWalletLocked, setIsLoadingTransactions]);

  const showSendModalHandler = useCallback(() => {
    setShowSendModal(true);
  }, []);

  const closeSendModalHandler = useCallback(
    (confirmed?: boolean) => {
      setShowSendModal(false);
      if (confirmed) {
        toast.success(t("tx.sent"), { theme });
      }
    },
    [t, theme]
  );

  const showReceiveHandler = useCallback(() => {
    setShowReceiveModal(true);
  }, []);

  const closeReceiveModalHandler = useCallback(() => {
    setShowReceiveModal(false);
  }, []);

  const showDetailHandler = (index: number) => {
    const tx = transactions.find((tx) => tx.index === index);
    if (!tx) {
      console.error("Could not find transaction with index ", index);
      return;
    }
    setDetailTx(tx);
    setShowDetailModal(true);
  };

  const closeDetailHandler = useCallback(() => {
    setDetailTx(null);
    setShowDetailModal(false);
  }, []);

  const receiveModal = showReceiveModal && (
    <ReceiveModal onClose={closeReceiveModalHandler} />
  );

  const sendModal = showSendModal && (
    <SendModal
      onchainBalance={balance.onchain_confirmed_balance!}
      lnBalance={balance.channel_local_balance!}
      onClose={closeSendModalHandler}
    />
  );

  const detailModal = showDetailModal && (
    <TransactionDetailModal
      transaction={detailTx!}
      close={closeDetailHandler}
    />
  );

  const gridRows = 6 + appStatus.length / 4;

  const closeUnlockModal = useCallback(
    (unlocked: boolean) => {
      if (unlocked) {
        toast.success(t("wallet.unlock_success"), { theme });
      }
    },
    [t, theme]
  );

  const unlockModal = walletLocked && (
    <UnlockModal onClose={closeUnlockModal} />
  );

  return (
    <>
      {unlockModal}
      {receiveModal}
      {sendModal}
      {detailModal}
      <ToastContainer />
      <main
        className={`content-container page-container grid h-full grid-cols-1 gap-2 bg-gray-100 transition-colors dark:bg-gray-700 dark:text-white grid-rows-${gridRows.toFixed()} md:grid-cols-2 xl:grid-cols-4`}
      >
        <article className="col-span-2 row-span-2 md:col-span-1 xl:col-span-2">
          <WalletCard
            onchainBalance={balance.onchain_total_balance!}
            lnBalance={balance.channel_local_balance!}
            onReceive={showReceiveHandler}
            onSend={showSendModalHandler}
          />
        </article>
        <article className="col-span-2 row-span-4 w-full md:col-span-1 xl:col-span-2">
          <TransactionCard
            isLoading={isLoadingTransactions}
            transactions={transactions}
            showDetails={showDetailHandler}
            error={txError}
          />
        </article>
        <article className="col-span-2 row-span-2 w-full md:col-span-1 xl:col-span-2">
          <div className="flex h-full flex-col p-5 lg:flex-row">
            <ConnectionCard
              torAddress={systemInfo.tor_web_ui!}
              sshAddress={systemInfo.ssh_address!}
            />
            <HardwareCard hardwareInfo={hardwareInfo} />
          </div>
        </article>
        <article className="col-span-2 row-span-2 w-full md:col-span-1 xl:col-span-2">
          <BitcoinCard info={btcInfo} network={systemInfo.chain!} />
        </article>
        <article className="col-span-2 row-span-2 w-full md:col-span-1 xl:col-span-2">
          <LightningCard
            version={lnStatus.version!}
            implementation={lnStatus.implementation!}
            channelActive={lnStatus.num_active_channels!}
            channelPending={lnStatus.num_pending_channels!}
            channelInactive={lnStatus.num_inactive_channels!}
            localBalance={balance.channel_local_balance!}
            remoteBalance={balance.channel_remote_balance!}
            pendingLocalBalance={balance.channel_pending_open_local_balance!}
            pendingRemoteBalance={balance.channel_pending_open_remote_balance!}
          />
        </article>
        {appStatus
          .filter((app: AppStatus) => app.installed)
          .map((app: AppStatus) => {
            return (
              <article
                key={app.id}
                className="col-span-2 row-span-1 md:col-span-1"
              >
                <AppStatusCard app={app} />
              </article>
            );
          })}
      </main>
    </>
  );
};

export default Home;
