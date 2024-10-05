import AppIcon from "@/components/AppIcon";
import { AppStatus, AuthMethod } from "@/models/app-status";
import { App } from "@/models/app.model";
import { getHrefFromApp } from "@/utils";
import {
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
  LockOpenIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Link, Button, Tooltip } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export type Props = {
  appInfo: App;
  appStatusInfo: AppStatus;
  installed: boolean;
  installingApp: any | null;
  onInstall: (id: string) => void;
};

export const AppCard: FC<Props> = ({
  appInfo,
  appStatusInfo,
  installed,
  installingApp,
  onInstall,
}) => {
  const { id, name } = appInfo;
  const { t } = useTranslation();
  const [isInstallWaiting, setInstallWaiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setInstallWaiting(false);
  }, []);

  const installButtonPressed = (id: string) => {
    setInstallWaiting(true);
    onInstall(id);
  };

  const setAuthMethodText = (authMethod?: AuthMethod): string => {
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
    <article className="bd-card bg-gray-800 transition-colors">
      <div className="relative mt-2 flex h-4/6 w-full flex-row items-center">
        {installed && (
          <>
            <Tooltip
              showArrow={true}
              content={
                <>
                  {appStatusInfo.httpsForced === "1" &&
                    appStatusInfo.httpsSelfsigned === "1" && (
                      <h2 className="pb-5">{t("apps.selfsigned_cert")}</h2>
                    )}
                  {<h2>{setAuthMethodText(appStatusInfo.authMethod)}</h2>}
                </>
              }
            >
              <LockOpenIcon
                className="absolute right-0 top-0 h-6 w-6"
                data-tooltip-id={`login-tooltip-${id}`}
              />
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
          <p className="overflow-ellipsis text-base text-gray-200">
            {t(`appInfo.${id}.shortDescription`)}
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-2 py-4">
        {installed && appStatusInfo.address && !appInfo.customComponent && (
          <Button
            as={Link}
            href={getHrefFromApp(appStatusInfo)}
            target="_blank"
            rel="noreferrer"
            color="primary"
            startContent={
              <ArrowTopRightOnSquareIcon className="inline h-6 w-6" />
            }
          >
            {t("apps.open")}
          </Button>
        )}

        {installed && !appStatusInfo.address && !appInfo.customComponent && (
          <Button disabled>{t("apps.no_page")}</Button>
        )}

        {installed && appInfo.customComponent && (
          <Button
            onClick={() => navigate(`/apps/${appInfo.id}`)}
            color="primary"
            startContent={
              <ArrowTopRightOnSquareIcon className="inline h-6 w-6" />
            }
          >
            {t("apps.open")}
          </Button>
        )}

        {(installingApp === null ||
          installingApp.id !== id ||
          installingApp.result === "fail") &&
          !installed && (
            <Button
              disabled={
                isInstallWaiting ||
                (installingApp !== null && installingApp?.result !== "fail")
              }
              onClick={() => installButtonPressed(id)}
              color="primary"
              startContent={<PlusIcon className="inline h-6 w-6" />}
            >
              {t("apps.install")}
            </Button>
          )}

        {installingApp &&
          installingApp.id === id &&
          installingApp.result === "running" && (
            <Button disabled isLoading={true}>
              {t("apps.installing")}
            </Button>
          )}

        <Button
          onClick={() => navigate(`/apps/${appInfo.id}/info`)}
          startContent={<InformationCircleIcon className="inline h-6 w-6" />}
        >
          {t("apps.info")}
        </Button>
      </div>
    </article>
  );
};

export default AppCard;
