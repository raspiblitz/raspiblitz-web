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
  return (
    isRecord(value) && isAppId(value.id) && typeof value.error === "string"
  );
}

function isAppStatusQueryResponse(
  value: unknown,
): value is AppStatusQueryResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.data) &&
    value.data.every(isAppStatus) &&
    Array.isArray(value.errors) &&
    value.errors.every(isAppQueryError) &&
    typeof value.timestamp === "number" &&
    Number.isFinite(value.timestamp)
  );
}

export function parseAppStateUpdateMessage(
  rawMessage: string,
): AppStateUpdateMessage | null {
  let value: unknown;

  try {
    value = JSON.parse(rawMessage);
  } catch {
    return null;
  }

  if (!isRecord(value)) return null;

  if (value.state === "initiated" || value.state === "finished") {
    return { state: value.state, message: null };
  }

  if (value.state === "success" && isAppStatusQueryResponse(value.message)) {
    return { state: value.state, message: value.message };
  }

  return null;
}
