import SwitchTxType, { TxType } from "../SwitchTxType";
import { render, screen } from "test-utils";

describe("SwitchTxType", () => {
  test("txType: lightning", async () => {
    const handeTxTypeChangeMock = vi.fn();

    render(
      <SwitchTxType
        invoiceType={TxType.LIGHTNING}
        onTxTypeChange={handeTxTypeChangeMock}
      />,
    );

    const buttonLn = screen.getByText("home.lightning");
    const buttonOnChain = screen.getByText("wallet.on_chain");

    expect(buttonLn).toBeDisabled();
    expect(buttonOnChain).not.toBeDisabled();
    buttonOnChain.click();

    expect(handeTxTypeChangeMock).toHaveBeenCalledTimes(1);
    expect(handeTxTypeChangeMock).toHaveBeenCalledWith(TxType.ONCHAIN);
  });

  test("txType: onchain", async () => {
    const handeTxTypeChangeMock = vi.fn();

    render(
      <SwitchTxType
        invoiceType={TxType.ONCHAIN}
        onTxTypeChange={handeTxTypeChangeMock}
      />,
    );

    const buttonLn = screen.getByText("home.lightning");
    const buttonOnChain = screen.getByText("wallet.on_chain");

    expect(buttonLn).not.toBeDisabled();
    expect(buttonOnChain).toBeDisabled();
    buttonLn.click();

    expect(handeTxTypeChangeMock).toHaveBeenCalledTimes(1);
    expect(handeTxTypeChangeMock).toHaveBeenCalledWith(TxType.LIGHTNING);
  });
});
