import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FC } from "react";

export enum TxType {
  ONCHAIN,
  LIGHTNING,
}

const SwitchTxType: FC<SwitchTxTypeProps> = (props) => {
  const { t } = useTranslation();
  const [txType, setTxType] = useState<TxType>(TxType.LIGHTNING);

  const handleClick = (txType: TxType) => {
    setTxType(txType);
    props.onTxTypeChange(txType);
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

export interface SwitchTxTypeProps {
  onTxTypeChange: (txtype: TxType) => void;
}
