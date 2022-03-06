import type { FC } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { availableApps } from "../util/availableApps";
import AppCard from "../components/Apps/AppCard/AppCard";
import AppInfo from "../components/Apps/AppInfo/AppInfo";
import useSSE from "../hooks/use-sse";
import { App } from "../models/app.model";
import { instance } from "../util/interceptor";
import { enableGutter } from "../util/util";

export const Apps: FC = () => {
  const { t } = useTranslation(["translation", "apps"]);
  const { appStatus, installingAppId } = useSSE();
  const [showDetails, setShowDetails] = useState(false);
  const [app, setApp] = useState<App | null>(null);
  const appStatusIds = appStatus.map((appStatus) => appStatus.id);

  const installedApps = Array.from(availableApps.keys()).filter((appId) =>
    appStatusIds.includes(appId)
  );
  const notInstalledApps = Array.from(availableApps.keys()).filter(
    (appId) => !appStatusIds.includes(appId)
  );

  useEffect(() => {
    enableGutter();
  }, []);

  const installHandler = (id: string) => {
    instance.post(`apps/install/${id}`).catch(() => {
      // TODO: handle error & show notification on install if endpoint exists in blitz_api
    });
  };

  const uninstallHandler = (id: string) => {
    instance.post(`apps/uninstall/${id}`).catch(() => {
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

  if (showDetails && app) {
    return (
      <AppInfo
        app={app}
        installingAppId={installingAppId}
        onInstall={() => installHandler(app.id)}
        onUninstall={() => uninstallHandler(app.id)}
        installed={appStatusIds.includes(app.id)}
        onClose={closeDetailsHandler}
      />
    );
  }

  return (
    <main className="content-container page-container bg-gray-100 transition-colors dark:bg-gray-700 dark:text-white">
      <section className="flex h-full flex-1 flex-wrap">
        <h2 className="w-full px-5 pt-8 pb-5 text-xl font-bold dark:text-gray-200">
          {t("apps.installed")}
        </h2>
        {/* TODO: make address / hiddenService faster */}
        {installedApps.map((appId: string) => {
          return (
            <article className="w-full p-3 lg:w-1/3" key={appId}>
              <AppCard
                app={availableApps.get(appId)!}
                installed={true}
                installingAppId={null}
                onInstall={() => installHandler(appId)}
                onOpenDetails={openDetailsHandler}
                address={appStatus.find((a) => a.id === appId)?.address}
                hiddenService={
                  appStatus.find((a) => a.id === appId)?.hiddenService
                }
              />
            </article>
          );
        })}
      </section>

      <section className="flex h-full flex-1 flex-wrap">
        <h2 className="block w-full px-5 pt-8 pb-5 text-xl font-bold dark:text-gray-200 ">
          {t("apps.available")}
        </h2>
        {notInstalledApps.map((appId: string) => {
          return (
            <article className="w-full p-3 lg:w-1/3" key={appId}>
              <AppCard
                app={availableApps.get(appId)!}
                installed={false}
                installingAppId={installingAppId}
                onInstall={() => installHandler(appId)}
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
