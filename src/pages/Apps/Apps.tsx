import { useEffect } from 'react';
import AppInstallCard from '../../components/AppsComponents/AppInstallCard/AppInstallCard';
import useSSE from '../../hooks/use-sse';

export const Apps = () => {
  const { availableApps, isInstalling } = useSSE();

  const installHandler = (id: string) => {
    fetch('http://localhost:8080/install/', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  };

  // call to get available apps
  useEffect(() => {
    fetch('http://localhost:8080/apps');
  }, []);

  return (
    <div className='mobile-container md:content-container w-full dark:text-white overflow-y-auto transition-colors'>
      <div className='h-full flex flex-wrap flex-1'>
        <div className='w-full text-xl font-bold px-5 pt-8 pb-5 dark:text-gray-200'>Installed</div>
        {availableApps
          .filter((app: any) => app.installed)
          .map((app: any, index) => {
            return (
              <div className='w-full lg:w-1/3 p-3' key={index}>
                <AppInstallCard
                  id={app.id}
                  installing={false}
                  name={app.name}
                  description={app.description}
                  onInstall={installHandler.bind(null, app.id)}
                  installed={app.installed}
                  address={app.address}
                />
              </div>
            );
          })}
        <div className='block w-full text-xl font-bold px-5 pt-8 pb-5 dark:text-gray-200 '>Available Apps</div>
        {availableApps
          .filter((app: any) => !app.installed)
          .map((app: any, index) => {
            return (
              <div className='w-full lg:w-1/3 p-3' key={index}>
                <AppInstallCard
                  id={app.id}
                  name={app.name}
                  installing={!!isInstalling}
                  description={app.description}
                  onInstall={installHandler.bind(null, app.id)}
                  installed={app.installed}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Apps;
