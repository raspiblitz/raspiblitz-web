import { FC, useContext } from 'react';
import LoadingSpinner from '../../components/Shared/LoadingSpinner/LoadingSpinner';
import { AppContext } from '../../store/app-context';
import { ReactComponent as RaspiBlitzLogo } from '../../assets/RaspiBlitz_Logo_Main.svg';
import { ReactComponent as RaspiBlitzLogoDark } from '../../assets/RaspiBlitz_Logo_Main_Negative.svg';

const LoadingScreen: FC = () => {
  const appCtx = useContext(AppContext);

  return (
    <div className='h-screen w-screen bg-gray-100 dark:bg-gray-700 flex flex-col justify-center items-center'>
      {!appCtx.darkMode && <RaspiBlitzLogo className='h-12 mb-5' />}
      {appCtx.darkMode && <RaspiBlitzLogoDark className='h-12 mb-5' />}
      <LoadingSpinner color='text-yellow-500' />
    </div>
  );
};

export default LoadingScreen;
