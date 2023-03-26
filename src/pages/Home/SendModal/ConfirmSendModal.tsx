import {
  CheckIcon,
  ChevronLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ChangeEvent } from "react";
import { FC, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AmountInput from "../../../components/AmountInput";
import ButtonWithSpinner from "../../../components/ButtonWithSpinner/ButtonWithSpinner";
import Message from "../../../components/Message";
import { AppContext, Unit } from "../../../context/app-context";
import { checkError } from "../../../utils/checkError";
import {
  convertBtcToSat,
  convertMSatToSat,
  formatAmount,
  stringToNumber,
} from "../../../utils/format";
import { instance } from "../../../utils/interceptor";
import { TxType } from "../SwitchTxType";
import { SendLnForm } from "./SendModal";
import { SendOnChainForm } from "./SendOnChain";

interface IFormInputs {
  amountInput: string;
}

export type Props = {
  confirmData: SendOnChainForm | SendLnForm;
  back: (data: SendOnChainForm | SendLnForm) => void;
  balance: number;
  close: (confirmed: boolean) => void;
};

const ConfirmSendModal: FC<Props> = ({ confirmData, back, balance, close }) => {
  const { t } = useTranslation();
  const { unit } = useContext(AppContext);
  const [amountInput, setAmountInput] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLnTx = confirmData.invoiceType === TxType.LIGHTNING;

  const amountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmountInput(+event.target.value);
  };

  const lnData = confirmData as SendLnForm;
  const onChainData = confirmData as SendOnChainForm;

  const invoiceExpiryDate = isLnTx
    ? (lnData.timestamp + lnData.expiry) * 1000
    : 0;
  const invoiceExpiryDateDecorated = new Intl.DateTimeFormat("default", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(invoiceExpiryDate));
  const isInvoiceExpired = isLnTx && invoiceExpiryDate < Date.now();
  const isInvoiceAmountBiggerThanBalance = confirmData.amount > balance;
  const isValidLnInvoice =
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
        .post(
          `lightning/send-payment?pay_req=${confirmData?.address}${msatQuery}`
        )
        .then(() => {
          setIsLoading(false);
          close(true);
        })
        .catch((err) => {
          setError(checkError(err));
          setIsLoading(false);
        });
    } else {
      const { spendAll, fee, address, comment, amount } =
        confirmData as SendOnChainForm;
      const amountBody = spendAll ? 0 : amount;
      const body = {
        amount: amountBody,
        address,
        sat_per_vbyte: +fee,
        label: comment,
        send_all: spendAll,
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
      <button
        type="button"
        onClick={() => back(confirmData)}
        className="flex items-center justify-center font-bold outline-none"
      >
        <ChevronLeftIcon className="inline-block h-4 w-4" />
        {t("navigation.back")}
      </button>
      <h4 className="my-3 break-normal font-extrabold">
        {t("tx.confirm_info")}:{" "}
      </h4>

      <div className="my-2">
        <h4 className="font-bold">{addressTitle}: </h4>
        <p className="w-full break-all text-gray-600 dark:text-gray-200">
          {confirmData.address}
        </p>
        {isInvoiceExpired && (
          <p className="text-red-500">
            {t("forms.validation.lnInvoice.expired")}:{" "}
            {invoiceExpiryDateDecorated}
          </p>
        )}
      </div>

      <div className="my-2">
        <h4 className="font-bold">{t("wallet.amount")}:</h4>
        {isLnTx && Number(confirmData.amount) !== 0 && (
          <span>
            {formatAmount(
              convertMSatToSat(+confirmData.amount)?.toString()!,
              Unit.SAT
            )}{" "}
            Sat
          </span>
        )}

        {!isLnTx && (
          <span>
            {confirmData.spendAll && t("tx.all_onchain")}
            {!confirmData.spendAll &&
              `${formatAmount(confirmData.amount.toString(), Unit.SAT)} Sat`}
          </span>
        )}

        {isInvoiceAmountBiggerThanBalance && (
          <p className="text-red-500">{t("forms.validation.lnInvoice.max")}</p>
        )}

        {Number(confirmData.amount) === 0 && !onChainData.spendAll && (
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
          <h4 className="font-bold">{t("tx.fee")}:</h4> {confirmData.fee}{" "}
          sat/vByte
        </div>
      )}

      {confirmData.comment && (
        <div className="my-2">
          <h4 className="font-bold">{commentHeading}:</h4> {confirmData.comment}
        </div>
      )}

      {error && <Message message={error} />}

      <div className="flex justify-around px-2 py-5">
        <button
          className="flex rounded bg-red-500 py-2 px-3 text-white shadow-xl hover:bg-red-400"
          onClick={() => close(false)}
          disabled={isLoading}
        >
          <XMarkIcon className="inline h-6 w-6" />
          &nbsp;{t("settings.cancel")}
        </button>

        <ButtonWithSpinner
          className="bd-button flex py-2 px-3"
          type="submit"
          loading={isLoading}
          icon={<CheckIcon className="inline h-6 w-6" />}
          disabled={
            !isValid || !isValidLnInvoice || isInvoiceAmountBiggerThanBalance
          }
        >
          <span className="mx-1">{t("settings.confirm")}</span>
        </ButtonWithSpinner>
      </div>
    </form>
  );
};

export default ConfirmSendModal;
