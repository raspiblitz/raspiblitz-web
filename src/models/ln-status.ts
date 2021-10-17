export interface LnStatus {
  implementation: string;
  version: string;
  num_pending_channels: number;
  num_active_channels: number;
  num_inactive_channels: number;
  block_height: number;
  synced_to_chain: boolean;
  synced_to_graph: boolean;
}
