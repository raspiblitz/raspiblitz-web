import { FC } from 'react';

const ActionBox: FC<ActionBoxProps> = (props) => {
  return (
    <div className='w-full lg:w-1/3 dark:text-white transition-colors box-border pt-5 px-5'>
      <div className='relative bg-white dark:bg-gray-800 p-5 rounded shadow-xl'>
        <div className='flex justify-between'>
          <div className='font-bold w-1/2 xl:w-2/3 flex items-center'>{props.name}</div>
          <button
            className='w-1/2 xl:w-1/3 shadow-xl rounded text-white bg-yellow-500 hover:bg-yellow-400 py-1'
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
