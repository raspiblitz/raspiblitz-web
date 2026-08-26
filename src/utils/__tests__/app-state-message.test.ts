import { AppId } from "@/models/app-status";
import { parseAppStateUpdateMessage } from "../app-state-message";

const validStatus = {
  id: AppId.LNBITS,
  version: "1.0.0",
  installed: true,
  configured: true,
  status: "running",
};

describe("parseAppStateUpdateMessage", () => {
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
    JSON.stringify({
      state: "success",
      message: {
        data: [{ ...validStatus, id: "unknown-app" }],
        errors: [],
        timestamp: 123,
      },
    }),
  ])("rejects malformed input", (message) => {
    expect(parseAppStateUpdateMessage(message)).toBeNull();
  });
});
