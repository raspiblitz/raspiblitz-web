import type { FC } from "react";
import { useNavigate } from "react-router";
import AppIcon from "@/components/AppIcon";
import type { AppStatus } from "@/models/app-status";
import { getHrefFromApp } from "@/utils";
import { availableApps } from "@/utils/availableApps";

type Props = {
  app: AppStatus;
};

export const AppStatusItem: FC<Props> = ({ app }) => {
  const { id } = app;
  const navigate = useNavigate();
  // biome-ignore lint/style/noNonNullAssertion: value is expected to exist at this point
  const appName = availableApps[id]!.name;
  // biome-ignore lint/style/noNonNullAssertion: value is expected to exist at this point
  const customComponent = availableApps[id]!.customComponent;

  if (customComponent) {
    return (
      <button
        type="submit"
        onClick={() => navigate(`/apps/${id}`)}
        onKeyUp={(e) => {
          if (e.key === "Enter") navigate(`/apps/${id}`);
        }}
        className="flex w-full cursor-pointer items-center justify-center py-4 text-white opacity-80 hover:text-yellow-500 md:flex-col lg:flex-row"
      >
        {/* Icon */}
        <AppIcon appId={id} className="h-10 inline w-10" />
        {/* Content */}
        <span className="mx-3 w-1/2 justify-start flex text-lg">{appName}</span>
      </button>
    );
  }

  return (
    <a
      href={getHrefFromApp(app)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full cursor-pointer items-center justify-center py-4 text-white opacity-80 hover:text-yellow-500 md:flex-col lg:flex-row"
    >
      {/* Icon */}
      <AppIcon appId={id} className="h-10 inline w-10" />
      {/* Content */}
      <span className="mx-3 w-1/2 justify-center text-lg">{appName}</span>
    </a>
  );
};

export default AppStatusItem;
