import { FC, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ArrowDownIcon } from "../../../assets/arrow-down.svg";
import { ReactComponent as ClosedLockIcon } from "../../../assets/lock-closed.svg";
import { Transaction } from "../../../models/transaction.model";
import { AppContext } from "../../../store/app-context";
import LoadingBox from "../../Shared/LoadingBox/LoadingBox";
import SingleTransaction from "./SingleTransaction/SingleTransaction";

type Props = {
  transactions: Transaction[];
  showDetails: (index: number) => void;
  isLoading: boolean;
};

const MAX_ITEMS = 6;

const TransactionCard: FC<Props> = ({
  /* transactions, */
  isLoading,
  showDetails,
}) => {
  const transactions: Transaction[] = [];

  const { t } = useTranslation();
  const { walletLocked } = useContext(AppContext);
  const [page, setPage] = useState(0);

  if (walletLocked) {
    return (
      <div className="p-5 h-full">
        <div className="bd-card flex flex-col transition-colors min-h-144 md:min-h-0">
          <div className="h-full flex justify-center items-center">
            <ClosedLockIcon className="h-6 w-6" />
            WALLET LOCKED
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
    <div className="p-5 h-full">
      <section className="bd-card flex flex-col transition-colors min-h-144 md:min-h-0">
        <h2 className="font-bold text-lg">{t("tx.transactions")}</h2>

        {transactions.length === 0 && <p>...no transactions yet, much sad</p>}

        {transactions.length > 0 && (
          <ul className="mt-auto">
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
          <article className="flex justify-around py-5 mt-auto">
            <button
              onClick={pageBackwardHandler}
              disabled={page === 0}
              className="bg-black hover:bg-gray-700 text-white p-2 rounded flex disabled:opacity-50"
            >
              <ArrowDownIcon className="h-6 w-6 transform rotate-90" />
            </button>

            <button
              className="bg-black hover:bg-gray-700 text-white p-2 rounded flex disabled:opacity-50"
              onClick={pageForwardHandler}
              disabled={page * MAX_ITEMS + MAX_ITEMS >= transactions.length}
            >
              <ArrowDownIcon className="h-6 w-6 transform -rotate-90" />
            </button>
          </article>
        )}
      </section>
    </div>
  );
};

export default TransactionCard;
