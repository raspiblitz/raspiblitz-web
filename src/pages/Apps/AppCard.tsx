import {
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
  LockOpenIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Tooltip from "rc-tooltip";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppStatus, AuthMethod } from "../..//models/app-status";
import { App } from "../..//models/app.model";
import AppIcon from "../../components/AppIcon";
import ButtonWithSpinner from "../../components/ButtonWithSpinner/ButtonWithSpinner";

export type Props = {
  appInfo: App;
  appStatusInfo: AppStatus;
  installed: boolean;
  installingApp: any | null;
  onInstall: (id: string) => void;
  onOpenDetails: (app: App) => void;
};

export const AppCard: FC<Props> = ({
  appInfo,
  appStatusInfo,
  installed,
  installingApp,
  onInstall,
  onOpenDetails,
}) => {
  const { id, name } = appInfo;
  const { t } = useTranslation();
  const [isInstallWaiting, setInstallWaiting] = useState(false);

  useEffect(() => {
    setInstallWaiting(false);
  }, []);

  const installButtonPressed = (id: string) => {
    setInstallWaiting(true);
    onInstall(id);
  };

  const setAuthMethodText = (authMethod: AuthMethod | undefined): string => {
    switch (authMethod) {
      case AuthMethod.NONE:
        return t("apps.login_no_pass");
      case AuthMethod.PASSWORD_B:
        return t("apps.login_pass_b");
      case AuthMethod.USER_ADMIN_PASSWORD_B:
        return t("apps.login_admin_pass_b");
      case AuthMethod.USER_DEFINED:
        return t("apps.login_userdef");
      default:
        return "";
    }
  };

  const tooltipContent = (
    <div>
      {appStatusInfo.httpsForced === "1" &&
        appStatusInfo.httpsSelfsigned === "1" && (
          <h2 className="pb-5">{t("apps.selfsigned_cert")}</h2>
        )}
      {<h2>{setAuthMethodText(appStatusInfo.authMethod)}</h2>}
    </div>
  );

  return (
    <div className="bd-card transition-colors dark:bg-gray-800">
      <div className="mt-2 flex h-4/6 w-full flex-row items-center">
        {/* Icon */}
        <div className="flex w-1/4 items-center justify-center p-2">
          <AppIcon appId={id} />
        </div>
        {/* Content */}
        <div className="relative flex w-3/4 flex-col items-start justify-center text-xl">
          <h4>{name}</h4>
          {installed && (
            <Tooltip
              trigger={["click", "hover"]}
              overlay={tooltipContent}
              placement="top"
            >
              <LockOpenIcon className="absolute  top-0 right-0 h-6 w-6" />
            </Tooltip>
          )}
          <p className="overflow-ellipsis text-base text-gray-500 dark:text-gray-200">
            {t(`appInfo.${id}.shortDescription`)}
          </p>
        </div>
      </div>
      <div className="flex h-2/6 flex-row gap-2 py-2">
        {installed && appStatusInfo.address && (
          <a
            href={appStatusInfo.address}
            target="_blank"
            rel="noreferrer"
            className="flex w-1/2 items-center justify-center rounded bg-yellow-500 p-2 text-white shadow-md hover:bg-yellow-400"
          >
            <ArrowTopRightOnSquareIcon className="inline h-6 w-6" />
            &nbsp;{t("apps.open")}
          </a>
        )}
        {installed && !appStatusInfo.address && (
          <button
            disabled={true}
            className="flex w-1/2 cursor-default items-center justify-center rounded bg-gray-400 p-2 text-white shadow-md"
          >
            {t("apps.no_page")}
          </button>
        )}
        {(installingApp === null ||
          installingApp.id !== id ||
          installingApp.result === "fail") &&
          !installed && (
            <button
              disabled={
                isInstallWaiting ||
                (installingApp !== null && installingApp?.result !== "fail")
              }
              className="bd-button flex w-1/2 items-center justify-center p-2 disabled:pointer-events-none"
              onClick={() => installButtonPressed(id)}
            >
              <PlusIcon className="inline h-6 w-6" />
              &nbsp;{t("apps.install")}
            </button>
          )}
        {installingApp &&
          installingApp.id === id &&
          installingApp.result === "running" && (
            <ButtonWithSpinner
              disabled
              loading={true}
              className="bd-button flex w-1/2 items-center justify-center  p-2 disabled:pointer-events-none"
            >
              {t("apps.installing")}
            </ButtonWithSpinner>
          )}
        <button
          className="flex w-1/2 items-center justify-center rounded p-2 shadow-md hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-300 dark:hover:text-black"
          onClick={() => onOpenDetails(appInfo)}
        >
          <InformationCircleIcon className="inline h-6 w-6" />
          &nbsp;{t("apps.info")}
        </button>
      </div>
    </div>
  );
};

export default AppCard;
