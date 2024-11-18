import SendModal, { type Props } from "../SendModal";
import { HttpResponse, http, server } from "@/testServer";
import userEvent from "@testing-library/user-event";
import type { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { render, screen, mockedDisclosure, waitFor } from "test-utils";

const basicProps: Props = {
  lnBalance: 0,
  onchainBalance: 0,
  disclosure: mockedDisclosure,
};

const setup = () => {
  render(<SendModal {...basicProps} />);
};

describe("SendModal", () => {
  it("should render with lightning as default", () => {
    setup();

    const addressInput = screen.getByLabelText("wallet.invoice");
    expect(addressInput).toBeInTheDocument();
  });

  describe("SendLN", () => {
    it("enables the send button on valid input", async () => {
      const user = userEvent.setup();
      setup();

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
            return HttpResponse.json(
              {
                destination:
                  "0323dbd695d801553837f9907100f304abd153932bb000a3a7ea9132ff3e7437a1",
                payment_hash:
                  "dc171b0d9a6c33d40ba2d9ed95819b29af40d83132b15072ab4e8b60feb08b90",
                num_satoshis: 20,
                timestamp: 1893456000000,
                expiry: 36000,
                description: "TEST",
                description_hash: "",
                fallback_addr: "",
                cltv_expiry: 40,
                route_hints: [],
                payment_addr:
                  "24efc95be534b44b801ea5603b9aa1ad5424196972c7a3357b478e773b55f22e",
                num_msat: 20000,
                features: [],
              },
              { status: 200 },
            );
          } else {
            return new HttpResponse(null, { status: 500 });
          }
        }),
      );

      const user = userEvent.setup();
      setup();

      const sendBtn = screen.getByRole("button", {
        name: "wallet.send",
      });
      const addressInput = screen.getByLabelText("wallet.invoice");
      await user.type(addressInput, "lnbc111");
      await user.click(sendBtn);

      // Should display confirm modal with amount
      expect(await screen.findByText("20 Sat")).toBeInTheDocument();
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

    // it("test a valid form pass", async () => {
    //   const addressInput = await screen.findByLabelText("wallet.address");
    //   const amountInput = await screen.findByLabelText("wallet.amount");
    //   const feeInput = await screen.findByLabelText("tx.fee");
    //   await user.type(addressInput, "bc1q12345");
    //   await user.type(amountInput, "20123");
    //   await user.type(feeInput, "200");

    //   await user.tab();

    //   // Add custom wait to get correct form state in next re-rendering

    //   const confirmBtn = screen.getByRole("button", {
    //     name: "wallet.confirm",
    //   });
    //   await new Promise((resolve) => setTimeout(resolve, 0));

    //   expect(confirmBtn).toBeInTheDocument();

    //   console.log("confirmBtn", confirmBtn);

    //   // // Trigger blur events to ensure validation runs
    //   // await user.tab();

    //   // // Wait for the button to be enabled
    //   // await waitFor(() => expect(confirmBtn).toBeEnabled(), { timeout: 2000 });

    //   // // expect(confirmBtn).toBeEnabled();
    //   // await user.click(confirmBtn);
    //   // // Should display confirm modal with amount
    //   // expect(await screen.findByText("20,123 Sat")).toBeInTheDocument();
    // });

    it.only("test a valid form pass", async () => {
      const user = userEvent.setup();

      const addressInput = await screen.findByLabelText("wallet.address");
      const amountInput = await screen.findByLabelText("wallet.amount");
      const feeInput = await screen.findByLabelText("tx.fee");

      await user.type(addressInput, "bc1q12345");
      // console.log("addressInput", addressInput);

      await user.type(amountInput, "1");
      await user.type(feeInput, "1");

      await user.tab();

      const confirmBtn = screen.getByRole("button", {
        name: "wallet.confirm",
      });

      // await new Promise((resolve) => setTimeout(resolve, 0));

      // expect(confirmBtn).toBeInTheDocument();
      await waitFor(() => expect(confirmBtn).toBeEnabled());

      await user.click(confirmBtn);
    });
  });
});
