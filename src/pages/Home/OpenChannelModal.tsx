import AmountInput from "@/components/AmountInput";
import AvailableBalance from "@/components/AvailableBalance";
import ButtonWithSpinner from "@/components/ButtonWithSpinner/ButtonWithSpinner";
import InputField from "@/components/InputField";
import Message from "@/components/Message";
import { AppContext } from "@/context/app-context";
import ModalDialog from "@/layouts/ModalDialog";
import { MODAL_ROOT } from "@/utils";
import { checkError } from "@/utils/checkError";
import { convertMSatToSat, stringToNumber } from "@/utils/format";
import { instance } from "@/utils/interceptor";
import { LinkIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, FC, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface IFormInputs {
  nodeUri: string;
  fundingAmount: string;
  feeRate: string;
}

type Props = {
  balance: number;
  onClose: () => void;
};

const OpenChannelModal: FC<Props> = ({ balance, onClose }) => {
  const { darkMode } = useContext(AppContext);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const theme = darkMode ? "dark" : "light";

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
        toast.success(t("home.channel_opened"), { theme });
        onClose();
      })
      .catch((err) => setError(checkError(err)))
      .finally(() => setIsLoading(false));
  };

  const changeAmountHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const convertedBalance = balance ? convertMSatToSat(balance) : 0;

  return createPortal(
    <ModalDialog close={onClose}>
      <h2 className="text-lg font-bold">{t("home.open_channel")}</h2>
      <article className="my-5">
        <AvailableBalance balance={convertedBalance!} />

        <form onSubmit={handleSubmit(openChannelHandler)}>
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

          <ButtonWithSpinner
            type="submit"
            className="bd-button p-2"
            loading={isLoading}
            disabled={!isValid}
            icon={<LinkIcon className="mx-1 h-6 w-6" />}
          >
            {t("home.open_channel")}
          </ButtonWithSpinner>
        </form>
        {error && <Message message={error} />}
      </article>
    </ModalDialog>,
    MODAL_ROOT,
  );
};

export default OpenChannelModal;
