import { ChangeEvent, FC, FormEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../../../store/app-context';
import AmountInput from '../../AmountInput/AmountInput';

const SendOnChain: FC<SendOnChainProps> = (props) => {
  const { t } = useTranslation();
  const appCtx = useContext(AppContext);
  const {
    balance,
    address,
    onChangeAddress,
    amount,
    onChangeAmount,
    fee,
    onChangeFee,
    comment,
    onChangeComment,
    onConfirm
  } = props;

  return (
    <form className='px-5' onSubmit={onConfirm}>
      <h3 className='text-xl font-bold'>{t('wallet.send_onchain')}</h3>
      <div className='my-5'>
        <span className='font-bold'>{t('wallet.balance')}:&nbsp;</span>
        {balance} {appCtx.unit}
      </div>
      <div className='my-5 flex flex-col justify-center text-center items-center'>
        <div className='w-full md:w-10/12 py-1'>
          <label htmlFor='address' className='label-underline'>
            {t('wallet.address')}
          </label>
          <input
            id='address'
            type='text'
            className='w-full input-underline'
            value={address}
            onChange={onChangeAddress}
          />
        </div>
        <div className='w-full md:w-10/12 py-1'>
          <AmountInput amount={amount} onChangeAmount={onChangeAmount} />
        </div>

        <div className='w-full md:w-10/12 py-1'>
          <label htmlFor='fee' className='label-underline'>
            {t('tx.fee')}
          </label>
          <div className='flex'>
            <input
              id='fee'
              type='number'
              className='w-7/12 input-underline text-right'
              value={fee}
              onChange={onChangeFee}
            />
            <div className='w-5/12 text-sm break-words'>sat / vByte</div>
          </div>
        </div>

        <div className='w-full md:w-10/12 py-1'>
          <label htmlFor='comment' className='label-underline'>
            {t('tx.comment')}
          </label>
          <input
            id='comment'
            type='text'
            placeholder='Optional comment'
            className='input-underline'
            value={comment}
            onChange={onChangeComment}
          />
        </div>
      </div>
      <div className='inline-block w-4/5 lg:w-3/12 align-top mb-5'>
        <button
          type='submit'
          className='text-center h-10 bg-yellow-500 hover:bg-yellow-400 dark:hover:bg-yellow-400 rounded-lg text-white w-full'
        >
          {t('wallet.confirm')}
        </button>
      </div>
    </form>
  );
};

export default SendOnChain;

export interface SendOnChainProps {
  balance: string;
  address: string;
  onChangeAddress: (event: ChangeEvent<HTMLInputElement>) => void;
  amount: number;
  onChangeAmount: (event: ChangeEvent<HTMLInputElement>) => void;
  fee: string;
  onChangeFee: (event: ChangeEvent<HTMLInputElement>) => void;
  comment: string;
  onChangeComment: (event: ChangeEvent<HTMLInputElement>) => void;
  onConfirm: (event: FormEvent) => void;
}
