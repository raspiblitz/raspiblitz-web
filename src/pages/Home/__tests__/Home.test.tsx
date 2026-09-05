import { render, screen, waitFor } from "test-utils";
import { http, HttpResponse, server } from "@/testServer";
import Home from "../index";
import { type SSEContextType, sseContextDefault } from "@/context/sse-context";

const sseProps: Partial<SSEContextType> = {
  btcInfo: { ...sseContextDefault.btcInfo, subversion: "/Satoshi:30.0.0/" },
  lnInfo: { ...sseContextDefault.lnInfo, version: "", implementation: "LND_GRPC" },
  balance: {
    onchain_confirmed_balance: 0,
    onchain_total_balance: 0,
    onchain_unconfirmed_balance: 0,
    channel_local_balance: 0,
    channel_remote_balance: 0,
    channel_unsettled_local_balance: 0,
    channel_unsettled_remote_balance: 0,
    channel_pending_open_local_balance: 0,
    channel_pending_open_remote_balance: 0,
  },
};

describe("Home transaction errors", () => {
  it("shows a connection error when fetching transactions fails without a response", async () => {
    server.use(http.get("/api/lightning/list-all-tx", () => HttpResponse.error()));
    const setWalletLocked = vi.fn();

    render(<Home />, { providerOptions: { sseProps, appProps: { setWalletLocked } } });

    expect(await screen.findByText("login.error: login.node_unreachable")).toBeInTheDocument();
    expect(setWalletLocked).not.toHaveBeenCalled();
  });

  it("still marks the wallet as locked for HTTP 423", async () => {
    server.use(
      http.get("/api/lightning/list-all-tx", () =>
        HttpResponse.json({ detail: "Wallet locked" }, { status: 423 }),
      ),
    );
    const setWalletLocked = vi.fn();

    render(<Home />, { providerOptions: { sseProps, appProps: { setWalletLocked } } });

    await waitFor(() => expect(setWalletLocked).toHaveBeenCalledWith(true));
    expect(screen.queryByText("login.error: login.node_unreachable")).not.toBeInTheDocument();
  });
});
