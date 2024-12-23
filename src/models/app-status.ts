export interface AppStatus {
  id: string;
  installed: boolean;
  address?: string;
  httpsForced?: "0" | "1";
  httpsSelfsigned?: "0" | "1";
  hiddenService?: string;
  authMethod?: AuthMethod;
  details?: unknown;
  error: string;
  version: string;
}

export enum AuthMethod {
  NONE = "none",
  USER_DEFINED = "userdefined",
  PASSWORD_B = "password_b",
  USER_ADMIN_PASSWORD_B = "user_admin_password_b",
}
