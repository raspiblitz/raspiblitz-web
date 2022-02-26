import type { ChangeEvent } from "react";
import { FC, useContext } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../../../store/app-context";
import ButtonWithSpinner from "../../ButtonWithSpinner/ButtonWithSpinner";
import InputField from "../../InputField/InputField";

export type Props = {
  balanceDecorated: string;
  loading: boolean;
  onConfirm: () => void;
  onChangeInvoice: (event: ChangeEvent<HTMLInputElement>) => void;
};
interface IFormInputs {
  invoiceInput: string;
}

const SendLn: FC<Props> = ({
  loading,
  balanceDecorated,
  onConfirm,
  onChangeInvoice,
}) => {
  const { unit } = useContext(AppContext);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInputs> = (_) => onConfirm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-xl font-bold">{t("wallet.send_lightning")}</h3>

      <p className="my-5">
        <span className="font-bold">{t("wallet.balance")}:&nbsp;</span>
        {balanceDecorated} {unit}
      </p>

      <InputField
        {...register("invoiceInput", {
          required: t("forms.validation.lnInvoice.required") as string,
          pattern: {
            value: /^(lnbc|lntb)\w+/i,
            message: t("forms.validation.lnInvoice.patternMismatch"),
          },
          onChange: onChangeInvoice,
        })}
        label={t("wallet.invoice")}
        errorMessage={errors.invoiceInput}
        placeholder="lnbc..."
        disabled={loading}
      />

      <ButtonWithSpinner
        type="submit"
        className="bd-button my-3 p-3"
        loading={loading}
        disabled={(submitCount > 0 && !isValid) || loading}
      >
        {t("wallet.send")}
      </ButtonWithSpinner>
    </form>
  );
};

export default SendLn;
