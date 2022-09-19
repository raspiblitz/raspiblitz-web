import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { AppContext } from "../../context/app-context";
import { useInterval } from "../../hooks/use-interval";
import useSSE from "../../hooks/use-sse";
import { AppStatus } from "../../models/app-status";
import { Transaction } from "../../models/transaction.model";
import { enableGutter } from "../../utils";
import { checkError } from "../../utils/checkError";
import { instance } from "../../utils/interceptor";
import AppStatusCard from "./AppStatusCard";
import BitcoinCard from "./BitcoinCard";
import ConnectionCard from "./ConnectionCard";
import HardwareCard from "./HardwareCard";
import LightningCard from "./LightningCard";
import ListChannelModal from "./ListChannelModal/ListChannelModal";
import OpenChannelModal from "./OpenChannelModal";
import ReceiveModal from "./ReceiveModal/ReceiveModal";
import SendModal from "./SendModal/SendModal";
import TransactionCard from "./TransactionCard/TransactionCard";
import TransactionDetailModal from "./TransactionCard/TransactionDetailModal/TransactionDetailModal";
import UnlockModal from "./UnlockModal";
import WalletCard from "./WalletCard";

const startupToastId = "startup-toast";

type ModalType =
  | "SEND"
  | "RECEIVE"
  | "DETAIL"
  | "OPEN_CHANNEL"
  | "LIST_CHANNEL"
  | "UNLOCK";

