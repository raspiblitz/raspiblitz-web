import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n/test_config";
import type { Props } from "./TransactionCard";
import TransactionCard from "./TransactionCard";

const props: Props = {
  transactions: [],
  isLoading: false,
  showDetails: () => {},
};

describe("TransactionCard", () => {
  test("if info is being displayed if transactions are empty", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TransactionCard {...props} />
      </I18nextProvider>
    );

    expect(screen.getByText("tx.transactions_none")).toBeInTheDocument();
  });
});
