import { AppStatus } from "@/models/app-status";
import { App } from "@/models/app.model";
import { availableApps } from "@/utils/availableApps";
import { FC } from "react";
import AppCard from "./AppCard";

type Props = {
  title: string;
  apps: AppStatus[];
  onInstall: (id: string) => void;
  onOpenDetails: (app: App) => void;
};

const AppList: FC<Props> = ({ title, apps, onInstall, onOpenDetails }) => {
  return (
    <section className="flex h-full flex-wrap">
      <h2 className="w-full pb-5 pt-8 text-xl font-bold dark:text-gray-200">
        {title}
      </h2>
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
        {apps.map((appStatus: AppStatus) => {
          return (
            <AppCard
              key={appStatus.id}
              appInfo={availableApps.get(appStatus.id)!}
              appStatusInfo={appStatus}
              installed={appStatus.installed}
              installingApp={null}
              onInstall={onInstall}
              onOpenDetails={onOpenDetails}
            />
          );
        })}
      </div>
    </section>
  );
};

export default AppList;
