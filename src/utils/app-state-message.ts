import type {
  AppQueryError,
  AppStateUpdateMessage,
  AppStatus,
  AppStatusQueryResponse,
} from "@/models/app-status";
import { isAppId } from "@/models/app-status";
import { isNullableBoolean, isNullableString, isRecord } from "@/utils/guards";

function isAppStatus(value: unknown): value is AppStatus {
  if (!isRecord(value)) return false;

  return (
    isAppId(value.id) &&
    isNullableString(value.version) &&
    typeof value.installed === "boolean" &&
    typeof value.configured === "boolean" &&
    typeof value.status === "string" &&
    isNullableString(value.local_ip) &&
    isNullableString(value.http_port) &&
    isNullableString(value.https_port) &&
    isNullableBoolean(value.https_forced) &&
    isNullableBoolean(value.https_self_signed) &&
    isNullableString(value.hidden_service) &&
    isNullableString(value.address) &&
    isNullableString(value.auth_method) &&
    isNullableString(value.error)
  );
}

function isAppQueryError(value: unknown): value is AppQueryError {
  return isRecord(value) && isAppId(value.id) && typeof value.error === "string";
}

function parseAppStatusQueryResponse(value: unknown): AppStatusQueryResponse | null {
  if (!isRecord(value) || !Array.isArray(value.data) || !Array.isArray(value.errors)) {
    return null;
  }

  // A newer backend may know apps this WebUI cannot render yet. Keep valid
  // entries so one unsupported app does not prevent all status updates.
  return {
    data: value.data.filter(isAppStatus),
    errors: value.errors.filter(isAppQueryError),
    // AppStatusRefresh expects Unix seconds, not Date.now() milliseconds.
    timestamp:
      typeof value.timestamp === "number" && Number.isFinite(value.timestamp)
        ? value.timestamp
        : Math.floor(Date.now() / 1000),
  };
}

export function parseAppStateUpdateMessage(rawMessage: string): AppStateUpdateMessage | null {
  let value: unknown;

  try {
    value = JSON.parse(rawMessage);
  } catch {
    return null;
  }

  return parseAppStateUpdateValue(value);
}

export function parseAppStateUpdateValue(value: unknown): AppStateUpdateMessage | null {
  if (!isRecord(value)) return null;

  if (value.state === "initiated" || value.state === "finished") {
    return { state: value.state, message: null };
  }

  if (value.state === "success") {
    const message = parseAppStatusQueryResponse(value.message);
    if (message) return { state: value.state, message };
  }

  return null;
}
