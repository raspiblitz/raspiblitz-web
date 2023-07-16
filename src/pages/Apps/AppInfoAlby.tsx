import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppIcon from "../../components/AppIcon";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { App } from "../../models/app.model";
import { availableApps } from "../../utils/availableApps";
import ImageCarousel from "./ImageCarousel";
import { toast } from "react-toastify";
import { instance } from "../../utils/interceptor";

export type Props = {
  app: App;
  onClose: () => void;
};

export const AppInfo: FC<Props> = ({ app, onClose }) => {
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

  const addAlbyAccountHandler = async () => {
    const resp = await instance.get("/system/connection-info");

    if (
      resp.status !== 200 ||
      !resp.data.lnd_admin_macaroon ||
      !resp.data.lnd_rest_onion
    ) {
      toast.error(t(`appInfo.${id}.action.connection_info_error`));
      return;
    }

    const { lnd_admin_macaroon, lnd_rest_onion } = resp.data;

    if (!window.alby) {
      toast.error(t(`appInfo.${id}.action.connection.hint`));
    }

    try {
      await window.alby.enable();

      const result = await window.alby.addAccount({
        name: "⚡️ Raspiblitz",
        connector: "lnd",
        config: {
          adminkey: lnd_admin_macaroon,
          url: lnd_rest_onion,
        },
      });

      if (result.success) {
        toast.success(t(`appInfo.${id}.action.connection.success`));
      } else {
        toast.error(t(`appInfo.${id}.action.connection.error`));
      }
    } catch (e) {
      toast.error(t(`appInfo.${id}.action.connection.error`));
    }
  };

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
        <AppIcon appId={id} className="max-h-12" />
        <h1 className="px-5 text-2xl dark:text-white">{name}</h1>
        {window.alby && (
          <button
            className="bd-button flex rounded p-2 disabled:pointer-events-none"
            onClick={addAlbyAccountHandler}
          >
            <PlusIcon className="inline h-6 w-6" />
            &nbsp;{t(`appInfo.${id}.action.addAccount`)}
          </button>
        )}

        {!window.alby && (
          <a
            className="bd-button flex rounded p-2 disabled:pointer-events-none"
            target="_blank"
            rel="noreferrer"
            href="https://getalby.com"
          >
            {t(`appInfo.${id}.action.install`)}
          </a>
        )}
      </section>

      <section className="text-center">
        {!isLoading && <ImageCarousel imgs={imgs} />}
      </section>

      {/* App Description */}
      <section className="flex w-full items-center justify-center p-5">
        <article className="bd-card w-full">
          <h3 className="text-lg">{name}</h3>
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
