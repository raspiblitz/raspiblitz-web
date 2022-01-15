import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ClipboardIcon } from "../../../../../assets/clipboard-copy.svg";
import useClipboard from "../../../../../hooks/use-clipboard";
import { Transaction } from "../../../../../models/transaction.model";
import { AppContext, Unit } from "../../../../../store/app-context";
import { convertSatToBtc, convertToString } from "../../../../../util/format";
import "../TransactionDetails.css";

export type Props = {
  details: Transaction;
};

export const OnchainDetails: FC<Props> = ({ details }) => {
  const { unit } = useContext(AppContext);
  const { t } = useTranslation();
  const [copyId] = useClipboard(details.id);

  const date = new Date(details.time_stamp * 1000).toLocaleString(); // epoch time => multiply by 1000

  const amount =
    unit === Unit.BTC
      ? convertToString(unit, convertSatToBtc(details.amount))
      : convertToString(unit, details.amount);

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
        <article className="detail-container">
          <h6 className="detail-key">{t("tx.txid")}</h6>
          <p className="detail-value">{details.id}</p>
          <div>
            <ClipboardIcon
              className="h-5 w-5 hover:text-blue-500"
              onClick={copyId}
            />
          </div>
        </article>
        <article className="detail-container">
          <h6 className="detail-key">{t("tx.confirmations")}</h6>
          <p className="detail-value">{details.num_confs || "Unconfirmed"}</p>
        </article>
        <article className="detail-container">
          <h6 className="detail-key">{t("tx.included_block")}</h6>
          <p className="detail-value">
            {details.block_height || "Unconfirmed"}
          </p>
        </article>
        <article className="detail-container">
          <h6 className="detail-key">{t("tx.date")}</h6>
          <p className="detail-value">{date}</p>
        </article>
        <article className="detail-container">
          <h6 className="detail-key">{t("wallet.amount")}</h6>
          <p className="detail-value">
            {amount} {unit}
          </p>
        </article>
        <article className="detail-container">
          <h6 className="detail-key">{t("tx.fee")}</h6>
          <p className="detail-value">{details.total_fees || 0}</p>
        </article>
        <article className="detail-container">
          <h6 className="detail-key">{t("tx.description")}</h6>
          <p className="detail-value">{details.comment}</p>
        </article>
      </section>
    </>
  );
};

export default OnchainDetails;
