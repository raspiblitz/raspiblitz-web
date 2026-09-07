import { fireEvent, render, screen } from "test-utils";
import { applyInstallationMessage, parseInstallationMessage } from "@/utils/installation-state";
import type { InstallationStatus } from "@/models/installation-status";
import InstallationLogModal from "../InstallationLogModal";
import InstallationStatusCard from "../InstallationStatusCard";

function failedInstallation(): InstallationStatus {
  let status: InstallationStatus = {};
  for (const state of ["initiated", "failure", "finished"]) {
    const message = parseInstallationMessage({
      id: "lnbits",
      mode: "off",
      state,
      message:
        state === "failure"
          ? { detail: "Disk full", error_code: "disk_full", report: "Free some space" }
          : null,
    });
    if (!message) throw new Error("Invalid fixture");
    status = applyInstallationMessage(status, message);
  }
  return status;
}

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
});
afterEach(() => {
  Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
  vi.restoreAllMocks();
});

test("finished failures remain failed in the status card", () => {
  render(<InstallationStatusCard appId="lnbits" />, {
    providerOptions: { realtimeProps: { installationStatus: failedInstallation() } },
  });
  expect(screen.getByText("apps.failed")).toBeVisible();
  expect(screen.queryByText("apps.completed")).not.toBeInTheDocument();
});

test("downloads the received UTC timestamp and structured error details", async () => {
  vi.spyOn(Date, "now").mockReturnValue(Date.parse("2026-09-06T12:34:56.789Z"));
  const create = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:log");
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  render(<InstallationLogModal appId="lnbits" onClose={() => {}} />, {
    providerOptions: { realtimeProps: { installationStatus: failedInstallation() } },
  });
  fireEvent.click(screen.getByRole("button", { name: "common.download_log" }));
  const blob = create.mock.calls[0][0];
  if (!(blob instanceof Blob)) throw new Error("Expected a log blob");
  const text = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsText(blob);
  });
  expect(text).toContain("2026-09-06T12:34:56.789Z [FAILURE] Disk full");
  expect(text).toContain("Free some space");
  expect(text).toContain("ERROR: disk_full");
});

test("handles a missing installation without crashing", () => {
  const { container } = render(<InstallationLogModal appId="lnbits" onClose={() => {}} />);
  expect(container).toBeEmptyDOMElement();
});
