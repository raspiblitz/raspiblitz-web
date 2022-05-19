import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import btcLogo from "../../../assets/bitcoin-circle-white.svg";
import { ReactComponent as ChainIcon } from "../../../assets/chain.svg";
import { ReactComponent as LightningIcon } from "../../../assets/lightning.svg";
import { ReactComponent as ReceiveIcon } from "../../../assets/receive.svg";
import { ReactComponent as SendIcon } from "../../../assets/send.svg";
import { AppContext, Unit } from "../../../store/app-context";
import {
  convertMSatToBtc,
  convertSatToBtc,
  convertToString,
} from "../../../util/format";

type Props = {
  onchainBalance: number | null;
  onChainUnconfirmed: number | null;
  lnBalance: number | null;
  onReceive: () => void;
  onSend: () => void;
};

export const WalletCard: FC<Props> = ({
  onchainBalance,
  onChainUnconfirmed,
  lnBalance,
  onReceive,
  onSend,
}) => {
  const { t } = useTranslation();
  const { unit } = useContext(AppContext);
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

    if (lnBalance) {
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
                <ChainIcon className="mr-1 inline h-5 w-5 align-bottom" />
                <span className="inline align-bottom text-sm">
                  {t("wallet.on_chain")}
                </span>
              </h6>
              <p className="break-before-auto break-words text-lg font-bold">
                <span>
                  {convertToString(unit, convertedOnchainBalance)} {unit}
                </span>
                <span className="block md:inline-block">
                  {onChainUnconfirmed !== 0 &&
                    ` (${unconfirmedSign} ${convertToString(
                      unit,
                      convertedOnchainBalanceUnconfirmed
                    )})`}
                </span>
              </p>
            </article>
            <article className="flex w-full flex-col">
              <h6>
                <LightningIcon className="mr-1 inline h-5 w-5 align-bottom" />
                <span className="inline align-bottom text-sm">
                  {t("home.lightning")}
                </span>
              </h6>
              <p className="text-lg font-bold">
                {convertToString(unit, convertedLnBalance)} {unit}
              </p>
            </article>
            <img
              src={btcLogo}
              className="absolute -bottom-9 -right-9 h-32 w-32 opacity-30"
              alt="Bitcoin Logo"
            />
          </div>
        </section>
        <section className="flex justify-around p-2">
          <button
            onClick={onReceive}
            className="flex h-10 w-5/12 items-center justify-center rounded bg-black p-3 text-white hover:bg-gray-700"
          >
            <ReceiveIcon className="h-6 w-6" />
            <span>&nbsp;{t("wallet.receive")}</span>
          </button>
          <button
            onClick={onSend}
            className="flex h-10 w-5/12 items-center justify-center rounded bg-black p-3 text-white hover:bg-gray-700"
          >
            <SendIcon className="h-6 w-6" />
            <span>&nbsp;{t("wallet.send")}</span>
          </button>
        </section>
      </div>
    </div>
  );
};

export default WalletCard;
