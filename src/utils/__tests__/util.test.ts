import { retrieveSettings, SETTINGS_KEY, saveSettings } from "@/utils";

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
