import { FC } from 'react';

// TODO: Let it always take 1row / 1col in grid
export const AppStatusCard: FC<AppStatusCardProps> = (props) => {
  const statusColor = props.status === 'Online' ? 'text-green-400' : 'text-red-500';
  return (
    <div className='border border-black box-border rounded-md bg-white flex justify-center px-6 py-4'>
      <div className='flex flex-row my-2 items-center w-full'>
        {/* Icon */}
        <div className='w-1/4 flex justify-center items-center'>{props.icon}</div>
        {/* Content */}
        <div className='w-3/4 pl-5 justify-center items-start flex flex-col text-xl'>
          <div>{props.name}</div>
          <div className='text-gray-500 text-base'>{props.description}</div>
          <div className={`pt-3 ${statusColor}`}>{props.status}</div>
        </div>
      </div>
    </div>
  );
};

export default AppStatusCard;

export interface AppStatusCardProps {
  icon: JSX.Element;
  name: string;
  description: string;
  status: string;
}
