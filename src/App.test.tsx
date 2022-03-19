import { render, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import i18n from "./i18n/test_config";
import { rest, server } from "./testServer";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("App", () => {
  afterEach(() => {
    server.resetHandlers();
  });

  test("should route to /setup if setup is not done", async () => {
    server.use(
      rest.get("/api/v1/setup/status", (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            setupPhase: "STARTING",
            state: "",
            message: "",
          })
        );
      })
    );

    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    );
    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledTimes(1));
  });

  test("should route to /login if setup is done", async () => {
    server.use(
      rest.get("/api/v1/setup/status", (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            setupPhase: "DONE",
            state: "",
            message: "",
          })
        );
      })
    );
    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    );
    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledTimes(0));
  });
});
