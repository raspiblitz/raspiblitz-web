import { FC } from 'react';
import { ReactComponent as LightningLogo } from '../../assets/lightning.svg';
import DashboardBox from '../../container/DashboardBox/DashboardBox';

const StatusBox: FC = (props) => {
  const logo = <LightningLogo className='w-10 h-10' />;

  return <DashboardBox name={'Stats'} addText={''} logo={logo}></DashboardBox>;
};

export default StatusBox;
