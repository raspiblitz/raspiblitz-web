import { Unit } from "@/context/app-context";
import type { Transaction } from "@/models/transaction.model";
import {
  convertMSatToBtc,
  convertMSatToSat,
  convertSatToBtc,
  convertToString,
} from "@/utils/format";

export type FormattedTransaction = {
  formattedAmount: string;
  formattedDate: string;
  isoString: string;
  color: string;
  sign: string;
  comment: string;
  sendingTx: boolean;
  category: Transaction["category"];
  type: Transaction["type"];
  status: Transaction["status"];
  num_confs: Transaction["num_confs"];
};

export function formatTransaction(
  transaction: Transaction,
  unit: Unit,
): FormattedTransaction {
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

  return {
    formattedAmount,
    formattedDate,
    isoString,
    color,
    sign,
    comment: comment || "Transaction",
    sendingTx,
    category,
    type,
    status,
    num_confs,
  };
}
