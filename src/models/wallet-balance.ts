export interface WalletBalance {
  onchain_confirmed_balance: number;
  onchain_total_balance: number;
  onchain_unconfirmed_balance: number;
  channel_local_balance: number;
  channel_remote_balance: number;
  channel_unsettled_local_balance: number;
  channel_unsettled_remote_balance: number;
  channel_pending_open_local_balance: number;
  channel_pending_open_remote_balance: number;
}
