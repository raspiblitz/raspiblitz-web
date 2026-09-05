import { AxiosError, AxiosHeaders } from "axios";
import i18next from "i18next";
import en from "@/i18n/langs/en.json";
import { type ApiError, checkError } from "../checkError";

beforeAll(async () => {
  await i18next.init({ lng: "en", resources: { en }, interpolation: { escapeValue: false } });
});

function responseError(data: unknown): AxiosError<unknown> {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", config, undefined, {
    data,
    status: 404,
    statusText: "Not found",
    headers: new AxiosHeaders(),
    config,
  });
}

describe("checkError", () => {
  it("shows the string detail with a translated prefix", () => {
    const data: ApiError = {
      detail: "old password format invalid",
      error_code: "invalid_password",
      report: null,
      trace: null,
    };
    expect(checkError(responseError(data))).toBe("An error occurred: old password format invalid");
  });

  it.each([
    undefined,
    null,
    "Bad gateway",
    [],
    {},
    { detail: undefined },
    { detail: null },
    { detail: 123 },
    { detail: false },
    { detail: {} },
    { detail: { msg: "legacy message" } },
    { detail: [] },
    { detail: [{ msg: "legacy message" }] },
  ])("falls back with HTTP status for invalid response data: %j", (data) => {
    expect(checkError(responseError(data))).toBe(
      "An error occurred: Unknown error. The response was: 404 Not found.",
    );
  });

  it("falls back when a network error has no response", () => {
    const error = new AxiosError("Network Error", "ERR_NETWORK");
    expect(checkError(error)).toBe(
      "An error occurred: Node unreachable. Check your connection and try again.",
    );
  });

  it.each([new Error("Unexpected failure"), null, undefined, "failure"])(
    "handles non-Axios errors without reporting a connection problem: %j",
    (error) => {
      expect(checkError(error)).toBe(
        "An error occurred: An unexpected error occurred. Please try again.",
      );
    },
  );
});
