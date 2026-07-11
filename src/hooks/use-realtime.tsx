import { useCallback, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { AppContext } from "@/context/app-context";
import { WS_URL, RealtimeContext } from "@/context/realtime-context";
import type { App } from "@/models/app.model";
import type {
  AppStateUpdateMessage,
  AppStatusQueryResponse,
} from "@/models/app-status";
import type { BtcInfo } from "@/models/btc-info";
import type { HardwareInfo } from "@/models/hardware-info";
import type { InstallAppData } from "@/models/install-app";
import type { LnInfo } from "@/models/ln-info";
import type { SystemInfo } from "@/models/system-info";
import type { SystemStartupInfo } from "@/models/system-startup-info";
import type { WalletBalance } from "@/models/wallet-balance";
import { ACCESS_TOKEN, setWindowAlias } from "@/utils";
import { availableApps } from "@/utils/availableApps";

// Monotonic counter for assigning a stable, unique key to each installation
// message. Avoids relying on the array index (or a possibly-colliding
// timestamp) as a React key.
let installationMessageSeq = 0;

/**
 * Establishes a WebSocket connection (authenticating via a first-message
 * handshake) and dispatches incoming frames to update the RealtimeContext.
 * Reconnects with exponential backoff; a 4401 close code logs the user out.
 * Use useContext(RealtimeContext) to get the data, is only used in Layout.tsx
 * @returns the infos from the RealtimeContext
 */
function useRealtime() {
  const { t } = useTranslation();
  const sseCtx = useContext(RealtimeContext);
  const appCtx = useContext(AppContext);
  const { socket, setSocket } = sseCtx;

  // `appCtx` is a fresh object identity on every AppContextProvider render
  // (e.g. whenever its own state changes), and the same is true of `sseCtx`.
  // Tracking `appCtx.logout` via a ref lets the connection effect below stay
  // mounted for the component's lifetime (deps stable) instead of tearing
  // down and reconnecting on every unrelated context update, while still
  // calling the latest `logout` implementation when the socket closes.
  const appCtxRef = useRef(appCtx);
  useEffect(() => {
    appCtxRef.current = appCtx;
  }, [appCtx]);

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
        const _mode = parsedData.mode || "";

        // The message field replaces the details field in the new format
        const details = parsedData.message || "";

        // Add timestamp for sorting
        const messageWithTimestamp = {
          ...parsedData,
          // Stable unique key for React lists (see installationMessageSeq)
          uid: `msg-${installationMessageSeq++}`,
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
                timestamp: message.timestamp || Date.now(),
              };

              // If previous state is empty, just return the new status
              if (!prev?.data || prev.data.length === 0) {
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

    const DISPATCH: Record<string, (e: MessageEvent<string>) => void> = {
      system_info: setSystemInfo,
      btc_info: setBtcInfo,
      ln_info: setLnInfo,
      wallet_balance: setBalance,
      transactions: setTx,
      app_manage_message: handleManageAppMessage,
      apps: setApps,
      install: setInstall,
      hardware_info: setHardwareInfo,
      system_startup_info: setSystemStartupInfo,
      app_state_update_message: handleAppStateUpdateMessage,
    };

    let ws: WebSocket | null = null;
    let closedByUs = false;
    let backoff = 1000;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      ws = new WebSocket(WS_URL);
      setSocket(ws);
      ws.onopen = () => {
        backoff = 1000;
        const token = localStorage.getItem(ACCESS_TOKEN);
        ws?.send(JSON.stringify({ type: "auth", token }));
      };
      ws.onmessage = (evt) => {
        try {
          const { event, data } = JSON.parse(evt.data);
          // reuse the existing handlers unchanged: they expect a
          // MessageEvent whose .data is the JSON string of the payload
          DISPATCH[event]?.({ data: JSON.stringify(data) } as MessageEvent<string>);
        } catch (err) {
          console.error("Error processing ws frame:", err);
        }
      };
      ws.onclose = (evt) => {
        if (closedByUs) return;
        if (evt.code === 4401) {
          appCtxRef.current.logout();
          return;
        }
        reconnectTimer = setTimeout(connect, backoff);
        backoff = Math.min(backoff * 2, 30000);
      };
      ws.onerror = () => ws?.close();
    };

    connect();

    return () => {
      closedByUs = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
    // `sseCtx`/`appCtx` are intentionally omitted: they are new object
    // identities on every render of their providers, and depending on them
    // here would tear down and reopen the socket on every unrelated state
    // change instead of once per mount. The setters read from `sseCtx`
    // inside the handlers above are stable (React guarantees stable setState
    // identities), and `appCtxRef` always points at the latest `logout`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, setSocket, appInstallSuccessHandler, appInstallErrorHandler]);

  return {
    socket: sseCtx.socket,
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

export default useRealtime;
