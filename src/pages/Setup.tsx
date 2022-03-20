import { FC, ReactElement, useEffect, useState } from "react";
import Welcome from "../components/Setup/Welcome";
import { SetupSteps } from "../models/setup.model";

const Setup: FC = () => {
  const [step, setStep] = useState<SetupSteps>(SetupSteps.WELCOME);

  useEffect(() => {
    // call status and set step accordingly
    setStep(0);
  }, []);

  let setupStep: ReactElement<any, any> | null = null;

  switch (step) {
    default:
      setupStep = <Welcome />;
      break;
  }

  return setupStep;
};

export default Setup;
