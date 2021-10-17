import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppStatus } from '../../../models/app-status';

export const AppStatusCard: FC<{ app: AppStatus }> = (props) => {
  const { id, name, status } = props.app;
  const { t } = useTranslation();
  const [image, setImage] = useState("");

  useEffect(() => {
    import(`../../../assets/apps/${id}.png`)
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
    <div className="p-5 h-full">
      <article className="bd-card transition-colors flex items-center">
        <div className="flex flex-row my-2 items-center w-full">
          {/* Icon */}
          <div className="w-1/4 max-h-16 flex justify-center items-center p-2">
            <img className="max-h-16" src={image} alt="logo" />
          </div>
          {/* Content */}
          <div className="w-3/4 pl-5 justify-center items-start flex flex-col text-xl">
            <h4 className="dark:text-white">{name}</h4>
            <p className={`pt-3 ${statusColor}`}>{statusText}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default AppStatusCard;
