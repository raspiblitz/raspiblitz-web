import React from 'react';
import { DashboardBoxProps } from '../../../interfaces/DashboardBoxProps';
import { ReactComponent as ReceiveIcon } from '../../../assets/receive.svg';
import { ReactComponent as SendIcon } from '../../../assets/send.svg';

const DashboardBox = (props: Partial<DashboardBoxProps>) => {
  return (
    <React.Fragment>
      <div className='content-container h-full w-full bg-gray-300 dark:bg-gray-600 dark:text-white transition-colors'>
        <div className='bg-white dark:bg-gray-800 pt-5 m-10 rounded-xl'>
          {/* Header */}
          <div className='font-bold flex px-5'>
            <div className='w-1/2'>
              <div className='text-gray-400'>{props.name}</div>
              {props.syncStatus ? props.syncStatus + ' % Synchronized' : "Checking Sync ..."}
            </div>
            <div className='w-1/2 h-full flex justify-end'>{props.icon}</div>
          </div>
          {/* Body */}
          <div className='py-3 px-5'>{props.balance ? props.balance : "Loading ..."}</div>
          {props.transactionBox ? <div className='py-3 px-5'>Transactions</div> : null}
          {props.transactions?.map((transaction) => (
            <div>{transaction}</div>
          ))}
          {/* Buttons on Bottom (Send / Receive) */}
          {props.transactionBox ? (
            <div className='flex text-white'>
              <button
                className='w-1/2 h-10 font-medium bg-green-700 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-700 border border-black rounded-bl-xl'
                onClick={props.receive}
              >
                <div className='flex justify-center items-center'>
                  <ReceiveIcon className='h-5 w-5' />
                  &nbsp;Receive
                </div>
              </button>
              <button
                className='w-1/2 h-10 font-medium bg-blue-700 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-700 border border-black rounded-br-xl'
                onClick={props.send}
              >
                <div className='flex justify-center items-center'>
                  <SendIcon className='h-5 w-5' />
                  &nbsp;Send
                </div>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashboardBox;
