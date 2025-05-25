import { AppContext } from "@/context/app-context";
import { SSEContext, SSE_URL } from "@/context/sse-context";
import type {
  AppStateUpdateMessage,
  AppStatusQueryResponse,
} from "@/models/app-status";
import type { App } from "@/models/app.model";
import type { BtcInfo } from "@/models/btc-info";
import type { HardwareInfo } from "@/models/hardware-info";
import type { InstallAppData } from "@/models/install-app";
import type { LnInfo } from "@/models/ln-info";
import type { SystemInfo } from "@/models/system-info";
import type { SystemStartupInfo } from "@/models/system-startup-info";
import type { WalletBalance } from "@/models/wallet-balance";
import { ACCESS_TOKEN, setWindowAlias } from "@/utils";
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
      try {
        const apps = JSON.parse(event.data);

        // Validate apps data
        if (!Array.isArray(apps)) {
          console.error("Invalid apps data format (not an array):", apps);
          return;
        }

        sseCtx.setAvailableApps((prev: App[]) => {
          if (prev.length === 0) {
            return apps;
          }
          return prev.map(
            (old: App) =>
              apps.find((newApp: App) => old.id === newApp.id) || old,
          );
        });
      } catch (error) {
        console.error("Error processing apps data:", error);
      }
    };

    const handleManageAppMessage = (event: MessageEvent<string>) => {
      try {
        // Parse the event data
        const parsedData = JSON.parse(event.data);

        // Verify we have a valid object for installation status
        if (!parsedData || typeof parsedData !== "object") {
          console.error("Invalid app_manage_message data format:", parsedData);
          return;
        }

        // Extract required fields with fallbacks
        const id = parsedData.id || "";
        if (!id) {
          console.error("Missing app ID in app_manage_message:", parsedData);
          return;
        }

        const state = parsedData.state || "";
        const error_id = parsedData.error_id || "none";
        const mode = parsedData.mode || "";

        // The message field replaces the details field in the new format
        const details = parsedData.message || "";

        // Add timestamp for sorting
        const messageWithTimestamp = {
          ...parsedData,
          // Map message to details for consistency with our data model
          details: details,
          timestamp: Date.now(),
        };

        sseCtx.setInstallationStatus((prev) => {
          const prevMessages = prev[id]?.messages || [];
          const inProgress = state !== "finished";

          return {
            ...prev,
            [id]: {
              currentState: state,
              messages: [...prevMessages, messageWithTimestamp],
              inProgress,
              errorId: error_id !== "none" ? error_id : null,
            },
          };
        });
      } catch (error) {
        console.error("Error parsing app_manage_message data:", error);
      }
    };

    const setTx = (event: MessageEvent<string>) => {
      try {
        const transaction = JSON.parse(event.data);

        // Validate transaction data
        if (!transaction || typeof transaction !== "object") {
          console.error("Invalid transaction data format:", transaction);
          return;
        }

        sseCtx.setTransactions((prev) => {
          // add the newest transaction to the beginning
          return [transaction, ...prev];
        });
      } catch (error) {
        console.error("Error processing transaction data:", error);
      }
    };

    const setInstall = (event: MessageEvent<string>) => {
      try {
        toast.dismiss();
        const installAppData = JSON.parse(event.data);

        // Validate installation data
        if (!installAppData || typeof installAppData !== "object") {
          console.error("Invalid install app data format:", installAppData);
          return;
        }

        // Check for required ID
        if (!installAppData.id) {
          console.error("Missing app ID in install data:", installAppData);
          return;
        }

        const appName =
          availableApps[installAppData.id]?.name || installAppData.id;

        if (installAppData.result === "fail") {
          appInstallErrorHandler(installAppData, appName);
          return;
        }

        if (installAppData.result === "win") {
          appInstallSuccessHandler(installAppData, appName);
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
      } catch (error) {
        console.error("Error processing install app data:", error);
      }
    };

    const setSystemInfo = (event: MessageEvent<string>) => {
      try {
        const message = JSON.parse(event.data);

        // Validate message data
        if (!message || typeof message !== "object") {
          console.error("Invalid system info data:", message);
          return;
        }

        if (message.alias) {
          setWindowAlias(message.alias);
        }

        sseCtx.setSystemInfo((prev: SystemInfo) => {
          return {
            ...prev,
            ...message,
          };
        });
      } catch (error) {
        console.error("Error processing system info data:", error);
      }
    };

    const setBtcInfo = (event: MessageEvent<string>) => {
      try {
        const message = JSON.parse(event.data);

        // Validate message data
        if (!message || typeof message !== "object") {
          console.error("Invalid BTC info data:", message);
          return;
        }

        sseCtx.setBtcInfo((prev: BtcInfo) => {
          return {
            ...prev,
            ...message,
          };
        });
      } catch (error) {
        console.error("Error processing BTC info data:", error);
      }
    };

    const setLnInfo = (event: MessageEvent<string>) => {
      try {
        const message = JSON.parse(event.data);

        // Validate message data
        if (!message || typeof message !== "object") {
          console.error("Invalid LN info data:", message);
          return;
        }

        sseCtx.setLnInfo((prev: LnInfo) => {
          return {
            ...prev,
            ...message,
          };
        });
      } catch (error) {
        console.error("Error processing LN info data:", error);
      }
    };

    const setBalance = (event: MessageEvent<string>) => {
      try {
        const message = JSON.parse(event.data);

        // Validate message data
        if (!message || typeof message !== "object") {
          console.error("Invalid balance data:", message);
          return;
        }

        sseCtx.setBalance((prev: WalletBalance) => {
          return {
            ...prev,
            ...message,
          };
        });
      } catch (error) {
        console.error("Error processing balance data:", error);
      }
    };

    const setHardwareInfo = (event: MessageEvent<string>) => {
      try {
        const message = JSON.parse(event.data);

        // Validate message data
        if (!message || typeof message !== "object") {
          console.error("Invalid hardware info data:", message);
          return;
        }

        sseCtx.setHardwareInfo((prev: HardwareInfo | null) => {
          return {
            ...prev,
            ...message,
          };
        });
      } catch (error) {
        console.error("Error processing hardware info data:", error);
      }
    };

    const setSystemStartupInfo = (event: MessageEvent<string>) => {
      try {
        const message = JSON.parse(event.data);

        // Validate message data
        if (!message || typeof message !== "object") {
          console.error("Invalid system startup info data:", message);
          return;
        }

        sseCtx.setSystemStartupInfo((prev: SystemStartupInfo | null) => {
          return {
            ...prev,
            ...message,
          };
        });
      } catch (error) {
        console.error("Error processing system startup info data:", error);
      }
    };

    const handleAppStateUpdateMessage = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as AppStateUpdateMessage;
        const { state, message } = data;

        if (!state) {
          console.error("Invalid app_state_update_message format:", data);
          return;
        }

        // Handle different states
        if (state === "initiated") {
          // Notify UI that app state updating has started
          const customEvent = new Event("app_state_updating");
          window.dispatchEvent(customEvent);
        } else if (state === "success" && message) {
          // message is already a parsed object, no need to JSON.parse it again
          try {
            // Update app status with the new data
            sseCtx.setAppStatus((prev: AppStatusQueryResponse) => {
              // Ensure data properties are arrays
              const status = {
                data: Array.isArray(message.data) ? message.data : [],
                errors: Array.isArray(message.errors) ? message.errors : [],
                timestamp:
                  typeof message.timestamp === "number"
                    ? message.timestamp
                    : Date.now(),
              };

              // If previous state is empty, just return the new status
              if (!prev || !prev.data || prev.data.length === 0) {
                return status;
              }
              // Get IDs from new data to update
              const currentIds = status.data.map((item) => item.id);

              // Get existing data that's not being updated
              const existingData = prev.data.filter(
                (item) => !currentIds.includes(item.id),
              );

              // Merge the arrays
              return {
                data: [...existingData, ...status.data],
                errors: status.errors,
                timestamp: status.timestamp,
              };
            });
          } catch (error) {
            console.error(
              "Error processing app state update message data:",
              error,
            );
          }
        } else if (state === "finished") {
          // Notify UI that app state updating has completed
          const customEvent = new Event("app_state_updating_success");
          window.dispatchEvent(customEvent);
        }
      } catch (error) {
        console.error("Error parsing app_state_update_message:", error);
      }
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
      evtSource.addEventListener("app_manage_message", handleManageAppMessage);
      evtSource.addEventListener("apps", setApps);
      evtSource.addEventListener("install", setInstall);
      evtSource.addEventListener("hardware_info", setHardwareInfo);
      evtSource.addEventListener("system_startup_info", setSystemStartupInfo);
      evtSource.addEventListener(
        "app_state_update_message",
        handleAppStateUpdateMessage,
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
        evtSource.removeEventListener(
          "app_manage_message",
          handleManageAppMessage,
        );
        evtSource.removeEventListener("apps", setApps);
        evtSource.removeEventListener("install", setInstall);
        evtSource.removeEventListener("hardware_info", setHardwareInfo);
        evtSource.removeEventListener(
          "system_startup_info",
          setSystemStartupInfo,
        );
        evtSource.removeEventListener(
          "app_state_update_message",
          handleAppStateUpdateMessage,
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
    installationStatus: sseCtx.installationStatus,
  };
}

export default useSSE;
