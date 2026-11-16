import { QRCodeSVG } from "qrcode.react";
import { useId } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import useClipboard from "@/hooks/use-clipboard";
import ModalDialog from "@/layouts/ModalDialog";
import { MODAL_ROOT } from "@/utils";

type Props = {
  identityUri: string;
  closeModal: () => void;
};

export default function QRCodeModal({ identityUri, closeModal }: Props) {
  const { t } = useTranslation();
  const [copyNodeId, clippedNodeId] = useClipboard(identityUri);
  const copyHintId = useId();

  return createPortal(
    <ModalDialog close={closeModal} label={t("home.node_id")}>
      <div className="my-5 flex flex-col items-center justify-center">
        <QRCodeSVG value={identityUri} size={256} className="h-auto max-w-full" />
        <p className="my-5 text-sm text-gray-300">{t("home.connect_node")}</p>
        <button
          type="button"
          onClick={copyNodeId}
          aria-describedby={copyHintId}
          data-tooltip-id="copy-tooltip"
          className="min-h-11 w-full break-all text-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {identityUri}
        </button>
        <span id={copyHintId} className="sr-only">
          {t("wallet.copy_clipboard")}
        </span>
        <Tooltip id="copy-tooltip">
          <div>{clippedNodeId ? t("wallet.copied") : t("wallet.copy_clipboard")}</div>
        </Tooltip>
      </div>
    </ModalDialog>,
    MODAL_ROOT,
  );
}
