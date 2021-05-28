import { FC } from 'react';

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
          <button className='w-5/12 bg-black text-white p-3 rounded'>Receive</button>
          <button className='w-5/12 bg-black text-white p-2 rounded'>Send</button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
