import { FC } from "react";
import { useTranslation } from "react-i18next";
import packageJson from "../../../package.json";

const VersionBox: FC = () => {
  const { t } = useTranslation();
  return (
    <article className="box-border w-full px-5 pt-5 transition-colors dark:text-white lg:w-1/2">
      <div className="relative flex flex-row gap-3 rounded bg-white p-5 shadow-xl dark:bg-gray-800">
        <p className="font-bold">Raspiblitz Web</p>
        <p>
          {t("home.version")} {packageJson.version}
        </p>
      </div>
    </article>
  );
};

export default VersionBox;
