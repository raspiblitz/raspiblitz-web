export interface Transaction {
  index: number;
  id: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
  time_stamp: number;
  comment: string;
  status: TransactionStatus;
  block_height: null;
  num_confs: number | null;
  total_fees: number | null;
}

export type TransactionCategory = "ln" | "onchain";

export type TransactionStatus =
  | "succeeded"
  | "failed"
  | "in_flight"
  | "unknown";

export type TransactionType = "send" | "receive" | "unknown";
