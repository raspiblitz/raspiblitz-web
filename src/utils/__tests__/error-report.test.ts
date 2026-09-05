import { createErrorReport } from "../error-report";

describe("createErrorReport", () => {
  it("includes build context and hides the local origin", () => {
    const error = new Error("Failed at http://192.168.1.2/apps");
    error.stack = "Error at http://192.168.1.2/assets/chunk.js:1:2";

    const report = createErrorReport(error, undefined, {
      appVersion: "1.2.3",
      buildCommit: "abc123",
      language: "de",
      route: "/apps",
      userAgent: "Test Browser",
      origin: "http://192.168.1.2",
    });

    expect(report).toContain("Web version: 1.2.3");
    expect(report).toContain("Build commit: abc123");
    expect(report).toContain("<local-origin>/assets/chunk.js");
    expect(report).not.toContain("192.168.1.2");
  });
});
