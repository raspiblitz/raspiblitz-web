import {
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Alert } from "@/components/Alert";
import AmountInput from "@/components/AmountInput";
import AvailableBalance from "@/components/AvailableBalance";
import { Button } from "@/components/Button";
import {
  ConfirmModal,
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import { checkError } from "@/utils/checkError";
import { convertMSatToSat, stringToNumber } from "@/utils/format";
import { instance } from "@/utils/interceptor";

interface IFormInputs {
  nodeUri: string;
  fundingAmount: string;
  feeRate: string;
}

interface Props extends Pick<ConfirmModalProps, "disclosure"> {
  balance: number;
}

export default function OpenChannelModal({ balance, disclosure }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | undefined>(undefined);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const openChannelHandler = async (data: IFormInputs) => {
    setIsLoading(true);
    instance
      .post(
        "lightning/open-channel",
        {},
        {
          params: {
            local_funding_amount: amount,
            node_URI: data.nodeUri,
            target_confs: +data.feeRate,
          },
        },
      )
      .then(() => {
        toast.success(t("home.channel_opened"), { theme: "dark" });
        disclosure.close();
      })
      .catch((err) => setError(checkError(err)))
      .finally(() => setIsLoading(false));
  };

  const convertedBalance = balance ? convertMSatToSat(balance) : 0;

  return (
    <ConfirmModal disclosure={disclosure} custom>
      <form onSubmit={handleSubmit(openChannelHandler)}>
        <ConfirmModal.Header>{t("home.open_channel")}</ConfirmModal.Header>
        <ConfirmModal.Body>
          {/* biome-ignore lint/style/noNonNullAssertion: value is expected to exist at this point */}
          <AvailableBalance balance={convertedBalance!} />

          <fieldset className="flex w-full flex-col gap-4">
            <Controller
              name="nodeUri"
              control={control}
              rules={{
                required: t("forms.validation.node_uri.required"),
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
                  <Label>{t("home.node_uri")}</Label>
                  <Input type="text" className="bg-tertiary" />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />

            <Controller
              name="fundingAmount"
              control={control}
              rules={{
                required: t("forms.validation.amount.required"),
                validate: {
                  greaterThanZero: (val) =>
                    stringToNumber(`${val}`) > 0 ||
                    t("forms.validation.amount.required"),
                },
              }}
              render={({ field, fieldState }) => (
                <AmountInput
                  amount={amount}
                  error={fieldState.error?.message}
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
            <div className="flex items-center justify-between rounded-xl px-3 py-3">
              <span className="text-sm text-secondary">{t("tx.fee_rate")}</span>
              <Controller
                name="feeRate"
                control={control}
                defaultValue="4"
                render={({ field }) => (
                  <Select
                    aria-label={t("tx.fee_rate")}
                    selectedKey={field.value}
                    onSelectionChange={(key) => field.onChange(String(key))}
                  >
                    <Select.Trigger className="bg-tertiary">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item id="1" textValue={t("home.urgent")}>
                          {t("home.urgent")}
                        </ListBox.Item>
                        <ListBox.Item id="4" textValue={t("home.normal")}>
                          {t("home.normal")}
                        </ListBox.Item>
                        <ListBox.Item id="20" textValue={t("home.slow")}>
                          {t("home.slow")}
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                )}
              />
            </div>
          </fieldset>

          {error && <Alert color="danger">{error}</Alert>}
        </ConfirmModal.Body>

        <ConfirmModal.Footer>
          <Button onPress={disclosure.close} isDisabled={isLoading}>
            {t("settings.cancel")}
          </Button>

          <Button
            variant="primary"
            type="submit"
            isDisabled={isLoading || !isValid}
            isPending={isLoading}
          >
            {t("home.open_channel")}
          </Button>
        </ConfirmModal.Footer>
      </form>
    </ConfirmModal>
  );
}
