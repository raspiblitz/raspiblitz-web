import { FC } from 'react';

export const WalletCard: FC = (props) => {
  return (
    <div className='p-5 h-full'>
      <div className='bd-card'>
        <div className='rounded bg-yellow-500 text-black h-1/2'></div>
        <div className='h-1/2 flex'>
          <div className='w-1/2'>Incoming</div>
          <div className='w-1/2'>Outgoing</div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
