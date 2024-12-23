import { Screen } from "@/models/setup.model";
import { useSetup } from "@/pages/Setup/SetupContext";
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

export default function SetupScreenRenderer() {
  const { state, callbacks } = useSetup();

  switch (state.page) {
    case Screen.SETUP:
      return (
        <SetupMenu
          setupPhase={state.setupPhaseOnStart}
          callback={callbacks.onSetupMenu}
        />
      );
    case Screen.START_DONE:
      return (
        <StartDoneDialog
          setupPhase={state.setupPhase}
          callback={callbacks.onStartDoneDialog}
        />
      );
    case Screen.FORMAT:
      return (
        <FormatDialog
          containsBlockchain={state.gotBlockchain}
          callback={callbacks.onFormatDialog}
        />
      );
    case Screen.RECOVERY:
      return (
        <RecoveryDialog
          setupPhase={state.setupPhaseOnStart}
          callback={callbacks.onRecoveryDialog}
        />
      );
    case Screen.MIGRATION:
      return (
        <MigrationDialog
          migrationOS={state.migrationOS}
          migrationMode={state.migrationMode}
          callback={callbacks.onMigrationDialog}
        />
      );
    case Screen.LIGHTNING:
      return <LightningDialog callback={callbacks.onLightning} />;
    case Screen.INPUT_A:
      return (
        <InputPassword passwordType="a" callback={callbacks.onInputPasswordA} />
      );
    case Screen.INPUT_B:
      return (
        <InputPassword passwordType="b" callback={callbacks.onInputPasswordB} />
      );
    case Screen.INPUT_C:
      return (
        <InputPassword passwordType="c" callback={callbacks.onInputPasswordC} />
      );
    case Screen.INPUT_NODENAME:
      return <InputNodeName callback={callbacks.onInputNodename} />;
    case Screen.FINAL:
      return (
        <FinalDialog
          setupPhase={state.setupPhase}
          seedWords={state.seedWords}
          callback={callbacks.onFinalReboot}
        />
      );
    case Screen.SYNC:
      return (
        <SyncScreen data={state.syncData} callback={callbacks.onSyncScreen} />
      );
    // case Screen.WAIT: UNUSED
    default:
      return (
        <WaitScreen
          status={state.waitScreenStatus}
          message={state.waitScreenMessage}
        />
      );
  }
}
