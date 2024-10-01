import { Alert } from "@/components/Alert";
import AmountInput from "@/components/AmountInput";
import AvailableBalance from "@/components/AvailableBalance";
import { Button } from "@/components/Button";
import ConfirmModal, {
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import InputField from "@/components/InputField";
import { checkError } from "@/utils/checkError";
import { convertMSatToSat, stringToNumber } from "@/utils/format";
import { instance } from "@/utils/interceptor";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

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
    register,
    handleSubmit,
    formState: { errors, isValid },
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
        disclosure.onClose();
      })
      .catch((err) => setError(checkError(err)))
      .finally(() => setIsLoading(false));
  };

  const changeAmountHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const convertedBalance = balance ? convertMSatToSat(balance) : 0;

  return (
    <ConfirmModal disclosure={disclosure} custom>
      <form onSubmit={handleSubmit(openChannelHandler)}>
        <ConfirmModal.Header>{t("home.open_channel")}</ConfirmModal.Header>
        <ConfirmModal.Body>
          <AvailableBalance balance={convertedBalance!} />

          <fieldset className="flex w-full flex-col gap-4">
            <InputField
              {...register("nodeUri", {
                required: t("forms.validation.node_uri.required"),
              })}
              label={t("home.node_uri")}
              errorMessage={errors.nodeUri}
            />
            <AmountInput
              amount={amount}
              errorMessage={errors.fundingAmount}
              register={register("fundingAmount", {
                required: t("forms.validation.amount.required"),
                validate: {
                  greaterThanZero: (val) =>
                    stringToNumber(val) > 0 ||
                    t("forms.validation.amount.required"),
                },
                onChange: changeAmountHandler,
              })}
            />
            <div className="flex justify-around py-8 md:mx-auto md:w-1/2">
              <label htmlFor="targetConf" className="font-bold">
                {t("tx.fee_rate")}
              </label>
              <select
                id="targetConf"
                defaultValue={4}
                {...register("feeRate")}
                className="rounded bg-yellow-500 p-1 text-white"
              >
                <option value={1}>{t("home.urgent")}</option>
                <option value={4}>{t("home.normal")}</option>
                <option value={20}>{t("home.slow")}</option>
              </select>
            </div>
          </fieldset>

          {error && <Alert color="danger">{error}</Alert>}
        </ConfirmModal.Body>

        <ConfirmModal.Footer>
          <Button onClick={disclosure.onClose} disabled={isLoading}>
            {t("settings.cancel")}
          </Button>

          <Button
            color="primary"
            type="submit"
            disabled={isLoading || !isValid}
            isLoading={isLoading}
          >
            {t("home.open_channel")}
          </Button>
        </ConfirmModal.Footer>
      </form>
    </ConfirmModal>
  );
}
