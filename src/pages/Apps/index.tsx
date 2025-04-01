import { SSEContext } from "@/context/sse-context";
import PageLoadingScreen from "@/layouts/PageLoadingScreen";
import type { AppStatus } from "@/models/app-status";
import { enableGutter } from "@/utils";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import type { FC } from "react";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import AppCardAlby from "./AppCardAlby";
import AppList from "./AppList";
import AppStatusRefresh from "./AppStatusRefresh";

export const Apps: FC = () => {
  const { t } = useTranslation(["translation", "apps"]);
  const { lnInfo, appStatus } = useContext(SSEContext);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    enableGutter();
  }, []);

  // Listen to SSE events for app state updating
  useEffect(() => {
    const handleAppStateUpdating = () => {
      setIsUpdating(true);
    };

    const handleAppStateUpdateSuccess = () => {
      setIsUpdating(false);
    };

    // Add event listeners
    window.addEventListener("app_state_updating", handleAppStateUpdating);
    window.addEventListener(
      "app_state_updating_success",
      handleAppStateUpdateSuccess,
    );

    // Clean up event listeners
    return () => {
      window.removeEventListener("app_state_updating", handleAppStateUpdating);
      window.removeEventListener(
        "app_state_updating_success",
        handleAppStateUpdateSuccess,
      );
    };
  }, []);

  // alby hub only works on LND currently, so we filter the entry out on non LND nodes
  const filteredAppData =
    lnInfo.implementation !== "LND_GRPC"
      ? appStatus.data.filter((app: AppStatus) => app.id !== "albyhub")
      : appStatus.data;

  // on every render sort installed & uninstalled app keys
  const installedApps = filteredAppData.filter((app: AppStatus) => {
    return app.installed;
  });

  const notInstalledApps = filteredAppData.filter((app: AppStatus) => {
    return !app.installed;
  });

  // Create app status entries for apps that only have errors but no data entry
  const errorOnlyApps: AppStatus[] = [];

  // Process error-only apps that aren't already in data
  if (appStatus.errors && appStatus.errors.length > 0) {
    const existingAppIds = new Set(appStatus.data.map((app) => app.id));

    for (const errorEntry of appStatus.errors) {
      // Only add if this app isn't already in the data array
      if (!existingAppIds.has(errorEntry.id)) {
        errorOnlyApps.push({
          id: errorEntry.id,
          installed: false, // Assume not installed since we can't determine
          version: "unknown", // Version can't be determined
          error: errorEntry.error,
        });
      }
    }
  }

  // Append error-only apps to the not installed apps list
  const allNotInstalledApps = [...notInstalledApps, ...errorOnlyApps];

  const installHandler = (id: string) => {
    instance.post(`apps/install/${id}`).catch((err) => {
      toast.error(checkError(err));
    });
  };

  // in case no App data received yet => show loading screen
  if (appStatus.data.length === 0) {
    return <PageLoadingScreen />;
  }

  return (
    <main className="content-container page-container bg-gray-700 p-5 text-white transition-colors lg:pb-8 lg:pr-8 lg:pt-8">
      <>
        <AppStatusRefresh />

        <AppList
          apps={installedApps}
          title={t("apps.installed")}
          onInstall={installHandler}
          errors={appStatus.errors}
        />

        <AppList
          apps={allNotInstalledApps}
          title={t("apps.available")}
          onInstall={installHandler}
          errors={appStatus.errors}
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
