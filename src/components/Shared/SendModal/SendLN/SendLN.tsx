import { FC, useContext } from "react";

import type { ChangeEvent } from "react";

import { useTranslation } from "react-i18next";
import { AppContext } from "../../../../store/app-context";
import InputField from "../../InputField/InputField";

import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

const SendLn: FC<SendLnProps> = (props) => {
  const appCtx = useContext(AppContext);
  const { balance, onChangeInvoice, onConfirm } = props;
  const { t } = useTranslation();

  interface IFormInputs {
    firstName: string;
    invoiceInput: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInputs> = (_data) => onConfirm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-xl font-bold">{t("wallet.send_lightning")}</h3>

      <p className="my-5">
        <span className="font-bold">{t("wallet.balance")}:&nbsp;</span>
        {balance} {appCtx.unit}
      </p>

      <InputField
        {...register("invoiceInput", {
          required: t("forms.validation.lnInvoice.required") as string,
          pattern: {
            value: /(lnbc|lntb)\w+/i,
            message: t("forms.validation.lnInvoice.patternMismatch"),
          },
          onChange: onChangeInvoice,
        })}
        label={t("wallet.invoice")}
        errorMessage={errors.invoiceInput}
      />

      <button
        type="submit"
        className="bd-button p-3 my-3"
        disabled={submitCount > 0 && !isValid}
      >
        {t("wallet.send")}
      </button>
    </form>
  );
};

export default SendLn;

export interface SendLnProps {
  balance: string;
  onConfirm: () => void;
  onChangeInvoice: (event: ChangeEvent<HTMLInputElement>) => void;
}
