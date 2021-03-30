import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as BitcoinIcon } from '../../../assets/bitcoin-circle.svg';
import { ReactComponent as HomeLogo } from '../../../assets/home.svg';
import { ReactComponent as LightningIcon } from '../../../assets/lightning.svg';
import { ReactComponent as SettingsIcon } from '../../../assets/settings.svg';

export class SideDrawer extends Component {
  render(): JSX.Element {
    return (
      <nav className='hidden md:inline-block content-container md:w-3/12 xl:w-2/12 bg-gray-200 px-2 text-center pt-8 shadow-lg'>
        <NavLink
          to='/'
          exact
          activeClassName='text-blue-700 dark:text-yellow-500'
          className='inline-block py-4 w-full dark:text-gray-300'
        >
          <HomeLogo className='inline-block w-8 h-8 mx-auto' />
          <div className='inline-block text-center mx-1'>Home</div>
        </NavLink>
        <NavLink
          to='bitcoin'
          activeClassName='text-blue-700 dark:text-yellow-500'
          className='inline-block py-4 w-full dark:text-gray-300'
        >
          <BitcoinIcon className='inline-block w-8 h-8 mx-auto' />
          <div className='inline-block text-center mx-1'>Bitcoin</div>
        </NavLink>
        <NavLink
          to='lightning'
          activeClassName='text-blue-700 dark:text-yellow-500'
          className='inline-block py-4 w-full dark:text-gray-300'
        >
          <LightningIcon className='inline-block w-8 h-8 mx-auto' />
          <div className='inline-block text-center mx-1'>Lightning</div>
        </NavLink>
        {/* <NavLink to='services' activeClassName='inline-block py-4 w-full text-blue-700 dark:text-yellow-500' className='dark:text-gray-300'>
        <ServicesIcon className='inline-block w-8 h-8 mx-auto' />
        <div className='inline-block text-center mx-1'>Services</div>
      </NavLink> */}
        <NavLink
          to='settings'
          activeClassName='text-blue-700 dark:text-yellow-500'
          className='inline-block py-4 w-full dark:text-gray-300'
        >
          <SettingsIcon className='inline-block w-8 h-8 mx-auto' />
          <div className='inline-block text-center mx-1'>Settings</div>
        </NavLink>
      </nav>
    );
  }
}

export default SideDrawer;
