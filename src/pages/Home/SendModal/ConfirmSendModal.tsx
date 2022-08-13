import type { ChangeEvent } from "react";
import { FC, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReactComponent as CheckIcon } from "../../../assets/check.svg";
import { ReactComponent as ChevronLeft } from "../../../assets/chevron-left.svg";
import { ReactComponent as XIcon } from "../../../assets/X.svg";
import AmountInput from "../../../components/AmountInput";
import ButtonWithSpinner from "../../../components/ButtonWithSpinner/ButtonWithSpinner";
import { TxType } from "../SwitchTxType";
import Message from "../../../components/Message";
import { AppContext, Unit } from "../../../context/app-context";
import { checkError } from "../../../util/checkError";
import { convertBtcToSat, stringToNumber } from "../../../util/format";
import { instance } from "../../../util/interceptor";
interface IFormInputs {
  amountInput: string;
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
  /** epoch time in seconds */
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
  const [amountInput, setAmountInput] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLnTx = invoiceType === TxType.LIGHTNING;

  const amountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmountInput(+event.target.value);
  };

  const invoiceExpiryDate = (timestamp + expiry) * 1000;
  const invoiceExpiryDateDecorated = new Intl.DateTimeFormat("default", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(invoiceExpiryDate));
  const isInvoiceExpired: boolean = isLnTx && invoiceExpiryDate < Date.now();
  const isInvoiceAmountBiggerThanBalance: boolean = invoiceAmount > balance;
  const isValidLnInvoice: boolean =
    !isLnTx ||
    (isLnTx && !isInvoiceExpired && !isInvoiceAmountBiggerThanBalance);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const sendTransactionHandler = async () => {
    setError(null);
    setIsLoading(true);

    if (isLnTx) {
      let msatQuery = "";
      if (amountInput > 0) {
        // amount in the amountInput is in SAT / BTC
        let amountMSat: number;
        if (unit === Unit.BTC) {
          amountMSat = convertBtcToSat(amountInput) * 1000;
        } else {
          amountMSat = amountInput * 1000;
        }
        msatQuery = `&amount_msat=${amountMSat}`;
      }

      instance
        .post(`lightning/send-payment?pay_req=${address}${msatQuery}`)
        .then(() => {
          setIsLoading(false);
          close(true);
        })
        .catch((err) => {
          setError(checkError(err));
          setIsLoading(false);
        });
    } else {
      const body = {
        amount: invoiceAmount === 0 ? amountInput : invoiceAmount,
        address,
        sat_per_vbyte: fee,
        label: comment,
        unit,
      };

      await instance
        .post("lightning/send-coins", body)
        .then(() => {
          setIsLoading(false);
          close(true);
        })
        .catch((err) => {
          setError(checkError(err));
          setIsLoading(false);
        });
    }
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
                  required: t("forms.validation.chainAmount.required"),
                  max: {
                    value: balance,
                    message: t("forms.validation.chainAmount.max"),
                  },
                  validate: {
                    greaterThanZero: (val) =>
                      stringToNumber(val) > 0 ||
                      t("forms.validation.chainAmount.required"),
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

        {error && <Message message={error} />}

        <div className="flex justify-around px-2 py-5">
          <button
            className="flex rounded bg-red-500 py-2 px-3 text-white shadow-xl hover:bg-red-400"
            onClick={() => close(false)}
            disabled={isLoading}
          >
            <XIcon />
            &nbsp;{t("settings.cancel")}
          </button>

          <ButtonWithSpinner
            className="bd-button flex py-2 px-3"
            type="submit"
            loading={isLoading}
            icon={<CheckIcon />}
            disabled={!isValid || !isValidLnInvoice}
          >
            <span className="mx-1">{t("settings.confirm")}</span>
          </ButtonWithSpinner>
        </div>
      </div>
    </form>
  );
};

export default ConfirmSendModal;
