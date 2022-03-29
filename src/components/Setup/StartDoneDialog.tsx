import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupPhase } from "../../models/setup.model";

export interface InputData {
  setupPhase: SetupPhase;
  callback: (cancel: boolean) => void;
}

const StartDoneDialog: FC<InputData> = (props) => {
  const { t } = useTranslation();

  let Headline: string = "OK. Everything is ready to Setup your RaspiBlitz.";
  let Button: string = "Start Setup";
  if (props.setupPhase === SetupPhase.RECOVERY) {
    Headline = "OK. Everything is ready to recover your RaspiBlitz.";
    Button = "Start Recovery";
  }
  if (props.setupPhase === SetupPhase.UPDATE) {
    Headline = "OK. Everything is ready to update your RaspiBlitz.";
    Button = "Start Update";
  }
  if (props.setupPhase === SetupPhase.MIGRATION) {
    Headline = "OK. Everything is ready to migrate to RaspiBlitz.";
    Button = "Start Migration";
  }

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">{Headline}</div>
        <button
          onClick={() => props.callback(true)}
          className="bd-button my-5 p-2"
        >
          Cancel
        </button>
        &nbsp;
        <button
          onClick={() => props.callback(false)}
          className="bd-button my-5 p-2"
        >
          {Button}
        </button>
      </div>
    </SetupContainer>
  );
};

export default StartDoneDialog;
