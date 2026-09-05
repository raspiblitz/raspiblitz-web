import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { initialState } from "@/models/setup.model";
import SetupProvider, { useSetup } from "@/pages/Setup/SetupContext";
import { instance } from "@/utils/interceptor";

function wrapper({ children }: PropsWithChildren) {
  return (
    <SetupProvider
      state={initialState}
      updateState={() => {}}
      navigate={() => {}}
    >
      {children}
    </SetupProvider>
  );
}

describe("setup retry", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("ignores overlapping retries and allows retry after an error", async () => {
    let finishRequest = () => {};
    const response = new Promise<{ data: { state: string } }>((resolve) => {
      finishRequest = () => resolve({ data: { state: "error" } });
    });
    const request = vi
      .spyOn(instance, "get")
      .mockReturnValueOnce(response)
      .mockResolvedValue({ data: { state: "error" } });
    const { result } = renderHook(useSetup, { wrapper });

    await act(async () => {
      const first = result.current.callbacks.onRetry();
      const second = result.current.callbacks.onRetry();
      expect(request).toHaveBeenCalledTimes(1);
      finishRequest();
      await Promise.all([first, second]);
    });
    await act(() => result.current.callbacks.onRetry());
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("schedules only one polling continuation after a double retry", async () => {
    vi.useFakeTimers();
    const request = vi
      .spyOn(instance, "get")
      .mockResolvedValueOnce({ data: { state: "wait" } })
      .mockResolvedValue({ data: { state: "error" } });
    const { result } = renderHook(useSetup, { wrapper });
    await act(async () => {
      await Promise.all([
        result.current.callbacks.onRetry(),
        result.current.callbacks.onRetry(),
      ]);
    });
    expect(request).toHaveBeenCalledTimes(1);
    await act(() => vi.advanceTimersByTimeAsync(4000));
    expect(request).toHaveBeenCalledTimes(2);
    await act(() => vi.advanceTimersByTimeAsync(8000));
    expect(request).toHaveBeenCalledTimes(2);
  });
});
