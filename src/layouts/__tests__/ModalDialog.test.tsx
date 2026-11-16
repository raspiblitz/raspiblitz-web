import { render, screen, waitFor } from "test-utils";
import userEvent from "@testing-library/user-event";
import ModalDialog from "../ModalDialog";

test("names the dialog and supports explicit and Escape dismissal", async () => {
  const close = vi.fn();
  const user = userEvent.setup();
  render(
    <ModalDialog close={close} label="Installation log">
      <button>Download</button>
    </ModalDialog>,
  );
  const dialog = await screen.findByRole("dialog", { name: "Installation log" });
  await user.click(screen.getByRole("button", { name: "common.close" }));
  expect(close).toHaveBeenCalledTimes(1);
  dialog.focus();
  await user.keyboard("{Escape}");
  await waitFor(() => expect(close).toHaveBeenCalledTimes(2));
});

test("does not dismiss a non-closeable dialog with Escape", async () => {
  const close = vi.fn();
  const user = userEvent.setup();
  render(
    <ModalDialog close={close} label="Working" closeable={false}>
      <button>Details</button>
    </ModalDialog>,
  );
  await screen.findByRole("dialog", { name: "Working" });
  expect(screen.queryByRole("button", { name: "common.close" })).not.toBeInTheDocument();
  screen.getByRole("button", { name: "Details" }).focus();
  await user.keyboard("{Escape}");
  expect(close).not.toHaveBeenCalled();
});
