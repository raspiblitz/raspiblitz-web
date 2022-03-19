import { FC, ReactElement, useEffect, useState } from "react";
import FreshSetup from "../components/Setup/FreshSetup/FreshSetup";
import Migration from "../components/Setup/Migration/Migration";
import Provision from "../components/Setup/Provision/Provision";
import SetPasswords from "../components/Setup/SetPasswords/SetPasswords";
import SetupDone from "../components/Setup/SetupDone/SetupDone";
import UpdateRecover from "../components/Setup/UpdateRecover/UpdateRecover";
import WalletCreation from "../components/Setup/WalletCreation/WalletCreation";
import Welcome from "../components/Setup/Welcome/Welcome";
import { SetupSteps } from "../models/setup.model";

const Setup: FC = () => {
  const [step, setStep] = useState<SetupSteps>(SetupSteps.WELCOME);
  const [version, setVersion] = useState<string>("0");

  useEffect(() => {
    // call status and set step accordingly
    setStep(6);
    // if update to new version, set version
    setVersion("0");
  }, []);

  let content: ReactElement<any, any> | null = null;

  switch (step) {
    case SetupSteps.SETUP_FRESH:
      content = <FreshSetup />;
      break;
    case SetupSteps.UPDATE:
      content = <UpdateRecover type="UPDATE" version={version} />;
      break;
    case SetupSteps.RECOVER:
      content = <UpdateRecover type="RECOVER" />;
      break;
    case SetupSteps.MYNODE_MIGRATION:
      content = <Migration type="MYNODE" />;
      break;
    case SetupSteps.UMBREL_MIGRATION:
      content = <Migration type="UMBREL" />;
      break;
    case SetupSteps.SET_PASSWORDS:
      content = <SetPasswords />;
      break;
    case SetupSteps.PROVISION:
      content = <Provision />;
      break;
    case SetupSteps.WALLET_CREATION:
      content = <WalletCreation />;
      break;
    case SetupSteps.DONE:
      content = <SetupDone />;
      break;
    case SetupSteps.WELCOME:
    default:
      content = <Welcome />;
      break;
  }

  return content;
};

export default Setup;
