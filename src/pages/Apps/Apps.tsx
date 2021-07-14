import { useEffect, useState } from 'react';
import AppInfo from '../../components/AppsComponents/AppInfo/AppInfo';
import AppCard from '../../components/AppsComponents/AppCard/AppCard';
import useSSE from '../../hooks/use-sse';
import { createRequest } from '../../util/util';
import { useTranslation } from 'react-i18next';

export const Apps = () => {
  const { t } = useTranslation();
  const { availableApps, isInstalling } = useSSE();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const installHandler = (id: string) => {
    const req = createRequest('install', 'POST', JSON.stringify({ id }));
    fetch(req);
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
    fetch(createRequest('apps', 'GET'));
  }, []);

  return (
    <>
      {isDetailsOpen && <AppInfo id={id} onClose={closeDetailsHandler} />}
      {!isDetailsOpen && (
        <div className='content-container page-container dark:text-white'>
          <div className='h-full flex flex-wrap flex-1'>
            <div className='w-full text-xl font-bold px-5 pt-8 pb-5 dark:text-gray-200'>{t('apps.installed')}</div>
            {availableApps
              .filter((app: any) => app.installed)
              .map((app: any, index) => {
                return (
                  <div className='w-full lg:w-1/3 p-3' key={index}>
                    <AppCard
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
            <div className='block w-full text-xl font-bold px-5 pt-8 pb-5 dark:text-gray-200 '>
              {t('apps.available')}
            </div>
            {availableApps
              .filter((app: any) => !app.installed)
              .map((app: any, index) => {
                return (
                  <div className='w-full lg:w-1/3 p-3' key={index}>
                    <AppCard
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
      )}
    </>
  );
};

export default Apps;
