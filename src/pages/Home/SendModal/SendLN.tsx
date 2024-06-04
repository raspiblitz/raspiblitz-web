import { TxType } from "../SwitchTxType";
import { SendLnForm } from "./SendModal";
import { SendOnChainForm } from "./SendOnChain";
import AvailableBalance from "@/components/AvailableBalance";
import ButtonWithSpinner from "@/components/ButtonWithSpinner/ButtonWithSpinner";
import InputField from "@/components/InputField";
import Message from "@/components/Message";
import { convertMSatToSat } from "@/utils/format";
import { ShareIcon } from "@bitcoin-design/bitcoin-icons-react/filled";
import { FC, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type Props = {
  lnBalance: number;
  loading: boolean;
  onConfirm: (data: LnInvoiceForm) => void;
  error: string;
  confirmData?: SendOnChainForm | SendLnForm | null;
};

export interface LnInvoiceForm {
  invoice: string;
}

const SendLn: FC<Props> = ({
  loading,
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
      <h3 className="text-xl font-bold">{t("wallet.send_lightning")}</h3>

      <AvailableBalance balance={convertedBalance!} />

      <InputField
        {...register("invoice", {
          required: t("forms.validation.lnInvoice.required"),
          pattern: {
            value: /^(lnbc|lntb)\w+/i,
            message: t("forms.validation.lnInvoice.patternMismatch"),
          },
        })}
        label={t("wallet.invoice")}
        errorMessage={errors.invoice}
        placeholder="lnbc..."
        disabled={loading}
      />

      {error && <Message message={error} />}

      <ButtonWithSpinner
        type="submit"
        className="bd-button my-8 p-3"
        loading={loading}
        disabled={!isValid || loading}
        icon={<ShareIcon className="mr-2 h-6 w-6" />}
      >
        {t("wallet.send")}
      </ButtonWithSpinner>
    </form>
  );
};

export default SendLn;
