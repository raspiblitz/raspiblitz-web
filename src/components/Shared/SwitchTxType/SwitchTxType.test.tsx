import { render, screen, act } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n/test_config";
import SwitchTxType, { TxType } from "./SwitchTxType";

describe("SwitchTxType", () => {
  test("default tx-type: lightning", async () => {
    const handeTxTypeChangeMock = jest.fn();

    await act(async () => {
      render(
        <I18nextProvider i18n={i18n}>
          <SwitchTxType onTxTypeChange={handeTxTypeChangeMock} />
        </I18nextProvider>
      );
    });

    const buttonLn = screen.getByText("home.lightning");
    const buttonOnChain = screen.getByText("wallet.on_chain");

    expect(buttonLn).toBeDisabled();
    expect(buttonOnChain).not.toBeDisabled();
    buttonLn.click();
    expect(handeTxTypeChangeMock).toHaveBeenCalledTimes(0);
    expect(buttonLn).toBeDisabled();
    expect(buttonOnChain).not.toBeDisabled();
  });

  // test("tx-type: onchain", async () => {
  //   const handeTxTypeChangeMock = jest.fn();

  //   render(
  //     <I18nextProvider i18n={i18n}>
  //       <SwitchTxType onTxTypeChange={handeTxTypeChangeMock} />
  //     </I18nextProvider>
  //   );

  //   const buttonLn = screen.getByText("home.lightning");
  //   const buttonOnChain = screen.getByText("wallet.on_chain");

  //   expect(buttonLn).toBeDisabled();
  //   expect(buttonOnChain).not.toBeDisabled();
  //   buttonOnChain.click();
  //   expect(handeTxTypeChangeMock).toHaveBeenCalledTimes(1);
  //   expect(handeTxTypeChangeMock).toHaveBeenCalledWith(TxType.ONCHAIN);
  //   expect(buttonOnChain).toBeDisabled();
  //   expect(buttonLn).not.toBeDisabled();
  // });
});
