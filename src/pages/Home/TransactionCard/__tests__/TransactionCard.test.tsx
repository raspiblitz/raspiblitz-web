import { fireEvent, render, screen } from "test-utils";
import type { Props } from "../TransactionCard";
import TransactionCard from "../TransactionCard";

const emptyProps: Props = {
  transactions: [],
  isLoading: false,
  showDetails: () => {},
  error: "",
  implementation: "",
};

const mockTransaction = {
  index: 0,
  id: "test-id",
  category: "ln" as const,
  type: "receive" as const,
  amount: 100000,
  time_stamp: 1700000000,
  comment: "Test payment",
  status: "succeeded" as const,
  block_height: null,
  num_confs: null,
  total_fees: null,
};

const propsWithTransactions: Props = {
  transactions: [mockTransaction],
  isLoading: false,
  showDetails: vi.fn(),
  error: "",
  implementation: "LND_GRPC",
};

describe("TransactionCard", () => {
  test("displays info message when transactions are empty", async () => {
    render(<TransactionCard {...emptyProps} />);

    expect(screen.getByText("tx.transactions_none")).toBeInTheDocument();
  });

  test("renders transactions in listbox", async () => {
    render(<TransactionCard {...propsWithTransactions} />);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Test payment")).toBeInTheDocument();
  });

  test("calls showDetails when transaction is clicked", async () => {
    const showDetails = vi.fn();
    render(
      <TransactionCard {...propsWithTransactions} showDetails={showDetails} />,
    );

    const listItem = screen.getByRole("option");
    fireEvent.click(listItem);

    // showDetails is called with transaction.index (0)
    expect(showDetails).toHaveBeenCalledWith(0);
  });
});
