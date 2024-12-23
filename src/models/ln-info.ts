export interface LnInfo {
  implementation: Implementation;
  version: string;
  commit_hash: string;
  identity_pubkey: string;
  identity_uri: string;
  alias: string;
  color: string;
  num_pending_channels: number;
  num_active_channels: number;
  num_inactive_channels: number;
  num_peers: number;
  block_height: number;
  block_hash: string;
  best_header_timestamp: number;
  synced_to_chain: boolean;
  synced_to_graph: boolean;
  chains: Chain[];
  uris: string[];
  features: Feature[];
}

export interface Chain {
  chain: string;
  network: string;
}

export interface Feature {
  key: number;
  value: Value;
}

export interface Value {
  name: string;
  is_required: boolean;
  is_known: boolean;
}

export type Implementation = "LND_GRPC" | "CLN_GRPC_BLITZ" | "NULL" | "" | null;
