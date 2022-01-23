import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../../i18n/test_config";
import type { Props } from "./ConfirmSendModal";
import ConfirmSendModal from "./ConfirmSendModal";

const basicProps: Props = {
  address:
    "lnbcrt10u1pscxuktpp5k4hp6wxafdaqfhk84krlt26q80dfdg5df3cdagwjpr5v8xc7s5qqdpz2phkcctjypykuan0d93k2grxdaezqcn0vgxqyjw5qcqp2sp5ndav50eqfh32xxpwd4wa645hevumj7ze5meuajjs40vtgkucdams9qy9qsqc34r4wlyytf68xvt540gz7yq80wsdhyy93dgetv2d2x44dhtg4fysu9k8v0aec8r649tcgtu5s9xths93nuxklvf93px6gnlw2h7u0gq602rww",
  invoiceAmount: 0,
  back: () => {},
  balance: 100,
  close: () => {},
  comment: "",
  fee: "",
  ln: true,
};

describe("ConfirmSendModal", () => {
  describe("ln-invoice with zero amount", () => {
    beforeEach(() => {
      render(
        <I18nextProvider i18n={i18n}>
          <ConfirmSendModal {...basicProps} />
        </I18nextProvider>
      );
    });

    test("validates amount is lower than balance", async () => {
      const amountInput = screen.getByLabelText(
        "wallet.amount"
      ) as HTMLInputElement;

      userEvent.clear(amountInput);
      userEvent.type(amountInput, "999");

      userEvent.click(await screen.findByText("settings.confirm"));
      await waitFor(() => expect(amountInput).toHaveClass("input-error"));

      expect(
        screen.getByText("forms.validation.chainAmount.max")
      ).toBeInTheDocument();
    });

    test("validates amount is bigger than zero", async () => {
      const amountInput = screen.getByLabelText(
        "wallet.amount"
      ) as HTMLInputElement;

      userEvent.clear(amountInput);
      userEvent.type(amountInput, "0");
      await waitFor(() => expect(amountInput).toHaveClass("input-error"));

      expect(
        screen.getByText("forms.validation.chainAmount.required")
      ).toBeInTheDocument();
    });

    test("valid form passes", async () => {
      const amountInput = screen.getByLabelText(
        "wallet.amount"
      ) as HTMLInputElement;

      userEvent.type(amountInput, "100");
      await waitFor(() => expect(amountInput).not.toHaveClass("input-error"));

      expect(
        screen.getByRole("button", { name: "check.svg settings.confirm" })
      ).not.toBeDisabled();
    });
  });

  describe("ln-invoice with amount above zero", () => {
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
      ).not.toBeDisabled();
    });
  });
});
