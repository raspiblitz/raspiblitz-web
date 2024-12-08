import { SETTINGS_KEY, retrieveSettings, saveSettings } from "@/utils";

describe("util", () => {
	beforeEach(() => {
		vi.spyOn(window.localStorage.__proto__, "setItem");
		window.localStorage.__proto__.setItem = vi.fn();

		vi.spyOn(window.localStorage.__proto__, "getItem");
		window.localStorage.__proto__.getItem = vi.fn(() => null);
	});

	test("saveSettings should save settings", () => {
		saveSettings({ lang: "de" });

		expect(localStorage.setItem).toHaveBeenCalledWith(
			SETTINGS_KEY,
			JSON.stringify({ lang: "de" }),
		);
	});

	test("saveSettings should save metge with existing settings", () => {
		window.localStorage.__proto__.getItem = vi.fn(() =>
			JSON.stringify({ lang: "en" }),
		);

		saveSettings({ lang: "de" });

		expect(localStorage.setItem).toHaveBeenCalledWith(
			SETTINGS_KEY,
			JSON.stringify({ lang: "de" }),
		);
	});

	test("retrieveSettings should retrieve settings if available", () => {
		window.localStorage.__proto__.getItem = vi.fn(() =>
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
