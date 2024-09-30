import { Button } from "@/components/Button";
import useClipboard from "@/hooks/use-clipboard";
import { QRCodeSVG } from "qrcode.react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

type Props = {
  address: string;
  onRefreshHandler?: () => void;
};

const ReceiveOnChain: FC<Props> = ({ address, onRefreshHandler }) => {
  const { t } = useTranslation();
  const [copyAddress, addressCopied] = useClipboard(address);

  return (
    <>
      <QRCodeSVG role={"img"} className="mx-auto" value={address} size={256} />

      <p className="my-5 text-sm text-gray-300">{t("wallet.scan_qr")}</p>

      <article className="mb-5 flex flex-row items-center">
        <p
          onClick={copyAddress}
          className="w-full break-all text-gray-200"
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

      {onRefreshHandler && (
        <div>
          <Button variant="light" onClick={onRefreshHandler}>
            {t("wallet.refresh")}
          </Button>
        </div>
      )}
    </>
  );
};

export default ReceiveOnChain;
