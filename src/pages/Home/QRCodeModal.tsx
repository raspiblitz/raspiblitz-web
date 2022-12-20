import useClipboard from "hooks/use-clipboard";
import ModalDialog from "layouts/ModalDialog";
import { QRCodeSVG } from "qrcode.react";
import Tooltip from "rc-tooltip";
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
        <p className="mt-10 mb-3 text-sm text-gray-500 dark:text-white">
          {t("home.connect_node")}
        </p>
        <Tooltip
          overlay={
            <div>
              {clippedNodeId ? t("wallet.copied") : t("wallet.copy_clipboard")}
            </div>
          }
          placement="top"
        >
          <p
            onClick={copyNodeId}
            className="mt-4 w-full break-all text-black dark:text-white"
          >
            {identityUri}
          </p>
        </Tooltip>
      </div>
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default QRCodeModal;
