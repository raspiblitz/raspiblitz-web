import { FC } from 'react';

export const ConnectionCard: FC = () => {
  return (
    <div className='p-5 h-full'>
      <div className='bd-card'>
        <div className='font-bold text-lg'>Connection Details</div>
        <div className='flex flex-col overflow-hidden py-4'>
          <div className='text-sm text-gray-500'>Tor</div>
          <div>pg6mmjiyjmcrsslvykfwnntlaru7p5svn6y2ymmju6nubxndf4pscryd.onion</div>
        </div>
        <div className='flex flex-col overflow-hidden py-4'>
          <div className='text-sm text-gray-500'>SSH Admin</div>
          <div>admin@192.168.0.1</div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
