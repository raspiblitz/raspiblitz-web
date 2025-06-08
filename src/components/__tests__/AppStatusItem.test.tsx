import { AppId, type AppStatus } from "@/models/app-status";
import { render, screen } from "test-utils";
import AppStatusItem from "../AppStatusItem";

const testApp: AppStatus = {
  id: AppId.SPECTER,
  version: "1.0.0",
  installed: true,
  configured: true,
  status: "online",
  address: "http://127.0.0.1",
  hidden_service: "hiddenservice.onion",
  error: null,
};

describe("AppStatusItem", () => {
  it("should link to 'address'", () => {
    render(<AppStatusItem app={testApp} />);

    const appCard = screen.getAllByRole("link");
    expect(appCard[0].getAttribute("href")).toEqual("http://127.0.0.1");
  });

  it("should link to 'hiddenService' if window.location is an onion address", () => {
    const oldWindow = window;
    Object.defineProperty(window, "location", {
      value: {
        hostname: "http://someplace.onion",
      },
      writable: true,
      configurable: true,
    });
    render(<AppStatusItem app={testApp} />);

    const appCard = screen.getAllByRole("link");
    expect(appCard[0].getAttribute("href")).toEqual(
      "https://hiddenservice.onion",
    );

    // Restore original window.location
    Object.defineProperty(window, "location", {
      value: oldWindow.location,
      writable: true,
      configurable: true,
    });
  });
});
