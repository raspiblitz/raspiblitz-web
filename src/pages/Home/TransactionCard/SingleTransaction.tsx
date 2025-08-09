import { type FC, useContext } from "react";
import { AppContext, Unit } from "@/context/app-context";
import type { Transaction } from "@/models/transaction.model";
import {
  convertMSatToBtc,
  convertMSatToSat,
  convertSatToBtc,
  convertToString,
} from "@/utils/format";
import CategoryIcon from "./CategoryIcon";

export type Props = {
  transaction?: Transaction;
  onClick?: () => void;
};

export const SingleTransaction: FC<Props> = ({ transaction, onClick }) => {
  const { unit } = useContext(AppContext);

  if (!transaction) {
    // Display empty Tx card
    return <li className="h-24 px-0 py-2 md:px-4" />;
  }

  const { amount, category, time_stamp, type, comment, status, num_confs } =
    transaction;

  const sendingTx = type === "send";
  const sign = sendingTx ? "" : "+";

  let formattedAmount: string;

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
      className="flex h-24 cursor-pointer flex-col justify-center border-b border-gray-400 px-0 py-2 text-center hover:bg-gray-700 md:px-4"
      onClick={onClick}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      <div className="flex w-full items-center justify-center">
        <div className="w-2/12">
          <CategoryIcon
            category={category}
            type={type}
            status={status}
            confirmations={num_confs ? num_confs : undefined}
          />
        </div>
        <time className="w-5/12 text-left text-sm" dateTime={isoString}>
          {formattedDate}
        </time>
        <p className={`inline-block w-8/12 text-right ${color}`}>
          {sign}
          {formattedAmount} {unit}
        </p>
      </div>
      <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-center italic">
        {comment || "Transaction"}
      </div>
    </li>
  );
};

export default SingleTransaction;
