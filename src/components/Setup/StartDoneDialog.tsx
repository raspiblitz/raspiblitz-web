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

  let Headline: string = t("setup.done_setup_ready");
  let Button: string = t("setup.done_setup_start");
  if (props.setupPhase === SetupPhase.RECOVERY) {
    Headline = t("setup.done_recover_ready");
    Button = t("setup.done_recover_start");
  }
  if (props.setupPhase === SetupPhase.UPDATE) {
    Headline = t("setup.done_update_ready");
    Button = t("setup.done_update_start");
  }
  if (props.setupPhase === SetupPhase.MIGRATION) {
    Headline = t("setup.done_migration_ready");
    Button = t("setup.done_migration_start");
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
