import { BoltIcon, LinkIcon } from "@heroicons/react/24/outline";
import { type FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext, Unit } from "@/context/app-context";
import type { Transaction } from "@/models/transaction.model";
import {
  convertMSatToBtc,
  convertMSatToSat,
  convertSatToBtc,
  convertToString,
} from "@/utils/format";
import ConfirmationsRing from "./ConfirmationsRing";
import KeyValueCard from "./KeyValueCard";
import MempoolBadge from "./MempoolBadge";
import TransactionId from "./TransactionId";

export type Props = {
  details: Transaction;
};

export const TransactionDetails: FC<Props> = ({ details }) => {
  const { unit } = useContext(AppContext);
  const { t } = useTranslation();

  const date = new Date(details.time_stamp * 1000).toLocaleString(); // epoch time => multiply by 1000
  const isOnchain = details.category === "onchain";
  const isIncoming = details.type === "receive";

  // Format amount based on category and unit (use absolute value, direction shown by color/icon)
  const absAmount = Math.abs(details.amount);
  const amount = isOnchain
    ? unit === Unit.BTC
      ? convertToString(unit, convertSatToBtc(absAmount))
      : convertToString(unit, absAmount)
    : unit === Unit.BTC
      ? convertToString(unit, convertMSatToBtc(absAmount))
      : convertToString(unit, convertMSatToSat(absAmount));

  const feeValue = isOnchain
    ? `${
        unit === Unit.BTC
          ? convertToString(unit, convertSatToBtc(details.total_fees))
          : convertToString(unit, details.total_fees)
      } ${unit}`
    : `${details.total_fees} mSat`;

  // Determine amount color based on transaction direction
  const amountColor = isIncoming ? "text-green-400" : "text-red-400";

  return (
    <div className="space-y-4 pb-4">
      {/* Top bar */}
      <div className="flex justify-around">
        {/* Transaction Type Indicator */}
        <div className="inline-flex justify-start">
          {isOnchain ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-900/30 px-4 py-2 text-sm text-orange-300">
              <LinkIcon className="h-4 w-4" />
              <span>{t("wallet.on_chain")}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-900/30 px-4 py-2 text-sm text-yellow-300">
              <BoltIcon className="h-4 w-4" />
              <span>{t("home.lightning")}</span>
            </div>
          )}
        </div>

        {/* Mempool Badge - Only for on-chain transactions */}
        {isOnchain && (
          <div className="inline-flex">
            <MempoolBadge txId={details.id} />
          </div>
        )}
      </div>

      {/* Transaction ID Section */}
      <TransactionId id={details.id} />

      {/* Status Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-300">
          {t("tx.tx_details")}
        </h3>

        {isOnchain && (
          <div className="flex justify-center rounded-lg bg-gray-800/30 py-4">
            <ConfirmationsRing confirmations={details.num_confs || 0} />
          </div>
        )}

        {isOnchain && details.block_height && (
          <KeyValueCard
            name={t("tx.included_block")}
            value={`${details.block_height}`}
          />
        )}

        {!isOnchain && (
          <KeyValueCard name={t("home.status")} value={details.status} />
        )}
      </div>

      {/* Details Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-300">
          {t("tx.details")}
        </h3>

        <KeyValueCard name={t("tx.date")} value={date} />

        <div className="rounded-lg bg-gray-800/50 px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h6 className="text-sm font-medium text-gray-400">
                {isOnchain ? t("wallet.amount") : t("tx.value")}
              </h6>
            </div>
            <div className="flex-1 text-right">
              <p className={`text-sm font-semibold ${amountColor}`}>
                {isIncoming ? "+" : "-"}
                {amount} {unit}
              </p>
            </div>
          </div>
        </div>

        {details.total_fees !== null && (
          <KeyValueCard name={t("tx.fee")} value={feeValue} />
        )}

        {details.comment && (
          <KeyValueCard name={t("tx.description")} value={details.comment} />
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;
