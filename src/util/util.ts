import { TokenPayload } from "../models/token";

export const ACCESS_TOKEN = "access_token";
// refresh 10min before expiry
export const REFRESH_TIME = (expiry: number) => expiry - Date.now() - 600_000;

const createModalRoot = () => {
  const modalRoot = document.createElement("div");
  modalRoot.setAttribute("id", "modal-root");
  document.body.appendChild(modalRoot);
  return modalRoot;
};

export const SETTINGS_KEY = "settings";
export const MODAL_ROOT =
  document.getElementById("modal-root") || createModalRoot();

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

export function parseJwt(token: string): TokenPayload {
  return JSON.parse(atob(token.split(".")[1]));
}

export function enableGutter(): void {
  document.documentElement.classList.add("scrollbar-stable");
}

export function disableGutter(): void {
  document.documentElement.classList.remove("scrollbar-stable");
}

export function setWindowAlias(nodeAlias: string | null): void {
  if (!nodeAlias) {
    document.title = "RaspiBlitz Web";
  } else {
    document.title = `RaspiBlitz - ${nodeAlias}`;
  }
}
