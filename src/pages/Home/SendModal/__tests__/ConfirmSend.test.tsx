import { ConfirmModal } from "@/components/ConfirmModal";
import { http, HttpResponse, server } from "@/testServer";
import userEvent from "@testing-library/user-event";
import { mockedDisclosure, render, screen, waitFor } from "test-utils";
import { TxType } from "../../SwitchTxType";
import type { Props } from "../ConfirmSend";
import ConfirmSend from "../ConfirmSend";
import type { SendLnForm } from "../SendModal";
import type { SendOnChainForm } from "../SendOnChain";

const closeSpy = vi.fn();

const basicLnTxProps: Props = {
	confirmData: {
		address:
			"lnbcrt10u1pscxuktpp5k4hp6wxafdaqfhk84krlt26q80dfdg5df3cdagwjpr5v8xc7s5qqdpz2phkcctjypykuan0d93k2grxdaezqcn0vgxqyjw5qcqp2sp5ndav50eqfh32xxpwd4wa645hevumj7ze5meuajjs40vtgkucdams9qy9qsqc34r4wlyytf68xvt540gz7yq80wsdhyy93dgetv2d2x44dhtg4fysu9k8v0aec8r649tcgtu5s9xths93nuxklvf93px6gnlw2h7u0gq602rww",
		invoiceType: TxType.LIGHTNING,
		comment: "",
		expiry: 36000,
		amount: 0,
		timestamp: 1893456000, // 01 Jan 2030 00:00:00 GMT
	} as SendLnForm,
	back: () => {},
	balance: 100,
	close: closeSpy,
};

const basicOnChainTxProps: Props = {
	confirmData: {
		address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
		fee: "1",
		amount: 50000,
		invoiceType: TxType.ONCHAIN,
	} as SendOnChainForm,
	back: () => {},
	balance: 100,
	close: closeSpy,
};

describe("ConfirmSend", () => {
	describe("ln-invoice with zero amount", () => {
		const setup = () => {
			render(
				<ConfirmModal disclosure={mockedDisclosure} custom>
					<ConfirmSend {...basicLnTxProps} />
				</ConfirmModal>,
			);
		};

		test("validates amount is lower than balance", async () => {
			const user = userEvent.setup();
			setup();

			let amountInput = screen.getByLabelText("wallet.amount");
			await user.clear(amountInput);
			await user.type(amountInput, "999");

			amountInput = await screen.findByLabelText("wallet.amount");
			screen.debug(amountInput);

			await waitFor(() => expect(amountInput).toHaveAttribute("aria-invalid"));

			expect(
				await screen.findByText("forms.validation.chainAmount.max"),
			).toBeInTheDocument();
		});

		test("validates amount is bigger than zero", async () => {
			const user = userEvent.setup();
			setup();

			let amountInput = screen.getByLabelText("wallet.amount");

			await user.clear(amountInput);
			await user.type(amountInput, "0");

			amountInput = await screen.findByLabelText("wallet.amount");

			await waitFor(() => expect(amountInput).toHaveAttribute("aria-invalid"));

			expect(
				screen.getByText("forms.validation.chainAmount.required"),
			).toBeInTheDocument();
		});

		test("valid form passes", async () => {
			const user = userEvent.setup();
			setup();

			const amountInput = screen.getByLabelText(
				"wallet.amount",
			) as HTMLInputElement;

			await user.type(amountInput, "100");
			await waitFor(() =>
				expect(amountInput).not.toHaveAttribute("aria-invalid"),
			);

			expect(
				screen.getByRole("button", { name: "settings.confirm" }),
			).not.toBeDisabled();
		});

		test("amountInput correctly sends mSat", async () => {
			server.use(
				http.post("/api/lightning/send-payment", ({ request }) => {
					const url = new URL(request.url);
					if (url.searchParams.get("amount_msat") === "10000") {
						return new HttpResponse(null, { status: 200 });
						// biome-ignore lint/style/noUselessElse: <explanation>
					} else {
						return new HttpResponse(null, { status: 500 });
					}
				}),
			);
			const user = userEvent.setup();
			setup();

			const amountInput = screen.getByLabelText(
				"wallet.amount",
			) as HTMLInputElement;

			await user.type(amountInput, "10");
			await waitFor(() =>
				expect(amountInput).not.toHaveAttribute("aria-invalid"),
			);

			const confirmBtn = screen.getByRole("button", {
				name: "settings.confirm",
			});

			await user.click(confirmBtn);

			expect(closeSpy).toHaveBeenCalled();
		});
	});

	describe("ln-invoice with amount above zero", () => {
		test("show error if invoice is expired", async () => {
			const confirmData = {
				...basicLnTxProps.confirmData,
				timestamp: 1640995200, // Sat Jan 01 2022 08:00:00
				expiry: 36000,
			};

			render(
				<ConfirmModal disclosure={mockedDisclosure} custom>
					<ConfirmSend {...basicLnTxProps} confirmData={confirmData} />
				</ConfirmModal>,
			);

			expect(
				screen.getByText(
					"forms.validation.lnInvoice.expired",
					{ exact: false } /* exclude displayed date */,
				),
			).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "settings.confirm" }),
			).toBeDisabled();
		});

		test("show error if amount is bigger than balance", async () => {
			const confirmData = {
				...basicLnTxProps.confirmData,
				amount: 111,
			};
			render(
				<ConfirmModal disclosure={mockedDisclosure} custom>
					<ConfirmSend {...basicLnTxProps} confirmData={confirmData} />
				</ConfirmModal>,
			);
			expect(
				await screen.findByText("forms.validation.lnInvoice.max"),
			).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "settings.confirm" }),
			).toBeDisabled();
		});

		test("valid form passes", async () => {
			const confirmData = {
				...basicLnTxProps.confirmData,
				amount: 100,
			};

			render(
				<ConfirmModal disclosure={mockedDisclosure} custom>
					<ConfirmSend {...basicLnTxProps} confirmData={confirmData} />
				</ConfirmModal>,
			);

			const submitButton = screen.queryByText("wallet.amount");

			expect(submitButton).not.toBeInTheDocument();
			expect(
				await screen.findByRole("button", {
					name: "settings.confirm",
				}),
			).not.toBeDisabled();
		});
	});

	describe("on chain tx with amount above zero", () => {
		test("show error if amount is bigger than balance", async () => {
			const confirmData = {
				...basicOnChainTxProps.confirmData,
				amount: 111,
			};

			render(
				<ConfirmModal disclosure={mockedDisclosure} custom>
					<ConfirmSend {...basicOnChainTxProps} confirmData={confirmData} />
				</ConfirmModal>,
			);

			expect(
				await screen.findByText("forms.validation.lnInvoice.max"),
			).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "settings.confirm" }),
			).toBeDisabled();
		});

		test("valid form passes", async () => {
			const confirmData = {
				...basicOnChainTxProps.confirmData,
				amount: 50,
			};

			render(
				<ConfirmModal disclosure={mockedDisclosure} custom>
					<ConfirmSend {...basicOnChainTxProps} confirmData={confirmData} />
				</ConfirmModal>,
			);

			const submitButton = screen.queryByText("wallet.amount");

			expect(submitButton).not.toBeInTheDocument();
			expect(
				await screen.findByRole("button", {
					name: "settings.confirm",
				}),
			).not.toBeDisabled();
		});
	});
});
