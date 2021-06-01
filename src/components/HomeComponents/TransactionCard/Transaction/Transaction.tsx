import { FC, useContext } from 'react';
import { ReactComponent as ReceiveIcon } from '../../../../assets/arrow-down.svg';
import { ReactComponent as SendIcon } from '../../../../assets/arrow-up.svg';
import { AppContext } from '../../../../store/app-context';

export const Transaction: FC<TransactionProps> = (props) => {
  const appCtx = useContext(AppContext);
  const sendingTx = props.category === 'send';
  const sign = sendingTx ? '' : '+';
  const amount =
    appCtx.unit === 'BTC' ? props.amount.toLocaleString() : Math.round(props.amount * 100_000_000).toLocaleString();
  const color = sendingTx ? 'text-red-400' : 'text-green-400';

  const icon = sendingTx ? (
    <SendIcon className='h-5 w-2/12 transform rotate-45' />
  ) : (
    <ReceiveIcon className='h-5 w-2/12' />
  );

  return (
    <li className='text-center px-4 py-3 hover:bg-gray-300 dark:hover:bg-gray-600' onClick={props.onClick}>
      <div className='flex justify-center items-center'>
        {icon}
        <div className='w-4/12 italic overflow-ellipsis overflow-hidden whitespace-nowrap text-left'>
          {props.comment || 'Transaction'}
        </div>
        <div className={`w-6/12 ${color}`}>
          {sign}
          {amount} {appCtx.unit}
        </div>
      </div>

      <div className='text-sm'>{new Date(props.time * 1000).toLocaleString()}</div>
      <div className='w-11/12 h-1 mx-auto'>
        <div className='border border-b border-gray-200' />
      </div>
    </li>
  );
};

export default Transaction;

export interface TransactionProps {
  amount: number;
  time: number;
  category: 'send' | 'receive' | 'generate' | 'immature' | 'orphan';
  comment?: string;
  onClick: () => void;
}
