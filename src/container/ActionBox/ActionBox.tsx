import { FC } from 'react';

const ActionBox: FC<ActionBoxProps> = (props) => {
  return (
    <div className='w-full lg:w-1/3 dark:text-white transition-colors box-border pt-5 px-5'>
      <div className='relative bg-white dark:bg-gray-800 p-5 rounded-xl shadow-xl'>
        <div className='flex justify-between'>
          <div className='font-bold w-2/3'>{props.name}</div>
          <button
            className='w-1/3 rounded border-2 border-blue-300 hover:border-blue-500 px-2 outline-none focus:outline-none'
            onClick={props.action}
          >
            {props.actionName}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionBox;

export interface ActionBoxProps {
  name: string;
  actionName: string;
  action: () => void;
}
