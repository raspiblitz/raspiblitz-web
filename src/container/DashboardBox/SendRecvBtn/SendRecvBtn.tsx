import { FC } from 'react';
import { ReactComponent as ReceiveIcon } from '../../../assets/receive.svg';
import { ReactComponent as SendIcon } from '../../../assets/send.svg';

const SendRecvBtn: FC<SendRecvBtnProps> = (props) => {
  return (
    <>
      <div className='absolute bottom-0 w-full text-white rounded-xl shadow-xl'>
        <button
          className='w-1/2 h-10 font-medium bg-green-500 hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-400 border border-black rounded-bl-xl'
          onClick={props.receive}
        >
          <div className='flex justify-center items-center'>
            <ReceiveIcon className='h-5 w-5' />
            &nbsp;Receive
          </div>
        </button>
        <button
          className='w-1/2 h-10 font-medium bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 border border-black rounded-br-xl'
          onClick={props.send}
        >
          <div className='flex justify-center items-center'>
            <SendIcon className='h-5 w-5' />
            &nbsp;Send
          </div>
        </button>
      </div>
    </>
  );
};

export default SendRecvBtn;

export interface SendRecvBtnProps {
  send: () => void;
  receive: () => void;
}
