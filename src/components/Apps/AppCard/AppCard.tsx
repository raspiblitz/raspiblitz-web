import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as InfoIcon } from "../../../assets/info.svg";
import { ReactComponent as LinkIcon } from "../../../assets/link.svg";
import { ReactComponent as PlusIcon } from "../../../assets/plus.svg";
import { App } from "../../../models/app.model";

export const AppCard: FC<AppCardProps> = (props) => {
  const { id, description, installed, name, address } = props.app;
  const { installing, onInstall, onOpenDetails } = props;
  const { t } = useTranslation();
  const [image, setImage] = useState("");

  useEffect(() => {
    import(`../../../assets/apps/logos/${id}.png`)
      .then((image) => {
        setImage(image.default);
      })
      .catch((_) => {
        // use fallback icon if image for id doesn't exist
        import("../../../assets/cloud.svg").then((img) =>
          setImage(img.default)
        );
      });
  }, [id]);

  return (
    <div className="bd-card transition-colors dark:bg-gray-600">
      <div className="mt-2 flex h-4/6 w-full flex-row items-center">
        {/* Icon */}
        <div className="flex w-1/4 items-center justify-center p-2">
          <img className="max-h-16" src={image} alt={`${id} Logo`} />
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
          onClick={() => onOpenDetails(props.app)}
        >
          <InfoIcon />
          &nbsp;{t("apps.info")}
        </button>
      </div>
    </div>
  );
};

export default AppCard;

export interface AppCardProps {
  app: App;
  installing: boolean;
  onInstall: (id: string) => void;
  onOpenDetails: (app: App) => void;
}
