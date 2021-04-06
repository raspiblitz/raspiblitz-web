import React, { Component } from 'react';
import BitcoinBox from '../Shared/BitcoinBox/BitcoinBox';
import StatusBox from './StatusBox/StatusBox';

export class Home extends Component {
  render(): JSX.Element {
    return (
      <React.Fragment>
        <div className='content-container w-full bg-gray-300 dark:bg-gray-600 dark:text-white transition-colors'>
          <div className='py-8'>
            <div className='flex flex-wrap items-stretch justify-around'>
              <StatusBox status='online'>Bitcoin</StatusBox>
              <StatusBox>Lightning</StatusBox>
              <StatusBox>Tor</StatusBox>
            </div>
            <div className='flex flex-col md:flex-row flex-wrap lg:flex-nowrap w-full items-start'>
              <BitcoinBox></BitcoinBox>
              <BitcoinBox></BitcoinBox>
              <BitcoinBox></BitcoinBox>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
