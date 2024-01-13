import { retrieveSettings, saveSettings, SETTINGS_KEY } from "@/utils";

describe("util", () => {
  beforeEach(() => {
    vi.spyOn(window.localStorage.__proto__, "setItem");
    window.localStorage.__proto__.setItem = vi.fn();

    vi.spyOn(window.localStorage.__proto__, "getItem");
    window.localStorage.__proto__.getItem = vi.fn(() => null);
  });

  test("saveSettings should save settings", () => {
    saveSettings({ darkMode: false, lang: "de" });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      SETTINGS_KEY,
      JSON.stringify({ darkMode: false, lang: "de" }),
    );
  });

  test("saveSettings should save metge with existing settings", () => {
    window.localStorage.__proto__.getItem = vi.fn(() =>
      JSON.stringify({ darkMode: true, lang: "en" }),
    );

    saveSettings({ lang: "de" });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      SETTINGS_KEY,
      JSON.stringify({ darkMode: true, lang: "de" }),
    );
  });

  test("retrieveSettings should retrieve settings if available", () => {
    window.localStorage.__proto__.getItem = vi.fn(() =>
      JSON.stringify({ darkMode: true, lang: "en" }),
    );

    const settings = retrieveSettings();

    expect(settings?.darkMode).toBeTruthy();
    expect(settings?.lang).toBe("en");
  });

  test("retrieveSettings should return null if not available", () => {
    const settings = retrieveSettings();

    expect(settings).toBeNull();
  });
});
