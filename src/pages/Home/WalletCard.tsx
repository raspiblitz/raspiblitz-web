import {
  BitcoinCircleIcon,
  LightningIcon,
  ShareIcon,
} from "@bitcoin-design/bitcoin-icons-react/filled";
import { ArrowDownTrayIcon, BoltIcon, LinkIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { type FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { Headline } from "@/components/Headline";
import { AppContext, Unit } from "@/context/app-context";
import { RealtimeContext } from "@/context/realtime-context";
import { convertMSatToBtc, convertSatToBtc, convertToString } from "@/utils/format";

type Props = {
  onReceive: () => void;
  onSend: () => void;
  onOpenChannel: () => void;
  onCloseChannel: () => void;
};

export const WalletCard: FC<Props> = ({ onReceive, onSend, onOpenChannel, onCloseChannel }) => {
  const { t } = useTranslation();
  const { unit } = useContext(AppContext);
  const { balance } = useContext(RealtimeContext);

  const {
    onchain_total_balance: onchainBalance,
    onchain_unconfirmed_balance: onChainUnconfirmed,
    channel_local_balance: lnBalance,
  } = balance;

  // Compare source balances in sats, independently of the selected display unit.
  // Only local channel funds belong to this wallet; remote/pending balances are excluded.
  const lightningSats = typeof lnBalance === "number" ? lnBalance / 1000 : 0;
  const totalSats = typeof onchainBalance === "number" ? onchainBalance + lightningSats : 0;
  const hasDistribution =
    typeof onchainBalance === "number" &&
    typeof lnBalance === "number" &&
    Number.isFinite(onchainBalance) &&
    Number.isFinite(lnBalance) &&
    onchainBalance >= 0 &&
    lnBalance >= 0 &&
    onchainBalance <= Number.MAX_SAFE_INTEGER &&
    lnBalance <= Number.MAX_SAFE_INTEGER &&
    totalSats > 0;
  const onchainPercent = hasDistribution ? Math.round((onchainBalance / totalSats) * 100) : null;

  let convertedOnchainBalance = null;
  let convertedOnchainBalanceUnconfirmed = null;
  let convertedLnBalance = null;
  let totalBalance = null;
  let unconfirmedSign = "";

  if (onchainBalance != null && lnBalance != null) {
    convertedOnchainBalance = unit === Unit.BTC ? convertSatToBtc(onchainBalance) : onchainBalance;

    if (onChainUnconfirmed) {
      convertedOnchainBalanceUnconfirmed =
        unit === Unit.BTC ? convertSatToBtc(onChainUnconfirmed) : onChainUnconfirmed;
      unconfirmedSign = onChainUnconfirmed > 0 ? "+" : "";
    }

    if (lnBalance !== null) {
      convertedLnBalance = unit === Unit.BTC ? convertMSatToBtc(lnBalance) : lnBalance / 1000;
    }

    if (convertedOnchainBalance !== null && convertedLnBalance !== null) {
      totalBalance =
        unit === Unit.BTC
          ? +(convertedOnchainBalance + convertedLnBalance).toFixed(8)
          : convertedOnchainBalance + convertedLnBalance;
    }
  }

  return (
    <div className="h-full">
      <div className="bd-card h-full transition-colors">
        <section className="flex flex-col flex-wrap p-2 text-black lg:flex-row">
          <div className="relative w-full overflow-hidden rounded-xl bg-yellow-600 bg-linear-to-b from-yellow-500 p-4 text-white">
            <article className="flex w-full flex-col">
              <Headline as="h6" align="left">
                {t("wallet.balance")}
              </Headline>
              <p className="text-2xl font-bold">
                {convertToString(unit, totalBalance)} {unit}
              </p>
              {onchainPercent !== null && (
                <p className="text-sm">
                  {t("wallet.balance_distribution", {
                    onchain: onchainPercent,
                    lightning: 100 - onchainPercent,
                  })}
                </p>
              )}
            </article>
            <article className="flex w-full flex-col">
              <Headline as="h5" align="left">
                <LinkIcon className="mr-1 inline h-5 w-5 rotate-45 transform align-bottom" />
                <span className="inline align-bottom text-sm">{t("wallet.on_chain")}</span>
              </Headline>
              <p className="break-before-auto break-words text-lg font-bold">
                <span>
                  {convertToString(unit, convertedOnchainBalance)} {unit}
                  &nbsp;
                </span>
                <span className="block md:inline-block">
                  {onChainUnconfirmed !== 0 &&
                    `(${unconfirmedSign}${convertToString(
                      unit,
                      convertedOnchainBalanceUnconfirmed,
                    )})`}
                </span>
              </p>
            </article>
            <article className="flex w-full flex-col">
              <Headline as="h5" align="left">
                <BoltIcon className="mr-1 inline h-5 w-5 align-bottom" />
                <span className="inline align-bottom text-sm">{t("home.lightning")}</span>
              </Headline>
              <p className="text-lg font-bold">
                {convertToString(unit, convertedLnBalance)} {unit}
              </p>
            </article>
            <BitcoinCircleIcon className="absolute -bottom-9 -right-9 h-32 w-32 opacity-30" />
          </div>
        </section>
        <section className="grid grid-cols-2 justify-around gap-4 p-2">
          <Button onPress={onReceive} className="grow border-gray-600" variant="outline">
            <span className="flex items-center gap-2">
              <ArrowDownTrayIcon className="h-6 w-6" />
              {t("wallet.receive")}
            </span>
          </Button>
          <Button onPress={onSend} className="grow border-gray-600" variant="outline">
            <span className="flex items-center gap-2">
              <ShareIcon className="h-6 w-6" />
              {t("wallet.send")}
            </span>
          </Button>
          <Button onPress={onOpenChannel} className="grow border-gray-600" variant="outline">
            <span className="flex items-center gap-2">
              <LightningIcon className="inline h-6 w-6" />
              {t("home.open_channel")}
            </span>
          </Button>
          <Button onPress={onCloseChannel} className="grow border-gray-600" variant="outline">
            <span className="flex items-center gap-2">
              <ListBulletIcon className="inline h-6 w-6" />
              {t("home.list_open_channels")}
            </span>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default WalletCard;
