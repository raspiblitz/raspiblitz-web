export interface HomeState {
  syncStatus: number;
  onchainBalance: number;
  lnBalance: number;
  currBlock: number;
  maxBlock: number;
  channelOnline: number;
  channelTotal: number;
  btcVersion: string;
  btcStatus: string;
  btcNetwork: string;
  lnVersion: string;
  lnStatus: string;
  torAddress: string;
  sshAddress: string;
}
