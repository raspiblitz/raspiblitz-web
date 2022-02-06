import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import mockInfo from "../../../apps/mock-info.json";
import { ReactComponent as ChevronLeft } from "../../../assets/chevron-left.svg";
import AppIcon from "../../../container/AppIcon/AppIcon";
import { App } from "../../../models/app.model";
import { instance } from "../../../util/interceptor";
import ImageCarousel from "../../Shared/ImageCarousel/ImageCarousel";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";

export type Props = {
  app: App;
  onClose: () => void;
};

export const AppInfo: FC<Props> = ({ app, onClose }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [imgs, setImgs] = useState<string[]>([]);
  const { id, name, installed, description } = app;
  // TODO: Change to dynamic info
  const { version, repository, author } = mockInfo;

  useEffect(() => {
    setIsLoading(true);

    async function loadAppImages() {
      const promises = await Promise.allSettled([
        import(`../../../assets/apps/preview/${id}/1.png`),
        import(`../../../assets/apps/preview/${id}/2.png`),
        import(`../../../assets/apps/preview/${id}/3.png`),
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

  const installHandler = () => {
    // TODO: error handling
    instance.post("install", { id }).catch(() => {});
  };

  const uninstallHandler = () => {
    // TODO: error handling
    instance.post("uninstall", { id }).catch(() => {});
  };

  return (
    <main className="page-container content-container w-full bg-gray-100 dark:bg-gray-700 dark:text-white">
      {/* Back Button */}
      <section className="w-full px-5 py-9 dark:text-gray-200">
        <button
          onClick={onClose}
          className="flex items-center text-xl font-bold outline-none"
        >
          <ChevronLeft className="inline-block h-5 w-5" />
          {t("navigation.back")}
        </button>
      </section>

      {/* Image box with title */}
      <section className="mb-5 flex w-full items-center px-10">
        <AppIcon appId={id} />
        <h1 className="px-5 text-2xl dark:text-white">{name}</h1>
        {!installed && (
          <button
            className={`rounded bg-green-400 p-2`}
            onClick={installHandler}
          >
            {t("apps.install")}
          </button>
        )}
        {installed && (
          <button
            className={`rounded bg-red-500 p-2 text-white`}
            onClick={uninstallHandler}
          >
            {t("apps.uninstall")}
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
            {name} {version}
          </h3>
          <h4 className="my-2 text-gray-500 dark:text-gray-300">
            {t("apps.about")}
          </h4>
          <p>{description}</p>
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
