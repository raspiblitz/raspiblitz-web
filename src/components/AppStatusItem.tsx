import AppIcon from "@/components/AppIcon";
import { AppStatus } from "@/models/app-status";
import { getHrefFromApp } from "@/utils";
import { availableApps } from "@/utils/availableApps";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  app: AppStatus;
};

export const AppStatusItem: FC<Props> = ({ app }) => {
  const { id } = app;
  const navigate = useNavigate();
  const appName = availableApps[id]!.name;
  const customComponent = availableApps[id]!.customComponent;

  if (customComponent) {
    return (
      <span
        onClick={() => navigate(`/apps/${id}`)}
        className="flex w-full cursor-pointer items-center justify-center py-4 opacity-80 text-white hover:text-yellow-500 md:flex-col lg:flex-row"
      >
        {/* Icon */}
        <AppIcon appId={id} className="h-19 inline w-10" />
        {/* Content */}
        <span className="mx-3 w-1/2 justify-center text-lg">{appName}</span>
      </span>
    );
  }

  return (
    <a
      href={getHrefFromApp(app)}
      target={"_blank"}
      rel={"noopener noreferrer"}
      className="flex w-full cursor-pointer items-center justify-center py-4 opacity-80 text-white hover:text-yellow-500 md:flex-col lg:flex-row"
    >
      {/* Icon */}
      <AppIcon appId={id} className="h-19 inline w-10" />
      {/* Content */}
      <span className="mx-3 w-1/2 justify-center text-lg">{appName}</span>
    </a>
  );
};

export default AppStatusItem;
