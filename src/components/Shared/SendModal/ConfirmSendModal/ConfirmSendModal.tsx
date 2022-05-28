import type { ChangeEvent } from "react";
import { FC, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReactComponent as CheckIcon } from "../../../../assets/check.svg";
import { ReactComponent as ChevronLeft } from "../../../../assets/chevron-left.svg";
import { ReactComponent as XIcon } from "../../../../assets/X.svg";
import { AppContext } from "../../../../store/app-context";
import { instance } from "../../../../util/interceptor";
import AmountInput from "../../AmountInput/AmountInput";
import { TxType } from "../../SwitchTxType/SwitchTxType";
interface IFormInputs {
  amountInput: number;
}

export type Props = {
  amount: number;
  address: string;
  back: () => void;
  balance: number;
  close: (confirmed: boolean) => void;
  comment: string;
  expiry: number;
  fee: string;
  invoiceAmount: number;
  invoiceType: TxType;
  timestamp: number;
};

const ConfirmSendModal: FC<Props> = ({
  amount,
  address,
  back,
  balance,
  close,
  comment,
  expiry,
  fee,
  invoiceAmount,
  invoiceType,
  timestamp,
}) => {
  const { t } = useTranslation();
  const { unit } = useContext(AppContext);
  const [amountInput, setAmountInput] = useState(amount);
  const isLnTx = invoiceType === TxType.LIGHTNING;

  const amountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmountInput(+event.target.value);
  };

  const invoiceExpiryDate = timestamp + expiry;
  const invoiceExpiryDateDecorated = new Intl.DateTimeFormat("default", {
    dateStyle: "medium",
    timeStyle: "medium",
  })
    .format(invoiceExpiryDate)
    .toString();
  const isInvoiceExpired: boolean = isLnTx && invoiceExpiryDate < Date.now();
  const isInvoiceAmountBiggerThanBalance: boolean = invoiceAmount > balance;
  const isValidLnInvoice: boolean =
    !isLnTx ||
    (isLnTx && !isInvoiceExpired && !isInvoiceAmountBiggerThanBalance);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  // TODO: handle error
  const sendTransactionHandler = async () => {
    let response;
    let error = null;

    if (isLnTx) {
      let msatQuery = "";
      if (amountInput > 0) {
        msatQuery = `&amount_msat=${amountInput}`;
      }

      response = await instance
        .post(`lightning/send-payment?pay_req=${address}${msatQuery}`)
        .catch((e) => {
          error = e;
        });
    } else {
      const body = {
        amount: invoiceAmount === 0 ? amountInput : invoiceAmount,
        address,
        sat_per_vbyte: fee,
        label: comment,
        unit,
      };

      response = await instance
        .post("lightning/send-coins", body)
        .catch((e) => {
          error = e;
        });
    }

    console.info(response);
    close(!error);
  };

  const addressTitle = isLnTx ? t("wallet.invoice") : t("wallet.address");
  const commentHeading = isLnTx ? t("tx.description") : t("tx.comment");

  return (
    <form onSubmit={handleSubmit(sendTransactionHandler)}>
      <div className="break-all">
        <button
          onClick={back}
          className="flex items-center justify-center font-bold outline-none"
        >
          <ChevronLeft className="inline-block h-4 w-4" />
          {t("navigation.back")}
        </button>

        <h4 className="my-3 break-normal font-extrabold">
          {t("tx.confirm_info")}:{" "}
        </h4>

        <div className="my-2">
          <h4 className="font-bold">{addressTitle}:</h4> {address}
          <br />
          {isInvoiceExpired && (
            <p className="text-red-500">
              {t("forms.validation.lnInvoice.expired")}:{" "}
              {invoiceExpiryDateDecorated}
            </p>
          )}
        </div>

        <div className="my-2">
          <h4 className="font-bold">{t("wallet.amount")}:</h4>
          {Number(invoiceAmount) !== 0 && <span>{invoiceAmount} Sat</span>}

          {isInvoiceAmountBiggerThanBalance && (
            <p className="text-red-500">
              {t("forms.validation.lnInvoice.max")}
            </p>
          )}

          {Number(invoiceAmount) === 0 && (
            <div>
              <p>{t("forms.hint.invoiceAmountZero")}</p>

              <AmountInput
                amount={amountInput}
                errorMessage={errors.amountInput}
                register={register("amountInput", {
                  required: t(
                    "forms.validation.chainAmount.required"
                  ) as string,
                  max: {
                    value: balance,
                    message: t("forms.validation.chainAmount.max"),
                  },
                  validate: {
                    greaterThanZero: (value) =>
                      value > 0 ||
                      (t("forms.validation.chainAmount.required") as string),
                  },
                  onChange: amountChangeHandler,
                })}
              />
            </div>
          )}
        </div>

        {!isLnTx && (
          <div className="my-2">
            <h4 className="font-bold">{t("tx.fee")}:</h4> {fee} sat/vByte
          </div>
        )}

        {comment && (
          <div className="my-2">
            <h4 className="font-bold">{commentHeading}:</h4> {comment}
          </div>
        )}

        <div className="flex justify-around px-2 py-5">
          <button
            className="flex rounded bg-red-500 py-2 px-3 text-white shadow-xl hover:bg-red-400"
            onClick={() => close(false)}
          >
            <XIcon />
            &nbsp;{t("settings.cancel")}
          </button>

          <button
            className="bd-button flex py-2 px-3"
            type="submit"
            disabled={(submitCount > 0 && !isValid) || !isValidLnInvoice}
          >
            <CheckIcon />
            &nbsp; {t("settings.confirm")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ConfirmSendModal;
