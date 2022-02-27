import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../../i18n/test_config";
import type { Props } from "./SendOnChain";
import SendOnChain from "./SendOnChain";

const basicProps: Props = {
  address: "",
  amount: 12,
  balance: 100,
  comment: "",
  fee: "",
  onChangeAddress: () => {},
  onChangeComment: () => {},
  onChangeFee: () => {},
  onConfirm: () => {},
};

describe("SendOnChain", () => {
  const setup = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <SendOnChain {...basicProps} />
      </I18nextProvider>
    );

  test("render", async () => {
    setup();

    expect(screen.getByText("wallet.send_onchain")).toBeInTheDocument();

    expect(screen.getByLabelText("wallet.address")).toBeInTheDocument();
    expect(screen.getByLabelText("wallet.amount")).toBeInTheDocument();
    expect(screen.getByLabelText("tx.fee")).toBeInTheDocument();
    expect(screen.getByLabelText("tx.comment")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "wallet.confirm" })
    ).not.toBeDisabled();
  });

  test("validates the input for empty value", async () => {
    setup();

    expect(
      screen.getByRole("button", { name: "wallet.confirm" })
    ).not.toBeDisabled();

    userEvent.click(screen.getByRole("button", { name: "wallet.confirm" }));

    await waitFor(() =>
      expect(screen.getByLabelText("wallet.address")).toHaveClass("input-error")
    );
    expect(
      screen.getByText("forms.validation.chainAddress.required")
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByLabelText("tx.fee")).toHaveClass("input-error")
    );
    expect(
      screen.getByText("forms.validation.chainFee.required")
    ).toBeInTheDocument();
  });

  test("validates the address-input for BTC address format", async () => {
    setup();

    const addressInput = screen.getByLabelText(
      "wallet.address"
    ) as HTMLInputElement;

    userEvent.clear(addressInput);
    userEvent.type(addressInput, "abc123456789");

    await waitFor(() => expect(addressInput).toHaveClass("input-error"));
    expect(
      screen.getByText("forms.validation.chainAddress.patternMismatch")
    ).toBeInTheDocument();

    userEvent.clear(addressInput);
    userEvent.type(addressInput, "bc1");

    await waitFor(() => expect(addressInput).toHaveClass("input-error"));
    expect(
      screen.getByText("forms.validation.chainAddress.patternMismatch")
    ).toBeInTheDocument();
  });

  test("validates amount is lower than balance", async () => {
    setup();

    const amountInput = screen.getByLabelText(
      "wallet.amount"
    ) as HTMLInputElement;

    userEvent.clear(amountInput);
    userEvent.type(amountInput, "999");

    userEvent.click(await screen.findByText("wallet.confirm"));

    await waitFor(() => expect(amountInput).toHaveClass("input-error"));
    expect(
      await screen.findByText("forms.validation.chainAmount.max")
    ).toBeInTheDocument();
  });

  test("validates amount is bigger than zero", async () => {
    setup();

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
    setup();

    const addressInput = screen.getByLabelText(
      "wallet.address"
    ) as HTMLInputElement;
    const feeInput = screen.getByLabelText("tx.fee") as HTMLInputElement;

    userEvent.type(addressInput, "bc1123456789");
    await waitFor(() => expect(addressInput).not.toHaveClass("input-error"));

    userEvent.type(feeInput, "1");
    await waitFor(() => expect(feeInput).not.toHaveClass("input-error"));

    expect(
      screen.getByRole("button", { name: "wallet.confirm" })
    ).not.toBeDisabled();
  });
});
