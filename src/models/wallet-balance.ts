export interface WalletBalance {
  onchain_confirmed_balance: number | null;
  onchain_total_balance: number | null;
  onchain_unconfirmed_balance: number | null;
  channel_local_balance: number | null;
  channel_remote_balance: number | null;
  channel_unsettled_local_balance: number | null;
  channel_unsettled_remote_balance: number | null;
  channel_pending_open_local_balance: number | null;
  channel_pending_open_remote_balance: number | null;
}
