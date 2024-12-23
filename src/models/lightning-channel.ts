export interface LightningChannel {
  channel_id: string;
  active: boolean;
  peer_publickey: string;
  peer_alias: string;
  balance_local: number;
  balance_remote: number;
  balance_capacity: number;
}
