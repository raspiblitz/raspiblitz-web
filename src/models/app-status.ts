export interface AppStatusQueryResponse {
  // successful queries
  data: AppStatus[];
  // failed queries
  errors: AppQueryError[];
  // unix timestamp (UTC) when the data was fetched
  timestamp: number;
}

export interface AppStateUpdateMessage {
  state: "initiated" | "success" | "finished";
  message: AppStatusQueryResponse | null;
}

export interface AppStatus {
  id: AppId;
  installed: boolean;
  address?: string;
  httpsForced?: boolean;
  httpsSelfsigned?: boolean;
  hiddenService?: string;
  authMethod?: AuthMethod;
  details?: unknown;
  error?: string;
  version: string;
}

export interface AppQueryError {
  id: AppId;
  error: string;
}

export enum AppId {
  ALBYHUB = "albyhub",
  BTCPAYSERVER = "btcpayserver",
  BTC_RPC_EXPLORER = "btc-rpc-explorer",
  ELECTRS = "electrs",
  JAM = "jam",
  LNBITS = "lnbits",
  MEMPOOL = "mempool",
  RTL = "rtl",
  THUNDERHUB = "thunderhub",
}

export enum AuthMethod {
  NONE = "none",
  USER_DEFINED = "userdefined",
  PASSWORD_B = "password_b",
  USER_ADMIN_PASSWORD_B = "user_admin_password_b",
}
