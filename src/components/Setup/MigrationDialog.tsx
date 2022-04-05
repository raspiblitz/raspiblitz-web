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
          <div className="text-center">{t("setup.lightningoutdated")}</div>
          <button
            onClick={() => props.callback(false)}
            className="bd-button my-5 p-2"
          >
            {t("setup.shutdown")}
          </button>
        </div>
      </SetupContainer>
    );
  }

  let text: string = "";
  switch (props.migrationOS) {
    case SetupMigrationOS.UMBREL:
      text = t("setup.convert_umbrel");
      break;
    case SetupMigrationOS.CITADEL:
      text = t("setup.convert_citadel");
      break;
    case SetupMigrationOS.MYNODE:
      text = t("setup.convert_mynode");
      break;
  }

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">{text}</div>
        <div className="text-center text-sm">{t("setup.convertwarning")}</div>
        <button
          onClick={() => props.callback(false)}
          className="bd-button my-5 p-2"
        >
          {t("setup.no_and_shutdown")}
        </button>
        &nbsp;
        <button
          onClick={() => props.callback(true)}
          className="bd-button my-5 p-2"
        >
          {t("setup.yes_and_migrate")}
        </button>
      </div>
    </SetupContainer>
  );
};

export default MigrationDialog;
