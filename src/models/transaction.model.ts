export interface Transaction {
  id: string;
  amount: number;
  time: number;
  type: 'onchain' | 'lightning';
  category: 'send' | 'receive' | 'generate' | 'immature' | 'orphan';
  comment?: string;
}
