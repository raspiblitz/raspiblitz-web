import Tooltip from "rc-tooltip";
import type { ChangeEvent, FC } from "react";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import ModalDialog from "../../../container/ModalDialog/ModalDialog";
import useClipboard from "../../../hooks/use-clipboard";
import { AppContext, Unit } from "../../../store/app-context";
import { convertBtcToSat } from "../../../util/format";
import { instance } from "../../../util/interceptor";
import { MODAL_ROOT } from "../../../util/util";
import AmountInput from "../AmountInput/AmountInput";
import InputField from "../InputField/InputField";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import SwitchTxType, { TxType } from "../SwitchTxType/SwitchTxType";

interface IFormInputs {
  amountInput: number;
  commentInput: string;
}

type Props = {
  onClose: () => void;
};

const ReceiveModal: FC<Props> = ({ onClose }) => {
  const { unit } = useContext(AppContext);
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
      unit === Unit.BTC ? convertBtcToSat(amount) * 1000 : amount * 1000;
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

  return createPortal(
    <ModalDialog close={onClose}>
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
          <p className="my-5 text-sm text-gray-500 dark:text-gray-300">
            {t("wallet.scan_qr")}
          </p>
        </>
      )}

      <form
        className="flex w-full flex-col items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="mb-5 w-4/5">
          {isLoading && (
            <div className="p-5">
              <LoadingSpinner />
            </div>
          )}

          {showLnInvoice && (
            <div className="flex flex-col justify-center pb-5 text-center">
              <AmountInput
                amount={amount}
                register={register("amountInput", {
                  required: t(
                    "forms.validation.chainAmount.required"
                  ) as string,
                  validate: {
                    greaterThanZero: (value) =>
                      value > 0 ||
                      (t("forms.validation.chainAmount.required") as string),
                  },
                  onChange: amountChangeHandler,
                })}
                errorMessage={errors.amountInput}
              />

              <div className="mt-2 flex flex-col justify-center">
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
              className="bd-button my-3 p-3"
              disabled={submitCount > 0 && !isValid}
            >
              {t("wallet.create_invoice")}
            </button>
          )}
        </fieldset>
      </form>

      {address && (
        <>
          <article className="mb-5 flex flex-row items-center">
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
                className="m-2 w-full break-all text-gray-600 dark:text-white"
              >
                {address}
              </p>
            </Tooltip>
          </article>
        </>
      )}
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default ReceiveModal;
