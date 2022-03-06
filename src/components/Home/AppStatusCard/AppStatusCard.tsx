import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { availableApps } from "../../../util/availableApps";
import { AppStatus } from "../../../models/app-status";

export const AppStatusCard: FC<{ app: AppStatus }> = ({ app }) => {
  const { id, status } = app;
  const { t } = useTranslation();
  const [image, setImage] = useState("");
  const appName = availableApps.get(id)?.name;

  useEffect(() => {
    import(`../../../assets/apps/logos/${id}.png`)
      .then((image) => {
        setImage(image.default);
      })
      .catch((e) => {
        // use fallback icon if image for id doesn't exist
        import("../../../assets/cloud.svg").then((img) =>
          setImage(img.default)
        );
      });
  }, [id]);

  const online = status === "online";
  const statusColor = online ? "text-green-400" : "text-red-500";
  const statusText = online ? t("apps.online") : t("apps.offline");

  return (
    <div className="h-full p-5">
      <article className="bd-card flex items-center transition-colors">
        <div className="my-2 flex w-full flex-row items-center">
          {/* Icon */}
          <div className="flex max-h-16 w-1/4 items-center justify-center p-2">
            <img className="max-h-16" src={image} alt="logo" />
          </div>
          {/* Content */}
          <div className="flex w-3/4 flex-col items-start justify-center pl-5 text-xl">
            <h4 className="dark:text-white">{appName}</h4>
            <p className={`pt-3 ${statusColor}`}>{statusText}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default AppStatusCard;
