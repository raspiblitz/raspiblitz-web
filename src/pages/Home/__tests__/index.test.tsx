import AppContextProvider from "@/context/app-context";
import SSEContextProvider, { SSE_URL } from "@/context/sse-context";
import i18n from "@/i18n/test_config";
import Layout from "@/layouts/Layout";
import { server } from "@/testServer";
import { expect } from "@playwright/test";
import { render, screen, waitFor } from "@testing-library/react";
import { EventSource } from "eventsource";
import { http, HttpResponse } from "msw";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router";
import Home from "../index";

// @ts-ignore
global.EventSource = EventSource;

// Mock contexts
const systemStartupInfo = {
  bitcoin: "done",
  bitcoin_msg: "",
  lightning: "",
  lightning_msg: "Wallet locked, unlock it to enable full RPC access",
};
const walletBalance = {
  onchain_confirmed_balance: 742363,
  onchain_total_balance: 123123,
  onchain_unconfirmed_balance: 200000000,
  channel_local_balance: 333000,
  channel_remote_balance: 100000000,
  channel_unsettled_local_balance: 0,
  channel_unsettled_remote_balance: 0,
  channel_pending_open_local_balance: 0,
  channel_pending_open_remote_balance: 0,
};

const systemInfo = {
  alias: "myBlitz",
  color: "#3399ff",
  platform: "raspiblitz",
  platform_version: "1.8.0-mock",
  api_version: "v0.5.0beta",
  tor_web_ui: "arg6ybal4b7dszmsncsrudcpdfkxadzfdi24ktceodah7tgmdopgpyfd.onion",
  tor_api: "arg6ybal4b7dszmsncsrudcpdfkxadzfdi24ktceodah7tgmdopgpyfd.onion/api",
  lan_web_ui: "http://192.168.1.12",
  lan_api: "http://192.168.1.12/api",
  ssh_address: "192.168.1.12",
  chain: "regtest",
};

const lnInfo = {
  implementation: "LND_GRPC",
  version: "0.17.3-beta commit=v0.17.3-beta",
  commit_hash: "13aa7f99248c7ee63989d3b62e0cbfe86d7b0964",
  identity_pubkey:
    "03968caa15a360137c31a8ff4573608c44cbee4fe592175321b62386334a3ca0da",
  identity_uri:
    "03968caa15a360137c31a8ff4573608c44cbee4fe592175321b62386334a3ca0da@gsfixgvo5zhw6uprdyfvpqijuzod3nfxfhj5ivxf7mdox7zrg3cwdoyd.onion:9735",
  alias: "TestMePls",
  color: "#68f442",
  num_pending_channels: 0,
  num_active_channels: 1,
  num_inactive_channels: 0,
  num_peers: 4,
  block_height: 825606,
  block_hash:
    "0000000000000000000072071f7d12f61e0489e1d62fe3686be5a7cd784c2ca5",
  best_header_timestamp: 1705138071,
  synced_to_chain: true,
  synced_to_graph: true,
  chains: [
    {
      chain: "bitcoin",
      network: "mainnet",
    },
  ],
  uris: ["03968caa15a360137c31.onion:9735"],
  features: [
    {
      key: 45,
      value: {
        name: "explicit-commitment-type",
        is_required: false,
        is_known: true,
      },
    },
    {
      key: 9,
      value: {
        name: "tlv-onion",
        is_required: false,
        is_known: true,
      },
    },
    {
      key: 14,
      value: {
        name: "payment-addr",
        is_required: true,
        is_known: true,
      },
    },
    {
      key: 12,
      value: {
        name: "static-remote-key",
        is_required: true,
        is_known: true,
      },
    },
    {
      key: 17,
      value: {
        name: "multi-path-payments",
        is_required: false,
        is_known: true,
      },
    },
    {
      key: 0,
      value: {
        name: "data-loss-protect",
        is_required: true,
        is_known: true,
      },
    },
    {
      key: 7,
      value: {
        name: "gossip-queries",
        is_required: false,
        is_known: true,
      },
    },
    {
      key: 23,
      value: {
        name: "anchors-zero-fee-htlc-tx",
        is_required: false,
        is_known: true,
      },
    },
    {
      key: 27,
      value: {
        name: "shutdown-any-segwit",
        is_required: false,
        is_known: true,
      },
    },
    {
      key: 30,
      value: {
        name: "amp",
        is_required: true,
        is_known: true,
      },
    },
    {
      key: 31,
      value: {
        name: "amp",
        is_required: false,
        is_known: true,
      },
    },
    {
      key: 2023,
      value: {
        name: "script-enforced-lease",
        is_required: false,
        is_known: true,
      },
    },
    {
      key: 5,
      value: {
        name: "upfront-shutdown-script",
        is_required: false,
        is_known: true,
      },
    },
  ],
};

function createEvent(eventName: string, eventContent: unknown) {
  return `event: ${eventName}\ndata: ${JSON.stringify(eventContent)}\n\n`;
}

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
          encoder.encode(createEvent("system_startup_info", systemStartupInfo)),
        );

        controller.enqueue(
          encoder.encode(createEvent("wallet_balance", walletBalance)),
        );

        controller.enqueue(
          encoder.encode(createEvent("system_info", systemInfo)),
        );

        controller.enqueue(encoder.encode(createEvent("ln_info", lnInfo)));

        controller.enqueue(encoder.encode(createEvent("ln_info", lnInfo)));

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
    render(
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
      const totalBalanceValue = screen
        .getByTestId("total-balance")
        .querySelector("p");
      expect(totalBalanceValue).toBeDefined();

      expect(totalBalanceValue?.textContent).toContain("123,456 SAT");
    });
  });
});
