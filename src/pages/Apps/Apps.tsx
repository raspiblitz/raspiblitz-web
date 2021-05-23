import { useEffect } from 'react';
import AppInstallCard from '../../components/BDesign/AppInstallCard/AppInstallCard';
import useSSE from '../../hooks/use-sse';

export const Apps = () => {
  const { availableApps } = useSSE();

  const install = () => {};

  // call to get available apps
  useEffect(() => {
    fetch('http://localhost:8080/apps');
  }, []);

  return (
    <div className='content-container overflow-y-auto w-full dark:text-white transition-colors'>
      <div className='h-full flex flex-wrap flex-initial'>
        {availableApps.map((app: any, index) => {
          return (
            <div className='w-full md:w-1/3 p-3 h-auto inline-block' key={index}>
              <AppInstallCard
                id={app.id}
                name={app.name}
                description={app.description}
                onInstall={install}
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
