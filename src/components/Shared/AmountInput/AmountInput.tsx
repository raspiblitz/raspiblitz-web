import { ChangeEventHandler, FC, useContext } from 'react';
import { ReactComponent as FlipIcon } from '../../../assets/flip-vertical.svg';
import { AppContext } from '../../../store/app-context';
import styles from './AmountInput.module.css';

const AmountInput: FC<AmountInputProps> = (props) => {
  const appCtx = useContext(AppContext);

  return (
    <>
      <label htmlFor='amount' className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 text-left'>
        Amount
      </label>
      <div className='flex flex-row'>
        <input
          id='amount'
          type='number'
          style={styles}
          className='w-8/12 rounded rounded-r-none text-right dark:text-black outline-none pr-3'
          value={props.amount}
          onChange={props.onChangeAmount}
        />
        <span
          className='flex justify-center items-center w-4/12 rounded rounded-l-none border border-gray-500 border-l-0'
          onClick={appCtx.toggleUnit}
        >
          {appCtx.unit}
          <FlipIcon className='h-5 w-5 text-black dark:text-white' />
        </span>
      </div>
    </>
  );
};

export default AmountInput;

export interface AmountInputProps {
  amount: number;
  onChangeAmount: ChangeEventHandler<HTMLInputElement>;
}
