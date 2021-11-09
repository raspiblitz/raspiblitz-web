export interface Transaction {
  index: number;
  id: string;
  category: "ln" | "onchain";
  type: "send" | "receive";
  amount: number;
  time_stamp: number;
  comment: string;
  status: "succeeded" | "failed";
  block_height: null;
  num_confs: number | null;
  total_fees: number | null;
}
