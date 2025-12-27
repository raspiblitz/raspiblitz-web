import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Link } from "@heroui/react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";

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
    <Button
      as={Link}
      href={mempoolUrl}
      target="_blank"
      rel="noreferrer"
      startContent={<ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />}
      className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-gray-800"
    >
      <span>{t("tx.mempool")}</span>
    </Button>
  );
};

export default MempoolBadge;
