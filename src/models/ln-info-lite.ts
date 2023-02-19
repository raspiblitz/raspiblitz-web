export interface LnInfoLite {
  implementation: Implementation;
  version: string;
  identity_pubkey: string;
  identity_uri: string;
  num_pending_channels: number;
  num_active_channels: number;
  num_inactive_channels: number;
  block_height: number;
  synced_to_chain: boolean;
  synced_to_graph: boolean;
}

export type Implementation = "LND_GRPC" | "CLN_GRPC_BLITZ" | "NULL" | "" | null;
