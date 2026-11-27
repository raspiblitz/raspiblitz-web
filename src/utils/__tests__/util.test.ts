import { AppId, type AppStatus } from "@/models/app-status";
import {
  getHrefFromApp,
  retrieveSettings,
  SETTINGS_KEY,
  saveSettings,
} from "@/utils";

describe("installed app links", () => {
  const rtl: AppStatus = {
    id: AppId.RTL,
    installed: true,
    configured: true,
    version: null,
    status: "online",
    address: "http://node.test:3000",
    https_port: "3001",
    auth_method: "/rtl",
  };
  const https = new URL("https://node.test/home");
  const http = new URL("http://node.test/home");

  it("selects the advertised local endpoint for each dashboard protocol", () => {
    expect(getHrefFromApp(rtl, https)).toBe("https://node.test:3001/rtl");
    expect(getHrefFromApp(rtl, http)).toBe("http://node.test:3000/rtl");
    expect(
      getHrefFromApp(
        {
          ...rtl,
          address: "http://[::1]:3010",
          https_port: "3011",
          auth_method: null,
        },
        https,
      ),
    ).toBe("https://[::1]:3011/");
  });
  it("preserves HTTPS-only and HTTP-only app endpoints", () => {
    expect(
      getHrefFromApp(
        { ...rtl, address: "https://node.test:5001", https_forced: true },
        http,
      ),
    ).toBe("https://node.test:5001/rtl");
    expect(getHrefFromApp({ ...rtl, https_forced: true }, http)).toBe(
      "https://node.test:3001/rtl",
    );
    expect(
      getHrefFromApp({ ...rtl, https_forced: true, https_port: null }, http),
    ).toBeUndefined();
    expect(getHrefFromApp({ ...rtl, https_port: null }, https)).toBe(
      "http://node.test:3000/rtl",
    );
  });
  it("uses only the hidden service on an onion dashboard", () => {
    const tor = new URL("http://dashboard.onion");
    expect(getHrefFromApp({ ...rtl, hidden_service: "app.onion" }, tor)).toBe(
      "https://app.onion/rtl",
    );
    expect(getHrefFromApp(rtl, tor)).toBeUndefined();
    expect(
      getHrefFromApp({ ...rtl, hidden_service: "node.test" }, tor),
    ).toBeUndefined();
  });
  it("ignores missing, malformed and unsupported endpoints", () => {
    for (const address of [
      null,
      "invalid",
      "file:///tmp/rtl",
      "https://user@node.test",
    ]) {
      expect(getHrefFromApp({ ...rtl, address }, https)).toBeUndefined();
    }
    expect(
      getHrefFromApp({ ...rtl, https_port: "65536" }, https),
    ).toBeUndefined();
  });
});

describe("util", () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("saveSettings should save settings", () => {
    saveSettings({ lang: "de" });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      SETTINGS_KEY,
      JSON.stringify({ lang: "de" }),
    );
  });

  test("saveSettings should save metge with existing settings", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify({ lang: "en" }),
    );

    saveSettings({ lang: "de" });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      SETTINGS_KEY,
      JSON.stringify({ lang: "de" }),
    );
  });

  test("retrieveSettings should retrieve settings if available", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify({ lang: "en" }),
    );

    const settings = retrieveSettings();

    expect(settings?.lang).toBe("en");
  });

  test("retrieveSettings should return null if not available", () => {
    const settings = retrieveSettings();

    expect(settings).toBeNull();
  });
});
