import { Input } from "@heroui/react";
import { type FC, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
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
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
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

        <Input
          className="w-full"
          classNames={{
            inputWrapper:
              "bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
          }}
          type="text"
          isInvalid={!!errors.invoice}
          errorMessage={errors.invoice?.message}
          label={t("wallet.invoice")}
          placeholder="lnbc..."
          isDisabled={isLoading}
          {...register("invoice", {
            required: t("forms.validation.lnInvoice.required"),
            pattern: {
              value: /^(lnbc|lntb)\w+/i,
              message: t("forms.validation.lnInvoice.patternMismatch"),
            },
          })}
        />

        {error && <Alert color="danger">{error}</Alert>}
      </ConfirmModal.Body>

      <ConfirmModal.Footer>
        <Button
          color="primary"
          type="submit"
          isDisabled={isLoading || !isValid}
          isLoading={isLoading}
        >
          {t("wallet.send")}
        </Button>
      </ConfirmModal.Footer>
    </form>
  );
};

export default SendLn;
