import { AppStatus } from "models/app-status";
import AppStatusCard from "pages/Home/AppStatusCard";
import { render, screen } from "test-utils";

const testApp: AppStatus = {
  id: "specter",
  installed: true,
  version: "1.0.0",
  address: "http://127.0.0.1",
  hiddenService: "hiddenservice.onion",
  error: "",
};

describe("AppStatusCard", () => {
  it("should link to 'address'", () => {
    render(<AppStatusCard app={testApp} />);

    const appCard = screen.getAllByRole("link");
    expect(appCard[0].getAttribute("href")).toEqual("http://127.0.0.1");
  });

  it("should link to 'hiddenService' if window.location is an onion address", () => {
    const oldWindow = global.window;
    global.window = Object.create(window);
    Object.defineProperty(window, "location", {
      value: {
        hostname: "http://someplace.onion",
      },
      writable: true,
    });
    render(<AppStatusCard app={testApp} />);

    const appCard = screen.getAllByRole("link");
    expect(appCard[0].getAttribute("href")).toEqual(
      "https://hiddenservice.onion",
    );
    global.window = oldWindow;
  });
});
