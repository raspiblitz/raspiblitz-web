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
      text = t("setup.start_recovery");
      break;
    case SetupPhase.UPDATE:
      text = t("setup.start_update");
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
          {t("setup.yes")}
        </button>
        &nbsp;
        <button
          onClick={() => props.callback(false)}
          className="bd-button my-5 p-2"
        >
          {t("setup.other_options")}
        </button>
      </div>
    </SetupContainer>
  );
};

export default RecoveryDialog;
