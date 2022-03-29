import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupPhase } from "../../models/setup.model";

export interface InputData {
  setupPhase: string;
  seedWords: string;
  callback: () => void;
}

const FinalDialog: FC<InputData> = (props) => {
  const { t } = useTranslation();

  let Headline: string = "Setup is finished.";
  if (props.setupPhase === SetupPhase.RECOVERY) {
    Headline = "Recovery is finished.";
  }
  if (props.setupPhase === SetupPhase.UPDATE) {
    Headline = "Update is finished.";
  }
  if (props.setupPhase === SetupPhase.MIGRATION) {
    Headline = "Migration is finished.";
  }

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">{Headline}</div>
        <br />
        {props.seedWords !== "" && (
          <div className="text-center">
            <div className="text-sm">
              Please write down your seed words &amp; store at a safe place:
            </div>
            <div className="text-sm italic">{props.seedWords}</div>
          </div>
        )}
        <br />
        <div className="text-center text-sm">
          Will now reboot and sync up the blockchain.
        </div>
        <button onClick={() => props.callback()} className="bd-button my-5 p-2">
          OK, do final Reboot
        </button>
      </div>
    </SetupContainer>
  );
};

export default FinalDialog;
