import type { InstallationMessage, InstallationStatus } from "@/models/installation-status";
import { isAppId } from "@/utils/availableApps";
import { isRecord } from "@/utils/guards";

// Local sequence also works on nodes served over plain HTTP (no secure-context API needed).
let messageSequence = 0;

export function parseInstallationMessage(value: unknown): InstallationMessage | null {
  if (
    !isRecord(value) ||
    !isAppId(value.id) ||
    (value.mode !== "on" && value.mode !== "off") ||
    (value.state !== "initiated" &&
      value.state !== "running" &&
      value.state !== "success" &&
      value.state !== "failure" &&
      value.state !== "finished")
  )
    return null;

  let message = "";
  let errorId = typeof value.error_id === "string" ? value.error_id : "none";
  if (typeof value.message === "string") {
    message = value.message;
  } else if (value.message != null) {
    if (!isRecord(value.message) || typeof value.message.detail !== "string") return null;
    message = value.message.detail;
    if (typeof value.message.error_code === "string" && value.message.error_code) {
      errorId = value.message.error_code;
    }
    if (value.message.report != null) {
      message += `\n${typeof value.message.report === "string" ? value.message.report : JSON.stringify(value.message.report, null, 2)}`;
    }
    if (
      Array.isArray(value.message.trace) &&
      value.message.trace.every((line) => typeof line === "string")
    ) {
      message += `\n${value.message.trace.join("\n")}`;
    }
  }
  return {
    id: value.id,
    mode: value.mode,
    state: value.state,
    message,
    error_id: errorId,
    timestamp: Date.now() / 1000,
    uid: `installation-${messageSequence++}`,
  };
}

export function applyInstallationMessage(
  previous: InstallationStatus,
  message: InstallationMessage,
): InstallationStatus {
  // A new attempt owns its own log and outcome; finished only ends the process.
  const existing = previous[message.id];
  const startsAttempt =
    message.state === "initiated" || (message.state === "running" && !existing?.inProgress);
  const old = startsAttempt ? undefined : existing;
  const errorId = message.error_id && message.error_id !== "none" ? message.error_id : null;
  const failed = old?.outcome === "failure" || message.state === "failure" || !!errorId;
  return {
    ...previous,
    [message.id]: {
      mode: message.mode,
      currentState: message.state,
      messages: [...(old?.messages ?? []), message],
      inProgress: message.state !== "finished",
      outcome: failed ? "failure" : message.state === "finished" ? "success" : "pending",
      errorId: errorId ?? old?.errorId ?? null,
    },
  };
}
