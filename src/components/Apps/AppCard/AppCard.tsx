import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as InfoIcon } from "../../../assets/info.svg";
import { ReactComponent as LinkIcon } from "../../../assets/link.svg";
import { ReactComponent as PlusIcon } from "../../../assets/plus.svg";
import AppIcon from "../../../container/AppIcon/AppIcon";
import { App } from "../../../models/app.model";

type Props = {
  app: App;
  installing: boolean;
  onInstall: (id: string) => void;
  onOpenDetails: (app: App) => void;
};

export const AppCard: FC<Props> = ({
  app,
  installing,
  onInstall,
  onOpenDetails,
}) => {
  const { id, description, installed, name, address } = app;
  const { t } = useTranslation();

  return (
    <div className="bd-card transition-colors dark:bg-gray-800">
      <div className="mt-2 flex h-4/6 w-full flex-row items-center">
        {/* Icon */}
        <div className="flex w-1/4 items-center justify-center p-2">
          <AppIcon appId={id} />
        </div>
        {/* Content */}
        <div className="flex w-3/4 flex-col items-start justify-center text-xl">
          <div>{name}</div>
          <div className="overflow-ellipsis text-base text-gray-500 dark:text-gray-200">
            {description}
          </div>
        </div>
      </div>
      <div className="flex h-2/6 flex-row gap-2 py-2">
        {installed && address && (
          <a
            href={address}
            target="_blank"
            rel="noreferrer"
            className="flex w-1/2 items-center justify-center rounded bg-yellow-500 p-2 text-white shadow-md hover:bg-yellow-400"
          >
            <LinkIcon />
            &nbsp;{t("apps.open")}
          </a>
        )}
        {installed && !address && (
          <button
            disabled={true}
            className="flex w-1/2 cursor-default items-center justify-center rounded bg-gray-400 p-2 text-white shadow-md"
          >
            {t("apps.no_page")}
          </button>
        )}
        {!installed && (
          <button
            disabled={installing}
            className="flex w-1/2 items-center justify-center rounded bg-yellow-500 p-2 text-white shadow-md hover:bg-yellow-400 disabled:pointer-events-none disabled:bg-gray-400 disabled:text-white"
            onClick={() => onInstall(id)}
          >
            <PlusIcon />
            &nbsp;{t("apps.install")}
          </button>
        )}
        <button
          className="flex w-1/2 items-center justify-center rounded p-2 shadow-md hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-300 dark:hover:text-black"
          onClick={() => onOpenDetails(app)}
        >
          <InfoIcon />
          &nbsp;{t("apps.info")}
        </button>
      </div>
    </div>
  );
};

export default AppCard;
