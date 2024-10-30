import SingleTransaction from "./SingleTransaction";
import { Alert } from "@/components/Alert";
import { AppContext } from "@/context/app-context";
import { Implementation } from "@/models/ln-info";
import { Transaction } from "@/models/transaction.model";
import {
  ArrowDownIcon,
  InformationCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Spinner } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { FC, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

export type Props = {
  transactions: Transaction[];
  showDetails: (index: number) => void;
  isLoading: boolean;
  error: string;
  implementation: Implementation;
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
        <div className="bd-card min-h-144 flex flex-col transition-colors md:min-h-0">
          <div className="flex h-full items-center justify-center">
            <LockClosedIcon className="h-6 w-6" />
            {t("wallet.wallet_locked")}
          </div>
        </div>
      </div>
    );
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
      page * MAX_ITEMS + MAX_ITEMS,
    );
  }

  const fillEmptyTxAmount = MAX_ITEMS - currentPageTxs.length;

  return (
    <div className="h-full">
      <section className="bd-card flex flex-col transition-colors">
        <h2 className="text-lg font-bold">{t("tx.transactions")}</h2>

        {isLoading && <Spinner size="lg" />}

        {error && <Alert color="danger">{error}</Alert>}

        {/* TODO: Remove after https://github.com/fusion44/blitz_api/issues/87 is resolved & Version 1.10.0 of RaspiBlitz is out */}
        {implementation?.includes("CLN") && (
          <Alert color="warning">{t("home.onchain_cln_no_support")}</Alert>
        )}

        {!error && transactions.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <InformationCircleIcon className="h-6 w-6" />
            &nbsp;{t("tx.transactions_none")}
          </div>
        )}

        {transactions.length > 0 && (
          <ul className="pt-5">
            {currentPageTxs.map((transaction: Transaction, index: number) => {
              return (
                <SingleTransaction
                  onClick={() => showDetails(transaction.index)}
                  key={index}
                  transaction={transaction}
                />
              );
            })}
            {[...Array(fillEmptyTxAmount)].map((_, index: number) => (
              <SingleTransaction key={index} />
            ))}
          </ul>
        )}

        {transactions.length > 0 && (
          <div className="mt-auto flex justify-around py-5">
            <Button
              isIconOnly
              aria-label="page backward"
              onClick={pageBackwardHandler}
              isDisabled={page === 0}
            >
              <ArrowDownIcon className="h-6 w-6 rotate-90 transform" />
            </Button>

            <Button
              isIconOnly
              aria-label="page forward"
              onClick={pageForwardHandler}
              isDisabled={page * MAX_ITEMS + MAX_ITEMS >= transactions.length}
            >
              <ArrowDownIcon className="h-6 w-6 -rotate-90 transform" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default TransactionCard;
