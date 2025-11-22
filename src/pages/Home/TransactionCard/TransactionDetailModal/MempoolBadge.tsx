import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  txId: string;
}

/**
 * Mempool badge component for on-chain transactions.
 * TODO: add option to define your own instance for the link in settings and use that
 */
const MempoolBadge: FC<Props> = ({ txId }) => {
  const { t } = useTranslation();
  const mempoolUrl = `https://mempool.space/tx/${txId}`;

  return (
    <a
      href={mempoolUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-blue-900/30 px-4 py-2 text-sm text-blue-300 transition-all duration-200 hover:bg-blue-900/50 hover:text-blue-200"
    >
      <span>{t("tx.mempool")}</span>
      <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
    </a>
  );
};

export default MempoolBadge;
