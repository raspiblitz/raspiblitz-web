import type { FC } from "react";
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
    <article className="flex w-full items-center justify-center py-4 opacity-80 dark:text-white md:flex-col lg:flex-row">
      {/* Icon */}
      <AppIcon appId={id} className="h-19 inline w-10" />
      {/* Content */}
      <h4 className=" mx-3 w-1/2 justify-center text-lg dark:text-white">
        {appName}
      </h4>
    </article>
  );
};

export default AppStatusCard;
