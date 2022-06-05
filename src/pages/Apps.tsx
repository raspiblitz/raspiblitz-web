import type { FC } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import AppCard from "../components/Apps/AppCard/AppCard";
import AppInfo from "../components/Apps/AppInfo/AppInfo";
import LoadingSpinner from "../components/Shared/LoadingSpinner/LoadingSpinner";
import useSSE from "../hooks/use-sse";
import { AppStatus } from "../models/app-status";
import { App } from "../models/app.model";
import { availableApps } from "../util/availableApps";
import { instance } from "../util/interceptor";
import { enableGutter } from "../util/util";

export const Apps: FC = () => {
  const { t } = useTranslation(["translation", "apps"]);

  const { appStatus, installingApp } = useSSE();

  const [showDetails, setShowDetails] = useState(false);
  const [app, setApp] = useState<App | null>(null);

  useEffect(() => {
    enableGutter();
  }, []);

  // on every render sort installed & uninstalled app keys
  const installedAppsData = appStatus.filter((app: AppStatus) => {
    return app.installed;
  });
  const installedApps = Array.from(installedAppsData, (app: AppStatus) => {
    return app.id;
  });
  const notInstalledAppsData = appStatus.filter((app: AppStatus) => {
    return !app.installed;
  });
  const notInstalledApps = Array.from(
    notInstalledAppsData,
    (app: AppStatus) => {
      return app.id;
    }
  );

  // in case no App data received yet .. show loading
  const isLoading = appStatus.length === 0;

  const getAppStatus: any = (id: string, datafield: string) => {
    // return AppStatus from SSE context if available (always the latest updates)
    const fromSSE: any = appStatus.find((a) => a.id === id);
    if (fromSSE && fromSSE[datafield]) return fromSSE[datafield];
    return null;
  };

  const installHandler = (id: string) => {
    instance.post(`apps/install/${id}`).catch((err) => {
      toast.error(err.response.data.detail || err.response.data);
    });
  };

  const uninstallHandler = (id: string) => {
    instance.post(`apps/uninstall/${id}`, { keepData: true }).catch((err) => {
      toast.error(err.response.data.detail || err.response.data);
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
        installingApp={installingApp}
        onInstall={() => installHandler(app.id)}
        onUninstall={() => uninstallHandler(app.id)}
        installed={getAppStatus(app.id, "installed")}
        onClose={closeDetailsHandler}
      />
    );
  }

  return (
    <main className="content-container page-container bg-gray-100 transition-colors dark:bg-gray-700 dark:text-white">
      {isLoading && (
        <section className="content-container flex items-center justify-center">
          <LoadingSpinner color="text-yellow-500" />
        </section>
      )}
      {!isLoading && (
        <div>
          <section className="flex h-full flex-wrap">
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
                    installingApp={null}
                    onInstall={() => installHandler(appId)}
                    onOpenDetails={openDetailsHandler}
                    address={getAppStatus(appId, "address")}
                    hiddenService={getAppStatus(appId, "hiddenService")}
                  />
                </article>
              );
            })}
          </section>
          <section className="flex h-full flex-wrap">
            <h2 className="block w-full px-5 pt-8 pb-5 text-xl font-bold dark:text-gray-200 ">
              {t("apps.available")}
            </h2>
            {notInstalledApps.map((appId: string) => {
              return (
                <article className="w-full p-3 lg:w-1/3" key={appId}>
                  <AppCard
                    app={availableApps.get(appId)!}
                    installed={false}
                    installingApp={installingApp}
                    onInstall={() => installHandler(appId)}
                    onOpenDetails={openDetailsHandler}
                  />
                </article>
              );
            })}
          </section>
        </div>
      )}
    </main>
  );
};

export default Apps;
