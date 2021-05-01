import Transaction from './Transaction/Transaction';

export const TransactionList = (props: TransactionListProps) => {
  if (props.transactions.length === 0) {
    return <div className="text-center py-4">No transactions available.</div>;
  }

  return (
    <div className='max-h-48 overflow-x-scroll'>
      {props.transactions.map((transaction) => {
        return (
          <Transaction
            key={transaction.txid}
            amount={transaction.amount}
            time={transaction.time}
            category={transaction.category}
            comment={transaction.comment}
          />
        );
      })}
    </div>
  );
};

export default TransactionList;

export interface TransactionListProps {
  transactions: any[];
}
