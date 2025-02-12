import { Alert } from "@/components/Alert";
import AppIcon from "@/components/AppIcon";
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
import { Button, Link } from "@heroui/react";
import { type FC, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import ImageCarousel from "./ImageCarousel";

export const AppInfo: FC = () => {
  const navigate = useNavigate();
  const { appId } = useParams();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { appStatus, installingApp, hardwareInfo } = useContext(SSEContext);
  const [imgs, setImgs] = useState<string[]>([]);
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const { name } = availableApps[appId!];
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const { author, repository } = availableApps[appId!];
  const { installed, version } =
    appStatus.find((app) => app.id === appId) || {};

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

  const installHandler = useCallback(() => {
    instance.post(`apps/install/${appId}`).catch((err) => {
      toast.error(checkError(err));
    });
  }, [appId]);

  const uninstallHandler = useCallback(() => {
    instance
      .post(`apps/uninstall/${appId}`, { keepData: true })
      .catch((err) => {
        toast.error(checkError(err));
      });
  }, [appId]);

  if (isLoading) {
    return <PageLoadingScreen />;
  }

  if (!appId) {
    navigate("/apps");
    return <></>;
  }

  const video =
    appId === "mempool" ? (
      // biome-ignore lint/a11y/useMediaCaption: <explanation>
      <video width="2000" height="1000" controls>
        <source src="/assets/apps/videos/mempool.mp4" type="video/mp4" />
      </video>
    ) : undefined;

  // show warning if btcpay & ram below 8GB (in bytes); since the ram is always a bit less than 8gb, we use 7_000_000_000 (~7gb) instead
  const showBtcPayWarning =
    appId === "btcpayserver" &&
    hardwareInfo &&
    hardwareInfo.vram_total_bytes < 7_000_000_000;

  return (
    <main className="page-container content-container w-full bg-gray-700 text-white">
      {/* Back Button */}
      <section className="w-full px-5 py-9 text-gray-200">
        <Button
          onClick={() => navigate("/apps")}
          color="primary"
          startContent={<ChevronLeftIcon className="inline-block h-5 w-5" />}
        >
          {t("navigation.back")}
        </Button>
      </section>

      {/* Image box with title */}
      <section className="mb-5 flex w-full flex-wrap items-center justify-center">
        <AppIcon appId={appId} className="max-h-12" />
        <h1 className="px-5 text-2xl text-white">{name}</h1>

        {(installingApp == null || installingApp.appId !== appId) &&
          !installed && (
            <Button
              isDisabled={!!installingApp}
              color="primary"
              onClick={installHandler}
              startContent={<PlusIcon className="inline h-6 w-6" />}
            >
              {t("apps.install")}
            </Button>
          )}

        {installingApp &&
          installingApp.appId === appId &&
          installingApp.mode === "on" && (
            <Button disabled isLoading={true} color="primary">
              {t("apps.installing")}
            </Button>
          )}

        {installingApp &&
          installingApp.appId === appId &&
          installingApp.mode === "off" && (
            <Button disabled isLoading={true} color="primary">
              {t("apps.uninstalling")}
            </Button>
          )}

        {(installingApp == null || installingApp.appId !== appId) &&
          installed && (
            <Button
              isDisabled={!!installingApp}
              color="danger"
              onClick={uninstallHandler}
              startContent={<TrashIcon className="inline h-6 w-6" />}
            >
              {t("apps.uninstall")}
            </Button>
          )}
      </section>

      {showBtcPayWarning && (
        <div className="m-5">
          <Alert color="warning">{t("appInfo.btcpayserver.ram_warning")}</Alert>
        </div>
      )}

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

          <Link
            href={repository}
            target="_blank"
            rel="noreferrer"
            underline="always"
          >
            {repository}
          </Link>
        </article>
      </section>
    </main>
  );
};

export default AppInfo;
