import { useEffect } from 'react';
import AppInstallCard from '../../components/BDesign/AppInstallCard/AppInstallCard';
import useSSE from '../../hooks/use-sse';

export const Apps = () => {
  const { availableApps } = useSSE();

  const installHandler = (id: string) => {
    fetch('http://localhost:8080/install/');
  };

  // call to get available apps
  useEffect(() => {
    fetch('http://localhost:8080/apps');
  }, []);

  return (
    <div className='mobile-container md:content-container overflow-y-auto w-full dark:text-white transition-colors'>
      <div className='h-full flex flex-wrap flex-1'>
        <div className='block w-full text-xl font-bold p-3 dark:text-gray-200'>Installed</div>
        {availableApps
          .filter((app: any) => app.installed)
          .map((app: any, index) => {
            return (
              <div className='w-full lg:w-1/3 p-3 h-auto inline-block' key={index}>
                <AppInstallCard
                  id={app.id}
                  name={app.name}
                  description={app.description}
                  onInstall={installHandler.bind(null, app.id)}
                  installed={app.installed}
                />
              </div>
            );
          })}
        <div className='block w-full text-xl font-bold p-3 dark:text-gray-200'>Available Apps</div>
        {availableApps
          .filter((app: any) => !app.installed)
          .map((app: any, index) => {
            return (
              <div className='w-full lg:w-1/3 p-3 h-auto inline-block' key={index}>
                <AppInstallCard
                  id={app.id}
                  name={app.name}
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
