import { render, screen } from "test-utils";
import { Unit } from "@/context/app-context";
import i18n from "@/i18n/test_config";
import en from "@/i18n/langs/en.json";
import type { WalletBalance } from "@/models/wallet-balance";
import WalletCard from "../WalletCard";

beforeAll(() => {
  i18n.addResourceBundle("en", "translation", en.translation);
});

const balance: WalletBalance = {
  onchain_total_balance: 60_000,
  onchain_confirmed_balance: 50_000,
  onchain_unconfirmed_balance: 10_000,
  channel_local_balance: 40_000_000,
  channel_remote_balance: 900_000_000,
  channel_pending_open_local_balance: 20_000_000,
  channel_pending_open_remote_balance: 30_000_000,
  channel_unsettled_local_balance: 10_000_000,
  channel_unsettled_remote_balance: 10_000_000,
};

function renderWallet(overrides: Partial<WalletBalance> = {}, unit = Unit.SAT) {
  return render(
    <WalletCard
      onReceive={vi.fn()}
      onSend={vi.fn()}
      onOpenChannel={vi.fn()}
      onCloseChannel={vi.fn()}
    />,
    {
      providerOptions: {
        appProps: { unit },
        realtimeProps: { balance: { ...balance, ...overrides } },
      },
    },
  );
}

describe("WalletCard balance distribution", () => {
  it.each([Unit.SAT, Unit.BTC])("shows the 60/40 distribution in %s", (unit) => {
    renderWallet({}, unit);
    expect(screen.getByText("60% on-chain / 40% Lightning")).toBeInTheDocument();
    expect(
      screen.getByText(unit === Unit.SAT ? "100,000 SAT" : "0.00100000 BTC"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(unit === Unit.SAT ? "40,000 SAT" : "0.00040000 BTC"),
    ).toBeInTheDocument();
    expect(screen.getByText(unit === Unit.SAT ? "(+10,000)" : "(+0.00010000)")).toBeInTheDocument();
  });

  it.each([
    [0, 40_000_000, "0% on-chain / 100% Lightning"],
    [60_000, 0, "100% on-chain / 0% Lightning"],
    [1, 2_000, "33% on-chain / 67% Lightning"],
    [1, 1, "100% on-chain / 0% Lightning"],
  ])("handles one-sided and rounded balances (%s, %s)", (onchain, lightning, expected) => {
    renderWallet({ onchain_total_balance: onchain, channel_local_balance: lightning });
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it.each([
    [0, 0],
    [null, null],
    [null, 40_000_000],
    [60_000, null],
    [Number.NaN, 40_000_000],
    [60_000, Number.POSITIVE_INFINITY],
    [-1, 40_000_000],
    [60_000, -1],
    [Number.MAX_VALUE, 40_000_000],
  ])("omits undefined distributions (%s, %s)", (onchain, lightning) => {
    const { container } = renderWallet({
      onchain_total_balance: onchain,
      channel_local_balance: lightning,
    });
    expect(container.textContent).not.toContain("%");
  });

  it("preserves loading placeholders", () => {
    renderWallet({
      onchain_total_balance: null,
      channel_local_balance: null,
      onchain_unconfirmed_balance: null,
    });
    expect(screen.getAllByText("- SAT")).toHaveLength(3);
  });

  it("handles a missing initial snapshot", () => {
    const { container } = render(
      <WalletCard
        onReceive={vi.fn()}
        onSend={vi.fn()}
        onOpenChannel={vi.fn()}
        onCloseChannel={vi.fn()}
      />,
    );
    expect(screen.getAllByText("- SAT")).toHaveLength(3);
    expect(container.textContent).not.toContain("%");
  });
});
