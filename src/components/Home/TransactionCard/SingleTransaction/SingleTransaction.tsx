import { FC, useContext } from "react";
import { Transaction } from "../../../../models/transaction.model";
import { AppContext, Unit } from "../../../../store/app-context";
import {
  convertMSatToBtc,
  convertMSatToSat,
  convertSatToBtc,
  convertToString,
} from "../../../../util/format";
import CategoryIcon from "./CategoryIcon";

export const SingleTransaction: FC<SingleTransactionProps> = (props) => {
  const { amount, category, time_stamp, type, comment, status } =
    props.transaction;
  const { unit } = useContext(AppContext);

  const sendingTx = type === "send";
  const sign = sendingTx ? "" : "+";

  let formattedAmount;

  if (category === "onchain") {
    formattedAmount =
      unit === Unit.BTC
        ? convertToString(unit, convertSatToBtc(amount))
        : convertToString(unit, amount);
  } else {
    formattedAmount =
      unit === Unit.BTC
        ? convertToString(unit, convertMSatToBtc(amount))
        : convertToString(unit, convertMSatToSat(amount));
  }

  const date = new Date(time_stamp * 1000);
  const formattedDate = date.toLocaleString();
  const isoString = date.toISOString();

  const color = sendingTx ? "text-red-400" : "text-green-400";

  return (
    <li
      className="text-center px-0 md:px-4 py-3 hover:bg-gray-300 dark:hover:bg-gray-500 flex flex-col justify-center"
      onClick={props.onClick}
    >
      <div className="flex justify-center items-center w-full">
        <div className="w-2/12">
          <CategoryIcon category={category} type={type} status={status} />
        </div>
        <time className="text-sm w-5/12" dateTime={isoString}>
          {formattedDate}
        </time>
        <p className={`inline-block w-8/12 ${color}`}>
          {sign}
          {formattedAmount} {unit}
        </p>
      </div>
      <div className="w-full italic overflow-ellipsis overflow-hidden whitespace-nowrap text-center">
        {comment || "Transaction"}
      </div>
      <div className="w-full h-1 mx-auto">
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
