import { SSEContext } from "@/context/sse-context";
import packageJson from "package.json";
import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";

/**
 * Displays the versions of RaspiBlitz, the WebUI and the Blitz-API
 */
const VersionBox: FC = () => {
  const { t } = useTranslation();
  const { systemInfo } = useContext(SSEContext);

  const { platform_version, api_version } = systemInfo;

  return (
    <article className="box-border w-full transition-colors text-white">
      <div className="relative flex flex-col gap-3 rounded p-5 shadow-xl bg-gray-800">
        <h5 className="font-bold">{t("home.versions")}</h5>
        <article>
          <p>
            RaspiBlitz: <b>{platform_version}</b>
          </p>
          <p>
            RaspiBlitz WebUI: <b>{packageJson.version}</b>
          </p>
          <p>
            Blitz-API: <b>{api_version}</b>
          </p>
        </article>
      </div>
    </article>
  );
};

export default VersionBox;
