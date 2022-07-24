import { t } from "i18next";

/**
 * Checks for the error message. Inconsistency in getting the actual error will be fixed with
 * https://github.com/fusion44/blitz_api/issues/123
 * @returns The error with the translated prefix "An error occurred" (error text not yet translated)
 */
export function checkError(err: any): string {
  const responseData = err.response.data;

  if (typeof responseData?.detail === "string") {
    return `${t("login.error")}: ${responseData.detail}`;
  }

  if (typeof responseData?.detail?.msg === "string") {
    return `${t("login.error")}: ${responseData.detail.msg}`;
  }

  if (Array.isArray(responseData?.detail)) {
    return `${t("login.error")}: ${responseData.detail[0].msg}`;
  }

  return `${t("login.error")}: Unknown error`;
}
