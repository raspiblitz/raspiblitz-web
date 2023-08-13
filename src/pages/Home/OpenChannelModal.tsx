import AvailableBalance from "components/AvailableBalance";
import { ChangeEvent, FC, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import AmountInput from "../../components/AmountInput";
import InputField from "../../components/InputField";
import Message from "../../components/Message";
import { AppContext } from "../../context/app-context";
import { MODAL_ROOT } from "../../utils";
import { checkError } from "../../utils/checkError";
import { convertMSatToSat, stringToNumber } from "../../utils/format";
import { instance } from "../../utils/interceptor";
import Modal from "../../layouts/Modal";

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
    formState: { errors },
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
    <Modal
      closeFunc={onClose}
      submitFunc={handleSubmit(openChannelHandler)}
      title={t("home.open_channel")}
      submitLabel={t("home.open_channel")}
      is-loading={isLoading}
    >
      <fieldset className="mb-5 sm:w-96">
        <AvailableBalance balance={convertedBalance!} />

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

        <div>
          <label htmlFor="targetConf" className="label-underline">
            {t("tx.fee_rate")}
          </label>

          <select
            id="targetConf"
            defaultValue={4}
            {...register("feeRate")}
            className="p-2 rounded shadow-md dark:bg-gray-600"
          >
            <option value={1}>{t("home.urgent")}</option>
            <option value={4}>{t("home.normal")}</option>
            <option value={20}>{t("home.slow")}</option>
          </select>
        </div>

        {error && <Message message={error} />}
      </fieldset>
    </Modal>,
    MODAL_ROOT,
  );
};

export default OpenChannelModal;
