import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { I18nextProvider } from "react-i18next";
import i18n from "../../../../i18n/test_config";
import SendLN from "./SendLN";

const basicProps = {
  balance: "123456",
  onConfirm: () => {},
  onChangeInvoice: () => {},
};

describe("SendLN", () => {
  it("renders", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SendLN {...basicProps} />
      </I18nextProvider>
    );

    expect(
      await screen.findByText("wallet.send_lightning")
    ).toBeInTheDocument();
    expect(await screen.findByLabelText("wallet.invoice")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "wallet.send" })
    ).toBeInTheDocument();
  });

  it("validates the input", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SendLN {...basicProps} />
      </I18nextProvider>
    );

    const invoiceInput = await screen.findByLabelText("wallet.invoice");

    expect(
      await screen.findByRole("button", { name: "wallet.send" })
    ).not.toBeDisabled();

    // validates empty value
    userEvent.click(await screen.findByRole("button", { name: "wallet.send" }));
    expect(invoiceInput).toHaveClass("input-error");
    expect(
      await screen.findByText("forms.validation.lnInvoice.required")
    ).toBeInTheDocument();

    // validates LN invoice format
    userEvent.type(invoiceInput, "not a lightning invoice");
    expect(invoiceInput).toHaveClass("input-error");
    expect(
      await screen.findByText("forms.validation.lnInvoice.patternMismatch")
    ).toBeInTheDocument();

    // let's valid invoice pass
    userEvent.clear(invoiceInput);
    userEvent.type(invoiceInput, "lnbc123");
    expect(
      await screen.findByRole("button", { name: "wallet.send" })
    ).not.toBeDisabled();
    expect(invoiceInput).not.toHaveClass("input-error");
  });
});
