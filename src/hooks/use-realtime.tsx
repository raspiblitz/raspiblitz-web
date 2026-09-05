import { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { AppContext } from "@/context/app-context";
import { WS_URL, RealtimeContext } from "@/context/realtime-context";
import type { App } from "@/models/app.model";
import type { AppStatusQueryResponse } from "@/models/app-status";
import type { BtcInfo } from "@/models/btc-info";
import type { HardwareInfo } from "@/models/hardware-info";
import type { LnInfo } from "@/models/ln-info";
import type { SystemInfo } from "@/models/system-info";
import type { SystemStartupInfo } from "@/models/system-startup-info";
import type { WalletBalance } from "@/models/wallet-balance";
import { ACCESS_TOKEN, setWindowAlias } from "@/utils";
import { parseAppStateUpdateValue } from "@/utils/app-state-message";
import { availableApps, isAppId } from "@/utils/availableApps";
import { isRecord } from "@/utils/guards";
import { isApp, isHardwareInfo, isSystemStartupInfo, isTransaction } from "@/utils/realtime-guards";

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
 * Reconnects with exponential backoff and jitter; a 4401 close code logs the user out.
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

  // Translations must stay current without restarting the authenticated stream.
  const translationRef = useRef(t);
  useEffect(() => {
    translationRef.current = t;
  }, [t]);

  useEffect(() => {
    const setApps = (apps: unknown) => {
      try {
        // Validate apps data
        if (!Array.isArray(apps)) {
          console.error("Invalid apps data format (not an array):", apps);
          return;
        }

        const validApps = apps.filter(isApp);
        updateAvailableApps((prev: App[]) => {
          if (prev.length === 0) {
            return validApps;
          }
          return prev.map(
            (old: App) => validApps.find((newApp: App) => old.id === newApp.id) || old,
          );
        });
      } catch (error) {
        console.error("Error processing apps data:", error);
      }
    };

    const handleManageAppMessage = (parsedData: unknown) => {
      try {
        // Verify we have a valid object for installation status
        if (!isRecord(parsedData)) {
          console.error("Invalid app_manage_message data format:", parsedData);
          return;
        }

        // Extract required fields with fallbacks
        const id = parsedData.id;
        if (!isAppId(id)) {
          console.error("Missing app ID in app_manage_message:", parsedData);
          return;
        }

        const state = typeof parsedData.state === "string" ? parsedData.state : "";
        const error_id = typeof parsedData.error_id === "string" ? parsedData.error_id : "none";
        const mode = typeof parsedData.mode === "string" ? parsedData.mode : "";

        // The message field replaces the details field in the new format
        const details = typeof parsedData.message === "string" ? parsedData.message : "";

        // Add timestamp for sorting
        const messageWithTimestamp = {
          id,
          state,
          mode,
          error_id,
          message: details,
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
        console.error("Error processing app_manage_message data:", error);
      }
    };

    const setTx = (transaction: unknown) => {
      try {
        // Validate transaction data
        if (!isTransaction(transaction)) {
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

    const setInstall = (installAppData: unknown) => {
      try {
        if (
          !isRecord(installAppData) ||
          !isAppId(installAppData.id) ||
          (installAppData.mode !== "on" && installAppData.mode !== "off")
        ) {
          console.error("Invalid install app data:", installAppData);
          return;
        }
        const appName = availableApps[installAppData.id].name;
        const translate = translationRef.current;
        const details = typeof installAppData.details === "string" ? installAppData.details : "";
        toast.dismiss();
        if (installAppData.result === "fail") {
          toast.error(
            translate(
              installAppData.mode === "on" ? "apps.install_failure" : "apps.uninstall_failure",
              { appName, details },
            ),
          );
          return;
        }
        if (installAppData.result === "win") {
          toast.success(
            translate(
              installAppData.mode === "on" ? "apps.install_success" : "apps.uninstall_success",
              { appName },
            ),
            { theme: "dark" },
          );
          return;
        }

        const installing = installAppData.mode === "on";
        toast(
          installing
            ? `${translate("apps.installing")} ${appName}`
            : `${translate("apps.uninstalling")} ${appName}`,
          {
            isLoading: true,
            autoClose: false,
          },
        );
      } catch (error) {
        console.error("Error processing install app data:", error);
      }
    };

    const setSystemInfo = (message: unknown) => {
      try {
        // Validate message data
        if (!isRecord(message)) {
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

    const setBtcInfo = (message: unknown) => {
      try {
        // Validate message data
        if (!isRecord(message)) {
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

    const setLnInfo = (message: unknown) => {
      try {
        // Validate message data
        if (!isRecord(message)) {
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

    const setBalance = (message: unknown) => {
      try {
        // Validate message data
        if (!isRecord(message)) {
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

    const setHardwareInfo = (message: unknown) => {
      try {
        // Validate message data
        if (!isRecord(message)) {
          console.error("Invalid hardware info data:", message);
          return;
        }

        if (isBackendErrorFrame(message, "hardware info")) return;

        updateHardwareInfo((prev: HardwareInfo | null) => {
          const next = { ...prev, ...message };
          return isHardwareInfo(next) ? next : prev;
        });
      } catch (error) {
        console.error("Error processing hardware info data:", error);
      }
    };

    const setSystemStartupInfo = (message: unknown) => {
      try {
        // Validate message data
        if (!isRecord(message)) {
          console.error("Invalid system startup info data:", message);
          return;
        }

        if (isBackendErrorFrame(message, "system startup info")) return;

        updateSystemStartupInfo((prev: SystemStartupInfo | null) => {
          const next = { ...prev, ...message };
          return isSystemStartupInfo(next) ? next : prev;
        });
      } catch (error) {
        console.error("Error processing system startup info data:", error);
      }
    };

    const handleAppStateUpdateMessage = (value: unknown) => {
      const data = parseAppStateUpdateValue(value);
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

    const DISPATCH: Record<string, (data: unknown) => void> = {
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
      const socket = new WebSocket(WS_URL);
      ws = socket;
      setSocket(socket);
      socket.onopen = () => {
        backoff = 1000;
        const token = localStorage.getItem(ACCESS_TOKEN);
        socket.send(JSON.stringify({ type: "auth", token }));
      };
      socket.onmessage = (evt) => {
        try {
          const frame: unknown = JSON.parse(evt.data);
          if (!isRecord(frame) || typeof frame.event !== "string" || !("data" in frame)) {
            return;
          }
          if (Object.hasOwn(DISPATCH, frame.event)) {
            DISPATCH[frame.event](frame.data);
          }
        } catch (err) {
          console.error("Error processing ws frame:", err);
        }
      };
      socket.onclose = (evt) => {
        if (closedByUs) return;
        if (evt.code === 4401) {
          appCtxRef.current.logout();
          return;
        }
        // Equal jitter spreads reconnects across half the exponential interval.
        const delay = Math.floor(backoff / 2 + (Math.random() * backoff) / 2);
        reconnectTimer = setTimeout(connect, delay);
        backoff = Math.min(backoff * 2, 30000);
      };
      socket.onerror = () => socket.close();
    };

    connect();

    return () => {
      closedByUs = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [
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
