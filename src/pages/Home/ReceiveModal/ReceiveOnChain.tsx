import { QRCodeSVG } from "qrcode.react";
import { Tooltip } from "react-tooltip";
import { Dispatch, FC, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import useClipboard from "@/hooks/use-clipboard";
import { instance } from "@/utils/interceptor";
import { RefreshIcon } from "@bitcoin-design/bitcoin-icons-react/filled";
import { ApiError, checkError } from "@/utils/checkError";
import { AxiosError } from "axios";

type Props = {
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
};

const ReceiveOnChain: FC<Props> = ({
  address,
  setAddress,
  setIsLoading,
  setError,
}) => {
  const { t } = useTranslation();
  const [copyAddress, addressCopied] = useClipboard(address);

  const refreshAddressHandler = async () => {
    setAddress("");
    setError("");

    try {
      setIsLoading(true);
      const response = await instance.post("lightning/new-address", {
        type: "p2wkh",
      });
      setAddress(response.data);
    } catch (error) {
      setError(checkError(error as AxiosError<ApiError>));
    } finally {
      setIsLoading(false);
    }
  };

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
      <div>
        <button
          name="refresh-address"
          className="switch-button"
          onClick={refreshAddressHandler}
        >
          <span className="flex">
            <RefreshIcon className="mr-1 h-6 w-6" />
            {t("wallet.refresh")}
          </span>
        </button>
      </div>
    </>
  );
};

export default ReceiveOnChain;
