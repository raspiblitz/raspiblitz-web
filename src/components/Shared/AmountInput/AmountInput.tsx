import styles from './AmountInput.module.css';
import { ChangeEventHandler, FC, useContext } from 'react';
import { AppContext } from '../../../store/app-context';

const AmountInput: FC<AmountInputProps> = (props) => {
  const appCtx = useContext(AppContext);

  return (
    <>
      <label htmlFor='amount'>Amount</label>
      <div className='flex flex-row border border-gray-400'>
        <input
          id='amount'
          type='number'
          style={styles}
          className='w-10/12 text-right dark:text-black outline-none'
          value={props.amount}
          onChange={props.onChangeAmount}
        />
        <span className='w-2/12' onClick={appCtx.toggleUnit}>
          {appCtx.unit}
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
