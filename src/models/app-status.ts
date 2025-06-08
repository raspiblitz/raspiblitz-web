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
  version: string | null;
  installed: boolean;
  configured: boolean;
  status: string;
  local_ip?: string | null;
  http_port?: string | null;
  https_port?: string | null;
  https_forced?: boolean | null;
  https_self_signed?: boolean | null;
  hidden_service?: string | null;
  address?: string | null;
  auth_method?: AuthMethod | string | null;
  details?: object | null;
  error?: string | null;
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
  SPECTER = "specter",
  THUNDERHUB = "thunderhub",
}

export enum AuthMethod {
  NONE = "none",
  USER_DEFINED = "userdefined",
  PASSWORD_B = "password_b",
  USER_ADMIN_PASSWORD_B = "user_admin_password_b",
}
