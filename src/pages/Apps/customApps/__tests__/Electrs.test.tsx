import { render, screen } from "test-utils";
import { http, HttpResponse, server } from "@/testServer";
import Electrs from "../Electrs";

describe("Electrs error handling", () => {
  it("displays API errors instead of leaving the loading screen visible", async () => {
    server.use(
      http.get("/api/apps/status_advanced/electrs", () =>
        HttpResponse.json({ detail: "Electrs is unavailable" }, { status: 503 }),
      ),
    );

    render(<Electrs />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Electrs is unavailable");
    expect(screen.getByRole("button", { name: "navigation.back" })).toBeInTheDocument();
  });

  it("displays a connection error when the node cannot be reached", async () => {
    server.use(http.get("/api/apps/status_advanced/electrs", () => HttpResponse.error()));

    render(<Electrs />);

    expect(await screen.findByRole("alert")).toHaveTextContent("login.node_unreachable");
  });
});
