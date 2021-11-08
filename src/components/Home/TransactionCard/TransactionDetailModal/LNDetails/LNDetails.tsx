import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ClipboardIcon } from "../../../../../assets/clipboard-copy.svg";
import useClipboard from "../../../../../hooks/use-clipboard";
import { Transaction } from "../../../../../models/transaction.model";
import { AppContext } from "../../../../../store/app-context";
import {
  convertMSatToBtc,
  convertMSatToSat,
  convertToString,
} from "../../../../../util/format";

export const LNDetails: FC<LNDetailProps> = (props) => {
  const appCtx = useContext(AppContext);
  const { t } = useTranslation();
  const { details } = props;
  const [copyId] = useClipboard(details.id);

  const containerClasses =
    "m-2 py-1 flex overflow-hidden border-gray-400 border-b-2 text-left";
  const keyClasses = "w-1/2 text-gray-500 dark:text-gray-200";
  const valueClasses = "w-1/2 overflow-hidden overflow-x-auto mx-2";

  const date = new Date(details.time_stamp * 1000).toLocaleString(); // epoch time => * 1000

  const amount =
    appCtx.unit === "BTC"
      ? convertToString(appCtx.unit, convertMSatToBtc(details.amount))
      : convertToString(appCtx.unit, convertMSatToSat(details.amount));

  return (
    <div className="flex flex-col py-3 my-4">
      <div className={containerClasses}>
        <div className={keyClasses}>{t("tx.txid")}</div>
        <div className={valueClasses}>{details.id}</div>
        <div>
          <ClipboardIcon
            className="h-5 w-5 hover:text-blue-500"
            onClick={copyId}
          />
        </div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t("home.status")}</div>
        <div className={valueClasses}>{details.status}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t("tx.date")}</div>
        <div className={valueClasses}>{date}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t("tx.fee")}</div>
        <div className={valueClasses}>{details.total_fees} mSat</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t("tx.value")}</div>
        <div className={valueClasses}>
          {amount} {appCtx.unit}
        </div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t("tx.description")}</div>
        <div className={valueClasses}>{details.comment}</div>
      </div>
    </div>
  );
};

export default LNDetails;

export interface LNDetailProps {
  details: Transaction;
}
