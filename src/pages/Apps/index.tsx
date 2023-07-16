import type { FC } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import useSSE from "../../hooks/use-sse";
import { AppStatus } from "../../models/app-status";
import { App } from "../../models/app.model";
import { enableGutter } from "../../utils";
import { availableApps } from "../../utils/availableApps";
import { checkError } from "../../utils/checkError";
import { instance } from "../../utils/interceptor";
import AppCard from "./AppCard";
import AppCardAlby from "./AppCardAlby";
import AppInfo from "./AppInfo";
import AppInfoAlby from "./AppInfoAlby";

export const Apps: FC = () => {
  const { t } = useTranslation(["translation", "apps"]);

  const { appStatus, installingApp } = useSSE();

  const [showDetails, setShowDetails] = useState(false);
  const [app, setApp] = useState<App | null>(null);

  useEffect(() => {
    enableGutter();
  }, []);

  // on every render sort installed & uninstalled app keys
  const installedApps = appStatus.filter((app: AppStatus) => {
    return app.installed;
  });
  const notInstalledApps = appStatus.filter((app: AppStatus) => {
    return !app.installed;
  });

  // in case no App data received yet => show loading
  const isLoading = appStatus.length === 0;

  const installHandler = (id: string) => {
    instance.post(`apps/install/${id}`).catch((err) => {
      toast.error(checkError(err));
    });
  };

  const uninstallHandler = (id: string) => {
    instance.post(`apps/uninstall/${id}`, { keepData: true }).catch((err) => {
      toast.error(checkError(err));
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
    let appInfos;
    if (app.id === "alby") {
      return <AppInfoAlby app={app} onClose={closeDetailsHandler} />;
    } else {
      appInfos = appStatus.find((a) => a.id === app.id)!;
      return (
        <AppInfo
          app={app}
          appStatusInfo={appInfos}
          installingApp={installingApp}
          onInstall={() => installHandler(app.id)}
          onUninstall={() => uninstallHandler(app.id)}
          onClose={closeDetailsHandler}
        />
      );
    }
  }

  return (
    <main className="content-container page-container bg-gray-100 p-5 transition-colors dark:bg-gray-700 dark:text-white lg:pb-8 lg:pr-8 lg:pt-8">
      {isLoading && (
        <section className="content-container flex items-center justify-center">
          <LoadingSpinner color="text-yellow-500" />
        </section>
      )}
      {!isLoading && (
        <>
          <section className="flex h-full flex-wrap">
            <h2 className="w-full pb-5 pt-8 text-xl font-bold dark:text-gray-200">
              {t("apps.installed")}
            </h2>
            <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
              {installedApps.map((appStatus: AppStatus) => {
                return (
                  <article key={appStatus.id}>
                    <AppCard
                      appInfo={availableApps.get(appStatus.id)!}
                      appStatusInfo={appStatus}
                      installed={true}
                      installingApp={null}
                      onInstall={() => installHandler(appStatus.id)}
                      onOpenDetails={openDetailsHandler}
                    />
                  </article>
                );
              })}
            </div>
          </section>
          <section className="flex h-full flex-wrap">
            <h2 className="block w-full pb-5 pt-8 text-xl font-bold dark:text-gray-200">
              {t("apps.available")}
            </h2>
            <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
              {notInstalledApps.map((appStatus: AppStatus) => {
                return (
                  <article key={appStatus.id}>
                    <AppCard
                      appInfo={availableApps.get(appStatus.id)!}
                      appStatusInfo={appStatus}
                      installed={false}
                      installingApp={installingApp}
                      onInstall={() => installHandler(appStatus.id)}
                      onOpenDetails={openDetailsHandler}
                    />
                  </article>
                );
              })}

              <article>
                <AppCardAlby
                  appInfo={availableApps.get("alby")!}
                  onOpenDetails={openDetailsHandler}
                />
              </article>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Apps;
