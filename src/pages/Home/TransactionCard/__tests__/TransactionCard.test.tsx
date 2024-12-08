import { render, screen } from "test-utils";
import type { Props } from "../TransactionCard";
import TransactionCard from "../TransactionCard";

const props: Props = {
	transactions: [],
	isLoading: false,
	showDetails: () => {},
	error: "",
	implementation: "",
};

describe("TransactionCard", () => {
	test("if info is being displayed if transactions are empty", async () => {
		render(<TransactionCard {...props} />);

		expect(screen.getByText("tx.transactions_none")).toBeInTheDocument();
	});
});
