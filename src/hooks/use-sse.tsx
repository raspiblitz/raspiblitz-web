import { useContext, useEffect } from "react";
import { AppStatus } from "../models/app-status";
import { App } from "../models/app.model";
import { BtcInfo } from "../models/btc-info";
import { HardwareInfo } from "../models/hardware-info";
import { LnStatus } from "../models/ln-status";
import { SystemInfo } from "../models/system-info";
import { WalletBalance } from "../models/wallet-balance";
import { SSEContext, SSE_URL } from "../store/sse-context";
import { setWindowAlias } from "../util/util";

function useSSE() {
  const sseCtx = useContext(SSEContext);
  const { evtSource, setEvtSource } = sseCtx;

  useEffect(() => {
    if (!evtSource) {
      setEvtSource(new EventSource(SSE_URL));
    }

    const setApps = (event: Event) => {
      sseCtx.setAvailableApps((prev: App[]) => {
        const apps = JSON.parse((event as MessageEvent<string>).data);
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

    const setAppStatus = (event: Event) => {
      sseCtx.setAppStatus((prev: AppStatus[]) => {
        const status: AppStatus[] = JSON.parse(
          (event as MessageEvent<string>).data
        );
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

    const setTx = (event: Event) => {
      const t = JSON.parse((event as MessageEvent<string>).data);
      sseCtx.setTransactions((prev) => {
        // add the newest transaction to the beginning
        const current = [t, ...prev];
        return current;
      });
    };

    const setInstall = (event: Event) => {
      const installEventData = JSON.parse((event as MessageEvent<string>).data);
      // {"id": "specter", "mode": "on", "result": "running", "details": ""}
      if (installEventData.result && installEventData.result === "fail") {
        // TODO: replace with a propper Installed Failed Notification
        // should be with an OK button so that user can note & report error
        if (installEventData.mode === "on")
          alert(`Install Failed: ${installEventData.details}`);
        else {
          alert(`Deinstall Failed: ${installEventData.details}`);
        }
        // set the install context back to null
        sseCtx.setInstallingApp(null);
      } else if (installEventData.result && installEventData.result === "win") {
        // TODO: send a one of those small notifications
        if (installEventData.mode === "on") {
          console.log(installEventData);
          console.log(installEventData.httpsForced);
          console.log(installEventData.httpsSelfsigned);
          if (
            installEventData.httpsForced === "1" &&
            installEventData.httpsSelfsigned === "1"
          ) {
            alert(
              `Install finished :)\n\nYou may need to accept self-signed HTTPS certificate in your browser on first use.`
            );
          } else {
            alert(`Install finished :)`);
          }
        } else {
          alert(`Deinstall finished`);
        }
        // set the install context back to null
        sseCtx.setInstallingApp(null);
      } else {
        sseCtx.setInstallingApp(installEventData);
      }
    };

    const setSystemInfo = (event: Event) => {
      const message = JSON.parse((event as MessageEvent<string>).data);
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

    const setBtcInfo = (event: Event) => {
      sseCtx.setBtcInfo((prev: BtcInfo) => {
        const message = JSON.parse((event as MessageEvent<string>).data);

        return {
          ...prev,
          ...message,
        };
      });
    };

    const setLnStatus = (event: Event) => {
      sseCtx.setLnStatus((prev: LnStatus) => {
        const message = JSON.parse((event as MessageEvent<string>).data);

        return {
          ...prev,
          ...message,
        };
      });
    };

    const setBalance = (event: Event) => {
      sseCtx.setBalance((prev: WalletBalance) => {
        const message = JSON.parse((event as MessageEvent<string>).data);

        return {
          ...prev,
          ...message,
        };
      });
    };

    const setHardwareInfo = (event: Event) => {
      sseCtx.setHardwareInfo((prev: HardwareInfo | null) => {
        const message = JSON.parse((event as MessageEvent<string>).data);

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
  }, [evtSource, setEvtSource, sseCtx]);

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
