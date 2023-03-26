import AvailableBalance from "components/AvailableBalance";
import { ChangeEvent, FC, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { stringToNumber } from "utils/format";
import AmountInput from "../../../components/AmountInput";
import InputField from "../../../components/InputField";
import { TxType } from "../SwitchTxType";

export type Props = {
  balance: number;
  onConfirm: (data: SendOnChainForm) => void;
};

export interface SendOnChainForm {
  invoiceType: TxType.ONCHAIN;
  address: string;
  fee: string;
  /** amount in satoshi */
  amount: number;
  comment: string;
  spendAll: boolean;
}

const SendOnChain: FC<Props> = ({ balance, onConfirm }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SendOnChainForm>({
    mode: "onChange",
  });

  const spendAll = watch("spendAll", false);
  const onSubmit: SubmitHandler<SendOnChainForm> = (data) =>
    // overwrite amount to submit number instead of string
    onConfirm({ ...data, invoiceType: TxType.ONCHAIN, amount });

  const [amount, setAmount] = useState(0);

  const changeAmountHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  return (
    <form className="px-5" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-xl font-bold">{t("wallet.send_onchain")}</h3>

      <AvailableBalance balance={balance} />

      <fieldset className="my-5 flex flex-col items-center justify-center text-center">
        <div className="w-full py-1 md:w-10/12">
          <InputField
            {...register("address", {
              required: t("forms.validation.chainAddress.required"),
              pattern: {
                value: /^(1|3|bc1|tb1|tpub|bcrt)\w+/i,
                message: t("forms.validation.chainAddress.patternMismatch"),
              },
            })}
            placeholder="bc1..."
            label={t("wallet.address")}
            errorMessage={errors.address}
          />
        </div>

        {!spendAll && (
          <div className="w-full pt-1 md:w-10/12">
            <AmountInput
              errorMessage={errors?.amount}
              disabled={spendAll}
              amount={amount}
              register={register("amount", {
                required: t("forms.validation.chainAmount.required"),
                max: {
                  value: balance || 0,
                  message: t("forms.validation.chainAmount.max"),
                },
                validate: {
                  greaterThanZero: (val) =>
                    //@ts-ignore
                    stringToNumber(val) > 0 ||
                    t("forms.validation.chainAmount.required"),
                },
                onChange: changeAmountHandler,
              })}
            />
          </div>
        )}

        <div className="flex w-full justify-start gap-2 pb-1 md:w-10/12">
          <InputField
            {...register("spendAll", {})}
            label={t("tx.spend_all")}
            errorMessage={errors.spendAll}
            type="checkbox"
          />
        </div>

        <div className="w-full py-1 md:w-10/12">
          <InputField
            {...register("fee", {
              required: t("forms.validation.chainFee.required"),
            })}
            label={t("tx.fee")}
            errorMessage={errors.fee}
            inputRightAddon="sat / vByte"
            type="number"
          />
        </div>

        <div className="w-full py-1 md:w-10/12">
          <InputField
            {...register("comment")}
            label={t("tx.comment")}
            placeholder={t("tx.comment_placeholder")}
          />
        </div>
      </fieldset>

      <div className="inline-block w-4/5 align-top lg:w-3/12">
        <button
          type="submit"
          className="bd-button my-3 p-3"
          disabled={!isValid}
        >
          {t("wallet.confirm")}
        </button>
      </div>
    </form>
  );
};

export default SendOnChain;
