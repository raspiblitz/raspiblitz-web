import DashboardBox from '../../../container/DashboardBox/DashboardBox';
import { DashboardBoxProps } from '../../../interfaces/DashboardBoxProps';
import SendRecvBtn from '../../../container/DashboardBox/SendRecvBtn/SendRecvBtn';

const BitcoinBox = (props: Partial<DashboardBoxProps>) => {
  const syncStatus = props.syncStatus ? props.syncStatus + ' % Synchronized' : 'Checking Sync ...';
  const balance = props.balance ? props.balance : 'Loading ...';

  return (
    <DashboardBox>
      {/* Header */}
      <div className='font-bold flex px-5'>
        <div className='w-1/2'>
          <div className='text-gray-400'>{props.name}</div>
          {syncStatus}
        </div>
        <div className='w-1/2 h-full flex justify-end'>{props.icon}</div>
      </div>
      {/* Body */}
      <div className='py-3 px-5'>{balance}</div>
      {props.transactionBox ? <div className='py-3 px-5'>Transactions</div> : null}
      {props.transactions?.map((transaction) => (
        <div>{transaction}</div>
      ))}
      {/* Buttons on Bottom (Send / Receive) */}
      <SendRecvBtn send={props.send} receive={props.receive} />
    </DashboardBox>
  );
};

export default BitcoinBox;
