export enum InstallState {
  INITIATED = "initiated", // start message
  RUNNING = "running", // message during installation
  SUCCESS = "success", // message with OK result
  FAILURE = "failure", // message with error result
  FINISHED = "finished", // end message when installation has concluded
}

export interface InstallationMessage {
  id: string;
  mode: string;
  state: string;
  error_id: string;
  message?: string;
  timestamp?: number; // Added for sorting/display
}

export interface InstallationStatus {
  [appId: string]: {
    currentState: string;
    messages: InstallationMessage[];
    inProgress: boolean;
    errorId: string | null;
  };
}
