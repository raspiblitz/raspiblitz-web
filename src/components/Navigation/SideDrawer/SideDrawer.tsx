import { NavLink } from 'react-router-dom';
import { ReactComponent as HomeLogo } from '../../../assets/home.svg';
import { ReactComponent as ServicesIcon } from '../../../assets/services.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/settings.svg';

export const SideDrawer = () => {
  const navLinkClasses = 'inline-block py-4 w-full dark:text-gray-300';
  const navLinkActiveClasses = 'text-blue-700 dark:text-yellow-500';

  return (
    <nav className='hidden md:inline-block content-container md:w-3/12 xl:w-2/12 px-2 text-center pt-8 shadow-lg bg-white dark:bg-gray-800 transition-colors border-t-2'>
      <NavLink to='/' exact className={navLinkClasses} activeClassName={navLinkActiveClasses}>
        <HomeLogo className='inline-block w-8 h-8 mx-auto' />
        <div className='inline-block text-center mx-1'>Home</div>
      </NavLink>
      {/* <NavLink to='bitcoin' className={navLinkClasses} activeClassName={navLinkActiveClasses}>
        <BitcoinIcon className='inline-block w-8 h-8 mx-auto' />
        <div className='inline-block text-center mx-1'>Bitcoin</div>
      </NavLink> */}
      {/* <NavLink to='lightning' className={navLinkClasses} activeClassName={navLinkActiveClasses}>
        <LightningIcon className='inline-block w-8 h-8 mx-auto' />
        <div className='inline-block text-center mx-1'>Lightning</div>
      </NavLink> */}
      <NavLink to='services' className={navLinkClasses} activeClassName={navLinkActiveClasses}>
        <ServicesIcon className='inline-block w-8 h-8 mx-auto' />
        <div className='inline-block text-center mx-1'>Services</div>
      </NavLink>
      <NavLink to='settings' className={navLinkClasses} activeClassName={navLinkActiveClasses}>
        <SettingsIcon className='inline-block w-8 h-8 mx-auto' />
        <div className='inline-block text-center mx-1'>Settings</div>
      </NavLink>
    </nav>
  );
};

export default SideDrawer;
