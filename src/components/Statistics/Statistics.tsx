import { FC } from 'react';
import { ReactComponent as LightningLogo } from '../../assets/lightning.svg';
import DashboardBox from '../../container/DashboardBox/DashboardBox';

const Statistics: FC = () => {
  const logo = <LightningLogo className='w-10 h-10' />;
  const liClassNames = 'text-center px-4 py-3 hover:bg-gray-300 dark:hover:bg-gray-600';

  return (
    <DashboardBox name={'Info'} addText={'Raspiblitz Stats'} logo={logo}>
      <ul className='pt-5 max-h-60 md:max-h-80 xl:max-h-112 overflow-y-auto'>
        <li className={liClassNames}>bitcoin v0.21.0 mainnet 15 peers</li>
        <li className={liClassNames}>Blocks 683322/683322 Sync OK 100.00%</li>
        <li className={liClassNames}>LND 0.12.1-beta wallet 1111111111111 sat</li>
        <li className={liClassNames}>10/11 Channels 0302020202 sat 10 peers</li>
        <li className={liClassNames}>Fee Report (D-W-M): 1-2-3 sat</li>
        {/* Add Copy functionality */}
        <li className={liClassNames}>Tor: pg6mmjiyjmcrsslvykfwnntlaru7p5svn6y2ymmju6nubxndf4pscryd.onion:1234</li>
        <li className={liClassNames}>SSH: admin@192.168.0.100</li>
        <li className={liClassNames}>Web admin: http://192.168.0.111:3000</li>
        <li className={liClassNames}>X Peers</li>
        <li className={liClassNames}>X Peers</li>
      </ul>
    </DashboardBox>
  );
};

export default Statistics;
