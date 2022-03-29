import { FC, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";

export interface InputData {
  containsBlockchain: boolean;
  callback: (deleteData: boolean, keepBlockchainData: boolean) => void;
}

const FormatDialog: FC<InputData> = (props) => {
  const { t } = useTranslation();

  const [step, setStep] = useState(0);
  const keepBlockchain = useRef(true);

  useEffect(() => {
    keepBlockchain.current = props.containsBlockchain;
    setStep(props.containsBlockchain ? 1 : 2);
  }, []);

  const handleBlockchain = (keep: boolean) => {
    keepBlockchain.current = keep;
    setStep(2);
  };

  return (
    <SetupContainer>
      {step === 1 && (
        <div className="text-center">
          <div className="text-center">Blockchain found on HDD/SSD</div>
          <div className="text-center text-sm">
            On your HDD/SSD existing blockchain data was found.
          </div>
          <button
            onClick={() => handleBlockchain(false)}
            className="bd-button my-5 p-2"
          >
            Delete Blockchain
          </button>
          &nbsp;
          <button
            onClick={() => handleBlockchain(true)}
            className="bd-button my-5 p-2"
          >
            Keep Blockchain
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="text-center">
          <div className="text-center">OK to delete all data on HDD/SSD?</div>
          {keepBlockchain.current && (
            <div className="text-center text-sm">
              Please confirm that you want to delete all previous data on the
              HDD/SSD and just keep the blockchain data for your fresh
              RaspiBlitz.
            </div>
          )}
          {!keepBlockchain.current && (
            <div className="text-center text-sm">
              Please confirm that you want to delete all previous data on the
              HDD/SSD to start a fresh RaspiBlitz.
            </div>
          )}
          <button
            onClick={() => props.callback(false, keepBlockchain.current)}
            className="bd-button my-5 p-2"
          >
            Cancel
          </button>
          &nbsp;
          <button
            onClick={() => props.callback(true, keepBlockchain.current)}
            className="bd-button my-5 p-2"
          >
            DELETE OLD DATA
          </button>
        </div>
      )}
    </SetupContainer>
  );
};

export default FormatDialog;
