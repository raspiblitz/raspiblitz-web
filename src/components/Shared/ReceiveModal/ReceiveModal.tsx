import type { ChangeEvent, FC } from "react";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Message from "../../../container/Message/Message";
import ModalDialog from "../../../container/ModalDialog/ModalDialog";
import { AppContext, Unit } from "../../../store/app-context";
import { convertBtcToSat, stringToNumber } from "../../../util/format";
import { instance } from "../../../util/interceptor";
import { MODAL_ROOT } from "../../../util/util";
import AmountInput from "../AmountInput/AmountInput";
import InputField from "../InputField/InputField";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import SwitchTxType, { TxType } from "../SwitchTxType/SwitchTxType";
import ReceiveOnChain from "./ReceiveOnChain/ReceiveOnChain";

interface IFormInputs {
  amountInput: string;
  commentInput: string;
}

type Props = {
  onClose: () => void;
};

const ReceiveModal: FC<Props> = ({ onClose }) => {
  const { unit } = useContext(AppContext);
  const { t } = useTranslation();
  const [invoiceType, setInvoiceType] = useState(TxType.LIGHTNING);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const lnInvoice = invoiceType === TxType.LIGHTNING;

  const changeInvoiceHandler = async (txType: TxType) => {
    setAddress("");
    setAmount(0);
    setComment("");
    setError("");

    setInvoiceType(txType);

    if (txType === TxType.ONCHAIN) {
      setIsLoading(true);
      await instance
        .post("lightning/new-address", {
          type: "p2wkh",
        })
        .then((resp) => {
          setAddress(resp.data);
        })
        .catch((err) => {
          setError(`${t("login.error")}: ${err.response?.data?.detail}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const commentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const amountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const generateInvoiceHandler = () => {
    setIsLoading(true);
    const mSatAmount =
      unit === Unit.BTC ? convertBtcToSat(amount) * 1000 : amount * 1000;
    instance
      .post(`lightning/add-invoice?value_msat=${mSatAmount}&memo=${comment}`)
      .then((resp) => {
        setAddress(resp.data.payment_request);
      })
      .catch((err) => {
        setError(`${t("login.error")}: ${err.response?.data?.detail}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const showLnInvoice = lnInvoice && !isLoading;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInputs> = (_data) =>
    generateInvoiceHandler();

  return createPortal(
    <ModalDialog close={onClose}>
      <div className="text-xl font-bold">
        {showLnInvoice ? t("wallet.create_invoice_ln") : t("wallet.fund")}
      </div>

      <div className="my-3">
        <SwitchTxType
          invoiceType={invoiceType}
          onTxTypeChange={changeInvoiceHandler}
        />
      </div>

      <form
        className="flex w-full flex-col items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="mb-5 w-4/5">
          {isLoading && (
            <div className="p-5">
              <LoadingSpinner />
            </div>
          )}

          {showLnInvoice && !address && (
            <div className="flex flex-col justify-center pb-5 text-center">
              <AmountInput
                amount={amount}
                register={register("amountInput", {
                  required: t("forms.validation.chainAmount.required"),
                  validate: {
                    greaterThanZero: (val) =>
                      stringToNumber(val) > 0 ||
                      t("forms.validation.chainAmount.required"),
                  },
                  onChange: amountChangeHandler,
                })}
                errorMessage={errors.amountInput}
              />

              <div className="mt-2 flex flex-col justify-center">
                <InputField
                  {...register("commentInput", {
                    onChange: commentChangeHandler,
                  })}
                  label={t("tx.comment")}
                  value={comment}
                  placeholder={t("tx.comment_placeholder")}
                />
              </div>
            </div>
          )}

          {error && <Message message={error} />}

          {!address && showLnInvoice && (
            <button
              type="submit"
              className="bd-button my-3 p-3"
              disabled={submitCount > 0 && !isValid}
            >
              {t("wallet.create_invoice")}
            </button>
          )}
        </fieldset>
      </form>

      {address && <ReceiveOnChain address={address} />}
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default ReceiveModal;
