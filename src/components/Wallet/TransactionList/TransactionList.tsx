import { FC } from 'react';
import Transaction from './Transaction/Transaction';

export const TransactionList: FC<TransactionListProps> = (props) => {
  if (props.transactions.length === 0) {
    return <div className='text-center py-4'>No transactions available.</div>;
  }

  return (
    <ul className='max-h-48 xl:max-h-88 overflow-y-auto transform'>
      {props.transactions.map((transaction, index) => {
        return (
          <Transaction
            onClick={props.showDetails}
            key={index}
            amount={transaction.amount}
            time={transaction.time}
            category={transaction.category}
            comment={transaction.comment}
          />
        );
      })}
    </ul>
  );
};

export default TransactionList;

export interface TransactionListProps {
  transactions: any[];
  showDetails: () => void;
}
