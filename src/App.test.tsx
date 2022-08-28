import { BrowserRouter } from "react-router-dom";
import { render, waitFor } from "test-utils";
import App from "./App";
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledTimes(0));
  });
});
