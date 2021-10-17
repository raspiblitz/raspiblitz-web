export interface SystemInfo {
  alias: string;
  color: string;
  version: string;
  health: string;
  health_messages: HealthMessage[];
  tor_web_ui: string;
  tor_api: string;
  lan_web_ui: string;
  lan_api: string;
  ssh_address: string;
  chain: string;
}

export interface HealthMessage {
  id: number;
  level: string;
  message: string;
}
