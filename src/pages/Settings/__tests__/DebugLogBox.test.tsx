import { toast } from "react-toastify";
import { fireEvent, render, screen } from "test-utils";
import DebugLogBox from "../DebugLogBox";

vitest.mock("react-toastify", () => ({
  toast: {
    info: vitest.fn(),
    error: vitest.fn(),
  },
}));

describe("DebugLogBox", () => {
  it("renders without crashing", () => {
    render(<DebugLogBox />);
  });

  it("displays a button to generate a debug report", () => {
    render(<DebugLogBox />);
    const button = screen.getByRole("button", {
      name: /settings.generate/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("sets isGeneratingReport to true when the button is clicked", async () => {
    const setIsGeneratingReport = vitest.fn();
    render(<DebugLogBox />, {
      providerOptions: {
        appProps: {
          setIsGeneratingReport,
        },
      },
    });
    const button = screen.getByRole("button", {
      name: /settings.generate/i,
    });
    fireEvent.click(button);
    expect(setIsGeneratingReport).toHaveBeenCalledWith(true);
  });

  it("displays a loading toast while the report is being generated", async () => {
    render(<DebugLogBox />);
    const button = screen.getByRole("button", {
      name: /settings.generate/i,
    });
    fireEvent.click(button);
    expect(toast.info).toHaveBeenCalledWith(expect.any(String), {
      isLoading: true,
    });
  });
});
