import type { AppStatus } from "@/models/app-status";
import type { TokenPayload } from "@/models/token";
import { isRecord } from "./guards";

export const ACCESS_TOKEN = "access_token";
// Refresh ten minutes early, or halfway through a shorter remaining lifetime.
// Reject unusable expiries and stay within the browser's signed 32-bit timer limit.
export function REFRESH_TIME(expSeconds: number): number | null {
  const remaining = expSeconds * 1000 - Date.now();
  if (!Number.isFinite(remaining) || remaining < 1000) {
    return null;
  }
  return Math.min(Math.max(remaining - 600_000, remaining / 2), 2_147_483_647);
}

const createModalRoot = () => {
  const modalRoot = document.createElement("div");
  modalRoot.setAttribute("id", "modal-root");
  document.body.appendChild(modalRoot);
  return modalRoot;
};

export const SETTINGS_KEY = "settings";
export const MODAL_ROOT = document.getElementById("modal-root") || createModalRoot();

export interface SavedSettings {
  lang: string;
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
    return JSON.parse(settingString);
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

/** Decode claims for client scheduling; signature verification belongs to the API. */
export function parseJwt(token: unknown): TokenPayload | null {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3 || parts.some((part) => !part)) return null;

  try {
    const decoded = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload: unknown = JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(
        Uint8Array.from(decoded, (char) => char.charCodeAt(0)),
      ),
    );
    if (
      !isRecord(payload) ||
      typeof payload.user_id !== "string" ||
      typeof payload.exp !== "number" ||
      !Number.isFinite(payload.exp) ||
      !Number.isFinite(payload.exp * 1000) ||
      payload.exp <= 0
    )
      return null;
    return { user_id: payload.user_id, exp: payload.exp };
  } catch {
    return null;
  }
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

export function getHrefFromApp(app: AppStatus) {
  const authUrl = app.auth_method?.startsWith("/") ? app.auth_method : "";
  return window.location.hostname.endsWith(".onion")
    ? `https://${app.hidden_service}${authUrl}` // add https prefix to hidden service to use HTTP/2 and make it a absolute link instead of relative
    : `${app.address}${authUrl}`; // address always has the "http(s)" prefix included
}
