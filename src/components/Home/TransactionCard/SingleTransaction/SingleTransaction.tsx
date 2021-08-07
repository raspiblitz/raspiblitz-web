import { FC, useContext } from 'react';
import { ReactComponent as ReceiveIcon } from '../../../../assets/arrow-down.svg';
import { ReactComponent as SendIcon } from '../../../../assets/arrow-up.svg';
import { AppContext } from '../../../../store/app-context';
import { ReactComponent as ChainIcon } from '../../../../assets/chain.svg';
import { ReactComponent as LightningIcon } from '../../../../assets/lightning.svg';
import { Transaction } from '../../../../models/transaction.model';

export const SingleTransaction: FC<SingleTransactionProps> = (props) => {
  const { amount, category, time, type, comment } = props.transaction;
  const appCtx = useContext(AppContext);

  const sendingTx = category === 'send';
  const sign = sendingTx ? '' : '+';
  const formattedAmount =
    appCtx.unit === 'BTC' ? amount.toLocaleString() : Math.round(amount * 100_000_000).toLocaleString();

  const date = new Date(time * 1000);
  const formattedDate = date.toLocaleString();
  const isoString = date.toISOString();

  const color = sendingTx ? 'text-red-400' : 'text-green-400';

  const categoryIcon = sendingTx ? (
    <SendIcon className='h-5 w-1/12 transform rotate-45' />
  ) : (
    <ReceiveIcon className='h-5 w-1/12' />
  );

  return (
    <li className='text-center px-4 py-3 hover:bg-gray-300 dark:hover:bg-gray-600' onClick={props.onClick}>
      <div className='flex justify-center items-center'>
        {type === 'onchain' && <ChainIcon className='h-5 w-1/12' />}
        {type === 'lightning' && <LightningIcon className='h-5 w-1/12' />}
        {categoryIcon}
        <div className='w-4/12 italic overflow-ellipsis overflow-hidden whitespace-nowrap text-left'>
          {comment || 'Transaction'}
        </div>
        <div className={`w-6/12 ${color}`}>
          {sign} {formattedAmount} {appCtx.unit}
        </div>
      </div>

      <time className='text-sm' dateTime={isoString}>
        {formattedDate}
      </time>
      <div className='w-11/12 h-1 mx-auto'>
        <div className='border border-b border-gray-200' />
      </div>
    </li>
  );
};

export default SingleTransaction;

export interface SingleTransactionProps {
  transaction: Transaction;
  onClick: () => void;
}
