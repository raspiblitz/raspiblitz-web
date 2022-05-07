import type { ChangeEvent } from "react";
import { FC, useContext } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReactComponent as SendIcon } from "../../../../assets/send.svg";
import ErrorMessage from "../../../../container/ErrorMessage/ErrorMessage";
import { AppContext } from "../../../../store/app-context";
import ButtonWithSpinner from "../../ButtonWithSpinner/ButtonWithSpinner";
import InputField from "../../InputField/InputField";

export type Props = {
  balanceDecorated: string;
  loading: boolean;
  onConfirm: () => void;
  onChangeInvoice: (event: ChangeEvent<HTMLInputElement>) => void;
  error: string;
};
interface IFormInputs {
  invoiceInput: string;
}

const SendLn: FC<Props> = ({
  loading,
  balanceDecorated,
  onConfirm,
  onChangeInvoice,
  error,
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

      {error && <ErrorMessage errorMessage={error} />}

      <ButtonWithSpinner
        type="submit"
        className="bd-button my-8 p-3"
        loading={loading}
        disabled={(submitCount > 0 && !isValid) || loading}
        icon={<SendIcon className="mr-2 h-6 w-6" />}
      >
        {t("wallet.send")}
      </ButtonWithSpinner>
    </form>
  );
};

export default SendLn;
