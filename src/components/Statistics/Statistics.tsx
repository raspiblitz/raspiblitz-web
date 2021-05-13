import { FC } from 'react';
import { ReactComponent as LightningLogo } from '../../assets/lightning.svg';
import DashboardBox from '../../container/DashboardBox/DashboardBox';

const Statistics: FC = () => {
  const logo = <LightningLogo className='w-10 h-10' />;

  const categoryClasses = 'w-full py-1 text-center bg-gray-200 font-bold shadow-sm dark:bg-gray-500';
  const itemClasses = 'text-center px-4 py-3 hover:bg-gray-300 dark:hover:bg-gray-600';

  return (
    <DashboardBox name={'Info'} addText={'Raspiblitz Stats'} logo={logo}>
      <div className='pt-5' />
      <div className='max-h-72 xl:max-h-112 overflow-y-auto transform'>
        {/* Connect Stats */}
        <div className={categoryClasses}>Connect</div>
        <ul>
          {/* TODO: Add Copy functionality */}
          <li className={`${itemClasses} overflow-hidden overflow-ellipsis`}>
            Tor: pg6mmjiyjmcrsslvykfwnntlaru7p5svn6y2ymmju6nubxndf4pscryd.onion:1234
          </li>
          <li className={itemClasses}>SSH: admin@192.168.0.100</li>
          <li className={itemClasses}>Web admin: http://192.168.0.111:3000</li>
        </ul>
        {/* Bitcoin Stats */}
        <div className={categoryClasses}>Bitcoin</div>
        <ul className='max-h-60 md:max-h-80 xl:max-h-112 overflow-y-auto'>
          <li className={itemClasses}>bitcoin v0.21.0 mainnet 15 peers connected</li>
          <li className={itemClasses}>Sync: Block 683322/683322</li>
        </ul>
        {/* Lightning Stats */}
        <div className={categoryClasses}>Lightning</div>
        <ul className='max-h-60 md:max-h-80 xl:max-h-112 overflow-y-auto'>
          <li className={itemClasses}>LND 0.12.1-beta</li>
          <li className={itemClasses}>10/11 Channels 0302020202 sat 10 peers</li>
          <li className={itemClasses}>Fee Report (D-W-M): 1-2-3 sat</li>
        </ul>
      </div>
    </DashboardBox>
  );
};

export default Statistics;
