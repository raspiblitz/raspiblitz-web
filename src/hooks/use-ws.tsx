import { AppContext } from "@/context/app-context";
import { WebSocketContext } from "@/context/ws-context";
import { AppStatus } from "@/models/app-status";
import { App } from "@/models/app.model";
import { BtcInfo } from "@/models/btc-info";
import { HardwareInfo } from "@/models/hardware-info";
import { InstallAppData } from "@/models/install-app";
import { LnInfo } from "@/models/ln-info";
import { SystemInfo } from "@/models/system-info";
import { SystemStartupInfo } from "@/models/system-startup-info";
import { WalletBalance } from "@/models/wallet-balance";
import { setWindowAlias } from "@/utils";
import { availableApps } from "@/utils/availableApps";
import { useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const WEBSOCKET_URL = "/websocket";

function useWebSocket() {
  const { t } = useTranslation();
  const wsCtx = useContext(WebSocketContext);
  const appCtx = useContext(AppContext);

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

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "apps":
          wsCtx.setAvailableApps((prev: App[]) => {
            const apps = data.payload;
            if (prev.length === 0) {
              return apps;
            } else {
              return prev.map(
                (old: App) =>
                  apps.find((newApp: App) => old.id === newApp.id) || old,
              );
            }
          });
          break;
        case "installed_app_status":
          wsCtx.setAppStatus((prev: AppStatus[]) => {
            const status: AppStatus[] = data.data;
            if (prev.length === 0) {
              return status;
            } else {
              const currentIds = status.map((item) => item.id);
              return prev
                .filter((item) => !currentIds.includes(item.id))
                .concat(status);
            }
          });
          break;
        case "transactions":
          wsCtx.setTransactions((prev) => [data.data, ...prev]);
          break;
        case "install":
          handleInstall(data.data);
          break;
        case "system_info":
          handleSystemInfo(data.data);
          break;
        case "btc_info":
          wsCtx.setBtcInfo((prev: BtcInfo) => ({ ...prev, ...data.data }));
          break;
        case "ln_info":
          wsCtx.setLnInfo((prev: LnInfo) => ({ ...prev, ...data.data }));
          break;
        case "wallet_balance":
          wsCtx.setBalance((prev: WalletBalance) => ({
            ...prev,
            ...data.data,
          }));
          break;
        case "hardware_info":
          wsCtx.setHardwareInfo((prev: HardwareInfo | null) => ({
            ...prev,
            ...data.data,
          }));
          break;
        case "system_startup_info":
          wsCtx.setSystemStartupInfo((prev: SystemStartupInfo | null) => ({
            ...prev,
            ...data.data,
          }));
          break;
        default:
          console.warn("Unknown message type:", data.type);
      }
    },
    [wsCtx, appInstallSuccessHandler, appInstallErrorHandler],
  );

  const handleInstall = useCallback(
    (installAppData: InstallAppData) => {
      toast.dismiss();
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

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = handleMessage;

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      appCtx.logout();
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [handleMessage, appCtx]);

  return {
    systemInfo: wsCtx.systemInfo,
    btcInfo: wsCtx.btcInfo,
    lnInfo: wsCtx.lnInfo,
    balance: wsCtx.balance,
    appStatus: wsCtx.appStatus,
    transactions: wsCtx.transactions,
    availableApps: wsCtx.availableApps,
    installingApp: wsCtx.installingApp,
    hardwareInfo: wsCtx.hardwareInfo,
    systemStartupInfo: wsCtx.systemStartupInfo,
  };
}

export default useWebSocket;
