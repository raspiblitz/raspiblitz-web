import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ArrowDownIcon } from "../../../assets/arrow-down.svg";
import { Transaction } from "../../../models/transaction.model";
import LoadingBox from "../../Shared/LoadingBox/LoadingBox";
import SingleTransaction from "./SingleTransaction/SingleTransaction";

const MAX_ITEMS = 6;

export const TransactionCard: FC<TransactionCardProps> = (props) => {
  const { t } = useTranslation();
  const { transactions, showDetails } = props;

  const [page, setPage] = useState(0);

  if (transactions.length === 0) {
    return <LoadingBox />;
  }

  const pageForwardHandler = () => {
    setPage((p) => p + 1);
  };

  const pageBackwardHandler = () => {
    setPage((p) => p - 1);
  };

  const currentPage = transactions.slice(
    page * MAX_ITEMS,
    page * MAX_ITEMS + MAX_ITEMS
  );

  return (
    <div className="p-5 h-full">
      <div className="bd-card flex flex-col transition-colors min-h-144 md:min-h-0">
        <div className="font-bold text-lg">{t("tx.transactions")}</div>
        <ul className="mt-auto">
          {currentPage.map((transaction: Transaction, index: number) => {
            return (
              <SingleTransaction
                onClick={() => showDetails(transaction.id)}
                key={index}
                transaction={transaction}
              />
            );
          })}
        </ul>
        <div className="flex justify-around py-5 mt-auto">
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
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;

export interface TransactionCardProps {
  transactions: Transaction[];
  showDetails: (id: string) => void;
}
