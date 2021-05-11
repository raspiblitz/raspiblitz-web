import { FC } from 'react';
import { ReactComponent as LightningLogo } from '../../assets/lightning.svg';
import DashboardBox from '../../container/DashboardBox/DashboardBox';

const StatusBox: FC<any> = (props) => {
  const syncStatus = props.syncStatus ? props.syncStatus + ' % Synchronized' : 'Checking Sync ...';
  const logo = <LightningLogo className='w-10 h-10' />;

  return <DashboardBox name={props.name} addText={syncStatus} logo={logo}></DashboardBox>;
};

export default StatusBox;

export interface LNBoxProps {
  syncStatus: number | null;
  name: string;
  transactions: any[];
  send: () => void;
  receive: () => void;
}
