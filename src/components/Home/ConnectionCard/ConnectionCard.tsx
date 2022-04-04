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
  cpu_overall_percent: number;
  disk_io_read_bytes: number;
  vram_usage_percent: number;
  disk_io_write_bytes: number;
};

export const ConnectionCard: FC<Props> = ({
  sshAddress,
  torAddress,
  cpu_overall_percent,
  vram_usage_percent,
  disk_io_read_bytes,
  disk_io_write_bytes,
}) => {
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
    <div className="flex h-full flex-col p-5 lg:flex-row">
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
            {t("home.tor")}
          </h6>
          <div className="flex">
            <a
              className={`${
                showAddress
                  ? "w-10/12 overflow-hidden overflow-ellipsis text-blue-400 underline"
                  : "text-blur w-10/12"
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
                className="inline-flex h-6 w-2/12 cursor-pointer justify-self-end"
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
                  : "text-blur w-10/12"
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
                className="inline-flex h-6 w-2/12 cursor-pointer justify-self-end"
                onClick={copySsh}
              />
            </Tooltip>
          </div>
        </article>
      </div>
      {/* TODO: Hardware Card - Move out later */}
      <div className="bd-card mt-10 w-full transition-colors lg:mt-0 lg:ml-2 lg:w-1/2">
        <div className="flex items-center text-lg font-bold">
          Hardware Details
        </div>
        <article className="flex flex-row overflow-hidden py-4">
          <div className="flex w-1/2 flex-col">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">CPU %</h6>
            <div className="flex">{cpu_overall_percent}</div>
          </div>
          <div className="flex w-1/2 flex-col">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              Disk IO Read
            </h6>
            <div className="flex">
              {(disk_io_read_bytes / (1024 * 1024)).toFixed(2)} MB
            </div>
          </div>
        </article>
        <article className="flex flex-row overflow-hidden py-4">
          <div className="flex w-1/2 flex-col">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">RAM %</h6>
            <div className="flex">{vram_usage_percent}</div>
          </div>
          <div className="flex w-1/2 flex-col">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              Disk IO Write
            </h6>
            <div className="flex">
              {(disk_io_write_bytes / (1024 * 1024)).toFixed(2)} MB
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ConnectionCard;
