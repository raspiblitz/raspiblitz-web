import { FC, useContext } from 'react';
import { ReactComponent as BitcoinLogo } from '../../assets/bitcoin-circle.svg';
import DashboardBox from '../../container/DashboardBox/DashboardBox';
import SendRecvBtn from '../../container/DashboardBox/SendRecvBtn/SendRecvBtn';
import { AppContext } from '../../store/app-context';
import TransactionList from './TransactionList/TransactionList';

const Wallet: FC<WalletProps> = (props) => {
  const appCtx = useContext(AppContext);
  const syncStatus = props.syncStatus ? props.syncStatus + ' % Synchronized' : 'Checking Sync ...';
  const logo = <BitcoinLogo className='w-10 h-10' />;
  const onchainBalance = appCtx.unit === 'BTC' ? props.onchainBalance : Math.round(props.onchainBalance * 100_000_000);
  const lnBalance = appCtx.unit === 'BTC' ? props.lnBalance : Math.round(props.lnBalance * 100_000_000);

  return (
    <DashboardBox name={'Wallet'} addText={syncStatus} logo={logo}>
      <div className='py-3 px-5'>
        <div className='flex flex-col'>
          <div>
            on-chain: {onchainBalance} {appCtx.unit}
          </div>
          <div>
            lightning: {lnBalance} {appCtx.unit}
          </div>
        </div>
      </div>
      <TransactionList transactions={props.transactions} />
      {/* Buttons on Bottom (Send / Receive) */}
      <SendRecvBtn send={props.send} receive={props.receive} />
    </DashboardBox>
  );
};

export default Wallet;

export interface WalletProps {
  syncStatus: number | null;
  onchainBalance: number;
  lnBalance: number;
  transactions: any[];
  send: () => void;
  receive: () => void;
}
