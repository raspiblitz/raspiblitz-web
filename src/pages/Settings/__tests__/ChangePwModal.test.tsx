import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "test-utils";
import { toast } from "react-toastify";
import { HttpResponse, http, server } from "@/testServer";
import ChangePwModal from "../ChangePwModal";

vi.mock("react-toastify", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("password change API contract", () => {
  afterEach(() => vi.clearAllMocks());

  test.each([200, 406])(
    "sends credentials only in the JSON body and handles status %i",
    async (status) => {
      const requests: { url: string; body: unknown }[] = [];
      server.use(
        http.post("/api/system/change-password", async ({ request }) => {
          requests.push({ url: request.url, body: await request.json() });
          return status === 200
            ? new HttpResponse(null)
            : HttpResponse.json({ detail: "old password not correct" }, { status });
        }),
      );
      const user = userEvent.setup();
      render(<ChangePwModal />);
      await user.click(screen.getByRole("button", { name: "settings.change" }));
      await user.type(screen.getByLabelText("settings.old_pw"), "oldpass12");
      await user.type(screen.getByLabelText("settings.new_pw"), "newpass12");
      await user.click(screen.getByRole("button", { name: "settings.confirm" }));
      await waitFor(() => expect(requests).toHaveLength(1));
      expect(new URL(requests[0].url).search).toBe("");
      expect(requests[0].body).toEqual({
        type: "a",
        old_password: "oldpass12",
        new_password: "newpass12",
      });
      await waitFor(() =>
        expect(status === 200 ? toast.success : toast.error).toHaveBeenCalledOnce(),
      );
    },
  );
});
