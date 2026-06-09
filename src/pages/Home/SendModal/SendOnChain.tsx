import {
  Checkbox,
  FieldError,
  Input,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { type FC, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
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
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isValid },
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ConfirmModal.Body>
        <AvailableBalance balance={balance} />

        <fieldset className="flex flex-col items-center justify-center text-center">
          <div className="w-full py-1">
            <Controller
              name="address"
              control={control}
              rules={{
                required: t("forms.validation.chainAddress.required"),
                pattern: {
                  value: /^(1|3|bc1|tb1|tpub|bcrt)\w+/i,
                  message: t("forms.validation.chainAddress.patternMismatch"),
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
                >
                  <Label>{t("wallet.address")}</Label>
                  <Input
                    type="text"
                    placeholder="bc1..."
                    className="bg-tertiary"
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />
          </div>

          {!spendAll && (
            <div className="w-full pt-1">
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: t("forms.validation.chainAmount.required"),
                  max: {
                    value: balance || 0,
                    message: t("forms.validation.chainAmount.max"),
                  },
                  validate: {
                    greaterThanZero: (val) =>
                      stringToNumber(`${val}`) > 0 ||
                      t("forms.validation.chainAmount.required"),
                  },
                }}
                render={({ field, fieldState }) => (
                  <AmountInput
                    error={fieldState.error?.message}
                    disabled={spendAll}
                    amount={amount}
                    field={{
                      ...field,
                      onChange: (value) => {
                        field.onChange(value);
                        setAmount(+value);
                      },
                    }}
                  />
                )}
              />
            </div>
          )}

          <div className="flex w-full justify-start gap-2 pb-1">
            <Checkbox {...register("spendAll", {})}>
              {t("tx.spend_all")}
            </Checkbox>
          </div>

          <div className="w-full py-1">
            <Controller
              name="fee"
              control={control}
              rules={{
                required: t("forms.validation.chainFee.required"),
              }}
              render={({ field, fieldState }) => (
                <TextField
                  className="w-full"
                  isInvalid={fieldState.invalid}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                >
                  <Label>{t("tx.fee")}</Label>
                  <InputGroup className="bg-tertiary">
                    <InputGroup.Input type="number" />
                    <InputGroup.Suffix>
                      <span className="whitespace-nowrap text-small text-default-400">
                        sat / vByte
                      </span>
                    </InputGroup.Suffix>
                  </InputGroup>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />
          </div>

          <div className="w-full py-1">
            <Controller
              name="comment"
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
        </fieldset>
      </ConfirmModal.Body>

      <ConfirmModal.Footer>
        <Button variant="primary" type="submit" isDisabled={!isValid}>
          {t("wallet.confirm")}
        </Button>
      </ConfirmModal.Footer>
    </form>
  );
};

export default SendOnChain;
