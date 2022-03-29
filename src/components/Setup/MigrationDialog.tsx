import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupMigrationOS, SetupMigrationMode } from "../../models/setup.model";

export interface InputData {
  migrationOS: SetupMigrationOS;
  migrationMode: SetupMigrationMode;
  callback: (migrate: boolean) => void;
}

const MigrationDialog: FC<InputData> = (props) => {
  const { t } = useTranslation();

  if (props.migrationMode === SetupMigrationMode.OUTDATED) {
    return (
      <SetupContainer>
        <div className="text-center">
          <div className="text-center">
            The node you want to migrate from uses a newer Lightning version
            than this RaspiBlitz. Please wait for an updated release. You can
            shutdown and startup with your old node sd card - no changes were
            made.
          </div>
          <button
            onClick={() => props.callback(false)}
            className="bd-button my-5 p-2"
          >
            Shutdown
          </button>
        </div>
      </SetupContainer>
    );
  }

  let text: string = "";
  switch (props.migrationOS) {
    case SetupMigrationOS.UMBREL:
      text = "Do you want to convert UMBREL to RaspiBlitz?";
      break;
    case SetupMigrationOS.CITADEL:
      text = "Do you want to convert CITADEL to RaspiBlitz?";
      break;
    case SetupMigrationOS.MYNODE:
      text = "Do you want to convert MYNODE to RaspiBlitz?";
      break;
  }

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">{text}</div>
        <div className="text-center text-sm">
          RaspiBlitz can only convert your Blockchain &amp; Lightning LND data
          (funds &amp; channels) at the moment. Data from additional installed
          apps might get deleted in the migraton process.
        </div>
        <button
          onClick={() => props.callback(false)}
          className="bd-button my-5 p-2"
        >
          No / Shutdown
        </button>
        &nbsp;
        <button
          onClick={() => props.callback(true)}
          className="bd-button my-5 p-2"
        >
          Migrate to RaspiBlitz
        </button>
      </div>
    </SetupContainer>
  );
};

export default MigrationDialog;
