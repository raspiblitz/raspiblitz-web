import { FC, useState } from 'react';
import { ReactComponent as ArrowDownIcon } from '../../../assets/arrow-down.svg';
import Transaction from './Transaction/Transaction';

export const TransactionCard: FC<TransactionCardProps> = (props) => {
  const MAX_ITEMS = 6;
  const [page, setPage] = useState(0);

  const pageForwardHandler = () => {
    setPage((p) => p + 1);
  };

  const pageBackwardHandler = () => {
    setPage((p) => p - 1);
  };

  const currentPage = props.transactions.slice(page * MAX_ITEMS, page * MAX_ITEMS + MAX_ITEMS);

  return (
    <div className='p-5 h-full'>
      <div className='bd-card flex flex-col transition-colors min-h-144 md:min-h-0'>
        <div className='font-bold text-lg'>Transactions</div>
        <ul className='mt-auto'>
          {currentPage.map((transaction: any, index: number) => {
            return (
              <Transaction
                onClick={() => props.showDetails(transaction.id)}
                key={index}
                type={transaction.type}
                amount={transaction.amount}
                time={transaction.time}
                category={transaction.category}
                comment={transaction.comment}
              />
            );
          })}
        </ul>
        <div className='flex justify-around py-5 mt-auto'>
          <button
            onClick={pageBackwardHandler}
            disabled={page === 0}
            className='bg-black hover:bg-gray-700 text-white p-2 rounded flex disabled:opacity-50'
          >
            <ArrowDownIcon className='h-6 w-6 transform rotate-90' />
          </button>
          <button
            className='bg-black hover:bg-gray-700 text-white p-2 rounded flex disabled:opacity-50'
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
