import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { I18nextProvider } from "react-i18next";
import i18n from "../../../../i18n/test_config";
import SendOnChain from "./SendOnChain";
import type { SendOnChainProps } from "./SendOnChain";

const basicProps: SendOnChainProps = {
  address: "",
  amount: 12,
  balance: "",
  comment: "",
  fee: "",
  onChangeAddress: () => {},
  onChangeAmount: () => {},
  onChangeComment: () => {},
  onChangeFee: () => {},
  onConfirm: () => {},
};

describe("SendOnChain", () => {
  beforeEach(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <SendOnChain {...basicProps} />
      </I18nextProvider>
    );
  });

  test("render", async () => {
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

  test("valid form passes", async () => {
    const addressInput = screen.getByLabelText(
      "wallet.address"
    ) as HTMLInputElement;
    const feeInput = screen.getByLabelText("tx.fee") as HTMLInputElement;

    userEvent.type(addressInput, "bc1123456789");
    expect(addressInput).not.toHaveClass("input-error");

    userEvent.type(feeInput, "1");
    expect(feeInput).not.toHaveClass("input-error");

    expect(
      screen.getByRole("button", { name: "wallet.confirm" })
    ).not.toBeDisabled();
  });
});
