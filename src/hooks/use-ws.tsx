import { WebSocketContext } from "@/context/ws-context";
import { InstallAppData } from "@/models/install-app";
import { SystemInfo } from "@/models/system-info";
import { setWindowAlias } from "@/utils";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export const WEBSOCKET_URL = "/ws";

function useWebSocket() {
  const { t } = useTranslation();
  const wsCtx = useContext(WebSocketContext);

  const {
    systemInfo,
    btcInfo,
    lnInfo,
    balance,
    appStatus,
    transactions,
    availableApps,
    installingApp,
    hardwareInfo,
    systemStartupInfo,
  } = wsCtx;

  const appInstallSuccessHandler = useCallback(
    (installData: InstallAppData, appName: string) => {
      if (installData.mode === "on") {
        toast.success(t("apps.install_success", { appName }));
      } else {
        toast.success(t("apps.uninstall_success", { appName }));
      }
    },
    [t],
  );

  const appInstallErrorHandler = useCallback(
    (installData: InstallAppData, appName: string) => {
      if (installData.mode === "on") {
        toast.error(
          t("apps.install_failure", {
            appName,
            details: installData.details,
          }),
        );
      } else {
        toast.error(
          t("apps.uninstall_failure", {
            appName,
            details: installData.details,
          }),
        );
      }
    },
    [t],
  );

  const handleInstall = useCallback(
    (installAppData: InstallAppData) => {
      toast.dismiss();
      // @ts-ignore
      const appName = availableApps[installAppData.id]?.name || "";
      if (installAppData.result === "fail") {
        appInstallErrorHandler(installAppData, appName);
        wsCtx.setInstallingApp(null);
        return;
      }
      if (installAppData.result === "win") {
        appInstallSuccessHandler(installAppData, appName);
        wsCtx.setInstallingApp(null);
        return;
      }
      const installing = installAppData.mode === "on";
      toast(
        installing
          ? `${t("apps.installing")} ${appName}`
          : `${t("apps.uninstalling")} ${appName}`,
        {
          isLoading: true,
          autoClose: false,
        },
      );
      wsCtx.setInstallingApp(installAppData);
    },
    [wsCtx, appInstallSuccessHandler, appInstallErrorHandler, t],
  );

  const handleSystemInfo = useCallback(
    (message: SystemInfo) => {
      if (message.alias) {
        setWindowAlias(message.alias);
      }
      wsCtx.setSystemInfo((prev: SystemInfo) => ({
        ...prev,
        ...message,
      }));
    },
    [wsCtx],
  );

  return {
    systemInfo,
    btcInfo,
    lnInfo,
    balance,
    appStatus,
    transactions,
    availableApps,
    installingApp,
    hardwareInfo,
    systemStartupInfo,
    handleInstall,
    handleSystemInfo,
  };
}

export default useWebSocket;
