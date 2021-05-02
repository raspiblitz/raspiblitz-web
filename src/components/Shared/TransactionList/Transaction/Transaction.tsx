export const Transaction = (props: TransactionProps) => {
  const sendingTx = props.category === 'send';
  const amount = sendingTx ? props.amount : `+${props.amount}`;
  const color = sendingTx ? 'text-red-400' : 'text-green-400';

  return (
    <div className='text-center px-4 py-3'>
      <div className='flex justify-center items-center'>
        <div className='w-6/12 italic'>{props.comment || 'Transaction'}</div>
        <div className={`w-6/12 ${color}`}>{amount} BTC</div>
      </div>

      <div className='text-sm'>{new Date(props.time * 1000).toLocaleString()}</div>
    </div>
  );
};

export default Transaction;

export interface TransactionProps {
  amount: number;
  time: number;
  category: 'send' | 'receive' | 'generate' | 'immature' | 'orphan';
  comment?: string;
}
