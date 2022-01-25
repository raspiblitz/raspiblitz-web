import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import AppCard from "../../components/Apps/AppCard/AppCard";
import AppInfo from "../../components/Apps/AppInfo/AppInfo";
import useSSE from "../../hooks/use-sse";
import { App } from "../../models/app.model";
import availableApps from "../../apps/apps.json";
import { instance } from "../../util/interceptor";

export const Apps: FC = () => {
  const { t } = useTranslation(["translation", "apps"]);
  const { isInstalling } = useSSE();
  const [showDetails, setShowDetails] = useState(false);
  const [app, setApp] = useState<App | null>(null);

  const installHandler = (id: string) => {
    instance.post("install", { id }).catch(() => {
      // TODO: handle error & show notification on install if endpoint exists in blitz_api
    });
  };

  const openDetailsHandler = (app: App) => {
    setApp(app);
    setShowDetails(true);
  };
  const closeDetailsHandler = () => {
    setApp(null);
    setShowDetails(false);
  };

  if (showDetails) {
    return <AppInfo app={app!} onClose={closeDetailsHandler} />;
  }

  return (
    <main className="content-container page-container bg-gray-100 transition-colors dark:bg-gray-700 dark:text-white">
      <section className="flex h-full flex-1 flex-wrap">
        <h2 className="w-full px-5 pt-8 pb-5 text-xl font-bold dark:text-gray-200">
          {t("apps.installed")}
        </h2>
        {(availableApps as App[])
          .filter((app: App) => app.installed)
          .map((app: App, index) => {
            return (
              <article className="w-full p-3 lg:w-1/3" key={index}>
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

      <section className="flex h-full flex-1 flex-wrap">
        <h2 className="block w-full px-5 pt-8 pb-5 text-xl font-bold dark:text-gray-200 ">
          {t("apps.available")}
        </h2>
        {(availableApps as App[])
          .filter((app: App) => !app.installed)
          .map((app: App) => {
            return (
              <article className="w-full p-3 lg:w-1/3" key={app.id}>
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
    </main>
  );
};

export default Apps;
