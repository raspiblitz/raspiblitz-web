import { QRCodeSVG } from "qrcode.react";
import Tooltip from "rc-tooltip";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import useClipboard from "../../../hooks/use-clipboard";

type Props = {
  address: string;
};

const ReceiveOnChain: FC<Props> = ({ address }) => {
  const { t } = useTranslation();
  const [copyAddress, addressCopied] = useClipboard(address);

  return (
    <>
      <QRCodeSVG role={"img"} className="mx-auto" value={address} size={256} />
      <p className="my-5 text-sm text-gray-500 dark:text-gray-300">
        {t("wallet.scan_qr")}
      </p>
      <article className="mb-5 flex flex-row items-center">
        <Tooltip
          overlay={
            <div>
              {addressCopied ? t("wallet.copied") : t("wallet.copy_clipboard")}
            </div>
          }
          placement="top"
        >
          <p
            onClick={copyAddress}
            className="m-2 w-full break-all text-gray-600 dark:text-white"
          >
            {address}
          </p>
        </Tooltip>
      </article>
    </>
  );
};

export default ReceiveOnChain;
