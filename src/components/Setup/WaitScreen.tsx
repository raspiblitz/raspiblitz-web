import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupStatus } from "../../models/setup.model";

export interface InputData {
  status: SetupStatus;
  message: string;
}

const WaitScreen: FC<InputData> = ({ status, message }) => {
  const { t } = useTranslation();

  // optimize for certain states like
  // setup.scripts/eventInfoWait.sh
  let headline = "";
  let details = "";
  switch (status) {
    case SetupStatus.WAIT:
      headline = `... ${t("setup.pleasewait")} ...`;
      break;
    case SetupStatus.SHUTDOWN:
      headline = `... ${t("setup.shuttingdown")} ...`;
      break;
    case SetupStatus.REBOOT:
      headline = `... ${t("setup.restarting")} ...`;
      details = `(${t("setup.restartinfo")})`;
      break;
    case SetupStatus.WAITPROVISION:
      headline = `... ${t("setup.preparingsetup")} ...`;
      details = `(${t("setup.setupwait")})`;
      break;
    case SetupStatus.PROVISION:
      headline = `${t("setup.runningsetup")}:`;
      details = message;
      break;
    default:
      headline = status;
      details = message;
  }

  let content = (
    <div className="text-center">
      <div className="text-center">{headline}</div>
      <div className="text-center text-sm italic">{details}</div>
    </div>
  );

  return <SetupContainer>{content}</SetupContainer>;
};

export default WaitScreen;
