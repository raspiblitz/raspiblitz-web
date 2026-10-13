import userEvent, { type UserEvent } from "@testing-library/user-event";
import { mockedDisclosure, render, screen, waitFor } from "test-utils";
import type { DecodePayRequest } from "@/models/decode-pay-req";
import { HttpResponse, http, server } from "@/testServer";
import SendModal, { type Props } from "../SendModal";

const basicProps: Props = {
  lnBalance: 0,
  onchainBalance: 21000,
  disclosure: mockedDisclosure,
};

const decodedInvoice = {
  destination: "0323dbd695d801553837f9907100f304abd153932bb000a3a7ea9132ff3e7437a1",
  payment_hash: "dc171b0d9a6c33d40ba2d9ed95819b29af40d83132b15072ab4e8b60feb08b90",
  timestamp: 1893456000, // 01 Jan 2030 00:00:00 GMT, in Unix seconds
  expiry: 36000,
  description: "TEST",
  description_hash: "",
  fallback_addr: "",
  cltv_expiry: 40,
  route_hints: [],
  payment_addr: "24efc95be534b44b801ea5603b9aa1ad5424196972c7a3357b478e773b55f22e",
  num_msat: 20000,
  features: [],
  currency: "bc",
} satisfies DecodePayRequest;

const setup = () => {
  render(<SendModal {...basicProps} />);
};

describe("SendModal", () => {
  it.skip("should render with lightning as default", () => {
    // since "@heroui/react": "^2.7.4" teh defaukt does not render, but only in the tests,

    setup();

    const addressInput = screen.getByLabelText("wallet.invoice");
    expect(addressInput).toBeInTheDocument();
  });

  describe("SendLN", () => {
    it("enables the send button on valid input", async () => {
      const user = userEvent.setup();
      setup();

      const sendLightningTab = screen.getByRole("tab", {
        name: "wallet.send_lightning",
      });
      await user.click(sendLightningTab);

      const sendBtn = screen.getByRole("button", {
        name: "wallet.send",
      });
      const addressInput = screen.getByLabelText("wallet.invoice");
      expect(sendBtn).toBeDisabled();
      await user.type(addressInput, "lnbc123ewewewewew");
      expect(sendBtn).toBeEnabled();
    });

    it("disables the send button on invalid input", async () => {
      const user = userEvent.setup();
      setup();

      const sendLightningTab = screen.getByRole("tab", {
        name: "wallet.send_lightning",
      });
      await user.click(sendLightningTab);

      const sendBtn = screen.getByRole("button", {
        name: "wallet.send",
      });
      const addressInput = screen.getByLabelText("wallet.invoice");
      await user.type(addressInput, "bla");
      expect(addressInput).toHaveAttribute("aria-invalid", "true");
      expect(sendBtn).toBeDisabled();
    });

    it("should send the decode request correctly", async () => {
      server.use(
        http.get("/api/lightning/decode-pay-req", ({ request }) => {
          const url = new URL(request.url);
          if (url.searchParams.get("pay_req")) {
            return HttpResponse.json(decodedInvoice);
          } else {
            return new HttpResponse(null, { status: 500 });
          }
        }),
      );

      const user = userEvent.setup();
      setup();

      const sendLightningTab = screen.getByRole("tab", {
        name: "wallet.send_lightning",
      });
      await user.click(sendLightningTab);

      const sendBtn = screen.getByRole("button", {
        name: "wallet.send",
      });
      const addressInput = screen.getByLabelText("wallet.invoice");
      await user.type(addressInput, "lnbc111");
      await user.click(sendBtn);

      // Should display confirm modal with amount
      expect(await screen.findByText("20 Sat")).toBeInTheDocument();
    });

    it("sends the pasted BOLT11 invoice as pay_req after decoding and confirming", async () => {
      const invoice = "lnbc111";
      let decodeParams: URLSearchParams | undefined;
      let paymentParams: URLSearchParams | undefined;
      const close = vi.fn();
      server.use(
        http.get("/api/lightning/decode-pay-req", ({ request }) => {
          decodeParams = new URL(request.url).searchParams;
          return HttpResponse.json(decodedInvoice);
        }),
        http.post("/api/lightning/send-payment", ({ request }) => {
          paymentParams = new URL(request.url).searchParams;
          return new HttpResponse(null, { status: 200 });
        }),
      );

      const user = userEvent.setup();
      render(
        <SendModal
          {...basicProps}
          lnBalance={100000}
          disclosure={{ ...mockedDisclosure, close }}
        />,
      );
      await user.click(screen.getByRole("tab", { name: "wallet.send_lightning" }));
      await user.click(screen.getByLabelText("wallet.invoice"));
      await user.paste(invoice);
      await user.click(screen.getByRole("button", { name: "wallet.send" }));

      expect(await screen.findByText("20 Sat")).toBeInTheDocument();
      expect(decodeParams?.get("pay_req")).toBe(invoice);

      await user.click(screen.getByRole("button", { name: "settings.confirm" }));

      await waitFor(() => {
        expect(paymentParams?.get("pay_req")).toBe(invoice);
        expect(paymentParams?.has("amount_msat")).toBe(false);
        expect(close).toHaveBeenCalledOnce();
      });
      expect(screen.getByText(decodedInvoice.payment_addr)).toBeInTheDocument();
    });
  });

  describe("SendOnChain", () => {
    let user: UserEvent;
    // switch to onchain modal

    beforeEach(async () => {
      user = userEvent.setup();
      setup();

      const onChainBtn = screen.getByRole("tab", {
        name: "wallet.send_onchain",
      });

      await user.click(onChainBtn);
    });

    it("should switch to onChain on SwitchTxType click", async () => {
      const addressInput = await screen.findByLabelText("wallet.address");
      expect(addressInput).toBeInTheDocument();
    });

    it("should show error on wrong addrees input", async () => {
      const addressInput = await screen.findByLabelText("wallet.address");
      await user.type(addressInput, "bccccccc");
      expect(addressInput).toHaveAttribute("aria-invalid", "true");
    });

    it("should format amount correctly", async () => {
      const addressInput = await screen.findByLabelText("wallet.address");
      const amountInput = await screen.findByLabelText("wallet.amount");
      await user.type(addressInput, "bc1q12345");
      await user.type(amountInput, "20123");
      expect(amountInput).toHaveValue("20,123");
    });

    it("test a valid form pass", async () => {
      const addressInput = screen.getByLabelText("wallet.address");
      const amountInput = screen.getByLabelText("wallet.amount");
      const feeInput = screen.getByLabelText("tx.fee");

      await user.type(addressInput, "bc1q12345");
      await user.type(amountInput, "20123");
      await user.type(feeInput, "200");

      const confirmBtn = screen.getByRole("button", {
        name: "wallet.confirm",
      });

      expect(confirmBtn).toBeEnabled();
      await user.click(confirmBtn);

      // Should display confirm modal with amount
      expect(await screen.findByText("20,123 Sat")).toBeInTheDocument();
    });
  });
});
