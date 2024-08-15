import {
  Screen,
  SetupPhase,
  SetupState,
  SetupStatus,
} from "@/models/setup.model";
import { ACCESS_TOKEN } from "@/utils";
import { instance } from "@/utils/interceptor";
import { HttpStatusCode } from "axios";
import { NavigateFunction } from "react-router-dom";

type UpdateState = (newState: Partial<SetupState>) => void;

export function showError(message: string, updateState: UpdateState): void {
  updateState({
    waitScreenStatus: SetupStatus.ERROR,
    waitScreenMessage: message,
    page: Screen.WAIT,
  });
}

export async function setupMonitoringLoop(
  updateState: UpdateState,
  navigate: NavigateFunction,
): Promise<void> {
  try {
    const resp = await instance.get("/setup/status");

    if (resp.data.state === SetupStatus.WAITSETUP) {
      await initSetupStart(updateState);
      return;
    }

    if (resp.data.state === SetupStatus.WAITFINAL) {
      await initSetupFinal(updateState, navigate);
      return;
    }

    if (resp.data.state === SetupStatus.READY) {
      if (resp.data.initialsync === "running") {
        await showSyncScreen(updateState, navigate);
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
  } catch (error) {
    console.error("status request failed - device is off or in reboot?");
  }

  setTimeout(() => setupMonitoringLoop(updateState, navigate), 4000);
}

export async function initSetupStart(updateState: UpdateState): Promise<void> {
  try {
    const resp = await instance.get("/setup/setup-start-info");
    updateState({
      gotBlockchain: resp.data.hddGotBlockchain === "1",
      setupPhaseOnStart: resp.data.setupPhase,
      migrationOS: resp.data.hddGotMigrationData,
      migrationMode: resp.data.migrationMode,
      page: getInitialPage(resp.data.setupPhase, updateState),
    });
  } catch (error) {
    showError(`request for init setup data failed: ${error}`, updateState);
  }
}

export async function initSetupFinal(
  updateState: UpdateState,
  navigate: NavigateFunction,
): Promise<void> {
  try {
    const resp = await instance.get("/setup/setup-final-info");
    updateState({
      seedWords: resp.data?.seedwordsNEW || null,
      page: Screen.FINAL,
    });
  } catch (err) {
    const error = err as { response: { status: number } };
    if (
      error.response &&
      [HttpStatusCode.Forbidden, HttpStatusCode.Unauthorized].includes(
        error.response.status,
      )
    ) {
      navigate("/login?back=/setup");
    } else {
      showError(
        `request for setup start failed: ${error.response?.status}`,
        updateState,
      );
    }
  }
}

export async function setupStart(
  state: SetupState,
  updateState: UpdateState,
  navigate: NavigateFunction,
): Promise<void> {
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

    if (resp.data) {
      localStorage.setItem(ACCESS_TOKEN, resp.data.access_token || resp.data);
    }

    await setupMonitoringLoop(updateState, navigate);
  } catch (error) {
    showError("request for setup start failed", updateState);
  }
}

export async function setupFinalReboot(
  updateState: UpdateState,
  navigate: NavigateFunction,
): Promise<void> {
  try {
    await instance.post("/setup/setup-final-done", {});
    await setupMonitoringLoop(updateState, navigate);
  } catch (err) {
    const error = err as { response: { status: number } };
    if (
      error.response &&
      [HttpStatusCode.Forbidden, HttpStatusCode.Unauthorized].includes(
        error.response.status,
      )
    ) {
      navigate("/login?back=/setup");
    } else {
      showError(
        `request for final setup done failed: ${error.response?.status}`,
        updateState,
      );
    }
  }
}

export async function setupShutdown(updateState: UpdateState): Promise<void> {
  updateState({
    waitScreenStatus: SetupStatus.WAIT,
    waitScreenMessage: "",
    page: Screen.WAIT,
  });

  try {
    await instance.get("/setup/shutdown");
  } catch (error) {
    showError(
      "shutdown request failed - but that can also happen when shutdown happened",
      updateState,
    );
  }
}

function getInitialPage(
  setupPhase: SetupPhase,
  updateState: UpdateState,
): Screen {
  switch (setupPhase) {
    case SetupPhase.RECOVERY:
    case SetupPhase.UPDATE:
      return Screen.RECOVERY;
    case SetupPhase.MIGRATION:
      return Screen.MIGRATION;
    case SetupPhase.SETUP:
      return Screen.SETUP;
    default:
      showError("unknown setup phase on init", updateState);
      return Screen.WAIT;
  }
}

async function showSyncScreen(
  updateState: UpdateState,
  navigate: NavigateFunction,
): Promise<void> {
  try {
    const resp = await instance.post("/setup/setup-sync-info", {});
    updateState({
      syncData: resp.data,
      page: Screen.SYNC,
    });
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
}
