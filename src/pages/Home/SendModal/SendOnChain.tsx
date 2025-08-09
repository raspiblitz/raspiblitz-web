import { Checkbox, Input } from "@heroui/react";
import { type ChangeEvent, type FC, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AmountInput from "@/components/AmountInput";
import AvailableBalance from "@/components/AvailableBalance";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { stringToNumber } from "@/utils/format";
import { TxType } from "../SwitchTxType";
import type { SendLnForm } from "./SendModal";

export type Props = {
  balance: number;
  onConfirm: (data: SendOnChainForm) => void;
  confirmData?: SendOnChainForm | SendLnForm | null;
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

const SendOnChain: FC<Props> = ({ balance, onConfirm, confirmData }) => {
  const { t } = useTranslation();
  const [updated, setUpdated] = useState(false);
  const [amount, setAmount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<SendOnChainForm>({
    mode: "onChange",
  });

  if (!updated && confirmData?.invoiceType === TxType.ONCHAIN) {
    setUpdated(true);
    setAmount(confirmData.amount);
    reset({
      address: confirmData.address,
      comment: confirmData.comment,
      fee: confirmData.fee,
      spendAll: confirmData.spendAll,
    });
  }

  const spendAll = watch("spendAll", false);

  const onSubmit: SubmitHandler<SendOnChainForm> = (data) =>
    onConfirm({ ...data, invoiceType: TxType.ONCHAIN, amount });

  const changeAmountHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ConfirmModal.Body>
        <AvailableBalance balance={balance} />

        <fieldset className="flex flex-col items-center justify-center text-center">
          <div className="w-full py-1">
            <Input
              classNames={{
                inputWrapper:
                  "bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
              }}
              {...register("address", {
                required: t("forms.validation.chainAddress.required"),
                pattern: {
                  value: /^(1|3|bc1|tb1|tpub|bcrt)\w+/i,
                  message: t("forms.validation.chainAddress.patternMismatch"),
                },
              })}
              placeholder="bc1..."
              label={t("wallet.address")}
              isInvalid={!!errors.address}
              errorMessage={errors.address?.message}
            />
          </div>

          {!spendAll && (
            <div className="w-full pt-1">
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
                      // @ts-expect-error is will be returned as formatted string and needs to be converted to number
                      stringToNumber(val) > 0 ||
                      t("forms.validation.chainAmount.required"),
                  },
                  onChange: changeAmountHandler,
                })}
              />
            </div>
          )}

          <div className="flex w-full justify-start gap-2 pb-1">
            <Checkbox {...register("spendAll", {})}>
              {t("tx.spend_all")}
            </Checkbox>
          </div>

          <div className="w-full py-1">
            <Input
              classNames={{
                inputWrapper:
                  "bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
              }}
              {...register("fee", {
                required: t("forms.validation.chainFee.required"),
              })}
              label={t("tx.fee")}
              isInvalid={!!errors.fee}
              errorMessage={errors.fee?.message}
              type="number"
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="whitespace-nowrap text-small text-default-400">
                    sat / vByte
                  </span>
                </div>
              }
            />
          </div>

          <div className="w-full py-1">
            <Input
              classNames={{
                inputWrapper:
                  "bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
              }}
              {...register("comment")}
              label={t("tx.comment")}
              placeholder={t("tx.comment_placeholder")}
            />
          </div>
        </fieldset>
      </ConfirmModal.Body>

      <ConfirmModal.Footer>
        <Button color="primary" type="submit" isDisabled={!isValid}>
          {t("wallet.confirm")}
        </Button>
      </ConfirmModal.Footer>
    </form>
  );
};

export default SendOnChain;
