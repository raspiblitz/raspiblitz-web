import Tooltip from "rc-tooltip";
import { ChangeEvent, FC, FormEvent, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
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

  const invoiceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress("");
    setAmount(0);
    setComment("");
    setInvoiceType(() => {
      const type = event.target.value;
      if (type === "onchain") {
        setIsLoading(true);
        instance
          .post("lightning/new-address", {
            type: "p2wkh",
          })
          .then((resp) => {
            setAddress(resp.data);
            setIsLoading(false);
          });
      }
      return type;
    });
  };

  const commentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const amountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const generateInvoiceHandler = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const mSatAmount =
      appCtx.unit === "BTC" ? convertBtcToSat(amount) * 1000 : amount * 1000;
    const resp = await instance.post(
      `lightning/add-invoice?value_msat=${mSatAmount}&memo=${comment}`
    );
    setAddress(resp.data.payment_request);
    setIsLoading(false);
  };

  const showLnInvoice = lnInvoice && !isLoading && !address;

  const radioStyles =
    "px-3 py-2 shadow-md rounded-lg hover:text-white hover:bg-yellow-400 dark:hover:bg-yellow-400 dark:text-white dark:bg-gray-500";
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
      <div className="py-5 flex flex-col md:flex-row justify-center">
        <div className="p-2 my-2">
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
        <div className="p-2 my-2">
          <label htmlFor="onchain" className={`${radioStyles} ${walletStyle}`}>
            {t("wallet.fund_onchain")}
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
      {address && (
        <>
          <div className="my-5 flex justify-center">
            <QRCode value={address} className="overflow-visible" />
          </div>
          <p className="my-5 text-gray-500 dark:text-gray-300 text-sm">
            {t("wallet.scan_qr")}
          </p>
        </>
      )}
      <form
        className="w-full flex flex-col items-center"
        onSubmit={generateInvoiceHandler}
      >
        {isLoading && (
          <div className="p-5">
            <LoadingSpinner />
          </div>
        )}
        {showLnInvoice && (
          <div className="flex flex-col pb-5 justify-center text-center">
            <AmountInput amount={amount} onChangeAmount={amountChangeHandler} />
            <div className="flex flex-col justify-center mt-2">
              <label
                htmlFor="comment"
                className="block text-gray-700 dark:text-white text-sm mb-2 font-bold text-left"
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

        {!address && showLnInvoice && (
          <button
            type="submit"
            className="text-center h-10 bg-yellow-500 hover:bg-yellow-400 rounded-lg w-full text-white mb-5"
          >
            {t("wallet.create_invoice")}
          </button>
        )}
      </form>
      {address && (
        <>
          <article className="flex flex-row items-center mb-5">
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
              <p
                onClick={copyAddress}
                className="w-full break-all m-2 text-gray-600 dark:text-white"
              >
                {address}
              </p>
            </Tooltip>
          </article>
        </>
      )}
    </ModalDialog>
  );
};

export default ReceiveModal;

export interface ReceiveModalProps {
  onClose: () => void;
}
