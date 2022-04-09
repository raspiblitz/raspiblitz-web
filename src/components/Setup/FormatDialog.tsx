import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as Trash } from "../../assets/trash.svg";
import { ReactComponent as X } from "../../assets/X.svg";
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
          <div className="mt-5 flex justify-center gap-2">
            <button
              onClick={() => callback(false, keepBlockchain.current)}
              className="flex items-center rounded  bg-red-500 px-2 text-white shadow-xl hover:bg-red-400 disabled:bg-gray-400"
            >
              <X className="inline h-6 w-6" />
              <span className="p-2">{t("setup.cancel")}</span>
            </button>
            <button
              onClick={() => callback(true, keepBlockchain.current)}
              className="bd-button flex items-center rounded px-2"
            >
              <Trash className="inline h-6 w-6" />
              <span className="p-2">{t("setup.hdd_delete")}</span>
            </button>
          </div>
        </div>
      )}
    </SetupContainer>
  );
};

export default FormatDialog;
