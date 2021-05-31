import { FC } from 'react';

export const BitcoinCard: FC = () => {
  return (
    <div className='p-5 h-full'>
      <div className='bd-card'>
        <h2 className='font-bold text-lg'>Bitcoin</h2>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500'>Version</h4>
            <div>bitcoin v0.21.1</div>
          </div>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500'>Network</h4>
            <div>mainnet</div>
          </div>
        </div>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500'>Status</h4>
            <div>Syncing</div>
          </div>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500'>Blocks Synced</h4>
            <div>685176/685177</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinCard;
