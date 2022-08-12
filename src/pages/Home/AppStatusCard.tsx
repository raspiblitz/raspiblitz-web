import type { FC } from "react";
import AppIcon from "../../container/AppIcon/AppIcon";
import { AppStatus } from "../../models/app-status";
import { availableApps } from "../../util/availableApps";

type Props = {
  app: AppStatus;
};

export const AppStatusCard: FC<Props> = ({ app }) => {
  const { id } = app;
  const appName = availableApps.get(id)?.name;

  return (
    <div className="h-full p-5">
      <article className="bd-card flex items-center transition-colors">
        <div className="my-2 flex w-full flex-row items-center">
          {/* Icon */}
          <div className="flex max-h-16 w-1/4 items-center justify-center p-2">
            <AppIcon appId={id} />
          </div>
          {/* Content */}
          <div className="flex w-3/4 flex-col items-start justify-center pl-5 text-xl">
            <h4 className="dark:text-white">{appName}</h4>
          </div>
        </div>
      </article>
    </div>
  );
};

export default AppStatusCard;
