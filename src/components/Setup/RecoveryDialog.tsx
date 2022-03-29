import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupPhase } from "../../models/setup.model";

export interface InputData {
  setupPhase: SetupPhase;
  callback: (start: boolean) => void;
}

const RecoveryDialog: FC<InputData> = (props) => {
  const { t } = useTranslation();

  let text: string = "";
  switch (props.setupPhase) {
    case SetupPhase.RECOVERY:
      text = "Do you wanna start Recovery?";
      break;
    case SetupPhase.UPDATE:
      text = "Do you wanna start Recovery?";
      break;
  }

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">{text}</div>
        <button
          onClick={() => props.callback(true)}
          className="bd-button my-5 p-2"
        >
          Yes
        </button>
        &nbsp;
        <button
          onClick={() => props.callback(false)}
          className="bd-button my-5 p-2"
        >
          Other Options
        </button>
      </div>
    </SetupContainer>
  );
};

export default RecoveryDialog;
