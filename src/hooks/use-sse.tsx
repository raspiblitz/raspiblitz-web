import { AppContext } from "@/context/app-context";
import { useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { SSEContext, SSE_URL } from "@/context/sse-context";
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

/**
 * Establishes a SSE connection if not available yet & attaches / removes event listeners
 * to the single events to update the SSEContext
 * Only use once per page, otherwise you will have multiple connections; use useContext(SSEContext) instead
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

  useEffect(() => {
    if (!evtSource) {
      setEvtSource(new EventSource(SSE_URL, { withCredentials: true }));
    }

    const setApps = (event: MessageEvent<string>) => {
      sseCtx.setAvailableApps((prev: App[]) => {
        const apps = JSON.parse(event.data);
        if (prev.length === 0) {
          return apps;
        } else {
          return prev.map(
            (old: App) =>
              apps.find((newApp: App) => old.id === newApp.id) || old,
          );
        }
      });
    };

    const setAppStatus = (event: MessageEvent<string>) => {
      sseCtx.setAppStatus((prev: AppStatus[]) => {
        const status: AppStatus[] = JSON.parse(event.data);
        if (prev.length === 0) {
          return status;
        } else {
          const currentIds = status.map((item) => item.id);

          // remove items which get updated and concat arrays
          return prev
            .filter((item) => !currentIds.includes(item.id))
            .concat(status);
        }
      });
    };

    const setTx = (event: MessageEvent<string>) => {
      const t = JSON.parse(event.data);
      sseCtx.setTransactions((prev) => {
        // add the newest transaction to the beginning
        const current = [t, ...prev];
        return current;
      });
    };

    const setInstall = (event: MessageEvent<string>) => {
      toast.dismiss();
      const installAppData = JSON.parse(event.data) as InstallAppData;
      const appName = availableApps.get(installAppData.id)?.name || "";
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

    const eventErrorHandler = (_: Event) => {
      // just logout if there is an error and connection was closed
      if (evtSource?.CLOSED) {
        appCtx.logout();
      }
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
