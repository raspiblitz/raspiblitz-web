import { FC } from 'react';

export const ConnectionCard: FC<ConnectionCardProps> = (props) => {
  return (
    <div className='p-5 h-full'>
      <div className='bd-card'>
        <div className='font-bold text-lg'>Connection Details</div>
        <div className='flex flex-col overflow-hidden py-4'>
          <div className='text-sm text-gray-500'>Tor</div>
          <a
            className='overflow-hidden overflow-ellipsis text-blue-400 underline'
            href={`//${props.torAddress}`}
            target='_blank'
            rel='noreferrer'
          >
            {props.torAddress}
          </a>
        </div>
        <div className='flex flex-col overflow-hidden py-4'>
          <div className='text-sm text-gray-500'>SSH Admin</div>
          <div>{props.sshAddress}</div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;

export interface ConnectionCardProps {
  torAddress: string;
  sshAddress: string;
}
