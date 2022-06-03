import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as DBIcon } from "../../assets/database.svg";
import { ReactComponent as TrashIcon } from "../../assets/trash.svg";
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
        <section className="flex h-full flex-col items-center justify-center p-8">
          <h2 className="m-2 text-center text-lg font-bold">
            {t("setup.blockchain_found_short")}
          </h2>
          <div className="text-sm">{t("setup.blockchain_found_long")}</div>
          <article className="mt-10 flex flex-col items-center justify-center gap-10 md:flex-row">
            <button
              onClick={() => handleBlockchain(false)}
              className="flex items-center rounded bg-red-500 px-2 text-white shadow-xl hover:bg-red-400 disabled:bg-gray-400"
            >
              <TrashIcon className="inline h-6 w-6" />
              <span className="p-2">{t("setup.blockchain_delete")}</span>
            </button>
            <button
              onClick={() => handleBlockchain(true)}
              className="bd-button rounded p-2"
            >
              <DBIcon className="inline h-6 w-6" />
              <span className="p-2">{t("setup.blockchain_keep")}</span>
            </button>
          </article>
        </section>
      )}
      {step === 2 && (
        <section className="flex h-full flex-col items-center justify-center p-8">
          <h2 className="m-2 text-center text-lg font-bold">
            {t("setup.hdd_delete_short")}
          </h2>
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
          <div className="mt-5 flex flex-col justify-center gap-2 md:flex-row">
            <button
              onClick={() => callback(false, keepBlockchain.current)}
              className="rounded  bg-red-500 p-2 text-white shadow-xl hover:bg-red-400 disabled:bg-gray-400"
            >
              <X className="inline h-6 w-6" />
              <span className="p-2">{t("setup.cancel")}</span>
            </button>
            <button
              onClick={() => callback(true, keepBlockchain.current)}
              className="bd-button rounded p-2"
            >
              <TrashIcon className="inline h-6 w-6" />
              <span className="p-2">{t("setup.hdd_delete")}</span>
            </button>
          </div>
        </section>
      )}
    </SetupContainer>
  );
};

export default FormatDialog;
