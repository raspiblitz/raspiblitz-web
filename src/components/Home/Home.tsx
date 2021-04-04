import React, { Component } from 'react';
import StatusBox from './StatusBox/StatusBox';

export class Home extends Component {
  render(): JSX.Element {
    return (
      <React.Fragment>
        <div className='content-container w-full bg-gray-300 dark:bg-gray-600 dark:text-white transition-colors'>
          <div className="py-8">
            <div className='flex flex-wrap items-stretch justify-around xl:mx-28'>
              <StatusBox status='online'>Bitcoin</StatusBox>
              <StatusBox>Lightning</StatusBox>
              <StatusBox>Tor</StatusBox>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
