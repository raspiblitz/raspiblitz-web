import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ClipboardIcon } from "../../../../../assets/clipboard-copy.svg";
import useClipboard from "../../../../../hooks/use-clipboard";
import { Transaction } from "../../../../../models/transaction.model";
import { AppContext, Unit } from "../../../../../store/app-context";
import {
  convertMSatToBtc,
  convertMSatToSat,
  convertToString,
} from "../../../../../util/format";

export const LNDetails: FC<LNDetailProps> = (props) => {
  const { unit } = useContext(AppContext);
  const { t } = useTranslation();
  const { details } = props;
  const [copyId] = useClipboard(details.id);

  const containerClasses =
    "m-2 py-1 flex overflow-hidden border-gray-400 border-b-2 text-left";
  const keyClasses = "w-1/2 text-gray-500 dark:text-gray-200";
  const valueClasses = "w-1/2 overflow-hidden overflow-x-auto mx-2";

  const date = new Date(details.time_stamp * 1000).toLocaleString(); // epoch time => * 1000

  const amount =
    unit === Unit.BTC
      ? convertToString(unit, convertMSatToBtc(details.amount))
      : convertToString(unit, convertMSatToSat(details.amount));

  return (
    <section className="flex flex-col py-3 my-4">
      <article className={containerClasses}>
        <h6 className={keyClasses}>{t("tx.txid")}</h6>
        <p className={valueClasses}>{details.id}</p>
        <div>
          <ClipboardIcon
            className="h-5 w-5 hover:text-blue-500"
            onClick={copyId}
          />
        </div>
      </article>
      <article className={containerClasses}>
        <h6 className={keyClasses}>{t("home.status")}</h6>
        <p className={valueClasses}>{details.status}</p>
      </article>
      <article className={containerClasses}>
        <h6 className={keyClasses}>{t("tx.date")}</h6>
        <p className={valueClasses}>{date}</p>
      </article>
      <article className={containerClasses}>
        <h6 className={keyClasses}>{t("tx.fee")}</h6>
        <div className={valueClasses}>{details.total_fees} mSat</div>
      </article>
      <article className={containerClasses}>
        <h6 className={keyClasses}>{t("tx.value")}</h6>
        <p className={valueClasses}>
          {amount} {unit}
        </p>
      </article>
      <article className={containerClasses}>
        <h6 className={keyClasses}>{t("tx.description")}</h6>
        <p className={valueClasses}>{details.comment}</p>
      </article>
    </section>
  );
};

export default LNDetails;

export interface LNDetailProps {
  details: Transaction;
}
