import { FC, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as MoonIcon } from '../../../assets/moon.svg';
import { ReactComponent as RaspiBlitzLogo } from '../../../assets/RaspiBlitz_Logo_Icon.svg';
import { AppContext } from '../../../store/app-context';

const Header: FC = () => {
  const appCtx = useContext(AppContext);

  return (
    <header className='flex items-center justify-between h-16 mx-auto px-8 w-full shadow-xl bg-white dark:bg-gray-800 dark:text-gray-300 transition-colors'>
      <NavLink to='/'>
        <RaspiBlitzLogo className='h-8 w-8 text-black dark:text-white' />
      </NavLink>
      <div className='font-bold text-xl'>Raspiblitz</div>
      <div>
        <MoonIcon className='w-8 h-8 dark:text-yellow-500' onClick={appCtx.toggleDarkMode} />
      </div>
    </header>
  );
};

export default Header;
