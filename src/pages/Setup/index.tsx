import { initialState, SetupState } from "@/models/setup.model";
import SetupProvider from "@/pages/Setup/SetupContext";
import SetupScreenRenderer from "@/pages/Setup/SetupScreenRenderer";
import { setupMonitoringLoop } from "@/pages/Setup/setup-functions";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Setup() {
  const [state, setState] = useState<SetupState>(initialState);
  const navigate = useNavigate();

  const updateState = useCallback((newState: Partial<SetupState>) => {
    setState((prevState: SetupState) => ({ ...prevState, ...newState }));
  }, []);

  useEffect(() => {
    setupMonitoringLoop(updateState, navigate);
  }, [updateState, navigate]);

  return (
    <SetupProvider state={state} updateState={updateState} navigate={navigate}>
      <SetupScreenRenderer />
    </SetupProvider>
  );
}
