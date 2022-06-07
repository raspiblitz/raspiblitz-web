import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupMigrationMode, SetupMigrationOS } from "../../models/setup.model";

export interface InputData {
  migrationOS: SetupMigrationOS;
  migrationMode: SetupMigrationMode;
  callback: (migrate: boolean) => void;
}

const MigrationDialog: FC<InputData> = ({
  migrationOS,
  migrationMode,
  callback,
}) => {
  const { t } = useTranslation();

  if (migrationMode === SetupMigrationMode.OUTDATED) {
    return (
      <SetupContainer>
        <div className="text-center">
          <div className="text-center">{t("setup.lightningoutdated")}</div>
          <button
            onClick={() => callback(false)}
            className="bd-button my-5 p-2"
          >
            {t("setup.shutdown")}
          </button>
        </div>
      </SetupContainer>
    );
  }

  let text: string = "";
  switch (migrationOS) {
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
        <button onClick={() => callback(false)} className="bd-button my-5 p-2">
          {t("setup.no_and_shutdown")}
        </button>
        &nbsp;
        <button onClick={() => callback(true)} className="bd-button my-5 p-2">
          {t("setup.yes_and_migrate")}
        </button>
      </div>
    </SetupContainer>
  );
};

export default MigrationDialog;
