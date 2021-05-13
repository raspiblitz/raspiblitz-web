import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as MenuIcon } from '../../../assets/menu.svg';
import { ReactComponent as RaspiBlitzLogo } from '../../../assets/RaspiBlitz_Logo_Icon.svg';
import DropdownMenu from './DropdownMenu/DropdownMenu';

const Header: FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const showDropdownHandler = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <header className='flex items-center justify-between h-16 mx-auto px-8 w-full shadow-xl bg-white dark:bg-gray-800 dark:text-gray-300 transition-colors'>
      <NavLink to='/'>
        <RaspiBlitzLogo className='h-8 w-8 text-black dark:text-white' />
      </NavLink>
      <div className='font-bold text-xl'>Raspiblitz</div>
      <div className='relative'>
        <MenuIcon onClick={showDropdownHandler} className='w-8 h-8' />
        {showDropdown && <DropdownMenu />}
      </div>
    </header>
  );
};

export default Header;
