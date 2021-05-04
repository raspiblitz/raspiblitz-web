import { ReactComponent as LightningLogo } from '../../../assets/lightning.svg';
import DashboardBox from '../../../container/DashboardBox/DashboardBox';
import SendRecvBtn from '../../../container/DashboardBox/SendRecvBtn/SendRecvBtn';
import TransactionList from '../TransactionList/TransactionList';

const LNBox = (props: any) => {
  const syncStatus = props.syncStatus ? props.syncStatus + ' % Synchronized' : 'Checking Sync ...';
  const balance = props.balance ? props.balance : 'Loading ...';
  const logo = <LightningLogo className='w-10 h-10' />;

  return (
    <DashboardBox name={props.name} sync={syncStatus} logo={logo}>
      <div className='py-3 px-5'>{balance}</div>
      <TransactionList transactions={props.transactions} />
      {/* Buttons on Bottom (Send / Receive) */}
      <SendRecvBtn send={props.send} receive={props.receive} />
    </DashboardBox>
  );
};

export default LNBox;
