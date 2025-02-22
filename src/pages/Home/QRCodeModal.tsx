import useClipboard from "@/hooks/use-clipboard";
import ModalDialog from "@/layouts/ModalDialog";
import { MODAL_ROOT } from "@/utils";
import { QRCodeSVG } from "qrcode.react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

type Props = {
  identityUri: string;
  closeModal: () => void;
};

export default function QRCodeModal({ identityUri, closeModal }: Props) {
  const { t } = useTranslation();
  const [copyNodeId, clippedNodeId] = useClipboard(identityUri);

  return createPortal(
    <ModalDialog close={closeModal}>
      <div className="my-5 flex flex-col items-center justify-center">
        <QRCodeSVG value={identityUri} size={256} />
        <p className="my-5 text-sm text-gray-300">{t("home.connect_node")}</p>
        <p
          onClick={copyNodeId}
          onKeyUp={(e) => e.key === "Enter" && copyNodeId()}
          data-tooltip-id="copy-tooltip"
          className="w-full break-all text-gray-200"
        >
          {identityUri}
        </p>
        <Tooltip id="copy-tooltip">
          <div>
            {clippedNodeId ? t("wallet.copied") : t("wallet.copy_clipboard")}
          </div>
        </Tooltip>
      </div>
    </ModalDialog>,
    MODAL_ROOT,
  );
}
