import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as BitcoinIcon } from '../../../assets/bitcoin-circle.svg';
import { ReactComponent as HomeLogo } from '../../../assets/home.svg';
import { ReactComponent as LightningIcon } from '../../../assets/lightning.svg';
import { ReactComponent as ServicesIcon } from '../../../assets/services.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/settings.svg';

const BottomNav = () => (
  <React.Fragment>
    <footer className='md:hidden z-10 flex flex-wrap items-center justify-evenly h-16 w-full shadow-inner fixed bottom-0 border-t-2 dark:bg-gray-800'>
      <NavLink to='/' exact activeClassName='text-blue-700 dark:text-yellow-500' className='dark:text-gray-300'>
        <HomeLogo className='w-8 h-8 mx-auto' />
        <div className='text-center mx-1'>Home</div>
      </NavLink>
      <NavLink to='bitcoin' activeClassName='text-blue-700 dark:text-yellow-500' className='dark:text-gray-300'>
        <BitcoinIcon className='w-8 h-8 mx-auto' />
        <div className='text-center mx-1'>Bitcoin</div>
      </NavLink>
      <NavLink to='lightning' activeClassName='text-blue-700 dark:text-yellow-500' className='dark:text-gray-300'>
        <LightningIcon className='w-8 h-8 mx-auto' />
        <div className='text-center mx-1'>Lightning</div>
      </NavLink>
      <NavLink to='services' activeClassName='text-blue-700 dark:text-yellow-500' className='dark:text-gray-300'>
        <ServicesIcon className='w-8 h-8 mx-auto' />
        <div className='text-center mx-1'>Services</div>
      </NavLink>
      <NavLink to='settings' activeClassName='text-blue-700 dark:text-yellow-500' className='dark:text-gray-300'>
        <SettingsIcon className='w-8 h-8 mx-auto' />
        <div className='text-center mx-1'>Settings</div>
      </NavLink>
    </footer>
  </React.Fragment>
);

export default BottomNav;
