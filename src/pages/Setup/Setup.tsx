import { FC, ReactElement, useEffect, useState } from 'react';
import Migration from '../../components/SetupComponents/Migration/Migration';
import Provision from '../../components/SetupComponents/Provision/Provision';
import SetPasswords from '../../components/SetupComponents/SetPasswords/SetPasswords';
import SetupDone from '../../components/SetupComponents/SetupDone/SetupDone';
import FreshSetup from '../../components/SetupComponents/FreshSetup/FreshSetup';
import UpdateRecover from '../../components/SetupComponents/UpdateRecover/UpdateRecover';
import WalletCreation from '../../components/SetupComponents/WalletCreation/WalletCreation';
import Welcome from '../../components/SetupComponents/Welcome/Welcome';
import { SetupSteps } from '../../models/setup.model';

const Setup: FC = () => {
  const [step, setStep] = useState<SetupSteps>(SetupSteps.WELCOME);
  const [version, setVersion] = useState<string>('0');

  useEffect(() => {
    // call status and set step accordingly
    setStep(6);
    // if update to new version, set version
    setVersion('0');
  }, []);

  let content: ReactElement<any, any> | null = null;

  switch (step) {
    case SetupSteps.SETUP_FRESH:
      content = <FreshSetup />;
      break;
    case SetupSteps.UPDATE:
      content = <UpdateRecover type='UPDATE' version={version} />;
      break;
    case SetupSteps.RECOVER:
      content = <UpdateRecover type='RECOVER' />;
      break;
    case SetupSteps.MYNODE_MIGRATION:
      content = <Migration type='MYNODE' />;
      break;
    case SetupSteps.UMBREL_MIGRATION:
      content = <Migration type='UMBREL' />;
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
