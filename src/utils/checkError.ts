import { isAxiosError } from "axios";
import { t } from "i18next";
import { isRecord } from "./guards";

export interface ApiError {
  detail: string;
  error_code?: string;
  report?: unknown;
  trace?: string[] | null;
}

/**
 * Returns a translated error message for API responses, unreachable nodes,
 * and unexpected failures. API details are displayed only when they are strings.
 */
export function checkError(err: unknown): string {
  if (!isAxiosError<unknown>(err)) {
    return `${t("login.error")}: ${t("login.unexpected_error")}`;
  }

  if (!err.response) {
    return `${t("login.error")}: ${t("login.node_unreachable")}`;
  }

  const data = err.response.data;
  const detail = isRecord(data) ? data.detail : undefined;

  if (typeof detail === "string") {
    return `${t("login.error")}: ${detail}`;
  }

  return `${t("login.error")}: ${t("login.unknown_error", {
    code: err.response.status,
    statusText: err.response.statusText,
  })}`;
}
