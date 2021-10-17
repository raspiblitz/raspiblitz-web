export const SETTINGS_KEY = 'settings';
export const MODAL_ROOT = document.getElementById('modal-root')!;

export interface SavedSettings {
  lang: string;
  darkMode: boolean;
}

/**
 * merges previous with new settings and saves it to local storage
 */
export function saveSettings(settings: Partial<SavedSettings>): void {
  const prevSettings = retrieveSettings();

  const newSettings = {
    ...prevSettings,
    ...settings,
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
}

/**
 * Retrieves settings from local storage and parses them into a {@link SavedSettings} object.
 * @returns saved settings if they exist or null
 */
export function retrieveSettings(): SavedSettings | null {
  const settingString = localStorage.getItem(SETTINGS_KEY);
  if (settingString) {
    const settings: SavedSettings = JSON.parse(settingString);
    return settings;
  }

  return null;
}

/**
 * Checks if any prop value is null or undefined
 * @param props the props object
 * @returns if any property in the props object is null or undefined
 */
export function checkPropsUndefined(props: object): boolean {
  let someUndefined = false;
  Object.values(props).forEach((prop) => {
    if (prop === null || prop === undefined) {
      someUndefined = true;
    }
  });
  return someUndefined;
}
