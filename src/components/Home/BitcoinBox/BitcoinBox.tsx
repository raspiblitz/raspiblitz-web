import { FC, useContext } from 'react';
import { ReactComponent as BitcoinLogo } from '../../../assets/bitcoin-circle.svg';
import DashboardBox from '../../../container/DashboardBox/DashboardBox';
import SendRecvBtn from '../../../container/DashboardBox/SendRecvBtn/SendRecvBtn';
import { AppContext } from '../../../store/app-context';
import TransactionList from '../../Shared/TransactionList/TransactionList';

const BitcoinBox: FC<BitcoinBoxProps> = (props) => {
  const appCtx = useContext(AppContext);
  const syncStatus = props.syncStatus ? props.syncStatus + ' % Synchronized' : 'Checking Sync ...';
  const balance = props.balance ? props.balance : 'Loading ...';
  const logo = <BitcoinLogo className='w-10 h-10' />;

  return (
    <DashboardBox name={props.name} addText={syncStatus} logo={logo}>
      <div className='py-3 px-5'>
        {balance} {appCtx.unit}
      </div>
      <TransactionList transactions={props.transactions} />
      {/* Buttons on Bottom (Send / Receive) */}
      <SendRecvBtn send={props.send} receive={props.receive} />
    </DashboardBox>
  );
};

export default BitcoinBox;

export interface BitcoinBoxProps {
  syncStatus: number | null;
  balance: number;
  name: string;
  transactions: any[];
  send: () => void;
  receive: () => void;
}
