import userEvent from "@testing-library/user-event";
import { mockedDisclosure, render, screen, waitFor } from "test-utils";
import { ConfirmModal } from "@/components/ConfirmModal";
import { HttpResponse, http, server } from "@/testServer";
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("component rendering", () => {
    test("renders correct headers for lightning invoice", () => {
      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...basicLnTxProps} />
        </ConfirmModal>,
      );

      expect(
        screen.getByText("wallet.invoice", { exact: false }),
      ).toBeInTheDocument();
      expect(screen.queryByText("tx.fee")).not.toBeInTheDocument();
    });

    test("renders correct headers for onchain transaction", () => {
      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...basicOnChainTxProps} />
        </ConfirmModal>,
      );

      expect(
        screen.getByText("wallet.address", { exact: false }),
      ).toBeInTheDocument();
      expect(screen.getByText("tx.fee", { exact: false })).toBeInTheDocument();
    });

    test("displays comment when provided", () => {
      const propsWithComment = {
        ...basicLnTxProps,
        confirmData: {
          ...basicLnTxProps.confirmData,
          comment: "Test comment",
        },
      };

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...propsWithComment} />
        </ConfirmModal>,
      );

      expect(
        screen.getByText("tx.description", { exact: false }),
      ).toBeInTheDocument();
      expect(screen.getByText("Test comment")).toBeInTheDocument();
    });

    test("does not display comment section when comment is empty", () => {
      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...basicLnTxProps} />
        </ConfirmModal>,
      );

      expect(
        screen.queryByText("tx.description", { exact: false }),
      ).not.toBeInTheDocument();
    });

    test("displays back button with correct handler", async () => {
      const mockBack = vi.fn();
      const propsWithBack = { ...basicLnTxProps, back: mockBack };
      const user = userEvent.setup();

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...propsWithBack} />
        </ConfirmModal>,
      );

      const backButton = screen.getByRole("button", {
        name: "navigation.back",
      });
      await user.click(backButton);

      expect(mockBack).toHaveBeenCalledWith(basicLnTxProps.confirmData);
    });
  });

  describe("spendAll onchain transactions", () => {
    test("displays 'all onchain' text for spendAll transactions", () => {
      const spendAllProps = {
        ...basicOnChainTxProps,
        confirmData: {
          ...basicOnChainTxProps.confirmData,
          spendAll: true,
        },
      };

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...spendAllProps} />
        </ConfirmModal>,
      );

      expect(
        screen.getByText("tx.all_onchain", { exact: false }),
      ).toBeInTheDocument();
    });

    test("confirm button is enabled for valid spendAll transaction", () => {
      const spendAllProps = {
        ...basicOnChainTxProps,
        confirmData: {
          ...basicOnChainTxProps.confirmData,
          spendAll: true,
          amount: 0,
        },
      };

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...spendAllProps} />
        </ConfirmModal>,
      );

      expect(
        screen.getByRole("button", { name: "settings.confirm" }),
      ).not.toBeDisabled();
    });
  });

  describe("error handling", () => {
    test("displays error message when API call fails for Lightning", async () => {
      server.use(
        http.post("/api/lightning/send-payment", () => {
          return new HttpResponse(
            JSON.stringify({ detail: "Payment failed" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }),
      );

      const user = userEvent.setup();
      const propsWithAmount = {
        ...basicLnTxProps,
        confirmData: {
          ...basicLnTxProps.confirmData,
          amount: 50,
        },
      };

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...propsWithAmount} />
        </ConfirmModal>,
      );

      const confirmButton = screen.getByRole("button", {
        name: "settings.confirm",
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByText("Payment failed", { exact: false }),
        ).toBeInTheDocument();
      });
    });

    test("displays error message when API call fails for onchain", async () => {
      server.use(
        http.post("/api/lightning/send-coins", () => {
          return new HttpResponse(
            JSON.stringify({ detail: "Transaction failed" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }),
      );

      const user = userEvent.setup();
      const propsWithValidAmount = {
        ...basicOnChainTxProps,
        confirmData: {
          ...basicOnChainTxProps.confirmData,
          amount: 50,
        },
      };

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...propsWithValidAmount} />
        </ConfirmModal>,
      );

      const confirmButton = screen.getByRole("button", {
        name: "settings.confirm",
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByText("Transaction failed", { exact: false }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("button states", () => {
    test("cancel button calls close function", async () => {
      const user = userEvent.setup();

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...basicLnTxProps} />
        </ConfirmModal>,
      );

      const cancelButton = screen.getByRole("button", {
        name: "settings.cancel",
      });
      await user.click(cancelButton);

      expect(closeSpy).toHaveBeenCalled();
    });

    test("buttons are disabled during loading state", async () => {
      server.use(
        http.post("/api/lightning/send-payment", () => {
          return new Promise(() => {}); // Never resolve to keep loading state
        }),
      );

      const user = userEvent.setup();
      const propsWithAmount = {
        ...basicLnTxProps,
        confirmData: {
          ...basicLnTxProps.confirmData,
          amount: 50,
        },
      };

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...propsWithAmount} />
        </ConfirmModal>,
      );

      const confirmButton = screen.getByRole("button", {
        name: "settings.confirm",
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "settings.cancel" }),
        ).toBeDisabled();
        expect(confirmButton).toHaveAttribute("data-loading", "true");
      });
    });
  });

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
        await screen.findByText("forms.validation.chainAmount.max", {
          exact: false,
        }),
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
        screen.getByText("forms.validation.chainAmount.required", {
          exact: false,
        }),
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
          }
          return new HttpResponse(null, { status: 500 });
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
        await screen.findByText("forms.validation.lnInvoice.max", {
          exact: false,
        }),
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
        await screen.findByText("forms.validation.lnInvoice.max", {
          exact: false,
        }),
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

    test("successful onchain transaction closes modal", async () => {
      server.use(
        http.post("/api/lightning/send-coins", () => {
          return new HttpResponse(null, { status: 200 });
        }),
      );

      const user = userEvent.setup();
      const confirmData = {
        ...basicOnChainTxProps.confirmData,
        amount: 50,
      };

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...basicOnChainTxProps} confirmData={confirmData} />
        </ConfirmModal>,
      );

      const confirmButton = screen.getByRole("button", {
        name: "settings.confirm",
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(closeSpy).toHaveBeenCalled();
      });
    });

    test("sends correct body for onchain transaction", async () => {
      // biome-ignore lint/suspicious/noExplicitAny: test
      let capturedBody: any;
      server.use(
        http.post("/api/lightning/send-coins", async ({ request }) => {
          capturedBody = await request.json();
          return new HttpResponse(null, { status: 200 });
        }),
      );

      const user = userEvent.setup();
      const confirmData = {
        ...basicOnChainTxProps.confirmData,
        amount: 50,
        fee: "10",
        comment: "Test transaction",
        spendAll: false,
      };

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...basicOnChainTxProps} confirmData={confirmData} />
        </ConfirmModal>,
      );

      const confirmButton = screen.getByRole("button", {
        name: "settings.confirm",
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(capturedBody).toBeDefined();
      });

      expect(capturedBody).toEqual({
        amount: 50,
        address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
        sat_per_vbyte: 10,
        label: "Test transaction",
        send_all: false,
      });
    });

    test("sends correct body for spendAll onchain transaction", async () => {
      // biome-ignore lint/suspicious/noExplicitAny: test
      let capturedBody: any;
      server.use(
        http.post("/api/lightning/send-coins", async ({ request }) => {
          capturedBody = await request.json();
          return new HttpResponse(null, { status: 200 });
        }),
      );

      const user = userEvent.setup();
      const confirmData = {
        ...basicOnChainTxProps.confirmData,
        spendAll: true,
        amount: 0,
      };

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...basicOnChainTxProps} confirmData={confirmData} />
        </ConfirmModal>,
      );

      const confirmButton = screen.getByRole("button", {
        name: "settings.confirm",
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(capturedBody).toBeDefined();
      });

      expect(capturedBody.amount).toBe(0);
      expect(capturedBody.send_all).toBe(true);
    });
  });

  describe("lightning transactions with fixed amount", () => {
    test("successful lightning payment closes modal", async () => {
      server.use(
        http.post("/api/lightning/send-payment", () => {
          return new HttpResponse(null, { status: 200 });
        }),
      );

      const user = userEvent.setup();
      const confirmData = {
        ...basicLnTxProps.confirmData,
        amount: 50,
      };

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...basicLnTxProps} confirmData={confirmData} />
        </ConfirmModal>,
      );

      const confirmButton = screen.getByRole("button", {
        name: "settings.confirm",
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(closeSpy).toHaveBeenCalled();
      });
    });

    test("displays amount in satoshis for lightning invoice", () => {
      const confirmData = {
        ...basicLnTxProps.confirmData,
        amount: 1000000, // 1000 sats in msat
      };

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...basicLnTxProps} confirmData={confirmData} />
        </ConfirmModal>,
      );

      expect(screen.getByText("1,000 Sat")).toBeInTheDocument();
    });
  });

  describe("additional scenarios", () => {
    test("displays correct expiry date format for expired invoice", () => {
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

      expect(screen.getByText(/2022/)).toBeInTheDocument();
    });

    test("handles lightning payment without custom amount", async () => {
      server.use(
        http.post("/api/lightning/send-payment", ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get("amount_msat")).toBeNull();
          return new HttpResponse(null, { status: 200 });
        }),
      );

      const user = userEvent.setup();
      const confirmData = {
        ...basicLnTxProps.confirmData,
        amount: 50,
      };

      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...basicLnTxProps} confirmData={confirmData} />
        </ConfirmModal>,
      );

      const confirmButton = screen.getByRole("button", {
        name: "settings.confirm",
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(closeSpy).toHaveBeenCalled();
      });
    });

    test("zero amount input field shows hint text", () => {
      render(
        <ConfirmModal disclosure={mockedDisclosure} custom>
          <ConfirmSend {...basicLnTxProps} />
        </ConfirmModal>,
      );

      expect(
        screen.getByText("forms.hint.invoiceAmountZero", { exact: false }),
      ).toBeInTheDocument();
    });
  });
});
