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
  onChangeAmount: () => {},
  onChangeAddress: () => {},
  onChangeComment: () => {},
  onChangeFee: () => {},
  onConfirm: () => {},
};

describe("SendOnChain", () => {
  const setup = () => {
    render(
      <I18nextProvider i18n={i18n}>
        <SendOnChain {...basicProps} />
      </I18nextProvider>
    );
  };

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
    const user = userEvent.setup();
    setup();

    expect(
      screen.getByRole("button", { name: "wallet.confirm" })
    ).not.toBeDisabled();

    await user.click(screen.getByRole("button", { name: "wallet.confirm" }));
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
    const user = userEvent.setup();
    setup();

    let addressInput = screen.getByLabelText("wallet.address");

    await user.clear(addressInput);
    await user.type(addressInput, "abc123456789");

    addressInput = await screen.findByLabelText("wallet.address");

    await waitFor(() => expect(addressInput).toHaveClass("input-error"));
    expect(
      screen.getByText("forms.validation.chainAddress.patternMismatch")
    ).toBeInTheDocument();

    await user.clear(addressInput);
    await user.type(addressInput, "bc1");

    await waitFor(() => expect(addressInput).toHaveClass("input-error"));
    expect(
      screen.getByText("forms.validation.chainAddress.patternMismatch")
    ).toBeInTheDocument();
  });

  test("validates amount is lower than balance", async () => {
    const user = userEvent.setup();

    setup();

    const amountInput = screen.getByLabelText(
      "wallet.amount"
    ) as HTMLInputElement;

    await user.clear(amountInput);
    await user.type(amountInput, "999");
    await user.click(await screen.findByText("wallet.confirm"));

    await waitFor(() => expect(amountInput).toHaveClass("input-error"));
    expect(
      await screen.findByText("forms.validation.chainAmount.max")
    ).toBeInTheDocument();
  });

  test("validates amount is bigger than zero", async () => {
    const user = userEvent.setup();
    setup();

    const amountInput = screen.getByLabelText(
      "wallet.amount"
    ) as HTMLInputElement;

    await user.clear(amountInput);
    await user.type(amountInput, "0");
    await waitFor(() => expect(amountInput).toHaveClass("input-error"));

    expect(
      screen.getByText("forms.validation.chainAmount.required")
    ).toBeInTheDocument();
  });

  // https://github.com/cstenglein/raspiblitz-web/issues/234
  // skipped due to react v18 update
  test.skip("valid form passes", async () => {
    const user = userEvent.setup();
    setup();

    const addressInput = screen.getByLabelText(
      "wallet.address"
    ) as HTMLInputElement;
    const feeInput = screen.getByLabelText("tx.fee") as HTMLInputElement;

    await user.type(addressInput, "bc1123456789");
    await waitFor(() => expect(addressInput).not.toHaveClass("input-error"));

    await user.type(feeInput, "1");
    await waitFor(() => expect(feeInput).not.toHaveClass("input-error"));

    expect(
      screen.getByRole("button", { name: "wallet.confirm" })
    ).not.toBeDisabled();
  });
});
