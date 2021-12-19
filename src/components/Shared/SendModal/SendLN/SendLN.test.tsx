import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../../i18n/test_config";
import type { SendLnProps } from "./SendLN";
import SendLN from "./SendLN";

const basicProps: SendLnProps = {
  balance: "123456",
  onConfirm: () => {},
  onChangeInvoice: () => {},
};

describe("SendLN", () => {
  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <SendLN {...basicProps} />
      </I18nextProvider>
    );
  });

  test("render", async () => {
    expect(
      await screen.findByText("wallet.send_lightning")
    ).toBeInTheDocument();
    expect(await screen.findByLabelText("wallet.invoice")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "wallet.send" })
    ).not.toBeDisabled();
  });

  test("validates the input for empty value", async () => {
    const invoiceInput = await screen.findByLabelText("wallet.invoice");

    expect(
      await screen.findByRole("button", { name: "wallet.send" })
    ).not.toBeDisabled();

    userEvent.click(await screen.findByRole("button", { name: "wallet.send" }));
    await waitFor(() => expect(invoiceInput).toHaveClass("input-error"));
    expect(
      await screen.findByText("forms.validation.lnInvoice.required")
    ).toBeInTheDocument();
  });

  test("validates the input for LN invoice format", async () => {
    const invoiceInput = await screen.findByLabelText("wallet.invoice");

    userEvent.type(invoiceInput, "123456789abc");
    await waitFor(() => expect(invoiceInput).toHaveClass("input-error"));
    expect(
      await screen.findByText("forms.validation.lnInvoice.patternMismatch")
    ).toBeInTheDocument();

    userEvent.clear(invoiceInput);
    userEvent.type(invoiceInput, "lnbc");
    expect(invoiceInput).toHaveClass("input-error");
    expect(
      await screen.findByText("forms.validation.lnInvoice.patternMismatch")
    ).toBeInTheDocument();

    userEvent.clear(invoiceInput);
    userEvent.type(invoiceInput, "lntb");
    expect(invoiceInput).toHaveClass("input-error");
    expect(
      await screen.findByText("forms.validation.lnInvoice.patternMismatch")
    ).toBeInTheDocument();
  });

  test("valid LN invoice passes", async () => {
    const invoiceInput = await screen.findByLabelText("wallet.invoice");

    userEvent.type(
      invoiceInput,
      "lnbcrt500u1psc09t8pp5jxn0qqx5rnv4zhc7tvftlfr2p7lq25cm8af0h2k5vcy0cfkgwugqdpz2phkcctjypykuan0d93k2grxdaezqcn0vgxqyjw5qcqp2sp5n9uetwjh0wua595fqtce8r3n5lnqk6f603en2k4wx8p988vl5haq9qy9qsqtgsp7ery57uge8jh66sgu42rttsnpyygdtjx05r5sexjdljrfa3hd9mj4z8w3xhp2nz30fa79jcug3chsw2g7jk75zwel33qsl455nqpx9p6z5"
    );
    expect(
      await screen.findByRole("button", { name: "wallet.send" })
    ).not.toBeDisabled();
    expect(invoiceInput).not.toHaveClass("input-error");

    userEvent.clear(invoiceInput);
    userEvent.type(
      invoiceInput,
      "lntb500u1psc09t8pp5jxn0qqx5rnv4zhc7tvftlfr2p7lq25cm8af0h2k5vcy0cfkgwugqdpz2phkcctjypykuan0d93k2grxdaezqcn0vgxqyjw5qcqp2sp5n9uetwjh0wua595fqtce8r3n5lnqk6f603en2k4wx8p988vl5haq9qy9qsqtgsp7ery57uge8jh66sgu42rttsnpyygdtjx05r5sexjdljrfa3hd9mj4z8w3xhp2nz30fa79jcug3chsw2g7jk75zwel33qsl455nqpx9p6z5"
    );
    expect(
      await screen.findByRole("button", { name: "wallet.send" })
    ).not.toBeDisabled();
    expect(invoiceInput).not.toHaveClass("input-error");
  });
});
