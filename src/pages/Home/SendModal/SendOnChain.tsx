import AvailableBalance from "components/AvailableBalance";
import { ChangeEvent, FC } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AmountInput from "../../../components/AmountInput";
import InputField from "../../../components/InputField";
import { stringToNumber } from "../../../utils/format";

export type Props = {
  address: string;
  amount: number;
  balance: number;
  comment: string;
  fee: string;
  onChangeAmount: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeAddress: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeComment: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeFee: (event: ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
};
interface IFormInputs {
  addressInput: string;
  feeInput: number;
  amountInput: string;
  commentInput: string;
}

const SendOnChain: FC<Props> = ({
  amount,
  address,
  balance,
  comment,
  fee,
  onChangeAmount,
  onChangeAddress,
  onChangeComment,
  onChangeFee,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInputs> = (_data) => onConfirm();

  return (
    <form className="px-5" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-xl font-bold">{t("wallet.send_onchain")}</h3>

      <AvailableBalance balance={balance} />

      <fieldset className="my-5 flex flex-col items-center justify-center text-center">
        <div className="w-full py-1 md:w-10/12">
          <InputField
            {...register("addressInput", {
              required: t("forms.validation.chainAddress.required"),
              pattern: {
                value: /^(1|3|bc1|tb1|tpub|bcrt)\w+/i,
                message: t("forms.validation.chainAddress.patternMismatch"),
              },
              onChange: onChangeAddress,
            })}
            placeholder="bc1..."
            label={t("wallet.address")}
            errorMessage={errors.addressInput}
            value={address}
          />
        </div>

        <div className="w-full py-1 md:w-10/12">
          <AmountInput
            amount={amount}
            errorMessage={errors?.amountInput}
            register={register("amountInput", {
              required: t("forms.validation.chainAmount.required"),
              max: {
                value: balance || 0,
                message: t("forms.validation.chainAmount.max"),
              },
              validate: {
                greaterThanZero: (val) =>
                  stringToNumber(val) > 0 ||
                  t("forms.validation.chainAmount.required"),
              },
              onChange: onChangeAmount,
            })}
          />
        </div>

        <div className="w-full py-1 md:w-10/12">
          <InputField
            {...register("feeInput", {
              required: t("forms.validation.chainFee.required"),
              onChange: onChangeFee,
            })}
            label={t("tx.fee")}
            errorMessage={errors.feeInput}
            value={fee}
            inputRightAddon="sat / vByte"
            type="number"
          />
        </div>

        <div className="w-full py-1 md:w-10/12">
          <InputField
            {...register("commentInput", {
              onChange: onChangeComment,
            })}
            label={t("tx.comment")}
            value={comment}
            placeholder={t("tx.comment_placeholder")}
          />
        </div>
      </fieldset>

      <div className="mb-5 inline-block w-4/5 align-top lg:w-3/12">
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
