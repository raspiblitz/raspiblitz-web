import ImageCarousel from "./ImageCarousel";
import AppIcon from "@/components/AppIcon";
import ButtonWithSpinner from "@/components/ButtonWithSpinner/ButtonWithSpinner";
import { SSEContext } from "@/context/sse-context";
import PageLoadingScreen from "@/layouts/PageLoadingScreen";
import { availableApps } from "@/utils/availableApps";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import {
  ChevronLeftIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const AppInfo: FC = () => {
  const navigate = useNavigate();
  const { appId } = useParams();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { appStatus, installingApp } = useContext(SSEContext);
  const [imgs, setImgs] = useState<string[]>([]);
  const { name } = availableApps[appId!];
  const { author, repository } = availableApps[appId!];
  const { installed, version } =
    appStatus.find((app) => app.id === appId) || {};

  const video =
    appId === "mempool" ? (
      <video width="2000" height="1000" controls>
        <source src="/assets/apps/videos/mempool.mp4" type="video/mp4" />
      </video>
    ) : undefined;

  useEffect(() => {
    setIsLoading(true);

    async function loadAppImages() {
      const promises = await Promise.allSettled([
        import(`../../assets/apps/preview/${appId}/1.png`),
        import(`../../assets/apps/preview/${appId}/2.png`),
        import(`../../assets/apps/preview/${appId}/3.png`),
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
  }, [appId]);

  const installHandler = () => {
    instance.post(`apps/install/${appId}`).catch((err) => {
      toast.error(checkError(err));
    });
  };

  const uninstallHandler = () => {
    instance
      .post(`apps/uninstall/${appId}`, { keepData: true })
      .catch((err) => {
        toast.error(checkError(err));
      });
  };

  if (isLoading) {
    return <PageLoadingScreen />;
  }

  if (!appId) {
    navigate("/apps");
    return <></>;
  }

  return (
    <main className="page-container content-container w-full bg-gray-700 text-white">
      {/* Back Button */}
      <section className="w-full px-5 py-9 text-gray-200">
        <button
          onClick={() => navigate("/apps")}
          className="flex items-center text-xl font-bold outline-none"
        >
          <ChevronLeftIcon className="inline-block h-5 w-5" />
          {t("navigation.back")}
        </button>
      </section>

      {/* Image box with title */}
      <section className="mb-5 flex w-full flex-wrap items-center justify-center">
        <AppIcon appId={appId} className="max-h-12" />
        <h1 className="px-5 text-2xl text-white">{name}</h1>
        {(installingApp == null || installingApp.appId !== appId) &&
          !installed && (
            <button
              disabled={!!installingApp}
              className="bd-button flex rounded p-2 disabled:pointer-events-none"
              onClick={installHandler}
            >
              <PlusIcon className="inline h-6 w-6" />
              &nbsp;{t("apps.install")}
            </button>
          )}
        {installingApp &&
          installingApp.appId === appId &&
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
          installingApp.appId === appId &&
          installingApp.mode === "off" && (
            <ButtonWithSpinner
              disabled
              loading={true}
              className="bd-button flex rounded p-2 disabled:pointer-events-none"
            >
              {t("apps.uninstalling")}
            </ButtonWithSpinner>
          )}
        {(installingApp == null || installingApp.appId !== appId) &&
          installed && (
            <button
              disabled={!!installingApp}
              className={`flex rounded bg-red-500 p-2 text-white shadow-md disabled:pointer-events-none disabled:bg-gray-400 disabled:text-white`}
              onClick={uninstallHandler}
            >
              <TrashIcon className="inline h-6 w-6" />
              &nbsp;{t("apps.uninstall")}
            </button>
          )}
      </section>

      <section className="text-center">
        {!isLoading && <ImageCarousel imgs={imgs} video={video} />}
      </section>

      {/* App Description */}
      <section className="flex w-full items-center justify-center p-5">
        <article className="bd-card w-full">
          <h3 className="text-lg">
            {name} {version}
          </h3>
          <h4 className="my-2 text-gray-300">{t("apps.about")}</h4>
          <p>{t(`appInfo.${appId}.about`)}</p>
          <h4 className="my-2 text-gray-300">{t("apps.author")}</h4>
          <p>{author}</p>
          <h4 className="my-2 text-gray-300">{t("apps.source")}</h4>
          <a
            href={repository}
            target="_blank"
            rel="noreferrer noopener"
            className="underline text-blue-300"
          >
            {repository}
          </a>
        </article>
      </section>
    </main>
  );
};

export default AppInfo;
