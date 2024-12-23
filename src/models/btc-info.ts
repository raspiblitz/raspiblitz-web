export interface BtcInfo {
  blocks: number;
  headers: number;
  verification_progress: number;
  difficulty: number;
  size_on_disk: number;
  networks: NetworkInfo[];
  version: number;
  subversion: string;
  connections_in: number;
  connections_out: number;
}

export interface NetworkInfo {
  name: string;
  limited: boolean;
  reachable: boolean;
  proxy: string;
  proxy_randomize_credentials: boolean;
}
