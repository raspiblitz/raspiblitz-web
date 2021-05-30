import { FC, useState } from 'react';
import Transaction from '../../Wallet/TransactionList/Transaction/Transaction';
import { ReactComponent as ArrowDownIcon } from '../../../assets/arrow-down.svg';

export const TransactionCard: FC<TransactionCardProps> = (props) => {
  const MAX_ITEMS = 5;
  const [page, setPage] = useState(0);

  const pageForwardHandler = () => {
    setPage((p) => p + 1);
  };

  const pageBackwardHandler = () => {
    setPage((p) => p - 1);
  };

  const currentPage = props.transactions
    .slice(page * MAX_ITEMS, page * MAX_ITEMS + MAX_ITEMS);

  return (
    <div className='p-5 h-full'>
      <div className='bd-card flex flex-col justify-center'>
        <div className='font-bold text-lg'>Transactions</div>
        <ul>
          {currentPage.map((transaction: any, index: number) => {
            return (
              <Transaction
                onClick={props.showDetails.bind(null, transaction.id)}
                key={index}
                amount={transaction.amount}
                time={transaction.time}
                category={transaction.category}
                comment={transaction.comment}
              />
            );
          })}
        </ul>
        <div className='flex justify-around pt-2'>
          <button
            onClick={pageBackwardHandler}
            disabled={page === 0}
            className='bg-black text-white p-2 rounded flex disabled:opacity-50'
          >
            <ArrowDownIcon className='h-6 w-6 transform rotate-90' />
          </button>
          <button
            className='bg-black text-white p-2 rounded flex disabled:opacity-50'
            onClick={pageForwardHandler}
            disabled={page * MAX_ITEMS + MAX_ITEMS >= props.transactions.length}
          >
            <ArrowDownIcon className='h-6 w-6 transform -rotate-90' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;

export interface TransactionCardProps {
  transactions: any[];
  showDetails: (id: string) => void;
}
