import useClipboard from "hooks/use-clipboard";
import ModalDialog from "layouts/ModalDialog";
import { QRCodeSVG } from "qrcode.react";
import { Tooltip } from "react-tooltip";
import { FC } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { MODAL_ROOT } from "utils";

type Props = {
  identityUri: string;
  closeModal: () => void;
};

const QRCodeModal: FC<Props> = ({ identityUri, closeModal }) => {
  const { t } = useTranslation();
  const [copyNodeId, clippedNodeId] = useClipboard(identityUri);

  return createPortal(
    <ModalDialog close={closeModal}>
      <div className="my-5 flex flex-col items-center justify-center">
        <QRCodeSVG value={identityUri} size={256} />
        <p className="my-5 text-sm text-gray-500 dark:text-gray-300">
          {t("home.connect_node")}
        </p>
        <p
          onClick={copyNodeId}
          data-tooltip-id="copy-tooltip"
          className="w-full break-all text-gray-600 dark:text-gray-200"
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
};

export default QRCodeModal;
