import { act, render, waitFor } from "test-utils";
import App from "@/App";
import { HttpResponse, http, server } from "@/testServer";
import { ACCESS_TOKEN } from "@/utils";

const now = 1_800_000_000;
const token = (seconds: number) =>
  `header.${btoa(JSON.stringify({ user_id: "admin", iat: now, exp: now + seconds }))}.signature`;

// Keep these tests focused on the authentication lifecycle, without route UI timers.
vi.mock("@/pages/Login", () => ({ default: () => null }));

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
