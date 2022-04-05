import { FC, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";

export type Props = {
  containsBlockchain: boolean;
  callback: (deleteData: boolean, keepBlockchainData: boolean) => void;
};

const FormatDialog: FC<Props> = ({ containsBlockchain, callback }) => {
  const { t } = useTranslation();

  const [step, setStep] = useState(0);
  const keepBlockchain = useRef(true);

  useEffect(() => {
    keepBlockchain.current = containsBlockchain;
    setStep(containsBlockchain ? 1 : 2);
  }, [containsBlockchain]);

  const handleBlockchain = (keep: boolean) => {
    keepBlockchain.current = keep;
    setStep(2);
  };

  return (
    <SetupContainer>
      {step === 1 && (
        <div className="text-center">
          <div className="text-center">{t("setup.blockchain_found_short")}</div>
          <div className="text-center text-sm">
            {t("setup.blockchain_found_long")}
          </div>
          <button
            onClick={() => handleBlockchain(false)}
            className="bd-button my-5 p-2"
          >
            {t("setup.blockchain_delete")}
          </button>
          &nbsp;
          <button
            onClick={() => handleBlockchain(true)}
            className="bd-button my-5 p-2"
          >
            {t("setup.blockchain_keep")}
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="text-center">
          <div className="text-center">{t("setup.hdd_delete_short")}</div>
          {keepBlockchain.current && (
            <div className="text-center text-sm">
              {t("setup.hdd_delete_keep_blockchain")}
            </div>
          )}
          {!keepBlockchain.current && (
            <div className="text-center text-sm">
              {t("setup.hdd_delete_no_blockchain")}
            </div>
          )}
          <button
            onClick={() => callback(false, keepBlockchain.current)}
            className="bd-button my-5 p-2"
          >
            {t("setup.cancel")}
          </button>
          &nbsp;
          <button
            onClick={() => callback(true, keepBlockchain.current)}
            className="bd-button my-5 p-2"
          >
            {t("setup.hdd_delete")}
          </button>
        </div>
      )}
    </SetupContainer>
  );
};

export default FormatDialog;
