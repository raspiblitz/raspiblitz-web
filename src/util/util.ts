export function saveSettings(settings: Partial<SavedSettings>): void {
  const prevSettings = retrieveSettings();

  const newSettings = {
    ...prevSettings,
    ...settings
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
}

export function retrieveSettings(): SavedSettings | null {
  const settings = localStorage.getItem(SETTINGS_KEY);
  if (settings) {
    const bla: SavedSettings = JSON.parse(settings);
    return bla;
  }

  return null;
}

export const SETTINGS_KEY = 'settings';

export interface SavedSettings {
  lang: string;
  darkMode: boolean;
}
