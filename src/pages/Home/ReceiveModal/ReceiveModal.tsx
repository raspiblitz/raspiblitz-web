import SwitchTxType, { TxType } from "../SwitchTxType";
import ReceiveOnChain from "./ReceiveOnChain";
import { Alert } from "@/components/Alert";
import AmountInput from "@/components/AmountInput";
import { Button } from "@/components/Button";
import ConfirmModal, {
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import InputField from "@/components/InputField";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { AppContext, Unit } from "@/context/app-context";
import { checkError } from "@/utils/checkError";
import { convertBtcToSat, stringToNumber } from "@/utils/format";
import { instance } from "@/utils/interceptor";
import { ModalFooter, ModalBody } from "@nextui-org/react";
import type { ChangeEvent, FC } from "react";
import { useContext, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface IFormInputs {
  amountInput: string;
  commentInput: string;
}

const ReceiveModal: FC<Pick<ConfirmModalProps, "disclosure">> = ({
  disclosure,
}) => {
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
    formState: { errors, isValid, submitCount },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInputs> = (_data) =>
    generateInvoiceHandler();

  return (
    <ConfirmModal
      headline={
        showLnInvoice ? t("wallet.create_invoice_ln") : t("wallet.fund")
      }
      disclosure={disclosure}
      customContent={
        <>
          <div className="my-3">
            <SwitchTxType
              invoiceType={invoiceType}
              onTxTypeChange={changeInvoiceHandler}
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <fieldset className="flex w-full flex-col gap-4">
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
              </fieldset>

              {error && <Alert color="danger">{error}</Alert>}
            </ModalBody>

            {!address && showLnInvoice && (
              <ModalFooter>
                <Button
                  color="primary"
                  type="submit"
                  disabled={isLoading || (!isValid && submitCount > 0)}
                  isLoading={isLoading}
                >
                  {t("wallet.create_invoice")}
                </Button>
              </ModalFooter>
            )}
          </form>

          {address && (
            <ReceiveOnChain
              address={address}
              setAddress={setAddress}
              setIsLoading={setIsLoading}
              setError={setError}
            />
          )}
        </>
      }
    />
  );
};

export default ReceiveModal;
