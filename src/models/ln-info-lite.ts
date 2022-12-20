export interface LnInfoLite {
  implementation: "LND_GRPC" | "CLN_GRPC" | "NULL" | "" | null;
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
