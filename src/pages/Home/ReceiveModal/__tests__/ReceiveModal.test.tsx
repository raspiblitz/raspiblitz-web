import { http, HttpResponse, server } from "@/testServer";
import userEvent from "@testing-library/user-event";
import { mockedDisclosure, render, screen } from "test-utils";
import ReceiveModal from "../ReceiveModal";

beforeEach(() => {
  server.use(
    http.post("/api/lightning/new-address", () => {
      return new HttpResponse("bcrt1qvh74klc36lefsdgq5r2d44vwxxzkdsch0hhyrz", {
        status: 200,
      });
    }),
  );
});

describe("ReceiveModal", () => {
  test("Retrieves new on-chain address on click of on-chain button", async () => {
    const user = userEvent.setup();
    render(<ReceiveModal disclosure={mockedDisclosure} />);

    const onChainBtn = screen.getByRole("tab", { name: "wallet.fund" });

    await user.click(onChainBtn);

    expect(await screen.findByRole("img")).toBeDefined();
  });

  test("Retrieves a new address upon clicking the refresh button", async () => {
    const user = userEvent.setup();
    render(<ReceiveModal disclosure={mockedDisclosure} />);

    const onChainBtn = screen.getByRole("tab", { name: "wallet.fund" });

    await user.click(onChainBtn);

    // one-time address override
    const newMockAddress = "muZ3nH1uH2U5JBhZRvYU46MdChbCifSghQ";
    server.use(
      http.post(
        "/api/lightning/new-address",
        () => {
          return new HttpResponse(newMockAddress, {
            status: 200,
          });
        },
        { once: true },
      ),
    );

    const refreshBtn = await screen.findByRole("button", {
      name: "wallet.refresh",
    });
    await user.click(refreshBtn);

    expect(await screen.findByRole("img")).toBeInTheDocument();
    expect(await screen.findByText(newMockAddress)).toBeInTheDocument();
  });
});
