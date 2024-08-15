import FinalDialog from "./FinalDialog";
import FormatDialog from "./FormatDialog";
import InputNodeName from "./InputNodeName";
import InputPassword from "./InputPassword";
import LightningDialog from "./LightningDialog";
import MigrationDialog from "./MigrationDialog";
import RecoveryDialog from "./RecoveryDialog";
import SetupMenu from "./SetupMenu";
import StartDoneDialog from "./StartDoneDialog";
import SyncScreen from "./SyncScreen";
import WaitScreen from "./WaitScreen";
import {
  initialState,
  Screen,
  SetupLightning,
  SetupPhase,
  SetupState,
  SetupStatus,
} from "@/models/setup.model";
import { ACCESS_TOKEN } from "@/utils";
import { instance } from "@/utils/interceptor";
import { HttpStatusCode } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Setup() {
  const [state, setState] = useState<SetupState>(initialState);
  const navigate = useNavigate();

  const updateState = useCallback((newState: Partial<SetupState>) => {
    setState((prevState: SetupState) => ({ ...prevState, ...newState }));
  }, []);

  const showError = useCallback(
    (message: string) => {
      updateState({
        waitScreenStatus: SetupStatus.ERROR,
        waitScreenMessage: message,
        page: Screen.WAIT,
      });
    },
    [updateState],
  );

  const showSyncScreen = useCallback(async () => {
    try {
      const resp = await instance.post("/setup/setup-sync-info", {});
      updateState({ syncData: resp.data, page: Screen.SYNC });
    } catch (err) {
      const error = err as { response: { status: number } };
      if (
        [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].includes(
          error.response.status,
        )
      ) {
        navigate("/login?back=/setup");
      } else {
        console.error(`request for sync failed: ${error.response.status}`);
      }
    }
  }, [updateState, navigate]);

  const initSetupStart = useCallback(async () => {
    try {
      const resp = await instance.get("/setup/setup-start-info");
      updateState({
        gotBlockchain: resp.data.hddGotBlockchain === "1",
        setupPhaseOnStart: resp.data.setupPhase,
        migrationOS: resp.data.hddGotMigrationData,
        migrationMode: resp.data.migrationMode,
      });

      switch (resp.data.setupPhase) {
        case SetupPhase.RECOVERY:
        case SetupPhase.UPDATE:
          updateState({ page: Screen.RECOVERY });
          break;
        case SetupPhase.MIGRATION:
          updateState({ page: Screen.MIGRATION });
          break;
        case SetupPhase.SETUP:
          updateState({ page: Screen.SETUP });
          break;
        default:
          showError("unknown setup phase on init");
      }
    } catch (error) {
      showError(`request for init setup data failed: ${error}`);
    }
  }, [showError, updateState]);

  const initSetupFinal = useCallback(async () => {
    try {
      const resp = await instance.get("/setup/setup-final-info");
      updateState({ seedWords: resp.data.seedwordsNEW, page: Screen.FINAL });
    } catch (err) {
      const error = err as { response: { status: number } };
      if (
        [HttpStatusCode.Forbidden, HttpStatusCode.Unauthorized].includes(
          error.response.status,
        )
      ) {
        navigate("/login?back=/setup");
      } else {
        showError(`request for setup start failed: ${error.response.status}`);
      }
    }
  }, [showError, updateState, navigate]);

  const setupMonitoringLoop = useCallback(async () => {
    try {
      const resp = await instance.get("/setup/status");

      if (resp.data.state === SetupStatus.WAITSETUP) {
        await initSetupStart();
        return;
      }

      if (resp.data.state === SetupStatus.WAITFINAL) {
        await initSetupFinal();
        return;
      }

      if (resp.data.state === SetupStatus.READY) {
        if (resp.data.initialsync === "running") {
          await showSyncScreen();
        } else {
          navigate("/");
          return;
        }
      } else {
        updateState({
          waitScreenStatus: resp.data.state,
          waitScreenMessage: resp.data.message,
          page: Screen.WAIT,
        });
      }
    } catch {
      console.error("status request failed - device is off or in reboot?");
    }

    setTimeout(setupMonitoringLoop, 4000);
  }, [initSetupFinal, initSetupStart, updateState, navigate, showSyncScreen]);

  useEffect(() => {
    setupMonitoringLoop();
  }, [setupMonitoringLoop]);

  const setupStart = async () => {
    try {
      const forceFreshSetup = state.setupPhase === SetupPhase.SETUP;
      const resp = await instance.post("/setup/setup-start-done", {
        hostname: state.hostname,
        forceFreshSetup,
        keepBlockchain: state.keepBlockchain,
        lightning: state.lightning,
        passwordA: state.passwordA,
        passwordB: state.passwordB,
        passwordC: state.passwordC,
      });

      if (resp) {
        localStorage.setItem(ACCESS_TOKEN, resp.data.access_token || resp.data);
      }

      await setupMonitoringLoop();
    } catch {
      showError("request for setup start failed");
    }
  };

  const setupFinalReboot = async () => {
    try {
      await instance.post("/setup/setup-final-done", {});
      await setupMonitoringLoop();
    } catch (err) {
      const error = err as { response: { status: number } };
      if (
        [HttpStatusCode.Forbidden, HttpStatusCode.Unauthorized].includes(
          error.response.status,
        )
      ) {
        navigate("/login?back=/setup");
      } else {
        showError(
          `request for final setup done failed: ${error.response.status}`,
        );
      }
    }
  };

  const setupShutdown = async () => {
    updateState({
      waitScreenStatus: SetupStatus.WAIT,
      waitScreenMessage: "",
      page: Screen.WAIT,
    });

    try {
      await instance.get("/setup/shutdown");
    } catch {
      showError(
        "shutdown request failed - but that can also happen when shutdown happened",
      );
    }
  };

  const callbackRecoveryDialog = (startRecovery: boolean) => {
    updateState({ page: startRecovery ? Screen.INPUT_A : Screen.SETUP });
  };

  const callbackMigrationDialog = async (start: boolean) => {
    if (start) {
      updateState({ setupPhase: SetupPhase.MIGRATION, page: Screen.INPUT_A });
    } else {
      await setupShutdown();
    }
  };

  const callbackSetupMenu = async (setupmode: SetupPhase) => {
    updateState({ setupPhase: setupmode });

    switch (setupmode) {
      case SetupPhase.NULL:
        await setupShutdown();
        break;
      case SetupPhase.RECOVERY:
      case SetupPhase.UPDATE:
      case SetupPhase.MIGRATION:
        updateState({ page: Screen.INPUT_A });
        break;
      case SetupPhase.SETUP:
        updateState({ page: Screen.FORMAT });
        break;
    }
  };

  const callbackFormatDialog = (
    deleteData: boolean,
    keepBlockchainData: boolean,
  ) => {
    if (!deleteData) {
      updateState({ page: Screen.SETUP });
      return;
    }

    updateState({
      keepBlockchain: keepBlockchainData,
      page: Screen.INPUT_NODENAME,
    });
  };

  const callbackLightning = (lightning: SetupLightning) => {
    if (!lightning) {
      updateState({ page: Screen.SETUP });
      return;
    }

    updateState({ lightning, page: Screen.INPUT_A });
  };

  const callbackInputNodename = (nodename: string | null) => {
    if (!nodename) {
      updateState({ page: Screen.SETUP });
      return;
    }

    updateState({ hostname: nodename, page: Screen.LIGHTNING });
  };

  const checkPasswordCancel = (password: string | null): boolean => {
    if (!password) {
      updateState({ page: Screen.SETUP });
      return true;
    }
    return false;
  };

  const callbackInputPasswordA = (password: string | null) => {
    if (checkPasswordCancel(password)) return;

    updateState({ passwordA: password! });

    switch (state.setupPhase) {
      case SetupPhase.RECOVERY:
      case SetupPhase.UPDATE:
        updateState({ page: Screen.START_DONE });
        break;
      case SetupPhase.SETUP:
      case SetupPhase.MIGRATION:
        updateState({ page: Screen.INPUT_B });
        break;
      default:
        showError("unknown follow up state: passwordA");
    }
  };

  const callbackInputPasswordB = (password: string | null) => {
    if (checkPasswordCancel(password)) return;

    updateState({ passwordB: password! });

    // based on setupPhase ... continue to a different next screen
    if (state.lightning === SetupLightning.NONE) {
      // without lightning no password c is needed - finish setup
      updateState({ page: Screen.START_DONE });
      return;
    }

    updateState({ page: Screen.INPUT_C });
  };

  const callbackInputPasswordC = (password: string | null) => {
    if (checkPasswordCancel(password)) return;

    updateState({ passwordC: password!, page: Screen.START_DONE });
  };

  const callbackStartDoneDialog = async (cancel: boolean) => {
    if (cancel) {
      updateState({ page: Screen.SETUP });
      return;
    }

    await setupStart();
  };

  const callbackSyncScreen = async (action: string) => {
    if (action === "shutdown") {
      try {
        await instance.post("/system/shutdown");
      } catch {
        console.error(
          "shutdown request failed - but that can also happen when shutdown happened",
        );
      }
    }
  };

  switch (state.page) {
    case Screen.SETUP:
      return (
        <SetupMenu
          setupPhase={state.setupPhaseOnStart}
          callback={callbackSetupMenu}
        />
      );
    case Screen.START_DONE:
      return (
        <StartDoneDialog
          setupPhase={state.setupPhase}
          callback={callbackStartDoneDialog}
        />
      );
    case Screen.FORMAT:
      return (
        <FormatDialog
          containsBlockchain={state.gotBlockchain}
          callback={callbackFormatDialog}
        />
      );
    case Screen.RECOVERY:
      return (
        <RecoveryDialog
          setupPhase={state.setupPhaseOnStart}
          callback={callbackRecoveryDialog}
        />
      );
    case Screen.MIGRATION:
      return (
        <MigrationDialog
          migrationOS={state.migrationOS}
          migrationMode={state.migrationMode}
          callback={callbackMigrationDialog}
        />
      );
    case Screen.LIGHTNING:
      return <LightningDialog callback={callbackLightning} />;
    case Screen.INPUT_A:
      return (
        <InputPassword passwordType="a" callback={callbackInputPasswordA} />
      );
    case Screen.INPUT_B:
      return (
        <InputPassword passwordType="b" callback={callbackInputPasswordB} />
      );
    case Screen.INPUT_C:
      return (
        <InputPassword passwordType="c" callback={callbackInputPasswordC} />
      );
    case Screen.INPUT_NODENAME:
      return <InputNodeName callback={callbackInputNodename} />;
    case Screen.FINAL:
      return (
        <FinalDialog
          setupPhase={state.setupPhase}
          seedWords={state.seedWords}
          callback={setupFinalReboot}
        />
      );
    case Screen.SYNC:
      return <SyncScreen data={state.syncData} callback={callbackSyncScreen} />;
    case Screen.WAIT:
    default:
      return (
        <WaitScreen
          status={state.waitScreenStatus}
          message={state.waitScreenMessage}
        />
      );
  }
}
