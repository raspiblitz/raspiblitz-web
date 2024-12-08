import type { AxiosError } from "axios";
import { t } from "i18next";

export interface ApiError {
	detail: string | ApiErrorDetails | ApiErrorDetails[];
}

export interface ApiErrorDetails {
	loc: string[];
	msg: string;
	type: string;
	ctx: unknown;
}

/**
 * Checks for the error message. Inconsistency in getting the actual error will be fixed with
 * https://github.com/fusion44/blitz_api/issues/123
 * @returns The error with the translated prefix "An error occurred" (error text not yet translated)
 */
export function checkError(err: AxiosError<ApiError>): string {
	const responseData = err.response?.data;

	if (typeof responseData?.detail === "string") {
		return `${t("login.error")}: ${responseData.detail}`;
	}

	if (Array.isArray(responseData?.detail)) {
		return `${t("login.error")}: ${responseData?.detail[0].msg}`;
	}

	if (typeof responseData?.detail?.msg === "string") {
		return `${t("login.error")}: ${responseData.detail.msg}`;
	}

	return `${t("login.error")}: ${t("login.unknown_error", {
		code: err.response?.status,
		statusText: err.response?.statusText,
	})}`;
}
