import { FC } from 'react';
import { ReactComponent as ReceiveIcon } from '../../../assets/receive.svg';
import { ReactComponent as SendIcon } from '../../../assets/send.svg';

export const WalletCard: FC = (props) => {
  return (
    <div className='p-5 h-full'>
      <div className='bd-card h-full'>
        <div className='rounded bg-yellow-400 text-black flex flex-col md:flex-row flex-wrap p-10 shadow-md'>
          <div className='w-full md:w-1/2 flex flex-col'>
            <span>Wallet</span>
            <span className='text-lg font-bold'>1.21212121 BTC</span>
          </div>
          <div className='w-full md:w-1/2 flex flex-col'>
            <span>Lightning</span>
            <span className='text-lg font-bold'>1.21212121 BTC</span>
          </div>
        </div>
        <div className='flex justify-around p-2'>
          <button className='h-10 w-5/12 bg-black text-white p-4 rounded flex justify-center items-center'>
            <ReceiveIcon className='h-6 w-6' />
            <span>&nbsp;Receive</span>
          </button>
          <button className='h-10 w-5/12 bg-black text-white p-4 rounded flex justify-center items-center'>
            <SendIcon className='h-6 w-6' />
            <span>&nbsp;Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
