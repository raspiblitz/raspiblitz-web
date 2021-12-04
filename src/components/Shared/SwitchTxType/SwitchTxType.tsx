import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FC } from "react";

export enum TxType {
  onChain = "ONCHAIN",
  lightning = "LIGHTNING",
}

const SwitchTxType: FC<SwitchTxTypeProps> = (props) => {
  const { t } = useTranslation();
  const [txType, setTxType] = useState<TxType>(TxType.lightning);

  const handleClick = (txType: TxType) => {
    setTxType(txType);
    props.onTxTypeChange(txType);
  };

  return (
    <div>
      <button
        disabled={txType === TxType.lightning}
        className="switch-button"
        onClick={() => handleClick(TxType.lightning)}
      >
        {t("home.lightning")}
      </button>

      <button
        disabled={txType === TxType.onChain}
        className="switch-button"
        onClick={() => handleClick(TxType.onChain)}
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
