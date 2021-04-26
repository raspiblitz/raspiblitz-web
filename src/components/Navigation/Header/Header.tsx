import { NavLink } from 'react-router-dom';
import { ReactComponent as MoonIcon } from '../../../assets/moon.svg';
import { ReactComponent as RaspiBlitzLogo } from '../../../assets/RaspiBlitz_Logo_Icon.svg';

const toggleDarkModeHandler = () => {
  const documentEl = document.documentElement.classList;
  if (documentEl.contains('dark')) {
    documentEl.remove('dark');
  } else {
    documentEl.add('dark');
  }
};

const Header = () => (
  <header className='flex items-center justify-between h-16 mx-auto px-8 w-full shadow-xl dark:bg-gray-800 dark:text-gray-300 transition-colors'>
    <NavLink to='/'>
      <RaspiBlitzLogo className='h-8 w-8 text-black dark:text-white' />
    </NavLink>
    <div className='font-bold text-xl'>Raspiblitz</div>
    <MoonIcon className='w-8 h-8 dark:text-yellow-500' onClick={toggleDarkModeHandler} />
  </header>
);

export default Header;
