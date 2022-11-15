import { FC } from "react";
import { useTranslation } from "react-i18next";
import packageJson from "../../../package.json";

type Props = {
  platformVersion: string;
  apiVersion: string;
};

const VersionBox: FC<Props> = ({ platformVersion, apiVersion }) => {
  const { t } = useTranslation();
  return (
    <article className="box-border w-full transition-colors dark:text-white">
      <div className="relative flex flex-col gap-3 rounded bg-white p-5 shadow-xl dark:bg-gray-800">
        <h5 className="font-bold">{t("home.versions")}</h5>
        <article>
          <p>
            RaspiBlitz: <b>{platformVersion}</b>
          </p>
          <p>
            RaspiBlitz WebUI: <b>{packageJson.version}</b>
          </p>
          <p>
            Blitz-API: <b>{apiVersion}</b>
          </p>
        </article>
      </div>
    </article>
  );
};

export default VersionBox;
