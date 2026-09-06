import type { AppId } from "./app-status";

export type InstallMode = "on" | "off";
export type InstallState = "initiated" | "running" | "success" | "failure" | "finished";

export interface InstallationMessage {
  uid: string;
  id: AppId;
  mode: InstallMode;
  state: InstallState;
  error_id: string;
  message: string;
  timestamp: number; // Unix seconds (UTC), including fractional seconds for log ordering.
}

export interface InstallationStatus {
  [appId: string]: {
    mode: InstallMode;
    currentState: InstallState | "requested";
    messages: InstallationMessage[];
    inProgress: boolean;
    outcome: "pending" | "success" | "failure";
    errorId: string | null;
  };
}
