import { ChangeEvent, FC, FormEvent, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../../../store/app-context";

const SendLn: FC<SendLnProps> = (props) => {
  const appCtx = useContext(AppContext);
  const { balance, onChangeInvoice, onConfirm } = props;
  const { t } = useTranslation();

  const [isFormValid, setIsFormValid] = useState(true);

  const validateInput = (event: ChangeEvent<HTMLInputElement>) => {
    // TODO: check wallet balance
    setIsFormValid(event.target.validity.valid)
  }

  return (
    <form onSubmit={onConfirm}>
      <h3 className="text-xl font-bold">{t("wallet.send_lightning")}</h3>
      <p className="my-5">
        <span className="font-bold">{t("wallet.balance")}:&nbsp;</span>
        {balance} {appCtx.unit}
      </p>
      <label className="label-underline" htmlFor="invoiceInput">
        {t("wallet.invoice")}
      </label>
      <input
        id="invoiceInput"
        type="text"
        onChange={onChangeInvoice}
        onBlur={validateInput}
        required
        pattern="(lnbc|lntb|lntbs|lnbcrt)\w+"
        className={isFormValid ? "input-underline":"input-error"}

      />
      <button type="submit" className="bd-button p-3 my-3" disabled={!isFormValid}>
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
