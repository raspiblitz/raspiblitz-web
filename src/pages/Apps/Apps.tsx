import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppCard from '../../components/Apps/AppCard/AppCard';
import AppInfo from '../../components/Apps/AppInfo/AppInfo';
import useSSE from '../../hooks/use-sse';
import { App } from '../../models/app.model';
import { instance } from '../../util/interceptor';

export const Apps: FC = () => {
  const { t } = useTranslation();
  const { availableApps, isInstalling } = useSSE();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const installHandler = (id: string) => {
    instance.post('install', { id });
  };

  const openDetailsHandler = (id: string) => {
    setId(id);
    setIsDetailsOpen(true);
  };
  const closeDetailsHandler = () => {
    setId(null);
    setIsDetailsOpen(false);
  };

  return (
    <main className='content-container page-container dark:text-white bg-gray-100 dark:bg-gray-700 transition-colors'>
      {isDetailsOpen && <AppInfo id={id} onClose={closeDetailsHandler} />}
      {!isDetailsOpen && (
        <>
          <section className='h-full flex flex-wrap flex-1'>
            <h2 className='w-full text-xl font-bold px-5 pt-8 pb-5 dark:text-gray-200'>{t('apps.installed')}</h2>
            {availableApps
              .filter((app: App) => app.installed)
              .map((app: App, index) => {
                return (
                  <article className='w-full lg:w-1/3 p-3' key={index}>
                    <AppCard
                      app={app}
                      installing={false}
                      onInstall={() => installHandler(app.id)}
                      onOpenDetails={openDetailsHandler}
                    />
                  </article>
                );
              })}
          </section>

          <section className='h-full flex flex-wrap flex-1'>
            <h2 className='block w-full text-xl font-bold px-5 pt-8 pb-5 dark:text-gray-200 '>{t('apps.available')}</h2>
            {availableApps
              .filter((app: App) => !app.installed)
              .map((app: App) => {
                return (
                  <article className='w-full lg:w-1/3 p-3' key={app.id}>
                    <AppCard
                      app={app}
                      installing={!!isInstalling}
                      onInstall={() => installHandler(app.id)}
                      onOpenDetails={openDetailsHandler}
                    />
                  </article>
                );
              })}
          </section>
        </>
      )}
    </main>
  );
};

export default Apps;
