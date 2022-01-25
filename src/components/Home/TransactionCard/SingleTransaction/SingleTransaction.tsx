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

export type Props = {
  transaction: Transaction;
  onClick: () => void;
};

export const SingleTransaction: FC<Props> = ({ transaction, onClick }) => {
  const { amount, category, time_stamp, type, comment, status } = transaction;
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
      className="flex flex-col justify-center px-0 py-3 text-center hover:bg-gray-300 dark:hover:bg-gray-500 md:px-4"
      onClick={onClick}
    >
      <div className="flex w-full items-center justify-center">
        <div className="w-2/12">
          <CategoryIcon category={category} type={type} status={status} />
        </div>
        <time className="w-5/12 text-sm" dateTime={isoString}>
          {formattedDate}
        </time>
        <p className={`inline-block w-8/12 ${color}`}>
          {sign}
          {formattedAmount} {unit}
        </p>
      </div>
      <div className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-center italic">
        {comment || "Transaction"}
      </div>
      <div className="mx-auto h-1 w-full">
        <div className="border border-b border-gray-200" />
      </div>
    </li>
  );
};

export default SingleTransaction;
