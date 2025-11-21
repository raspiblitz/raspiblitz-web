import {
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LockOpenIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Button, Link, Tooltip, useDisclosure } from "@heroui/react";
import { type FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import AppIcon from "@/components/AppIcon";
import { ConfirmModal } from "@/components/ConfirmModal";
import type { App } from "@/models/app.model";
import { type AppStatus, AuthMethod } from "@/models/app-status";
import { getHrefFromApp } from "@/utils";

export type Props = {
  appInfo: App;
  appStatusInfo: AppStatus;
  installed: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: value is expected to exist at this point
  installingApp: any | null;
  onInstall: (id: string) => void;
  error?: string;
};

export const AppCard: FC<Props> = ({
  appInfo,
  appStatusInfo,
  installed,
  installingApp,
  onInstall,
  error,
}) => {
  const { id, name } = appInfo;
  const { t } = useTranslation();
  const [isInstallWaiting, setInstallWaiting] = useState(false);
  const navigate = useNavigate();
  const errorModal = useDisclosure();

  useEffect(() => {
    setInstallWaiting(false);
  }, []);

  const installButtonPressed = (id: string) => {
    setInstallWaiting(true);
    onInstall(id);
  };

  const setAuthMethodText = (
    authMethod?: AuthMethod | string | null,
  ): string => {
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
        // For custom auth methods (like URL paths), return as-is or empty
        return typeof authMethod === "string" ? authMethod : "";
    }
  };

  // Determine if the card should show an error state
  const hasError = error || appStatusInfo.error;
  const errorMessage = error || appStatusInfo.error;

  const copyErrorToClipboard = () => {
    if (errorMessage) {
      navigator.clipboard.writeText(errorMessage);
    }
  };

  return (
    <article
      className={`bd-card transition-colors ${hasError ? "border-red-500 border-2" : "bg-gray-800"}`}
    >
      <div className="relative mt-2 flex h-4/6 w-full flex-row items-center">
        {installed && (
          <Tooltip
            showArrow={true}
            content={
              <>
                {appStatusInfo.https_forced === true &&
                  appStatusInfo.https_self_signed === true && (
                    <h2 className="pb-5">{t("apps.selfsigned_cert")}</h2>
                  )}
                <h2>{setAuthMethodText(appStatusInfo.auth_method)}</h2>
              </>
            }
          >
            <LockOpenIcon
              className="absolute right-0 top-0 h-6 w-6"
              data-tooltip-id={`login-tooltip-${id}`}
            />
          </Tooltip>
        )}

        {/* Icon */}
        <div className="mt-4 flex w-1/4 items-center justify-center p-2">
          <AppIcon appId={id} className="max-h-12" />
        </div>

        {/* Content */}
        <div className="mt-4 flex w-3/4 flex-col items-start justify-center text-xl">
          <h4>{name}</h4>
          <p className="text-ellipsis text-base text-gray-200">
            {t(`appInfo.${id}.shortDescription`)}
          </p>
        </div>
      </div>

      {/* Error Message - Just show a brief indicator */}
      {hasError && (
        <div className="mt-2 mb-2 flex flex-row items-center gap-2 px-2 py-2 bg-red-900 bg-opacity-30 rounded-md">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-400 overflow-hidden text-ellipsis">
            {t("apps.error_occurred")}
          </p>
        </div>
      )}

      {/* Error Modal */}
      {hasError && (
        <ConfirmModal
          disclosure={errorModal}
          headline={t("apps.error_details")}
          custom
        >
          <ConfirmModal.Header>{t("apps.error_details")}</ConfirmModal.Header>
          <ConfirmModal.Body>
            <div className="max-h-[60vh] overflow-y-auto p-2 bg-gray-900 rounded-md font-mono text-sm">
              {errorMessage}
            </div>
          </ConfirmModal.Body>
          <ConfirmModal.Footer>
            <Button onPress={errorModal.onClose}>{t("apps.close")}</Button>
            <Button
              color="primary"
              onPress={copyErrorToClipboard}
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <title>{t("apps.copy")}</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                  />
                </svg>
              }
            >
              {t("apps.copy")}
            </Button>
          </ConfirmModal.Footer>
        </ConfirmModal>
      )}

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
            onPress={() => navigate(`/apps/${appInfo.id}`)}
            color="primary"
            startContent={
              <ArrowTopRightOnSquareIcon className="inline h-6 w-6" />
            }
          >
            {t("apps.open")}
          </Button>
        )}

        {/* Show View Error button instead of Install button when there's an error */}
        {hasError && !installed && (
          <Button
            onPress={errorModal.onOpen}
            color="danger"
            startContent={
              <ExclamationTriangleIcon className="inline h-6 w-6" />
            }
          >
            {t("apps.view_error")}
          </Button>
        )}

        {/* Only show Install button when there's no error */}
        {!hasError &&
          (installingApp === null ||
            installingApp.id !== id ||
            installingApp.result === "fail") &&
          !installed && (
            <Button
              isDisabled={
                isInstallWaiting ||
                (installingApp !== null && installingApp?.result !== "fail")
              }
              onPress={() => installButtonPressed(id)}
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
          onPress={() => navigate(`/apps/${appInfo.id}/info`)}
          startContent={<InformationCircleIcon className="inline h-6 w-6" />}
        >
          {t("apps.info")}
        </Button>
      </div>
    </article>
  );
};

export default AppCard;
