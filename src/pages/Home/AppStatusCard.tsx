import type { FC } from "react";
import { getHrefFromApp } from "utils";
import AppIcon from "../../components/AppIcon";
import { AppStatus } from "../../models/app-status";
import { availableApps } from "../../utils/availableApps";

type Props = {
  app: AppStatus;
};

export const AppStatusCard: FC<Props> = ({ app }) => {
  const { id } = app;
  const appName = availableApps.get(id)?.name;

  return (
    <a
      href={getHrefFromApp(app)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full cursor-pointer items-center justify-center py-4 opacity-80 hover:text-yellow-500 dark:text-white dark:hover:text-yellow-500 md:flex-col lg:flex-row"
    >
      {/* Icon */}
      <AppIcon appId={id} className="h-19 inline w-10" />
      {/* Content */}
      <span className="mx-3 w-1/2 justify-center text-lg">{appName}</span>
    </a>
  );
};

export default AppStatusCard;
