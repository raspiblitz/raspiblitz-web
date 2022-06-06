export interface LnInfoLite {
  implementation: string | null;
  version: string;
  identity_pubkey: string;
  num_pending_channels: number;
  num_active_channels: number;
  num_inactive_channels: number;
  block_height: number;
  synced_to_chain: boolean;
  synced_to_graph: boolean;
}
