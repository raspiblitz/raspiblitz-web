import { AppContext, type AppContextType, Unit } from "@/context/app-context";
import i18n from "@/i18n/test_config";
import { I18nextProvider } from "react-i18next";
import { render, screen } from "test-utils";
import AvailableBalance from "../AvailableBalance";

const contextValues: AppContextType = {
	isLoggedIn: false,
	unit: Unit.SAT,
	walletLocked: false,
	isGeneratingReport: false,
	toggleUnit: vi.fn(),
	setIsLoggedIn: vi.fn(),
	logout: vi.fn(),
	setWalletLocked: vi.fn(),
	setIsGeneratingReport: vi.fn(),
};

describe("AvailableBalance", () => {
	it("renders with SAT unit", () => {
		render(
			<I18nextProvider i18n={i18n}>
				<AppContext.Provider value={{ ...contextValues, unit: Unit.SAT }}>
					<AvailableBalance balance={500_000_000} />
				</AppContext.Provider>
			</I18nextProvider>,
		);

		expect(screen.getByText("wallet.available_balance:")).toBeInTheDocument();
		expect(screen.getByText(`500,000,000 ${Unit.SAT}`)).toBeInTheDocument();
	});

	it("renders with BTC unit", () => {
		render(
			<I18nextProvider i18n={i18n}>
				<AppContext.Provider value={{ ...contextValues, unit: Unit.BTC }}>
					<AvailableBalance balance={500_000_000} />
				</AppContext.Provider>
			</I18nextProvider>,
		);

		expect(screen.getByText("wallet.available_balance:")).toBeInTheDocument();
		expect(screen.getByText(`5.00000000 ${Unit.BTC}`)).toBeInTheDocument();
	});
});
