import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ClipboardIcon } from "../../../assets/clipboard-copy.svg";
import { ReactComponent as EyeOffIcon } from "../../../assets/eye-off.svg";
import { ReactComponent as EyeIcon } from "../../../assets/eye.svg";
import useClipboard from "../../../hooks/use-clipboard";
import LoadingBox from "../../Shared/LoadingBox/LoadingBox";

const HIDDEN_TEXT = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

export type Props = {
  torAddress: string;
  sshAddress: string;
};

export const ConnectionCard: FC<Props> = ({ sshAddress, torAddress }) => {
  const { t } = useTranslation();
  const [showAddress, setShowAddress] = useState(true);
  const [copyTor, clippedTor] = useClipboard(torAddress);
  const [copySsh, clippedSsh] = useClipboard(sshAddress);

  const toggleAddressHandler = () => {
    setShowAddress((prev) => !prev);
  };

  if (!sshAddress || !torAddress) {
    return <LoadingBox />;
  }

  return (
    <div className="p-5 h-full">
      <section className="bd-card transition-colors">
        <article className="font-bold text-lg flex items-center">
          {t("home.conn_details")}&nbsp;
          <Tooltip
            overlay={<div>{showAddress ? t("home.hide") : t("home.show")}</div>}
            placement="top"
          >
            {showAddress ? (
              <EyeOffIcon
                onClick={toggleAddressHandler}
                className="inline-block align-top h-6 w-6 cursor-pointer"
              />
            ) : (
              <EyeIcon
                onClick={toggleAddressHandler}
                className="inline-block align-top h-6 w-6 cursor-pointer"
              />
            )}
          </Tooltip>
        </article>
        <article className="flex flex-col overflow-hidden py-4">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {t("home.tor")}
          </h6>
          <div className="flex">
            <a
              className={`${
                showAddress
                  ? "w-10/12 overflow-hidden overflow-ellipsis text-blue-400 underline"
                  : "w-10/12 text-blur"
              }`}
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
                className="inline-flex justify-self-end h-6 w-2/12 cursor-pointer"
                onClick={copyTor}
              />
            </Tooltip>
          </div>
        </article>
        <article className="flex flex-col overflow-hidden py-4">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {t("home.ssh")}
          </h6>
          <div className="flex">
            <a
              className={`${
                showAddress
                  ? "w-10/12 overflow-hidden overflow-ellipsis text-blue-400 underline"
                  : "w-10/12 text-blur"
              }`}
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
                className="inline-flex justify-self-end h-6 w-2/12 cursor-pointer"
                onClick={copySsh}
              />
            </Tooltip>
          </div>
        </article>
      </section>
    </div>
  );
};

export default ConnectionCard;
