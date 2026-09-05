import { useCallback, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { AppContext } from "@/context/app-context";
import { WS_URL, RealtimeContext } from "@/context/realtime-context";
import type { App } from "@/models/app.model";
import type { AppStatusQueryResponse } from "@/models/app-status";
import type { BtcInfo } from "@/models/btc-info";
import type { HardwareInfo } from "@/models/hardware-info";
import type { InstallAppData } from "@/models/install-app";
import type { LnInfo } from "@/models/ln-info";
import type { SystemInfo } from "@/models/system-info";
import type { SystemStartupInfo } from "@/models/system-startup-info";
import type { WalletBalance } from "@/models/wallet-balance";
import { ACCESS_TOKEN, setWindowAlias } from "@/utils";
import { parseAppStateUpdateMessage } from "@/utils/app-state-message";
import { availableApps, isAppId } from "@/utils/availableApps";
import { isRecord } from "@/utils/guards";

// Monotonic counter for assigning a stable, unique key to each installation
// message. Avoids relying on the array index (or a possibly-colliding
// timestamp) as a React key.
let installationMessageSeq = 0;

// Warmup emits an `{ error }` frame for a data event when the backend failed to
// gather that source for a newly-connected client. Such a frame must never be
// merged into the realtime data state (it would pollute it with a stray `error`
// field); skip it instead.
function isBackendErrorFrame(message: Record<string, unknown>, label: string): boolean {
  if ("error" in message) {
    console.warn(`Skipping ${label} update; backend sent an error:`, message.error);
    return true;
  }
  return false;
}

/**
 * Establishes a WebSocket connection (authenticating via a first-message
 * handshake) and dispatches incoming frames to update the RealtimeContext.
 * Reconnects with exponential backoff; a 4401 close code logs the user out.
 * Use useContext(RealtimeContext) to get the data, is only used in Layout.tsx
 * @returns the infos from the RealtimeContext
 */
function useRealtime() {
  const { t } = useTranslation();
  const realtimeCtx = useContext(RealtimeContext);
  const appCtx = useContext(AppContext);
  const {
    setSocket,
    setAvailableApps: updateAvailableApps,
    setInstallationStatus: updateInstallationStatus,
    setTransactions: updateTransactions,
    setSystemInfo: updateSystemInfo,
    setBtcInfo: updateBtcInfo,
    setLnInfo: updateLnInfo,
    setBalance: updateBalance,
    setHardwareInfo: updateHardwareInfo,
    setSystemStartupInfo: updateSystemStartupInfo,
    setAppStatus: updateAppStatus,
  } = realtimeCtx;

  // `appCtx` is a fresh object identity on every AppContextProvider render
  // (e.g. whenever its own state changes), and the same is true of `realtimeCtx`.
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

        updateAvailableApps((prev: App[]) => {
          if (prev.length === 0) {
            return apps;
          }
          return prev.map((old: App) => apps.find((newApp: App) => old.id === newApp.id) || old);
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

        updateInstallationStatus((prev) => {
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

        updateTransactions((prev) => {
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

        const installAppId: unknown = installAppData.id;
        const appName = isAppId(installAppId)
          ? availableApps[installAppId].name
          : String(installAppId);

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
        if (!message || typeof message !== "object" || Array.isArray(message)) {
          console.error("Invalid system info data:", message);
          return;
        }

        if (isBackendErrorFrame(message, "system info")) return;

        if (typeof message.alias === "string" && message.alias) {
          setWindowAlias(message.alias);
        }

        updateSystemInfo((prev: SystemInfo) => {
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
        if (!message || typeof message !== "object" || Array.isArray(message)) {
          console.error("Invalid BTC info data:", message);
          return;
        }

        if (isBackendErrorFrame(message, "BTC info")) return;

        updateBtcInfo((prev: BtcInfo) => {
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
        if (!message || typeof message !== "object" || Array.isArray(message)) {
          console.error("Invalid LN info data:", message);
          return;
        }

        if (isBackendErrorFrame(message, "LN info")) return;

        updateLnInfo((prev: LnInfo) => {
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
        if (!message || typeof message !== "object" || Array.isArray(message)) {
          console.error("Invalid balance data:", message);
          return;
        }

        if (isBackendErrorFrame(message, "balance")) return;

        updateBalance((prev: WalletBalance) => {
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
        if (!message || typeof message !== "object" || Array.isArray(message)) {
          console.error("Invalid hardware info data:", message);
          return;
        }

        if (isBackendErrorFrame(message, "hardware info")) return;

        updateHardwareInfo((prev: HardwareInfo | null) => {
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
        if (!message || typeof message !== "object" || Array.isArray(message)) {
          console.error("Invalid system startup info data:", message);
          return;
        }

        if (isBackendErrorFrame(message, "system startup info")) return;

        updateSystemStartupInfo((prev: SystemStartupInfo | null) => {
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
      const data = parseAppStateUpdateMessage(event.data);
      if (!data) {
        console.warn("Ignored invalid app state update message");
        return;
      }

      const { state, message } = data;

      if (state === "initiated") {
        window.dispatchEvent(new Event("app_state_updating"));
      } else if (state === "success" && message) {
        updateAppStatus((prev: AppStatusQueryResponse) => {
          if (prev.data.length === 0) return message;

          const currentIds = new Set(message.data.map((item) => item.id));
          const existingData = prev.data.filter((item) => !currentIds.has(item.id));

          return {
            data: [...existingData, ...message.data],
            errors: message.errors,
            timestamp: message.timestamp,
          };
        });
      } else if (state === "finished") {
        window.dispatchEvent(new Event("app_state_updating_success"));
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
          const frame: unknown = JSON.parse(evt.data);
          if (!isRecord(frame) || typeof frame.event !== "string" || !("data" in frame)) {
            return;
          }
          if (Object.hasOwn(DISPATCH, frame.event)) {
            DISPATCH[frame.event](
              new MessageEvent("message", { data: JSON.stringify(frame.data) }),
            );
          }
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
  }, [
    t,
    setSocket,
    updateAvailableApps,
    updateInstallationStatus,
    updateTransactions,
    updateSystemInfo,
    updateBtcInfo,
    updateLnInfo,
    updateBalance,
    updateHardwareInfo,
    updateSystemStartupInfo,
    updateAppStatus,
    appInstallSuccessHandler,
    appInstallErrorHandler,
  ]);

  return {
    socket: realtimeCtx.socket,
    systemInfo: realtimeCtx.systemInfo,
    btcInfo: realtimeCtx.btcInfo,
    lnInfo: realtimeCtx.lnInfo,
    balance: realtimeCtx.balance,
    appStatus: realtimeCtx.appStatus,
    transactions: realtimeCtx.transactions,
    availableApps: realtimeCtx.availableApps,
    installingApp: realtimeCtx.installingApp,
    hardwareInfo: realtimeCtx.hardwareInfo,
    systemStartupInfo: realtimeCtx.systemStartupInfo,
    installationStatus: realtimeCtx.installationStatus,
  };
}

export default useRealtime;
