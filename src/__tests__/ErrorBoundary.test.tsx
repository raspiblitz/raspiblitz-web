import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ErrorBoundary from "@/ErrorBoundary";
import "@/i18n/config";
import * as errorReport from "@/utils/error-report";

const failure = new Error("Test render failure");
function BrokenChild(): never {
  throw failure;
}

const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, "clipboard");
const commandDescriptor = Object.getOwnPropertyDescriptor(document, "execCommand");

describe("ErrorBoundary diagnostics", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (clipboardDescriptor) Object.defineProperty(navigator, "clipboard", clipboardDescriptor);
    else Reflect.deleteProperty(navigator, "clipboard");
    if (commandDescriptor) Object.defineProperty(document, "execCommand", commandDescriptor);
    else Reflect.deleteProperty(document, "execCommand");
  });

  it("copies the displayed report without rebuilding it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const createReport = vi.spyOn(errorReport, "createErrorReport");
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>,
    );
    const report = document.querySelector("pre")?.textContent;
    expect(report).toContain("Test render failure");
    fireEvent.click(screen.getByRole("button", { name: "Copy diagnostic report" }));
    await screen.findByRole("button", { name: "Copied" });
    expect(writeText).toHaveBeenCalledWith(report);
    expect(createReport).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Reload page" })).toBeVisible();
  });

  it.each(["throws", "returns false"])(
    "removes the fallback textarea when copying %s",
    async (mode) => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: undefined,
      });
      const copy = vi.fn(() => {
        if (mode === "throws") throw new Error("Copy failed");
        return false;
      });
      Object.defineProperty(document, "execCommand", {
        configurable: true,
        value: copy,
      });
      render(
        <ErrorBoundary>
          <BrokenChild />
        </ErrorBoundary>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Copy diagnostic report" }));
      await waitFor(() => expect(copy).toHaveBeenCalledWith("copy"));
      expect(document.querySelector("textarea")).toBeNull();
      expect(screen.queryByRole("button", { name: "Copied" })).not.toBeInTheDocument();
    },
  );
});
