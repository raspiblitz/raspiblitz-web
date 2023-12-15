import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { SSEContext } from "../../context/sse-context";
import { checkPropsUndefined } from "../../utils";
import LoadingBox from "../../components/LoadingBox";

export const BitcoinCard: FC = () => {
  const { t } = useTranslation();
  const { btcInfo, systemInfo } = useContext(SSEContext);

  if (checkPropsUndefined({ btcInfo, systemInfo })) {
    return <LoadingBox />;
  }

  const {
    blocks,
    headers,
    subversion,
    verification_progress,
    connections_in,
    connections_out,
    size_on_disk,
  } = btcInfo;

  const syncPercentage = (verification_progress! * 100).toFixed(2);

  const shownVersion = subversion!.replace(/\//g, "").split(":")[1];

  // size_on_disk is in byte => convert to GB - 1024 ^ 2 = 1048576
  const diskSize = (size_on_disk! / 1024 / 1024 / 1024).toFixed(2);

  return (
    <div className="h-full">
      <section className="bd-card">
        <h2 className="text-lg font-bold">{t("home.bitcoin")}</h2>
        <div className="flex overflow-hidden py-4">
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.version")}
            </h6>
            <p>{shownVersion || "-"}</p>
          </article>
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.network")}
            </h6>
            <p>{systemInfo.chain}</p>
          </article>
        </div>
        <div className="flex overflow-hidden py-4">
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.connections")}
            </h6>
            <p>
              {`${connections_in} ${t("home.conn_in")}`} /{" "}
              <span className="inline-block">{`${connections_out} ${t(
                "home.conn_out",
              )}`}</span>
            </p>
          </article>
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.blocks_synced")}
            </h6>
            <p>
              {`${blocks || "-"} / ${headers || "-"}`}{" "}
              <span className="inline-block">({syncPercentage} %)</span>
            </p>
          </article>
        </div>
        <div className="flex overflow-hidden py-4">
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.blocktime")}
            </h6>
            <p>{blocks || "-"}</p>
          </article>
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.blockchain_size")}
            </h6>
            <p>{diskSize} GB</p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default BitcoinCard;
