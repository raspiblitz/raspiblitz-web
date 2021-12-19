import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// TODO: Change to dynamic images
import Preview1 from "../../../assets/apps/preview/btc-rpc-explorer/1.png";
import Preview2 from "../../../assets/apps/preview/btc-rpc-explorer/2.png";
import Preview3 from "../../../assets/apps/preview/btc-rpc-explorer/3.png";
import { ReactComponent as ChevronLeft } from "../../../assets/chevron-left.svg";
import { App } from "../../../models/app.model";
import { instance } from "../../../util/interceptor";
import mockInfo from "../../../util/mock-info.json";
import ImageCarousel from "../../Shared/ImageCarousel/ImageCarousel";
import LoadingSpinner from "../../Shared/LoadingSpinner/LoadingSpinner";

export const AppInfo: FC<AppInfoProps> = (props) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [iconImg, setIconImg] = useState("");
  const [imgs] = useState<any[]>([Preview1, Preview2, Preview3]);
  const { id, name, installed, description } = props.app;
  // TODO: Change to dynamic info
  const { version, repository, author } = mockInfo;

  useEffect(() => {
    setIsLoading(true);
    import(`../../../assets/apps/logos/${id}.png`)
      .then((image) => {
        setIconImg(image.default);
      })
      .catch((_) => {
        // use fallback icon if image for id doesn't exist
        import("../../../assets/cloud.svg").then((img) =>
          setIconImg(img.default)
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <main className="page-container content-container w-full dark:text-white bg-gray-100 dark:bg-gray-700 flex justify-center items-center">
        <LoadingSpinner />
      </main>
    );
  }

  const installHandler = () => {
    instance.post("install", { id }).catch(() => {});
  };

  const uninstallHandler = () => {
    instance.post("uninstall", { id }).catch(() => {});
  };

  return (
    <main className="page-container content-container w-full dark:text-white bg-gray-100 dark:bg-gray-700">
      {/* Back Button */}
      <section className="w-full px-5 py-9 dark:text-gray-200">
        <button
          onClick={props.onClose}
          className="flex items-center outline-none text-xl font-bold"
        >
          <ChevronLeft className="h-5 w-5 inline-block" />
          {t("navigation.back")}
        </button>
      </section>

      {/* Image box with title */}
      <section className="w-full px-10 flex items-center mb-5">
        <img className="max-h-16" src={iconImg} alt={`${id} Logo`} />
        <h1 className="text-2xl px-5 dark:text-white">{name}</h1>
        {!installed && (
          <button
            className={`bg-green-400 rounded p-2`}
            onClick={installHandler}
          >
            {t("apps.install")}
          </button>
        )}
        {installed && (
          <button
            className={`bg-red-500 text-white rounded p-2`}
            onClick={uninstallHandler}
          >
            {t("apps.uninstall")}
          </button>
        )}
      </section>

      <section>
        <ImageCarousel imgs={imgs} />
      </section>

      {/* App Description */}
      <section className="w-full p-5 flex items-center justify-center">
        <article className="w-full bd-card">
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
            className="text-blue-400 dark:text-blue-300 underline"
          >
            {repository}
          </a>
        </article>
      </section>
    </main>
  );
};

export default AppInfo;

export interface AppInfoProps {
  app: App;
  onClose: () => void;
}
