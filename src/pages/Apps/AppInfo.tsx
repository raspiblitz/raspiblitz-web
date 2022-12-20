import {
  ChevronLeftIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { AppStatus } from "models/app-status";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppIcon from "../../components/AppIcon";
import ButtonWithSpinner from "../../components/ButtonWithSpinner/ButtonWithSpinner";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { App } from "../../models/app.model";
import { availableApps } from "../../utils/availableApps";
import ImageCarousel from "./ImageCarousel";

export type Props = {
  app: App;
  appStatusInfo: AppStatus;
  installingApp: any | null;
  onInstall: () => void;
  onUninstall: () => void;
  onClose: () => void;
};

export const AppInfo: FC<Props> = ({
  app,
  appStatusInfo,
  installingApp,
  onInstall,
  onUninstall,
  onClose,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [imgs, setImgs] = useState<string[]>([]);
  const { id, name } = app;
  const { author, repository } = availableApps.get(id)!;

  useEffect(() => {
    setIsLoading(true);

    async function loadAppImages() {
      const promises = await Promise.allSettled([
        import(`../../assets/apps/preview/${id}/1.png`),
        import(`../../assets/apps/preview/${id}/2.png`),
        import(`../../assets/apps/preview/${id}/3.png`),
      ]);

      promises.forEach((promise, i) => {
        if (promise.status === "fulfilled") {
          setImgs((prev) => {
            prev[i] = promise.value.default;
            return prev;
          });
        } else {
          // Ignore if image not available
        }
      });
      setIsLoading(false);
    }

    loadAppImages();
  }, [id]);

  if (isLoading) {
    return (
      <main className="page-container content-container flex w-full items-center justify-center bg-gray-100 dark:bg-gray-700 dark:text-white">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="page-container content-container w-full bg-gray-100 dark:bg-gray-700 dark:text-white">
      {/* Back Button */}
      <section className="w-full px-5 py-9 dark:text-gray-200">
        <button
          onClick={onClose}
          className="flex items-center text-xl font-bold outline-none"
        >
          <ChevronLeftIcon className="inline-block h-5 w-5" />
          {t("navigation.back")}
        </button>
      </section>

      {/* Image box with title */}
      <section className="mb-5 flex w-full flex-wrap items-center justify-center">
        <AppIcon appId={id} />
        <h1 className="px-5 text-2xl dark:text-white">{name}</h1>
        {(installingApp == null || installingApp.id !== id) &&
          !appStatusInfo.installed && (
            <button
              disabled={!!installingApp}
              className="bd-button flex rounded p-2 disabled:pointer-events-none"
              onClick={onInstall}
            >
              <PlusIcon className="inline h-6 w-6" />
              &nbsp;{t("apps.install")}
            </button>
          )}
        {installingApp &&
          installingApp.id === id &&
          installingApp.mode === "on" && (
            <ButtonWithSpinner
              disabled
              loading={true}
              className="bd-button flex rounded p-2 text-white disabled:pointer-events-none"
            >
              {t("apps.installing")}
            </ButtonWithSpinner>
          )}
        {installingApp &&
          installingApp.id === id &&
          installingApp.mode === "off" && (
            <ButtonWithSpinner
              disabled
              loading={true}
              className="bd-button flex rounded p-2 disabled:pointer-events-none"
            >
              {t("apps.uninstalling")}
            </ButtonWithSpinner>
          )}
        {(installingApp == null || installingApp.id !== id) &&
          appStatusInfo.installed && (
            <button
              disabled={!!installingApp}
              className={`flex rounded bg-red-500 p-2 text-white shadow-md disabled:pointer-events-none disabled:bg-gray-400 disabled:text-white`}
              onClick={onUninstall}
            >
              <TrashIcon className="inline h-6 w-6" />
              &nbsp;{t("apps.uninstall")}
            </button>
          )}
      </section>

      <section className="text-center">
        {!isLoading && <ImageCarousel imgs={imgs} />}
      </section>

      {/* App Description */}
      <section className="flex w-full items-center justify-center p-5">
        <article className="bd-card w-full">
          <h3 className="text-lg">
            {name} {appStatusInfo.version}
          </h3>
          <h4 className="my-2 text-gray-500 dark:text-gray-300">
            {t("apps.about")}
          </h4>
          <p>{t(`appInfo.${id}.about`)}</p>
          <h4 className="my-2 text-gray-500 dark:text-gray-300">
            {t("apps.author")}
          </h4>
          <p>{author}</p>
          <h4 className="my-2 text-gray-500 dark:text-gray-300">
            {t("apps.source")}
          </h4>
          <a
            href={repository}
            className="text-blue-400 underline dark:text-blue-300"
          >
            {repository}
          </a>
        </article>
      </section>
    </main>
  );
};

export default AppInfo;
