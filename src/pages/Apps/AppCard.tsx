import AppIcon from "@/components/AppIcon";
import ButtonWithSpinner from "@/components/ButtonWithSpinner/ButtonWithSpinner";
import { AppStatus, AuthMethod } from "@/models/app-status";
import { App } from "@/models/app.model";
import { getHrefFromApp } from "@/utils";
import {
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
  LockOpenIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

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

  return (
    <article className="bd-card transition-colors dark:bg-gray-800">
      <div className="relative mt-2 flex h-4/6 w-full flex-row items-center">
        {installed && (
          <>
            <LockOpenIcon
              className="absolute right-0 top-0 h-6 w-6"
              data-tooltip-id="login-tooltip"
            />
            <Tooltip id="login-tooltip">
              <>
                {appStatusInfo.httpsForced === "1" &&
                  appStatusInfo.httpsSelfsigned === "1" && (
                    <h2 className="pb-5">{t("apps.selfsigned_cert")}</h2>
                  )}
                {<h2>{setAuthMethodText(appStatusInfo.authMethod)}</h2>}
              </>
            </Tooltip>
          </>
        )}
        {/* Icon */}
        <div className="mt-4 flex w-1/4 items-center justify-center p-2">
          <AppIcon appId={id} className="max-h-12" />
        </div>
        {/* Content */}
        <div className="mt-4 flex w-3/4 flex-col items-start justify-center text-xl">
          <h4>{name}</h4>
          <p className="overflow-ellipsis text-base text-gray-500 dark:text-gray-200">
            {t(`appInfo.${id}.shortDescription`)}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2 py-4">
        {installed && appStatusInfo.address && (
          <a
            href={getHrefFromApp(appStatusInfo)}
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
    </article>
  );
};

export default AppCard;
