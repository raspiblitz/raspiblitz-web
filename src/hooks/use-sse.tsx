import { useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { AppStatus } from "../models/app-status";
import { App } from "../models/app.model";
import { BtcInfo } from "../models/btc-info";
import { HardwareInfo } from "../models/hardware-info";
import { InstallAppData } from "../models/install-app";
import { LnStatus } from "../models/ln-status";
import { SystemInfo } from "../models/system-info";
import { WalletBalance } from "../models/wallet-balance";
import { SSEContext, SSE_URL } from "../store/sse-context";
import { availableApps } from "../util/availableApps";
import { setWindowAlias } from "../util/util";

/**
 * Establishes a SSE connection if not available yet & attaches / removes event listeners
 * to the single events to update the SSEContext
 * @returns the infos from the SSEContext
 */
function useSSE() {
  const { t } = useTranslation();
  const sseCtx = useContext(SSEContext);
  const { evtSource, setEvtSource } = sseCtx;

  const appInstallSuccessHandler = useCallback(
    (installData: InstallAppData, appName: string) => {
      if (installData.mode === "on") {
        toast.success(t("apps.install_success", { appName }));
      } else {
        toast.success(t("apps.uninstall_success", { appName }));
      }
    },
    [t]
  );

  const appInstallErrorHandler = useCallback(
    (installData: InstallAppData, appName: string) => {
      if (installData.mode === "on") {
        toast.error(
          t("apps.install_failure", { appName, details: installData.details })
        );
      } else {
        toast.error(
          t("apps.uninstall_failure", { appName, details: installData.details })
        );
      }
    },
    [t]
  );

  useEffect(() => {
    if (!evtSource) {
      setEvtSource(new EventSource(SSE_URL));
    }

    const setApps = (event: MessageEvent<string>) => {
      sseCtx.setAvailableApps((prev: App[]) => {
        const apps = JSON.parse(event.data);
        if (prev.length === 0) {
          return apps;
        } else {
          return prev.map(
            (old: App) =>
              apps.find((newApp: App) => old.id === newApp.id) || old
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
        }
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

    const setLnStatus = (event: MessageEvent<string>) => {
      sseCtx.setLnStatus((prev: LnStatus) => {
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

    if (evtSource) {
      evtSource.addEventListener("system_info", setSystemInfo);
      evtSource.addEventListener("btc_info", setBtcInfo);
      evtSource.addEventListener("ln_info_lite", setLnStatus);
      evtSource.addEventListener("wallet_balance", setBalance);
      evtSource.addEventListener("transactions", setTx);
      evtSource.addEventListener("installed_app_status", setAppStatus);
      evtSource.addEventListener("apps", setApps);
      evtSource.addEventListener("install", setInstall);
      evtSource.addEventListener("hardware_info", setHardwareInfo);
    }

    return () => {
      // cleanup
      if (evtSource) {
        evtSource.removeEventListener("system_info", setSystemInfo);
        evtSource.removeEventListener("btc_info", setBtcInfo);
        evtSource.removeEventListener("ln_info_lite", setLnStatus);
        evtSource.removeEventListener("wallet_balance", setBalance);
        evtSource.removeEventListener("transactions", setTx);
        evtSource.removeEventListener("installed_app_status", setAppStatus);
        evtSource.removeEventListener("apps", setApps);
        evtSource.removeEventListener("install", setInstall);
        evtSource.removeEventListener("hardware_info", setHardwareInfo);
      }
    };
  }, [
    t,
    evtSource,
    setEvtSource,
    sseCtx,
    appInstallSuccessHandler,
    appInstallErrorHandler,
  ]);

  return {
    systemInfo: sseCtx.systemInfo,
    btcInfo: sseCtx.btcInfo,
    lnStatus: sseCtx.lnStatus,
    balance: sseCtx.balance,
    appStatus: sseCtx.appStatus,
    transactions: sseCtx.transactions,
    availableApps: sseCtx.availableApps,
    installingApp: sseCtx.installingApp,
    hardwareInfo: sseCtx.hardwareInfo,
  };
}

export default useSSE;
