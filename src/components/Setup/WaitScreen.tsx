import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupStatus } from "../../models/setup.model";

export interface InputData {
  status: SetupStatus;
  message: string;
}

const WaitScreen: FC<InputData> = (props) => {
  const { t } = useTranslation();

  // optimize for certain states like
  // setup.scripts/eventInfoWait.sh
  let headline = "";
  let details = "";
  switch (props.status) {
    case SetupStatus.WAIT:
      headline = "... waiting ...";
      break;
    case SetupStatus.SHUTDOWN:
      headline = "... shutting down ...";
      break;
    case SetupStatus.REBOOT:
      headline = "... restarting ...";
      details = "(please wait until RaspiBlitz answers again)";
      break;
    case SetupStatus.WAITPROVISION:
      headline = "... preparing setup ...";
      details = "(setup will take some minutes)";
      break;
    case SetupStatus.PROVISION:
      headline = "Running Setup:";
      details = props.message;
      break;
    default:
      headline = props.status;
      details = props.message;
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
