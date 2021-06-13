import { FC } from 'react';
import LoadingSpinner from '../../components/Shared/LoadingSpinner/LoadingSpinner';

const LoadingScreen: FC = (props) => (
  <div className='h-screen w-screen bg-gray-100 dark:bg-gray-700 flex justify-center items-center'>
    <LoadingSpinner color='text-yellow-500' />
  </div>
);

export default LoadingScreen;
