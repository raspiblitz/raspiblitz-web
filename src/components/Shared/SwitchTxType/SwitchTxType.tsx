import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export enum TxType {
  ONCHAIN,
  LIGHTNING,
}

export type Props = {
  onTxTypeChange: (txtype: TxType) => void;
};

const SwitchTxType: FC<Props> = ({ onTxTypeChange }) => {
  const { t } = useTranslation();
  const [txType, setTxType] = useState<TxType>(TxType.LIGHTNING);

  const handleClick = (txType: TxType) => {
    setTxType(txType);
    onTxTypeChange(txType);
  };

  return (
    <div>
      <button
        disabled={txType === TxType.LIGHTNING}
        className="switch-button"
        onClick={() => handleClick(TxType.LIGHTNING)}
      >
        {t("home.lightning")}
      </button>

      <button
        disabled={txType === TxType.ONCHAIN}
        className="switch-button"
        onClick={() => handleClick(TxType.ONCHAIN)}
      >
        {t("wallet.on_chain")}
      </button>
    </div>
  );
};

export default SwitchTxType;
