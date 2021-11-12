import {
  ChangeEvent,
  FC,
  FormEvent,
  useContext,
  useState,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../../../store/app-context";
import InputField from "../../InputField/InputField";

const SendLn: FC<SendLnProps> = (props) => {
  const appCtx = useContext(AppContext);
  const { balance, onChangeInvoice, onConfirm } = props;
  const { t } = useTranslation();

  const invoiceInput = useRef<HTMLInputElement>(null);
  const [isFormValid, setIsFormValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const validateInput = (validity: HTMLInputElement["validity"]) => {
    setIsFormValid(validity.valid);
    setErrorMessage("");

    if (validity.valueMissing) {
      setErrorMessage(t("forms.validation.lnInvoice.required"));
      return false;
    }

    if (validity.patternMismatch) {
      setErrorMessage(t("forms.validation.lnInvoice.patternMismatch"));
      return false;
    }

    return true;
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    validateInput(event.target.validity);
    onChangeInvoice(event);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    console.log("FORM event", invoiceInput);

    event.preventDefault();
    const validity = invoiceInput?.current?.validity;

    if (validity) {
      const isFormValid = validateInput(validity);

      if (isFormValid) {
        onConfirm(event);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <h3 className="text-xl font-bold">{t("wallet.send_lightning")}</h3>

      <p className="my-5">
        <span className="font-bold">{t("wallet.balance")}:&nbsp;</span>
        {balance} {appCtx.unit}
      </p>

      <InputField
        id="invoiceInput"
        ref={invoiceInput}
        label={t("wallet.invoice")}
        pattern="(lnbc|lntb)\w+"
        placeholder="lnbc..."
        type="text"
        onChange={onChange}
        isFormValid={isFormValid}
        errorMessage={errorMessage}
        required={true}
      />

      <button
        type="submit"
        className="bd-button p-3 my-3"
        disabled={!isFormValid}
      >
        {t("wallet.send")}
      </button>
    </form>
  );
};

export default SendLn;

export interface SendLnProps {
  balance: string;
  onConfirm: (event: FormEvent) => void;
  onChangeInvoice: (event: ChangeEvent<HTMLInputElement>) => void;
}
