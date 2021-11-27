import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ClipboardIcon } from "../../../../../assets/clipboard-copy.svg";
import useClipboard from "../../../../../hooks/use-clipboard";
import { Transaction } from "../../../../../models/transaction.model";
import { AppContext } from "../../../../../store/app-context";
import { convertSatToBtc, convertToString } from "../../../../../util/format";

export const OnchainDetails: FC<OnchainDetailProps> = (props) => {
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
      ? convertToString(appCtx.unit, convertSatToBtc(details.amount))
      : convertToString(appCtx.unit, details.amount);

  return (
    <>
      <a
        className="text-blue-400 underline break-all py-2"
        target="_blank"
        rel="noreferrer"
        href={`https://mempool.space/tx/${details.id}`}
      >
        {t("tx.mempool")}
      </a>
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
          <h6 className={keyClasses}>{t("tx.confirmations")}</h6>
          <p className={valueClasses}>{details.num_confs || "Unconfirmed"}</p>
        </article>
        <article className={containerClasses}>
          <h6 className={keyClasses}>{t("tx.included_block")}</h6>
          <p className={valueClasses}>
            {details.block_height || "Unconfirmed"}
          </p>
        </article>
        <article className={containerClasses}>
          <h6 className={keyClasses}>{t("tx.date")}</h6>
          <p className={valueClasses}>{date}</p>
        </article>
        <article className={containerClasses}>
          <h6 className={keyClasses}>{t("wallet.amount")}</h6>
          <p className={valueClasses}>
            {amount} {appCtx.unit}
          </p>
        </article>
        <article className={containerClasses}>
          <h6 className={keyClasses}>{t("tx.fee")}</h6>
          <p className={valueClasses}>{details.total_fees || 0}</p>
        </article>
        <article className={containerClasses}>
          <h6 className={keyClasses}>{t("tx.description")}</h6>
          <p className={valueClasses}>{details.comment}</p>
        </article>
      </section>
    </>
  );
};

export default OnchainDetails;

export interface OnchainDetailProps {
  details: Transaction;
}
