import { FC, useContext } from 'react';
import { ReactComponent as BitcoinLogo } from '../../assets/bitcoin-circle.svg';
import DashboardBox from '../../container/DashboardBox/DashboardBox';
import SendRecvBtn from '../../container/DashboardBox/SendRecvBtn/SendRecvBtn';
import { AppContext } from '../../store/app-context';
import LoadingSpinner from '../Shared/LoadingSpinner/LoadingSpinner';
import TransactionList from './TransactionList/TransactionList';

const Wallet: FC<WalletProps> = (props) => {
  const appCtx = useContext(AppContext);
  const syncStatus = props.syncStatus ? props.syncStatus + ' % Synchronized' : 'Checking Sync ...';
  const logo = <BitcoinLogo className='w-10 h-10' />;
  const onchainBalance =
    appCtx.unit === 'BTC'
      ? props.onchainBalance.toLocaleString()
      : Math.round(props.onchainBalance * 100_000_000).toLocaleString();
  const lnBalance =
    appCtx.unit === 'BTC'
      ? props.lnBalance.toLocaleString()
      : Math.round(props.lnBalance * 100_000_000).toLocaleString();

  return (
    <DashboardBox name={'Wallet'} addText={syncStatus} logo={logo}>
      {props.isLoading && (
        <div className='h-full flex justify-center items-center'>
          <LoadingSpinner />
        </div>
      )}
      {!props.isLoading && (
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
      )}
      {!props.isLoading && <TransactionList showDetails={props.showDetails} transactions={props.transactions} />}
      {/* Buttons on Bottom (Send / Receive) */}
      <SendRecvBtn send={props.send} receive={props.receive} />
    </DashboardBox>
  );
};

export default Wallet;

export interface WalletProps {
  isLoading: boolean;
  syncStatus: number | null;
  onchainBalance: number;
  lnBalance: number;
  transactions: any[];
  send: () => void;
  receive: () => void;
  showDetails: (id: string) => void;
}
