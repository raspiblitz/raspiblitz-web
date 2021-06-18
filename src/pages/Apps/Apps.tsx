import { useEffect, useState } from 'react';
import AppInfo from '../../components/AppsComponents/AppInfo/AppInfo';
import AppInstallCard from '../../components/AppsComponents/AppInstallCard/AppInstallCard';
import useSSE from '../../hooks/use-sse';

export const Apps = () => {
  const { availableApps, isInstalling } = useSSE();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const installHandler = (id: string) => {
    fetch('http://localhost:8080/install/', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  };

  const openDetailsHandler = (id: string) => {
    setId(id);
    setIsDetailsOpen(true);
  };
  const closeDetailsHandler = () => {
    setId(null);
    setIsDetailsOpen(false);
  };

  // call to get available apps
  useEffect(() => {
    fetch('http://localhost:8080/apps');
  }, []);

  return (
    <div className='mobile-container md:content-container w-full dark:text-white overflow-y-auto transition-colors'>
      {isDetailsOpen && <AppInfo id={id} onClose={closeDetailsHandler} />}
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
                  onInstall={() => installHandler(app.id)}
                  installed={app.installed}
                  address={app.address}
                  onOpenDetails={openDetailsHandler}
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
                  onInstall={() => installHandler(app.id)}
                  installed={app.installed}
                  onOpenDetails={openDetailsHandler}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Apps;
