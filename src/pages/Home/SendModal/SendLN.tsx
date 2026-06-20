import { FieldError, Input, Label, TextField } from "@heroui/react";
import { type FC, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert } from "@/components/Alert";
import AvailableBalance from "@/components/AvailableBalance";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { convertMSatToSat } from "@/utils/format";
import { TxType } from "../SwitchTxType";
import type { SendLnForm } from "./SendModal";
import type { SendOnChainForm } from "./SendOnChain";

export type Props = {
  lnBalance: number;
  isLoading: boolean;
  onConfirm: (data: LnInvoiceForm) => void;
  error: string;
  confirmData?: SendOnChainForm | SendLnForm | null;
};

export interface LnInvoiceForm {
  invoice: string;
}

const SendLn: FC<Props> = ({
  isLoading,
  lnBalance,
  onConfirm,
  error,
  confirmData,
}) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<LnInvoiceForm>({
    mode: "onChange",
  });

  const [updated, setUpdated] = useState(false);

  if (!updated && confirmData?.invoiceType === TxType.LIGHTNING) {
    setUpdated(true);
    reset({
      invoice: confirmData.invoice,
    });
  }

  const onSubmit: SubmitHandler<LnInvoiceForm> = (data) => onConfirm(data);

  const convertedBalance = lnBalance ? convertMSatToSat(lnBalance) : 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ConfirmModal.Body>
        {/* biome-ignore lint/style/noNonNullAssertion: value is expected to exist at this point */}
        <AvailableBalance balance={convertedBalance!} />

        <Controller
          name="invoice"
          control={control}
          rules={{
            required: t("forms.validation.lnInvoice.required"),
            pattern: {
              value: /^(lnbc|lntb)\w+/i,
              message: t("forms.validation.lnInvoice.patternMismatch"),
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              className="w-full"
              isInvalid={fieldState.invalid}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              isDisabled={isLoading}
            >
              <Label>{t("wallet.invoice")}</Label>
              <Input
                type="text"
                placeholder="lnbc..."
                className="bg-tertiary"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        {error && <Alert color="danger">{error}</Alert>}
      </ConfirmModal.Body>

      <ConfirmModal.Footer>
        <Button
          variant="primary"
          type="submit"
          isDisabled={isLoading || !isValid}
          isPending={isLoading}
        >
          {t("wallet.send")}
        </Button>
      </ConfirmModal.Footer>
    </form>
  );
};

export default SendLn;
