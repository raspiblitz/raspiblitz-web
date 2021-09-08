import { ChangeEvent, FC, FormEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalDialog from '../../../container/ModalDialog/ModalDialog';
import { AppContext } from '../../../store/app-context';
import { instance } from '../../../util/interceptor';
import AmountInput from '../AmountInput/AmountInput';

const SendModal: FC<SendModalProps> = (props) => {
  const { t } = useTranslation();
  const appCtx = useContext(AppContext);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState('');
  const [comment, setComment] = useState('');

  const sendTransactionHandler = (event: FormEvent) => {
    event.preventDefault();
    const body = {
      amount,
      address,
      fee,
      comment,
      unit: appCtx.unit
    };
    instance.post('send', body);
  };

  const changeAddressHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };
  const changeAmountHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const changeCommentHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const changeFeeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setFee(event.target.value);
  };

  const balance =
    appCtx.unit === 'BTC'
      ? props.onchainBalance.toLocaleString()
      : (props.onchainBalance * 100_000_000).toLocaleString();

  return (
    <ModalDialog close={props.onClose}>
      <form className='px-5' onSubmit={sendTransactionHandler}>
        <div className='text-xl font-bold'>{t('wallet.send_funds')}</div>
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
              onChange={changeAddressHandler}
            />
          </div>
          <div className='w-full md:w-10/12 py-1'>
            <AmountInput amount={amount} onChangeAmount={changeAmountHandler} />
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
                onChange={changeFeeHandler}
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
              onChange={changeCommentHandler}
            />
          </div>
        </div>
        <div className='inline-block w-4/5 lg:w-3/12 align-top mb-5'>
          <button
            type='submit'
            className='text-center h-10 bg-yellow-500 hover:bg-yellow-400 dark:hover:bg-yellow-400 rounded-lg text-white w-full'
          >
            {t('wallet.send')}
          </button>
        </div>
      </form>
    </ModalDialog>
  );
};

export default SendModal;

export interface SendModalProps {
  onchainBalance: number;
  lnBalance: number;
  onClose: () => void;
}
