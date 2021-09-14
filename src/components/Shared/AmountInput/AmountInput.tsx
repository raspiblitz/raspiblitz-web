import { ChangeEventHandler, FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as SwitchIcon } from '../../../assets/switch-vertical.svg';
import { AppContext } from '../../../store/app-context';
import styles from './AmountInput.module.css';

const AmountInput: FC<AmountInputProps> = (props) => {
  const { t } = useTranslation();
  const appCtx = useContext(AppContext);

  return (
    <>
      <label htmlFor='amount' className='label-underline'>
        {t('wallet.amount')}
      </label>
      <div className='flex flex-row'>
        <input
          id='amount'
          type='number'
          style={styles}
          className='w-8/12 text-right input-underline mr-3 pr-5'
          value={props.amount}
          onChange={props.onChangeAmount}
        />
        <span
          className='flex justify-center items-center w-4/12 p-1 rounded shadow-md dark:bg-gray-600'
          onClick={appCtx.toggleUnit}
        >
          {appCtx.unit}
          <SwitchIcon className='h-5 w-5 text-black dark:text-white' />
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
