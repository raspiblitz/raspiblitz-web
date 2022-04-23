import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n/test_config";
import SwitchTxType, { TxType } from "./SwitchTxType";

describe("SwitchTxType", () => {
  test("txType: lightning", async () => {
    const handeTxTypeChangeMock = jest.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <SwitchTxType
          invoiceType={TxType.LIGHTNING}
          onTxTypeChange={handeTxTypeChangeMock}
        />
      </I18nextProvider>
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
    const handeTxTypeChangeMock = jest.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <SwitchTxType
          invoiceType={TxType.ONCHAIN}
          onTxTypeChange={handeTxTypeChangeMock}
        />
      </I18nextProvider>
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
