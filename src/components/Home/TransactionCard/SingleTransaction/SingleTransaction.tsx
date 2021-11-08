import { FC, useContext } from "react";
import { ReactComponent as ReceiveIcon } from "../../../../assets/arrow-down.svg";
import { ReactComponent as SendIcon } from "../../../../assets/arrow-up.svg";
import { ReactComponent as ChainIcon } from "../../../../assets/chain.svg";
import { ReactComponent as LightningIcon } from "../../../../assets/lightning.svg";
import { Transaction } from "../../../../models/transaction.model";
import { AppContext } from "../../../../store/app-context";
import {
  convertMSatToBtc,
  convertMSatToSat,
  convertSatToBtc,
  convertToString,
} from "../../../../util/format";

export const SingleTransaction: FC<SingleTransactionProps> = (props) => {
  const { amount, category, time_stamp, type, comment } = props.transaction;
  const appCtx = useContext(AppContext);

  const sendingTx = type === "send";
  const sign = sendingTx ? "" : "+";

  let formattedAmount;

  if (category === "onchain") {
    formattedAmount =
      appCtx.unit === "BTC"
        ? convertToString(appCtx.unit, convertSatToBtc(amount))
        : convertToString(appCtx.unit, amount);
  } else {
    formattedAmount =
      appCtx.unit === "BTC"
        ? convertToString(appCtx.unit, convertMSatToBtc(amount))
        : convertToString(appCtx.unit, convertMSatToSat(amount));
  }

  const date = new Date(time_stamp * 1000);
  const formattedDate = date.toLocaleString();
  const isoString = date.toISOString();

  const color = sendingTx ? "text-red-400" : "text-green-400";

  const categoryIcon = sendingTx ? (
    <SendIcon className="h-5 w-1/12 transform rotate-45" />
  ) : (
    <ReceiveIcon className="h-5 w-1/12" />
  );

  return (
    <li
      className="text-center px-4 py-3 hover:bg-gray-300 dark:hover:bg-gray-600"
      onClick={props.onClick}
    >
      <div className="flex justify-center items-center">
        {category === "onchain" && <ChainIcon className="h-5 w-1/12" />}
        {category === "ln" && <LightningIcon className="h-5 w-1/12" />}
        {categoryIcon}
        <div className="w-3/12 italic overflow-ellipsis overflow-hidden whitespace-nowrap text-left">
          {comment || "Transaction"}
        </div>
        <p className={`inline-block w-7/12 ${color}`}>
          {sign}
          {formattedAmount} {appCtx.unit}
        </p>
      </div>

      <time className="text-sm" dateTime={isoString}>
        {formattedDate}
      </time>
      <div className="w-11/12 h-1 mx-auto">
        <div className="border border-b border-gray-200" />
      </div>
    </li>
  );
};

export default SingleTransaction;

export interface SingleTransactionProps {
  transaction: Transaction;
  onClick: () => void;
}
