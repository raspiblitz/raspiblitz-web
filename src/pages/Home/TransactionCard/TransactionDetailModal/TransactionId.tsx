import {
  CheckIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "@heroui/react";
import { type FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useClipboard from "@/hooks/use-clipboard";

interface Props {
  id: string;
  maxDisplay?: number;
}

/**
 * Transaction ID display component with toggle and copy functionality.
 * Click to toggle between truncated and full view.
 */
const TransactionId: FC<Props> = ({ id, maxDisplay = 8 }) => {
  const { t } = useTranslation();
  const [copyId, isCopied] = useClipboard(id);
  const [showCheck, setShowCheck] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setShowCheck(true);
      const timer = setTimeout(() => {
        setShowCheck(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const truncatedId =
    id.length > maxDisplay * 2
      ? `${id.slice(0, maxDisplay)}...${id.slice(-maxDisplay)}`
      : id;

  const displayId = expanded ? id : truncatedId;

  return (
    <section className="rounded-lg bg-gray-800/50 px-4 py-3 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h6 className="text-sm font-medium text-gray-400">{t("tx.txid")}</h6>
        <Tooltip
          content={
            expanded ? t("tx.click_to_collapse") : t("tx.click_to_expand")
          }
        >
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-1 w-full text-left font-mono text-sm text-gray-300 hover:text-gray-200"
            aria-label={
              expanded ? t("tx.click_to_collapse") : t("tx.click_to_expand")
            }
          >
            <span className={expanded ? "break-all" : "truncate"}>
              {displayId}
            </span>
          </button>
        </Tooltip>
      </div>
      <button
        type="button"
        onClick={copyId}
        className="shrink-0 rounded-lg bg-gray-700 p-2 text-gray-400 transition-all duration-200 hover:bg-gray-600 hover:text-gray-300 active:bg-gray-600"
        title={isCopied ? t("wallet.copied") : t("wallet.copy_clipboard")}
        aria-label={isCopied ? t("wallet.copied") : t("wallet.copy_clipboard")}
      >
        {showCheck ? (
          <CheckIcon className="h-5 w-5 text-green-400" />
        ) : (
          <ClipboardDocumentCheckIcon className="h-5 w-5" />
        )}
      </button>
    </section>
  );
};

export default TransactionId;
