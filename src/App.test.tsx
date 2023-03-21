import { I18nextProvider } from "react-i18next";
import { render, waitFor, screen } from "test-utils";
import App from "./App";
import { rest, server } from "./testServer";
import i18n from "i18n/test_config";

const mockedUsedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const reactRouterDom: any = await vi.importActual("react-router-dom");

  return { ...reactRouterDom, useNavigate: () => mockedUsedNavigate };
});

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
            setupPhase: "starting",
            state: "",
            message: "",
          })
        );
      })
    );

    render(
      <I18nextProvider i18n={i18n}>
        <App />
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
            setupPhase: "done",
            state: "",
            message: "",
          })
        );
      })
    );
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    );
    expect(await screen.findByText("Log in")).toBeInTheDocument();
  });
});
