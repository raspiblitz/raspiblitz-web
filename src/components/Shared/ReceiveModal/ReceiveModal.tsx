import QRCode from "qrcode.react";
import Tooltip from "rc-tooltip";
import { ChangeEvent, FC, FormEvent, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ClipboardIcon } from "../../../assets/clipboard-copy.svg";
import ModalDialog from "../../../container/ModalDialog/ModalDialog";
import useClipboard from "../../../hooks/use-clipboard";
import { AppContext } from "../../../store/app-context";
import { convertBtcToSat } from "../../../util/format";
import { instance } from "../../../util/interceptor";
import AmountInput from "../AmountInput/AmountInput";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const ReceiveModal: FC<ReceiveModalProps> = (props) => {
  const appCtx = useContext(AppContext);
  const { t } = useTranslation();
  const [invoiceType, setInvoiceType] = useState("lightning");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyAddress, addressCopied] = useClipboard(address);

  const lnInvoice = invoiceType === "lightning";

  const btnClasses =
    "text-center h-10 bg-yellow-500 hover:bg-yellow-400 rounded-lg w-full text-white";

  const invoiceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInvoiceType(event.target.value);
    setAddress("");
    setAmount(0);
    setComment("");
  };

  const commentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const amountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const generateAddressHandler = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    if (lnInvoice) {
      const mSatAmount =
        appCtx.unit === "BTC" ? convertBtcToSat(amount) * 1000 : amount * 1000;
      const resp = await instance.post(
        `lightning/add-invoice?value_msat=${mSatAmount}&memo=${comment}`
      );
      console.log(resp.data);
      setAddress(resp.data.payment_request);
    } else {
      // Commented out until https://github.com/fusion44/blitz_api/issues/43 is resolved
      // const body = {
      //  type: invoiceType,
      //  amount: lnInvoice ? amount : undefined,
      //  comment: lnInvoice ? comment : undefined,
      // };
      // const resp = await instance.post("receive", body);
      setAddress("bcrt1qu3yk3a9k2slu0g6l9wz3r0std2j9qypakgyrnr");
    }
    setIsLoading(false);
  };

  const showLnInvoice = lnInvoice && !isLoading && !address;

  const radioStyles =
    "px-3 py-2 shadow-md rounded-lg hover:text-white hover:bg-yellow-400 dark:hover:bg-yellow-400 dark:text-white dark:bg-gray-600";
  const lnStyle =
    invoiceType === "lightning"
      ? "text-white bg-yellow-500 dark:bg-yellow-500"
      : "";
  const walletStyle =
    invoiceType === "onchain"
      ? "text-white bg-yellow-500 dark:bg-yellow-500"
      : "";

  return (
    <ModalDialog close={props.onClose}>
      {showLnInvoice && (
        <div className="text-xl font-bold">{t("wallet.create_invoice_ln")}</div>
      )}
      {!showLnInvoice && (
        <div className="text-xl font-bold">{t("wallet.fund")}</div>
      )}
      <div className="py-8 flex justify-center">
        <div className="px-2">
          <label htmlFor="lightning" className={`${radioStyles} ${lnStyle}`}>
            {t("home.lightning")}
          </label>
          <input
            id="lightning"
            type="radio"
            className="hidden"
            name="invoiceType"
            value="lightning"
            onChange={invoiceChangeHandler}
          />
        </div>
        <div className="px-2">
          <label htmlFor="onchain" className={`${radioStyles} ${walletStyle}`}>
            {t("wallet.fund_short")}
          </label>
          <input
            id="onchain"
            type="radio"
            className="hidden"
            name="invoiceType"
            value="onchain"
            onChange={invoiceChangeHandler}
          />
        </div>
      </div>
      {address && <div className="my-5">{t("wallet.scan_qr")}</div>}
      {address && (
        <div className="my-5 flex justify-center">
          <QRCode value={address} />
        </div>
      )}
      <form
        className="flex flex-col items-center"
        onSubmit={generateAddressHandler}
      >
        <div className="w-4/5 mb-5">
          {isLoading && (
            <div className="p-5">
              <LoadingSpinner />
            </div>
          )}
          {showLnInvoice && (
            <div className="flex flex-col pb-5 justify-center text-center">
              <AmountInput
                amount={amount}
                onChangeAmount={amountChangeHandler}
              />
              <div className="flex flex-col justify-center mt-2">
                <label
                  htmlFor="comment"
                  className="block text-gray-700 dark:text-gray-300 text-sm mb-2 font-bold text-left"
                >
                  Comment
                </label>
                <input
                  id="comment"
                  type="text"
                  placeholder="Optional comment"
                  value={comment}
                  onChange={commentChangeHandler}
                  className="input-underline"
                />
              </div>
            </div>
          )}

          {!address && (
            <button type="submit" className={btnClasses}>
              {showLnInvoice && "Create Invoice"}
              {!showLnInvoice && "Generate Address"}
            </button>
          )}

          {address && (
            <>
              <article className="flex flex-row items-center">
                <div className="w-11/12 overflow-x-auto m-2">{address}</div>
                <Tooltip
                  overlay={
                    <div>
                      {addressCopied
                        ? t("wallet.copied")
                        : t("wallet.copy_clipboard")}
                    </div>
                  }
                  placement="top"
                >
                  <ClipboardIcon className="w-6 h-6" onClick={copyAddress} />
                </Tooltip>
              </article>
            </>
          )}
        </div>
      </form>
    </ModalDialog>
  );
};

export default ReceiveModal;

export interface ReceiveModalProps {
  onClose: () => void;
}
