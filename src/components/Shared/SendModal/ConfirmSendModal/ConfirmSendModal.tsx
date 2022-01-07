import { FC, useContext, useState } from "react";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as CheckIcon } from "../../../../assets/check.svg";
import { ReactComponent as XIcon } from "../../../../assets/X.svg";
import { AppContext } from "../../../../store/app-context";
import { instance } from "../../../../util/interceptor";
import { ReactComponent as ChevronLeft } from "../../../../assets/chevron-left.svg";
import { useForm } from "react-hook-form";
import AmountInput from "../../AmountInput/AmountInput";

const ConfirmSendModal: FC<ConfirmSendModalProps> = (props) => {
  const { t } = useTranslation();
  const appCtx = useContext(AppContext);
  const { ln, invoiceAmount, address, fee, comment } = props;

  const [amount, setAmount] = useState(0);

  const amountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  interface IFormInputs {
    amountInput: number;
  }

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

    if (ln) {
      response = await instance
        .post("lightning/send-payment?pay_req=" + address)
        .catch((e) => {
          return e;
        });
    } else {
      const body = {
        amount: invoiceAmount === 0 ? amount : invoiceAmount,
        address,
        sat_per_vbyte: fee,
        label: comment,
        unit: appCtx.unit,
      };

      response = await instance
        .post("lightning/send-coins", body)
        .catch((e) => {
          return e;
        });
    }

    console.info(response);
    props.close(true);
  };

  const addressTitle = ln ? t("wallet.invoice") : t("wallet.address");

  const commentHeading = ln ? t("tx.description") : t("tx.comment");

  return (
    <form onSubmit={handleSubmit(sendTransactionHandler)}>
      <section className="break-all">
        <button
          onClick={props.back}
          className="flex items-center justify-center outline-none font-bold"
        >
          <ChevronLeft className="h-4 w-4 inline-block" />
          {t("navigation.back")}
        </button>

        <h4 className="my-3 break-normal font-extrabold">
          {t("tx.confirm_info")}:{" "}
        </h4>

        <article className="my-2">
          <h4 className="font-bold">{addressTitle}:</h4> {address}
        </article>

        <article className="my-2">
          <h4 className="font-bold">{t("wallet.amount")}:</h4>

          {Number(invoiceAmount) !== 0 && <span>{invoiceAmount} Sat</span>}

          {Number(invoiceAmount) === 0 && (
            <div>
              <p>{t("forms.hint.invoiceAmountZero")}</p>

              <AmountInput
                amount={amount}
                errorMessage={errors.amountInput}
                register={register("amountInput", {
                  required: t(
                    "forms.validation.chainAmount.required"
                  ) as string,
                  max: {
                    value: props.balance,
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
        </article>

        {!ln && (
          <article className="my-2">
            <h4 className="font-bold">{t("tx.fee")}:</h4> {fee} sat/vByte
          </article>
        )}

        {comment && (
          <article className="my-2">
            <h4 className="font-bold">{commentHeading}:</h4> {comment}
          </article>
        )}

        <div className="flex justify-around px-2 py-5">
          <button
            className="shadow-xl rounded text-white bg-red-500 hover:bg-red-400 py-2 px-3 flex"
            onClick={() => props.close(false)}
          >
            <XIcon />
            &nbsp;{t("settings.cancel")}
          </button>

          <button
            className="bd-button py-2 px-3 flex"
            type="submit"
            disabled={submitCount > 0 && !isValid}
          >
            <CheckIcon />
            &nbsp; {t("settings.confirm")}
          </button>
        </div>
      </section>
    </form>
  );
};

export interface ConfirmSendModalProps {
  address: string;
  invoiceAmount: number;
  back: () => void;
  balance: number;
  close: (confirmed: boolean) => void;
  comment: string;
  fee: string;
  ln: boolean;
}

export default ConfirmSendModal;
