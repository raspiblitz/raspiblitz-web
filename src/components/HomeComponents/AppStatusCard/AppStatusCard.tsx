import { FC } from 'react';

export const AppStatusCard: FC<AppStatusCardProps> = (props) => {
  const statusColor = props.status === 'online' ? 'text-green-400' : 'text-red-500';
  return (
    <div className='p-5 h-auto'>
      <div className='bd-card'>
        <div className='flex flex-row my-2 items-center w-full'>
          {/* Icon */}
          <div className='w-1/4 flex justify-center items-center p-2'>
            <img className='max-h-16' src={props.icon} alt='logo' />
          </div>
          {/* Content */}
          <div className='w-3/4 pl-5 justify-center items-start flex flex-col text-xl'>
            <div className='dark:text-white'>{props.name}</div>
            <div className='text-gray-500 dark:text-gray-300 text-base'>{props.description}</div>
            <div className={`pt-3 ${statusColor}`}>{props.status}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppStatusCard;

export interface AppStatusCardProps {
  icon: string;
  name: string;
  description: string;
  status: string;
}
