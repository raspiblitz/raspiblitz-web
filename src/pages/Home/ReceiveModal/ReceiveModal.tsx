import type { ChangeEvent, FC } from "react";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AmountInput from "../../../components/AmountInput";
import InputField from "../../../components/InputField";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import Message from "../../../components/Message";
import { AppContext, Unit } from "../../../context/app-context";
import Modal from "../../../layouts/Modal";
import { MODAL_ROOT } from "../../../utils";
import { checkError } from "../../../utils/checkError";
import { convertBtcToSat, stringToNumber } from "../../../utils/format";
import { instance } from "../../../utils/interceptor";
import SwitchTxType, { TxType } from "../SwitchTxType";
import ReceiveAddress from "./ReceiveAddress";

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
          setError(checkError(err));
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
        setError(checkError(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const showLnInvoice = lnInvoice && !isLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInputs> = (_data) =>
    generateInvoiceHandler();

  const onBack = () => setAddress("");

  return createPortal(
    <Modal
      closeFunc={onClose}
      submitFunc={handleSubmit(onSubmit)}
      backFunc={address && lnInvoice ? onBack : undefined}
      title={showLnInvoice ? t("wallet.create_invoice_ln") : t("wallet.fund")}
      submitTitle={
        showLnInvoice && !address ? t("wallet.create_invoice") : undefined
      }
    >
      <div className="my-3">
        <SwitchTxType
          invoiceType={invoiceType}
          onTxTypeChange={changeInvoiceHandler}
        />
      </div>

      <fieldset className="mb-5 sm:w-96">
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
      </fieldset>

      {address && <ReceiveAddress address={address} />}
    </Modal>,
    MODAL_ROOT,
  );
};

export default ReceiveModal;
