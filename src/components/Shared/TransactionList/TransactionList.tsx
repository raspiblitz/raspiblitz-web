import Transaction from './Transaction/Transaction';

export const TransactionList = (props: TransactionListProps) => {
  if (props.transactions.length === 0) {
    return <div className='text-center py-4'>No transactions available.</div>;
  }

  return (
    <div className='max-h-48 overflow-y-scroll'>
      {props.transactions.map((transaction, index) => {
        return (
          <Transaction
            key={index}
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
