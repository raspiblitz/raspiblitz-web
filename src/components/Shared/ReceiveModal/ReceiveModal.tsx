import Tooltip from "rc-tooltip";
import { useContext, useState } from "react";
import type { ChangeEvent, FC } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import ModalDialog from "../../../container/ModalDialog/ModalDialog";
import useClipboard from "../../../hooks/use-clipboard";
import { AppContext } from "../../../store/app-context";
import { convertBtcToSat } from "../../../util/format";
import { instance } from "../../../util/interceptor";
import AmountInput from "../AmountInput/AmountInput";
import InputField from "../InputField/InputField";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import SwitchTxType, { TxType } from "../SwitchTxType/SwitchTxType";

import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

interface IFormInputs {
  amountInput: number;
  commentInput: string;
}

const ReceiveModal: FC<ReceiveModalProps> = (props) => {
  const appCtx = useContext(AppContext);
  const { t } = useTranslation();
  const [invoiceType, setInvoiceType] = useState(TxType.LIGHTNING);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyAddress, addressCopied] = useClipboard(address);

  const lnInvoice = invoiceType === TxType.LIGHTNING;

  const invoiceChangeHandler = async (txType: TxType) => {
    setAddress("");
    setAmount(0);
    setComment("");

    setInvoiceType(txType);

    if (txType === TxType.ONCHAIN) {
      setIsLoading(true);
      const resp = await instance.post("lightning/new-address", {
        type: "p2wkh",
      });
      setAddress(resp.data);
      setIsLoading(false);
    }
  };

  const commentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const amountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const generateInvoiceHandler = async () => {
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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInputs> = (_data) =>
    generateInvoiceHandler();

  return (
    <ModalDialog close={props.onClose}>
      {showLnInvoice && (
        <div className="text-xl font-bold">{t("wallet.create_invoice_ln")}</div>
      )}

      {!showLnInvoice && (
        <div className="text-xl font-bold">{t("wallet.fund")}</div>
      )}

      <div className="my-3">
        <SwitchTxType onTxTypeChange={invoiceChangeHandler} />
      </div>

      {address && (
        <>
          <div className="my-5 flex justify-center">
            <QRCode
              id="qr-code"
              value={address}
              className="overflow-visible"
              alt="QR Code"
            />
          </div>
          <p className="my-5 text-gray-500 dark:text-gray-300 text-sm">
            {t("wallet.scan_qr")}
          </p>
        </>
      )}

      <form
        className="w-full flex flex-col items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="w-4/5 mb-5">
          {isLoading && (
            <div className="p-5">
              <LoadingSpinner />
            </div>
          )}

          {showLnInvoice && (
            <div className="flex flex-col pb-5 justify-center text-center">
              <AmountInput
                amount={amount}
                register={register("amountInput", {
                  required: t(
                    "forms.validation.chainAmount.required"
                  ) as string,
                  onChange: amountChangeHandler,
                })}
                errorMessage={errors.amountInput}
              />

              <div className="flex flex-col justify-center mt-2">
                <InputField
                  {...register("commentInput", {
                    onChange: commentChangeHandler,
                  })}
                  label={t("tx.comment")}
                  value={comment}
                  placeholder={t("tx.comment_placeholder")}
                />
              </div>
            </div>
          )}

          {!address && showLnInvoice && (
            <button
              type="submit"
              className="bd-button p-3 my-3"
              disabled={submitCount > 0 && !isValid}
            >
              {t("wallet.create_invoice")}
            </button>
          )}
        </fieldset>
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
