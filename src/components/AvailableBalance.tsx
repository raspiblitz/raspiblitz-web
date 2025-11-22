import { type FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext, Unit } from "@/context/app-context";
import { convertSatToBtc, convertToString } from "@/utils/format";

type Props = {
  balance: number;
};

const AvailableBalance: FC<Props> = ({ balance }) => {
  const { unit } = useContext(AppContext);
  const { t } = useTranslation();

  const convertedBalance =
    unit === Unit.BTC
      ? convertToString(unit, convertSatToBtc(balance))
      : convertToString(unit, balance);

  return (
    <div className="rounded-xl  px-4 py-3">
      <p className="text-xs text-secondary">{t("wallet.available_balance")}</p>
      <p className="text-lg font-bold">
        {convertedBalance}{" "}
        <span className="text-sm font-normal text-secondary">{unit}</span>
      </p>
    </div>
  );
};

export default AvailableBalance;
