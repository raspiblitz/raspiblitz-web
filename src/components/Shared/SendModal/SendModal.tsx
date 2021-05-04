import { ChangeEvent, useEffect, useState } from 'react';
import { ReactComponent as XIcon } from '../../../assets/X.svg';
import ModalBackground from '../../../container/ModalBackground/ModalBackground';
import styles from './SendModal.module.css';

const SendModal = (props: any) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState('');
  const minAmount = 0.0000546; // 5460 sats

  const { ws } = props;

  useEffect(() => {
    if (ws) {
      ws.onmessage = (msg: any) => {
        console.log(msg);
        const message = JSON.parse(msg.data);

        switch (message.id) {
          case 5:
            console.log(message.status);
            break;
          default:
            return;
        }
      };
    }
  }, [ws]);

  const sendTransactionHandler = () => {
    console.log(ws);
    ws.send(
      JSON.stringify({
        id: 'btc_send_payment',
        amount,
        address,
        comment
      })
    );
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

  return (
    <ModalBackground>
      <div className='w-4/5 h-auto lg:w-1/3 bg-white text-center rounded-lg flex flex-col mx-5 dark:bg-gray-800 dark:text-white'>
        <div className='flex'>
          <button onClick={props.close} className='flex items-end ml-auto color-black h-7 w-7 mt-1'>
            <XIcon className='w-full h-full' />
          </button>
        </div>
        <div className='px-5'>
          <div className='text-xl font-bold'>Send Funds</div>
          <div className='my-5'>Balance: {props.balance}</div>
          <div className='m-5 flex flex-col justify-center text-center items-center'>
            <label>Address</label>
            <input
              type='text'
              className='border border-gray-400 rounded-sm w-10/12 dark:text-black outline-none'
              value={address}
              onChange={changeAddressHandler}
            />
            <label>Amount</label>
            <div className='flex flex-row border border-gray-400 rounded-sm w-10/12'>
              <input
                type='number'
                style={styles}
                min={minAmount}
                className='w-10/12 text-right dark:text-black outline-none'
                value={amount}
                onChange={changeAmountHandler}
              />
              <span>&nbsp;BTC</span>
            </div>
            <label>Comment</label>
            <input
              type='text'
              className='border border-gray-400 rounded-sm w-10/12 dark:text-black outline-none'
              value={comment}
              onChange={changeCommentHandler}
            />
          </div>
          <div className='inline-block w-4/5 lg:w-3/12 align-top mb-5'>
            <button onClick={sendTransactionHandler} className='text-center h-10 bg-blue-400 rounded-lg w-full'>
              Send
            </button>
          </div>
        </div>
      </div>
    </ModalBackground>
  );
};

export default SendModal;
