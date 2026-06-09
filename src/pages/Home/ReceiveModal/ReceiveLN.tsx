import { FieldError, Input, Label, TextField } from "@heroui/react";
import { type FC, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert } from "@/components/Alert";
import AmountInput from "@/components/AmountInput";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { stringToNumber } from "@/utils/format";

export interface IFormInputs {
  amountInput: string;
  commentInput: string;
}

export type Props = {
  isLoading: boolean;
  error: string;
  onSubmitHandler: (data: IFormInputs) => void;
};

const ReceiveLN: FC<Props> = ({ isLoading, error, onSubmitHandler }) => {
  const { t } = useTranslation();

  const [amount, setAmount] = useState(0);

  const amountChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInputs> = (data) => onSubmitHandler(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ConfirmModal.Body>
        <fieldset className="flex w-full flex-col gap-4">
          <div className="flex flex-col justify-center pb-5 text-center">
            <AmountInput
              amount={amount}
              register={register("amountInput", {
                required: t("forms.validation.chainAmount.required"),
                validate: {
                  greaterThanZero: (val) =>
                    stringToNumber(val) > 0 ||
                    t("forms.validation.chainAmount.required"),
                },
                onChange: amountChangeHandler,
              })}
              errorMessage={errors.amountInput}
            />

            <div className="mt-2 flex flex-col justify-center">
              <Controller
                name="commentInput"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    className="w-full"
                    isInvalid={fieldState.invalid}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  >
                    <Label>{t("tx.comment")}</Label>
                    <Input
                      type="text"
                      placeholder={t("tx.comment_placeholder")}
                      className="bg-tertiary"
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />
            </div>
          </div>
        </fieldset>

        {error && <Alert color="danger">{error}</Alert>}
      </ConfirmModal.Body>

      <ConfirmModal.Footer>
        <Button
          variant="primary"
          type="submit"
          isDisabled={isLoading || (!isValid && submitCount > 0)}
          isPending={isLoading}
        >
          {t("wallet.create_invoice")}
        </Button>
      </ConfirmModal.Footer>
    </form>
  );
};

export default ReceiveLN;
