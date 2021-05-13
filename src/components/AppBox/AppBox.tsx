import { FC } from 'react';
import { ReactComponent as AppLogo } from '../../assets/apps.svg';
import DashboardBox from '../../container/DashboardBox/DashboardBox';

const AppBox: FC<AppList> = (props) => {
  const appCount = props.apps.length;
  const onlineAppCount = props.apps.filter((s) => s.status === 'online').length;
  const logo = <AppLogo className='w-10 h-10' />;

  return (
    <DashboardBox name={'Apps'} addText={`${onlineAppCount} / ${appCount} Apps online`} logo={logo}>
      <ul className='px-4 pt-5 max-h-72 xl:max-h-112 overflow-y-auto transform'>
        {!props.apps.length && <div className='flex justify-center items-center'>No Apps installed!</div>}
        {props.apps.map((service: App, index: number) => {
          return (
            <li key={index} className='flex py-4'>
              <div className='w-9/12 font-bold text-center'>{service.name}</div>
              <div className='w-3/12 flex justify-end items-center'>
                <div
                  className={`w-3 h-3 border border-black align-middle rounded-full ${
                    service.status === 'online' ? 'bg-green-400' : 'bg-red-500'
                  }`}
                ></div>
                <div className='italic text-gray-600 dark:text-gray-400'>&nbsp; {service.status}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </DashboardBox>
  );
};

export default AppBox;

export interface AppList {
  apps: App[];
}

export interface App {
  name: string;
  status: 'online' | 'offline';
}
