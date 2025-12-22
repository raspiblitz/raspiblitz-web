import {
  ArrowDownIcon,
  InformationCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Button, Listbox, ListboxItem, Spinner } from "@heroui/react";
import { type FC, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "@/components/Alert";
import { AppContext } from "@/context/app-context";
import type { Implementation } from "@/models/ln-info";
import type { Transaction } from "@/models/transaction.model";
import CategoryIcon from "./CategoryIcon";
import { formatTransaction } from "./SingleTransaction";

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
  const { walletLocked, unit } = useContext(AppContext);
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
            &nbsp;
            {t("tx.transactions_none")}
          </div>
        )}

        {transactions.length > 0 && (
          <Listbox
            aria-label={t("tx.transactions")}
            selectionMode="none"
            onAction={(key) => {
              const tx = currentPageTxs.find((t) => t.id === String(key));
              if (tx) showDetails(tx.index);
            }}
            classNames={{
              base: "pt-4 p-0",
              list: "gap-2",
            }}
            itemClasses={{
              base: "rounded-lg bg-default-100/50 data-[hover=true]:bg-default-200/50 p-4 cursor-pointer transition-background",
            }}
          >
            {currentPageTxs.map((transaction: Transaction) => {
              const formatted = formatTransaction(transaction, unit);
              return (
                <ListboxItem
                  key={transaction.id}
                  textValue={`${formatted.comment}: ${formatted.sign}${formatted.formattedAmount} ${unit}`}
                >
                  <div className="flex flex-col gap-1">
                    {/* Row 1: Icon + Amount + Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CategoryIcon
                          category={transaction.category}
                          type={transaction.type}
                          status={transaction.status}
                          confirmations={transaction.num_confs ?? undefined}
                        />
                        <span
                          className={`text-lg font-semibold ${formatted.color}`}
                        >
                          {formatted.sign}
                          {formatted.formattedAmount} {unit}
                        </span>
                      </div>
                      <time
                        className="text-sm text-default-500"
                        dateTime={formatted.isoString}
                      >
                        {formatted.formattedDate}
                      </time>
                    </div>

                    {/* Row 2: Comment */}
                    <span className="truncate text-sm italic text-default-400">
                      {formatted.comment}
                    </span>
                  </div>
                </ListboxItem>
              );
            })}
          </Listbox>
        )}

        {transactions.length > 0 && (
          <div className="mt-auto flex justify-around py-5">
            <Button
              isIconOnly
              aria-label="page backward"
              onPress={pageBackwardHandler}
              isDisabled={page === 0}
            >
              <ArrowDownIcon className="h-6 w-6 rotate-90 transform" />
            </Button>

            <Button
              isIconOnly
              aria-label="page forward"
              onPress={pageForwardHandler}
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
