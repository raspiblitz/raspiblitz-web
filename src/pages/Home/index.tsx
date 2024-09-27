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
import { AppContext } from "@/context/app-context";
import { SSEContext } from "@/context/sse-context";
import { useInterval } from "@/hooks/use-interval";
import { useModalManager, type ModalType } from "@/hooks/use-modalmanager";
import PageLoadingScreen from "@/layouts/PageLoadingScreen";
import { Transaction } from "@/models/transaction.model";
import { enableGutter } from "@/utils";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { HttpStatusCode } from "axios";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const startupToastId = "startup-toast";

// todo: get this from use-modalmanager

const Home: FC = () => {
  const { activeModal, disclosure, openModal, closeModal } = useModalManager();

  const { t } = useTranslation();
  const { walletLocked, setWalletLocked } = useContext(AppContext);
  const { balance, lnInfo, systemStartupInfo } = useContext(SSEContext);
  const [showModal, setShowModal] = useState<ModalType | false>(false);
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [txError, setTxError] = useState("");

  const { implementation } = lnInfo;
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

  const btcOnlyMode = systemStartupInfo?.lightning === "disabled";

  const getTransactions = useCallback(async () => {
    if (btcOnlyMode || (lightningState && lightningState !== "done")) {
      return;
    }
    try {
      const tx = await instance.get("/lightning/list-all-tx", {
        params: {
          reversed: true,
        },
      });
      setTransactions(tx.data);
      if (tx.status === HttpStatusCode.Ok && walletLocked) {
        setWalletLocked(false);
      }
    } catch (err: any) {
      if (err.response.status === HttpStatusCode.Locked) {
        setWalletLocked(true);
      } else {
        setTxError(checkError(err));
      }
    }
  }, [lightningState, btcOnlyMode, walletLocked, setWalletLocked]);

  useEffect(() => {
    if (!btcOnlyMode && !walletLocked && isLoadingTransactions) {
      getTransactions().finally(() => {
        setIsLoadingTransactions(false);
      });
    }
  }, [
    implementation,
    btcOnlyMode,
    isLoadingTransactions,
    walletLocked,
    getTransactions,
  ]);

  useEffect(() => {
    enableGutter();

    if (lightningState === "bootstrapping_after_unlock") {
      setWalletLocked(false);
    }

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

  useEffect(() => {
    if (showModal === "UNLOCK") {
      openModal("UNLOCK");
    }
    if (showModal === "LIST_CHANNEL") {
      openModal("LIST_CHANNEL");
    }
    // // } else if (hasPendingSend) {
    // //   openModal('send')
    // // } else if (hasPendingReceive) {
    // //   openModal('receive')
    // }
  }, [showModal, openModal]);

  const closeModalHandler = () => {
    setShowModal(false);
    setDetailTx(null);
    disclosure.onClose();
    closeModal();
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

  const modalComponent = () => (
    <>
      {activeModal === "UNLOCK" && (
        <UnlockModal
          disclosure={{ ...disclosure, onClose: closeModalHandler }}
        />
      )}
      {activeModal === "LIST_CHANNEL" && (
        <ListChannelModal
          disclosure={{ ...disclosure, onClose: closeModalHandler }}
        />
      )}
      {activeModal === "OPEN_CHANNEL" && (
        <>YO4</>
        //         <OpenChannelModal
        //           balance={balance.channel_local_balance!}
        //           onClose={closeModalHandler}
        //         />
      )}
      {activeModal === "SEND" && (
        // <SendModal disclosure={disclosure} onConfirm={handleSend} />
        <>YO1</>
      )}
      {activeModal === "RECEIVE" && (
        // <ReceiveModal disclosure={disclosure} onConfirm={handleReceive} />
        <>YO2</>
      )}
      {activeModal === "DETAIL" && (
        <>YO3</>
        //         <TransactionDetailModal
        //           transaction={detailTx!}
        //           close={closeModalHandler}
        //         />
      )}
    </>
  );

  if (implementation === null && lightningState !== "disabled") {
    return (
      <>
        {modalComponent()}
        <PageLoadingScreen />
      </>
    );
  }

  const height = btcOnlyMode ? "h-full md:h-1/2" : "h-full";

  return (
    <>
      {modalComponent()}
      <main
        className={`content-container page-container grid h-full grid-cols-1 grid-rows-1 gap-5 p-5 transition-colors bg-gray-700 text-white md:grid-cols-2 lg:gap-8 lg:pb-8 lg:pr-8 lg:pt-8 xl:grid-cols-4`}
      >
        {!btcOnlyMode && (
          <article className="col-span-2 row-span-2 md:col-span-1 xl:col-span-2">
            <WalletCard
              onReceive={() => setShowModal("RECEIVE")}
              onSend={() => setShowModal("SEND")}
              onOpenChannel={() => setShowModal("OPEN_CHANNEL")}
              onCloseChannel={() => setShowModal("LIST_CHANNEL")}
            />
          </article>
        )}

        {!btcOnlyMode && (
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
          <div className={`flex ${height} flex-col lg:flex-row`}>
            <ConnectionCard />
            <HardwareCard />
          </div>
        </article>

        <article
          className={`${height} col-span-2 row-span-2 w-full md:col-span-1 xl:col-span-2`}
        >
          <BitcoinCard />
        </article>

        {!btcOnlyMode && (
          <article className="col-span-2 row-span-2 w-full md:col-span-1 xl:col-span-2">
            <LightningCard />
          </article>
        )}
      </main>
    </>
  );
};

export default Home;
