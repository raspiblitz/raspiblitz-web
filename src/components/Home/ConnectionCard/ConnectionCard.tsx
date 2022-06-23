import { QRCodeSVG } from "qrcode.react";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import { FC, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ReactComponent as ClipboardIcon } from "../../../assets/clipboard-copy.svg";
import { ReactComponent as EyeOffIcon } from "../../../assets/eye-off.svg";
import { ReactComponent as EyeIcon } from "../../../assets/eye.svg";
import { ReactComponent as QRCodeIcon } from "../../../assets/qrcode.svg";
import ModalDialog from "../../../container/ModalDialog/ModalDialog";
import useClipboard from "../../../hooks/use-clipboard";
import { SSEContext } from "../../../store/sse-context";
import { MODAL_ROOT } from "../../../util/util";
import LoadingBox from "../../Shared/LoadingBox/LoadingBox";

const HIDDEN_TEXT = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

export const ConnectionCard: FC = () => {
  const { t } = useTranslation();
  const { systemInfo, lnInfoLite } = useContext(SSEContext);
  const [showAddress, setShowAddress] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { tor_web_ui: torAddress, ssh_address: sshAddress } = systemInfo;
  const { identity_pubkey: nodeId } = lnInfoLite || {};

  const [copyTor, clippedTor] = useClipboard(torAddress);
  const [copySsh, clippedSsh] = useClipboard(sshAddress);
  const [copyNodeId, clippedNodeId] = useClipboard(nodeId);

  const toggleAddressHandler = () => {
    setShowAddress((prev) => !prev);
  };

  if (!sshAddress || !torAddress) {
    return (
      <div className="h-full w-1/2">
        <LoadingBox />
      </div>
    );
  }

  const showModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const qrCodeModal =
    showModal &&
    createPortal(
      <ModalDialog close={closeModalHandler}>
        <div className="my-5 flex flex-col items-center justify-center">
          <QRCodeSVG value={nodeId} size={256} />
          <p className="mt-10 mb-3 text-sm text-gray-500 dark:text-white">
            {nodeId}
          </p>
        </div>
      </ModalDialog>,
      MODAL_ROOT
    );

  return (
    <>
      {qrCodeModal}
      <div className="bd-card w-full transition-colors lg:mr-2 lg:w-1/2">
        <div className="flex items-center text-lg font-bold">
          {t("home.conn_details")}&nbsp;
          <Tooltip
            overlay={<div>{showAddress ? t("home.hide") : t("home.show")}</div>}
            placement="top"
          >
            {showAddress ? (
              <EyeOffIcon
                onClick={toggleAddressHandler}
                className="inline-block h-6 w-6 cursor-pointer align-top"
              />
            ) : (
              <EyeIcon
                onClick={toggleAddressHandler}
                className="inline-block h-6 w-6 cursor-pointer align-top"
              />
            )}
          </Tooltip>
        </div>
        <article className="flex flex-col overflow-hidden py-4">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {`${t("home.webui")} (${t("home.tor")})`}
          </h6>
          <div className="flex">
            <a
              className={`${
                showAddress
                  ? "w-10/12 overflow-hidden overflow-ellipsis text-blue-400 underline"
                  : "text-blur w-10/12"
              }`}
              title={`${torAddress}`}
              href={`//${torAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {showAddress ? torAddress : HIDDEN_TEXT}
            </a>
            <Tooltip
              overlay={
                <div>
                  {clippedTor ? t("wallet.copied") : t("wallet.copy_clipboard")}
                </div>
              }
              placement="top"
            >
              <ClipboardIcon
                className="inline-flex h-6 w-2/12 cursor-pointer justify-self-end"
                onClick={copyTor}
              />
            </Tooltip>
          </div>
        </article>
        <article className="flex flex-col overflow-hidden py-4">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {`${t("home.webui")} (${t("home.ssh")})`}
          </h6>
          <div className="flex">
            <a
              className={`${
                showAddress
                  ? "w-10/12 overflow-hidden overflow-ellipsis text-blue-400 underline"
                  : "text-blur w-10/12"
              }`}
              title={`${sshAddress}`}
              href={`ssh://${sshAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {showAddress ? sshAddress : HIDDEN_TEXT}
            </a>
            <Tooltip
              overlay={
                <div>
                  {clippedSsh ? t("wallet.copied") : t("wallet.copy_clipboard")}
                </div>
              }
              placement="top"
            >
              <ClipboardIcon
                className="inline-flex h-6 w-2/12 cursor-pointer justify-self-end"
                onClick={copySsh}
              />
            </Tooltip>
          </div>
        </article>
        {nodeId && (
          <article className="flex flex-col overflow-hidden py-4">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.node_id")}
            </h6>
            <div className="flex">
              <a
                className={`${
                  showAddress
                    ? "w-10/12 overflow-hidden overflow-ellipsis text-blue-400 underline"
                    : "text-blur w-10/12"
                }`}
                title={`${nodeId}`}
                href={`ssh://${nodeId}`}
                target="_blank"
                rel="noreferrer"
              >
                {showAddress ? nodeId : HIDDEN_TEXT}
              </a>
              <Tooltip
                overlay={
                  <div>
                    {clippedNodeId
                      ? t("wallet.copied")
                      : t("wallet.copy_clipboard")}
                  </div>
                }
                placement="top"
              >
                <ClipboardIcon
                  className="inline-flex h-6 w-2/12 cursor-pointer justify-self-end"
                  onClick={copyNodeId}
                />
              </Tooltip>
              <Tooltip overlay={<div>{t("home.show_qr")}</div>} placement="top">
                <QRCodeIcon
                  className="inline-flex h-6 w-2/12 cursor-pointer justify-self-end"
                  onClick={showModalHandler}
                />
              </Tooltip>
            </div>
          </article>
        )}
      </div>
    </>
  );
};

export default ConnectionCard;
