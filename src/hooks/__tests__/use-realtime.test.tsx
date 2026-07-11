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
  close() {}
}

function Probe() {
  const { btcInfo } = useRealtime();
  return <div data-testid="blocks">{btcInfo.blocks}</div>;
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

  it("logs the user out when the socket closes with code 4401", async () => {
    renderProbe();

    await waitFor(() => expect(MockWebSocket.instances.length).toBe(1));
    const ws = MockWebSocket.instances[0];

    act(() => {
      ws.onclose?.({ code: 4401 });
    });

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
