import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext, Unit } from "../../../store/app-context";
import { convertMSatToBtc, convertToString } from "../../../util/format";
import { checkPropsUndefined } from "../../../util/util";
import LoadingBox from "../../Shared/LoadingBox/LoadingBox";

export const LightningCard: FC<LightningCardProps> = (props) => {
  const { t } = useTranslation();
  const { unit } = useContext(AppContext);

  const {
    localBalance,
    remoteBalance,
    version,
    channelPending,
    channelActive,
    channelInactive,
    implementation,
    pendingLocalBalance,
    pendingRemoteBalance,
  } = props;

  if (checkPropsUndefined(props)) {
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
      : localBalance / 1000;
  const convertedRemoteBalance =
    unit === Unit.BTC
      ? convertMSatToBtc(remoteBalance || 0)
      : remoteBalance / 1000;

  const convertedLocalPendingBalance =
    unit === Unit.BTC
      ? convertMSatToBtc(pendingLocalBalance || 0)
      : pendingLocalBalance / 1000;

  const convertedRemotePendingBalance =
    unit === Unit.BTC
      ? convertMSatToBtc(pendingRemoteBalance || 0)
      : pendingRemoteBalance / 1000;

  const channelTotal = channelActive + channelInactive + channelPending;

  return (
    <div className="h-full p-5">
      <section className="bd-card">
        <h2 className="text-lg font-bold">{t("home.lightning")}</h2>
        <div className="flex overflow-hidden py-4">
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.version")}
            </h6>
            <p>{`${implementation} ${versionString}`}</p>
          </article>
          <article className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.channel")}
            </h6>
            <p>{`${channelActive} / ${channelTotal}`}</p>
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

export interface LightningCardProps {
  version: string;
  implementation: string;
  channelActive: number;
  channelInactive: number;
  channelPending: number;
  localBalance: number;
  remoteBalance: number;
  pendingLocalBalance: number;
  pendingRemoteBalance: number;
}
