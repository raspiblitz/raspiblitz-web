import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FinalDialog from "../components/Setup/FinalDialog";
import FormatDialog from "../components/Setup/FormatDialog";
import InputNodename from "../components/Setup/InputNodename";
import InputPassword from "../components/Setup/InputPassword";
import LightningDialog from "../components/Setup/LightningDialog";
import MigrationDialog from "../components/Setup/MigrationDialog";
import RecoveryDialog from "../components/Setup/RecoveryDialog";
import SetupMenu from "../components/Setup/SetupMenu";
import StartDoneDialog from "../components/Setup/StartDoneDialog";
import SyncScreen from "../components/Setup/SyncScreen";
import WaitScreen from "../components/Setup/WaitScreen";
import {
  SetupLightning,
  SetupMigrationMode,
  SetupMigrationOS,
  SetupPhase,
  SetupStatus,
} from "../models/setup.model";
import { instance } from "../util/interceptor";

enum Screen {
  WAIT,
  START_DONE,
  FORMAT,
  SETUP,
  INPUTA,
  INPUTB,
  INPUTC,
  INPUT_NODENAME,
  RECOVERY,
  MIGRATION,
  FINAL,
  SYNC,
}

const Setup: FC = () => {
  console.log("Buildung Setup");

  // init with waiting screen
  const [page, setPage] = useState(Screen.WAIT);

  const [syncData, setSyncData] = useState(null);
  const [waitScreenStatus, setWaitScreenStatus] = useState(SetupStatus.WAIT);
  const [waitScreenMessage, setWaitScreenMessage] = useState("");

  const [setupPhaseOnStart, setSetupPhaseOnStart] = useState(SetupPhase.NULL);
  const [setupPhase, setSetupPhase] = useState(SetupPhase.NULL);
  const [gotBlockchain, setGotBlockchain] = useState(false);

  const keepBlockchain = useRef(true);
  const migrationOS = useRef(SetupMigrationOS.NULL);
  const migrationMode = useRef(SetupMigrationMode.NULL);
  const lightning = useRef(SetupLightning.NULL);
  const hostname = useRef("");
  const passwordA = useRef("");
  const passwordB = useRef("");
  const passwordC = useRef("");
  const seedWords = useRef("");

  const navigate = useNavigate();

  // will be called when component ready
  useEffect(() => {
    console.info("kick-off monitoring loop: " + Date.now());
    setupMonitoringLoop();
  }, []);

  // will loop pull status until user interaction is needed
  const setupMonitoringLoop = async () => {
    try {
      // get state of node from API
      const resp = await instance.get("/setup/status");
      console.log(resp);

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
        if (
          resp.data.initialsync !== "" &&
          resp.data.initialsync === "running"
        ) {
          // initial sync still running
          showSyncScreen();
        } else {
          // ok ready & inital sync done -> go to dashboard
          console.log("READY --> DASHBOARD");
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
      console.log("status request failed - device is off or in reboot?");
    }

    // loop poll
    setTimeout(() => {
      setupMonitoringLoop();
    }, 1200);
  };

  // prepare for first round of user interaction dialogs
  const initSetupStart = async () => {
    try {
      const resp = await instance.get("/setup/setup-start-info");
      console.log(resp);

      setGotBlockchain(resp.data.hddGotBlockchain === "1");
      setSetupPhaseOnStart(resp.data.setupPhase);
      migrationOS.current = resp.data.hddGotMigrationData;
      migrationMode.current = resp.data.migrationMode;

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
    } catch {
      showError("request for init setup data failed");
    }
  };

  const setupStart = async () => {
    try {
      // call API to start recovery
      const resp = await instance.post("/setup/setup-start-done", {
        hostname: hostname.current,
        forceFreshSetup: setupPhase === SetupPhase.SETUP,
        keepBlockchain: keepBlockchain.current,
        lightning: lightning.current,
        passwordA: passwordA.current,
        passwordB: passwordB.current,
        passwordC: passwordC.current,
      });

      // remember authorization for later API calls
      if (resp) {
        localStorage.setItem("access_token", resp.data.access_token);
      }

      // fall back to loop polling until setup finished
      setupMonitoringLoop();
    } catch {
      showError("request for setup start failed");
    }
  };

  // prepare for last round of user interaction dialogs
  const initSetupFinal = async () => {
    try {
      const resp = await instance
        .get("/setup/setup-final-info")
        .catch((err) => {
          if (err.response.status === 403) {
            navigate("/login?back=/setup");
          } else {
            showError(`request for setup start failed: ${err.response.status}`);
          }
        });
      if (resp) {
        console.log(resp);
        seedWords.current = resp.data.seedwordsNEW;
        setPage(Screen.FINAL);
      }
    } catch {
      showError("request for final setup data failed");
    }
  };

  // kick-off final reboot
  const setupFinalReboot = async () => {
    try {
      // call API to start recovery
      const resp = await instance
        .post("/setup/setup-final-done", {})
        .catch((err) => {
          if (err.response.status === 403) {
            navigate("/login?back=/setup");
          } else {
            showError(
              `request for final setup done failed: ${err.response.status}`
            );
          }
        });

      // fall back to loop polling until setup finished
      setupMonitoringLoop();
    } catch {
      showError(
        "reboot request failed - but that can also happen when shutdown happened"
      );
    }
  };

  // start setup shutdown (if user wants to cancel whole setup)
  const setupSetupShutdown = async () => {
    setWaitScreenStatus(SetupStatus.WAIT);
    setWaitScreenMessage("");
    setPage(Screen.WAIT);
    try {
      const resp = await instance.get("/setup/shutdown");
    } catch {
      showError(
        "shutdown request failed - but that can also happen when shutdown happened"
      );
    }
  };

  // start setup shutdown (if user wants to cancel whole setup)
  const setupSystemShutdown = async () => {
    try {
      const resp = await instance.post("/system/shutdown");
    } catch {
      console.log(
        "shutdown request failed - but that can also happen when shutdown happened"
      );
    }
  };

  // #######################
  // DIALOG LOGIC
  // #######################

  const showError = (message: string) => {
    setWaitScreenStatus(SetupStatus.ERROR);
    setWaitScreenMessage(message);
    setPage(Screen.WAIT);
  };

  const callbackRecoveryDialog = (startRecovery: boolean) => {
    if (startRecovery) {
      setSetupPhase(SetupPhase.RECOVERY);
      setPage(Screen.INPUTA);
    } else {
      setPage(Screen.SETUP);
    }
  };

  const callbackMigrationDialog = (start: boolean) => {
    if (start) {
      setSetupPhase(SetupPhase.MIGRATION);
      setPage(Screen.INPUTA);
    } else {
      setupSetupShutdown();
    }
  };

  const callbackSetupMenu = (setupmode: SetupPhase) => {
    // remember what setup the user wants
    setSetupPhase(setupmode);

    // switch to the next screen based on user selection
    switch (setupmode) {
      case SetupPhase.NULL:
        setupSetupShutdown();
        break;
      case SetupPhase.RECOVERY:
        setPage(Screen.INPUTA);
        break;
      case SetupPhase.UPDATE:
        setPage(Screen.INPUTA);
        break;
      case SetupPhase.MIGRATION:
        setPage(Screen.INPUTA);
        break;
      case SetupPhase.SETUP:
        setPage(Screen.FORMAT);
        break;
    }
  };

  const callbackFormatDialog = (
    deleteData: boolean,
    keepBlockchainData: boolean
  ) => {
    // on cancel jump back to setup menu
    if (!deleteData) {
      setPage(Screen.SETUP);
      return;
    }

    // store for later
    keepBlockchain.current = keepBlockchainData;

    // next step is always password A
    setPage(Screen.INPUT_NODENAME);
  };

  const callbackInputNodename = (nodename: string | null) => {
    // on cancel jump back to setup menu
    if (!nodename) {
      setPage(Screen.SETUP);
      return;
    }

    // store for later
    hostname.current = nodename;

    // next step is always password A
    showLightningDialog();
  };

  // ### LIGHTNING DIALOG ###

  const showLightningDialog = () => {
    // TODO: Once WebUi can support c-lightning or run without Lighting
    // show this dialog - until then fix selection to LND
    // setHtml(<LightningDialog callback={callbackLightningDialog} />);
    callbackLightningDialog(SetupLightning.LND);
  };

  const callbackLightningDialog = (lightningSelect: SetupLightning) => {
    // on cancel jump back to setup menu
    if (lightningSelect === SetupLightning.NULL) {
      setPage(Screen.SETUP);
      return;
    }

    // store for later
    lightning.current = lightningSelect;

    // next step is always password A
    setPage(Screen.INPUTA);
  };

  // ### INPUT PASSWORDS ###

  const callbackInputPasswordA = (password: string | null) => {
    // on cancel jump back to setup menu
    if (!password) {
      setPage(Screen.SETUP);
      return;
    }

    // store password for later
    passwordA.current = password;

    // based on setupPhase ... continue to a different next screen
    console.log(setupPhase);
    if (setupPhase === SetupPhase.RECOVERY) {
      setPage(Screen.START_DONE);
      return;
    }
    if (setupPhase === SetupPhase.UPDATE) {
      setPage(Screen.START_DONE);
      return;
    }
    if (setupPhase === SetupPhase.SETUP) {
      setPage(Screen.INPUTB);
      return;
    }
    if (setupPhase === SetupPhase.MIGRATION) {
      setPage(Screen.INPUTB);
      return;
    }
    showError("unkown follow up state: passworda");
  };

  const callbackInputPasswordB = (password: string | null) => {
    // on cancel jump back to setup menu
    if (!password) {
      setPage(Screen.SETUP);
      return;
    }

    // store password for later
    passwordB.current = password;

    // based on setupPhase ... continue to a different next screen
    if (lightning.current === SetupLightning.NONE) {
      // without lightning no password c is needed - finish setup
      setPage(Screen.START_DONE);
      return;
    }

    // all other cases - get password c
    setPage(Screen.INPUTC);
  };

  const callbackInputPasswordC = (password: string | null) => {
    // on cancel jump back to setup menu
    if (!password) {
      setPage(Screen.SETUP);
      return;
    }

    // store password for later
    passwordC.current = password;

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

  // ### SYNC SCREEN ###

  const showSyncScreen = async () => {
    // call API to start recovery
    const resp = await instance
      .post("/setup/setup-sync-info", {})
      .catch((err) => {
        if (err.response.status === 403) {
          navigate("/login?back=/setup");
        } else {
          console.log(`request for sync failed: ${err.response.status}`);
        }
      });
    if (resp) {
      setSyncData(resp.data);
      setPage(Screen.SYNC);
    }
  };

  const callbackSyncScreen = (action: string, data: any) => {
    if (action === "shutdown") {
      setupSystemShutdown();
    }
  };

  switch (page) {
    case Screen.WAIT:
      return (
        <WaitScreen status={waitScreenStatus} message={waitScreenMessage} />
      );
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
          migrationOS={migrationOS.current}
          migrationMode={migrationMode.current}
          callback={callbackMigrationDialog}
        />
      );
    case Screen.INPUTA:
      return (
        <InputPassword passwordType="a" callback={callbackInputPasswordA} />
      );
    case Screen.INPUTB:
      return (
        <InputPassword passwordType="b" callback={callbackInputPasswordB} />
      );
    case Screen.INPUTC:
      return (
        <InputPassword passwordType="c" callback={callbackInputPasswordC} />
      );
    case Screen.INPUT_NODENAME:
      return <InputNodename callback={callbackInputNodename} />;
    case Screen.FINAL:
      return (
        <FinalDialog
          setupPhase={setupPhase}
          seedWords={seedWords.current}
          callback={setupFinalReboot}
        />
      );
    case Screen.SYNC:
      return <SyncScreen data={syncData} callback={callbackSyncScreen} />;
    default:
      return <div></div>;
  }
};

export default Setup;
