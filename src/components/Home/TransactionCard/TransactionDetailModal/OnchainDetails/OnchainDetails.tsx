import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ClipboardIcon } from "../../../../../assets/clipboard-copy.svg";
import KeyValueDisplay from "../../../../../container/KeyValueDisplay/KeyValueDisplay";
import useClipboard from "../../../../../hooks/use-clipboard";
import { Transaction } from "../../../../../models/transaction.model";
import { AppContext, Unit } from "../../../../../store/app-context";
import { convertSatToBtc, convertToString } from "../../../../../util/format";

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

  const entries: { key: string; value: string }[] = [
    {
      key: t("tx.confirmations"),
      value: `${details.num_confs || t("tx.unconfirmed")}`,
    },
    {
      key: t("tx.included_block"),
      value: `${details.block_height || t("tx.unconfirmed")}`,
    },
    { key: t("tx.date"), value: date },
    { key: t("wallet.amount"), value: `${amount} ${unit}` },
    { key: t("tx.fee"), value: `${details.total_fees || ""}` },
    { key: t("tx.description"), value: details.comment },
  ];

  return (
    <>
      <a
        className="break-all py-2 text-blue-400 underline"
        target="_blank"
        rel="noreferrer"
        href={`https://mempool.space/tx/${details.id}`}
      >
        {t("tx.mempool")}
      </a>
      <section className="my-4 flex flex-col py-3">
        <article className="m-2 flex overflow-hidden border-b-2 border-gray-400 py-1 text-left">
          <h6 className="w-1/2 text-gray-500 dark:text-gray-200">
            {t("tx.txid")}
          </h6>
          <p className="mx-2 w-1/2 overflow-hidden overflow-x-auto">
            {details.id}
          </p>
          <div>
            <ClipboardIcon
              className="h-5 w-5 hover:text-blue-500"
              onClick={copyId}
            />
          </div>
        </article>
        {entries.map((entry) => (
          <KeyValueDisplay
            key={entry.key}
            name={entry.key}
            value={entry.value}
          />
        ))}
      </section>
    </>
  );
};

export default OnchainDetails;
