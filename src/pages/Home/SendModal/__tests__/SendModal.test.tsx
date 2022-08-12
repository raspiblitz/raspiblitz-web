import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../../i18n/test_config";
import { rest, server } from "../../../../testServer";
import SendModal, { Props } from "../SendModal";

const handleClose = jest.fn();
const basicProps: Props = {
  lnBalance: 0,
  onchainBalance: 0,
  onClose: handleClose,
};

const setup = () => {
  render(
    <I18nextProvider i18n={i18n}>
      <SendModal {...basicProps} />
    </I18nextProvider>
  );
};

describe("SendModal", () => {
  it("should render with lightning as default", () => {
    setup();

    const addressInput = screen.getByLabelText("wallet.invoice");
    const lnTypeBtn = screen.getByRole("button", {
      name: "lightning.svg home.lightning",
    });
    const onChainBtn = screen.getByRole("button", {
      name: "link.svg wallet.on_chain",
    });

    expect(addressInput).toBeInTheDocument();
    expect(lnTypeBtn).toBeDisabled();
    expect(onChainBtn).not.toBeDisabled();
  });

  it("should close on click of X button", async () => {
    const user = userEvent.setup();
    setup();
    const closeBtn = screen.getByRole("button", { name: "X.svg" });
    await user.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  describe("SendLN", () => {
    it("enables the send button on valid input", async () => {
      const user = userEvent.setup();
      setup();

      const sendBtn = screen.getByRole("button", {
        name: "send.svg wallet.send",
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
        name: "send.svg wallet.send",
      });
      const addressInput = screen.getByLabelText("wallet.invoice");
      await user.type(addressInput, "bla");
      expect(addressInput).toHaveClass("input-error");
      expect(sendBtn).toBeDisabled();
    });

    it("should send the decode request correctly", async () => {
      server.use(
        rest.get("/api/v1/lightning/decode-pay-req", (req, res, ctx) => {
          if (req.url.searchParams.get("pay_req")) {
            return res(
              ctx.status(200),
              ctx.json({
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
              })
            );
          } else {
            return res(ctx.status(500));
          }
        })
      );
      const user = userEvent.setup();
      setup();

      const sendBtn = screen.getByRole("button", {
        name: "send.svg wallet.send",
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

      const onChainBtn = screen.getByRole("button", {
        name: "link.svg wallet.on_chain",
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
      expect(addressInput).toHaveClass("input-error");
    });

    it("should format amount correctly", async () => {
      const addressInput = await screen.findByLabelText("wallet.address");
      const amountInput = await screen.findByLabelText("wallet.amount");
      await user.type(addressInput, "bc1q12345");
      await user.type(amountInput, "20123");
      expect(amountInput).toHaveValue("20,123");
    });

    it("test a valid form pass", async () => {
      const addressInput = await screen.findByLabelText("wallet.address");
      const amountInput = await screen.findByLabelText("wallet.amount");
      const feeInput = await screen.findByLabelText("tx.fee");
      await user.type(addressInput, "bc1q12345");
      await user.type(amountInput, "20123");
      await user.type(feeInput, "200");

      const confirmBtn = screen.getByRole("button", {
        name: "wallet.confirm",
      });

      expect(confirmBtn).toBeEnabled();
      await user.click(confirmBtn);
      // Should display confirm modal with amount
      expect(await screen.findByText("20123 Sat")).toBeInTheDocument();
    });
  });
});
