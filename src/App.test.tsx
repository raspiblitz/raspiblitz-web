import { I18nextProvider } from "react-i18next";
import { render, screen, waitFor } from "test-utils";
import App from "@/App";
import i18n from "@/i18n/test_config";
import { HttpResponse, http, server } from "./testServer";

const mockedUsedNavigate = vi.fn();

vi.mock("react-router", async () => {
  // biome-ignore lint/suspicious/noExplicitAny: test
  const reactRouterDom: any = await vi.importActual("react-router");

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
            initialsync: "",
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

    expect(await screen.findByText("Enter password A")).toBeInTheDocument();
    expect(await screen.findByText("Log in")).toBeInTheDocument();
  });
});
