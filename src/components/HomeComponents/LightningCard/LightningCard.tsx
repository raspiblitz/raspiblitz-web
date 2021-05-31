import { FC } from 'react';

export const LightningCard: FC = () => {
  return (
    <div className='p-5 h-full'>
      <div className='bd-card'>
        <h2 className='font-bold text-lg'>Lightning</h2>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500'>Version</h4>
            <div>LND 0.12.1-beta</div>
          </div>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500'>Status</h4>
            <div>Online</div>
          </div>
        </div>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500'>Channels</h4>
            <div>10/11</div>
          </div>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500'>Channcel Balance</h4>
            <div>2020202020 Sats</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightningCard;
