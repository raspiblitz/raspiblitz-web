import { ReactComponent as BitcoinLogo } from '../../../assets/bitcoin-circle.svg';
import DashboardBox from '../../../container/DashboardBox/DashboardBox';
import SendRecvBtn from '../../../container/DashboardBox/SendRecvBtn/SendRecvBtn';
import TransactionList from '../TransactionList/TransactionList';

const BitcoinBox = (props: any) => {
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
        <div className='w-1/2 h-full flex justify-end'>
          <BitcoinLogo className='w-10 h-10' />
        </div>
      </div>
      {/* Body */}
      <div className='py-3 px-5'>{balance}</div>
      <TransactionList transactions={props.transactions} />
      {/* Buttons on Bottom (Send / Receive) */}
      <SendRecvBtn send={props.send} receive={props.receive} />
    </DashboardBox>
  );
};

export default BitcoinBox;
