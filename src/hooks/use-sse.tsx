import { AppContext } from "@/context/app-context";
import { SSEContext, SSE_URL } from "@/context/sse-context";
import type { AppStatus, AppStatusQueryResponse } from "@/models/app-status";
import type { App } from "@/models/app.model";
import type { BtcInfo } from "@/models/btc-info";
import type { HardwareInfo } from "@/models/hardware-info";
import type { InstallAppData } from "@/models/install-app";
import type { LnInfo } from "@/models/ln-info";
import type { SystemInfo } from "@/models/system-info";
import type { SystemStartupInfo } from "@/models/system-startup-info";
import type { WalletBalance } from "@/models/wallet-balance";
import { setWindowAlias } from "@/utils";
import { availableApps } from "@/utils/availableApps";
import { useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

/**
 * Establishes a SSE connection if not available yet & attaches / removes event listeners
 * to the single events to update the SSEContext
 * Use useContext(SSEContext) to get the data, is only used in Layout.tsx
 * @returns the infos from the SSEContext
 */
function useSSE() {
  const { t } = useTranslation();
  const sseCtx = useContext(SSEContext);
  const appCtx = useContext(AppContext);
  const { evtSource, setEvtSource } = sseCtx;

  const appInstallSuccessHandler = useCallback(
    (installData: InstallAppData, appName: string) => {
      if (installData.mode === "on") {
        toast.success(t("apps.install_success", { appName }), {
          theme: "dark",
        });
      } else {
        toast.success(t("apps.uninstall_success", { appName }), {
          theme: "dark",
        });
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

  useEffect(() => {
    if (!evtSource) {
      setEvtSource(new EventSource(SSE_URL, { withCredentials: true }));
    }

    const setApps = (event: MessageEvent<string>) => {
      sseCtx.setAvailableApps((prev: App[]) => {
        const apps = JSON.parse(event.data);
        if (prev.length === 0) {
          return apps;
          // biome-ignore lint/style/noUselessElse: <explanation>
        } else {
          return prev.map(
            (old: App) =>
              apps.find((newApp: App) => old.id === newApp.id) || old,
          );
        }
      });
    };

    const setAppStatus = (event: MessageEvent<string>) => {
      sseCtx.setAppStatus((prev: AppStatusQueryResponse) => {
        const status: AppStatusQueryResponse = JSON.parse(event.data);
        if (prev === undefined || prev.data.length === 0) {
          return status;
          // biome-ignore lint/style/noUselessElse: <explanation>
        } else {
          const currentIds = status.data.map((item) => item.id);

          // remove items which get updated and concat arrays
          prev.data = prev.data
            .filter((item) => !currentIds.includes(item.id))
            .concat(status.data);
          prev.errors = status.errors;
          prev.timestamp = status.timestamp;
          return prev;
        }
      });
    };

    const setTx = (event: MessageEvent<string>) => {
      const t = JSON.parse(event.data);
      sseCtx.setTransactions((prev) => {
        // add the newest transaction to the beginning
        return [t, ...prev];
      });
    };

    const setInstall = (event: MessageEvent<string>) => {
      toast.dismiss();
      const installAppData = JSON.parse(event.data) as InstallAppData;
      const appName = availableApps[installAppData.id]?.name || "";
      if (installAppData.result === "fail") {
        appInstallErrorHandler(installAppData, appName);
        sseCtx.setInstallingApp(null);
        return;
      }
      if (installAppData.result === "win") {
        appInstallSuccessHandler(installAppData, appName);
        sseCtx.setInstallingApp(null);
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
      sseCtx.setInstallingApp(installAppData);
    };

    const setSystemInfo = (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data);
      if (message.alias) {
        setWindowAlias(message.alias);
      }
      sseCtx.setSystemInfo((prev: SystemInfo) => {
        return {
          ...prev,
          ...message,
        };
      });
    };

    const setBtcInfo = (event: MessageEvent<string>) => {
      sseCtx.setBtcInfo((prev: BtcInfo) => {
        const message = JSON.parse(event.data);

        return {
          ...prev,
          ...message,
        };
      });
    };

    const setLnInfo = (event: MessageEvent<string>) => {
      sseCtx.setLnInfo((prev: LnInfo) => {
        const message = JSON.parse(event.data);

        return {
          ...prev,
          ...message,
        };
      });
    };

    const setBalance = (event: MessageEvent<string>) => {
      sseCtx.setBalance((prev: WalletBalance) => {
        const message = JSON.parse(event.data);

        return {
          ...prev,
          ...message,
        };
      });
    };

    const setHardwareInfo = (event: MessageEvent<string>) => {
      sseCtx.setHardwareInfo((prev: HardwareInfo | null) => {
        const message = JSON.parse(event.data);

        return {
          ...prev,
          ...message,
        };
      });
    };

    const setSystemStartupInfo = (event: MessageEvent<string>) => {
      sseCtx.setSystemStartupInfo((prev: SystemStartupInfo | null) => {
        const message = JSON.parse(event.data);

        return {
          ...prev,
          ...message,
        };
      });
    };

    const appStateUpdating = (_event: MessageEvent<string>) => {
      // Notify the UI that the app state is updating
      const customEvent = new Event("app_state_updating");
      window.dispatchEvent(customEvent);
    };

    const appStateUpdateSuccess = (_event: MessageEvent<string>) => {
      // Notify the UI that the app state was updated successfully
      const customEvent = new Event("app_state_updating_success");
      window.dispatchEvent(customEvent);
    };

    const eventErrorHandler = (_event: Event) => {
      appCtx.logout();
    };

    if (evtSource) {
      evtSource.addEventListener("error", eventErrorHandler);
      evtSource.addEventListener("system_info", setSystemInfo);
      evtSource.addEventListener("btc_info", setBtcInfo);
      evtSource.addEventListener("ln_info", setLnInfo);
      evtSource.addEventListener("wallet_balance", setBalance);
      evtSource.addEventListener("transactions", setTx);
      evtSource.addEventListener("installed_app_status", setAppStatus);
      evtSource.addEventListener("apps", setApps);
      evtSource.addEventListener("install", setInstall);
      evtSource.addEventListener("hardware_info", setHardwareInfo);
      evtSource.addEventListener("system_startup_info", setSystemStartupInfo);
      evtSource.addEventListener("app_state_updating", appStateUpdating);
      evtSource.addEventListener(
        "app_state_updating_success",
        appStateUpdateSuccess,
      );
    }

    return () => {
      // cleanup
      if (evtSource) {
        evtSource.removeEventListener("error", eventErrorHandler);
        evtSource.removeEventListener("system_info", setSystemInfo);
        evtSource.removeEventListener("btc_info", setBtcInfo);
        evtSource.removeEventListener("ln_info", setLnInfo);
        evtSource.removeEventListener("wallet_balance", setBalance);
        evtSource.removeEventListener("transactions", setTx);
        evtSource.removeEventListener("installed_app_status", setAppStatus);
        evtSource.removeEventListener("apps", setApps);
        evtSource.removeEventListener("install", setInstall);
        evtSource.removeEventListener("hardware_info", setHardwareInfo);
        evtSource.removeEventListener(
          "system_startup_info",
          setSystemStartupInfo,
        );
        evtSource.removeEventListener("app_state_updating", appStateUpdating);
        evtSource.removeEventListener(
          "app_state_updating_success",
          appStateUpdateSuccess,
        );
      }
    };
  }, [
    t,
    evtSource,
    appCtx,
    sseCtx,
    setEvtSource,
    appInstallSuccessHandler,
    appInstallErrorHandler,
  ]);

  return {
    evtSource: sseCtx.evtSource,
    systemInfo: sseCtx.systemInfo,
    btcInfo: sseCtx.btcInfo,
    lnInfo: sseCtx.lnInfo,
    balance: sseCtx.balance,
    appStatus: sseCtx.appStatus,
    transactions: sseCtx.transactions,
    availableApps: sseCtx.availableApps,
    installingApp: sseCtx.installingApp,
    hardwareInfo: sseCtx.hardwareInfo,
    systemStartupInfo: sseCtx.systemStartupInfo,
  };
}

export default useSSE;
