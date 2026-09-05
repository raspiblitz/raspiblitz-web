import { act, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppContext, appContextDefault } from "@/context/app-context";
import RealtimeProvider from "@/context/realtime-context";
import useRealtime from "@/hooks/use-realtime";
import i18n from "@/i18n/test_config";

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
  const { btcInfo, systemStartupInfo } = useRealtime();
  return (
    <>
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
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  const renderProbe = () =>
    render(
      <RealtimeProvider>
        <AppContext.Provider value={{ ...appContextDefault, logout }}>
          <I18nextProvider i18n={i18n}>
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

  it("logs the user out when the socket closes with code 4401", async () => {
    renderProbe();

    await waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    const ws = MockWebSocket.instances[0];

    act(() => {
      ws.onclose?.({ code: 4401 });
    });

    expect(logout).toHaveBeenCalledTimes(1);
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
        vi.advanceTimersByTime(1000);
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
      act(() => vi.advanceTimersByTime(1000));
      const retry = MockWebSocket.instances[1];
      act(() => retry.onclose?.({ code: 1006 }));
      act(() => vi.advanceTimersByTime(1999));
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
});
