import { NavLink } from 'react-router-dom';
import { ReactComponent as HomeLogo } from '../../../assets/home.svg';
import { ReactComponent as AppIcon } from '../../../assets/apps.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/settings.svg';

export const SideDrawer = () => {
  const navLinkClasses = 'inline-block py-4 w-full dark:text-gray-300 flex items-center justify-center';
  const navLinkActiveClasses = 'text-blue-700 dark:text-yellow-500';

  return (
    <nav className='hidden md:inline-block content-container md:w-2/12 xl:w-2/12 px-2 text-center pt-8 shadow-lg bg-white dark:bg-gray-800 transition-colors border-t-2'>
      <NavLink to='/' exact className={navLinkClasses} activeClassName={navLinkActiveClasses}>
        <div className='w-1/2 flex justify-end'>
          <HomeLogo className='inline-block w-8 h-8' />
        </div>
        <div className='w-1/2 flex jusify-start text-center mx-1'>Home</div>
      </NavLink>
      <NavLink to='apps' className={navLinkClasses} activeClassName={navLinkActiveClasses}>
        <div className='w-1/2 flex justify-end'>
          <AppIcon className='inline-block w-8 h-8' />
        </div>
        <div className='w-1/2 flex jusify-start text-center mx-1'>Apps</div>
      </NavLink>
      <NavLink to='settings' className={navLinkClasses} activeClassName={navLinkActiveClasses}>
        <div className='w-1/2 flex justify-end'>
          <SettingsIcon className='inline-block w-8 h-8' />
        </div>
        <div className='w-1/2 flex jusify-start text-center mx-1'>Settings</div>
      </NavLink>
    </nav>
  );
};

export default SideDrawer;
