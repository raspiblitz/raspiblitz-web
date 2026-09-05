import type { AxiosError } from "axios";
import { t } from "i18next";
import { isRecord } from "./guards";

export interface ApiError {
  detail: string;
  error_code?: string;
  report?: unknown;
  trace?: string[] | null;
}

/**
 * Returns the error's `detail` string with a translated prefix, or a generic
 * "unknown error" fallback when the response has no string detail.
 */
export function checkError(err: AxiosError<unknown>): string {
  const data = err.response?.data;
  const detail = isRecord(data) ? data.detail : undefined;

  if (typeof detail === "string") {
    return `${t("login.error")}: ${detail}`;
  }

  return `${t("login.error")}: ${t("login.unknown_error", {
    code: err.response?.status,
    statusText: err.response?.statusText,
  })}`;
}
