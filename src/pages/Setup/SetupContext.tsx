import type React from "react";
import { createContext, useCallback, useContext } from "react";
import type { NavigateFunction } from "react-router";
import {
  Screen,
  SetupLightning,
  SetupPhase,
  type SetupState,
} from "@/models/setup.model";
import {
  setupFinalReboot,
  setupShutdown,
  setupStart,
} from "@/pages/Setup/setup-functions";

interface SetupContextType {
  state: SetupState;
  updateState: (newState: Partial<SetupState>) => void;
  callbacks: {
    onRecoveryDialog: (startRecovery: boolean) => void;
    onMigrationDialog: (start: boolean) => Promise<void>;
    onSetupMenu: (setupmode: SetupPhase) => Promise<void>;
    onFormatDialog: (deleteData: boolean, keepBlockchainData: boolean) => void;
    onLightning: (lightning: SetupLightning) => void;
    onInputNodename: (nodename: string | null) => void;
    onInputPasswordA: (password: string | null) => void;
    onInputPasswordB: (password: string | null) => void;
    onInputPasswordC: (password: string | null) => void;
    onStartDoneDialog: (cancel: boolean) => Promise<void>;
    onSyncScreen: (action: string) => Promise<void>;
    onFinalReboot: () => Promise<void>;
  };
}

export interface Props {
  children: React.ReactNode;
  state: SetupState;
  updateState: (newState: Partial<SetupState>) => void;
  navigate: NavigateFunction;
}

const SetupContext = createContext<SetupContextType | undefined>(undefined);

export const useSetup = () => {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error("useSetup must be used within a SetupProvider");
  }
  return context;
};

export default function SetupProvider({
  children,
  state,
  updateState,
  navigate,
}: Props) {
  const callbacks = {
    onRecoveryDialog: useCallback(
      (startRecovery: boolean) => {
        updateState({ page: startRecovery ? Screen.INPUT_A : Screen.SETUP });
      },
      [updateState],
    ),

    onMigrationDialog: useCallback(
      async (start: boolean) => {
        if (start) {
          updateState({
            setupPhase: SetupPhase.MIGRATION,
            page: Screen.INPUT_A,
          });
        } else {
          await setupShutdown(updateState);
        }
      },
      [updateState],
    ),

    onSetupMenu: useCallback(
      async (setupmode: SetupPhase) => {
        updateState({ setupPhase: setupmode });
        switch (setupmode) {
          case SetupPhase.NULL:
            await setupShutdown(updateState);
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
      },
      [updateState],
    ),

    onFormatDialog: useCallback(
      (deleteData: boolean, keepBlockchainData: boolean) => {
        if (!deleteData) {
          updateState({ page: Screen.SETUP });
          return;
        }
        updateState({
          keepBlockchain: keepBlockchainData,
          page: Screen.INPUT_NODENAME,
        });
      },
      [updateState],
    ),

    onLightning: useCallback(
      (lightning: SetupLightning) => {
        if (lightning === SetupLightning.NULL) {
          updateState({ page: Screen.SETUP });
          return;
        }
        updateState({
          lightning,
          page: Screen.INPUT_A,
        });
      },
      [updateState],
    ),

    onInputNodename: useCallback(
      (nodename: string | null) => {
        if (!nodename) {
          updateState({ page: Screen.SETUP });
          return;
        }
        updateState({
          hostname: nodename,
          page: Screen.LIGHTNING,
        });
      },
      [updateState],
    ),

    onInputPasswordA: useCallback(
      (passwordA: string | null) => {
        if (!passwordA) {
          updateState({ page: Screen.SETUP });
          return;
        }
        updateState({ passwordA });
        switch (state.setupPhase) {
          case SetupPhase.RECOVERY:
          case SetupPhase.UPDATE:
            updateState({ page: Screen.START_DONE });
            break;
          case SetupPhase.SETUP:
          case SetupPhase.MIGRATION:
            updateState({ page: Screen.INPUT_B });
            break;
        }
      },
      [state, updateState],
    ),

    onInputPasswordB: useCallback(
      (passwordB: string | null) => {
        if (!passwordB) {
          updateState({ page: Screen.SETUP });
          return;
        }
        updateState({ passwordB });
        if (state.lightning === SetupLightning.NONE) {
          updateState({ page: Screen.START_DONE });
        } else {
          updateState({ page: Screen.INPUT_C });
        }
      },
      [state, updateState],
    ),

    onInputPasswordC: useCallback(
      (passwordC: string | null) => {
        if (!passwordC) {
          updateState({ page: Screen.SETUP });
          return;
        }
        updateState({
          passwordC,
          page: Screen.START_DONE,
        });
      },
      [updateState],
    ),

    onStartDoneDialog: useCallback(
      async (cancel: boolean) => {
        if (cancel) {
          updateState({ page: Screen.SETUP });
          return;
        }
        await setupStart(state, updateState, navigate);
      },
      [navigate, state, updateState],
    ),

    onSyncScreen: useCallback(
      async (action: string) => {
        if (action === "shutdown") {
          try {
            await setupShutdown(updateState);
          } catch (error) {
            console.error("Shutdown request failed", error);
          }
        }
      },
      [updateState],
    ),

    onFinalReboot: useCallback(async () => {
      await setupFinalReboot(updateState, navigate);
    }, [updateState, navigate]),
  };

  return (
    <SetupContext.Provider value={{ state, updateState, callbacks }}>
      {children}
    </SetupContext.Provider>
  );
}
