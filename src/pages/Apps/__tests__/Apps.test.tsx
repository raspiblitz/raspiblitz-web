import { fireEvent, render, screen, waitFor } from "test-utils";
import { AppId } from "@/models/app-status";
import { instance } from "@/utils/interceptor";
import Apps from "..";

describe("Apps status results", () => {
  test("offers an authenticated retry when there is no initial event or available cache", async () => {
    const get = vi.spyOn(instance, "get")
      .mockRejectedValueOnce(new Error("Unavailable"))
      .mockResolvedValueOnce({ data: { data: [], errors: [], timestamp: 123 } });
    const setAppStatus = vi.fn();
    try {
      render(<Apps />, { providerOptions: { sseProps: { setAppStatus } } });
      expect(await screen.findByRole("alert")).toBeDefined();
      fireEvent.click(screen.getByText("apps.refresh"));
      await waitFor(() => expect(setAppStatus).toHaveBeenCalledTimes(1));
      expect(get).toHaveBeenCalledTimes(2);
    } finally {
      get.mockRestore();
    }
  });

  test("shows retry and details when all status probes fail", () => {
    render(<Apps />, {
      providerOptions: {
        sseProps: {
          appStatus: {
            data: [],
            errors: [{ id: AppId.ELECTRS, error: "Status unavailable" }],
            timestamp: 123,
          },
        },
      },
    });
    expect(screen.getByText("apps.refresh")).toBeDefined();
    expect(screen.getByText("apps.view_error")).toBeDefined();
    expect(screen.queryByText("apps.install")).toBeNull();
  });
});
