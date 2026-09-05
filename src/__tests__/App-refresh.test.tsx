import { act, render, waitFor } from "test-utils";
import App from "@/App";
import { AppContext, appContextDefault } from "@/context/app-context";
import { HttpResponse, http, server } from "@/testServer";
import { ACCESS_TOKEN } from "@/utils";

const now = 1_800_000_000;
const token = (seconds: number) =>
  `header.${btoa(JSON.stringify({ user_id: "admin", iat: now, exp: now + seconds }))}.signature`;

// Keep these tests focused on the authentication lifecycle, without route UI timers.
vi.mock("@/pages/Login", () => ({ default: () => null }));

const realSetTimeout = globalThis.setTimeout;

// Let MSW/Axios settle without advancing the fake clock used for retry deadlines.
async function settleRefresh(assertion: () => void) {
  await act(async () => {
    for (let attempt = 0; attempt < 100; attempt++) {
      await new Promise((resolve) => realSetTimeout(resolve, 5));
      try {
        assertion();
        return;
      } catch {
        if (attempt === 99) assertion();
      }
    }
  });
}

describe("token refresh lifecycle", () => {
  const logout = vi.fn(() => localStorage.removeItem(ACCESS_TOKEN));
  const options = { providerOptions: { appProps: { isLoggedIn: true, logout } } };

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] });
    vi.setSystemTime(now * 1000);
    window.history.replaceState({}, "", "/login");
    localStorage.clear();
    logout.mockClear();
  });
  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  test.each([null, "corrupt", token(-1), `a.${btoa('{"user_id":"admin","iat":1}')}.c`])(
    "logs out safely for stored token %j",
    (value) => {
      if (value) localStorage.setItem(ACCESS_TOKEN, value);
      render(<App />, options);
      expect(logout).toHaveBeenCalledOnce();
      expect(localStorage.getItem(ACCESS_TOKEN)).toBeNull();
    },
  );

  test("refreshes a short-lived token once and schedules the new token", async () => {
    const refreshed = token(3600);
    const refresh = vi.fn(() => HttpResponse.json(refreshed));
    server.use(http.post("/api/system/refresh-token", refresh));
    localStorage.setItem(ACCESS_TOKEN, token(60));
    render(<App />, options);
    await act(() => vi.advanceTimersByTimeAsync(29_999));
    expect(refresh).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTimeAsync(1));
    vi.useRealTimers();
    await waitFor(() => expect(localStorage.getItem(ACCESS_TOKEN)).toBe(refreshed));
    expect(refresh).toHaveBeenCalledOnce();
    expect(logout).not.toHaveBeenCalled();
  });

  test.each(["corrupt", null, {}, token(-1)])(
    "rejects refresh response %j without persisting it or retrying",
    async (response) => {
      const refresh = vi.fn(() => HttpResponse.json(response));
      server.use(http.post("/api/system/refresh-token", refresh));
      localStorage.setItem(ACCESS_TOKEN, token(60));
      render(<App />, options);
      await act(() => vi.advanceTimersByTimeAsync(30_000));
      vi.useRealTimers();
      await waitFor(() => expect(logout).toHaveBeenCalledOnce());
      expect(refresh).toHaveBeenCalledOnce();
      expect(localStorage.getItem(ACCESS_TOKEN)).toBeNull();
    },
  );

  test("logs out on a failed refresh", async () => {
    server.use(
      http.post("/api/system/refresh-token", () => new HttpResponse(null, { status: 401 })),
    );
    localStorage.setItem(ACCESS_TOKEN, token(60));
    render(<App />, options);
    await act(() => vi.advanceTimersByTimeAsync(30_000));
    vi.useRealTimers();
    await waitFor(() => expect(logout).toHaveBeenCalledOnce());
  });

  test("logs out if the stored token disappears before refresh", async () => {
    localStorage.setItem(ACCESS_TOKEN, token(60));
    render(<App />, options);
    localStorage.removeItem(ACCESS_TOKEN);
    await act(() => vi.advanceTimersByTimeAsync(30_000));
    expect(logout).toHaveBeenCalledOnce();
  });

  test.each([200, 503])(
    "resumes scheduling after another tab changes the token during a %i response",
    async (status) => {
      const refresh = vi.fn(() => {
        if (refresh.mock.calls.length === 1) {
          localStorage.setItem(ACCESS_TOKEN, token(120));
          return status === 200
            ? HttpResponse.json(token(3600))
            : new HttpResponse(null, { status });
        }
        return HttpResponse.json(token(3600));
      });
      server.use(http.post("/api/system/refresh-token", refresh));
      localStorage.setItem(ACCESS_TOKEN, token(60));
      render(<App />, options);
      await act(() => vi.advanceTimersByTimeAsync(30_000));
      await settleRefresh(() => expect(refresh).toHaveBeenCalledOnce());
      await act(() => vi.advanceTimersByTimeAsync(44_999));
      expect(refresh).toHaveBeenCalledOnce();
      expect(localStorage.getItem(ACCESS_TOKEN)).toBe(token(120));
      await act(() => vi.advanceTimersByTimeAsync(1));
      await settleRefresh(() => expect(localStorage.getItem(ACCESS_TOKEN)).toBe(token(3600)));
      expect(refresh).toHaveBeenCalledTimes(2);
      expect(logout).not.toHaveBeenCalled();
    },
  );

  test.each([503, "network"])("retries a temporary %s error and recovers", async (failure) => {
    const refresh = vi.fn(() =>
      refresh.mock.calls.length === 1
        ? failure === "network"
          ? HttpResponse.error()
          : new HttpResponse(null, { status: 503 })
        : HttpResponse.json(token(3600)),
    );
    server.use(http.post("/api/system/refresh-token", refresh));
    localStorage.setItem(ACCESS_TOKEN, token(60));
    render(<App />, options);
    await act(() => vi.advanceTimersByTimeAsync(30_000));
    await settleRefresh(() => expect(refresh).toHaveBeenCalledOnce());
    await act(() => vi.advanceTimersByTimeAsync(4_999));
    expect(refresh).toHaveBeenCalledOnce();
    expect(logout).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTimeAsync(1));
    await settleRefresh(() => expect(localStorage.getItem(ACCESS_TOKEN)).toBe(token(3600)));
    expect(refresh).toHaveBeenCalledTimes(2);
    expect(logout).not.toHaveBeenCalled();
  });

  test("backs off repeated failures and logs out at expiry", async () => {
    const refresh = vi.fn(() => new HttpResponse(null, { status: 503 }));
    server.use(http.post("/api/system/refresh-token", refresh));
    localStorage.setItem(ACCESS_TOKEN, token(60));
    render(<App />, options);
    await act(() => vi.advanceTimersByTimeAsync(30_000));
    await settleRefresh(() => expect(refresh).toHaveBeenCalledTimes(1));
    await act(() => vi.advanceTimersByTimeAsync(5_000));
    await settleRefresh(() => expect(refresh).toHaveBeenCalledTimes(2));
    await act(() => vi.advanceTimersByTimeAsync(10_000));
    await settleRefresh(() => expect(refresh).toHaveBeenCalledTimes(3));
    expect(logout).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTimeAsync(15_000));
    expect(logout).toHaveBeenCalledOnce();
    expect(refresh).toHaveBeenCalledTimes(3);
  });

  test("keeps the timer when logout changes and calls the latest handler", async () => {
    const latestLogout = vi.fn();
    const session = (handler: () => void) => (
      <AppContext value={{ ...appContextDefault, isLoggedIn: true, logout: handler }}>
        <App />
      </AppContext>
    );
    localStorage.setItem(ACCESS_TOKEN, token(60));
    const view = render(session(logout));
    await act(() => vi.advanceTimersByTimeAsync(20_000));
    view.rerender(session(latestLogout));
    localStorage.removeItem(ACCESS_TOKEN);
    await act(() => vi.advanceTimersByTimeAsync(10_000));
    expect(latestLogout).toHaveBeenCalledOnce();
    expect(logout).not.toHaveBeenCalled();
  });

  test("cancels the scheduled refresh on unmount", async () => {
    const refresh = vi.fn(() => HttpResponse.json(token(3600)));
    server.use(http.post("/api/system/refresh-token", refresh));
    localStorage.setItem(ACCESS_TOKEN, token(60));
    const view = render(<App />, options);
    view.unmount();
    await act(() => vi.advanceTimersByTimeAsync(60_000));
    expect(refresh).not.toHaveBeenCalled();
  });

  test("does not restore a token from an in-flight request after unmount", async () => {
    let respond: (response: Response) => void = () => {};
    const refresh = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          respond = resolve;
        }),
    );
    server.use(http.post("/api/system/refresh-token", refresh));
    localStorage.setItem(ACCESS_TOKEN, token(60));
    const view = render(<App />, options);
    await act(() => vi.advanceTimersByTimeAsync(30_000));
    vi.useRealTimers();
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    view.unmount();
    localStorage.removeItem(ACCESS_TOKEN);
    await act(async () => {
      respond(HttpResponse.json(token(3600)));
    });
    expect(localStorage.getItem(ACCESS_TOKEN)).toBeNull();
  });
});
