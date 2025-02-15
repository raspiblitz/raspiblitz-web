import AppContextProvider, {
  appContextDefault,
  type AppContextType,
} from "@/context/app-context";
import SSEContextProvider, {
  SSE_URL,
  sseContextDefault,
  type SSEContextType,
} from "@/context/sse-context";
import i18n from "@/i18n/test_config";
import Layout from "@/layouts/Layout";
import { server } from "@/testServer";
import { render, screen, waitFor } from "@testing-library/react";
import { EventSource } from "eventsource";
import { http, HttpResponse } from "msw";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router";
import Home from "../index";

global.EventSource = EventSource;
// Mock contexts
const mockAppContext: AppContextType = {
  ...appContextDefault,
};

const mockSSEContext: SSEContextType = {
  ...sseContextDefault,
  btcInfo: {
    subversion: "0.0.1",
    headers: 0,
    version: 21,
    blocks: 2,
    connections_in: 5,
    connections_out: 4,
    networks: [],
    size_on_disk: 0,
    difficulty: 0,
    verification_progress: 100,
  },
  balance: {
    channel_local_balance: 1000000,
    onchain_confirmed_balance: 500000,
    channel_pending_open_local_balance: 0,
    channel_pending_open_remote_balance: 0,
    channel_remote_balance: 0,
    channel_unsettled_local_balance: 0,
    channel_unsettled_remote_balance: 0,
    onchain_total_balance: 10,
    onchain_unconfirmed_balance: 0,
  },
  lnInfo: {
    ...sseContextDefault.lnInfo,
    implementation: "LND_GRPC",
    version: "0.0.0",
  },
  systemStartupInfo: {
    lightning: "done",
    bitcoin: "done",
    bitcoin_msg: "",
    lightning_msg: "",
  },
};

const encoder = new TextEncoder();

// Create MSW server
server.use(
  http.get("/api/lightning/list-all-tx", () => {
    return HttpResponse.json([]);
  }),
  http.get(SSE_URL, () => {
    const stream = new ReadableStream({
      start(controller) {
        // Simulate SSE messages
        controller.enqueue(
          encoder.encode(
            'event: wallet_balance\ndata: {"onchain_total_balance": 123456}\n\n',
          ),
        );

        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      },
    });
  }),
);

describe("Home Component", () => {
  it("renders and handles SSE updates correctly", async () => {
    const { container } = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AppContextProvider>
            <SSEContextProvider>
              <Layout>
                <Home />
              </Layout>
            </SSEContextProvider>
          </AppContextProvider>
        </I18nextProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/LND/i)).toBeInTheDocument();
    });

    console.log(container.innerHTML);
    // Verify transaction list is loaded
    await waitFor(() => {
      expect(screen.getByText(/123,456 SAT/)).toBeInTheDocument();
    });
  });

  it("handles wallet locked state", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AppContextProvider
          value={{ ...mockAppContext, walletLocked: true } as unknown}
        >
          <SSEContextProvider value={mockSSEContext as unknown}>
            <Home />
          </SSEContextProvider>
        </AppContextProvider>
      </I18nextProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument(); // UnlockModal should be shown
    });
  });
});
