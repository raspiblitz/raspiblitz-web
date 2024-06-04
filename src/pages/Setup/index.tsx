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
import { ACCESS_TOKEN } from "@/utils";
import { instance } from "@/utils/interceptor";
import { HttpStatusCode } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

enum Screen {
  WAIT,
  START_DONE,
  FORMAT,
  SETUP,
  LIGHTNING,
  INPUT_A,
  INPUT_B,
  INPUT_C,
  INPUT_NODENAME,
  RECOVERY,
  MIGRATION,
  FINAL,
  SYNC,
}

export default function Setup() {
  // init with waiting screen
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
  const [seedwords, setSeedwords] = useState("");

  const navigate = useNavigate();

  // ### SYNC SCREEN ###
  const showSyncScreen = useCallback(async () => {
    // call API to start recovery
    const resp = await instance
      .post("/setup/setup-sync-info", {})
      .catch((err) => {
        if (
          err.response.status === HttpStatusCode.Unauthorized ||
          err.response.status === HttpStatusCode.Forbidden
        ) {
          navigate("/login?back=/setup");
        } else {
          console.error(`request for sync failed: ${err.response.status}`);
        }
      });
    if (resp) {
      setSyncData(resp.data);
      setPage(Screen.SYNC);
    }
  }, [navigate]);

  // prepare for first round of user interaction dialogs
  const initSetupStart = useCallback(async () => {
    const resp = await instance
      .get("/setup/setup-start-info")
      .catch((error) =>
        showError(`request for init setup data failed: ${error}`),
      );

    if (resp) {
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
          showError("unkown setupphase on init");
      }
    }
  }, []);

  // prepare for last round of user interaction dialogs
  const initSetupFinal = useCallback(async () => {
    const resp = await instance.get("/setup/setup-final-info").catch((err) => {
      if (
        err.response.status === HttpStatusCode.Forbidden ||
        err.response.status === HttpStatusCode.Unauthorized
      ) {
        navigate("/login?back=/setup");
      } else {
        showError(`request for setup start failed: ${err.response.status}`);
      }
    });
    if (resp) {
      console.info(resp);
      setSeedwords(resp.data.seedwordsNEW);
      setPage(Screen.FINAL);
    }
  }, [navigate]);

  // will loop pull status until user interaction is needed
  const setupMonitoringLoop = useCallback(async () => {
    try {
      // get state of node from API
      const resp = await instance.get("/setup/status");
      console.info(resp);

      // special cases for user interaction (exit loop)
      if (resp.data.state === SetupStatus.WAITSETUP) {
        initSetupStart();
        return;
      }

      if (resp.data.state === SetupStatus.WAITFINAL) {
        initSetupFinal();
        return;
      }

      if (resp.data.state === SetupStatus.READY) {
        if (resp.data.initialsync === "running") {
          // initial sync still running
          showSyncScreen();
        } else {
          // ok ready & inital sync done -> go to dashboard
          console.info("READY --> DASHBOARD");
          navigate("/");
          return;
        }
      } else {
        // update waiting screen
        setWaitScreenStatus(resp.data.state);
        setWaitScreenMessage(resp.data.message);
        setPage(Screen.WAIT);
      }
    } catch {
      console.error("status request failed - device is off or in reboot?");
    }

    // loop poll
    setTimeout(() => {
      setupMonitoringLoop();
    }, 4000);
  }, [initSetupFinal, initSetupStart, navigate, showSyncScreen]);

  // will be called when component ready
  useEffect(() => {
    console.info(`kick-off monitoring loop: ${new Date().toISOString()}`);
    setupMonitoringLoop();
  }, [setupMonitoringLoop]);

  const setupStart = async () => {
    try {
      const forceFreshSetup = setupPhase === SetupPhase.SETUP;
      // call API to start recovery
      const resp = await instance.post("/setup/setup-start-done", {
        hostname,
        forceFreshSetup,
        keepBlockchain,
        lightning,
        passwordA,
        passwordB,
        passwordC,
      });

      // remember authorization for later API calls
      if (resp) {
        // access_token was used in v1.8
        localStorage.setItem(ACCESS_TOKEN, resp.data.access_token || resp.data);
      }

      // fall back to loop polling until setup finished
      setupMonitoringLoop();
    } catch {
      showError("request for setup start failed");
    }
  };

  // kick-off final reboot
  const setupFinalReboot = async () => {
    try {
      // call API to start recovery
      await instance.post("/setup/setup-final-done", {}).catch((err) => {
        if (
          err.response.status === HttpStatusCode.Forbidden ||
          err.response.status === HttpStatusCode.Unauthorized
        ) {
          navigate("/login?back=/setup");
        } else {
          showError(
            `request for final setup done failed: ${err.response.status}`,
          );
        }
      });

      // fall back to loop polling until setup finished
      setupMonitoringLoop();
    } catch {
      showError(
        "reboot request failed - but that can also happen when shutdown happened",
      );
    }
  };

  // start setup shutdown (if user wants to cancel whole setup)
  const setupShutdown = async () => {
    setWaitScreenStatus(SetupStatus.WAIT);
    setWaitScreenMessage("");
    setPage(Screen.WAIT);

    await instance.get("/setup/shutdown").catch(() => {
      showError(
        "shutdown request failed - but that can also happen when shutdown happened",
      );
    });
  };

  const showError = (message: string) => {
    setWaitScreenStatus(SetupStatus.ERROR);
    setWaitScreenMessage(message);
    setPage(Screen.WAIT);
  };

  const callbackRecoveryDialog = (startRecovery: boolean) => {
    if (startRecovery) {
      setSetupPhase(setupPhaseOnStart);
      setPage(Screen.INPUT_A);
    } else {
      setPage(Screen.SETUP);
    }
  };

  const callbackMigrationDialog = (start: boolean) => {
    if (start) {
      setSetupPhase(SetupPhase.MIGRATION);
      setPage(Screen.INPUT_A);
    } else {
      setupShutdown();
    }
  };

  const callbackSetupMenu = (setupmode: SetupPhase) => {
    // remember what setup the user wants
    setSetupPhase(setupmode);

    // switch to the next screen based on user selection
    switch (setupmode) {
      case SetupPhase.NULL:
        setupShutdown();
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
    // on cancel jump back to setup menu
    if (!deleteData) {
      setPage(Screen.SETUP);
      return;
    }

    // store for later
    setKeepBlockchain(keepBlockchainData);

    // next step is always password A
    setPage(Screen.INPUT_NODENAME);
  };

  const callbackLightning = (lightning: SetupLightning) => {
    if (!lightning) {
      setPage(Screen.SETUP);
      return;
    }

    // store for later
    setLightning(lightning);

    setPage(Screen.INPUT_A);
  };

  const callbackInputNodename = (nodename: string | null) => {
    // on cancel jump back to setup menu
    if (!nodename) {
      setPage(Screen.SETUP);
      return;
    }

    // store for later
    setHostname(nodename);

    setPage(Screen.LIGHTNING);
  };

  // on cancel jump back to setup menu
  const checkPasswordCancel = (password: string | null): boolean => {
    if (!password) {
      setPage(Screen.SETUP);
      return true;
    }
    return false;
  };

  const callbackInputPasswordA = (password: string | null) => {
    if (checkPasswordCancel(password)) {
      return;
    }

    // store password for later
    setPasswordA(password!);

    // based on setupPhase ... continue to a different next screen
    console.info(setupPhase);
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
        showError("unkown follow up state: passworda");
    }
  };

  const callbackInputPasswordB = (password: string | null) => {
    if (checkPasswordCancel(password)) {
      return;
    }

    // store password for later
    setPasswordB(password!);

    // based on setupPhase ... continue to a different next screen
    if (lightning === SetupLightning.NONE) {
      // without lightning no password c is needed - finish setup
      setPage(Screen.START_DONE);
      return;
    }

    // all other cases - get password c
    setPage(Screen.INPUT_C);
  };

  const callbackInputPasswordC = (password: string | null) => {
    if (checkPasswordCancel(password)) {
      return;
    }

    // store password for later
    setPasswordC(password!);

    // now finish setup
    setPage(Screen.START_DONE);
  };

  const callbackStartDoneDialog = (cancel: boolean) => {
    // on cancel jump back to setup menu
    if (cancel) {
      setPage(Screen.SETUP);
      return;
    }

    // no kick-off setup with all those data
    setupStart();
  };

  const callbackSyncScreen = async (action: string, data: any) => {
    if (action === "shutdown") {
      // start setup shutdown (if user wants to cancel whole setup)
      await instance.post("/system/shutdown").catch(() => {
        console.error(
          "shutdown request failed - but that can also happen when shutdown happened",
        );
      });
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
          seedWords={seedwords}
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
