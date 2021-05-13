import { FC, useContext } from 'react';
import { AppContext } from '../../../../store/app-context';
import Toggle from '../../../Shared/Toggle/Toggle';

const DropdownMenu: FC = () => {
  const appCtx = useContext(AppContext);
  const unitActive = appCtx.unit === 'Sat';
  const darkActive = appCtx.darkMode;

  return (
    <div className='absolute right-0 border border-black rounded-lg w-56 h-28 z-10 bg-white dark:bg-gray-800 dark:border-gray-300'>
      <div className='flex w-full text-center justify-center flex-col items-center'>
        <div className='w-full py-3'>
          <Toggle toggleText='Display Sats' active={unitActive} toggleFn={appCtx.toggleUnit} />
        </div>
        <div className='w-full py-3'>
          <Toggle toggleText='Dark Mode' active={darkActive} toggleFn={appCtx.toggleDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
