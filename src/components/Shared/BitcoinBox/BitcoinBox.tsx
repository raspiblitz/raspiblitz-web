import React, { Component } from 'react';
import { ReactComponent as RaspiBlitzLogo } from '../../../assets/RaspiBlitz_Logo_Icon.svg';

export class BitcoinBox extends Component {
  render(): JSX.Element {
    return (
      <React.Fragment>
        <div className='content-container h-full w-full bg-gray-300 dark:bg-gray-600 dark:text-white transition-colors'>
          <div className='bg-white dark:bg-gray-800 pt-5 m-10 rounded-xl'>
            {/* Header */}
            <div className='font-bold flex px-5'>
              <div className='w-1/2'>
                <div className='text-gray-400'>Bitcoin Core</div>
                100% Synchronized
              </div>
              <div className='w-1/2 h-full flex justify-end'>
                {/* TODO: Change Icon */}
                <RaspiBlitzLogo className='w-10 h-10' />
              </div>
            </div>
            {/* Body */}
            <div className='py-3 px-5'>Transactions</div>
            {/* Buttons on Bottom (Send / Receive) */}
            <div className='flex text-white'>
              <button className='w-1/2 font-medium bg-green-700 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-700 border border-black rounded-bl-xl'>
                Receive
              </button>
              <button className='w-1/2 font-medium bg-blue-700 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-700 border border-black rounded-br-xl'>
                Send
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BitcoinBox;
