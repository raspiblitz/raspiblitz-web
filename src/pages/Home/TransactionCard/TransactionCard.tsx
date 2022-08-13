import { FC, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ArrowDownIcon } from "../../../assets/arrow-down.svg";
import { ReactComponent as InfoCircleIcon } from "../../../assets/information-circle.svg";
import { ReactComponent as ClosedLockIcon } from "../../../assets/lock-closed.svg";
import LoadingBox from "../../../components/LoadingBox";
import Message from "../../../components/Message";
import { Transaction } from "../../../models/transaction.model";
import { AppContext } from "../../../context/app-context";
import SingleTransaction from "./SingleTransaction";

export type Props = {
  transactions: Transaction[];
  showDetails: (index: number) => void;
  isLoading: boolean;
  error: string;
  implementation: string;
};

const MAX_ITEMS = 6;

const TransactionCard: FC<Props> = ({
  transactions,
  isLoading,
  showDetails,
  error,
  implementation,
}) => {
  const { t } = useTranslation();
  const { walletLocked } = useContext(AppContext);
  const [page, setPage] = useState(0);

  if (walletLocked) {
    return (
      <div className="h-full p-5">
        <div className="bd-card md:min-h-0 flex min-h-144 flex-col transition-colors">
          <div className="flex h-full items-center justify-center">
            <ClosedLockIcon className="h-6 w-6" />
            {t("wallet.wallet_locked")}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingBox />;
  }

  const pageForwardHandler = () => {
    setPage((p) => p + 1);
  };

  const pageBackwardHandler = () => {
    setPage((p) => p - 1);
  };

  let currentPageTxs = transactions;

  if (transactions.length > MAX_ITEMS) {
    currentPageTxs = transactions.slice(
      page * MAX_ITEMS,
      page * MAX_ITEMS + MAX_ITEMS
    );
  }

  return (
    <div className="h-full p-5">
      <section className="bd-card md:min-h-0 flex min-h-144 flex-col transition-colors">
        <h2 className="text-lg font-bold">{t("tx.transactions")}</h2>

        {error && <Message message={error} />}

        {/*TODO: Remove after https://github.com/fusion44/blitz_api/issues/87 is resolved */}
        {implementation === "CLN" && (
          <Message
            message={t("home.onchain_cln_no_support")}
            color="bg-yellow-600"
          />
        )}

        {!error && transactions.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <InfoCircleIcon className="h-6 w-6" />
            &nbsp;{t("tx.transactions_none")}
          </div>
        )}

        {transactions.length > 0 && (
          <ul className="py-5">
            {currentPageTxs.map((transaction: Transaction, index: number) => {
              return (
                <SingleTransaction
                  onClick={() => showDetails(transaction.index)}
                  key={index}
                  transaction={transaction}
                />
              );
            })}
          </ul>
        )}

        {transactions.length > 0 && (
          <div className="mt-auto flex justify-around py-5">
            <button
              onClick={pageBackwardHandler}
              disabled={page === 0}
              className="flex rounded bg-black p-2 text-white hover:bg-gray-700 disabled:opacity-50"
            >
              <ArrowDownIcon className="h-6 w-6 rotate-90 transform" />
            </button>

            <button
              className="flex rounded bg-black p-2 text-white hover:bg-gray-700 disabled:opacity-50"
              onClick={pageForwardHandler}
              disabled={page * MAX_ITEMS + MAX_ITEMS >= transactions.length}
            >
              <ArrowDownIcon className="h-6 w-6 -rotate-90 transform" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default TransactionCard;
