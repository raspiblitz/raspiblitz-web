import type { FC } from "react";
import { useTranslation } from "react-i18next";

export enum TxType {
  ONCHAIN,
  LIGHTNING,
}

export type Props = {
  disabled?: boolean;
  invoiceType: TxType;
  onTxTypeChange: (txtype: TxType) => void;
};

const SwitchTxType: FC<Props> = ({ invoiceType, onTxTypeChange, disabled }) => {
  const { t } = useTranslation();

  const setTxTypeHandler = (txType: TxType) => {
    if (disabled) {
      return;
    }
    onTxTypeChange(txType);
  };

  return (
    <div>
      <button
        disabled={invoiceType === TxType.LIGHTNING}
        className="switch-button"
        onClick={() => setTxTypeHandler(TxType.LIGHTNING)}
      >
        {t("home.lightning")}
      </button>

      <button
        disabled={invoiceType === TxType.ONCHAIN}
        className="switch-button"
        onClick={() => setTxTypeHandler(TxType.ONCHAIN)}
      >
        {t("wallet.on_chain")}
      </button>
    </div>
  );
};

export default SwitchTxType;
