import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import LoadingBox from "../../components/Shared/LoadingBox/LoadingBox";
import { AppContext, Unit } from "../../store/app-context";
import { SSEContext } from "../../store/sse-context";
import { convertMSatToBtc, convertToString } from "../../util/format";
import { checkPropsUndefined } from "../../util/util";

export const LightningCard: FC = () => {
  const { t } = useTranslation();
  const { unit } = useContext(AppContext);
  const { lnInfoLite, balance } = useContext(SSEContext);

  const {
    num_active_channels: activeChannels,
    num_inactive_channels: inactiveChannels,
    num_pending_channels: pendingChannels,
    version,
    implementation,
  } = lnInfoLite;

  const {
    channel_pending_open_local_balance: localBalance,
    channel_pending_open_remote_balance: remoteBalance,
    channel_pending_open_local_balance: pendingLocalBalance,
    channel_pending_open_remote_balance: pendingRemoteBalance,
  } = balance;

  if (checkPropsUndefined({ lnInfoLite, balance })) {
    return <LoadingBox />;
  }

  // remove 'commit=...' from version string if exists
  const indexCommit = version.indexOf("commit");
  const versionString = version?.slice(
    0,
    indexCommit === -1 ? version.length : indexCommit
  );

  const convertedLocalBalance =
    unit === Unit.BTC
      ? convertMSatToBtc(localBalance || 0)
      : localBalance! / 1000;
  const convertedRemoteBalance =
    unit === Unit.BTC
      ? convertMSatToBtc(remoteBalance || 0)
      : remoteBalance! / 1000;

  const convertedLocalPendingBalance =
    unit === Unit.BTC
      ? convertMSatToBtc(pendingLocalBalance! || 0)
      : pendingLocalBalance! / 1000;

  const convertedRemotePendingBalance =
    unit === Unit.BTC
      ? convertMSatToBtc(pendingRemoteBalance || 0)
      : pendingRemoteBalance! / 1000;

  const channelTotal = activeChannels + inactiveChannels + pendingChannels;

  return (
    <div className="h-full p-5">
      <section className="bd-card">
        <h2 className="text-lg font-bold">{t("home.lightning")}</h2>
        <div className="flex overflow-hidden py-4">
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.version")}
            </h6>
            <p>{`${implementation || "-"} ${versionString}`}</p>
          </article>
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.channel")}
            </h6>
            <p>{`${activeChannels} / ${channelTotal}`}</p>
          </article>
        </div>
        <div className="flex overflow-hidden py-4">
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.local_balance")}
            </h6>
            <p>
              {convertToString(unit, convertedLocalBalance)} {unit}
            </p>
          </article>
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.remote_balance")}
            </h6>
            <p>
              {convertToString(unit, convertedRemoteBalance)} {unit}
            </p>
          </article>
        </div>
        <div className="flex overflow-hidden py-4">
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.pending_balance_local")}
            </h6>
            <p>
              {convertToString(unit, convertedLocalPendingBalance)} {unit}
            </p>
          </article>
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.pending_balance_remote")}
            </h6>
            <p>
              {convertToString(unit, convertedRemotePendingBalance)} {unit}
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default LightningCard;