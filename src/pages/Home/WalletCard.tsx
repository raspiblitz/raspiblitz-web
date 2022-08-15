import {
  BitcoinCircleIcon,
  ShareIcon,
} from "@bitcoin-design/bitcoin-icons-react/filled";
import {
  DownloadIcon,
  LightningBoltIcon,
  LinkIcon,
} from "@heroicons/react/outline";
import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext, Unit } from "../../context/app-context";
import { SSEContext } from "../../context/sse-context";
import {
  convertMSatToBtc,
  convertSatToBtc,
  convertToString,
} from "../../util/format";

type Props = {
  onReceive: () => void;
  onSend: () => void;
  onOpenChannel: () => void;
  onCloseChannel: () => void;
};

export const WalletCard: FC<Props> = ({
  onReceive,
  onSend,
  onOpenChannel,
  onCloseChannel,
}) => {
  const { t } = useTranslation();
  const { unit } = useContext(AppContext);
  const { balance } = useContext(SSEContext);

  const {
    onchain_total_balance: onchainBalance,
    onchain_unconfirmed_balance: onChainUnconfirmed,
    channel_local_balance: lnBalance,
  } = balance;

  let convertedOnchainBalance = null;
  let convertedOnchainBalanceUnconfirmed = null;
  let convertedLnBalance = null;
  let totalBalance = null;
  let unconfirmedSign = "";

  if (onchainBalance !== null && lnBalance !== null) {
    convertedOnchainBalance =
      unit === Unit.BTC ? convertSatToBtc(onchainBalance) : onchainBalance;

    if (onChainUnconfirmed) {
      convertedOnchainBalanceUnconfirmed =
        unit === Unit.BTC
          ? convertSatToBtc(onChainUnconfirmed)
          : onChainUnconfirmed;
      unconfirmedSign = onChainUnconfirmed > 0 ? "+" : "";
    }

    if (lnBalance !== null) {
      convertedLnBalance =
        unit === Unit.BTC ? convertMSatToBtc(lnBalance) : lnBalance / 1000;
    }

    if (convertedOnchainBalance !== null && convertedLnBalance !== null) {
      totalBalance =
        unit === Unit.BTC
          ? +(convertedOnchainBalance + convertedLnBalance).toFixed(8)
          : convertedOnchainBalance + convertedLnBalance;
    }
  }

  return (
    <div className="h-full p-5">
      <div className="bd-card h-full transition-colors">
        <section className="flex flex-col flex-wrap p-5 text-black lg:flex-row">
          <div className="relative w-full overflow-hidden rounded-xl bg-yellow-600 bg-gradient-to-b from-yellow-500 p-4 text-white">
            <article className="flex w-full flex-col">
              <h6 className="text-xl">{t("wallet.balance")}</h6>
              <p className="text-2xl font-bold">
                {convertToString(unit, totalBalance)} {unit}
              </p>
            </article>
            <article className="flex w-full flex-col">
              <h6>
                <LinkIcon className="mr-1 inline h-5 w-5 rotate-45 transform align-bottom" />
                <span className="inline align-bottom text-sm">
                  {t("wallet.on_chain")}
                </span>
              </h6>
              <p className="break-before-auto break-words text-lg font-bold">
                <span>
                  {convertToString(unit, convertedOnchainBalance)} {unit}&nbsp;
                </span>
                <span className="block md:inline-block">
                  {onChainUnconfirmed !== 0 &&
                    `(${unconfirmedSign}${convertToString(
                      unit,
                      convertedOnchainBalanceUnconfirmed
                    )})`}
                </span>
              </p>
            </article>
            <article className="flex w-full flex-col">
              <h6>
                <LightningBoltIcon className="mr-1 inline h-5 w-5 align-bottom" />
                <span className="inline align-bottom text-sm">
                  {t("home.lightning")}
                </span>
              </h6>
              <p className="text-lg font-bold">
                {convertToString(unit, convertedLnBalance)} {unit}
              </p>
            </article>
            <BitcoinCircleIcon className="absolute -bottom-9 -right-9 h-32 w-32 opacity-30" />
          </div>
        </section>
        <section className="flex justify-around p-2">
          <button
            onClick={onReceive}
            className="flex h-10 w-5/12 items-center justify-center rounded bg-black text-white hover:bg-gray-700"
          >
            <DownloadIcon className="mr-1 h-6 w-6" />
            <span>{t("wallet.receive")}</span>
          </button>
          <button
            onClick={onSend}
            className="flex h-10 w-5/12 items-center justify-center rounded bg-black text-white hover:bg-gray-700"
          >
            <ShareIcon className="mr-1 h-6 w-6" />
            <span>{t("wallet.send")}</span>
          </button>
        </section>
        <section className="flex justify-around p-2">
          <button
            onClick={onOpenChannel}
            className="flex h-10 w-5/12 items-center justify-center rounded bg-black text-white hover:bg-gray-700"
          >
            {t("home.open_channel")}
          </button>
          <button
            onClick={onCloseChannel}
            className="flex h-10 w-5/12 items-center justify-center rounded bg-black text-white hover:bg-gray-700"
          >
            {t("home.list_open_channels")}
          </button>
        </section>
      </div>
    </div>
  );
};

export default WalletCard;
