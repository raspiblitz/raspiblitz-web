import { QRCodeSVG } from "qrcode.react";
import { Tooltip } from "react-tooltip";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import useClipboard from "../../../hooks/use-clipboard";

type Props = {
  address: string;
};

const ReceiveAddress: FC<Props> = ({ address }) => {
  const { t } = useTranslation();
  const [copyAddress, addressCopied] = useClipboard(address);

  return (
    <>
      <QRCodeSVG role={"img"} className="mx-auto" value={address} size={256} />
      <p className="my-5 text-sm text-gray-500 dark:text-gray-300">
        {t("wallet.scan_qr")}
      </p>
      <article className="mb-5 flex flex-row items-center">
        <p
          onClick={copyAddress}
          className="w-full break-all text-gray-600 dark:text-gray-200"
          data-tooltip-id="copy-tooltip"
        >
          {address}
        </p>
        <Tooltip id="copy-tooltip">
          <div>
            {addressCopied ? t("wallet.copied") : t("wallet.copy_clipboard")}
          </div>
        </Tooltip>
      </article>
    </>
  );
};

export default ReceiveAddress;
