import { NavLink } from 'react-router-dom';
import { ReactComponent as HomeLogo } from '../../../assets/home.svg';
import { ReactComponent as ServicesIcon } from '../../../assets/services.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/settings.svg';

const BottomNav = () => {
  const navLinkClasses = 'dark:text-gray-300';
  const navLinkActiveClasses = 'text-blue-700 dark:text-yellow-500';

  return (
    <footer className='md:hidden z-10 flex flex-wrap items-center justify-evenly h-16 w-full shadow-inner fixed bottom-0 border-t-2 bg-white dark:bg-gray-800 transition-colors'>
      <NavLink to='/' exact className={navLinkClasses} activeClassName={navLinkActiveClasses}>
        <HomeLogo className='w-8 h-8 mx-auto' />
        <div className='text-center mx-1'>Home</div>
      </NavLink>
      {/* <NavLink to='bitcoin' className={navLinkClasses} activeClassName={navLinkActiveClasses}>
      <BitcoinIcon className='w-8 h-8 mx-auto' />
      <div className='text-center mx-1'>Bitcoin</div>
    </NavLink> */}
      {/* <NavLink to='lightning' className={navLinkClasses} activeClassName={navLinkActiveClasses}'>
      <LightningIcon className='w-8 h-8 mx-auto' />
      <div className='text-center mx-1'>Lightning</div>
    </NavLink> */}
      <NavLink to='services' className={navLinkClasses} activeClassName={navLinkActiveClasses}>
        <ServicesIcon className='w-8 h-8 mx-auto' />
        <div className='text-center mx-1'>Services</div>
      </NavLink>
      <NavLink to='settings' className={navLinkClasses} activeClassName={navLinkActiveClasses}>
        <SettingsIcon className='w-8 h-8 mx-auto' />
        <div className='text-center mx-1'>Settings</div>
      </NavLink>
    </footer>
  );
};

export default BottomNav;
