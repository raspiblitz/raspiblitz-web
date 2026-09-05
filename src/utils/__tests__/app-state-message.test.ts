import { AppId } from "@/models/app-status";
import { parseAppStateUpdateMessage } from "../app-state-message";

const validStatus = {
  id: AppId.LNBITS,
  version: "1.0.0",
  installed: true,
  configured: true,
  status: "online",
};

describe("parseAppStateUpdateMessage", () => {
  afterEach(() => vi.useRealTimers());

  it("accepts a valid update", () => {
    const result = parseAppStateUpdateMessage(
      JSON.stringify({
        state: "success",
        message: { data: [validStatus], errors: [], timestamp: 123 },
      }),
    );

    expect(result?.message?.data).toEqual([validStatus]);
  });

  it.each([
    "not-json",
    JSON.stringify({ state: "success", message: { data: [{}] } }),
    JSON.stringify({ state: "success", message: { data: null, errors: [] } }),
    JSON.stringify({ state: "success", message: { data: [], errors: {} } }),
  ])("rejects malformed input", (message) => {
    expect(parseAppStateUpdateMessage(message)).toBeNull();
  });

  it("keeps valid entries when a newer backend includes unknown apps or malformed entries", () => {
    const knownError = { id: AppId.ELECTRS, error: "unavailable" };
    const result = parseAppStateUpdateMessage(
      JSON.stringify({
        state: "success",
        message: {
          data: [
            validStatus,
            { ...validStatus, id: "future-app" },
            null,
            { ...validStatus, installed: "yes" },
          ],
          errors: [knownError, { id: "future-app", error: "unavailable" }, null],
          timestamp: 123,
        },
      }),
    );

    expect(result?.message).toEqual({
      data: [validStatus],
      errors: [knownError],
      timestamp: 123,
    });
  });

  it.each([undefined, null, "invalid", "123"])(
    "uses Unix seconds when timestamp is %s",
    (timestamp) => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-09-05T12:00:00.999Z"));
      const result = parseAppStateUpdateMessage(
        JSON.stringify({
          state: "success",
          message: { data: [validStatus], errors: [], timestamp },
        }),
      );
      expect(result?.message?.timestamp).toBe(1788609600);
      expect(result?.message?.data).toEqual([validStatus]);
    },
  );

  it("falls back for a non-finite timestamp from JSON numeric overflow", () => {
    vi.useFakeTimers();
    vi.setSystemTime(123456);
    expect(
      parseAppStateUpdateMessage(
        '{"state":"success","message":{"data":[],"errors":[],"timestamp":1e400}}',
      )?.message?.timestamp,
    ).toBe(123);
  });

  it("accepts an update containing only unknown apps as an empty supported list", () => {
    expect(
      parseAppStateUpdateMessage(
        JSON.stringify({
          state: "success",
          message: {
            data: [{ ...validStatus, id: "future-app" }],
            errors: [],
            timestamp: 0,
          },
        }),
      )?.message,
    ).toEqual({ data: [], errors: [], timestamp: 0 });
  });

  it.each(["initiated", "finished"])("preserves the %s lifecycle event", (state) => {
    expect(parseAppStateUpdateMessage(JSON.stringify({ state }))).toEqual({
      state,
      message: null,
    });
  });
});

// blitz_api/app/apps/models.py and app/apps/impl/raspiblitz.py: shell values
// are converted to booleans/string ports; uninstalled apps retain null defaults.
describe("blitz-api app status contract", () => {
  it.each([
    "albyhub",
    "btcpayserver",
    "btc-rpc-explorer",
    "electrs",
    "jam",
    "lnbits",
    "mempool",
    "rtl",
    "thunderhub",
  ])("accepts the uninstalled status of %s", (id) => {
    const status = {
      id,
      version: null,
      installed: false,
      configured: false,
      status: "offline",
      local_ip: null,
      http_port: null,
      https_port: null,
      https_forced: null,
      https_self_signed: null,
      hidden_service: null,
      address: null,
      auth_method: null,
      details: null,
      error: null,
    };
    const message = { data: [status], errors: [], timestamp: 1788609600 };
    expect(
      parseAppStateUpdateMessage(JSON.stringify({ state: "success", message }))?.message,
    ).toEqual(message);
  });

  it("preserves installed app connection details and per-app errors", () => {
    const status = {
      id: "mempool",
      version: "3.2.1",
      installed: true,
      configured: true,
      status: "online",
      local_ip: "192.0.2.1",
      http_port: "4080",
      https_port: "4081",
      https_forced: true,
      https_self_signed: false,
      hidden_service: null,
      address: "https://192.0.2.1:4081",
      auth_method: "none",
      details: { isIndexed: "1", indexInfo: "done" },
      error: null,
    };
    const message = {
      data: [status],
      errors: [{ id: "electrs", error: "App status script execution failed." }],
      timestamp: 1788609600,
    };
    expect(
      parseAppStateUpdateMessage(JSON.stringify({ state: "success", message }))?.message,
    ).toEqual(message);
  });
});
