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
  SetupLightning,
  SetupMigrationMode,
  SetupMigrationOS,
  SetupPhase,
  SetupStatus,
} from "@/models/setup.model";
import { Screen } from "@/models/setup.model";
import { ACCESS_TOKEN } from "@/utils";
import { instance } from "@/utils/interceptor";
import { HttpStatusCode } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Setup() {
  const [page, setPage] = useState(Screen.WAIT);
  const [syncData, setSyncData] = useState(null);
  const [waitScreenStatus, setWaitScreenStatus] = useState(SetupStatus.WAIT);
  const [waitScreenMessage, setWaitScreenMessage] = useState("");
  const [setupPhaseOnStart, setSetupPhaseOnStart] = useState(SetupPhase.NULL);
  const [setupPhase, setSetupPhase] = useState(SetupPhase.NULL);
  const [gotBlockchain, setGotBlockchain] = useState(false);
  const [keepBlockchain, setKeepBlockchain] = useState(true);
  const [migrationOS, setMigrationOS] = useState(SetupMigrationOS.NULL);
  const [migrationMode, setMigrationMode] = useState(SetupMigrationMode.NULL);
  const [lightning, setLightning] = useState(SetupLightning.NULL);
  const [hostname, setHostname] = useState("");
  const [passwordA, setPasswordA] = useState("");
  const [passwordB, setPasswordB] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [seedWords, setSeedWords] = useState<string | null>(null);
  const navigate = useNavigate();

  const showSyncScreen = useCallback(async () => {
    try {
      const resp = await instance.post("/setup/setup-sync-info", {});
      setSyncData(resp.data);
      setPage(Screen.SYNC);
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
  }, [navigate]);

  const initSetupStart = useCallback(async () => {
    try {
      const resp = await instance.get("/setup/setup-start-info");
      setGotBlockchain(resp.data.hddGotBlockchain === "1");
      setSetupPhaseOnStart(resp.data.setupPhase);
      setMigrationOS(resp.data.hddGotMigrationData);
      setMigrationMode(resp.data.migrationMode);

      switch (resp.data.setupPhase) {
        case SetupPhase.RECOVERY:
        case SetupPhase.UPDATE:
          setPage(Screen.RECOVERY);
          break;
        case SetupPhase.MIGRATION:
          setPage(Screen.MIGRATION);
          break;
        case SetupPhase.SETUP:
          setPage(Screen.SETUP);
          break;
        default:
          showError("unknown setup phase on init");
      }
    } catch (error) {
      showError(`request for init setup data failed: ${error}`);
    }
  }, []);

  const initSetupFinal = useCallback(async () => {
    try {
      const resp = await instance.get("/setup/setup-final-info");
      setSeedWords(resp.data?.seedwordsNEW || null);
      setPage(Screen.FINAL);
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
  }, [navigate]);

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
        setWaitScreenStatus(resp.data.state);
        setWaitScreenMessage(resp.data.message);
        setPage(Screen.WAIT);
      }
    } catch {
      console.error("status request failed - device is off or in reboot?");
    }

    setTimeout(setupMonitoringLoop, 4000);
  }, [initSetupFinal, initSetupStart, navigate, showSyncScreen]);

  useEffect(() => {
    setupMonitoringLoop();
  }, [setupMonitoringLoop]);

  const setupStart = async () => {
    try {
      const forceFreshSetup = setupPhase === SetupPhase.SETUP;
      const resp = await instance.post("/setup/setup-start-done", {
        hostname,
        forceFreshSetup,
        keepBlockchain,
        lightning,
        passwordA,
        passwordB,
        passwordC,
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
    setWaitScreenStatus(SetupStatus.WAIT);
    setWaitScreenMessage("");
    setPage(Screen.WAIT);

    try {
      await instance.get("/setup/shutdown");
    } catch {
      showError(
        "shutdown request failed - but that can also happen when shutdown happened",
      );
    }
  };

  const showError = (message: string) => {
    setWaitScreenStatus(SetupStatus.ERROR);
    setWaitScreenMessage(message);
    setPage(Screen.WAIT);
  };

  const callbackRecoveryDialog = (startRecovery: boolean) => {
    setPage(startRecovery ? Screen.INPUT_A : Screen.SETUP);
  };

  const callbackMigrationDialog = async (start: boolean) => {
    if (start) {
      setSetupPhase(SetupPhase.MIGRATION);
      setPage(Screen.INPUT_A);
    } else {
      await setupShutdown();
    }
  };

  const callbackSetupMenu = async (setupmode: SetupPhase) => {
    setSetupPhase(setupmode);

    switch (setupmode) {
      case SetupPhase.NULL:
        await setupShutdown();
        break;
      case SetupPhase.RECOVERY:
      case SetupPhase.UPDATE:
      case SetupPhase.MIGRATION:
        setPage(Screen.INPUT_A);
        break;
      case SetupPhase.SETUP:
        setPage(Screen.FORMAT);
        break;
    }
  };

  const callbackFormatDialog = (
    deleteData: boolean,
    keepBlockchainData: boolean,
  ) => {
    if (!deleteData) {
      setPage(Screen.SETUP);
      return;
    }

    setKeepBlockchain(keepBlockchainData);
    setPage(Screen.INPUT_NODENAME);
  };

  const callbackLightning = (lightning: SetupLightning) => {
    if (!lightning) {
      setPage(Screen.SETUP);
      return;
    }

    setLightning(lightning);
    setPage(Screen.INPUT_A);
  };

  const callbackInputNodename = (nodename: string | null) => {
    if (!nodename) {
      setPage(Screen.SETUP);
      return;
    }

    setHostname(nodename);
    setPage(Screen.LIGHTNING);
  };

  const checkPasswordCancel = (password: string | null): boolean => {
    if (!password) {
      setPage(Screen.SETUP);
      return true;
    }
    return false;
  };

  const callbackInputPasswordA = (password: string | null) => {
    if (checkPasswordCancel(password)) return;

    setPasswordA(password!);

    switch (setupPhase) {
      case SetupPhase.RECOVERY:
      case SetupPhase.UPDATE:
        setPage(Screen.START_DONE);
        break;
      case SetupPhase.SETUP:
      case SetupPhase.MIGRATION:
        setPage(Screen.INPUT_B);
        break;
      default:
        showError("unknown follow up state: passwordA");
    }
  };

  const callbackInputPasswordB = (password: string | null) => {
    if (checkPasswordCancel(password)) return;

    setPasswordB(password!);

    // based on setupPhase ... continue to a different next screen
    if (lightning === SetupLightning.NONE) {
      // without lightning no password c is needed - finish setup
      setPage(Screen.START_DONE);
      return;
    }

    setPage(Screen.INPUT_C);
  };

  const callbackInputPasswordC = (password: string | null) => {
    if (checkPasswordCancel(password)) return;

    setPasswordC(password!);
    setPage(Screen.START_DONE);
  };

  const callbackStartDoneDialog = async (cancel: boolean) => {
    if (cancel) {
      setPage(Screen.SETUP);
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

  switch (page) {
    case Screen.SETUP:
      return (
        <SetupMenu
          setupPhase={setupPhaseOnStart}
          callback={callbackSetupMenu}
        />
      );
    case Screen.START_DONE:
      return (
        <StartDoneDialog
          setupPhase={setupPhase}
          callback={callbackStartDoneDialog}
        />
      );
    case Screen.FORMAT:
      return (
        <FormatDialog
          containsBlockchain={gotBlockchain}
          callback={callbackFormatDialog}
        />
      );
    case Screen.RECOVERY:
      return (
        <RecoveryDialog
          setupPhase={setupPhaseOnStart}
          callback={callbackRecoveryDialog}
        />
      );
    case Screen.MIGRATION:
      return (
        <MigrationDialog
          migrationOS={migrationOS}
          migrationMode={migrationMode}
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
          setupPhase={setupPhase}
          seedWords={seedWords}
          callback={setupFinalReboot}
        />
      );
    case Screen.SYNC:
      return <SyncScreen data={syncData} callback={callbackSyncScreen} />;
    case Screen.WAIT:
    default:
      return (
        <WaitScreen status={waitScreenStatus} message={waitScreenMessage} />
      );
  }
}