const Home: FC = () => {
  const { t } = useTranslation();
  const { darkMode, walletLocked, setWalletLocked } = useContext(AppContext);
  const { balance, lnInfoLite, appStatus, systemStartupInfo } = useSSE();
  const [showModal, setShowModal] = useState<ModalType | false>(false);
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [txError, setTxError] = useState("");

  const theme = darkMode ? "dark" : "light";

  const { implementation } = lnInfoLite;
  const {
    lightning: lightningState,
    bitcoin,
    bitcoin_msg,
    lightning_msg,
  } = systemStartupInfo || {};

  useEffect(() => {
    const statusToastContent = (
      <div className="flex flex-col">
        <p>
          {t("home.bitcoin")} {bitcoin}
        </p>
        <p>{bitcoin_msg}</p>
        <p>
          {t("home.lightning")} {lightningState}
        </p>
        <p>{lightning_msg}</p>
      </div>
    );
    if (bitcoin && lightningState) {
      if (
        (bitcoin === "done" && lightningState === "done") ||
        (bitcoin === "done" && lightningState === "disabled")
      ) {
        toast.dismiss(startupToastId);
        return;
      }

      if (toast.isActive(startupToastId)) {
        toast.update(startupToastId, {
          render: statusToastContent,
        });
      } else {
        toast(statusToastContent, {
          toastId: startupToastId,
          isLoading: true,
          autoClose: false,
        });
      }
    }
  }, [t, lightningState, bitcoin, bitcoin_msg, lightning_msg]);

  const isLnImplSelected =
    implementation === "LND_GRPC" || implementation === "CLN_GRPC";

  const getTransactions = useCallback(async () => {
    if (!isLnImplSelected || (lightningState && lightningState !== "done")) {
      return;
    }
    try {
      const tx = await instance.get("/lightning/list-all-tx", {
        params: {
          reversed: true,
        },
      });
      setTransactions(tx.data);
      if (tx.status === 200 && walletLocked) {
        setWalletLocked(false);
      }
    } catch (err: any) {
      if (err.response.status === 423) {
        setWalletLocked(true);
      } else {
        setTxError(checkError(err));
      }
    }
  }, [lightningState, isLnImplSelected, walletLocked, setWalletLocked]);

  useEffect(() => {
    if (isLnImplSelected && !walletLocked && isLoadingTransactions) {
      getTransactions().finally(() => {
        setIsLoadingTransactions(false);
      });
    }
  }, [
    implementation,
    isLnImplSelected,
    isLoadingTransactions,
    walletLocked,
    getTransactions,
  ]);

  useEffect(() => {
    enableGutter();

    if (lightningState === "locked") {
      setWalletLocked(true);
    }

    if (!walletLocked) {
      setIsLoadingTransactions(true);
      setTxError("");
    }
  }, [
    t,
    lightningState,
    walletLocked,
    setWalletLocked,
    setIsLoadingTransactions,
  ]);

  useInterval(getTransactions, 20000);

  const closeModalHandler = (txSent?: boolean) => {
    setShowModal(false);
    setDetailTx(null);
    if (txSent) {
      toast.success(t("tx.sent"), { theme });
    }
  };

  const showDetailHandler = (index: number) => {
    const tx = transactions.find((tx) => tx.index === index);
    if (!tx) {
      console.error("Could not find transaction with index ", index);
      return;
    }
    setDetailTx(tx);
    setShowModal("DETAIL");
  };

  if (walletLocked && showModal !== "UNLOCK") {
    setShowModal("UNLOCK");
  }

  if (!walletLocked && showModal === "UNLOCK") {
    setShowModal(false);
  }

  const determineModal = () => {
    switch (showModal) {
      case "DETAIL":
        return (
          <TransactionDetailModal
            transaction={detailTx!}
            close={closeModalHandler}
          />
        );
      case "SEND":
        return (
          <SendModal
            onchainBalance={balance.onchain_confirmed_balance!}
            lnBalance={balance.channel_local_balance!}
            onClose={closeModalHandler}
          />
        );
      case "RECEIVE":
        return <ReceiveModal onClose={closeModalHandler} />;
      case "OPEN_CHANNEL":
        return (
          <OpenChannelModal
            balance={balance.channel_local_balance!}
            onClose={closeModalHandler}
          />
        );
      case "LIST_CHANNEL":
        return <ListChannelModal onClose={closeModalHandler} />;
      case "UNLOCK":
        return <UnlockModal onClose={closeModalHandler} />;
      case false:
      default:
        return undefined;
    }
  };

  if (implementation === null && lightningState !== "disabled") {
    return (
      <>
        {determineModal()}
        <main
          className={`content-container page-container flex h-full items-center justify-center bg-gray-100 transition-colors dark:bg-gray-700 dark:text-white`}
        >
          <LoadingSpinner />
        </main>
      </>
    );
  }

  const gridRows = 6 + appStatus.length / 4;
  const height = isLnImplSelected ? "h-full" : "h-full md:h-1/2";

  return (
    <>
      {determineModal()}
      <main
        className={`content-container page-container grid h-full grid-cols-1 bg-gray-100 transition-colors dark:bg-gray-700 dark:text-white grid-rows-${gridRows.toFixed()} md:grid-cols-2 xl:grid-cols-4`}
      >
        {isLnImplSelected && (
          <article className="col-span-2 row-span-2 md:col-span-1 xl:col-span-2">
            <WalletCard
              onReceive={() => setShowModal("RECEIVE")}
              onSend={() => setShowModal("SEND")}
              onOpenChannel={() => setShowModal("OPEN_CHANNEL")}
              onCloseChannel={() => setShowModal("LIST_CHANNEL")}
            />
          </article>
        )}
        {isLnImplSelected && (
          <article className="col-span-2 row-span-3 w-full md:col-span-1 lg:row-span-4 xl:col-span-2">
            <TransactionCard
              isLoading={isLoadingTransactions}
              transactions={transactions}
              showDetails={showDetailHandler}
              error={txError}
              implementation={implementation}
            />
          </article>
        )}
        <article className="col-span-2 row-span-2 w-full md:col-span-1 xl:col-span-2">
          <div className={`flex ${height} flex-col px-5 lg:flex-row`}>
            <ConnectionCard />
            <HardwareCard />
          </div>
        </article>
        <article
          className={`${height} col-span-2 row-span-2 w-full md:col-span-1 xl:col-span-2`}
        >
          <BitcoinCard />
        </article>
        {isLnImplSelected && (
          <article className="col-span-2 row-span-2 w-full md:col-span-1 xl:col-span-2">
            <LightningCard />
          </article>
        )}
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
