import type { FC } from "react";
import type { AppQueryError, AppStatus } from "@/models/app-status";
import { availableApps } from "@/utils/availableApps";
import AppCard from "./AppCard";

type Props = {
  title: string;
  apps: AppStatus[];
  onInstall: (id: string) => void;
  errors?: AppQueryError[];
};

const AppList: FC<Props> = ({ title, apps, onInstall, errors = [] }) => {
  // Create a map of errors by app id for quick lookup
  const errorMap = new Map<string, string>();
  errors.reduce((map, error) => {
    if (error.id && error.error) {
      map.set(error.id, error.error);
    }
    return map;
  }, errorMap);

  return (
    <section className="flex h-full flex-wrap">
      <h2 className="w-full pb-5 pt-8 text-xl font-bold text-gray-200">
        {title}
      </h2>
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
        {apps.map((appStatus: AppStatus) => {
          // Check if there's an error for this app
          const error =
            errorMap.get(appStatus.id) || appStatus.error || undefined;

          // Get the app info from availableApps, or create a fallback if not available
          const appInfo = availableApps[appStatus.id] || {
            id: appStatus.id,
            name: appStatus.id.charAt(0).toUpperCase() + appStatus.id.slice(1), // Capitalize first letter
            repository: "",
            category: "other",
          };

          return (
            <AppCard
              key={appStatus.id}
              appInfo={appInfo}
              appStatusInfo={appStatus}
              installed={appStatus.installed}
              installingApp={null}
              onInstall={onInstall}
              error={error}
            />
          );
        })}
      </div>
    </section>
  );
};

export default AppList;
