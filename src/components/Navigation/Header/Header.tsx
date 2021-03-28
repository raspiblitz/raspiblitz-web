import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../../assets/RaspiBlitz_Logo_Icon.svg';

export class Header extends Component {
  render(): JSX.Element {
    return (
      <React.Fragment>
        <header className='container flex items-center justify-between h-16 px-6 mx-auto'>
          <NavLink to='/'>
            <img src={logo} alt='RaspiBlitz Logo' style={{ width: 50, height: 50 }} />
          </NavLink>
        </header>
      </React.Fragment>
    );
  }
}

export default Header;
