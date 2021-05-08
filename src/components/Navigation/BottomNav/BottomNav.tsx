import { NavLink } from 'react-router-dom';
import { ReactComponent as AppIcon } from '../../../assets/apps.svg';
import { ReactComponent as HomeLogo } from '../../../assets/home.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/settings.svg';

const BottomNav = () => {
  const navLinkClasses = 'dark:text-gray-300';
  const navLinkActiveClasses = 'text-blue-700 dark:text-yellow-500';
  const iconClasses = 'w-8 h-8 mx-auto';
  const divClasses = 'text-center mx-1';

  return (
    <>
      <div className='md:hidden h-16 invisible'></div>
      <footer className='md:hidden z-10 flex flex-wrap items-center justify-evenly h-16 w-full shadow-inner fixed bottom-0 border-t-2 bg-white dark:bg-gray-800 transition-colors'>
        <NavLink to='/' exact className={navLinkClasses} activeClassName={navLinkActiveClasses}>
          <HomeLogo className={iconClasses} />
          <div className={divClasses}>Home</div>
        </NavLink>
        <NavLink to='apps' className={navLinkClasses} activeClassName={navLinkActiveClasses}>
          <AppIcon className={iconClasses} />
          <div className={divClasses}>Apps</div>
        </NavLink>
        <NavLink to='settings' className={navLinkClasses} activeClassName={navLinkActiveClasses}>
          <SettingsIcon className={iconClasses} />
          <div className={divClasses}>Settings</div>
        </NavLink>
      </footer>
    </>
  );
};

export default BottomNav;
