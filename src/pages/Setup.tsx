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

const Setup: FC = () => {
  console.log("Buildung Setup");

  // init with waiting screen
  const [html, setHtml] = useState(
    <WaitScreen status={SetupStatus.WAIT} message="" />
  );

  const setupPhaseOnStart = useRef(SetupPhase.NULL);
  const setupPhase = useRef(SetupPhase.NULL);
  const gotBlockchain = useRef(false);
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
        setHtml(
          <WaitScreen status={resp.data.state} message={resp.data.message} />
        );
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

      gotBlockchain.current = resp.data.hddGotBlockchain === "1";
      setupPhaseOnStart.current = resp.data.setupPhase;
      migrationOS.current = resp.data.hddGotMigrationData;
      migrationMode.current = resp.data.migrationMode;

      switch (resp.data.setupPhase) {
        case SetupPhase.RECOVERY:
          showRecoveryDialog();
          break;
        case SetupPhase.UPDATE:
          showRecoveryDialog();
          break;
        case SetupPhase.MIGRATION:
          showMigrationDialog();
          break;
        case SetupPhase.SETUP:
          showSetupMenu();
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
        forceFreshSetup: setupPhase.current === SetupPhase.SETUP,
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
        showFinalDialog();
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
    setHtml(<WaitScreen status={SetupStatus.WAIT} message="" />);
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
    setHtml(<WaitScreen status={SetupStatus.ERROR} message={message} />);
  };

  // ### RECOVERY DIALOG ###

  const showRecoveryDialog = () => {
    setHtml(
      <RecoveryDialog
        setupPhase={setupPhaseOnStart.current}
        callback={callbackRecoveryDialog}
      />
    );
  };

  const callbackRecoveryDialog = (startRecovery: boolean) => {
    if (startRecovery) {
      setupPhase.current = SetupPhase.RECOVERY;
      showInputPasswordA();
    } else {
      showSetupMenu();
    }
  };

  // ### MIGRATION DIALOG ###

  const showMigrationDialog = () => {
    setHtml(
      <MigrationDialog
        migrationOS={migrationOS.current}
        migrationMode={migrationMode.current}
        callback={callbackMigrationDialog}
      />
    );
  };

  const callbackMigrationDialog = (start: boolean) => {
    if (start) {
      setupPhase.current = SetupPhase.MIGRATION;
      showInputPasswordA();
    } else {
      setupSetupShutdown();
    }
  };

  // ### SETUP MENU ###

  const showSetupMenu = () => {
    setHtml(
      <SetupMenu
        setupPhase={setupPhaseOnStart.current}
        callback={callbackSetupMenu}
      />
    );
  };

  const callbackSetupMenu = (setupmode: SetupPhase) => {
    // remember what setup the user wants
    setupPhase.current = setupmode;

    // switch to the next screen based on user selection
    switch (setupmode) {
      case SetupPhase.NULL:
        setupSetupShutdown();
        break;
      case SetupPhase.RECOVERY:
        showInputPasswordA();
        break;
      case SetupPhase.UPDATE:
        showInputPasswordA();
        break;
      case SetupPhase.MIGRATION:
        showInputPasswordA();
        break;
      case SetupPhase.SETUP:
        showFormatDialog();
        break;
    }
  };

  // ### FORMAT DIALOG ###

  const showFormatDialog = () => {
    setHtml(
      <FormatDialog
        containsBlockchain={gotBlockchain.current}
        callback={callbackFormatDialog}
      />
    );
  };

  const callbackFormatDialog = (
    deleteData: boolean,
    keepBlockchainData: boolean
  ) => {
    // on cancel jump back to setup menu
    if (!deleteData) {
      showSetupMenu();
      return;
    }

    // store for later
    keepBlockchain.current = keepBlockchainData;

    // next step is always password A
    showInputNodename();
  };

  // ### INPUT NODENAME ###

  const showInputNodename = () => {
    setHtml(<InputNodename callback={callbackInputNodename} />);
  };

  const callbackInputNodename = (nodename: string | null) => {
    // on cancel jump back to setup menu
    if (!nodename) {
      showSetupMenu();
      return;
    }

    // store for later
    hostname.current = nodename;

    // next step is always password A
    showLightningDialog();
  };

  // ### LIGHTNING DIALOG ###

  const showLightningDialog = () => {
    setHtml(<LightningDialog callback={callbackLightningDialog} />);
  };

  const callbackLightningDialog = (lightningSelect: SetupLightning) => {
    // on cancel jump back to setup menu
    if (lightningSelect === SetupLightning.NULL) {
      showSetupMenu();
      return;
    }

    // store for later
    lightning.current = lightningSelect;

    // next step is always password A
    showInputPasswordA();
  };

  // ### INPUT PASSWORDS ###

  const showInputPasswordA = () => {
    setHtml(
      <InputPassword passwordType="a" callback={callbackInputPasswordA} />
    );
  };

  const callbackInputPasswordA = (password: string | null) => {
    // on cancel jump back to setup menu
    if (!password) {
      showSetupMenu();
      return;
    }

    // store password for later
    passwordA.current = password;

    // based on setupPhase ... continue to a different next screen
    console.log(setupPhase);
    if (setupPhase.current === SetupPhase.RECOVERY) {
      showStartDoneDialog();
      return;
    }
    if (setupPhase.current === SetupPhase.UPDATE) {
      showStartDoneDialog();
      return;
    }
    if (setupPhase.current === SetupPhase.SETUP) {
      showInputPasswordB();
      return;
    }
    if (setupPhase.current === SetupPhase.MIGRATION) {
      showInputPasswordB();
      return;
    }
    showError("unkown follow up state: passworda");
  };

  const showInputPasswordB = () => {
    setHtml(
      <InputPassword passwordType="b" callback={callbackInputPasswordB} />
    );
  };

  const callbackInputPasswordB = (password: string | null) => {
    // on cancel jump back to setup menu
    if (!password) {
      showSetupMenu();
      return;
    }

    // store password for later
    passwordB.current = password;

    // based on setupPhase ... continue to a different next screen
    if (lightning.current === SetupLightning.NONE) {
      // without lightning no password c is needed - finish setup
      showStartDoneDialog();
      return;
    }

    // all other cases - get password c
    showInputPasswordC();
  };

  const showInputPasswordC = () => {
    setHtml(
      <InputPassword passwordType="c" callback={callbackInputPasswordC} />
    );
  };

  const callbackInputPasswordC = (password: string | null) => {
    // on cancel jump back to setup menu
    if (!password) {
      showSetupMenu();
      return;
    }

    // store password for later
    passwordC.current = password;

    // now finish setup
    showStartDoneDialog();
  };

  // ### START DONE DIALOG ###

  const showStartDoneDialog = () => {
    setHtml(
      <StartDoneDialog
        setupPhase={setupPhase.current}
        callback={callbackStartDoneDialog}
      />
    );
  };

  const callbackStartDoneDialog = (cancel: boolean) => {
    // on cancel jump back to setup menu
    if (cancel) {
      showSetupMenu();
      return;
    }

    // no kick-off setup with all those data
    setupStart();
  };

  // ### START FINAL DIALOG ###

  const showFinalDialog = () => {
    setHtml(
      <FinalDialog
        setupPhase={setupPhase.current}
        seedWords={seedWords.current}
        callback={callbackFinalDialog}
      />
    );
  };

  const callbackFinalDialog = () => {
    setupFinalReboot();
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
      setHtml(<SyncScreen data={resp.data} callback={callbackSyncScreen} />);
    }
  };

  const callbackSyncScreen = (action: string, data: any) => {
    if (action === "shutdown") {
      setupSystemShutdown();
    }
  };

  return html;
};

export default Setup;
