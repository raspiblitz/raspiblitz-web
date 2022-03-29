import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupPhase } from "../../models/setup.model";

export interface InputData {
  setupPhase: SetupPhase;
  callback: (setupmode: SetupPhase) => void;
}

const ChooseSetup: FC<InputData> = (props) => {
  const { t } = useTranslation();

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">Setup Options</div>
        {props.setupPhase === SetupPhase.RECOVERY && (
          <span>
            <button
              onClick={() => props.callback(SetupPhase.RECOVERY)}
              className="bd-button my-5 p-2"
            >
              Recover my RaspiBlitz
            </button>
            <br />
          </span>
        )}
        {props.setupPhase === SetupPhase.UPDATE && (
          <span>
            <button
              onClick={() => props.callback(SetupPhase.UPDATE)}
              className="bd-button my-5 p-2"
            >
              Update my RaspiBlitz
            </button>
            <br />
          </span>
        )}
        {props.setupPhase === SetupPhase.MIGRATION && (
          <span>
            <button
              onClick={() => props.callback(SetupPhase.MIGRATION)}
              className="bd-button my-5 p-2"
            >
              Migrate to RaspiBlitz
            </button>
            <br />
          </span>
        )}
        <button
          onClick={() => props.callback(SetupPhase.SETUP)}
          className="bd-button my-5 p-2"
        >
          Setup a fresh RaspiBlitz
        </button>
        <br />
        <button
          onClick={() => props.callback(SetupPhase.NULL)}
          className="bd-button my-5 p-2"
        >
          Shutdown
        </button>
        <br />
      </div>
    </SetupContainer>
  );
};

export default ChooseSetup;
