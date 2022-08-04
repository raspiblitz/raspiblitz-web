import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../../i18n/test_config";
import { rest, server } from "../../../../testServer";
import { TxType } from "../../SwitchTxType/SwitchTxType";
import type { Props } from "./ConfirmSendModal";
import ConfirmSendModal from "./ConfirmSendModal";

const closeSpy = jest.fn();

const basicProps: Props = {
  amount: 0,
  address:
    "lnbcrt10u1pscxuktpp5k4hp6wxafdaqfhk84krlt26q80dfdg5df3cdagwjpr5v8xc7s5qqdpz2phkcctjypykuan0d93k2grxdaezqcn0vgxqyjw5qcqp2sp5ndav50eqfh32xxpwd4wa645hevumj7ze5meuajjs40vtgkucdams9qy9qsqc34r4wlyytf68xvt540gz7yq80wsdhyy93dgetv2d2x44dhtg4fysu9k8v0aec8r649tcgtu5s9xths93nuxklvf93px6gnlw2h7u0gq602rww",
  back: () => {},
  balance: 100,
  close: closeSpy,
  comment: "",
  expiry: 36000,
  fee: "",
  invoiceAmount: 0,
  invoiceType: TxType.LIGHTNING,
  timestamp: 1893456000, // 01 Jan 2030 00:00:00 GMT
};

describe("ConfirmSendModal", () => {
  describe("ln-invoice with zero amount", () => {
    const setup = () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ConfirmSendModal {...basicProps} />
        </I18nextProvider>
      );
    };

    test("validates amount is lower than balance", async () => {
      const user = userEvent.setup();
      setup();

      let amountInput = screen.getByLabelText("wallet.amount");

      await user.clear(amountInput);
      await user.type(amountInput, "999");

      amountInput = await screen.findByLabelText("wallet.amount");

      await waitFor(() => expect(amountInput).toHaveClass("input-error"));

      expect(
        await screen.findByText("forms.validation.chainAmount.max")
      ).toBeInTheDocument();
    });

    test("validates amount is bigger than zero", async () => {
      const user = userEvent.setup();
      setup();

      let amountInput = screen.getByLabelText("wallet.amount");

      await user.clear(amountInput);
      await user.type(amountInput, "0");

      amountInput = await screen.findByLabelText("wallet.amount");

      await waitFor(() => expect(amountInput).toHaveClass("input-error"));

      expect(
        screen.getByText("forms.validation.chainAmount.required")
      ).toBeInTheDocument();
    });

    test("valid form passes", async () => {
      const user = userEvent.setup();
      setup();

      const amountInput = screen.getByLabelText(
        "wallet.amount"
      ) as HTMLInputElement;

      await user.type(amountInput, "100");
      await waitFor(() => expect(amountInput).not.toHaveClass("input-error"));

      expect(
        screen.getByRole("button", { name: "check.svg settings.confirm" })
      ).not.toBeDisabled();
    });

    test("amountInput correctly sends mSat", async () => {
      server.use(
        rest.post("/api/v1/lightning/send-payment", (req, res, ctx) => {
          console.log(req.url.searchParams.get("amount_msat"));
          if (req.url.searchParams.get("amount_msat") === "10000") {
            return res(ctx.status(200));
          } else {
            return res(ctx.status(500));
          }
        })
      );
      const user = userEvent.setup();
      setup();

      const amountInput = screen.getByLabelText(
        "wallet.amount"
      ) as HTMLInputElement;

      await user.type(amountInput, "10");
      await waitFor(() => expect(amountInput).not.toHaveClass("input-error"));

      const confirmBtn = screen.getByRole("button", {
        name: "check.svg settings.confirm",
      });

      await user.click(confirmBtn);

      expect(closeSpy).toHaveBeenCalledWith(true);
    });
  });

  describe("ln-invoice with amount above zero", () => {
    test("show error if invoice is expired", async () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ConfirmSendModal
            {...basicProps}
            timestamp={1640995200} // "Sat Jan 01 2022 08:00:00
            expiry={36000}
          />
        </I18nextProvider>
      );

      expect(
        screen.getByText(
          "forms.validation.lnInvoice.expired",
          { exact: false } /* exclude displayed date */
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "check.svg settings.confirm" })
      ).toBeDisabled();
    });

    test("show error if amount is bigger than balance", async () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ConfirmSendModal {...basicProps} invoiceAmount={111} />
        </I18nextProvider>
      );

      expect(
        await screen.findByText("forms.validation.lnInvoice.max")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "check.svg settings.confirm" })
      ).toBeDisabled();
    });

    test("valid form passes", async () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ConfirmSendModal {...basicProps} invoiceAmount={100} />
        </I18nextProvider>
      );

      const submitButton = screen.queryByText("wallet.amount");
      expect(submitButton).not.toBeInTheDocument();

      expect(
        await screen.findByRole("button", {
          name: "check.svg settings.confirm",
        })
      ).toBeDisabled();
    });
  });
});
