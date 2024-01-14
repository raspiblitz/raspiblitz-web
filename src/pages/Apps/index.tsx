import useSSE from "@/hooks/use-sse";
import PageLoadingScreen from "@/layouts/PageLoadingScreen";
import { AppStatus } from "@/models/app-status";
import { App } from "@/models/app.model";
import { enableGutter } from "@/utils";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import AppCardAlby from "./AppCardAlby";
import AppInfo from "./AppInfo";
import AppList from "./AppList";

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
    const appInfos = appStatus.find((a) => a.id === app.id)!;
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

  // in case no App data received yet => show loading screen
  if (appStatus.length === 0) {
    return <PageLoadingScreen />;
  }

  return (
    <main className="content-container page-container bg-gray-100 p-5 transition-colors dark:bg-gray-700 dark:text-white lg:pb-8 lg:pr-8 lg:pt-8">
      <>
        <AppList
          apps={installedApps}
          title={t("apps.installed")}
          onInstall={installHandler}
          onOpenDetails={openDetailsHandler}
        />
        <AppList
          apps={notInstalledApps}
          title={t("apps.available")}
          onInstall={installHandler}
          onOpenDetails={openDetailsHandler}
        />
        <section className="flex h-full flex-wrap pt-8">
          <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
            <AppCardAlby />
          </div>
        </section>
      </>
    </main>
  );
};

export default Apps;
