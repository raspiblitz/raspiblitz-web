import { ChangeEvent, FC, FormEvent, useContext, useState } from 'react';
import ModalDialog from '../../../container/ModalDialog/ModalDialog';
import { AppContext } from '../../../store/app-context';
import AmountInput from '../AmountInput/AmountInput';

const SendModal: FC<SendModalProps> = (props) => {
  const appCtx = useContext(AppContext);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [comment, setComment] = useState('');
  // const minAmount = 0.0000546; // 5460 sats

  const sendTransactionHandler = (event: FormEvent) => {
    event.preventDefault();
    fetch('http://localhost:8080/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        address,
        fee,
        comment,
        unit: appCtx.unit
      })
    });
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
    setFee(+event.target.value);
  };

  const balance =
    appCtx.unit === 'BTC'
      ? props.onchainBalance.toLocaleString()
      : (props.onchainBalance * 100_000_000).toLocaleString();

  return (
    <ModalDialog close={props.onClose}>
      <form className='px-5' onSubmit={sendTransactionHandler}>
        <div className='text-xl font-bold'>Send Funds</div>
        <div className='my-5'>
          <span className='font-bold'>Balance:&nbsp;</span>
          {balance} {appCtx.unit}
        </div>
        <div className='my-5 flex flex-col justify-center text-center items-center'>
          <div className='w-full md:w-10/12 py-1'>
            <label
              htmlFor='address'
              className='block text-left text-gray-700 dark:text-gray-300 text-sm font-bold mb-2'
            >
              Address
            </label>
            <input
              id='address'
              type='text'
              className='w-full rounded dark:text-black'
              value={address}
              onChange={changeAddressHandler}
            />
          </div>
          <div className='w-full md:w-10/12 py-1'>
            <AmountInput amount={amount} onChangeAmount={changeAmountHandler} />
          </div>

          <div className='w-full md:w-10/12 py-1'>
            <label htmlFor='fee' className='block text-left text-gray-700 dark:text-gray-300 text-sm font-bold mb-2'>
              Fee
            </label>
            <input
              id='fee'
              type='number'
              className='w-full rounded dark:text-black'
              value={fee}
              onChange={changeFeeHandler}
            />
          </div>

          <div className='w-full md:w-10/12 py-1'>
            <label htmlFor='comment' className='block text-left text-gray-700 dark:text-gray-300'>
              Comment
            </label>
            <input
              id='comment'
              type='text'
              placeholder='Optional'
              className='input-underline'
              value={comment}
              onChange={changeCommentHandler}
            />
          </div>
        </div>
        <div className='inline-block w-4/5 lg:w-3/12 align-top mb-5'>
          <button
            type='submit'
            className='text-center h-10 bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 rounded-lg text-white w-full'
          >
            Send
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
