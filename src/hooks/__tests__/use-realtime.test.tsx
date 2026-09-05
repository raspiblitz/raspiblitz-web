import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { StrictMode, useContext } from "react";
import { toast } from "react-toastify";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AppContextProvider, { AppContext, appContextDefault } from "@/context/app-context";
import RealtimeProvider, { realtimeContextDefault } from "@/context/realtime-context";
import type { Transaction } from "@/models/transaction.model";
import useRealtime from "@/hooks/use-realtime";
import i18n from "@/i18n/test_config";
import { render as renderWithProviders } from "@/utils/test-utils";

class MockWebSocket {
  static instances: MockWebSocket[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  onclose: ((e: { code: number }) => void) | null = null;
  onerror: (() => void) | null = null;
  sent: string[] = [];
  constructor(public url: string) {
    MockWebSocket.instances.push(this);
  }
  send(d: string) {
    this.sent.push(d);
  }
  close = vi.fn();
}

function Probe() {
  const {
    btcInfo,
    systemStartupInfo,
    transactions,
    hardwareInfo,
    appStatus,
    availableApps,
    installationStatus,
  } = useRealtime();
  return (
    <>
      <div data-testid="transactions">{JSON.stringify(transactions)}</div>
      <div data-testid="hardware">{JSON.stringify(hardwareInfo)}</div>
      <div data-testid="apps">{JSON.stringify(availableApps)}</div>
      <div data-testid="app-status">{JSON.stringify(appStatus)}</div>
      <div data-testid="installation">{JSON.stringify(installationStatus)}</div>
      <div data-testid="startup">{JSON.stringify(systemStartupInfo)}</div>
      <div data-testid="blocks">{btcInfo.blocks}</div>
      <div data-testid="btc-error">{String((btcInfo as { error?: unknown }).error ?? "")}</div>
    </>
  );
}

describe("useRealtime (WebSocket)", () => {
  const logout = vi.fn();

  beforeEach(() => {
    localStorage.setItem("access_token", "tok");
    MockWebSocket.instances = [];
    logout.mockClear();
    vi.stubGlobal("WebSocket", MockWebSocket);
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const renderProbe = (translations = i18n) =>
    render(
      <RealtimeProvider>
        <AppContext.Provider value={{ ...appContextDefault, logout }}>
          <I18nextProvider i18n={translations}>
            <Probe />
          </I18nextProvider>
        </AppContext.Provider>
      </RealtimeProvider>,
    );

  it("sends the auth frame with the stored token when the socket opens", async () => {
    renderProbe();

    await waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    const ws = MockWebSocket.instances[0];

    act(() => {
      ws.onopen?.();
    });

    expect(ws.sent).toEqual([JSON.stringify({ type: "auth", token: "tok" })]);
  });

  it("dispatches an incoming btc_info frame to update the realtime context", async () => {
    renderProbe();

    await waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    const ws = MockWebSocket.instances[0];

    act(() => {
      ws.onmessage?.({
        data: JSON.stringify({ event: "btc_info", data: { blocks: 42 } }),
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("blocks").textContent).toBe("42");
    });
  });

  it("ignores a backend error frame instead of merging it into the data state", async () => {
    renderProbe();

    await waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    const ws = MockWebSocket.instances[0];

    // a valid frame first
    act(() => {
      ws.onmessage?.({
        data: JSON.stringify({ event: "btc_info", data: { blocks: 42 } }),
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId("blocks").textContent).toBe("42");
    });

    // then a warmup error frame for the same event
    act(() => {
      ws.onmessage?.({
        data: JSON.stringify({ event: "btc_info", data: { error: "410: boom" } }),
      });
    });

    // the error must NOT be merged into btcInfo, and prior data is preserved
    expect(screen.getByTestId("btc-error").textContent).toBe("");
    expect(screen.getByTestId("blocks").textContent).toBe("42");
  });

  it("logs out without reconnecting when the API rejects authentication with 4401", () => {
    vi.useFakeTimers();
    try {
      renderProbe();
      act(() => MockWebSocket.instances[0].onclose?.({ code: 4401 }));
      expect(logout).toHaveBeenCalledOnce();
      act(() => vi.advanceTimersByTime(60000));
      expect(MockWebSocket.instances).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("reconnects with backoff when the socket closes abnormally (non-4401)", async () => {
    renderProbe();

    await waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    const ws = MockWebSocket.instances[0];

    vi.useFakeTimers();
    try {
      act(() => {
        ws.onopen?.();
      });

      act(() => {
        ws.onclose?.({ code: 1006 });
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(MockWebSocket.instances.length).toBe(2);
      expect(logout).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
  it("keeps the socket open across realtime updates and calls the latest logout", () => {
    const latestLogout = vi.fn();
    const tree = (logoutHandler: () => void) => (
      <RealtimeProvider>
        <AppContext.Provider value={{ ...appContextDefault, logout: logoutHandler }}>
          <I18nextProvider i18n={i18n}>
            <Probe />
          </I18nextProvider>
        </AppContext.Provider>
      </RealtimeProvider>
    );
    const { rerender } = render(tree(logout));
    const ws = MockWebSocket.instances[0];
    act(() =>
      ws.onmessage?.({ data: JSON.stringify({ event: "btc_info", data: { blocks: 43 } }) }),
    );
    rerender(tree(latestLogout));
    expect(MockWebSocket.instances).toHaveLength(1);
    expect(ws.close).not.toHaveBeenCalled();
    expect(screen.getByTestId("blocks")).toHaveTextContent("43");
    act(() => ws.onclose?.({ code: 4401 }));
    expect(latestLogout).toHaveBeenCalledOnce();
    expect(logout).not.toHaveBeenCalled();
  });

  it("ignores malformed and unknown frames and still processes the next valid update", () => {
    renderProbe();
    const ws = MockWebSocket.instances[0];
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      for (const frame of [
        "invalid json",
        "null",
        "[]",
        "{}",
        JSON.stringify({ event: "btc_info" }),
        JSON.stringify({ event: "unknown", data: {} }),
        JSON.stringify({ event: "__proto__", data: {} }),
        JSON.stringify({ event: "btc_info", data: [] }),
      ]) {
        act(() => ws.onmessage?.({ data: frame }));
      }
      act(() =>
        ws.onmessage?.({ data: JSON.stringify({ event: "btc_info", data: { blocks: 44 } }) }),
      );
      expect(screen.getByTestId("blocks")).toHaveTextContent("44");
      expect(MockWebSocket.instances).toHaveLength(1);
    } finally {
      error.mockRestore();
    }
  });

  it("preserves startup state when a warmup error arrives", () => {
    renderProbe();
    const ws = MockWebSocket.instances[0];
    const startup = { bitcoin: "done", bitcoin_msg: "", lightning: "disabled", lightning_msg: "" };
    act(() =>
      ws.onmessage?.({ data: JSON.stringify({ event: "system_startup_info", data: startup }) }),
    );
    act(() =>
      ws.onmessage?.({
        data: JSON.stringify({ event: "system_startup_info", data: { error: "warming up" } }),
      }),
    );
    expect(screen.getByTestId("startup")).toHaveTextContent(JSON.stringify(startup));
  });

  it("uses the refreshed token when reconnecting and increases the retry delay", () => {
    vi.useFakeTimers();
    try {
      renderProbe();
      act(() => MockWebSocket.instances[0].onclose?.({ code: 1006 }));
      localStorage.setItem("access_token", "refreshed-token");
      act(() => vi.advanceTimersByTime(500));
      const retry = MockWebSocket.instances[1];
      act(() => retry.onclose?.({ code: 1006 }));
      act(() => vi.advanceTimersByTime(999));
      expect(MockWebSocket.instances).toHaveLength(2);
      act(() => vi.advanceTimersByTime(1));
      const connected = MockWebSocket.instances[2];
      act(() => connected.onopen?.());
      expect(connected.sent).toEqual([JSON.stringify({ type: "auth", token: "refreshed-token" })]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("closes the socket and cancels retries on unmount", () => {
    vi.useFakeTimers();
    try {
      const { unmount } = renderProbe();
      const ws = MockWebSocket.instances[0];
      act(() => ws.onclose?.({ code: 1006 }));
      unmount();
      expect(ws.close).toHaveBeenCalledOnce();
      act(() => vi.advanceTimersByTime(30000));
      expect(MockWebSocket.instances).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("caps retries at 30 seconds and resets the delay after a successful connection", () => {
    vi.useFakeTimers();
    try {
      renderProbe();
      for (const delay of [500, 1000, 2000, 4000, 8000, 15000, 15000]) {
        const count = MockWebSocket.instances.length;
        act(() => MockWebSocket.instances[count - 1].onclose?.({ code: 1006 }));
        act(() => vi.advanceTimersByTime(delay - 1));
        expect(MockWebSocket.instances).toHaveLength(count);
        act(() => vi.advanceTimersByTime(1));
        expect(MockWebSocket.instances).toHaveLength(count + 1);
      }
      const connected = MockWebSocket.instances[MockWebSocket.instances.length - 1];
      act(() => connected.onopen?.());
      const count = MockWebSocket.instances.length;
      act(() => connected.onclose?.({ code: 1006 }));
      act(() => vi.advanceTimersByTime(499));
      expect(MockWebSocket.instances).toHaveLength(count);
      act(() => vi.advanceTimersByTime(1));
      expect(MockWebSocket.instances).toHaveLength(count + 1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("cleans up the StrictMode trial connection without scheduling an extra retry", () => {
    vi.useFakeTimers();
    try {
      const { unmount } = render(
        <StrictMode>
          <RealtimeProvider>
            <AppContext.Provider value={{ ...appContextDefault, logout }}>
              <I18nextProvider i18n={i18n}>
                <Probe />
              </I18nextProvider>
            </AppContext.Provider>
          </RealtimeProvider>
        </StrictMode>,
      );
      expect(MockWebSocket.instances).toHaveLength(2);
      const [discarded, active] = MockWebSocket.instances;
      expect(discarded.close).toHaveBeenCalledOnce();
      expect(active.close).not.toHaveBeenCalled();
      // Native close events arrive asynchronously, after effect cleanup.
      act(() => discarded.onclose?.({ code: 1006 }));
      act(() => vi.advanceTimersByTime(60000));
      expect(MockWebSocket.instances).toHaveLength(2);
      act(() =>
        active.onmessage?.({
          data: JSON.stringify({ event: "btc_info", data: { blocks: 45 } }),
        }),
      );
      expect(screen.getByTestId("blocks")).toHaveTextContent("45");
      unmount();
      expect(active.close).toHaveBeenCalledOnce();
      act(() => active.onclose?.({ code: 1000 }));
      act(() => vi.advanceTimersByTime(60000));
      expect(MockWebSocket.instances).toHaveLength(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("clears the session and never reconnects after the user logs out", () => {
    function AuthenticatedProbe() {
      const context = useContext(AppContext);
      return context.isLoggedIn ? (
        <>
          <button onClick={context.logout}>Log out</button>
          <Probe />
        </>
      ) : (
        <div>Signed out</div>
      );
    }
    vi.useFakeTimers();
    try {
      const payload = btoa(
        JSON.stringify({ user_id: "admin", exp: Math.floor(Date.now() / 1000) + 3600 }),
      );
      localStorage.setItem("access_token", `header.${payload}.signature`);
      renderWithProviders(
        <RealtimeProvider>
          <AppContextProvider>
            <AuthenticatedProbe />
          </AppContextProvider>
        </RealtimeProvider>,
      );
      expect(MockWebSocket.instances).toHaveLength(1);
      const ws = MockWebSocket.instances[0];
      fireEvent.click(screen.getByRole("button", { name: "Log out" }));
      expect(screen.getByText("Signed out")).toBeVisible();
      expect(localStorage.getItem("access_token")).toBeNull();
      expect(ws.close).toHaveBeenCalled();
      act(() => ws.onclose?.({ code: 1000 }));
      act(() => vi.advanceTimersByTime(60000));
      expect(MockWebSocket.instances).toHaveLength(1);
    } finally {
      vi.useRealTimers();
      window.history.replaceState({}, "", "/");
    }
  });

  it("rejects array and malformed transaction payloads, preserving valid transactions", () => {
    renderProbe();
    const ws = MockWebSocket.instances[0];
    const transaction = {
      index: 1,
      id: "tx-1",
      category: "onchain",
      type: "receive",
      amount: 1000,
      time_stamp: 1700000000,
      comment: "",
      status: "succeeded",
      block_height: 100,
      num_confs: 1,
      total_fees: null,
    } satisfies Transaction;
    const send = (data: unknown) =>
      act(() =>
        ws.onmessage?.({
          data: JSON.stringify({ event: "transactions", data }),
        }),
      );
    send(transaction);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    for (const invalid of [
      [],
      [transaction],
      null,
      "bad",
      {},
      { ...transaction, amount: "1000" },
    ]) {
      send(invalid);
    }
    const next = { ...transaction, id: "tx-2", category: "ln", block_height: null };
    send(next);
    expect(screen.getByTestId("transactions")).toHaveTextContent(
      JSON.stringify([next, transaction]),
    );
    expect(error).toHaveBeenCalledTimes(6);
  });

  it("uses the new language for notifications without reconnecting", async () => {
    const translations = i18n.cloneInstance({
      lng: "en",
      fallbackLng: "en",
      defaultNS: "translation",
      forkResourceStore: true,
    });
    translations.addResourceBundle("en", "translation", {
      apps: { install_success: "Installed {{appName}}" },
    });
    translations.addResourceBundle("de", "translation", {
      apps: {
        install_success: "Installiert: {{appName}}",
        uninstall_failure: "Fehler: {{appName}} / {{details}}",
      },
    });
    const success = vi.spyOn(toast, "success").mockImplementation(() => "toast");
    const error = vi.spyOn(toast, "error").mockImplementation(() => "toast");
    renderProbe(translations);
    const ws = MockWebSocket.instances[0];
    const send = (data: unknown) =>
      act(() => ws.onmessage?.({ data: JSON.stringify({ event: "install", data }) }));
    send({ id: "lnbits", mode: "on", result: "win" });
    expect(success).toHaveBeenLastCalledWith("Installed LNbits", { theme: "dark" });
    await act(async () => {
      await translations.changeLanguage("de");
    });
    expect(MockWebSocket.instances).toHaveLength(1);
    expect(ws.close).not.toHaveBeenCalled();
    send({ id: "lnbits", mode: "on", result: "win" });
    expect(success).toHaveBeenLastCalledWith("Installiert: LNbits", { theme: "dark" });
    send({ id: "lnbits", mode: "off", result: "fail", details: "busy" });
    expect(error).toHaveBeenLastCalledWith("Fehler: LNbits / busy");
  });

  it.each([0, 0.5, 0.999])(
    "jitters each exponential retry and respects the cap (random=%s)",
    (random) => {
      vi.mocked(Math.random).mockReturnValue(random);
      vi.useFakeTimers();
      try {
        renderProbe();
        for (const interval of [1000, 2000, 4000, 8000, 16000, 30000, 30000]) {
          const count = MockWebSocket.instances.length;
          act(() => MockWebSocket.instances[count - 1].onclose?.({ code: 1006 }));
          const delay = Math.floor(interval / 2 + (random * interval) / 2);
          act(() => vi.advanceTimersByTime(delay - 1));
          expect(MockWebSocket.instances).toHaveLength(count);
          act(() => vi.advanceTimersByTime(1));
          expect(MockWebSocket.instances).toHaveLength(count + 1);
          expect(delay).toBeGreaterThanOrEqual(interval / 2);
          expect(delay).toBeLessThanOrEqual(30000);
        }
      } finally {
        vi.useRealTimers();
      }
    },
  );

  it("closes only the socket that emitted an error", () => {
    vi.useFakeTimers();
    try {
      renderProbe();
      const first = MockWebSocket.instances[0];
      act(() => first.onerror?.());
      expect(first.close).toHaveBeenCalledOnce();
      act(() => first.onclose?.({ code: 1006 }));
      act(() => vi.advanceTimersByTime(500));
      const second = MockWebSocket.instances[1];
      // A late callback from the old socket must not close the current connection.
      act(() => first.onerror?.());
      expect(second.close).not.toHaveBeenCalled();
      act(() => second.onerror?.());
      expect(second.close).toHaveBeenCalledOnce();
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps hardware state null until valid data arrives, then preserves it on malformed updates", () => {
    expect(realtimeContextDefault.hardwareInfo).toBeNull();
    expect(realtimeContextDefault.systemStartupInfo).toBeNull();
    renderProbe();
    expect(screen.getByTestId("hardware")).toHaveTextContent("null");
    const ws = MockWebSocket.instances[0];
    const send = (data: unknown) =>
      act(() => ws.onmessage?.({ data: JSON.stringify({ event: "hardware_info", data }) }));
    send({ vram_total_bytes: 4000 });
    expect(screen.getByTestId("hardware")).toHaveTextContent("null");
    const hardware = {
      cpu_overall_percent: 1,
      cpu_per_cpu_percent: [1],
      vram_total_bytes: 4000,
      vram_available_bytes: 3000,
      vram_used_bytes: 1000,
      vram_usage_percent: 25,
      temperatures_celsius: { system_temp: 50, coretemp: [] },
      boot_time_timestamp: 1700000000,
      disks: [],
      networks: {
        internet_online: "1",
        tor_web_addr: "",
        internet_localip: "127.0.0.1",
        internet_localiprange: "127.0.0.1/24",
      },
    };
    send(hardware);
    send({ disks: "invalid" });
    send({ vram_usage_percent: 30 });
    expect(screen.getByTestId("hardware")).toHaveTextContent(
      JSON.stringify({ ...hardware, vram_usage_percent: 30 }),
    );
  });

  it("dispatches parsed app status and installation messages, ignoring unknown app IDs", () => {
    renderProbe();
    const ws = MockWebSocket.instances[0];
    const send = (event: string, data: unknown) =>
      act(() => ws.onmessage?.({ data: JSON.stringify({ event, data }) }));
    const app = {
      id: "lnbits",
      name: "LNbits",
      author: "LNbits",
      repository: "https://github.com/lnbits/lnbits",
    };
    send("apps", [app, null, { ...app, id: "future-app" }]);
    expect(screen.getByTestId("apps")).toHaveTextContent(JSON.stringify([app]));
    const status = { id: "lnbits", installed: true, configured: true, status: "online" };
    send("app_state_update_message", {
      state: "success",
      message: { data: [status], errors: [], timestamp: 123 },
    });
    expect(screen.getByTestId("app-status")).toHaveTextContent(
      JSON.stringify({ data: [status], errors: [], timestamp: 123 }),
    );
    send("app_manage_message", {
      id: "lnbits",
      mode: "on",
      state: "running",
      error_id: "none",
      message: "Installing",
    });
    expect(screen.getByTestId("installation")).toHaveTextContent('"currentState":"running"');
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    send("app_manage_message", { id: "future-app", state: "running" });
    expect(screen.getByTestId("installation")).not.toHaveTextContent("future-app");
    expect(error).toHaveBeenCalledOnce();
  });
});
