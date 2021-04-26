import { ReactComponent as OfflineIcon } from '../../../assets/offline.svg';
import { ReactComponent as OnlineIcon } from '../../../assets/online.svg';

const StatusBox = (props: any) => {
  return (
    <div className='sm:mx-auto text-center rounded-xl py-2 my-2 bg-white dark:bg-gray-800 flex justify-between align-center shadow-md transition-colors'>
      {props.status === 'online' ? (
        <div className='w-24 h-5 flex my-auto font-bold mx-2 text-green-500 items-center justify-center'>
          <OnlineIcon />
          &nbsp;<div>Online</div>
        </div>
      ) : (
        <div className='w-24 h-5 flex my-auto font-bold mx-2 text-red-500 items-center justify-center'>
          <OfflineIcon />
          &nbsp;<div>Offline</div>
        </div>
      )}
      <span className='w-32 text-left font-bold text-md lg:text-lg lg:text-center dark:text-gray-300'>
        {props.children}
      </span>
    </div>
  );
};

export default StatusBox;
