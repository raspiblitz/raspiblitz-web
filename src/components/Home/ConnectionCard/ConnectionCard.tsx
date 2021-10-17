import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ClipboardIcon } from "../../../assets/clipboard-copy.svg";
import { ReactComponent as EyeIcon } from "../../../assets/eye.svg";
import useClipboard from "../../../hooks/use-clipboard";
import LoadingBox from "../../Shared/LoadingBox/LoadingBox";

const HIDDEN_TEXT = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

export const ConnectionCard: FC<ConnectionCardProps> = (props) => {
  const { t } = useTranslation();
  const { sshAddress, torAddress } = props;
  const [showTorAddr, setShowTorAddr] = useState(false);
  const [showSshAddr, setShowSshAddr] = useState(false);
  const [copyTor, clippedTor] = useClipboard(torAddress);
  const [copySsh, clippedSsh] = useClipboard(sshAddress);

  const toggleTorAddrHandler = () => {
    setShowTorAddr((prev) => !prev);
  };

  const toggleSshAddrHandler = () => {
    setShowSshAddr((prev) => !prev);
  };

  if (!sshAddress || !torAddress) {
    return <LoadingBox />;
  }

  return (
    <div className="p-5 h-full">
      <div className="bd-card transition-colors">
        <div className="font-bold text-lg">{t("home.conn_details")}</div>
        <div className="flex flex-col overflow-hidden py-4">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {t("home.tor")}&nbsp;
            <EyeIcon
              onClick={toggleTorAddrHandler}
              className="inline-block align-top h-6 w-6 cursor-pointer"
            />
          </h6>
          <div className="flex">
            <a
              className={`${
                showTorAddr
                  ? "w-10/12 overflow-hidden overflow-ellipsis text-blue-400 underline"
                  : "w-10/12 text-blur"
              }`}
              href={`//${torAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {showTorAddr ? props.torAddress : HIDDEN_TEXT}
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
                className="inline-flex justify-self-end h-6 w-2/12 cursor-pointer"
                onClick={copyTor}
              />
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden py-4">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {t("home.ssh")}&nbsp;
            <EyeIcon
              onClick={toggleSshAddrHandler}
              className="inline-block align-top h-6 w-6 cursor-pointer"
            />
          </h6>
          <div className="flex">
            <p className={showSshAddr ? "w-10/12" : "w-10/12 text-blur"}>
              {showSshAddr ? sshAddress : HIDDEN_TEXT}
            </p>
            <Tooltip
              overlay={
                <div>
                  {clippedSsh ? t("wallet.copied") : t("wallet.copy_clipboard")}
                </div>
              }
              placement="top"
            >
              <ClipboardIcon
                className="inline-flex justify-self-end h-6 w-2/12 cursor-pointer"
                onClick={copySsh}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;

export interface ConnectionCardProps {
  torAddress: string;
  sshAddress: string;
}
