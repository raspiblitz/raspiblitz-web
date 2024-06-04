import App from "./App";
import { http, server, HttpResponse } from "./testServer";
import i18n from "@/i18n/test_config";
import { I18nextProvider } from "react-i18next";
import { render, waitFor, screen } from "test-utils";

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
      http.get("/api/setup/status", () => {
        return HttpResponse.json(
          {
            setupPhase: "starting",
            state: "",
            message: "",
          },
          { status: 200 },
        );
      }),
    );

    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>,
    );
    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledTimes(1));
  });

  test("should route to /login if setup is done", async () => {
    server.use(
      http.get("/api/setup/status", () => {
        return HttpResponse.json(
          {
            setupPhase: "done",
            state: "",
            message: "",
          },
          { status: 200 },
        );
      }),
    );
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>,
    );
    expect(await screen.findByText("Log in")).toBeInTheDocument();
  });
});
